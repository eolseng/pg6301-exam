const {getCard, getRandomCard, getRandomCards, getAllCards} = require('../../../src/server/db/cards');

test('getCard', async () => {
    const id = 0;
    const card = getCard(id);
    expect(card.id).toEqual(id);
    expect(card.name).toBeDefined();
    expect(card.latinName).toBeDefined();
    expect(card.painLevel).toBeDefined();
    expect(card.description).toBeDefined();
    expect(card.value).toBeDefined();
});

test('Test get random card', async () => {
    const card = getRandomCard();
    expect(card.id).toBeDefined();
    expect(card.name).toBeDefined();
    expect(card.latinName).toBeDefined();
    expect(card.painLevel).toBeDefined();
    expect(card.description).toBeDefined();
    expect(card.value).toBeDefined();
});

test('Test get random cards', async () => {
    const amount = 3;
    
    const cards = getRandomCards(amount);
    
    expect(cards.length).toEqual(amount);

    expect(cards[0].id).toBeDefined();
    expect(cards[0].name).toBeDefined();
    expect(cards[0].latinName).toBeDefined();
    expect(cards[0].painLevel).toBeDefined();
    expect(cards[0].description).toBeDefined();
    expect(cards[0].value).toBeDefined();
});

test('Test get all cards', async () => {
    const cards = getAllCards();
    expect(cards.size).toBeGreaterThan(1);
});