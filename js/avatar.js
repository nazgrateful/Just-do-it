// Draws your avatar and its world as one SVG (360 × 480). Pure string building, no DOM,
// so it can be tested and also saved as a picture.

export const SKIN = ['#ffe0c7', '#f6cfa8', '#eab98f', '#d9a074', '#c08559', '#a26a42', '#7c4c2e', '#5a3420'];
export const HAIR_COLORS = ['#2b1d16', '#4a2f1f', '#7a4a2a', '#b07a45', '#e2c27a', '#f3e2b8', '#b23a2b', '#8a8a8a', '#f1f1f1', '#f48fb1', '#9b7be0', '#58a6d8', '#5fb37a'];
export const CLOTH_COLORS = ['#ffffff', '#f4efe6', '#d9cbb3', '#1f1f24', '#4a6b63', '#8fafc4', '#2e4a7a', '#b23a48', '#e8a1b4', '#f2c14e', '#7a8f4e', '#9b7be0', '#d0743c'];

export const EYE_COLORS = ['#5b3a29', '#2b2b33', '#3f6fb5', '#2f8f83', '#6a9a3a', '#c9892b', '#b23a48', '#8a5bd6', '#e05aa0', '#7a8a9a'];

// Drawn in an anime style: big glossy eyes, pointed hair locks, cel-shaded outlines.
export const OPTIONS = {
  eyes: ['round', 'sparkle', 'happy', 'sleepy', 'wink', 'lashes', 'cool'],
  mouth: ['smile', 'grin', 'small', 'open', 'smirk', 'cat'],
  hair: ['short', 'bob', 'long', 'wavy', 'hime cut', 'twin tails', 'ponytail', 'bun', 'curly', 'braids', 'spiky', 'buzz'],
  top: ['tee', 'hoodie', 'sweater', 'sailor', 'tank', 'blouse', 'blazer', 'dress', 'overalls'],
  bottom: ['jeans', 'trousers', 'skirt', 'shorts', 'leggings'],
  shoes: ['sneakers', 'boots', 'flats', 'heels', 'slippers'],
  extras: ['blush', 'ahoge', 'cat ears', 'star clip', 'glasses', 'sunglasses', 'beanie', 'sunhat', 'cap', 'crown', 'bow', 'flower crown', 'headphones', 'earrings', 'necklace', 'scarf', 'bag', 'freckles'],
};

export const SCENES = {
  'Living room': { outdoor: false, wall: '#efe6d8', floor: 'wood', floorColor: '#b88a5c', sky: 'day', items: ['window', 'sofa', 'plant', 'lamp', 'rug', 'art'] },
  Bedroom: { outdoor: false, wall: '#e6e0f0', floor: 'carpet', floorColor: '#cdbfd8', sky: 'night', items: ['window', 'bed', 'fairy lights', 'rug', 'plant'] },
  Kitchen: { outdoor: false, wall: '#f3efe2', floor: 'tiles', floorColor: '#d8d2c4', sky: 'day', items: ['window', 'kitchen', 'plant', 'clock'] },
  Study: { outdoor: false, wall: '#e9e4d6', floor: 'wood', floorColor: '#8a6a4a', sky: 'sunset', items: ['window', 'bookshelf', 'desk', 'lamp', 'rug'] },
  'Cozy cabin': { outdoor: false, wall: '#a8754c', floor: 'wood', floorColor: '#6e4a2e', sky: 'snow', items: ['window', 'fireplace', 'rug', 'cat', 'candles'] },
  'Cottage garden': { outdoor: true, wall: '#bfe3f2', floor: 'grass', floorColor: '#8cc06b', sky: 'day', items: ['house', 'tree', 'flowers', 'fence'] },
  'Beach house': { outdoor: true, wall: '#bfe6f5', floor: 'sand', floorColor: '#ecd6a6', sky: 'day', items: ['house', 'sea', 'palm'] },
  'City night': { outdoor: true, wall: '#1d2440', floor: 'street', floorColor: '#5a5f6e', sky: 'night', items: ['skyline', 'lamp post', 'sparkles'] },
  'Sakura path': { outdoor: true, wall: '#bfe3f2', floor: 'path', floorColor: '#d9cfc2', sky: 'day', items: ['sakura tree', 'lanterns', 'petals', 'light rays'] },
  'School rooftop': { outdoor: true, wall: '#bfe3f2', floor: 'tiles', floorColor: '#b9bec6', sky: 'sunset', items: ['skyline', 'water tower', 'railing', 'petals'] },
  Classroom: { outdoor: false, wall: '#f1ead8', floor: 'wood', floorColor: '#b88a5c', sky: 'day', items: ['window', 'chalkboard', 'school desks', 'light rays', 'petals'] },
  Shrine: { outdoor: true, wall: '#bfe3f2', floor: 'path', floorColor: '#cfc3b2', sky: 'sunset', items: ['torii', 'sakura tree', 'lanterns', 'petals'] },
};
export const ROOM_ITEMS = ['window', 'light rays', 'petals', 'sparkles', 'sakura tree', 'torii', 'lanterns', 'chalkboard', 'school desks', 'railing', 'water tower', 'sofa', 'bed', 'desk', 'bookshelf', 'kitchen', 'fireplace', 'plant', 'lamp', 'rug', 'art', 'fairy lights', 'clock', 'candles', 'mirror', 'cat', 'dog', 'house', 'tree', 'flowers', 'fence', 'sea', 'palm', 'skyline', 'lamp post'].filter((v, i, a) => a.indexOf(v) === i);
export const FLOORS = ['wood', 'tiles', 'carpet', 'grass', 'sand', 'street', 'path'];
export const SKIES = ['day', 'sunset', 'night', 'rain', 'snow'];

export function defaultAvatar() {
  return {
    skin: SKIN[1], eyes: 'sparkle', eyeColor: EYE_COLORS[2], mouth: 'smile', hair: 'long', hairColor: HAIR_COLORS[1],
    top: 'sweater', topColor: '#8fafc4', bottom: 'jeans', bottomColor: '#2e4a7a', shoes: 'sneakers', shoesColor: '#ffffff',
    extras: ['blush'], name: '',
    scene: { preset: 'Living room', ...structuredCloneSafe(SCENES['Living room']) },
  };
}
function structuredCloneSafe(o) {
  return JSON.parse(JSON.stringify(o));
}

/** Fill in anything missing (older saves, new options). */
export function normalizeAvatar(a) {
  const d = defaultAvatar();
  if (!a || typeof a !== 'object') return d;
  if (a.hair === 'pigtails') a = { ...a, hair: 'twin tails' };
  return { ...d, ...a, extras: Array.isArray(a.extras) ? a.extras : d.extras, scene: { ...d.scene, ...(a.scene || {}), items: Array.isArray(a.scene?.items) ? a.scene.items : d.scene.items } };
}

const shade = (hex, t) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.round(Math.max(0, Math.min(255, t < 0 ? v * (1 + t) : v + (255 - v) * t)));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
};

// ---------------------------------------------------------------- the world

