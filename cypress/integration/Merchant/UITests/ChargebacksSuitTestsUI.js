import loginPage from "../../../pages/LoginPage";
import createCheckoutPage from "../../../pages/CreateCheckoutPage";
import transactionsPage from "../../../pages/TransactionsPage";
import merchant from "../../../fixtures/merchant";
import parentPage from "../../../pages/ParentPage";
import chargebackPage from "../../../pages/ChargebackPage";
import feenPage from "../../../pages/FeenPage";
import homePage from "../../../pages/HomePage";
import feen from "../../../fixtures/feen";

    describe('Chargeback suit', () => {

        beforeEach('Authorization and create checkout', () => {
            let payAmount = parentPage.getRandomArbitrary(300, 500);
            let payCurrency = "USD";
            createCheckoutPage.createCheckoutAPI(payAmount, payCurrency);
        });

        it('Create Chargeback', () => {
            cy.visit('https://admin.stage.paydo.com/en/auth/login');
            loginPage.checkUrl('/en/auth/login');
            loginPage.loginWithCred(feen.email, feen.pass);
            loginPage.enter2FACode(feen.authenticator)

            homePage.checkUrl('/');
            homePage.clickMenuPaymentsHistory();

            transactionsPage.checkUrl('en/transactions/list');
            transactionsPage.clickFilter();
            transactionsPage.enterTextInToFilter(merchant.bussiness_account);
            transactionsPage.clickButtonCreateChargeback();
            cy.wait(3000);
            transactionsPage.confirmChargeback();
            cy.wait(2000);
            transactionsPage.checkCreateChargeback();
            transactionsPage.closeAlert();

            homePage.clickMenuChargebacks();
            cy.wait(2000);
            chargebackPage.checkUrl('en/chargeback/list');
            chargebackPage.clickFilter();
            cy.wait(2000);
            chargebackPage.enterTextInToFilter(merchant.bussiness_account);
            chargebackPage.chooseStatusChargeback('New');
            chargebackPage.clickButtonFilter();
            cy.wait(2000);
            chargebackPage.checkStatusFirstChargeback(' New ');
            chargebackPage.rejectChargeback();
        });

        it('Check status chargeback, chargeback was rejected', () => {

            feenPage.createChargeback();

            loginPage.visit('/');
            loginPage.checkUrl('/en/auth/login');
            loginPage.loginWithCred(merchant.email, merchant.password);
            loginPage.enter2FACode(merchant.authenticator);
            cy.wait(3000);

            homePage.checkUrl('/en/overview');
            homePage.clickMenuTransactions();
            cy.wait(3000);
            homePage.clickMenuChargebacks();
            cy.wait(2000);

            chargebackPage.checkUrl('transaction/chargeback/list');
            chargebackPage.clickFilter();
            chargebackPage.chooseStatusChargeback('New');
            chargebackPage.clickButtonFilter();
            cy.wait(2000);
            chargebackPage.checkStatusFirstChargeback(' New ');
            chargebackPage.rejectChargeback();
            cy.wait(2000);
            chargebackPage.chooseStatusChargeback('Rejected');
            chargebackPage.clickButtonFilter();
            cy.wait(2000);
            chargebackPage.checkStatusLastChargeback(' Rejected ');
        });

        it('Check status chargeback, chargeback was Accepted', () => {

            feenPage.createChargeback();

            loginPage.visit('/');
            loginPage.checkUrl('/en/auth/login');
            loginPage.loginWithCred(merchant.email, merchant.password);
            loginPage.enter2FACode(merchant.authenticator);
            cy.wait(3000);

            homePage.checkUrl('/en/overview');
            homePage.clickMenuTransactions();
            cy.wait(3000);
            homePage.clickMenuChargebacks();
            cy.wait(2000);

            chargebackPage.checkUrl('transaction/chargeback/list');
            chargebackPage.clickFilter();
            chargebackPage.chooseStatusChargeback('New');
            chargebackPage.clickButtonFilter();
            cy.wait(2000);
            chargebackPage.checkStatusFirstChargeback(' New ');
            chargebackPage.acceptChargeback();
            cy.wait(2000);
            chargebackPage.chooseStatusChargeback('Accepted');
            chargebackPage.clickButtonFilter();
            cy.wait(2000);
            chargebackPage.checkStatusLastChargeback(' Accepted ');


        });

    })


