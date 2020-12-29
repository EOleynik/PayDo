import loginPage from "../../../pages/LoginPage";
import parentPage from "../../../pages/ParentPage";
import homePage from "../../../pages/HomePage";
import merchant from "../../../fixtures/merchant";

 describe ('Login suit UI ', () => {

     it('Login with valid data', () => {
         loginPage.visit();
         loginPage.getEmailField().clear().type(merchant.email);
         loginPage.getPasswordField().clear().type(merchant.email);
         parentPage.clickButton(' Login ').click();
         loginPage.getAuthCode().clear().type(parseFloat(parentPage.get2FACode(merchant.authenticator)));
         cy.wait(3000);
         parentPage.checkUrl('/en/overview');
         homePage.checkMerchantID(merchant.bussiness_account);
     });
     
 })