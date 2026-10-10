// "Life": your vision board (answers), your environment (home + inventory) and your people.
import { SECTIONS, AESTHETICS, CLEANING_KITS, DOMAINS, SECTION_DOMAIN } from '../data.js';
import { isDue, isDone, toggleHabit } from '../store.js';
import { pack, bounds, radiusFor } from '../bubbles.js';
import { ymd } from '../util.js';
import { openSheet, field } from './sheet.js';
import { esc, fmtTime, daysLabel, uid, DAY_NAMES } from '../util.js';

const TABS = { map: '🗺 Life map', vision: '✨ Vision', env: '🏡 Environment', people: '💞 People', routine: '🕒 My routine' };
const STATUSES = ['Love it', 'Use it', 'Maybe', 'Let go', 'Want to buy'];
const ROOMS = ['Bedroom', 'Living room', 'Kitchen', 'Bathroom', 'Office', 'Closet / wardrobe', 'Hallway', 'Garage', 'Outdoor', 'Car', 'Storage', 'Digital'];
const CONTACT = ['', 'Every day', 'A few times a week', 'Weekly', 'Every two weeks', 'Monthly', 'When it feels right', 'Minimal contact'];
let q = '';

const tab = () => location.hash.split('/')[1] || 'map';
const list = (v) => (Array.isArray(v) ? v.join(' · ') : v);

function answerBlock(a, s, i) {
  const rows = s.questions
    .filter((x) => x.type !== 'skills' && x.type !== 'aesthetic' && a[x.id] != null && (!Array.isArray(a[x.id]) || a[x.id].length))
    .map((x) => `<div class="ans"><small>${esc(x.q)}</small><b>${esc(x.type === 'days' ? daysLabel(a[x.id]) : x.type === 'time' ? fmtTime(a[x.id]) : list(a[x.id]))}</b></div>`)
    .join('');
  return `<details class="group"><summary><span>${s.emoji} <b>${esc(s.title)}</b></span><a class="small" href="#quiz/${i}">Edit</a></summary>${rows || '<p class="muted small">Not answered yet.</p>'}</details>`;
}

/** The map of your life: domain → area → your habits, in priority order. */
// Bubble chart state: [] = all of life, [domain] = its parts, [domain, part] = its habits.
let mapPath = [];
let mapMode = 'bubbles';

