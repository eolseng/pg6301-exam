const React = require('react');
const {mount} = require('enzyme');
const {MemoryRouter} = require('react-router-dom');

const {Header} = require('../../src/client/header');
const {overrideFetch, asyncCheckCondition} = require('../mytest-utils');
const {app} = require('../../src/server/app');

const signUpButtonText = "SIGN UP";
const logInButtonText = "LOG IN";

test("Test not logged in", async () => {

    const userId = null;
    const updateLoggedInUser = () => {};

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Header userId={userId} updateLoggedInUser={updateLoggedInUser}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(signUpButtonText)).toEqual(true);
    expect(html.includes(logInButtonText)).toEqual(true);

});

test("Test logged in", async () => {

    const userId = "Schmidt";
    const updateLoggedInUser = () => {};

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Header userId={userId} updateLoggedInUser={updateLoggedInUser}/>
        </MemoryRouter>
    );

    const html = driver.html();
    expect(html.includes(signUpButtonText)).toEqual(false);
    expect(html.includes(logInButtonText)).toEqual(false);
    expect(html.includes(userId)).toEqual(true);

});

test("Test log out", async () => {

    overrideFetch(app);

    let userId = "Schmidt";
    const updateLoggedInUser = (id) => {userId = id};

    let page = null;
    const history = {push: (h) => {page=h}};

    const driver = mount(
        <MemoryRouter initialEntries={["/home"]}>
            <Header userId={userId} updateLoggedInUser={updateLoggedInUser} history={history}/>
        </MemoryRouter>
    );
    const html = driver.html();
    expect(html.includes(userId)).toEqual(true);
    expect(html.includes("LOG OUT"));

    const logoutBtn = driver.find("#logout-btn").at(0);
    logoutBtn.simulate('click');

    const updated = await asyncCheckCondition(() => {
        driver.update();
        const isDisplayed = driver.html().includes(userId);
        return !isDisplayed;
    }, 2000, 200);

    expect(updated).toEqual(true);
    expect(userId).toEqual(null);
    expect(page).toEqual("/");

});