import transactionsPage from "../../elements/TransactionsPage";
import createCheckoutPage from "../../elements/CreateCheckoutPage";
import chargeback from "../../fixtures/chargeback";
import chargebackPage  from "../../elements/ChargebackPage";

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(2);
};

describe('Chargeback math', () => {

    it('Currency chargeback matches the currencies that are in the merchant account', () => {

        let payAmount = cy.getRandomArbitrary(100, 500);
        //let payAmount = 250;

        for (let i = 0; i < chargeback.currency.length; i++) {
            let payCurrency = chargeback.currency[i];
            cy.log(payCurrency);
            createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);
            cy.wait(3000);
            transactionsPage.createChargebackAndCheckAmount(payAmount, payCurrency);
            chargebackPage.rejectChargeback();
        }
    });

    it('Chargeback, payment currency does not match the currencies that are in the merchant account', () => {

        let payAmount = cy.getRandomArbitrary(100, 500);
        //let payAmount = 500;
        let payCurrency = "UAH";

        createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);
        cy.wait(3000);
        transactionsPage.createChargebackUAHAndCheckAmount(payAmount, payCurrency);
        chargebackPage.rejectChargeback();
    });






});
