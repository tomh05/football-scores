// Service for loading in Match Data
// F24 for events
// F9 for match details
angular.module('match', ['data'])
  .factory('matchService', ['$rootScope', 'dataLoaderService', function($rootScope,dataLoaderService) {
  	var events = null, 
  	    match = [],
  	    commentary = null,
  		currentMatchId = null;
  		
  	return {
  		getMatch: getMatch,
  		getEvents: getEvents,
  		getCommentary: getCommentary,
  		loadEvents: loadEvents,
  		loadMatch: loadMatch,
  		getPlayerById: getPlayerById,
  		getTeamById: getTeamById,
  		groupEventsByPlayer: groupEventsByPlayer,
  		iterateEvents: iterateEvents,
  		getMatchId: getMatchId,
  		loadFixtures: loadFixtures,
  		getCompetitionDetails: getCompetitionDetails,
  		loadCommentary:loadCommentary,
  		getTeamIds:getTeamIds
  	}
  	
  	function iterateEvents(callBackFunction) {
  		if (events!= null && events.Event != null) {
			angular.forEach(events.Event,function(event) {
				callBackFunction(event);
			});
		}
  	}
  	
  	function groupEventsByPlayer(filterFunction) {
  		var totals = [];
  		if (events!= null && events.Event != null) {
			angular.forEach(events.Event,function(event) {
				if (filterFunction == null || filterFunction(event)) {
		
					var existing = totals[event._player_id];
					if (existing == null) {
						existing = 0;
					}
					totals[event._player_id] = ++existing;
				}
			});
  		}
  		var players = [];
  		for (playerid in totals) {
  			players.push({player_id:playerid,total:totals[playerid]});
  		}
  		return players;
  	}
  	
  	function createPlayerJson(player) {
  		var 
  		first = (player!=null)?player.PersonName.First:"",
  		last = (player!=null)?player.PersonName.Last:"",
  		name = (player!=null)?((player.PersonName.Known!=null)?player.PersonName.Known:first+" "+last):"",
  		id = (player!=null)?player._uID:0;
		return {
				First: first, 
				Last: last,
				getName : function() {
					return name;
				},
				id: id,
				_uID: id
		}
  	}
  	
  	function getPlayerById(id) {
  		id = dataLoaderService.addInitialLetterToId('p',id);
  		var teams = match.Team;
  		for (var teamIndex in teams) {
  			var team = teams[teamIndex];
  			var player = dataLoaderService.findById(id,team.Player);
			if (player != null) {
				return createPlayerJson(player);
			}
  		}  		
  		return createPlayerJson(null);
  	}
  	
  	function getTeamById(id) {
  		id = dataLoaderService.addInitialLetterToId('t',id);
  		var teams = match.Team;
  		var team = dataLoaderService.findById(id,teams);
  		return team;
  	}
  	
  	function getMatch() {
  		return match;
  	}
  	
  	function getEvents() {
  		return events;
  	}
  	
  	function getCommentary() {
  		return commentary;
  	}
  	
  	function loadMatch(matchid) {
  		currentMatchId = matchid;
  		dataLoaderService.loadF9(matchid,function(data, status) {
  			match = data;
			$rootScope.$broadcast('matchLoaded');
			loadEvents(matchid);
		});
	}
	
  	function loadEvents(matchid) {
  		var params = {game_id:matchid,feed_type:"F24"};
  		dataLoaderService.loadXmlToJson(params,function(data, status) {
			events=data.Games.Game;
			angular.forEach(events.Event,function(event) {
				if (event.Q !== undefined && !(event.Q instanceof Array)) {
					// if an event has one qualifier the JSON conversion makes
					// it into a single object rather then an array
					event.Q = [event.Q];
				}
			});
			$rootScope.$broadcast('matchEventsLoaded');
		});
	}
	
  	function loadCommentary(matchid) {
  		var params = {game_id:matchid,feed_type:"F13", language:"en"};
  		dataLoaderService.loadXmlToJson(params,function(data, status) {
  			if (data.Commentary != undefined) {
				commentary=data.Commentary.message;
				$rootScope.$broadcast('matchCommentaryLoaded');
			}
		});
	}
	
	function getMatchId() {
		return currentMatchId;
	}
	
	function getCompetitionStat(statType) {
		var competitionStats = match.Competition.Stat;
		for (var i=0; i<competitionStats.length;i++) {
			var stat = competitionStats[i];
			if (stat._Type == statType) {
				return stat.toString();
			}
		}
	}
	function getCompetitionDetails() {
		return {
			name: match.Competition.Name,
			competition_id: dataLoaderService.stripInitialLetterFromId(match.Competition._uID),
			season_id: getCompetitionStat("season_id")
		}	
	}
	
	function getTeamIds() {
		var teamData = match.MatchData.TeamData;
		if (teamData[0]._Side == "Home") {
			return {
				home:dataLoaderService.stripInitialLetterFromId(teamData[0]._TeamRef),
				away:dataLoaderService.stripInitialLetterFromId(teamData[1]._TeamRef),
			}
		} else {
			return {
				home:dataLoaderService.stripInitialLetterFromId(teamData[1]._TeamRef),
				away:dataLoaderService.stripInitialLetterFromId(teamData[0]._TeamRef),
			}
		}
	}
	
	function loadFixtures() {
		var competitionid = dataLoaderService.stripInitialLetterFromId(match.Competition._uID);
		var year = getCompetitionStat("season_id");
	}
	
  }]);