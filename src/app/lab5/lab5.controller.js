export class Lab5Controller {
  constructor($http, API_URL, $rootScope, polygons, $scope, $stateParams, $state, $timeout) {
    'ngInject';

    var self = this,
      labId = $stateParams.labId;

    $scope.$on('open.map', () => {
      this.showMap = true;
      this.initMap();
    });

    this.polygons = polygons;
    this.requestsForLab = {
      1: {
        substance: 'substances',
        pollution: 'pollutions'
      },
      2: {
        substance: 'onlyGDKsubstances',
        pollution: 'pollutionsWater'
      },
      3: {
        substance: 'substancesLab3',
        pollution: 'pollutionsLab3'
      },
      4: {
        pollution: 'illnessesLab4'
      },
      5: {
        pollution: 'illnessesLab4'
      }
    };
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.newSubstance = {};
    this.newPollution = {};
    this.currentTab = 'item';
    this.API_URL = API_URL;
    this.getDataAir();
    this.getDataWater();
    this.getDataGround();
    this.$timeout = $timeout;
    $scope.isNavCollapsed = true;
    $scope.isCollapsedAir = true;
    $scope.isCollapsedWater = true;
    $scope.isCollapsedGround = true;
    $scope.isCollapsedHorizontal = false;
    this.showTable = (event) => {

      var contentString = '<table class="table table-hover"><thead><tr>' +
        '<td>Захворювання</td>' +
        '<td>Поширювання</td>' +
        '<td>Точність поширювання</td>' +
        '<td>Перший випадок</td>' +
        '<td>Точність першого випадка</td>' +
        '</tr></thead><tbody>';

      self.pollutions.map(item => {
        var tr = `<tr><td>${self.illness[item.illnessId].name}</td>` +
          `<td>${item.spread}</td>` +
          `<td>${self.illness[item.illnessId].spreadCorrelation}</td>` +
          `<td>${item.firstUpcoming}</td>` +
          `<td>${self.illness[item.illnessId].firstUpcomingCorrelation}</td>` +
          '</tr>';
        contentString += tr;
      });

      contentString += '</tbody></table>';

      self.infoWindow.setContent(contentString);
      self.infoWindow.setPosition(event.latLng);

      self.infoWindow.open(self.map);
    };
  }

  veryMuch() {
    this.visibleMuch = true;
    this.$timeout(() => {
      this.visibleMuch = false;
    }, 2000);
  }

  chooseInputs(id) {
    this.inputAmounts = this.amountX[id];
  }

  getDataAir() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[1].pollution}?city=${this.$stateParams.cityName}`)
      .then(response => {
        this.pollutionsAir = response.data;
        this.calculateAir();
      });
  }

  getDataWater() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[2].pollution}?city=${this.$stateParams.cityName}`)
      .then(response => {
        this.pollutionsWater = response.data;
        this.calculateWater();
      });
  }

  getDataGround() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[3].pollution}?city=${this.$stateParams.cityName}`)
      .then(response => {
        this.pollutionsGround = response.data;
        this.calculateGround();
        console.log(this.pollutionsGround);
      });
  }

  calculateAir() {
    this.airSum = 0;
    let pI = 3200;
    let mI = 10;
    let aI = 0;
    let kT = 1.8 * 1.25;
    let kZ = 0;
    angular.forEach(this.pollutionsAir, item => {
      aI = 1 / item.gdk;
      kZ = item.averageConcentration / item.gdk;
      this.airSum += pI * mI * aI * kT * kZ;
    });
  }

  calculateWater() {
    this.waterSum = 0;
    let V = 50;
    let T = 120;
    let Cc = 0;
    let Cd = 1.8 * 1.25;
    let Ai = 0;
    let n = 3200;
    let h = 0;
    angular.forEach(this.pollutionsWater, item => {
      Cc = item.averageConcentration;
      Cd = item.gdk;
      Ai = 1 / item.gdk;
      this.waterSum += V * T * Cc * Cd * Ai * n * h;
    });
  }

  calculateGround() {
    this.groundSum = 0;
    let Y = 50;
    let n = 3200;
    let V = 0;
    let L = 1.3;
    let Ki = 0;
    angular.forEach(this.pollutionsGround, item => {
      item.gdk = 10;
      Ki = 0.05 / item.gdk;
      V = item.area * 25 * 1.2;
      this.groundSum += Y * n * V * L * Ki;
    });
  }

  addItem(pollution) {
    this.calculateSpread(pollution);
    if (this.illness.find(x => x.id == pollution.illnessId).amount == 2) {
      this.calculateFirstUpcoming(pollution);
    } else {
      pollution.firstUpcoming = '-';
    }
    this.$http
      .post(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].pollution}`, {
        mainLocation: this.$stateParams.cityName,
        illnessId: pollution.illnessId,
        spread: pollution.spread,
        firstUpcoming: pollution.firstUpcoming
      })
      .then(response => {
        $("#addItemModal").modal('hide');
        this.newPollution = {};
        this.pollutions.push(response.data);
      });
  }

  initMap() {
    if (!this.map) {
      this.$timeout(() => {
        google.maps.event.trigger(this.map, 'resize');
      }, 500);
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.4501, lng: 30.5234},
        zoom: 10
      });
      this.polygons.get(`${this.$stateParams.cityId}`).then(response => {
        var town = new google.maps.Polygon({
          paths: response,
          strokeColor: '#5AADBB',
          strokeOpacity: 0.8,
          strokeWeight: 3,
          fillColor: '#5AADBB',
          fillOpacity: 0.35
        });
        town.setMap(this.map);
        town.addListener('click', this.showTable.bind(this));
        this.infoWindow = new google.maps.InfoWindow;
      });
    }
  }

}
