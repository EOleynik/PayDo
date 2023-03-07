import parentPage from "../pages/ParentPage"

class BankDetailsPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(name) {
        parentPage.isPageTitleExist(name);
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }
}


export default new BankDetailsPage();