

class PaymentPage{

    getInputCardNumber() {
        return cy.get('#mat-input-16');
    }

    getInputExpirationDate() {
        return cy.get('#mat-input-17');
    }

    getInputCVC() {
        return cy.get('#mat-input-18');
    }

    getInputCatdholderName() {
        return cy.get('#mat-input-19');
    }

    getButtonPay() {
        return cy.get('[class="mat-focus-indicator button-simple checkout-pay-button mat-raised-button mat-button-base"]');
    }

    getSelectCurrency() {
         cy.get('.mat-select-value-text > .ng-tns-c140-42').click()
       return cy.get ('#mat-option-335 > .mat-option-text').click()
    }
}

export default new PaymentPage();