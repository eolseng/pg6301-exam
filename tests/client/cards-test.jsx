const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Cards} = require("../../src/client/cards");
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {app} = require('../../src/server/app');
const {getAllCards} = require('../../src/server/db/cards');

const {resetAllUsers} = require('../../src/server/db/users');

const allCards = [...getAllCards().values()];

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

test('Test not logged in', async () => {

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Cards allCards={allCards}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes("You have")).toEqual(false);

});

test('Test no cards', async () => {

    overrideFetch(app);

    const signedUp = await signUp("Schmidt", "Donovan");
    expect(signedUp).toEqual(true);

    const user = await getUser();
    expect(user.id).toBeDefined();

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Cards user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} allCards={allCards}/>
        </MemoryRouter>
    );

    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes(noCardsMessage);
    }, 500, 100);
    expect(displayed).toEqual(true);

});

test('Test with cards', async () => {

    overrideFetch(app);

    const signedUp = await signUp("Sauron", "Donovan");
    expect(signedUp).toEqual(true);

    let user = await getUser();
    expect(user.id).toBeDefined();

    const openedBox = await openLootbox();
    expect(openedBox).toEqual(true);

    user = await getUser();
    expect(user.cards.length).toBeGreaterThan(0);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Cards user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} allCards={allCards}/>
        </MemoryRouter>
    );

    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return !driver.html().includes(noCardsMessage);
    }, 500, 100);
    expect(displayed).toEqual(true);

    const cardsContainer = driver.find(".cards-container");
    expect(cardsContainer).toBeDefined();

});

