import feenPage from "../../../pages/FeenPage";
import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import paymentPage from "../../../pages/PaymentPage";
import transactionsPage from "../../../pages/TransactionsPage";
import checkout from "../../../fixtures/checkout";
import parentPage from "../../../pages/ParentPage";
import restPage from "../../../pages/RestPage";
import merchant from "../../../fixtures/merchant";

    describe ('Checkout suit UI ', () => {

        it('Set main currency', () => {
            homePage.setMainCurrency()
        });

            describe('Checkout with default commissions settings', () => {

                beforeEach('', () => {
                    loginPage.visit('/');
                    cy.wait(2000);
                     loginPage.checkAuthorization(merchant.email, merchant.password, merchant.authenticator);
                    cy.wait(6000);
                });

                // 1.Самый простой кейс. Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
                // и валютами провайдера. Цена товара в GBP
                it('Checkout, product currency GBP', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    //let payAmount = 400;
                    let payCurrency = 'GBP';

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', 'C1GBP');
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', payCurrency);
                    restPage.enterTextInToInput('description', 'case1');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');

                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();

                    paymentPage.clickButton('Cards');
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);

                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUIGBP(payAmount);
                });

                // 2.Простой кейс. Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
                // и валютами провайдера. Цена товара в USD или EUR или RUB
                it('Checkout, product currency USD or EUR or RUB', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    //let payAmount = 400;

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', "C2" + checkout.product_currency_c2);
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', checkout.product_currency_c2);
                    restPage.enterTextInToInput('description', 'case2');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');
                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();

                    paymentPage.clickButton('Cards');
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);


                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUIUSD(payAmount);
                });

                // 3.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
                // основная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Цена товара в ALL
                it('Checkout, product currency is not USD, GBP, EUR, RUB', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    // let payAmount = 426.62;

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', "C3" + checkout.product_currency_c3);
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', checkout.product_currency_c3);
                    restPage.enterTextInToInput('description', 'case3');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');
                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();

                    paymentPage.clickButton('Cards');
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);


                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUIALL(payAmount);
                });

                // 4.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
                // основная валюта мерчанта не совпадает с валютой оплаты. Цена товара в CUP
                it('Checkout, product currency is not USD, GBP, EUR, RUB, the main currency does not match the payment currency ', () => {

                    let payAmount = parentPage.getRandomArbitrary(500, 1500);
                    //let payAmount = 419.94;

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', "C4" + checkout.product_currency_c4);
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', checkout.product_currency_c4);
                    restPage.enterTextInToInput('description', 'case4');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');
                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();
                    cy.wait(2000);

                    paymentPage.clickButton('Cards');
                    cy.wait(1000);
                    paymentPage.selectPayCurrency();
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);

                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUICUP(payAmount);
                });
            });

            describe('Change strategy', () => {

                it('Change strategy', () => {
                    feenPage.changeCommissionsAndStrategy()
                });
            });

            describe('Checkout after change strategy', () => {

                beforeEach('', () => {
                    loginPage.visit('/');
                    loginPage.loginWithCred(merchant.email, merchant.password);
                    loginPage.enter2FACode(merchant.authenticator);
                    cy.wait(3000);
                });

                // 1.Самый простой кейс. Цена товара совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
                // и валютами провайдера. Цена товара в GBP
                it('Checkout, product currency GBP', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    //let payAmount = 400;
                    let payCurrency = 'GBP';

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', 'C1GBP');
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', payCurrency);
                    restPage.enterTextInToInput('description', 'case1');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');
                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();

                    paymentPage.clickButton('Cards');
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);

                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUIGBP(payAmount);
                });

                // 2.Простой кейс. Цена товара - совпадает с валютами которые в кабинете мерчанта (USD, EUR, GBP, RUB)
                // и валютами провайдера. Цена товара в USD или EUR или RUB
                it('Checkout, product currency USD or EUR or RUB', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    //let payAmount = 400;

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', "C2" + checkout.product_currency_c2);
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', checkout.product_currency_c2);
                    restPage.enterTextInToInput('description', 'case2');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');
                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();

                    paymentPage.clickButton('Cards');
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);


                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUIUSD(payAmount);
                });

                // 3.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
                // основная валюта мерчанта совпадает с валютой оплаты, Стратегия комиссии - ALL. Цена товара в ALL
                it('Checkout, product currency is not USD, GBP, EUR, RUB', () => {

                    let payAmount = parentPage.getRandomArbitrary(300, 500);
                    // let payAmount = 426.62;

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', "C3" + checkout.product_currency_c3);
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', checkout.product_currency_c3);
                    restPage.enterTextInToInput('description', 'case3');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');
                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();

                    paymentPage.clickButton('Cards');
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);


                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUIALL(payAmount);
                });

                // 4.Цена товара - не совпадает с валютами, которые в кабинете мерчанта (USD, EUR, GBP, RUB),
                // основная валюта мерчанта не совпадает с валютой оплаты. Цена товара в CUP
                it('Checkout, product currency is not USD, GBP, EUR, RUB, the main currency does not match the payment currency ', () => {

                    let payAmount = parentPage.getRandomArbitrary(500, 1500);
                    //let payAmount = 419.94;

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuProjects();
                    cy.wait(5000);
                    homePage.clickSubMenuRest();
                    cy.wait(3000);

                    restPage.enterTextInToInput('id', "C4" + checkout.product_currency_c4);
                    restPage.enterTextInToInput('amount', payAmount);
                    restPage.enterTextInToInput('currency', checkout.product_currency_c4);
                    restPage.enterTextInToInput('description', 'case4');
                    restPage.enterTextInToInput('resultUrl', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('failPath', 'https://account.stage.paydo.com/');
                    restPage.enterTextInToInput('productUrl', 'https://account.stage.paydo.com/');
                    restPage.clickButton('Generate config ');
                    restPage.clickButton('Show payment page ');
                    cy.wait(7000);

                    paymentPage.checkUrlPaymentPage(/en\/payment\/\S{36}/);
                    paymentPage.checkLogIn();
                    cy.wait(2000);

                    paymentPage.clickButton('Cards');
                    cy.wait(1000);
                    paymentPage.selectPayCurrency();
                    paymentPage.enterCardData();
                    paymentPage.clickButtonPay();
                    cy.wait(3000);

                    loginPage.visit('/');
                    cy.wait(1000);
                    loginPage.clickButton('Login');
                    cy.wait(2000);

                    homePage.checkUrl('/en/overview');
                    homePage.clickMenuTransactions();
                    transactionsPage.checkAmountUICUP(payAmount);
                })
            })
    });



