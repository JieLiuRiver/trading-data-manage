import { Config, configUmiAlias, createConfig } from '@umijs/max/test';

export default async () => {
  return (await configUmiAlias({
    ...createConfig({
      target: 'browser',
      jsTransformer: 'esbuild',
      jsTransformerOpts: { jsx: 'automatic' },
    }),
    // displayName: "Umi jest",
  })) as Config.InitialOptions;
};
