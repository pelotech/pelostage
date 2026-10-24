# pelostage

Pelotech's [Backstage](https://backstage.io) developer portal, running at
<https://pelostage.pelo.tech>. It catalogs the `pelotech` GitHub org (repos,
users and teams), renders TechDocs, runs scaffolder templates and shows
Kubernetes and GitHub Actions status for catalog entities.

## Local development

### Prerequisites

- [Nix](https://nixos.org) with flakes enabled and [direnv](https://direnv.net).
  The dev shell provides Node, Yarn, sops, age and the lint tooling.
- An age key listed in `.sops.yaml` to decrypt the local GitHub App credentials.

### First run

```sh
direnv allow          # enter the nix dev shell
yarn install
yarn setup            # decrypt the GitHub App credentials, create app-config.local.yaml
prek install -t pre-commit -t commit-msg
yarn dev              # frontend and backend
```

Open <http://127.0.0.1:3000> (use `127.0.0.1`, not `localhost`: the backend only
allows that origin) and sign in with GitHub. The backend listens on port 7007.

The Kubernetes tab locally talks to `kubectl proxy`, so run that against a
cluster if you need it.

### Configuration

| File | Purpose |
| --- | --- |
| `app-config.yaml` | Base config, used everywhere |
| `app-config.local.yaml` | Local overrides (gitignored), created from `app-config.local-example.yaml` by `yarn setup` |
| `app-config.production.yaml` | Production overrides, values come from the environment |
| `github-app-pelostage-local-credentials.enc.yaml` | sops-encrypted GitHub App credentials for local dev |

### Frontend layout

The app uses the Backstage
[new frontend system](https://backstage.io/docs/frontend-system/): every plugin
listed in `packages/app/package.json` is installed automatically and brings its
own pages, sidebar entries and entity page tabs and cards. Only pelostage
specifics live in `packages/app/src/modules`:

- `app`: the GitHub sign-in page and the sidebar.
- `home`: the "Getting Started" home page card.

The home page layout, toolkit links and other extension settings are in
`app.extensions` in `app-config.yaml`. Each deployment can set its own logo
with `app.branding.logoFullUrl` and `app.branding.logoIconUrl` (any image URL);
without them the built-in logo is shown. To add a plugin, add it to
`packages/app/package.json`. The app visualizer (under Settings) shows every
installed extension.

### Checks

```sh
yarn tsc
yarn lint:all
yarn test
yarn build:all
prek run --all-files
```

CI runs `prek` on every pull request, and PR titles must be
[conventional commits](https://www.conventionalcommits.org).

## Releases and deployment

- Every merge to `main` builds the backend image and pushes it to
  `ghcr.io/pelotech/pelostage` as `latest` and `sha-<short sha>`.
- [release-please](https://github.com/googleapis/release-please) keeps a release
  PR open; merging it tags `vX.Y.Z`, updates `CHANGELOG.md` and pushes the image
  with that tag.
### Deploying

Every installation (pelotech's and each client's) uses the helm chart
[`oci://ghcr.io/pelotech/charts/pelostage`](https://github.com/pelotech/charts/tree/main/charts/pelostage)
with its own values: portal title, URL and GitHub org, logo, home page links,
ingress, the GitHub App secret (`secrets.existingSecret` or inline values, e.g.
encrypted with helm-secrets), database and any extra Backstage config
(`appConfig`). The chart README lists every value.

The database is in-memory SQLite by default, so the catalog, user settings
(home page layout, starred entities, theme), notifications and scorecards are
lost on every restart. For anything beyond a trial set either
`cnpgCluster.enabled: true` (a CloudNativePG cluster; needs the CNPG operator)
or `database.external.host` (an existing Postgres).

## GitHub and scorecards on entity pages

- **GitHub insights and pull requests** show README, languages, releases,
  contributors and open pull requests for any entity with a
  `github.com/project-slug` annotation (repos found by GitHub discovery get it
  automatically). They call GitHub as the signed-in user, limited to what the
  GitHub App may read: it needs `Contents`, `Metadata` and `Pull requests`
  read access (and `Actions` read for the GitHub Actions tab).
- **Tech Insights** scores every entity against the checks under
  `techInsights.factChecker.checks` in `app-config.yaml`: owned by a group,
  has a description, has tags, has TechDocs. Facts are recomputed every 15
  minutes, so after a restart the scorecards are empty until the next run.

## AI tools (MCP)

Pelostage serves read-only catalog tools over MCP at
<https://pelostage.pelo.tech/api/mcp-actions/v1>. MCP clients sign in through
the normal GitHub login. Only actions marked read-only are exposed (see
`backend.actions` in `app-config.yaml`); permissions are disabled, so widen
this only after enabling them.

## Dependencies

- Renovate opens update PRs (after a 7-day minimum release age) and groups the
  Backstage packages together.
- Dependabot updates `flake.lock`.
- For Backstage upgrades, check the template changes with the
  [upgrade helper](https://backstage.github.io/upgrade-helper/) for the
  versions involved.
