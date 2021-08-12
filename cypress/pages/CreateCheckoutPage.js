import card from "../fixtures/Stage/card.json";
import checkout from "../fixtures/Stage/checkout.json";
import merchant from "../fixtures/Stage/merchant.json";
import parentPage from "../pages/ParentPage"

class CreateCheckoutPage {

    getCheckoutGBPAPI(payAmount, payCurrency) {
        // Get secret key & public key last project
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/apps/user-apps",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let secret_key = response.body.data[0].secretKey;
            let public_key = response.body.data[0].publicKey;

            // Signature generation
            var sha256 = require('js-sha256');
            var hash = sha256.create();
            hash.update(payAmount + ':' + payCurrency + ':C1GBPAPI:' + secret_key);
            hash.hex();

            // Create invoices, save to variable invID
            cy.request({
                method: 'POST',
                url: `https://account.stage.paydo.com/v1/invoices/create`,
                body: {
                    "publicKey": public_key,
                    "order": {
                        "id": "C1GBPAPI",
                        "amount": payAmount,
                        "currency": payCurrency,
                        "items": [
                            {
                                "id": "487",
                                "name": "Item 1",
                                "price": "3"
                            },
                            {
                                "id": "358",
                                "name": "Item 2",
                                "price": "7"
                            }
                        ],
                        "description": "case1"
                    },
                    "signature": hash.toString(),
                    "payer": {
                        "email": "eugeniy.o+4avtotest@payop.com",
                        "phone": "",
                        "name": ""
                    },
                    "paymentMethod": null,
                    "language": "en",
                    "resultUrl": "https://account.stage.paydo.com/",
                    "failPath": "https://account.stage.paydo.com/",
                    "productUrl": "https://account.stage.paydo.com/"
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                var invId = response.body.data;

                // Create card token, save to variable tok
                cy.request({
                    method: 'POST',
                    url: `https://admin.stage.paydo.com/v1/payment-tools/card-token/create`,

                    body: {

                        "invoiceIdentifier": invId,
                        "saveCard": null,
                        "pan": card.card_number,
                        "expirationDate": card.expiration_date,
                        "cvv": card.CVC,
                        "holderName": card.cardholder
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(201);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    var tok = response.body.data.token;

                    // Create checkout
                    cy.request({
                        method: 'POST',
                        url: `https://account.stage.paydo.com/v1/checkout/create`,
                        body: {

                            "invoiceIdentifier": invId,
                            "paymentMethod": 1,
                            "payCurrency": payCurrency,
                            "customer": {
                                "email": "eugeniy.o+4avtotest@payop.com",
                                "name": "",
                                "phone": "",
                                "address": "",
                                "companyName": "",
                                "site": "",
                                "extraFields": []
                            },
                            "cardToken": tok,
                            "checkStatusUrl": "https://account.stage.payop.com/en/payment/wait-page/{{txid}}"
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    })
                })
            })
        })
    }

    getCheckout2API(user, payAmount) {

        // Get secret key & public key last project
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/apps/user-apps",
            headers: {
                token: user.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let secret_key = response.body.data[0].secretKey;
            let public_key = response.body.data[0].publicKey;

            // Signature generation
            var sha256 = require('js-sha256');
            var hash = sha256.create();
            hash.update(payAmount + ":" + checkout.product_currency_c2 + ":C2API:" + secret_key);
            hash.hex();

            // Create invoices, save to variable invID
            cy.request({
                method: 'POST',
                url: `https://account.stage.paydo.com/v1/invoices/create`,
                body: {
                    "publicKey": public_key,
                    "order": {
                        "id": "C2API",
                        "amount": payAmount,
                        "currency": checkout.product_currency_c2,
                        "items": [
                            {
                                "id": "487",
                                "name": "Item 1",
                                "price": "15"
                            },
                            {
                                "id": "358",
                                "name": "Item 2",
                                "price": "35"
                            }
                            ],
                        "description": "case2"
                    },
                    "signature": hash.toString(),
                    "payer": {
                        "email": "eugeniy.o+4avtotest@payop.com",
                        "phone": "",
                        "name": ""
                            },
                    "paymentMethod": null,
                    "language": "en",
                    "resultUrl": "https://account.stage.paydo.com/",
                    "failPath": "https://account.stage.paydo.com/",
                    "productUrl": "https://account.stage.paydo.com/"
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                var invId = response.body.data;

                // Login payer
                cy.request({
                    method: 'POST',
                    url: 'https://checkout.stage.paydo.com/v1/users/login',
                    body: {
                        "email": "eugeniy.o+4avtotest@payop.com",
                        "password": "eugeniy.o+4avtotest@payop.com"
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(206)

                    // 2 FA
                    cy.request({
                        method: 'POST',
                        url: 'https://checkout.stage.paydo.com/v1/users/login',
                        headers: {
                            'x-2fa-code': parentPage.get2FACode(merchant.authenticator)
                        },
                        body: {
                            "email": "eugeniy.o+4avtotest@payop.com",
                            "password": "eugeniy.o+4avtotest@payop.com"
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200)

                        // Create card token, save to variable tok
                        cy.request({
                            method: 'POST',
                            url: `https://account.stage.paydo.com/v1/payment-tools/card-token/create`,
                            body: {
                                "invoiceIdentifier": invId,
                                "saveCard": null,
                                "pan": card.card_number,
                                "expirationDate": card.expiration_date,
                                "cvv": card.CVC,
                                "holderName": card.cardholder
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(201);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            var tok = response.body.data.token;

                            // Create checkout
                            cy.request({
                                method: 'POST',
                                url: `https://checkout.stage.paydo.com/v1/checkout/create`,
                                body: {
                                    "invoiceIdentifier": invId,
                                    "paymentMethod": 401,
                                    "payCurrency": checkout.product_currency_c2,
                                    "customer": {
                                        "email": "eugeniy.o+4avtotest@payop.com",
                                        "name": "",
                                        "phone": "",
                                        "address": "",
                                        "companyName": "",
                                        "site": "",
                                        "extraFields": []
                                    },
                                    "seon_session": "9d9a41a78c99bb624f57a57eed08cd54",
                                    "cardToken": tok,
                                    "checkStatusUrl": "https://acount.stage.paydo.com/en/payment/wait-page/{{txid}}",
                                    "type": "Simple"
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            })
                        })
                    })
                })
            })
        })
    }

    getCheckout3API(payAmount) {
        // Get secret key & public key last project
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/apps/user-apps",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let secret_key = response.body.data[0].secretKey;
            let public_key = response.body.data[0].publicKey;

            // Signature generation
            var sha256 = require('js-sha256');
            var hash = sha256.create();
            hash.update(payAmount + ":" + checkout.product_currency_c3 + ":C3API:" + secret_key);
            hash.hex();

            // Create invoices, save to variable invID
            cy.request({
                method: 'POST',
                url: `https://account.stage.paydo.com/v1/invoices/create`,
                body: {
                    "publicKey": public_key,
                    "order": {
                        "id": "C3API",
                        "amount": payAmount,
                        "currency": checkout.product_currency_c3,
                        "items": [
                            {
                                "id": "487",
                                "name": "Item 1",
                                "price": "3"
                            },
                            {
                                "id": "358",
                                "name": "Item 2",
                                "price": "7"
                            }
                        ],
                        "description": "case3"
                    },
                    "signature": hash.toString(),
                    "payer": {
                        "email": "eugeniy.o+4avtotest@payop.com",
                        "phone": "",
                        "name": ""
                    },
                    "paymentMethod": null,
                    "language": "en",
                    "resultUrl": "https://app.stage.paydo.com/",
                    "failPath": "https://app.stage.paydo.com/",
                    "productUrl": "https://app.stage.paydo.com/"
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                var invId = response.body.data;

                // Create card token, save to variable tok
                cy.request({
                    method: 'POST',
                    url: `https://account.stage.paydo.com/v1/payment-tools/card-token/create`,
                    body: {
                        "invoiceIdentifier": invId,
                        "saveCard": null,
                        "pan": card.card_number,
                        "expirationDate": card.expiration_date,
                        "cvv": card.CVC,
                        "holderName": card.cardholder
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(201);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    var tok = response.body.data.token;

                    // Create checkout
                    cy.request({
                        method: 'POST',
                        url: `https://account.stage.paydo.com/v1/checkout/create`,
                        body: {
                            "invoiceIdentifier": invId,
                            "paymentMethod": 1,
                            "payCurrency": merchant.main_currency,
                            "customer": {
                                "email": "eugeniy.o+4avtotest@payop.com",
                                "name": "",
                                "phone": "",
                                "address": "",
                                "companyName": "",
                                "site": "",
                                "extraFields": []
                            },
                            "cardToken": tok,
                            "checkStatusUrl": "https://account.stage.paydo.com/en/payment/wait-page/{{txid}}"
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    })
                })
            })
        })
    }

    getCheckout4API(payAmount) {
        // Get secret key & public key last project
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/apps/user-apps",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let secret_key = response.body.data[0].secretKey;
            let public_key = response.body.data[0].publicKey;

            // Signature generation
            var sha256 = require('js-sha256');
            var hash = sha256.create();
            hash.update(payAmount + ":" + checkout.product_currency_c4 + ":C4API:" + secret_key);
            hash.hex();

            // Create invoices, save to variable invID
            cy.request({
                method: 'POST',
                url: `https://account.stage.paydo.com/v1/invoices/create`,
                body: {
                    "publicKey": public_key,
                    "order": {
                        "id": "C4API",
                        "amount": payAmount,
                        "currency": checkout.product_currency_c4,
                        "items": [
                            {
                                "id": "487",
                                "name": "Item 1",
                                "price": "3"
                            },
                            {
                                "id": "358",
                                "name": "Item 2",
                                "price": "7"
                            }
                        ],
                        "description": "case4"
                    },
                    "signature": hash.toString(),
                    "payer": {
                        "email": "eugeniy.o+4avtotest@payop.com",
                        "phone": "",
                        "name": ""
                    },
                    "paymentMethod": null,
                    "language": "en",
                    "resultUrl": "https://app.stage.paydo.com/",
                    "failPath": "https://app.stage.paydo.com/",
                    "productUrl": "https://app.stage.paydo.com/"
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                var invId = response.body.data;

                // Create card token, save to variable tok
                cy.request({
                    method: 'POST',
                    url: `https://account.stage.paydo.com/v1/payment-tools/card-token/create`,
                    body: {
                        "invoiceIdentifier": invId,
                        "saveCard": null,
                        "pan": card.card_number,
                        "expirationDate": card.expiration_date,
                        "cvv": card.CVC,
                        "holderName": card.cardholder
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(201);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    var tok = response.body.data.token;

                    // Create checkout
                    cy.request({
                        method: 'POST',
                        url: `https://account.stage.paydo.com/v1/checkout/create`,
                        body: {
                            "invoiceIdentifier": invId,
                            "paymentMethod": 1,
                            "payCurrency": checkout.pay_currency,
                            "customer": {
                                "email": "eugeniy.o+4avtotest@payop.com",
                                "name": "",
                                "phone": "",
                                "address": "",
                                "companyName": "",
                                "site": "",
                                "extraFields": []
                            },
                            "cardToken": tok,
                            "checkStatusUrl": "https://account.stage.paydo.com/en/payment/wait-page/{{txid}}"
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    })
                })
            })
        })
    }


    createCheckoutAPI(payAmount, payCurrency) {
        // Get secret key & public key last project
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/apps/user-apps",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let secret_key = response.body.data[0].secretKey;
            let public_key = response.body.data[0].publicKey;

            // Signature generation
            var sha256 = require('js-sha256');
            var hash = sha256.create();
            hash.update(payAmount + ":" + payCurrency + ":" + payCurrency + "API:" + secret_key);
            hash.hex();

            // Create invoices, save to variable invID
            cy.request({
                method: 'POST',
                url: `https://account.stage.paydo.com/v1/invoices/create`,
                body: {
                    "publicKey": public_key,
                    "order": {
                        "id": payCurrency + "API",
                        "amount": payAmount,
                        "currency": payCurrency,
                        "items": [
                            {
                                "id": "487",
                                "name": "Item 1",
                                "price": "3"
                            },
                            {
                                "id": "358",
                                "name": "Item 2",
                                "price": "7"
                            }
                        ],
                        "description": "case4"
                    },
                    "signature": hash.toString(),
                    "payer": {
                        "email": "eugeniy.o+4avtotest@payop.com",
                        "phone": "",
                        "name": ""
                    },
                    "paymentMethod": null,
                    "language": "en",
                    "resultUrl": "https://account.stage.paydo.com/",
                    "failPath": "https://account.stage.paydo.com/",
                    "productUrl": "https://account.stage.paydo.com/"
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                var invId = response.body.data;

                // Create card token, save to variable tok
                cy.request({
                    method: 'POST',
                    url: `https://account.stage.paydo.com/v1/payment-tools/card-token/create`,
                    body: {
                        "invoiceIdentifier": invId,
                        "saveCard": null,
                        "pan": card.card_number,
                        "expirationDate": card.expiration_date,
                        "cvv": card.CVC,
                        "holderName": card.cardholder
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(201);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    var tok = response.body.data.token;

                    // Create checkout
                    cy.request({
                        method: 'POST',
                        url: `https://account.stage.paydo.com/v1/checkout/create`,
                        body: {
                            "invoiceIdentifier": invId,
                            "paymentMethod": 1,
                            "payCurrency": payCurrency,
                            "customer": {
                                "email": "eugeniy.o+4avtotest@payop.com",
                                "name": "",
                                "phone": "",
                                "address": "",
                                "companyName": "",
                                "site": "",
                                "extraFields": []
                            },
                            "cardToken": tok,
                            "checkStatusUrl": "https://account.stage.paydo.com/en/payment/wait-page/{{txid}}"
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    })
                })
            })
        })
    }
}



export default new CreateCheckoutPage();