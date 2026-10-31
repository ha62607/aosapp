/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Product v0.1 — Automated Verification & Boundary Test Suite
 */

process.env.AOS_TEST_MODE = 'true';

import { DEFAULT_SKINS } from '../data/defaultSkins';
import {
  interpretUserIntent,
  approveProposal,
  rejectProposal,
  getExperienceConfig,
  saveExperienceConfig,
  switchActiveDevice,
  getDevices,
} from '../services/aosApi';

async function runTestSuite() {
  console.log('--- Aloitetaan AOS Product v0.1 -testit ---');
  let passed = 0;
  let total = 0;

  function assert(condition: boolean, msg: string) {
    total++;
    if (!condition) {
      console.error(`❌ FAIL: ${msg}`);
      throw new Error(`Test failed: ${msg}`);
    }
    console.log(`✅ PASS: ${msg}`);
    passed++;
  }

  // Test 1: Declarative Skin Manifest Schema Validation
  for (const skin of DEFAULT_SKINS) {
    assert(skin.schema_version === 'aos.skin.v0.1', `${skin.skin_id} noudattaa aos.skin.v0.1 -skeemaa`);
    assert(Array.isArray(skin.required_capabilities), `${skin.skin_id} määrittelee tarvittavat kyvykkyydet`);
    assert(skin.views.length >= 2, `${skin.skin_id} sisältää vähintään 2-3 näkymää`);

    // Ensure all widgets belong to allowlisted component types
    const allowedTypes = [
      'metric-group',
      'record-list',
      'intent-composer',
      'activity-list',
      'route-display',
      'notes-board',
    ];
    for (const widget of skin.widgets) {
      assert(
        allowedTypes.includes(widget.component_type),
        `Widget ${widget.id} käyttää sallittua tyyppiä: ${widget.component_type}`
      );
    }
  }

  // Test 2: Intent -> Proposal -> Reject (Zero Mutation Guarantee)
  const proposal1 = await interpretUserIntent('Prepare a plan for tomorrow\'s three service visits', 'field-service-demo');
  assert(proposal1.requires_human_approval === true, 'Ehdotus vaatii aina ihmisen hyväksynnän');
  assert(proposal1.status === 'draft', 'Ehdotus luodaan luonnostilassa (draft)');
  assert(proposal1.proposed_steps.length > 0, 'Ehdotus sisältää jäsennellyt vaiheet');

  const rejectRes = await rejectProposal(proposal1.id);
  assert(rejectRes.proposal.status === 'rejected', 'Hylkäys lukitsee tilan tilaan "rejected"');
  assert(Boolean(rejectRes.proposal.evidence?.includes('Nolla mutaatiota')), 'Evidenssi vahvistaa nollamutaation');

  // Test 3: Intent -> Edit Steps -> Approve (plan_only Execution)
  const proposal2 = await interpretUserIntent('Optimoi reitti Keimolanportin kautta', 'driver-demo');
  const editedSteps = [...proposal2.proposed_steps];
  editedSteps[0].title = 'Mukautettu vaihe: Tarkista Kehä I';
  const approveRes = await approveProposal(proposal2.id, editedSteps);
  assert(approveRes.proposal.status === 'approved', 'Hyväksyntä siirtää tilan tilaan "approved"');
  assert(Boolean(approveRes.evidence?.includes('completed')), 'Kanoninen mcp-tehtävätila on "completed"');

  // Test 4: Experience Customization & Versioning
  const config = await getExperienceConfig('field-service-demo');
  const initialVersion = config.version;
  const updatedConfig = await saveExperienceConfig({
    ...config,
    display_name: 'Customized Field Service',
  });
  assert(updatedConfig.version === initialVersion + 1, 'Kokoonpanon versio inkrementoituu tallennuksessa');
  assert(updatedConfig.display_name === 'Customized Field Service', 'Mukautettu nimi tallentuu');

  // Test 5: Multi-Device Synchronization on Single Account
  const initialDevices = await getDevices();
  assert(initialDevices.length >= 3, 'Tilillä on vähintään 3 valtuutettua laitetta');
  const tablet = initialDevices.find((d) => d.type === 'tablet');
  assert(!!tablet, 'Tabletti löytyy valtuutetuista laitteista');
  await switchActiveDevice(tablet!.id);
  const afterSwitch = await getDevices();
  const current = afterSwitch.find((d) => d.id === tablet!.id);
  assert(current?.is_current === true, 'Aktiivisen laitteen konteksti vaihtuu onnistuneesti');

  // Test 6: Skin Studio Creation & AI Generation
  const { generateSkinWithAI, createCustomSkin } = await import('../services/aosApi');
  const aiGeneratedSkin = await generateSkinWithAI('LVI- ja kylmälaiteasennus');
  assert(aiGeneratedSkin.schema_version === 'aos.skin.v0.1', 'AI-luotu skin noudattaa aos.skin.v0.1 -skeemaa');
  assert(aiGeneratedSkin.display_name.includes('LVI'), 'AI tunnistaa LVI-toimialan');
  
  const created = await createCustomSkin(aiGeneratedSkin);
  assert(created.installed === true, 'Uusi skin asentuu tilille');

  console.log(`\n🎉 Kaikki ${passed}/${total} testiä läpäisty onnistuneesti!`);
}

runTestSuite().catch((err) => {
  console.error(err);
  process.exit(1);
});
