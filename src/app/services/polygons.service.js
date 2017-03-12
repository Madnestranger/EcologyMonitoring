export class PolygonsService {
    constructor($http, $q, API_URL) {
        'ngInject';
      this.API_URL = API_URL;
      this.$q = $q;
      this.$http = $http;
    }

    get(id) {
        var deferred = this.$q.defer();

        this.$http.get(`${this.API_URL}getPolygon?id=${id}`).then(response => {

            var begin = new Date();
            var result = response.data.geometries[0].coordinates[0][0].map(item => ({
                lng: item[1],
                lat: item[0]
            }));
            console.info(`Array (szie: ${result.length}) parsing: ${+new Date() - begin}.`);
            deferred.resolve(result);
        }, response => {
            console.dir(response);
        });

        return deferred.promise;
    }
}
