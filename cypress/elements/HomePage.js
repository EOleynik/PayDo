

class HomePage{

    getCheckUrl() {
        return  cy.url().should('include', 'en/profile/overview');
    }

    getMenuVerification() {
        return cy.contains('Verification');
    }

    getChangeAccount() {
         cy.get('[class="acc-active__info_acc-type"]').click()
       return cy.contains('Personal account').click()
    }

    getSubmenuPersonal() {
        return cy.get('[class="mat-line mid-menu__li-text"]').contains('Personal')
    }


    getMenuProjects() {
        return cy.contains('Projects').click();
    }

    getSubMenuRest() {
        return cy.get(':nth-child(3) > .mid-menu > :nth-child(3) > .mid-menu__li-link > .mat-line').click();
    }

    getMenuPaymentHistory() {
        return cy.contains('Payments History');
    }
}

export default new HomePage();