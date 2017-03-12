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
  constructor($rootScope, geocoding, $state) {
    'ngInject';
    this.geocoding = geocoding;
    this.$state = $state;
    $rootScope.showMap = false;
    this.$rootScope = $rootScope;
  }

  initMap() {
    if (!this.map)
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.4501, lng: 30.5234},
        zoom: 8
      });

  }
}
