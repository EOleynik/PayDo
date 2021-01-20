import merchant from "../fixtures/merchant.json"
import feen from "../fixtures/feen.json"
import paymentMethod from "../fixtures/paymentMethod.json"
import checkout from "../fixtures/checkout";
import refund from "../fixtures/refund";
import manajer from "../fixtures/manajer";
import chargeback from "../fixtures/chargeback";
import createCheckoutPage from "./CreateCheckoutPage";
import parentPage from "./ParentPage";

cy.getDeltaCheckout = function getDelta(n1, n2) {
    return Math.abs(n1 - n2) <= checkout.precision;
};

cy.getDeltaChargeback = function getDelta(n1, n2) {
    return Math.abs(n1 - n2) <= chargeback.precision;
};

class TransactionsPage {

    clickFilter() {
        parentPage.clickButton('Filter');
    }

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    enterTextInToFilter(text) {
        parentPage.getInput('merchantIdentifier').clear().type(text+'{enter}')
    }

    getAmountTransaction() {
        const amount = cy.get('[class="bold price-align"]').first();
    }

    clickButtonCreateChargeback() {
        parentPage.clickButton('Create ');
    }

    clickButtonDetails() {
        parentPage.clickButton('Details');
    }

    closeAlert() {
        parentPage.closeAlert()
    }

