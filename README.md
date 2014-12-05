README

yo ionic AppName

install grunt module win-spawn
npm install win-spawn

in Gruntfile.js

//var spawn = require('child_process').spawn;
var spawn = require('win-spawn');

Install bootstrap & save to bower.json

npm install boostrap --save
npm install angular --save
npm uninstall ionic --save
npm uninstall angular-mocks (optional)
npm uninstall angular-scenario (optional)

grunt init (run wiredep update index.html)
grunt serve

edit index.html for bootstrap template


http://startbootstrap.com/template-overviews/sb-admin/
https://github.com/FezVrasta/bootstrap-material-design

---------------------------------------------------------------


OPERAZIONI PER LO SVILUPPO

Configurazioni e cartelle
-----------------------------------------------------------------------------------

gruntfile.js file di "make" per lo sviluppo

bower.json configurazione di tutte le librerie 
.bowerrc opzioni di bower (cartella)

node_modules tutti i moduli npm e grunt

app/ cartella dove risiedono i sorgenti dell'applicazione

www/ cartella dove viene preparata l'applicazione per il serve

Operations
-----------------------------------------------------------------------------------

grunt init (


grunt ( esegue un jshint) con le configurazioni di .jshintrc e .jshintignore


Esegue un deploy nella cartella www/ con o senza compressione
grunt serve --consolelogs
grunt serve:compress