class MainPage {

    visit() {
        cy.visit('/');
    }

    getLoginButton() {
        return cy.get('[class="login-btn"]');
    }

    getAcceptCookieButton() {
        return cy.get('[class="cookie__accept-btn"]');
    }


    getButtonStartNow() {
        return cy.get('[class="purple-btn purple-btn_margin btn-s-181"]');
    }




}


export default new MainPage();