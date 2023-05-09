import parentPage from "../../../../pages/ParentPage";
import merchants from "../../../../fixtures/Prod/merchants.json";
import homePage from "../../../../pages/HomePage";
import sidebarElements from "../../../../fixtures/Prod/sidebarElements.json";
import verificationPage from "../../../../pages/VerificationPage";
import ticketsPage from "../../../../pages/TicketsPage";
import moneyTransferPage from "../../../../pages/MoneyTransferPage";
import bankDetailsPage from "../../../../pages/BankDetailsPage";
import cardsPage from "../../../../pages/CardsPage";
import topUpPage from "../../../../pages/TopUpPage";
import transactionsPage from "../../../../pages/TransactionsPage";
import projectPage from "../../../../pages/ProjectsPage";
import ipnPage from "../../../../pages/IPNPage";
import exchangePage from "../../../../pages/ExchangePage";
import affiliatePage from "../../../../pages/AffiliatePage";
import reportPage from "../../../../pages/ReportPage";
import settingsPage from "../../../../pages/SettingsPage";
import pendingTransferPage from "../../../../pages/PendingTransfersPage";
import refundPage from "../../../../pages/RefundsPage";
import chargebackPage from "../../../../pages/ChargebackPage";
import pricingPage from "../../../../pages/PricingPage";
import textInfo from "../../../../fixtures/Prod/textInfo.json";
import listOfTransfers from '../../../../pages/ListOfTransfers';
import sub_Title from "../../../../fixtures/Prod/sub_Title.json";

