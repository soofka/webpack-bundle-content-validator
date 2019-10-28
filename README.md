# Webpack Bundle Content Validator
Webpack plugin and CLI tool for Webpack bundle content validation.

- ✔️ check if your Webpack bundle contains mandatory dependencies and doesn't contain disallowed ones
- ⚠️ print warning in console or fail whole build process when validation is not successful
- 🤖 use as Webpack plugin or CLI tool

**This plugin/tool is compatible with Webpack 4.** Compatibility with older versions of Webpack was not tested yet, but there might be some issues with that due to the fact that structure of [Webpack Stats object](https://webpack.js.org/api/stats/) was changed in Webpack 4.

*Note*: This is early version of this project. Feedback and suggestions are appreciated!

## Background
We're using internal package of vendor libraries in my project. We wanted to ensure that none of dependencies provided by vendor ends up in bundles representing our applications. Therefore, I wrote this tool to validate content of Webpack bundle against list of mandatory and disallowed dependencies, and open sourced it. We're using it as Webpack plugin during development and as CLI tool in CI/CD process.

## Usage
You can download this project as a [package from NPM](https://www.npmjs.com/package/webpack-bundle-content-validator):

```shell
npm install --save-dev webpack-bundle-content-validator
```

You can also download this project as a [source code from GitHub](https://github.com/soofka/webpack-bundle-content-validator) and build it yourself (compiled project will be placed in `lib` directory):

```shell
npm run build
```

### As Webpack plugin
In order to use it as Webpack plugin, import it in your Webpack configuration, and add it to `plugins` section of Webpack's configuration file.

```js
const WebpackBundleContentValidatorPlugin = require('webpack-bundle-content-validator/lib/plugin');

module.exports = {
  // rest of your configuration
  plugins: [
    // rest of your plugins
    new WebpackBundleContentValidatorPlugin(/* options */),
  ]
}
```

#### Options
| Name | Description | Default value |
|-|-|-|
| `mandatoryDependencies` | Array of names of dependencies without which validation will be unsuccessful. | `[]` |
| `disallowedDependencies` | Array of names of dependencies with which validation will be unsuccessful. | `[]` |
| `failOnInvalid` | If set to `false`, unsuccessful validation will print warning message in console, but bundle will be compiled. If set to `true`, unsuccessful validation will print error in console and exit process; bundle will not be compiled. | `false` |

#### Example
```js
const WebpackBundleContentValidatorPlugin = require('webpack-bundle-content-validator/lib/plugin');

module.exports = {
  // rest of your configuration
  plugins: [
    // rest of your plugins
    new WebpackBundleContentValidatorPlugin({
      mandatoryDependencies: ['preact'],
      disallowedDependencies: ['react', 'react-dom'],
      failOnInvalid: true,
    }),
  ]
}
```

### As CLI tool
In order to use it as CLI tool, you need to produce [Webpack Stats object](https://webpack.js.org/api/stats/) first. This can be done with following command:

```shell
webpack --json > stats.json
```

Make sure that the file contains valid JSON! If yes, you can pass it to Webpack Bundle Content Validator.

```shell
node ./node_modules/webpack-bundle-content-validator/lib/cli.js -s ./stats.json
```

#### Options
| Name | Description | Default value |
|-|-|-|
| `-s`, `--stats` | Path to JSON file with [Webpack Stats object](https://webpack.js.org/api/stats/). | `stats.json` |
| `-m`, `--mandatory` | Array of names of dependencies without which validation will be unsuccessful. | `[]` |
| `-d`, `--disallowed` | Array of names of dependencies with which validation will be unsuccessful. | `[]` |
| `-f`, `--fail` | If set to `false`, unsuccessful validation will print warning message in console, but bundle will be compiled. If set to `true`, unsuccessful validation will print error in console and exit process; bundle will not be compiled. | `false` |

#### Example
```shell
./node_modules/webpack-bundle-content-validator/lib/cli.js -s ./my-stats.json -m preact -d react,react-dom -f
```

## TODO
* add missing unit tests
* add end to end testing
* add silent mode
* add CI/CD with Travis
* install CLI tool globally and make it run with npx
* add https://github.com/conventional-changelog/standard-version or https://github.com/semantic-release/semantic-release