function cumulus(cx, cy, k, tint) {
  // A billowing anime cloud: white puffs with a soft shaded base.
  const puffs = [[0, 0, 26], [-26, 8, 20], [26, 8, 20], [-12, -14, 18], [14, -12, 20], [-42, 16, 14], [42, 16, 14]];
  return `<g opacity=".95">${puffs.map(([dx, dy, r]) => `<circle cx="${cx + dx * k}" cy="${cy + dy * k + 5 * k}" r="${r * k}" fill="${tint}"/>`).join('')}${puffs.map(([dx, dy, r]) => `<circle cx="${cx + dx * k}" cy="${cy + dy * k}" r="${r * k}" fill="#ffffff"/>`).join('')}</g>`;
}

function sky(type, x, y, w, h, base) {
  const id = `${base}-${type}`; // unique per sky type, so two pictures on a page never mix skies
  const grads = {
    day: ['#3d8fe0', '#8ccaf7', '#e6f6ff'], sunset: ['#5b4b9a', '#f08a8a', '#ffd38f'], night: ['#090e2c', '#1f2a66', '#3d3f86'], rain: ['#6f7d8c', '#a3afba', '#cfd7de'], snow: ['#9fb3c8', '#d3dfea', '#f3f7fb'],
  };
  const [a, b, c] = grads[type] || grads.day;
  const m = Math.min(w, h);
  let extra = '';
  if (type === 'day') extra = `<circle cx="${x + w * 0.82}" cy="${y + h * 0.16}" r="${m * 0.2}" fill="#fff8d6" opacity=".35"/><circle cx="${x + w * 0.82}" cy="${y + h * 0.16}" r="${m * 0.08}" fill="#fffbe8"/>` + cumulus(x + w * 0.3, y + h * 0.42, m / 260, '#d6e6f7') + cumulus(x + w * 0.72, y + h * 0.62, m / 360, '#d6e6f7');
  if (type === 'sunset') extra = `<circle cx="${x + w * 0.5}" cy="${y + h * 0.9}" r="${m * 0.22}" fill="#ffe2a0" opacity=".9"/>` + cumulus(x + w * 0.25, y + h * 0.45, m / 280, '#f3a6a6') + cumulus(x + w * 0.78, y + h * 0.3, m / 380, '#e7a3c0');
  if (type === 'night') extra = `<path d="M${x} ${y + h * 0.75} Q ${x + w * 0.5} ${y + h * 0.15} ${x + w} ${y + h * 0.3}" stroke="#b9c3ff" stroke-width="${m * 0.12}" opacity=".12" fill="none"/><circle cx="${x + w * 0.76}" cy="${y + h * 0.24}" r="${m * 0.16}" fill="#f6f1d3" opacity=".18"/><circle cx="${x + w * 0.76}" cy="${y + h * 0.24}" r="${m * 0.08}" fill="#fbf7e4"/>` + [...Array(28)].map((_, k) => `<circle cx="${x + ((k * 53) % 100) * w / 100}" cy="${y + ((k * 37) % 70) * h / 100}" r="${k % 5 ? 1 : 1.8}" fill="#fff" opacity="${k % 3 ? 0.7 : 1}"/>`).join('');
  if (type === 'rain') extra = [...Array(26)].map((_, k) => `<line x1="${x + ((k * 23) % w)}" y1="${y + ((k * 41) % h)}" x2="${x + ((k * 23) % w) - 5}" y2="${y + ((k * 41) % h) + 14}" stroke="#eef4f8" stroke-width="1.2" opacity=".75"/>`).join('');
  if (type === 'snow') extra = [...Array(30)].map((_, k) => `<circle cx="${x + ((k * 29) % w)}" cy="${y + ((k * 47) % h)}" r="${k % 3 ? 1.6 : 2.6}" fill="#fff"/>`).join('');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient><clipPath id="${id}-c"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><g clip-path="url(#${id}-c)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>${extra}</g>`;
}

function floor(type, color) {
  let pat = '';
  if (type === 'wood') pat = [0, 1, 2, 3, 4].map((k) => `<line x1="0" y1="${345 + k * 28}" x2="360" y2="${345 + k * 28}" stroke="${shade(color, -0.18)}" stroke-width="2"/>`).join('') + [60, 170, 280, 110, 230].map((x, k) => `<line x1="${x}" y1="${345 + (k % 5) * 28}" x2="${x}" y2="${373 + (k % 5) * 28}" stroke="${shade(color, -0.18)}" stroke-width="2"/>`).join('');
  if (type === 'tiles') pat = [...Array(9)].map((_, k) => `<line x1="${k * 45}" y1="330" x2="${k * 45 - 40}" y2="480" stroke="${shade(color, -0.15)}"/>`).join('') + [360, 395, 435].map((y) => `<line x1="0" y1="${y}" x2="360" y2="${y}" stroke="${shade(color, -0.15)}"/>`).join('');
  if (type === 'carpet') pat = `<rect x="0" y="330" width="360" height="150" fill="${shade(color, 0.08)}" opacity=".3"/>`;
  if (type === 'grass') pat = [...Array(30)].map((_, k) => `<path d="M${(k * 13) % 360} ${352 + ((k * 31) % 120)} l3 -9 l3 9" fill="none" stroke="${shade(color, -0.25)}" stroke-width="1.5"/>`).join('');
  if (type === 'sand') pat = [...Array(26)].map((_, k) => `<circle cx="${(k * 17) % 360}" cy="${345 + ((k * 37) % 130)}" r="1.5" fill="${shade(color, -0.2)}"/>`).join('');
  if (type === 'path') pat = `<path d="M130 330 L230 330 L300 480 L60 480 Z" fill="${shade(color, 0.12)}"/>` + [0, 1, 2, 3, 4].map((k) => `<path d="M${120 - k * 14} ${352 + k * 28} h${120 + k * 28}" stroke="${shade(color, -0.15)}" stroke-width="2"/>`).join('');
  if (type === 'street') pat = `<rect x="0" y="400" width="360" height="6" fill="#f2d45c" opacity=".7"/><rect x="0" y="330" width="360" height="14" fill="${shade(color, 0.2)}"/>`;
  return `<rect x="0" y="330" width="360" height="150" fill="${color}"/>${pat}`;
}

