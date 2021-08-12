import merchant from "../fixtures/Stage/merchant.json";
import parentPage from "../pages/ParentPage";
import feen from "../fixtures/Stage/feen.json";

class LoginPage {

    visit() {
        cy.visit('/en/auth/login');
    }

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    enterTextInToInputEmail(text) {
        parentPage.getInput('email').clear().type(text);
    }

    enterTextInToInputPassword(text) {
        parentPage.getInput('password').clear().type(text);
    }

    clickButton(name){
        parentPage.clickButton(name);
    }

    getEmailField() {
        return cy.get('#mat-input-0');
    }

    getPasswordField() {
        return cy.get('#mat-input-1');
    }

    getButtonLogin() {
        return cy.get('[class="mat-focus-indicator submit-btn login__submit mat-raised-button mat-button-base"');
    }

    loginWithCred(email, password) {
        parentPage.getLogin(email, password)
    }

    enter2FACode(authenticator) {
        cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]')
            .clear().type(parentPage.get2FACode(authenticator));
    }



    LoginOnPaymentPage() {
        cy.get("[formcontrolname=email]").type(merchant.email);
        cy.get("[formcontrolname=password]").type(merchant.password);
        cy.contains('span', ' Log in ').click();
        cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]')
            .clear().type(parentPage.get2FACode(merchant.authenticator));

    }

    getAuthCode() {
        return cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]');
    }

    getAuthorization() {
        window.localStorage.setItem('user-session', '{"id":"1812","email":"eugeniy.o+4avtotest@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTcxNTUyMjgsImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.joNZH9X5Eh06F1xU29qggzQ3R_Q0l4iwjbBeJPCSJSY","role":1,"moduleUrl":"profile","status":1,"type":2,"accountType":1,"availableAccounts":[{"id":"1812","personalInformation":{"email":"eugeniy.o+4avtotest@payop.com"},"systemInformation":{"role":1,"approvedStatus":0},"type":2,"status":1,"dateTime":{"createdAt":1597125347,"updatedAt":1597125608},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTcxNTUyMjksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.9eYpkbfS2lkGIp2b5PnoI-kHRMDZHF57lz4PfvfhP8c"},{"id":"1811","personalInformation":{"email":"eugeniy.o+4avtotest@payop.com"},"systemInformation":{"role":1,"approvedStatus":0},"type":1,"status":1,"dateTime":{"createdAt":1597125344,"updatedAt":1597125608},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTEiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNSIsInRpbWUiOjE1OTcxNTUyMjksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.LcTt4EXDESxtKfBPXxBTkcQBSaaKsQHHUY56hUkdnLw"}],"stayLogin":true,"isLoggedIn":true}')
    }

    getManagerAuthorization() {
        window.localStorage.setItem('user-session', '{"id":"1596","email":"eugeniy.o+m@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE1OTYiLCJhY2Nlc3NUb2tlbiI6ImE0YWViZTgyZDA3MmFjMzhhYTFjYWIyMiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTU5MCIsInRpbWUiOjE1OTk3NDg4MDUsImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOlsiUk9MRV9NQU5BR0VSIl0sInR3b0ZhY3RvciI6eyJwYXNzZWQiOnRydWV9fQ.BY9YQRClUBpc6rddkK9FraYd8sokSsU0IbzakFVhQnE","role":3,"moduleUrl":"manager","status":1,"type":2,"accountType":1,"availableAccounts":[],"stayLogin":true,"isLoggedIn":true}')
    }

    remove_captcha() {
        cy.window().then(
            window => console.log(window.localStorage.setItem('disable-captcha\', true'))
        );
    }


    checkAuthorization(email, password, authenticator) {
        cy.get('body').then(($body) => {
            if ($body.text().includes('Continue')) {
                cy.contains('Continue').click();
            } else {
                cy.get("[formcontrolname=email]").clear().type(email);
                cy.get("[formcontrolname=password]").clear().type(password);
                cy.contains('span', ' Login ').click();
                cy.wait(1000);
                cy.get('[class="d-block"]').type(parentPage.get2FACode(authenticator));
                cy.contains('span', ' Login ').click();
            }
        })
    }


}


export default new LoginPage();