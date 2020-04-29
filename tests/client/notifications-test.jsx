const React = require('react');
const {mount} = require('enzyme');

const {overrideWebSocket} = require("../mytest-utils-ws");
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');

const {Notifications} = require('../../src/client/notifications');
const {app} = require('../../src/server/app');

/*
    I could not find any good ways to test the WebSocket from the Client-perspective,
    so I only test that the component renders correctly
 */

test('Test rendering', async () => {

    overrideFetch(app);
    overrideWebSocket();

    let userId = "Foo";
    let user = {id: userId};
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(<Notifications user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>);

    const notDisplaying = await asyncCheckCondition(() => {
        driver.update();
        return driver.html() === ""
    }, 500, 100);
    expect(notDisplaying).toEqual(true);

    driver.setState({notifying: true});
    const displaying = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes("You just received a new lootbox!")
    }, 500, 100);
    expect(displaying).toEqual(true);

});