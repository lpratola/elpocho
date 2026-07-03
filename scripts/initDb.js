const categories = require('../src/categories');
const { ensureStore, seedTransactions, dataPath } = require('../src/store');

const seedRows = [
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

ensureStore();
seedTransactions(seedRows);

console.log('Archivio JSON inizializzato con successo.');
console.log(`File dati: ${dataPath}`);
console.log('Categorie disponibili:', JSON.stringify(categories, null, 2));
