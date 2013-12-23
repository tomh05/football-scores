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
				//matchBlocks = matchBlocks.block; // strip block stats data
				$scope.matchBlocks = matchBlocks.blocks;
				$scope.matchStats = matchBlocks.stats;
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'match splitter');
			});
	}]);
	

	
	app.controller('hackdayBlockScorerController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','matchSplitter','blockScorer','d3Service',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,matchSplitter,blockScorer,d3Service) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchCommonFunctionality.initMatchLoadEvents($scope);
			matchService.loadMatch($scope.matchId);
			var blockScores = [];
				
			$scope.$on('matchEventsLoaded', function(e){ 
				var result = matchSplitter.execute(matchService.getEvents());
				matchBlocks = result.blocks; // strip block stats data
				blockScores = [];
				$scope.teamIds = matchService.getTeamIds();
				for (var matchBlockIndex in matchBlocks) {
					var matchBlock = matchBlocks[matchBlockIndex];
					var blockScore = blockScorer.execute(matchBlock);
					blockScores.push(blockScore);
				}
				///DO THE TIMELINE
				$scope.drawTimeLine();
				$scope.blockScores=blockScores;
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'block scorer');

				
			});


			$scope.drawTimeLine = function() {
				var homeTeamId = $scope.teamIds["home"];
				var awayTeamId = $scope.teamIds["away"];
				var timeline = {home:[],away:[]};
				var currentMinuteStats = null;
				if ($scope.timelineResolution == null) {
					$scope.timelineResolution="2";
				}
				var timelineWidth =parseInt($scope.timelineResolution);
				for (var blockScoreIndex in blockScores) {
					var blockScore=blockScores[blockScoreIndex];
					var startTime = Math.floor(parseInt(blockScore.matchBlock.touches[0]._min)/timelineWidth)*timelineWidth;
					if (currentMinuteStats == null || currentMinuteStats.home.minute != startTime) {
						if (currentMinuteStats != null) {
							timeline.home.push(currentMinuteStats.home);
							timeline.away.push(currentMinuteStats.away);
						}
						currentMinuteStats = {
							home:{
								label:startTime+" minutes",
								minute:startTime,
								score:0,
								blocks:[]
							},
							away:{
								label:startTime+" minutes",
								minute:startTime,
								score:0,
								blocks:[]
							}
						};
					}
					var teamid = blockScore.matchBlock._team_id;
					if (teamid == homeTeamId) {
						currentMinuteStats.home.score+=blockScore.score/timelineWidth;
						currentMinuteStats.home.blocks.push(blockScore);
					} else {
						currentMinuteStats.away.score+=blockScore.score/timelineWidth;
						currentMinuteStats.away.blocks.push(blockScore);
					}
				}
				timeline.home.push(currentMinuteStats.home);
				timeline.away.push(currentMinuteStats.away);
				$scope.timeline = timeline;
			}
	}]);
	
	app.controller('hackdayScoreTouchController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','scoreTouches','matchSplitter','blockScorer',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,scoreTouches,matchSplitter,blockScorer) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			matchCommonFunctionality.initMatchLoadEvents($scope);
			matchService.loadMatch($scope.matchId);
			var touchScoreSet = [];
				
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				matchBlocks = matchBlocks.blocks; // strip block stats data
				touchScoreSet = [];
				$scope.teamIds = matchService.getTeamIds();
				for (var matchBlockIndex in matchBlocks) {
					var matchBlock = matchBlocks[matchBlockIndex];
					var blockScore = blockScorer.execute(matchBlock);
					var touchScores = scoreTouches.execute(matchBlock,blockScore);
					touchScoreSet.push(touchScores);
				}
				$scope.touchScoreSet =touchScoreSet;
				$scope.drawTimeLine();
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'score touches');
			});

			$scope.drawTimeLine = function() {
				var homeTeamId = $scope.teamIds["home"];
				var awayTeamId = $scope.teamIds["away"];
				var timeline = {home:[],away:[]};
				var currentMinuteStats = null;
				if ($scope.timelineResolution == null) {
					$scope.timelineResolution="2";
				}
				var timelineWidth =parseInt($scope.timelineResolution);
				for (var touchScoreIndex in touchScoreSet) {
					var touchScore=touchScoreSet[touchScoreIndex];
					for (var touchIndex in touchScore.scores) {
						var touchScoreItem = touchScore.scores[touchIndex];
						var startTime = Math.floor(parseInt(touchScoreItem.touch._min)/timelineWidth)*timelineWidth;
						if (currentMinuteStats == null || currentMinuteStats.home.minute != startTime) {
							if (currentMinuteStats != null) {
								timeline.home.push(currentMinuteStats.home);
								timeline.away.push(currentMinuteStats.away);
							}
							currentMinuteStats = {
								home:{
									label:startTime+" minutes",
									minute:startTime,
									score:0
								},
								away:{
									label:startTime+" minutes",
									minute:startTime,
									score:0
								}
							};
						}
						var teamid = touchScoreItem.touch._team_id;
						if (teamid == homeTeamId) {
							currentMinuteStats.home.score+=touchScoreItem.score;
						} else {
							currentMinuteStats.away.score+=touchScoreItem.score;
						}
					}
				}
				timeline.home.push(currentMinuteStats.home);
				timeline.away.push(currentMinuteStats.away);
				$scope.timeline = timeline;
			}
			
	}]);
	
	app.controller('hackdayPlayerAggregateScoresController',
		['matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','scoreTouches','matchSplitter','blockScorer','playerScoreAggregator','matchService',
		function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,scoreTouches,matchSplitter,blockScorer,playerScoreAggregator,matchService) {
			$scope.matchId = $routeParams.matchid;
			commonViewFunctionality.initCommonFunctions($scope);
			$scope.findTeam = matchService.getTeamById;
			matchService.loadMatch($scope.matchId);
			$scope.world="PlayerAggregateScores!";
			
			$scope.$on('matchEventsLoaded', function(e){ 
				var matchBlocks = matchSplitter.execute(matchService.getEvents());
				matchBlocks = matchBlocks.blocks; // strip block stats

				var touchScoreSet = [];
				for (var matchBlockIndex in matchBlocks) {
					var matchBlock = matchBlocks[matchBlockIndex];
					var blockScore = blockScorer.execute(matchBlock);
					var touchScores = scoreTouches.execute(matchBlock,blockScore);
					touchScoreSet.push(touchScores);
				}
				var playerAggregateScores = playerScoreAggregator.execute(touchScoreSet);
				var teamScores=[{_team_id:0,total:0,scores:[]},{team:0,total:0,scores:[]}];
				var homeTeam =-1;
				for (var i=0;i<playerAggregateScores.length;i++) {
					var playerAggregateScore = playerAggregateScores[i];
					var isHomeTeam = false;
					var teamIndex = 1;
					if (homeTeam == -1 || playerAggregateScore._team_id == homeTeam) {
						homeTeam = playerAggregateScore._team_id;
						isHomeTeam = true;
						teamIndex = 0;
					} 
					teamScores[teamIndex]._team_id = playerAggregateScore._team_id;
					teamScores[teamIndex].scores.push(playerAggregateScore);
					teamScores[teamIndex].total += playerAggregateScore.score;
				}
				$scope.teamScores = teamScores;
				$scope.playerAggregateScores =playerAggregateScores;
				$scope.breadcrumbItems = createBreadcrumbs(matchCommonFunctionality,'player scores');
			});
	}]);
	
	
})();
