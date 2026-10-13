/* Общие функции: меню, футер, расчёты, мини-графики */
const $ = (s, r = document) => r.querySelector(s);
const r1 = n => Math.round(n * 10) / 10;
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const today = () => new Date().toLocaleDateString('sv-SE'); // ГГГГ-ММ-ДД
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sum = l => l.reduce((a, e) => ({ kcal: a.kcal + e.kcal, p: a.p + e.p, f: a.f + e.f, c: a.c + e.c }), { kcal: 0, p: 0, f: 0, c: 0 });

const PAGES = [['index.html', 'Калькулятор'], ['diary.html', 'Дневник'], ['products.html', 'Продукты'], ['stats.html', 'Статистика'], ['goals.html', 'Цели']];

function layout() {
  const here = location.pathname.split('/').pop() || 'index.html', a = SITE.author;
  document.body.insertAdjacentHTML('afterbegin',
    `<header class="top"><div class="wrap"><a class="brand" href="index.html">${esc(SITE.title)}</a><nav>` +
    PAGES.map(([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a>`).join('') + '</nav></div></header>');
  document.body.insertAdjacentHTML('beforeend',
    `<section class="contact"><div class="wrap"><div><h2>Меня зовут ${esc(a.name)}</h2>` +
    `<p>${esc(a.role)}. Есть вопрос, идея или нашли ошибку? Напишите мне, отвечу лично.</p></div>` +
    `<div class="chips"><a href="mailto:${esc(a.email)}"><small>Почта</small><b>${esc(a.email)}</b></a>` +
    `<a href="${esc(a.telegram)}" target="_blank" rel="noopener"><small>Telegram</small><b>${esc(a.telegram.replace(/^https?:\/\/(t\.me\/)?/, '@'))}</b></a>` +
    `<a href="tel:${esc(a.phone.replace(/\s/g, ''))}"><small>Телефон</small><b>${esc(a.phone)}</b></a></div></div></section>` +
    `<footer><p>© ${new Date().getFullYear()} ${esc(a.name)}. Данные дневника хранятся только в вашем браузере.</p></footer>`);
}

/* Кольцо долей белков/жиров/углеводов; center — HTML в центре */
function donut(p, f, c, center = '') {
  const k = [p * 4, f * 9, c * 4], t = (k[0] + k[1] + k[2]) || 1, L = 2 * Math.PI * 40, col = ['var(--p)', 'var(--f)', 'var(--c)'];
  let off = 0;
  const arcs = k.map((v, i) => {
    const l = v / t * L;
    const s = `<circle cx="50" cy="50" r="40" fill="none" stroke="${col[i]}" stroke-width="14" stroke-dasharray="${l} ${L - l}" stroke-dashoffset="${-off}" transform="rotate(-90 50 50)"/>`;
    off += l; return s;
  }).join('');
  return `<div class="ring"><svg viewBox="0 0 100 100" role="img" aria-label="Доли белков, жиров и углеводов">${arcs}</svg><div>${center}</div></div>`;
}
const legend = (p, f, c) => `<ul class="legend"><li><i class="dot p"></i>Белки <b>${Math.round(p)} г</b></li><li><i class="dot f"></i>Жиры <b>${Math.round(f)} г</b></li><li><i class="dot c"></i>Углеводы <b>${Math.round(c)} г</b></li></ul>`;

/* Полоса прогресса: подпись, значение, цель, цвет */
const bar = (l, v, g, cls) => `<div class="meter"><div class="row"><span>${l}</span><span>${Math.round(v)}${g ? ' / ' + g : ''}</span></div><div class="track"><i class="${g && v > g * 1.05 ? 'over' : cls}" style="width:${g ? Math.min(100, v / g * 100) : 0}%"></i></div></div>`;
