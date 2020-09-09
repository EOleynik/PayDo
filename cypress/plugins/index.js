/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */


module.exports = (on, config) => {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config


 // ...

  on("task", {
    "gmail:getMessage": async args => {

      const { from, to, subject } = args;
      const email = await gmail.check_inbox(
          path.resolve(__dirname, "credential.json"), // credentials.json is inside plugins/ directory.
          path.resolve(__dirname, "token.json"), // gmail_token.json is inside plugins/ directory.
          {from: from,
            to: to,
            subject:subject,
            include_body: true,
            max_wait_time_sec: 200
          }
      );

      return email[0];

    }

  });

};

