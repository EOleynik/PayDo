
import parentPage from "../../pages/ParentPage";
import moneyTransferPage from "../../pages/MoneyTransferPage";
import merchants from "../../fixtures/Prod/merchants.json";
import feen from "../../fixtures/Prod/feen.json";
import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";

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

describe('Between Wallets suit ', () => {

    it('Create transfer by recipient ID, all data is valid', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet('USD');
        moneyTransferPage.enterTextInToInputRecipient(merchants.account_4);
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.enter2FACode(merchants.authenticator_2);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create transfer by recipient Email, all data is valid', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet('USD');
        moneyTransferPage.enterTextInToInputRecipient(merchants.email_4);
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.enter2FACode(merchants.authenticator_2);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Create transfer by reference number, all data is valid', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_2, merchants.password_2, merchants.authenticator_2);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet('USD');
        moneyTransferPage.enterTextInToInputRecipient("ECOM" + 0 + merchants.account_4 + "F");
        moneyTransferPage.enterTextInToInputAmount(merchants.amount_transfer);
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        moneyTransferPage.clickButtonConfirmTransfer();
        moneyTransferPage.ConfirmationTransfer('Yes, I sure ')
        cy.wait(2000);
        moneyTransferPage.enter2FACode(merchants.authenticator_2);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
    });

    it('Between Wallets math, wallets match', () => {

        // Get available balance "sender wallet"
        cy.request({
            method: 'GET',
            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
            headers: {
                token: recipient.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let av_bal_from_wallet = response.body.data['USD'].available.actual;

            // Get available balance "recipient wallet"
            cy.request({
                method: 'GET',
                url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                headers: {
                    token: user.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let av_bal_to_wallet = response.body.data['USD'].available.actual;

                // Create transfer between wallets
                cy.request({
                    method: 'POST',
                    url: 'https://account.paydo.com/v1/wallets/calculate-money/on-transfer-between-wallets',
                    headers: {
                        token: user.token,
                    },
                    body: {
                        "amount": merchants.amount_transfer,
                        "currency": 'USD',
                        "paymentMethodIdentifier": 204,
                        "type": 1
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // 2FA authentication
                    cy.request({
                        method: 'POST',
                        url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                        headers: {
                            token: user.token,
                        },
                        body: {
                            "amount": merchants.amount_transfer,
                            "currency": 'USD',
                            "email": "",
                            "paymentMethodIdentifier": 204,
                            "recipient": merchants.account_4,
                            "startCurrency": 'USD',
                            "type": 1,
                            "userIdentifierTo": "",
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(206);

                        cy.request({
                            method: 'POST',
                            url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                            headers: {
                                token: recipient.token,
                                "x-2fa-code": parentPage.get2FACode(merchants.authenticator_4)
                            },
                            body: {
                                "amount": merchants.amount_transfer,
                                "currency": 'USD',
                                "email": "",
                                "paymentMethodIdentifier": 204,
                                "recipient": merchants.account_2,
                                "startCurrency": 'USD',
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);

                            // Get commission for transfer between wallets
                            cy.request({
                                method: 'GET',
                                url: "https://admin.paydo.com/v1/instrument-settings/commissions/for-mid/13/511/204",
                                headers: {
                                    token: admin.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);

                                let fixcom = response.body.data.value.USD[0];
                                let perscom = response.body.data.value.USD[1];
                                let strateg = response.body.data.strategy;

                                let pers = ((merchants.amount_transfer / 100) * perscom).toFixed(2);

                                if (strateg === 1) {
                                    // Amount of commissions
                                    let com = (+fixcom + +pers).toFixed(2);

                                    // Total amount with commission
                                    let sum = (Number(merchants.amount_transfer) + +com);

                                    // Get available balance "sender wallet" after transfer
                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                                        headers: {
                                            token: recipient.token,
                                        }
                                    }).then((response) => {
                                        console.log("AFTER");
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let av_bal_from_wallet_after = (response.body.data['USD'].available.actual).toString();
                                        expect(parseFloat(av_bal_from_wallet_after).toFixed(2)).to.eq((+av_bal_from_wallet - sum).toFixed(2));

                                        cy.log('av_bal_from_wallet' + ' ' + av_bal_from_wallet);
                                        cy.log('av_bal_from_wallet_after' + ' ' + av_bal_from_wallet_after);
                                        cy.log('sum' + ' ' + sum);

                                        let rec_amount = (+av_bal_to_wallet + +merchants.amount_transfer).toFixed(2);

                                        // Get available balance "recipient wallet" after transfer
                                        cy.request({
                                            method: 'GET',
                                            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                                            headers: {
                                                token: user.token,
                                            }
                                        }).then((response) => {
                                            expect(response).property('status').to.equal(200);
                                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                            let av_bal_to_wallet_after = (response.body.data['USD'].available.actual).toString();
                                            expect(parseFloat(av_bal_to_wallet_after).toFixed(2)).to.eq(rec_amount);

                                            cy.log('av_bal_to_wallet' + ' ' + av_bal_to_wallet);
                                            cy.log('av_bal_to_wallet_after' + ' ' + av_bal_to_wallet_after);
                                            cy.log('merchant.amount_transfer' + ' ' + merchants.amount_transfer);
                                        })
                                    })
                                }
                            })
                        })
                    })
                })
            })
        })
    });


})