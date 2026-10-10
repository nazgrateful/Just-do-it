// The Looks gallery: aesthetics from the Aesthetics Wiki and Pinterest, each turned into a
// full app look: colours, heading and body fonts, shapes (cards, buttons, borders, shadows)
// and a background pattern. Pure functions, so the theme maths can be tested in Node.
//
// Line format:  Name | emoji | bg surface ink accent accent2 | heading-font body-font | shape | pattern | words
// A look whose bg is dark stays dark; light looks get an automatic dark version.
// The full Aesthetics Wiki index is added from looks-index.js (see FAMILIES and PALETTES below).

import { INDEX } from './looks-index.js';

const CATALOG = {
  'Calm & minimal': `
Tranquil serenity|☁️|#f4f1ea #fbf9f4 #2e3836 #4a6b63 #8fafc4|serif sans|soft|grain|still water, linen, sage and mist
Minimalism|◻️|#f7f7f5 #ffffff #1b1b1b #2b2b2b #b9b9b4|sans sans|sharp|none|white space, fewer things, better things
Japandi|🍵|#f2eee6 #faf8f3 #2c2b26 #6e7a5e #c4b59d|serif sans|soft|grain|natural wood, linen, nothing extra
Scandinavian|🕯️|#f5f3ef #ffffff #23262a #5c7a8a #d9c7b0|sans sans|soft|none|light wood, wool throws, hygge
Wabi-sabi|🪨|#ece6dc #f6f2ea #3a352e #8c7a64 #b8a993|serif sans|paper|grain|imperfect, handmade, weathered, quiet
Zen|🪷|#eef0ea #f9faf6 #263028 #5a7560 #c9b88f|serif sans|soft|grain|raked sand, moss, breath
Clean Girl|🫧|#f6f1ec #fffcf9 #2f2a27 #b08d7a #e6d3c4|sans sans|round|none|slicked bun, dewy skin, gold hoops
Vanilla Girl|🍦|#f7efe2 #fffaf1 #3b3127 #b59572 #eadbc4|serif sans|round|grain|cream knits, vanilla candles, softness
That Girl|🥤|#f3efe8 #ffffff #262321 #7d8b6a #e8d5c4|sans sans|soft|none|green juice, 5am, planner, pilates
Acubi|🩶|#e9e9e7 #f5f5f3 #1f1f22 #5b6470 #a9aeb5|grotesk sans|sharp|none|muted greys, layers, Seoul minimal
Monochrome|⬛|#ffffff #ffffff #000000 #000000 #777777|grotesk grotesk|sharp|none|black, white and nothing else
Coastal Grandmother|🐚|#f4f1ea #fffdf8 #2a3540 #5d7f99 #d8cbb3|serif sans|soft|none|linen, hydrangeas, ocean walks`,

  'Nature & cottage': `
Cottagecore|🌼|#f7f2e2 #fffbf0 #3a3524 #7a8f4e #d99a8f|display serif|soft|flowers|gardens, baking, wildflowers, handmade
Goblincore|🍄|#e5e2d0 #f1efe2 #2e2a1e #6b7b3a #9c6b3f|hand sans|paper|grain|moss, mushrooms, frogs, found treasures
Fairycore|🧚|#f1f4ea #fbfdf6 #2f3a2c #7aa37a #e3b6d1|script serif|round|sparkle|dew, ferns, wings, soft light
Grandmacore|🧶|#f3e9dc #fff8ee #3d2f26 #a0574a #7f9c8a|serif serif|paper|flowers|crochet, teacups, floral wallpaper
Bloomcore|🌷|#fdf3f4 #ffffff #3b2830 #d0587e #f2b134|display round|round|flowers|blooming gardens, pinks, petals
Naturecore|🌿|#eef2e6 #f8fbf2 #22301f #4f7a3f #b7a46b|sans sans|soft|grain|leaves, rivers, open sky
Forestcore|🌲|#dfe6d8 #eef3ea #1c2a1e #2f5d3a #8a6f4a|serif sans|soft|grain|deep pines, cabins, wet earth
Mushroomcore|🍄‍🟫|#efe6d8 #faf3e8 #3a2a1f #b4532a #8e7b5a|hand round|round|dots|toadstools, autumn floors, spores
Gardencore|🪴|#f0f2e4 #fbfcf3 #26301f #5f8a3e #e0a458|serif sans|soft|flowers|greenhouse, seedlings, terracotta
Countrycore|🌾|#f5ecd9 #fff8ea #3b301f #9c6b30 #6f8a54|serif sans|paper|plaid|farm mornings, gingham, hay bales
Honeycore|🍯|#fdf3d7 #fffaeb #3d2c0f #c98a12 #7a9a52|display round|round|dots|honey, bees, warm afternoons
Cabincore|🪵|#ece2d4 #f8f1e7 #2e231b #8a4b2a #4d6b4f|serif sans|paper|plaid|log fires, flannel, snow outside`,

  'Academia & classic': `
Dark Academia|📚|#1f1a16 #2a231d #eadfcd #c99a6b #8a5a3b|classic serif|ornate|grain|old books, candlelight, wool, ambition
Light Academia|🕊️|#f3ece0 #fbf6ee #3a3026 #9c7b55 #c9b28d|serif serif|ornate|paper|sunlit libraries, linen, poetry
Chaotic Academia|🖋️|#ece4d6 #f8f2e7 #2c241d #7a3b2e #4b5d73|type serif|paper|paper|ink stains, coffee, too many tabs
Romantic Academia|🌹|#f3e6e2 #fff6f3 #3a2228 #8e3a4b #c99a6b|display serif|ornate|flowers|love letters, roses, sonnets
Art Academia|🎨|#f2ece2 #fbf7f0 #2a2622 #b4532a #3d6b8a|hand serif|paper|paper|paint-stained hands, sketchbooks
Old Money|🐎|#f3efe6 #fdfbf6 #1f2a24 #234236 #b39b6b|display serif|sharp|none|tennis whites, navy, heirlooms
Royalcore|👑|#2a1630 #3a2142 #f3e7d4 #d4af37 #8e2b4a|classic serif|ornate|none|crowns, velvet, gold leaf
Princesscore|👸|#fbeef4 #fff8fb #4a2a3a #c85a8a #e8c46a|script serif|ornate|sparkle|ballgowns, tiaras, castles
Victorian|🕰️|#2b1e1e #3a2a28 #efe2cf #a8763e #6b2d2d|classic serif|ornate|grain|lace, parlours, gaslight
Regencycore|💌|#eef0f5 #fbfcff #2a2e3d #6a7fb0 #d9a5a0|display serif|ornate|none|empire waists, ballrooms, letters
Medieval|🏰|#e8dcc2 #f4ebd6 #2e2416 #7a2b1f #3f5a3a|gothic serif|ornate|paper|castles, illuminated manuscripts
Renaissance|🖼️|#efe1c6 #f8efdc #2e2214 #8a3a1f #3b5a6b|classic serif|ornate|grain|frescoes, gold, masterpieces`,

  'Art & design movements': `
Art Deco|🍸|#151515 #1f1f1f #f0e6d0 #d4af37 #2f6b5e|classic sans|ornate|stripes|gold geometry, jazz, glamour
Art Nouveau|🌸|#efe6d2 #f8f1e2 #2f2a1c #6f8a3a #b3683a|display serif|ornate|flowers|whiplash curves, lilies, stained glass
Bauhaus|🔺|#f2efe6 #ffffff #111111 #d12f2f #1f4fa8|grotesk grotesk|brutal|none|primary colours, circles, function
Memphis|🔷|#fff7e6 #ffffff #1a1a1a #ff4f8b #21b6c4|grotesk round|retro|dots|squiggles, terrazzo, 80s pop
Mid-Century Modern|🪑|#f3ead8 #fdf6e8 #2a2620 #d0743c #2f6b6b|grotesk sans|retro|none|teak, atomic shapes, mustard
Brutalism|🧱|#e6e6e2 #ffffff #111111 #111111 #ff5a1f|grotesk mono|brutal|grid|raw concrete, bold type, no decoration
Swiss Style|🇨🇭|#ffffff #ffffff #111111 #e30613 #111111|grotesk grotesk|sharp|grid|grids, Helvetica, clarity
Maximalism|🦚|#fff1e6 #ffffff #2a1430 #c2185b #1f8a70|display round|retro|checker|more is more, colour, pattern
Pop Art|💥|#fffbe6 #ffffff #111111 #ff2d55 #ffd60a|grotesk round|brutal|dots|comic dots, bold outlines, wham!
Psychedelia|🌀|#2a0f3d #3a1652 #ffe9f9 #ff6ec7 #ffd23f|script round|round|stripes|swirls, lava lamps, 60s colour
Vectordelia|🌈|#f7f3ff #ffffff #22163a #7a3cff #19c3b1|grotesk round|round|clouds|glossy vector art, rainbows, 2000s
Kitsch|🦩|#fff0f5 #ffffff #3a1a2a #ff4f8b #2ec4b6|script round|retro|checker|flamingos, leopard, too much`,

  'Internet & retro tech': `
Frutiger Aero|🫧|#dff3ff #f5fbff #03233d #0067b8 #4cae1a|sans sans|glass|clouds|glossy glass, sky, bubbles, optimism
Frutiger Eco|🌱|#e6f6ea #f7fff8 #0f2e1d #1f8a4c #2aa0d8|sans sans|glass|clouds|eco tech, leaves and water drops
Frutiger Metro|🟦|#f2f6fa #ffffff #111a24 #0078d7 #2bb673|grotesk sans|sharp|none|flat tiles, Windows 8, clean colour
Dark Aero|🌌|#071526 #0d2238 #e3f4ff #3fb4ff #58e0a0|sans sans|glass|stars|night glass, glowing orbs
Y2K|💿|#eef0ff #ffffff #1b1440 #7a5cff #ff5cc8|future round|round|sparkle|chrome, butterflies, flip phones
Y2K Futurism|🪐|#e8edf3 #ffffff #121820 #4a6fa5 #b8c4d4|future grotesk|glass|grid|chrome blobs, silver, tomorrow
McBling|💖|#ffe6f4 #fff6fb #3a1030 #ff2fa0 #c8a2ff|script round|round|sparkle|rhinestones, pink velour, bling
Vaporwave|🌴|#2b1b4a #3b2563 #fde8ff #ff71ce #01cdfe|pixel mono|window|sunset|marble busts, palm trees, 1995
Synthwave|🌆|#1a0b2e #2a1446 #ffe8ff #ff2a6d #05d9e8|future sans|neon|sunset|neon grids, sunset, outrun
Webcore|🌐|#e9f0ff #ffffff #0b1640 #0033cc #ff00aa|pixel sans|window|stars|hit counters, gifs, guestbooks
Old Web|💾|#c0c0c0 #dcdcdc #000000 #000080 #008080|mono system|window|none|Windows 95, grey bevels, dial-up
Cybercore|🧬|#05070d #0d1220 #d6fff5 #00ffc6 #ff2bd6|future mono|neon|scanlines|neon tech, data, cyberspace
Glitchcore|📺|#0b0b0f #16161d #f1f1f5 #00f0ff #ff2b6d|pixel mono|neon|scanlines|glitches, static, chromatic split
Dreamcore|🌙|#efe9ff #fbf9ff #2a2340 #8a7cc8 #ffd27f|serif sans|soft|clouds|surreal skies, half-remembered
Weirdcore|👁️|#e6f0e6 #ffffff #1c1c1c #3a55ff #c4c4c4|mono system|window|none|low-res text, odd spaces, unease
Liminal Space|🚪|#efe8c8 #f8f2d8 #2e2b1c #9a8a4a #8fa3a8|sans sans|sharp|grain|empty halls, buzzing lights
Lo-fi|🎧|#2a2633 #36313f #f1e6dc #e7a977 #8fa8c8|hand sans|soft|grain|study beats, rain, warm lamps
Gen X Soft Club|💽|#e9edf0 #ffffff #1c242c #5d8aa8 #b9c7cf|grotesk sans|glass|grain|translucent plastics, soft techno, 1999
Seapunk|🐬|#e0fbff #f5feff #0b2a3a #00c2c7 #b46cff|future round|glass|waves|aqua, dolphins, tumblr 2012
Kidcore|🖍️|#fffbe6 #ffffff #1a1a2e #ff3b30 #2f80ed|round round|bubbly|dots|crayons, primary colours, playgrounds`,

  'Cute & kawaii': `
Kawaii|🌸|#fff0f6 #ffffff #4a2a3a #ff7eb6 #8fd3fe|round round|bubbly|hearts|cute everything, pastel, sparkles
Soft Girl|🎀|#ffeef3 #fff8fa #4a2c36 #f48fb1 #b39ddb|round round|bubbly|hearts|blush, butterfly clips, pastels
Coquette|🎀|#fbeff0 #fffafa #4a2a30 #c76a7d #e8c4c8|script serif|ornate|hearts|bows, lace, pearls, love letters
Lovecore|💘|#ffe6ea #fff6f8 #4a1a24 #e3315a #ff9fb4|script round|bubbly|hearts|hearts, cherries, valentines
Angelcore|👼|#f7f9ff #ffffff #2e3346 #b8a26a #c9d8ff|classic serif|soft|clouds|halos, clouds, white feathers
Cloudcore|☁️|#eaf4ff #ffffff #233040 #6aa6e0 #f6d6e8|round round|round|clouds|fluffy clouds, sky blue, daydreams
Barbiecore|💗|#ffe3f1 #fff5fa #4a0f2e #e0218a #ff8fc7|script round|bubbly|hearts|hot pink, Malibu, fantastic
Fairy Kei|🦄|#f6f0ff #ffffff #3d3352 #b392f0 #8fe3cf|round round|bubbly|stars|pastel 80s, unicorns, toys
Decora|🌈|#fff7fb #ffffff #2a1a3a #ff4fa3 #4fc3ff|round round|bubbly|dots|clips, stickers, all the colours
Sweet Lolita|🍰|#fff1f5 #fffafc #4a2633 #e57fa3 #bfa6e8|script serif|ornate|hearts|petticoats, lace, cake
Morute|🧸|#f3eef8 #fcfaff #2e2638 #8b6bb1 #c48aa6|round round|bubbly|hearts|plush toys, lilac, softness
Candycore|🍬|#fff3fb #ffffff #3a1d3a #ff5fa2 #43d3c4|round round|bubbly|stripes|sweets, lollipops, sugar rush
Babycore|🍼|#f4f8ff #ffffff #2f3a4a #8fb7e8 #f7c6d9|round round|bubbly|dots|nursery pastels, rattles, softness
Clowncore|🤡|#fff8e6 #ffffff #1f1a2e #e63946 #2a9d8f|round round|retro|checker|polka dots, ruffles, circus`,

  'Dark & alternative': `
Goth|🦇|#0e0d10 #19171c #ece6ee #9b1b30 #6b5b7a|gothic serif|ornate|none|black lace, candles, velvet
Romantic Goth|🥀|#160d12 #22141b #f1e2e8 #a3243b #7b5c8a|gothic serif|ornate|grain|roses, cathedrals, longing
Pastel Goth|🔮|#1b1622 #261f2f #f8eaff #ff9ad5 #9be7ff|gothic round|neon|stars|black with pastels, crosses
Nu Goth|🌑|#121212 #1c1c1c #ececec #8a8a8a #b8a07a|classic sans|sharp|none|witchy black, moons, minimal
Grunge|🎸|#1c1a17 #27241f #e7e1d6 #a3472c #6b7a4f|type sans|paper|grain|flannel, distortion, 1994
Emo|🖤|#0f0f12 #1a1a1f #f0f0f5 #e0245e #8a8aa0|type sans|sharp|stripes|side fringe, eyeliner, mixtapes
Scene|⚡|#0d0d0d #1a1a1a #ffffff #00e5ff #ff2fd1|pixel round|neon|checker|rainbow hair, raccoon tails, MySpace
Punk|🧷|#121212 #1e1e1e #f5f5f5 #ff2a2a #ffe600|type grotesk|brutal|stripes|safety pins, DIY, loud
Witchcore|🧹|#1a1720 #251f2c #ede4f2 #9c7bd4 #c9a24a|gothic serif|ornate|stars|herbs, moons, spellbooks
Vampire|🩸|#120709 #1f0d10 #f3e1e3 #b0122e #6a2c3a|gothic serif|ornate|grain|blood red, castles, immortality
Cybergoth|☣️|#070707 #121212 #eaffea #39ff14 #ff00c8|future mono|neon|scanlines|neon dreads, goggles, industrial
Jirai Kei|🩷|#1a1418 #261c22 #ffe9f2 #ff6fa8 #c9c9d6|script round|ornate|hearts|black and pink, ribbons, landmine
Yami Kawaii|💊|#1c1622 #281f30 #ffeaf6 #ff7ac6 #8ad8ff|round round|bubbly|hearts|sick-cute, pastel and dark
Spooky|🎃|#14110f #211c18 #f5ead8 #ff7a1a #7a4fd0|gothic sans|retro|stars|pumpkins, ghosts, October`,

  'Luxe & fashion': `
Quiet Luxury|🧥|#f2eee8 #fbf9f5 #1f1d1a #6e5a44 #c2b4a0|display sans|sharp|none|cashmere, no logos, beige
Luxe Glam|🥂|#111111 #1b1b1b #f3ece0 #d4af37 #c9a7a0|display sans|ornate|sparkle|gold, champagne, red carpets
Mob Wife|🐆|#140f0d #211915 #f4e8dc #b8862b #8c1c1c|display serif|sharp|none|fur, gold chains, leopard
Baddie|💅|#151215 #221c22 #fbeef5 #ff3ea5 #d4af37|grotesk sans|sharp|none|lashes, nails, confidence
Preppy|⛵|#f7f9fc #ffffff #12233f #1f4fa8 #e04b4b|classic sans|retro|stripes|polos, plaid, regattas
Balletcore|🩰|#fbf1f1 #fffafa #3d2a2e #d79aa6 #c9b8b0|serif sans|round|none|tulle, wrap cardigans, ribbons
Tenniscore|🎾|#f6f7f0 #ffffff #1e2a20 #2f6b3a #d7e34a|grotesk sans|round|stripes|pleated skirts, clay courts
Tomato Girl|🍅|#fff6ec #fffbf5 #3a1e14 #d8442f #4f7a3f|script serif|soft|stripes|Italian summer, linen, tomatoes
Office Siren|👓|#f2f0ee #ffffff #1a1a1d #3d3d46 #9a2b3c|display sans|sharp|none|pencil skirts, glasses, sharp
Streetwear|👟|#f1f1ef #ffffff #111111 #ff5a1f #111111|grotesk grotesk|brutal|none|drops, sneakers, oversized
Hypebeast|🧢|#111111 #1c1c1c #f5f5f5 #ff3b30 #ffcc00|grotesk grotesk|brutal|none|logos, limited, the queue
Parisian Chic|🥐|#f5f0ea #fffcf8 #1d1d1f #1d1d1f #c2453f|display serif|sharp|stripes|Breton stripes, red lip, café`,

  'Sci-fi & futurism': `
Cyberpunk|🌃|#0a0a12 #141424 #e6f7ff #f3e600 #ff2a6d|future mono|neon|scanlines|neon rain, megacities, chrome
Solarpunk|☀️|#f3f7e8 #fcfff4 #1e3022 #3d8b3d #f2b134|grotesk sans|round|flowers|green cities, solar glass, hope
Lunarpunk|🌒|#0f1424 #18203a #e8ecff #9fb4ff #7fe0c4|serif sans|glass|stars|bioluminescence, moonlit gardens
Steampunk|⚙️|#2a1e14 #382819 #f0e0c4 #c08a3e #8a4b2a|classic serif|ornate|grain|brass gears, airships, goggles
Dieselpunk|🛩️|#24221e #32302a #ece4d2 #b0763a #5d6b5a|grotesk sans|sharp|stripes|riveted steel, 1940s machines
Atompunk|⚛️|#f4ecd8 #fff8e8 #1f2a33 #e0533a #2a9d8f|future sans|retro|stars|atomic age, rockets, tomorrowland
Retrofuturism|🚀|#f6efe0 #fff9ec #1d2433 #ff6b35 #2a6fdb|future round|retro|stars|the future as imagined in 1960
Space Age|🛰️|#0b0e1a #151a2c #eaf0ff #ffb347 #8ab4ff|future sans|round|stars|orbits, white pods, moon landings
Afrofuturism|🔆|#1a1210 #2a1c16 #fbefe0 #e8a317 #7b3fa0|future sans|ornate|stripes|ancestral and future, gold and purple
Biopunk|🧪|#0d1a12 #15281c #e6ffe9 #6bff8a #c86bff|future mono|neon|dots|labs, mutations, green glow
Terminal|⌨️|#000000 #0a0a0a #b8ffb8 #33ff33 #33ff33|pixel mono|pixel|scanlines|green phosphor, command line
Tech Noir|🕶️|#0c0c0e #16161a #e8e8ee #9aa4b2 #c43a3a|grotesk sans|sharp|scanlines|dark tech, rain, minimal`,

  'Decades & retro': `
1950s Diner|🍔|#fff6ee #ffffff #1a1a1a #e63946 #2ec4b6|script sans|retro|checker|chrome stools, milkshakes, jukebox
1960s Mod|🎯|#ffffff #ffffff #111111 #e63946 #1d4ed8|grotesk sans|brutal|stripes|targets, mini dresses, London
1970s Groovy|🌻|#fbefd5 #fff8e6 #3a2410 #d9822b #6b8e23|script round|round|stripes|orange and brown, flares, sunshine
Disco|🪩|#16081f #24102f #ffe9ff #ffcc00 #ff4fd8|script sans|neon|sparkle|mirror balls, sequins, dance floor
1980s Neon|📼|#120a24 #1e1236 #fff0ff #ff3fa4 #00e1ff|future sans|neon|grid|neon, VHS, arcades
1990s|📟|#f4f0e8 #ffffff #1a1a2e #6b4ce6 #1fb5a8|grotesk sans|retro|dots|bright plastics, pagers, sitcoms
Americana|🇺🇸|#f6f1e7 #fffcf6 #1b2338 #b22234 #3c3b6e|classic serif|retro|stripes|diners, road trips, flags
Western|🤠|#f3e3c8 #fbf0dc #3a2414 #a0522d #6b8e9e|classic serif|paper|grain|cowboy boots, desert, saloon
Rockabilly|🎸|#111111 #1c1c1c #f5f5f5 #e63946 #f1c40f|script sans|retro|checker|pompadours, cherries, hot rods
Tiki|🗿|#f6ead2 #fff6e4 #2a1a0e #d35400 #16a085|script sans|retro|stripes|bamboo, rum, island kitsch
City Pop|🌇|#1a1f3a #24294d #fff1f6 #ff7eb3 #7afcff|grotesk sans|round|sunset|Tokyo nights, cassette, 1984
Pin-up|💋|#fff0ee #ffffff #2a0f14 #d62839 #1b4965|script serif|retro|dots|polka dots, victory rolls, red lips`,

  'Coastal, travel & seasons': `
Coastal|🌊|#eef6f8 #ffffff #1b2c35 #2e7fa3 #e6d3b3|serif sans|soft|waves|sea breeze, white linen, salt
Mermaidcore|🧜‍♀️|#e3f7f5 #f6fffd #133a3a #1fa39a #b48fe0|script round|round|waves|scales, pearls, iridescence
Nautical|⚓|#f6f8fb #ffffff #0f2340 #1d3e8a #c8102e|classic sans|retro|stripes|navy stripes, rope, anchors
Tropical|🌺|#f2fbf3 #ffffff #13301f #13a35b #ff6f59|script round|round|flowers|palms, hibiscus, warm sea
Italian Summer|🍋|#fff9e8 #ffffff #1f2a3a #2a5ea8 #f2c94c|display serif|soft|stripes|lemons, Vespas, Amalfi blue
Mediterranean|🏛️|#f8f6f0 #ffffff #13294b #1f5fa8 #e3b04b|serif sans|soft|waves|whitewash, blue domes, olives
Autumncore|🍂|#f5e8d6 #fff6ea #3a2414 #c0622f #6b7b3a|serif sans|paper|grain|falling leaves, pumpkins, scarves
Wintercore|❄️|#eef3f8 #ffffff #1c2a3a #5b8db8 #b8c9db|serif sans|soft|sparkle|snow, frost, quiet white
Christmascore|🎄|#f6f1ea #fffdf8 #1e2a22 #b22222 #1f6b3a|classic serif|retro|sparkle|tinsel, cocoa, red and green
Springcore|🌱|#f4f9ec #ffffff #233322 #7cb342 #f8a5c2|round round|round|flowers|blossoms, rain, new green
Summercore|🍉|#fff8ea #ffffff #2a1f14 #ff6b4a #2ec4b6|round round|round|dots|ice lollies, sun, pools
Rainy Day|🌧️|#e3e7ea #f2f4f5 #1f262b #4b6476 #9fb3c2|serif sans|soft|grain|rain on windows, tea, books`,

  'Spiritual & mystic': `
Celestial|🌙|#121633 #1c2147 #f2efe6 #e8c766 #9ab3ff|classic serif|ornate|stars|moons, stars, zodiac, gold
Ethereal|✨|#f6f4fb #ffffff #2e2b3d #a39bd8 #f0d9e7|serif sans|soft|sparkle|light, gauze, otherworldly
Mystic|🔮|#1b1430 #271d42 #efe7ff #b892ff #e3c46a|classic serif|ornate|stars|tarot, crystals, incense
Crystalcore|💎|#f1f3ff #ffffff #262a40 #8aa0ff #e0b3ff|serif round|glass|sparkle|amethyst, quartz, prisms
Boho|🪶|#f4ebdf #fcf6ee #3a2a1c #b5653a #6b7d5a|script serif|paper|grain|macramé, rugs, wanderlust
Hippie|☮️|#fdf1d8 #fff9ea #3a2614 #e07b24 #6a8f3a|script round|round|flowers|peace, flowers, vans and festivals
Spiritual Minimal|🕉️|#f3efe7 #fbf9f4 #2c2a26 #a07a4a #7a8f84|serif sans|soft|grain|altar, candle, breath, stillness
Sacred|🕌|#f6f0e4 #fffbf3 #23281f #2f6b5a #c9a24a|classic serif|ornate|grain|prayer, light through windows, devotion`,

  'Cozy & home': `
Cozy|☕|#f6ece0 #fff8ee #3b2a20 #b5643c #8a9a6b|serif round|round|grain|blankets, soft lamps, warm drinks
Coffee Shop|🥐|#efe4d6 #faf3ea #2e2018 #8a5a3b #c9a27a|hand sans|paper|grain|latte art, chalkboards, rain outside
Bookish|📖|#f1e9dc #fbf6ee #2c241c #6b4a2f #a33b2e|serif serif|paper|paper|stacks of books, reading nooks
Cluttercore|🧺|#fbf1e3 #fffaf2 #2a1f1a #d0743c #3f7d6b|hand round|retro|checker|collections, stuff, joy
Grandmillennial|🫖|#f6efe6 #fffaf4 #2c2a3a #3d5a99 #d98a9c|serif serif|ornate|flowers|chintz, porcelain, needlepoint
Hygge|🧦|#f2ebe3 #fbf7f2 #2e2a26 #9a6a4a #8aa3a8|serif sans|round|grain|candles, socks, togetherness
Cozy Witch|🍵|#211b1a #2e2624 #f3e6d8 #c47a3a #8a9a6b|hand serif|soft|grain|tea, herbs, cauldron, cats
Journaling|📓|#f7f3ea #fffdf8 #2a2724 #c26d5a #7a9a8a|hand sans|paper|paper|washi tape, stickers, bullet lists`,

  'Sporty & outdoors': `
Sporty|⚡|#f3f5f8 #ffffff #121820 #e4572e #1f4fa8|grotesk sans|sharp|stripes|early runs, clean kit, personal bests
Gorpcore|🏔️|#ecebe4 #f8f7f2 #1f2420 #e2622b #3e6b54|grotesk sans|sharp|grid|fleece, trail shoes, carabiners
Athleisure|🧘|#f3f2f0 #ffffff #1d1d1f #6b7a8f #c7b8ad|sans sans|round|none|leggings, matcha, studio
Skater|🛹|#f1efe9 #ffffff #121212 #e63946 #457b9d|type grotesk|brutal|grain|grip tape, DIY spots, VHS edits
Blokecore|⚽|#f4f4f0 #ffffff #111a2e #c8102e #1d3e8a|grotesk sans|retro|stripes|football shirts, terraces
Surf|🏄|#eaf7f6 #ffffff #11303a #1a9fb0 #f4a259|script round|round|waves|wax, boards, golden hour
Hiking|🥾|#eef0e8 #f9faf5 #1f2a20 #4f7a3f #b36b2c|grotesk sans|soft|grid|trails, maps, summits`,
};

