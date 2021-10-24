import parentPage from "../pages/ParentPage"
import withdraw from "../fixtures/Stage/withdraw.json";
import merchant from "../fixtures/Stage/merchant.json";
import feen from "../fixtures/Stage/feen.json";
import betweenWallets from "../fixtures/Stage/betweenWallets.json";
import endpoints from "../fixtures/Stage/endpoints.json"
import merchants from "../fixtures/Prod/merchants.json";

let no_res = '.no-result';
let country_name = '.mat-option-text';

class MoneyTransferPage {

    checkUrl(Url) {
        parentPage.checkUrl(Url)
    }

    enterTextInToInputRecipient(recipient_account) {
        parentPage.getInput('recipient').clear().type(recipient_account);
    }

    enterTextInToInputAmount(amount_transfer) {
        parentPage.getInput('amount').clear().type(amount_transfer);
    }

    clickButtonProceed() {
        parentPage.clickButton('Proceed');
    }

    ConfirmationTransfer(button) {
        cy.contains(button).click();
    }

    clickButtonGoToMoneyTransferList() {
        parentPage.clickButton('Go to Money Transfers list')
    }

    clickButtonConfirmTransfer() {
        parentPage.clickButton('Confirm transfer');
    }

    clickTab(name) {
        parentPage.clickTab(name).click()
    }

    closeAlert() {
        parentPage.closeAlert()
    }

    enterTextInToInputIBAN(text) {
        parentPage.getInput('account').clear().type(text);
    }

    enterTextInToInputBeneficiaryName(text) {
        parentPage.getInput('name').eq(0).clear().type(text);
    }

    selectCountry(country_name) {
        cy.get('[class="withdraw-method__select"]').click();
        return cy.contains('span', country_name).click();
    }

    enterCountryAndCheckResult(country_name, blockCountry, message) {
        cy.get('[class="withdraw-method__select"]').click();
        for (let i = 0; i < country_name.length; i++) {
            cy.get('#mat-input-42').type(country_name[i])
            cy.wait(1000)
            for (let j = 0; j < blockCountry.length; j++) {
                if (parentPage.getCodeCountry(country_name[i]) === blockCountry[j]) {
                    this.checkMessageDisplay(message);
                } else {
                }
            }
            cy.get('#mat-input-42').clear()
        }
    }

    enterTextInToInputCity(text) {
        parentPage.getInput('city').eq(0).clear().type(text);
    }

    enterTextInToInputRecipientAdress(text) {
        parentPage.getInput('address').eq(0).clear().type(text);
    }

    enterTextInToInputBICCode(text) {
        parentPage.getInput('bic').clear().type(text);
    }

    enterTextInToInputBeneficiaryBank(text) {
        parentPage.getInput('name').eq(1).clear().type(text);
    }

    enterTextInToInputCityBeneficiaryBank(text) {
        parentPage.getInput('city').eq(1).clear().type(text);
    }

    enterTextInToInputAddressBeneficiaryBank(text) {
        parentPage.getInput('address').eq(1).clear().type(text);
    }

    enterTextInToInputPurposePayment(text) {
        parentPage.getInput('direction').clear().type(text);
    }

    InstallCheckboxPaymentNotCommercial() {
        cy.get('[class="mat-checkbox-inner-container"]').eq(0).click();
    }

    enterTextInToInputAmountToTransfer(amount) {
        parentPage.getInput('amount').clear().type(amount);
    }

    clickFieldAmountToBeCharged() {
        cy.get('[class="transfer-item__view"]').click();
    }

    getButtonConfirmTransfer() {
        return cy.get('.step-preview > .py-4 > .mat-focus-indicator > .mat-button-wrapper');
    }

    confirmTransferWith2FA(key) {
        cy.get('[class="d-flex justify-content-center ng-star-inserted"]').clear().type (parentPage.get2FACode(key))
    }

    chooseCurrencyWallet(wallet) {
        cy.get('[formcontrolname="wallet"]').click();
        cy.get('[class="mat-option-text"]').contains(wallet).click();
    }

