
class ParentPage {

    closeAlert() {
        return cy.get ('.close-alert').click()
    }

    getButton(name) {
        return cy.contains('span',  name );
    }

    getMenu(name) {
        return cy.contains(name);
    }

    getSubMenu(name) {
        return cy.contains ('p', name);
    }

}

export default new ParentPage();