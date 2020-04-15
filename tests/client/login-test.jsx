const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {app} = require('../../src/server/app');

const {Login} = require('../../src/client/login');
const {resetAllUsers, getUser, createUser} = require('../../src/server/db/users');

beforeEach(() => {
    resetAllUsers();
});

function fillForm(driver, id, password, confirmPassword) {

    const userIdInput = driver.find("#userId-input").at(0);
    const passwordInput = driver.find("#password-input").at(0);
    const loginBtn = driver.find("#login-btn").at(0);

    userIdInput.simulate('change', {target: {value: id}});
    passwordInput.simulate('change', {target: {value: password}});

    loginBtn.simulate('click');

}

test("Test failed login", async () => {

    const failText = "Invalid user name or password";

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/login"]}>
            <Login/>
        </MemoryRouter>
    );

    fillForm(driver, "Test", "Test");

    const error = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes(failText);
    }, 2000, 200);
    expect(error).toEqual(true);

});

test("Test valid login", async () => {

    const userId = "Test";
    const password = "Test";
    createUser(userId, password);

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <Login fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history} />
        </MemoryRouter>
    );

    fillForm(driver, userId, password);

    const isRedirected = await asyncCheckCondition(() => {
        return page === "/";
    }, 2000, 200);
    expect(isRedirected).toEqual(true);

});