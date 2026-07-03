const { getDb } = require('../src/db');
const categories = require('../src/categories');

const seedTransactions = [
  {
    date: '2026-07-01',
    description: 'Stipendio Luca',
    amount: 2500,
    type: 'entrata',
    category: 'Stipendio',
    subcategory: 'Stipendio principale',
  },
  {
    date: '2026-07-03',
    description: 'Supermercato casa',
    amount: 180,
    type: 'uscita',
    category: 'Casa',
    subcategory: 'Manutenzione',
  },
  {
    date: '2026-07-05',
    description: 'Bolletta luce',
    amount: 95,
    type: 'uscita',
    category: 'Utenze',
    subcategory: 'Luce',
  },
  {
    date: '2026-07-08',
    description: 'Piscina bambini',
    amount: 60,
    type: 'uscita',
    category: 'Figli',
    subcategory: 'Sport',
  },
  {
    date: '2026-07-10',
    description: 'Rimborso spese',
    amount: 120,
    type: 'entrata',
    category: 'Entrate extra',
    subcategory: 'Rimborsi',
  },
];

const db = getDb();

db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    description TEXT NOT NULL,
    amount REAL NOT NULL CHECK(amount > 0),
    type TEXT NOT NULL CHECK(type IN ('entrata', 'uscita')),
    category TEXT NOT NULL,
    subcategory TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`);

const count = db.prepare('SELECT COUNT(*) as count FROM transactions').get();

if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO transactions (date, description, amount, type, category, subcategory)
    VALUES (@date, @description, @amount, @type, @category, @subcategory)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) {
      insert.run(item);
    }
  });

  insertMany(seedTransactions);
}

console.log('Database inizializzato con successo.');
console.log('Categorie disponibili:', JSON.stringify(categories, null, 2));
