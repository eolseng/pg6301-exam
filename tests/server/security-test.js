const request = require('supertest');
const {app} = require('../../src/server/app');

async function requiresAuthentication(method, url) {

    let response;
    if (method === "get") {
        response = await request(app)
            .get(url)
    } else if (method === "post") {
        response = await request(app)
            .post(url)
    } else if (method === "put") {
        response = await request(app)
            .put(url)
    } else if (method === "delete") {
        response = await request(app)
            .delete(url)
    }

    return response.statusCode === 401;
}

test('Test auth-api', async () => {

    // This endpoint is public
    const signup = await requiresAuthentication("post", "/api/signup");
    expect(signup).toEqual(false);

    // This endpoint is public
    const login = await requiresAuthentication("post", "/api/login");
    expect(login).toEqual(false);

    // This endpoint is public
    const logout = await requiresAuthentication("post", "/api/logout");
    expect(logout).toEqual(false);

    const wstoken = await requiresAuthentication("post", "/api/wstoken");
    expect(wstoken).toEqual(true);

});

test('Test card-api', async () => {

    // This endpoint is public
    const allCards = await requiresAuthentication("get", "/api/cards");
    expect(allCards).toEqual(false);

    // This endpoint is public
    const singleCard = await requiresAuthentication("get", "/api/cards/0");
    expect(singleCard).toEqual(false);

});

test('Test lootbox-api', async () => {

    const purchaseLootbox = await requiresAuthentication("post", "/api/lootbox/purchase");
    expect(purchaseLootbox).toEqual(true);

    const openLootbox = await requiresAuthentication("post", "/api/lootbox/open");
    expect(openLootbox).toEqual(true);

});

test('Test user-api', async () => {

    const userInfo = await requiresAuthentication("get", "/api/user");
    expect(userInfo).toEqual(true);

    const userCards = await requiresAuthentication("get", "/api/user/cards");
    expect(userCards).toEqual(true);

    const millCard = await requiresAuthentication("post", "/api/user/cards/0/mill");
    expect(millCard).toEqual(true);

    const deleteUser = await requiresAuthentication("delete", "/api/user/delete");
    expect(deleteUser).toEqual(true);

    const changePassword = await requiresAuthentication("put", "/api/user/changepassword");
    expect(changePassword).toEqual(true);

});