// ---------------------------------------------------------------- parsing

const slug = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------------------------------------------------------------- families & palettes for the full index

/** A style family: fonts, shapes, background pattern, and where it sits in the gallery. */
export const FAMILIES = {
  min: { head: 'sans', body: 'sans', shape: 'sharp', pattern: 'none', cat: 'Calm & minimal' },
  soft: { head: 'serif', body: 'sans', shape: 'soft', pattern: 'grain', cat: 'Calm & minimal' },
  glass: { head: 'sans', body: 'sans', shape: 'glass', pattern: 'clouds', cat: 'Calm & minimal' },
  clay: { head: 'round', body: 'round', shape: 'bubbly', pattern: 'none', cat: 'Calm & minimal' },
  flat: { head: 'grotesk', body: 'sans', shape: 'sharp', pattern: 'none', cat: 'Art & design' },
  cozy: { head: 'serif', body: 'round', shape: 'round', pattern: 'grain', cat: 'Cozy & home' },
  nat: { head: 'serif', body: 'sans', shape: 'soft', pattern: 'flowers', cat: 'Nature & cottage' },
  whim: { head: 'hand', body: 'round', shape: 'round', pattern: 'sparkle', cat: 'Cute & whimsical' },
  cute: { head: 'round', body: 'round', shape: 'bubbly', pattern: 'hearts', cat: 'Cute & whimsical' },
  kei: { head: 'round', body: 'round', shape: 'bubbly', pattern: 'dots', cat: 'Japanese & Korean styles' },
  gyaru: { head: 'script', body: 'round', shape: 'bubbly', pattern: 'sparkle', cat: 'Japanese & Korean styles' },
  lol: { head: 'script', body: 'serif', shape: 'ornate', pattern: 'hearts', cat: 'Lolita, doll & coquette' },
  acad: { head: 'classic', body: 'serif', shape: 'ornate', pattern: 'paper', cat: 'Academia' },
  hist: { head: 'classic', body: 'serif', shape: 'ornate', pattern: 'grain', cat: 'History & eras' },
  asia: { head: 'classic', body: 'serif', shape: 'ornate', pattern: 'grain', cat: 'History & eras' },
  nouv: { head: 'display', body: 'serif', shape: 'ornate', pattern: 'flowers', cat: 'Art & design' },
  art: { head: 'grotesk', body: 'sans', shape: 'sharp', pattern: 'grid', cat: 'Art & design' },
  pop: { head: 'grotesk', body: 'round', shape: 'brutal', pattern: 'dots', cat: 'Art & design' },
  brut: { head: 'grotesk', body: 'mono', shape: 'brutal', pattern: 'grid', cat: 'Art & design' },
  luxe: { head: 'display', body: 'sans', shape: 'sharp', pattern: 'none', cat: 'Luxe & fashion' },
  glam: { head: 'display', body: 'sans', shape: 'ornate', pattern: 'sparkle', cat: 'Luxe & fashion' },
  prep: { head: 'classic', body: 'sans', shape: 'retro', pattern: 'stripes', cat: 'Luxe & fashion' },
  street: { head: 'grotesk', body: 'grotesk', shape: 'brutal', pattern: 'none', cat: 'Street & subcultures' },
  rap: { head: 'grotesk', body: 'grotesk', shape: 'sharp', pattern: 'none', cat: 'Music scenes' },
  rave: { head: 'future', body: 'round', shape: 'neon', pattern: 'dots', cat: 'Music scenes' },
  disco: { head: 'script', body: 'sans', shape: 'neon', pattern: 'sparkle', cat: 'Music scenes' },
  indie: { head: 'hand', body: 'sans', shape: 'paper', pattern: 'grain', cat: 'Music scenes' },
  rock: { head: 'type', body: 'grotesk', shape: 'sharp', pattern: 'grain', cat: 'Music scenes' },
  punk: { head: 'type', body: 'grotesk', shape: 'brutal', pattern: 'stripes', cat: 'Dark & alternative' },
  goth: { head: 'gothic', body: 'serif', shape: 'ornate', pattern: 'none', cat: 'Dark & alternative' },
  metal: { head: 'gothic', body: 'grotesk', shape: 'sharp', pattern: 'grain', cat: 'Dark & alternative' },
  grunge: { head: 'type', body: 'sans', shape: 'paper', pattern: 'grain', cat: 'Dark & alternative' },
  scene: { head: 'pixel', body: 'round', shape: 'neon', pattern: 'checker', cat: 'Dark & alternative' },
  horr: { head: 'gothic', body: 'mono', shape: 'sharp', pattern: 'scanlines', cat: 'Spooky & horror' },
  spook: { head: 'gothic', body: 'sans', shape: 'retro', pattern: 'stars', cat: 'Spooky & horror' },
  cyber: { head: 'future', body: 'mono', shape: 'neon', pattern: 'scanlines', cat: 'Internet & retro tech' },
  synth: { head: 'future', body: 'sans', shape: 'neon', pattern: 'sunset', cat: 'Internet & retro tech' },
  vapor: { head: 'pixel', body: 'mono', shape: 'window', pattern: 'sunset', cat: 'Internet & retro tech' },
  web: { head: 'pixel', body: 'sans', shape: 'window', pattern: 'stars', cat: 'Internet & retro tech' },
  aero: { head: 'sans', body: 'sans', shape: 'glass', pattern: 'clouds', cat: 'Internet & retro tech' },
  y2k: { head: 'future', body: 'round', shape: 'round', pattern: 'sparkle', cat: 'Internet & retro tech' },
  pixel: { head: 'pixel', body: 'mono', shape: 'pixel', pattern: 'grid', cat: 'Internet & retro tech' },
  meme: { head: 'system', body: 'system', shape: 'window', pattern: 'none', cat: 'Internet & retro tech' },
  weird: { head: 'mono', body: 'system', shape: 'window', pattern: 'none', cat: 'Dreamy & surreal' },
  dream: { head: 'serif', body: 'sans', shape: 'soft', pattern: 'clouds', cat: 'Dreamy & surreal' },
  r50: { head: 'script', body: 'sans', shape: 'retro', pattern: 'checker', cat: 'Decades & retro' },
  r60: { head: 'grotesk', body: 'sans', shape: 'retro', pattern: 'stripes', cat: 'Decades & retro' },
  r70: { head: 'script', body: 'round', shape: 'round', pattern: 'stripes', cat: 'Decades & retro' },
  r80: { head: 'future', body: 'sans', shape: 'neon', pattern: 'grid', cat: 'Decades & retro' },
  r90: { head: 'grotesk', body: 'sans', shape: 'retro', pattern: 'dots', cat: 'Decades & retro' },
  kitsch: { head: 'script', body: 'round', shape: 'retro', pattern: 'checker', cat: 'Decades & retro' },
  noir: { head: 'display', body: 'sans', shape: 'sharp', pattern: 'scanlines', cat: 'Decades & retro' },
  west: { head: 'classic', body: 'serif', shape: 'paper', pattern: 'grain', cat: 'Country & western' },
  folk: { head: 'serif', body: 'serif', shape: 'paper', pattern: 'flowers', cat: 'Folk & cultural' },
  coast: { head: 'serif', body: 'sans', shape: 'soft', pattern: 'waves', cat: 'Coastal & tropical' },
  trop: { head: 'script', body: 'round', shape: 'round', pattern: 'flowers', cat: 'Coastal & tropical' },
  wint: { head: 'serif', body: 'sans', shape: 'soft', pattern: 'sparkle', cat: 'Seasons & holidays' },
  autm: { head: 'serif', body: 'sans', shape: 'paper', pattern: 'grain', cat: 'Seasons & holidays' },
  holi: { head: 'classic', body: 'serif', shape: 'retro', pattern: 'sparkle', cat: 'Seasons & holidays' },
  space: { head: 'future', body: 'sans', shape: 'round', pattern: 'stars', cat: 'Sci-fi & space' },
  fant: { head: 'classic', body: 'serif', shape: 'ornate', pattern: 'stars', cat: 'Fantasy & mystic' },
  myst: { head: 'classic', body: 'serif', shape: 'ornate', pattern: 'sparkle', cat: 'Fantasy & mystic' },
  sport: { head: 'grotesk', body: 'sans', shape: 'sharp', pattern: 'stripes', cat: 'Sporty & outdoors' },
  outd: { head: 'grotesk', body: 'sans', shape: 'sharp', pattern: 'grid', cat: 'Sporty & outdoors' },
  indus: { head: 'grotesk', body: 'mono', shape: 'sharp', pattern: 'grid', cat: 'Industrial & tactical' },
};

