import { createApp } from '@backstage/frontend-defaults';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import { appModule } from './modules/app';
import { homeModule } from './modules/home';

export default createApp({
  features: [catalogPlugin, appModule, homeModule],
});
