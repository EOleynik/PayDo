import merchant from "../fixtures/merchant.json"
import manajer from "../fixtures/manajer.json"

class ManagerPage {


    acceptPersonalVerification() {
        //получение идентификатора для персональной верификации
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/users/verification/all?query[userIdentifier]=" + merchant.personal_account,
            headers: {
                token: manajer.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let persVerifID = response.body.data[0].identifier;

            //персональная верификация по идентификатору
            cy.request({
                method: 'POST',
                url: `https://account.stage.paydo.com/v1/users/verification/verify`,
                headers: {
                    token: manajer.token,
                },
                body: {
                    "identifier": persVerifID
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }


    acceptPersonalIBAN() {
        //получение идентификатора для персонального IBAN
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/ibans/requests/filter?query[userIdentifier]=" + merchant.personal_account,
            headers: {
                token: manajer.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let persIBAN = response.body.data[0].identifier;

            //верификация персонального IBAN по идентификатору
            cy.request({
                method: 'POST',
                url: "https://account.stage.paydo.com/v1/ibans/requests/" + persIBAN + "/accept",
                headers: {
                    token: manajer.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }


    acceptBusinessVerification() {
        //получение идентификатора для бизнес верификации
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/users/verification/all?query[userIdentifier]=" + merchant.bussiness_account,
            headers: {
                token: manajer.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let bussVerifID = response.body.data[0].identifier;

            //бизнес верификация по идентификатору
            cy.request({
                method: 'POST',
                url: `https://app.stage.paydo.com/v1/users/verification/verify`,
                headers: {
                    token: manajer.token,
                },
                body: {
                    "identifier": bussVerifID
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }


    acceptBusinessIban() {
        //получение идентификатора для бизнес IBAN
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/ibans/requests/filter?query[userIdentifier]=" + merchant.bussiness_account,
            params: {
                "query[userIdentifier]": merchant.bussiness_account
            },
            headers: {
                token: manajer.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let bussIBAN = response.body.data[0].identifier;

            //верификация бизнес IBAN по идентификатору
            cy.request({
                method: 'POST',
                url: "https://account.stage.paydo.com/v1/ibans/requests/" + bussIBAN + "/accept",
                headers: {
                    token: manajer.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }
}

export default new ManagerPage();