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
        name: 'Lab 1',
        id: 1
      },
      {
        name: 'Lab 2',
        id: 2
      },
      {
        name: 'Lab 3',
        id: 3
      },
      {
        name: 'Lab 4',
        id: 4
      },
      {
        name: 'Lab 5',
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
        console.log(response.data);
        this.cities.push(response.data);
      })
  }

  go() {
    this.$state.go('home', {
      cityId: this.chosenCity,
      labId: this.chosenLab
    })
  }

  getCities() {
    this.$http
      .get(`${this.API_URL}cities`)
      .then(response => {
        this.cities = response.data;
        $('#addCityModal').modal('hide');
      });
  }
}
