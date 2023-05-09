import parentPage from "../pages/ParentPage";
import tabLink from "../fixtures/Prod/tabLink.json";

const pageTitleElement = '.ngp-breadcrumbs'
const tab_Links = '.mat-tab-link';


class IPNPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    checkPageTitle(title) {
        parentPage.isPageTitleExist(pageTitleElement);
        parentPage.checkText(title, pageTitleElement)
    }

    checkTabList() {
        for (let i = 0; i < tabLink.ipn.length; i++) {
            parentPage.isElementExist(tab_Links, i);
            parentPage.checkText(tabLink.ipn[i], tab_Links, i);
        }
    }

    checkSubTitle(title, element) {
        for (let i = 0; i < title.length; i++) {
            parentPage.checkText(title, element);
        }
    }

    checkModuleAddAnIPN() {
        this.checkSubTitle('Add an IPN','.fs-20');
        parentPage.checkText('You can add a new IPN in a few clicks',
            '#ipn > ipn-table-v2 > module-add-ipn > h4')
    }
}


export default new IPNPage();