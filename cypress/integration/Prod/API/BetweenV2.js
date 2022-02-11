import parentPage from "../../../pages/ParentPage";
import feen from "../../../fixtures/Prod/feen.json";
import betweenWallets from "../../../fixtures/Prod/betweenWallets.json";
import merchants from "../../../fixtures/Prod/merchants.json";
import moneyTransferPage from "../../../pages/MoneyTransferPage";

var sender_account_type = 'business';
var recipient_account_type = 'business';
var amount_transfer = 0.3;
var admin_token;
var sender_token;
var recipient_token;
var wallet_for_transfer = 'EUR';

describe('Between Wallets suit API', () => {

    before(() => {

        // рандомно выбираем тип аккаунта отправителя ( 1 = персональный, 2 - бизнесс)
        //sender_account_type = parentPage.getRandomAccountType(1, 2);

        // рандомно выбираем тип аккаунта получателя ( 1 = персональный, 2 - бизнесс)
        //recipient_account_type = parentPage.getRandomAccountType(1, 2);

        // рандомно выбираем кошелек с которого будет осуществлен перевод
        //wallet_for_transfer = parentPage.getRandomWallet(0, (betweenWallets.wallets.length - 1));

        // рандомно получаем сумму перевода
        //amount_transfer = parentPage.getRandomAmountTransfer(0, 0.5);

        // получить токен админа
        parentPage.getTokenUser('admin', feen.email, feen.password, feen.authenticator);
        cy.readFile("cypress/fixtures/Prod/Helpers/admin_business_headers.json").then((data) => {
            admin_token = data.token

            // получить токен отправителя
            if(sender_account_type === 'business') {
                parentPage.getTokenUser('sender', merchants.email_2, merchants.password_2, merchants.authenticator_2)
            } else {
                parentPage.getTokenUser('sender', merchants.email_2, merchants.password_2, merchants.authenticator_2, 1)
            }
            cy.readFile("cypress/fixtures/Prod/Helpers/sender_" + sender_account_type + "_headers.json").then((data) => {
                sender_token = data.token

                // получить токен получателя
                if(sender_account_type === 'business') {
                    parentPage.getTokenUser('recipient', merchants.email_4, merchants.password_4, merchants.authenticator_4)
                }else {
                    parentPage.getTokenUser('recipient', merchants.email_4, merchants.password_4, merchants.authenticator_4, 1)
                }
                cy.readFile("cypress/fixtures/Prod/Helpers/sender_" + recipient_account_type + "_headers.json").then((data) => {
                    recipient_token = data.token

                    cy.log('sender account type', sender_account_type)
                    cy.log('recipient account type', recipient_account_type);
                    cy.log('wallet for transfer', wallet_for_transfer);
                    cy.log('amount transfer', amount_transfer);

                })
            })
        })
    })

    it('Between Wallets math, ////////////////////////', () => {

        // получить комиссию за перевод (tr_type=13, PM 204)
        parentPage.getCommissionForTransfer(amount_transfer, wallet_for_transfer, 13, 511, 204, admin_token);

        // получить все available балансы отправителя
        parentPage.getAllAvailableBalances('sender', sender_account_type, betweenWallets.wallets);

        // recalculation доступных балансов отправителя и получение большего баланса
        moneyTransferPage.getMaxAvailableBalanceAfterRecalculation(wallet_for_transfer, 'sender', sender_account_type, admin_token)

        // получить available баланс отправителя в валюте wallet_for_transfer
        parentPage.getAvailableBalance('sender', sender_account_type, wallet_for_transfer);

        // получить available баланс получателя в валюте wallet_for_transfer
        parentPage.getAvailableBalance('recipient', recipient_account_type, wallet_for_transfer);

        // create Transfer
        moneyTransferPage.createTransfer(amount_transfer, wallet_for_transfer, merchants.authenticator_2, merchants.account_4);

        // проверка баланса отправителя
         moneyTransferPage.checkAvailableSenderWallets('sender', sender_account_type, amount_transfer,  wallet_for_transfer, admin_token,
             sender_token);

        // проверка баланса получателя
        //moneyTransferPage.checkAvailableRecipientWallet('recipient', recipient_account_type, wallet_for_transfer, amount_transfer);







        // moneyTransferPage.getAvailableBalanceWalletAfterRecalculation(betweenWallets.wallet_null, 'sender', 'business');
        //
        // moneyTransferPage.checkAvailableSenderWallet_2('sender', 'business', betweenWallets.amount_transfer);
        // moneyTransferPage.checkAvailableRecipientWallet('recipient', 'business', betweenWallets.wallet_null, betweenWallets.amount_transfer);
    })

})

