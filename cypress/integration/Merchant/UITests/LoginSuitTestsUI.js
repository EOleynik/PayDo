import loginPage from "../../../pages/LoginPage";
import parentPage from "../../../pages/ParentPage";
import homePage from "../../../pages/HomePage";
import merchant from "../../../fixtures/Stage/merchant.json";

 describe ('Login suit UI ', () => {

     it('Login with valid data', () => {
         loginPage.visit();
         loginPage.enterTextInToInputEmail(merchant.email);
         loginPage.enterTextInToInputPassword(merchant.password);
         loginPage.clickButton(' Login ');
         loginPage.enter2FACode(merchant.authenticator);

         cy.wait(3000);
         parentPage.checkUrl('/en/overview');
         homePage.checkMerchantID(merchant.bussiness_account);
     });
     
 })