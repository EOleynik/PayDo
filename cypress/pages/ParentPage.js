import card from "../fixtures/Stage/card.json";
import feen from "../fixtures/Stage/feen.json";
import betweenWallets from "../fixtures/Prod/betweenWallets.json";
//import * as lookup from "country-code-lookup";
import merchants from "../fixtures/Prod/merchants.json";


class ParentPage {

    getSelectedAccountType() {
        cy.readFile("cypress/fixtures/Prod/Helpers/randomAccountType.json").then((data) => {
            return data.accountType
        })
    }

    getLoginWithAuth(email, password, authenticator) {
        cy.get("[formcontrolname=email]").clear().type(email);
        cy.get("[formcontrolname=password]").clear().type(password);
        cy.contains('span', ' Login ').click();
        cy.wait(1000);
        cy.get('[class="d-block"]').type(this.get2FACode(authenticator));
        cy.contains('span', ' Login ').click();
    }

    getLogin(email, password) {
        cy.get("[formcontrolname=email]").clear().type(email);
        cy.get("[formcontrolname=password]").clear().type(password);
        cy.contains('span', ' Login ').click();
        cy.wait(1000);
            }

    get2FACode(key) {
        let notp = require('otplib');
        return notp.authenticator.generate(key)
    }

    getIndex_max(arr) {
        let i, maxV, maxP;
        for (i = 0; i < arr.length; i++) {
            if (typeof maxV === "undefined" || arr[i] > maxV) {
                maxV = arr[i];
                maxP = i;
            }
        }
        return maxP;
    }

    getRandomArbitrary = function getRandomArbitrary(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    };

