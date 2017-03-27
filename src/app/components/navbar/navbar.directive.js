export function NavbarDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/navbar/navbar.html',
    scope: {
      creationDate: '='
    },
    controller: NavbarController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class NavbarController {
  constructor($rootScope, $state, $stateParams) {
    'ngInject';
    this.$stateParams = $stateParams;
    this.$rootScope = $rootScope;
    this.$state = $state;
  }


  openMap() {
    this.$rootScope.$broadcast('open.map', {});
  }

}
