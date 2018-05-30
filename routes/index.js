const express = require('express');
const path = require('path');
const router = express.Router();
var childProcess = require('child_process');
var exec = require('child_process').exec;
var PythonShell = require('python-shell');
var options = {
    scriptPath: __dirname,

    args: process.argv.slice(2)
};
function runScript(scriptPath, callback) {

    var invoked = false;

    var process = childProcess.fork(scriptPath);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });

}

process.env.PYTHONIOENCODING = 'utf8';

var inspector = new PythonShell('../gitinspector.py', options);

inspector.on('message', function(message) {
    console.log(message);
});

inspector.end(function (err) {
    if (err) {
        throw err;
    }
});

router.get('/', (req, res) => {
  //CREATE PUG PAGE AND REPLACE INDEX HERE
  let pageInfo = {};
  pageInfo.title = "MCA";
  res.render('index', pageInfo);
});

router.get('/exit', function (req, res, next) {
  process.exit(1);
});

router.get('/ins', function (req, res, next) {
  runScript('./gitinspector.js', function (err) {
    if (err) throw err;
    console.log('finished running some-script.js');
  });
});

router.get('/jsongen', function (req, res, next) {
  dir = exec("git-of-theseus-analyze ../gitinspector --outdir public/", function(err, stdout, stderr) {
    console.log("*****GENERATING JSON FILES*****");
    if (err) {
        console.log("Oi youve got an error there..", err.code);
    }
    console.log(stdout);
  });
  dir.on('exit', function (code) {
    console.log("Successfully Completed!", code)
  });
});

router.get('/plotgen', function (req, res, next) {
  dir = exec("git-of-theseus-stack-plot public/cohorts.json --outfile public/images/stack.png", function(err, stdout, stderr) {
    console.log("*****GENERATING STACK PLOT CHART*****");
    if (err) {
        console.log("Oi youve got an error there..", err.code);
    }
    console.log(stdout);
  });
  dir.on('exit', function (code) {
    console.log("Successfully Completed!", code)
  });
});

router.get('/survgen', function (req, res, next) {
  dir = exec("git-of-theseus-survival-plot public/survival.json --outfile public/images/survival.png", function(err, stdout, stderr) {
    console.log("*****GENERATING SURVIVAL PLOT CHART*****");
    if (err) {
        console.log("Oi youve got an there..", err.code);
    }
    console.log(stdout);
  });
  dir.on('exit', function (code) {
    console.log("Successfully Completed!", code)
  });
});

router.get('/registrations', (req, res) => {
  Registration.find()
    .then((registrations) => {
      res.render('index', { title: 'Listing registrations', registrations });
})
    .catch(() => { res.send('Sorry! Something went wrong.'); });
});

module.exports = router;