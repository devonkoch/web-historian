var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var httpHelpers = require('../web/http-helpers.js');
var htmlFetcher = require('../workers/htmlfetcher.js');
var CronJob = require('cron').CronJob;


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });

};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){

  httpHelpers.readContent(exports.paths.list, function(error, urls){
    callback(urls.split('\n'));
  });  
};

exports.isUrlInList = function(url, callback){

  exports.readListOfUrls(function(urls){
    var result = urls.indexOf(url) !== -1;
    callback(result);
  });

};

exports.addUrlToList = function(url, callback){

  fs.appendFile(exports.paths.list, url + "\n", function(error) { 
    if (error){
      console.log(error);
    }
  });

  if(callback) {
    callback();
  }
};

exports.isUrlArchived = function(url, exists){

  var fullPath = exports.paths.archivedSites + url;

  var result = false;

  fs.stat(fullPath, function(err, stat) {
    if(err == null) {
      result = true;
    }else{
      console.log(err);
    }
    exists(result);
  
  });
};

exports.downloadUrls = function(urls){
  urls.forEach(function(url){
    fs.writeFile(exports.paths.archivedSites + "/" + url, '', 'utf8', function(error){
      if(error) console.log("An error occured, sir.");
    });
  });
};

exports.writeToExistingFile = function(url){
  
  htmlFetcher.fetchHTML(url, function(data){
    fs.writeFile(exports.paths.archivedSites + '/' + url, data, "utf8", function(error){
      if(error) {
        console.log("There's an error with overwriting a file!");
      }
    });
  });
};

exports.job = function() {
  var writePerMinute = new CronJob('0 * * * * *', function(){
    exports.readListOfUrls(function(urls){
      urls.forEach(function(url){
        exports.writeToExistingFile(url);
      });
    });
      
  }, function () {
    // This function is executed when the job stops
    console.log("The chronz are all gone :(")
  },
  true /* Start the job right now */,
  "America/Los_Angeles" /* Time zone of this job. */
  );
};
