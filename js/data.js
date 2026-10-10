// Static content: the "who do you want to be" questionnaire, aesthetic palettes,
// and the skill library used to suggest the 100 skills.

/**
 * Each aesthetic sets the app's colors and font so the app itself matches the vibe.
 * Two complete looks exist: Tranquil serenity (the default: matte linen, sage, mist, serif
 * headings) and Frutiger Aero (glass, gloss, sky, bubbles). The other aesthetics tint Serenity.
 */
export const AESTHETICS = {
  serene: { name: 'Tranquil serenity', emoji: '☁️', style: 'serene', font: 'serene', accent: '#4a6b63', accent2: '#8fafc4', accentDark: '#a8c1b4', accent2Dark: '#7d9cb2', bg: '#f4f1ea', surface: '#fbf9f4', ink: '#2e3836', dbg: '#151c1d', dsurface: '#1f2829', dink: '#e8e3d9', words: 'still water, linen, sage and mist, soft morning light, slow breath' },
  aero: { name: 'Frutiger Aero', emoji: '🫧', style: 'aero', font: 'aero', accent: '#0067b8', accent2: '#4cae1a', accentDark: '#4fc3f7', accent2Dark: '#7ee05a', bg: '#dff3ff', surface: '#f5fbff', ink: '#03233d', dbg: '#03192e', dsurface: '#0a2f4d', dink: '#e3f4ff', words: 'glossy glass, blue skies, bubbles, clean water, green leaves, optimism' },
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

/**
 * The map of a human life: big domain → area → daily habits.
 * Order = priority: body, mind and soul first, then relationships, then the rest.
 * Habits the plan creates are filed under the same domain and area.
 */
export const DOMAINS = [
  { name: 'Body', emoji: '💪', areas: ['Sleep', 'Food', 'Movement', 'Hygiene & grooming', 'Medical care', 'Recovery'] },
  { name: 'Mind', emoji: '🧠', areas: ['Attention', 'Emotions', 'Thinking', 'Learning', 'Mental rest'] },
  { name: 'Meaning', emoji: '🕊️', areas: ['Identity', 'Values', 'Faith & philosophy', 'Reflection'] },
  { name: 'Relationships', emoji: '💞', areas: ['Family', 'Partner', 'Friends', 'Community', 'Communication'] },
  { name: 'Work & purpose', emoji: '🎯', areas: ['Career', 'Skills', 'Productivity', 'Creative work', 'Contribution'] },
  { name: 'Money', emoji: '💰', areas: ['Earning', 'Spending', 'Saving', 'Growing', 'Protecting'] },
  { name: 'Environment', emoji: '🏡', areas: ['Where I live', 'Home & cleaning', 'Belongings', 'Digital space', 'Life admin', 'Surroundings'] },
  { name: 'Play & rest', emoji: '🎈', areas: ['Hobbies', 'Entertainment', 'Adventure', 'Celebration'] },
  { name: 'Self-management', emoji: '🧭', areas: ['Time', 'Discipline', 'Habit mechanics', 'Choices', 'Alarms'] },
];
export const DOMAIN_NAMES = [...DOMAINS.map((d) => d.name), 'Other'];
export const domainOrder = (name) => {
  const i = DOMAIN_NAMES.indexOf(name);
  return i < 0 ? DOMAIN_NAMES.length : i;
};

// `habit: true` = each picked answer becomes a habit in that area (see plan.js).
const H = (id, area, q, options) => ({ id, area, q, type: 'multi', habit: true, options });

export const SECTIONS = [
  {
    id: 'body', emoji: '💪', title: 'Body',
    intro: 'Sleep, food, movement, grooming, medical care and recovery: the base everything else stands on.',
    questions: [
      { id: 'wake', area: 'Sleep', q: 'What time do you want to wake up?', type: 'time', default: '06:30' },
      { id: 'bed', area: 'Sleep', q: 'What time do you want to be in bed?', type: 'time', default: '22:30' },
      H('windDown', 'Sleep', 'What helps you wind down at night?', ['Dim the lights', 'No screens 1h before bed', 'Read', 'Herbal tea', 'Stretch', 'Shower', 'Same bedtime every night']),
      { id: 'naps', area: 'Sleep', q: 'Naps?', type: 'single', options: ['No naps', 'Power nap (20 min)', 'Only when I really need one'] },
      { id: 'eatVibe', area: 'Food', q: 'What is your food vibe?', type: 'single', options: ['Clean & simple', 'Mediterranean', 'High protein', 'Plant-based', 'Intuitive, no rules', 'Comfort food made healthier'] },
      H('foodHabits', 'Food', 'What, when and how much do you want to eat and drink?', ['Drink 2 L of water', 'A vegetable with every meal', 'Cook at home', 'Meal prep on Sunday', 'Protein at breakfast', 'Less sugar', 'No eating after 8pm', 'Eat slowly, stop at 80% full', 'Less caffeine', 'No caffeine after 2pm', 'Less alcohol']),
      { id: 'fitDays', area: 'Movement', q: 'Which days do you want to work out?', type: 'days', default: [1, 3, 5] },
      { id: 'fitTime', area: 'Movement', q: 'What time of day?', type: 'single', options: ['Early morning', 'Morning', 'Lunch', 'Afternoon', 'Evening'] },
      { id: 'fitLength', area: 'Movement', q: 'How long per session?', type: 'single', options: ['15 min', '30 min', '45 min', '60 min', '90 min'] },
      { id: 'workouts', area: 'Movement', q: 'Which workouts do you enjoy (or want to try)?', type: 'multi', options: ['Strength / weights', 'Pilates', 'Yoga', 'Running', 'Walking', 'HIIT', 'Calisthenics', 'Cycling', 'Swimming', 'Dance', 'Boxing / martial arts', 'Climbing', 'Hiking', 'Mobility & stretching', 'Team sports'] },
      { id: 'where', area: 'Movement', q: 'Where will you train?', type: 'single', options: ['Gym', 'Home', 'Outdoors', 'Studio / classes', 'A mix'] },
      { id: 'level', area: 'Movement', q: 'Where are you starting from?', type: 'single', options: ['Brand new', 'Getting back into it', 'Fairly consistent', 'Advanced'] },
      H('moveHabits', 'Movement', 'Movement through the day', ['Walk 8,000 steps', 'Posture check', 'Stretch 10 min', 'Take the stairs', 'Stand up every hour']),
      { id: 'bodyLook', area: 'Movement', q: 'What kind of body are you working toward?', type: 'multi', options: ['Lean & toned', 'Athletic', 'Strong & muscular', 'Long & graceful (dancer)', 'Curvy & strong', 'Healthy & energetic, no look goal'] },
      { id: 'abilities', area: 'Movement', q: 'What do you want your body to be able to do?', type: 'multi', options: ['Do 1 pull-up', 'Do 10 pull-ups', 'Do 20 push-ups', 'Run 5 km', 'Run 10 km', 'Run a half marathon', 'Touch my toes', 'Full splits', 'Hold a handstand', 'Do a cartwheel', 'Plank for 2 minutes', 'Squat my bodyweight', 'Deadlift my bodyweight', 'Hike a mountain', 'Swim 1 km', 'Climb stairs without getting winded', 'Carry all groceries in one trip', 'Do a muscle-up'] },
      { id: 'feel', area: 'Movement', q: 'How do you want to feel in your body?', type: 'multi', options: ['More energy', 'Better sleep', 'Less pain', 'Better posture', 'More confident', 'Less stressed'] },
      { id: 'styleVibe', area: 'Hygiene & grooming', q: 'What is your style vibe?', type: 'single', options: ['Minimal capsule', 'Classic & polished', 'Streetwear', 'Boho', 'Sporty', 'Romantic', 'Edgy', 'Old money', 'Whatever is comfy'] },
      H('selfcare', 'Hygiene & grooming', 'Washing, teeth, skin, hair and clothes', ['Skincare routine', 'Floss', 'Shower routine', 'Haircare day', 'Nails', 'Plan outfits', 'Clothes ready the night before', 'Weekly bath / reset night']),
      H('medical', 'Medical care', 'Check-ups, medication and looking after illness', ['Take medication on time', 'Take vitamins', 'Yearly check-up', 'Dentist every 6 months', 'Eye test every 2 years', 'Track my health', 'Rest properly when ill']),
      H('recovery', 'Recovery', 'Rest days, breathing, outdoors and sunlight', ['Rest day each week', 'Breathing exercise', 'Time outdoors', 'Morning sunlight', 'Foam roll / massage', 'Hot bath or sauna']),
    ],
  },
  {
    id: 'mind', emoji: '🧠', title: 'Mind',
    intro: 'Attention, emotions, thinking, learning and mental rest.',
    questions: [
      H('attention', 'Attention', 'Focus and phone use', ['No phone for the first hour', 'Screen-time limit', 'One task at a time', 'Deep-work block', 'No phone at meals', 'Sit with boredom 10 min (no phone)']),
      H('emotions', 'Emotions', 'Noticing, calming and expressing feelings', ['Name my feelings', 'Mood check-in', 'Calm-down breathing when stressed', 'Talk it out with someone', 'Stress walk']),
      H('thinking', 'Thinking', 'Self-talk, beliefs, problems and decisions', ['Kind self-talk', 'Question a negative thought', 'Write problems down', 'Sleep on big decisions']),
      H('learning', 'Learning', 'Reading, studying and curiosity', ['Read daily', 'Study a topic I care about', 'Podcast or audiobook', 'Learn a language daily', 'Ask more questions']),
      H('mindHabits', 'Mental rest', 'Quiet time for your mind', ['Meditate', 'Journal', 'Quiet time', 'Daydream walk', 'Therapy / self check-in']),
    ],
  },
  {
    id: 'meaning', emoji: '🕊️', title: 'Meaning & soul',
    intro: 'Who you are, what matters to you, and the look and feel you want your life (and this app) to have.',
    questions: [
      { id: 'aesthetic', area: 'Identity', q: 'What aesthetic and vibe do you want your life to have?', type: 'aesthetic' },
      { id: 'words', area: 'Identity', q: 'Which words do you want people to use about you in a year?', type: 'multi', options: ['Calm', 'Disciplined', 'Playful', 'Elegant', 'Adventurous', 'Creative', 'Grounded', 'Powerful', 'Soft', 'Focused', 'Free', 'Capable', 'Kind', 'Healthy'] },
      { id: 'why', area: 'Identity', q: 'Who do you want to be 365 days from now?', type: 'text', placeholder: 'e.g. Someone who keeps promises to myself, lives in a calm home and can do 100 new things.' },
      { id: 'values', area: 'Values', q: 'What matters most to you?', type: 'multi', options: ['Honesty', 'Kindness', 'Family', 'Health', 'Freedom', 'Growth', 'Faith', 'Courage', 'Creativity', 'Loyalty', 'Adventure', 'Peace', 'Justice', 'Excellence'] },
      { id: 'wontDo', area: 'Values', q: "What won't you do, no matter what?", type: 'text', placeholder: 'e.g. Lie to people I love, stay where I am disrespected, trade my health for money.' },
      H('faith', 'Faith & philosophy', 'Prayer, ritual, study and worship', ['Prayer', 'Meditation', 'Read scripture or philosophy', 'Weekly worship or service', 'A daily ritual', 'Time in nature as practice']),
      H('reflection', 'Reflection', 'Reviewing your days and your life', ['Review my day', 'Gratitude', 'Weekly goals review', 'Monthly reflection', 'Yearly letter to myself', 'Remember life is short']),
    ],
  },
  {
    id: 'relationships', emoji: '💞', title: 'Relationships',
    intro: 'Family, partner, friends, community, and how you communicate. You can add each person and your boundaries in Life → People.',
    questions: [
      { id: 'relTypes', area: 'Family', q: 'Which relationships are in your life right now?', type: 'multi', options: ['Partner', 'Parents', 'Siblings', 'Children', 'Grandparents', 'Close friends', 'Friends', 'Coworkers', 'Boss', 'Roommates', 'Neighbours', 'Ex', 'Mentor', 'Community / faith group'] },
      H('family', 'Family', 'Family habits', ['Call family weekly', 'Visit parents monthly', 'Family dinner', 'Keep our traditions', 'Check in on elders']),
      H('partner', 'Partner', 'Partner habits', ['Daily affection', 'Date night', 'Weekly check-in talk', 'Plan our future together', 'Repair after an argument']),
      H('friends', 'Friends', 'Friend habits', ['Message a friend', 'See a friend weekly', 'Show up for big moments', 'Meet new people']),
      H('community', 'Community', 'Neighbours, groups, coworkers and strangers', ['Know my neighbours', 'Join a group or club', 'Volunteer', 'Kindness to a stranger']),
      { id: 'relBehave', area: 'Communication', q: 'How do you want to show up in your relationships?', type: 'multi', options: ['Honest', 'Patient', 'Present (phone down)', 'Reliable', 'Generous', 'Playful', 'Supportive', 'Calm in conflict', 'Good listener', 'Affectionate', 'Independent'] },
      { id: 'relTreated', area: 'Communication', q: 'How do you want to be treated?', type: 'multi', options: ['With respect', 'Honestly', 'Kindly', 'As an equal', 'With my time respected', 'Supported in my goals', 'Without judgement', 'With affection', 'With space when I need it'] },
      { id: 'relBoundaries', area: 'Communication', q: 'Boundaries you want to set', type: 'multi', options: ['No work messages after hours', 'No yelling', 'I can say no without explaining', 'My money is my decision', 'Ask before borrowing', 'Phone-free meals', 'Time alone every day', 'No gossip about me', 'Visits need notice', 'I leave when I feel disrespected'] },
      H('communication', 'Communication', 'Communication habits', ['Listen without interrupting', 'Say no kindly', 'Apologise properly', 'Honest but kind', 'Say thank you more']),
    ],
  },
  {
    id: 'work', emoji: '🎯', title: 'Work & purpose',
    intro: 'Career, skills, productivity, creative work and contribution. This is where the 100 skills in 365 days live: about one new skill every 3–4 days.',
    questions: [
      { id: 'career', area: 'Career', q: 'Where do you want your work to be heading?', type: 'text', placeholder: 'e.g. Start my own studio, get promoted, finish my degree, change careers.' },
      H('careerHabits', 'Career', 'Career habits', ['Weekly career review', 'Network monthly', 'Update my CV', 'Study for a qualification']),
      { id: 'skillAreas', area: 'Skills', q: 'Which areas do you want to learn in?', type: 'multi', options: null /* filled from SKILL_LIBRARY */ },
      { id: 'skillPicks', area: 'Skills', q: 'Which skills do you want to learn? Aim for 100!', type: 'skills' },
      { id: 'dailyMinutes', area: 'Skills', q: 'How much time a day can you give to learning?', type: 'single', options: ['15 min', '30 min', '45 min', '60 min', '90 min'] },
      { id: 'learnTime', area: 'Skills', q: 'When will you practise?', type: 'single', options: ['Morning', 'Lunch', 'Evening', 'Weekend blocks'] },
      H('productivity', 'Productivity', 'Planning, priorities, starting and finishing', ['Plan tomorrow tonight', 'Top 3 priorities', 'Time-block my day', 'Weekly planning', 'Finish before starting something new']),
      H('creative', 'Creative work', 'Making, sharing and improving things', ['Make something weekly', 'Share my work', 'Daily sketch or writing']),
      H('contribution', 'Contribution', 'Helping, teaching and legacy', ['Help one person a day', 'Teach or mentor someone', 'Volunteer monthly', 'Donate regularly']),
    ],
  },
  {
    id: 'money', emoji: '💰', title: 'Money',
    intro: 'Earning, spending, saving, growing and protecting.',
    questions: [
      H('earning', 'Earning', 'Earning', ['Build a side income', 'Ask for a raise', 'Build valuable skills']),
      H('spending', 'Spending', 'Spending', ['Track spending', 'Budget review on Sunday', 'No-spend days', '24-hour rule before buying wants']),
      H('saving', 'Saving', 'Saving', ['Save every week', 'Build an emergency fund', 'Save for a goal']),
      H('growing', 'Growing', 'Growing', ['Invest monthly', 'Learn about investing']),
      H('protecting', 'Protecting', 'Protecting', ['Pay down debt', 'Review insurance yearly', 'File taxes early', 'Keep money records organised']),
    ],
  },
  {
    id: 'environment', emoji: '🏡', title: 'Environment',
    intro: 'Where you live, your home and cleaning, your belongings, digital space, life admin and surroundings. List everything you own in Life → Environment.',
    questions: [
      { id: 'livePlace', area: 'Where I live', q: 'Where do you want to live?', type: 'multi', options: ['Big city', 'Small town', 'Suburbs', 'Countryside', 'By the sea', 'In the mountains', 'Abroad', 'On the road (van / travel)', 'Where I am now'] },
      { id: 'homeType', area: 'Where I live', q: 'What kind of home?', type: 'single', options: ['Studio', 'Apartment', 'House', 'House with a garden', 'Farmhouse / land', 'Tiny home', 'Shared house'] },
      { id: 'liveWith', area: 'Where I live', q: 'Who do you want to live with?', type: 'multi', options: ['Alone', 'Partner', 'Kids', 'Family', 'Friends / roommates', 'Pets'] },
      { id: 'mustHaves', area: 'Where I live', q: 'Must-haves in your space', type: 'multi', options: ['Lots of natural light', 'Plants', 'A home gym corner', 'A desk / office', 'A reading nook', 'A creative studio', 'A big kitchen', 'Outdoor space', 'Quiet', 'Storage for everything', 'A guest room', 'Walkable to shops'] },
      { id: 'dreamHome', area: 'Where I live', q: 'Describe your dream home in a few words', type: 'text', placeholder: 'e.g. Bright apartment near the park, white walls, wood floors, plants everywhere, a desk by the window.' },
      { id: 'homeVibe', area: 'Home & cleaning', q: 'How do you want your home to feel?', type: 'single', options: ['Spotless & minimal', 'Lived-in & cozy', 'Organized but relaxed', 'Plant-filled jungle', 'Gallery-like & curated', 'Hotel-fresh'] },
      { id: 'cleanStyle', area: 'Home & cleaning', q: 'What kind of cleaning schedule suits you?', type: 'single', options: ['15-minute daily reset', 'One zone per day', 'One big weekly clean', 'Little bits as I go + monthly deep clean'] },
      { id: 'cleanDays', area: 'Home & cleaning', q: 'Which day(s) for the bigger clean?', type: 'days', default: [6] },
      { id: 'cleanTime', area: 'Home & cleaning', q: 'When do you like to clean?', type: 'single', options: ['Morning', 'Lunch break', 'After work', 'Evening'] },
      { id: 'chores', area: 'Home & cleaning', q: 'Which chores should be on your schedule?', type: 'multi', options: ['Make bed', 'Dishes', 'Kitchen wipe-down', 'Laundry', 'Bathroom', 'Floors', 'Dusting', 'Trash & recycling', 'Change sheets', 'Fridge clean-out', 'Declutter one thing', 'Water plants', 'Windows & mirrors', 'Car', 'Small repairs'] },
      { id: 'products', area: 'Home & cleaning', q: 'What do you like to clean with?', type: 'multi', options: ['Natural DIY (vinegar, baking soda, castile soap)', 'Eco refill brands', 'Classic store brands', 'Fragrance-free / sensitive skin', 'Disinfecting (bleach, antibacterial)', 'Whatever is cheapest'] },
      { id: 'scent', area: 'Home & cleaning', q: 'What should your home smell like?', type: 'single', options: ['Fresh citrus', 'Lavender & herbal', 'Eucalyptus & mint', 'Clean linen', 'Warm wood & vanilla', 'Nothing / unscented'] },
      { id: 'tools', area: 'Home & cleaning', q: 'Which cleaning tools do you have or want?', type: 'multi', options: ['Microfiber cloths', 'Steam mop', 'Robot vacuum', 'Cordless vacuum', 'Scrub brushes', 'Squeegee', 'Handheld steamer', 'Label maker & bins', 'Caddy for supplies'] },
      { id: 'ownStyle', area: 'Belongings', q: 'How do you feel about stuff?', type: 'single', options: ['Own as little as possible', 'Few things, high quality', 'Curated collections I love', 'Cozy abundance', "Haven't thought about it"] },
      H('belongings', 'Belongings', 'Buying, organising, maintaining and letting go', ['One in, one out', 'Put things back where they live', 'Maintain what I own', 'Monthly donate bag']),
      H('digital', 'Digital space', 'Files, passwords, inbox and notifications', ['Inbox zero weekly', 'Use a password manager', 'Back up files monthly', 'Turn off non-essential notifications', 'Clear phone photos weekly']),
      H('admin', 'Life admin', 'Documents, appointments, bills and errands', ['Pay bills on time', 'Weekly errands run', 'Keep documents organised', 'Book appointments early']),
      H('surroundings', 'Surroundings', 'Neighbourhood, commute, nature and safety', ['Walk in nature weekly', 'Explore my neighbourhood', 'Make my commute useful', 'Check smoke alarms monthly']),
    ],
  },
  {
    id: 'play', emoji: '🎈', title: 'Play & rest',
    intro: 'Hobbies, entertainment, adventure and celebration.',
    questions: [
      H('hobbies', 'Hobbies', 'Hobbies (sports, art, music, games, crafts)', ['Play music', 'Draw or paint', 'Play a sport', 'Gardening', 'Crafts', 'Games night', 'Photography']),
      H('entertainment', 'Entertainment', 'Shows, books, social media, going out', ['Limit social media to 30 min', 'Read for fun', 'Movie night', 'Go out weekly']),
      H('adventure', 'Adventure', 'Travel and new experiences', ['Try something new monthly', 'Day trip monthly', 'Travel twice a year']),
      H('celebration', 'Celebration', 'Holidays, milestones, humour, fun with others', ['Celebrate small wins', 'Plan birthdays ahead', 'Laugh every day', 'Host friends monthly']),
    ],
  },
  {
    id: 'self', emoji: '🧭', title: 'Self-management',
    intro: 'The layer that runs all the others: time, discipline, habit mechanics, choices and alarms.',
    questions: [
      { id: 'morning', area: 'Time', q: 'What should your morning routine include?', type: 'multi', options: ['Glass of water', 'Make bed', 'Stretch', 'Meditate', 'Journal', 'Read 10 pages', 'Skincare', 'Sunlight walk', 'No phone for the first hour', 'Cold shower', 'Plan the day'] },
      { id: 'evening', area: 'Time', q: 'And your evening routine?', type: 'multi', options: ['10-minute tidy-up', "Lay out tomorrow's clothes", 'Skincare', 'Read', 'Gratitude list', 'No screens 1h before bed', 'Plan tomorrow', 'Stretch'] },
      H('rhythm', 'Time', 'Your weekly rhythm', ['Sunday planning', 'Weekly reset', 'Monthly review']),
      H('discipline', 'Discipline', 'Keeping promises to yourself', ['Keep one promise to myself daily', 'Hardest thing first', 'Wait 24h before giving in to cravings']),
      H('habitMech', 'Habit mechanics', 'Triggers, rewards and tracking', ['Tick off my habits every day', 'Stack new habits onto old ones', 'Reward myself weekly', 'Never miss twice']),
      H('choices', 'Choices', 'Saying no, priorities and setbacks', ['Say no to one thing a week', 'Review my priorities weekly', 'Restart the day after a setback']),
      { id: 'alarmWake', area: 'Alarms', q: 'Wake-up alarm?', type: 'single', options: yesNo },
      { id: 'alarmWorkout', area: 'Alarms', q: 'Workout alarm?', type: 'single', options: yesNo },
      { id: 'alarmLearn', area: 'Alarms', q: 'Daily skill-practice alarm?', type: 'single', options: yesNo },
      { id: 'alarmBed', area: 'Alarms', q: 'Wind-down / bedtime alarm?', type: 'single', options: yesNo },
    ],
  },
];

/** Domain (big area) a section belongs to. */
export const SECTION_DOMAIN = { body: 'Body', mind: 'Mind', meaning: 'Meaning', relationships: 'Relationships', work: 'Work & purpose', money: 'Money', environment: 'Environment', play: 'Play & rest', self: 'Self-management' };

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

SECTIONS.find((s) => s.id === 'work').questions.find((q) => q.id === 'skillAreas').options = Object.keys(SKILL_LIBRARY);

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
