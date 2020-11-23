import loginPage from "../../elements/LoginPage";
import homePage from "../../elements/HomePage";
import projectsPage from "../../elements/ProjectsPage";
import project from "../../fixtures/project";
import feenPage from "../../elements/FeenPage";
import parentPage from "../../elements/ParentPage";

describe('Create project suit', () => {

    beforeEach('Merchant Login', () => {
        loginPage.visit('/');
        loginPage.getAuthorization();
    });

        //As a client, I want to create a project in my personal account to receive API keys
        //in order to integrate my business with the PayDo platform.

        it("Create project, all required fields are filled", () => {

            let today = new Date();
            let time = today.getHours () + '_'  + today.getMinutes () + '_' + today.getSeconds();

            loginPage.getButtonToAdminPanel().click();
            cy.wait(2000);
            homePage.getCheckUrl();
            cy.wait(2000);
            homePage.getMenuProjects().click();
            cy.wait(2000);
            parentPage.getButton('Add new').click();
            projectsPage.attachLogo();
            projectsPage.getInputProjectName().type(project.name + " " + time);
            projectsPage.getInputSite().type(project.site + time);
            projectsPage.getInputDescription().type(project.description);
            projectsPage.getInputCallback().type(project.callback_IPN);
            projectsPage.getInputMinTransactionAmount().type(project.min_tr_amount);
            projectsPage.getInputAverageTransactionAmount().type(project.avg_tr_amount);
            projectsPage.getInputMaxTransactionAmount().type(project.max_tr_amount);
            projectsPage.getInputExpectedMonthlyVolume().type(project.exp_monthly_volume);
            parentPage.getButton( 'Send for verification' ).click();
            parentPage.closeAlert();
            projectsPage.checkCreateProject();
            projectsPage.checkStatusProject(0);
            projectsPage.acceptProject();
            feenPage.addProjectToMid();
        });


        it("Required fields are empty", () => {

            loginPage.getButtonToAdminPanel().click();
            cy.wait(2000);
            homePage.getCheckUrl();
            cy.wait(2000);
            homePage.getMenuProjects().click();
            cy.wait(2000);
            parentPage.getButton(' Add new ').click();
            for(let i = 0; i < 6; i++) {
                let number = project.number_input[i];
                projectsPage.getInput(number).click();
                projectsPage.clickOutsideElement();
                projectsPage.checkAlert(i,' Field is required ');
            }
        });


        it("Verifier team rejects project verification", () => {

            let today = new Date();
            let time = today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds();

            loginPage.getButtonToAdminPanel().click();
            cy.wait(2000);
            homePage.getCheckUrl();
            cy.wait(2000);
            homePage.getMenuProjects().click();
            cy.wait(2000);
            parentPage.getButton(' Add new ').click();
            projectsPage.attachLogo();
            projectsPage.getInputProjectName().type(project.name + " " + time);
            projectsPage.getInputSite().type(project.site + time);
            projectsPage.getInputDescription().type(project.description);
            projectsPage.getInputCallback().type(project.callback_IPN);
            projectsPage.getInputMinTransactionAmount().type(project.min_tr_amount);
            projectsPage.getInputAverageTransactionAmount().type(project.avg_tr_amount);
            projectsPage.getInputMaxTransactionAmount().type(project.max_tr_amount);
            projectsPage.getInputExpectedMonthlyVolume().type(project.exp_monthly_volume);
            parentPage.getButton(' Send for verification ').click();
            projectsPage.checkCreateProject();
            parentPage.closeAlert();
            projectsPage.checkStatusProject(0);
            projectsPage.rejectProject();
            homePage.getMenuProjects().click();
            cy.wait(2000);
            projectsPage.checkStatusProjectUI(' Rejected ');
        });


});