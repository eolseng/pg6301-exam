const React = require('react');
const {mount} = require('enzyme');

const {overrideWebSocket} = require("../mytest-utils-ws");
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');

const {Chat} = require('../../src/client/chat');
const {app} = require('../../src/server/app');

/*
    I could not find any good ways to test the WebSocket from the Client-perspective,
    so I only test that the component renders messages correctly.
 */

async function stubSendMessage(driver, message) {

    const messageInput = driver.find("#message-input").at(0);

    messageInput.simulate('change', {target: {value: message}});

    const msgStateUpdate = () => {
        driver.update();
        let msgText = driver.state().msgText;
        return msgText === message;
    };
    const stateChanged = await asyncCheckCondition(msgStateUpdate, 500, 100);
    expect(stateChanged).toEqual(true);

    // Stubbing away the click-event
    let msg = {userId: driver.props().user.id, timestamp: new Date().toString(), message: message};
    driver.instance().onNewMessage(msg);
    messageInput.simulate('change', {target: {value: ""}});

}

test("Test message state", async () => {

    overrideFetch(app);
    overrideWebSocket();

    let userId = "Foo";
    let user = {id: userId};
    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());

    const driver = mount(
        <Chat user={user} fetchAndUpdateUserInfo={fetchAndUpdateUserInfo}/>
    );

    let msg;
    const predicate = () => {
        driver.update();
        const html = driver.html();
        return html.includes(msg);
    };

    msg = "No messages";
    let displayedMessage = await asyncCheckCondition(predicate, 500, 100);
    expect(displayedMessage).toEqual(true);

    let message = "Hello World!";
    await stubSendMessage(driver, message);

    const renderedMessagePredicate = () => {
        driver.update();
        const html = driver.html();
        return html.includes(message);
    };
    displayedMessage = await asyncCheckCondition(renderedMessagePredicate, 500, 100);
    expect(displayedMessage).toEqual(true);

});