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

// var ProgressBar = require('progress');

// var bar = new ProgressBar(':bar', { total: 100 });
// var timer = setInterval(function () {
//   bar.tick();
//   if (bar.complete) {
//     console.log('\ncomplete\n');
//     clearInterval(timer);
//   }
// }, 1000);

router.get('/', (req, res) => {
  //CREATE PUG PAGE AND REPLACE INDEX HERE
  let pageInfo = {};
  pageInfo.title = "MCA";
  res.render('index', pageInfo);
});

router.get('/exit', function (req, res, next) {
  process.exit(1);
});

// router.get('/ins', function (req, res, next) {
//   runScript('./gitinspector ../analyses', function (err) {
//     if (err) throw err;
//     console.log('finished running Gitinspector');
//   });
// });
router.get('/ins', function (req, res, next) {
  console.log("*****RUNNING GITINSPECTOR*****");
  dir = exec("node gitinspector.js ../analyses", function(err, stdout, stderr) {
    if (err) {
        console.log("Oi youve got an error there..", err.code);
    }
    console.log(stdout);
  });
  dir.on('exit', function (code) {
    console.log("Successfully Completed!", code)
  });
});

router.get('/jsongen', function (req, res, next) {
  console.log("*****GENERATING JSON FILES*****");
  dir = exec("git-of-theseus-analyze ../analyses --outdir public/", function(err, stdout, stderr) {
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
  console.log("*****GENERATING STACK PLOT CHART*****");
  dir = exec("git-of-theseus-stack-plot public/cohorts.json --outfile public/images/stack.png", function(err, stdout, stderr) {
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
  console.log("*****GENERATING SURVIVAL PLOT CHART*****");
  dir = exec("git-of-theseus-survival-plot public/survival.json --outfile public/images/survival.png", function(err, stdout, stderr) {
    if (err) {
        console.log("Oi youve got an there..", err.code);
    }
    console.log(stdout);
  });
  dir.on('exit', function (code) {
    console.log("Successfully Completed!", code)
  });
});

router.get('/authgen', function (req, res, next) {
  console.log("*****GENERATING AUTHOR STATISTICS FOR WITCHHUNT*****");
  dir = exec("git-of-theseus-stack-plot public/authors.json --outfile public/images/authors.png", function(err, stdout, stderr) {
    if (err) {
        console.log("Oi youve got an there..", err.code);
    }
    console.log(stdout);
  });
  dir.on('exit', function (code) {
    console.log("Successfully Completed!", code)
  });
});

router.get('/extgen', function (req, res, next) {
  console.log("*****GENERATING EXTENSION STATISTICS*****");
  dir = exec("git-of-theseus-stack-plot public/exts.json --outfile public/images/exts.png", function(err, stdout, stderr) {
    if (err) {
        console.log("Oi youve got an there..", err.code);
    }
    console.log(stdout);
  });
  dir.on('exit', function (code) {
    console.log("Successfully Completed!", code)
  });
});

module.exports = router;