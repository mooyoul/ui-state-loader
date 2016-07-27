# ui-state-loader
[Angular UI Router](https://github.com/angular-ui/ui-router) state definition loader

Extract and Exports state definition from source

## Installation
```
$ npm install ui-state-loader --save
```


## Usage
#### some-state.js
```js
const angular = require('angular');

angular.module('myApp', [
  require('angular-ui-router')
]).config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('foo', {
    url: '/foo',
    controller: 'FooCtrl',
    template: require('./foo.jade'),
    abstract: true
  });
  $stateProvider.state('foo.bar', {
    url: '/bar',
    controller: 'BarCtrl',
    template: '<p>Page bar</p>'
  });
}]).config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('foo.baz', {
    url: '/baz',
    controller: 'BazCtrl',
    template: '<p>Page baz</p>'
  });
}]);
```

```js
const states = require('ui-state!./some-state');
/*
  Equal as
  const states = [{
    name: 'foo',
    url: '/foo',
    controller: 'FooCtrl',
    // template: require('./foo.jade'), // @note ignores CallExpression
    abstract: true
  }, {
    name: 'foo.bar',
    url: '/bar',
    controller: 'BarCtrl',
    template: '<p>Page bar</p>'
  }, {
    name: 'foo.baz',
    url: '/baz',
    controller: 'BazCtrl',
    template: '<p>Page baz</p>'
  }];
 */
```


## License
[MIT License](LICENSE)

See full license on [mooyoul.mit-license.org](https://mooyoul.mit-license.org/)
