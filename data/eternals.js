/* =========================================================================
   ETERNALS – 16 Eternalů v 6 skupinách (stav: patch 1.17.2)
   Zdroje: predecessor.wiki.gg/wiki/Eternals, patch notes 1.16, 1.16.4, 1.17.2
   minor1 = první řada vedlejších požehnání, minor2 = druhá řada.
   synergy = hrdinové, na kterých Eternal typicky sedí (doporučení, ne pravidlo).
   ========================================================================= */
window.ETERNAL_GROUPS = {
  "Harbingers": {
    "cz": "Zvěstovatelé",
    "desc": "Pro hrdiny, kteří vyhrávají dlouhými výměnami základních útoků – carry a on-hit buildy."
  },
  "Primarchs": {
    "cz": "Prvotní",
    "desc": "Síla a dobývání – mix odolnosti a poškození pro hrdiny, kteří se vrhají do boje jako první."
  },
  "Dreadnoughts": {
    "cz": "Neohrožení",
    "desc": "Vytrvalost – pro tanky a bruisery, kteří chtějí přežít a rozbít nepřátelskou formaci."
  },
  "Sovereigns": {
    "cz": "Vládci",
    "desc": "Chaos a řád – pro hrdiny, jejichž poškození stojí na schopnostech a burstu."
  },
  "Divines": {
    "cz": "Božští",
    "desc": "Ochrana – pro supporty a hrdiny stavící na léčení, štítech a utility."
  },
  "Anomalies": {
    "cz": "Anomálie",
    "desc": "Ohýbání reality – nekonvenční efekty (itemy, zlato, risk/reward), které sedí specialistům."
  }
};
window.ETERNALS = [
  {
    "id": "vermis",
    "n": "Vermis",
    "group": "Harbingers",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Vermis_9e7d50c869.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Vermis.png",
    "major": "Každý 3. po sobě jdoucí základní útok na stejného nepřátelského hrdinu (do 2,5 s) udělí bonusové fyzické poškození rovné 3 % (+0,25 %/level) jeho max. zdraví.",
    "minor1": [
      {
        "n": "Serration",
        "d": "Major Blessing je o 65 % efektivnější na základní útoky, které kriticky zasáhnou."
      },
      {
        "n": "Crush",
        "d": "Když zneschopníš nepřátelského hrdinu, udělíš bonusové poškození rovné 5 % jeho max. zdraví."
      },
      {
        "n": "Cauterize",
        "d": "Když ti DoT efekt udělí poškození, získáš regeneraci zdraví na 1 s."
      }
    ],
    "minor2": [
      {
        "n": "Melting Point",
        "d": "Udělíš 10 % bonusové poškození cílům s více než 125 fyzickým brněním."
      },
      {
        "n": "Breach",
        "d": "Poškození ultimátem snižuje fyzické brnění nepřítele o 30 % na 3 s."
      },
      {
        "n": "Sub-Surface",
        "d": "Dostáváš o 10 % méně poškození z AoE schopností."
      }
    ],
    "synergy": [
      "Eden",
      "Kira",
      "Skylar",
      "Murdock",
      "Wraith",
      "Drongo",
      "GRIM.exe"
    ]
  },
  {
    "id": "marrow",
    "n": "Marrow",
    "group": "Harbingers",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Marrow_6e528df91a.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Marrow.png",
    "major": "Získáváš 0,5 % (+0,05 %/level) Omnivamp za každých 5 % chybějícího zdraví. Bonus se po zabití nepřátelského hrdiny na 8 s zdvojnásobí.",
    "minor1": [
      {
        "n": "The Maw",
        "d": "Kritické zásahy udělí navíc 20 % bonusového true damage cílům pod 25 % zdraví."
      },
      {
        "n": "Blood Bank",
        "d": "Poškození hrdinům generuje náboje na 3 s; za každých 100 nábojů získáváš 1 % lifestealu."
      },
      {
        "n": "Taste of Iron",
        "d": "DoT poškození nepřátelského hrdiny zvýší tvé poškození o 6 % na 3 s."
      }
    ],
    "minor2": [
      {
        "n": "Roses",
        "d": "Za zabití získáš 20 bonusového zlata za každý předchozí kill v zápase."
      },
      {
        "n": "Jealousy",
        "d": "Udělíš 10 % bonusové poškození hrdinům, kteří mají více zdraví než ty."
      },
      {
        "n": "Leech",
        "d": "Nepřátelé v okolí 400u mají sníženou regeneraci zdraví o 100 % — ty ji získáváš místo nich."
      }
    ],
    "synergy": [
      "Yurei",
      "Revenant",
      "Khaimera",
      "Boris",
      "Sparrow",
      "Morigesh"
    ]
  },
  {
    "id": "weald",
    "n": "Weald",
    "group": "Harbingers",
    "isNew": true,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Eternals_Weald_e34b7fa6ca.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Weald.png",
    "major": "Když zasáhneš nepřátelského hrdinu pod 30 % zdraví, vystřelíš salvu samonaváděcích střel s true poškozením (4 střely + 1 za každých 30 % bonusové rychlosti útoku). Střely prolétají zdmi. Cooldown 10 s na každého hrdinu.",
    "minor1": [
      {
        "n": "Forage",
        "d": "Zabití minionů a monster ti dává 3 zlata a zkušenosti navíc."
      },
      {
        "n": "Dryad's Boon",
        "d": "Základní útoky zkracují cooldowny schopností o 0,15 s."
      },
      {
        "n": "Natural Resistance",
        "d": "Pod 25 % zdraví se očistíš od CC a získáš tenacity."
      }
    ],
    "minor2": [
      {
        "n": "Wind-Rider",
        "d": "Po použití mobility nebo opuštění neviditelnosti získáš 20 % (+1 %/úr.) bonusové rychlosti útoku."
      },
      {
        "n": "Barkskin",
        "d": "Nepřátelští hrdinové, kteří tě basic attackují, dostanou poškození zpět."
      },
      {
        "n": "Taproot",
        "d": "Základní útoky tě léčí (on-hit, škáluje s 6 % bonus. fyz. síly)."
      }
    ],
    "synergy": [
      "Sparrow",
      "Kira",
      "Murdock",
      "Drongo",
      "Yin",
      "TwinBlast"
    ]
  },
  {
    "id": "thraex",
    "n": "Thraex",
    "group": "Primarchs",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Thraex_18f4d29e14.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Thraex.png",
    "major": "Označ posledního nepřátelského hrdinu zasaženého základním útokem na 3 s — zvyšuje tvé poškození proti němu a snižuje jeho poškození proti tobě.",
    "minor1": [
      {
        "n": "Alpha's Court",
        "d": "Udělíš 6 % bonusové poškození, když není žádný spojenec do 800u."
      },
      {
        "n": "Savage Strikes",
        "d": "On-hit fyzické poškození, které roste při útoku na hrdiny (stack 3×) a léčí tě podle udělené škody."
      },
      {
        "n": "The King",
        "d": "Základní útoky na hrdiny ti přinesou 7 zlata."
      }
    ],
    "minor2": [
      {
        "n": "Ferocity",
        "d": "Získáváš Attack Speed za každou sekundu strávenou v boji s hrdinou, neomezeně stackuje."
      },
      {
        "n": "Rallying Roar",
        "d": "Ultimátem uděluješ sobě a spojencům pohybovou rychlost na 4 s."
      },
      {
        "n": "Golden Mane",
        "d": "Dostáváš o 12 % méně poškození z neplošných schopností."
      }
    ],
    "synergy": [
      "Steel",
      "Khaimera",
      "Greystone",
      "Grux",
      "Zarus",
      "Zinx"
    ]
  },
  {
    "id": "nihil",
    "n": "Nihil",
    "group": "Primarchs",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_nihil_184c138d3e.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Nihil.png",
    "major": "Poškození hrdiny ti udělí Doom na 3 s — postupně rostoucí síla (Physical/Magical Power, brnění), která se permanentně zvyšuje při levelování nebo zabití.",
    "minor1": [
      {
        "n": "Growing Threat",
        "d": "Od 16. minuty permanentně získáváš +15 % bonusové poškození."
      },
      {
        "n": "From the Abyss",
        "d": "Regeneruješ zdraví za sekundu, když jsi v boji nebo mimo viditelnost nepřátel."
      },
      {
        "n": "Mana Siphon",
        "d": "Zásah schopností odčerpá manu nepřátelskému hrdinovi."
      }
    ],
    "minor2": [
      {
        "n": "Adaptive Plating",
        "d": "Fyzické poškození ti dává fyzické brnění, magické poškození magické (stackuje až 10×)."
      },
      {
        "n": "Inescapable",
        "d": "Nepřátelé do 800u, kteří dashují, skáčou nebo blinkují, jsou zpomaleni o 25 % na 1,75 s."
      },
      {
        "n": "Terror",
        "d": "Minioni a monstra ti udělí méně poškození, věže o 25 % méně."
      }
    ],
    "synergy": [
      "Steel",
      "Wraith",
      "Lt. Belica",
      "Narbash",
      "Sevarog",
      "Revenant",
      "Murdock"
    ]
  },
  {
    "id": "krix",
    "n": "Krix",
    "group": "Dreadnoughts",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Krix_d531f71e88.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Krix.png",
    "major": "Získáváš 10 % (+1 %/level) zvýšené maximální zdraví a navíc bonusovou velikost rovnou 0,5 % max. zdraví.",
    "minor1": [
      {
        "n": "Voracity",
        "d": "Zabití jednotky obnoví 1,25 % max. zdraví."
      },
      {
        "n": "Regenerative Tissue",
        "d": "Pokud jsi 8 s nedostal poškození od hrdiny, regeneruješ zdraví za sekundu."
      },
      {
        "n": "Festering Wounds",
        "d": "Nepřátelé zranění tvým DoT efektem mají sníženou léčbu o 45 % na 3 s."
      }
    ],
    "minor2": [
      {
        "n": "Cannibalism",
        "d": "Takedown hrdiny permanentně zvýší tvé max. zdraví o 25."
      },
      {
        "n": "Feeding Frenzy",
        "d": "Získáváš 10 % rychlosti útoku za každého nepřátelského hrdinu do 1500u."
      },
      {
        "n": "Predator",
        "d": "Zabití vůdce tábora ti dá bonusové poškození a 4 % rychlosti pohybu na 20 s (2× déle u epických monster)."
      }
    ],
    "synergy": [
      "Adele",
      "Sevarog",
      "Steel",
      "Khaimera",
      "Riktor",
      "Rampage",
      "Narbash"
    ]
  },
  {
    "id": "idrisil",
    "n": "Idrisil",
    "group": "Dreadnoughts",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Idrisil_7344ed47ad.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Idrisil.png",
    "major": "Když jsi nad 30 % zdraví a schopnost je dostupná, získáváš zvýšené brnění. Pod 30 % zdraví bonus spotřebuješ za štít rovný 150 % tvého celkového brnění.",
    "minor1": [
      {
        "n": "Cold Hearted",
        "d": "Nepřátelé, kteří tě basic attackují, jsou zpomaleni o 3 % (stack až 4×)."
      },
      {
        "n": "Mending",
        "d": "Po poškození od hrdiny obnovíš 8 % chybějícího zdraví během 3 s."
      },
      {
        "n": "Frost Snap",
        "d": "Udělíš 10 % bonusové poškození zneschopněným cílům."
      }
    ],
    "minor2": [
      {
        "n": "Icy Touch",
        "d": "Základní útoky snižují Attack Speed nepřítele (stack 4×)."
      },
      {
        "n": "Glacier",
        "d": "Permanentně získáváš magické brnění za každých 300 vydělaného zlata."
      },
      {
        "n": "Diamond Tip",
        "d": "Získáváš fyzickou a magickou penetraci za každý dokončený item."
      }
    ],
    "synergy": [
      "Aurora",
      "Boris",
      "Kwang",
      "Greystone",
      "Steel",
      "Revenant"
    ]
  },
  {
    "id": "knell",
    "n": "Knell",
    "group": "Dreadnoughts",
    "isNew": true,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/patch_note_img_003_d099e19387.jpg",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Knell.png",
    "major": "Útoky a schopnosti na nepřátelské hrdiny nanášejí stackující Rez (Rust), který snižuje jejich fyzické i magické brnění. Část zničeného brnění získáš ty. Multi-hit schopnosti stackují za každý zásah.",
    "minor1": [
      {
        "n": "Frequency",
        "d": "Za každý stack Rzi na blízkých nepřátelích získáš rychlost útoku a Ability Haste."
      },
      {
        "n": "Patina",
        "d": "Když 10 s nedostaneš poškození, získáš štít (30–268, +14/úr.)."
      },
      {
        "n": "Dampening",
        "d": "Dostáváš o 10 % méně poškození od vzdálených nepřátel."
      }
    ],
    "minor2": [
      {
        "n": "Peal",
        "d": "+15 Ultimate Haste a tvá ultimátka nanese maximum Rzi."
      },
      {
        "n": "Fracture",
        "d": "Udělíš 4 % (+0,2 %/úr.) bonusového poškození cílům s maximem Rzi."
      },
      {
        "n": "Resonant Repair",
        "d": "Když tě někdo znehybní, léčíš se a na 4 s získáš 20 tenacity."
      }
    ],
    "synergy": [
      "Bayle",
      "Terra",
      "Akeron",
      "Scarlett",
      "Zarus",
      "Grux"
    ]
  },
  {
    "id": "vesh",
    "n": "Vesh",
    "group": "Sovereigns",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Vesh_b7e94a4f82.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Vesh.png",
    "major": "Poškození hrdiny schopností přidá DoT efekt rovný 6 % (+0,5 %/min) poškození po dobu 3 s.",
    "minor1": [
      {
        "n": "Lich",
        "d": "Získáváš magický lifesteal 5 / 8 / 12 / 16 % na úrovních 1 / 6 / 11 / 16."
      },
      {
        "n": "Tithe of Death",
        "d": "Zabití hrdiny ti dá Ability Haste."
      },
      {
        "n": "The Tenth Seal",
        "d": "Při dosažení levelu 10 získáváš bonus k poškození ultimátem a Ultimate Haste."
      }
    ],
    "minor2": [
      {
        "n": "Mind Rot",
        "d": "Vesh DoT navíc udělí poškození rovné 2 % aktuálního zdraví cíle."
      },
      {
        "n": "Phylactery",
        "d": "Po seslání ultimátky získáš na 4 s štít podle max. many (cooldown 20 s)."
      },
      {
        "n": "Millennia",
        "d": "Každou minutu se poškození tvé ultimátky zvýší o 0,75 %."
      }
    ],
    "synergy": [
      "Argus",
      "Countess",
      "Renna",
      "Morigesh",
      "Howitzer",
      "Legion",
      "Gadget",
      "Lt. Belica",
      "The Fey",
      "Shinbi",
      "Gideon",
      "Wraith"
    ]
  },
  {
    "id": "xyris",
    "n": "Xyris",
    "group": "Sovereigns",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Xyris_b3090a8d6e.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Xyris.png",
    "major": "Permanentně získáváš 0,75 % bonusové poškození za každých 10 zabitých jednotek.",
    "minor1": [
      {
        "n": "Furor",
        "d": "Vstup do boje s hrdinou ti dá Attack Speed na 4 s."
      },
      {
        "n": "Dominance",
        "d": "Zabití hrdiny tě vyléčí o fixní hodnotu + % chybějícího zdraví."
      },
      {
        "n": "Iron Will",
        "d": "Léčíš se za 12 % poškození uděleného kritickými zásahy."
      }
    ],
    "minor2": [
      {
        "n": "Cull the Weak",
        "d": "Udělíš +10 % bonusové poškození minionům a monstrům."
      },
      {
        "n": "Bone Collector",
        "d": "Zabití hrdiny permanentně zvyšuje Physical/Magical Power (max 20 stacků)."
      },
      {
        "n": "Eviscerate",
        "d": "Udělíš +20 % bonusové poškození cílům nad 85 % zdraví."
      }
    ],
    "synergy": [
      "Feng Mao",
      "Serath",
      "Kira",
      "TwinBlast",
      "Murdock",
      "Eden"
    ]
  },
  {
    "id": "exarch",
    "n": "Exarch",
    "group": "Divines",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Exarch_b2793ff27d.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Exarch.png",
    "major": "Léčení nebo štít (i sebe) udělí cíli Attack Speed a posílí jeho základní útoky o bonusové magické poškození na 4 s.",
    "minor1": [
      {
        "n": "Illumination",
        "d": "Získáváš regeneraci zdraví rovnou bonusové regeneraci many."
      },
      {
        "n": "Preservation",
        "d": "Léčení a štíty, které obdržíš, jsou o 15 % silnější."
      },
      {
        "n": "Revelation",
        "d": "Seslání schopnosti zkrátí current cooldown ostatních základních schopností."
      }
    ],
    "minor2": [
      {
        "n": "Fervour",
        "d": "Základní útoky na nepřátelské hrdiny vyléčí tebe i spojence v okolí."
      },
      {
        "n": "Omnipresent",
        "d": "Mimo boj získáváš bonusovou pohybovou rychlost."
      },
      {
        "n": "Delayed Fate",
        "d": "Část poškození schopnostmi se uloží a je ti udělena jako DoT místo okamžitého poškození."
      }
    ],
    "synergy": [
      "Maco",
      "Muriel",
      "Phase",
      "Narbash",
      "Zinx"
    ]
  },
  {
    "id": "lotus",
    "n": "Lotus",
    "group": "Divines",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Lotus_c2ac2ad5ea.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Lotus.png",
    "major": "Každé 2 minuty a při každém takedownu náhodně získáš poškození, Ability Haste, rychlost pohybu nebo max. zdraví (1,25 %).",
    "minor1": [
      {
        "n": "Early Bloom",
        "d": "Při dosažení levelu 10 získáváš navíc jeden level."
      },
      {
        "n": "Flawless",
        "d": "Poškození schopností vyléčí tebe a spojence v okolí (jednou za seslání)."
      },
      {
        "n": "Masterpiece",
        "d": "Zabití dává bonusové poškození a pohybovou rychlost na 12 s (stack 5×)."
      }
    ],
    "minor2": [
      {
        "n": "Immaculate",
        "d": "Nad 90 % zdraví dostáváš o 10 % méně poškození."
      },
      {
        "n": "Prima Donna",
        "d": "Udělíš o 12 % více poškození hrdinům, ale i sám dostáváš o 6 % více."
      },
      {
        "n": "Fragrance",
        "d": "True damage je o 15 % silnější proti nepřátelům do 800u."
      }
    ],
    "synergy": [
      "Kallari",
      "Feng Mao",
      "Shinbi",
      "Countess",
      "Neon",
      "Argus",
      "Morigesh"
    ]
  },
  {
    "id": "pilow",
    "n": "Pilow",
    "group": "Divines",
    "isNew": true,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/patch_note_img_004_b477018ee4.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Pilow.png",
    "major": "Zmenší tě. Sesílání schopností nanáší blízkým nepřátelským hrdinům debuff, který stackuje a snižuje jejich poškození.",
    "minor1": [
      {
        "n": "Bioluminescence",
        "d": "Poškození nepřátelé dostávají bonusové poškození a jsou odhaleni."
      },
      {
        "n": "Harmonic Currents",
        "d": "Seslání schopnosti obnoví část chybějícího zdraví a many během 3 s."
      },
      {
        "n": "Diffusion",
        "d": "Pulz debuffu je větší a trvá déle."
      }
    ],
    "minor2": [
      {
        "n": "Neurotoxin",
        "d": "Nepřátelé dostávají o 1,5 % víc poškození za každý stack debuffu."
      },
      {
        "n": "Convection",
        "d": "Získáš brnění za každý aktivní stack debuffu na blízkých nepřátelích."
      },
      {
        "n": "Lil Sucker",
        "d": "Základní útoky kradou rychlost pohybu (stackuje)."
      }
    ],
    "synergy": [
      "Ikra",
      "Muriel",
      "Phase",
      "Mourn",
      "Lt. Belica",
      "Dekker"
    ]
  },
  {
    "id": "demiurge",
    "n": "Demiurge",
    "group": "Anomalies",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Demiurge_cc84e7bef7.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Demiurge.png",
    "major": "Zvyšuje staty z itemů (mimo passive efekty) o 12 % a poškození z item efektů o 10 %.",
    "minor1": [
      {
        "n": "Tri-Core",
        "d": "On-hit poškození, jehož typ se náhodně mění mezi fyzickým, magickým a true damage."
      },
      {
        "n": "Bloatware",
        "d": "Za každý vlastněný item získáváš poškození i snížení utrpěného poškození."
      },
      {
        "n": "Bio-Mechanical Fusion",
        "d": "Za každých 5 magické síly získáváš 1 fyzickou sílu."
      }
    ],
    "minor2": [
      {
        "n": "Cursed Corrupted",
        "d": "Convertuje šanci na kritický zásah na Ability Haste."
      },
      {
        "n": "Memory Leak",
        "d": "Seslání schopnosti přidá permanentní max. manu; při 600 many získáváš bonus k pohybové rychlosti."
      },
      {
        "n": "Construct",
        "d": "Zvyšuje základní zdraví, manu a fyzickou sílu i jejich růst za level."
      }
    ],
    "synergy": [
      "Greystone",
      "Lt. Belica",
      "Howitzer",
      "Steel",
      "Revenant"
    ]
  },
  {
    "id": "aion",
    "n": "Aion",
    "group": "Anomalies",
    "isNew": false,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Web_Banner_Eternal_Aion_8b9d71e5fe.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Aion.png",
    "major": "Seslání schopnosti dává regeneraci many (stack 5×) a navíc tvé schopnosti generují zlato za poškození hrdinům.",
    "minor1": [
      {
        "n": "Philosopher",
        "d": "Pravidelně generuješ 4 zlata; interval se zkracuje s Ability Haste."
      },
      {
        "n": "Sacrifice",
        "d": "Zásah schopností obnoví 3,5 % chybějící many, zabití hrdiny 25 %."
      },
      {
        "n": "Bottomless Vial",
        "d": "Zabití river buffu obnoví nálož lektvaru a dá permanentní magickou sílu."
      }
    ],
    "minor2": [
      {
        "n": "Arcane Resonance",
        "d": "Cooldowny schopností a Philosopher postupují rychleji s regenerací many."
      },
      {
        "n": "Perfection",
        "d": "Nad 90 % zdraví získáváš Ability Haste."
      },
      {
        "n": "Runic Focus",
        "d": "Magická síla roste s procentem aktuální many."
      }
    ],
    "synergy": [
      "Gideon",
      "Gadget",
      "Morigesh",
      "Argus",
      "Howitzer",
      "Neon"
    ]
  },
  {
    "id": "satariel",
    "n": "Satariel",
    "group": "Anomalies",
    "isNew": true,
    "img": "https://d3tyjtqxpxwenc.cloudfront.net/kVgp1B/Eternals_Satatriel_c9eaf2678b.png",
    "imgAlt": "https://predecessor.wiki.gg/images/Eternals_Satariel.png",
    "major": "Takedowny dávají stacky Nebojácnosti (Fearless, max. 6): +5 % (+4 % za stack) síly a rychlosti útoku, ale trvale snižují max. zdraví (6 % +6,5 % melee / +7,5 % ranged za stack). Smrtí se stacky resetují.",
    "minor1": [
      {
        "n": "Demonic Bargain",
        "d": "Bonusové zlato na úrovních 1, 7 a 13."
      },
      {
        "n": "Risen",
        "d": "Při 3+ stackách Nebojácnosti získáš 15 % omnivampu."
      },
      {
        "n": "Hellfire Strikes",
        "d": "Základní útoky udělují bonusové true poškození."
      }
    ],
    "minor2": [
      {
        "n": "Broken Wings",
        "d": "Tvou rychlost pohybu neovlivňují itemy ani schopnosti (pozitivně ani negativně)."
      },
      {
        "n": "Rite",
        "d": "Schopnosti stojí zdraví, ale dávají trvalý Ability Haste."
      },
      {
        "n": "Psychosis",
        "d": "Udělíš o 3 % (+0,3 %/úr.) víc poškození nejbližšímu nepřátelskému hrdinovi a méně ostatním."
      }
    ],
    "synergy": [
      "Kallari",
      "Serath",
      "Feng Mao",
      "Yurei",
      "Countess",
      "Wraith"
    ]
  }
];
