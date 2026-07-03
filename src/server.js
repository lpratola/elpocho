const path = require('path');
const express = require('express');
const categories = require('./categories');
const { ensureStore, seedTransactions, listTransactions, addTransaction, deleteTransaction } = require('./store');

const app = express();
const port = process.env.PORT || 3000;

const seedRows = [
  {
    date: '2026-07-01',
    description: 'Stipendio familiare',
    amount: 3200,
    type: 'entrata',
    category: 'Stipendio',
    subcategory: 'Stipendio principale',
  },
  {
    date: '2026-07-02',
    description: 'Bolletta gas',
    amount: 75,
    type: 'uscita',
    category: 'Utenze',
    subcategory: 'Gas',
  },
  {
    date: '2026-07-04',
    description: 'Carburante auto',
    amount: 90,
    type: 'uscita',
    category: 'Auto',
    subcategory: 'Carburante',
  },
  {
    date: '2026-07-07',
    description: 'Gita nel weekend',
    amount: 140,
    type: 'uscita',
    category: 'Viaggi',
    subcategory: 'Attività',
  },
  {
    date: '2026-07-09',
    description: 'Bonus straordinario',
    amount: 250,
    type: 'entrata',
    category: 'Entrate extra',
    subcategory: 'Bonus',
  },
];

function initializeStore() {
  ensureStore();
  seedTransactions(seedRows);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatCurrency(value) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value || 0);
}

function getMonthOptions(selectedMonth) {
  const now = new Date();
  const options = [];

  for (let offset = -6; offset <= 6; offset += 1) {
    const date = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    options.push(`<option value="${value}" ${value === selectedMonth ? 'selected' : ''}>${value}</option>`);
  }

  return options.join('');
}

function normalizeMonth(month) {
  if (/^\d{4}-\d{2}$/.test(month || '')) {
    return month;
  }

  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getTransactions(month) {
  return listTransactions()
    .filter((transaction) => transaction.date.startsWith(month))
    .sort((a, b) => {
      if (a.date === b.date) {
        return b.id - a.id;
      }
      return a.date < b.date ? 1 : -1;
    });
}

function getSummary(month) {
  const transactions = getTransactions(month);
  const totalIncome = transactions
    .filter((transaction) => transaction.type === 'entrata')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === 'uscita')
    .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

  const totalsByCategory = new Map();
  for (const transaction of transactions.filter((item) => item.type === 'uscita')) {
    totalsByCategory.set(
      transaction.category,
      (totalsByCategory.get(transaction.category) || 0) + Number(transaction.amount)
    );
  }

  const byCategory = Array.from(totalsByCategory.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category));

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    byCategory,
  };
}

