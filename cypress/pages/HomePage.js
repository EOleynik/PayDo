import merchant from "../fixtures/Stage/merchant.json";
import parentPage from "../pages/ParentPage"

const blockInfo = 'div[class="ng-tns-c441-0 ng-trigger ng-trigger-alertFade alert alert-info ng-star-inserted"]'
const pageTitle = 'What should you do next?'

class HomePage {

    checkUrl(Url) {
        parentPage.checkUrl(Url);
    }

    clickMenuBankDetails() {
        cy.get('[class="top-menu__li ng-star-inserted"]').eq(3).click();
    }

    clickMenu(name) {
        parentPage.getMenu(name).click();
    }

    clickMenuCards() {
        parentPage.getMenu('Cards').click();
    }

    clickMenuPaymentMethods() {
        parentPage.getMenu('Payment methods').click();
    }

    clickMenuPaymentsHistory() {
        parentPage.getMenu('Payments History').click();
    }

    clickMenuPartnerProgram() {
        parentPage.getMenu('Partner program').click();
    }

    clickMenuChargebacks() {
        parentPage.getMenu('Chargebacks').click();
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

    clickMenuListOfTransfers() {
        parentPage.getMenu('List of Transfers').click();
    }

    clickMenuMoneyTransfers() {
        parentPage.getMenu('Money Transfers').click();
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

    getChangeAccount(text) {
        cy.get('[class="mat-menu-trigger account-bar unselectable"]').click();
        return cy.contains(text).click();
    }

    getSubmenuPersonal() {
        return cy.get('[class="mat-line mid-menu__li-text"]').contains('Personal');
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


    checkTextInfoExist(text) {
        parentPage.isTextExist(blockInfo, text);
    }

    checkBlockInfoExist() {
        parentPage.isBlockExist(blockInfo)
    }

    checkAccountType(type) {
        parentPage.getAccountType(type).invoke('text').should((text) => {
            expect(text).to.eq(type)
        })
    }

    checkPageTitle(title) {
        parentPage.getPageTitle(title).invoke('text').should((text) => {
            expect(text).to.eq(title)
        });
    }

}

export default new HomePage();