describe ('Account not verified, 2FA not activated', () => {

    beforeEach(() => {
        parentPage.loginWithAPI(merchants.user_8);
        homePage.checkUrl('/overview');
    })

    it('Business account, eWallet group menu -> go to menu sections', () => {
            homePage.goToMenuSections(sidebarElements.business_eWallet);
    })

    it('Business account, merchant group menu -> go to menu sections', () => {
        homePage.goToMenuSections(sidebarElements.business_merchant);
    })

    it('Business account, general group menu -> go to menu sections', () => {
        homePage.goToMenuSections(sidebarElements.business_general);
    })

})

    describe ('Account not verified, 2FA not activated', () => {

        before(() => {
            parentPage.loginWithAPI(merchants.user_8, 1);
            homePage.checkUrl('/auth/user-activate-verification/shortest');
        })

        it('Personal account -> redirect to Enter personal information', () => {
            cy.wait(4000);
            verificationPage.checkPageTitle('Enter personal information')
        })
    })

        describe ('Account not verified, 2FA activated', () => {

            before(() => {
                parentPage.loginWithAPI_2FA(merchants.user_6, merchants.authenticator_6);
                homePage.checkUrl('/overview');
            })

            it('Business account, go to menu sections', () => {
                //Go to menu Tickets -> redirect to Tickets List
                homePage.clickMenu('Tickets');
                ticketsPage.checkUrl('/tickets/list');
                ticketsPage.checkPageTitle('Create a ticket');
                ticketsPage.checkTicketInfoText(textInfo.ticketPage);
                ticketsPage.checkButtonExist(' Create a new ticket ');
                ticketsPage.checkButtonStatus(' Create a new ticket ', 'active');

                //Go to menu list of Transfers -> not available without verification
                homePage.clickMenu('List of Transfers');
                listOfTransfers.checkUrl('/need-verification/list_of_transfers');
                listOfTransfers.checkPageTitle('List of Transfers');
                listOfTransfers.checkInfoText(textInfo.noVerificationBlock);
                listOfTransfers.checkButtonExist('Complete verification');
                listOfTransfers.checkButtonStatus('Complete verification', 'active');

                //Go to menu Account Details -> not available without verification
                homePage.clickMenu('Account Details');
                bankDetailsPage.checkUrl('/need-verification/iban');
                bankDetailsPage.checkPageTitle('Bank Details');
                bankDetailsPage.checkInfoText(textInfo.noVerificationBlock);
                bankDetailsPage.checkButtonExist('Complete verification');
                bankDetailsPage.checkButtonStatus('Complete verification', 'active');

                //Go to menu Cards -> not available without verification
                homePage.clickMenu('Cards');
                cardsPage.checkUrl('/need-verification/cards');
                cardsPage.checkPageTitle('Cards');
                cardsPage.checkInfoText(textInfo.noVerificationBlock);
                cardsPage.checkButtonExist('Complete verification');
                cardsPage.checkButtonStatus('Complete verification', 'active');

                //Go to menu Money Transfers -> not available without verification
                homePage.clickMenu('Money Transfers');
                moneyTransferPage.checkUrl('/need-verification/money_transfers');
                moneyTransferPage.checkPageTitle('Money Transfers');
                moneyTransferPage.checkInfoText(textInfo.noVerificationBlock);
                moneyTransferPage.checkButtonExist('Complete verification');
                moneyTransferPage.checkButtonStatus('Complete verification', 'active');

                //Go to menu Top Up Wallet -> not available without verification
                homePage.clickMenu('Top Up wallet');
                topUpPage.checkUrl('/need-verification/top_up');
                topUpPage.checkPageTitle('Top Up wallet');
                topUpPage.checkInfoText(textInfo.noVerificationBlock);
                topUpPage.checkButtonExist('Complete verification');
                topUpPage.checkButtonStatus('Complete verification', 'active');

                //Go to menu Pricing -> redirect to Pricing
                homePage.clickMenu('Pricing');
                pricingPage.checkUrl('/need-verification/pricing');
                pricingPage.checkPageTitle('Pricing');
                pricingPage.checkInfoText(textInfo.noVerificationBlock);
                pricingPage.checkButtonExist('Complete verification');
                pricingPage.checkButtonStatus('Complete verification', 'active');

                //Go to menu Reports -> redirect to Report List
                homePage.clickMenu('Reports');
                reportPage.checkUrl('/report-finance/finance');
                reportPage.checkPageTitle('Reports');
                reportPage.checkInfoText(textInfo.reportPage);

                //Go to menu Transactions -> redirect to Transaction List
                homePage.clickMenu('Transactions');
                transactionsPage.checkUrl('/transaction/list');
                transactionsPage.checkPageTitle(' Transactions ');

                //Go to sub menu Pending transfers -> redirect to Pending transfers list
                homePage.clickMenu('Transactions');
                homePage.clickMenu('Pending transfers');
                pendingTransferPage.checkUrl('/transaction/pending-transfers');
                pendingTransferPage.checkPageTitle('Pending transfers');

                //Go to sub menu Refunds  -> redirect to Refunds list
                homePage.clickMenu('Transactions');
                homePage.clickMenu('Refunds');
                refundPage.checkUrl('/transaction/refund/list');
                refundPage.checkPageTitle('Refunds');

                //Go to sub menu Chargeback  -> redirect to Chargeback list
                homePage.clickMenu('Transactions');
                homePage.clickMenu('Chargeback');
                chargebackPage.checkUrl('/transaction/chargeback/list');
                chargebackPage.checkPageTitle('Chargeback');

                //Go to menu Projects -> not available without verification
                homePage.clickMenu('Projects');
                projectPage.checkUrl('/projects/list');
                projectPage.checkPageTitle('Projects');
                projectPage.checkWidgetBlock();
                projectPage.checkButtonExist(' Add new ');
                projectPage.checkButtonStatus(' Add new ', 'active');
                projectPage.clickButton(' Add new ');
                projectPage.checkUrl('/need-verification/projects');
                projectPage.checkSectionTitle('Projects list');
                projectPage.checkInfoText(textInfo.noVerificationBlock);
                projectPage.checkButtonExist('Complete verification');
                projectPage.checkButtonStatus('Complete verification', 'active');

                //Go to sub menu REST -> not available without verification
                homePage.clickMenu('Projects');
                homePage.clickMenu('REST');
                projectPage.checkUrl('/need-verification/projects');
                projectPage.checkSectionTitle('Projects list');
                projectPage.checkInfoText(textInfo.noVerificationBlock);
                projectPage.checkButtonExist('Complete verification');
                projectPage.checkButtonStatus('Complete verification', 'active');

                //Go to sub menu JWT Tokens -> redirect to list of tokens
                homePage.clickMenu('Projects');
                homePage.clickMenu('JWT Tokens');
                projectPage.checkUrl('/projects/jwt-token');
                projectPage.checkPageTitle('JWT Tokens');
                projectPage.checkSectionBlock(sub_Title.jwtToken);
                projectPage.checkImportantText(textInfo.jwtTokenPage);
                projectPage.checkButtonExist('Add new token');
                projectPage.checkButtonStatus('Add new token', 'active');

                //Go to sub menu Certificate -> redirect to certificate page
                homePage.clickMenu('Projects');
                homePage.clickMenu('Certificate');

                projectPage.closeAlert();

                projectPage.checkUrl('/projects/certificate');
                projectPage.checkPageTitle('Certificate');
                projectPage.checkImportantText(textInfo.certificatePage);
                projectPage.checkButtonExist('Generate new certificate');
                projectPage.checkButtonStatus('Generate new certificate', 'active');
                projectPage.checkSubTitle(sub_Title.certificate);

                //Go to menu IPN -> redirect to IPN settings'
                homePage.clickMenu('IPN');
                ipnPage.checkUrl('/ipn/checkouts');
                ipnPage.checkPageTitle('IPN settings');
                ipnPage.checkTabList();
                ipnPage.checkModuleAddAnIPN();

                //checkRouterLink
                //Reports

                //Go to menu Exchange -> not available without verification   ///////////////////////////////
                homePage.clickMenu('Exchange');
                cy.wait(1000);
                exchangePage.checkUrl('/need-verification/exchange');
                exchangePage.checkButtonExist('Complete verification');
                exchangePage.checkButtonStatus('Complete verification', 'active');

                //Go to menu Verification -> redirect to Start Company Verification
                homePage.clickMenu('Verification');
                cy.wait(1000);
                verificationPage.checkUrl('/v2-verification/company/start-page');
                verificationPage.checkButtonExist('Go to business verification');
                verificationPage.checkButtonStatus('Go to business verification', 'active');

                //Go to menu Partner program -> not available without verification
                homePage.clickMenu('Partner program');
                cy.wait(1000);
                affiliatePage.checkUrl('/need-verification/affiliate');
                affiliatePage.checkButtonExist('Complete verification');
                affiliatePage.checkButtonStatus('Complete verification', 'active');

                //Go to menu Settings -> redirect to Setting Form
                homePage.clickMenu('Settings');
                cy.wait(2000);
                settingsPage.checkUrl('/settings/settings-form');
                cy.wait(1000);
                settingsPage.checkPageTitle('Settings');
            })
        })