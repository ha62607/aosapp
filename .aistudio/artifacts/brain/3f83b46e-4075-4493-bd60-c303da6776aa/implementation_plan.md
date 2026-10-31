# Google Stitch & AOS Skin Studio — UI-suunnittelun toteutussuunnitelma

Kattava suunnitelma käyttöliittymäsuunnittelusta Googlen työkaluilla (erityisesti **Google Stitch** ja **Google AI Studio**) sekä uuden interaktiivisen **AOS Skin & UI Studio** -työkalun lisäämisestä olemassa olevaan sovellukseen.

> [!IMPORTANT]
> **Käyttäjän vahvistamat valinnat:**
> 1. **UI-suunnittelun tapa**: Suoraan interaktiivista käyttöliittymää koodina ja reaaliaikaisena esikatseluna AI Studiossa.
> 2. **Googlen suunnittelutyökalu**: Google Stitchin (tekoälypohjainen UI-luonnostelu) periaatteiden ja työnkulun hyödyntäminen.
> 3. **Kohde**: Nykyisen AOS-sovelluksen kehittäminen ja uusien toimialakohtaisten skinien suunnittelutyökalu.

---

## 1. Yleiskatsaus: Google Stitch vs. Google AI Studio

### Mikä on Google Stitch?
- **Google Stitch** on Googlen tekoälypohjainen UI-suunnittelutyökalu, jonka tavoitteena on nopeuttaa käyttöliittymien ideointia:
  - Käyttäjä kuvailee toivotun näkymän luonnollisella kielellä tai lataa referenssikuvan/luonnoksen.
  - Stitch tuottaa käyttöliittymäsommittelun, väriteemat ja komponenttirakenteen.
- **Roolijako (Build Briefin mukaisesti):**
  > *"Google Stitch can help design; it is not the product runtime."*
  - Stitch on **suunnittelu- ja ideointityökalu (Design-to-Prototype)**. Se ei toimi valmiina tuotantoympäristönä tai tietokantana.
  - **Google AI Studio** puolestaan on **toteutus- ja ajoympäristö**, jossa koodi (React + TypeScript + Tailwind) elää, suoritetaan, testataan ja yhdistetään oikeisiin API-rajapintoihin.

### Työnkulkumalli (The Optimal Workflow)
```
┌────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│     Google Stitch      │      │    Google AI Studio     │      │   AOS Custom Skins      │
│  (UI-ideointi, promptit│ ───> │  (Komponenttikoodaus,   │ ───> │ (Ajettava PWA, laitteet,│
│   ja visuaaliset luonn.)│      │   logiikka & testaus)   │      │  lupien & datan hallinta)│
└────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 2. Uusi toiminnallisuus: AOS Skin & UI Studio

Jotta voit suunnitella ja luoda uusia käyttöliittymäkokonaisuuksia suoraan sovelluksessa, toteutetaan AOS-sovellukseen **AOS Skin & UI Studio**:

### A. Mikä se on?
Visuaalinen ja tekoälyavusteinen kehitysnäkymä, jolla voit:
1. **Luoda uuden toimialaskinin promptilla** (esim. *"Luo skin LVI- ja kylmälaiteasentajalle"* tai *"Suunnittele isännöitsijän kiinteistökatselmustyökalu"*).
2. **Generoida deklaratiivinen `aos.skin.v0.1` -manifesti**: AOS AI -tulkitsija generoi tarvittavat näkymät, widgetit, väriteemat ja lupavaatimukset.
3. **Reaaliaikainen Sandbox-esikatselu**: Näet heti puhelimen ja tabletin kokoisessa esikatseluikkunassa, miltä uusi skin näyttää ja miten sen widgetit asettuvat.
4. **Yhden klikkauksen asennus**: Voit tallentaa ja ottaa uuden suunnittelemasi skinin heti käyttöön omalla tililläsi ja kaikilla N valtuutetulla laitteellasi.

### B. Käyttöliittymä ja komponenttirakenne
- **Studio-näkymä (`SkinStudioView.tsx`)**:
  - *Prompt-säveltäjä*: Syötä uuden kokemuksen toimiala ja käyttäjätarina.
  - *Visuaaliset säätimet*: Pääväri (Primary color), korostusväri (Accent), kuvake ja teema.
  - *Näkymä- ja widget-rakentaja*: Lisää ja järjestele mittariryhmiä, listoja, reittinäkymiä ja AI-säveltäjiä.
  - *JSON-manifestieditori*: Ammattilaisnäkymä, joka validoi skeeman reaaliaikaisesti ennen tallennusta.
  - *Live Preview*: Interaktiivinen esikatselu, jossa toimivat klikkaukset ja tilasiirtymät.

---

## 3. Toteutusvaiheet koodissa

1. **Palvelin- ja API-laajennus (`src/services/aosApi.ts`)**:
   - Lisätään `createCustomSkin(manifest: SkinManifest)` ja `generateSkinWithAI(prompt: string)`.
   - Varmistetaan manifestin turvallisuusvalidointi (ei suoritettavaa koodia, sallitut widget-tyypit).
2. **Skin Studio -komponentti (`src/components/SkinStudioView.tsx`)**:
   - Luo uusi visuaalinen suunnittelutyökalu.
   - Sisältää esiasetetut mallipohjat (esim. *LVI-huolto*, *Kiinteistönhoito*, *Myyntiedustaja*).
3. **Päänäkymän ja navigaation päivitys (`src/App.tsx`, `src/components/BottomNav.tsx`)**:
   - Lisätään pääsy Studioon suoraan Skin Libraryn tai yläpalkin kautta.
4. **Varmennus ja testit**:
   - Päivitetään testipatteristo (`src/tests/aos.test.ts`) kattamaan uuden skinin dynaaminen luonti ja validointi.
   - Käännös- ja tyyppitarkastus (`compile_applet`, `lint_applet`).
