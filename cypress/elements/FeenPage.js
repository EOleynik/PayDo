import loginPage from "./LoginPage";
import feen from "../fixtures/feen.json"
import merchant from "../fixtures/merchant.json"

class FeenPage {

    getInstallComStrategAll(fix, pers) {
        cy.request({
            method: 'POST',
            url: `https://app.stage.paydo.com/v1/instrument-settings/commissions/custom`,
            headers: {
                token: feen.token,
            },
            body: {
                "transactionType": 7,
                "strategy": 1,
                "source": 1,
                "value": {
                    "ALL": [
                        fix,
                        pers
                    ]
                },
                "currency": "",
                "paymentMethodIdentifier": 300,
                "userIdentifier": merchant.bussiness_account

            }
        }).then((response) => {
            expect(response).property('status').to.equal(201)
        })
    }

    getLogin() {
        loginPage.visit('/');
        window.localStorage.setItem('user-session',
            '{"id":"1604","email":"eugeniy.o+f2@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE2MDQiLCJhY2Nlc3NUb2tlbiI6ImRlYzhhMDE5YjA1Y2M2ZjVkMzk3ZjdiOSIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTU5OCIsInRpbWUiOjE1OTYzNTgyNzMsImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOlsiUk9MRV9GSU5BTkNJQUwiXSwidHdvRmFjdG9yIjp7InBhc3NlZCI6dHJ1ZX19.GGimEqCfcBU3fMMiO23Uc9_-nPidBcmNwpFvNuNi3SU","role":4,"moduleUrl":"financial","status":1,"type":2,"accountType":1,"availableAccounts":[],"stayLogin":true,"isLoggedIn":true}')
        loginPage.getButtonToAdmibPanel().click();
    }


    installComStrategMAX(fix, pers) {
        cy.request({
            method: 'POST',
            url: `https://app.stage.paydo.com/v1/instrument-settings/commissions/custom`,
            headers: {
                token: feen.token,
            },
            body: {
                "transactionType": 7,
                "strategy": 2,
                "source": 1,
                "value": {
                    "ALL": [
                        fix,
                        pers
                    ]
                },
                "currency": "",
                "paymentMethodIdentifier": 300,
                "userIdentifier": merchant.bussiness_account

            }
        }).then((response) => {
            expect(response).property('status').to.equal(201)
        })
    }

    getFixComm() {
         cy.request({
            method: 'GET',
            url: `https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/1782`,
            headers: {
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3ODIiLCJhY2Nlc3NUb2tlbiI6IjU4ZjE4NzhiZWQwYmJiMzM5OTk1NzVkMiIsInRva2VuSWQiOiIyOCIsIndhbGxldElkIjoiMTc3NiIsInRpbWUiOjE1OTY5NjYyNzUsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.CKWO2ky4C0GytFG0_pK-aKsFCa5cITEE7hBVxedH-78',
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
           return response.body.data[7].value.GBP[0]

    })

}


    getPersCom() {
         cy.request({
            method: 'GET',
            url: `https://app.stage.paydo.com/v1/instrument-settings/commissions/custom/300/1782`,
            headers: {
                token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE3ODIiLCJhY2Nlc3NUb2tlbiI6IjU4ZjE4NzhiZWQwYmJiMzM5OTk1NzVkMiIsInRva2VuSWQiOiIyOCIsIndhbGxldElkIjoiMTc3NiIsInRpbWUiOjE1OTY5NjYyNzUsImV4cGlyZWRBdCI6MTYwOTM2NTYwMCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjpmYWxzZX19.CKWO2ky4C0GytFG0_pK-aKsFCa5cITEE7hBVxedH-78',
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
             return response.body.data[7].value.GBP[1];


         })

    }

    // Add Project to MID
    addProjectToMid() {
        cy.request({
            method: 'POST',
            url: `https://app.stage.paydo.com/v1/instrument-settings/mid/11/add-apps`,
            headers: {
                token: feen.token
                },
            body:
                [
                    "cc9cf5c0-e5c8-46f0-8da3-fce662143c03",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    ""
                ]
        }).then((response) => {
            expect(response).property('status').to.equal(201)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
             })

        cy.request({
            method: 'POST',
            url: `https://app.stage.paydo.com/v1/instrument-settings/mid/update`,
            headers: {
                token: feen.token
                },
                body: {
                    "identifier": 11,
                    "name": "Avto_Test_OE",
                    "riskLevel": "2",
                    "settings": [
                        {
                            "connectorId": "1",
                            "paymentMethodId": "197",
                            "terminalId": "10001"
                        },
                        {
                            "connectorId": "1",
                            "paymentMethodId": "300",
                            "terminalId": "10001"
                        },
                        {
                            "connectorId": "1",
                            "paymentMethodId": "20001",
                            "terminalId": "20001"
                        },
                        {
                            "connectorId": "1",
                            "paymentMethodId": "200",
                            "terminalId": "2"
                        }
                    ],
                    "apps": [
                        "cc9cf5c0-e5c8-46f0-8da3-fce662143c03"
                    ],
                    "createdAt": 1596124021,
                    "updatedAt": 1597518380
                }
        }).then((response) => {
            expect(response).property('status').to.equal(201)
            expect(response.body).property('data').to.not.be.oneOf([null, ""])
        })
    }

    changeHoldPendingBalance() {
        cy.request({
            method: 'POST',
            url: `https://app.stage.paydo.com/v1/instrument-settings/holds/custom`,
            headers: {
                token: feen.token
            },
            body: {
                "from": 4,
                "to": 2,
                "value": {
                    "ALL": 0
                },
                "distributionPart": 100,
                "userIdentifier": merchant.bussiness_account

            }
        }).then((response) => {
            expect(response).property('status').to.equal(201)
            expect(response.body).property('status').to.not.be.oneOf([null, ""])
        })
    }

    setPaymentSettings() {
        cy.request({
            method: 'POST',
            url: `https://app.stage.paydo.com/v1/instrument-settings/user-payment-settings/payment-methods/1/appoint-primary`,
            headers: {
                token: feen.token
            },
            body: {
                "userIdentifier": merchant.bussiness_account,
                "primaryIdentifier": 300
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200)
            expect(response.body).property('status').to.not.be.oneOf([null, ""])
        })
    }
}

export default new FeenPage();