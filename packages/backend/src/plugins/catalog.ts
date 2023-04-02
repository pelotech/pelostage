import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { GithubOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);
     builder.addEntityProvider(
           GithubEntityProvider.fromConfig(env.config, {
                 logger: env.logger,
             // optional: alternatively, use scheduler with schedule defined in app-config.yaml
                 schedule: env.scheduler.createScheduledTaskRunner({
               frequency: { minutes: 30 },
           timeout: { minutes: 3 },
         }),
         // optional: alternatively, use schedule
             scheduler: env.scheduler,
           }),
     );
     builder.addEntityProvider(
         GithubOrgEntityProvider.fromConfig(env.config, {
             id: 'production',
             orgUrl: 'https://github.com/pelotech',
             logger: env.logger,
             schedule: env.scheduler.createScheduledTaskRunner({
                 frequency: { minutes: 60 },
                 timeout: { minutes: 15 },
          }),
        }),
      );
  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();
  return router;
}
