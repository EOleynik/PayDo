
import exchangePage from "../../../pages/ExchangePage";
import merchants from "../../../fixtures/Prod/merchants.json";
import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import moneyTransferPage from "../../../pages/MoneyTransferPage";
import exchange from "../../../fixtures/Prod/exchange.json";

describe('Exchange suit UI', () => {

    beforeEach(() => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(2000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange('Exchange');
        cy.wait(2000);
    })

    it('Exchange, enough funds on the wallet', () => {

        exchangePage.selectWalletExchangeFrom(exchange.from_wallet);
        exchangePage.selectWalletExchangeTo(exchange.to_wallet);
        exchangePage.enterAmountForExchange(exchange.amount_exchange);
        exchangePage.clickButtonConvertCurrency();

        moneyTransferPage.ConfirmationTransfer('Yes, I sure ');
        cy.wait(3000);

        exchangePage.checkStatusExchange('Exchange successful');
        exchangePage.closeAlert();
    });

    it('Exchange, not enough funds on the wallet', () => {

        exchangePage.selectWalletExchangeFrom(exchange.from_wallet);
        exchangePage.selectWalletExchangeTo(exchange.to_wallet);
        exchangePage.enterAmountForExchange(1000000);
        exchangePage.clickButtonConvertCurrency();

        moneyTransferPage.ConfirmationTransfer('Yes, I sure ');
        cy.wait(3000);

        exchangePage.checkStatusExchange('Not enough money to perform this operation');
        exchangePage.closeAlert();
    });


})
