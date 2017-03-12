export class MainController {
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
    this.getAllSubstances();
    this.$timeout = $timeout;

    this.showTable = (event) => {

      var contentString = '<table class="table table-hover"><thead><tr>' +
        '<td>Name</td>' +
        '<td>Average conc.</td>' +
        '<td>GDK</td>' +
        '<td>Class of dang.</td>' +
        '<td>Prob</td>' +
        '<td>Risk</td>' +
        '</tr></thead><tbody>';

      self.pollutions.map(item => {
        var tr = `<tr><td>${item.name}</td>` +
          `<td>${item.averageConcentration}</td>` +
          `<td>${item.gdk}</td>` +
          `<td>${item.classOfDangerous}</td>` +
          `<td>${self.getProbAir(item).toFixed(4)}</td>` +
          `<td>${self.getRiskAir(item).toFixed(4)}</td>` +
          '</tr>';
        contentString += tr;
      });

      contentString += '</tbody></table>';
      console.log(contentString);

      self.infoWindow.setContent(contentString);
      self.infoWindow.setPosition(event.latLng);

      self.infoWindow.open(self.map);
    };
  }

  getCharacteristicOfWater(risk) {
    if (risk < 0.1) {
      return "Незначний вплив на здоров'я населення"
    }
    if (risk >= 0.1 && risk <= 0.19) {
      return "Слабкий вплив, граничні хронічні ефекти"
    }
    if (risk >= 0.2 && risk <= 0.59) {
      return "Значний вплив, важкі хронічні ефекти"
    }
    if (risk >= 0.6 && risk <= 0.89) {
      return "Великий вплив, важкі гострі ефекти"
    }
    if (risk >= 0.9 && risk <= 1) {
      return "Дуже великий вплив, смертельні ефекти"
    }
  }

  getData() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].pollution}?city=${this.$stateParams.cityName}`)
      .then(response => {
        this.pollutions = response.data;
      });
  }

  getAllSubstances() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].substance}`)
      .then(response => {
        this.substances = response.data;
      });
  }

  getProbAir(item) {
    return this.constantsProb[item.classOfDangerous].a + (this.constantsProb[item.classOfDangerous].b * Math.log10(item.averageConcentration / item.gdk));
  }

  getRiskAir(item) {
    return 1 - Math.exp((Math.log(0.84) * (item.averageConcentration / item.gdk) * (this.constantsRisk[item.classOfDangerous].k / this.constantsRisk[item.classOfDangerous].b)));
  }

  getProbWater(item) {
    return -2 + 3.32 * Math.log10(item.averageConcentration / item.gdk);
  }

  getRiskWater(item) {
    return 1 - Math.exp((Math.log(0.84) / (item.gdk * 4 * 4.5))) * item.averageConcentration;
  }

  changeTab(tab) {
    this.currentTab = tab;
  }

  checkDigitsAvg(that) {
    if (that.main.newPollution.avg) {
      that.main.newPollution.avg = that.main.newPollution.avg.replace(/[A-Za-zа-яА-ЯёЁ!,-]/, "");
    }
  }

  checkDigitsGDK(that) {
    if (that.main.newSubstance.gdk) {
      that.main.newSubstance.gdk = that.main.newSubstance.gdk.replace(/[A-Za-zа-яА-ЯёЁ!,-]/, "");
    }
  }

  addSubstance(substance) {
    this.$http
      .post(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].substance}`, {
        name: substance.name,
        gdk: substance.gdk,
        classOfDangerous: substance.classDanger
      })
      .then(response => {
        $("#addItemModal").modal('hide');
        this.substances.push(response.data);
        this.newSubstance = {};
      });
  }

  addItem(pollution) {
    this.$http
      .post(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].pollution}`, {
        city: pollution.city,
        averageConcentration: pollution.avg,
        mainLocation: pollution.mainLocation,
        substanceId: pollution.substanceId
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
        center: { lat: 50.4501, lng: 30.5234 },
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