    enterAuthCode(code) {
        cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]').clear().type(parentPage.get2FACode(code));
    }

    checkStatusWithdraw(message) {
        cy.get('.alert-text').invoke('text').should((text) => {
            let alert = (text);
            let error = alert.split(':', 1);
            expect(error.toString()).to.eq(message);
        });
    }

    checkTransferBetweenWallets(type, sender, recipient, amount, currency, commission) {
        cy.get(':nth-child(1) > .cdk-column-type > .bold').invoke('text').should((text) => {
            expect(text).to.eq(type);
        });
        cy.get('tbody > :nth-child(1) > .cdk-column-sender').invoke('text').should((text) => {
            expect(text).to.eq(sender);
        });
        cy.get('tbody > :nth-child(1) > .cdk-column-recipient').invoke('text').should((text) => {
            expect(text).to.eq(" ID: " + recipient);
        });
        cy.get(':nth-child(1) > .text-right > .amount > .bold').invoke('text').should((text) => {
            expect(parseFloat(text).toFixed(2)).to.eq(parseFloat(amount + +commission).toFixed(2));
        });
    }

    checkCreateWithdraw(name, status, amount, currency) {
        cy.get(':nth-child(1) > .cdk-column-info > .payment-info > .payment-info__recipient').invoke('text').should((text) => {
            expect(text).to.eq(name);
        });
        cy.get(':nth-child(1) > .cdk-column-status > .mat-chip').invoke('text').should((text) => {
            expect(text).to.eq(status);
        });
        cy.get(':nth-child(1) > .text-right > .amount > .bold').invoke('text').should((text) => {
            expect(text).to.eq(amount + " " + currency);
        })
    }

    chooseAndAttachDocument() {
        for (let i = 0; i < withdraw.document_type.length; i++) {
            cy.get('withdraw-form-transfer-bank-docs mat-form-field').click();
            let doc_type = withdraw.document_type[i];
            cy.contains('span', doc_type).click();
            cy.wait(2000);
            parentPage.attachFile("2.jpeg");
            cy.wait(1000);
        }
    }

    createTransferAndCheckMath(admin, user, recipient) {
        // Get available balance "sender wallet"
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
            headers: {
                token: user.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let av_bal_from_wallet = response.body.data[betweenWallets.wallet].available.actual;

            // Get available balance "recipient wallet"
            cy.request({
                method: 'GET',
                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                headers: {
                    token: recipient.token,
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                let av_bal_to_wallet = response.body.data[betweenWallets.recipient_wallet].available.actual;

                // Create transfer between wallets
                cy.request({
                    method: 'POST',
                    url: 'https://account.stage.paydo.com/v1/wallets/calculate-money/on-transfer-between-wallets',
                    headers: {
                        token: user.token,
                    },
                    body: {
                        "amount": betweenWallets.amount_transfer,
                        "currency": betweenWallets.wallet,
                        "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                        "type": 1
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // 2FA
                    cy.request({
                        method: 'POST',
                        url: 'https://account.stage.paydo.com/v1/wallets/move-money-between-wallets',
                        headers: {
                            token: user.token,
                        },
                        body: {
                            "amount": betweenWallets.amount_transfer,
                            "currency": betweenWallets.recipient_wallet,
                            "email": "",
                            "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                            "recipient": merchant.recipient,
                            "startCurrency": betweenWallets.wallet,
                            "type": 1,
                            "userIdentifierTo": "",
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(206);

                        cy.request({
                            method: 'POST',
                            url: 'https://account.stage.paydo.com/v1/wallets/move-money-between-wallets',
                            headers: {
                                token: user.token,
                                "x-2fa-code": parentPage.get2FACode(merchant.authenticator)
                            },
                            body: {
                                "amount": betweenWallets.amount_transfer,
                                "currency": betweenWallets.recipient_wallet,
                                "email": "",
                                "paymentMethodIdentifier": betweenWallets.payment_method_ID,
                                "recipient": merchant.recipient,
                                "startCurrency": betweenWallets.wallet,
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);

                            // Get commission for transfer between wallets
                            cy.request({
                                method: 'GET',
                                url: "https://admin.stage.paydo.com/v1/instrument-settings/commissions/for-mid/13/155/204",
                                headers: {
                                    token: admin.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let fixcom = response.body.data.value[betweenWallets.wallet][0];
                                let perscom = response.body.data.value[betweenWallets.wallet][1];
                                let strateg = response.body.data.strategy;
                                let senderPart = response.body.data.payerPart;
                                let recipientPart = response.body.data.userPart;

                                //  Get available balance "from wallet" after
                                cy.request({
                                    method: 'GET',
                                    url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                    headers: {
                                        token: user.token,
                                    }
                                }).then((response) => {
                                    expect(response).property('status').to.equal(200);
                                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                    let av_bal_from_wallet_after = response.body.data[betweenWallets.wallet].available.actual;

                                    expect(av_bal_from_wallet_after).to.eq(av_bal_from_wallet - (+betweenWallets.amount_transfer +
                                        +parentPage.calculationFinancialCommission(fixcom, perscom, strateg, betweenWallets.amount_transfer)));

                                    cy.log('av_bal_from_wallet' + ' ' + av_bal_from_wallet);
                                    cy.log('av_bal_from_wallet_after' + ' ' + av_bal_from_wallet_after);

                                    // Get available balance "recipient wallet" after
                                    cy.request({
                                        method: 'GET',
                                        url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                        headers: {
                                            token: recipient.token,
                                        }
                                    }).then((response) => {
                                        expect(response).property('status').to.equal(200);
                                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                        let av_bal_to_wallet_after = response.body.data[betweenWallets.recipient_wallet].available.actual;

                                        expect(av_bal_to_wallet_after).to.eq(av_bal_to_wallet + Number(betweenWallets.amount_transfer));

                                        cy.log('av_bal_to_wallet' + ' ' + av_bal_to_wallet);
                                        cy.log('av_bal_to_wallet_after' + ' ' + av_bal_to_wallet_after);
                                        cy.log('sum' + ' ' + betweenWallets.amount_transfer);
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    createWithdrawAndCheckMath() {
        // Get available balance "from wallet"
        cy.request({
            method: 'GET',
            url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
            headers: {
                token: merchant.token,
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
            expect(response.body).property('data').to.not.be.oneOf([null, ""]);
            let available_balance = response.body.data[withdraw.from_wallet].available.actual;

            // Create withdraw
            cy.request({
                method: 'POST',
                url: 'https://account.stage.paydo.com/v1/withdrawals/create',
                headers: {
                    token: merchant.token,
                },
                body: {
                    "method": 1,
                    "direction": withdraw.direction,
                    "beneficiary": {
                        "account": withdraw.IBAN,
                        "name": withdraw.beneficiary_name,
                        "country": withdraw.beneficiary_country,
                        "city": withdraw.beneficiary_city,
                        "address": withdraw.beneficiary_address
                    },
                    "beneficiaryBank": {
                        "bic": withdraw.BIC_code,
                        "name": withdraw.beneficiary_Bank,
                        "city": "LONDON",
                        "address": "180 TOTTENHAM COURT ROAD, 12 FLOOR 2"
                    },
                    "attachments": [],
                    "attachmentsToUpload": [],
                    "type": 1,
                    "amount": withdraw.amount,
                    "currency": withdraw.from_wallet,
                    "email": ""
                }
            }).then((response) => {
                expect(response).property('status').to.equal(206);

                // 2FA
                cy.request({
                    method: 'POST',
                    url: 'https://account.stage.paydo.com/v1/withdrawals/create',
                    headers: {
                        token: merchant.token,
                        "x-2fa-code": parentPage.get2FACode(merchant.authenticator)
                    },
                    body: {
                        "method": 1,
                        "direction": withdraw.direction,
                        "beneficiary": {
                            "account": withdraw.IBAN,
                            "name": withdraw.beneficiary_name,
                            "country": withdraw.beneficiary_country,
                            "city": withdraw.beneficiary_city,
                            "address": withdraw.beneficiary_address
                        },
                        "beneficiaryBank": {
                            "bic": withdraw.BIC_code,
                            "name": withdraw.beneficiary_Bank,
                            "city": "LONDON",
                            "address": "180 TOTTENHAM COURT ROAD, 12 FLOOR 2"
                        },
                        "attachments": [],
                        "attachmentsToUpload": [],
                        "type": 1,
                        "amount": withdraw.amount,
                        "currency": withdraw.from_wallet,
                        "email": ""
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(201);


                    // Get commission for withdraw
                    cy.request({
                        method: 'GET',
                        url: "https://admin.stage.paydo.com/v1/instrument-settings/commissions/custom/" + withdraw.payment_method_ID + "/" + merchant.bussiness_account,
                        headers: {
                            token: feen.token,
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let fixcom = response.body.data[5].value[withdraw.from_wallet][0];
                        let perscom = response.body.data[5].value[withdraw.from_wallet][1];
                        let strateg = response.body.data[5].strategy;

                        let pers = ((withdraw.amount / 100) * perscom).toFixed(2);

                        if (strateg === 1) {
                            // Amount of commissions
                            let com = (+fixcom + +pers).toFixed(2);

                            // Total amount with commission
                            let sum = (Number(withdraw.amount) + +com);

                            // Get available balance "from wallet" after
                            cy.request({
                                method: 'GET',
                                url: "https://account.stage.paydo.com/v1/wallets/get-all-balances/" + merchant.main_currency,
                                headers: {
                                    token: merchant.token,
                                }
                            }).then((response) => {
                                expect(response).property('status').to.equal(200);
                                expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                                let available_balance_after = response.body.data[withdraw.from_wallet].available.actual;
                                expect(available_balance_after).to.eq(available_balance - sum);
                            })
                        }
                    })
                })
            })
        })
    }


    checkErrorDisplay(message) {
        this.checkStatusWithdraw(message)
    }

    checkMessageDisplay(cause, message) {
        cy.get(cause).invoke('text').should((text) => {
            let alert = (text);
            expect(alert.toString()).to.eq(message);
        });
    }

    enterBICCodeAndCheckResult(admin, codes, message) {
        // Get list block Swift for PM and user
        cy.request({
            method: 'GET',
            url: 'https://admin.stage.paydo.com/v1/instrument-settings/restrictions/actual?operationType=6&paymentMethodIdentifier=1000005&userIdentifier=1812',
            headers: {
                token: admin.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);

            if (typeof response.body.data[0] !== 'undefined') {
                let blockSwift = response.body.data[0].value.swiftCodes;

                for (let i = 0; i < codes.length; i++) {
                    parentPage.getInput('bic').clear().type(codes[i]);
                    cy.wait(4000);
                    for (let j = 0; j < blockSwift.length; j++) {
                        if (codes[i] === blockSwift[j]) {
                            this.checkMessageDisplay(message);
                            break;
                        } else {
                        }
                    }
                }
            } else {
                cy.log('No blocked SWIFT codes');
            }
        })
    }


    enterReceiverCountryAndCheckResult(admin, beneficiary_country, message) {
        // Get list block Country for PM and user
        cy.request({
            method: 'GET',
            url: endpoints.restrictions_operationType_6 +
                "&paymentMethodIdentifier=1000005&userIdentifier=" + merchant.business_account,
            headers: {
                token: admin.token
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);

            if (typeof response.body.data[1] !== 'undefined') {
                let blockCountry = response.body.data[1].value.countries;

                cy.get('[class="withdraw-method__select"]').click();
                for (let i = 0; i < beneficiary_country.length; i++) {

                    cy.get('[placeholder="Search"]').clear().type(beneficiary_country[i])

                    for (let j = 0; j < blockCountry.length; j++) {

                        if (parentPage.getCodeCountry(beneficiary_country[i]) === blockCountry[j]) {
                            this.checkMessageDisplay(no_res,message);
                            break;
                        } else {
                            this.checkMessageDisplay(country_name," " +beneficiary_country[i] + " ")
                            break;
                        }
                        cy.get('[placeholder="Search"]').clear()
                    }
                }
            }
        })
    }


    CreateTransferBetweenWallets(amount_transfer, wallet, sender, sender_authenticator, recipient) {
        cy.readFile("cypress/fixtures/Prod/sender_headers.json").then((data) => {
            let sender_token = data.token
            cy.readFile("cypress/fixtures/Prod/recipient_headers.json").then((data) => {
                let recipient_token = data.token

                cy.request({
                    method: 'POST',
                    url: 'https://account.paydo.com/v1/wallets/calculate-money/on-transfer-between-wallets',
                    headers: {
                        token: sender_token,
                    },
                    body: {
                        "amount": amount_transfer,
                        "currency": wallet,
                        "paymentMethodIdentifier": 204,
                        "type": 1
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);

                    // 2FA authentication
                    cy.request({
                        method: 'POST',
                        url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                        headers: {
                            token: sender_token,
                        },
                        body: {
                            "amount": amount_transfer,
                            "currency": wallet,
                            "email": "",
                            "paymentMethodIdentifier": 204,
                            "recipient": recipient,
                            "startCurrency": wallet,
                            "type": 1,
                            "userIdentifierTo": "",
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(206);

                        cy.request({
                            method: 'POST',
                            url: 'https://account.paydo.com/v1/wallets/move-money-between-wallets',
                            headers: {
                                token: sender_token,
                                "x-2fa-code": parentPage.get2FACode(sender_authenticator)
                            },
                            body: {
                                "amount": amount_transfer,
                                "currency": wallet,
                                "email": "",
                                "paymentMethodIdentifier": 204,
                                "recipient": recipient,
                                "startCurrency": wallet,
                                "type": 1,
                                "userIdentifierTo": "",
                            }
                        }).then((response) => {
                            expect(response).property('status').to.equal(200);
                        })
                    })
                })
            })
        })
    }

    checkAvailableSenderWallet(user, wallet, amount_transfer, user_token) {

            cy.readFile("cypress/fixtures/Prod/available " + wallet + " " + user + ".json").then((data) => {
                let available_before = data.available;

                cy.readFile("cypress/fixtures/Prod/com13_type.json").then((data) => {
                    let fixcom = data.fixcom;
                    let perscom = data.perscom;
                    let strategy = data.strategy;

                    cy.request({
                        method: 'GET',
                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                        headers: {
                            token: user_token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        let available_after = response.body.data[wallet].available.actual.toFixed(2)

                        let amountWithCommission = ((+amount_transfer + +parentPage.receiveCommission(fixcom, perscom, strategy))
                            .toFixed(2))

                        expect(available_after).to.eq((available_before - amountWithCommission).toFixed(2))
                    })
                })
            })
    }

    checkAvailableRecipientWallet(user, wallet, amount_transfer, user_token) {

            cy.readFile("cypress/fixtures/Prod/available " + wallet + " " + user + ".json").then((data) => {
                let available_before = data.available;

                cy.request({
                    method: 'GET',
                    url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                    headers: {
                        token: user_token
                    }
                }).then((response) => {
                    expect(response).property('status').to.equal(200);
                    expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                    let available_after = response.body.data[wallet].available.actual.toString()
                    expect(available_after).to.eq((+available_before + +amount_transfer).toFixed(2))
                })
            })
    }

    createExchange(user_token, amount, from, to) {
        cy.request({
            method: 'POST',
            url: 'https://account.paydo.com/v1/wallets/exchange',
            headers: {
                token: user_token,
            },
            body: {
                "amount": amount,
                "currency": from,
                "destinationCurrency": to
            }
        }).then((response) => {
            expect(response).property('status').to.equal(200);
        })
    }

    checkAvailableBalanceToWallet(user, wallet, user_token, amount_exchange, admin_token, from) {

        cy.readFile("cypress/fixtures/Prod/available " + wallet + " " + user + ".json").then((data) => {
            let balance = data.available

            cy.readFile("cypress/fixtures/Prod/com10_type.json").then((data) => {
                let fixcom = data.fixcom;
                let perscom = data.perscom;
                let strategy = data.strategy;

                cy.readFile("cypress/fixtures/Prod/rate_exchange.json").then((data) => {
                    let rates = data.rates
                    let amount_after_exchange = (amount_exchange * rates) - parentPage.receiveCommission(fixcom,
                        perscom, strategy)

                    cy.request({
                        method: 'GET',
                        url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                        headers: {
                            token: user_token
                        }
                    }).then((response) => {
                        expect(response).property('status').to.equal(200);
                        expect(response.body).property('data').to.not.be.oneOf([null, ""]);
                        expect(parseFloat(response.body.data[wallet].available.actual, 10).toFixed(2)).to.equal
                        ((+balance + amount_after_exchange).toFixed(2))
                    })
                })
            })
        })
    }

    checkAvailableBalanceFromWallet(user, wallet, user_token, amount_exchange) {

        cy.readFile("cypress/fixtures/Prod/available " + wallet + " " + user + ".json").then((data) => {
            let balance = data.available

            cy.request({
                method: 'GET',
                url: "https://account.paydo.com/v1/wallets/get-all-balances/" + merchants.main_currency,
                headers: {
                    token: user_token
                }
            }).then((response) => {
                expect(response).property('status').to.equal(200);
                expect(response.body).property('data').to.not.be.oneOf([null, ""])
                expect((response.body.data[wallet].available.actual).toFixed(2)).
                to.equal((balance - amount_exchange).toFixed(2))
            })
        })
    }
}


export default new MoneyTransferPage();