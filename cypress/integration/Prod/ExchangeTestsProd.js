
import exchangePage from "../../pages/ExchangePage";
import merchants from "../../fixtures/Prod/merchants.json";
import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";
import parentPage from "../../pages/ParentPage";
import feen from "../../fixtures/Prod/feen.json";
import moneyTransferPage from "../../pages/MoneyTransferPage";

let recipient;
let user;
let admin;

before(function fetchToken() {

    // Get token for recipient
    cy.request('POST', 'https://account.paydo.com/v1/users/login', {
        email: merchants.email_4,
        password: merchants.password_4,
    }).then((response) => {
        expect(response).property('status').to.equal(206);

        cy.request({
            method:'POST',
            url:'https://account.paydo.com/v1/users/login',
            headers: {
                "x-2fa-code": parentPage.get2FACode(merchants.authenticator_4)
            },
            body:{
                email: merchants.email_4,
                password: merchants.password_4
            }
        }).its('headers')
            .then((res) => {
                recipient = res
            })
    })

    // Get token for merchant
    cy.request('POST', 'https://account.paydo.com/v1/users/login', {
        email: merchants.email_2,
        password: merchants.password_2,
    }).then((response) => {
        expect(response).property('status').to.equal(206);

        cy.request({
            method:'POST',
            url:'https://account.paydo.com/v1/users/login',
            headers: {
                "x-2fa-code": parentPage.get2FACode(merchants.authenticator_2)
            },
            body:{
                email: merchants.email_2,
                password: merchants.password_2,
            }
        }).its('headers')
            .then((res) => {
                user = res
            })
    })

    // Get token for admin
    cy.request('POST', 'https://admin.paydo.com/v1/users/login', {
        email: feen.email,
        password: feen.password,
    }).then((response) => {
        expect(response).property('status').to.equal(206);

        cy.request({
            method:'POST',
            url:'https://admin.paydo.com/v1/users/login',
            headers: {
                "x-2fa-code": parentPage.get2FACode(feen.authenticator)
            },
            body:{
                email: feen.email,
                password: feen.password,
            }
        }).its('headers')
            .then((res) => {
                admin = res
            })
    })

})

describe('Exchange suit UI', () => {

    it('Exchange, enough funds on the wallet', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange('Exchange');
        cy.wait(2000);

        exchangePage.selectWalletExchangeFrom(merchants.exchange_from_wallet);
        exchangePage.selectWalletExchangeTo(merchants.exchange_to_wallet);
        exchangePage.enterAmountForExchange(merchants.amount_exchange);
        exchangePage.clickButtonConvertCurrency();

        moneyTransferPage.ConfirmationTransfer('Yes, I sure ');
        cy.wait(3000);

        exchangePage.checkStatusExchange('Exchange successful');
        exchangePage.closeAlert();
    });

    it('Exchange, not enough funds on the wallet', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange('Exchange');
        cy.wait(2000);

        exchangePage.selectWalletExchangeFrom(merchants.exchange_from_wallet);
        exchangePage.selectWalletExchangeTo(merchants.exchange_to_wallet);
        exchangePage.enterAmountForExchange(1000000);
        exchangePage.clickButtonConvertCurrency();

        moneyTransferPage.ConfirmationTransfer('Yes, I sure ');
        cy.wait(3000);

        exchangePage.checkStatusExchange('Not enough money to perform this operation');
        exchangePage.closeAlert();
    });

    it('Exchange math', () => {

        // Get available balance "from wallet"
        cy.request({
        method: 'GET',
        url: "https://account.paydo.com/v1/wallets/get-all-balances/USD",
        headers: {
            token: user.token
        }
         }).then((response) => {
        expect(response).property('status').to.equal(200);
        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
        let av_bal_from_wallet = response.body.data['USD'].available.actual;

        // Get available balance "to wallet"
        cy.request({
            method: 'GET',
            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
            headers: {
                token: user.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let av_bal_to_wallet = response.body.data['RUB'].available.actual;

            // Get rate
            cy.request({
                method: 'GET',
                url: "https://admin.paydo.com/v1/currencies/get-rates-for/USD",
                headers: {
                    token: admin.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let rate = response.body.data.rates['RUB'];

                // Create exchange
                cy.request({
                    method: 'POST',
                    url: 'https://account.paydo.com/v1/wallets/exchange',
                    headers: {
                        token: user.token,
                    },
                    body: {
                        "amount": merchants.amount_exchange,
                        "currency": "USD",
                        "destinationCurrency": "RUB"
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // Get available balance "from wallet" after exchange
                    cy.request({
                        method: 'GET',
                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                        headers: {
                            token: user.token,
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let av_bal_from_wallet_after = response.body.data['USD'].available.actual.toString();

                            expect(parseFloat(av_bal_from_wallet_after).toFixed(2))
                                .to.eq((av_bal_from_wallet - merchants.amount_exchange).toFixed(2));

                            cy.log(av_bal_from_wallet);
                            cy.log(av_bal_from_wallet_after);

                            // Amount after exchange
                        let amount = (merchants.amount_exchange * rate).toFixed(2);

                        // Percentage for exchange
                        let pers =((amount / 100) * 3.5).toFixed(2);

                        // Subtract the percentage for the conversion
                        let ex_amount = (amount - pers);

                        // Get available balance "to wallet" after
                        cy.request({
                            method: 'GET',
                            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                            headers: {
                                token: user.token,
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let av_bal_to_wallet_after = response.body.data['RUB'].available.actual.toString();

                                expect(parseFloat(av_bal_to_wallet_after).toFixed(2))
                                    .to.eq((+av_bal_to_wallet + ex_amount).toFixed(2));

                                cy.log('av_bal_to_wallet' + ' ' + av_bal_to_wallet);
                                cy.log(av_bal_to_wallet_after);
                            //}
                        })
                    })
                })
            })
        })
    })
})



})
