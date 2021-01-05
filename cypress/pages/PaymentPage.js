import merchant from "../fixtures/merchant";
import checkout from "../fixtures/checkout";
import parentPage from "../pages/ParentPage";
import loginPage from "../pages/LoginPage";

class PaymentPage {

    clickButton(name) {
        parentPage.clickButton(name);
    }

    enterCardData() {
        parentPage.enterCardData()
    }

    getInputCardNumber() {
        return cy.get('#mat-input-16');
    }

    getInputExpirationDate() {
        return cy.get('#mat-input-17');
    }

    getInputCVC() {
        return cy.get('#mat-input-18');
    }

    getInputCartdholderName() {
        return cy.get('#mat-input-19');
    }

    clickButtonPay() {
        cy.get('[class="mat-focus-indicator button-simple checkout-pay-button mat-raised-button mat-button-base"]').click();
    }

    selectPayCurrency() {
        cy.get('[class="mat-select-trigger ng-tns-c109-6"]').click();
        //cy.contains('span', merchant.main_currency).click();
        return cy.contains('span', checkout.pay_currency).click();
    }

    setCheckboxIwantToRegister() {
        cy.get('[class="mat-checkbox-inner-container"]').click();
    }

    setCheckboxPurchaseTerms() {
        cy.get('[class="mat-checkbox-inner-container"]').eq(1).click()
    }

    getLinkLogIn() {
        return cy.contains('Log in');
    }


    checkLogIn() {
        cy.get('body').then(($body) => {
            if ($body.text().includes('Already have an account?')) {

                cy.contains('a','Log in').click();
                cy.get("[formcontrolname=email]").type(merchant.email);
                cy.get("[formcontrolname=password]").type(merchant.password);
                cy.contains('span', ' Log in ').click();
                cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]')
                    .clear().type(parentPage.get2FACode(merchant.authenticator));



            } else {
            }
        })
    }

}


export default new PaymentPage();
