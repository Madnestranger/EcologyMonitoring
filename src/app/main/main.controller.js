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

    this.constantsRiskBasedOnProb = [{ p: -3, r: 0.001 }, { p: -2.5, r: 0.006 }, { p: -2.0, r: 0.023 }, { p: -1.9, r: 0.029 }, { p: -1.8, r: 0.036 }, { p: -1.7, r: 0.045 }, { p: -1.6, r: 0.055 }, { p: -1.5, r: 0.067 }, { p: -1.4, r: 0.081 }, { p: -1.3, r: 0.097 },
    { p: -1.2, r: 0.115 }, { p: -1.1, r: 0.136 }, { p: -1.0, r: 0.157 }, { p: -0.9, r: 0.184 }, { p: -0.8, r: 0.212 }, { p: -0.7, r: 0.242 }, { p: -0.6, r: 0.274 }, { p: -0.5, r: 0.309 }, { p: -0.4, r: 0.345 }, { p: -0.3, r: 0.382 }, { p: -0.2, r: 0.421 },
    { p: -0.1, r: 0.460 }, { p: 0.0, r: 0.50 }, { p: 0.1, r: 0.540 }, { p: 0.2, r: 0.579 }, { p: 0.3, r: 0.618 }, { p: 0.4, r: 0.655 }, { p: 0.5, r: 0.692 }, { p: 0.6, r: 0.726 }, { p: 0.7, r: 0.758 }, { p: 0.8, r: 0.788 }, { p: 0.9, r: 0.816 },
    { p: 1.0, r: 0.841 }, { p: 1.1, r: 0.864 }, { p: 1.2, r: 0.885 }, { p: 1.3, r: 0.903 }, { p: 1.4, r: 0.919 }, { p: 1.5, r: 0.933 }, { p: 1.6, r: 0.095 }, { p: 1.7, r: 0.955 }, { p: 1.8, r: 0.964 }, { p: 1.9, r: 0.971 }, { p: 2.0, r: 0.977 },
    { p: 2.5, r: 0.994 }, { p: 3.0, r: 0.999 }];

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

      let contentString = '<table class="table table-hover"><thead><tr>' +
        '<th>Name</th>' +
        '<th>Prob(токс. еф.)</th>' +
        '<th>Risk(токс. еф.)</th>' +
        '<th>Risk(зд. населення)</th>' +
        '</tr></thead><tbody>';

      self.pollutions.map(item => {
        var tr = `<tr><td>${item.name}</td>` +
          `<td>${self.getProbAir(item).toFixed(4)}</td>` +
          `<td>${self.getEvalRisk(self.getProbAir(item)).toFixed(4)}</td>` +
          `<td>${self.getRiskAir(item).toFixed(4)}</td>` +
          '</tr>';
        contentString += tr;
      });

      contentString += '</tbody></table>';



      self.infoWindow.setContent(contentString);
      self.infoWindow.setPosition(event.latLng);

      self.infoWindow.open(self.map);
    };
  }


  getData() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].pollution}?city=${this.$stateParams.cityName}`)
      .then(response => {

        this.pollutions = response.data.map(t => angular.extend({}, t, {
          prob: this.getProbAir(t),
          risk: this.getEvalRisk(this.getProbAir(t))
        }));

        this.pollutions2 = response.data.map(t => angular.extend({}, t, {
          k: this.constantsRisk[t.classOfDangerous].k,
          b: this.constantsRisk[t.classOfDangerous].b,
          risk: this.getRiskAir(t)
        }));
      });
  }

  getAllSubstances() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].substance}`)
      .then(response => {
        this.substances = response.data;
      });
  }


  getEvalRisk(value) {
    for (let i = 0; i < this.constantsRiskBasedOnProb.length; i++) {
      let cur = this.constantsRiskBasedOnProb[i];
      if (i === this.constantsRiskBasedOnProb.length - 1)
        return cur.r;

      let next = this.constantsRiskBasedOnProb[i + 1];
      if (value >= cur.p && value < next.p || value < cur.p)
        return cur.r;
    }
  }

  getProbAir(item) {
    return this.constantsProb[item.classOfDangerous].a + (this.constantsProb[item.classOfDangerous].b * Math.log10(item.averageConcentration / item.gdk));
  }

  getRiskAir(item) {
    return 1 - Math.exp((Math.log(0.84) * (item.averageConcentration / item.gdk) * (this.constantsRisk[item.classOfDangerous].k / this.constantsRisk[item.classOfDangerous].b)));
  }

  changeTab(tab) {
    this.currentTab = tab;
  }

  getRiskCellColor(value) {
    return `${Math.round(255 * value)},${Math.round(255 * (1 - value))}`;
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
        mainLocation: this.$stateParams.cityName,
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
