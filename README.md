# generator-sf 

[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependency Status][depstat-image]][depstat-url] [![Download][dlcounter-image]][dlcounter-url]

This [Yeoman](http://yeoman.io) generator scaffolds a symfony app with full featured frontend `grunt`/`gulp` tooling. 
Just scaffold your app and you are ready to go. 


## Installation

First, install [Yeoman](http://yeoman.io) and generator-sf using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).

Install dependencies
```bash
npm install -g yo grunt gulp
```
To install generator-sf from npm, run:
```bash
npm install -g generator-sf
```

Then generate your new project:

```bash
yo sf
```



![The Team](https://raw.github.com/bezoerb/generator-sf/master/generators/view/_common/templates/img/yo-grunt-bower-symfony.png)

## Features
* Symfony framework
* Twig templating engine
* Assetic removed
* Browsersync dev/prod server with livereload
* Choose the build tool which fits your needs
  - [Gulp](http://gulpjs.com/)
  - [Grunt](http://gruntjs.com/)
* Choose the CSS preprocessor which fits your needs
  - [Sass](http://sass-lang.com/)
  - [Less](http://lesscss.org)
  - [Stylus](http://learnboost.github.io/stylus/)
  - or no preprocessor at all
* Choose CSS Framework
  * [uikit](http://getuikit.com)  
  * [Bootstrap](http://getbootstrap.com)
  * [Foundation](http://foundation.zurb.com)
  * [inuitcss](http://inuitcss.com) (sass only)
  * no framework?
* Choose Javascript module loader
  * [JSPM](http://jspm.io/) + [SystemJS](https://github.com/systemjs/systemjs) (ES6)
  * [Webpack](https://webpack.github.io/) (ES6)
  * [Browserify](http://browserify.org/) (ES6)
* File revving
* Image optimization
* [Critical](https://github.com/addyosmani/critical) (Extract & Inline Critical-path CSS) 
* [uncss](https://github.com/addyosmani/grunt-uncss) (Automatically strip off unused css)
* Service Worker
* Organized Gruntfile with [load-grunt-config](http://firstandthird.github.io/load-grunt-config)
* Preconfigured testing Stack: [Karma](http://karma-runner.github.io/0.12/index.html), [Mocha](http://mochajs.org/) & [Chai](http://chaijs.com/)
* Phpunit 


## Things to come

  * Feel free to add feature requests ;)

### Environments
The browsersync server uses it's own symfony environment to prevent asset loading conflicts with the environment loaded via apache2. 

### Directory structure
The directory structure is based on the [Symfony Best Practices](http://symfony.com/doc/current/best_practices/index.html)
#### Dev
* Assets are located in `app/Resources/public` 
* Templates can be found in `app/Resources/views` 

#### Production
* All production assets are located in the `web` folder.
* Run `grunt build` or `gulp build` to compile, optimize and rev your assets for production.


### Changelog

See [CHANGELOG.md](CHANGELOG.md)

## License

MIT

[npm-url]: https://npmjs.org/package/generator-sf
[npm-image]: https://badge.fury.io/js/generator-sf.svg

[travis-url]: https://travis-ci.org/bezoerb/generator-sf
[travis-image]: https://secure.travis-ci.org/bezoerb/generator-sf.svg?branch=master

[depstat-url]: https://david-dm.org/bezoerb/generator-sf
[depstat-image]: https://david-dm.org/bezoerb/generator-sf/status.svg

[dlcounter-url]: https://www.npmjs.com/package/generator-sf
[dlcounter-image]: https://img.shields.io/npm/dm/generator-sf.svg

[coveralls-url]: https://coveralls.io/github/bezoerb/generator-sf?branch=master
[coveralls-image]: https://coveralls.io/repos/github/bezoerb/generator-sf/badge.svg?branch=master





## Getting To Know Yeoman

 * Yeoman has a heart of gold.
 * Yeoman is a person with feelings and opinions, but is very easy to work with.
 * Yeoman can be too opinionated at times but is easily convinced not to be.
 * Feel free to [learn more about Yeoman](http://yeoman.io/).

## License

MIT © [Ben Zörb](http://dommerlaune.com)

