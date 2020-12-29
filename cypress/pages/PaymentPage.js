import merchant from "../fixtures/merchant";
import checkout from "../fixtures/checkout";
import parentPage from ".//ParentPage";
import loginPage from ".//LoginPage";

class PaymentPage {

    clickButton(name) {
        parentPage.getButton(name).click();
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
        cy.contains('span', merchant.main_currency).click();
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


}


export default new PaymentPage();
