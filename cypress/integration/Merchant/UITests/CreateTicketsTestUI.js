import loginPage from "../../../pages/LoginPage";
import homePage from "../../../pages/HomePage";
import ticketsPage from "../../../pages/TicketsPage";
import ticket from "../../../fixtures/ticket";
import merchant from "../../../fixtures/merchant";

    describe('Merchant account', () => {

        it('Create ticket', () => {
            loginPage.visit('/');
            loginPage.loginWithCred(merchant.email, merchant.password);
            loginPage.enter2FACode(merchant.authenticator);
            cy.wait(3000);

            homePage.checkUrl('/en/overview');
            homePage.clickMenuTickets();

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
        });

    })

