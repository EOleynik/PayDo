import parentPage from "../pages/ParentPage"

class MoneyTransferPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title)
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }
}


export default new MoneyTransferPage();