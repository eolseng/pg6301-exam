const {createMessage, getAllMessages, resetAllMessages} = require('../../../src/server/db/chat');

beforeEach(() => {
    resetAllMessages();
});

test('Test no messages', async () => {
    const messages = getAllMessages();
    expect(messages.length).toEqual(0);
});

test('Test generate message', async () => {
    let messages = getAllMessages();
    expect(messages.length).toEqual(0);

    createMessage("Foo", "Jasså");
    messages = getAllMessages();
    expect(messages.length).toEqual(1);
});

test('Test delete messages', async () => {
    let messages = getAllMessages();
    expect(messages.length).toEqual(0);

    createMessage("Foo", "Jasså");
    messages = getAllMessages();
    expect(messages.length).toEqual(1);
    
    resetAllMessages();

    messages = getAllMessages();
    expect(messages.length).toEqual(0);
});
