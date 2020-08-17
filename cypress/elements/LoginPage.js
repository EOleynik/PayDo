import user from "../fixtures/user.json";
import merchant from "../fixtures/merchant.json";
import session from "../fixtures/session.json"

class LoginPage {

    visit() {
        cy.visit('/en/auth/login');
    }

    getEmailField() {
        return cy.get('#mat-input-0');
    }

    getPasswordField() {
        return cy.get('#mat-input-1');
    }

    getButtonLogin() {
        return cy.get('[class="mat-focus-indicator submit-btn login__submit mat-raised-button mat-button-base"');
    }


    getAuthCode() {
        return cy.get('ng-otp-input').find('input[class="otp-input ng-pristine ng-valid ng-star-inserted ng-touched"]');
    }


    getButtonToAdmibPanel() {
        return cy.contains('To Admin Panel');
    }

    getAuthorization() {

        window.localStorage.setItem('user-session', '{"id":"1812","email":"eugeniy.o+4avtotest@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTcxNTUyMjgsImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.joNZH9X5Eh06F1xU29qggzQ3R_Q0l4iwjbBeJPCSJSY","role":1,"moduleUrl":"profile","status":1,"type":2,"accountType":1,"availableAccounts":[{"id":"1812","personalInformation":{"email":"eugeniy.o+4avtotest@payop.com"},"systemInformation":{"role":1,"approvedStatus":0},"type":2,"status":1,"dateTime":{"createdAt":1597125347,"updatedAt":1597125608},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTcxNTUyMjksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.9eYpkbfS2lkGIp2b5PnoI-kHRMDZHF57lz4PfvfhP8c"},{"id":"1811","personalInformation":{"email":"eugeniy.o+4avtotest@payop.com"},"systemInformation":{"role":1,"approvedStatus":0},"type":1,"status":1,"dateTime":{"createdAt":1597125344,"updatedAt":1597125608},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTEiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNSIsInRpbWUiOjE1OTcxNTUyMjksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.LcTt4EXDESxtKfBPXxBTkcQBSaaKsQHHUY56hUkdnLw"}],"stayLogin":true,"isLoggedIn":true}')
       // window.localStorage.setItem('user-session',{"id":"1812","email":"eugeniy.o+4avtotest@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTc1MTIyMDgsImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.XoX8wcR-3kJn7KkmhcvYKrN_JNOLUPVHJz1v6hxKv54","role":1,"moduleUrl":"profile","status":1,"type":2,"accountType":1,"availableAccounts":[{"id":"1812","personalInformation":{"email":"eugeniy.o+4avtotest@payop.com"},"systemInformation":{"role":1,"approvedStatus":0},"type":2,"status":1,"dateTime":{"createdAt":1597125347,"updatedAt":1597125608},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTIiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNiIsInRpbWUiOjE1OTc1MTIyMDksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.M_6cYQUI-tXlWMyEpEtp4V5_IlX1h-vFOK6IApcvXaQ"},{"id":"1811","personalInformation":{"email":"eugeniy.o+4avtotest@payop.com"},"systemInformation":{"role":1,"approvedStatus":0},"type":1,"status":1,"dateTime":{"createdAt":1597125344,"updatedAt":1597125608},"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE4MTEiLCJhY2Nlc3NUb2tlbiI6IjY0YjE2NGUxOTMyMzA0ODFjNmZlY2VmYiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTgwNSIsInRpbWUiOjE1OTc1MTIyMDksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOltdLCJ0d29GYWN0b3IiOnsicGFzc2VkIjp0cnVlfX0.jc4JD9JaqzWTT8nuFV3dqijPq5YQ3aAzI8cju2lbpPk"}],"stayLogin":true,"isLoggedIn":true}')
    }

    getManageAuthorization() {
        window.localStorage.setItem('user-session', '{"id":"1596","email":"eugeniy.o+m@payop.com","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE1OTYiLCJhY2Nlc3NUb2tlbiI6ImE0YWViZTgyZDA3MmFjMzhhYTFjYWIyMiIsInRva2VuSWQiOm51bGwsIndhbGxldElkIjoiMTU5MCIsInRpbWUiOjE1OTYzNTczNjksImV4cGlyZWRBdCI6bnVsbCwicm9sZXMiOlsiUk9MRV9NQU5BR0VSIl0sInR3b0ZhY3RvciI6eyJwYXNzZWQiOnRydWV9fQ.vPDJQpWUYKvuZT7L_4_tFWMMIEiuGOvfIyKMNvrLZH4","role":3,"moduleUrl":"manager","status":1,"type":2,"accountType":1,"availableAccounts":[],"stayLogin":true,"isLoggedIn":true}')
    }

}



export default new LoginPage();