const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {app} = require('../../src/server/app');

const {SignUp} = require('../../src/client/signup');
const {resetAllUsers, getUser, createUser} = require('../../src/server/db/users');

beforeEach(() => {
    resetAllUsers();
});

function fillForm(driver, id, password, confirmPassword) {

    const userIdInput = driver.find("#userId-input").at(0);
    const passwordInput = driver.find("#password-input").at(0);
    const confirmPasswordInput = driver.find("#confirmPassword-input").at(0);
    const signupBtn = driver.find("#signup-btn").at(0);

    userIdInput.simulate('change', {target: {value: id}});
    passwordInput.simulate('change', {target: {value: password}});
    confirmPasswordInput.simulate('change', {target: {value: confirmPassword}});

    signupBtn.simulate('click');

}

test("Test password mismatch", async () => {

    const mismatchText = "Passwords do not match.";

    overrideFetch(app);

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp/>
        </MemoryRouter>
    );
    expect(driver.html().includes(mismatchText)).toEqual(false);

    fillForm(driver, "test", "test", "wrongPassword");

    const error = await asyncCheckCondition(() => {
        driver.update();
        return driver.html().includes(mismatchText);
    }, 2000, 200);
    expect(error).toEqual(true);

});

test("Test create user", async () => {

    const userId = "test";
    const password = "test";

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history}/>
        </MemoryRouter>
    );

    fillForm(driver, userId, password, password);

    const isRedirected = await asyncCheckCondition(() => {
        return page === "/"
    }, 2000, 200);
    expect(isRedirected).toEqual(true);

    expect(getUser(userId).id).toEqual(userId);

});

test("Test fail to create existing user", async () => {

    const userId = "test";
    const password = "test";
    createUser(userId, password);

    const failText = "Invalid username or password";

    overrideFetch(app);

    const fetchAndUpdateUserInfo = () => new Promise(resolve => resolve());
    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/signup"]}>
            <SignUp fetchAndUpdateUserInfo={fetchAndUpdateUserInfo} history={history}/>
        </MemoryRouter>
    );

    fillForm(driver, userId, password, password);

    const failed = await asyncCheckCondition(() => {
        driver.update;
        return driver.html().includes(failText);
    }, 2000, 200);
    expect(failed).toEqual(true);

});
