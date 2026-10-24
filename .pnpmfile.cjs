// TypeScript 7 no longer ships the JS compiler API, so tools that depend on it
// (typedoc, dts generation, ...) get the TypeScript 6 compat package instead
const ts6 = 'npm:@typescript/typescript6@^6.0.2';

const needsTs6 = (name = '') =>
  name === 'tsdown'
  || name === 'rolldown-plugin-dts'
  || name === 'typedoc'
  || name.startsWith('typedoc-plugin-');

module.exports = {
  hooks: {
    readPackage(pkg) {
      if (!needsTs6(pkg.name)) return pkg;

      const usesTs =
        pkg.peerDependencies?.typescript || pkg.dependencies?.typescript;
      if (!usesTs) return pkg;

      if (pkg.peerDependencies) delete pkg.peerDependencies.typescript;
      if (pkg.peerDependenciesMeta) delete pkg.peerDependenciesMeta.typescript;
      pkg.dependencies = { ...pkg.dependencies, typescript: ts6 };
      return pkg;
    },
  },
};
