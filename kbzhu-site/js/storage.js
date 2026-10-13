/* СЛОЙ ДАННЫХ. Сейчас всё хранится в localStorage.
   Позже: замените тела методов на fetch('/api/...') к серверу с БД (см. db/schema.sql).
   Все методы уже async, поэтому остальной код сайта менять не придётся. */
const SEED = [
  ['Куриная грудка варёная', 137, 29.8, 1.8, 0.5], ['Яйцо куриное', 157, 12.7, 11.5, 0.7], ['Рис варёный', 116, 2.2, 0.5, 24.9],
  ['Гречка варёная', 110, 4.2, 1.1, 21.3], ['Овсяные хлопья', 342, 12.3, 6.1, 59.5], ['Творог 5%', 121, 17, 5, 1.8],
  ['Молоко 2,5%', 52, 2.8, 2.5, 4.7], ['Кефир 1%', 40, 3, 1, 4], ['Сыр твёрдый', 364, 24, 29, 0.3],
  ['Говядина варёная', 254, 25.8, 16.8, 0], ['Лосось', 208, 20, 13, 0], ['Макароны варёные', 158, 5.8, 0.9, 30.9],
  ['Картофель варёный', 82, 2, 0.4, 16.7], ['Хлеб ржаной', 214, 6.6, 1.2, 40.9], ['Яблоко', 52, 0.3, 0.2, 13.8],
  ['Банан', 89, 1.1, 0.3, 22.8], ['Огурец', 15, 0.8, 0.1, 2.8], ['Помидор', 20, 1.1, 0.2, 3.7],
  ['Оливковое масло', 884, 0, 100, 0], ['Миндаль', 579, 21, 50, 22]
]; // ккал, белки, жиры, углеводы на 100 г (ориентировочные значения)

const Store = {
  _g(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  _s(k, v) { localStorage.setItem(k, JSON.stringify(v)); },

  // --- продукты (позже: таблица products) ---
  async getProducts() {
    let l = this._g('kk_products', null);
    if (!l) { l = SEED.map(([name, kcal, p, f, c], i) => ({ id: 's' + i, name, kcal, p, f, c })); this._s('kk_products', l); }
    return l;
  },
  async addProduct(x) {
    const l = await this.getProducts(); l.push({ ...x, id: uid() });
    l.sort((a, b) => a.name.localeCompare(b.name, 'ru')); this._s('kk_products', l);
  },
  async deleteProduct(id) { this._s('kk_products', (await this.getProducts()).filter(x => x.id !== id)); },

  // --- дневник (позже: таблица diary_entries) ---
  async getEntries(date) { return this._g('kk_diary', {})[date] || []; },
  async addEntry(date, e) { const all = this._g('kk_diary', {}); (all[date] ??= []).push({ ...e, id: uid() }); this._s('kk_diary', all); },
  async deleteEntry(date, id) { const all = this._g('kk_diary', {}); all[date] = (all[date] || []).filter(e => e.id !== id); this._s('kk_diary', all); },
  async getRange(from, to) { return Object.fromEntries(Object.entries(this._g('kk_diary', {})).filter(([d]) => d >= from && d <= to)); },

  // --- профиль и цели (позже: таблица goals) ---
  async getProfile() { return this._g('kk_profile', {}); },
  async saveProfile(p) { this._s('kk_profile', p); }
};