/** The Life map as a bubble chart. Bubble shapes follow the active look (see styles.css [data-bubble]). */
function mapTab(state) {
  const today = ymd();
  const [dom, part] = mapPath;
  const d = DOMAINS.find((x) => x.name === dom);
  let items;
  if (!d) {
    items = DOMAINS.map((x, k) => {
      const hs = state.habits.filter((h) => h.area === x.name);
      return { key: x.name, label: x.name, emoji: x.emoji, count: hs.length, done: hs.filter((h) => isDue(h, today) && isDone(state, h.id, today)).length, due: hs.filter((h) => isDue(h, today)).length, hue: k / (DOMAINS.length - 1), nav: x.name };
    });
  } else if (!part) {
    const hs = state.habits.filter((h) => h.area === d.name);
    const parts = [...d.areas, ...(hs.some((h) => !d.areas.includes(h.sub)) ? ['Other'] : [])];
    items = parts.map((a, k) => {
      const inPart = hs.filter((h) => (a === 'Other' ? !d.areas.includes(h.sub) : h.sub === a));
      return { key: a, label: a, emoji: '', count: inPart.length, done: inPart.filter((h) => isDue(h, today) && isDone(state, h.id, today)).length, due: inPart.filter((h) => isDue(h, today)).length, hue: k / Math.max(1, parts.length - 1), nav: a };
    });
  } else {
    const hs = state.habits.filter((h) => h.area === d.name && (part === 'Other' ? !d.areas.includes(h.sub) : h.sub === part));
    items = hs.map((h, k) => ({ key: h.id, label: h.name, emoji: h.emoji, count: 1, due: isDue(h, today) ? 1 : 0, done: isDone(state, h.id, today) ? 1 : 0, hue: k / Math.max(1, hs.length - 1), habit: h.id }));
  }
  const placed = pack(items.map((it) => ({ ...it, r: it.habit ? 50 : radiusFor(it.count, 46, 14) })), 5);
  const crumbs = [['All of life', 0], ...(d ? [[`${d.emoji} ${d.name}`, 1]] : []), ...(part ? [[part, 2]] : [])];
  let chart = '<p class="empty">Nothing here yet. Add habits or answer the questions for this area.</p>';
  if (placed.length) {
    const b = bounds(placed);
    const W = b.maxX - b.minX;
    const H = b.maxY - b.minY;
    chart = `<div class="bubble-chart" style="aspect-ratio:${W.toFixed(1)} / ${H.toFixed(1)}">${placed
      .map((p) => {
        const pct = p.due ? p.done / p.due : 0;
        const attrs = p.habit ? `data-bubble-habit="${p.habit}"` : `data-bubble-nav="${esc(p.nav)}"`;
        return `<button class="lm-bubble${p.habit && p.done ? ' done' : ''}" ${attrs} style="left:${(((p.x - p.r - b.minX) / W) * 100).toFixed(2)}%;top:${(((p.y - p.r - b.minY) / H) * 100).toFixed(2)}%;width:${(((2 * p.r) / W) * 100).toFixed(2)}%;--hue:${(p.hue * 100).toFixed(0)}%;--fill:${(pct * 100).toFixed(0)}%;--s:${((2 * p.r) / W).toFixed(3)};--fit:${Math.min(1, 9 / Math.max(...p.label.split(/\s+/).map((w) => w.length))).toFixed(2)}">
          <span class="bubble-in">${p.emoji ? `<span class="b-emoji">${esc(p.emoji)}</span>` : ''}<span class="b-label">${esc(p.label)}</span>${p.habit ? `<span class="b-count">${p.done ? '✓ done' : p.due ? 'tap when done' : 'not today'}</span>` : `<span class="b-count">${p.count} habit${p.count === 1 ? '' : 's'}${p.due ? ` · ${p.done}/${p.due}` : ''}</span>`}</span>
        </button>`;
      })
      .join('')}</div>`;
  }
  return `
    <div class="row wrap"><nav class="crumbs">${crumbs.map(([t, n], k) => (k === crumbs.length - 1 ? `<b>${esc(t)}</b>` : `<button class="linkish" data-crumb="${n}">${esc(t)}</button> ›`)).join(' ')}</nav>
      <span style="margin-left:auto"></span><button class="chip${mapMode === 'bubbles' ? ' on' : ''}" data-map-mode="bubbles">Bubbles</button><button class="chip${mapMode === 'list' ? ' on' : ''}" data-map-mode="list">List</button></div>
    ${mapMode === 'list' ? mapListTab(state) : `<p class="muted small">${!d ? 'Body, mind and soul first. Bigger bubbles hold more habits; the fill shows today. Tap a bubble to open it.' : !part ? `The parts of ${esc(d.name)}. Tap one to see its habits.` : 'Tap a habit when you have done it today.'}</p>${chart}${d && !part ? `<a class="btn small" href="#quiz/${SECTIONS.findIndex((x) => SECTION_DOMAIN[x.id] === d.name)}">Answer ${esc(d.name)} questions</a>` : ''}`}`;
}

function mapListTab(state) {
  const today = ymd();
  return `
    <p class="muted small">Body, mind and soul first, then relationships, then everything else. Tap a life area to open its parts and habits.</p>
    ${DOMAINS.map((d) => {
      const hs = state.habits.filter((h) => h.area === d.name);
      const dueToday = hs.filter((h) => isDue(h, today));
      const done = dueToday.filter((h) => isDone(state, h.id, today)).length;
      const secIdx = SECTIONS.findIndex((x) => SECTION_DOMAIN[x.id] === d.name);
      const loose = hs.filter((h) => !d.areas.includes(h.sub));
      const areaBlock = (name, list) => `<div class="map-area"><b>${esc(name)}</b>${list.length ? `<ul>${list.map((h) => `<li>${esc(h.emoji)} ${esc(h.name)} <small class="muted">${daysLabel(h.days)}</small></li>`).join('')}</ul>` : '<small class="muted">No habits yet</small>'}</div>`;
      return `<details class="group map-domain">
        <summary><span>${d.emoji} <b>${esc(d.name)}</b></span><span class="muted small">${hs.length} habits${dueToday.length ? ` · ${done}/${dueToday.length} today` : ''}</span></summary>
        ${d.areas.map((ar) => areaBlock(ar, hs.filter((h) => h.sub === ar))).join('')}
        ${loose.length ? areaBlock('Other', loose) : ''}
        <div class="row wrap"><a class="btn small" href="#quiz/${secIdx}">Answer ${esc(d.name)} questions</a></div>
      </details>`;
    }).join('')}
    ${state.habits.some((h) => !DOMAINS.some((d) => d.name === h.area)) ? `<details class="group"><summary><b>⭐ Other</b></summary><ul>${state.habits.filter((h) => !DOMAINS.some((d) => d.name === h.area)).map((h) => `<li>${esc(h.emoji)} ${esc(h.name)}</li>`).join('')}</ul></details>` : ''}`;
}

