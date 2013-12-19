(function() {
	var app = angular.module('footballPrototypeApp');
	
	app.factory('matchCommonFunctionality',['matchService','eventFilter',
		'eventFilterFactory','fixtureService','dataLoaderService','commonViewFunctionality',
		function(matchService,eventFilter,eventFilterFactory,fixtureService,dataLoaderService,commonViewFunctionality) {

		return {
			initMatchLoadEvents:initMatchLoadEvents,
			getMatchTitle: getMatchTitle,
			getMatchBreadCrumbs: getMatchBreadCrumbs,
			getMatchUrl: getMatchUrl
		}	
	
		function initMatchLoadEvents($scope) {
			$scope.$on('matchLoaded', function(e){  
				initTitleAndCommonVars($scope);
				var match = matchService.getMatch();
				matchService.loadFixtures();
			});
			$scope.$on('matchEventsLoaded', function(e){  
				$scope.eventList = matchService.getEvents();
				initTimeline($scope);
			});
			$scope.$on('fixtureLoaded',function(e) {
				$scope.allData = fixtureService.getFixtureData();
				$scope.matches = fixtureService.getMatchList();
				$scope.teams = fixtureService.getFixtureData().Team;
			});
		}
			
		function initTimeline($scope) {
			var filter = eventFilterFactory().setEventTypes(["16"]);// goals 
			filter = filter.or(eventFilterFactory().setQualifiers("214")); // or big chances
			// Multiple OR's don't work - leaving this in case we return to try fix
			//var disallowedGoals = eventFilterFactory().setEventTypes(["43"]);
			//disallowedGoals.setQualifiers("144=38");
			//filter = filter.or(disallowedGoals); 
			$scope.matchKeyEvents = eventFilter.filterMatchEvents(matchService, filter);
			$scope.optaEventCodes = optaEventCodes;
			$scope.matchEvents = matchService.getEvents();
		}
	
		function initTitleAndCommonVars($scope) {
			var match = matchService.getMatch();
			var teamData = match.MatchData.TeamData;
			$scope.selectedMatchId = matchService.getMatchId();
			$scope.teamData = teamData;
			$scope.homeScore = teamData[0]._Score;
			$scope.getTeamById = matchService.getTeamById;
			$scope.homeName = matchService.getTeamById(teamData[0]._TeamRef).Name;
			$scope.awayScore = teamData[1]._Score;
			$scope.awayName = matchService.getTeamById(teamData[1]._TeamRef).Name;
			$scope.match = match;
			$scope.title = getMatchTitle();
		}
		
		function getMatchUrl() {
			var match = matchService.getMatch();
			var compDetails = matchService.getCompetitionDetails();
			return '#/'+compDetails.season_id+'/'+compDetails.competition_id+'/match/'+matchService.getMatchId();
		}
				
		function getMatchTitle() {
			var match = matchService.getMatch();
			var teamData = match.MatchData.TeamData;
			var homeName = matchService.getTeamById(teamData[0]._TeamRef).Name;
			var awayName = matchService.getTeamById(teamData[1]._TeamRef).Name;
			if (teamData[0]._Score !== undefined) {
				var homeScore =teamData[0]._Score;
				var awayScore =teamData[1]._Score;
				return homeName+" "+homeScore+" v "+awayScore+" "+awayName;
			} else {
				return homeName+" v "+awayName;
			}
		}
	
		function getMatchBreadCrumbs() {
			var match = matchService.getMatch();
			var compDetails = matchService.getCompetitionDetails();
			var breadcrumbs = [
				commonViewFunctionality.buildCompetitionBreadCrumb(
					compDetails.competition_id,
					compDetails.season_id,
					compDetails.name
				),
				{
					href:getMatchUrl(),
					name:getMatchTitle()
				}
			];
			return breadcrumbs;
		}
	}]);

	app.controller('matchCommentaryController',[
			'matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality',
			function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality) {
				$scope.matchId = $routeParams.matchid;
				matchService.loadMatch($scope.matchId);
				commonViewFunctionality.initCommonFunctions($scope);
				matchCommonFunctionality.initMatchLoadEvents($scope);
			
				
				$scope.$on('matchLoaded', function(e){  
					matchService.loadCommentary($routeParams.matchid);
					var breadcrumbs = matchCommonFunctionality.getMatchBreadCrumbs();
					breadcrumbs.push({
						name: "Commentary",
						url:matchCommonFunctionality.getMatchUrl()+"/commentary"
					});
					$scope.breadcrumbItems =  breadcrumbs;
				});
				
				$scope.$on('matchCommentaryLoaded', function(e){
					$scope.commentary = matchService.getCommentary();
				});
	}]);

	app.controller('matchEventController',[
			'matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','eventFilters',
			function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,eventFilters) {
				$scope.matchId = $routeParams.matchid;
				matchService.loadMatch($scope.matchId);
				commonViewFunctionality.initCommonFunctions($scope);
				matchCommonFunctionality.initMatchLoadEvents($scope);
				$scope.isEndOfPlay = eventFilters.isEndOfPlay;
				$scope.$on('matchLoaded', function(e){  
					var breadcrumbs = matchCommonFunctionality.getMatchBreadCrumbs();
					breadcrumbs.push({
						name: "Events",
						url:matchCommonFunctionality.getMatchUrl()+"/events"
					});
					$scope.breadcrumbItems =  breadcrumbs;
				});
	}]);
	app.controller('teamStatsController',[
			'matchService','$routeParams','$scope', 'commonViewFunctionality','matchCommonFunctionality','f9Reader',
			function(matchService,$routeParams,$scope,commonViewFunctionality,matchCommonFunctionality,f9Reader) {
				$scope.matchId = $routeParams.matchid;
				matchService.loadMatch($scope.matchId);
				commonViewFunctionality.initCommonFunctions($scope);
				matchCommonFunctionality.initMatchLoadEvents($scope);
				
				$scope.$on('matchLoaded', function(e){  
					var breadcrumbs = matchCommonFunctionality.getMatchBreadCrumbs();
					breadcrumbs.push({
						name: "Team Stats",
						url:matchCommonFunctionality.getMatchUrl()+"/team-stats"
					});
					$scope.breadcrumbItems =  breadcrumbs;
					var match = matchService.getMatch();
					$scope.match = match;
					var stats = {};
					var teams = [];
					for (var teamDataIndex in match.MatchData.TeamData) {
						var teamData=match.MatchData.TeamData[teamDataIndex];
						var teamId = teamData._TeamRef;
						teams.push(teamId);
						var teamStats = f9Reader.readTeamStats(teamData);
						for (var key in teamStats) {
							var value = teamStats[key];
							if (stats[key]==null) {
								stats[key] = {key:key,maxDeviation:0,isSignificant:false,data:{}};
							}
							stats[key].data[teamId] = value;
							// is it significant??
							var average = seasonTeamStatsAverages[key];
							value.isSignificant = false;
							value.deviation =0;
							if (average != null) {
								var fullTimeValue = parseInt(value.FT);
								var deviation = average.mean - fullTimeValue;
								if (deviation<0) {
									deviation = -deviation;
								}
								if (deviation>average.stdev && fullTimeValue>1) {
									value.isSignificant = true;
									stats[key].isSignificant = true;
								}
								value.deviation =deviation/average.stdev;
								if (value.deviation > stats[key].maxDeviation) {
									stats[key].maxDeviation = value.deviation ;
								}
							}
							
						}
						
					}
					$scope.teams = teams;
					var statsArray = []
					for (var key in stats) {
						statsArray.push(stats[key]);
					}
					$scope.stats = statsArray;
					$scope.optaStats = optaStats;
					// convert to an array for sorting to work.
					$scope.seasonTeamStatsAverages = seasonTeamStatsAverages;
				});
	}]);
	
	

	app.controller('matchPageController', [
  		'matchService','$routeParams','$scope', 'eventFilterFactory','groupedEventFactory',
  		'playerGroupingService','commonViewFunctionality','matchCommonFunctionality',
  		function(matchService,$routeParams,$scope,eventFilterFactory,groupedEventFactory,
  		playerGroupingService,commonViewFunctionality,matchCommonFunctionality) {
			$scope.teamData = [];
			$scope.eventList = [];
			$scope.matchKeyEvents = null;
			$scope.matchList = matchService.matches;
			
			
			commonViewFunctionality.initCommonFunctions($scope);
			matchCommonFunctionality.initMatchLoadEvents($scope);
			$scope.playerStatsConfig = [
					groupedEventFactory(
						"Passes", 
						"passes", 
						eventFilterFactory().setEventTypes("1").setOutcome("1"), 
						eventFilterFactory().setEventTypes("1").setOutcome("0")
					),
					groupedEventFactory(
						"Tackles", 
						"tackles", 
						eventFilterFactory().setEventTypes("7"), 
						eventFilterFactory().setEventTypes("45")
					),
					groupedEventFactory(
						"Shots", 
						"shots", 
						eventFilterFactory().setEventTypes(["15","16"]), // on target
						eventFilterFactory().setEventTypes(["13","14"]) // off target
					)
			];
			if ($routeParams.matchid != null) {
				loadMatch($routeParams.matchid);
			}
			
			function initPlayerStats() {
				$scope.playerStats = playerGroupingService.groupPlayers($scope.playerStatsConfig);
			}
			
			
			function loadMatch(matchId) {
				$scope.title = "Loading Match...";
				matchService.loadMatch(matchId);
			}
			$scope.$on('matchLoaded', function(e){  
				var match = matchService.getMatch();
				var compDetails = matchService.getCompetitionDetails();
				$scope.breadcrumbItems =  matchCommonFunctionality.getMatchBreadCrumbs();
			});
			
			
			$scope.$on('matchEventsLoaded', function(e){  
				initPlayerStats();
			});
			
			$scope.$on('matchCommentaryLoaded', function(e){
				$scope.commentary = matchService.getCommentary();
			});
		
			
			$scope.checkStatExists = function(propertyName ) {
				return function( item ) {
					return item[propertyName] != null;
				};
			};
  }]);
})();