/** Named palettes: background, boxes, text, accent, second accent. */
export const PALETTES = Object.fromEntries(
  `linen #f4f1ea #fbf9f4 #2e3836 #4a6b63 #8fafc4
cream #f7f1e3 #fffbf0 #3a3524 #9c7b55 #c9b28d
beige #efe7da #f8f3ea #3b3127 #a58a6a #d8c8b0
sand #f3ead8 #fdf6e8 #3a2f22 #c08a4a #8aa3a8
sage #eef1e8 #f9fbf5 #24301f #5f7a55 #b7a46b
forest #dfe6d8 #eef3ea #1c2a1e #2f5d3a #8a6f4a
moss #e5e2d0 #f1efe2 #2e2a1e #6b7b3a #9c6b3f
earth #efe4d6 #f8f0e5 #33261b #8a5a3b #6b7b4a
terracotta #f6eadf #fff7ef #3a2418 #c0622f #6b8a7a
rust #f3e4d8 #fcf2ea #36200f #a8471f #3f5a6b
honey #fdf3d7 #fffaeb #3d2c0f #c98a12 #7a9a52
sunflower #fff8dc #fffdf0 #3a2e0a #e0a800 #3f6fb5
peach #fff1e8 #fffaf5 #3e261c #e8835a #f2b6a0
coral #fff0ec #ffffff #3a1f1a #ef6a5a #2ec4b6
blush #fbeff0 #fffafa #4a2a30 #c76a7d #e8c4c8
pink #ffeef3 #fff8fa #4a2c36 #e36b98 #b39ddb
hotpink #ffe3f1 #fff5fa #4a0f2e #e0218a #ff8fc7
sakura #fdf0f4 #fffafc #3d2a33 #d9668f #8fb7a2
cherry #fff1f1 #ffffff #3a1418 #c8102e #2f6b3a
red #fbeeee #ffffff #2a1214 #c62828 #1f1f24
wine #2a1418 #3a1d22 #f3e1e3 #c0405a #c9a24a
burgundy #f3e6e6 #fff7f7 #3a1820 #7a1f35 #c9a24a
plum #f3ecf5 #fcf8fd #34203a #7a3b80 #c9a0d0
lavender #f4f0fb #ffffff #2e2a40 #8a74c8 #f0b6d6
lilac #f3eef8 #fcfaff #2e2638 #9b7bc4 #c48aa6
babyblue #eef6ff #ffffff #233040 #5a96d0 #f6c6d8
sky #e8f4fb #ffffff #18303c #2f8fc4 #f2c14e
ocean #e6f3f6 #f8fdfe #10303a #1f7a9a #e6c79a
navy #eef1f7 #ffffff #121c33 #1f3b73 #c8102e
teal #e6f4f1 #f8fdfc #10302b #1f8a7a #e8a35a
mint #ecf8f1 #ffffff #183027 #2f9a6e #f2a7c3
aqua #e0fbff #f5feff #0b2a3a #00a0ad #b46cff
denim #edf1f6 #fafcff #1a2433 #3d5a80 #c9a27a
grey #ededed #f7f7f7 #1d1d1f #5b6470 #a9aeb5
silver #eef0f3 #ffffff #1a1d22 #6e7b8a #b8c4d4
chrome #e8ecf1 #ffffff #121820 #4a6fa5 #c0c8d4
white #ffffff #ffffff #111111 #222222 #999999
mono #ffffff #ffffff #000000 #000000 #777777
black #0f0f12 #1a1a1f #f0f0f5 #c8c8d2 #8a8a9a
charcoal #1c1c1e #26262a #ececec #a6a6b0 #c43a3a
champagne #f6efe4 #fffaf3 #2e2418 #a88a4a #e8c4b8
brown #efe3d4 #f9f1e7 #2e2118 #7a4a2a #b58a5a
coffee #efe4d6 #faf3ea #2e2018 #8a5a3b #c9a27a
chocolate #2a1d16 #382820 #f1e2d2 #d49a6a #8a5a3b
cinnamon #f6ebe0 #fff7ef #3a2214 #a8552a #d8a46a
autumn #f5e8d6 #fff6ea #3a2414 #c0622f #6b7b3a
pumpkin #14110f #211c18 #f5ead8 #ff7a1a #9a6fe0
winter #eef3f8 #ffffff #1c2a3a #4f82ad #b8c9db
ice #eaf6fb #ffffff #13283a #2f8fc4 #b8e2f2
christmas #f6f1ea #fffdf8 #1e2a22 #b22222 #1f6b3a
easter #fbf6ff #ffffff #3a3352 #9b7be0 #6fd3b9
neonpink #120a1a #1e1228 #ffe9f6 #ff2fa0 #00e1ff
neongreen #070a07 #121612 #eaffea #39ff14 #ff00c8
neoncyan #05070d #0d1220 #d6fff5 #00ffc6 #ff2bd6
acid #0b0b0b #161616 #f5ffe0 #c6ff00 #ff3ea5
toxic #0d1a12 #15281c #e6ffe9 #6bff8a #c86bff
vapor #2b1b4a #3b2563 #fde8ff #ff71ce #01cdfe
synth #1a0b2e #2a1446 #ffe8ff #ff2a6d #05d9e8
galaxy #121633 #1c2147 #f2efe6 #b892ff #e8c766
midnight #0f1424 #18203a #e8ecff #9fb4ff #7fe0c4
night #0b0e1a #151a2c #eaf0ff #ffb347 #8ab4ff
blood #120709 #1f0d10 #f3e1e3 #d0203e #8a3c4a
gothpurple #1b1622 #261f2f #f8eaff #c07ae8 #9be7ff
gothpink #1a1418 #261c22 #ffe9f2 #ff6fa8 #c9c9d6
dusk #1f1a16 #2a231d #eadfcd #c99a6b #8a5a3b
sepia #efe1c6 #f8efdc #2e2214 #8a3a1f #3b5a6b
sepiadark #1e1812 #2a221a #efe2cc #c8a46a #7a5a3a
parchment #e8dcc2 #f4ebd6 #2e2416 #7a2b1f #3f5a3a
marble #f4f2ee #ffffff #22222a #7a6a4a #b8b2a8
jade #e9f3ee #f8fcfa #12302a #1f7a5a #c9a24a
imperial #f6ece0 #fffaf2 #2a1410 #b8201f #b8902a
matcha #eef2e4 #fafcf3 #26301f #6a8a42 #c9a27a
desert #f5e6cf #fdf3e3 #3a2614 #b06a2a #5b8a9e
tropical #f2fbf3 #ffffff #13301f #13a35b #ff6f59
flamingo #fff0f5 #ffffff #3a1a2a #ff4f8b #2ec4b6
primary #fffbe6 #ffffff #1a1a2e #e63328 #2f80ed
rainbow #fff7fb #ffffff #2a1a3a #ff4fa3 #4fc3ff
pastel #f6f0ff #ffffff #3d3352 #a07de8 #8fe3cf
candy #fff3fb #ffffff #3a1d3a #ff5fa2 #43d3c4
retro50 #fff6ee #ffffff #1a1a1a #e63946 #2ec4b6
retro60 #fff8ec #ffffff #1a1a1a #ff6b35 #2a9d8f
retro70 #fbefd5 #fff8e6 #3a2410 #d9822b #6b8e23
avocado #f1ecd6 #fbf7e8 #2e2a14 #6a7a1f #c0622f
retro80 #120a24 #1e1236 #fff0ff #ff3fa4 #00e1ff
retro90 #f4f0e8 #ffffff #1a1a2e #6b4ce6 #1fb5a8
khaki #efeadb #f8f5ea #2a2a1c #6e6748 #a8471f
camo #2a2e22 #363b2c #ecebe0 #a8b86a #c09a5a
military #e9e7dc #f5f3ea #23261c #4b5320 #a0522d
industrial #e2e2df #f1f1ef #18191b #50555c #e2622b
concrete #e6e6e2 #ffffff #111111 #111111 #ff5a1f
noir #0e0e10 #18181b #e8e8ea #d0d0d4 #c0344a
blackgold #0f0e0c #1a1814 #f4ead8 #c9a24a #b02a2a
blackred #121212 #1e1e1e #f5f5f5 #ff3030 #ffe600
blackpink #151215 #221c22 #fbeef5 #ff3ea5 #d4af37
flapper #121212 #1c1c1c #f0e6d0 #d4af37 #3f9b8a
victorian #2b1e1e #3a2a28 #efe2cf #c08a4e #8a3d3d
rococo #fbf1f0 #fffafa #3a2a2a #c4808e #8fb4a0
baroque #1e140c #2c1f14 #f3e3c4 #c9a24a #b03a3a
regency #eef0f5 #fbfcff #2a2e3d #5a6fa0 #d9a5a0
egypt #f3e3bd #faf0d6 #2a1f0e #1f6b8a #b8902a
celtic #e8efe4 #f6faf3 #1c2a1e #2f6b3a #b8902a
viking #e3e0d8 #f2efe8 #1e1e1e #6b2d2d #4b5d73
byzantine #2a1630 #3a2142 #f3e7d4 #d4af37 #5aa0c8
japanese #f6f1e7 #fffcf6 #1f1f24 #c8312f #2f4a6b
chinese #fff4ec #fffaf6 #2a1410 #c8102e #b8902a
korean #f3eee8 #fbf9f6 #2a2622 #8a7460 #d9c8b8
mizuiro #eaf7ff #ffffff #1a2f40 #3a9ad0 #b8e2f2
pearl #f7f4f1 #ffffff #2e2a2a #9a8a80 #d9cfe6
silverpink #f4f1f6 #ffffff #2a2430 #b8708f #b8c4d4
blueberry #eef0fb #ffffff #1c1f3d #3f4fb5 #8a74c8
tomato #fff6ec #fffbf5 #3a1e14 #d8442f #4f7a3f
cyberpop #f4f0ff #ffffff #1a1036 #7a3cff #00b8aa
clay #f2ece6 #fbf8f4 #2e2622 #d06a4f #81b29a
glass #e9eff8 #ffffff #142033 #3a6bc0 #8fd3fe
lofi #2a2633 #36313f #f1e6dc #e7a977 #8fa8c8
pixel #0a0a0a #161616 #f5f5f5 #ffcc00 #33cc66
pc98 #10142a #1a2040 #e8ecff #ff6fa8 #6fd3ff
terminal #000000 #0a0a0a #b8ffb8 #33ff33 #33ff33
webblue #e9f0ff #ffffff #0b1640 #0033cc #ff00aa
oldweb #c0c0c0 #dcdcdc #000000 #000080 #008080
aero #dff3ff #f5fbff #03233d #0067b8 #4cae1a
aerodark #071526 #0d2238 #e3f4ff #3fb4ff #58e0a0
eco #e6f6ea #f7fff8 #0f2e1d #1f8a4c #2aa0d8
bling #ffe6f4 #fff6fb #3a1030 #e8239a #b892ff
brazil #fffbe6 #ffffff #13301f #1a8a3a #e0b000
mexico #fff6ea #ffffff #2a1a10 #d6336c #1f9a8a
devil #140808 #200e0e #ffe8e8 #ff3a30 #ff8a00
angel #f7f9ff #ffffff #2e3346 #a08a4a #c9d8ff
ethereal #f6f4fb #ffffff #2e2b3d #8a80c8 #f0d9e7
dreamy #efe9ff #fbf9ff #2a2340 #7a6cc0 #ffd27f
weird #e6f0e6 #ffffff #1c1c1c #3a55ff #c4c4c4
liminal #efe8c8 #f8f2d8 #2e2b1c #8a7a3a #8fa3a8
pool #e3f7fb #ffffff #0f2e3a #1a8fb0 #f2f2f2
mall #f2ecf5 #ffffff #2a2238 #a05ad0 #4fb3b4
casino #0f1a12 #18261c #f4ead8 #c9a24a #e0303a
safari #efe6d2 #f8f2e4 #2e2818 #7a5a2a #4f6b3a
outback #f3e1cc #fbf0e2 #3a2414 #b0562a #2f6b8a`
    .split('\n')
    .map((l) => {
      const [name, bg, surface, ink, accent, accent2] = l.trim().split(/\s+/);
      return [name, { bg, surface, ink, accent, accent2 }];
    }),
);

