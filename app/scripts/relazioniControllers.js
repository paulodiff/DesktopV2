'use strict';

/* Controllers */

angular.module('myApp.controllers')


//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
//EditItemCtrl--------------------------------------------------------------------------------------
.controller('EditItemCtrlRelazioni', ['$scope', '$state', '$stateParams', 'Restangular', 'modalService', 'rService', 'Session',  
                    function($scope, $state, $stateParams, Restangular, modalService, rService, Session) {

    // azione deriva dalla configurazione del controller new/edit
    console.log('EditItemCtrlRelazioni:  configAction :' +  $state.current.configAction);
    console.log($state);
    console.log($stateParams);
            
    var configAction = $state.current.configAction;
    $scope.configAction = configAction;
    $scope.item = {};
    $scope.openedPopupDate = false;   
    
    if (( configAction == 'edit') || ( configAction == 'view'))  {
        console.log('EditItemCtrlRelazioni : get data from rapportiAll : ' + $stateParams.id);

        var baseAccounts = Restangular.all('rapportiAll');
        baseAccounts.getList({limit: 50, id_rapporti_selezione : $stateParams.id}).then(function(accounts) {

            
            // accounts[0].elenco_id_volontari.split(',');

            console.log('EditItemCtrl : load data ....');
            console.log(accounts[0].elenco_id_volontari.split(','));

            $scope.item.id = $stateParams.id;
            $scope.item.id_servizi = accounts[0].id_servizi;
            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.lista_volontari_relazioni = accounts[0].elenco_id_volontari.split(',');
            $scope.item.a_ora_relazioni = new Date(accounts[0].a_ora_relazioni);
            $scope.item.da_ora_relazioni = new Date(accounts[0].da_ora_relazioni);
            //$scope.timeCalculated = rService.time_diff($scope.item.da_ora_relazioni, $scope.item.a_ora_relazioni);
            $scope.item.data_relazioni = accounts[0].data_relazioni;
            $scope.item.auto_relazioni = accounts[0].auto_relazioni;
            $scope.item.note_relazioni = accounts[0].note_relazioni;
            $scope.item.rapporto_relazioni = accounts[0].rapporto_relazioni;
            $scope.item.annullato_relazioni = accounts[0].annullato_relazioni;
            
          
        });
    }
                        
        
    if ( configAction == 'new') {
        
        // fare get dal servizio ed inizializzare i dati
        console.log('EditItemCtrlRelazioni : new from id_servizi' + $stateParams.id);
        
        
        var baseAccounts = Restangular.all('serviziAll');
        // This will query /accounts and return a promise.
        baseAccounts.getList({limit: 50, id_servizi_selezione : $stateParams.id}).then(function(accounts) {
            //$scope.projects = accounts;
            //console.log(accounts);
            console.log('EditItemCtrlRelazioni : load data ....');
            
            //$scope.item = accounts[0];
            //   patch date object
            //console.log('EditItemCtrl : patch time object');
            //console.log(accounts[0].da_ora_rapporti);
            //console.log(accounts[0].a_ora_rapporti);
            
       
            console.log(accounts[0].elenco_id_volontari.split(','));

            $scope.item.id_servizi = $stateParams.id;
            $scope.item.id_utenti = accounts[0].id_utenti;
            $scope.item.lista_volontari_relazioni = accounts[0].elenco_id_volontari.split(',');
            $scope.item.a_ora_relazioni = new Date(accounts[0].a_ora_servizi);
            $scope.item.da_ora_relazioni = new Date(accounts[0].da_ora_servizi);
            //$scope.timeCalculated = rService.time_diff($scope.item.da_ora_relazioni, $scope.item.a_ora_relazioni);
            $scope.item.data_relazioni = accounts[0].data_servizi;
            $scope.item.auto_relazioni = ' -- NEW AUTO --';
            $scope.item.note_relazioni = ' -- NEW NOTE --';
            $scope.item.rapporto_relazioni = ' -- NEW RAPPORTO --';
            
        });
    }
    
    // fill select utenti
    if(Session.isAdmin) {
        console.log('EditItemCtrlRelazioni : populate list : isAdmin ');
        var utentiList = Restangular.all('utentiAll');
        utentiList.getList().then(function(accounts) {
            //console.log(accounts);
            $scope.utentiList = accounts;
        });
    } else {
        console.log('EditItemCtrlRelazioni : populate list : NOT isAdmin ');
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
        console.log('EditItemCtrlRelazioni : Time changed to: ' + $scope.item.da_ora_relazioni);
        console.log('EditItemCtrlRelazioni : Time changed to: ' + $scope.item.a_ora_relazioni);
        //$scope.timeCalculated = rService.time_diff($scope.item.da_ora_relazioni, $scope.item.a_ora_relazioni);
        //if ( $scope.timeCalculated < 1 ) {
        //    $scope.timeCalculated = $scope.timeCalculated + 24;
        //}
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
                        console.log('EditItemCtrlRelazioni : Deleting....');
                        console.log(item.id);
                        
                        //var baseAccounts = Restangular.all('servizi');
                        // This will query /accounts and return a promise.
                        //baseAccounts.getList({limit: 50, id_servizi_selezione : $stateParams.id}).then(function(accounts) {
                        //var account = Restangular.one("servizi", item.id_servizi).get();   

                        Restangular.oneUrl('relazioni', '/api1/relazioni/' + item.id ).get().then(
                            function(account){
                                console.log('get!');
                                console.log(account);
                                account.annullato_relazioni = 1;
                                console.log('put!');
                                //Restangular.setBaseUrl('/api1/servizi/' + item.id_servizi);
                                Restangular.setBaseUrl('/api1');
                                account.customPUT({annullato_relazioni : 1},item.id, {}, {});
                                //account.put();
                                Restangular.setBaseUrl('/apiQ');
                                $state.go('listRelazioni');
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
        
        
        
        
        console.log('EditItemCtrlRelazioni : cancel_action');
        console.log(item);
    }
    
    
    // add item
    $scope.save_action = function(item){
        
        // validate form
        console.log('EditItemCtrlRelazioni:save_action:Start validator : ');
        
        var msg = '';
        /*
        if ($scope.item.a_ora_servizi <= $scope.item.da_ora_servizi){
            msg = 'Orario servizi errato!';
        }
        */

        if ($scope.item.lista_volontari_relazioni.length == 0){
            msg = 'Selezionare un volontario!';
        }
        
        console.log('EditItemCtrlRelazioni:save_action:Start validator :data_servizi :' + $scope.item.data_servizi);
        console.log('EditItemCtrlRelazioni:save_action:Start validator :data_servizi :' + new Date());
        
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
        
            var new_relazione = {
                //id_volontari_servizi :  $scope.item.id_volontari_servizi,
                id_utenti : $scope.item.id_utenti,
                id_servizi : $scope.item.id_servizi,
                data_relazioni : $scope.item.data_relazioni,
                da_ora_relazioni : $scope.item.da_ora_relazioni,
                a_ora_relazioni : $scope.item.a_ora_relazioni,
                note_relazioni : $scope.item.note_relazioni,
                auto_relazioni : $scope.item.auto_relazioni,
                rapporto_relazioni : $scope.item.rapporto_relazioni,
                lista_volontari : $scope.item.lista_volontari_relazioni
            };
            
            console.log('POST ... ' + new_relazione);
            
            var baseServizi = Restangular.allUrl('relazioni', '/api1/relazioni');
            baseServizi.post(new_relazione).then(
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
                        $state.go('editRelazioni', { id: msg.id });
                    },
                    function (error){
                        $state.go('editRelazioni', { id: msg.id });
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
    
    // avvia la preparazione della stampa
    $scope.print_action = function(item){
        console.log('EditItemCtrlRelazioni:print_action: ');
        console.log(item);
        $state.go('reportView', { id_utenti: item.id_utenti, data_report : item.data_relazioni, tipo_stampa : 4 });
        
    }
    
    
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
        }
        
    });
}])



// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
// InfiniteCtrl ---------------------------------------------------------------------------------
.controller('InfiniteCtrlRelazioni', ['$scope', '$location', 'Restangular', '$filter', 'Session' , function($scope,  $location, Restangular, $filter, Session) {
    
    console.log('InfiniteCtrlRapporti start...');
  
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
    
    console.log('InfiniteCtrlRapporti INIT filterCriteria');
    console.log($scope.filterCriteria);
    
    // popola la lista utenti
    var volontariList = Restangular.all('utentiAll');
    volontariList.getList().then(function(accounts) {
        console.log(accounts);
        if(Session.isAdmin) {
            console.log('InfiniteCtrlRapporti : populate list : isAdmin ');
            $scope.utentiList = accounts;
            $scope.utentiList.push({"id_utenti": 0,"nome_breve_utenti": "TUTTI"});
            $scope.id_utenti_selezione = 0;
        } else {
            console.log('InfiniteCtrlRapporti : populate list : NOT isAdmin ');
            console.log(Session.id_utenti);
            $scope.id_utenti_selezione = Session.id_utenti;
            $scope.filterCriteria.id_utenti_selezione = Session.id_utenti;
            $scope.utentiList = [];
            $scope.utentiList.push({id_utenti: Session.id_utenti,nome_breve_utenti: Session.nome_breve_utenti});
        }
    });    
 

 
  //The function that is responsible of fetching the result from the server and setting the grid to the new result
  $scope.fetchResult = function () {
      console.log('InfiniteCtrlRapporti...fetchResult');
      console.log($scope.filterCriteria);
    
      var serviziList = Restangular.all('rapportiAll');
      
      console.log('InfiniteCtrlRapporti...fetchResult - count');
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

      console.log('InfiniteCtrlRapporti...fetchResult - get data');
      
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
        $location.path('/editRelazioni/' + itemId);
    };
    
    
}]);

