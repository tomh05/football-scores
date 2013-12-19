(function() {
	var app = angular.module('footballPrototypeApp');
	
	
	app.factory('scoreTouches', [scoreTouches]);
	
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
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','scoreTouches',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,scoreTouches) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchService.loadMatch($scope.matchId);
			$scope.world="TouchScorer!";
			scoreTouches.setProp1(5);
			scoreTouches.incrementProp1();
			scoreTouches.incrementProp1();
			$scope.prop1=scoreTouches.getProp1();
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