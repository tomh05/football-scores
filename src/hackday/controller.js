(function() {
	var app = angular.module('footballPrototypeApp');
	
	
	app.factory('scoreTouches', [scoreTouches]);
	app.factory('matchSplitter', [matchSplitter]);
	
	
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
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','matchSplitter',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,matchSplitter) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchService.loadMatch($scope.matchId);
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				$scope.matchBlocks =matchBlocks;
			});
			
			$scope.world="Splitter!";
	}]);
	
	
	app.controller('hackdayBlockScorerController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','matchSplitter','blockScorer'
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,matchSplitter,blockScorer) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchService.loadMatch($scope.matchId);
			$scope.world="Scorer!";
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				var blockScores = [];
				for (var matchBlock in matchBlocks) {
					var blockScore = blockScorer.execute(matchBlock);
					blockScores.push(blockScore);
				}
				$scope.blockScores =blockScores;
			});
	}]);
	
	app.controller('hackdayScoreTouchController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','scoreTouches','matchSplitter','blockScorer',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,scoreTouches) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchService.loadMatch($scope.matchId);
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				var touchScores = [];
				for (var matchBlock in matchBlocks) {
					var blockScore = blockScorer.execute(matchBlock);
					var scoredTouch = scoreTouches.execute(matchBlock,blockScore);
					touchScores.push(scoredTouch);
				}
				$scope.blockScores =touchScores;
			});
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