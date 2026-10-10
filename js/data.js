// Static content: the "who do you want to be" questionnaire, aesthetic palettes,
// and the skill library used to suggest the 100 skills.

/** Each aesthetic sets the app's colors and font so the app itself matches the vibe. */
export const AESTHETICS = {
  minimal: { name: 'Clean minimalist', emoji: '◻️', font: 'sans', accent: '#2f2f2f', accentDark: '#e8e8e8', bg: '#fafafa', surface: '#ffffff', ink: '#1a1a1a', dbg: '#111111', dsurface: '#1c1c1c', dink: '#f2f2f2', words: 'white space, fewer things, better things' },
  cozy: { name: 'Cozy & warm', emoji: '🕯️', font: 'rounded', accent: '#b5643c', accentDark: '#e59a72', bg: '#fbf4ec', surface: '#fffaf4', ink: '#3b2a20', dbg: '#1d1612', dsurface: '#2a201a', dink: '#f6e8dc', words: 'soft light, blankets, warm drinks, slow mornings' },
  academia: { name: 'Dark academia', emoji: '📚', font: 'serif', accent: '#6b3a2a', accentDark: '#c99a6b', bg: '#f1ebe0', surface: '#f8f3ea', ink: '#2b211b', dbg: '#16120f', dsurface: '#221c17', dink: '#eadfcd', words: 'old books, wool, candlelit study, quiet ambition' },
  japandi: { name: 'Japandi calm', emoji: '🍵', font: 'sans', accent: '#6e7a5e', accentDark: '#aab894', bg: '#f4f1ea', surface: '#fbf9f4', ink: '#2c2b26', dbg: '#141512', dsurface: '#1f201b', dink: '#ecebe3', words: 'natural wood, linen, nothing extra, intention' },
  coastal: { name: 'Coastal & airy', emoji: '🌊', font: 'sans', accent: '#2e7fa3', accentDark: '#7cc4e4', bg: '#f3f8fa', surface: '#ffffff', ink: '#1b2c35', dbg: '#0f171c', dsurface: '#17232a', dink: '#e3f0f5', words: 'sea breeze, white linen, sunlight, salt' },
  cottage: { name: 'Cottagecore', emoji: '🌼', font: 'serif', accent: '#7a8f4e', accentDark: '#b7cc8a', bg: '#f8f5e9', surface: '#fffdf4', ink: '#33301f', dbg: '#171710', dsurface: '#232318', dink: '#eeeedb', words: 'gardens, baking, wildflowers, handmade' },
  luxe: { name: 'Luxe & glam', emoji: '🥂', font: 'serif', accent: '#a8873a', accentDark: '#d9bb6e', bg: '#f7f4ef', surface: '#ffffff', ink: '#1d1a16', dbg: '#0e0d0b', dsurface: '#1a1814', dink: '#f3ece0', words: 'gold details, silk, polished, effortless confidence' },
  boho: { name: 'Earthy boho', emoji: '🌿', font: 'rounded', accent: '#a0612f', accentDark: '#d99a62', bg: '#f6efe4', surface: '#fcf7ef', ink: '#352718', dbg: '#18120c', dsurface: '#251c13', dink: '#f0e3d1', words: 'terracotta, rattan, plants, sun-warmed' },
  sporty: { name: 'Sporty & energetic', emoji: '⚡', font: 'sans', accent: '#e4572e', accentDark: '#ff8a5c', bg: '#f5f7fa', surface: '#ffffff', ink: '#14181f', dbg: '#0c0f14', dsurface: '#161b23', dink: '#eef2f8', words: 'early runs, clean kit, momentum, personal bests' },
  maximal: { name: 'Bold maximalist', emoji: '🎨', font: 'rounded', accent: '#c2185b', accentDark: '#ff6fa5', bg: '#fff6f0', surface: '#ffffff', ink: '#231523', dbg: '#170d17', dsurface: '#241624', dink: '#fbe8f2', words: 'color, pattern, collections, joy' },
  pastel: { name: 'Soft & pastel', emoji: '🎀', font: 'rounded', accent: '#c46b9a', accentDark: '#f0a6cc', bg: '#fdf6fa', surface: '#ffffff', ink: '#3a2833', dbg: '#1a1218', dsurface: '#271c24', dink: '#f9e7f1', words: 'gentle, sweet, light, cared-for' },
  moody: { name: 'Moody & dark', emoji: '🌙', font: 'serif', accent: '#5b4b8a', accentDark: '#a996e6', bg: '#eeedf3', surface: '#f8f7fb', ink: '#1d1b26', dbg: '#0d0c12', dsurface: '#18161f', dink: '#e9e6f3', words: 'deep colors, night walks, focus, mystery' },
};