    checkAmountUIGBP(payAmount) {

        // Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value.GBP[0];
            let perscom = response.body.data[7].value.GBP[1];
            let strateg = response.body.data[7].strategy;

            cy.wait(5000);

            //Check status tranzaction
                cy.get('[class="mat-cell cdk-cell cdk-column-state mat-column-state ng-star-inserted"]').eq(0).invoke('text').should((text) => {
                expect(text).to.eq(' Accepted ')
            });

            //Сalculation formula & Check Amount

            if (strateg === 1) {

                // суммируем фиксированную комиссию с процентом комиссии
                let sumcom = (+fixcom + (+payAmount / 100 * +perscom)).toFixed(2);

                // отнимаем сумму комисий от стоимости товара
                let rezult = (payAmount - sumcom).toFixed(2);

                cy.log("стратегия комиссий =" + " " + strateg);
                cy.log("цена товара =" + " " + payAmount);
                cy.log("сумма комиссий =" + " " + sumcom);

                // Check Amount
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    //expect(text).to.eq((+rezult).toFixed(2) + ' ' + 'GBP')
                    expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                })
            } else {
                if (fixcom > (+payAmount / 100 * +perscom)) {

                    // отнимаем фиксированную комиссию от стоимости товара
                    let rezult = (payAmount - fixcom).toFixed(2);

                    cy.log("стратегия комиссий =" + " " + strateg);
                    cy.log("цена товара =" + " " + payAmount);
                    cy.log("фиксированная комиссия =" + " " + (+fixcom).toFixed(2));

                    // Check Amount
                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                    })
                } else {
                    // отнимаем процент комиссии от стоимости товара
                    let rezult = (payAmount - (+payAmount / 100 * +perscom)).toFixed(2);

                    cy.log("стратегия комиссий =" + " " + strateg);
                    cy.log("цена товара =" + " " + payAmount);
                    cy.log("процент комиссии =" + " " + (payAmount / 100 * perscom).toFixed(2));

                    // Check Amount
                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                    })
                }
            }
        })
    }


    checkAmountUIUSD(payAmount) {

        // Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value[checkout.product_currency_c2][0];
            let perscom = response.body.data[7].value[checkout.product_currency_c2][1];
            let strateg = response.body.data[7].strategy;

            cy.wait(3000);

            //Check status tranzaction
            cy.get(':nth-child(1) > .cdk-column-state > .mat-chip').invoke('text').should((text) => {
                expect(text).to.eq(' Accepted ')
            });

            // Сalculation formula & Check Amount

            // процент за конвертацию в GBP
            let exchcom = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

            if (strateg === 1) {

                // суммируем фиксированную комиссию, процент комиссии и процент за конвертацию
                let sumcom = (+fixcom + (+payAmount / 100 * +perscom) + +exchcom).toFixed(2);

                // отнимаем сумму комисий от стоимости товара
                let rezult = (payAmount - sumcom).toFixed(2);

                cy.log("стратегия комиссий =" + " " + strateg);
                cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c2);
                cy.log("сумма комиссий =" + " " + sumcom);

                // Check Amount
                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                    //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency);
                    expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                })
            } else {
                if (fixcom > (+payAmount / 100 * +perscom)) {

                    // суммируем фиксированную комиссию и процент за конвертацию
                    let sumcom = (+fixcom + +exchcom).toFixed(2);

                    // отнимаем сумму комиссий от стоимости товара
                    let rezult = (payAmount - sumcom).toFixed(2);

                    cy.log("стратегия комиссий =" + " " + strateg);
                    cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c2);
                    cy.log("фиксированная комиссия =" + " " + (+fixcom).toFixed(2));

                    // Check Amount
                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency)
                        expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                    })
                } else {

                    // суммируем процент комиссии и процент за конвертацию
                    let sumcom = ((+payAmount / 100 * +perscom) + +exchcom).toFixed(2);

                    // отнимаем сумму комиссий от стоимости товара
                    let rezult = (payAmount - sumcom).toFixed(2);

                    cy.log("стратегия комиссий =" + " " + strateg);
                    cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c2);
                    cy.log("процент комиссии =" + " " + (payAmount / 100 * perscom).toFixed(2));

                    // Check Amount
                    cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                        //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency)
                        expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                    })
                }
            }
        })
    }

    checkAmountUIALL(payAmount) {

        // Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value[checkout.product_currency_c3][0];
            let perscom = response.body.data[7].value[checkout.product_currency_c3][1];
            let strateg = response.body.data[7].strategy;

            cy.wait(5000);

            //Check status tranzaction
            cy.get(':nth-child(1) > .cdk-column-state > .mat-chip').invoke('text').should((text) => {
                expect(text).to.eq(' Accepted ')
            });

            // Сalculation formula & Check Amount

            // Get the rate from  product currency to main currency

            cy.request({
                method: 'GET',
                url: "https://admin.stage.paydo.com/v1/currencies/get-rates-for/" + checkout.product_currency_c3,
                headers: {
                    token: feen.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let rate = response.body.data.rates[merchant.main_currency];


            // cy.request({
            //     method: 'GET',
            //     url: 'https://app.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
            //     headers: {
            //         token: merchant.token
            //     }
            // }).then((response) => {
            //     expect(response).property('status').to.equal(200);
            //     expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            //     let transaction_id = response.body.data[0].identifier;
            //
            //     cy.request({
            //         method: 'GET',
            //         url: "https://admin.stage.paydo.com/v1/transactions/" + transaction_id,
            //         headers: {
            //             token: manajer.token
            //         }
            //     }).then((response) => {
            //         expect(response).property('status').to.equal(200);
            //         expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            //         let rate = response.body.data.exchanges[0].rate;

                    if (strateg === 1) {

                        // сумма комиссий
                        let sumcom = (+fixcom + (+payAmount / 100 * +perscom)).toFixed(2);

                        // комиссия за конвертацию с UAH в основную валюту мерчанта
                        let exch = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

                        // комиссия за конвертацию цены товара с основной валюты в GBP
                        let exch2 = ((payAmount * rate) / 100 * checkout.exchange_percentage).toFixed(2);

                        // отнимаем от стоимости товара сумму комисий и комиссию за конвертацию с UAH
                        let net = (payAmount - sumcom - exch).toFixed(2);

                        // конвертируем результат в основную валюту мерчанта
                        let conv = (net * rate).toFixed(2);

                        // комиссия за конвертацию
                        let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                        // отнимаем комиссии за конвертацию
                        let rezult = (conv - comconv - exch2).toFixed(2);

                        cy.log("рейт обмена в основную валюту  =" + " " + rate);
                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c3);
                        cy.log("сумма комиссий =" + " " + sumcom);
                        cy.log("комиссия за конвертацию валюты товара в основную валюту =" + " " + exch);
                        cy.log("комиссия за конвертацию с основной валюты в валюту провайдера =" + " " + exch2);
                        cy.log("комиссия за конвертацию цены без комиссий в основную валюту мерчанта =" + " " + comconv);

                        // Check Amount
                        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                            //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency)
                            expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                        })
                    } else {
                        if (fixcom > (+payAmount / 100 * +perscom)) {

                            // комиссия за конвертацию с UAH в основную валюту мерчанта
                            let exch = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

                            // комиссия за конвертацию цены товара с основной валюты в GBP
                            let exch2 = ((payAmount * rate) / 100 * checkout.exchange_percentage).toFixed(2);

                            // суммируем фиксированную комиссию и комиссию за конвертацию с UAH в основную валюту мерчанта
                            let sumcom = (+fixcom + +exch).toFixed(2);

                            // отнимаем от стоимости товара сумму комиссий
                            let net = (payAmount - sumcom).toFixed(2);

                            // конвертируем результат в основную валюту мерчанта
                            let conv = (net * rate).toFixed(2);

                            // комиссия за конвертацию
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссии за конвертацию
                            let rezult = (conv - comconv - exch2).toFixed(2);

                            cy.log("рейт обмена в основную валюту  =" + " " + rate);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c3);
                            cy.log("фиксированная комиссия =" + " " + (+fixcom).toFixed(2));
                            cy.log("комиссия за конвертацию валюты товара в основную валюту =" + " " + exch);
                            cy.log("комиссия за конвертацию с основной валюты в валюту провайдера =" + " " + exch2);
                            cy.log("комиссия за конвертацию цены без комиссий в основную валюту мерчанта =" + " " + comconv);

                            // Check Amount
                            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency)
                                expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                            })
                        } else {

                            // комиссия за конвертацию с UAH в основную валюту мерчанта
                            let exch = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

                            // комиссия за конвертацию цены товара с основной валюты в GBP
                            let exch2 = ((payAmount * rate) / 100 * checkout.exchange_percentage).toFixed(2);

                            // суммируем процент комиссии и комиссию за конвертацию с UAH в основную валюту мерчанта
                            let sumcom = ((+payAmount / 100 * +perscom) + +exch).toFixed(2);

                            // отнимаем от стоимости товара сумму комиссий
                            let net = (payAmount - sumcom).toFixed(2);

                            // конвертируем результат в основную валюту мерчанта
                            let conv = (net * rate).toFixed(2);

                            // комиссия за конвертацию
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссии за конвертацию
                            let rezult = (conv - comconv - exch2).toFixed(2);

                            cy.log("рейт обмена в основную валюту  =" + " " + rate);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c3);
                            cy.log("процент комиссии =" + " " + (payAmount / 100 * perscom).toFixed(2));
                            cy.log("комиссия за конвертацию валюты товара в основную валюту =" + " " + exch);
                            cy.log("комиссия за конвертацию с основной валюты в валюту провайдера =" + " " + exch2);
                            cy.log("комиссия за конвертацию цены без комиссий в основную валюту мерчанта =" + " " + comconv);

                            // Check Amount
                            cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency)
                                expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                            })
                        }
                    }
                })
            })
        //})
    }

    checkAmountAPIGBP(payAmount) {

        //Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value.GBP[0];
            let perscom = response.body.data[7].value.GBP[1];
            let strateg = response.body.data[7].strategy;

            cy.wait(5000);

            //Check status tranzaction
            cy.request({
                method: 'GET',
                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                headers: {
                    token: merchant.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let status = response.body.data[0].state;
                expect(status).to.eq(2);

                //Сalculation formula & Check Amount

                if (strateg === 1) {

                    // суммируем фиксированную комиссию и процент комиссии
                    let sumcom = (+fixcom + (+payAmount / 100 * +perscom)).toFixed(2);

                    // отнимаем от стоимости товара сумму комисий
                    let rezult = (+payAmount - sumcom).toFixed(2);

                    cy.log("стратегия комиссий =" + " " + strateg);
                    cy.log("цена товара =" + " " + payAmount);
                    cy.log("сумма комиссий =" + " " + sumcom);

                    // Check Amount
                    cy.request({
                        method: 'GET',
                        url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                        headers: {
                            token: merchant.token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let sum = response.body.data[0].amount;
                        //expect(parseFloat(sum).toFixed(2)).to.eq((+rezult).toFixed(2));

                        try {

                            expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                        }catch (e) {
                            cy.log("acc_rezult " + sum);
                            cy.log("math_rezult " + rezult);
                        }
                    })
                } else {
                    if (fixcom > (+payAmount / 100 * +perscom)) {

                        // отнимаем от стоимости товара фиксированную комиссию
                        let rezult = (payAmount - fixcom).toFixed(2);

                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount);
                        cy.log("фиксированная комиссия =" + " " + fixcom);

                        // Check Amount
                        cy.request({
                            method: 'GET',
                            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                            headers: {
                                token: merchant.token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let sum = response.body.data[0].amount;

                            try {

                                expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                            }catch (e) {
                                cy.log("acc_rezult " + sum);
                                cy.log("math_rezult " + rezult);
                            }
                        })
                    } else {

                        // отнимаем от стоимости товара процент комиссии
                        let rezult = (payAmount - (+payAmount / 100 * +perscom)).toFixed(2);

                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount);
                        cy.log("процент комиссии =" + " " + (+payAmount / 100 * +perscom).toFixed(2));

                        // Check Amount
                        cy.request({
                            method: 'GET',
                            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                            headers: {
                                token: merchant.token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let sum = response.body.data[0].amount;

                            try {

                                expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                            }catch (e) {
                                cy.log("acc_rezult " + sum);
                                cy.log("math_rezult " + rezult);
                            }
                        })
                    }
                }
            })
        })
    }


    checkAmountAPIUSD(payAmount) {

        // Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value[checkout.product_currency_c2][0];
            let perscom = response.body.data[7].value[checkout.product_currency_c2][1];
            let strateg = response.body.data[7].strategy;

            cy.wait(5000);

            //Check status tranzaction
            cy.request({
                method: 'GET',
                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                headers: {
                    token: merchant.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let status = response.body.data[0].state;
                expect(status).to.eq(2);

                // Сalculation formula & Check Amount

                // процент за конвертацию цены товара в GBP
                let exchcom = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

                if (strateg === 1) {

                    // суммируем фиксированную комиссию и процент комиссии
                    let sumcom = (+fixcom + (+payAmount / 100 * +perscom)).toFixed(2);

                    // отнимаем от стоимости товара сумму комисий и процент за конвертацию в GBP
                    let rezult = (payAmount - sumcom - exchcom).toFixed(2);

                    cy.log("стратегия комиссий =" + " " + strateg);
                    cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c2);
                    cy.log("сумма комиссий =" + " " + sumcom);
                    cy.log("процент за конвертацию =" + " " + exchcom);

                    // Check Amount
                    cy.request({
                        method: 'GET',
                        url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                        headers: {
                            token: merchant.token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let sum = response.body.data[0].amount;

                        try {

                            expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                        }catch (e) {
                            cy.log("acc_rezult " + sum);
                            cy.log("math_rezult " + rezult);
                        }
                    })
                } else {
                    if (fixcom > (+payAmount / 100 * +perscom)) {

                        // отнимаем от стоимости товара фиксированную комиссию и процент за конвертацию в GBP
                        let rezult = (+payAmount - fixcom - exchcom).toFixed(2);

                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c2);
                        cy.log("фиксированная комиссия =" + " " + fixcom);
                        cy.log("процент за конвертацию =" + " " + exchcom);

                        // Check Amount
                        cy.request({
                            method: 'GET',
                            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                            headers: {
                                token: merchant.token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let sum = response.body.data[0].amount;

                            try {

                                expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                            }catch (e) {
                                cy.log("acc_rezult " + sum);
                                cy.log("math_rezult " + rezult);
                            }
                        })
                    } else {

                        // отнимаем от стоимости товара процент комиссии и процент за конвертацию в GBP
                        let rezult = (payAmount - (+payAmount / 100 * +perscom) - exchcom).toFixed(2);

                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c2);
                        cy.log("процент комиссии =" + " " + (+payAmount / 100 * +perscom).toFixed(2));
                        cy.log("процент за конвертацию =" + " " + exchcom);

                        // Check Amount
                        cy.request({
                            method: 'GET',
                            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                            headers: {
                                token: merchant.token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let sum = response.body.data[0].amount;

                            try {

                                expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                            }catch (e) {
                                cy.log("acc_rezult " + sum);
                                cy.log("math_rezult " + rezult);
                            }
                        })
                    }
                }
            })
        })
    }

    checkAmountAPIALL(payAmount) {

        // Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value[checkout.product_currency_c3][0];
            let perscom = response.body.data[7].value[checkout.product_currency_c3][1];
            let strateg = response.body.data[7].strategy;

            cy.wait(5000);

            //Get transaction_id and Check status transaction
            cy.request({
                method: 'GET',
                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                headers: {
                    token: merchant.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let transaction_id = response.body.data[0].identifier;
                let status = response.body.data[0].state;
                expect(status).to.eq(2);

                // Сalculation formula & Check Amount

                // Get the rate from product currency to main currency

                cy.request({
                    method: 'GET',
                    url: "https://admin.stage.paydo.com/v1/transactions/" + transaction_id,
                    headers: {
                        token: manajer.token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rate = response.body.data.exchanges[0].rate;

                    // комиссия за конвертацию цены товара в основную валюту мерчанта
                    let exch = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

                    // комиссия за конвертацию цены товара с основной валюты в GBP
                    let exch2 = ((payAmount * rate) / 100 * checkout.exchange_percentage).toFixed(2);

                    if (strateg === 1) {

                        // суммируем фиксированную комиссию и процент комиссии
                        let sumcom = (+fixcom + (+payAmount / 100 * +perscom)).toFixed(2);

                        // отнимаем от стоимости товара сумму комисий и комиссию за конвертацию в основную валюту
                        let net = (payAmount - sumcom - exch).toFixed(2);

                        // конвертируем результат в основную валюту мерчанта
                        let conv = (net * rate).toFixed(2);

                        // комиссия за конвертацию результата в основную валюту
                        let comconv = (+conv / 100 * +checkout.exchange_percentage).toFixed(2);

                        // отнимаем комиссию за конвертацию результата и комиссию за конвертацию цены товара из основной валюты в GBP
                        let rezult = (conv - comconv - exch2).toFixed(2);

                        cy.log("рейт с " + checkout.product_currency_c3 + " в " + merchant.main_currency + " = " + rate);
                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c3);
                        cy.log("сумма комиссий =" + " " + sumcom);
                        cy.log("комиссия за конвертацию цены товара в основную валюту =" + " " + exch);
                        cy.log("комиссия за конвертацию с основной валюты в валюту провайдера =" + " " + exch2);
                        cy.log("комиссия за конвертацию цены без комиссий в основную валюту мерчанта =" + " " + comconv);

                        // Check Amount
                        cy.request({
                            method: 'GET',
                            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                            headers: {
                                token: merchant.token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let sum = response.body.data[0].amount;

                            try {

                                expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);
                            }catch (e) {
                                cy.log("acc_rezult " + sum);
                                cy.log("math_rezult " + rezult);
                            }
                        })

                    } else {
                        if (fixcom > (+payAmount / 100 * +perscom)) {

                            // отнимаем от стоимости товара фиксированную комиссию и комиссию за конвертацию цены товара в основную валюту
                            let net = (payAmount - fixcom - exch).toFixed(2);

                            // конвертируем результат в основную валюту мерчанта
                            let conv = (net * rate).toFixed(2);

                            // комиссия за конвертацию результата в основную валюту
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);


                            // отнимаем комиссию за конвертацию результата и комиссию за конвертацию из основной валюты в GBP
                            let rezult = (conv - comconv - exch2).toFixed(2);

                            cy.log("рейт с " + checkout.product_currency_c3 + " в " + merchant.main_currency + " = " + rate);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c3);
                            cy.log("фиксированная комиссия =" + " " + fixcom);
                            cy.log("комиссия за конвертацию цены товара в основную валюту =" + " " + exch);
                            cy.log("комиссия за конвертацию с основной валюты в валюту провайдера =" + " " + exch2);
                            cy.log("комиссия за конвертацию цены без комиссий в основную валюту =" + " " + comconv);

                            // Check Amount
                            cy.request({
                                method: 'GET',
                                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                                headers: {
                                    token: merchant.token
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let sum = response.body.data[0].amount;

                                try {

                                    expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                                }catch (e) {
                                    cy.log("acc_rezult " + sum);
                                    cy.log("math_rezult " + rezult);
                                }
                            })

                        } else {

                            // отнимаем от стоимости товара процент комиссии и комиссию за конвертацию цены товара в основную валюту
                            let net = (payAmount - (+payAmount / 100 * +perscom) - exch).toFixed(2);

                            // конвертируем результат в основную валюту мерчанта
                            let conv = (net * rate).toFixed(2);

                            // комиссия за конвертацию результата в основную валюту
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию результата и комиссию за конвертацию из основной валюты в GBP
                            let rezult = (conv - comconv - exch2).toFixed(2);

                            cy.log("рейт c " + checkout.product_currency_c3 + " в " + merchant.main_currency + " = " + rate);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c3);
                            cy.log("процент комиссии =" + " " + (+payAmount / 100 * +perscom).toFixed(2));
                            cy.log("комиссия за конвертацию цены товара в основную валюту =" + " " + exch);
                            cy.log("комиссия за конвертацию с основной валюты в валюту провайдера =" + " " + exch2);
                            cy.log("комиссия за конвертацию цены без комиссий в основную валюту мерчанта =" + " " + comconv);

                            // Check Amount
                            cy.request({
                                method: 'GET',
                                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                                headers: {
                                    token: merchant.token
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let sum = response.body.data[0].amount;

                                try {

                                    expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                                }catch (e) {
                                    cy.log("acc_rezult " + sum);
                                    cy.log("math_rezult " + rezult);
                                }
                            })
                        }
                    }
                })

            })
        })
    }

    checkAmountAPICUP(payAmount) {

        // Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value[checkout.product_currency_c4][0];
            let perscom = response.body.data[7].value[checkout.product_currency_c4][1];
            let strateg = response.body.data[7].strategy;

            cy.wait(5000);

            //Get transaction_id and Check status transaction
            cy.request({
                method: 'GET',
                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                headers: {
                    token: merchant.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let transaction_id = response.body.data[0].identifier;
                let status = response.body.data[0].state;
                expect(status).to.eq(2);

                // Сalculation formula & Check Amount

                // Get rate from product currency to pay currency and rate2 from pay currency to main currency

                cy.request({
                    method: 'GET',
                    url: "https://admin.stage.paydo.com/v1/transactions/" + transaction_id,
                    headers: {
                        token: manajer.token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rate = response.body.data.exchanges[0].rate;
                    let rate2 = response.body.data.exchanges[1].rate;

                    // комиссия за конвертацию цены товара в валюту оплаты
                    let exch = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

                    // комиссия за конвертацию с валюты оплаты в GBP
                    let exch2 = ((payAmount * rate) / 100 * checkout.exchange_percentage).toFixed(2);


                    if (strateg === 1) {

                        // суммируем фиксированную комиссию и процент комиссии
                        let sumcom = (+fixcom + (+payAmount / 100 * +perscom)).toFixed(2);

                        // отнимаем от стоимости товара сумму комисий и комиссию за конвертацию цены товара в валюту оплаты
                        let net = (payAmount - sumcom - exch).toFixed(2);

                        // конвертируем результат в валюту оплаты
                        let conv = (+net * +rate).toFixed(2);

                        // комиссия за конвертацию результата в валюту оплаты
                        let comconv = (+conv / 100 * +checkout.exchange_percentage).toFixed(2);

                        // отнимаем комиссию за конвертацию результата в валюту оплаты
                        let min = (+conv - comconv).toFixed(2);

                        // конвертируем в основную валюту мерчанта
                        let conv2 = (+min * +rate2).toFixed(2);

                        // комиссия за конвертацию в основную валюту мерчанта
                        let comconv2 = (conv2 / 100 * checkout.exchange_percentage).toFixed(2);

                        // отнимаем комиссию за конвертацию в основную валюту
                        let min2 = (conv2 - comconv2).toFixed(2);

                        // конвертируем комиссия за конвертацию с валюты оплаты в GBP в основную валюту мерчанта
                        let conv3 = (exch2 * rate2).toFixed(2);

                        // отнимаем конвертированную комиссию
                        let rezult = (min2 - conv3).toFixed(2);

                        cy.log("рейт c " + checkout.product_currency_c3 + " в " + checkout.pay_currency + " = " + rate);
                        cy.log("рейт c " + checkout.pay_currency + " в " + merchant.main_currency + " = " + rate2);
                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c4);
                        cy.log("сумма комиссий =" + " " + sumcom);
                        cy.log("комиссия за конвертацию цены товара в валюту оплаты=" + " " + exch);
                        cy.log("конвертированная комиссия конвертации с валюты оплаты в GBP =" + " " + conv3);
                        cy.log("комиссия за конвертацию в валюту оплаты =" + " " + comconv);
                        cy.log("комиссия за конвертацию в основную валюту =" + " " + comconv2);

                        // Check Amount
                        cy.request({
                            method: 'GET',
                            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                            headers: {
                                token: merchant.token
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let sum = response.body.data[0].amount;

                            try {

                                expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                            }catch (e) {
                                cy.log("acc_rezult " + sum);
                                cy.log("math_rezult " + rezult);
                            }
                        })
                    } else {
                        if (fixcom > (+payAmount / 100 * +perscom)) {

                            // отнимаем от стоимости товара фиксированную комиссию и комиссию за конвертацию валюты товара  в валюту оплаты
                            let net = (payAmount - fixcom - exch).toFixed(2);

                            // конвертируем результат в основную валюту мерчанта
                            let conv = (net * rate).toFixed(2);

                            // комиссия за конвертацию
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию результата в валюту оплаты
                            let min = (conv - comconv).toFixed(2);

                            // конвертируем в основную валюту мерчанта
                            let conv2 = (+min * +rate2).toFixed(2);

                            // комиссия за конвертацию в основную валюту мерчанта
                            let comconv2 = (conv2 / 100 * checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию
                            let min2 = (conv2 - (conv2 / 100 * checkout.exchange_percentage)).toFixed(2);

                            // конвертируем комиссию за второй обмен в основную валюту мерчанта
                            let conv3 = (exch2 * rate2).toFixed(2);

                            let rezult = (min2 - conv3).toFixed(2);

                            cy.log("рейт c " + checkout.product_currency_c3 + " в " + checkout.pay_currency + " = " + rate);
                            cy.log("рейт c " + checkout.pay_currency + " в " + merchant.main_currency + " = " + rate2);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c4);
                            cy.log("фиксированная комиссия =" + " " + (+fixcom).toFixed(2));
                            cy.log("комиссия за конвертацию цены товара в валюту оплаты=" + " " + exch);
                            cy.log("конвертированная комиссия конвертации с валюты оплаты в GBP =" + " " + conv3);
                            cy.log("комиссия за конвертацию в валюту оплаты =" + " " + comconv);
                            cy.log("комиссия за конвертацию в основную валюту =" + " " + comconv2);

                            // Check Amount
                            cy.request({
                                method: 'GET',
                                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                                headers: {
                                    token: merchant.token
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let sum = response.body.data[0].amount;

                                try {

                                    expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                                }catch (e) {
                                    cy.log("acc_rezult " + sum);
                                    cy.log("math_rezult " + rezult);
                                }
                            })
                        } else {

                            // отнимаем от стоимости товара процент комиссии и комиссию за конвертацию цены товара в валюту оплаты
                            let net = (payAmount - (payAmount / 100 * perscom) - exch).toFixed(2);

                            // конвертируем результат в валюту оплаты
                            let conv = (net * +rate).toFixed(2);

                            // комиссия за конвертацию результата в валюту оплаты
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию результата в валюту оплаты
                            let min = (conv - comconv).toFixed(2);

                            // конвертируем в основную валюту мерчанта
                            let conv2 = (+min * +rate2).toFixed(2);

                            // комиссия за конвертацию в основную валюту мерчанта
                            let comconv2 = (conv2 / 100 * checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию в основную валюту
                            let min2 = (conv2 - (conv2 / 100 * checkout.exchange_percentage)).toFixed(2);

                            // конвертируем комиссию конвертации с валюты оплаты в GBP -в основную валюту
                            let conv3 = (exch2 * rate2).toFixed(2);

                            // отнимаем комиссию за конвертацию
                            let rezult = (min2 - conv3).toFixed(2);

                            cy.log("рейт c " + checkout.product_currency_c3 + " в " + checkout.pay_currency + " = " + rate);
                            cy.log("рейт c " + checkout.pay_currency + " в " + merchant.main_currency + " = " + rate2);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c3);
                            cy.log("процент комиссии =" + " " + (+payAmount / 100 * perscom).toFixed(2));
                            cy.log("комиссия за конвертацию цены товара в валюту оплаты=" + " " + exch);
                            cy.log("конвертированная комиссия конвертации с валюты оплаты в GBP =" + " " + conv3);
                            cy.log("комиссия за конвертацию в валюту оплаты =" + " " + comconv);
                            cy.log("комиссия за конвертацию в основную валюту =" + " " + comconv2);

                            // Check Amount
                            cy.request({
                                method: 'GET',
                                url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
                                headers: {
                                    token: merchant.token
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let sum = response.body.data[0].amount;

                                try {

                                    expect(cy.getDeltaCheckout(sum, rezult)).to.eq(true);

                                }catch (e) {
                                    cy.log("acc_rezult " + sum);
                                    cy.log("math_rezult " + rezult);
                                }
                            })
                        }
                    }
                })
            })
        })
    }


    checkAmountUICUP(payAmount) {
        // Get strategy, percent and fix commissions
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let fixcom = response.body.data[7].value[checkout.product_currency_c4][0];
            let perscom = response.body.data[7].value[checkout.product_currency_c4][1];
            let strateg = response.body.data[7].strategy;

            cy.wait(5000);

            //Check status tranzaction
            cy.get(':nth-child(1) > .cdk-column-state > .mat-chip').invoke('text').should((text) => {
                expect(text).to.eq(' Accepted ')
            });

            // Сalculation formula & Check Amount

            // Get transaction_id last transaction
            // cy.request({
            //     method: 'GET',
            //     url: 'https://account.stage.paydo.com/v1/transactions/user-transactions?query[type]=7',
            //     headers: {
            //         token: merchant.token
            //     }
            // }).then((response) => {
            //     expect(response).property('status').to.equal(200);
            //     expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            //     let transaction_id = response.body.data[0].identifier;

                // Get rate from product currency to pay currency and rate2 from pay currency to main currency

                cy.request({
                    method: 'GET',
                    url: "https://admin.stage.paydo.com/v1/currencies/get-rates-for/" + checkout.product_currency_c4,
                    headers: {
                        token: feen.token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rate = response.body.data.rates[checkout.pay_currency];

                    cy.request({
                        method: 'GET',
                        url: "https://admin.stage.paydo.com/v1/currencies/get-rates-for/" + checkout.pay_currency,
                        headers: {
                            token: feen.token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let rate2 = response.body.data.rates[merchant.main_currency];

                // cy.request({
                //     method: 'GET',
                //     url: "https://admin.stage.paydo.com/v1/transactions/" + transaction_id,
                //     headers: {
                //         token: manajer.token
                //     }
                // }).then((response) => {
                //     expect(response).property('status').to.equal(200);
                //     expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                //     let rate = response.body.data.exchanges[0].rate;
                //     let rate2 = response.body.data.exchanges[1].rate;

                    // комиссия за конвертацию цены товара в валюту оплаты
                    let exch = (payAmount / 100 * checkout.exchange_percentage).toFixed(2);

                    // комиссия за конвертацию с валюты оплаты в GBP
                    let exch2 = ((payAmount * rate) / 100 * checkout.exchange_percentage).toFixed(2);

                    if (strateg === 1) {

                        // суммируем фиксированную комиссию и процент комиссии
                        let sumcom = (+fixcom + (+payAmount / 100 * +perscom)).toFixed(2);

                        // отнимаем от стоимости товара сумму комисий и комиссию за конвертацию цены товара в валюту оплаты
                        let net = (payAmount - sumcom - exch).toFixed(2);

                        // конвертируем результат в валюту оплаты
                        let conv = (+net * +rate).toFixed(2);

                        // комиссия за конвертацию результата в валюту оплаты
                        let comconv = (+conv / 100 * +checkout.exchange_percentage).toFixed(2);

                        // отнимаем комиссию за конвертацию результата в валюту оплаты
                        let min = (+conv - comconv).toFixed(2);

                        // конвертируем в основную валюту мерчанта
                        let conv2 = (+min * +rate2).toFixed(2);

                        // комиссия за конвертацию в основную валюту мерчанта
                        let comconv2 = (conv2 / 100 * checkout.exchange_percentage).toFixed(2);

                        // отнимаем комиссию за конвертацию в основную валюту
                        let min2 = (conv2 - comconv2).toFixed(2);

                        // конвертируем комиссию за конвертацию с валюты оплаты в GBP в основную валюту мерчанта
                        let conv3 = (exch2 * rate2).toFixed(2);

                        // отнимаем конвертированную комиссию
                        let rezult = (min2 - conv3).toFixed(2);

                        cy.log("рейт c " + checkout.product_currency_c4 + " в " + checkout.pay_currency + " = " + rate);
                        cy.log("рейт c " + checkout.pay_currency + " в " + merchant.main_currency + " = " + rate2);
                        cy.log("стратегия комиссий =" + " " + strateg);
                        cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c4);
                        cy.log("сумма комиссий =" + " " + sumcom);
                        cy.log("комиссия за конвертацию цены товара в валюту оплаты=" + " " + exch);
                        cy.log("конвертированная комиссия конвертации с валюты оплаты в GBP =" + " " + conv3);
                        cy.log("комиссия за конвертацию в валюту оплаты =" + " " + comconv);
                        cy.log("комиссия за конвертацию в основную валюту =" + " " + comconv2);

                        // Check Amount
                        try{
                        cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                            //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency)
                                expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                            })
                        }catch (e) {
                            }
                    } else {
                        if (fixcom > (+payAmount / 100 * +perscom)) {

                            // отнимаем от стоимости товара фиксированную комиссию и комиссию за конвертацию валюты товара  в валюту оплаты
                            let net = (payAmount - fixcom - exch).toFixed(2);

                            // конвертируем результат в основную валюту мерчанта
                            let conv = (net * +rate).toFixed(2);

                            // комиссия за конвертацию
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию результата в валюту оплаты
                            let min = (conv - comconv).toFixed(2);

                            // конвертируем в основную валюту мерчанта
                            let conv2 = (+min * +rate2).toFixed(2);

                            // комиссия за конвертацию в основную валюту мерчанта
                            let comconv2 = (conv2 / 100 * checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию
                            let min2 = (conv2 - (conv2 / 100 * checkout.exchange_percentage)).toFixed(2);

                            // конвертируем комиссию за второй обмен в основную валюту мерчанта
                            let conv3 = (exch2 * rate2).toFixed(2);

                            let rezult = (min2 - conv3).toFixed(2);

                            cy.log("рейт c " + checkout.product_currency_c4 + " в " + checkout.pay_currency + " = " + rate);
                            cy.log("рейт c " + checkout.pay_currency + " в " + merchant.main_currency + " = " + rate2);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c4);
                            cy.log("фиксированная комиссия =" + " " + (+fixcom).toFixed(2));
                            cy.log("комиссия за конвертацию цены товара в валюту оплаты=" + " " + exch);
                            cy.log("конвертированная комиссия конвертации с валюты оплаты в GBP =" + " " + conv3);
                            cy.log("комиссия за конвертацию в валюту оплаты =" + " " + comconv);
                            cy.log("комиссия за конвертацию в основную валюту =" + " " + comconv2);

                            // Check Amount
                            try {
                                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                    expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                                })
                            }catch (e) {
                            }
                        } else {

                            // отнимаем от стоимости товара процент комиссии и комиссию за конвертацию цены товара в валюту оплаты
                            let net = (payAmount - (payAmount / 100 * perscom) - exch).toFixed(2);

                            // конвертируем результат в валюту оплаты
                            let conv = (net * +rate).toFixed(2);

                            // комиссия за конвертацию результата в валюту оплаты
                            let comconv = (conv / 100 * +checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссии за конвертацию результата в валюту оплаты
                            let min = (conv - comconv).toFixed(2);

                            // конвертируем в основную валюту мерчанта
                            let conv2 = (+min * +rate2).toFixed(2);

                            // комиссия за конвертацию в основную валюту мерчанта
                            let comconv2 = (conv2 / 100 * checkout.exchange_percentage).toFixed(2);

                            // отнимаем комиссию за конвертацию в основную валюту
                            let min2 = (conv2 - (conv2 / 100 * checkout.exchange_percentage)).toFixed(2);

                            // конвертируем комиссию конвертации с валюты оплаты в GBP
                            let conv3 = (exch2 * rate2).toFixed(2);

                            // отнимаем комиссию за конвертацию
                            let rezult = (min2 - conv3).toFixed(2);

                            cy.log("рейт c " + checkout.product_currency_c4 + " в " + checkout.pay_currency + " = " + rate);
                            cy.log("рейт c " + checkout.pay_currency + " в " + merchant.main_currency + " = " + rate2);
                            cy.log("стратегия комиссий =" + " " + strateg);
                            cy.log("цена товара =" + " " + payAmount + " " + checkout.product_currency_c4);
                            cy.log("процент комиссии =" + " " + (+payAmount / 100 * perscom).toFixed(2));
                            cy.log("комиссия за конвертацию цены товара в валюту оплаты=" + " " + exch);
                            cy.log("конвертированная комиссия конвертации с валюты оплаты в GBP =" + " " + conv3);
                            cy.log("комиссия за конвертацию в валюту оплаты =" + " " + comconv);
                            cy.log("комиссия за конвертацию в основную валюту =" + " " + comconv2);

                            // Check Amount
                            try {
                                cy.get('[class="bold price-align"]').eq(0).invoke('text').should((text) => {
                                    //expect(text).to.eq((+rezult).toFixed(2) + ' ' + merchant.main_currency)
                                    expect(cy.getDeltaCheckout(parseFloat(text), rezult)).to.eq(true);
                                })
                            }catch (e) {
                            }
                        }
                    }
                })
            })
        })
    }


    clickButtonPartialRefund() {
        cy.contains('div', 'Partial Refund').click();
    }

    clickButtonCreateRefund() {
        parentPage.clickButton(' Create refund ');
    }

    enterTextInToInputPartialRefundAmount(amount) {
        parentPage.getInput('amount').clear().type(amount);
        //cy.get('#mat-input-6').type(amount);
    }

    checkCreateRefund() {
        // get ID last transaction and save on variable trIdent
        cy.request({
            method: 'GET',
            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions',
            headers: {
                token: merchant.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let trIdent = response.body.data[0].identifier;

            // get status refund
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/transactions/" + trIdent,
                headers: {
                    token: merchant.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                expect(response.body.data.refunds[0].status).to.eq(1)
            })
        })
    }


    clickButtonCreateRefundOk() {
        cy.get('[class="new-alert-btn ng-tns-c285-0"]').click();
    }

    clickButtonRefund() {
        cy.get('[class="purple-btn w-183"]').click();
    }

    clickConfirmRefund() {
        cy.contains('button', 'Yes, I sure ').click();
    }

    getButtonFilter() {
        return cy.get('.filter-buttons > :nth-child(3) > .mat-button-wrapper');
    }

    getInputMerchantID() {
        return cy.get('#mat-input-0');
    }

    getButtonChargebackCreate() {
        return cy.get('[class="mat-button-focus-overlay"]').eq(3);
    }

    confirmChargeback() {
        cy.contains('button', 'Yes, I sure ').click();
    }

    checkCreateChargeback() {
        cy.get('[class="alert__title ng-tns-c214-0"]').invoke('text').should((text) => {
        //cy.get('.alert__title').invoke('text').should((text) => {
            expect(text).to.eq('Success');
        })
    }

    isErrorAlertDisplayed(alert) {
        cy.get('li.ng-tns-c285-0').invoke('text').should((text) => {
            expect(text).to.eq(alert)
        });
    }

    getInputPartialRefundAmountRepeat() {
        return cy.get('#mat-input-7');
    }

    createPartialRefundAndCheckAmount(payAmount, payCurrency) {

        // Get ID last transaction
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/transactions/user-transactions",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let transaction_ID = response.body.data[0].identifier;

            // Get commission for refund
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let refund_fixcom = response.body.data[0].value[payCurrency][0];
                let refund_perscom = response.body.data[0].value[payCurrency][1];

                // Get available balance amount
                cy.request({
                    method: 'GET',
                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                    headers: {
                        token: merchant.token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let available_balance = response.body.data[payCurrency].available.actual;

                    //Create Partial refund
                    cy.request({
                        method: 'POST',
                        url: "https://account.stage.paydo.com/v1/refunds/create",
                        headers: {
                            token: merchant.token,
                        },
                        body: {
                            "refundType": 2,
                            "transactionIdentifier": transaction_ID,
                            "amount": payAmount / 2
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(201);

                        // Сalculation mathematics
                        // процент комиссии за рефанд
                        let perscom = ((+payAmount / 2) / 100 * refund_perscom).toFixed(2);

                        if (payCurrency === 'GBP') {

                            // со счета спишется
                            let final = ((+payAmount / 2) + (+refund_fixcom) + (+perscom)).toFixed(2);

                            // проверка баланса мерчанта
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                headers: {
                                    token: merchant.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let available_balance_after = response.body.data[payCurrency].available.actual;

                                try {

                                    expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_balance - final).toFixed(2));

                                }catch (e) {
                                    cy.log("payAmount " + payAmount);
                                    cy.log("payCurrency " + payCurrency);
                                    cy.log("refund_fixcom " + refund_fixcom);
                                    cy.log("refund_perscom " + (payAmount / 100 * refund_perscom).toFixed(2));
                                    cy.log("available_balance " + available_balance);
                                    cy.log("available_balance_after " + available_balance_after);
                                }
                            })
                        } else {

                            // будет одна конвертация
                            let conv = ((+payAmount / 2) + +refund_fixcom + +perscom) / 100 * refund.exchange_percentage.toFixed(2);

                            // со счета спишется
                            let final = ((+payAmount / 2) + (+refund_fixcom) + (+perscom) + (+conv)).toFixed(2);

                            // проверка баланса мерчанта
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                headers: {
                                    token: merchant.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let available_balance_after = response.body.data[payCurrency].available.actual;

                                try {

                                    expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_balance - final).toFixed(2));

                                }catch (e) {
                                    cy.log("payAmount " + payAmount);
                                    cy.log("payCurrency " + payCurrency);
                                    cy.log("refund_fixcom " + refund_fixcom);
                                    cy.log("refund_perscom " + (payAmount / 100 * refund_perscom).toFixed(2));
                                    cy.log("available_balance " + available_balance);
                                    cy.log("available_balance_after " + available_balance_after);
                                }
                            })
                        }
                    })
                })
            })
        })
    }

    createFullRefundAndCheckAmount(payAmount, payCurrency) {

            // Get ID last transaction
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/transactions/user-transactions",
                headers: {
                    token: merchant.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let transaction_ID = response.body.data[0].identifier;

                // Get available balance amount
                cy.request({
                    method: 'GET',
                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                    headers: {
                        token: merchant.token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let available_balance = response.body.data[payCurrency].available.actual;

                    //Create Full refund
                    cy.request({
                        method: 'POST',
                        url: "https://account.stage.paydo.com/v1/refunds/create",
                        headers: {
                            token: merchant.token,
                        },
                        body: {
                            "refundType": 1,
                            "transactionIdentifier": transaction_ID,
                            "amount": payAmount
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(201);

                        // Get commission for refund
                        cy.request({
                            method: 'GET',
                            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
                            headers: {
                                token: feen.token,
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let refund_fixcom = response.body.data[0].value[payCurrency][0];
                            let refund_perscom = response.body.data[0].value[payCurrency][1];

                            // Сalculation mathematics

                            // процент комиссии за рефанд
                            let perscom = (payAmount / 100 * refund_perscom).toFixed(2);

                            if (payCurrency === 'GBP') {

                                // со счета спишется
                                let final = (+payAmount + (+refund_fixcom) + (+perscom)).toFixed(2);

                                // проверка баланса мерчанта
                                cy.request({
                                    method: 'GET',
                                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                    headers: {
                                        token: merchant.token,
                                    }
                                }).then((response) => {
                                    expect(response).property('status').to.equal(200);
                                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                    let available_balance_after = response.body.data[payCurrency].available.actual;

                                    try {

                                        expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_balance - final).toFixed(2));

                                    }catch (e) {
                                        cy.log("payAmount " + payAmount);
                                        cy.log("payCurrency " + payCurrency);
                                        cy.log("refund_fixcom " + refund_fixcom);
                                        cy.log("refund_perscom " + (payAmount / 100 * refund_perscom).toFixed(2));
                                        cy.log("available_balance " + available_balance);
                                        cy.log("available_balance_after " + available_balance_after);
                                    }
                                })
                            } else {

                                // будет одна конвертация
                                let conv = ((+payAmount + +refund_fixcom + +perscom) / 100 * refund.exchange_percentage).toFixed(2);

                                // со счета спишется
                                let final = (+payAmount + (+refund_fixcom) + (+perscom) + (+conv)).toFixed(2);

                                // проверка баланса мерчанта
                                cy.request({
                                    method: 'GET',
                                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                    headers: {
                                        token: merchant.token,
                                    }
                                }).then((response) => {
                                    expect(response).property('status').to.equal(200);
                                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                    let available_balance_after = response.body.data[payCurrency].available.actual;

                                    try {

                                        expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_balance - final).toFixed(2));

                                    }catch (e) {
                                        cy.log("payAmount " + payAmount);
                                        cy.log("payCurrency " + payCurrency);
                                        cy.log("refund_fixcom " + refund_fixcom);
                                        cy.log("refund_perscom " + (payAmount / 100 * refund_perscom).toFixed(2));
                                        cy.log("available_balance " + available_balance);
                                        cy.log("available_balance_after " + available_balance_after);
                                    }
                                })
                            }
                        })
                    })
                })
            })
    }


    createFullRefundUAHAndCheckAmount(payAmount, payCurrency) {

        // Get ID last transaction
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/transactions/user-transactions",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let transaction_ID = response.body.data[0].identifier;

            // Get the rate in the main currency
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/transactions/" + transaction_ID,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let rate = response.body.data.exchanges[0].rate;

                // Get available balance main currency
                cy.request({
                    method: 'GET',
                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                    headers: {
                        token: merchant.token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let available_main_currency = response.body.data[merchant.main_currency].available.actual;

                    //Create refund
                    cy.request({
                        method: 'POST',
                        url: "https://account.stage.paydo.com/v1/refunds/create",
                        headers: {
                            token: merchant.token,
                        },
                        body: {
                            "refundType": 1,
                            "transactionIdentifier": transaction_ID,
                            "amount": payAmount
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(201);

                        // Get commission for refund
                        cy.request({
                            method: 'GET',
                            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
                            headers: {
                                token: feen.token,
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let refund_fixcom = response.body.data[0].value[merchant.main_currency][0];
                            let refund_perscom = response.body.data[0].value[merchant.main_currency][1];

                            // Сalculation mathematics

                            // refund commission percentage
                            let perscom = (payAmount / 100 * refund_perscom).toFixed(2);

                            // conversion to the main currency of the merchant
                            let conv = ((+payAmount + +refund_fixcom + +perscom) * rate).toFixed(2);

                            // percentage for conversion
                            let conv_pers = (+conv / 100 * refund.exchange_percentage).toFixed(2);

                            // add the percentage for the conversion to the refund amount
                            let sum = (+conv + +conv_pers).toFixed(2);

                            // conversion into PM currency
                            let convPM = ((+sum) / 100 * refund.exchange_percentage).toFixed(2);

                            // will be debited from the account
                            let final = (+sum + (+convPM)).toFixed(2);

                            // checking the balance of the merchant
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                headers: {
                                    token: merchant.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let available_balance_after = response.body.data[merchant.main_currency].available.actual;

                                try {

                                    expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_main_currency - final).toFixed(2));

                                }catch (e) {
                                    cy.log("payAmount" + payAmount);
                                    cy.log("payCurrency " + payCurrency);
                                    cy.log("refund_fixcom " + refund_fixcom);
                                    cy.log("refund_perscom " + (payAmount / 100 * refund_perscom).toFixed(2));
                                    cy.log("available_balance " + available_main_currency);
                                    cy.log("available_balance_after " + available_balance_after);
                                }
                            })
                        })
                    })
                })
            })
        })
    }

    createPartialRefundUAHAndCheckAmount(payAmount, payCurrency) {

        // Get ID last transaction
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/transactions/user-transactions",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let transaction_ID = response.body.data[0].identifier;

            // Get the rate in the main currency
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/transactions/" + transaction_ID,
                headers: {
                    token: feen.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let rate = response.body.data.exchanges[0].rate;

                // Get available balance main currency
                cy.request({
                    method: 'GET',
                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                    headers: {
                        token: merchant.token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let available_main_currency = response.body.data[merchant.main_currency].available.actual;

                    //Create refund
                    cy.request({
                        method: 'POST',
                        url: "https://account.stage.paydo.com/v1/refunds/create",
                        headers: {
                            token: merchant.token,
                        },
                        body: {
                            "refundType": 2,
                            "transactionIdentifier": transaction_ID,
                            "amount": payAmount / 2
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(201);

                        // Get commission for refund
                        cy.request({
                            method: 'GET',
                            url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
                            headers: {
                                token: feen.token,
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let refund_fixcom = response.body.data[0].value[merchant.main_currency][0];
                            let refund_perscom = response.body.data[0].value[merchant.main_currency][1];

                            // Сalculation mathematics

                            // refund commission percentage
                            let perscom = ((payAmount / 2) / 100 * refund_perscom).toFixed(2);

                            // conversion to the main currency of the merchant
                            let conv = (((+payAmount / 2) + +refund_fixcom + +perscom) * rate).toFixed(2);

                            // percentage for conversion
                            let conv_pers = (+conv / 100 * refund.exchange_percentage).toFixed(2);

                            // add the percentage for the conversion to the refund amount
                            let sum = (+conv + +conv_pers).toFixed(2);

                            // conversion into PM currency
                            let convPM = ((+sum) / 100 * refund.exchange_percentage).toFixed(2);

                            // will be debited from the account
                            let final = (+sum + (+convPM)).toFixed(2);

                            // checking the balance of the merchant
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                headers: {
                                    token: merchant.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let available_balance_after = response.body.data[merchant.main_currency].available.actual;

                                try {

                                    expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_main_currency - final).toFixed(2));

                                }catch (e) {
                                    cy.log("payAmount" + payAmount);
                                    cy.log("payCurrency " + payCurrency);
                                    cy.log("refund_fixcom " + refund_fixcom);
                                    cy.log("refund_perscom " + (payAmount / 100 * refund_perscom).toFixed(2));
                                    cy.log("available_balance " + available_main_currency);
                                    cy.log("available_balance_after " + available_balance_after);
                                }
                            })
                        })
                    })
                })
            })
        })
    }



    createChargebackAndCheckBalance() {

        let payAmount = parentPage.getRandomArbitrary(100, 500);
        //let payAmount = 250;

        for (let i = 0; i < chargeback.currency.length; i++) {
            let payCurrency = chargeback.currency[i];
            cy.log(payCurrency);
            createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
            cy.wait(3000);

            // Get ID last transaction
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/transactions/user-transactions",
                headers: {
                    token: merchant.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let transaction_ID = response.body.data[0].identifier;

                //Get amount
                cy.request({
                    method: 'GET',
                    url: "https://account.stage.paydo.com/v1/transactions/" + transaction_ID,
                    headers: {
                        token: merchant.token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let amount = response.body.data.amount;

                    // Get available balance amount
                    cy.request({
                        method: 'GET',
                        url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                        headers: {
                            token: merchant.token,
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let available_balance = response.body.data[payCurrency].available.actual;

                        //Create chargeback
                        cy.request({
                            method: 'POST',
                            url: "https://account.stage.paydo.com/v1/chargebacks/create",
                            headers: {
                                token: feen.token
                            },
                            body: {
                                "transactionIdentifier": transaction_ID
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(201);

                            // Get commission for chargeback
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
                                headers: {
                                    token: feen.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let chargeback_fixcom = response.body.data[6].value[payCurrency][0];
                                let chargeback_perscom = response.body.data[6].value[payCurrency][1];

                                // Сalculation mathematics

                                // Chargeback commission percentage
                                let perscom = (amount / 100 * chargeback_perscom).toFixed(2);

                                if (payCurrency === 'GBP') {

                                    // Will be debited from the account
                                    let final = (+payAmount + (+chargeback_fixcom) + (+perscom)).toFixed(2);

                                    // Checking the balance of the merchant
                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                        headers: {
                                            token: merchant.token,
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let available_balance_after = response.body.data[payCurrency].available.actual;

                                        expect(parentPage.getDelta(chargeback, available_balance_after, (available_balance - final).toFixed(2)));

                                        //expect((available_balance_after).toFixed(2)).to.eq((+available_balance - final).toFixed(2));
                                        //     expect(cy.getDeltaChargeback(available_balance_after, (available_balance - final))).to.eq(true);
                                        cy.log("product Amount " + payAmount);
                                        cy.log("amount " + amount);
                                        cy.log("chargeback fixcom " + chargeback_fixcom);
                                        cy.log("chargeback perscom " + (amount / 100 * chargeback_perscom).toFixed(2));
                                        cy.log("available balance " + available_balance);
                                        cy.log("available balance after " + available_balance_after);
                                        // }
                                    })
                                } else {

                                    // Will be one conversion
                                    let conv = ((+payAmount + +chargeback_fixcom + +perscom) / 100 * chargeback.exchange_percentage).toFixed(2);

                                    // Will be debited from the account
                                    let final = (+payAmount + (+chargeback_fixcom) + (+perscom) + (+conv)).toFixed(2);

                                    // Checking the balance of the merchant
                                    cy.request({
                                        method: 'GET',
                                        url: "https://app.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                        headers: {
                                            token: merchant.token,
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let available_balance_after = response.body.data[payCurrency].available.actual;

                                        expect(parentPage.getDelta(chargeback, available_balance_after, (available_balance - final).toFixed(2)));
                                       // expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_balance - final).toFixed(2));
                                        //     expect(cy.getDeltaChargeback(available_balance_after, (available_balance - final))).to.eq(true);
                                        cy.log("product Amount " + payAmount);
                                        cy.log("amount " + amount);
                                        cy.log("chargeback fixcom " + chargeback_fixcom);
                                        cy.log("chargeback perscom " + (amount / 100 * chargeback_perscom).toFixed(2));
                                        cy.log("available balance " + available_balance);
                                        cy.log("available balance after " + available_balance_after);
                                        // }
                                    })
                                }
                            })
                        })
                    })
                })
            })
        }

    }


    createChargebackUAHAndCheckBalance(payCurrency) {

        let payAmount = parentPage.getRandomArbitrary(100, 500);
        //let payAmount = 500;

        createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
        cy.wait(3000);

        // Get ID last transaction
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/transactions/user-transactions",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let transaction_ID = response.body.data[0].identifier;

            //Get amount
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/transactions/" + transaction_ID,
                headers: {
                    token: merchant.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let amount = response.body.data.amount;

                // Get the rate in the main currency
                cy.request({
                    method: 'GET',
                    url: "https://admin.stage.paydo.com/v1/transactions/" + transaction_ID,
                    headers: {
                        token: feen.token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rate = response.body.data.exchanges[0].rate;

                    // Get available balance main currency
                    cy.request({
                        method: 'GET',
                        url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                        headers: {
                            token: merchant.token,
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let available_main_currency = response.body.data[merchant.main_currency].available.actual;

                        // Create chargeback
                        cy.request({
                            method: 'POST',
                            url: "https://account.stage.paydo.com/v1/chargebacks/create",
                            headers: {
                                token: feen.token,
                            },
                            body: {
                                "transactionIdentifier": transaction_ID
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(201);

                            // Get commission for chargeback
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + paymentMethod.pm_id + "/" + merchant.bussiness_account,
                                headers: {
                                    token: feen.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let chargeback_fixcom = response.body.data[6].value[merchant.main_currency][0];
                                let chargeback_perscom = response.body.data[6].value[merchant.main_currency][1];

                                // Сalculation mathematics

                                // Chargeback commission percentage
                                let perscom = (amount / 100 * chargeback_perscom).toFixed(2);

                                // Converting the chargeback  amount into the seller's main currency
                                let conv = (+payAmount * rate).toFixed(2);

                                // Adding conversion interest and commissions to the chargeback amount
                                let sum = (+conv + +chargeback_fixcom + +perscom).toFixed(2);

                                // Percentage for conversion
                                let conv_pers = (+sum / 100 * chargeback.exchange_percentage).toFixed(2);

                                // Will be debited from the account
                                let final = (+sum + +conv_pers).toFixed(2);

                                // Checking the balance of the merchant
                                cy.request({
                                    method: 'GET',
                                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                    headers: {
                                        token: merchant.token,
                                    }
                                }).then((response) => {
                                    expect(response).property('status').to.equal(200);
                                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                    let available_balance_after = response.body.data[merchant.main_currency].available.actual.toString();

                                    expect(parentPage.getDelta(chargeback, available_balance_after, (available_main_currency - final).toFixed(2)));
                                    //expect (available_balance_after).to.eq ((available_main_currency - final).toFixed(2));                                    //
                                    //     expect(cy.getDeltaChargeback(available_balance_after, (available_main_currency - final))).to.eq(true);
                                         cy.log("product Amount " + payAmount);
                                         cy.log("amount " + amount);
                                         cy.log("chargeback fixcom " + chargeback_fixcom);
                                         cy.log("chargeback perscom " + (amount / 100 * chargeback_perscom).toFixed(2));
                                         cy.log("available balance " + available_main_currency);
                                         cy.log("available balance after " + available_balance_after);
                                    // }
                                })
                            })
                        })
                    })
                })
            })
        })
    }



}

export default new TransactionsPage();