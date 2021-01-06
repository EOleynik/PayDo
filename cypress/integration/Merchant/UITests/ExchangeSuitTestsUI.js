import loginPage from "../../../pages/LoginPage";
import exchangePage from "../../../pages/ExchangePage";
import exchange from "../../../fixtures/exchange";
import merchant from "../../../fixtures/merchant";
import homePage from "../../../pages/HomePage";

describe('Exchange suit UI', () => {

    beforeEach('', () => {
        loginPage.visit('/');
        loginPage.loginWithCred(merchant.email, merchant.password);
        loginPage.enter2FACode(merchant.authenticator);
        cy.wait(3000);
     });

    it('Exchange, enough funds on the wallet', () => {

        homePage.clickMenuExchange();
        cy.wait(2000);
        exchangePage.selectWalletExchangeFrom(exchange.from_wallet);
        exchangePage.selectWalletExchangeTo(exchange.to_wallet);
        exchangePage.enterAmountForExchange(exchange.amount_exchange);
        exchangePage.clickButtonConvertCurrency();
        cy.wait(500);
        exchangePage.checkStatusExchange('Exchange successful');
        exchangePage.closeAlert();
    });

    it('Exchange, not enough funds on the wallet', () => {


        homePage.clickMenuExchange();
        cy.wait(2000);
        exchangePage.enterAmountForExchange(1000000);
        exchangePage.clickButtonConvertCurrency();
        cy.wait(500);
        exchangePage.checkStatusExchange('Not enough money to perform this operation');
        exchangePage.closeAlert();
    });


})
