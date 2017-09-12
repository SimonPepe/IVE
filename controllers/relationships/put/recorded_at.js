var colors = require('colors');
var async = require('async');
var neo4j = require('neo4j-driver').v1;
var _ = require('underscore');
var moment = require('moment');
var driver = require('../../../server.js').driver;
var fs = require("fs");
var query_get_relationship = fs.readFileSync(__dirname + '/../../../queries/relationships/get.cypher', 'utf8').toString();
var query_edit_relationship = fs.readFileSync(__dirname + '/../../../queries/relationships/edit/recorded_at.cypher', 'utf8').toString();


// PUT (:recorded_at)
exports.request = function(req, res) {

    // Start session
    var session = driver.session();

    async.waterfall([
        function(callback) { // Find entry
            session
                .run(query_get_relationship, {
                    relationship_id: req.params.relationship_id
                })
                .then(function(result) {
                    // Check if Relationship exists
                    if (result.records.length===0) {
                        callback(new Error("Relationship with id '" + req.params.relationship_id + "' not found!"), 404);
                    } else {
                        callback(null);
                    }
                })
                .catch(function(err) {
                    callback(err, 500);
                });
        },
        function(callback){ // Parameter validation

            // TODO: Validate all attributes of req.body
            var params = {
                relationship_id: req.params.relationship_id,
                description: req.body.description,
                preferred: req.body.relationship_preferred
            };

            callback(null, params);
        },
        function(params, callback) { // Update entry
            session
                .run(query_edit_relationship, params)
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
                callback(null, 200, results[0]);
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
