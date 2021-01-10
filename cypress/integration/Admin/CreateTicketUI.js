import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";
import ticketsPage from "../../pages/TicketsPage";
import ticket from "../../fixtures/ticket";
import merchant from "../../fixtures/merchant";
import feen from "../../fixtures/feen";
import manajer from "../../fixtures/manajer";

    describe('Create ticket admin panels', () => {

        it('Create ticket, Manager panel', () => {

            cy.visit('https://admin.stage.paydo.com');
            cy.wait(2000);
            loginPage.checkAuthorization(manajer.email, manajer.pass, manajer.authenticator);
            cy.wait(3000);

            homePage.checkUrl('https://admin.stage.paydo.com');
            homePage.clickMenuTickets();
            cy.wait(1000);

            ticketsPage.checkUrl('https://admin.stage.paydo.com/tickets/list');
            ticketsPage.clickButtonCreateNewTicket();
            cy.wait(1000);
            ticketsPage.enterTextInToInputUserID(merchant.bussiness_account);
            ticketsPage.enterTextInToInputRequestName(ticket.request_name);
            ticketsPage.selectTopicMan(ticket.department_2);
            ticketsPage.enterTextInToInputQuestion(ticket.question);
            ticketsPage.attachFile("2.jpeg");
            cy.wait(2000);
            ticketsPage.clickButtonSendTicket();
            ticketsPage.checkCreateTicketFin();
            ticketsPage.closeAlert();
        });

        it('Create ticket, Feen panel', () => {
            cy.visit('https://admin.stage.paydo.com/en/auth/login');
            cy.wait(2000);
            loginPage.checkAuthorization(feen.email, feen.pass, feen.authenticator);
            cy.wait(3000);

            homePage.checkUrl('https://admin.stage.paydo.com');
            homePage.clickMenuTickets();
            cy.wait(1000);

            ticketsPage.checkUrl('https://admin.stage.paydo.com/tickets/list');
            ticketsPage.clickButtonCreateNewTicket();
            ticketsPage.enterTextInToInputUserID(merchant.bussiness_account);
            ticketsPage.enterTextInToInputRequestName(ticket.request_name);
            ticketsPage.selectTopicFin(ticket.department_3);
            ticketsPage.enterTextInToInputQuestion(ticket.question);
            ticketsPage.attachFile("2.jpeg");
            cy.wait(2000);
            ticketsPage.clickButtonSendTicket();
            ticketsPage.checkCreateTicketFin();
            ticketsPage.closeAlert();
        })

    });



