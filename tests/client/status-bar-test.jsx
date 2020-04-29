const React = require('react');
const {mount} = require('enzyme');

const {StatusBar} = require("../../src/client/status-bar");

const {getAllCards} = require('../../src/server/db/cards');

test('Test not logged in', async () => {

    const driver = mount(<StatusBar/>);
    expect(driver.html()).toEqual("");

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
    const allCards = [...getAllCards().values()];

    const driver = mount (
        <StatusBar user={user} allCards={allCards}/>
    );
    const html = driver.html();

    expect(html.includes(id)).toEqual(true);
    expect(html.includes(cash)).toEqual(true);
    expect(html.includes(cardAmount)).toEqual(true);
    expect(html.includes(lootboxes)).toEqual(true);

});