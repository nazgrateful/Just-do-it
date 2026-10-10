// Draws your avatar and its world as one SVG (360 × 480). Pure string building, no DOM,
// so it can be tested and also saved as a picture.

export const SKIN = ['#ffe0c7', '#f6cfa8', '#eab98f', '#d9a074', '#c08559', '#a26a42', '#7c4c2e', '#5a3420'];
export const HAIR_COLORS = ['#2b1d16', '#4a2f1f', '#7a4a2a', '#b07a45', '#e2c27a', '#f3e2b8', '#b23a2b', '#8a8a8a', '#f1f1f1', '#f48fb1', '#9b7be0', '#58a6d8', '#5fb37a'];
export const CLOTH_COLORS = ['#ffffff', '#f4efe6', '#d9cbb3', '#1f1f24', '#4a6b63', '#8fafc4', '#2e4a7a', '#b23a48', '#e8a1b4', '#f2c14e', '#7a8f4e', '#9b7be0', '#d0743c'];

export const OPTIONS = {
  eyes: ['round', 'happy', 'sparkle', 'sleepy', 'wink', 'lashes'],
  mouth: ['smile', 'grin', 'small', 'open', 'smirk'],
  hair: ['short', 'bob', 'long', 'wavy', 'bun', 'ponytail', 'pigtails', 'curly', 'braids', 'buzz', 'spiky'],
  top: ['tee', 'hoodie', 'sweater', 'tank', 'blouse', 'blazer', 'dress', 'overalls'],
  bottom: ['jeans', 'trousers', 'skirt', 'shorts', 'leggings'],
  shoes: ['sneakers', 'boots', 'flats', 'heels', 'slippers'],
  extras: ['glasses', 'sunglasses', 'beanie', 'sunhat', 'cap', 'crown', 'bow', 'flower crown', 'headphones', 'earrings', 'necklace', 'scarf', 'bag', 'blush', 'freckles'],
};

export const SCENES = {
  'Living room': { outdoor: false, wall: '#efe6d8', floor: 'wood', floorColor: '#b88a5c', sky: 'day', items: ['window', 'sofa', 'plant', 'lamp', 'rug', 'art'] },
  Bedroom: { outdoor: false, wall: '#e6e0f0', floor: 'carpet', floorColor: '#cdbfd8', sky: 'night', items: ['window', 'bed', 'fairy lights', 'rug', 'plant'] },
  Kitchen: { outdoor: false, wall: '#f3efe2', floor: 'tiles', floorColor: '#d8d2c4', sky: 'day', items: ['window', 'kitchen', 'plant', 'clock'] },
  Study: { outdoor: false, wall: '#e9e4d6', floor: 'wood', floorColor: '#8a6a4a', sky: 'sunset', items: ['window', 'bookshelf', 'desk', 'lamp', 'rug'] },
  'Cozy cabin': { outdoor: false, wall: '#a8754c', floor: 'wood', floorColor: '#6e4a2e', sky: 'snow', items: ['window', 'fireplace', 'rug', 'cat', 'candles'] },
  'Cottage garden': { outdoor: true, wall: '#bfe3f2', floor: 'grass', floorColor: '#8cc06b', sky: 'day', items: ['house', 'tree', 'flowers', 'fence'] },
  'Beach house': { outdoor: true, wall: '#bfe6f5', floor: 'sand', floorColor: '#ecd6a6', sky: 'day', items: ['house', 'sea', 'palm'] },
  'City night': { outdoor: true, wall: '#1d2440', floor: 'street', floorColor: '#5a5f6e', sky: 'night', items: ['skyline', 'lamp post'] },
};
export const ROOM_ITEMS = ['window', 'sofa', 'bed', 'desk', 'bookshelf', 'kitchen', 'fireplace', 'plant', 'lamp', 'rug', 'art', 'fairy lights', 'clock', 'candles', 'mirror', 'cat', 'dog', 'house', 'tree', 'flowers', 'fence', 'sea', 'palm', 'skyline', 'lamp post'];
export const FLOORS = ['wood', 'tiles', 'carpet', 'grass', 'sand', 'street'];
export const SKIES = ['day', 'sunset', 'night', 'rain', 'snow'];

export function defaultAvatar() {
  return {
    skin: SKIN[2], eyes: 'round', mouth: 'smile', hair: 'long', hairColor: HAIR_COLORS[1],
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
  return { ...d, ...a, extras: Array.isArray(a.extras) ? a.extras : d.extras, scene: { ...d.scene, ...(a.scene || {}), items: Array.isArray(a.scene?.items) ? a.scene.items : d.scene.items } };
}

const shade = (hex, t) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.round(Math.max(0, Math.min(255, t < 0 ? v * (1 + t) : v + (255 - v) * t)));
  return '#' + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('');
};

