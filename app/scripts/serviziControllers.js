'use strict';

/* Controllers */

//angular.module('myApp.controllers', [])
angular.module('myApp.controllers')



//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
.controller('EditItemCtrl', ['$scope', '$state', '$stateParams', 'Restangular', 'modalService', 'rService', 'Session', 'ENV',  
                    function($scope, $state, $stateParams, Restangular, modalService, rService, Session, ENV) {

    // azione deriva dalla configurazione del controller new/edit
    console.log('EditItemCtrl:  configAction :' +  $state.current.configAction);
    console.log($state);
    console.log($stateParams);
            
    var configAction = $state.current.configAction;
    $scope.configAction = configAction;
    $scope.item = {};
    $scope.item.lista_volontari_servizi = [];
    $scope.openedPopupDate = false;   
    
    if (( configAction == 'edit') || ( configAction == 'view'))  {
        console.log('EditItemCtrl : get data from serviziAll');
        var baseAccounts = Restangular.all('serviziAll');
        // This will query /accounts and return a promise.
        baseAccounts.getList({limit: 50, id_servizi_selezione : $stateParams.id}).then(function(accounts) {
            //$scope.projects = accounts;
            //console.log(accounts);
            $scope.item = accounts[0];

            // patch date object
            console.log('EditItemCtrl : patch time object');
            console.log(accounts[0].da_ora_servizi);
            console.log(accounts[0].a_ora_servizi);
            
            // accounts[0].elenco_id_volontari.split(',');

            console.log('EditItemCtrl : load data ....');
            console.log(accounts[0].elenco_id_volontari.split(','));

            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.lista_volontari_servizi = accounts[0].elenco_id_volontari.split(',');
            $scope.item.a_ora_servizi = new Date(accounts[0].a_ora_servizi);
            $scope.item.da_ora_servizi = new Date(accounts[0].da_ora_servizi);
            $scope.timeCalculated = rService.time_diff($scope.item.da_ora_servizi, $scope.item.a_ora_servizi);
            $scope.elenco_id_rapporti_servizio = accounts[0].elenco_id_rapporti_servizio;
            $scope.id_rapporto_valido_servizio = accounts[0].id_rapporto_valido_servizio;
            $scope.item.annullato_servizi = accounts[0].annullato_servizi;
          
            
            
            //************************************
            
            
                  //##check null data
            if ( (!(typeof $scope.item.id_utenti === "undefined")) && ($scope.item.id_utenti != null)) {
                        
            console.log('EditItemCtrl : populate volontariList per : ' + $scope.item.id_utenti);
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : $scope.item.id_utenti }).then(function(users) {
                    
            console.log('EditItemCtrl : patch accounts');
        
            var fancyArray = [];
            var arrayLength = users.length;
            console.log('EditItemCtrl : patch accounts for ' + arrayLength );
            // build array per la lista di controllo fatta secondo il suo template    
            for (var i = 0; i < arrayLength; i++) {
                //users[i].id = users[i].id_;
                
                if(accounts[0].elenco_id_volontari.indexOf(users[i].id) > -1){
                
                var more = {
                            id : users[i].id,
                            checked :  (accounts[0].elenco_id_volontari.indexOf(users[i].id) > -1)  ?  true : false ,
                            nome_completo_volontari : users[i].nome_completo_volontari,
                            text : users[i].nome_completo_volontari
                        };
                console.log(more);
                fancyArray.push(more);
                }
                //Do something
            }
        
            console.log(users);
            $scope.volontariList = fancyArray;
            $scope.item.lista_volontari_servizi = fancyArray;
            console.log($scope.volontariList);
        
            //$scope.volontariList = users;
            });
   
            }//##check null data
            
            
            
            
            
            //********************************************
            
            
            
            
        });
    }
                        
        
    if ( configAction == 'new') {
        var new_servizio = {
            id_utenti : Session.id_utenti,
            lista_volontari_servizi : [],
            //id_volontari_servizi : 0,
            data_servizi  : new Date(),
            da_ora_servizi  : new Date("1900-01-01T08:30:00.000Z"),
            a_ora_servizi  : new Date("1900-01-01T10:30:00.000Z"),
            note_servizi : '',
            rapporto_servizi : ''
        };
        
        $scope.item = new_servizio;
        $scope.timeCalculated = rService.time_diff($scope.item.da_ora_servizi, $scope.item.a_ora_servizi);
    }
    
    // fill select utenti
    if(Session.isAdmin) {
        console.log('EditItemCtrl : populate list : isAdmin ');
        var utentiList = Restangular.all('utentiAll');
        utentiList.getList().then(function(accounts) {
            //console.log(accounts);
            $scope.utentiList = accounts;
        });
    } else {
        console.log('EditItemCtrl : populate list : NOT isAdmin ');
        console.log(Session.id_utenti);
        $scope.utentiList = [];
        $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        $scope.item.id_utenti = Session.id_utenti;
    }
    
    // fill volontari
    var volontariList = Restangular.all('volontariAll');
    volontariList.getList({id_volontari_utenti : $scope.item.id }).then(function(accounts) {
        //console.log(accounts);
        $scope.volontariList = accounts;
    });
    
    
    $scope.master = {};
    $scope.timeCalculated = 0;
    
 
    // time change event
    $scope.timechanged = function () {
        console.log('EditItemCtrl : Time changed to: ' + $scope.item.da_ora_servizi);
        console.log('EditItemCtrl : Time changed to: ' + $scope.item.a_ora_servizi);
        $scope.timeCalculated = rService.time_diff($scope.item.da_ora_servizi, $scope.item.a_ora_servizi);
        if ( $scope.timeCalculated < 1 ) {
            $scope.timeCalculated = $scope.timeCalculated + 24;
        }
    };
    
    //Button action
    $scope.cancel_action = function(item){
        
        modalService.showModal({}, {
                type: 1,
                closeButtonText: 'Indietro',
                actionButtonText: 'Ok - Elimina!',
                headerText: 'Messaggio',
                bodyText: 'Annullare il presente elemento?'
                        }).then(
                    function (result) {
                        console.log('EditItemCtrl : Deleting....');
                        console.log(item.id_servizi);
                        
                        //var baseAccounts = Restangular.all('servizi');
                        // This will query /accounts and return a promise.
                        //baseAccounts.getList({limit: 50, id_servizi_selezione : $stateParams.id}).then(function(accounts) {
                        //var account = Restangular.one("servizi", item.id_servizi).get();   

                        Restangular.oneUrl('servizi', '/api1/servizi/' + item.id ).get().then(
                            function(account){
                                console.log('get!');
                                console.log(account);
                                account.annullato_servizi = 1;
                                console.log('put!');
                                //Restangular.setBaseUrl('/api1/servizi/' + item.id_servizi);
                                Restangular.setBaseUrl('/api1');
                                account.customPUT({annullato_servizi : 1},item.id, {}, {});
                                //account.put();
                                Restangular.setBaseUrl('/apiQ');
                                $state.go('list');
                              });
                        /*
                        var account = Restangular.oneUrl('servizi', '/api1/servizi/' + item.id_servizi ).get();
                        account.annullato_servizi = 1;
                        account.put();
                        
                        account.put().then(function(msg){
                                console.log('put!');
                                console.log(msg);
                            });
                        */
                        
                        
                         //console.log(account);   
                        // account.put();
                        
                    });
        
        
        
        
        console.log('EditItemCtrl : cancel_action');
        console.log(item);
    }
    
    
    // add item
    $scope.save_action = function(item){
        
        // validate form
        console.log('EditItemCtrl:save_action:Start validator : ');
        
        var msg = '';
        /*
        if ($scope.item.a_ora_servizi <= $scope.item.da_ora_servizi){
            msg = 'Orario servizi errato!';
        }
        */

        if ($scope.item.lista_volontari_servizi.length == 0){
            msg = 'Selezionare un volontario!';
        }
        
        console.log('EditItemCtrl:save_action:Start validator :data_servizi :' + $scope.item.data_servizi);
        console.log('EditItemCtrl:save_action:Start validator :data_servizi :' + new Date());
        
        if ( (!Session.isAdmin) && ($scope.item.data_servizi < new Date())  ){
            msg = 'Non è possibile selezionare date del servizio precedenti a quelle odierna.';
        }
    
        if (msg != ''){
            console.log('validate KO');
            modalService.showModal({}, {
                type: 2,
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Errori di inserimento dati!',
                bodyText: msg
                
                        }).then(
                    function (result) {
                        console.log('ok');
                    });
        } else {
            
            console.log('validate OK ... saving data ...');
        
            var new_servizio = {
                //id_volontari_servizi :  $scope.item.id_volontari_servizi,
                id_utenti : $scope.item.id_utenti,
                data_servizi : $scope.item.data_servizi,
                da_ora_servizi : $scope.item.da_ora_servizi,
                a_ora_servizi : $scope.item.a_ora_servizi,
                note_servizi : $scope.item.note_servizi,
                lista_volontari : $scope.item.lista_volontari_servizi,
                rapporto_servizi :  $scope.item.rapporto_servizi
            };
            
            console.log('POST ... ' + new_servizio);
            console.log('api endpoint : ' +  ENV.apiEndpoint + '/api1/servizi');
            
            var baseServizi = Restangular.allUrl('servizi', ENV.apiEndpoint + '/api1/servizi');
            baseServizi.post(new_servizio).then(
            function(msg){
                console.log("Object saved OK");
                console.log(msg.id);
                
                
                console.log('Saving detail....data ');
                
                /* TODO inserire anche i legami con gli altri servizi... */
                
                
                //$state.go('contacts.detail', { contactId: randId });
                var modalOptions = {
                    //closeButtonText: 'OK',
                    //actionButtonText: 'Delete Customer',
                    type: 1,
                    headerText: 'Messaggio',
                    bodyText: 'Dato inserito con successo'
                };
          
                modalService.showModal({}, modalOptions).then(
                    function (result) {
                        console.log('ok');
                        $state.go('edit', { id: msg.id });
                    },
                    function (error){
                        $state.go('edit', { id: msg.id });
                    }
                );
            }, 
            function(msg) {
                console.log("There was an error saving ... ");
                console.log(msg);
            }
            );
        }
       
    }
    
    // action new relazione
    $scope.new_relazione_action = function($id) {
        console.log('Route to newRelazioni con id : ' + $id);
        $state.go('newRelazioni', { id: $id });
    };

    // action goto relazione
    $scope.goto_relazione_action = function($id) {
        console.log('Route to editRelazioni con id : ' + $id);
        $state.go('editRelazioni', { id: $id });
    };
                        
    
    // click on date field
    $scope.popupDate = function($event) {
        console.log('EditItemCtrl : popupDate');
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.openedPopupDate) {
            $scope.openedPopupDate = false;
        } else {
            $scope.openedPopupDate = true;
        }
    }; 
    
    
    console.log('EditItemCtrl : watching item.id_utenti');
    // on change id_utenti 
    $scope.$watch('item.id_utenti', function(newValue, oldValue) {
        console.log('EditItemCtrl : id_utenti changed!' + newValue + ' ' +  oldValue);
        
        if ( configAction == 'new') {
        
            var volontariList = Restangular.all('volontariAll');
            volontariList.getList({id_volontari_utenti : newValue }).then(function(accounts) {
                console.log('EditItemCtrl: RESET volontariList e list_volontari_servizi');
                $scope.volontariList = accounts;
                $scope.item.lista_volontari_servizi = [];
            });
        } else {
            console.log('EditItemCtrl: id_utenti Changed but configAction ' + configAction);
        }
        
    });
}])



// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
.controller('InfiniteCtrl', ['$scope', '$location', 'Restangular', '$filter', 'Session' , function($scope,  $location, Restangular, $filter, Session) {
    
    console.log('InfiniteCtrl start...');
  
  $scope.totalPages = 0;
  $scope.itemsCount = 0;
  $scope.currentPage = 1;    
  $scope.totalItems = 0;
  $scope.pageSize = 8;
  $scope.startPage = 0;         
  $scope.openedPopupDate = false;    
  $scope.utentiList = [];
    


    
  //default criteria that will be sent to the server
  $scope.filterCriteria = {
    pageNumber: 1,
    count: 0,
    limit: $scope.pageSize,
    start: 0,
    sortDir: 'asc',
    sortedBy: 'id',
    id_utenti_selezione : Session.isAdmin ? 0 : Session.id_utenti,
    mese_selezione : 0,
    anno_selezione: 0
  };
    
    console.log('InfiniteCtrl INIT filterCriteria');
    console.log($scope.filterCriteria);
    
    // popola la lista utenti
    var volontariList = Restangular.all('utentiAll');
    volontariList.getList().then(function(accounts) {
        console.log(accounts);
        if(Session.isAdmin) {
            console.log('InfiniteCtrl : populate list : isAdmin ');
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
            $scope.id_utenti_selezione = 0;
        } else {
            console.log('InfiniteCtrl : populate list : NOT isAdmin ');
            console.log(Session.id_utenti);
            $scope.id_utenti_selezione = Session.id_utenti;
            $scope.filterCriteria.id_utenti_selezione = Session.id_utenti;
            $scope.utentiList = [];
            $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        }
    });    
 

 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      console.log('InfiniteCtrl...fetchResult');
      console.log($scope.filterCriteria);
    
      var serviziList = Restangular.all('serviziAll');
      
      console.log('InfiniteCtrl...fetchResult - count');
      $scope.filterCriteria.count = 1;
      serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log('COUNT: data[0].totalItems:' + data[0].totalItems);
            console.log(data);
          
            if (data.length > 0) {
                $scope.totalItems = data[0].totalItems;
            } else {
                $scope.totalItems = 0;
            }
            //$scope.totalPages = data[0].totalItems;
        }, function () {
            $scope.totalItems = 0;
            //$scope.totalPages = 0;
        });

      console.log('InfiniteCtrl...fetchResult - get data');
      
      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      $scope.filterCriteria.count = 0;
      $scope.filterCriteria.start = offset_page;
      return serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log(data);
            $scope.items = data;
        }, function () {
            $scope.items = [];
        });
    };
      
 
  //called when navigate to another page in the pagination
  $scope.selectPage = function () {
    var page = $scope.currentPage;
    console.log('Page changed to: ' + $scope.currentPage);  
    console.log('InfiniteCtrl...selectPage:' + page);
    $scope.currentPage = page;
    $scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
  };
 
  
 
  //manually select a page to trigger an ajax request to populate the grid on page load
  console.log('InfiniteCtrl : selectPage 1');
  $scope.selectPage(1);
    

  // watch change selection    
  $scope.$watch("id_utenti_selezione", function(newValue, oldValue) {
        console.log('id_utenti changed! New ' + newValue + ' Old ' +  oldValue);
        
        if(Session.isAdmin) {
            $scope.filterCriteria.id_utenti_selezione = newValue;
            $scope.currentPage = 1;
            $scope.filterCriteria.pageNumber = $scope.currentPage;
            $scope.fetchResult();
        } else {
            console.log('id_utenti changed! New NO ADMIN NO ACTION');
        }
        
    });    
    
    //watch on change
    
    $scope.$watch("data_servizi_selezione", function(newValue, oldValue) {
        console.log('data_servizi changed!' + newValue + ' ' +  oldValue);
        
        if(newValue){
            console.log($filter('date')(newValue,'MM'));
            console.log($filter('date')(newValue,'yyyy'));
            $scope.filterCriteria.mese_selezione = $filter('date')(newValue,'MM');
            $scope.filterCriteria.anno_selezione = $filter('date')(newValue,'yyyy');
        } else {
            $scope.filterCriteria.mese_selezione = 0;
            $scope.filterCriteria.anno_selezione = 0;
        }
        $scope.currentPage = 1;
        $scope.filterCriteria.pageNumber = $scope.currentPage;
        $scope.fetchResult();
        
    });    
    
    
    
    $scope.popupDate = function($event) {
        console.log('popupDate');
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.openedPopupDate) {
            $scope.openedPopupDate = false;
        } else {
            $scope.openedPopupDate = true;
        }
    };
    
    
    // callback for ng-click 'editUser':
    $scope.editItem = function (itemId) {
        console.log('editItem');
        $location.path('/edit/' + itemId);
    };
    
    
    // callback for ng-click 'editUser':
    $scope.editRelazioni = function (itemId) {
        console.log('editItem');
        $location.path('/editRelazioni/' + itemId);
    };
    
    
     // callback for ng-click 'editUser':
    $scope.newRelazioni = function () {
        console.log('newRelazioni');
        $location.path('/new');
    };
    
    
}])


// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
// ReportCtrl -------------------------------------------------------------------------------------
.controller('ReportCtrl', ['$scope', 'Restangular', '$stateParams', 'modalService', 'rService', '$filter', '$http', '$sce', 'Session', 
                  function( $scope,  Restangular,  $stateParams,  modalService,   rService,   $filter,   $http,   $sce,  Session ) {

    $scope.item = {id_utenti : 0, tipo_report : 1, data_servizi : ''};
    $scope.item.tipo_report = 1;
    $scope.item.data_servizi = '';
    $scope.item.id_utenti = 0;
                      
    $scope.openedPopupDate = false;    
    
                      
   console.log('ReportCtrl : start ');                      
   console.log('ReportCtrl : stateParams ');                      
   console.log($stateParams);                      
                      
   if ($stateParams.tipo_stampa) {
       $scope.item.tipo_report = $stateParams.tipo_stampa;
       console.log('ReportCtrl : set tipo report ' + $scope.item.tipo_report);                      
   }
                      
   if ($stateParams.data_report) {                      
        $scope.item.data_servizi = $stateParams.data_report
   }
            
  if ($stateParams.id_utenti) {
      $scope.item.id_utenti = $stateParams.id_utenti;                      
  }
                      
   // fill select utenti
    if(Session.isAdmin) {
        console.log('ReportCtrl : populate list : isAdmin ');
        var utentiList = Restangular.all('utentiAll');
        utentiList.getList().then(function(accounts) {
            //console.log(accounts);
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
            console.log('ReportCtrl : push 0 in utenti list ');
            if ($stateParams.id_utenti) $scope.item.id_utenti = $stateParams.id_utenti;
            console.log('ReportCtrl : $scope.item.id_utenti ' + $scope.item.id_utenti);
        });
    } else {
        console.log('ReportCtrl : populate list : NOT isAdmin ');
        console.log(Session.id_utenti);
        $scope.utentiList = [];
        $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        $scope.item.id_utenti = Session.id_utenti;
        if ($stateParams.id_utenti) $scope.item.id_utenti = $stateParams.id_utenti;
    }

    /*var volontariList = Restangular.all('volontariAll');
    volontariList.getList().then(function(accounts) {
        //console.log(accounts);
        $scope.volontariList = accounts;
    });*/


    $scope.popupDate = function($event) {
        console.log('popupDate');
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.openedPopupDate) {
            $scope.openedPopupDate = false;
        } else {
            $scope.openedPopupDate = true;
        }
    };                      
                      
           
    $scope.build_excel = function(item){
        console.log('ReportCtrl: build_excel');
        modalService.showModal({}, {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Versione EXCEL della stampa (provvisorio)',
                bodyText: 'Cliccare per scaricare la versione EXCEL:'  + Session.nome_file + '<a href="">Clicca qui</a>'
                
                        }).then(
                    function (result) {
                        console.log('ok');
                    });
    };
                      
                      
    $scope.build_report = function(item){
        
        // validate form
        
        console.log('ReportCtrl: build_report...');
        console.log(item);
        console.log('ReportCtrl:build report:Start validator : ');
        var msg = '';
        
        if ($scope.item.id_utenti >= 0){
            msg = '';
        } else {
            msg = 'Selezionare una Associazione';
        }
        
        if (!$scope.item.data_servizi){
            msg = 'Selezionare una data!';
        }
    
    
        if (msg != ''){
            console.log('validate KO');
            modalService.showModal({}, {
                closeButtonText: 'Cancel',
                actionButtonText: 'Ok',
                headerText: 'Errori di inserimento dati!',
                bodyText: msg
                
                        }).then(
                    function (result) {
                        console.log('ok');
                    });
        } else {
        
            // carica i dati per creare la url
            var new_stampa = {
                id_utenti : $scope.item.id_utenti,
                tipo_report : $scope.item.tipo_report,
                data_servizi : $scope.item.data_servizi,
                relazione_servizio : $scope.item.relazione_servizio,
                utenti_controllati : $scope.item.utenti_controllati,
                dati_auto : $scope.item.dati_auto,
                giorno_servizi : $filter('date')($scope.item.data_servizi,'dd'),
                mese_servizi : $filter('date')($scope.item.data_servizi,'MM'),
                anno_servizi : $filter('date')($scope.item.data_servizi,'yyyy'),
                nome_file : new Date().getTime()
            };


            Session.nome_file = new_stampa.nome_file + 'REP.xlsx';

            
            var r_array = JSON.stringify(new_stampa);
            console.log(r_array);


            var formString = '', key;
            for (key in new_stampa) {
                    //if (!new_stampa[key]) { return; }
                    if (!new_stampa.hasOwnProperty(key)) { return; }
                    if (formString.length !== 0) { formString += '&'; }
                        formString += key + '=' + encodeURIComponent(new_stampa[key]);
            }
            console.log(formString);

            var url = '/pdf/?' + formString;
            //url = '/pdf?anno_servizi=1&prova=123';
            console.log(url);
            var success = new PDFObject({ url: url }).embed("PDF_DIV_CONTAINER");
        
        } // ok
        
    };
                      
                      
    $scope.$watch('item.id_utenti', function(newValue, oldValue) {
        console.log('ReportCtrl : id_utenti changed!' + newValue + ' ' +  oldValue);
    });
    
                      
    //AutoStart Report Controller
    if ($stateParams.tipo_stampa && $stateParams.data_report && $stateParams.id_utenti) {
        console.log('ReportCtrl : AUTOSTART'); 
        $scope.build_report($scope.item);
   }
                      
                   
                      
                      

}])
    
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
//TestController --------------------------------------------------------------------------------------
.controller('TestController', 
            [ '$scope', 'Session', 'Restangular', '$rootScope', '$modal', '$filter', '$location',
            function ($scope, Session, Restangular, $rootScope, $modal, $filter, $location) {
  console.log('TestController... START!');
  
  $scope.totalPages = 0;
  $scope.itemsCount = 0;
  $scope.currentPage = 1;    
  $scope.totalItems = 0;
  $scope.pageSize = 3;
  $scope.startPage = 0;         
  $scope.openedPopupDate = false;    
  $scope.utentiList = [];
 
    
  //default criteria that will be sent to the server
  $scope.filterCriteria = {
    pageNumber: 1,
    count: 0,
    limit: $scope.pageSize,
    start: 0,
    sortDir: 'asc',
    sortedBy: 'id',
    id_utenti_selezione : 0,
    mese_selezione : 0,
    anno_selezione: 0
  };
    
    // popola la lista utenti
    var volontariList = Restangular.all('utentiAll');
    volontariList.getList().then(function(accounts) {
        console.log(accounts);
        if(Session.isAdmin) {
            console.log('TestController : populate list : isAdmin ');
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
            $scope.id_utenti_selezione = 0;
        } else {
            console.log('TestController : populate list : NOT isAdmin ');
            console.log(Session.id_utenti);
            $scope.id_utenti_selezione = Session.id_utenti;
            $scope.utentiList = [];
            $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        }
    });    
 

 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      console.log('TestController...fetchResult');
      console.log($scope.filterCriteria);
    
      var serviziList = Restangular.all('serviziAll');
      
      console.log('TestController...fetchResult - count');
      $scope.filterCriteria.count = 1;
      serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log('COUNT: data[0].totalItems:');
            console.log(data);
          
            if (data.length > 0) {
                $scope.totalItems = data[0].totalItems;
            } else {
                $scope.totalItems = 0;
            }
            //$scope.totalPages = data[0].totalItems;
        }, function () {
            $scope.totalItems = 0;
            //$scope.totalPages = 0;
        });

      console.log('TestController...fetchResult - get data');
      
      var offset_page =  ( $scope.currentPage - 1 ) * $scope.pageSize;
      $scope.filterCriteria.count = 0;
      $scope.filterCriteria.start = offset_page;
      return serviziList.getList($scope.filterCriteria).then(function(data) {
            console.log(data);
            $scope.items = data;
        }, function () {
            $scope.items = [];
        });
    };
      
 
  //called when navigate to another page in the pagination
  $scope.selectPage = function () {
    var page = $scope.currentPage;
    console.log('Page changed to: ' + $scope.currentPage);  
    console.log('TestController...selectPage:' + page);
    $scope.currentPage = page;
    $scope.filterCriteria.pageNumber = page;
    $scope.fetchResult();
  };
 
  
 
  //manually select a page to trigger an ajax request to populate the grid on page load
  $scope.selectPage(1);
    

  // watch change selection    
  $scope.$watch("id_utenti_selezione", function(newValue, oldValue) {
        console.log('id_utenti changed! New ' + newValue + ' Old ' +  oldValue);
        
      if ( $scope.configAction == 'edit') {
        if(Session.isAdmin) {
            $scope.filterCriteria.id_utenti_selezione = newValue;
            $scope.currentPage = 1;
            $scope.filterCriteria.pageNumber = $scope.currentPage;
            $scope.fetchResult();

        } else {
            console.log('id_utenti_selezione changed! New NO ADMIN NO ACTION');
        }
      } else {
            console.log('id_utenti_selezione changed! BUT configAction !edit');
      }
        
    });    
    
    //watch on change
    
    $scope.$watch("data_servizi_selezione", function(newValue, oldValue) {
        console.log('data_servizi changed!' + newValue + ' ' +  oldValue);
        
        if(newValue){
            console.log($filter('date')(newValue,'MM'));
            console.log($filter('date')(newValue,'yyyy'));
            $scope.filterCriteria.mese_selezione = $filter('date')(newValue,'MM');
            $scope.filterCriteria.anno_selezione = $filter('date')(newValue,'yyyy');
        } else {
            $scope.filterCriteria.mese_selezione = 0;
            $scope.filterCriteria.anno_selezione = 0;
        }
        $scope.currentPage = 1;
        $scope.filterCriteria.pageNumber = $scope.currentPage;
        $scope.fetchResult();
        
    });    
    
    
    
    $scope.popupDate = function($event) {
        console.log('popupDate');
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.openedPopupDate) {
            $scope.openedPopupDate = false;
        } else {
            $scope.openedPopupDate = true;
        }
    };
    
    
    // callback for ng-click 'editUser':
    $scope.editItem = function (itemId) {
        console.log('editItem');
        $location.path('/edit/' + itemId);
    };
    
    
    
  // --------------------------------------------------- modal test    
    
    
  $scope.items = ['item1', 'item2', 'item3'];

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};    
    
    
    
  $scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      console.log('Modal dismissed at: ' + new Date());
    });
  };
   
      
}]);

