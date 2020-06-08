import fse from 'fs-extra';
import path from 'path';
import { getBabelDependencies } from '../../helpers';
import { StoryFormat } from '../../project_types';
import { Generator } from '../Generator';
import { writePackageJson } from '../../js-package-manager';

const generator: Generator = async (packageManager, npmOptions, { storyFormat }) => {
  const packages = [
    '@storybook/web-components',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    'lit-html',
  ];

  const versionedPackages = await packageManager.getVersionedPackages(...packages);

  fse.copySync(path.resolve(__dirname, 'template/'), '.', { overwrite: true });

  if (storyFormat === StoryFormat.MDX) {
    // TODO: handle adding of docs mode
  }

  const packageJson = packageManager.retrievePackageJson();

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  writePackageJson(packageJson);

  const babelDependencies = await getBabelDependencies(packageManager, packageJson);

  packageManager.addDependencies({ ...npmOptions, packageJson }, [
    ...versionedPackages,
    ...babelDependencies,
  ]);

  packageManager.addStorybookCommandInScripts();
};

export default generator;
