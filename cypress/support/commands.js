// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Performs an XMLHttpRequest instead of a cy.request (able to send data as
// FormData - multipart/form-data)





// import 'cypress-file-upload';
// import '@testing-library/cypress/add-commands';

const compareSnapshotCommand = require('cypress-image-diff-js/dist/command');
compareSnapshotCommand();

Cypress.Commands.add('form_request', (method, url, formData, done) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
        done(xhr);
    };
    xhr.onerror = function () {
        done(xhr);
    };
    xhr.send(formData);
});

Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fixturePath, mimeType) => {
    cy.fixture(fixturePath, 'base64').then(content => {
        Cypress.Blob.base64StringToBlob(content, mimeType).then((blob) => {
            const testfile = new File([blob], fixturePath, { type: mimeType });
            const dataTransfer = new DataTransfer();
            const fileInput = subject[0];

            dataTransfer.items.add(testfile);
            fileInput.files = dataTransfer.files;

            cy.wrap(subject).trigger('change', { force: true });
        });
    });
});

Cypress.Commands.add("remove_captcha",()=>{
    localStorage.setItem('disable-captcha', true);
});

Cypress.Commands.add("generateClient",() => {
    Cypress.env('current_client',Math.random().toString(36).substring(3))
});

Cypress.Commands.add("parse",(string) => {

    let el = document.createElement( 'html' );
    el.innerHTML = parse(string).toString();
    return el;

});

Cypress.Commands.add('uploadFile', (fileNamePath, fileName, fileType = ' ', selector) => {
    cy.get(selector).then(subject => {
        cy.fixture(fileNamePath, 'base64')
            .then(Cypress.Blob.base64StringToBlob)
            .then(blob => {
                const el = subject[0];
                const testFile = new File([blob], fileName, {
                    type: fileType
                });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(testFile);
                el.files = dataTransfer.files
            })
    })
});

Cypress.Commands.add('isExistElement', (selector) => {
    cy.get('body').then(($el) => {
        if ($el.has(selector)) {
            return true
        } else {
            return false
        }
    })
});

function compareSnapshotTestCommand() {
    Cypress.Commands.add('compareSnapshotTest', { prevSubject: 'optional' }, (subject, name, params = 0.0) => {
        let screenshotOptions = {};
        let errorThreshold = 0.0;
        if (typeof params === 'number') {
            errorThreshold = params;
        } else if (typeof params === 'object') {
            errorThreshold = params.errorThreshold || 0.0;
            // eslint-disable-next-line prefer-object-spread
            screenshotOptions = Object.assign({}, params);
        }

        const specDirectory = Cypress.spec.relative.replace('cypress/e2e', '');
        // take snapshot
        if (subject) {
            cy.get(subject).screenshot(name, screenshotOptions);
        } else {
            cy.screenshot(name, screenshotOptions);
        }

        // run visual tests
        if (Cypress.env('type') === 'actual') {
            const options = {
                fileName: name,
                specDirectory,
                failSilently: Cypress.env('failSilently') !== undefined ? Cypress.env('failSilently') : true
            };
            cy.task('compareSnapshotsPlugin', options).then(results => {
                if (results.error) {
                    console.log(results.error); // eslint-disable-line no-console
                    return results.error;
                }

                if (results.percentage > errorThreshold) {
                    return false
                };

                return true;
            });
        }
    });
}





