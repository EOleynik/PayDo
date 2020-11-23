import transactionsPage from "../../elements/TransactionsPage";
import createCheckoutPage from "../../elements/CreateCheckoutPage";
import refundPage from "../../elements/RefundPage";
import refund from "../../fixtures/refund";

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
};

 describe('Refund math', () => {

     it('Full refund, payment currency matches the currencies that are in the merchant account', () => {

         let payAmount = cy.getRandomArbitrary(100, 500);
         //let payAmount = 500;

         for (let i = 0; i < refund.currency.length; i++) {
             let payCurrency = refund.currency[i];
             cy.log(payCurrency);
             createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);
             cy.wait(3000);
             transactionsPage.createFullRefundAndCheckAmount(payAmount, payCurrency);
             refundPage.rejectRefund();
         }
     });

     it('Full refund, payment currency does not match the currencies that are in the merchant account', () => {

         let payAmount = cy.getRandomArbitrary(100, 500);
         //let payAmount = 500;
         let payCurrency = "UAH";

         createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);
         cy.wait(3000);
         transactionsPage.createFullRefundUAHAndCheckAmount(payAmount, payCurrency);
         refundPage.rejectRefund();
     });

     it('Partial refund, payment currency matches the currencies that are in the merchant account', () => {

         let payAmount = cy.getRandomArbitrary(100, 500);

         for (let i = 0; i < refund.currency.length; i++) {
             let payCurrency = refund.currency[i];
             cy.log(payCurrency);
             createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);
             cy.wait(3000);
             transactionsPage.createPartialRefundAndCheckAmount(payAmount, payCurrency);
             refundPage.rejectRefund();
         }
     });

     it('Partial refund, payment currency does not match the currencies that are in the merchant account', () => {

         let payAmount = cy.getRandomArbitrary(100, 500);
         //let payAmount = 500;
         let payCurrency = "UAH";

         createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);
         cy.wait(3000);
         transactionsPage.createPartialRefundUAHAndCheckAmount(payAmount, payCurrency);
         refundPage.rejectRefund();
     });


 });
