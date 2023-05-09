import parentPage from "./ParentPage";

const pageTitle = '.page-title';

class PendingTransfersPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title, pageTitle);
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }

}

export default new PendingTransfersPage();