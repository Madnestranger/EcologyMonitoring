/* global malarkey:false, moment:false */
import '../../bower_components/bootstrap/dist/js/bootstrap';

import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { NavbarDirective } from '../app/components/navbar/navbar.directive';
import { GeocodingService } from '../app/services/geocoding.service.js';
import { VariantController } from './variant/variant.controller';

let API_URL = 'http://212.80.38.228:3333/';

angular.module('ecologyMonitoring', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngMessages', 'ngAria', 'ngResource', 'ui.router', 'ui.bootstrap', 'toastr'])
  .constant('malarkey', malarkey)
  .constant('moment', moment)
  .constant('API_URL', API_URL)
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .service('geocoding', GeocodingService)
  .controller('MainController', MainController)
  .controller('VariantController', VariantController)
  .directive('acmeNavbar', NavbarDirective);