const ITEMS = {
  window: (s) => `<rect x="32" y="58" width="124" height="118" rx="6" fill="#fff"/>${sky(s.sky, 40, 66, 108, 102, 'winsky')}<rect x="92" y="66" width="4" height="102" fill="#fff"/><rect x="40" y="114" width="108" height="4" fill="#fff"/><rect x="24" y="174" width="140" height="8" rx="3" fill="#fff" opacity=".9"/>`,
  sofa: () => `<rect x="18" y="262" width="150" height="62" rx="16" fill="#c98a6b"/><rect x="10" y="282" width="34" height="56" rx="12" fill="#b67759"/><rect x="142" y="282" width="34" height="56" rx="12" fill="#b67759"/><rect x="34" y="300" width="120" height="30" rx="8" fill="#d89c7c"/>`,
  bed: () => `<rect x="196" y="258" width="150" height="20" rx="6" fill="#8a6a4a"/><rect x="196" y="270" width="150" height="62" rx="8" fill="#f4efe6"/><rect x="196" y="290" width="150" height="42" rx="6" fill="#b8a6d9"/><rect x="304" y="276" width="34" height="18" rx="8" fill="#fff"/><rect x="190" y="232" width="12" height="104" rx="4" fill="#8a6a4a"/>`,
  desk: () => `<rect x="228" y="262" width="122" height="10" rx="3" fill="#7a5a3a"/><rect x="236" y="272" width="8" height="64" fill="#6a4a2e"/><rect x="334" y="272" width="8" height="64" fill="#6a4a2e"/><rect x="262" y="226" width="54" height="36" rx="4" fill="#2b2f38"/><rect x="266" y="230" width="46" height="26" rx="2" fill="#8fc0e8"/><rect x="284" y="262" width="10" height="4" fill="#2b2f38"/>`,
  bookshelf: () => `<rect x="262" y="96" width="86" height="236" rx="4" fill="#8a6440"/>` + [0, 1, 2, 3].map((r) => `<rect x="268" y="${104 + r * 56}" width="74" height="48" fill="#6e4e30"/>` + [0, 1, 2, 3, 4].map((b) => `<rect x="${271 + b * 14}" y="${112 + r * 56 + (b % 2) * 4}" width="11" height="${40 - (b % 2) * 4}" fill="${['#b23a48', '#4a6b63', '#e2b04a', '#2e4a7a', '#d98a9c'][(b + r) % 5]}"/>`).join('')).join(''),
  kitchen: () => `<rect x="196" y="250" width="164" height="84" fill="#f4f1ea"/><rect x="196" y="244" width="164" height="10" fill="#9a8a78"/>` + [0, 1, 2].map((k) => `<rect x="${202 + k * 52}" y="262" width="46" height="64" rx="3" fill="#e7e0d3" stroke="#cfc6b6"/><circle cx="${240 + k * 52}" cy="294" r="2.5" fill="#9a8a78"/>`).join('') + `<rect x="214" y="120" width="130" height="56" rx="4" fill="#e7e0d3" stroke="#cfc6b6"/><ellipse cx="248" cy="238" rx="18" ry="8" fill="#5a5f6e"/><rect x="232" y="226" width="32" height="12" rx="3" fill="#5a5f6e"/>`,
  fireplace: () => `<rect x="14" y="196" width="140" height="140" rx="6" fill="#9a8a80"/><rect x="8" y="188" width="152" height="14" rx="4" fill="#7a6a60"/><rect x="40" y="250" width="88" height="86" rx="40" fill="#2a1d18"/><path d="M84 322c-18 0-24-14-16-28 4 8 10 8 10 0 0-10 8-18 14-22-2 10 12 16 10 30 0 12-8 20-18 20z" fill="#ff9a3c"/><path d="M84 324c-8 0-12-7-8-14 3 4 7 3 7-2 4 3 10 8 9 13-1 2-4 3-8 3z" fill="#ffd36b"/>`,
  plant: () => `<path d="M30 330l8 -44h40l8 44z" fill="#c9785a"/><path d="M58 290c-24-10-34-40-20-58 6 20 18 30 20 58z" fill="#5f8a4e"/><path d="M58 290c22-14 26-44 10-60-4 22-14 32-10 60z" fill="#6f9a5a"/><path d="M58 290c-2-26 6-50 0-74-10 24-8 50 0 74z" fill="#4f7a3e"/>`,
  lamp: () => `<rect x="138" y="190" width="4" height="140" fill="#5a4a3a"/><path d="M116 190h48l-10 -36h-28z" fill="#f2d49a"/><ellipse cx="140" cy="330" rx="16" ry="4" fill="#5a4a3a"/><circle cx="140" cy="186" r="40" fill="#ffe9a8" opacity=".25"/>`,
  rug: (s) => `<ellipse cx="180" cy="428" rx="150" ry="34" fill="${shade(s.wall, -0.25)}" opacity=".85"/><ellipse cx="180" cy="428" rx="122" ry="24" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-dasharray="6 6"/>`,
  art: () => `<rect x="196" y="70" width="70" height="88" rx="3" fill="#7a5a3a"/><rect x="203" y="77" width="56" height="74" fill="#f4efe6"/><circle cx="231" cy="104" r="14" fill="#e3a07a"/><path d="M203 151l20-26 14 16 10-10 12 20z" fill="#7a9a6a"/>`,
  'fairy lights': () => `<path d="M0 26 Q 90 60 180 26 T 360 26" fill="none" stroke="#5a5a5a" stroke-width="1.5"/>` + [...Array(12)].map((_, k) => { const x = 15 + k * 30; const y = 26 + Math.sin((k / 11) * Math.PI * 2) * -2 + (k % 6 < 3 ? 14 : 10); return `<circle cx="${x}" cy="${y}" r="5" fill="${['#ffd36b', '#ff9ec7', '#9fe0ff'][k % 3]}"/><circle cx="${x}" cy="${y}" r="11" fill="#ffd36b" opacity=".18"/>`; }).join(''),
  clock: () => `<circle cx="300" cy="74" r="26" fill="#fff" stroke="#7a5a3a" stroke-width="4"/><line x1="300" y1="74" x2="300" y2="58" stroke="#333" stroke-width="3"/><line x1="300" y1="74" x2="312" y2="80" stroke="#333" stroke-width="3"/>`,
  candles: () => [0, 1, 2].map((k) => `<rect x="${290 + k * 18}" y="${300 - k * 10}" width="12" height="${30 + k * 10}" rx="3" fill="#f6efe2"/><ellipse cx="${296 + k * 18}" cy="${294 - k * 10}" rx="3.5" ry="6" fill="#ffb84a"/><circle cx="${296 + k * 18}" cy="${292 - k * 10}" r="12" fill="#ffd36b" opacity=".2"/>`).join(''),
  mirror: () => `<ellipse cx="308" cy="180" rx="34" ry="62" fill="#c9a24a"/><ellipse cx="308" cy="180" rx="28" ry="56" fill="#dff0f7"/><path d="M290 150l20 -20" stroke="#fff" stroke-width="4" opacity=".7"/>`,
  cat: () => `<ellipse cx="300" cy="420" rx="26" ry="16" fill="#3a3a3a"/><circle cx="322" cy="404" r="13" fill="#3a3a3a"/><path d="M314 394l3-10 5 8zM326 394l4-9 3 10z" fill="#3a3a3a"/><circle cx="318" cy="403" r="2" fill="#ffe27a"/><circle cx="326" cy="403" r="2" fill="#ffe27a"/><path d="M276 420c-14-4-16-20-6-26" fill="none" stroke="#3a3a3a" stroke-width="5" stroke-linecap="round"/>`,
  dog: () => `<ellipse cx="62" cy="420" rx="30" ry="17" fill="#c98a4a"/><circle cx="36" cy="402" r="15" fill="#c98a4a"/><ellipse cx="28" cy="398" rx="6" ry="11" fill="#8a5a2a"/><circle cx="32" cy="400" r="2" fill="#222"/><circle cx="24" cy="408" r="3" fill="#222"/><rect x="44" y="430" width="8" height="14" rx="3" fill="#c98a4a"/><rect x="74" y="430" width="8" height="14" rx="3" fill="#c98a4a"/>`,
  house: (s) => `<path d="M206 196l72 -62 72 62z" fill="${shade(s.wall === '#bfe6f5' ? '#5d9ec2' : '#b5653a', 0)}"/><rect x="218" y="194" width="120" height="140" fill="${s.wall === '#bfe6f5' ? '#f4f8fb' : '#f3e6d0'}"/><rect x="262" y="270" width="32" height="64" rx="3" fill="#7a5a3a"/><circle cx="288" cy="304" r="2.5" fill="#e2c27a"/><rect x="230" y="214" width="30" height="30" fill="#bfe3f2" stroke="#fff" stroke-width="3"/><rect x="296" y="214" width="30" height="30" fill="#bfe3f2" stroke="#fff" stroke-width="3"/><rect x="306" y="140" width="14" height="30" fill="#8a6a5a"/>`,
  tree: () => `<rect x="44" y="230" width="18" height="104" fill="#7a5a3a"/><circle cx="53" cy="214" r="44" fill="#6f9a5a"/><circle cx="26" cy="236" r="26" fill="#5f8a4e"/><circle cx="82" cy="234" r="28" fill="#7aa864"/>`,
  flowers: () => [20, 60, 110, 250, 300, 340].map((x, k) => `<line x1="${x}" y1="${370 + (k % 2) * 30}" x2="${x}" y2="${350 + (k % 2) * 30}" stroke="#4f7a3e" stroke-width="2"/><circle cx="${x}" cy="${348 + (k % 2) * 30}" r="6" fill="${['#ff8fb1', '#ffd36b', '#b392f0', '#ff7a59'][k % 4]}"/><circle cx="${x}" cy="${348 + (k % 2) * 30}" r="2" fill="#fff6c9"/>`).join(''),
  fence: () => `<rect x="0" y="300" width="360" height="6" fill="#f4efe6"/><rect x="0" y="318" width="360" height="6" fill="#f4efe6"/>` + [...Array(13)].map((_, k) => `<path d="M${k * 30 + 4} 334v-44l6 -8 6 8v44z" fill="#fbf8f2"/>`).join(''),
  sea: () => `<rect x="0" y="262" width="360" height="70" fill="#4fb3d9"/><path d="M0 280 q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke="#e8f8ff" stroke-width="2"/><path d="M0 306 q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke="#e8f8ff" stroke-width="2" opacity=".7"/>`,
  palm: () => `<path d="M60 334c4-60 10-110 30-150" fill="none" stroke="#8a6a4a" stroke-width="10" stroke-linecap="round"/><path d="M90 184c-30-10-56 0-66 14 22-6 40-4 66-14zM90 184c26-16 52-12 64 0-22-2-40 0-64 0zM90 184c-10-24-4-46 10-56-2 20 0 36-10 56zM90 184c-28 4-44 22-48 38 16-14 30-24 48-38z" fill="#4f9a4e"/>`,
  skyline: () => [[10, 150, 50], [64, 110, 40], [108, 170, 46], [216, 120, 44], [264, 160, 40], [308, 100, 46]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${330 - y}" fill="#2b3156"/>` + [...Array(Math.floor((330 - y) / 22))].map((_, r) => `<rect x="${x + 8}" y="${y + 10 + r * 22}" width="8" height="10" fill="${r % 3 ? '#ffd36b' : '#3a4170'}"/><rect x="${x + w - 16}" y="${y + 10 + r * 22}" width="8" height="10" fill="${r % 2 ? '#ffd36b' : '#3a4170'}"/>`).join('')).join(''),
  'light rays': (s) => (s.outdoor ? `<g opacity=".22">${[0, 1, 2, 3].map((k) => `<path d="M300 0 L${120 + k * 40} 330 L${150 + k * 40} 330 Z" fill="#fffbe0"/>`).join('')}</g>` : `<path d="M40 70 L156 70 L300 330 L110 330 Z" fill="#fffbe6" opacity=".22"/>`),
  'sakura tree': () => `<path d="M70 334c4-50 0-90-12-120M66 260c14-16 30-22 44-24" stroke="#6a4a3e" stroke-width="12" fill="none" stroke-linecap="round"/>` + [[58, 190, 40], [26, 214, 28], [96, 206, 32], [70, 158, 30], [118, 236, 22], [36, 250, 20]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f7b7cf"/><circle cx="${x - r * 0.25}" cy="${y - r * 0.3}" r="${r * 0.55}" fill="#fcd6e4"/>`).join(''),
  torii: () => `<rect x="214" y="150" width="12" height="184" fill="#d2402f"/><rect x="314" y="150" width="12" height="184" fill="#d2402f"/><path d="M196 140 Q270 124 344 140 L344 152 Q270 138 196 152 Z" fill="#2b2b33"/><rect x="200" y="150" width="140" height="10" fill="#d2402f"/><rect x="206" y="176" width="128" height="9" fill="#d2402f"/><rect x="264" y="160" width="12" height="16" fill="#d2402f"/>`,
  lanterns: () => `<path d="M0 40 Q 180 80 360 40" fill="none" stroke="#5a3a2a" stroke-width="1.5"/>` + [40, 110, 180, 250, 320].map((x, k) => `<line x1="${x}" y1="${48 + Math.sin((x / 360) * Math.PI) * 14}" x2="${x}" y2="${58 + Math.sin((x / 360) * Math.PI) * 14}" stroke="#5a3a2a"/><ellipse cx="${x}" cy="${72 + Math.sin((x / 360) * Math.PI) * 14}" rx="12" ry="15" fill="${k % 2 ? '#e8503a' : '#f4d06f'}"/><ellipse cx="${x}" cy="${72 + Math.sin((x / 360) * Math.PI) * 14}" rx="18" ry="20" fill="#ffd36b" opacity=".18"/>`).join(''),
  chalkboard: () => `<rect x="178" y="66" width="170" height="104" rx="4" fill="#7a5a3a"/><rect x="184" y="72" width="158" height="92" fill="#2f5a46"/><path d="M196 96h70M196 112h96M196 128h56" stroke="#e8efe8" stroke-width="2.5" opacity=".8" stroke-linecap="round"/><text x="300" y="100" font-family="sans-serif" font-size="14" fill="#f4d06f">頑張って</text><rect x="184" y="164" width="158" height="5" fill="#a88a6a"/>`,
  'school desks': () => [[214, 286], [292, 296]].map(([x, y]) => `<rect x="${x}" y="${y}" width="58" height="8" rx="2" fill="#c49a6c"/><rect x="${x + 4}" y="${y + 8}" width="4" height="34" fill="#7a7f88"/><rect x="${x + 50}" y="${y + 8}" width="4" height="34" fill="#7a7f88"/>`).join(''),
  railing: () => `<rect x="0" y="282" width="360" height="5" fill="#9aa3ad"/><rect x="0" y="312" width="360" height="4" fill="#9aa3ad"/>` + [...Array(19)].map((_, k) => `<rect x="${k * 20}" y="282" width="3" height="50" fill="#8a929c"/>`).join(''),
  'water tower': () => `<rect x="268" y="150" width="70" height="60" rx="6" fill="#d8dde3"/><rect x="268" y="150" width="70" height="10" fill="#c3c9d0"/><path d="M276 210l-6 72M330 210l6 72M286 210l-2 72M320 210l2 72" stroke="#8a929c" stroke-width="3"/>`,
  petals: () => [...Array(16)].map((_, k) => { const x = (k * 67) % 350 + 5; const y = (k * 113) % 440 + 10; const r = (k * 47) % 180; return `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="2.6" fill="#f9b8d0" transform="rotate(${r} ${x} ${y})" opacity=".9"/>`; }).join(''),
  sparkles: () => [...Array(9)].map((_, k) => { const x = (k * 71) % 340 + 10; const y = (k * 97) % 300 + 20; const s = 3 + (k % 3) * 2; return `<path d="M${x} ${y - s * 2}l${s * 0.5} ${s * 1.5} ${s * 1.5} ${s * 0.5}-${s * 1.5} ${s * 0.5}-${s * 0.5} ${s * 1.5}-${s * 0.5}-${s * 1.5}-${s * 1.5}-${s * 0.5} ${s * 1.5}-${s * 0.5}z" fill="#fffbe0" opacity=".9"/>`; }).join(''),
  'lamp post': () => `<rect x="300" y="200" width="6" height="134" fill="#2a2a32"/><path d="M290 200h26l-5 -16h-16z" fill="#2a2a32"/><circle cx="303" cy="206" r="34" fill="#ffd36b" opacity=".22"/>`,
};
// Back items are drawn first; small floor items last.
const ORDER = ['light rays', 'sea', 'skyline', 'water tower', 'house', 'torii', 'tree', 'sakura tree', 'palm', 'fence', 'railing', 'window', 'chalkboard', 'lanterns', 'art', 'clock', 'mirror', 'bookshelf', 'kitchen', 'fireplace', 'fairy lights', 'sofa', 'bed', 'desk', 'lamp', 'lamp post', 'school desks', 'rug', 'plant', 'candles', 'flowers', 'cat', 'dog', 'petals', 'sparkles'];

const FRONT = ['plant', 'candles', 'flowers', 'cat', 'dog', 'petals', 'sparkles'];
const has = (scene, k) => (scene.items || []).includes(k);

/** Everything behind the avatar: wall or sky, floor, furniture. */
export function worldSvg(s) {
  const back = s.outdoor
    ? sky(s.sky, 0, 0, 360, 330, 'bgsky')
    : `<defs><linearGradient id="wallg-${s.wall.replace('#', '')}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${shade(s.wall, 0.12)}"/><stop offset="1" stop-color="${shade(s.wall, -0.08)}"/></linearGradient></defs><rect width="360" height="330" fill="url(#wallg-${s.wall.replace('#', '')})"/><rect y="300" width="360" height="30" fill="${shade(s.wall, -0.1)}"/><rect y="318" width="360" height="12" fill="${shade(s.wall, -0.2)}"/>`;
  return back + floor(s.floor, s.floorColor) + ORDER.filter((k) => has(s, k) && !FRONT.includes(k)).map((k) => ITEMS[k](s)).join('');
}
/** Small things that stand in front of the avatar (plants, pets…). */
export function worldFrontSvg(s) {
  return ORDER.filter((k) => has(s, k) && FRONT.includes(k)).map((k) => ITEMS[k](s)).join('');
}

// ---------------------------------------------------------------- the avatar

// Anime hair: locks that end in points, a darker underside and a shine band.
function hairBack(style, c) {
  const d = shade(c, -0.18);
  const tips = (y, x0, x1, n, depth) => [...Array(n + 1)].map((_, k) => `L${x1 - ((x1 - x0) * k) / n} ${y + (k % 2 ? -depth : 0)}`).join(' ');
  switch (style) {
    case 'bob': return `<path d="M120 206C116 152 146 126 180 126S244 152 240 206L242 262 ${tips(262, 118, 242, 8, 12).replace(/^L/, 'L')} L118 262Z" fill="${d}"/>`;
    case 'long': case 'hime cut': return `<path d="M118 206C114 150 146 124 180 124S246 150 242 206C246 262 250 320 246 366 ${tips(366, 114, 246, 10, 22)} C110 320 114 262 118 206Z" fill="${d}"/>`;
    case 'wavy': return `<path d="M116 206C112 150 146 124 180 124S248 150 244 206C252 236 238 260 250 288C258 312 240 330 248 352 ${tips(352, 112, 248, 8, 18)} C120 330 102 312 110 288C122 260 108 236 116 206Z" fill="${d}"/>`;
    case 'ponytail': return `<path d="M120 206C116 152 146 128 180 128S244 152 240 206L236 250L124 250Z" fill="${d}"/><path d="M226 150C276 150 284 220 270 290L262 330 252 300 244 334 238 296C252 250 250 200 226 150Z" fill="${d}"/>`;
    case 'twin tails': return `<path d="M120 206C116 152 146 128 180 128S244 152 240 206L236 250L124 250Z" fill="${d}"/>` + [[-1, 118], [1, 242]].map(([dir, x]) => `<path d="M${x} 168C${x + dir * 46} 180 ${x + dir * 54} 260 ${x + dir * 40} 340L${x + dir * 30} 382 ${x + dir * 26} 350 ${x + dir * 14} 378 ${x + dir * 14} 330C${x + dir * 26} 270 ${x + dir * 18} 210 ${x} 190Z" fill="${d}"/><circle cx="${x + dir * 4}" cy="172" r="7" fill="#e8503a"/>`).join('');
    case 'braids': return `<path d="M120 206C116 152 146 128 180 128S244 152 240 206L236 250L124 250Z" fill="${d}"/>` + [0, 1, 2, 3, 4].map((k) => `<ellipse cx="132" cy="${262 + k * 17}" rx="10" ry="10" fill="${k % 2 ? c : d}"/><ellipse cx="228" cy="${262 + k * 17}" rx="10" ry="10" fill="${k % 2 ? c : d}"/>`).join('');
    case 'curly': return [[-48, -6], [-54, 22], [-42, 48], [48, -6], [54, 22], [42, 48], [0, -40], [-30, -30], [30, -30]].map(([dx, dy]) => `<circle cx="${180 + dx}" cy="${208 + dy}" r="22" fill="${d}"/>`).join('');
    case 'bun': return `<path d="M120 206C116 152 146 128 180 128S244 152 240 206L236 244L124 244Z" fill="${d}"/><circle cx="180" cy="122" r="24" fill="${c}"/><path d="M164 112q16 -10 32 0" stroke="${shade(c, 0.35)}" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    case 'spiky': return `<path d="M118 214L100 190 124 182 106 150 136 152 132 118 160 136 170 102 186 132 206 104 212 138 240 122 234 156 262 160 240 184 260 204 238 210Z" fill="${d}"/>`;
    case 'buzz': return '';
    default: return `<path d="M120 206C116 152 146 128 180 128S244 152 240 206L238 236 230 222 226 246 132 246 128 222 122 236Z" fill="${d}"/>`;
  }
}
function hairFront(style, c) {
  const hi = shade(c, 0.35);
  const shine = `<path d="M140 168Q180 150 220 168" stroke="${hi}" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7" stroke-dasharray="14 8"/>`;
  // Pointed bangs over the forehead.
  const bangs = `<path d="M126 206C124 158 150 134 180 134C210 134 236 158 234 206L228 186 222 214 212 182 202 208 192 178 182 206 172 178 162 208 150 184 142 214 134 188Z" fill="${c}"/>`;
  const sideLocks = `<path d="M128 198C122 228 124 256 132 276L138 254 140 274C142 246 140 222 138 200Z" fill="${c}"/><path d="M232 198C238 228 236 256 228 276L222 254 220 274C218 246 220 222 222 200Z" fill="${c}"/>`;
  switch (style) {
    case 'buzz': return `<path d="M130 202C130 162 152 140 180 140S230 162 230 202C216 182 198 176 180 176S144 182 130 202Z" fill="${c}" opacity=".9"/>`;
    case 'hime cut': return `<path d="M126 206C124 158 150 134 180 134S236 158 234 206L234 198H126Z" fill="${c}"/><path d="M128 196H232" stroke="${shade(c, -0.15)}" stroke-width="2"/>` + `<path d="M126 196V284L134 300 142 282V196Z" fill="${c}"/><path d="M234 196V284L226 300 218 282V196Z" fill="${c}"/>` + shine;
    case 'spiky': return `<path d="M126 210L118 176 140 186 134 150 156 170 166 138 180 166 196 138 204 170 226 150 220 186 242 176 234 210 222 190 212 214 196 186 180 210 164 186 148 214 138 190Z" fill="${c}"/>` + shine;
    case 'curly': return [...Array(9)].map((_, k) => `<circle cx="${136 + k * 11}" cy="${170 - Math.sin((k / 8) * Math.PI) * 18}" r="16" fill="${k % 2 ? c : shade(c, -0.08)}"/>`).join('');
    case 'long': case 'wavy': case 'twin tails': return bangs + sideLocks + shine;
    default: return bangs + shine;
  }
}
function eyes(type, color = '#3f6fb5', brow = '#3a2a24', skin = '#f6cfa8') {
  const L = 160, R = 200, Y = 220;
  const ink = '#1f1a24';
  // Gradient ids include the colour so several avatars on one page don't share them.
  const gid = `irisg-${color.replace('#', '')}`;
  const defs = `<defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${shade(color, -0.45)}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="${shade(color, 0.45)}"/></linearGradient></defs>`;
  const brows = `<path d="M${L - 11} ${Y - 21}q11 -6 21 -1M${R - 10} ${Y - 22}q10 -5 21 1" stroke="${brow}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  const closed = (x, up = true) => `<path d="M${x - 12} ${Y + 2}q12 ${up ? -12 : 10} 24 0" stroke="${ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  const open = (x, k, { star = false, lid = false, lashes = false, cool = false } = {}) => {
    const side = k ? 1 : -1;
    const lidY = lid ? Y - 2 : cool ? Y - 6 : Y - 12;
    return `
      <ellipse cx="${x}" cy="${Y + 1}" rx="11" ry="13" fill="#ffffff" stroke="none"/>
      <ellipse cx="${x}" cy="${Y + 2}" rx="9" ry="12" fill="url(#${gid})" stroke="none"/>
      <ellipse cx="${x}" cy="${Y + 3}" rx="4.2" ry="6.5" fill="${shade(color, -0.7)}" stroke="none"/>
      ${star ? `<path d="M${x + 3} ${Y - 9}l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="#fff" stroke="none"/>` : `<ellipse cx="${x + 3}" cy="${Y - 4}" rx="3.6" ry="4.4" fill="#fff" stroke="none"/>`}
      <circle cx="${x - 4}" cy="${Y + 7}" r="1.8" fill="#fff" stroke="none"/>
      ${lid || cool ? `<path d="M${x - 13} ${lidY - 14}h26v${14 + (lid ? 3 : 0)}h-26z" fill="${skin}" stroke="none"/>` : ''}
      <path d="M${x - 13} ${lidY + 3}q13 -9 26 -1" stroke="${ink}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <path d="M${x + side * 12} ${lidY + 2}l${side * 5} -3" stroke="${ink}" stroke-width="2.6" stroke-linecap="round"/>
      ${lashes ? `<path d="M${x + side * 10} ${lidY - 2}l${side * 5} -6M${x + side * 5} ${lidY - 5}l${side * 3} -6" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>` : ''}
      <path d="M${x - 8} ${Y + 14}q8 3 16 0" stroke="${shade(color, -0.4)}" stroke-width="1.2" fill="none" opacity=".6"/>`;
  };
  let out;
  switch (type) {
    case 'happy': out = closed(L) + closed(R); break;
    case 'sleepy': out = open(L, 0, { lid: true }) + open(R, 1, { lid: true }); break;
    case 'wink': out = open(L, 0, { star: true }) + closed(R); break;
    case 'lashes': out = open(L, 0, { lashes: true }) + open(R, 1, { lashes: true }); break;
    case 'cool': out = open(L, 0, { cool: true }) + open(R, 1, { cool: true }); break;
    case 'round': out = open(L, 0) + open(R, 1); break;
    default: out = open(L, 0, { star: true }) + open(R, 1, { star: true });
  }
  return defs + brows + out;
}
function mouth(type) {
  const ink = '#7a2e3a';
  switch (type) {
    case 'grin': return `<path d="M171 248h18q-1 11 -9 11t-9 -11z" fill="#9a3040" stroke="${ink}" stroke-width="1.2"/><path d="M174 255q6 -4 12 0" fill="#f08a9a" stroke="none"/>`;
    case 'small': return `<path d="M177 250q3 2 6 0" stroke="${ink}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    case 'open': return `<path d="M174 248q6 12 12 0z" fill="#9a3040" stroke="${ink}" stroke-width="1.2"/>`;
    case 'smirk': return `<path d="M173 251q8 1 14 -5" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    case 'cat': return `<path d="M171 248q4.5 5 9 0q4.5 5 9 0" stroke="${ink}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    default: return `<path d="M173 249q7 6 14 0" stroke="${ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  }
}

function clothes(a) {
  const tc = a.topColor;
  const td = shade(tc, -0.15);
  const bc = a.bottomColor;
  const sk = a.skin;
  const dress = a.top === 'dress';
  const overalls = a.top === 'overalls';
  let out = '';
  // legs
  const legTop = 352;
  const legColor = dress || ['skirt', 'shorts'].includes(a.bottom) ? sk : bc;
  out += `<rect x="152" y="${legTop}" width="24" height="86" rx="10" fill="${legColor}"/><rect x="184" y="${legTop}" width="24" height="86" rx="10" fill="${legColor}"/>`;
  if (!dress && !overalls) {
    if (a.bottom === 'shorts') out += `<path d="M144 346h72l4 40h-34l-6 -16-6 16h-34z" fill="${bc}"/>`;
    else if (a.bottom === 'skirt') out += `<path d="M142 344h76l18 56h-112z" fill="${bc}"/><path d="M150 360l-8 38M180 360v40M210 360l8 38" stroke="${shade(bc, -0.15)}" stroke-width="2"/>`;
    else {
      out += `<path d="M144 344h72v8l-6 86h-24l-6 -70-6 70h-24l-6 -86z" fill="${bc}"/>`;
      if (a.bottom === 'jeans') out += `<path d="M176 352v60" stroke="${shade(bc, 0.25)}" stroke-width="2" stroke-dasharray="4 3"/>`;
    }
  }
  // arms (skin) then sleeves
  out += `<rect x="116" y="278" width="20" height="78" rx="10" fill="${sk}"/><rect x="224" y="278" width="20" height="78" rx="10" fill="${sk}"/><circle cx="126" cy="358" r="11" fill="${sk}"/><circle cx="234" cy="358" r="11" fill="${sk}"/>`;
  const sleeve = { sailor: 314, tee: 306, blouse: 314, hoodie: 346, sweater: 346, blazer: 346, dress: 300, overalls: 306, tank: 0 }[a.top] ?? 306;
  if (sleeve) out += `<rect x="114" y="276" width="24" height="${sleeve - 276}" rx="10" fill="${dress ? tc : overalls ? '#ffffff' : tc}"/><rect x="222" y="276" width="24" height="${sleeve - 276}" rx="10" fill="${dress ? tc : overalls ? '#ffffff' : tc}"/>`;
  // torso
  if (dress) out += `<path d="M138 276h84l6 50 26 78h-148l26 -78z" fill="${tc}"/><path d="M146 330h68" stroke="${td}" stroke-width="4"/>`;
  else if (overalls) out += `<rect x="136" y="274" width="88" height="80" rx="16" fill="#ffffff"/><path d="M146 300h68v54h-68z" fill="${tc}"/><path d="M150 278v24M210 278v24" stroke="${tc}" stroke-width="6"/><path d="M144 344h72v8l-6 86h-24l-6 -70-6 70h-24l-6 -86z" fill="${tc}"/>`;
  else {
    out += `<rect x="136" y="274" width="88" height="80" rx="16" fill="${tc}"/>`;
    if (a.top === 'hoodie') out += `<path d="M156 276q24 22 48 0" fill="none" stroke="${td}" stroke-width="5"/><rect x="156" y="316" width="48" height="22" rx="6" fill="${td}"/><path d="M170 282v16M190 282v16" stroke="#f4f4f4" stroke-width="2.5"/>`;
    if (a.top === 'sweater') out += `<path d="M138 344h84" stroke="${td}" stroke-width="6"/><path d="M160 276q20 12 40 0" fill="none" stroke="${td}" stroke-width="5"/>`;
    if (a.top === 'blazer') out += `<path d="M180 276l-18 40 18 38 18 -38z" fill="#ffffff"/><path d="M162 276l18 40 18 -40" fill="none" stroke="${td}" stroke-width="4"/><circle cx="180" cy="334" r="3" fill="${td}"/>`;
    if (a.top === 'blouse') out += `<path d="M162 276l18 14 18 -14" fill="#ffffff"/><circle cx="180" cy="300" r="2.5" fill="${td}"/><circle cx="180" cy="316" r="2.5" fill="${td}"/>`;
    if (a.top === 'sailor') out += `<path d="M138 276L180 318 222 276 236 300 180 330 124 300Z" fill="#2e4a7a"/><path d="M140 282L180 318 220 282" stroke="#ffffff" stroke-width="2.5" fill="none"/><path d="M168 316L180 340 192 316 186 352 180 344 174 352Z" fill="#d2402f"/>`;
    if (a.top === 'tank') out += `<path d="M146 274v-6M214 274v-6" stroke="${tc}" stroke-width="8"/>`;
  }
  // shoes
  const sc = a.shoesColor;
  const shoe = {
    boots: (x) => `<rect x="${x - 16}" y="414" width="30" height="30" rx="6" fill="${sc}"/><ellipse cx="${x - 2}" cy="444" rx="20" ry="7" fill="${shade(sc, -0.2)}"/>`,
    heels: (x) => `<path d="M${x - 16} 440q16 -16 32 0z" fill="${sc}"/><rect x="${x + 10}" y="440" width="4" height="10" fill="${sc}"/>`,
    flats: (x) => `<ellipse cx="${x}" cy="442" rx="17" ry="7" fill="${sc}"/>`,
    slippers: (x) => `<ellipse cx="${x}" cy="442" rx="20" ry="9" fill="${sc}"/><circle cx="${x + 10}" cy="436" r="6" fill="#ffffff"/>`,
    sneakers: (x) => `<path d="M${x - 18} 446q0 -16 18 -16q18 0 20 16z" fill="${sc}"/><rect x="${x - 18}" y="444" width="38" height="5" rx="2" fill="${shade(sc, -0.25)}"/>`,
  }[a.shoes] || ((x) => `<ellipse cx="${x}" cy="442" rx="18" ry="8" fill="${sc}"/>`);
  out += shoe(164) + shoe(196);
  return out;
}

function extrasBack(list, a) {
  let s = '';
  if (list.includes('bag')) s += `<path d="M120 286l112 70" stroke="#5a3a2a" stroke-width="4"/><rect x="214" y="340" width="40" height="34" rx="8" fill="#8a5a3a"/>`;
  return s;
}
function extrasFront(list, a) {
  let s = '';
  if (list.includes('blush')) s += [146, 214].map((x) => `<ellipse cx="${x}" cy="240" rx="11" ry="5.5" fill="#ff8aa0" opacity=".35" stroke="none"/><path d="M${x - 7} 243l4 -6M${x - 1} 243l4 -6M${x + 5} 243l4 -6" stroke="#f06a86" stroke-width="1.4" stroke-linecap="round" opacity=".8"/>`).join('');
  if (list.includes('ahoge')) s += `<path d="M184 136C186 112 206 104 210 118C202 112 192 118 190 136Z" fill="${a.hairColor}"/>`;
  if (list.includes('cat ears')) s += [[-1, 140], [1, 220]].map(([dir, x]) => `<path d="M${x - 16} 160L${x + dir * 6} 116L${x + 16} 156Z" fill="${a.hairColor}"/><path d="M${x - 8} 154L${x + dir * 4} 128L${x + 8} 152Z" fill="#f7b7cf" stroke="none"/>`).join('');
  if (list.includes('star clip')) s += `<path d="M222 170l3.5 8 8.5 .8-6.4 5.6 2 8.4-7.6-4.4-7.6 4.4 2-8.4-6.4-5.6 8.5-.8z" fill="#ffd36b"/>`;
  if (list.includes('freckles')) s += [[150, 232], [156, 236], [146, 238], [210, 232], [204, 236], [214, 238]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="${shade(a.skin, -0.35)}"/>`).join('');
  if (list.includes('earrings')) s += `<circle cx="128" cy="244" r="4" fill="#e2c27a"/><circle cx="232" cy="244" r="4" fill="#e2c27a"/>`;
  if (list.includes('necklace')) s += `<path d="M160 276q20 18 40 0" fill="none" stroke="#e2c27a" stroke-width="2.5"/><circle cx="180" cy="290" r="4" fill="#e2c27a"/>`;
  if (list.includes('scarf')) s += `<path d="M146 270q34 18 68 0v14q-34 16 -68 0z" fill="#b23a48"/><rect x="194" y="280" width="14" height="40" rx="4" fill="#b23a48"/>`;
  if (list.includes('glasses')) s += `<circle cx="162" cy="222" r="13" fill="none" stroke="#2b2b33" stroke-width="3"/><circle cx="198" cy="222" r="13" fill="none" stroke="#2b2b33" stroke-width="3"/><path d="M175 222h10" stroke="#2b2b33" stroke-width="3"/>`;
  if (list.includes('sunglasses')) s += `<rect x="146" y="212" width="30" height="20" rx="8" fill="#1f1f24"/><rect x="184" y="212" width="30" height="20" rx="8" fill="#1f1f24"/><path d="M176 220h8" stroke="#1f1f24" stroke-width="3"/><path d="M152 216l8 0" stroke="#fff" stroke-width="2" opacity=".6"/>`;
  if (list.includes('beanie')) s += `<path d="M126 196c0-44 24-64 54-64s54 20 54 64z" fill="#b23a48"/><rect x="122" y="186" width="116" height="18" rx="8" fill="${shade('#b23a48', -0.2)}"/><circle cx="180" cy="128" r="10" fill="#f4efe6"/>`;
  if (list.includes('sunhat')) s += `<ellipse cx="180" cy="178" rx="92" ry="18" fill="#e9d29a"/><path d="M136 178c0-34 18-52 44-52s44 18 44 52z" fill="#e9d29a"/><rect x="136" y="164" width="88" height="10" fill="#b23a48"/>`;
  if (list.includes('cap')) s += `<path d="M128 188c0-38 22-56 52-56s52 18 52 56z" fill="#2e4a7a"/><path d="M180 186h76q-6 12 -76 10z" fill="#24395f"/>`;
  if (list.includes('crown')) s += `<path d="M146 160l8 -30 14 18 12 -24 12 24 14 -18 8 30z" fill="#e2c27a" stroke="#c9a24a" stroke-width="2"/><circle cx="180" cy="146" r="4" fill="#b23a48"/>`;
  if (list.includes('bow')) s += `<path d="M206 152l20 -16v32zM206 152l-20 -16v32z" fill="#ff8fb1"/><circle cx="206" cy="152" r="6" fill="#e5709a"/>`;
  if (list.includes('flower crown')) s += [...Array(7)].map((_, k) => `<circle cx="${136 + k * 15}" cy="${170 - Math.sin((k / 6) * Math.PI) * 26}" r="7" fill="${['#ff8fb1', '#ffd36b', '#b392f0'][k % 3]}"/><circle cx="${136 + k * 15}" cy="${170 - Math.sin((k / 6) * Math.PI) * 26}" r="2.5" fill="#fff6c9"/>`).join('');
  if (list.includes('headphones')) s += `<path d="M124 220c0-62 28-86 56-86s56 24 56 86" fill="none" stroke="#2b2b33" stroke-width="7"/><rect x="114" y="206" width="18" height="34" rx="8" fill="#2b2b33"/><rect x="228" y="206" width="18" height="34" rx="8" fill="#2b2b33"/>`;
  return s;
}

export function avatarSvg(a) {
  const x = a.extras || [];
  const face = 'M130 200C130 160 152 144 180 144S230 160 230 200C230 234 214 256 196 266C188 271 172 271 164 266C146 256 130 234 130 200Z';
  // Cel-style outline: shapes inherit a soft dark stroke unless they set their own.
  return `
    <ellipse cx="180" cy="450" rx="64" ry="9" fill="#000" opacity=".12"/>
    <g stroke="#3a2630" stroke-opacity=".55" stroke-width="1.6" stroke-linejoin="round">
      ${extrasBack(x, a)}
      ${hairBack(a.hair, a.hairColor)}
      ${clothes(a)}
      <rect x="172" y="256" width="16" height="22" rx="6" fill="${shade(a.skin, -0.1)}"/>
      <path d="M128 208q-8 2 -6 14q2 10 10 10z" fill="${a.skin}"/><path d="M232 208q8 2 6 14q-2 10 -10 10z" fill="${a.skin}"/>
      <path d="${face}" fill="${a.skin}"/>
      <path d="M150 256q30 16 60 0" stroke="${shade(a.skin, -0.12)}" stroke-width="3" fill="none" opacity=".5"/>
      ${eyes(a.eyes, a.eyeColor || '#3f6fb5', shade(a.hairColor, -0.25), a.skin)}
      <path d="M179 236l-2 5h3" stroke="${shade(a.skin, -0.35)}" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      ${mouth(a.mouth)}
      ${hairFront(a.hair, a.hairColor)}
      ${extrasFront(x, a)}
    </g>`;
}

/** The whole picture: world behind, avatar, a few things in front. */
export function sceneSvg(a, { label = true } = {}) {
  const s = a.scene;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" role="img" aria-label="${(a.name || 'My avatar').replace(/[<&"]/g, '')} at home">
    ${worldSvg(s)}
    ${avatarSvg(a)}
    ${worldFrontSvg(s)}
    ${label && a.name ? `<rect x="110" y="456" width="140" height="20" rx="10" fill="#ffffff" opacity=".85"/><text x="180" y="470" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#2b2b33">${a.name.replace(/[<&>]/g, '').slice(0, 22)}</text>` : ''}
  </svg>`;
}

/** Random outfit and hair, keeping skin tone and the world. */
export function randomize(a, rnd = Math.random) {
  const pick = (l) => l[Math.floor(rnd() * l.length)];
  const extras = OPTIONS.extras.filter(() => rnd() < 0.18);
  return { ...a, eyes: pick(OPTIONS.eyes), eyeColor: pick(EYE_COLORS), mouth: pick(OPTIONS.mouth), hair: pick(OPTIONS.hair), hairColor: pick(HAIR_COLORS), top: pick(OPTIONS.top), topColor: pick(CLOTH_COLORS), bottom: pick(OPTIONS.bottom), bottomColor: pick(CLOTH_COLORS), shoes: pick(OPTIONS.shoes), shoesColor: pick(CLOTH_COLORS), extras };
}
