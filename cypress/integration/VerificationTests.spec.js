import loginPage from "../elements/LoginPage";
import user from "../fixtures/user.json";
import homePage from "../elements/HomePage";
import persVerPage from "../elements/PersVerPage";
import businessVerPage from "../elements/BusinessVerPage";

    describe('Verifications suit', () => {

        beforeEach('', () => {
            loginPage.visit('/');
            loginPage.getAuthorization()
        })

        describe('Login and Personal Verification', () => {

            it('Are you US person or you do business incorporated in US', () => {

                loginPage.getButtonToAdmibPanel().click();
                homePage.getCheckUrl()
                homePage.getMenuVerification().click();
                cy.wait(1000)
                homePage.getSubmenuPersonal().click();
                persVerPage.getCheckUrl();
                persVerPage.getRadioInputUSA().click();
                persVerPage.isElementDisplayed();
                //persVerPage.sendMainInformationPersonalDocuments()
            })

            it('Personal Verification', () => {

                loginPage.getButtonToAdmibPanel().click();
                persVerPage.sendMainInformationPersonalDocuments();
                persVerPage.sendRequestIban();
            })

            it.only('Business Verification', () => {
                loginPage.getButtonToAdmibPanel().click();
                businessVerPage.sendCompanyInfo();
                businessVerPage.sendRequestIban();
           })

        })
    })








        // loginPage.visit('/');
        // loginPage.getEmailField().type(user.email);
        // loginPage.getPasswordField().type(user.password);
        // loginPage.getButtonLogin().click();
        // loginPage.getAuthCode().type(user.authCode);
        //
        // cy.wait(2000);
        // homePage.getCheckUrl();
        // cy.wait(2000);
        // //homePage.getChangeAccount();
        // homePage.getMenuVerification().click();
        // cy.wait(2000);
        // homePage.getSubmenuPersonal().click();
        // persVerPage.getCheckUrl();
        // persVerPage.getFullNameField().type('Jack Jonson');
        // persVerPage.getBirthdayField();      // type('2000.02.02');
        // persVerPage.getPassportField().type('CV123456')
        // persVerPage.getCheckboxPassportWithoutExpirationDate().click();
        // persVerPage.getCheckBoxMyAddressIsDisplayedOnThePassport().click();
        // persVerPage.getChoiceCountry();
        // persVerPage.getCityField().type('Avoca');
        // persVerPage.getZIPField().type('12345');
        // persVerPage.getAddressField().type('78 Canberra Avenue, Griffith, ACT 2603');
        // persVerPage.getCheckBoxTermsAndConditions().click();
        // persVerPage.getButtonNext().click();
        //
         //persVerPage.getUploadYourself();
        // persVerPage.getUpload();




