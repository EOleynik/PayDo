

class PaymentPage{


    getRadioInputLinkCard() {
        //return cy.get('[class="mat-radio-button checkout-user-cards__list_link-card mat-accent"]');
        //return cy.get('#mat-input-18');
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

    getInputCatdholderName() {
        return cy.get('#mat-input-19');
    }

    getButtonPay() {
        return cy.get('[class="mat-focus-indicator button-simple checkout-pay-button mat-raised-button mat-button-base"]');
    }
}

export default new PaymentPage();