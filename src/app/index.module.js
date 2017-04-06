/* global malarkey:false, moment:false */
import '../../bower_components/bootstrap/dist/js/bootstrap';

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { GeocodingService } from '../app/services/geocoding.service.js';
import { VariantController } from './variant/variant.controller';
import { PolygonsService } from '../app/services/polygons.service.js';
import { Lab2Controller } from './lab2/lab2.controller';
import { Lab3Controller } from './lab3/lab3.controller';
import { Lab4Controller } from './lab4/lab4.controller';
import { Lab5Controller } from './lab5/lab5.controller';

let API_URL = 'http://localhost:3333/',
  server = 'http://212.80.38.228:3030/';

angular.module('ecologyMonitoring', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap', 'toastr'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .constant('API_URL', API_URL)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('geocoding', GeocodingService)
  .service('polygons', PolygonsService)
  .controller('MainController', MainController)
  .controller('VariantController', VariantController)
  .controller('Lab2Controller', Lab2Controller)
  .controller('Lab3Controller', Lab3Controller)
  .controller('Lab4Controller', Lab4Controller)
  .controller('Lab5Controller', Lab5Controller)
  .directive('acmeNavbar', NavbarDirective);
