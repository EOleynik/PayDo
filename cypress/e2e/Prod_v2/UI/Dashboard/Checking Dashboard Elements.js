//import loginPage from "../../../../pages/LoginPage";
import merchants from "../../../../fixtures/Prod/merchants.json";
import homePage from "../../../../pages/HomePage";
//import moment from "moment";
import parentPage from "../../../../pages/ParentPage";
//import boardStepper from "../../../../fixtures/Prod/boardStepper.json";


describe ('', () => {

    beforeEach(() => {
        // cy.visit('https://account.paydo.com/en/auth/login');
        // loginPage.checkUrl('/auth/login');
        // loginPage.checkAuthorizationAndLogin(merchants.email_8, merchants.password_8);
        // homePage.checkUrl('/overview');

        parentPage.loginWithAPI(merchants.user_8);
        homePage.checkUrl('/overview');

    })

    it('Business account not verified, 2FA not activated,', () => {
        cy.wait(1000);
        homePage.accountBarIsExist();

        homePage.checkAccountID(merchants.account_8)
        homePage.checkAccountType(merchants.acc_type_2_ui)
        homePage.checkAccountStatus('Unverified');
        homePage.checkButtonTitle(merchants.email_8);
        homePage.overlayPaneIsExist();

        homePage.checkPageTitle('What should you do next?');
        homePage.dashboardStepperIsExist();
        homePage.dashboardStepperHaveItems();
        homePage.checkStatusItems();
        homePage.checkTextItemBlocks();
        homePage.checkTitleSection2FA('2-Step Verification');
        homePage.text2FASectionIsExist();
        homePage.checkText2FASection();

        homePage.typeAuthenticatorIsExist('Google Authenticator app');
        homePage.checkProviderName('Google Authenticator app');
        homePage.providerLabelIsExist('Highly recommend');
        homePage.checkTextPanelBody();
        homePage.iconDownloadAppStoreIsExist();
        homePage.appStoreHaveLink();
        homePage.iconDownloadGooglePlayIsExist();
        homePage.googlePlayHaveLink();
        homePage.isButtonExist(' Activate Google Authenticator ');
        homePage.checkButtonStatus(' Activate Google Authenticator ' ,'active')

        homePage.typeAuthenticatorIsExist('One-time text code to your email');  //One-time text code
        homePage.checkProviderName('One-time text code');
        homePage.checkTextPanelBody2();
        homePage.isButtonExist(' Activate text code ');
        homePage.checkButtonStatus(' Activate text code ' ,'active')

        homePage.sectionBalancesIsExist();
        homePage.checkTitleSectionBalances('Wallets');
        homePage.checkClockTime();
        homePage.checkColumnHeadersBalancesSection();

        homePage.checkSectionCompleteBusinessVerification();
        homePage.checkTextTitleBusVer();
        homePage.checkHeadingTextSectionCompleteBusinessVerification();
        homePage.checkTextSectionCompleteBusinessVerification();
        homePage.isButtonExist(' Go to verification ');
        homePage.checkButtonStatus(' Go to verification ', 'active' )
        homePage.isButtonExist(' Pricing for business ');
        homePage.checkButtonStatus(' Pricing for business ', 'active' )

        homePage.checkSectionAddCard();
        homePage.checkTextSectionAddCard();
        homePage.isButtonExist(' Add Card ');
        homePage.checkButtonStatus(' Add Card ', 'active');
        homePage.buttonAddCardHaveLink();

        homePage.checkSectionTopUpWallet();
        homePage.checkTextSectionTopUpWallet();
        homePage.isButtonExist(' Top up ');
        homePage.checkButtonStatus(' Top up ', 'active');
        homePage.buttonTopUpHaveLink();
    })


})