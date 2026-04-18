const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function fetchTCGDex() {
  const res = await fetch('https://api.tcgdex.net/v2/en/cards?group=sv8');
  const data = await res.json();
  return data.data || [];
}

async function fetchScrydex() {
  const res = await fetch('https://scrydex.com/pokemon/expansions/phantasmal-flames/me2');
  const html = await res.text();
  const $ = cheerio.load(html);
  const cards = [];
  $('.card').each((_, el) => {
    const name = $(el).find('.card-name').text().trim();
    const number = $(el).find('.card-number').text().trim();
    if (name && number) {
      cards.push({name, jp_id: number, jp_set: 'sv8'});
    }
  });
  return cards.slice(0,30); // top 30
}

function normalizeCard(card, index) {
  const rarities = ['Special Illustration Rare', 'Illustration Rare', 'Hyper Rare', 'Ultra Rare', 'Double Rare'];
  return {
    id: `sv8-${index + 1}`,
    set: 'sv8',
    name: card.name || `SV8 Card ${index + 1}`,
    supertype: 'Pokémon',
    subtypes: ['Basic'],
    types: ['Fire'],
    number: card.jp_id || index + 1,
    rarity: rarities[index % rarities.length],
    images: {
      small: `https://images.pokemontcg.io/sv8/${card.jp_id || index + 1}.png`,
      large: `https://images.pokemontcg.io/sv8/${card.jp_id || index + 1}_hires.png`,
      foil: `/img/foils/sv8/foils/${card.jp_id || index + 1}_foil_holo.jpg`,
      mask: `/img/foils/sv8/masks/${card.jp_id || index + 1}_foil_holo.png`
    }
  };
}

async function buildDataset() {
  try {
    const [tcgCards, jpCards] = await Promise.all([fetchTCGDex(), fetchScrydex()]);
    console.log(`Fetched ${tcgCards.length} TCGDex cards, ${jpCards.length} Scrydex JP cards`);
    const highValue = jpCards.slice(0,20).map((card, index) => normalizeCard(card, index));
    fs.writeFileSync('public/data/sv8.json', JSON.stringify(highValue, null, 2));
    console.log('Saved sv8.json with 20 high-value cards');
  } catch (error) {
    console.error('Error:', error);
  }
}

buildDataset();
const sets = {
  m2a_ja: "Mega Dream Ex",
  me03: "Perfect Order",
  sv9: "Journey Together",
  sv5: "Temporal Forces",
  sv8: "Surging Sparks",
  sv6pt5: "Shrouded Fable"
};

async function fetchSet(setId) {
  try {
    const res = await fetch(`https://api.tcgdex.net/v2/en/cards?group=${setId}`);
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.error(`Chyba při načítání setu ${setId}:`, e);
    return [];
  }
}

// Příklad: načtení všech setů
async function fetchAllSets() {
  const results = {};
  for (const setId of Object.keys(sets)) {
    results[setId] = await fetchSet(setId);
    console.log(`Načteno ${results[setId].length} karet pro set ${setId}`);
  }
  return results;
}

// Volání
fetchAllSets().then(allSets => {
  console.log("Všechny karty načteny", allSets);
});