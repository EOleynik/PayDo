import feenPage from "../elements/FeenPage";
import loginPage from "../elements/LoginPage";
import homePage from "../elements/HomePage";
import restPage from "../elements/RestPage";
import paymentPage from "../elements/PaymentPage";
import transactionsPage from "../elements/TransactionsPage";

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
}

describe('Checkout suit, strategy MAX', () => {

    describe('Checkout', () => {

        beforeEach('', () => {
            feenPage.installComStrategMAX(1,6);// Strategy MAX fix(EUR), persent(%)
            loginPage.visit('/');
            loginPage.getAuthorization();
        })

        it('Checkout, currency GBP', () => {
            let payAmount = cy.getRandomArbitrary(100, 300);
            //let payAmount = 30;
            let payCurrency = 'GBP';

            loginPage.getButtonToAdmibPanel().click();
            cy.wait(2000);
            homePage.getCheckUrl();
            homePage.getMenuProjects();
            cy.wait(2000);
            homePage.getSubMenuRest();

            restPage.getInputOrderID().type('C1GBPMAX');
            restPage.getInputOrderAmount().type(payAmount);
            restPage.getInputOrderCurrency().type(payCurrency);
            restPage.getInputOrderDescription().type('case1');
            restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
            restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
            restPage.getInputProductUrl().type('https://app.stage.paydo.com/');
            restPage.getButtonGenerateConfig().click();
            restPage.getButtonShowPaymentPage().click();
            cy.wait(3000);

            paymentPage.getInputCardNumber().type('4111111111111111');
            paymentPage.getInputExpirationDate().type('1220');
            paymentPage.getInputCVC().type('301');
            paymentPage.getInputCatdholderName().type('name');
            paymentPage.getButtonPay().click();
            cy.wait(2000);

            loginPage.visit('/');
            cy.wait(2000);
            loginPage.getButtonToAdmibPanel().click();
            homePage.getMenuPaymentHistory().click();

            transactionsPage.checkAmountUiGbpMax(payAmount, payCurrency);
        })

        it('Checkout, currency USD', () => {

            let payAmount = cy.getRandomArbitrary(100, 300);
            //let payAmount = 50;
            let payCurrency = 'USD';
            let conversion = 3.5;

            loginPage.getButtonToAdmibPanel().click();
            cy.wait(2000);
            homePage.getCheckUrl();
            homePage.getMenuProjects();
            cy.wait(2000);
            homePage.getSubMenuRest();

            restPage.getInputOrderID().type('C1USDMAX');
            restPage.getInputOrderAmount().type(payAmount);
            restPage.getInputOrderCurrency().type(payCurrency);
            restPage.getInputOrderDescription().type('case1');
            restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
            restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
            restPage.getInputProductUrl().type('https://app.stage.paydo.com/');
            restPage.getButtonGenerateConfig().click();
            restPage.getButtonShowPaymentPage().click();
            cy.wait(2000);

            paymentPage.getInputCardNumber().type('4111111111111111');
            paymentPage.getInputExpirationDate().type('1220');
            paymentPage.getInputCVC().type('301');
            paymentPage.getInputCatdholderName().type('name');
            paymentPage.getButtonPay().click();
            cy.wait(2000);

            loginPage.visit('/');
            cy.wait(2000);
            loginPage.getButtonToAdmibPanel().click();
            homePage.getMenuPaymentHistory().click();

            transactionsPage.checkAmountUiUSDMax(payAmount, conversion, payCurrency);
        })

        it('Checkout currency UAH', () => {
            let mainCurrency = 'USD';
            let conversion = 3.5;
            let payAmount = cy.getRandomArbitrary(300, 500);
            //let payAmount = 300;
            let payCurrency = 'UAH';
            loginPage.getButtonToAdmibPanel().click();
            cy.wait(2000);
            homePage.getCheckUrl();
            homePage.getMenuProjects();
            cy.wait(2000);
            homePage.getSubMenuRest();

            restPage.getInputOrderID().type('C2UAHMAX');
            restPage.getInputOrderAmount().type(payAmount);
            restPage.getInputOrderCurrency().type(payCurrency);
            restPage.getInputOrderDescription().type('case2');
            restPage.getInputResultUrl().type('https://app.stage.paydo.com/');
            restPage.getInputFailUrl().type('https://app.stage.paydo.com/');
            restPage.getInputProductUrl().type('https://app.stage.paydo.com/');
            restPage.getButtonGenerateConfig().click();
            restPage.getButtonShowPaymentPage().click();
            cy.wait(3000);

            paymentPage.getInputCardNumber().type('4111111111111111');
            paymentPage.getInputExpirationDate().type('1220');
            paymentPage.getInputCVC().type('301');
            paymentPage.getInputCatdholderName().type('name');
            paymentPage.getButtonPay().click();
            cy.wait(2000);

            loginPage.visit('/');
            cy.wait(2000);
            loginPage.getButtonToAdmibPanel().click();

            cy.wait(3000);

            homePage.getMenuPaymentHistory().click();

            transactionsPage.checkAmountUiUahMax(payAmount, conversion, payCurrency, mainCurrency);
        })


    })

})
