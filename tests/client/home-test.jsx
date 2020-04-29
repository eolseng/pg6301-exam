const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Home} = require("../../src/client/home");

const {getAllCards} = require('../../src/server/db/cards');

const allCards = [...getAllCards().values()];
const notLoggedInMessage = "Welcome to Schmidts Stinging Friends";

test('Test not logged in', async () => {

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Home allCards={allCards}/>
        </MemoryRouter>
    );
    
    const html = driver.html();
    expect(html.includes(notLoggedInMessage)).toEqual(true);

});

test('Test logged in', async () => {

    const id = "Schmidt";
    const cash = 100;
    const cardAmount = 0;
    const lootboxes = 3;
    const user = {
        "id": id,
        "cash": cash,
        "cardAmount": cardAmount,
        "cards": [],
        "lootboxes": lootboxes
    };

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Home user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} allCards={allCards}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(notLoggedInMessage)).toEqual(false);
    expect(html.includes("You have")).toEqual(true);
    expect(html.includes("View my cards")).toEqual(true);

});
