import merchant from "../fixtures/merchant"
import feen from "../fixtures/feen"
import refund from "../fixtures/refund";
import createCheckoutPage from "./CreateCheckoutPage";
import transactionsPage from "./TransactionsPage";

class RefundPage{

    rejectRefund() {

        //Get ID last created refund
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/refunds/filters?query[userIdentifier]=" + merchant.bussiness_account + "&query[status]=1",
            headers: {
                token: feen.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let ref_ID = response.body.data[0].identifier;

            //Reject last refund
            cy.request({
                method: 'POST',
                url: "https://account.stage.paydo.com/v1/refunds/" + ref_ID + "/reject",
                headers: {
                    token: feen.token
                },
                body: {
                    "withcommission": false
                }
            }).then((response) => {
                expect(response).property('status').to.equal(201);
            })
        })
    }

    createFullRefundAPIAndCheckAmount(payAmount) {
        for (let i = 0; i < refund.currency.length; i++) {
            let payCurrency = refund.currency[i];
            cy.log(payCurrency);
            createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
            cy.wait(3000);
            transactionsPage.createFullRefundAndCheckAmount(payAmount, payCurrency);
            this.rejectRefund();
        }
    }

    createPartialRefundAPIAndCheckAmount(payAmount) {
        for (let i = 0; i < refund.currency.length; i++) {
            let payCurrency = refund.currency[i];
            cy.log(payCurrency);
            createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
            cy.wait(4000);
            transactionsPage.createPartialRefundAndCheckAmount(payAmount, payCurrency);
            this.rejectRefund();
        }
    }
}


export default new RefundPage();