const CATEGORY_RENAME = { 'Academia & classic': 'Academia', 'Art & design movements': 'Art & design', 'Cute & kawaii': 'Cute & whimsical', 'Spiritual & mystic': 'Fantasy & mystic', 'Sci-fi & futurism': 'Sci-fi & space', 'Coastal, travel & seasons': 'Coastal & tropical' };

/** Best-guess family for a hand-made look (used for its extra decorations). */
function familyOf(l) {
  const by = { gothic: 'goth', pixel: 'web', future: 'cyber', classic: 'hist', script: 'r50', type: 'grunge', hand: 'whim' };
  if (l.shape === 'glass') return 'aero';
  if (l.head === 'future' && (l.shape === 'round' || l.pattern === 'sparkle')) return 'y2k';
  if (l.shape === 'brutal') return 'brut';
  if (l.shape === 'bubbly') return 'cute';
  if (l.shape === 'window') return 'vapor';
  if (l.shape === 'neon') return 'synth';
  return by[l.head] || (l.shape === 'ornate' ? 'acad' : l.shape === 'paper' ? 'indie' : l.shape === 'retro' ? 'r90' : l.shape === 'round' ? 'cozy' : 'soft');
}

const curated = Object.entries(CATALOG).flatMap(([category, text]) =>
  text
    .trim()
    .split('\n')
    .map((line) => {
      const [name, emoji, colors, fonts, shape, pattern, words] = line.split('|').map((x) => x.trim());
      const [bg, surface, ink, accent, accent2] = colors.split(/\s+/);
      const [head, body] = fonts.split(/\s+/);
      const l = { id: slug(name), name, emoji, category: CATEGORY_RENAME[category] || category, bg, surface, ink, accent, accent2, head, body, shape, pattern, words, curated: true };
      return { ...l, family: familyOf(l) };
    }),
);
const curatedById = new Map(curated.map((l) => [l.id, l]));

