/* =========================================================================
   KVÍZY
   1) "Najdi svého hrdinu" – obecný kvíz (8 otázek)
   2) "Kvíz podle lajny" – nejdřív vybereš lajnu, pak 5 otázek jen pro ni
   3) "Poznáš hrdinu?" – znalostní kvíz, otázky se generují z databáze (app.js)

   Každá odpověď (v) přidává body do profilu hráče:
     lane: { Carry, Support, Midlane, Offlane, Jungle }
     cls:  { Fighter, Bruiser, Assassin, Mage, Tank, Warden, Catcher, Enchanter, Sharpshooter, Executioner, Marksman, Support }
     range: 'Melee' | 'Ranged'      diff: 1 | 2 | 3
     dim:  { basic, durability, ability, mobility }  (váha hodnocení hrdiny 1–10)
   ========================================================================= */
window.QUIZ = {
  general: [
    { q: 'Co tě na MOBA hrách baví nejvíc?', opts: [
      { t: 'Odpálit kombo a smazat někoho za dvě sekundy', v: { cls: { Mage: 2, Assassin: 2 }, dim: { ability: 2 } } },
      { t: 'Stát v první linii a nenechat nikoho projít', v: { cls: { Tank: 3, Warden: 2, Bruiser: 1 }, dim: { durability: 3 } } },
      { t: 'Postupně nafarmit a pak vyhrát hru útoky', v: { cls: { Sharpshooter: 2, Executioner: 2, Marksman: 2 }, dim: { basic: 3 } } },
      { t: 'Hrát pro tým – léčit, štítovat, zachraňovat', v: { cls: { Enchanter: 3, Catcher: 1, Support: 1 }, lane: { Support: 2 } } },
    ]},
    { q: 'Kde se v týmovém souboji cítíš nejlíp?', opts: [
      { t: 'Vepředu, jdu do nich jako první', v: { cls: { Tank: 2, Fighter: 1, Bruiser: 1 }, range: 'Melee', dim: { durability: 2 } } },
      { t: 'Ze strany – čekám a skočím na jejich carry', v: { cls: { Assassin: 3 }, dim: { mobility: 2 } } },
      { t: 'Vzadu, kde střílím do toho, kdo je nejblíž', v: { cls: { Sharpshooter: 2, Executioner: 2, Marksman: 1 }, range: 'Ranged' } },
      { t: 'Za frontou – kouzla z bezpečné vzdálenosti', v: { cls: { Mage: 3 }, range: 'Ranged', dim: { ability: 2 } } },
    ]},
    { q: 'Jak moc se chceš učit mechaniky?', opts: [
      { t: 'Chci něco jednoduchého, co hned funguje', v: { diff: 1 } },
      { t: 'Klidně se něco naučím, ale bez extrému', v: { diff: 2 } },
      { t: 'Dej mi výzvu – kombíčka, triky, vysoký strop', v: { diff: 3 } },
    ]},
    { q: 'Na blízko, nebo na dálku?', opts: [
      { t: 'Na blízko – chci cítit každý úder', v: { range: 'Melee' } },
      { t: 'Na dálku – raději mám přehled', v: { range: 'Ranged' } },
      { t: 'Je mi to jedno', v: {} },
    ]},
    { q: 'Co děláš, když lajna stojí a nic se neděje?', opts: [
      { t: 'Jdu gankovat jinou lajnu', v: { lane: { Jungle: 2, Midlane: 1 }, dim: { mobility: 2 } } },
      { t: 'Farmím a stavím si náskok ve zlatě', v: { lane: { Carry: 2, Offlane: 1 } } },
      { t: 'Wardím a hlídám mapu pro tým', v: { lane: { Support: 3 } } },
      { t: 'Vyzvu soupeře na souboj 1v1', v: { lane: { Offlane: 3 }, cls: { Fighter: 1, Bruiser: 1 } } },
    ]},
    { q: 'Která role tě láká nejvíc?', opts: [
      { t: 'Jungle – pán mapy a objektivů', v: { lane: { Jungle: 3 } } },
      { t: 'Mid – střed mapy, rotace a burst', v: { lane: { Midlane: 3 } } },
      { t: 'Offlane – osamělý bojovník na dlouhé lajně', v: { lane: { Offlane: 3 } } },
      { t: 'Duo – Carry nebo Support ve dvojici', v: { lane: { Carry: 2, Support: 2 } } },
    ]},
    { q: 'Jaký moment ti udělá největší radost?', opts: [
      { t: 'Útěk s 10 HP přes zeď', v: { dim: { mobility: 3 } } },
      { t: 'Ultimátka, která chytí celý tým', v: { dim: { ability: 2 }, cls: { Tank: 1, Mage: 1, Catcher: 1 } } },
      { t: 'Pentakill v pozdní hře', v: { dim: { basic: 2 }, cls: { Sharpshooter: 1, Executioner: 1, Assassin: 1 } } },
      { t: 'Přežít, i když na mě šli tři', v: { dim: { durability: 3 } } },
    ]},
    { q: 'Jak chceš vyhrávat hry?', opts: [
      { t: 'Rozbiju je sám', v: { cls: { Assassin: 1, Fighter: 2, Bruiser: 1 } } },
      { t: 'Udělám z jednoho spoluhráče nesmrtelného', v: { cls: { Enchanter: 2, Warden: 1 }, lane: { Support: 1 } } },
      { t: 'Kontrolou prostoru a zónami', v: { cls: { Mage: 2, Tank: 1, Catcher: 1 } } },
      { t: 'Postupným tlakem a objektivy', v: { cls: { Executioner: 1, Sharpshooter: 1, Fighter: 1 }, lane: { Jungle: 1, Carry: 1 } } },
    ]},
  ],

  lanes: {
    Carry: [
      { q: 'Jaký typ carry chceš hrát?', opts: [
        { t: 'Klasického střelce, co stojí a pálí', v: { cls: { Sharpshooter: 3 }, dim: { basic: 2 } } },
        { t: 'Executionera, co kombinuje útoky a schopnosti', v: { cls: { Executioner: 3 }, dim: { ability: 1 } } },
        { t: 'Něco neobvyklého (přepínání postojů, triky)', v: { cls: { Marksman: 3 }, diff: 3 } },
      ]},
      { q: 'Jak řešíš, když na tebe skočí assassin?', opts: [
        { t: 'Uskočím a střílím dál', v: { dim: { mobility: 3 } } },
        { t: 'Nechám support, ať mě zachrání', v: { dim: { basic: 1 }, diff: 1 } },
        { t: 'Mám vlastní CC a potrestám ho', v: { dim: { ability: 2 } } },
      ]},
      { q: 'Kdy chceš být nejsilnější?', opts: [
        { t: 'Hned od začátku – agresivní lajna', v: { dim: { ability: 2 } } },
        { t: 'Až nafarmím pár itemů', v: { dim: { basic: 3 } } },
      ]},
      { q: 'Obtížnost?', opts: [
        { t: 'Jednoduchý, ať se soustředím na pozici', v: { diff: 1 } },
        { t: 'Střední', v: { diff: 2 } },
        { t: 'Těžký, chci se zlepšovat', v: { diff: 3 } },
      ]},
      { q: 'Dlouhý dosah, nebo silné výpady?', opts: [
        { t: 'Poke z obrovské dálky', v: { dim: { ability: 2 } } },
        { t: 'Rychlé dashe a repozice', v: { dim: { mobility: 2 } } },
      ]},
    ],
    Support: [
      { q: 'Jakým supportem chceš být?', opts: [
        { t: 'Léčitel, který drží carry naživu', v: { cls: { Enchanter: 3 } } },
        { t: 'Lovec, který chytá a zahajuje souboje', v: { cls: { Catcher: 3, Warden: 1 } } },
        { t: 'Tank, který dostává rány za ostatní', v: { cls: { Warden: 2, Tank: 2 }, dim: { durability: 2 } } },
        { t: 'Mág, který dává poškození z druhé linie', v: { cls: { Mage: 3 }, dim: { ability: 2 } } },
      ]},
      { q: 'Na blízko, nebo na dálku?', opts: [
        { t: 'Na blízko, v centru dění', v: { range: 'Melee' } },
        { t: 'Na dálku', v: { range: 'Ranged' } },
      ]},
      { q: 'Co je tvá nejoblíbenější schopnost?', opts: [
        { t: 'Hák nebo stun, který chytí cíl', v: { cls: { Catcher: 2, Warden: 1 } } },
        { t: 'Štít nebo heal ve správnou chvíli', v: { cls: { Enchanter: 2 } } },
        { t: 'Ultimátka, která obrátí souboj', v: { dim: { ability: 2 } } },
      ]},
      { q: 'Obtížnost?', opts: [
        { t: 'Jednoduchý', v: { diff: 1 } },
        { t: 'Střední', v: { diff: 2 } },
        { t: 'Těžký', v: { diff: 3 } },
      ]},
      { q: 'Jak moc chceš roamovat po mapě?', opts: [
        { t: 'Hodně – chci pomáhat i midu a jungli', v: { dim: { mobility: 2 } } },
        { t: 'Raději zůstanu u carry', v: { dim: { durability: 1 } } },
      ]},
    ],
    Midlane: [
      { q: 'Jaký styl midu?', opts: [
        { t: 'Burst mág – trefím kombo a je po něm', v: { cls: { Mage: 3 }, dim: { ability: 2 } } },
        { t: 'Kontrolní mág – zóny, zpomalení, stuny', v: { cls: { Mage: 2, Enchanter: 1 } } },
        { t: 'Assassin, který roamuje a zabíjí', v: { cls: { Assassin: 3 }, range: 'Melee' } },
        { t: 'Něco jiného – fighter nebo střelec na midu', v: { cls: { Fighter: 2, Sharpshooter: 2 } } },
      ]},
      { q: 'Jak hraješ lajnu?', opts: [
        { t: 'Poke z dálky a tlak na věž', v: { range: 'Ranged', dim: { ability: 1 } } },
        { t: 'All-in, jakmile má soupeř méně HP', v: { dim: { mobility: 1, basic: 1 } } },
      ]},
      { q: 'Kam chodíš po lajně?', opts: [
        { t: 'Roam na boční lajny', v: { dim: { mobility: 3 } } },
        { t: 'Zůstávám a farmím', v: { dim: { ability: 1 } } },
      ]},
      { q: 'Obtížnost?', opts: [
        { t: 'Jednoduchý', v: { diff: 1 } },
        { t: 'Střední', v: { diff: 2 } },
        { t: 'Těžký', v: { diff: 3 } },
      ]},
      { q: 'Co chceš mít v ultimátce?', opts: [
        { t: 'Obrovské plošné poškození', v: { dim: { ability: 3 } } },
        { t: 'Utility pro tým nebo únik', v: { dim: { mobility: 1, durability: 1 } } },
      ]},
    ],
    Offlane: [
      { q: 'Jaký offlaner chceš být?', opts: [
        { t: 'Fighter, který vyhrává souboje 1v1', v: { cls: { Fighter: 3 }, dim: { basic: 1 } } },
        { t: 'Bruiser, co vydrží a dává', v: { cls: { Bruiser: 3 } } },
        { t: 'Tank, který zahajuje týmovky', v: { cls: { Tank: 3, Warden: 1 }, dim: { durability: 2 } } },
        { t: 'Netradiční pick na dálku', v: { range: 'Ranged', cls: { Mage: 1, Sharpshooter: 1, Enchanter: 1 } } },
      ]},
      { q: 'Lajna je dlouhá a osamělá. Jak ji hraješ?', opts: [
        { t: 'Trade za tradem, tlačím soupeře pod věž', v: { dim: { basic: 2 } } },
        { t: 'Přežiju ganky a farmím', v: { dim: { durability: 2 } } },
      ]},
      { q: 'Co děláš v týmovce?', opts: [
        { t: 'Skočím do zadní linie', v: { dim: { mobility: 2 } } },
        { t: 'Držím frontu a chráním své', v: { dim: { durability: 2 } } },
        { t: 'Hodím na ně všechno, co mám', v: { dim: { ability: 2 } } },
      ]},
      { q: 'Obtížnost?', opts: [
        { t: 'Jednoduchý', v: { diff: 1 } },
        { t: 'Střední', v: { diff: 2 } },
        { t: 'Těžký', v: { diff: 3 } },
      ]},
      { q: 'Splitpush, nebo teamfight?', opts: [
        { t: 'Splitpush – tlačím sám', v: { cls: { Fighter: 1 }, dim: { basic: 1 } } },
        { t: 'Teamfight – jdu s týmem', v: { cls: { Tank: 1 }, dim: { ability: 1 } } },
      ]},
    ],
    Jungle: [
      { q: 'Jaký jungler?', opts: [
        { t: 'Assassin – ganky a eliminace', v: { cls: { Assassin: 3 }, dim: { mobility: 1 } } },
        { t: 'Fighter – silný v soubojích a na objektivech', v: { cls: { Fighter: 3 } } },
        { t: 'Tank nebo bruiser – kontrola a odolnost', v: { cls: { Tank: 2, Bruiser: 2 }, dim: { durability: 2 } } },
      ]},
      { q: 'Jak gankuješ?', opts: [
        { t: 'Ze stealthu nebo shora', v: { dim: { mobility: 3 } } },
        { t: 'Silovým vpádem s CC', v: { dim: { ability: 2 } } },
      ]},
      { q: 'Invaze do nepřátelské džungle?', opts: [
        { t: 'Jasně, kradu jim buffy', v: { dim: { basic: 2 } } },
        { t: 'Raději svoji džungli a objektivy', v: { dim: { durability: 1 } } },
      ]},
      { q: 'Obtížnost?', opts: [
        { t: 'Jednoduchý', v: { diff: 1 } },
        { t: 'Střední', v: { diff: 2 } },
        { t: 'Těžký', v: { diff: 3 } },
      ]},
      { q: 'Co je pro tebe důležitější?', opts: [
        { t: 'Zabít carry v týmovce', v: { cls: { Assassin: 2 } } },
        { t: 'Přežít a zabrat Fangtooth nebo Primal', v: { dim: { durability: 2 } } },
      ]},
    ],
  },
};
