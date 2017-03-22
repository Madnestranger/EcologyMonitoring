export class VariantController {
  constructor($scope, API_URL, $http, $state) {
    'ngInject';
    this.$scope = $scope;
    this.$http = $http;
    this.$state = $state;
    this.API_URL = API_URL;
    this.getCities();
    this.labs = [
      {
        name: 'Лабораторна 1',
        id: 1
      },
      {
        name: 'Лабораторна 2',
        id: 2
      },
      {
        name: 'Лабораторна 3',
        id: 3
      },
      {
        name: 'Лабораторна 4',
        id: 4
      },
      {
        name: 'Лабораторна 5',
        id: 5
      }
    ];
  }

  addCity(city) {
    this.$http
      .post(`${this.API_URL}cities`, {
        id: city.id,
        name: city.name
      })
      .then(response => {
        this.cities.push(response.data);
        $('#addCityModal').modal('hide');
      })
  }

  go() {
    this.$state.go(`lab${this.chosenLab}`, {
      cityId: this.chosenCity.id,
      cityName: this.chosenCity.name,
      labId: this.chosenLab
    })
  }

  getCities() {
    this.$http
      .get(`${this.API_URL}cities`)
      .then(response => {
        this.cities = response.data;
      });
  }
}
