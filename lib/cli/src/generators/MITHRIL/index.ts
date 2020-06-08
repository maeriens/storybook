import { getBabelDependencies, copyTemplate } from '../../helpers';
import { Generator } from '../Generator';
import { writePackageJson } from '../../js-package-manager';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const [
    storybookVersion,
    actionsVersion,
    linksVersion,
    knobsVersion,
    addonsVersion,
  ] = await packageManager.getVersions(
    '@storybook/mithril',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addons'
  );

  copyTemplate(__dirname, storyFormat);

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    `@storybook/mithril@${storybookVersion}`,
    `@storybook/addon-actions@${actionsVersion}`,
    `@storybook/addon-links@${linksVersion}`,
    `@storybook/addon-knobs@${knobsVersion}`,
    `@storybook/addons@${addonsVersion}`,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
