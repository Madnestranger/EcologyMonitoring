export class Lab5Controller {
  constructor($http, API_URL, $rootScope, polygons, $scope, $stateParams, $state, $timeout) {
    'ngInject';

    // must be initilized
    const n = 14;

    var self = this,
      labId = $stateParams.labId;

    self.typeHeaders = [{
      id: 1,
      name: "Збитки від наднормативного скидання забруднених стоків, викликаних НС"
    }, {
      id: 2,
      name: "Збитки від аварійних залпових скидань забруднених стоків"
    }, {
      id: 3,
      name: "Збитки від скидання сировини та речовин у чистому вигляді"
    }, {
      id: 4,
      name: "Забруднення водного об'єкта сміттям"
    }, {
      id: 5,
      name: "Забруднення підземних вод нафтопродуктами"
    }];


    self.types = {
      1: {
        v: 200,
        t: 200,
        cc: 200,
        cd: 200,
        h: 10,
        name: "Збитки від наднормативного скидання забруднених стоків, викликаних НС",
        fields: [{
          description: "локацiя",
          name: "mainLocation"
        }, {
          description: "витрати зворотних вод, куб. метрів/годину",
          name: "v"
        }, {
          description: "тривалість наднормативного скидання, годин",
          name: "t"
        }, {
          description: "середня фактична концентрація забруднюючих речовин у зворотних водах, грам/куб. метр",
          name: "сс"
        }, {
          description: "дозволена для скидання концентрація забруднюючих речовин",
          name: "cd"
        }, {
          description: "коефіцієнт, що враховує категорію водного об'єкта",
          name: "h"
        }],
        useSubstance: true,
        url: "pollutionsWater/excessDischarge",
        sum: function (pollutions) {
          let sum = pollutions.reduce((prev, curr) => prev + 0.003 * 1 / curr.gdk * n, 0);
          return this.v * this.t * this.cc * this.cd * sum * this.h * Math.pow(10, -3);
        }
      },
      2: {
        v: 200,
        t: 200,
        cc: 200,
        cd: 200,
        h: 10,
        name: "Збитки від аварійних залпових скидань забруднених стоків",
        fields: [{
          description: "локацiя",
          name: "mainLocation"
        }, {
          description: "витрати зворотних вод, куб. метрів/годину",
          name: "v"
        }, {
          description: "тривалість наднормативного скидання, годин",
          name: "t"
        }, {
          description: "середня фактична концентрація забруднюючих речовин у зворотних водах, грам/куб. метр",
          name: "сс"
        },
        {
          description: "коефіцієнт, що враховує категорію водного об'єкта",
          name: "h"
        }],
        useSubstance: true,
        url: "pollutionsWater/emergencyDischarge",
        sum: function (pollutions) {
          let sum = pollutions.reduce((prev, curr) => prev + 0.003 * 1 / curr.gdk * n, 0);
          return this.v * this.t * this.cc * sum * this.h * Math.pow(10, -3);
        }

      },
      3: {
        m: 200,
        ai: 200,
        h: 300,
        name: "Збитки від скидання сировини та речовин у чистому вигляді",
        fields: [{
          description: "локацiя",
          name: "mainLocation"
        }, {
          description: "маса скинутої забруднюючої сировини, кілограмів",
          name: "m"
        },
        {
          description: "коефіцієнт, що враховує категорію водного об'єкта",
          name: "h"
        }],
        useSubstance: true,
        url: "pollutionsWater/pureDischarge",
        sum: function () { return this.m * 0.003 * this.ai * n * this.h; }

      },
      4: {
        name: "Забруднення водного об'єкта сміттям",
        fields: [{
          description: "локацiя",
          name: "mainLocation"
        }, {
          description: "маса скинутої забруднюючої сировини, кілограмів",
          name: "m"
        },
        {
          description: "коефіцієнт, що враховує категорію водного об'єкта",
          name: "h"
        }],
        useSubstance: true,
        sum: () => 0
      },
      5: {
        m: 200,
        k: 20,
        ai: 20,
        t: 1,
        name: "Забруднення підземних вод нафтопродуктами",
        fields: [{
          description: "локацiя",
          name: "mainLocation"
        }, {
          description: "питома величина збитків, завданих навколишньому природному середовищу, в НМД",
          name: "y"
        }, {
          description: "об'єм забруднених підземних вод, куб. метрів",
          name: "v"
        },
        {
          description: "коефіцієнт, який враховує природну захищеність підземних вод",
          name: "l"
        }],
        url: "pollutionsWater/oil",
        sum: function () {
          return this.m * this.k * 0.17 * this.ai * this.t * 0.1;
        }

      }
    }



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
    this.getAllSubstances();
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


  getAllSubstances() {
    this.$http
      .get(`${this.API_URL}substances`)
      .then(response => {
        this.substances = response.data;
      });
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
        //console.log(this.pollutionsGround);
      });
  }

  calculateAir() {
    this.airSum = 0;
    let pI = 32;
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
    let sum = 0;

    for (let key in this.types) {
      if (this.types.hasOwnProperty(key)) {
        sum += this.types[key].sum(this.pollutionsWater);

      }
    }

    this.waterSum = sum;

    // this.waterSum = 0;
    // let V = 50;
    // let T = 120;
    // let Cc = 0;
    // let Cd = 1.8 * 1.25;
    // let Ai = 0;
    // let n = 3200;
    // let h = 0;
    // angular.forEach(this.pollutionsWater, item => {
    //   Cc = item.averageConcentration;
    //   Cd = item.gdk;
    //   Ai = 1 / item.gdk;

    //   this.waterSum += V * T * Cc * Cd * Ai * n * h;

    // });

  }

  calculateGround() {
    this.groundSum = 0;
    let Y = 50;
    let n = 14;
    let V = 0;
    let L = 1.3;
    let Ki = 0;
    angular.forEach(this.pollutionsGround, item => {
      item.gdk = 25;
      Ki = 0.05 / item.gdk;
      V = item.area * 25 * 1.2;
      this.groundSum += Y * n * V * L * Ki;
    });
  }



  addItem(pollution) {
    this.$http
      .post(`${this.API_URL}${this.types[pollution.typeId].url}`, pollution)
      .then(() => {
        this.newPollution = {};
      });
  }

  initMap() {
    if (!this.map) {
      this.$timeout(() => {
        google.maps.event.trigger(this.map, 'resize');
      }, 500);
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 50.4501, lng: 30.5234 },
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
