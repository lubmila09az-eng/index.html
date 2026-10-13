(async () => {
  layout();
  let list = await Store.getProducts();
  const q = $('#q');

  function render() {
    const s = q.value.trim().toLowerCase(), v = list.filter(p => p.name.toLowerCase().includes(s));
    $('#rows').innerHTML = v.map(p => `<tr><td>${esc(p.name)}</td><td>${p.kcal}</td><td>${p.p}</td><td>${p.f}</td><td>${p.c}</td>
      <td><button class="link" data-id="${p.id}" aria-label="Удалить ${esc(p.name)}">Удалить</button></td></tr>`).join('');
    $('#empty').hidden = v.length > 0;
  }

  $('#add').addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    await Store.addProduct({ name: d.name.trim(), kcal: +d.kcal, p: +d.p, f: +d.f, c: +d.c });
    list = await Store.getProducts(); e.target.reset(); render();
  });
  $('#rows').addEventListener('click', async e => {
    const id = e.target.dataset.id;
    if (id) { await Store.deleteProduct(id); list = await Store.getProducts(); render(); }
  });
  q.addEventListener('input', render);
  render();
})();
