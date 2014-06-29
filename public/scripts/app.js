angular.module('searchApp', [
  'ngRoute',
  'ngResource',
  'ui.bootstrap'
]).config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
})
.controller('MainCtrl', function($scope){
  console.log("aa");
})
.run(function () {
});
