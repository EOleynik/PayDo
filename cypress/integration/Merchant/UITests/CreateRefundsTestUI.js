import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import transactionsPage from "../../../pages/TransactionsPage";
import createCheckoutPage from "../../../pages/CreateCheckoutPage"
import refund from "../../../fixtures/refund";
import refundPage from "../../../pages/RefundPage";
import merchant from "../../../fixtures/merchant";

describe('Refund suit', () => {

    beforeEach('', () => {
        loginPage.visit('/');
        cy.wait(2000);
        loginPage.checkAuthorization();
        createCheckoutPage.getCheckout2API(refund.checkout_amount);
        cy.wait(9000);
    });

    it("Partial refund for " + refund.amount_1 + " USD, product amount " + refund.checkout_amount + " USD", () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuTransactions();
        cy.wait(2000);

        transactionsPage.checkUrl('transaction/list');
        transactionsPage.clickButtonDetails();
        cy.wait(2000);
        transactionsPage.clickButtonPartialRefund();
        transactionsPage.enterTextInToInputPartialRefundAmount(refund.amount_1);
        transactionsPage.clickButtonCreateRefund();
        transactionsPage.clickButtonCreateRefundOk();
        transactionsPage.checkCreateRefund();
        refundPage.rejectRefund();
    });

    it("Full refund, product amount " + refund.payamount + " USD", () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuTransactions();
        cy.wait(2000);

        transactionsPage.checkUrl('transaction/list');
        transactionsPage.clickButtonDetails();
        cy.wait(2000);
        transactionsPage.clickButtonRefund();
        transactionsPage.clickConfirmRefund();
        transactionsPage.clickButtonCreateRefundOk();
        transactionsPage.checkCreateRefund();
        refundPage.rejectRefund();
    });

    it('Partial refund, refund amount is more than the product amount', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuTransactions();
        cy.wait(2000);

        transactionsPage.checkUrl('transaction/list');
        transactionsPage.clickButtonDetails();
        cy.wait(2000);
        transactionsPage.clickButtonPartialRefund();
        transactionsPage.enterTextInToInputPartialRefundAmount(refund.amount_2);
        transactionsPage.clickButtonCreateRefund();
        transactionsPage.isErrorAlertDisplayed(refund.alert_1);
        transactionsPage.closeAlert();
    });

    it('Several partial refunds exceed the product amount', () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuTransactions();
        cy.wait(2000);

        transactionsPage.checkUrl('transaction/list');
        transactionsPage.clickButtonDetails();
        cy.wait(2000);
        transactionsPage.clickButtonPartialRefund();
        transactionsPage.enterTextInToInputPartialRefundAmount(refund.amount_1);
        transactionsPage.clickButtonCreateRefund();
        cy.wait(2000);
        transactionsPage.clickButtonCreateRefundOk();
        cy.wait(4000);
        transactionsPage.clickButtonPartialRefund();
        transactionsPage.enterTextInToInputPartialRefundAmount(refund.amount_1);
        transactionsPage.clickButtonCreateRefund();
        transactionsPage.isErrorAlertDisplayed(refund.alert_2);
        transactionsPage.closeAlert();
    });

});














