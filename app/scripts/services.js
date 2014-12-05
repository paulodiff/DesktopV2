'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.

angular.module('myApp.services', [])
   
.service('rService', [function () {
    
    this.time_diff = function(t1,t2) {
    
        console.log('rService.time_diff ... ');
        //var d1 = new Date('1900-01-01T08:15:00.000Z');
        //var d2 = new Date('1900-01-01T09:20:00.000Z');
        console.log('t2' + t2);
        console.log('t1' + t1);
        console.log((t2-t1) / 1000 / 60 / 60 );
        var diff = t2 - t1;
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;
        var ss = Math.floor(msec / 1000);
        msec -= ss * 1000;
        //console.log(diff);
        //console.log(hh);
        //console.log(mm);
        //console.log(ss);
        return (hh+':'+mm).toString();
    };
    
  }])


  .service('version', [function() {
      return '0.0.1';
  }])

/*

.service('modalService', ['$modal',
    function ($modal) {

   
        
        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'partials/modal.html'
        };

        var modalOptions = {
            type: 2,
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };

    }])

*/

/*

// Reddit ---------------------------------------------------------------------------------------------------
 .factory('Reddit', ['Restangular', function( Restangular) {
    var Reddit = function(id_utente) {
        console.log('Reddit init id_utente : ' + id_utente);
        this.items = [];
        this.busy = false;
        this.id_utenti_selezione = id_utente;
        this.mese_selezione = 0;
        this.anno_selezione = 0;
        this.start = 0;
        this.after = '';
    };

  Reddit.prototype.resetPage = function() {
    console.log('Reddit resetPage ');

    var me = this;
    me.start = 0;
    console.log('Reddit resetPage id_utenti_selezione:' +   me.id_utenti_selezione);
    console.log('Reddit resetPage mese_selezione:' +   me.mese_selezione);
    console.log('Reddit resetPage anno_selezione:' +   me.anno_selezione);
    console.log('Reddit resetPage start:' +   me.start);
    me.items = [];
  };
    
      
      
  Reddit.prototype.nextPage = function() {
    console.log('Reddit nextPage');
    var me = this;
    if (this.busy) { 
            console.log('Reddit busy! return');
            return;
    }
    this.busy = true;
    //var url = "/apiQ/serviziAll?limit=10" + this.after + "&jsonp=JSON_CALLBACK";
    //console.log(url);
      
    console.log('Reddit nextPage id_utenti_selezione:' +   me.id_utenti_selezione);
    console.log('Reddit nextPage mese_selezione:' +   me.mese_selezione);
    console.log('Reddit nextPage anno_selezione:' +   me.anno_selezione);
    console.log('Reddit resetPage start:' +   me.start);
      
    var baseAccounts = Restangular.all('serviziAll');
    // This will query /accounts and return a promise.
            
    var q_options = {
                            limit: 100, 
                            start: me.start,
                            id_utenti_selezione : me.id_utenti_selezione,
                            mese_selezione : me.mese_selezione,
                            anno_selezione: me.anno_selezione
                    };
    console.log('Reddit query q_options');
    console.log(q_options);
    baseAccounts.getList(q_options)
    .then(function(accounts) {
        //$scope.projects = accounts;
        //console.log(accounts);
        //console.log(accounts.length);
        //var items = accounts;
        me.start = me.start + accounts.length;
        for (var i = 0; i < accounts.length; i++) {
        //me.items.push(accounts[i].id_utenti);
        // patch per il calcolo delle ore
            var t1 = new Date(accounts[i].da_ora_servizi); 
            var t2 = new Date(accounts[i].a_ora_servizi);
            var msec = t2 - t1;
            var hh = Math.floor(msec / 1000 / 60 / 60);
            msec -= hh * 1000 * 60 * 60;
            var mm = Math.floor(msec / 1000 / 60);
            accounts[i].ore_calcolate_servizi  = hh+':'+mm;
            
            
            me.items.push(accounts[i]);
        }
        //this.after = "t3_" + this.items[this.items.length - 1].id;
        me.busy = false;
    }) 
  };

  return Reddit;
}])

*/

