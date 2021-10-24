
import exchangePage from "../../pages/ExchangePage";
import merchants from "../../fixtures/Prod/merchants.json";
import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";
import parentPage from "../../pages/ParentPage";
import feen from "../../fixtures/Prod/feen.json";
import moneyTransferPage from "../../pages/MoneyTransferPage";
import admin_headers from "../../fixtures/Prod/admin_headers.json";
import sender_headers from "../../fixtures/Prod/sender_headers.json";
import exchange from "../../fixtures/Prod/exchange.json";

describe('Exchange suit UI', () => {

    it('Exchange, enough funds on the wallet', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange('Exchange');
        cy.wait(2000);

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

        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange('Exchange');
        cy.wait(2000);

        exchangePage.selectWalletExchangeFrom(exchange.from_wallet);
        exchangePage.selectWalletExchangeTo(exchange.to_wallet);
        exchangePage.enterAmountForExchange(1000000);
        exchangePage.clickButtonConvertCurrency();

        moneyTransferPage.ConfirmationTransfer('Yes, I sure ');
        cy.wait(3000);

        exchangePage.checkStatusExchange('Not enough money to perform this operation');
        exchangePage.closeAlert();
    });

    describe("Exchange API", () => {
    before(function()  {
        parentPage.getTokenUser('sender',merchants.email_2, merchants.password_2, merchants.authenticator_2); // token sender
        parentPage.getTokenUser('admin',feen.email, feen.password, feen.authenticator); // token admin
        parentPage.getAvailableBalance('sender', exchange.from);
        parentPage.getAvailableBalance('sender', exchange.to);
        parentPage.getRate("exchange", exchange.from, exchange.to, admin_headers.token);
        parentPage.getBaseCommission(merchants.amount_exchange, exchange.from ,10, 511, admin_headers.token); //
    })

        it('Exchange math', () => {

            moneyTransferPage.createExchange(sender_headers.token, merchants.amount_exchange, exchange.from, exchange.to);
            moneyTransferPage.checkAvailableBalanceFromWallet('sender', exchange.from, sender_headers.token, exchange.amount_exchange) // from wallet
            moneyTransferPage.checkAvailableBalanceToWallet('sender', exchange.to, sender_headers.token, exchange.amount_exchange,
                admin_headers.token, exchange.from) // to wallet
        })
    })


})
