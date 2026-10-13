(async () => {
  layout();
  const f = $('#f'), prof = await Store.getProfile(), L = 2 * Math.PI * 42;
  if (prof.body) for (const [k, v] of Object.entries(prof.body)) if (f.elements[k]) f.elements[k].value = v;
  let cur = null;

  function calc() {
    const d = Object.fromEntries(new FormData(f)), w = +d.weight, h = +d.height, a = +d.age;
    if (!(w >= 30 && h >= 100 && a >= 10)) return;
    const bmr = 10 * w + 6.25 * h - 5 * a + (d.sex === 'm' ? 5 : -161), tdee = bmr * +d.activity;
    const kcal = Math.round(tdee * +d.goal), p = Math.round(1.8 * w), fat = Math.round(kcal * 0.25 / 9);
    const c = Math.max(0, Math.round((kcal - p * 4 - fat * 9) / 4));
    cur = { goal: { kcal, p, f: fat, c }, body: d };

    const k = [p * 4, fat * 9, c * 4], t = k[0] + k[1] + k[2] || 1;
    let off = 0;
    ['rp', 'rf', 'rc'].forEach((id, i) => {
      const l = Math.max(k[i] / t * L - 3, 0), el = $('#' + id).style;
      el.strokeDasharray = `${l} ${L - l}`; el.strokeDashoffset = -off; off += k[i] / t * L;
    });
    $('#kcal').textContent = kcal; $('#vp').textContent = p + ' г'; $('#vf').textContent = fat + ' г'; $('#vc').textContent = c + ' г';
    $('#note').innerHTML = `Базовый обмен: ${Math.round(bmr)} ккал, с учётом активности: ${Math.round(tdee)} ккал.` +
      (kcal < bmr ? '<br><span class="warn">Цель ниже базового обмена. Такой дефицит лучше обсудить с врачом.</span>' : '');
    $('#msg').textContent = '';
  }
  f.addEventListener('input', calc);
  $('#save').onclick = async () => {
    await Store.saveProfile({ ...prof, ...cur });
    $('#msg').textContent = 'Цель сохранена!';
  };
  setTimeout(calc, 150); // небольшая пауза, чтобы кольцо плавно «нарисовалось» при загрузке

  const { goal } = prof;
  if (goal) {
    const t = sum(await Store.getEntries(today()));
    $('#today').hidden = false;
    $('#today').innerHTML = '<h2>Сегодня</h2>' + bar('Калории, ккал', t.kcal, goal.kcal, 'k') + bar('Белки, г', t.p, goal.p, 'p') +
      '<a class="btn" href="diary.html">Добавить еду в дневник</a>';
  }
})();
