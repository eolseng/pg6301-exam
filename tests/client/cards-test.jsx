const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Cards} = require("../../src/client/cards");
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {app} = require('../../src/server/app');

const {resetAllUsers} = require('../../src/server/db/users');

beforeEach(() => {
    resetAllUsers();
});

const noCardsMessage = "You do not have any cards.";

async function signUp(userId, password) {
    const response = await fetch("/api/signup", {
        method: "post",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({userId: userId, password: password}),
    });
    return response.status === 201;
}

async function getUser() {
    const response = await fetch("/api/user", {
        method: "get"
    });
    expect(response.status).toEqual(200);
    return await response.json();
}

async function openLootbox() {
    const response = await fetch("/api/lootbox/open", {
        method: "post"
    });
    return response.status === 202;
}

async function getCards() {
    const response = await fetch("/api/user/cards", {
        method: "get"
    });
    expect(response.status).toEqual(200);
    return await response.json();
}

test('Test not logged in', async () => {

    const driver = mount(<Cards/>);

    const html = driver.html();
    expect(html).toEqual("");

});

test('Test no cards', async () => {

    overrideFetch(app);
    
    const signedUp = await signUp("Schmidt", "Donovan");
    expect(signedUp).toEqual(true);
    
    const user = await getUser();
    expect(user.id).toBeDefined();

    const driver = mount(<Cards user={user}/>);
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes(noCardsMessage);
    }, 500, 100);
    expect(displayed).toEqual(true);
    
});

test('Test with cards', async () => {

    overrideFetch(app);

    const signedUp = await signUp("Sauron", "Donovan");
    expect(signedUp).toEqual(true);

    const user = await getUser();
    expect(user.id).toBeDefined();
    
    const openedBox = await openLootbox();
    expect(openedBox).toEqual(true);
    
    const cards = await getCards();
    expect(cards.length).toBeGreaterThan(0);

    const driver = mount(<Cards user={user}/>);
    driver.setState({cards: cards});
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return !driver.html().includes(noCardsMessage);
    }, 500, 100);
    expect(displayed).toEqual(true);
    
    const cardsContainer = driver.find(".cards-container");
    expect(cardsContainer).toBeDefined();
    
});

