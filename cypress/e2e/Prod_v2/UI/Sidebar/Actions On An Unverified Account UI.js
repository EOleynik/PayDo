import loginPage from "../../../../pages/LoginPage";
import merchants from "../../../../fixtures/Prod/merchants.json";
import homePage from "../../../../pages/HomePage";
import moneyTransferPage from "../../../../pages/MoneyTransferPage";
import projectPage from "../../../../pages/ProjectsPage";
import settingsPage from "../../../../pages/SettingsPage";
import ticketsPage from "../../../../pages/TicketsPage";
import ipnPage from "../../../../pages/IPNPage";
import reportPage from "../../../../pages/ReportPage";
import bankDetailsPage from "../../../../pages/BankDetailsPage";
import cardsPage from "../../../../pages/CardsPage";
import topUpPage from "../../../../pages/TopUpPage";
import transactionsPage from "../../../../pages/TransactionsPage";
import paymentMethodsPage from "../../../../pages/PaymentMethodsPage";
import exchangePage from "../../../../pages/ExchangePage";
import verificationPage from "../../../../pages/VerificationPage";
import affiliatePage from "../../../../pages/AffiliatePage";
import parentPage from "../../../../pages/ParentPage";
import sidebarElements from "../../../../fixtures/Prod/sidebarElements.json"


    describe ('Business account not verified, 2FA not activated', () => {

        beforeEach(() => {
            parentPage.loginWithAPI(merchants.user_8);
            homePage.checkUrl('/overview');
        })

        it('Go to menu Tickets -> not available without 2FA activation', () => {
            homePage.clickMenu('Tickets');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu list of Transfers -> not available without 2FA activation', () => {
            homePage.clickMenu('List of Transfers');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Account Details -> not available without 2FA activation', () => {
            homePage.clickMenu('Account Details');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Cards -> not available without 2FA activation', () => {
            homePage.clickMenu('Cards');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Money Transfers -> not available without 2FA activation', () => {
            homePage.clickMenu('Money Transfers');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Top Up wallet -> not available without 2FA activation', () => {
            homePage.clickMenu('Top Up wallet');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

            // Prising

        // reports


        it('Go to menu Transactions -> not available without 2FA activation', () => {
            cy.wait(1000);
            homePage.clickMenu('Transactions');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Projects -> not available without 2FA activation', () => {
            homePage.clickMenu('Projects');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu IPN -> not available without 2FA activation', () => {
            homePage.clickMenu('IPN');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Exchange -> not available without 2FA activation', () => {
            homePage.clickMenu('Exchange');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Verification -> not available without 2FA activation', () => {
            homePage.clickMenu('Verification');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Partner program -> not available without 2FA activation', () => {
            homePage.clickMenu('Partner program');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Reports -> not available without 2FA activation', () => {
            homePage.clickMenu('Reports');
            cy.wait(1000);
            homePage.checkUrl('/overview');
            homePage.checkAlertExist();
            homePage.checkTextAlertExist();
            homePage.checkTextAlert();
        })

        it('Go to menu Settings -> redirect to Settings Form', () => {
            homePage.clickMenu('Settings');
            cy.wait(1000);
            homePage.checkUrl('/settings/settings-form');

            settingsPage.checkPageTitle('Settings');
        })
    })

    describe ('Personal account not verified', () => {

        beforeEach(() => {
            parentPage.loginWithAPI(merchants.user_8, 1);
            homePage.checkUrl('/overview');
        })

        it('Authorization on account', () => {
            cy.wait(4000);
            verificationPage.checkPageTitle('Enter personal information');
        })
    })

    describe ('Business account not verified, 2FA activated', () => {

        beforeEach(() => {
            parentPage.loginWithAPI_2FA(merchants.user_6, merchants.authenticator_6);
            homePage.checkUrl('/overview');
        })

        it('Go to menu Tickets -> redirect to Tickets List', () => {
            homePage.clickMenu('Tickets');
            cy.wait(2000);

            ticketsPage.checkUrl('/tickets/list');
            ticketsPage.checkPageTitle('Create a ticket');
        })

        it('Go to menu list of Transfers -> not available without verification', () => {
            homePage.clickMenu('List of Transfers');
            cy.wait(1000);

            moneyTransferPage.checkUrl('/need-verification/list_of_transfers');
            moneyTransferPage.checkButtonExist('Complete verification');
            moneyTransferPage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu Account Details -> not available without verification', () => {
            homePage.clickMenu('Account Details');
            cy.wait(1000);

            bankDetailsPage.checkUrl('/need-verification/iban');
            bankDetailsPage.checkButtonExist('Complete verification');
            bankDetailsPage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu Cards -> not available without verification', () => {
            homePage.clickMenu('Cards');
            cy.wait(1000);

            cardsPage.checkUrl('/need-verification/cards');
            cardsPage.checkButtonExist('Complete verification');
            cardsPage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu Money Transfers -> not available without verification', () => {
            homePage.clickMenu('Money Transfers');
            cy.wait(1000);

            moneyTransferPage.checkUrl('/need-verification/money_transfers');
            moneyTransferPage.checkButtonExist('Complete verification');
            moneyTransferPage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu Top Up Wallet -> not available without verification', () => {
            homePage.clickMenu('Top Up wallet');
            cy.wait(1000);

            topUpPage.checkUrl('/need-verification/top_up');
            topUpPage.checkButtonExist('Complete verification');
            topUpPage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu Transactions -> redirect to Transaction List', () => {
            homePage.clickMenu('Transactions');
            cy.wait(2000);

            transactionsPage.checkUrl('/transaction/list');
            transactionsPage.checkPageTitle(' Transactions ');
        })

        // it('Go to menu Payment methods -> not available without verification', () => {
        //     homePage.clickMenu('Payment methods');
        //     cy.wait(1000);
        //
        //     paymentMethodsPage.checkUrl('/need-verification/payment');
        //     paymentMethodsPage.checkButtonExist('Complete verification');
        //     paymentMethodsPage.checkButtonStatus('Complete verification', 'active');
        // })

        it('Go to menu Projects -> not available without verification', () => {
            homePage.clickMenu('Projects');
            cy.wait(1000);

            projectPage.checkUrl('/projects/list');
            projectPage.clickButton(' Add new ');
            projectPage.checkButtonExist('Complete verification');
            projectPage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu IPN -> redirect to IPN settings', () => {
            homePage.clickMenu('IPN');
            cy.wait(1000);

            ipnPage.checkUrl('/ipn/checkouts');
            ipnPage.checkPageTitle('IPN settings');
        })

        it('Go to menu Exchange -> not available without verification', () => {
            homePage.clickMenu('Exchange');
            cy.wait(1000);

            exchangePage.checkUrl('/need-verification/exchange');
            exchangePage.checkButtonExist('Complete verification');
            exchangePage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu Verification -> redirect to Start Company Verification', () => {
            homePage.clickMenu('Verification');
            cy.wait(1000);

            verificationPage.checkUrl('/v2-verification/company/start-page');
            verificationPage.checkButtonExist('Go to business verification');
            verificationPage.checkButtonStatus('Go to business verification', 'active');
        })

        it('Go to menu Partner program -> not available without verification', () => {
            homePage.clickMenu('Partner program');
            cy.wait(1000);

            affiliatePage.checkUrl('/need-verification/affiliate');
            affiliatePage.checkButtonExist('Complete verification');
            affiliatePage.checkButtonStatus('Complete verification', 'active');
        })

        it('Go to menu Reports -> redirect to Report List', () => {
            homePage.clickMenu('Reports');
            cy.wait(1000);

            reportPage.checkUrl('/report-finance/finance');
            reportPage.checkPageTitle('Reports');
        })

        it('Go to menu Settings -> redirect to Setting Form', () => {
            homePage.clickMenu('Settings');
            cy.wait(1000);

            settingsPage.checkUrl('/settings/settings-form');
            settingsPage.checkPageTitle('Settings');
            })
    })
