
import parentPage from "../../pages/ParentPage";
import moneyTransferPage from "../../pages/MoneyTransferPage";
import merchantProd from "../../fixtures/merchantProd";
import merchant from "../../fixtures/merchant";
import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";

describe('Between Wallets suit ', () => {

    it('Create transfer, all data is valid', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchantProd.merchant_email, merchantProd.merchant_password, merchantProd.merchant_authenticator);
        //loginPage.loginWithCred(merchantProd.merchant_email, merchantProd.merchant_password);
        //loginPage.enter2FACode(merchantProd.merchant_authenticator);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuCreateTransfer();
        cy.wait(3000);

        moneyTransferPage.checkUrl('/money-transfers');
        moneyTransferPage.clickTab('Between Wallets');
        moneyTransferPage.chooseCurrencyWallet('USD');
        moneyTransferPage.enterTextInToInputRecipient(merchantProd.recipient_account);
        moneyTransferPage.enterTextInToInputAmount(merchantProd.amount_transfer);
        //moneyTransferPage.chooseCurrencyTransfer('USD');
        cy.wait(1000);
        moneyTransferPage.clickButtonProceed();
        moneyTransferPage.clickButtonConfirmTransfer();
        cy.wait(2000);
        moneyTransferPage.enter2FACode(merchantProd.merchant_authenticator);
        moneyTransferPage.checkStatusWithdraw('Withdraw created');
        moneyTransferPage.closeAlert();
        moneyTransferPage.clickButtonGoToMoneyTransferList();
        moneyTransferPage.checkUrl('/list-of-transfers/transfers-between-wallets');
        moneyTransferPage.checkTransferBetweenWallets('From wallet', ' You ', merchantProd.recipient_account, merchantProd.amount_transfer, 'USD');
    });

    it('Between Wallets math, wallets match', () => {
        // Get available balance "from wallet"
        cy.request({
            method: 'GET',
            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
            headers: {
                token: merchantProd.recipient_token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let av_bal_from_wallet = response.body.data['USD'].available.actual;

            // Get available balance "recipient wallet"
            cy.request({
                method: 'GET',
                url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                headers: {
                    token: merchantProd.merchant_token,
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
                        token: merchantProd.recipient_token,
                    },
                    body: {
                        "amount": merchantProd.amount_transfer,
                        "currency": 'USD',
                        "paymentMethodIdentifier": 204,
                        "type": 1
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // 2FA
                    cy.request({
                        method: 'POST',
                        url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                        headers: {
                            token: merchantProd.recipient_token,
                        },
                        body: {
                            "amount": merchantProd.amount_transfer,
                            "currency": 'USD',
                            "email": "",
                            "paymentMethodIdentifier": 204,
                            "recipient": merchantProd.merchant_account,
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
                                token: merchantProd.recipient_token,
                                "x-2fa-code":parentPage.get2FACode(merchantProd.recipient_authenticator)
                            },
                            body: {
                                "amount": merchantProd.amount_transfer,
                                "currency": 'USD',
                                "email": "",
                                "paymentMethodIdentifier": 204,
                                "recipient": merchantProd.merchant_account,
                                "startCurrency": 'USD',
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);

                            // Get commission for transfer between wallets
                            cy.request({
                                method: 'GET',
                                url: "https://admin.paydo.com/v1/instrument-settings/commissions/custom/204/" + merchantProd.recipient_account,
                                headers: {
                                    token: merchantProd.feen_token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let fixcom = response.body.data[8].value['USD'][0];
                                let perscom = response.body.data[8].value['USD'][1];
                                let strateg = response.body.data[8].strategy;

                                let pers = ((merchantProd.amount_transfer / 100) * perscom).toFixed(2);

                                if (strateg === 1) {
                                    // Amount of commissions
                                    let com = (+fixcom + +pers).toFixed(2);

                                    // Total amount with commission
                                    let sum = (Number(merchantProd.amount_transfer) + +com);

                                    // Get available balance "from wallet" after
                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchantProd.main_currency,
                                        headers: {
                                            token: merchantProd.recipient_token,
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let av_bal_from_wallet_after = (response.body.data['USD'].available.actual).toString();
                                            expect(parseFloat(av_bal_from_wallet_after).toFixed(2)).to.eq((+av_bal_from_wallet - sum).toFixed(2));

                                            cy.log(av_bal_from_wallet);
                                            cy.log(av_bal_from_wallet_after);
                                            cy.log(sum);

                                        let rec_amount = (+av_bal_to_wallet + +merchantProd.amount_transfer).toFixed(2);

                                        // Get available balance "recipient wallet" after
                                        cy.request({
                                            method: 'GET',
                                            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchantProd.main_currency,
                                            headers: {
                                                token: merchantProd.merchant_token,
                                            }
                                        }).then((response) => {
                                            expect(response).property('status').to.equal(200);
                                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                            let av_bal_to_wallet_after = (response.body.data['USD'].available.actual).toString();
                                                expect(parseFloat(av_bal_to_wallet_after).toFixed(2)).to.eq(rec_amount);

                                                cy.log(av_bal_to_wallet);
                                                cy.log(av_bal_to_wallet_after);
                                                cy.log(merchantProd.amount_transfer);
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