const yesNo = ['Important (breaks through Do Not Disturb)', 'Normal reminder', 'No alarm'];

export const SECTIONS = [
  {
    id: 'vibe', emoji: '✨', title: 'Your overall vibe',
    intro: 'This sets the look of the whole app and the feel of your plan.',
    questions: [
      { id: 'aesthetic', q: 'Which aesthetic feels most like the life you want?', type: 'aesthetic' },
      { id: 'words', q: 'Pick the words you want people to use about you in a year.', type: 'multi', options: ['Calm', 'Disciplined', 'Playful', 'Elegant', 'Adventurous', 'Creative', 'Grounded', 'Powerful', 'Soft', 'Focused', 'Free', 'Capable', 'Kind', 'Healthy'] },
      { id: 'why', q: 'Who do you want to be 365 days from now?', type: 'text', placeholder: 'e.g. Someone who keeps promises to myself, lives in a calm home and can do 100 new things.' },
    ],
  },
  {
    id: 'home', emoji: '🧽', title: 'Home & cleaning',
    intro: 'Your home should look and feel the way you want, without cleaning taking over your life.',
    questions: [
      { id: 'homeVibe', q: 'How do you want your home to feel?', type: 'single', options: ['Spotless & minimal', 'Lived-in & cozy', 'Organized but relaxed', 'Plant-filled jungle', 'Gallery-like & curated', 'Hotel-fresh'] },
      { id: 'cleanStyle', q: 'What kind of cleaning schedule suits you?', type: 'single', options: ['15-minute daily reset', 'One zone per day', 'One big weekly clean', 'Little bits as I go + monthly deep clean'] },
      { id: 'cleanDays', q: 'Which day(s) for the bigger clean?', type: 'days', default: [6] },
      { id: 'cleanTime', q: 'When do you like to clean?', type: 'single', options: ['Morning', 'Lunch break', 'After work', 'Evening'] },
      { id: 'chores', q: 'Which chores should be on your schedule?', type: 'multi', options: ['Make bed', 'Dishes', 'Kitchen wipe-down', 'Laundry', 'Bathroom', 'Floors', 'Dusting', 'Trash & recycling', 'Change sheets', 'Fridge clean-out', 'Declutter one thing', 'Water plants', 'Windows & mirrors', 'Car'] },
      { id: 'products', q: 'What do you like to clean with?', type: 'multi', options: ['Natural DIY (vinegar, baking soda, castile soap)', 'Eco refill brands', 'Classic store brands', 'Fragrance-free / sensitive skin', 'Disinfecting (bleach, antibacterial)', 'Whatever is cheapest'] },
      { id: 'scent', q: 'What should your home smell like?', type: 'single', options: ['Fresh citrus', 'Lavender & herbal', 'Eucalyptus & mint', 'Clean linen', 'Warm wood & vanilla', 'Nothing / unscented'] },
      { id: 'tools', q: 'Which tools do you have or want?', type: 'multi', options: ['Microfiber cloths', 'Steam mop', 'Robot vacuum', 'Cordless vacuum', 'Scrub brushes', 'Squeegee', 'Handheld steamer', 'Label maker & bins', 'Caddy for supplies'] },
    ],
  },
  {
    id: 'fitness', emoji: '🏋️', title: 'Exercise',
    intro: 'We will build your workouts into your week and your calendar.',
    questions: [
      { id: 'fitDays', q: 'Which days do you want to work out?', type: 'days', default: [1, 3, 5] },
      { id: 'fitTime', q: 'What time of day?', type: 'single', options: ['Early morning', 'Morning', 'Lunch', 'Afternoon', 'Evening'] },
      { id: 'fitLength', q: 'How long per session?', type: 'single', options: ['15 min', '30 min', '45 min', '60 min', '90 min'] },
      { id: 'workouts', q: 'Which kinds of workouts do you enjoy (or want to try)?', type: 'multi', options: ['Strength / weights', 'Pilates', 'Yoga', 'Running', 'Walking', 'HIIT', 'Calisthenics', 'Cycling', 'Swimming', 'Dance', 'Boxing / martial arts', 'Climbing', 'Hiking', 'Mobility & stretching', 'Team sports'] },
      { id: 'where', q: 'Where will you train?', type: 'single', options: ['Gym', 'Home', 'Outdoors', 'Studio / classes', 'A mix'] },
      { id: 'level', q: 'Where are you starting from?', type: 'single', options: ['Brand new', 'Getting back into it', 'Fairly consistent', 'Advanced'] },
    ],
  },
  {
    id: 'body', emoji: '💪', title: 'Your body',
    intro: 'What you want your body to look like, and more importantly what you want it to be able to do.',
    questions: [
      { id: 'bodyLook', q: 'What kind of body are you working toward?', type: 'multi', options: ['Lean & toned', 'Athletic', 'Strong & muscular', 'Long & graceful (dancer)', 'Curvy & strong', 'Healthy & energetic, no look goal'] },
      { id: 'abilities', q: 'What do you want your body to be able to do?', type: 'multi', options: ['Do 1 pull-up', 'Do 10 pull-ups', 'Do 20 push-ups', 'Run 5 km', 'Run 10 km', 'Run a half marathon', 'Touch my toes', 'Full splits', 'Hold a handstand', 'Do a cartwheel', 'Plank for 2 minutes', 'Squat my bodyweight', 'Deadlift my bodyweight', 'Hike a mountain', 'Swim 1 km', 'Climb stairs without getting winded', 'Carry all groceries in one trip', 'Do a muscle-up'] },
      { id: 'feel', q: 'How do you want to feel in your body?', type: 'multi', options: ['More energy', 'Better sleep', 'Less pain', 'Better posture', 'More confident', 'Less stressed'] },
    ],
  },
  {
    id: 'food', emoji: '🥗', title: 'Food',
    questions: [
      { id: 'eatVibe', q: 'What is your food vibe?', type: 'single', options: ['Clean & simple', 'Mediterranean', 'High protein', 'Plant-based', 'Intuitive, no rules', 'Comfort food made healthier'] },
      { id: 'foodHabits', q: 'Which food habits do you want?', type: 'multi', options: ['Drink 2 L of water', 'A vegetable with every meal', 'Cook at home', 'Meal prep on Sunday', 'Protein at breakfast', 'Less sugar', 'No eating after 8pm', 'Take vitamins', 'Less caffeine', 'Less alcohol'] },
    ],
  },
  {
    id: 'routine', emoji: '🌅', title: 'Mornings, evenings & sleep',
    questions: [
      { id: 'wake', q: 'What time do you want to wake up?', type: 'time', default: '06:30' },
      { id: 'bed', q: 'What time do you want to be in bed?', type: 'time', default: '22:30' },
      { id: 'morning', q: 'What should your morning routine include?', type: 'multi', options: ['Glass of water', 'Make bed', 'Stretch', 'Meditate', 'Journal', 'Read 10 pages', 'Skincare', 'Sunlight walk', 'No phone for the first hour', 'Cold shower', 'Plan the day'] },
      { id: 'evening', q: 'And your evening routine?', type: 'multi', options: ['10-minute tidy-up', 'Lay out tomorrow\'s clothes', 'Skincare', 'Read', 'Gratitude list', 'No screens 1h before bed', 'Plan tomorrow', 'Stretch'] },
    ],
  },
  {
    id: 'style', emoji: '👗', title: 'Style & self-care',
    questions: [
      { id: 'styleVibe', q: 'What is your style vibe?', type: 'single', options: ['Minimal capsule', 'Classic & polished', 'Streetwear', 'Boho', 'Sporty', 'Romantic', 'Edgy', 'Old money', 'Whatever is comfy'] },
      { id: 'selfcare', q: 'Which self-care habits do you want?', type: 'multi', options: ['Skincare routine', 'Haircare day', 'Nails', 'Weekly bath / reset night', 'Plan outfits', 'Posture check', 'Floss'] },
    ],
  },
  {
    id: 'mind', emoji: '🧠', title: 'Mind, money & people',
    questions: [
      { id: 'mindHabits', q: 'Mind', type: 'multi', options: ['Meditate', 'Journal', 'Read daily', 'Limit social media', 'Pray / spiritual practice', 'Gratitude', 'Therapy / self check-in', 'Time outside'] },
      { id: 'money', q: 'Money', type: 'multi', options: ['Track spending', 'Save every week', 'No-spend days', 'Budget review on Sunday', 'Invest monthly', 'Learn about investing'] },
      { id: 'people', q: 'People', type: 'multi', options: ['Call family weekly', 'See a friend weekly', 'Date night', 'Meet new people', 'Volunteer', 'Say no more often'] },
    ],
  },
  {
    id: 'environment', emoji: '🏡', title: 'Your environment',
    intro: 'How and where you want to live. Later you can list everything you own in Life → Environment.',
    questions: [
      { id: 'livePlace', q: 'Where do you want to live?', type: 'multi', options: ['Big city', 'Small town', 'Suburbs', 'Countryside', 'By the sea', 'In the mountains', 'Abroad', 'On the road (van / travel)', 'Where I am now'] },
      { id: 'homeType', q: 'What kind of home?', type: 'single', options: ['Studio', 'Apartment', 'House', 'House with a garden', 'Farmhouse / land', 'Tiny home', 'Shared house'] },
      { id: 'liveWith', q: 'Who do you want to live with?', type: 'multi', options: ['Alone', 'Partner', 'Kids', 'Family', 'Friends / roommates', 'Pets'] },
      { id: 'mustHaves', q: 'Must-haves in your space', type: 'multi', options: ['Lots of natural light', 'Plants', 'A home gym corner', 'A desk / office', 'A reading nook', 'A creative studio', 'A big kitchen', 'Outdoor space', 'Quiet', 'Storage for everything', 'A guest room', 'Walkable to shops'] },
      { id: 'ownStyle', q: 'How do you feel about stuff?', type: 'single', options: ['Own as little as possible', 'Few things, high quality', 'Curated collections I love', 'Cozy abundance', 'Haven\'t thought about it'] },
      { id: 'dreamHome', q: 'Describe your dream home in a few words', type: 'text', placeholder: 'e.g. Bright apartment near the park, white walls, wood floors, plants everywhere, a desk by the window.' },
    ],
  },
  {
    id: 'relationships', emoji: '💞', title: 'Relationships',
    intro: 'You can add each person and your own boundaries in Life → People.',
    questions: [
      { id: 'relTypes', q: 'Which relationships are in your life right now?', type: 'multi', options: ['Partner', 'Parents', 'Siblings', 'Children', 'Close friends', 'Friends', 'Coworkers', 'Boss', 'Roommates', 'Neighbours', 'Ex', 'Mentor', 'Community / faith group'] },
      { id: 'relBehave', q: 'How do you want to show up in your relationships?', type: 'multi', options: ['Honest', 'Patient', 'Present (phone down)', 'Reliable', 'Generous', 'Playful', 'Supportive', 'Calm in conflict', 'Good listener', 'Affectionate', 'Independent'] },
      { id: 'relTreated', q: 'How do you want to be treated?', type: 'multi', options: ['With respect', 'Honestly', 'Kindly', 'As an equal', 'With my time respected', 'Supported in my goals', 'Without judgement', 'With affection', 'With space when I need it'] },
      { id: 'relBoundaries', q: 'Boundaries you want to set', type: 'multi', options: ['No work messages after hours', 'No yelling', 'I can say no without explaining', 'My money is my decision', 'Ask before borrowing', 'Phone-free meals', 'Time alone every day', 'No gossip about me', 'Visits need notice', 'I leave when I feel disrespected'] },
    ],
  },
  {
    id: 'skills', emoji: '🎯', title: '100 skills in 365 days',
    intro: 'That is about one new skill every 3–4 days. Pick the areas that excite you, then tap skills to add them. You can change the list any time.',
    questions: [
      { id: 'skillAreas', q: 'Which areas do you want to learn in?', type: 'multi', options: null /* filled from SKILL_LIBRARY */ },
      { id: 'skillPicks', q: 'Tap the skills you want. Aim for 100!', type: 'skills' },
      { id: 'dailyMinutes', q: 'How much time a day can you give to learning?', type: 'single', options: ['15 min', '30 min', '45 min', '60 min', '90 min'] },
      { id: 'learnTime', q: 'When will you practise?', type: 'single', options: ['Morning', 'Lunch', 'Evening', 'Weekend blocks'] },
    ],
  },
  {
    id: 'alarms', emoji: '⏰', title: 'Alarms',
    intro: 'Important alarms are designed to break through Do Not Disturb. The app will show you how to set that up on your phone.',
    questions: [
      { id: 'alarmWake', q: 'Wake-up alarm?', type: 'single', options: yesNo },
      { id: 'alarmWorkout', q: 'Workout alarm?', type: 'single', options: yesNo },
      { id: 'alarmLearn', q: 'Daily skill-practice alarm?', type: 'single', options: yesNo },
      { id: 'alarmBed', q: 'Wind-down / bedtime alarm?', type: 'single', options: yesNo },
    ],
  },
];

