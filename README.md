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
- archivio JSON inizializzato automaticamente con dati di esempio

## Requisiti

- Node.js 16+ (consigliato Node.js 20+)
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

- I dati vengono salvati in `data/transactions.json`.
- All'avvio, se l'archivio è vuoto, vengono inseriti automaticamente alcuni movimenti di esempio.
- Lo script `npm run init-db` crea il file JSON e carica un seed iniziale se necessario.
- Non sono richieste dipendenze native o database esterni.

## Struttura del progetto

- `src/server.js`: server Express e rendering HTML
- `src/store.js`: persistenza JSON locale
- `src/categories.js`: categorie e sottocategorie predefinite
- `scripts/initDb.js`: bootstrap dell'archivio dati
- `public/styles.css`: stile dell'interfaccia

## Sviluppi futuri possibili

- modifica dei movimenti esistenti
- gestione separata dei membri della famiglia
- grafici avanzati
- autenticazione
- esportazione CSV/PDF
