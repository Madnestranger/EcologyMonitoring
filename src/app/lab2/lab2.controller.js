export class Lab2Controller {
  constructor($http, API_URL, $rootScope, polygons, $scope, $stateParams, $state, $timeout) {
    'ngInject';

    var self = this,
      labId = $stateParams.labId;

    var OSF = 0.84;


    let organRisks = [0.001, 0.006, 0.023, 0.029, 0.036, 0.045, 0.055, 0.067, 0.081, 0.097, 0.115,
      0.136, 0.157, 0.184, 0.212, 0.242, 0.274, 0.309, 0.345, 0.382, 0.421, 0.460,
      0.500, 0.540, 0.579, 0.618, 0.655, 0.692, 0.726, 0.758, 0.788, 0.816, 0.841,
      0.864, 0.885, 0.903, 0.919, 0.933, 0.945, 0.955, 0.964, 0.971, 0.977, 0.994,
      0.999],
      organProbs = [];

    for (let i = -3.0; i < -2.0; i += 0.5) {
      organProbs.push(i);
    }
    for (let i = -2.0; i < 2.0; i += 0.1) {
      organProbs.push(Math.round(i, 1));
    }
    for (let i = 2.0; i <= 3.0; i += 0.5) {
      organProbs.push(i);
    }


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
    this.newPollution = {
      type: "flow"
    };
    this.currentTab = 'item';
    this.API_URL = API_URL;
    this.getData();
    this.getAllSubstances();
    this.$timeout = $timeout;
    let IR = 2.0;//рівень споживання
    let EF = 365.0;//чатска експозиції
    let ED = 70;//тривалість експозиції
    let BW = 70.0;//вага тіла
    let AT = EF * ED;//час усереднення
    let K3 = 100.0;
    this.modes = [
      {
        name: "Оцінка потенційного ризику за органолептичними показниками якості питної води",
        id: 1,
        drink: {
          prob: item => {
            let c = item.averageConcentration || 1,
              dest = -2 + 3.32 * Math.log10(c / item.gdk);

            return dest;
          },
          risk: function (item) {
            let dest,
              risk = 0,
              prob = this.prob(item);

            //let prob = this.prob()
































            for (let j = 0; j < organProbs.length; j++) {
              risk = organRisks[j];
              if (item.prob < organProbs[j]) {
                dest = "< " + organRisks[j];
                break;
              }
              else {
                if (prob == organProbs[j]) {
                  dest = organRisks[j];
                  break;
                }
                else {
                  if (organProbs[j] < prob && prob < organProbs[j + 1]) {
                    dest = organRisks[j] + " - " + organRisks[j + 1];
                    break;
                  }
                }
              }
            }
            item.risk = risk;
            return dest;
          }
        },
        recreation: {
          prob: item => {
            let dest = 0;
            return dest;
          },
          risk: item => {
            let dest = 0;
            return dest;
          }
        }
      },
      {
        name: "Оцінка потенційного ризику епідеміологічної небезпеки питної води",
        id: 2,
        drink: {
          prob: item => {
            let dest = 0;
            return dest;
          },
          risk: item => {
            let dest = 0;
            return dest;
          }
        },
        recreation: {
          prob: item => {
            let dest = 0;
            return dest;
          },
          risk: item => {
            let dest = 0;
            return dest;
          }
        }
      },
      {
        name: "Оцінка потенційного ризику токсикологічної небезпеки питної води",
        id: 3,
        drink: {
          prob: item => {
            let dest = Math.round(-2.0 + 3.32 * Math.log10(item.averageConcentration) / item.gdk);
            return dest;
          },
          risk: item => {
            let LADD = item.averageConcentration * IR * EF * AT * ED / BW;
            let cLim = item.gdk * 10;
            let dest = 1 - Math.exp(Math.log(0.84) * LADD / cLim);
            item.risk = dest;
            return dest;
          }
        },
        recreation: {
          prob: item => {
            let dest = 0;
            return dest;
          },
          risk: item => {
            let dest = 0;
            return dest;
          }
        }
      }];


    this.showTable = (event) => {

      var contentString = '<table class="table table-hover"><thead><tr>' +
        '<td>Name</td>' +
        '<td>Average conc.</td>' +
        '<td>GDK</td>' +
        '<td>Prob</td>' +
        '<td>Risk</td>' +
        '<td>Characteristic</td>' +
        '</tr></thead><tbody>';

      self.pollutions.map(item => {
        var tr = `<tr><td>${item.name}</td>` +
          `<td>${item.averageConcentration}</td>` +
          `<td>${item.gdk}</td>` +
          `<td>${self.getProbWater(item).toFixed(4)}</td>` +
          `<td>${self.getRiskWater(item).toFixed(4)}</td>` +
          `<td>${self.getCharacteristicOfWater(self.getRiskWater(item))}</td>` +
          '</tr>';
        contentString += tr;
      });

      contentString += '</tbody></table>';

      self.infoWindow.setContent(contentString);
      self.infoWindow.setPosition(event.latLng);

      self.infoWindow.open(self.map);
    };
  }

  getCharacteristicOfWater(risk) {
    if (risk < 0.1) {
      return "Незначний вплив на здоров'я населення";
    }
    if (risk >= 0.1 && risk <= 0.19) {
      return "Слабкий вплив, граничні хронічні ефекти";
    }
    if (risk >= 0.2 && risk <= 0.59) {
      return "Значний вплив, важкі хронічні ефекти";
    }
    if (risk >= 0.6 && risk <= 0.89) {
      return "Великий вплив, важкі гострі ефекти";
    }
    if (risk >= 0.9 && risk <= 1) {
      return "Дуже великий вплив, смертельні ефекти";
    }
  }

  getRiskCellColor(value) {
    return `${Math.round(255 * value)},${Math.round(255 * (1 - value))}`;
  }

  changeMode() {

  }

  getData() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].pollution}?city=${this.$stateParams.cityName}`)
      .then(response => {
        this.pollutions = response.data.map(t => {
          let dest = angular.extend({}, t, {
            prob: this.getProbWater(t),
            risk: this.getRiskWater(t),
            characteristic: this.getCharacteristicOfWater(this.getRiskWater(t))
          });
          return dest;
        });
      });


    this.$http
      .get(`${this.API_URL}pollutionsRecreationsWater?city=${this.$stateParams.cityName}`)
      .then(response => {
        this.pollutions2 = response.data.map(t => {
          t.gdk *= 0.7;
          let dest = angular.extend({}, t, {
            prob: this.getProbWater(t),
            risk: this.getRiskWater(t),
            characteristic: this.getCharacteristicOfWater(this.getRiskWater(t))
          });
          return dest;
        });
      });
  }

  getAllSubstances() {
    this.$http
      .get(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].substance}`)
      .then(response => {
        this.substances = response.data;
      });
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

    if (pollution.type == "flow") {
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
    else {
      this.$http
        .post(`${this.API_URL}pollutionsRecreationsWater`, {
          city: pollution.city,
          averageConcentration: pollution.avg,
          mainLocation: this.$stateParams.cityName,
          substanceId: pollution.substanceId,
          recreationZoneName: pollution.recreationZoneName
        })
        .then(response => {
          $("#addItemModal").modal('hide');
          this.newPollution = {};
          this.pollutions2.push(response.data);
        });
    }
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