export const SKILL_LIBRARY = {
  'Kitchen & food': ['Cook perfect rice', 'Make fresh pasta', 'Bake sourdough bread', 'Knife skills (julienne, dice, chiffonade)', 'Make a French omelette', 'Roast a whole chicken', 'Make 3 sauces from scratch', 'Brew pour-over coffee', 'Pull an espresso shot', 'Ferment kimchi or sauerkraut', 'Make sushi rolls', 'Bake a layer cake', 'Meal prep a week in 2 hours', 'Cook a curry from scratch', 'Make homemade pizza dough'],
  'Home & DIY': ['Fix a leaky tap', 'Patch a hole in drywall', 'Paint a room cleanly', 'Use a power drill properly', 'Hang shelves level', 'Unclog a drain without chemicals', 'Reset a tripped breaker & change a fuse', 'Basic sewing: button & hem', 'Iron a shirt properly', 'Remove any stain', 'Organize a closet (KonMari)', 'Keep a houseplant alive & propagate it', 'Assemble & repair furniture', 'Caulk a bathtub'],
  'Body & movement': ['Do a pull-up', 'Hold a handstand', 'Do a cartwheel', 'Full splits', 'Run 5 km', 'Swim freestyle properly', 'Correct squat & deadlift form', 'Jump rope 5 minutes', 'Do a push-up with perfect form', 'Basic boxing combos', 'Salsa basics', 'Ride a skateboard or rollerblade', 'Do a forward roll & backbend', 'Proper breathing for running'],
  'Outdoors & survival': ['Build a campfire', 'Tie 5 essential knots', 'Read a map & compass', 'Pitch a tent', 'Identify 10 local plants', 'Identify 10 birds by sight or song', 'Basic first aid & CPR', 'Change a car tire', 'Jump-start a car', 'Check car oil & tire pressure', 'Navigate by the stars', 'Forage safely for one wild food', 'Paddle a kayak or canoe'],
  'Creative & art': ['Draw a realistic face', 'Watercolor a landscape', 'Calligraphy / hand lettering', 'Knit a scarf', 'Crochet a granny square', 'Take photos in manual mode', 'Edit photos in Lightroom', 'Throw a pot on the wheel', 'Arrange flowers', 'Write a short story', 'Write a poem you are proud of', 'Make a short video edit', 'Embroider a design', 'Origami crane & 5 models'],
  Music: ['Play 4 chords on guitar', 'Play a full song on piano', 'Read sheet music', 'Sing in tune with warm-ups', 'Keep time on a drum pad', 'Learn a song on ukulele', 'Make a beat in a DAW', 'Whistle loudly with fingers', 'DJ a basic mix'],
  'Tech & digital': ['Touch type 60 wpm', 'Build a simple website (HTML/CSS)', 'Write a Python script', 'Use spreadsheets: formulas & pivot tables', 'Use a password manager & 2FA everywhere', 'Back up all your files properly', 'Use AI tools well', 'Basic video editing', 'Build a budget spreadsheet', 'Design in Canva or Figma', 'Learn 20 keyboard shortcuts', 'Set up home Wi-Fi & network properly'],
  'Money & career': ['Make a zero-based budget', 'Understand index-fund investing', 'Read a payslip & tax return', 'Negotiate a price or salary', 'Write a great CV', 'Ace an interview', 'Give a 5-minute presentation', 'Write a clear professional email', 'Understand credit scores', 'Plan a project end to end', 'Public speaking without notes'],
  'People & communication': ['Remember names', 'Small talk with anyone', 'Active listening', 'Give & receive feedback', 'Tell a good story', 'Handle conflict calmly', 'Say no gracefully', 'Host a dinner party', 'Write a heartfelt letter', 'Make a toast'],
  'Mind & languages': ['100 words in a new language', 'Hold a basic conversation in a new language', 'Speed reading', 'Memory palace technique', 'Meditate 20 minutes', 'Play chess (openings & tactics)', 'Solve a Rubik\'s cube', 'Mental math tricks', 'Learn sign language alphabet & 50 signs', 'Learn the basics of a new religion or philosophy', 'Write in a journal daily for 30 days'],
  'Self-care & style': ['A skincare routine for your skin type', 'Do your own makeup look', 'Style your hair 3 ways', 'Tie a tie', 'Build a capsule wardrobe', 'Give a massage', 'Do your own nails', 'Pack a suitcase in carry-on only', 'Fall asleep fast (sleep hygiene)', 'Posture correction'],
  'Practical life': ['Drive a manual car', 'Parallel park', 'Plan a trip on a budget', 'Grow vegetables from seed', 'Basic bike repair (flat tire, chain)', 'Cut hair at home', 'Wrap a gift beautifully', 'Make a will & organize documents', 'Shuffle cards like a pro', 'Do a magic trick'],
};

