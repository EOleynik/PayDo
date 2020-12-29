import loginPage from "../../../pages/LoginPage";
import parentPage from "../../../pages/ParentPage";
import topUpPage from "../../../pages/TopUpPage";
import topUp from "../../../fixtures/topUp";
import merchant from "../../../fixtures/merchant";
import homePage from "../../../pages/HomePage";


describe('Top Up suit UI', () => {

    beforeEach('', () => {
        loginPage.visit('/');
        loginPage.loginWithCred(topUp.merchant_email, topUp.merchant_pass);
        loginPage.enter2FACode(topUp.authenticator);
        cy.wait(3000);
    });

    it('Top Up', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuTopUpWallet();
        cy.wait(2000);

        topUpPage.checkUrl('/top-up/by-card');
        topUpPage.topUpWalletByCard();
        topUpPage.checkStatusTopUp('Your top up is successful');
        topUpPage.clickButtonOk();
        parentPage.clickButton(' Ok ').click();
        cy.wait(1000);
    });

})