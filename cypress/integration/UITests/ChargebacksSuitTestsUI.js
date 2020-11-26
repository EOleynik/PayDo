import loginPage from "../../elements/LoginPage";
import createCheckoutPage from "../../elements/CreateCheckoutPage";
import homePage from "../../elements/HomePage";
import transactionsPage from "../../elements/TransactionsPage";
import merchant from "../../fixtures/merchant";
import parentPage from "../../elements/ParentPage";
import chargebackPage from "../../elements/ChargebackPage";

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
};

describe('Chargeback suit', () => {

    beforeEach('Authorization and create checkout', () => {
        let payAmount = cy.getRandomArbitrary(300, 500);
        let payCurrency = "USD";
        createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);
    });

    it('Create Chargeback', () => {

        loginPage.visit('/');
        cy.wait(2000);
        loginPage.getFeenAuthorization();
        loginPage.getButtonToAdminPanel().click();
        cy.wait(2000);
        homePage.getMenuPaymentHistory().click();
        parentPage.getButton('Filter').click();
        transactionsPage.getInputMerchantID().clear().type(merchant.bussiness_account+'{enter}');
        transactionsPage.getButtonChargebackCreate().click({force:true});
        cy.wait(3000);
        transactionsPage.confirmChargeback();
        transactionsPage.checkCreateChargeback();
        parentPage.closeAlert();
        homePage.getMenuChargebacks().click();
        cy.wait(2000);
        parentPage.getButton('Filter').click();
        cy.wait(2000);
        chargebackPage.getInputMerchantID().clear().type(merchant.bussiness_account);
        chargebackPage.chooseStatus('New');
        chargebackPage.getButtonFilter().click();
        cy.wait(2000);
        chargebackPage.checkStatusFirstChargeback(' New ');
        chargebackPage.rejectChargeback();
    });

    it('Check status chargeback, chargeback was rejected', () => {

        loginPage.visit('/');
        cy.wait(2000);
        loginPage.getAuthorization();
        loginPage.getButtonToAdminPanel().click();
        transactionsPage.createChargeback();
        homePage.getMenuPaymentHistory().click();
        homePage.getMenuChargebacks().click();
        cy.wait(2000);
        parentPage.getButton('Filter').click();
        chargebackPage.chooseStatus('New');
        chargebackPage.getButtonFilter().click();
        cy.wait(2000);
        chargebackPage.checkStatusFirstChargeback( ' New ');
        chargebackPage.rejectChargeback();
        cy.wait(2000);
        chargebackPage.chooseStatus('Rejected');
        chargebackPage.getButtonFilter().click();
        cy.wait(2000);
        chargebackPage.checkStatusLastChargeback(' Rejected ');
    });

    it('Check status chargeback, chargeback was Accepted', () => {

        loginPage.visit('/');
        cy.wait(2000);
        loginPage.getAuthorization();
        loginPage.getButtonToAdminPanel().click();
        transactionsPage.createChargeback();
        homePage.getMenuPaymentHistory().click();
        homePage.getMenuChargebacks().click();
        cy.wait(2000);
        parentPage.getButton('Filter').click();
        chargebackPage.chooseStatus('New');
        chargebackPage.getButtonFilter().click();
        cy.wait(2000);
        chargebackPage.checkStatusFirstChargeback( ' New ');
        chargebackPage.acceptChargeback();
        cy.wait(2000);
        chargebackPage.chooseStatus('Accepted');
        chargebackPage.getButtonFilter().click();
        cy.wait(2000);
        chargebackPage.checkStatusLastChargeback(' Accepted ');
    });

});