function visionTab(state) {
  const a = state.answers;
  const ae = AESTHETICS[a.aesthetic];
  const kits = (a.products || []).map((p) => CLEANING_KITS[p]).filter(Boolean);
  return `
    <div class="card mood" style="${ae ? `--a:${ae.accent};--b:${ae.bg};--i:${ae.ink}` : ''}">
      <div class="aes-swatch"><i></i><i></i><i></i></div>
      <h2>${ae ? `${ae.emoji} ${esc(ae.name)}` : 'Your vibe'}</h2>
      ${a.vibeText ? `<p class="lead">${esc(a.vibeText)}</p>` : ae ? `<p class="lead">${esc(ae.words)}</p>` : ''}
      ${a.words?.length ? `<p class="chips">${a.words.map((w) => `<span class="chip on">${esc(w)}</span>`).join('')}</p>` : ''}
      ${a.why ? `<blockquote>“${esc(a.why)}”</blockquote>` : ''}
    </div>
    ${a.abilities?.length || a.bodyLook?.length ? `<div class="card"><h3>💪 Body goals</h3>${a.bodyLook?.length ? `<p><b>Look:</b> ${esc(a.bodyLook.join(', '))}</p>` : ''}${a.abilities?.length ? `<p><b>Be able to:</b></p><ul>${a.abilities.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${a.feel?.length ? `<p><b>Feel:</b> ${esc(a.feel.join(', '))}</p>` : ''}</div>` : ''}
    ${kits.length || a.scent || a.tools?.length ? `<div class="card"><h3>🧽 Your cleaning kit</h3>${kits.map((k) => `<p class="small">${esc(k)}</p>`).join('')}${a.scent ? `<p><b>Scent:</b> ${esc(a.scent)}</p>` : ''}${a.tools?.length ? `<p><b>Tools:</b> ${esc(a.tools.join(', '))}</p>` : ''}${a.cleanStyle ? `<p><b>Schedule:</b> ${esc(a.cleanStyle)}${a.cleanDays?.length ? ` · big clean ${daysLabel(a.cleanDays)}` : ''}</p>` : ''}</div>` : ''}
    <h2>All your answers</h2>
    ${SECTIONS.map((s, i) => answerBlock(a, s, i)).join('')}
    <a class="btn" href="#quiz/0">Retake the questions</a>
    <p class="muted small">Retaking adds anything new to your plan and keeps what you already have.</p>`;
}

function envTab(state) {
  const a = state.answers;
  const items = state.inventory.filter((x) => !q || `${x.name} ${x.room} ${x.category} ${x.notes}`.toLowerCase().includes(q.toLowerCase()));
  const byRoom = {};
  for (const x of items) (byRoom[x.room || 'Other'] ||= []).push(x);
  const counts = STATUSES.map((s) => [s, state.inventory.filter((x) => x.status === s).length]).filter(([, n]) => n);
  return `
    <div class="card">
      <h3>🏡 How & where I want to live</h3>
      ${a.livePlace?.length ? `<p><b>Where:</b> ${esc(a.livePlace.join(', '))}</p>` : ''}
      ${a.homeType ? `<p><b>Home:</b> ${esc(a.homeType)}${a.liveWith?.length ? ` · with ${esc(a.liveWith.join(', '))}` : ''}</p>` : ''}
      ${a.homeVibe ? `<p><b>Feel:</b> ${esc(a.homeVibe)}${a.scent ? ` · smells like ${esc(a.scent.toLowerCase())}` : ''}</p>` : ''}
      ${a.mustHaves?.length ? `<p><b>Must-haves:</b> ${esc(a.mustHaves.join(', '))}</p>` : ''}
      ${a.ownStyle ? `<p><b>Stuff:</b> ${esc(a.ownStyle)}</p>` : ''}
      ${a.dreamHome ? `<blockquote>${esc(a.dreamHome)}</blockquote>` : ''}
      <a class="small" href="#quiz/${SECTIONS.findIndex((s) => s.id === 'environment')}">Edit</a>
    </div>
    <div class="title-row"><h2>Everything I own <small class="muted">${state.inventory.length}</small></h2><button class="btn primary" data-item>+ Item</button></div>
    ${counts.length ? `<p class="chips">${counts.map(([s, n]) => `<span class="chip">${s}: ${n}</span>`).join('')}</p>` : ''}
    <input class="input" type="search" id="inv-q" placeholder="Search your things…" value="${esc(q)}">
    ${
      Object.keys(byRoom).length
        ? Object.entries(byRoom)
            .sort()
            .map(([room, xs]) => `<details class="group" open><summary><b>${esc(room)}</b><span class="muted small">${xs.length}</span></summary><ul class="list">${xs.map((x) => `<li class="item" data-edit-item="${x.id}"><span class="h-main"><b>${esc(x.name)}</b><small>${esc([x.category, x.notes].filter(Boolean).join(' · '))}</small></span><span class="pill st-${STATUSES.indexOf(x.status)}">${esc(x.status)}</span></li>`).join('')}</ul></details>`)
            .join('')
        : `<p class="empty">${q ? 'Nothing matches.' : 'List your things room by room. Mark each one: love it, use it, maybe, let go, or want to buy.'}</p>`
    }
    <details class="group"><summary><b>Quick add many</b></summary>
      <form id="bulk" class="stack">
        ${field('Room', `<select class="input" name="room">${ROOMS.map((r) => `<option>${r}</option>`).join('')}</select>`)}
        <textarea class="input" name="lines" rows="5" placeholder="One item per line&#10;Bed&#10;Lamp&#10;Yoga mat"></textarea>
        <button class="btn">Add all</button>
      </form>
    </details>`;
}

function peopleTab(state) {
  return `
    <div class="title-row"><h2>My people</h2><button class="btn primary" data-person>+ Person</button></div>
    <p class="muted small">For each relationship: how I want to show up, how I want to be treated, and my boundaries.</p>
    ${
      state.people.length
        ? state.people
            .map(
              (p) => `
      <details class="group person">
        <summary><span>💞 <b>${esc(p.name)}</b>${p.relation && p.relation !== p.name ? ` <small class="muted">${esc(p.relation)}</small>` : ''}</span>${p.contact ? `<span class="muted small">${esc(p.contact)}</span>` : ''}</summary>
        ${p.behave ? `<div class="ans"><small>How I want to show up</small><b>${esc(p.behave)}</b></div>` : ''}
        ${p.treated ? `<div class="ans"><small>How I want to be treated</small><b>${esc(p.treated)}</b></div>` : ''}
        ${p.boundaries ? `<div class="ans"><small>My boundaries</small><ul>${p.boundaries.split('\n').filter(Boolean).map((b) => `<li>${esc(b)}</li>`).join('')}</ul></div>` : ''}
        ${p.notes ? `<div class="ans"><small>Notes</small><b>${esc(p.notes)}</b></div>` : ''}
        <div class="row wrap"><button class="btn small" data-edit-person="${p.id}">Edit</button>${p.contact && p.contact !== 'Minimal contact' && p.contact !== 'When it feels right' ? `<button class="btn small" data-habit-person="${p.id}">Make it a habit</button>` : ''}</div>
      </details>`,
            )
            .join('')
        : '<p class="empty">Add the people in your life: partner, family, friends, coworkers…</p>'
    }`;
}

function routineTab(state) {
  // A typical 24 hours (habits with times), then the week at a glance.
  const timed = state.habits.filter((h) => h.time).sort((a, b) => a.time.localeCompare(b.time));
  const anytime = state.habits.filter((h) => !h.time);
  const wake = state.answers.wake;
  const bed = state.answers.bed;
  return `
    <div class="card">
      <h3>🕒 My 24 hours</h3>
      <ul class="schedule">
        ${wake ? `<li><time>${fmtTime(wake)}</time><span>☀️ Wake up</span></li>` : ''}
        ${timed.map((h) => `<li><time>${fmtTime(h.time)}</time><span>${esc(h.emoji)} ${esc(h.name)} <small class="muted">${daysLabel(h.days)}</small></span></li>`).join('')}
        ${bed ? `<li><time>${fmtTime(bed)}</time><span>🌙 Bed</span></li>` : ''}
      </ul>
      ${anytime.length ? `<p class="small"><b>Any time:</b> ${anytime.map((h) => esc(h.emoji + ' ' + h.name)).join(' · ')}</p>` : ''}
    </div>
    <div class="card">
      <h3>📅 My week</h3>
      <div class="weekgrid">${DAY_NAMES.map((d, i) => {
        const hs = state.habits.filter((h) => h.days?.length && h.days.length < 7 && h.days.includes(i));
        return `<div><b>${d}</b>${hs.map((h) => `<small>${esc(h.emoji)} ${esc(h.name)}</small>`).join('') || '<small class="muted">daily habits only</small>'}</div>`;
      }).join('')}</div>
      <p class="small muted">Daily habits are left out here so the weekly ones stand out. See every hour in <a href="#calendar">My schedule</a>.</p>
    </div>
    <a class="btn" href="#habits">Edit habits & times</a>`;
}

export function render({ state }) {
  const t = TABS[tab()] ? tab() : 'map';
  return `
    <section>
      <h1>Life</h1>
      <div class="chips seg">${Object.entries(TABS).map(([id, n]) => `<a class="chip${t === id ? ' on' : ''}" href="#vision/${id}">${n}</a>`).join('')}</div>
      ${{ map: mapTab, vision: visionTab, env: envTab, people: peopleTab, routine: routineTab }[t](state)}
    </section>`;
}

function editItem(app, x) {
  const isNew = !x;
  x ||= { id: uid(), name: '', room: 'Bedroom', category: '', status: 'Use it', notes: '' };
  openSheet(
    `<h2>${isNew ? 'Add a thing' : 'Edit'}</h2>
     ${field('What', `<input class="input" name="name" required value="${esc(x.name)}">`)}
     <div class="row">${field('Room', `<input class="input" name="room" list="rooms" value="${esc(x.room)}"><datalist id="rooms">${ROOMS.map((r) => `<option value="${r}">`).join('')}</datalist>`)}${field('Type', `<input class="input" name="category" value="${esc(x.category)}" placeholder="Clothes, tech, decor…">`)}</div>
     ${field('Status', `<select class="input" name="status">${STATUSES.map((s) => `<option${s === x.status ? ' selected' : ''}>${s}</option>`).join('')}</select>`)}
     ${field('Notes', `<input class="input" name="notes" value="${esc(x.notes)}">`)}
     <div class="sheet-actions">${isNew ? '' : '<button class="btn danger" value="delete">Delete</button>'}<button class="btn" value="cancel" formnovalidate>Cancel</button><button class="btn primary" value="save">Save</button></div>`,
    (fd, action) => {
      if (action === 'delete') app.state.inventory = app.state.inventory.filter((i) => i.id !== x.id);
      else {
        for (const k of ['name', 'room', 'category', 'status', 'notes']) x[k] = String(fd.get(k) || '').trim();
        if (isNew) app.state.inventory.push(x);
      }
      app.save();
      app.render();
    },
  );
}

function editPerson(app, p) {
  const isNew = !p;
  const a = app.state.answers;
  p ||= { id: uid(), name: '', relation: '', behave: (a.relBehave || []).join(', '), treated: (a.relTreated || []).join(', '), boundaries: (a.relBoundaries || []).join('\n'), contact: '', notes: '' };
  openSheet(
    `<h2>${isNew ? 'Add a person' : esc(p.name)}</h2>
     <div class="row">${field('Name', `<input class="input" name="name" required value="${esc(p.name)}">`)}${field('Relationship', `<input class="input" name="relation" value="${esc(p.relation)}" placeholder="Mom, best friend, boss…">`)}</div>
     ${field('How I want to show up', `<textarea class="input" name="behave" rows="2">${esc(p.behave)}</textarea>`)}
     ${field('How I want to be treated', `<textarea class="input" name="treated" rows="2">${esc(p.treated)}</textarea>`)}
     ${field('My boundaries (one per line)', `<textarea class="input" name="boundaries" rows="4">${esc(p.boundaries)}</textarea>`)}
     ${field('How often I want to connect', `<select class="input" name="contact">${CONTACT.map((c) => `<option value="${c}"${c === p.contact ? ' selected' : ''}>${c || '—'}</option>`).join('')}</select>`)}
     ${field('Notes (birthdays, love language, things to remember)', `<textarea class="input" name="notes" rows="2">${esc(p.notes)}</textarea>`)}
     <div class="sheet-actions">${isNew ? '' : '<button class="btn danger" value="delete">Delete</button>'}<button class="btn" value="cancel" formnovalidate>Cancel</button><button class="btn primary" value="save">Save</button></div>`,
    (fd, action) => {
      if (action === 'delete') app.state.people = app.state.people.filter((x) => x.id !== p.id);
      else {
        for (const k of ['name', 'relation', 'behave', 'treated', 'boundaries', 'contact', 'notes']) p[k] = String(fd.get(k) || '').trim();
        if (isNew) app.state.people.push(p);
      }
      app.save();
      app.render();
    },
  );
}

const CONTACT_DAYS = { 'Every day': [0, 1, 2, 3, 4, 5, 6], 'A few times a week': [1, 3, 5], Weekly: [0], 'Every two weeks': [0], Monthly: [0] };

export function mount(root, app) {
  const state = app.state;
  root.addEventListener('click', (e) => {
    const t = e.target;
    const mm = t.closest('[data-map-mode]');
    if (mm) return (mapMode = mm.dataset.mapMode), app.render();
    const cr = t.closest('[data-crumb]');
    if (cr) return (mapPath = mapPath.slice(0, Number(cr.dataset.crumb))), app.render();
    const bn = t.closest('[data-bubble-nav]');
    if (bn) return mapPath.push(bn.dataset.bubbleNav), app.render();
    const bh = t.closest('[data-bubble-habit]');
    if (bh) {
      toggleHabit(app.state, bh.dataset.bubbleHabit, ymd());
      navigator.vibrate?.(15);
      app.save();
      return app.render();
    }
    if (t.closest('[data-item]')) return editItem(app);
    const ei = t.closest('[data-edit-item]');
    if (ei) return editItem(app, state.inventory.find((x) => x.id === ei.dataset.editItem));
    if (t.closest('[data-person]')) return editPerson(app);
    const ep = t.closest('[data-edit-person]');
    if (ep) return editPerson(app, state.people.find((x) => x.id === ep.dataset.editPerson));
    const hp = t.closest('[data-habit-person]');
    if (hp) {
      const p = state.people.find((x) => x.id === hp.dataset.habitPerson);
      const name = `Connect with ${p.name}`;
      if (state.habits.some((h) => h.name === name)) return app.toast('Already a habit');
      state.habits.push({ id: uid(), name, area: 'Relationships', sub: /mom|dad|mum|parent|sibling|brother|sister|child|son|daughter|grand|family/i.test(p.relation) ? 'Family' : /partner|wife|husband|girlfriend|boyfriend/i.test(p.relation) ? 'Partner' : 'Friends', emoji: '💞', days: CONTACT_DAYS[p.contact] || [0], time: '', notes: p.contact, createdAt: new Date().toISOString().slice(0, 10) });
      app.save();
      app.toast(`Added habit: ${name}`);
    }
  });
  root.querySelector('#inv-q')?.addEventListener('input', (e) => {
    q = e.target.value;
    const pos = e.target.selectionStart;
    app.render();
    const el = document.querySelector('#inv-q');
    el?.focus();
    el?.setSelectionRange(pos, pos);
  });
  root.querySelector('#bulk')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const room = e.target.room.value;
    const names = e.target.lines.value.split('\n').map((s) => s.trim()).filter(Boolean);
    for (const name of names) state.inventory.push({ id: uid(), name, room, category: '', status: 'Use it', notes: '' });
    app.save();
    app.toast(`Added ${names.length} things`);
    app.render();
  });
}
