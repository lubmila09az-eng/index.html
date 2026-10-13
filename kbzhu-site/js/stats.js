(async () => {
  layout();
  const sel = $('#range'), { goal } = await Store.getProfile();

  /* Столбчатая диаграмма калорий по дням + пунктир цели (чистый SVG, без библиотек) */
  function bars(data, goalKcal) {
    const W = 640, H = 240, pad = 28, max = Math.max(goalKcal || 0, ...data.map(x => x.kcal), 100) * 1.1;
    const bw = (W - pad * 2) / data.length, y = v => H - pad - v / max * (H - pad * 2), step = data.length > 14 ? 5 : 1;
    const cols = data.map((x, i) => {
      const cx = pad + i * bw;
      return `<rect x="${cx + bw * .15}" y="${y(x.kcal)}" width="${bw * .7}" height="${H - pad - y(x.kcal)}" rx="3" fill="var(--accent)"><title>${x.d}: ${Math.round(x.kcal)} ккал</title></rect>` +
        (i % step === 0 ? `<text x="${cx + bw / 2}" y="${H - 8}" text-anchor="middle" font-size="11" fill="var(--muted)">${x.d.slice(8)}</text>` : '');
    }).join('');
    const line = goalKcal ? `<line x1="${pad}" x2="${W - pad}" y1="${y(goalKcal)}" y2="${y(goalKcal)}" stroke="var(--ink)" stroke-dasharray="5 4"/>
      <text x="${W - pad}" y="${y(goalKcal) - 6}" text-anchor="end" font-size="12" fill="var(--ink)">цель ${goalKcal}</text>` : '';
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Калории по дням">${cols}${line}</svg>`;
  }

  async function render() {
    const n = +sel.value;
    const dates = Array.from({ length: n }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (n - 1 - i)); return d.toLocaleDateString('sv-SE'); });
    const all = await Store.getRange(dates[0], dates[n - 1]);
    const data = dates.map(d => ({ d, ...sum(all[d] || []), n: (all[d] || []).length }));
    const logged = data.filter(x => x.n);
    if (!logged.length) {
      $('#res').innerHTML = '<p class="empty">За этот период записей нет. <a href="diary.html">Добавьте приёмы пищи в дневник</a>.</p>'; return;
    }
    const avg = k => logged.reduce((a, x) => a + x[k], 0) / logged.length;
    const ok = goal ? logged.filter(x => Math.abs(x.kcal - goal.kcal) <= goal.kcal * 0.1).length : 0;
    $('#res').innerHTML = `<div class="facts">
        <div><b>${logged.length} из ${n}</b><span>дней с записями</span></div>
        <div><b>${Math.round(avg('kcal'))}</b><span>ккал в среднем за день</span></div>
        ${goal ? `<div><b>${ok}</b><span>дней в пределах 10% от цели</span></div>` : ''}</div>
      <h2>Калории по дням</h2>${bars(data, goal && goal.kcal)}
      <h2>Средний баланс БЖУ</h2>
      <div class="ring-wrap">${donut(avg('p'), avg('f'), avg('c'), `<b>${Math.round(avg('kcal'))}</b><small>ккал</small>`)}${legend(avg('p'), avg('f'), avg('c'))}</div>
      ${goal ? '' : '<p class="note">Задайте цель в <a href="index.html">калькуляторе</a>, чтобы увидеть линию цели.</p>'}`;
  }
  sel.addEventListener('change', render);
  render();
})();
