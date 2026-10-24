import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SidebarContent } from './Sidebar';
import { SignInPage } from './SignInPage';

export const appModule = createFrontendModule({
  pluginId: 'app',
  extensions: [SidebarContent, SignInPage],
});
