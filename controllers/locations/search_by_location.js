var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../server.js').driver;
var fs = require("fs");
var query_get_location = fs.readFileSync(__dirname + '/../../queries/locations/get.cypher', 'utf8').toString();
var query_search_locations_by_location = fs.readFileSync(__dirname + '/../../queries/locations/search_by_location.cypher', 'utf8').toString();


// SEARCH BY LOCATION
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) {
            // Check search term
            if(!req.body.search_term || req.body.search_term === ''){
                callback(new Error("No search term found!"), 400);
            } else {
                callback(null);
            }
        },
        function(callback) { // Find entry by Id
            session
                .run(query_get_location, {
                    location_id: req.params.location_id
                })
                .then(function(result) {
                    // Check if Location exists
                    if (result.records.length===0) {
                        callback(new Error("Location with id '" + req.params.location_id + "' not found!"), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback) { // Find entries
            session
                .run(query_search_locations_by_location, {
                    location_id: req.params.location_id,
                    skip: req.query.skip || 0,
                    limit: req.query.limit || 9999999999,
                    search_term: req.body.search_term
                })
                .then(function(result) {
                    callback(null, result);
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(result, callback){ // Format attributes
            var results = [];

            async.forEachOf(result.records, function(record, item, callback) {
                var object = {};

                async.forEachOf(record.keys, function(key, item, callback) {

                    if (typeof(record._fields[item]) === 'object') {
                        if (key === 'id') {
                            object[key] = Number(record._fields[item].low);
                        } else if (record._fields[item] === null) {
                            object[key] = record._fields[item];
                        } else {
                            object[key] = Number(record._fields[item]);
                        }
                    } else {
                        object[key] = record._fields[item];
                    }
                    callback();
                }, function() {
                    results.push(object);
                    callback();
                });

            }, function() {
                callback(null, 200, results);
            });
        }
    ], function(err, code, result){
        // Close session
        session.close();

        // Send response
        if(err){
            if(!err.message){
                err.message = JSON.stringify(err);
            }
            console.error(colors.red(err.message));
            res.status(code).send(err.message);
        } else {
            res.status(code).send(result);
        }
    });

};
