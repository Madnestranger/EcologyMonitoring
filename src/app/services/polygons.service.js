export class PolygonsService {
    constructor($http, $q) {
        'ngInject';

        angular.extend(this, {
            $http,
            $q,
            config: {
                url: "http://polygons.openstreetmap.fr/get_geojson.py?"
            }
        });
    }

    get(id) {
        var deferred = this.$q.defer();

        this.$http.get(this.config.url + $.param({ id })).then(response => {

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