export function routerConfig($stateProvider, $urlRouterProvider, $httpProvider) {
  'ngInject';

  $stateProvider
    .state('lab1', {
      url: '/lab1?{cityId&labId&cityName}',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('lab2', {
      url: '/lab2?{cityId&labId&cityName}',
      templateUrl: 'app/lab2/lab2.html',
      controller: 'Lab2Controller',
      controllerAs: 'main'
    })
    .state('lab3', {
      url: '/lab3?{cityId&labId&cityName}',
      templateUrl: 'app/lab3/lab3.html',
      controller: 'Lab3Controller',
      controllerAs: 'main'
    })
    .state('variant', {
      url: '/',
      templateUrl: 'app/variant/variant.html',
      controller: 'VariantController',
      controllerAs: 'ctrl'
    });

  $urlRouterProvider.otherwise('/');
}
