export class MainController {
  constructor($http, API_URL, $rootScope, $stateParams, $state) {
    'ngInject';

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
    console.log($stateParams);
    this.$stateParams = $stateParams;
    this.$http = $http;
    this.$rootScope = $rootScope;
    this.newSubstance = {};
    this.newPollution = {};
    this.currentTab = 'item';
    this.API_URL = API_URL;
    this.getData();
    this.getAllSubstances();
  }

  getData() {
    this.$http
      .get(`${this.API_URL}pollutions`)
      .then(response => {
        this.pollutions = response.data;
      });
  }

  getAllSubstances() {
    this.$http
      .get(`${this.API_URL}substances`)
      .then(response => {
        this.substances = response.data;
      });
  }

  getProb(item) {
    return this.constantsProb[item.classOfDangerous].a + (this.constantsProb[item.classOfDangerous].b * Math.log10(item.averageConcentration / item.gdk));
  }

  getRisk(item) {
    return 1 - Math.exp((Math.log(0.84) * (item.averageConcentration / item.gdk) * (this.constantsRisk[item.classOfDangerous].k / this.constantsRisk[item.classOfDangerous].b)));
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
      .post(`${this.API_URL}substances`, {
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
      .post(`${this.API_URL}pollutions`, {
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
}
