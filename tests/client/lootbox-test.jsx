const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Lootbox} = require("../../src/client/lootbox");
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {app} = require('../../src/server/app');

const {resetAllUsers} = require('../../src/server/db/users');

beforeEach(() => {
    resetAllUsers();
});

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

function clickOpenLootbox(driver) {
    const openBtn = driver.find("#lootbox-open-btn").at(0);
    openBtn.simulate('click');
}

function clickPurchaseLootbox(driver) {
    const openBtn = driver.find("#lootbox-purchase-btn").at(0);
    openBtn.simulate('click');
}

test('Test not logged in', async () => {

    const driver = mount(<Lootbox/>);

    const html = driver.html();
    expect(html).toEqual("");

});

test('Test logged in', async () => {

    overrideFetch(app);

    const signedUp = await signUp("Schmidt", "Donovan");
    expect(signedUp).toEqual(true);

    const user = await getUser();
    expect(user.id).toBeDefined();
    
    const driver = mount(<Lootbox user={user}/>);
    const hasBtn = driver.html().includes("Open a lootbox!");
    expect(hasBtn).toEqual(true);
    
});

test('Test open lootbox', async () => {

    overrideFetch(app);

    const signedUp = await signUp("Schmidt", "Donovan");
    expect(signedUp).toEqual(true);

    let user = await getUser();
    expect(user.id).toBeDefined();

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(<Lootbox user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>);
    
    clickOpenLootbox(driver);
    user = await getUser();
    driver.setProps({user: user});
    
    const displayed = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes("Congratulations");
    }, 500, 100);
    expect(displayed).toEqual(true);

    const cards = driver.find(".card-container");
    expect(cards.length).toEqual(3);

});

test('Test purchase lootbox', async () => {

    overrideFetch(app);

    const signedUp = await signUp("Schmidt", "Donovan");
    expect(signedUp).toEqual(true);

    let user = await getUser();
    expect(user.id).toBeDefined();
    expect(user.lootboxes).toEqual(3);
    const prev = user.lootboxes;

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    const driver = mount(<Lootbox user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>);
    
    clickPurchaseLootbox(driver);
    user = await getUser();
    expect(user.lootboxes).toBeGreaterThan(prev);

});