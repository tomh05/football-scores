// Service for loading in Match Data
// F24 for events
// F9 for match details
angular.module('fixtures', ['data'])
  .factory('fixtureService', ['$rootScope','dataLoaderService', function($rootScope,dataLoaderService) {
  	var fixtureData;
  	var teamCache = {};
  	return {
  		loadFixtures: loadFixtures,
  		getMatchList: getMatchList,
  		getFixtureData: getFixtureData,
  		getTeamById: getTeamById
  	}
  	
  	function loadFixtures(competitionid,season_id) {
  		dataLoaderService.loadF1(competitionid,season_id,function(data, status) {
			fixtureData = data;
			teamCache ={}
			$rootScope.$broadcast('fixtureLoaded');
		});
  	}
  	
  	function getFixtureData() {
  		return fixtureData;
  	}
  	
  	function getDateGroupedFixtures() {
  	}
  	
  	function getMatchList() {
  		return fixtureData.MatchData;
  	}
  	
  	function getTeamById(id) {
  		if (id.indexOf("t") != 0) {
  			id="t"+id;
  		}
  		if (teamCache[id] != null) {
  			return teamCache[id];
  		}
  		var teams = fixtureData.Team;
  		var team = dataLoaderService.findById(id,teams);
  		teamCache[id] = team;
  		return team;
  	}
  	
  }]);