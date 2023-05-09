import merchant from "../fixtures/Stage/merchant.json";
import parentPage from "../pages/ParentPage";
import merchants from "../fixtures/Prod/merchants.json";
import boardStepper from "../fixtures/Prod/boardStepper.json";
import moment from "moment";
import settingsPage from "../pages/SettingsPage"
import sidebarElements from "../fixtures/Prod/sidebarElements.json";


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
const itemCheckBox = '.step';
const typesAuthenticator = '.mat-expansion-panel';
const providerName = '.provider-name';
const pageTitleElement = 'h1.page-title';
const sectionBalances = '.section-balances';
const providerLabel = '.provider-label';
//const googleAuthBody = '.panel-body';
const panelApp = 'div.d-flex.provider-apps > div > a:nth-child(1)'
//const panelApp = '.panel-app';
const providerAppLink = 'https://apps.apple.com/us/app/google-authenticator/id388497605';
const panelGooglePlay = 'div.d-flex.provider-apps > div > a:nth-child(3)'
const providerGoogleLink = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2';
const iconDownloadAppStore = '.provider-apps > div > a:nth-child(1) > span.mat-button-wrapper > mat-icon';
const iconDownloadGooglePlay = '.provider-apps > div > a:nth-child(3) > span.mat-button-wrapper > mat-icon';
const sectionBalancesTitle = 'div.section-balances > h2';
const clockTime = '.clock-time';
const columnHeaders = ".mat-header-row";
const sectionCompleteBusVer = ".section-business-verification";
const busVerTitle = "Complete Business Verification";
const sectionCompleteBusVerTitle = ".section-business-verification__title";
const sectionCompleteBusVerText = ".section-business-verification__text";
const sectionAddCard = '.section-add-card';
const addCardTitle = 'Add Card';
const sectionAddCardTitle = '.section-add-card__title';
const sectionAddCardText = '.section-add-card__text';
const redirectAddCard = 'div.section-add-card__text > div.buttons-wrapper > a';
const redirectAddCardLink ='/need-saved-card/card_list';
const sectionTopUpWallet = '.section-top-up';
const topUpWalletTitle = 'Top up wallet';
const sectionTopUpWalletTitle = '.section-top-up__title';
const sectionTopUpWalletText = '.section-top-up__text';
const redirectTopUp = 'div.section-top-up__text > div.buttons-wrapper > a';
const redirectTopUpLink = '/top-up/by-card';



class HomePage {

    checkUrl(Url) {
        parentPage.checkUrl(Url);
    }

    isButtonExist(name) {
        parentPage.isButtonExist(name);
    }

