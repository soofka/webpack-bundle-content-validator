# Webpack Bundle Content Validator
Webpack plugin and CLI tool for Webpack bundle content validation.

- ✔️ validate if your Webpack bundle contains mandatory dependencies and does not contain disallowed ones
- ⚠️ print warning in console or fail whole build process when validation is not successful
- 🤖 use as Webpack plugin or CLI tool

*Note*: This is early version of this project. Feedback and suggestions are appreciated!

## Background
We're using internal package of vendor dependencies in my project. We wanted to ensure that none of dependencie provided by vendor ends up in bundles representing our applications. Therefore, I wrote this tool to validate content of Webpack bundle against list of mandatory and disallowed dependencies, and open sourced it.

## Usage
You can download this project from GitHub and build it yourself (built project will be placed in `lib` directory):

```
npm run build
```

Or you can download it as a package from NPM:

```
npm install --save-dev webpack-bundle-content-validator
```

### As Webpack plugin
In order to use it as Webpack plugin, import it in your Webpack configuration, and add it to `plugins` section of Webpack's configuration file.

```
const WebpackBundleContentAnalyzerPlugin = require('webpack-bundle-content-analyzer/lib/plugin');

module.exports = {
  // rest of your configuration
  plugins: [
    // rest of your plugins
    new WebpackBundleContentAnalyzerPlugin(/* options */),
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
```
const WebpackBundleContentAnalyzerPlugin = require('webpack-bundle-content-analyzer/lib/plugin');

module.exports = {
  // rest of your configuration
  plugins: [
    // rest of your plugins
    new WebpackBundleContentAnalyzerPlugin({
      mandatoryDependencies: ['preact'],
      disallowedDependencies: ['react', 'react-dom'],
      failOnInvalid: true,
    }),
  ]
}
```

### As CLI tool
In order to use it as CLI tool, you need to produce [Webpack Stats object](https://webpack.js.org/api/stats/) first. This can be done with following command:

```
webpack --json > stats.json
```

Make sure that the file contains valid JSON! If yes, you can pass it to Webpack Bundle Content Validator.

```
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
```
./node_modules/webpack-bundle-content-validator/lib/cli.js -s ./my-stats.json -m preact -d react,react-dom -f
```

## TODO
* add missing unit tests
* add end to end testing
* add silent mode
* add CI/CD with Travis