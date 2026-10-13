-- Схема на будущее (PostgreSQL / SQLite). Сайт пока работает без неё, на localStorage.
CREATE TABLE users (
  id        INTEGER PRIMARY KEY,
  name      TEXT NOT NULL,
  email     TEXT UNIQUE NOT NULL
);

CREATE TABLE products (               -- значения на 100 г
  id        INTEGER PRIMARY KEY,
  user_id   INTEGER REFERENCES users(id),   -- NULL = общий продукт
  name      TEXT NOT NULL,
  kcal      REAL NOT NULL,
  protein   REAL NOT NULL,
  fat       REAL NOT NULL,
  carbs     REAL NOT NULL
);

CREATE TABLE diary_entries (          -- снимок КБЖУ на момент записи
  id           INTEGER PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id),
  entry_date   DATE NOT NULL,
  meal         TEXT NOT NULL,
  product_id   INTEGER REFERENCES products(id),
  product_name TEXT NOT NULL,
  grams        REAL NOT NULL,
  kcal REAL NOT NULL, protein REAL NOT NULL, fat REAL NOT NULL, carbs REAL NOT NULL
);
CREATE INDEX idx_diary_user_date ON diary_entries(user_id, entry_date);

CREATE TABLE goals (
  user_id   INTEGER PRIMARY KEY REFERENCES users(id),
  kcal INTEGER, protein INTEGER, fat INTEGER, carbs INTEGER
);
