# Documentation sources and coverage

Reviewed **October 14, 2026 (UTC)** using the public GothwadTech GitHub repositories and the authenticated GitHub CLI. The table records the reviewed source revisions. Central guides are curated paraphrases, not verbatim mirrors or live-updating API contracts.

## Source revisions

| Repository                                                | Reviewed revision                                                                                          | Source material                                   | Coverage                                                                                                                 |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [accounts](https://github.com/GothwadTech/accounts)       | [`a00407a5ac48`](https://github.com/GothwadTech/accounts/tree/a00407a5ac48376fce237bf96696d133d4792f74)    | README; docs/SETUP.md, OAUTH.md, ARCHITECTURE.md  | Local setup, deployment, OAuth, configuration. Code examples strengthen state validation and preserve the API base path. |
| [mail](https://github.com/GothwadTech/mail)               | [`3d31be6c9148`](https://github.com/GothwadTech/mail/tree/3d31be6c9148918e01952f6fbe5e41bb25276e82)        | README; docs/SETUP.md, MAIL.md                    | Local setup, Worker/Pages deployment, SSO troubleshooting, REST endpoints, documented limits.                            |
| [gothwadtech](https://github.com/GothwadTech/gothwadtech) | [`5e12d5de5bc8`](https://github.com/GothwadTech/gothwadtech/tree/5e12d5de5bc8743c0cf79a11a38226f6417f8234) | README; recursive repository tree                 | Web platform orientation. Corporate marketing claims are not reproduced as measured guarantees.                          |
| [tubeweb](https://github.com/GothwadTech/tubeweb)         | [`bcd3d70eeed6`](https://github.com/GothwadTech/tubeweb/tree/bcd3d70eeed6f27f413203aed5eba2eb9ec5a87e)     | README; recursive repository tree                 | Website setup, Pages deployment, JSON release-data pipeline, upstream attribution.                                       |
| [meet](https://github.com/GothwadTech/meet)               | [`dd2e84d9c9f2`](https://github.com/GothwadTech/meet/tree/dd2e84d9c9f2c1431aca0fbde7d1ea6e508e4eea)        | README; package.json                              | Local setup, meeting verification, Pages deployment, browser/network limitations.                                        |
| [grixchat](https://github.com/GothwadTech/grixchat)       | [`5a5757f791ec`](https://github.com/GothwadTech/grixchat/tree/5a5757f791ecb0108f3b5a2c1374c69491969680)    | README; package.json                              | Mock and real development paths, API architecture, SQL ordering, Pages Functions.                                        |
| [ai](https://github.com/GothwadTech/ai)                   | [`678cb7438a79`](https://github.com/GothwadTech/ai/tree/678cb7438a79cba72152a98764a10639b7f34c66)          | README; repository description                    | Short local-development orientation only. Public API and hosted architecture not verified.                               |
| [launcher](https://github.com/GothwadTech/launcher)       | [`bc9568b8f11d`](https://github.com/GothwadTech/launcher/tree/bc9568b8f11d6745a3e1984936bd03112d2240be)    | README                                            | Android prerequisites, debug/release builds, CI orientation, signing boundaries.                                         |
| [browser](https://github.com/GothwadTech/browser)         | [`3c3f21046c91`](https://github.com/GothwadTech/browser/tree/3c3f21046c916dbb37993d575389377f60880a1d)     | README                                            | Product and installation orientation only; proprietary source restrictions called out.                                   |
| [manager](https://github.com/GothwadTech/manager)         | [`3c3949acf7dd`](https://github.com/GothwadTech/manager/tree/3c3949acf7ddf675177728d60a4b83e15a56d7d2)     | README                                            | Android build prerequisites and safe test/release orientation.                                                           |
| [education](https://github.com/GothwadTech/education)     | [`60ebeff1b872`](https://github.com/GothwadTech/education/tree/60ebeff1b87238b90d70f13538c1c8c232fd1997)   | README                                            | Role-based product overview, local setup, explicit production-verification boundary.                                     |
| [Clashdrive](https://github.com/GothwadTech/Clashdrive)   | [`7ece22222721`](https://github.com/GothwadTech/Clashdrive/tree/7ece222227219b38b358cc030ce8a0d4ad5a3e8e)  | README                                            | Bun setup, Telegram storage architecture, sharing and session cautions.                                                  |
| [store](https://github.com/GothwadTech/store)             | [`8a395713d305`](https://github.com/GothwadTech/store/tree/8a395713d3052ea6541a2b9e0b14de8d8f77a506)       | Recursive repository tree; repository description | Inventory only; no README was available at review. No public API or deployment contract inferred.                        |

## Central portal

`quickstart`, `architecture`, `cloudflare`, `security`, and `contributing` are editorial guides for the actual implementation in this repository and the source-described product boundaries. The API page covers Accounts OAuth and the documented Mail API, not every internal endpoint across every product.

The `tubeapp` README and public repository metadata were also reviewed for product context. App-specific Android release details are delegated to that repository instead of guessed from the website build.

## Repository inventory

`src/repositories.json` contains a snapshot of 39 public repositories returned by `gh repo list GothwadTech`. The directory links to undetailed repositories with **Repository only** coverage labels. A repository appearing here is not a claim that it is active, production-ready, or open-source. Additional repositories, prototypes, forks, and policy-only projects have not received full technical guides in this initial release.

No source files from the `keystore` repository were accessed or imported. Only public repository metadata appears in the inventory.

## Important distinctions

- Accounts' frontend has no Vite build; publish `web/`. This docs site and the documented Vite web products publish `dist/`.
- Mail uses a separate Supabase project and its current documented flow is shared-cookie SSO. Do not claim the optional future OAuth callback is required for this flow.
- Mail attachment metadata is stored, not attachment bytes.
- Accounts' server-to-server base and browser sign-in URL are distinct in the Mail deployment guide.
- OAuth examples add explicit state validation and avoid dropping `/api` when constructing authorization URLs. They are illustrative integration code, not an official SDK package.
- Accounts' listed Drive scopes do not prove a production Drive API or integration with Clash Drive.
- Meet's static frontend still needs WebRTC signaling/connectivity. No load or capacity guarantee is made.
- Browser's public repository declares proprietary/source-available restrictions.
- PlusTube derives from Flow by A-EDev and contributors; attribution is retained.
- Product backends and live domains were not deployed or end-to-end tested during this docs-site implementation. Local docs-site tests are not product integration tests.

## Maintaining this record

For an update, review the changed upstream source, record its commit, adjust affected MDX pages, and rerun the tests. Do not copy raw API keys, session responses, user data, private environment files, or signing materials into documentation.