SECTIONS.find((s) => s.id === 'skills').questions[0].options = Object.keys(SKILL_LIBRARY);

export const SKILL_CATEGORY_EMOJI = {
  'Kitchen & food': '🍳', 'Home & DIY': '🔧', 'Body & movement': '🤸', 'Outdoors & survival': '🏕️', 'Creative & art': '🎨', Music: '🎵', 'Tech & digital': '💻', 'Money & career': '💼', 'People & communication': '🗣️', 'Mind & languages': '🧠', 'Self-care & style': '💄', 'Practical life': '🧰', Other: '⭐',
};

/** Cleaning-product guidance shown on the Vision page, based on the products answer. */
export const CLEANING_KITS = {
  'Natural DIY (vinegar, baking soda, castile soap)': 'All-purpose spray: 1 part white vinegar, 1 part water, a few drops of essential oil (not on stone). Scrub: baking soda + castile soap paste. Glass: vinegar + water + microfiber.',
  'Eco refill brands': 'One concentrate refill each for all-purpose, bathroom, glass and dish; keep them in matching glass bottles in a caddy.',
  'Classic store brands': 'All-purpose spray, bathroom cleaner, glass cleaner, dish soap, floor cleaner, toilet gel, and a degreaser for the kitchen.',
  'Fragrance-free / sensitive skin': 'Look for "fragrance-free" (not "unscented"), wear gloves, and ventilate when cleaning. Plain soap + water does most jobs.',
  'Disinfecting (bleach, antibacterial)': 'Use disinfectant for the toilet, sink and handles only, leave it on for the label contact time, and never mix bleach with vinegar or ammonia.',
  'Whatever is cheapest': 'Dish soap + water cleans almost everything. Add white vinegar for glass and limescale, baking soda for scrubbing.',
};
