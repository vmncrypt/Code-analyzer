const express = require('express')
const routes = require('./routes/index');
const path = require('path')
const app = express()
var childProcess = require('child_process');
//var sys = require('sys')
var exec = require('child_process').exec;

var requirejs = require('requirejs');

requirejs.config({
    nodeRequire: require
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')
app.use(express.static(path.join(__dirname, "public")));
app.use('/', routes);

app.get('/',function(req,res){
  res.render('index', { title: 'MOB Code Analyser', message: 'Scan & Analyse the latest  repos' })
  //res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

var ProgressBar = require('progress');

var bar = new ProgressBar(':bar', { total: 100 });
var timer = setInterval(function () {
  bar.tick();
  if (bar.complete) {
    console.log('\ncomplete\n');
    clearInterval(timer);
  }
}, 1000);

function puts(error, stdout, stderr) { sys.puts(stdout) }

module.exports = app;