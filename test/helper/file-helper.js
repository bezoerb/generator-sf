'use strict';
const path = require('path');

function Base(dir) {
  this._dir = dir;
  this.files = [
    path.join(this._dir, 'package.json'),
    path.join(this._dir, '.editorconfig'),
    path.join(this._dir, '.eslintrc'),
    path.join(this._dir, '.jscsrc'),
    // Service worker
    path.join(this._dir, 'app/Resources/public/scripts/modules/dummy.js'),
    path.join(this._dir, 'app/Resources/public/scripts/modules/service-worker.js'),
    path.join(this._dir, 'app/Resources/public/scripts/sw/runtime-caching.js'),
    path.join(this._dir, 'app/Resources/public/service-worker.js')
  ];
}

Base.prototype.addJspm = function () {
  this.files.concat([
    path.join(this._dir, 'app/Resources/public/scripts/main.js'),
    path.join(this._dir, 'app/Resources/public/scripts/config.js')
  ]);
  return this;
};

Base.prototype.addNop = function () {
  this.files.concat([path.join(this._dir, 'app/Resources/public/styles/main.css')]);
  return this;
};

Base.prototype.addLess = function () {
  this.files.concat([path.join(this._dir, 'app/Resources/public/styles/main.less')]);
  return this;
};

Base.prototype.addStylus = function () {
  this.files.concat([path.join(this._dir, 'app/Resources/public/styles/main.styl')]);
  return this;
};

Base.prototype.addSass = function () {
  this.files.concat([path.join(this._dir, 'app/Resources/public/styles/main.sass')]);
  return this;
};

Base.prototype.addGrunt = function () {
  this.files.concat([path.join(this._dir, 'Gruntfile.js')]);
  return this;
};

Base.prototype.addGulp = function () {
  this.files.concat([path.join(this._dir, 'gulpfile.js')]);
  this.files.concat([path.join(this._dir, '.babelrc')]);
  return this;
};

Base.prototype.toArray = function () {
  return this.files;
};

module.exports = function (dir) {
  return new Base(dir);
};
