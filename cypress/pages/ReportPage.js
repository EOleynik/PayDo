import parentPage from "../pages/ParentPage"

class ReportPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist();
        parentPage.checkText(title)
    }
}


export default new ReportPage();