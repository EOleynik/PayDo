import loginPage from "../../pages/LoginPage";
import homePage from "../../pages/HomePage";
import ticketsPage from "../../pages/TicketsPage";
import ticket from "../../fixtures/ticket";
import merchant from "../../fixtures/merchant";
import manager from "../../fixtures/manajer";
import feen from "../../fixtures/feen";

    describe('Create ticket admin panels', () => {

        it.only('Create ticket, Manager panel', () => {

            cy.visit('https://admin.stage.paydo.com');
            // loginPage.loginWithCred(manager.email, manager.pass);
            // loginPage.enter2FACode(manager.authenticator);
            cy.wait(3000);

            homePage.checkUrl('https://admin.stage.paydo.com');
            homePage.clickMenuTickets();

            ticketsPage.checkUrl('https://admin.stage.paydo.com/en/tickets/list');
            ticketsPage.clickButtonCreateNewTicket();
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
            loginPage.loginWithCred(feen.email, feen.pass);
            loginPage.enter2FACode(feen.authenticator);
            cy.wait(3000);

            homePage.checkUrl('https://admin.stage.paydo.com');
            homePage.clickMenuTickets();
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



