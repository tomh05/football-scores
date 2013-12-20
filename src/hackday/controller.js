(function() {
	var app = angular.module('footballPrototypeApp');
	
	
	app.factory('scoreTouches', [scoreTouches]);
	app.factory('matchSplitter', [matchSplitter]);
	app.factory('blockScorer', [blockScorer]);
	app.factory('playerScoreAggregator', [playerAggregateScores]);
	
	
	function createBreadcrumbs(matchCommonFunctionality,name) {
		var breadcrumbs = matchCommonFunctionality.getMatchBreadCrumbs();
		breadcrumbs.push({
			name: name,
			url:''
		});
		return breadcrumbs;
	}
	// controllers are connected to url routes inside src/app.js
	app.controller('hackdayIndexController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchService.loadMatch($scope.matchId);
	}]);
	
	
	app.controller('hackdayMatchSplitterController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','matchSplitter',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,matchSplitter) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchCommonFunctionality.initMatchLoadEvents($scope);
			matchService.loadMatch($scope.matchId);
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				$scope.matchBlocks =matchBlocks;
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'match splitter');
			});
	}]);
	
	
	app.controller('hackdayBlockScorerController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','matchSplitter','blockScorer',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,matchSplitter,blockScorer) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchCommonFunctionality.initMatchLoadEvents($scope);
			matchService.loadMatch($scope.matchId);
			$scope.world="Scorer!";
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				var blockScores = [];
				for (var matchBlockIndex in matchBlocks) {
					var matchBlock = matchBlocks[matchBlockIndex];
					var blockScore = blockScorer.execute(matchBlock);
					blockScores.push(blockScore);
				}
				$scope.blockScores=blockScores;
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'block scorer');
			});
	}]);
	
	app.controller('hackdayScoreTouchController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','scoreTouches','matchSplitter','blockScorer',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,scoreTouches,matchSplitter,blockScorer) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchCommonFunctionality.initMatchLoadEvents($scope);
			matchService.loadMatch($scope.matchId);
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				var touchScoreSet = [];
				for (var matchBlockIndex in matchBlocks) {
					var matchBlock = matchBlocks[matchBlockIndex];
					var blockScore = blockScorer.execute(matchBlock);
					var touchScores = scoreTouches.execute(matchBlock,blockScore);
					touchScoreSet.push(touchScores);
				}
				$scope.touchScoreSet =touchScoreSet;
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'score touches');
			});
	}]);
	
	app.controller('hackdayPlayerAggregateScoresController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','scoreTouches','matchSplitter','blockScorer','playerScoreAggregator',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,scoreTouches,matchSplitter,blockScorer,playerScoreAggregator) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchService.loadMatch($scope.matchId);
			$scope.world="PlayerAggregateScores!";
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				var touchScoreSet = [];
				for (var matchBlockIndex in matchBlocks) {
					var matchBlock = matchBlocks[matchBlockIndex];
					var blockScore = blockScorer.execute(matchBlock);
					var touchScores = scoreTouches.execute(matchBlock,blockScore);
					touchScoreSet.push(touchScores);
				}
				var playerAggregateScores = playerScoreAggregator.execute(touchScoreSet);
				$scope.playerAggregateScores =playerAggregateScores;
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'player scores');
			});
	}]);
	
	
	
})();
