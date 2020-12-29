import moneyTransferPage from "../../../pages/MoneyTransferPage";
import withdrawPage from "../../../pages/WithdrawPage"

describe('Withdraw math', () => {

    it('Withdraw math', () => {
        moneyTransferPage.createWithdrawAndCheckMath();
        withdrawPage.rejectWithdraw();
    });

})