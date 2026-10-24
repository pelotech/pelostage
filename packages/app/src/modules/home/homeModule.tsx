import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { HomePageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';
import { MarkdownContent } from '@backstage/core-components';

const content = `
This developer portal is a single place for your organization's services,
teams and documentation.

- **Find a service or team** in the [catalog](/catalog). Repos, users and
  teams are kept in sync with your GitHub organization.
- **Read the docs** on any catalog page with a TechDocs tab, or browse all of
  them under [Docs](/docs).
- **Create something new** from a [software template](/create).
- **Add your repo** by committing a \`catalog-info.yaml\` to it, or
  [register an existing one](/catalog-import).

The portal is built on [pelostage](https://github.com/pelotech/pelostage).
Issues and pull requests are welcome.
`;

const gettingStartedWidget = HomePageWidgetBlueprint.make({
  name: 'getting-started',
  params: {
    name: 'GettingStarted',
    title: 'Getting Started',
    description: 'What this portal is and where to start',
    components: async () => ({
      Content: () => <MarkdownContent content={content} />,
    }),
  },
});

export const homeModule = createFrontendModule({
  pluginId: 'home',
  extensions: [gettingStartedWidget],
});
