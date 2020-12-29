import transactionsPage from "../../../pages/TransactionsPage";
import chargebackPage  from "../../../pages/ChargebackPage";
import parentPage from "../../../pages/ParentPage";

describe('Chargeback math', () => {

    it('Currency chargeback matches the currencies that are in the merchant account', () => {

        transactionsPage.createChargebackAndCheckBalance();
        chargebackPage.rejectChargeback();
    });

    it('Chargeback, payment currency does not match the currencies that are in the merchant account', () => {

        let payCurrency = "UAH";

        transactionsPage.createChargebackUAHAndCheckBalance(payCurrency);
        chargebackPage.rejectChargeback();
    });






});