function renderPage({ month, error = '', form = {} }) {
  const summary = getSummary(month);
  const transactions = getTransactions(month);
  const categorySummaryRows = summary.byCategory.length
    ? summary.byCategory
        .map(
          (row) => `
            <tr>
              <td>${escapeHtml(row.category)}</td>
              <td class="amount expense">${formatCurrency(row.total)}</td>
            </tr>`
        )
        .join('')
    : '<tr><td colspan="2">Nessuna spesa registrata per questo mese.</td></tr>';

  const transactionRows = transactions.length
    ? transactions
        .map(
          (transaction) => `
            <tr>
              <td>${escapeHtml(transaction.date)}</td>
              <td>${escapeHtml(transaction.description)}</td>
              <td><span class="pill ${transaction.type}">${escapeHtml(transaction.type)}</span></td>
              <td>${escapeHtml(transaction.category)}</td>
              <td>${escapeHtml(transaction.subcategory || '-')}</td>
              <td class="amount ${transaction.type === 'entrata' ? 'income' : 'expense'}">${formatCurrency(transaction.amount)}</td>
              <td>
                <form method="post" action="/transactions/${transaction.id}/delete?month=${encodeURIComponent(month)}" onsubmit="return confirm('Eliminare questo movimento?');">
                  <button type="submit" class="danger">Elimina</button>
                </form>
              </td>
            </tr>`
        )
        .join('')
    : '<tr><td colspan="7">Nessun movimento registrato per il mese selezionato.</td></tr>';

  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bilancio familiare</title>
  <link rel="stylesheet" href="/styles.css" />
</head>
<body>
  <main class="container">
    <header class="hero">
      <div>
        <p class="eyebrow">Gestione spese familiari</p>
        <h1>Bilancio mensile familiare</h1>
        <p class="subtitle">Monitora entrate, uscite e riepiloghi per categoria in un'unica schermata.</p>
      </div>
      <form method="get" action="/" class="month-filter">
        <label for="month">Mese</label>
        <select id="month" name="month" onchange="this.form.submit()">
          ${getMonthOptions(month)}
        </select>
      </form>
    </header>

    <section class="cards">
      <article class="card income-card">
        <span>Entrate</span>
        <strong>${formatCurrency(summary.totalIncome)}</strong>
      </article>
      <article class="card expense-card">
        <span>Uscite</span>
        <strong>${formatCurrency(summary.totalExpense)}</strong>
      </article>
      <article class="card balance-card">
        <span>Saldo</span>
        <strong class="${summary.balance >= 0 ? 'income' : 'expense'}">${formatCurrency(summary.balance)}</strong>
      </article>
    </section>

    <section class="layout">
      <section class="panel form-panel">
        <h2>Nuovo movimento</h2>
        ${error ? `<div class="error">${escapeHtml(error)}</div>` : ''}
        <form method="post" action="/transactions" class="transaction-form">
          <input type="hidden" name="month" value="${escapeHtml(month)}" />

          <label>
            Data
            <input type="date" name="date" value="${escapeHtml(form.date || `${month}-01`)}" required />
          </label>

          <label>
            Descrizione
            <input type="text" name="description" value="${escapeHtml(form.description || '')}" maxlength="120" required />
          </label>

          <label>
            Tipo
            <select name="type" id="type" required>
              <option value="entrata" ${(form.type || '') === 'entrata' ? 'selected' : ''}>Entrata</option>
              <option value="uscita" ${(form.type || 'uscita') === 'uscita' ? 'selected' : ''}>Uscita</option>
            </select>
          </label>

          <label>
            Categoria
            <select name="category" id="category" required></select>
          </label>

          <label>
            Sottocategoria
            <input type="text" name="subcategory" id="subcategory" value="${escapeHtml(form.subcategory || '')}" list="subcategory-list" placeholder="Opzionale o personalizzata" />
            <datalist id="subcategory-list"></datalist>
          </label>

          <label>
            Importo
            <input type="number" name="amount" value="${escapeHtml(form.amount || '')}" step="0.01" min="0.01" required />
          </label>

          <button type="submit">Salva movimento</button>
        </form>
      </section>

      <section class="panel">
        <h2>Spese per categoria</h2>
        <table>
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Totale</th>
            </tr>
          </thead>
          <tbody>
            ${categorySummaryRows}
          </tbody>
        </table>
      </section>
    </section>

    <section class="panel">
      <h2>Movimenti del mese</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descrizione</th>
            <th>Tipo</th>
            <th>Categoria</th>
            <th>Sottocategoria</th>
            <th>Importo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          ${transactionRows}
        </tbody>
      </table>
    </section>
  </main>

  <script>
    const categories = ${JSON.stringify(categories)};
    const initialType = ${JSON.stringify(form.type || 'uscita')};
    const initialCategory = ${JSON.stringify(form.category || '')};
    const categorySelect = document.getElementById('category');
    const typeSelect = document.getElementById('type');
    const subcategoryList = document.getElementById('subcategory-list');

    function renderCategoryOptions(type, selectedCategory) {
      const options = (categories[type] || []).map((item) => {
        const isSelected = item.name === selectedCategory ? 'selected' : '';
        return `<option value="${item.name}" ${isSelected}>${item.name}</option>`;
      }).join('');

      categorySelect.innerHTML = options;
      const nextCategory = categorySelect.value || (categories[type] && categories[type][0] ? categories[type][0].name : '');
      renderSubcategoryOptions(type, nextCategory);
    }

    function renderSubcategoryOptions(type, categoryName) {
      const group = (categories[type] || []).find((item) => item.name === categoryName);
      subcategoryList.innerHTML = (group?.subcategories || []).map((item) => `<option value="${item}"></option>`).join('');
    }

    typeSelect.addEventListener('change', () => renderCategoryOptions(typeSelect.value, ''));
    categorySelect.addEventListener('change', () => renderSubcategoryOptions(typeSelect.value, categorySelect.value));

    renderCategoryOptions(initialType, initialCategory);
  </script>
</body>
</html>`;
}

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

initializeStore();

app.get('/', (req, res) => {
  const month = normalizeMonth(req.query.month);
  res.send(renderPage({ month }));
});

app.post('/transactions', (req, res) => {
  const month = normalizeMonth(req.body.month);
  const form = {
    date: req.body.date,
    description: (req.body.description || '').trim(),
    amount: req.body.amount,
    type: req.body.type,
    category: (req.body.category || '').trim(),
    subcategory: (req.body.subcategory || '').trim(),
  };

  const amount = Number(form.amount);
  const selectedCategories = categories[form.type] || [];
  const hasCategory = selectedCategories.some((item) => item.name === form.category);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.date || '')) {
    return res.status(400).send(renderPage({ month, error: 'Inserisci una data valida.', form }));
  }

  if (!form.description) {
    return res.status(400).send(renderPage({ month, error: 'Inserisci una descrizione.', form }));
  }

  if (!['entrata', 'uscita'].includes(form.type)) {
    return res.status(400).send(renderPage({ month, error: 'Tipo movimento non valido.', form }));
  }

  if (!hasCategory) {
    return res.status(400).send(renderPage({ month, error: 'Seleziona una categoria valida.', form }));
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).send(renderPage({ month, error: 'Inserisci un importo maggiore di zero.', form }));
  }

  addTransaction({
    date: form.date,
    description: form.description,
    amount,
    type: form.type,
    category: form.category,
    subcategory: form.subcategory || null,
  });

  return res.redirect(`/?month=${encodeURIComponent(month)}`);
});

app.post('/transactions/:id/delete', (req, res) => {
  const month = normalizeMonth(req.query.month || req.body.month);
  const id = Number(req.params.id);

  if (Number.isInteger(id) && id > 0) {
    deleteTransaction(id);
  }

  res.redirect(`/?month=${encodeURIComponent(month)}`);
});

app.listen(port, () => {
  console.log(`Server avviato su http://localhost:${port}`);
});
