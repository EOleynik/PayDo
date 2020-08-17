import loginPage from "../elements/LoginPage";
import feenPage from "../elements/FeenPage";
import homePage from "../elements/HomePage";
import transactionsPage from "../elements/TransactionsPage";
import createCheckoutPage from "../elements/CreateCheckoutPage"

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(8);
}

describe('Checkout suit API, strategy MAX', () => {

    describe('Checkout API', () => {

        beforeEach('', () => {
            feenPage.installComStrategMAX(1, 6);// Strategy MAX fix(EUR), persent(%)
            loginPage.getAuthorization();
        })

        it('Checkout, currency GBP', () => {
            let conversion = 0;
            let payAmount = cy.getRandomArbitrary(1, 10);
            //let payAmount = 10;
            let payCurrency = 'GBP';

            loginPage.getAuthorization();

            createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);

            loginPage.visit('/');
            cy.wait(2000);
            loginPage.getButtonToAdmibPanel().click();
            cy.wait(2000);
            homePage.getMenuPaymentHistory().click();
            cy.wait(2000);
            transactionsPage.checkAmountUiGbpMax(payAmount, conversion);
        })

        it('Checkout, currency USD', () => {
            let conversion = 3.5;
            let payAmount = cy.getRandomArbitrary(1, 10);
            //let payAmount = 10;
            let payCurrency = 'USD';

            loginPage.getAuthorization();

            createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);

            loginPage.visit('/');
            cy.wait(2000);
            loginPage.getButtonToAdmibPanel().click();
            cy.wait(2000);
            homePage.getMenuPaymentHistory().click();
            cy.wait(2000);
            transactionsPage.checkAmountUSDMax(payAmount, conversion, payCurrency);
        })

    })
})
