import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import ticketsPage from "../../../pages/TicketsPage";
import ticket from "../../../fixtures/Stage/ticket.json";
import merchant from "../../../fixtures/Stage/merchant.json";
import feenPage from "../../../pages/FeenPage"

    describe('Merchant account', () => {

        it('Create ticket', () => {
            loginPage.visit('/');
            loginPage.loginWithCred(merchant.email, merchant.password);
            loginPage.enter2FACode(merchant.authenticator);
            cy.wait(3000);

            homePage.checkUrl('/en/overview');
            homePage.clickMenuTickets();
            cy.wait(2000);

            ticketsPage.checkUrl('tickets/list');
            ticketsPage.clickButtonCreateNewTicket();
            ticketsPage.enterTextInToInputRequestName(ticket.request_name);
            ticketsPage.selectTopic(ticket.department_1);
            ticketsPage.enterTextInToInputQuestion(ticket.question);
            ticketsPage.attachFile("2.jpeg");
            cy.wait(2000);
            ticketsPage.clickButtonSendTicket();
            ticketsPage.checkCreateTicket();
            ticketsPage.closeAlert();

            feenPage.closeTicket();
        });

    })