// ---------------------------------------------------------------- the world

function sky(type, x, y, w, h, id) {
  const grads = {
    day: ['#9fd3f2', '#e3f4fb'], sunset: ['#f7a072', '#fbe1b6'], night: ['#141a3a', '#3a3f6e'], rain: ['#8d9aa6', '#c8d1d8'], snow: ['#b9c8d8', '#eef3f8'],
  };
  const [a, b] = grads[type] || grads.day;
  let extra = '';
  if (type === 'day') extra = `<ellipse cx="${x + w * 0.3}" cy="${y + h * 0.35}" rx="${w * 0.16}" ry="${h * 0.07}" fill="#fff" opacity=".9"/><ellipse cx="${x + w * 0.4}" cy="${y + h * 0.31}" rx="${w * 0.12}" ry="${h * 0.08}" fill="#fff" opacity=".9"/><circle cx="${x + w * 0.78}" cy="${y + h * 0.25}" r="${Math.min(w, h) * 0.09}" fill="#ffe27a"/>`;
  if (type === 'sunset') extra = `<circle cx="${x + w * 0.5}" cy="${y + h * 0.85}" r="${Math.min(w, h) * 0.18}" fill="#ffcf6b" opacity=".9"/>`;
  if (type === 'night') extra = `<circle cx="${x + w * 0.75}" cy="${y + h * 0.28}" r="${Math.min(w, h) * 0.09}" fill="#f6f1d3"/>` + [0.15, 0.35, 0.55, 0.25, 0.45, 0.85].map((fx, k) => `<circle cx="${x + w * fx}" cy="${y + h * (0.15 + ((k * 37) % 50) / 100)}" r="1.4" fill="#fff"/>`).join('');
  if (type === 'rain') extra = [...Array(14)].map((_, k) => `<line x1="${x + ((k * 23) % w)}" y1="${y + ((k * 41) % h)}" x2="${x + ((k * 23) % w) - 4}" y2="${y + ((k * 41) % h) + 10}" stroke="#eef4f8" stroke-width="1.4" opacity=".8"/>`).join('');
  if (type === 'snow') extra = [...Array(18)].map((_, k) => `<circle cx="${x + ((k * 29) % w)}" cy="${y + ((k * 47) % h)}" r="2" fill="#fff"/>`).join('');
  return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})"/>${extra}`;
}

function floor(type, color) {
  let pat = '';
  if (type === 'wood') pat = [0, 1, 2, 3, 4].map((k) => `<line x1="0" y1="${345 + k * 28}" x2="360" y2="${345 + k * 28}" stroke="${shade(color, -0.18)}" stroke-width="2"/>`).join('') + [60, 170, 280, 110, 230].map((x, k) => `<line x1="${x}" y1="${345 + (k % 5) * 28}" x2="${x}" y2="${373 + (k % 5) * 28}" stroke="${shade(color, -0.18)}" stroke-width="2"/>`).join('');
  if (type === 'tiles') pat = [...Array(9)].map((_, k) => `<line x1="${k * 45}" y1="330" x2="${k * 45 - 40}" y2="480" stroke="${shade(color, -0.15)}"/>`).join('') + [360, 395, 435].map((y) => `<line x1="0" y1="${y}" x2="360" y2="${y}" stroke="${shade(color, -0.15)}"/>`).join('');
  if (type === 'carpet') pat = `<rect x="0" y="330" width="360" height="150" fill="${shade(color, 0.08)}" opacity=".3"/>`;
  if (type === 'grass') pat = [...Array(30)].map((_, k) => `<path d="M${(k * 13) % 360} ${352 + ((k * 31) % 120)} l3 -9 l3 9" fill="none" stroke="${shade(color, -0.25)}" stroke-width="1.5"/>`).join('');
  if (type === 'sand') pat = [...Array(26)].map((_, k) => `<circle cx="${(k * 17) % 360}" cy="${345 + ((k * 37) % 130)}" r="1.5" fill="${shade(color, -0.2)}"/>`).join('');
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
  'lamp post': () => `<rect x="300" y="200" width="6" height="134" fill="#2a2a32"/><path d="M290 200h26l-5 -16h-16z" fill="#2a2a32"/><circle cx="303" cy="206" r="34" fill="#ffd36b" opacity=".22"/>`,
};
// Back items are drawn first; small floor items last.
const ORDER = ['sea', 'skyline', 'house', 'tree', 'palm', 'fence', 'window', 'art', 'clock', 'mirror', 'bookshelf', 'kitchen', 'fireplace', 'fairy lights', 'sofa', 'bed', 'desk', 'lamp', 'lamp post', 'rug', 'plant', 'candles', 'flowers', 'cat', 'dog'];

