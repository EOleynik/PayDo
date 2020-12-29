import merchant from "../fixtures/merchant";
import feen from "../fixtures/feen";

class WithdrawPage {

    rejectWithdraw() {
        // Get withdraw ID
        cy.request({
            method: 'GET',
            url: "https://admin.stage.paydo.com/v1/withdrawals/filters?query[userIdentifier]=" + merchant.bussiness_account + "&query[status]=1",
            headers: {
                token: feen.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let withdraw_id = response.body.data[0].identifier;

            // Reject withdraw
            cy.request({
                method: 'POST',
                url: "https://admin.stage.paydo.com/v1/withdrawals/" + withdraw_id + "/reject",
                headers: {
                    token: feen.token,
                },
                body: {
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('status').to.eq(1);
            })
        })
    };

}


export default new WithdrawPage();