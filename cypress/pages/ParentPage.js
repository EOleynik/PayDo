import card from "../fixtures/Stage/card.json";
import feen from "../fixtures/Stage/feen.json";
import betweenWallets from "../fixtures/Stage/betweenWallets.json";
import * as lookup from "country-code-lookup";
import merchants from "../fixtures/Prod/merchants.json";
import rate_com from "../fixtures/Prod/rate_com.json";


class ParentPage {

    getLogin(email, password) {
        cy.get("[formcontrolname=email]").clear().type(email);
        cy.get("[formcontrolname=password]").clear().type(password);
        cy.contains('span', ' Login ').click();
    }

    get2FACode(key) {
        let notp = require('otplib');
        let secret = key;
        let code = notp.authenticator.generate(secret);
        return code
    }

    getRandomArbitrary = function getRandomArbitrary(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    };

    signatureGeneration(payAmount, payCurrency, description, secret_key) {
        var sha256 = require('js-sha256');
        var hash = sha256.create();
        hash.update(payAmount + ':' + payCurrency + ':' + description + ':' + secret_key);
        hash.hex();
        return hash.toString()
    }

    getTime() {
        let today = new Date();
        let time = today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds();
        return time;
    }

    getCodeCountry(country) {
        return lookup.byCountry(country).fips
    }

    setCommissionsAndStrategy(tr_type, strategy, fix_commiss, perc_commiss, pm_id, user_id) {
        cy.request({
            method: 'POST',
            url: `https://account.stage.paydo.com/v1/instrument-settings/commissions/custom`,
            headers: {
                token: feen.token,
            },
            body: {
                "transactionType": tr_type,
                "strategy": strategy,
                "source": 1,
                "value": {
                    "ALL": [
                        fix_commiss,
                        perc_commiss
                    ]
                },
                "currency": "",
                "paymentMethodIdentifier": pm_id,
                "userIdentifier": user_id
            }
        }).then((response) => {
            expect(response).property('status').to.equal(201)
        })
    }

    calculationFinancialCommission(fixcom, perscom, strateg, amount) {
        let pers = ((amount / 100) * perscom).toFixed(2);

        if (strateg === 1) {
            // Amount of commissions
            let finCom = (+fixcom + +pers).toFixed(2);

            // Total amount with commission
            let sum = (Number(betweenWallets.amount_transfer) + +finCom);

            return finCom;
        }
    }

    getDelta(page, n1, n2) {
        return Math.abs(n1 - n2) <= page.precision;
    };

    checkUrl(Url) {
        return cy.url().should('include', Url);
    }

    closeAlert() {
        return cy.get('.close-alert').click({force: true})
    }

    clickButton(name) {
        return cy.contains('span', name).click({force: true});
    }

    getMenu(name) {
        return cy.contains(name);
    }

    clickTab(name) {
        return cy.contains(name);
    }

    getInput(name) {
        return cy.get("[formcontrolname=" + name + "]");
    }

    attachFile(name) {
        cy.get('input[class="ngx-file-drop__file-input"]').each((fileInput) => {
            cy.wrap(fileInput).attachFile(name);
        });
    }

    enterCardData() {
        cy.get("[formcontrolname=pan]").type(card.card_number);
        cy.get("[formcontrolname=expirationDate]").type(card.expiration_date);
        cy.get("[formcontrolname=cvv]").type(card.CVC);
        cy.get("[formcontrolname=holderName]").type(card.cardholder);
    }

    getTokenUser(user, email, password, authenticator) {
        cy.request('POST', 'https://account.paydo.com/v1/users/login', {
            email: email,
            password: password,
        }).then((response) => {
            expect(response).property('status').to.equal(206);

            cy.request({
                method: 'POST',
                url: 'https://account.paydo.com/v1/users/login',
                headers: {
                    "x-2fa-code": this.get2FACode(authenticator)
                },
                body: {
                    email: email,
                    password: password,
                }
            }).its('headers')
                .then((res) => {
                    let headers = res
                    cy.writeFile("cypress/fixtures/Prod/" + user + "_headers.json", res)
                })
        })
    }

    getAvailableBalance(user, wallet) {
        cy.readFile("cypress/fixtures/Prod/" + user + "_headers.json").then((data) => {
            let tok = data.token
            cy.request({
                method: 'GET',
                url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                headers: {
                    token: tok
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);

                cy.writeFile("cypress/fixtures/Prod/available " + wallet + " "  + user + ".json", {'available': response.body.data[wallet].available.actual})
            })
        })
    }

    getCommission(amount, currency, tr_type, mid, admin_token, payment_method) {
        cy.request({
            method: 'GET',
            url: "https://admin.paydo.com/v1/instrument-settings/commissions/for-mid/" + tr_type + "/" + mid + "/" + payment_method,
            headers: {
                token: admin_token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);

            let hasCurrency =!!response.body.data.value?.[currency]

            if(hasCurrency) {
                cy.writeFile("cypress/fixtures/Prod/com" + tr_type + "_type.json", {
                    'currency': currency,
                    'fixcom': response.body.data.value[currency][0],
                    'perscom': ((amount / 100) * response.body.data.value[currency][1]),
                    'strategy': response.body.data.strategy
                })
            } else {

                this.getRate('EUR', currency, admin_token)
                let fix = (response.body.data.value.EUR[0] * rate_com.rates).toFixed(2)
                let pers = ((amount / 100) * response.body.data.value.EUR[1] * rate_com.rates).toFixed(2)
                cy.writeFile("cypress/fixtures/Prod/com" + tr_type + "_type.json", {
                    'currency': currency,
                    'fixcom': fix,
                    'perscom': pers,
                    'strategy': response.body.data.strategy
                })
            }
        })
    }

    getBaseCommission(amount, currency, tr_type, mid, admin_token) {
        cy.request({
            method: 'GET',
            url: "https://admin.paydo.com/v1/instrument-settings/commissions/for-mid/" + tr_type + "/" + mid,
            headers: {
                token: admin_token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);

            let hasCurrency =!!response.body.data.value?.[currency]

            if(hasCurrency) {
                cy.writeFile("cypress/fixtures/Prod/com" + tr_type + "_type.json", {
                    'currency': currency,
                    'fixcom': response.body.data.value[currency][0],
                    'perscom': ((amount / 100) * response.body.data.value[currency][1]).toFixed(2),
                    'strategy': response.body.data.strategy
                })
            } else {

                this.getRate("com", 'EUR', currency, admin_token)
                let fix = (response.body.data.value.EUR[0] * rate_com.rates).toFixed(2)
                let pers = ((amount / 100) * response.body.data.value.EUR[1]).toFixed(2)
                cy.writeFile("cypress/fixtures/Prod/com" + tr_type + "_type.json", {
                    'currency': currency,
                    'fixcom': fix,
                    'perscom': pers,
                    'strategy': response.body.data.strategy
                })
            }
        })
    }

    getRate(type, from, to, admin_token) {

        cy.request({
            method: 'GET',
            url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + from,
            headers: {
                token: admin_token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);

            cy.writeFile("cypress/fixtures/Prod/rate_" + type + ".json", {
                'rates': response.body.data.rates[to]
            })
        })
    }

    receiveCommission(fixcom, perscom, strategy) {
        if (strategy === 1) {
            return +(+fixcom + +perscom).toFixed(2);
        }
    }
}


export default new ParentPage();