/*
.service('Phone', ['$resource',
  function($resource){
    return $resource('/apiQ/utentiAll', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }])
*/

.factory('AuthService', ['$http', 'Session', '$rootScope', 
                         function ($http, Session, $rootScope) {
  return {
    login: function (credentials) {
      console.log( $rootScope.base_url + '/api2/login');

        
      return $http
        .post($rootScope.base_url + '/api2/login', credentials)
        .then(function (res) {
            console.log('AuthService login then');
            console.log(res);
            console.log(res.data[0].id_utenti);
            Session.create(res.data[0].id_utenti, res.data[0].nome_breve_utenti, res.data[0].token,  res.data[0].isadmin_utenti);
        });

        
 /*
      return $http
        .post('/api2/login', credentials)
        .success(function (res) {
            console.log('AuthService login then');
            console.log(res);
            console.log(res.data.id_utenti);
            Session.create(res.data.id_utenti, res.data.nome_breve_utenti, res.data.token,  res.data.isAdmin);
        })
        .error(function (err) {
            console.log('auth error');
            console.log(err);
        });
*/
    },
      
    logout: function (credentials) {
        console.log('AuthService logout');
        console.log( $rootScope.base_url + '/api2/logout');
      return $http
        .post( $rootScope.base_url + '/api2/logout', credentials)
        .then(function (res) {
            console.log('AuthService login then');
            console.log(res);
            console.log(res.data.id_utenti);
            Session.destroy();
        });
    },  
      
    isAuthenticated: function () {
        console.log('AuthService isAuthenticated');
      return !!Session.id_utenti;
    },
      
    isAuthorized: function (authorizedRoles) {
        console.log('AuthService isAuthorized');
      if (!angular.isArray(authorizedRoles)) {
        authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() &&
        authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
}])


.service('modalService', ['$modal',
    function ($modal) {

        var modalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: 'templates/modal.html'
        };

        var modalOptions = {
            type: 2,
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        this.showModal = function (customModalDefaults, customModalOptions) {
            if (!customModalDefaults) customModalDefaults = {};
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        };

        this.show = function (customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults = {};
            var tempModalOptions = {};

            //Map angular-ui modal custom defaults to modal defaults defined in service
            angular.extend(tempModalDefaults, modalDefaults, customModalDefaults);

            //Map modal.html $scope custom properties to defaults defined in service
            angular.extend(tempModalOptions, modalOptions, customModalOptions);

            if (!tempModalDefaults.controller) {
                tempModalDefaults.controller = function ($scope, $modalInstance) {
                    $scope.modalOptions = tempModalOptions;
                    $scope.modalOptions.ok = function (result) {
                        $modalInstance.close(result);
                    };
                    $scope.modalOptions.close = function (result) {
                        $modalInstance.dismiss('cancel');
                    };
                }
            }

            return $modal.open(tempModalDefaults).result;
        };

    }])


.service('Session', function () {
  this.create = function (id_utenti, nome_breve_utenti, token, isAdmin) {
    console.log('Session create id:' + id_utenti);
    console.log('Session nome_breve_utenti:' + nome_breve_utenti);
    console.log('Session token:' + token);
    console.log('Session isAdmin:' + isAdmin);
    this.id_utenti = id_utenti;
    this.nome_breve_utenti = nome_breve_utenti;
    this.token = token;
    this.isAdmin = isAdmin;
  };
  this.destroy = function () {
      console.log('Session destroy');
    this.id_utenti = null;
    this.nome_breve_utenti = null;
    this.token = null;
    this.isAdmin = false;
  };
  return this;
});

/*
        
var phonecatServices = angular.module('phonecatServices', ['ngResource']);
 
phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('apiQ/utentiAll', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);
*/