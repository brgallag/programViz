/* global angular */

(function() {
  'use strict';
  angular.module('module-app', [
    'ui.router',
    'module-mapping',
    'd3',
    'ngAnimate',
    'ngFileUpload',
  ])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
  function ($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
    $httpProvider.interceptors.push('timeoutHttpIntercept');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/main.html'
        })
        .state('programming', {
            url: '/programming',
            templateUrl: 'views/programming.html'
        });

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

  }])
  .run(['commonService', 'websocketService', '$rootScope', '$state', '$timeout', '$transitions', function(commonService, websocketService, $rootScope, $state, $timeout, $transitions) {

        $transitions.onStart( {}, function($transitions) {
            commonService.notify('START_STATE_CHANGE');
        });
      
        $transitions.onSuccess({}, function($transitions){
            $timeout(function(){
                commonService.notify('END_STATE_CHANGE');
            });
            
            //for in-app backbutton directive handling
            if ($transitions.$from().name) { $rootScope.navigatedFrom = $transitions.$from().name; }
        });
      
        commonService.init();
        websocketService.init();
  }])
  .factory('timeoutHttpIntercept', ['$rootScope', '$q', function ($rootScope, $q) {
    return {
      'request': function(config) {
        config.timeout = 45000;
        return config;
      }
    };
  }]);
})();