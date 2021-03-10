
import feenPage from "../../../pages/FeenPage";
import transactionsPage from "../../../pages/TransactionsPage";
import createCheckoutPage from "../../../pages/CreateCheckoutPage"
import homepage from "../../../pages/HomePage";
import parentPage from "../../../pages/ParentPage";

    describe('Checkout suit API', () => {

        it('Set main currency', () => {
            homepage.setMainCurrency();
        });

            // 1.Самый простой кейс. Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
            // и валютами провайдера. Цена товара в GBP
            it('Checkout, product currency GBP', () => {

                let payAmount = parentPage.getRandomArbitrary(300, 500);
                //let payAmount = 470.22;
                let payCurrency = 'GBP';

                createCheckoutPage.getCheckoutGBPAPI(payAmount, payCurrency);
                cy.wait(2000);
                transactionsPage.checkAmountAPIGBP(payAmount);
            });

                // 2.Простой кейс. Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
                // и валютами провайдера. Цена товара в USD или EUR или RUB
                it('Checkout, product currency USD', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    //let payAmount = 474.24;

                    createCheckoutPage.getCheckout2API(payAmount);
                    cy.wait(2000);
                    transactionsPage.checkAmountAPIUSD(payAmount);
                });

                    // 3.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
                    // основная валюта мерчанта совпадает с валютой оплаты. Цена товара в ALL
                    it('Checkout, product currency is not USD, GBP, EUR, RUB', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    //let payAmount = 426.62;

                    createCheckoutPage.getCheckout3API(payAmount);
                    cy.wait(2000);
                    transactionsPage.checkAmountAPIALL(payAmount);
                    });

                    // 4.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
                    // основная валюта мерчанта не совпадает с валютой оплаты. Цена товара в CUP
                    it('Checkout, product currency is not USD, GBP, EUR, RUB, the main currency does not match the payment currency ', () => {

                        let payAmount = parentPage.getRandomArbitrary(1000, 1500);
                        //let payAmount = 1336.76;

                        createCheckoutPage.getCheckout4API(payAmount);
                        cy.wait(2000);
                        transactionsPage.checkAmountAPICUP(payAmount);
                    });


                        it('Change strategy', () => {
                            feenPage.changeCommissionsAndStrategy()
                        });


    describe('Checkouts API Tests after change strategy', () => {

        it('Checkout, product currency GBP', () => {

            let payAmount = parentPage.getRandomArbitrary(300, 500);
            //let payAmount = 368.75;
            let payCurrency = 'GBP';

            createCheckoutPage.getCheckoutGBPAPI(payAmount, payCurrency);
            cy.wait(2000);
            transactionsPage.checkAmountAPIGBP(payAmount);
        });

            it('Checkout, product currency USD', () => {

                let payAmount = parentPage.getRandomArbitrary(300, 500);
                //let payAmount = 474.24;

                createCheckoutPage.getCheckout2API(payAmount);
                cy.wait(2000);
                transactionsPage.checkAmountAPIUSD(payAmount);
            });

                it('Checkout, product currency is not USD, GBP, EUR, RUB', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    //let payAmount = 423.21;

                    createCheckoutPage.getCheckout3API(payAmount);
                    cy.wait(2000);
                    transactionsPage.checkAmountAPIALL(payAmount);
                });

                    it('Checkout, product currency is not USD, GBP, EUR, RUB, the main currency does not match the payment currency ', () => {

                        let payAmount = parentPage.getRandomArbitrary(1000, 1500);
                        // let payAmount = 419.94;

                        createCheckoutPage.getCheckout4API(payAmount);
                        cy.wait(2000);
                        transactionsPage.checkAmountAPICUP(payAmount);
                    });
    });

});
