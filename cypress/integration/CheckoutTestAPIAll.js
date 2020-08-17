import loginPage from "../elements/LoginPage";
import feenPage from "../elements/FeenPage";
import transactionsPage from "../elements/TransactionsPage";
import createCheckoutPage from "../elements/CreateCheckoutPage"

cy.getRandomArbitrary = function getRandomArbitrary(min, max) {
    return (Math.random() * (max - min) + min).toFixed(8);
}

    describe('Checkout suit API, strategy ALL', () => {

        describe('Checkout API', () => {

            beforeEach('', () => {
                feenPage.getInstallComStrategAll(1, 6);// Strategy ALL fix(EUR), persent(%)
                loginPage.getAuthorization();
            })

            it('Checkout, currency GBP', () => {
                //let payAmount = cy.getRandomArbitrary(100, 300);
                let payAmount = 452.56;
                let payCurrency = 'GBP';

                createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);

                transactionsPage.checkAmountAPIGbpAll(payAmount, payCurrency);
            })


            it('Checkout, currency USD', () => {
                let conversion = 3.5;
                let payAmount = cy.getRandomArbitrary(300, 500);
                //let payAmount = 300;
                let payCurrency = 'USD';

                createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);

                transactionsPage.checkAmountAPIUsdAll(payAmount, conversion, payCurrency);
            })

            //№ 3 Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
            // основная валюта мерчанта не совпадает с валютой оплаты, Стратегия комиссии - ALL.
            // основная валюта USD

            it('Checkout, currency UAH', () => {
                let conversion = 3.5;
                //let payAmount = cy.getRandomArbitrary(300, 500);
                let payAmount = 452.56;
                let payCurrency = 'UAH';
                let mainCurrency = 'USD';

                loginPage.getAuthorization();

                createCheckoutPage.getCheckoutAPI(payAmount, payCurrency);

                transactionsPage.checkAmountAPIUAHAll(payAmount, conversion, payCurrency, mainCurrency);

            })

        })
    })
