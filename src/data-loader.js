angular.module('data', ['preferences'])
  .factory('dataLoaderService', ['$http','preferenceService', function($http,preferenceService) {
  	return {
  		loadXmlToJson: loadXmlToJson,
  		findById: findById,
  		stripInitialLetterFromId: stripInitialLetterFromId,
  		addInitialLetterToId: addInitialLetterToId,
  		loadF1: loadF1,
  		loadF9: loadF9
  	};
  	
  	
  	function loadF1(competitionid,year,callback) {
  		var params = {competition:competitionid,season_id:year,feed_type:"F1"};
  		loadXmlToJson(params,function(data, status) {
			fixtureData = data.SoccerFeed.SoccerDocument;
			callback(fixtureData,status);
		});
  	}
  	
  	function loadF9(matchid, callback) {
  		var params = {game_id:matchid,feed_type:"F9"};
  		loadXmlToJson(params,function(data,status) {
  		
  			if (data.SoccerFeed == null) {
  				console.log("Error loading data for match "+matchid);
  				callback(null,"500");
  			} else {
  				callback(data.SoccerFeed.SoccerDocument,status);
  			}
  		});
  	}
  	 	
  	function loadXmlToJson(params,callback) {
  		var url = buildUrl(params);
		$http.get(url,{
				transformResponse:transformResponse
			}
		).success(function(data, status) {
			callback(data, status);
		});
  	}
  	
  	function transformResponse(data) {
		// convert the data to JSON and provide
		// it to the success function below
		var x2js = new X2JS();
		var json = x2js.xml_str2json( data );
		return json;
  	}
	
	function buildUrl(params) {
		var path = "proxy.php?";
		for (var param in params) {
			path+=param+"="+escape(params[param])+"&";
		}
		var proxyMethod = preferenceService.getPreference("proxyMethod","reith");
		path+="proxyMethod="+proxyMethod+"&";
		var cacheTime = preferenceService.getPreference("cacheTime");
		if (cacheTime != null) {
			path+="cacheTime="+escape(preferenceService.getPreference("cacheTime"))+"&";
		}
		var useCacheBuster = preferenceService.getPreference("cacheBust");
		if (useCacheBuster == "1") {
			path+="r="+escape(Math.random())+"&";
		}
		return path;
	}
	
	
  	function findById(id,nodes) {
  		for (var nodeIndex in nodes) {
  			var node = nodes[nodeIndex];
  			if (node._uID == id) {
  				return node;
  			}
  		}
  		return null;
  	}
  	
  	function stripInitialLetterFromId(id) {
  		// should really check if it does start with a letter
  		// for now assume that it will only be called when it does.
		if (id != null && id != "") {
			return id.substring(1);
		} else {
			return "";
		}
	};
	
	function addInitialLetterToId(letter,id) {
  		if (id.indexOf(letter) != 0) {
  			id=letter+id;
  		}
  		return id;
  	
	}
  	
  }]);
  
  angular.module('data').factory('f9Reader', [function() {
  	return {
  		readTeamStats: readTeamStats
  	};
  	
  	function statCalculator(statValues) {
  		return {
  			percentage:percentage
  		}
  		
  		function percentage(param1,param2) {
			
			function percentageImplementation(item) {
				var paramValue1 =0, paramValue2 =0;
				if (statValues[param1] != null) {
					paramValue1=parseInt(statValues[param1][item]);
				}
				if (statValues[param2] != null) {
					paramValue2=parseInt(statValues[param2][item]);
				}
				if (paramValue2==0) {
					return 0;
				}
				return paramValue1*100/paramValue2;
			};
			
			return {
				"FT":percentageImplementation("FT"),
				"FH":percentageImplementation("FH"),
				"SH":percentageImplementation("SH"),
			}
		}
	}
  	
  	function readTeamStats(teamDataNode) {
		// read the detail for this match
		var values = {};
		for (var statIndex in teamDataNode.Stat) {
			var stat = teamDataNode.Stat[statIndex];
			var key = stat._Type;
			values[key] = {"FT":parseInt(stat.__text),"FH":parseInt(stat._FH),"SH":parseInt(stat._SH)};
		}
		// ensure we record a value for each valid stat
		// and calculate computed stats
		for (var key in optaStats) {
			var definition = optaStats[key];
			if (values[key] == undefined) {
				values[key] = {"FT":0,"FH":0,"SH":0};
				if (definition.calculation != null) {
					values[key] = definition.calculation(statCalculator(values));
				} 
			}
		}
		return values;
  	}
  	
  	
  	
  }]);