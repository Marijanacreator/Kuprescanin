# Kuprešanin — website

Statički sajt sa Hero, Usluge i O nama sekcijama. HTML, CSS i JavaScript su ponovo odvojeni. Sve poslednje izmene su uključene, uključujući Hero pozadinu #1D3B42, preklapanje About fotografija i blok identiteta firme.

## Lokalno pokretanje

Potreban je Node.js 18 ili noviji. U folderu projekta pokrenite:

    npm start

Otvorite http://127.0.0.1:4173/. Instalacija npm paketa nije potrebna. Koristite lokalni server umesto direktnog otvaranja HTML fajla jer JavaScript koristi module.

## Struktura

- index.html — sadržaj i struktura stranice
- styles.css — Hero, navbar i zajednički stilovi
- main.js — inicijalizacija i zajedničke interakcije
- services.js — fotografije za Hero
- animation.js — mirna automatska rotacija Hero fotografija
- service-showcase.css / service-showcase.js — paneli Usluga, sadržaj i mapiranje fotografija
- about-section.css / about-section.js — About kompozicija i jednokratna ulazna animacija
- mobile.css — mobilna kompozicija do 800px, bez izmene desktop stilova
- assets/ — originalne fotografije i logo
- gsap.min.js — lokalni GSAP runtime sa sačuvanim licencnim zaglavljem
- server.cjs — lokalni pregled sajta

Animacije poštuju prefers-reduced-motion. `mobile.css` sadrži dorade za širine do 800px: Hero do 430px koristi kompaktnu visinu zasnovanu na sadržaju, 64px prostora ispod CTA grupe i posebnu SVG krivu koja štiti tekst; širi mobilni/tablet prikaz zadržava minimalnih 680px; fotografije ostaju u zakrivljenoj maski sa zasebnim mobilnim focal point vrednostima u `services.js`. Usluge koriste nativni horizontalni scroll/snap sa svim sadržajima i linkovima dostupnim. About fotografije zadržavaju preklapanje, a informacije se prikazuju u jednoj koloni. Desktop kompozicija i interakcije ostaju nepromenjene.

Lokalni `verify-mobile.cjs` proverava šest mobilnih dimenzija, geometriju, dostupnost linkova i responsive ponašanje. Testovi koriste Playwright/Edge runtime ovog računara i nisu potrebni za objavljivanje sajta.

## GitHub i GitHub Pages

Raspakujte arhivu i dodajte sadržaj foldera service-hero u koren GitHub repozitorijuma. Za GitHub Pages izaberite Settings → Pages → Deploy from a branch, željenu granu i / (root). Nije potreban build korak. Putanje do resursa su relativne i rade i kada se sajt objavljuje u podfolderu repozitorijuma.

Kontakt linkovi trenutno koriste hello@example.com i treba ih zameniti stvarnim kontaktom pre javnog objavljivanja.

