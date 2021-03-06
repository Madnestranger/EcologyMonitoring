export class Lab4Controller {
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

    this.target = {};

    this.illness = [
      {
        name: 'Гострий інфаркт міокарда',
        id: 1,
        amount: 1,
        spreadCorrelation: 0.91,
        firstUpcomingCorrelation: '-',
        x1: "Об’єм скидання недостатньо очищених стічних вод у поверхневі водні об’єкти",
        x2: "Викиди в атмосферне повітря хімічних речовин пересувними установками",
        x3: "Викиди в атмосферне повітря хімічних речовин стаціонарними установками у поточному році",
        x4: "Викиди в атмосферне повітря хімічних речовин стаціонарними установками на два роки раніше"
      },
      {
        name: 'Мозковий інсульт',
        id: 2,
        amount: 1,
        spreadCorrelation: 0.6,
        firstUpcomingCorrelation: '-',
        x1: "Скидання забруднених стічних вод у поверхневі водні поточного року",
        x2: "Викиди в атмосферне повітря хімічних речовин стаціонарними установками у поточному році"
      },
      {
        name: 'Хронічні цереброласкулярна патологія',
        id: 3,
        amount: 1,
        spreadCorrelation: 0.63,
        firstUpcomingCorrelation: '-',
        x1: "Викиди в атмосферне повітря хімічних речовин стаціонарними установками у поточному році",
        x2: "Cкидання недостатньо очищених стічних вод у поверхневі водні об’єкти на п’ять років раніше"
      },
      {
        name: 'Доброякісні новоутворення',
        id: 4,
        amount: 1,
        spreadCorrelation: 0.81,
        firstUpcomingCorrelation: '-',
        x1: "Викиди газоподібних речовин в атмосферне повітря на п’ять років раніше",
        x2: "Викиди в атмосферне повітря пересувними засобами на п’ять років раніше, тис. т",
        x3: "Скидання недостатньо очищених стічних вод на два роки раніше, млн. м3",
        x4: "Скидання забруднених стічних вод у поточному році, млн. м3",
        x5: "Скидання забруднених стічних вод на п’ять років раніше, млн. м3"
      },
      {
        name: 'Злоякісні новоутворення',
        id: 5,
        amount: 2,
        spreadCorrelation: '-',
        firstUpcomingCorrelation: '-',
        x1: "Динаміка викидів і атмосферне повітря пересувними засобами за останні три роки"
      },
      {
        name: 'Ендокринна захворюваність',
        id: 6,
        amount: 1,
        spreadCorrelation: 0.6,
        firstUpcomingCorrelation: '-',
        x1: "Динаміка скидання забруднених стічних вод (за останні три роки)"
      },
      {
        name: 'Вузловий зоб',
        id: 7,
        amount: 2,
        spreadCorrelation: 0.63,
        firstUpcomingCorrelation: 0.8,
        x1: "Динаміка скидання недостатньо очищених стічних вод (за останні п’ять років)",
        x2: "Динаміка скидання забруднених стічних вод (за останні три роки)"
      },
      {
        name: 'Тиреотоксикоз',
        id: 8,
        amount: 2,
        spreadCorrelation: 0.42,
        firstUpcomingCorrelation: 0.6,
        x1: "Скидання неочищених стічних вод, млн. м 3",
        x2: "Викиди газоподібних речовин в атмосферне повітря на п’ять років раніше"
      },
      {
        name: 'Гіпотиреоз',
        id: 9,
        amount: 2,
        spreadCorrelation: 0.86,
        firstUpcomingCorrelation: 0.95,
        x1: "Динаміка скидання недостатньо очищених стічних вод (за останні три роки)",
        x2: "Динаміка скидання забруднених стічних вод (за останні п’ять років)",
        x3: "Динаміка скидання недостатньо очищених стічних вод (за останні п’ять років)",
        x4: "Динаміка скидання забруднених стічних вод (за останні три роки)"
      },
      {
        name: 'Цукровий діабет',
        id: 10,
        amount: 1,
        spreadCorrelation: 0.53,
        firstUpcomingCorrelation: '-',
        x1: "Динаміка скидання недостатньо очищених стічних вод, млн. м3"
      }
    ];

    this.illness.map(t => {
      let columns = [],
        props = Object.keys(t);

      props.filter(p => /x[0-9]{1,2}$/.test(p)).map(prop => {
        columns.push(t[prop]);
      });

      t.columns = columns;
    });



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

      let header = `<ul class="nav nav-tabs">`,
        body = '<div class="tab-content">';

      this.illness.map((item, index) => {


        let table = '<table class="table table-hover"><thead><tr>' +
          item.columns.reduce((sum, cur) => {
            sum += `<td>${cur}</td>`;
          }, "")
        '<td>Перший випадок</td>' +
          '<td>Точність першого випадка</td>' +
          '</tr></thead><tbody>';
        let tbody = "";
        item.pollutions.map(poll => {
          let tr = '<tr>';
          poll.coefs.map(co => {
            tr += `<td>${co}</td>`
          });
          tr += `<td>${poll.spread}</td>
            <td>${poll.spreadPr}</td>
            <td>${poll.firstUpcoming}</td>
            <td>${poll.firstUpComCor}</td></tr>`

          tbody += tr;
        });

        table += tbody + "</tbody></table>";


        header += `<li><a data-toggle="tab" href="#menu${index}">${item.name}</a></li>`;
        body += `<div id="menu${index}" class="tab-pane fade">${table}</div>`;
      });

      header += `</ul>`;
      body+='</div>';

      self.infoWindow.setContent(header + body);
      self.infoWindow.setPosition(event.latLng);

      self.infoWindow.open(self.map);
    };
  }

  chooseInputs(id) {
    this.inputAmounts = this.amountX[id];
    this.target = this.illness.find(item => item.id === id);
  }

  getData() {
    var self = this;
    self.$http
      .get(`${self.API_URL}${self.requestsForLab[self.$stateParams.labId].pollution}?city=${self.$stateParams.cityName}`)
      .then(response => {
        response.data.map(item => {
          let illness = self.illness[item.illnessId - 1],
            dest = {
              illnessId: item.illnessId,
              mainLocation: item.mainLocation,
              spreadPr: illness.spreadCorrelation,
              firstUpComCor: illness.firstUpcomingCorrelation,
              x1: item.x1,
              x2: item.x2,
              x3: item.x3,
              x4: item.x4,
              x5: item.x5
            };

          dest.coefs = [];

          Object.keys(dest).filter(prop => /x[0-9]{1,2}$/.test(prop)).map((prop, index) => {
            if (index < self.amountX[dest.illnessId]) {
              dest.coefs.push(dest[prop] || 0);
            }
          });

          self.calculateFirstUpcoming(dest);
          self.calculateSpread(dest);

          (illness.pollutions = illness.pollutions || []).push(dest);

        });
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

      default:
        that.firstUpcoming = 0;
    }


  }

  addItem(pollution) {
    let addingItem = {
      mainLocation: this.$stateParams.cityName,
      illnessId: pollution.illnessId,
      x1: pollution.x1,
      x2: pollution.x2,
      x3: pollution.x3,
      x4: pollution.x4,
      x5: pollution.x5
    };
    this.$http
      .post(`${this.API_URL}${this.requestsForLab[this.$stateParams.labId].pollution}`, addingItem)
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
