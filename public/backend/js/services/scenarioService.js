var app = angular.module("scenarioService", []);

/**
 * Scenario Service Provider
 */
app.factory('$scenarioService', function($http, config) {

    return {

        list: function() {
            return $http.get(config.apiURL + "/scenarios");
        },
        retrieve: function(scenario_id) {
            return $http.get(config.apiURL + "/scenarios/" + scenario_id);
        },
        create: function() {
            return $http.post(config.apiURL + "/scenarios");
        },
        edit: function(scenario_id) {
            return $http.put(config.apiURL + "/scenarios/" + scenario_id);
        },
        delete: function(scenario_id) {
            return $http.delete(config.apiURL + "/scenarios/" + scenario_id);
        }

    };

});