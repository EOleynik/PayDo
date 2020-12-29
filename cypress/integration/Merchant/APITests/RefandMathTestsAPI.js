import transactionsPage from "../../../pages/TransactionsPage";
import createCheckoutPage from "../../../pages/CreateCheckoutPage";
import refundPage from "../../../pages/RefundPage";
import refund from "../../../fixtures/refund";
import parentPage from "../../../pages/ParentPage";

 describe('Refund math', () => {

     it('Full refund, payment currency matches the currencies that are in the merchant account', () => {

         let payAmount = parentPage.getRandomArbitrary(100, 500);
         //let payAmount = 500;

         for (let i = 0; i < refund.currency.length; i++) {
             let payCurrency = refund.currency[i];
             cy.log(payCurrency);
             createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
             cy.wait(3000);
             transactionsPage.createFullRefundAndCheckAmount(payAmount, payCurrency);
             refundPage.rejectRefund();
         }
     });

     it('Full refund, payment currency does not match the currencies that are in the merchant account', () => {

         let payAmount = parentPage.getRandomArbitrary(100, 500);
         //let payAmount = 500;
         let payCurrency = "UAH";

         createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
         cy.wait(3000);
         transactionsPage.createFullRefundUAHAndCheckAmount(payAmount, payCurrency);
         refundPage.rejectRefund();
     });

     it('Partial refund, payment currency matches the currencies that are in the merchant account', () => {

         let payAmount = parentPage.getRandomArbitrary(100, 500);

         for (let i = 0; i < refund.currency.length; i++) {
             let payCurrency = refund.currency[i];
             cy.log(payCurrency);
             createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
             cy.wait(3000);
             transactionsPage.createPartialRefundAndCheckAmount(payAmount, payCurrency);
             refundPage.rejectRefund();
         }
     });

     it('Partial refund, payment currency does not match the currencies that are in the merchant account', () => {

         let payAmount = parentPage.getRandomArbitrary(100, 500);
         //let payAmount = 500;
         let payCurrency = "UAH";

         createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
         cy.wait(3000);
         transactionsPage.createPartialRefundUAHAndCheckAmount(payAmount, payCurrency);
         refundPage.rejectRefund();
     });


 });
