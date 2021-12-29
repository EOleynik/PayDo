import parentPage from "../../../pages/ParentPage";
import merchants from "../../../fixtures/Prod/merchants.json";
import feen from "../../../fixtures/Prod/feen.json";
import exchange from "../../../fixtures/Prod/exchange.json";
import moneyTransferPage from "../../../pages/MoneyTransferPage";

describe("Exchange API", () => {

    before(function()  {
        parentPage.getTokenUser('sender', merchants.email_2, merchants.password_2, merchants.authenticator_2);
        parentPage.getTokenUser('admin', feen.email, feen.password, feen.authenticator);
        parentPage.getAvailableBalance('sender', 'business',  exchange.from);
        parentPage.getAvailableBalance('sender', 'business', exchange.to);
        parentPage.getRate("exchange", exchange.from, exchange.to);
        parentPage.getBaseCommission(exchange.amount_exchange, exchange.from ,10, 511);
    })

    it('Exchange math', () => {

        moneyTransferPage.createExchange('sender', 'business', exchange.amount_exchange, exchange.from, exchange.to);
        moneyTransferPage.checkAvailableBalanceFromWallet('sender', 'business', exchange.from, exchange.amount_exchange)
        moneyTransferPage.checkAvailableBalanceToWallet('sender', 'business', exchange.to, exchange.amount_exchange)
    })
})