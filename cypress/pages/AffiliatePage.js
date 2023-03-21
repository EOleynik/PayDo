import parentPage from "../pages/ParentPage"

class AffiliatePage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(name) {
        parentPage.isPageTitleExist(name);
    }

    checkButtonExist(button_name) {
        parentPage.isButtonExist(button_name);
    }

    checkButtonStatus(name, status) {
        parentPage.getButtonStatus(name, status)
    }


}


export default new AffiliatePage();