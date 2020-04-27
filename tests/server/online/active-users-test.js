const {registerSocket, removeSocket, removeUser, isActive, getSocket, getUser} = require('../../../src/server/online/active-users');

test('Test register socket', async () => {
    
    const ws = {id: 123};
    const userId = "Foo";
    
    registerSocket(ws, userId);
    
    expect(isActive(userId)).toEqual(true);
    
});

test('Test remove socket', async () => {

    const ws = {id: 123};
    const userId = "Foo";

    registerSocket(ws, userId);

    expect(isActive(userId)).toEqual(true);
    
    removeSocket(ws.id);

    expect(isActive(userId)).toEqual(false);

});

test('Test remove user', async () => {

    const ws = {id: 123};
    const userId = "Foo";

    registerSocket(ws, userId);

    expect(isActive(userId)).toEqual(true);
    
    removeUser(userId);

    expect(isActive(userId)).toEqual(false);
    
});

test('Test get socket', async () => {

    const ws = {id: 123};
    const userId = "Foo";

    registerSocket(ws, userId);

    expect(getSocket(userId)).toEqual(ws);
    
});

test('Test get user', async () => {

    const ws = {id: 123};
    const userId = "Foo";

    registerSocket(ws, userId);

    expect(getUser(ws.id)).toEqual(userId);
    
});
