# КБЖУ-дневник — статический сайт

Открытие: VS Code → File → Open Folder → `kbzhu-site` → правой кнопкой на `index.html` → **Open with Live Server**
(расширение «Live Server»). Можно и просто открыть `index.html` в браузере.

## Структура

```
kbzhu-site/
├── index.html        калькулятор
├── diary.html        дневник
├── products.html     продукты
├── stats.html        статистика
├── goals.html        цели
├── css/style.css
├── js/
│   ├── config.js     ваше имя и контакты (меняются в одном месте)
│   ├── common.js     меню, футер, графики-кольца, общие функции
│   ├── storage.js    слой данных (сейчас localStorage)
│   ├── calculator.js, diary.js, products.js, stats.js
└── db/schema.sql     схема БД на будущее
```

| Файл | За что отвечает |
| --- | --- |
| index.html + js/calculator.js | Расчёт КБЖУ по формуле Миффлина — Сан-Жеора, сохранение цели |
| diary.html + js/diary.js | Записи по дням, итоги и прогресс относительно цели |
| products.html + js/products.js | Список продуктов на 100 г, поиск, добавление, удаление |
| stats.html + js/stats.js | График калорий по дням, средние значения, баланс БЖУ |
| goals.html + js/goals.js | Суточная норма, целевой вес и оценка срока |
| css/style.css | Единое оформление всех страниц |
| js/config.js | Имя автора и контакты для футера |
| js/storage.js | Единственное место, которое работает с хранилищем |

## Переход на базу данных

Все обращения к данным идут через `Store` в `js/storage.js`, методы уже асинхронные.
Для БД: поднять API (`GET/POST /api/products`, `/api/diary`, `/api/profile`) и заменить
тела методов `Store` на `fetch(...)`. Остальные файлы менять не нужно. Таблицы — в `db/schema.sql`.
