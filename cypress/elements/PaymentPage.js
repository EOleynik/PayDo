

class PaymentPage{

    getInputCardNumber() {
        return cy.get('#mat-input-0');
    }

    getInputExpirationDate() {
        return cy.get('#mat-input-1');
    }

    getInputCVC() {
        return cy.get('#mat-input-2');
    }

    getInputCatdholderName() {
        return cy.get('#mat-input-3');
    }

    getButtonPay() {
        return cy.get('[class="mat-focus-indicator button-simple checkout-pay-button mat-raised-button mat-button-base"]');
    }

    getSelectCurrency() {
         cy.get('.mat-select-value-text > .ng-tns-c107-5').click()
       return cy.get ('#mat-option-1 > .mat-option-text').click()
    }
}

export default new PaymentPage();