const FRONT = ['plant', 'candles', 'flowers', 'cat', 'dog'];
const has = (scene, k) => (scene.items || []).includes(k);

/** Everything behind the avatar: wall or sky, floor, furniture. */
export function worldSvg(s) {
  const back = s.outdoor ? sky(s.sky, 0, 0, 360, 330, 'bgsky') : `<rect width="360" height="330" fill="${s.wall}"/><rect y="318" width="360" height="12" fill="${shade(s.wall, -0.12)}"/>`;
  return back + floor(s.floor, s.floorColor) + ORDER.filter((k) => has(s, k) && !FRONT.includes(k)).map((k) => ITEMS[k](s)).join('');
}
/** Small things that stand in front of the avatar (plants, pets…). */
export function worldFrontSvg(s) {
  return ORDER.filter((k) => has(s, k) && FRONT.includes(k)).map((k) => ITEMS[k](s)).join('');
}

// ---------------------------------------------------------------- the avatar

function hairBack(style, c) {
  switch (style) {
    case 'bob': return `<path d="M124 214c-4-52 22-84 56-84s60 32 56 84c0 26-6 46-14 52h-84c-8-6-14-26-14-52z" fill="${c}"/>`;
    case 'long': return `<path d="M122 216c-6-56 22-88 58-88s64 32 58 88c2 60 6 100 -2 118h-112c-8-18-4-58-2-118z" fill="${c}"/>`;
    case 'wavy': return `<path d="M120 216c-6-56 24-88 60-88s66 32 60 88c4 30 14 48 4 66 10 18 0 40-8 54h-112c-8-14-18-36-8-54-10-18 0-36 4-66z" fill="${c}"/>`;
    case 'ponytail': return `<path d="M222 170c34 4 42 50 30 90-6 22-18 40-26 48 10-30 12-62 0-96z" fill="${c}"/>`;
    case 'pigtails': return `<circle cx="116" cy="236" r="22" fill="${c}"/><circle cx="244" cy="236" r="22" fill="${c}"/><path d="M110 254c-8 22-4 46 6 58M250 254c8 22 4 46-6 58" stroke="${c}" stroke-width="16" stroke-linecap="round" fill="none"/>`;
    case 'braids': return [0, 1, 2, 3, 4].map((k) => `<circle cx="132" cy="${262 + k * 16}" r="10" fill="${c}"/><circle cx="228" cy="${262 + k * 16}" r="10" fill="${c}"/>`).join('');
    case 'curly': return [[-46, -10], [-52, 18], [-40, 42], [46, -10], [52, 18], [40, 42]].map(([dx, dy]) => `<circle cx="${180 + dx}" cy="${215 + dy}" r="20" fill="${c}"/>`).join('');
    default: return '';
  }
}
function hairFront(style, c) {
  const d = shade(c, -0.12);
  switch (style) {
    case 'buzz': return `<path d="M130 206c0-40 22-62 50-62s50 22 50 62c-14-22-32-30-50-30s-36 8-50 30z" fill="${c}" opacity=".85"/>`;
    case 'spiky': return `<path d="M128 208l-4-40 22 18 4-34 18 26 12-34 12 34 18-26 4 34 22-18-4 40c-14-22-34-30-52-30s-38 8-52 30z" fill="${c}"/>`;
    case 'curly': return [...Array(9)].map((_, k) => `<circle cx="${136 + k * 11}" cy="${172 - Math.sin((k / 8) * Math.PI) * 18}" r="16" fill="${k % 2 ? c : d}"/>`).join('');
    case 'bun': return `<circle cx="180" cy="148" r="22" fill="${c}"/><path d="M128 210c-2-46 22-70 52-70s54 24 52 70c-12-26-30-34-52-34s-40 8-52 34z" fill="${c}"/>`;
    default: return `<path d="M127 212c-2-48 22-74 53-74s55 26 53 74c-6-14-14-24-24-28-8 10-22 14-40 12-14 0-26 6-42 16z" fill="${c}"/><path d="M150 168c10 6 26 8 40 2" stroke="${d}" stroke-width="3" fill="none" opacity=".5"/>`;
  }
}
function eyes(type) {
  const L = 162, R = 198, Y = 222;
  switch (type) {
    case 'happy': return `<path d="M${L - 8} ${Y + 2}q8 -10 16 0M${R - 8} ${Y + 2}q8 -10 16 0" stroke="#2b2b33" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    case 'sleepy': return `<path d="M${L - 8} ${Y}q8 6 16 0M${R - 8} ${Y}q8 6 16 0" stroke="#2b2b33" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    case 'wink': return `<ellipse cx="${L}" cy="${Y}" rx="6" ry="8" fill="#2b2b33"/><circle cx="${L + 2}" cy="${Y - 3}" r="2" fill="#fff"/><path d="M${R - 8} ${Y + 2}q8 -10 16 0" stroke="#2b2b33" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    case 'sparkle': return [L, R].map((x) => `<ellipse cx="${x}" cy="${Y}" rx="8" ry="10" fill="#2b2b33"/><circle cx="${x + 3}" cy="${Y - 4}" r="3" fill="#fff"/><circle cx="${x - 3}" cy="${Y + 4}" r="1.5" fill="#fff"/>`).join('');
    case 'lashes': return [L, R].map((x, k) => `<ellipse cx="${x}" cy="${Y}" rx="6" ry="8" fill="#2b2b33"/><circle cx="${x + 2}" cy="${Y - 3}" r="2" fill="#fff"/><path d="M${x + (k ? 5 : -5)} ${Y - 6}l${k ? 6 : -6} -5M${x + (k ? 7 : -7)} ${Y - 2}l${k ? 7 : -7} -2" stroke="#2b2b33" stroke-width="2" stroke-linecap="round"/>`).join('');
    default: return [L, R].map((x) => `<ellipse cx="${x}" cy="${Y}" rx="6" ry="8" fill="#2b2b33"/><circle cx="${x + 2}" cy="${Y - 3}" r="2" fill="#fff"/>`).join('');
  }
}
function mouth(type) {
  switch (type) {
    case 'grin': return `<path d="M168 242q12 14 24 0z" fill="#8a3a3a"/><path d="M170 243h20" stroke="#fff" stroke-width="3"/>`;
    case 'small': return `<path d="M175 245q5 4 10 0" stroke="#8a3a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    case 'open': return `<ellipse cx="180" cy="246" rx="7" ry="8" fill="#8a3a3a"/><ellipse cx="180" cy="250" rx="4" ry="3" fill="#e57f8a"/>`;
    case 'smirk': return `<path d="M170 246q10 2 18 -6" stroke="#8a3a3a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    default: return `<path d="M170 242q10 10 20 0" stroke="#8a3a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
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
  const sleeve = { tee: 306, blouse: 314, hoodie: 346, sweater: 346, blazer: 346, dress: 300, overalls: 306, tank: 0 }[a.top] ?? 306;
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
  if (list.includes('blush')) s += `<ellipse cx="148" cy="238" rx="9" ry="5" fill="#ff8a9a" opacity=".45"/><ellipse cx="212" cy="238" rx="9" ry="5" fill="#ff8a9a" opacity=".45"/>`;
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
  return `
    <ellipse cx="180" cy="450" rx="64" ry="9" fill="#000" opacity=".12"/>
    ${extrasBack(x, a)}
    ${hairBack(a.hair, a.hairColor)}
    ${clothes(a)}
    <rect x="171" y="258" width="18" height="20" rx="6" fill="${shade(a.skin, -0.08)}"/>
    <ellipse cx="128" cy="226" rx="8" ry="11" fill="${a.skin}"/><ellipse cx="232" cy="226" rx="8" ry="11" fill="${a.skin}"/>
    <ellipse cx="180" cy="214" rx="52" ry="54" fill="${a.skin}"/>
    ${eyes(a.eyes)}
    ${mouth(a.mouth)}
    ${hairFront(a.hair, a.hairColor)}
    ${extrasFront(x, a)}`;
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
  return { ...a, eyes: pick(OPTIONS.eyes), mouth: pick(OPTIONS.mouth), hair: pick(OPTIONS.hair), hairColor: pick(HAIR_COLORS), top: pick(OPTIONS.top), topColor: pick(CLOTH_COLORS), bottom: pick(OPTIONS.bottom), bottomColor: pick(CLOTH_COLORS), shoes: pick(OPTIONS.shoes), shoesColor: pick(CLOTH_COLORS), extras };
}
