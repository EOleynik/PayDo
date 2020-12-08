
import loginPage from "../../elements/LoginPage";
import homePage from "../../elements/HomePage";
import transactionsPage from "../../elements/TransactionsPage";
import createCheckoutPage from "../../elements/CreateCheckoutPage"
import refund from "../../fixtures/refund";
import refundPage from "../../elements/RefundPage";
import parentPage from "../../elements/ParentPage"

describe('Refund suit', () => {

    beforeEach('', () => {
        loginPage.visit('/');
        loginPage.getAuthorization();
        createCheckoutPage.getCheckout2API(refund.checkout_amount);
    });

    it("Partial refund for " + refund.amount_1 + " USD, product amount " + refund.checkout_amount + " USD", () => {
        parentPage.getButton('To Admin Panel').click();
        cy.wait(2000);
        homePage.getCheckUrl();
        cy.wait(2000);
        parentPage.getMenu('Payments History').click();
        cy.wait(5000);
        transactionsPage.getButtonDetails().click();
        cy.wait(2000);
        transactionsPage.getButtonPartialRefund().click();
        transactionsPage.getInputPartialRefundAmount().type(refund.amount_1);
        transactionsPage.getButtonCreateRefund().click();
        transactionsPage.getButtonCreateRefundOk().click();
        transactionsPage.checkCreateRefund();
        refundPage.rejectRefund();
    });

    it("Full refund, product amount " + refund.payamount + " USD", () => {
        parentPage.getButton('To Admin Panel').click();
        cy.wait(2000);
        homePage.getCheckUrl();
        cy.wait(2000);
        parentPage.getMenu('Payments History').click();
        cy.wait(3000);
        transactionsPage.getButtonDetails().click();
        cy.wait(2000);
        transactionsPage.getButtonRefund().click();
        transactionsPage.confirmRefund().click();
        transactionsPage.getButtonCreateRefundOk().click();
        transactionsPage.checkCreateRefund();
        refundPage.rejectRefund();
    });

    it('Partial refund, refund amount is more than the product amount', () => {
        parentPage.getButton('To Admin Panel').click();
        cy.wait(2000);
        homePage.getCheckUrl();
        cy.wait(2000);
        parentPage.getMenu('Payments History').click();
        cy.wait(3000);
        transactionsPage.getButtonDetails().click();
        cy.wait(2000);
        transactionsPage.getButtonPartialRefund().click();
        transactionsPage.getInputPartialRefundAmount().type(refund.amount_2);
        transactionsPage.getButtonCreateRefund().click();
        transactionsPage.isErrorAlertDisplayed(refund.alert_1);
        parentPage.closeAlert();
    });

    it('Several partial refunds exceed the product amount', () => {
        parentPage.getButton('To Admin Panel').click();
        cy.wait(2000);
        homePage.getCheckUrl();
        cy.wait(2000);
        parentPage.getMenu('Payments History').click();
        cy.wait(3000);
        transactionsPage.getButtonDetails().click();
        cy.wait(2000);
        transactionsPage.getButtonPartialRefund().click();
        transactionsPage.getInputPartialRefundAmount().type(refund.amount_1);
        transactionsPage.getButtonCreateRefund().click();
        cy.wait(2000);
        transactionsPage.getButtonCreateRefundOk().click();
        cy.wait(4000);
        transactionsPage.getButtonPartialRefund().click();
        transactionsPage.getInputPartialRefundAmountRepeat().type(refund.amount_1);
        transactionsPage.getButtonCreateRefund().click();
        transactionsPage.isErrorAlertDisplayed(refund.alert_2);
        parentPage.closeAlert();
    });

});














