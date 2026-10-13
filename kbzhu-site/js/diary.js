(async () => {
  layout();
  const MEALS = ['Завтрак', 'Обед', 'Ужин', 'Перекус'];
  const day = $('#day'), sel = $('#prod'), meal = $('#meal');
  day.value = today();
  meal.innerHTML = MEALS.map(m => `<option>${m}</option>`).join('');
  const products = await Store.getProducts();
  sel.innerHTML = products.map(p => `<option value="${p.id}">${esc(p.name)}</option>`).join('');
  if (!products.length) $('#add button').disabled = true;
  const { goal } = await Store.getProfile(), g = goal || {};

  async function render() {
    const list = (await Store.getEntries(day.value)).sort((a, b) => MEALS.indexOf(a.meal) - MEALS.indexOf(b.meal));
    const t = sum(list);
    $('#tot').innerHTML = '<h2>Итого за день</h2>' + bar('Калории, ккал', t.kcal, g.kcal, 'k') +
      bar('Белки, г', t.p, g.p, 'p') + bar('Жиры, г', t.f, g.f, 'f') + bar('Углеводы, г', t.c, g.c, 'c') +
      (goal ? '' : '<p class="note">Цель не задана. <a href="index.html">Рассчитайте её в калькуляторе</a>.</p>');
    $('#rows').innerHTML = list.map(e => `<tr><td>${e.meal}</td><td>${esc(e.name)}</td><td>${e.grams}</td><td>${e.kcal}</td><td>${e.p}</td><td>${e.f}</td><td>${e.c}</td>
      <td><button class="link" data-id="${e.id}" aria-label="Удалить ${esc(e.name)}">Удалить</button></td></tr>`).join('');
    $('#empty').hidden = list.length > 0;
  }

  $('#add').addEventListener('submit', async e => {
    e.preventDefault();
    const p = products.find(x => x.id === sel.value), gr = +$('#g').value, k = gr / 100;
    await Store.addEntry(day.value, { meal: meal.value, name: p.name, grams: gr, kcal: r1(p.kcal * k), p: r1(p.p * k), f: r1(p.f * k), c: r1(p.c * k) });
    $('#g').value = ''; render();
  });
  $('#rows').addEventListener('click', async e => {
    const id = e.target.dataset.id;
    if (id) { await Store.deleteEntry(day.value, id); render(); }
  });
  day.addEventListener('change', render);
  render();
})();
