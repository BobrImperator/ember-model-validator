/**
 * This babel.config is not used for publishing.
 * It's only for the local editing experience
 * (and linting)
 */
const { buildMacros } = require('@embroider/macros/babel');

const {
  babelCompatSupport,
  templateCompatSupport,
} = require('@embroider/compat/babel');

const macros = buildMacros();

// ember-data packages use @embroider/macros getGlobalConfig().WarpDrive
// Inject WarpDrive config into the macros babel plugin config
const macroPlugin = macros.babelMacros[0];
if (Array.isArray(macroPlugin)) {
  macroPlugin[1].globalConfig.WarpDrive = {
    env: { DEBUG: true, PRODUCTION: false, TESTING: true },
    debug: {
      LOG_GRAPH: false,
      LOG_CACHE: false,
      LOG_IDENTIFIERS: false,
      LOG_INSTANCE_CACHE: false,
      LOG_NOTIFICATIONS: false,
      LOG_REQUESTS: false,
      LOG_METRIC_COUNTS: false,
      DEBUG_RELATIONSHIP_NOTIFICATIONS: false,
      __INTERNAL_LOG_NATIVE_MAP_SET_COUNTS: false,
    },
    activeLogging: {
      LOG_GRAPH: false,
      LOG_CACHE: false,
      LOG_IDENTIFIERS: false,
      LOG_INSTANCE_CACHE: false,
      LOG_NOTIFICATIONS: false,
      LOG_REQUESTS: false,
      LOG_METRIC_COUNTS: false,
      DEBUG_RELATIONSHIP_NOTIFICATIONS: false,
      __INTERNAL_LOG_NATIVE_MAP_SET_COUNTS: false,
    },
    deprecations: {
      DEPRECATE_COMPUTED_CHAINS: true,
      DEPRECATE_NON_STRICT_TYPES: true,
      DEPRECATE_NON_STRICT_ID: true,
      DEPRECATE_NON_UNIQUE_PAYLOADS: true,
      DEPRECATE_RELATIONSHIP_REMOTE_UPDATE_CLEARING_LOCAL_STATE: true,
      DEPRECATE_MANY_ARRAY_DUPLICATES: true,
      DEPRECATE_STORE_EXTENDS_EMBER_OBJECT: true,
      DEPRECATE_EMBER_INFLECTOR: true,
      ENABLE_LEGACY_SCHEMA_SERVICE: true,
    },
    features: {
      JSON_API_CACHE_VALIDATION_ERRORS: false,
    },
    includeDataAdapter: true,
    polyfillUUID: false,
  };
}

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

module.exports = {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true,
      },
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [
          ...(isCompat ? templateCompatSupport() : macros.templateMacros),
        ],
      },
    ],
    [
      'module:decorator-transforms',
      {
        runtime: {
          import: require.resolve('decorator-transforms/runtime-esm'),
        },
      },
    ],
    ...(isCompat ? babelCompatSupport() : macros.babelMacros),
  ],

  generatorOpts: {
    compact: false,
  },
};
