import parentPage from "../pages/ParentPage"

const pageTitleElement = 'h1.page-title';

class MoneyTransferPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title, pageTitleElement)
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }
}


export default new MoneyTransferPage();