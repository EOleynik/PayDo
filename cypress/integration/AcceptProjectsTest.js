import loginPage from "../elements/LoginPage";
import projectsPage from "../elements/ProjectsPage";

describe('Accept Projects', () => {

    // beforeEach('', () => {
    //     loginPage.visit('/');
    //     loginPage.getManageAuthorization();
    //     loginPage.getButtonToAdmibPanel().click()

    //})

    it('Accept Project', () => {
        projectsPage.acceptProject();
    })
})