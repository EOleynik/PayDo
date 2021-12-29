import loginPage from "../../../pages/LoginPage";
import merchants from "../../../fixtures/Prod/merchants.json";
import homePage from "../../../pages/HomePage";
import moneyTransferPage from "../../../pages/MoneyTransferPage";


describe('If the account is not verified', () => {

    it('Go to list of Transfers', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuListOfTransfer();

        moneyTransferPage.checkUrl('/list_of_transfers');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Bank Details', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuBankDetails();

        moneyTransferPage.checkUrl('/need-verification/iban');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Cards', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuCards();

        moneyTransferPage.checkUrl('/need-verification/cards');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Create Transfer', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuCreateTransfer();

        moneyTransferPage.checkUrl('/need-verification/money_transfers');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Top Up Wallet', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuTopUpWallet();

        moneyTransferPage.checkUrl('/need-verification/top_up');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Payment methods', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuPaymentMethods();

        moneyTransferPage.checkUrl('/need-verification/payment');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Projects', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuProjects();

        moneyTransferPage.checkUrl('/need-verification/projects');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Exchange', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuExchange();

        moneyTransferPage.checkUrl('/need-verification/exchange');
        moneyTransferPage.checkButtonExist('Complete verification');
    })

    it('Go to Partner program', () => {
        cy.visit('https://account.paydo.com/en/auth/login');
        cy.wait(1000);
        loginPage.checkUrl('/auth/login');
        loginPage.checkAuthorization(merchants.email_6, merchants.password_6, merchants.authenticator_6);
        cy.wait(3000);

        homePage.checkUrl('/overview');
        homePage.clickMenuPartnerProgram();

        moneyTransferPage.checkUrl('/need-verification/affiliate');
        moneyTransferPage.checkButtonExist('Complete verification');
    })


})