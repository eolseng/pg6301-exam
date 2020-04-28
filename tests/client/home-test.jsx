const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Home} = require("../../src/client/home");

const notLoggedInMessage = "Welcome to Schmidts Stinging Friends";

test('Test not logged in', async () => {

    const driver = mount(<Home/>);
    
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
        "lootboxes": lootboxes
    };

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Home user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(notLoggedInMessage)).toEqual(false);
    expect(html.includes(id)).toEqual(true);
    expect(html.includes(cash)).toEqual(true);
    expect(html.includes(cardAmount)).toEqual(true);
    expect(html.includes(lootboxes)).toEqual(true);

});