    checkButtonStatus(name, status) {
        parentPage.getButtonStatus(name, status);
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
            expect(text).to.eq("ID " + merchant.business_account);
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
        parentPage.checkText(title, pageTitleElement);
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
        cy.wait(300);
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
        parentPage.isElementExist(section2faText);
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
            parentPage.isElementExist(typesAuthenticator, '0');
        } if (name === 'One-time text code to your email') {
            parentPage.isElementExist(typesAuthenticator, '1');
        }
    }

    checkProviderName(name) {
        if (name === "Google Authenticator app") {
            parentPage.checkText(name, providerName, '0');
        } if (name === 'One-time text code to your email') {
            parentPage.checkText(name, providerName, '1');
        }
    }

    sectionBalancesIsExist() {
        parentPage.isElementExist(sectionBalances);
    }

    providerLabelIsExist(title) {
        parentPage.isElementExist(providerLabel);
        parentPage.checkText(title, providerLabel);
    }

    checkTextPanelBody() {
        parentPage.checkText(boardStepper.googleAuthPanelText[0], '.panel-body > .mb-4', 0);
    }

    checkTextPanelBody2() {
        parentPage.checkText(boardStepper.oneTimePanelText[0], '.panel-body > .mb-4', 1 );
    }

    // panelAppIsExist() {
    //     parentPage.isElementExist(panelApp);
    // }

    iconDownloadAppStoreIsExist() {
        parentPage.isElementExist(iconDownloadAppStore);
    }

    iconDownloadGooglePlayIsExist() {
        parentPage.isElementExist(iconDownloadGooglePlay);
    }

    appStoreHaveLink() {
        parentPage.isElementHaveLink(panelApp, providerAppLink);
        // cy.get('div.d-flex.provider-apps > div > a:nth-child(1)')
        //    .should('have.attr', 'href',
        //    'https://apps.apple.com/us/app/google-authenticator/id388497605');
    }

    googlePlayHaveLink() {
        parentPage.isElementHaveLink(panelGooglePlay, providerGoogleLink)
        // cy.get('div.d-flex.provider-apps > div > a:nth-child(3)')
        //     .should('have.attr', 'href',
        //     'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2');
    }

    buttonAddCardHaveLink() {
        parentPage.isElementHaveLink(redirectAddCard, redirectAddCardLink)
    }

    checkTitleSectionBalances(title) {
        parentPage.isPageTitleExist(sectionBalancesTitle);
        parentPage.checkText(title, sectionBalancesTitle);
    }

    checkClockTime() {
        parentPage.isElementExist(clockTime);
        // cy.log(" " + parentPage.getLocalDate('en-us') + ", " + parentPage.getTime(':') +
        //     ", " + "UTC +" + (parentPage.getTime(':').split(':', 1) - parentPage.getUTCTime()).toString().padStart(2, '0') + ":00 ");
        // let checkText = (" " + parentPage.getLocalDate('en-us') + ", " + parentPage.getTime(':') +
        //     ", " + "UTC +" + (parentPage.getTime(':').split(':', 1) - parentPage.getUTCTime()).toString().padStart(2, '0') + ":00 ");
        // parentPage.checkText(checkText, clockTime)
        //let clock = moment(new Date()).format('MMM DD, HH:mm, UTC Z')
        parentPage.checkText(" " + moment(new Date()).format('MMM DD, HH:mm, UTC Z') + " ", clockTime)
    }

    checkColumnHeadersBalancesSection() {
        parentPage.isElementExist(columnHeaders);
        for (let i = 0; i < boardStepper.balanceColumnHeaders.length; i++) {
            cy.get('.mat-header-cell').eq(i).invoke('text').then((text) => {
                expect(text).to.eq(boardStepper.balanceColumnHeaders[i])
            })
        }
    }

    checkSectionCompleteBusinessVerification() {
        parentPage.isElementExist(sectionCompleteBusVer);
        parentPage.checkText(busVerTitle, sectionCompleteBusVerTitle);
    }

    checkTextTitleBusVer() {
        cy.get(sectionCompleteBusVerText).find('p').invoke('text').should((text) => {
            expect(text).to.eq(boardStepper.titleBusVerText);
        })
    }

    checkHeadingTextSectionCompleteBusinessVerification() {
        cy.get(sectionCompleteBusVerText).find('h3').invoke('text').should((text) => {
            expect(text).to.eq(boardStepper.headingTextSectionCompleteBusVer);
        })
    }

    checkTextSectionCompleteBusinessVerification() {
        for (let i = 0; i < boardStepper.textSectionCompleteBusVer.length; i++) {
            cy.get(sectionCompleteBusVerText).find('li').eq(i).invoke('text').should((text) => {
                expect(text).to.eq(boardStepper.textSectionCompleteBusVer[i]);
            })
        }
    }


    checkSectionAddCard() {
        parentPage.isElementExist(sectionAddCard);
        parentPage.checkText(addCardTitle, sectionAddCardTitle)
    }

    checkTextSectionAddCard() {
        for (let i = 0; i < boardStepper.textSectionAddCard.length; i++) {
            cy.get(sectionAddCardText).find('p').eq(i).invoke('text').should((text) => {
                expect(text).to.eq(boardStepper.textSectionAddCard[i]);
            })
        }
    }

    checkSectionTopUpWallet() {
        parentPage.isElementExist(sectionTopUpWallet)
        parentPage.checkText(topUpWalletTitle,sectionTopUpWalletTitle)
    }

    checkTextSectionTopUpWallet() {
        for (let i = 0; i < boardStepper.textSectionTopUpWallet.length; i++) {
            cy.get(sectionTopUpWalletText).find('p').eq(i).invoke('text').should((text) => {
                expect(text).to.eq(boardStepper.textSectionTopUpWallet[i]);
            })
        }
    }

    buttonTopUpHaveLink() {
        parentPage.isElementHaveLink(redirectTopUp, redirectTopUpLink);
    }

    fullCheckAlertOrPageTitle(element) {
        if(element !== 'Settings') {
            this.checkAlertExist();
            this.checkTextAlertExist();
            this.checkTextAlert()
            parentPage.closeAlert()
        } else {
        settingsPage.checkPageTitle('Settings')
        }
    }

    goToMenuSections(sections) {
        for (let i = 0; i < sections.length; i++) {
            this.clickMenu(sections[i]);
            cy.wait(1000);
            this.fullCheckAlertOrPageTitle(sections[i])
        }
    }
}


export default new HomePage();