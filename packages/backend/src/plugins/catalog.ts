import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { GithubOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  builder.addEntityProvider(
      GithubEntityProvider.fromConfig(env.config, {
          logger: env.logger,
          schedule: env.scheduler.createScheduledTaskRunner({
              frequency: { minutes: 60 },
              timeout: { minutes: 15 },
          }),
      }),
  );
  builder.addEntityProvider(
      GithubOrgEntityProvider.fromConfig(env.config, {
          id: 'default',
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
