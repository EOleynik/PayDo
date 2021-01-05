import merchant from "../fixtures/merchant";
import parentPage from "../pages/ParentPage"


class HomePage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    clickMenuPaymentsHistory() {
        parentPage.getMenu('Payments History').click()
    }

    clickMenuChargebacks() {
        parentPage.getMenu('Chargebacks').click()
    }

    clickMenuProjects() {
        parentPage.getMenu('Projects').click();
    }

    clickSubMenuRest() {
        parentPage.getMenu('REST').click();
    }

    clickMenuTransactions () {
        parentPage.getMenu('Transactions').click();
    }

    clickMenuCreateTransfer() {
        parentPage.getMenu('Create Transfer').click();
    }

    clickMenuExchange() {
        parentPage.getMenu('Exchange').click();
    }

    clickMenuTopUpWallet() {
        parentPage.getMenu('Top Up wallet').click();
    }

    clickButtonAddNew() {
        parentPage.clickButton('Add new');
    }

    getMenuVerification() {
        return cy.contains('Verification');
    }

    getChangeAccount() {
        cy.get('[class="acc-active__info_acc-type"]').click();
        return cy.contains('Personal account').click()
    }

    getSubmenuPersonal() {
        return cy.get('[class="mat-line mid-menu__li-text"]').contains('Personal')
    }


    clickMenuTickets() {
        parentPage.getMenu('Tickets').click();
    }

    setMainCurrency() {
        cy.request({
            method: 'POST',
            url: "https://account.stage.paydo.com/v1/users/settings/change-currency",
            headers: {
                token: merchant.token,
            },
            body: {
                "identifier": merchant.bussiness_account,
                "currency": merchant.main_currency
            }
        }).then((response) => {
            expect(response).property('status').to.equal(201);
            expect(response.body.status).eq(1);

        })
    }

    checkMerchantID(accountID) {
        return cy.get('[class="acc-active__info_id"]').invoke('text').should((text) => {
            expect(text).to.eq("ID " + merchant.bussiness_account)
        })
    }



}

export default new HomePage();