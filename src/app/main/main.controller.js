export class MainController {
    constructor($timeout, webDevTec, toastr, $http) {
        'ngInject';

        this.awesomeThings = [];
        this.classAnimation = '';
        this.creationDate = 1489177324090;
        this.toastr = toastr;
        this.$http = $http;
        this.activate($timeout, webDevTec);
        this.newSubstance = {};
        this.testNode();
    }

    testNode() {
        this.$http
            .get(`http://localhost:9999/substances`)
            .then(response => {
                this.substances = response.data;
                console.log(response.data);
            })
    }

    addItem(substance) {
        this.$http
            .post(`http://localhost:9999/substances`, {
                name: substance.name,
                city: substance.city,
                averageConcentration: substance.avg,
                gdk: substance.gdk,
                classOfDangerous: substance.classDanger
            })
            .then(response => {
                $("#addItemModal").modal('hide');
            });
    }

    activate($timeout, webDevTec) {
        this.getWebDevTec(webDevTec);
        $timeout(() => {
            this.classAnimation = 'rubberBand';
        }, 4000);
    }

    getWebDevTec(webDevTec) {
        this.awesomeThings = webDevTec.getTec();

        angular.forEach(this.awesomeThings, (awesomeThing) => {
            awesomeThing.rank = Math.random();
        });
    }

    showToastr() {
        this.toastr.info('Fork <a href="https://github.com/Swiip/generator-gulp-angular" target="_blank"><b>generator-gulp-angular</b></a>');
        this.classAnimation = '';
    }
}
