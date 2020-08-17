

class CreateCheckoutPage {

    getCheckoutAPI(payAmount, payCurrency) {

        var sha256 = require('js-sha256');
        var hash = sha256.create();
        hash.update(payAmount+':'+payCurrency+':C1GBPALL:8066824084365eb4ccfea2f8');
        hash.hex();

        cy.request({
            method: 'POST',
            url: `https://app.stage.paydo.com/v1/invoices/create`,
            body: {
                "publicKey": "application-cc9cf5c0-e5c8-46f0-8da3-fce662143c03",
                "order": {
                    "id": "C1GBPALL",
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
                "resultUrl": "https://app.stage.paydo.com/",
                "failPath": "https://app.stage.paydo.com/",
                "productUrl": "https://app.stage.paydo.com/"
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            var invId = response.body.data;

            cy.request({
                method: 'POST',
                url: `https://app.stage.paydo.com/v1/payment-tools/card-token/create`,
                body: {

                    "invoiceIdentifier": invId,
                    "saveCard": null,
                    "pan": "4111111111111111",
                    "expirationDate": "12/20",
                    "cvv": "301",
                    "holderName": "name"
                }
            }).then((response) => {
                expect(response).property('status').to.equal(201)
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                var tok = response.body.data.token;

                cy.request({
                    method: 'POST',
                    url: `https://app.stage.paydo.com/v1/checkout/create`,
                    body: {

                        "invoiceIdentifier": invId,
                        "paymentMethod": 1,
                        "payCurrency": "GBP",
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
                        "checkStatusUrl": "https://app.stage.paydo.com/en/payment/wait-page/{{txid}}"
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200)
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                })
            })
        })
    }
}

export default new CreateCheckoutPage();