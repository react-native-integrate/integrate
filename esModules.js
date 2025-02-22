const fs = require('fs');
const path = require('path');

// LIST OF ES MODULES
const esModuleRoots = ['execa'];

const nodeModulesDir = path.join(__dirname, 'node_modules');

function readPackageJson(dir) {
  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  }
  return null;
}

function getDependencies(dir, tree, depName, force) {
  let depDir = path.join(dir, depName);
  let pkg = readPackageJson(depDir);
  if (!pkg) {
    while (dir.includes('node_modules')) {
      dir = path.join(dir, '..', '..');
      depDir = path.join(dir, depName);
      pkg = readPackageJson(depDir);
      if (pkg) break;
    }
  }

  if (!pkg) {
    pkg = readPackageJson(dir);
  }
  if (!pkg) {
    return;
  }

  tree[pkg.name] = {
    version: pkg.version,
    esModule: force || pkg.type === 'module',
    dependencies: {},
  };

  if (!pkg.dependencies) return;

  const deps = Object.keys(pkg.dependencies);
  deps.forEach(depName => {
    const depNodeModulesDir = path.join(depDir, 'node_modules');
    getDependencies(depNodeModulesDir, tree[pkg.name].dependencies, depName, force);
  });
}

function findESModules(tree, name) {
  const modules = [];

  function traverse(node, name) {
    if (node.esModule) {
      modules.push(name);
    }
    for (const dep in node.dependencies) {
      traverse(node.dependencies[dep], dep);
    }
  }

  traverse(tree, name);
  return modules;
}

function main(moduleName) {
  let force = false;
  if (moduleName.startsWith('>')) {
    force = true;
    moduleName = moduleName.substring(1);
  }
  const tree = {};
  getDependencies(nodeModulesDir, tree, moduleName, force);
  // console.log('Dependency Tree:', JSON.stringify(tree, null, 2));

  return findESModules(tree[moduleName], moduleName);
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

const allModules = esModuleRoots.map(main).flat().filter(onlyUnique);
// console.log('ES Modules found:', allModules);

module.exports = allModules;
