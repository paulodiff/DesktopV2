'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ui.router',
  'ngResource',
  'restangular',
  'ui.bootstrap',
  'ui.select',
  'angular-loading-bar',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  'myApp.config'
])
.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', function($stateProvider, $urlRouterProvider, RestangularProvider) {
    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    $urlRouterProvider
      // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
          // Here we are just setting up some convenience urls.
          .when('/c?id', '/contacts/:id')
          .when('/user/:id', '/contacts/:id')

          // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
          .otherwise('/');
    
    $stateProvider.state('home', {
        url: "/",
        templateUrl: 'templates/login.html', 
        controller: 'LoginController',
        accessLevel: 'free1'
    });
        
    
    $stateProvider.state('login',{
        url: '/login',
        templateUrl: 'templates/login.html', 
        controller: 'LoginController',
        accessLogged: false
    });


    $stateProvider.state('reportView',{
        url: '/report/id_utenti/:id_utenti/data_report/:data_report/tipo_stampa/:tipo_stampa/',
        templateUrl: 'templates/report.html', 
        controller: 'ReportCtrl', 
        accessLogged: true, 
        configAction: 'new'
    });    
    
    $stateProvider.state('report',{
        url: '/report',
        templateUrl: 'templates/report.html', 
        controller: 'ReportCtrl', 
        accessLogged: true, 
        configAction: 'new'
    });
    
    $stateProvider.state('list',{
        url: '/list',
        templateUrl: 'templates/ListItem.html', 
        controller: 'InfiniteCtrl', 
        accessLogged: true, 
        configAction: 'new'
    });
    
    $stateProvider.state('new',{
        url: '/new',
        templateUrl: 'templates/EditItem.html', 
        controller: 'EditItemCtrl', 
        accessLogged: true, 
        configAction: 'new'
    });

    $stateProvider.state('edit',{
        url: '/edit/:id',
        templateUrl: 'templates/EditItem.html', 
        controller: 'EditItemCtrl', 
        accessLogged: true, 
        configAction: 'edit'
    });
   
    
    $stateProvider.state('view',{
        url: '/view/:id',
        templateUrl: 'templates/EditItem.html', 
            controller: 'EditItemCtrl', 
        accessLogged: true, 
        configAction: 'view'
    });
    
    // rapporti
   
    
    $stateProvider.state('listRelazioni',{
        url: '/listRelazioni',
        templateUrl: 'templates/ListItemRelazioni.html', 
        controller: 'InfiniteCtrlRelazioni', 
        accessLogged: true, 
        configAction: 'new'
    });
    
    $stateProvider.state('newRelazioni',{
        url: '/newRelazioni/:id',
        templateUrl: 'templates/EditItemRelazioni.html', 
        controller: 'EditItemCtrlRelazioni', 
        accessLogged: true, 
        configAction: 'new'
    });

    $stateProvider.state('editRelazioni',{
        url: '/editRelazioni/:id',
        templateUrl: 'templates/EditItemRelazioni.html', 
        controller: 'EditItemCtrlRelazioni', 
        accessLogged: true, 
        configAction: 'edit'
    });
 
    $stateProvider.state('test',{
        url: '/test',
        templateUrl: 'templates/test.html', 
        controller: 'TestController', 
        accessLogged: false, 
        configAction: 'view'
    });    
  
  RestangularProvider.setBaseUrl('/apiQ');
  RestangularProvider.setDefaultRequestParams({ apiKey: '4f847ad3e4b08a2eed5f3b54' });
  RestangularProvider.setRestangularFields({id: '_id.$oid'});
  RestangularProvider.setRequestInterceptor(function(elem, operation, what) {
        if (operation === 'put') {
          elem._id = undefined;
          return elem;
        }
        return elem;
      })
}])
.constant('AUTH_EVENTS', {
  loginSuccess: 'auth-login-success',
  loginFailed: 'auth-login-failed',
  logoutSuccess: 'auth-logout-success',
  sessionTimeout: 'auth-session-timeout',
  notAuthenticated: 'auth-not-authenticated',
  notAuthorized: 'auth-not-authorized'
})
.constant('USER_ROLES', {
  all: '*',
  admin: 'admin',
  editor: 'editor',
  guest: 'guest'
});

