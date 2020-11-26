
class ParentPage {

    closeAlert() {
        return cy.get ('.close-alert').click()
    }

    getButton(name) {
        return cy.contains('span',  name );
    }


}

export default new ParentPage();