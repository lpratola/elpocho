const categories = {
  entrata: [
    { name: 'Stipendio', subcategories: ['Stipendio principale', 'Bonus'] },
    { name: 'Entrate extra', subcategories: ['Regali', 'Rimborsi', 'Altro'] },
  ],
  uscita: [
    { name: 'Figli', subcategories: ['Scuola', 'Sport', 'Salute', 'Tempo libero'] },
    { name: 'Auto', subcategories: ['Carburante', 'Manutenzione', 'Assicurazione', 'Bollo'] },
    { name: 'Casa', subcategories: ['Affitto/Mutuo', 'Manutenzione', 'Arredamento'] },
    { name: 'Utenze', subcategories: ['Luce', 'Gas', 'Acqua', 'Spazzatura'] },
    { name: 'Abbonamenti', subcategories: ['Streaming', 'Telefono', 'Internet', 'Software'] },
    { name: 'Viaggi', subcategories: ['Trasporti', 'Alloggio', 'Attività'] },
    { name: 'Extra', subcategories: ['Regali', 'Svago', 'Emergenze'] },
    { name: 'Varie', subcategories: ['Spese impreviste', 'Altro'] },
  ],
};

module.exports = categories;