// Every entry of the wiki index; hand-made looks with the same name win (but take the index family).
const fromIndex = INDEX.trim()
  .split('\n')
  .map((line) => {
    const [name, family, palette, emoji, words] = line.split('|').map((x) => x.trim());
    const id = slug(name);
    const f = FAMILIES[family] || FAMILIES.soft;
    const hand = curatedById.get(id);
    if (hand) return { ...hand, family, category: f.cat, fromIndex: true };
    return { id, name, emoji, category: f.cat, ...(PALETTES[palette] || PALETTES.linen), head: f.head, body: f.body, shape: f.shape, pattern: f.pattern, words, family, fromIndex: true };
  });
const indexIds = new Set(fromIndex.map((l) => l.id));

export const LOOKS = [...fromIndex, ...curated.filter((l) => !indexIds.has(l.id))].sort((a, b) => a.name.localeCompare(b.name));
export const LOOK_CATEGORIES = [...new Set(Object.values(FAMILIES).map((f) => f.cat).concat(curated.map((l) => l.category)))];
const byId = new Map(LOOKS.map((l) => [l.id, l]));
export const lookById = (id) => byId.get(id);

// ---------------------------------------------------------------- fonts, shapes, patterns

export const FONTS = {
  serif: { label: 'Elegant serif', stack: "'Serene Serif', 'Cormorant Garamond', Georgia, serif", scale: 1.12, weight: 500 },
  sans: { label: 'Soft sans', stack: "'Aero Sans', 'Source Sans 3', system-ui, sans-serif", scale: 1, weight: 650 },
  display: { label: 'Editorial serif', stack: "'Look Display', 'Playfair Display', Didot, Georgia, serif", scale: 1, weight: 600 },
  classic: { label: 'Classical capitals', stack: "'Look Classic', 'Cinzel', 'Trajan Pro', Georgia, serif", scale: 0.86, weight: 600 },
  gothic: { label: 'Gothic blackletter', stack: "'Look Gothic', 'UnifrakturMaguntia', 'Old English Text MT', serif", scale: 1.05, weight: 400 },
  pixel: { label: 'Pixel', stack: "'Look Pixel', 'VT323', ui-monospace, monospace", scale: 1.3, weight: 400 },
  hand: { label: 'Handwritten', stack: "'Look Hand', 'Caveat', 'Bradley Hand', cursive", scale: 1.25, weight: 700 },
  type: { label: 'Typewriter', stack: "'Look Type', 'Special Elite', 'American Typewriter', 'Courier New', monospace", scale: 0.95, weight: 400 },
  grotesk: { label: 'Grotesk', stack: "'Look Grotesk', 'Space Grotesk', 'Helvetica Neue', Arial, sans-serif", scale: 1, weight: 700 },
  round: { label: 'Rounded', stack: "'Look Round', 'Nunito', ui-rounded, 'SF Pro Rounded', system-ui, sans-serif", scale: 1, weight: 800 },
  script: { label: 'Retro script', stack: "'Look Script', 'Pacifico', 'Brush Script MT', cursive", scale: 0.95, weight: 400 },
  future: { label: 'Futuristic', stack: "'Look Future', 'Orbitron', 'Eurostile', system-ui, sans-serif", scale: 0.82, weight: 700 },
  mono: { label: 'Monospace', stack: "ui-monospace, 'SF Mono', Menlo, Consolas, 'Courier New', monospace", scale: 0.95, weight: 700 },
  system: { label: 'System', stack: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", scale: 1, weight: 700 },
};
// Body text must stay easy to read, so decorative faces fall back to a readable partner.
const BODY_SAFE = { serif: "'Iowan Old Style', 'Palatino Linotype', Georgia, serif", pixel: FONTS.mono.stack, hand: FONTS.sans.stack, script: FONTS.sans.stack, gothic: FONTS.serif.stack, classic: FONTS.serif.stack, future: FONTS.sans.stack, display: "'Iowan Old Style', Georgia, serif" };
export const bodyStack = (key) => BODY_SAFE[key] || FONTS[key]?.stack || FONTS.sans.stack;

/** Shapes: corner radius, borders and shadows for cards, boxes and buttons. */
export const SHAPES = {
  soft: { label: 'Soft', radius: 22, btn: 999, bw: 1, bs: 'solid', shadow: 'soft' },
  round: { label: 'Round', radius: 30, btn: 999, bw: 1, bs: 'solid', shadow: 'soft' },
  bubbly: { label: 'Bubbly', radius: 28, btn: 999, bw: 2.5, bs: 'solid', shadow: 'pop' },
  sharp: { label: 'Sharp', radius: 2, btn: 2, bw: 1, bs: 'solid', shadow: 'none' },
  brutal: { label: 'Brutalist', radius: 0, btn: 0, bw: 3, bs: 'solid', shadow: 'hard' },
  retro: { label: 'Retro', radius: 12, btn: 12, bw: 2, bs: 'solid', shadow: 'offset' },
  pixel: { label: 'Pixel', radius: 0, btn: 0, bw: 3, bs: 'solid', shadow: 'hard' },
  window: { label: 'Old window', radius: 3, btn: 3, bw: 2, bs: 'outset', shadow: 'none' },
  glass: { label: 'Glass', radius: 20, btn: 999, bw: 1, bs: 'solid', shadow: 'glow', glass: true },
  neon: { label: 'Neon', radius: 12, btn: 12, bw: 1.5, bs: 'solid', shadow: 'neon' },
  ornate: { label: 'Ornate', radius: 6, btn: 6, bw: 3, bs: 'double', shadow: 'soft' },
  paper: { label: 'Paper', radius: 6, btn: 8, bw: 1, bs: 'solid', shadow: 'paper' },
};

export const PATTERNS = ['none', 'grain', 'paper', 'dots', 'grid', 'stripes', 'checker', 'plaid', 'scanlines', 'stars', 'sparkle', 'hearts', 'flowers', 'waves', 'clouds', 'sunset'];

// ---------------------------------------------------------------- colour maths

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export const rgbToHex = (rgb) => '#' + rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
export const mix = (a, b, t) => rgbToHex(hexToRgb(a).map((v, i) => v + (hexToRgb(b)[i] - v) * t)); // t = share of b

export function luminance(hex) {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
export const isDark = (hex) => luminance(hex) < 0.2;

/** Nudge `fg` toward black or white until it reaches `min` contrast on `bg`. */
export function ensureContrast(fg, bg, min) {
  if (contrast(fg, bg) >= min) return fg;
  const target = isDark(bg) ? '#ffffff' : '#000000';
  for (let t = 0.1; t <= 1.0001; t += 0.1) {
    const c = mix(fg, target, t);
    if (contrast(c, bg) >= min) return c;
  }
  return target;
}

/** A dark-mode version of a light look: same hues, night-time values. */
export function darkVersion(l) {
  const night = '#121316';
  return {
    ...l,
    bg: mix(night, l.accent, 0.08),
    surface: mix('#1c1d22', l.accent, 0.1),
    ink: mix(l.bg, '#ffffff', 0.4),
    accent: ensureContrast(mix(l.accent, '#ffffff', 0.25), '#1c1d22', 4.5),
    accent2: mix(l.accent2, '#ffffff', 0.2),
  };
}

// ---------------------------------------------------------------- patterns (real colours, so SVGs work)

const svgUri = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
const rgba = (hex, a) => {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
};

export function patternCss(name, c, dark) {
  const a = c.accent;
  const b = c.accent2;
  const faint = dark ? 0.14 : 0.1;
  switch (name) {
    case 'grain':
      return { image: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${dark ? 1 : 0.3} 0 0 0 0 ${dark ? 1 : 0.3} 0 0 0 0 ${dark ? 1 : 0.28} 0 0 0 ${dark ? 0.25 : 0.45} 0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='.35'/></svg>`), size: '160px' };
    case 'paper':
      return { image: `repeating-linear-gradient(180deg, transparent 0 31px, ${rgba(b, 0.28)} 31px 32px)`, size: 'auto' };
    case 'dots':
      return { image: `radial-gradient(${rgba(a, faint + 0.08)} 1.6px, transparent 1.8px)`, size: '20px 20px' };
    case 'grid':
      return { image: `linear-gradient(${rgba(a, faint)} 1px, transparent 1px), linear-gradient(90deg, ${rgba(a, faint)} 1px, transparent 1px)`, size: '26px 26px' };
    case 'stripes':
      return { image: `repeating-linear-gradient(135deg, ${rgba(a, faint * 0.8)} 0 12px, transparent 12px 24px)`, size: 'auto' };
    case 'checker':
      return { image: `conic-gradient(${rgba(a, faint)} 25%, transparent 0 50%, ${rgba(a, faint)} 0 75%, transparent 0)`, size: '36px 36px' };
    case 'plaid':
      return { image: `repeating-linear-gradient(0deg, ${rgba(a, faint)} 0 6px, transparent 6px 26px, ${rgba(b, faint)} 26px 30px, transparent 30px 52px), repeating-linear-gradient(90deg, ${rgba(a, faint)} 0 6px, transparent 6px 26px, ${rgba(b, faint)} 26px 30px, transparent 30px 52px)`, size: 'auto' };
    case 'scanlines':
      return { image: `repeating-linear-gradient(0deg, ${dark ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.05)'} 0 1px, transparent 1px 3px), radial-gradient(120% 80% at 50% 0%, ${rgba(a, 0.12)}, transparent 60%)`, size: 'auto' };
    case 'stars':
      return { image: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><g fill='${dark ? b : a}' opacity='${dark ? 0.7 : 0.35}'><circle cx='20' cy='30' r='1.2'/><circle cx='120' cy='60' r='1'/><circle cx='190' cy='20' r='1.5'/><circle cx='70' cy='140' r='1'/><circle cx='160' cy='170' r='1.3'/><circle cx='40' cy='200' r='.9'/><path d='M100 110l3 7 7 3-7 3-3 7-3-7-7-3 7-3z'/></g></svg>`), size: '220px' };
    case 'sparkle':
      return { image: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><g fill='${a}' opacity='${dark ? 0.5 : 0.28}'><path d='M40 40l2.5 7 7 2.5-7 2.5-2.5 7-2.5-7-7-2.5 7-2.5z'/><path d='M130 110l2 5 5 2-5 2-2 5-2-5-5-2 5-2z'/><circle cx='150' cy='30' r='1.5'/><circle cx='70' cy='150' r='1.2'/></g></svg>`), size: '180px' };
    case 'hearts':
      return { image: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><path fill='${a}' opacity='${dark ? 0.22 : 0.14}' d='M45 62s-16-9.5-16-20a8.5 8.5 0 0 1 16-4 8.5 8.5 0 0 1 16 4c0 10.5-16 20-16 20z'/></svg>`), size: '90px' };
    case 'flowers':
      return { image: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><g opacity='${dark ? 0.22 : 0.16}'><g fill='${a}'><circle cx='30' cy='22' r='5'/><circle cx='38' cy='30' r='5'/><circle cx='30' cy='38' r='5'/><circle cx='22' cy='30' r='5'/></g><circle cx='30' cy='30' r='3.5' fill='${b}'/><g fill='${b}'><circle cx='90' cy='82' r='4'/><circle cx='96' cy='88' r='4'/><circle cx='90' cy='94' r='4'/><circle cx='84' cy='88' r='4'/></g><circle cx='90' cy='88' r='2.6' fill='${a}'/></g></svg>`), size: '120px' };
    case 'waves':
      return { image: svgUri(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='40'><path d='M0 20 Q15 8 30 20 T60 20 T90 20 T120 20' fill='none' stroke='${a}' stroke-opacity='${dark ? 0.25 : 0.16}' stroke-width='2'/></svg>`), size: '120px 40px' };
    case 'clouds':
      return { image: `radial-gradient(40% 18% at 20% 12%, ${dark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.85)'}, transparent 70%), radial-gradient(35% 16% at 78% 28%, ${dark ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.75)'}, transparent 70%), linear-gradient(180deg, ${rgba(b, dark ? 0.25 : 0.35)}, transparent 55%)`, size: 'auto', fixed: true };
    case 'sunset':
      return { image: `linear-gradient(0deg, ${rgba(a, 0.16)} 1px, transparent 1px) 0 100% / 100% 22px, linear-gradient(180deg, ${rgba(b, 0.35)} 0%, ${rgba(a, 0.28)} 45%, transparent 75%)`, size: 'auto', fixed: true, raw: true };
    default:
      return { image: 'none', size: 'auto' };
  }
}

// ---------------------------------------------------------------- the look → CSS variables

const SHADOWS = {
  none: () => 'none',
  soft: (c, dark) => (dark ? '0 1px 2px rgba(0,0,0,.35), 0 10px 28px rgba(0,0,0,.3)' : '0 1px 2px rgba(20,20,30,.05), 0 10px 28px rgba(20,20,30,.07)'),
  pop: (c) => `0 6px 0 ${rgba(c.accent, 0.35)}`,
  hard: (c) => `5px 5px 0 ${c.ink}`,
  offset: (c) => `4px 4px 0 ${c.accent}`,
  glow: (c, dark) => `0 8px 26px ${rgba(c.accent, dark ? 0.35 : 0.2)}`,
  neon: (c) => `0 0 0 1px ${rgba(c.accent, 0.5)}, 0 0 18px ${rgba(c.accent, 0.35)}`,
  paper: (c, dark) => (dark ? '0 2px 0 rgba(0,0,0,.5)' : '0 1px 0 rgba(0,0,0,.08), 0 3px 8px rgba(0,0,0,.06)'),
};

/**
 * Everything the app needs to draw a look. Colours are checked for contrast so text is always
 * readable, whatever the palette.
 */
export function lookVars(look, wantDark) {
  const nativeDark = isDark(look.bg);
  let c = { ...look };
  if (wantDark && !nativeDark) c = darkVersion(look);
  const dark = isDark(c.bg);
  const ink = ensureContrast(ensureContrast(c.ink, c.surface, 7), c.bg, 7);
  const accentText = ensureContrast(c.accent, c.surface, 4.5);
  const onAccent = contrast('#ffffff', c.accent) >= contrast('#111111', c.accent) ? '#ffffff' : '#111111';
  // Deepen (or lighten) the accent a touch if button text would be under 4.5:1.
  for (let i = 0; i < 12 && contrast(onAccent, c.accent) < 4.5; i++) c.accent = mix(c.accent, onAccent === '#ffffff' ? '#000000' : '#ffffff', 0.05);
  const shape = SHAPES[look.shape] || SHAPES.soft;
  const head = FONTS[look.head] || FONTS.serif;
  const pat = patternCss(look.pattern, c, dark);
  return {
    dark,
    vars: {
      '--bg': c.bg,
      '--surface': c.surface,
      '--ink': ink,
      '--accent': c.accent,
      '--accent2': c.accent2,
      '--accent-text': accentText,
      '--on-accent': onAccent,
      '--font': bodyStack(look.body),
      '--head-font': head.stack,
      '--head-scale': String(head.scale),
      '--head-weight': String(head.weight),
      '--radius': `${shape.radius}px`,
      '--btn-radius': `${shape.btn}px`,
      '--bw': `${shape.bw}px`,
      '--bs': shape.bs,
      '--bcolor': shape.shadow === 'hard' || shape.bw >= 2.5 ? ink : `color-mix(in srgb, ${ink} ${dark ? 22 : 14}%, transparent)`,
      '--shadow': SHADOWS[shape.shadow](c, dark),
      '--surface-alpha': shape.glass ? '72%' : '94%',
      '--blur': shape.glass ? '16px' : '0px',
      '--glow': shape.shadow === 'neon' ? `0 0 10px ${rgba(c.accent, 0.6)}` : 'none',
      '--pattern': pat.raw ? pat.image : pat.image,
      '--pattern-size': pat.size,
      '--pattern-attach': pat.fixed ? 'fixed' : 'scroll',
    },
  };
}

/** Bubble shape for the life-map bubble chart, matched to the look. */
export function bubbleShape(look) {
  const byPattern = { hearts: 'heart', stars: 'star', sparkle: 'star', flowers: 'flower', clouds: 'cloud', waves: 'drop' };
  if (byPattern[look.pattern]) return byPattern[look.pattern];
  if (look.head === 'future' || look.shape === 'neon') return 'hexagon';
  if (look.head === 'gothic' || look.head === 'classic') return 'octagon';
  return { brutal: 'square', sharp: 'square', pixel: 'pixel', window: 'window', retro: 'rounded', paper: 'rounded', ornate: 'octagon', bubbly: 'blob', glass: 'orb' }[look.shape] || 'circle';
}
