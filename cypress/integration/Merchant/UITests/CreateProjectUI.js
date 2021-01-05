import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import projectsPage from "../../../pages/ProjectsPage";
import project from "../../../fixtures/project";
import feenPage from "../../../pages/FeenPage";
import parentPage from "../../../pages/ParentPage";
import merchant from "../../../fixtures/merchant";

describe('Create project suit', () => {

    beforeEach('Merchant Login', () => {
        loginPage.visit('/');
        loginPage.loginWithCred(merchant.email, merchant.password);
        loginPage.enter2FACode(merchant.authenticator);
        cy.wait(8000);
    });

    it("Verifier team rejects project verification", () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuProjects();
        cy.wait(3000);
        homePage.clickButtonAddNew();

        projectsPage.checkUrl('/projects/create');
        projectsPage.attachLogo();
        projectsPage.enterTextInToInput('name', project.name + " " + parentPage.getTime());
        projectsPage.enterTextInToInput('site', project.site + parentPage.getTime());
        projectsPage.enterTextInToInput('info', project.description);
        projectsPage.enterTextInToInput('ipn', project.callback_IPN);
        projectsPage.enterMinTransactionAmount(project.min_tr_amount);
        projectsPage.enterAverageTransactionAmount(project.avg_tr_amount);
        projectsPage.enterMaxTransactionAmount(project.avg_tr_amount);
        projectsPage.enterExpectedMonthlyVolume(project.exp_monthly_volume);
        projectsPage.clickButton('Send for verification');
        projectsPage.closeAlert();
        projectsPage.checkCreateProject();
        projectsPage.checkStatusProject(0);
        projectsPage.rejectProject();

        //homePage.checkUrl('/en/overview');
        homePage.clickMenuProjects();
        cy.wait(2000);

        projectsPage.checkUrl('/projects/list');
        projectsPage.checkStatusProjectUI(' Not Verified ');
    });

    it("Required fields are empty", () => {

            homePage.checkUrl('/en/overview');
            homePage.clickMenuProjects();
            cy.wait(3000);
            homePage.clickButtonAddNew();

            projectsPage.checkUrl('/projects/create');
            projectsPage.checkValidationField();
        });

    it("Create project, all required fields are filled", () => {

        homePage.checkUrl('/en/overview');
        homePage.clickMenuProjects();
        cy.wait(3000);
        homePage.clickButtonAddNew();

        projectsPage.checkUrl('/projects/create');
        projectsPage.attachLogo();
        projectsPage.enterTextInToInput('name', project.name + " " + parentPage.getTime());
        projectsPage.enterTextInToInput('site', project.site + parentPage.getTime());
        projectsPage.enterTextInToInput('info', project.description);
        projectsPage.enterTextInToInput('ipn', project.callback_IPN);
        projectsPage.enterMinTransactionAmount(project.min_tr_amount);
        projectsPage.enterAverageTransactionAmount(project.avg_tr_amount);
        projectsPage.enterMaxTransactionAmount(project.avg_tr_amount);
        projectsPage.enterExpectedMonthlyVolume(project.exp_monthly_volume);
        projectsPage.clickButton('Send for verification');
        projectsPage.closeAlert();
        projectsPage.checkCreateProject();
        projectsPage.checkStatusProject(0);
        projectsPage.acceptProject();

        feenPage.addProjectToMid();

    });


});