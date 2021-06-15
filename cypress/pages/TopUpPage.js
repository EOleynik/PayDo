import topUp from "../fixtures/topUp";
import merchant from "../fixtures/merchant";
import parentPage from "./ParentPage";
import feen from "../fixtures/feen";
import card from "../fixtures/card";

class TopUpPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url);
    }

    chooseWalletTopUp(wallet) {
        cy.get('[class="shared-wallet-select"]').click();
        cy.get('[class="mat-option-text"]').contains(wallet).click();
    }

    clickButtonOk() {
        parentPage.clickButton(' Ok ');
    }

    checkStatusTopUp(status) {
        cy.get('[class="mat-dialog-title dialog-title"]').invoke('text').should((text) => {
            expect(text).to.eq(status);
        })
    }

    createTopUpAndCheckBalance(wallet) {
        for (let i = 0; i < topUp.wallet.length; i++) {

            cy.log("Top Up wallet " + topUp.wallet[i]);
            let currency = topUp.wallet[i];

            // Get available balance wallet
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                headers: {
                    token: topUp.merch_token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let available_balance = response.body.data[currency].available.actual;

                // Get default app
                cy.request({
                    method: 'GET',
                    url: "https://account.stage.paydo.com/v1/apps/user-apps?query[showDefault]=true",
                    headers: {
                        token: topUp.merch_token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let identifier = response.body.data[0].identifier;
                    let secretKey = response.body.data[0].secretKey;

                    // Install can use card token
                    cy.request({
                        method: 'POST',
                        url: "https://account.stage.paydo.com/v1/apps/" + identifier + "/update-manager",
                        headers: {
                            token: feen.token,
                        },
                        body: {
                            "identifier": identifier,
                            "userIdentifier": topUp.merch_id,
                            "name": "Default_" + topUp.merch_id,
                            "info": "Default_" + topUp.merch_id,
                            "publicKey": "application-" + identifier,
                            "secretKey": secretKey,
                            "ipn": "ipn://empty",
                            "httpMethod": "POST",
                            "isLegacy": false,
                            "site": "http://empty",
                            "status": 1,
                            "newStatus": null,
                            "checkoutPageCustomization": [],
                            "buttonCustomization": [],
                            "cashRegisterType": "default",
                            "isDeleted": false,
                            "canUseCardToken": true,
                            "canUseAntiFraud": false,
                            "antiFraudSystemIdentifier": 0,
                            "antiFraudRiskScore": 0,
                            "antiFraudIpRiskScore": 0,
                            "midName": "Test_Kolya_MMO",
                            "midIdentifier": 2,
                            "amountInfo": []
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(201);

                        // Create invoice
                        cy.request({
                            method: 'POST',
                            url: "https://account.stage.paydo.com/v1/invoices/create",
                            headers: {
                                token: topUp.merch_token,
                            },
                            body: {
                                "publicKey": "application-" + identifier,
                                "order": {
                                    "items": [],
                                    "description": topUp.description,
                                    "id": "Wallet top up",
                                    "amount": topUp.amount,
                                    "currency": currency
                                },
                                "signature": parentPage.signatureGeneration(topUp.amount, currency, topUp.description, secretKey),
                                "payer": {
                                    "email": topUp.merchant_email
                                },
                                "paymentMethod": topUp.payment_method_ID,
                                "language": "en",
                                "resultUrl": "https://account.stage.paydo.com/en/top-up/by-card/success",
                                "failPath": "https://account.stage.paydo.com/en/top-up/by-card/fail",
                                "productUrl": "https://account.stage.paydo.com/en/top-up",
                                "isTopUp": true
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let invoice = response.body.data;
                            expect(response.body.status).to.eq(1);

                            // Create card token
                            cy.request({
                                method: 'POSt',
                                url: "https://account.stage.paydo.com/v1/payment-tools/card-token/create",
                                headers: {
                                    token: topUp.merch_token,
                                },
                                body: {
                                    "invoiceIdentifier": invoice,
                                    "pan": card.card_number,
                                    "expirationDate": card.expiration_date,
                                    "cvv": card.CVC,
                                    "holderName": card.cardholder
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(201);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let card_token = response.body.data.token;
                                expect(response.body.status).to.eq(1);

                                // Create checkout
                                cy.request({
                                    method: 'POSt',
                                    url: "https://account.stage.paydo.com/v1/checkout/create",
                                    headers: {
                                        token: topUp.merch_token,
                                    },
                                    body: {
                                        "invoiceIdentifier": invoice,
                                        "paymentMethod": topUp.payment_method_ID,
                                        "payCurrency": currency,
                                        "customer": {
                                            "email": topUp.merchant_email,
                                            "name": "",
                                            "phone": "",
                                            "address": "",
                                            "companyName": "",
                                            "site": "",
                                            "extraFields": []
                                        },
                                        "cardToken": card_token,
                                        "checkStatusUrl": "https://stage.paydo.com/en/payment/wait-page/{{txid}}",
                                        "shouldSaveCard": false
                                    }
                                }).then((response) => {
                                    expect(response).property('status').to.equal(200);
                                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                    expect(response.body.data.isSuccess).to.eq(true);
                                    let transaction_id = response.body.data.txid;
                                    expect(response.body.status).to.eq(1);

                                    // Get commission for Top Up
                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.stage.paydo.com/v1/instrument-settings/commissions/custom/" + topUp.payment_method_ID + "/" + topUp.merch_id,
                                        headers: {
                                            token: feen.token,
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let fixcom = response.body.data[7].value[currency][0];
                                        let perscom = response.body.data[7].value[currency][1];
                                        let strateg = response.body.data[7].strategy;

                                        cy.wait(5000);

                                        // Percent commission
                                        let pers = ((topUp.amount / 100) * perscom).toFixed(2);

                                        // Amount of commissions
                                        let sum_com = (+fixcom + +pers).toFixed(2);

                                        if (currency === "GBP") {
                                            // Amount to be credited
                                            let amount = (+topUp.amount - sum_com).toFixed(2);

                                            // Get available balance wallet after
                                            cy.request({
                                                method: 'GET',
                                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                                headers: {
                                                    token: topUp.merch_token,
                                                }
                                            }).then((response) => {
                                                expect(response).property('status').to.equal(200);
                                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                                let available_balance_after = (response.body.data[currency].available.actual).toString();

                                                try {

                                                    expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_balance + +amount).toFixed(2));

                                                }catch (e) {
                                                    cy.log(available_balance);
                                                    cy.log(amount);
                                                    cy.log(available_balance_after);
                                                }
                                            })
                                        } else {
                                            // Will be one conversion
                                            let pers_conv = ((topUp.amount / 100) * topUp.exchange_percentage).toFixed(2);

                                            // Amount to be credited
                                            let amount = (+topUp.amount - sum_com - pers_conv).toFixed(2);

                                            // Get available balance wallet after
                                            cy.request({
                                                method: 'GET',
                                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                                headers: {
                                                    token: topUp.merch_token,
                                                }
                                            }).then((response) => {
                                                expect(response).property('status').to.equal(200);
                                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                                let available_balance_after = (response.body.data[currency].available.actual).toString();

                                                try {

                                                    expect(parseFloat(available_balance_after).toFixed(2)).to.eq((+available_balance + +amount).toFixed(2));

                                                }catch (e) {
                                                    cy.log(available_balance);
                                                    cy.log(amount);
                                                    cy.log(available_balance_after);
                                                }
                                            })
                                        }
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }
    }

    topUpWalletByCard() {
        for (let i = 0; i < topUp.wallet.length; i++) {
            let wallet = topUp.wallet[i];
            cy.get('[class="shared-wallet-select"]').click();
            cy.wait(2000);
            cy.get('[class="mat-option-text"]').contains(wallet).click();
            cy.wait(2000);
            //topUpPage.chooseWalletTopUp(topUp.wallet[i]);
            parentPage.getInput('amount').clear().type(topUp.amount);
            parentPage.getInput('totalAmount').click();
            parentPage.enterCardData();
            parentPage.clickButton('Top up wallet');
            cy.wait(12000);
            cy.get('[class="mat-dialog-title dialog-title"]').invoke('text').should((text) => {
                expect(text).to.eq('Your top up is successful');
            });
                parentPage.clickButton(' Ok ');
                cy.wait(2000);
            }
    }


}

export default new TopUpPage();