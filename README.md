# Predecessor CZ/SK – databáze hrdinů

Fanouškovská databáze hrdinů Predecessoru v češtině. Obsahuje všech 55 hrdinů (schopnosti, augmenty, staty po úrovních, příběh a flex lajny), 16 Eternalů, tři kvízy a porovnání hrdinů.

Data odpovídají patchi **1.17.2** (13. 10. 2026).

## Struktura

```
index.html            stránka
assets/css/style.css  vzhled
assets/js/app.js      logika (filtry, detail, kvízy, porovnání)
data/heroes.js        hrdinové
data/eternals.js      Eternalové
data/media.js         obrázky (ikony abilities, Eternalové, rendery hrdinů z wiki)
data/quiz.js          otázky kvízů
.github/workflows/static.yml   nasazení na GitHub Pages (beze změny)
```

Nepotřebuje žádný build ani knihovny – GitHub Pages ji servíruje tak, jak je.

## Jak upravit data

- **Staty hrdiny**: v `data/heroes.js` najdi `id: 'jmeno'` a uprav `stats: S(...)`. Pořadí čísel je popsané v hlavičce souboru.
- **Schopnost**: řádek `['Q', 'Název', 'cooldown', 'cena', 'popis']`.
- **Flex lajna**: do `flex: [...]` přidej `{ r: 'Offlane', src: 'odkud to víme' }`.
- **Nový hrdina**: zkopíruj celý blok jiného hrdiny, změň `id`, `n` a ostatní hodnoty a přidej `isNew: true, patch: '1.18'`.

Odkazy přímo na hrdinu nebo Eternala: `…/#hero/scarlett`, `…/#eternal/knell`.

## Zdroje

- [predecessor.wiki.gg](https://predecessor.wiki.gg) – ikony, schopnosti a základní staty
- [Oficiální patch notes](https://www.predecessorgame.com/en-US/news/patch-notes) 1.15, 1.16, 1.16.4, 1.17 a 1.17.2 – změny statů, bannery, flex lajny

Nejsme spojeni s Omeda Studios.
