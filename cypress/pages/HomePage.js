import merchant from "../fixtures/Stage/merchant.json";
import parentPage from "../pages/ParentPage";
import merchants from "../fixtures/Prod/merchants.json";
import boardStepper from "../fixtures/Prod/boardStepper.json";


const fullAuth = 'Full authentication is required to access this resource.';
const accountBar = '[class="mat-menu-trigger account-bar unselectable"]';
const alertInfo = '.ng-trigger-alertFade';
const textAlertInfo = '.alert-text';
const overlayPane ='.mat-menu-content';
const dashboardStepper = '.dashboard-stepper';
const section2faTitle = '.section-2fa__title';
const section2faText = '.section-2fa__text';
const stepperItems = '.dashboard-stepper-item';
const itemTextBlock = '.dashboard-stepper-item-text-block';
const itemCheckBox = '.step'
const typesAuthenticator = '.mat-expansion-panel'
const providerName = '.provider-name'

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
            expect(text).to.eq("ID " + merchant.bussiness_account);
        })
    }

    checkTextAlertExist() {
        parentPage.isTextExist(fullAuth);
    }

    checkAlertExist() {
        parentPage.isElementExist(alertInfo);
    }

    checkAccountType(type) {
        parentPage.getAccountType(type).invoke('text').should((text) => {
            expect(text).to.eq(type);
        })
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title);
    }

    checkTextAlert() {
        parentPage.checkText(fullAuth, textAlertInfo );
    }

    accountBarIsExist() {
        parentPage.isElementExist(accountBar);
    }

    checkAccountID(id) {
        parentPage.getElement("ID " + id).invoke('text').should((text) => {
            expect(text).to.eq("ID " + id);
        })
    }

    checkAccountStatus(accountStatus) {
        parentPage.getElement(accountStatus).invoke('text').should((text) => {
            expect(text).to.eq(accountStatus);
        })
    }

    checkButtonTitle(title) {
        parentPage.getElement(title).invoke('text').should((text) => {
            expect(text).to.eq(title);
        })
    }

    overlayPaneIsExist() {
        parentPage.clickButton(merchants.email_8);
        parentPage.isElementExist(overlayPane);
        parentPage.clickButton(merchants.email_8);
        cy.wait(500);
    }

    dashboardStepperIsExist() {
        parentPage.isElementExist(dashboardStepper);
    }

    dashboardStepperHaveItems() {
        cy.get(stepperItems).should('exist');
    }

    checkTextItemBlocks() {
        for(let i = 0; i < boardStepper.itemText.length; i++) {
            cy.get(itemTextBlock).eq(i).invoke('text').should((text) => {
                expect(text).to.eq(boardStepper.itemText[i]);
            })
        }
    }

    checkStatusItems() {
        for (let i = 0; i < boardStepper.itemText.length; i++) {
            cy.get(itemCheckBox).eq(i).should('not.be.checked');
        }
    }

    checkTitleSection2FA(title) {
        parentPage.isPageTitleExist(section2faTitle);
        parentPage.checkText(title, section2faTitle);
    }

    text2FASectionIsExist() {
        parentPage.isElementExist(section2faText)
    }

    checkText2FASection() {
        for (let i = 0; i < boardStepper.section2faText.length; i++) {
            cy.get(section2faText).find('p').eq(i).invoke('text').should((text) => {
                expect(text).to.eq(boardStepper.section2faText[i]);
           })
       }
    }


    typeAuthenticatorIsExist(name) {
        if (name === "Google Authenticator app") {
            parentPage.isElementExist(typesAuthenticator, '0')
        } if (name === 'One-time text code') {
            parentPage.isElementExist(typesAuthenticator, '1')
        }
    }

    checkProviderName(name) {
        if (name === "Google Authenticator app") {
            parentPage.checkText(name, providerName, '0')
        } if (name === 'One-time text code') {
            parentPage.checkText(name, providerName, '1')
        }
    }
}

export default new HomePage();