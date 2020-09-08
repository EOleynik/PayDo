
import loginPage from "../elements/LoginPage";
import homePage from "../elements/HomePage";
import transactionsPage from "../elements/TransactionsPage";
import merchant from "../fixtures/merchant"
import checkout from "../fixtures/checkout";

describe('Refund suit', () => {

    beforeEach('', () => {
        loginPage.visit('/');
        loginPage.getAuthorization();
    })

    it.only('Full Refund', () => {
        loginPage.getButtonToAdmibPanel().click();
        cy.wait(2000);
        homePage.getCheckUrl();
        cy.wait(2000);
        homePage.getMenuTransactions().click();

        for (let key = 0; key < 10; key ++) {
        cy.request({
            method: 'GET',
            url: 'https://account.stage.paydo.com/v1/transactions/user-transactions',
            headers: {
                token: merchant.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);

           // for (let key in response.body.data) {
                let trIdent = response.body.data[key].identifier;

                 cy.request({
                    method: 'GET',
                    url: "https://account.stage.paydo.com/v1/transactions/"+trIdent,
                    headers: {
                        token: merchant.token,
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let  refunds = response.body.data.refunds;
                     cy.log(refunds)
                        if (typeof refunds === 'undefined' && refunds.length === 0) {
                            cy.log(refunds)
                            cy.log(trIdent);
                            cy.log(key);
                            cy.log("your value is not null")
                            } else {
                            cy.log("your value is null")
                            // transactionsPage.getButtonDetails(key).click();
                            // transactionsPage.getButtonRefund().click();
                            // transactionsPage.confirmRefund().click();
                            // transactionsPage.checkCreateRefund();
                            // transactionsPage.getButtonOk().click();
                        }

                     //transactionsPage.getTransactionWithoutRefund();
                             // transactionsPage.getButtonDetails(key).click();
                             // transactionsPage.getButtonRefund().click();
                             // transactionsPage.getInputPartialRefundAmount().type('10');
                            //transactionsPage.confirmRefund().click();
                            // transactionsPage.checkCreateRefund();
                            //  transactionsPage.getButtonOk().click()
                             //transactionsPage.checkCreateRefund();
                             //transactionsPage.getButtonOk().click()
                })

            })

    }


            })
         })














