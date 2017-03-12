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
        this.$http.get(this.conf.url, {
            params: {
                key: this.conf.key,
                address,
                language: "uk"
            }
        }).then(response => {
            deferred.resolve(response.data.results[0].geometry.location);
        }, response => {
            deferred.reject(response.data["error_message"]);
        });

        return deferred.promise;
    }
}