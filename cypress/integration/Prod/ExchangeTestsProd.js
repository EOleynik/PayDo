
import exchangePage from "../../pages/ExchangePage";
import merchantProd from "../../fixtures/merchantProd";
import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";

describe('Exchange suit UI', () => {

    it('Exchange, enough funds on the wallet', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        loginPage.checkUrl('/auth/login');
        loginPage.loginWithCred(merchantProd.merchant_email, merchantProd.merchant_password);
        loginPage.enter2FACode(merchantProd.merchant_authenticator);
       // loginPage.clickButton('To Admin Panel')
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange('Exchange');
        cy.wait(2000);

        exchangePage.selectWalletExchangeFrom(merchantProd.exchange_from_wallet);
        exchangePage.selectWalletExchangeTo(merchantProd.exchange_to_wallet);
        exchangePage.enterAmountForExchange(merchantProd.amount_exchange);
        exchangePage.clickButtonConvertCurrency();
        exchangePage.checkStatusExchange('Exchange successful');
        exchangePage.closeAlert();
    });

    it('Exchange, not enough funds on the wallet', () => {

        cy.visit('https://account.paydo.com/en/auth/login');
        loginPage.checkUrl('/auth/login');
        loginPage.loginWithCred(merchantProd.merchant_email, merchantProd.merchant_password);
        loginPage.enter2FACode(merchantProd.merchant_authenticator);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange('Exchange');
        cy.wait(2000);

        exchangePage.selectWalletExchangeFrom(merchantProd.exchange_from_wallet);
        exchangePage.selectWalletExchangeTo(merchantProd.exchange_to_wallet);
        exchangePage.enterAmountForExchange(1000000);
        exchangePage.clickButtonConvertCurrency();
        exchangePage.checkStatusExchange('Not enough money to perform this operation');
        exchangePage.closeAlert();
    });

    it('Exchange math', () => {
    // Get available balance "from wallet"
    cy.request({
        method: 'GET',
        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchantProd.main_currency,
        headers: {
            token: merchantProd.merchant_token,
        }
    }).then((response) => {
        expect(response).property('status').to.equal(200);
        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
        let av_bal_from_wallet = response.body.data['USD'].available.actual;

        // Get available balance "to wallet"
        cy.request({
            method: 'GET',
            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchantProd.main_currency,
            headers: {
                token: merchantProd.merchant_token,
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
                    token: merchantProd.feen_prod_token,
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
                        token: merchantProd.merchant_token,
                    },
                    body: {
                        "amount": merchantProd.amount_exchange,
                        "currency": "USD",
                        "destinationCurrency": "RUB"
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // Get available balance "from wallet" after
                    cy.request({
                        method: 'GET',
                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchantProd.main_currency,
                        headers: {
                            token: merchantProd.merchant_token,
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let av_bal_from_wallet_after = response.body.data['USD'].available.actual;

                        try {

                            expect(av_bal_from_wallet_after).to.eq(av_bal_from_wallet - merchantProd.amount_exchange);

                        }catch (e) {
                            cy.log(av_bal_from_wallet);
                            cy.log(av_bal_from_wallet_after);
                        }

                        // Amount after exchange
                        let amount = (merchantProd.amount_exchange * rate).toFixed(2);

                        // Percentage for exchange
                        let pers =((amount / 100) * 3.5).toFixed(2);

                        // Subtract the percentage for the conversion
                        let ex_amount = (amount - pers);

                        // Get available balance "to wallet" after
                        cy.request({
                            method: 'GET',
                            url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchantProd.main_currency,
                            headers: {
                                token: merchantProd.merchant_token,
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let av_bal_to_wallet_after = response.body.data['RUB'].available.actual;

                            try {

                                expect(av_bal_to_wallet_after).to.eq(av_bal_to_wallet + ex_amount);

                            }catch (e) {
                                cy.log(av_bal_to_wallet);
                                cy.log(av_bal_to_wallet_after);
                            }
                        })
                    })
                })
            })
        })
    })
})



})
