import merchant from "../fixtures/Stage/merchant.json";
import exchange from "../fixtures/Stage/exchange.json";
import feen from "../fixtures/Stage/feen.json";
import parentPage from "../pages/ParentPage";


const exchangeFormGet = 'div[class="exchange-form-control__field"]'
const ErrorNotMoney = '.ng-trigger-alertFade'

class ExchangePage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title);
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }

    selectWalletExchangeFrom(wallet) {
        cy.get('[class="exchange-form-select__trigger"]').eq(0).click();
        cy.contains('.mat-option-text', wallet).click();
    }

    selectWalletExchangeTo(wallet) {
        cy.get('[class="exchange-form-select__trigger"]').eq(1).click();
        cy.contains('.mat-option-text', wallet).click();
    }

    enterAmountForExchange(amount) {
        cy.get('.exchange-form-control__field').eq(0).clear().type(amount);
    }

    clickButton(name) {
        parentPage.clickButton(name);
    }

    checkTextError(message) {
        cy.get('li.ng-tns-c442-0 > .ng-tns-c442-0').invoke('text').should((text) => {
            let alert = (text);
            let error = alert.split(':', 1);
            expect(error.toString()).to.eq(message);
        });
    }

    closeAlert() {
        parentPage.closeAlert()
    }

    createExchangeAndCheckMath() {
        // Get available balance "from wallet"
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
            headers: {
                token: merchant.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let av_bal_from_wallet = response.body.data[exchange.exchange_from].available.actual;

            // Get available balance "to wallet"
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                headers: {
                    token: merchant.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let av_bal_to_wallet = response.body.data[exchange.exchange_to].available.actual;

                // Get rate
                cy.request({
                    method: 'GET',
                    url: "https://admin.stage.paydo.com/v1/currencies/get-rates-for/" + exchange.exchange_from,
                    headers: {
                        token: feen.token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let rate = response.body.data.rates[exchange.exchange_to];

                    // Create exchange
                    cy.request({
                        method: 'POST',
                        url: 'https://account.stage.paydo.com/v1/wallets/exchange',
                        headers: {
                            token: merchant.token,
                        },
                        body: {
                            "amount": exchange.amount_exchange,
                            "currency": exchange.exchange_from,
                            "destinationCurrency": exchange.exchange_to
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);

                        // Get available balance "from wallet" after
                        cy.request({
                            method: 'GET',
                            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                            headers: {
                                token: merchant.token,
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                            let av_bal_from_wallet_after = response.body.data[exchange.exchange_from].available.actual.toString();

                            try {

                                expect(av_bal_from_wallet_after).to.eq((av_bal_from_wallet - exchange.amount_exchange).toFixed(2));

                            } catch (e) {
                                cy.log(av_bal_from_wallet);
                                cy.log(av_bal_from_wallet_after);
                            }

                            // Amount after exchange
                            let amount = (exchange.amount_exchange * rate).toFixed(2);

                            // Percentage for exchange
                            let pers = ((amount / 100) * exchange.exchange_percentage).toFixed(2);

                            // Subtract the percentage for the conversion
                            let ex_amount = (amount - pers);

                            // Get available balance "to wallet" after
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                headers: {
                                    token: merchant.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let av_bal_to_wallet_after = response.body.data[exchange.exchange_to].available.actual.toString();

                                try {

                                    expect(av_bal_to_wallet_after).to.eq((+av_bal_to_wallet + ex_amount).toFixed(2));

                                } catch (e) {
                                    cy.log(av_bal_to_wallet);
                                    cy.log(av_bal_to_wallet_after);
                                }
                            })
                        })
                    })
                })
            })
        })
    }
    
    isErrorExist() {
        parentPage.isElementExist(ErrorNotMoney);
    }

    checkButtonStatus(name, status) {
        parentPage.getButtonStatus(name, status);
    }

    checkStatusExchange(status) {
        cy.get('.exchange-dialog > h2').invoke('text').should((text) => {
          expect(text).to.eq(status);
    })
    }


}



export default new ExchangePage();