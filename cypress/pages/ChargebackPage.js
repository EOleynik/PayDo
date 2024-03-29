import merchant from "../fixtures/Stage/merchant.json";
import feen from "../fixtures/Stage/feen.json";
import parentPage from "../pages/ParentPage"

const pageTitle = '.page-title';

class ChargebackPage {

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title, pageTitle);
    }

    getInputMerchantID(){
        return cy.get('[formcontrolname="userIdentifier"]').click();
    }

    chooseStatusChargeback(status) {
        cy.get('[formcontrolname="status"]').click();
        cy.contains('span', status).click();

    }

    clickButtonFilter() {
        return cy.get('[class="mat-focus-indicator button-filter mat-raised-button mat-button-base mat-primary"]').click()
    }

    checkStatusFirstChargeback(status) {
        cy.get('[class="mat-cell cdk-cell cdk-column-status mat-column-status ng-star-inserted"]').first().invoke('text').should((text) => {
            expect(text).to.eq(status);
        })
    }

    checkUrl (Url) {
        parentPage.checkUrl(Url)
    }

    clickFilter(name) {
        parentPage.clickButton(' Filter ');
    }

    enterTextInToFilter(text) {
        parentPage.getInput('userIdentifier').clear().type(text)
    }

    checkStatusLastChargeback(status) {
        cy.get('[class="mat-cell cdk-cell cdk-column-status mat-column-status ng-star-inserted"]').last().invoke('text').should((text) => {
            expect(text).to.eq(status);
        })
    }

    rejectChargeback() {
        //Get ID last created chargeback
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/chargebacks/user-chargebacks?query[status]=1",
            headers: {
                token: merchant.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let chargeback_ID = response.body.data[0].identifier;

            //Reject last chargeback
            cy.request({
                method: 'POST',
                url: "https://admin.stage.paydo.com/v1/chargebacks/" + chargeback_ID + "/reject",
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


    acceptChargeback() {
        //Get ID last created chargeback
        cy.request({
            method: 'GET',
            url: "https://app.stage.paydo.com/v1/chargebacks/filters?query[userIdentifier]=" + merchant.bussiness_account + "&query[status]=1",
            headers: {
                token: feen.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let chargeback_ID = response.body.data[0].identifier;

            //Accept last chargeback
            cy.request({
                method: 'POST',
                url: "https://app.stage.paydo.com/v1/chargebacks/" + chargeback_ID + "/accept",
                headers: {
                    token: feen.token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(201);
            })
        })
    }


}

export default new ChargebackPage();