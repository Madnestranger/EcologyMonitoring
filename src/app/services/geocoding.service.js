export class GeocodingService {
    constructor($http, $q) {
        'ngInject';

        angular.extend(this, {
            $http,
            $q,
            conf: {
                url: "https://maps.googleapis.com/maps/api/geocode/json",
                key: "AIzaSyA8J4-gVgiK2sGYMIk722W6-JMmSddUewk"
            }
        });

    }

    getCoords(address) {

        let deferred = this.$q.defer();
        this.$http.get(this.conf.url + $.param({
            key: this.conf.key,
            address,
            language: "uk"
        })).then(response => {
            deferred.resolve(response.results.geometry.location);
        },response => {
            deferred.reject(response["error_message"]);
        });

        return deferred.promise;
    }
}