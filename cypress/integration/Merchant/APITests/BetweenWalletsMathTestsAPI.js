import moneyTransferPage from "../../../pages/MoneyTransferPage";
import parentPage from "../../../pages/ParentPage";
import merchant from "../../../fixtures/Stage/merchant.json";
import feen from "../../../fixtures/Stage/feen.json";

let recipient;
let user;
let admin;

before(function fetchToken() {

    // Get token for recipient
    cy.request('POST', 'https://account.stage.paydo.com/v1/users/login', {
        email: merchant.recipient_email,
        password: merchant.recipient_password,
    }).then((response) => {
        expect(response).property('status').to.equal(206);

        cy.request({
            method:'POST',
            url:'https://account.stage.paydo.com/v1/users/login',
            headers: {
                "x-2fa-code": parentPage.get2FACode(merchant.recipient_authenticator)
            },
            body:{
                email: merchant.recipient_email,
                password: merchant.recipient_password
            }
        }).its('headers')
            .then((res) => {
                recipient = res
            })
    })


    //Get token for merchant
    cy.request('POST', 'https://account.stage.paydo.com/v1/users/login', {
        email: merchant.email,
        password: merchant.password,
    }).then((response) => {
        expect(response).property('status').to.equal(206);

        cy.request({
            method:'POST',
            url:'https://account.stage.paydo.com/v1/users/login',
            headers: {
                "x-2fa-code": parentPage.get2FACode(merchant.authenticator)
            },
            body:{
                email: merchant.email,
                password: merchant.password,
            }
        }).its('headers')
            .then((res) => {
                user = res
            })
    })


    //Get token for admin
    cy.request('POST', 'https://admin.stage.paydo.com/v1/users/login', {
        email: feen.email,
        password: feen.pass,
    }).then((response) => {
        expect(response).property('status').to.equal(206);

        cy.request({
            method:'POST',
            url:'https://admin.stage.paydo.com/v1/users/login',
            headers: {
                "x-2fa-code": parentPage.get2FACode(feen.authenticator)
            },
            body:{
                email: feen.email,
                password: feen.pass,
            }
        }).its('headers')
            .then((res) => {
                admin = res
            })
    })

})

describe('Between Wallets math', () => {

    it('Between Wallets math, wallets match', () => {
        moneyTransferPage.createTransferAndCheckMath(admin, user, recipient);
    })

})