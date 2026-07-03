const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'transactions.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function ensureStore() {
  ensureDataDir();
  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({ lastId: 0, transactions: [] }, null, 2));
  }
}

function readStore() {
  ensureStore();
  return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
}

function writeStore(store) {
  ensureStore();
  fs.writeFileSync(dataPath, JSON.stringify(store, null, 2));
}

function seedTransactions(seedRows) {
  const store = readStore();
  if (store.transactions.length > 0) {
    return;
  }

  for (const row of seedRows) {
    store.lastId += 1;
    store.transactions.push({
      id: store.lastId,
      created_at: new Date().toISOString(),
      ...row,
    });
  }

  writeStore(store);
}

function listTransactions() {
  return readStore().transactions;
}

function addTransaction(transaction) {
  const store = readStore();
  store.lastId += 1;
  const next = {
    id: store.lastId,
    created_at: new Date().toISOString(),
    ...transaction,
  };
  store.transactions.push(next);
  writeStore(store);
  return next;
}

function deleteTransaction(id) {
  const store = readStore();
  const nextTransactions = store.transactions.filter((item) => item.id !== id);
  store.transactions = nextTransactions;
  writeStore(store);
}

module.exports = {
  dataPath,
  ensureStore,
  seedTransactions,
  listTransactions,
  addTransaction,
  deleteTransaction,
};
