import merchant from "../fixtures/Stage/merchant.json";

class WithdrawPage {

    rejectWithdraw(admin) {

            // Get withdraw ID
            cy.request({
                method: 'GET',
                url: "https://admin.stage.paydo.com/v1/withdrawals/filters?query[userIdentifier]=" +
                    merchant.business_account + "&query[status]=1",
                headers: {
                    token: admin,
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
                        token: admin,
                    },
                    body: {}
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('status').to.eq(1);
                })
            })
        }

}


export default new WithdrawPage();