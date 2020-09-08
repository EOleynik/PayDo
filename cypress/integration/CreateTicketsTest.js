
import loginPage from "../elements/LoginPage";
import homePage from "../elements/HomePage";
import ticketsPage from "../elements/TicketsPage"
import ticket from "../fixtures/ticket"
import merchant from "../fixtures/merchant"

describe('Ticket suit ', () => {

    describe('Merchant', () => {

        it('Create ticket', () => {
            loginPage.visit('/');
            loginPage.getAuthorization();
            loginPage.getButtonToAdmibPanel().click();
            cy.wait(2000);
            homePage.getCheckUrl();
            cy.wait(2000);
            homePage.getMenuTickets().click();
            ticketsPage.getButtonCreateNewTicket().click();
            ticketsPage.getInputRequestName().type(ticket.request_name);
            ticketsPage.selectTopic();
            ticketsPage.getInputQuestion().type(ticket.question);
            //ticketsPage.getButtonSelectFile().click()
            ticketsPage.getButtonSendTicket().click();
            ticketsPage.checkCreateTicket()
            ticketsPage.closeAllert().click();
        })

    })

    describe('Financial', () => {

        it('Create ticket', () => {
            loginPage.visitAdmin();
            loginPage.getFeenAuthorization();
            loginPage.getButtonToAdmibPanel().click();
            cy.wait(2000);
            homePage.getMenuTickets().click();
            ticketsPage.getButtonCreateNewTicket().click();
            ticketsPage.getInputMerchantID().type(merchant.bussiness_account);
            ticketsPage.getInputRequestNameFin().type(ticket.request_name);
            ticketsPage.selectTopicFin();
            ticketsPage.getInputQuestion().type(ticket.question);
            //ticketsPage.getButtonSelectFile().click()
            ticketsPage.getButtonSendTicket().click();
            ticketsPage.checkCreateTicketFin();
            ticketsPage.closeAllertFin().click();
        })
    })

    // describe('Manager', () => {
    //
    //     it('Create ticket', () => {
    //
    //         loginPage.visitAdmin();
    //         loginPage.getManagerAuthorization();
    //         loginPage.getButtonToAdmibPanel().click();
    //         cy.wait(2000);
    //         homePage.getMenuTickets().click();
    //         // ticketsPage.getButtonCreateNewTicket().click();
    //         // ticketsPage.getInputMerchantID().type(merchant.bussiness_account);
    //         // ticketsPage.getInputRequestNameFin().type(ticket.request_name);
    //         // ticketsPage.selectTopicFin();
    //         // ticketsPage.getInputQuestion().type(ticket.question);
    //         // //ticketsPage.getButtonSelectFile().click()
    //         // ticketsPage.getButtonSendTicket().click();
    //         // ticketsPage.checkCreateTicketFin();
    //         // ticketsPage.closeAllertFin().click();
       //})
    //})

})

