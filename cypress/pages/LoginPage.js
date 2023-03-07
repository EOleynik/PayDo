import merchant from "../fixtures/Stage/merchant.json";
import parentPage from "../pages/ParentPage";


const blockError = 'div[class="ng-tns-c410-0 ng-trigger ng-trigger-alertFade alert alert-danger ng-star-inserted"]'
const error = 'The username or password you entered is incorrect'
const error2FA = 'Invalid two-factor authentication code'

class LoginPage {

    visit() {
        cy.visit('/en/auth/login');
    }

    checkUrl(Url) {
        parentPage.checkUrl(Url);
    }

    enterTextInToInputEmail(text) {
        parentPage.getInput('email').clear().type(text);
    }

    enterTextInToInputPassword(text) {
        parentPage.getInput('password').clear().type(text);
    }

    clickButton(name) {
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
        parentPage.getLogin(email, password);
    }

    enter2FACode(authenticator) {
        cy.get('[class="d-block"]').type(parentPage.get2FACode(authenticator));
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

    remove_captcha() {
        cy.window().then(
            window => console.log(window.localStorage.setItem('disable-captcha\', true'))
        );
    }

    checkAuthorizationAndLogin(email, password, authenticator) {
        cy.get('body').then(($body) => {
            cy.wait(1000);
            if ($body.text().includes('Continue')) {
                cy.contains('Change account ').click();
                cy.wait(1000);
                authenticator ? parentPage.getLoginWithAuth(email, password, authenticator) : parentPage.getLogin(email, password)
            } else {
                authenticator ? parentPage.getLoginWithAuth(email, password, authenticator) : parentPage.getLogin(email, password)
            }
        })
    }

    chooseAccountType(type) {
        parentPage.chooseAccountType(type)
    }

    chooseRandomAccountType() {
        cy.writeFile("cypress/fixtures/Prod/Helpers/randomAccountType.json", {
            'accountType':parentPage.getRandomAccountType()
    })
    }

    clickRandomAccountType() {
        this.chooseRandomAccountType()
        cy.readFile("cypress/fixtures/Prod/Helpers/randomAccountType.json").then((data) => {
            let type = data.accountType;
            parentPage.chooseAccountType(type)
    })
    }

    isAlertExist() {
        parentPage.isBlockExist(blockError);
    }

    checkTextExist() {
        parentPage.isTextExist(blockError, error)
    }

    checkTextError2FAExist() {
        parentPage.isTextExist(blockError, error2FA)
    }
}


export default new LoginPage();