    getRandomIntInclusive = function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }

    getRandomInt = function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }

    signatureGeneration(payAmount, payCurrency, description, secret_key) {
        let sha256 = require('js-sha256');
        let hash = sha256.create();
        hash.update(payAmount + ':' + payCurrency + ':' + description + ':' + secret_key);
        hash.hex();
        return hash.toString()
    }

    getTime(delimiter) {
        let t = new Date();
        //return t.getHours( {hours:"2-digit"}) + delimiter + t.getMinutes().toString().padStart(2, '0');
        return t.getHours( {hours:"2-digit"} ) + delimiter + t.getMinutes( {minute:"2-digit"} );
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

    getButton(name) {
        return cy.contains('span', name);
    }

    clickButton(name) {
        this.getButton(name).click({force: true});
    }

    getButtonStatus(name, status) {
        if (status === 'disabled') {
            cy.contains(name).should('be.disabled')
        } else {
            cy.contains(name).should('not.be.disabled')
        }
    }

    isButtonExist(name) {
        cy.contains(name).should('exist')
    }

    isElementExist(locator, index) {
        index ?
            cy.get(locator).eq(index).should('exist')
            :
            cy.get(locator).should('exist')
    }

    isElementNotExist(locator) {
        cy.get(locator).should('not.exist')
    }


    isTextExist() {
        cy.get('.alert-text').should('exist');
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

    getTokenUser(user, email, password, authenticator, account_type) {
        cy.request('POST', 'https://account.paydo.com/v1/users/login', {
            email: email,
            password: password,
            type: account_type
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
                    type: account_type
                }
            }).its('headers')
                .then((res) => {
                    let headers = res
                    if (account_type === 1) {
                        cy.writeFile("cypress/fixtures/Prod/Helpers/" + user + "_personal_headers.json", res)
                    } else {
                        cy.writeFile("cypress/fixtures/Prod/Helpers/" + user + "_business_headers.json", res)
                    }
                })
        })
    }

    getTokenAdmin(user, email, password, authenticator, account_type) {
        this.getTokenUser(user, email, password, authenticator, account_type)
        cy.readFile("cypress/fixtures/Prod/Helpers/admin_business_headers.json").then((data) => {
            let admin_token = data.token
            return admin_token
        })
    }

    getAvailableBalance(user, account_type, wallet) {

        cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
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

                cy.writeFile("cypress/fixtures/Prod/Helpers/available " + account_type + " " + wallet + " " + user + ".json",
                    {'available': response.body.data[wallet].available.actual})
            })
        })
    }

    getCommissionForTransfer(amount, currency, tr_type, mid, payment_method, token) {

        // cy.readFile("cypress/fixtures/Prod/Helpers/admin_business_headers.json").then((data) => {
        //     let tok = data.token

        cy.request({
            method: 'GET',
            url: "https://admin.paydo.com/v1/instrument-settings/commissions/for-mid/" + tr_type + "/" + mid + "/" + payment_method,
            headers: {
                token: token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);

            let hasCurrency = !!response.body.data.value?.[currency]

            if (hasCurrency) {
                cy.writeFile("cypress/fixtures/Prod/Helpers/commission_for_" + tr_type + "_type_" + currency + ".json", {
                    'currency': currency,
                    'fixcom': response.body.data.value[currency][0],
                    'perscom': ((amount / 100) * response.body.data.value[currency][1]),
                    'strategy': response.body.data.strategy
                })
            } else {

                this.getRate('for_commission', 'EUR', currency)

                cy.readFile("cypress/fixtures/Prod/Helpers/rate_for_commission_" + currency + ".json").then((data) => {
                    let rate = data.rates

                    let fix = (response.body.data.value.EUR[0] * rate).toFixed(2)
                    let pers = ((amount / 100) * response.body.data.value.EUR[1]).toFixed(2)

                    cy.writeFile("cypress/fixtures/Prod/Helpers/commission_for_" + tr_type + "_type_" + currency + ".json", {
                        'currency': currency,
                        'fixcom': fix,
                        'perscom': pers,
                        'strategy': response.body.data.strategy
                    })
                })
            }
        })
        //})
    }

    getBaseCommission(amount, currency, tr_type, mid) {

        cy.readFile("cypress/fixtures/Prod/Helpers/admin_business_headers.json").then((data) => {
            let tok = data.token

            cy.request({
                method: 'GET',
                url: "https://admin.paydo.com/v1/instrument-settings/commissions/for-mid/" + tr_type + "/" + mid,
                headers: {
                    token: tok,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);

                let hasCurrency = !!response.body.data.value?.[currency]

                if (hasCurrency) {
                    cy.writeFile("cypress/fixtures/Prod/Helpers/commission_for_" + tr_type + "_type.json", {
                        'currency': currency,
                        'fixcom': response.body.data.value[currency][0],
                        'perscom': ((amount / 100) * response.body.data.value[currency][1]).toFixed(2),
                        'strategy': response.body.data.strategy
                    })
                } else {

                    this.getRate("for_com", 'EUR', currency)

                    cy.readFile("cypress/fixtures/Prod/Helpers/rate_for_com_" + currency + ".json").then((data) => {
                        let rate = data.rates
                        let fix = (response.body.data.value.EUR[0] * rate).toFixed(2)
                        let pers = ((amount / 100) * response.body.data.value.EUR[1]).toFixed(2)
                        cy.writeFile("cypress/fixtures/Prod/Helpers/commission_for_" + tr_type + "_type.json", {
                            'currency': currency,
                            'fixcom': fix,
                            'perscom': pers,
                            'strategy': response.body.data.strategy
                        })
                    })
                }
            })
        })
    }

    getAllAvailableBalances(user, account_type, wallets) {

        cy.readFile("cypress/fixtures/Prod/Helpers/" + user + "_" + account_type + "_headers.json").then((data) => {
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

                cy.writeFile("cypress/fixtures/Prod/Helpers/all available " + account_type + " balances " + user + ".json", [
                    response.body.data[wallets[0]].available.actual,
                    response.body.data[wallets[1]].available.actual,
                    response.body.data[wallets[2]].available.actual,
                    response.body.data[wallets[3]].available.actual])

            })
        })
    }

    getRate(type, from, to) {

        cy.readFile("cypress/fixtures/Prod/Helpers/admin_business_headers.json").then((data) => {
            let tok = data.token

            cy.request({
                method: 'GET',
                url: "https://admin.paydo.com/v1/currencies/get-rates-for/" + from,
                headers: {
                    token: tok,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);

                cy.writeFile("cypress/fixtures/Prod/Helpers/rate_" + type + "_" + to + ".json", {
                    'rates': response.body.data.rates[to]
                })
            })
        })
    }

    receiveCommission(fixcom, perscom, strategy) {
        if (strategy === 1) {
            return +(+fixcom + +perscom).toFixed(2);
        }
    }

    chooseAccountType(type) {
        if (type === 'Personal') {
            cy.get('[class="mat-radio-container"]').eq(1).click()
        } else {
            cy.get('[class="mat-radio-container"]').eq(0).click()
        }
    }

    send2FA(email, password) {
        cy.request('POST', 'https://account.paydo.com/v1/users/login', {
            email: email,
            password: password
        }).then((response) => {
            expect(response).property('status').to.equal(206);
        })
    }

    resetPassword(email) {
        cy.request('POST', 'https://account.paydo.com/v1/users/request-reset-password', {
            email: email,

        }).then((response) => {
            expect(response).property('status').to.equal(200);
        })
    }

    created(i) {
        cy.request('POST', 'https://account.paydo.com/v1/users/create', {
            "affiliateIdentifierOf": null,
            "email": "eugeniy.o+testEmail_6" + i + "@payop.com",
            "language": "en",
            "password": "1q2w3e$R%T^Y",
            projectId: 1,
            type: "[Auth] Register User",
            "userTypeRegistration": 2
        }).then((response) => {
            expect(response).property('status').to.equal(201);
        })
    }

    getMaxAvailableBalanceAfterRecalculation(user, account_type, position, balances) {

        cy.writeFile("cypress/fixtures/Prod/Helpers/max available " + account_type + " " + user + ".json",
            {'available': balances[position], 'wallet': betweenWallets.wallets[position]})
    }

    getRandomWallet(min, max) {
        let i = this.getRandomIntInclusive(min, max)
        return betweenWallets.wallets[i]
    }

    getRandomAmountTransfer(min, max) {
        return this.getRandomArbitrary(min, max)
    }

    getRandomAccountType() {
        if (this.getRandomIntInclusive(1, 2) === 1) {
           let account_type = 'Personal'
            cy.log(account_type)
            return account_type
        } else {
          let  account_type = 'Business'
            cy.log(account_type)
            return account_type
        }
    }

    getRandomAccountType2(min, max) {
        if (this.getRandomIntInclusive(min, max) === 1) {
            return 'personal'
        } else {
            return 'corporate'
        }
    }

    getSumElemArray(arrRecBal) {
        return arrRecBal.reduce(function (sum, elem) {
            return sum + elem;
        }, 0);

    }

    isPageTitleExist(element) {
        element ?
            this.getPageTitle(element).eq(0).should('exist')
            :
            this.getPageTitle('.page-title').eq(0).should('exist')
            }

    checkText(checkText, element, index) {
        index ?
            cy.get(element).eq(index).invoke('text').should((text) => {
                expect(text).to.equal(checkText)
            })
            :
            cy.get(element).eq(0).invoke('text').should((text) => {
                expect(text).to.equal(checkText)
            })
    }

    getAccountType(type) {
       return cy.contains('span', type)
    }

    getPageTitle(element) {
        return cy.get(element)
    }

    getElement(type) {
        return cy.contains('span', type)
    }

    getLocalDate(locales) {
        const d = new Date;
        return d.toLocaleDateString("en-US", {month:"short", day:"2-digit"});
    }

    getUTCTime() {
        const t = new Date;
        return t.getUTCHours();
    }

    isElementHaveLink(element, link) {
        cy.get(element).should('have.attr', 'href',link);
    }


}


export default new ParentPage();