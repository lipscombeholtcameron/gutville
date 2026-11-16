# Publishing this repository

This is a standalone public source export of Gutville. `site/` is a static project introduction; the complete game continues to run at <https://gutville-food-detectives.lipscombeholtcameron.chatgpt.site>.

Create an empty public repository named `gutville` under the intended account. Publish this export as its `main` branch. Do not copy the original workspace, local databases, credentials, build output, Git history or presentation into the repository.

In **Settings → Pages**, select **GitHub Actions**. Run **Publish Gutville project page** from Actions if the initial push happened before Pages was enabled. The workflow publishes only `site/`. Use the actual URL returned by the deployment; the usual format is `https://ACCOUNT.github.io/gutville/`. Asset links are relative so they work under that subpath.

Changes to `site/` automatically trigger Pages on `main`. A separate test workflow runs game/analytics tests on pushes and pull requests. The game itself requires server routes and D1; it cannot be served by GitHub Pages alone.

The export retains current source, relevant assets, editable curriculum, tests and third-party notices. `.openai/hosting.json` declares storage bindings without the original Site ID. A new game deployment needs its own hosting, database and researcher setup. Repository pushes do not update the existing live game.

## Verification — 16 November 2026

All 16 game/analytics tests passed for the export. An initial pattern scan found no private keys, GitHub/API tokens or researcher-secret assignments. The only email pattern was the fictional local sign-in fixture. No participant exports or local databases are included. Historical database/HTTP verification is recorded separately in `validation.md` and was not rerun for this export.

Official reference: [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

The static page passed local HTTP/asset checks and in-app browser inspection at desktop, 820px tablet and 390px phone widths. All images loaded; no horizontal overflow was observed at the checked phone and tablet widths. The full live game was not re-audited for this export.
