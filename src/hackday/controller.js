(function() {
	var app = angular.module('footballPrototypeApp');
	
	
	
	
	// controllers are connected to url routes inside src/app.js
	app.controller('hackdayIndexController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality) {
		$scope.matchId = $routeParams.matchid;
		commonViewFunctionality.initCommonFunctions($scope);
		matchService.loadMatch($scope.matchId);
		$scope.world="Index";
	}]);
	
	
	app.controller('hackdayMatchSplitterController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality) {
		$scope.matchId = $routeParams.matchid;
		commonViewFunctionality.initCommonFunctions($scope);
		matchService.loadMatch($scope.matchId);
		$scope.world="Splitter!";
	}]);
	
	
	app.controller('hackdayBlockScorerController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality) {
		$scope.matchId = $routeParams.matchid;
		commonViewFunctionality.initCommonFunctions($scope);
		matchService.loadMatch($scope.matchId);
		$scope.world="Scorer!";
	}]);
	
	app.controller('hackdayScoreTouchController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality) {
		$scope.matchId = $routeParams.matchid;
		commonViewFunctionality.initCommonFunctions($scope);
		matchService.loadMatch($scope.matchId);
		$scope.world="TouchScorer!";
	}]);
	
	app.controller('hackdayPlayerAggregateScoresController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality) {
		$scope.matchId = $routeParams.matchid;
		commonViewFunctionality.initCommonFunctions($scope);
		matchService.loadMatch($scope.matchId);
		$scope.world="PlayerAggregateScores!";
	}]);
	
	
	
	
	
})();