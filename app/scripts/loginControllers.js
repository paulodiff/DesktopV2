'use strict';

/* loginControllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')


//AppCtrl watch on authentication events
.controller("AppCtrl", 
            [ '$scope', 'USER_ROLES', 'AUTH_EVENTS', '$rootScope', 'AuthService', 'modalService', 'Session', 'Restangular', '$state', 'ENV',
      function($scope,   USER_ROLES,   AUTH_EVENTS,   $rootScope,   AuthService,   modalService,   Session,   Restangular,   $state, ENV) {
    
        $scope.currentUser = null;
        $scope.userRoles = USER_ROLES;
        $scope.isAuthorized = AuthService.isAuthorized;
    
        $scope.go = function ( path ) {
            $state.go(path);
        };
                
        if(window.ionic){
            console.log(window.ionic.version);
        }
                
          
        $rootScope.base_url = ENV.apiEndpoint;

        if (ENV.name == 'development') {        
            Session.create(1, 'PROVINCIA', ENV.token,  true);
            $scope.currentUser = ENV.userName;
            $scope.isAuthorized = ENV.isAuthorized;
            Restangular.setDefaultRequestParams({ apiKey: Session.token });
        }
  
                
        console.log('WEB SERVICE WEB URL  : ' + $rootScope.base_url);
        console.log('Restangular set base Url '+ $rootScope.base_url + '/apiQ' );
        Restangular.setBaseUrl($rootScope.base_url + '/apiQ');  
          
    
        // watch on events  
        $rootScope.$on(AUTH_EVENTS.loginSuccess , function (event, next) {
            console.log('AUTH_EVENTS.loginSuccess ... ');
            console.log(event);
            console.log(next);
            $scope.currentUser = Session.nome_breve_utenti;
            Restangular.setDefaultRequestParams({ apiKey: Session.token });
            $state.go('list');
        });
   
        $rootScope.$on(AUTH_EVENTS.loginFailed, function (event, next) {
            console.log('AUTH_EVENTS.loginFailed ... ');
            console.log(event);
            console.log(next);
             
            modalService.showModal({}, 
                        {
                            type: 2,
                            closeButtonText: 'Cancel',
                            actionButtonText: 'Ok',
                            headerText: 'Login errato',
                            bodyText: 'Immettere nome utente e password corrette'
                        }).then(
                            function (result) {
                                console.log('ok');
                        });
        }); 

    
        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, next) {
            console.log('AUTH_EVENTS.notAuthenticated ... ');
            console.log(event);
            console.log(next);
            $scope.currentUser = Session.nome_breve_utenti;
            modalService.showModal({}, 
                        {
                            type: 2,
                            closeButtonText: 'Cancel',
                            actionButtonText: 'Ok',
                            headerText: 'Utente non autenticato',
                            bodyText: 'Immettere nome utente e password - Fare click su ACCESSO'
                        }).then(
                            function (result) {
                                console.log('ok');
                        });
        }); 
    
        $rootScope.$on('$stateChangeStart', function (event, next) {
            console.log('$stateChangeStart: ' + next.accessLogged);
                        
            if(next.accessLogged){
                console.log('$stateChangeStart: check if isAuthenticated : ' + AuthService.isAuthenticated());
                if(!AuthService.isAuthenticated()){
                    event.preventDefault();    
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
            
            /*
            if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                if (AuthService.isAuthenticated()) {
                        // user is not allowed
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                } else {
                    // user is not logged in
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                }
            }
            */
        });
}])

// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
// LoginController ------------------------------------------------------------------------------------
.controller('LoginController', 
            [ '$scope', '$rootScope', 'AUTH_EVENTS', 'AuthService',
     function ($scope, $rootScope, AUTH_EVENTS, AuthService) {
         console.log('LoginController...');
        $scope.credentials = {
            username: '',
            password: ''
        };
    
    
  $scope.login = function (credentials) {
        console.log('login:calling .. AuthService. ..');
        console.log(credentials);
        AuthService.login(credentials).then(function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
  };

  $scope.logout = function (credentials) {
        console.log('logout:calling .. AuthService. ..');
        console.log(credentials);
        AuthService.logout(credentials).then(function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        });
  };
    
}]);




