import loginPage from "../../../pages/LoginPage";
import topUpPage from "../../../pages/TopUpPage";
import topUp from "../../../fixtures/Stage/topUp.json";
import homePage from "../../../pages/HomePage";


describe('Top Up suit UI', () => {

    beforeEach('', () => {
        loginPage.visit('/');
        loginPage.loginWithCred(topUp.merchant_email, topUp.merchant_pass);
        loginPage.enter2FACode(topUp.authenticator);
        cy.wait(3000);
    });

    it('Top Up with a Bank Card', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuTopUpWallet();
        cy.wait(2000);

        topUpPage.checkUrl('/top-up/by-card');
        topUpPage.topUpWalletByCard();
        cy.wait(1000);
    });

})