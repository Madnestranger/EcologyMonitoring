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
    this.constantsProb = {
      1: {
        a: -9.15,
        b: 11.66
      },
      2: {
        a: -5.51,
        b: 7.49
      },
      3: {
        a: -2.35,
        b: 3.73
      },
      4: {
        a: -1.41,
        b: 2.33
      }
    };
    this.constantsRisk = {
      1: {
        k: 7.5,
        b: 2.35
      },
      2: {
        k: 6,
        b: 1.28
      },
      3: {
        k: 4.5,
        b: 1
      },
      4: {
        k: 3,
        b: 0.87
      }
    };
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
    this.getData();
    this.$timeout = $timeout;
    this.illness = [
      {
        name: 'Гострий інфаркт міокарда',
        id: 1,
        amount: 1,
        spreadCorrelation: 0.91,
        firstUpcomingCorrelation: '-'
      },
      {
        name: 'Мозковий інсульт',
        id: 2,
        amount: 1,
        spreadCorrelation: 0.6,
        firstUpcomingCorrelation: '-'
      },
      {
        name: 'Хронічні цереброласкулярна патологія',
        id: 3,
        amount: 1,
        spreadCorrelation: 0.63,
        firstUpcomingCorrelation: '-'
      },
      {
        name: 'Доброякісні новоутворення',
        id: 4,
        amount: 1,
        spreadCorrelation: 0.81,
        firstUpcomingCorrelation: '-'
      },
      {
        name: 'Злоякісні новоутворення',
        id: 5,
        amount: 2,
        spreadCorrelation: '-',
        firstUpcomingCorrelation: '-'
      },
      {
        name: 'Ендокринна захворюваність',
        id: 6,
        amount: 1,
        spreadCorrelation: 0.6,
        firstUpcomingCorrelation: '-'
      },
      {
        name: 'Вузловий зоб',
        id: 7,
        amount: 2,
        spreadCorrelation: 0.63,
        firstUpcomingCorrelation: 0.8
      },
      {
        name: 'Тиреотоксикоз',
        id: 8,
        amount: 2,
        spreadCorrelation: 0.42,
        firstUpcomingCorrelation: 0.6
      },
      {
        name: 'Гіпотиреоз',
        id: 9,
        amount: 2,
        spreadCorrelation: 0.86,
        firstUpcomingCorrelation: 0.95
      },
      {
        name: 'Цукровий діабет',
        id: 10,
        amount: 1,
        spreadCorrelation: 0.53,
        firstUpcomingCorrelation: '-'
      }
    ];
    this.amountX = {
      1: 4,
      2: 2,
      3: 2,
      4: 5,
      5: 1,
      6: 1,
      7: 2,
      8: 2,
      9: 4,
      10: 1
    };

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

  chooseInputs(id) {
    this.inputAmounts = this.amountX[id];
  }

  getData() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].pollution}?city=${this.$stateParams.cityName}`)
      .then(response => {
        this.pollutions = response.data;
      });
  }

  calculateSpread(that) {
    switch (that.illnessId) {
      case 1:
        that.spread = 137.6 + 0.74 * that.x1 + 0.68 * that.x2 - 1.36 * that.x3 + 1.04 * that.x4;
        break;
      case 2:
        that.spread = 592 + 1.38 * that.x1 - 0.79 * that.x2;
        break;
      case 3:
        that.spread = 708 + 1.8 * that.x1 - 0.85 * that.x2;
        break;
      case 4:
        that.spread = 883 + 1.87 * that.x1 + 2.4 * that.x2 - 3.1 * that.x3 + 0.66 * that.x4 + 1.35 * that.x5;
        break;
      case 5:
        that.spread = 3972 - 7.04 * that.x1;
        break;
      case 6:
        that.spread = 565 + 1.13 * that.x1;
        break;
      case 7:
        that.spread = 239 + 0.68 * that.x1;
        break;
      case 8:
        that.spread = 80.2 + 0.17 * that.x1;
        break;
      case 9:
        that.spread = 176 + 0.8 * that.x1;
        break;
      case 10:
        that.spread = 4604 + 2.7 * that.x1;
        break;
    }
  }

  calculateFirstUpcoming(that) {
    switch (that.illnessId) {
      case 5:
        that.firstUpcoming = 692 - 1.17 * that.x1;
        break;
      case 7:
        that.firstUpcoming = 31.4 + 0.18 * that.x2;
        break;
      case 8:
        that.firstUpcoming = 5.1 + 0.22 * that.x2;
        break;
      case 9:
        that.firstUpcoming = 9.82 + 0.1 * that.x2 - 0.1 * that.x3 + 0.12 * that.x4;
        break;
    }
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
        zoom: 5
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
