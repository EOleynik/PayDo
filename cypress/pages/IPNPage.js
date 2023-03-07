import parentPage from "../pages/ParentPage"

class IPNPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(name) {
        parentPage.isPageTitleExist(name);
    }
}


export default new IPNPage();