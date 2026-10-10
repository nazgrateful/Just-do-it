// Bottom-sheet dialog used by the edit forms.
import { $, DAY_NAMES, esc } from '../util.js';

export function openSheet(html, onSubmit, onClick) {
  const d = $('#sheet');
  d.innerHTML = `<form method="dialog" class="sheet-body">${html}</form>`;
  const form = d.querySelector('form');
  form.addEventListener('submit', (e) => {
    const btn = e.submitter;
    if (btn?.value === 'cancel') return;
    e.preventDefault();
    if (onSubmit(new FormData(form), btn?.value, form) !== false) d.close();
  });
  form.addEventListener('click', (e) => {
    const chip = e.target.closest('.days .chip');
    if (chip) {
      chip.classList.toggle('on');
      chip.setAttribute('aria-pressed', chip.classList.contains('on'));
    }
    onClick?.(e, form);
  });
  d.showModal();
  return d;
}

export const closeSheet = () => $('#sheet').close();

export function daysPicker(days = []) {
  const all = !days.length;
  return `<div class="days" data-days>${DAY_NAMES.map((d, i) => `<button type="button" class="chip${all || days.includes(i) ? ' on' : ''}" data-day="${i}">${d}</button>`).join('')}</div>`;
}

export function readDays(form) {
  const days = [...form.querySelectorAll('[data-days] .chip.on')].map((b) => Number(b.dataset.day));
  return days.length === 7 ? [0, 1, 2, 3, 4, 5, 6] : days;
}

export const field = (label, input) => `<label class="field"><span>${esc(label)}</span>${input}</label>`;
