import parentPage from "../pages/ParentPage"

class ReportPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(name) {
        parentPage.isPageTitleExist(name);
    }
}


export default new ReportPage();