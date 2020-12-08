

class RestPage{


    getInputOrderID() {
        return cy.get('#mat-input-6');
    }

    getInputOrderAmount() {
        return cy.get('#mat-input-7');
    }

    getInputOrderCurrency() {
        return cy.get('#mat-input-8');
    }

    getInputOrderDescription() {
        return cy.get('#mat-input-9');
    }


    getInputResultUrl() {
        return cy.get('#mat-input-13');
    }


    getInputFailUrl() {
        return cy.get('#mat-input-14');
    }

    getInputProductUrl() {
        return cy.get('#mat-input-15')
    }

    getButtonGenerateConfig() {
        return cy.contains('span', 'Generate config ')
    }

    getButtonShowPaymentPage() {
        return cy.contains('span', 'Show payment page ')
    }
}


export default new RestPage();