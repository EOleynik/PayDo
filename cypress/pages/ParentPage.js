
import card from "../fixtures/Stage/card.json";
import feen from "../fixtures/Stage/feen.json";
import betweenWallets from "../fixtures/Stage/betweenWallets.json";

class ParentPage {

    getLogin(email, password){
        cy.get("[formcontrolname=email]").clear().type(email);
        cy.get("[formcontrolname=password]").clear().type(password);
        cy.contains('span', ' Login ').click();
    }

    get2FACode(key) {
        let notp = require('otplib');
        let secret = key;
        let code = notp.authenticator.generate(secret);
        return code
    }

    getRandomArbitrary = function getRandomArbitrary(min, max) {
        return (Math.random() * (max - min) + min).toFixed(2);
    };

    signatureGeneration(payAmount, payCurrency,description, secret_key) {
        var sha256 = require('js-sha256');
        var hash = sha256.create();
        hash.update(payAmount + ':' + payCurrency + ':' + description + ':' + secret_key);
        hash.hex();
    return hash.toString()
    }

    getTime(){
        let today = new Date();
        let time = today.getHours() + '_' + today.getMinutes() + '_' + today.getSeconds();
        return time;
    }

    setCommissionsAndStrategy(tr_type, strategy, fix_commiss, perc_commiss, pm_id, user_id) {
        cy.request({
            method: 'POST',
            url: `https://account.stage.paydo.com/v1/instrument-settings/commissions/custom`,
            headers: {
                token: feen.token,
            },
            body: {
                "transactionType": tr_type,
                "strategy": strategy,
                "source": 1,
                "value": {
                    "ALL": [
                        fix_commiss,
                        perc_commiss
                    ]
                },
                "currency": "",
                "paymentMethodIdentifier": pm_id,
                "userIdentifier": user_id
            }
        }).then((response) => {
            expect(response).property('status').to.equal(201)
        })
    }

    calculationFinancialCommission(fixcom, perscom, strateg, amount) {
        let pers = ((amount / 100) * perscom).toFixed(2);

        if (strateg === 1) {
            // Amount of commissions
            let finCom = (+fixcom + +pers).toFixed(2);

            // Total amount with commission
            let sum = (Number(betweenWallets.amount_transfer) + +finCom);

            return finCom;

        }
    }

    getDelta(page, n1, n2) {
        return Math.abs(n1 - n2) <= page.precision;
    };

    checkUrl(Url) {
        return cy.url().should('include', Url);
    }

    closeAlert() {
        return cy.get('.close-alert').click({force: true})
    }

    clickButton(name) {
        return cy.contains('span', name).click({force: true});
    }

    getMenu(name) {
        return cy.contains(name);
    }

    clickTab(name) {
        return cy.contains(name);
    }

    getInput(name) {
        return cy.get("[formcontrolname=" + name + "]");
    }

    attachFile(name) {
        cy.get('input[class="ngx-file-drop__file-input"]').each((fileInput) => {
            cy.wrap(fileInput).attachFile(name);
        });
    }

    enterCardData() {
       cy.get("[formcontrolname=pan]").type(card.card_number);
       cy.get("[formcontrolname=expirationDate]").type(card.expiration_date);
       cy.get("[formcontrolname=cvv]").type(card.CVC);
       cy.get("[formcontrolname=holderName]").type(card.cardholder);
    }



}



export default new ParentPage();