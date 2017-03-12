export function routerConfig($stateProvider, $urlRouterProvider, $httpProvider) {
  'ngInject';

  $stateProvider
    .state('home', {
      url: '/home?{cityId&labId}',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
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
