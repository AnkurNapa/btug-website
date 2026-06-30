/// <reference path="../.astro/types.d.ts" />

// YAML data files are imported as parsed objects via @rollup/plugin-yaml
// (configured in astro.config.mjs). Declare the module so `astro check` /
// TypeScript resolve `import x from '../data/x.yaml'`.
declare module '*.yaml' {
  const data: any;
  export default data;
}

declare module '*.yml' {
  const data: any;
  export default data;
}
