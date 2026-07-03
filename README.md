# Elpocho - Bilancio familiare

Applicazione web Node.js per la gestione del bilancio familiare con entrate e uscite mensili, categorie predefinite e sottocategorie personalizzabili.

## Funzionalità incluse

- dashboard con totale entrate, totale uscite e saldo mensile
- filtro per mese
- inserimento di movimenti di tipo entrata o uscita
- categorie di spesa predefinite:
  - Figli
  - Auto
  - Casa
  - Utenze
  - Abbonamenti
  - Viaggi
  - Extra
  - Varie
- sottocategorie suggerite e possibilità di inserire sottocategorie personalizzate
- elenco movimenti del mese
- riepilogo aggregato delle spese per categoria
- eliminazione di un movimento
- database SQLite inizializzato automaticamente con dati di esempio

## Requisiti

- Node.js 20+ consigliato
- npm

## Installazione

```bash
npm install
npm run init-db
npm start
```

Apri poi il browser su:

```bash
http://localhost:3000
```

## Note tecniche

- Il database SQLite viene salvato in `data/budget.db`.
- All'avvio, se il database è vuoto, vengono inseriti automaticamente alcuni movimenti di esempio.
- Lo script `npm run init-db` crea la tabella e carica un seed iniziale se necessario.

## Struttura del progetto

- `src/server.js`: server Express e rendering HTML
- `src/db.js`: inizializzazione connessione SQLite
- `src/categories.js`: categorie e sottocategorie predefinite
- `scripts/initDb.js`: bootstrap del database
- `public/styles.css`: stile dell'interfaccia

## Sviluppi futuri possibili

- modifica dei movimenti esistenti
- gestione separata dei membri della famiglia
- grafici avanzati
- autenticazione
- esportazione CSV/PDF
