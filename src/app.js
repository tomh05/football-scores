(function() {
	var app = angular.module('footballPrototypeApp', ['match','fixtures','eventFilterModule','ngRoute','player','preferences'])

	app.config(['$routeProvider',
	  function($routeProvider) {
		$routeProvider.
	  	  when('/preferences', {
			templateUrl: 'templates/preferences.html',
			controller: 'preferencesController'
		  }).
		  when('/:year/:competitionid/matches', {
			templateUrl: 'templates/fixtures.html',
			controller: 'fixturesController'
		  }).
		  when('/:year/:competitionid/analysis', {
			templateUrl: 'templates/competition-analysis.html',
			controller: 'analysisController'
		  }).
		  when('/:year/:competitionid/match/:matchid', {
			templateUrl: 'templates/match-overview.html',
			controller: 'matchPageController'
		  }).
		  when('/:year/:competitionid/match/:matchid/team-stats', {
			templateUrl: 'templates/match-team-stats.html',
			controller: 'teamStatsController'
		  }).
		  when('/:year/:competitionid/match/:matchid/events', {
			templateUrl: 'templates/match-events.html',
			controller: 'matchEventController'
		  }).
		  when('/:year/:competitionid/match/:matchid/commentary', {
			templateUrl: 'templates/match-commentary.html',
			controller: 'matchCommentaryController'
		  }).
		  when('/:year/:competitionid/team/:id', {
			templateUrl: 'templates/team.html',
			controller: 'teamController'
		  }).
		  otherwise({
			redirectTo: '/2013/8/matches' // premiership
		  });
	  }]);
  
  
	app.factory('commonViewFunctionality',['dataLoaderService','matchService','preferenceService',
		function(dataLoaderService,matchService,preferenceService) {

		return {
			initCommonFunctions:initCommonFunctions,
			buildCompetitionBreadCrumb:buildCompetitionBreadCrumb
		}	
	
	
	
		function buildCompetitionBreadCrumb (id,year,name) {
				var url = "#/"+year+"/"+id+"/matches";
				return {href:url,name:name+" "+year};
		};
		
		function initCommonFunctions($scope) {
			$scope.stripInitialLetter = dataLoaderService.stripInitialLetterFromId;
			$scope.findPlayer = matchService.getPlayerById;
			$scope.matchTime = function(min,sec) {
				return min+":"+((sec.length==1)?"0"+sec:sec);
			}
		}	
			
		
	}]);

	app.controller('navController',['$scope','commonViewFunctionality','fixtureService',function($scope,commonViewFunctionality,fixtureService) {
		commonViewFunctionality.initCommonFunctions($scope);
		$scope.competitions = optaCompetitions;
		$scope.competition_id = null;
		$scope.breadcrumbs = [];
		$scope.updateProxy = function() {
		}		
		$scope.isSelectedCompetition = function(competitionId,activeClass) {
			if (competitionId == $scope.competitionid) {
				return activeClass;
			}
		};
		$scope.$on('fixtureLoaded',function(e) {
			var fixtureData = fixtureService.getFixtureData();
			$scope.teams = fixtureData.Team;
			$scope.competition_id = fixtureData._competition_id;
			$scope.season_id = fixtureData._season_id;
		});
	}]);
	
	app.controller('fixturesController', ['$routeParams','$scope','fixtureService','commonViewFunctionality',
	function($routeParams,$scope,fixtureService,commonViewFunctionality) {
		commonViewFunctionality.initCommonFunctions($scope);
		var competitionid =  $routeParams.competitionid,
			year = $routeParams.year;
		
		fixtureService.loadFixtures(competitionid,year);
		$scope.title = "Loading Fixtures...";
		$scope.findTeam = fixtureService.getTeamById;
	
		$scope.matchFilterDate = null;
		$scope.showWeeks = true;
		$scope.opened = false;
	
	
		$scope.openCalendar = function() {
			$timeout(function() {
			  $scope.opened = true;
			});
		};
	
		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		  };
	
		$scope.getMatchId = function(id) {
			if (id.indexOf("g") == 0) {
				return id.substring(1);
			}
			return id;
		};
	
		$scope.$on('fixtureLoaded',function(e) {
			$scope.allData = fixtureService.getFixtureData();
			$scope.matches = fixtureService.getMatchList();
			$scope.teams = fixtureService.getFixtureData().Team;
			$scope.title = $scope.allData._competition_name;
			$scope.competition_id = $scope.allData._competition_id;
			$scope.season_id=$scope.allData._season_id;
			var rootBreadCrumb = commonViewFunctionality.buildCompetitionBreadCrumb(
							$scope.allData._competition_id,
							$scope.allData._season_id,
							$scope.allData._competition_name);
			$scope.breadcrumbItems = [
				rootBreadCrumb,
				{name: "Fixtures", url:rootBreadCrumb.url+"/matches"}
			];
		});
	
		$scope.matchFilter = function(match)
		{
			var result = true;
			if (result && $scope.matchTypeFilter != null) {
				result = (match.MatchInfo._Period ==  $scope.matchTypeFilter);
			}
			if (result && $scope.matchFilterTeam != null) {
				var id = $scope.matchFilterTeam._uID;
				var homeTeam = match.TeamData[0]._TeamRef;
				var awayTeam = match.TeamData[1]._TeamRef;
				result = ( (homeTeam == id) || (awayTeam == id));
			}
			return result;
		};
	
	
	}]);
	
	
  
  app.controller('teamController',[function() {
  }]);
  
  
  app.controller('preferencesController',['$scope','preferenceService',
  	function($scope,preferenceService) {
  		$scope.proxyMethod=preferenceService.getPreference("proxyMethod");
  		$scope.cacheTime=preferenceService.getPreference("cacheTime");
  		$scope.cacheBust= preferenceService.getPreference("cacheBust");
  		
  		$scope.updateProxy = function() {
  			preferenceService.setPreference("proxyMethod",$scope.proxyMethod);
  		}
  		$scope.updateCacheTime = function() {
  			preferenceService.setPreference("cacheTime",$scope.cacheTime);
  		}
  		$scope.updateCacheBust = function() {
  			preferenceService.setPreference("cacheBust",$scope.cacheBust);
  		}
  	}]);

})();
    