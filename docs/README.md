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
- Production runs on the `core-prod` cluster. The `backstage` Argo CD application
  (defined in `pelotech/infrastructure`) syncs `gitops/overlays/prod` from `main`,
  and Argo CD Image Updater rolls out the newest image build.
- Deployment secrets live in `gitops/overlays/*/generators/backstage.yaml`,
  encrypted with sops and decrypted in-cluster by ksops. Edit them with
  `sops gitops/overlays/prod/generators/backstage.yaml`.
- The `dev` overlay is not deployed.

Production currently uses an in-memory SQLite database, so the catalog and
search index are rebuilt from GitHub after every restart.

## Dependencies

- Renovate opens update PRs (after a 7-day minimum release age) and groups the
  Backstage packages together.
- Dependabot updates `flake.lock`.
- For Backstage upgrades, check the template changes with the
  [upgrade helper](https://backstage.github.io/upgrade-helper/) for the
  versions involved.
