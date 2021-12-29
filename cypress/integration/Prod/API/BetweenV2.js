import parentPage from "../../../pages/ParentPage";
import feen from "../../../fixtures/Prod/feen.json";
import betweenWallets from "../../../fixtures/Prod/betweenWallets.json";
import merchants from "../../../fixtures/Prod/merchants.json";
import moneyTransferPage from "../../../pages/MoneyTransferPage";

describe('Between Wallets suit API', () => {

    before(() => {
        parentPage.getTokenUser('admin', feen.email, feen.password, feen.authenticator);
        parentPage.getTokenUser('sender', merchants.email_2, merchants.password_2, merchants.authenticator_2);
        parentPage.getTokenUser('recipient', merchants.email_4, merchants.password_4, merchants.authenticator_4);
    })

    it('Between Wallets math, ////////////////////////', () => {
        parentPage.getCommissionForTransfer(betweenWallets.amount_transfer, betweenWallets.wallet_null, 13, 511,204);
        parentPage.getAllAvailableBalances('sender', 'business', betweenWallets.wallets);
        parentPage.getAvailableBalance('sender', 'business', betweenWallets.wallet_null);
        parentPage.getAvailableBalance('recipient', 'business', betweenWallets.wallet_null);

        moneyTransferPage.createTransfer(betweenWallets.amount_transfer, betweenWallets.wallet_null, merchants.authenticator_2, merchants.account_4);
        moneyTransferPage.getAvailableBalanceWalletAfterRecalculation(betweenWallets.wallet_null, 'sender', 'business');

        moneyTransferPage.checkAvailableSenderWallet_2('sender', 'business', betweenWallets.amount_transfer);
        moneyTransferPage.checkAvailableRecipientWallet('recipient', 'business', betweenWallets.wallet_null, betweenWallets.amount_transfer);
    });


})
