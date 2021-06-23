import loginPage from "../../../pages/LoginPage";
import betweenWallets from "../../../fixtures/Stage/betweenWallets.json";
import moneyTransferPage from "../../../pages/MoneyTransferPage";
import merchant from "../../../fixtures/Stage/merchant.json";
import homePage from "../../../pages/HomePage";

describe('Between Wallets suit ', () => {

    beforeEach('Authorization', () => {
        loginPage.visit('/');
        loginPage.checkUrl('/en/auth/login');
        loginPage.loginWithCred(merchant.email, merchant.password);
        loginPage.enter2FACode(merchant.authenticator);
        cy.wait(3000);
    });

    it('Create transfer, all data is valid', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuCreateTransfer('Create Transfer');
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet(betweenWallets.wallet);
        moneyTransferPage.enterTextInToInputRecipient(betweenWallets.recipient_ID);
        cy.wait(1000);
        moneyTransferPage.enterTextInToInputAmount(betweenWallets.amount_transfer);
        //moneyTransferPage.chooseCurrencyTransfer(betweenWallets.currency);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        cy.wait(3000);
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.enter2FACode(merchant.authenticator);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
        moneyTransferPage.closeAlert();
        moneyTransferPage.clickButtonGoToMoneyTransferList();
        cy.wait(1000);
        moneyTransferPage.checkUrl('/list-of-transfers/transfers-between-wallets');
        moneyTransferPage.checkTransferBetweenWallets('From wallet', ' You ', betweenWallets.recipient_ID, betweenWallets.amount_transfer, betweenWallets.currency);
    });

})


