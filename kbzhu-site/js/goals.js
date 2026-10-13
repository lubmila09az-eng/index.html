(async () => {
  layout();
  const f = $('#g'), pr = await Store.getProfile(), g = pr.goal || {}, el = n => f.elements[n];
  el('kcal').value = g.kcal ?? ''; el('p').value = g.p ?? ''; el('f').value = g.f ?? ''; el('c').value = g.c ?? '';
  el('weight').value = pr.body?.weight ?? ''; el('target').value = pr.target ?? '';

  function upd() {
    const k = +el('kcal').value, m = (+el('p').value) * 4 + (+el('f').value) * 9 + (+el('c').value) * 4;
    $('#kcheck').textContent = k ? `Белки, жиры и углеводы дают ${Math.round(m)} ккал из ${k}.` : '';
    const w = +el('weight').value, t = +el('target').value, diff = Math.abs(w - t);
    $('#eta').textContent = w && t ? (diff === 0 ? 'Вы уже на целевом весе.' :
      `До цели ${r1(diff)} кг. При темпе 0,5 кг в неделю это примерно ${Math.ceil(diff / 0.5)} нед.`) : '';
  }
  f.addEventListener('input', upd); upd();

  f.addEventListener('submit', async e => {
    e.preventDefault();
    const v = n => +el(n).value;
    pr.goal = { kcal: v('kcal'), p: v('p'), f: v('f'), c: v('c') };
    pr.target = v('target') || undefined;
    if (v('weight')) pr.body = { ...pr.body, weight: v('weight') };
    await Store.saveProfile(pr);
    $('#msg').textContent = 'Цели сохранены.';
  });
})();
