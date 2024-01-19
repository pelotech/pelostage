import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
import { GithubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { GithubMultiOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
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
      GithubMultiOrgEntityProvider.fromConfig(env.config, {
          id: 'default',
          githubUrl: 'https://github.com',
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
