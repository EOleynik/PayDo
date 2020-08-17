import merchant from "../fixtures/merchant.json"
import manajer from "../fixtures/manajer.json"

class ManagerPage {


    acceptPersonalVerification() {
        cy.request({            //получение идентификатора для персональной верификации
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/users/verification/all?query[userIdentifier]="+merchant.personal_account,
            params: {
                "query[userIdentifier]": merchant.personal_account
            },
            headers: {
                token: manajer.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let persveriden = response.body.data[0].identifier

            cy.request({        //персональная верификация по идентификатору
                method: 'POST',
                url: `https://app.stage.paydo.com/v1/users/verification/verify`,
                headers: {
                    token: manajer.token,
                },
                body: {
                    "identifier": persveriden
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }


    acceptPersonalIban() {
        cy.request({            //получение идентификатора для персонального IBAN
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/ibans/requests/filter?query[userIdentifier]="+merchant.personal_account,
            params: {
                "query[userIdentifier]": merchant.personal_account
            },
            headers: {
                token: manajer.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let persiban = response.body.data[0].identifier

            cy.request({        //верификация персонального IBAN по идентификатору
                method: 'POST',
                url: "https://app.stage.paydo.com/v1/ibans/requests/"+persiban+"/accept",   //'+idreq+' конкатенация и кавычки для передачи значения айди запроса
                headers: {
                    token: manajer.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }


    acceptBusinessVerification() {
        cy.request({            //получение идентификатора для бизнес верификации
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/users/verification/all?query[userIdentifier]="+merchant.bussiness_account,
            params: {
                "query[userIdentifier]": merchant.bussiness_account
            },
            headers: {
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE1OTYiLCJhY2Nlc3NUb2tlbiI6ImE0YWViZTgyZDA3MmFjMzhhYTFjYWIyMiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTU5MCIsInRpbWUiOjE1OTYzNTczNjksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOlsiUk9MRV9NQU5BR0VSIl0sInR3b0ZhY3RvciI6eyJwYXNzZWQiOnRydWV9fQ.vPDJQpWUYKvuZT7L_4_tFWMMIEiuGOvfIyKMNvrLZH4'
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let busveriden = response.body.data[0].identifier

            cy.request({            //бизнес верификация по идентификатору
                method: 'POST',
                url: `https://app.stage.paydo.com/v1/users/verification/verify`,
                headers: {
                    token: manajer.token,
                },
                body: {
                    "identifier": busveriden
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }


    acceptBusinessIban() {
        cy.request({            //получение идентификатора для бизнес IBAN
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/ibans/requests/filter?query[userIdentifier]="+merchant.bussiness_account,
            params: {
                "query[userIdentifier]": merchant.bussiness_account
            },
            headers: {
                token: manajer.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let busiban = response.body.data[0].identifier

            cy.request({        //верификация бизнес IBAN по идентификатору
                method: 'POST',
                url: "https://app.stage.paydo.com/v1/ibans/requests/"+busiban+"/accept",   //'+busiban+' конкатенация и кавычки для передачи значения айди запроса
                headers: {
                    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE1OTYiLCJhY2Nlc3NUb2tlbiI6ImE0YWViZTgyZDA3MmFjMzhhYTFjYWIyMiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTU5MCIsInRpbWUiOjE1OTYzNTczNjksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOlsiUk9MRV9NQU5BR0VSIl0sInR3b0ZhY3RvciI6eyJwYXNzZWQiOnRydWV9fQ.vPDJQpWUYKvuZT7L_4_tFWMMIEiuGOvfIyKMNvrLZH4',
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200)
            })
        })
    }
}

export default new ManagerPage();