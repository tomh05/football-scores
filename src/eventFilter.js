angular.module('eventFilterModule',['match'])
  .factory('eventFilterFactory', [function() {
  	return function(customMatchFunction) {
		var eventTypeList = null, 
			outcome = null,
			qualifiers = null
	
		var self = createSelfMethods(isMatch);
		
		function createSelfMethods(matchMethod) {
			return {
				setEventTypes: setEventTypes,
				setOutcome: setOutcome,
				setQualifiers: setQualifiers,
				isMatch : matchMethod,
				or : or,
				and : and
			};
		}
		
		function setEventTypes(newEventTypeList) {
			if (!(newEventTypeList instanceof Array)) {
				eventTypeList = [newEventTypeList];
			} else {
				eventTypeList = newEventTypeList;
			}
			return self;
		}
		
		function setOutcome(newOutcome) {
			outcome = newOutcome;
			return self;
		}
		
		
		function setQualifiers(newQualifiers) {
			// users can specify one new qualifier or a list
			if (!(newQualifiers instanceof Array)) {
				newQualifiers = [newQualifiers];
			} else {
				newQualifiers = newQualifiers;
			}
			qualifiers = [];
			// validate each value
			// allow for users to specify a qualifier id and a value
			for (var i=0;i<newQualifiers.length;i++) {
				var newQualifier = newQualifiers[i];
				if (newQualifier != null && newQualifier.length>0) {
					qualifiers.push(newQualifier.split("="));
				}
			}
			return self;
		}
		
		function doesQualifierMatch(qualifierInEvent,userSpecifiedValueToMatch) {
			//user may have specified a single qualifier which needs to be present
			// or a qualifier and value using Qid=Value
			var qualifierIdInEvent = qualifierInEvent._qualifier_id;
			if (userSpecifiedValueToMatch[0]==qualifierIdInEvent) {
				// check if there was a specified value
				if (userSpecifiedValueToMatch.length>0 && userSpecifiedValueToMatch[1] != qualifierInEvent._value) {
					return false;
				}
				return true;
			}
			return false;
		}
		
		function doQualifiersMatchEvent(event) {
			if (qualifiers == null || qualifiers.length==0) {
				return false;
			}
			var qualifiersInCurrentEvent = event.Q;
			if (qualifiersInCurrentEvent == undefined) {
				return false;
			}
			if (!(qualifiersInCurrentEvent instanceof Array)) {
				// if an event has one qualifier the JSON conversion makes
				// it into a single object rather then an array
				qualifiersInCurrentEvent = [qualifiersInCurrentEvent];
			}
			var qualifiersMatched = false;
			// check each qualifier in the event
			for (var i=0;!qualifiersMatched && i<qualifiersInCurrentEvent.length; i++) {
				var qualifierInEvent = qualifiersInCurrentEvent[i];
				// against each value specified in the query
				for (var j=0;!qualifiersMatched && j<qualifiers.length;j++) {
					var userSpecifiedValueToMatch = qualifiers[j];
					qualifiersMatched = doesQualifierMatch(qualifierInEvent,userSpecifiedValueToMatch);
				}
			}
	
			return qualifiersMatched;
		}
		
	
		function isMatch(event) {
			var matchResult = true;
			if (eventTypeList != null) {
				var eventType = event._type_id;
				matchResult = (eventTypeList.indexOf(eventType) != -1);
			}
			if (matchResult && outcome != null) {
				if (event._outcome != outcome) {
					matchResult = false;
				}
			}
			if (matchResult && qualifiers != null) {
				matchResult = doQualifiersMatchEvent(event);
			}
			return matchResult;
		}
		
		function or(eventFilter) {
			return createSelfMethods(function(event) {
					return self.isMatch(event) || eventFilter.isMatch(event);
			});
		}
		
		function and(eventFilter) {
			return createSelfMethods(function(event) {
					return self.isMatch(event) && eventFilter.isMatch(event);
			});
		}
	
		return self;
  	}
  }]);
  
  
  angular.module('eventFilterModule').service('eventFilters', ['eventFilterFactory',function(eventFilterFactory) {
  	var endOfPlayFilter = createEndOfPlayFilter();
  	
  	function createEndOfPlayFilter() {
		/*
		E8 outcome = 1 - interception
		E52 outcome: 1 - Keeper Pickup
		E49 outcome 1 - Ball recovery
		E5 outcome =0
		E15 attempt saved

		*/
		var endOfPlayFilter = eventFilterFactory();
		endOfPlayFilter.setEventTypes(["52","49"]).setOutcome("1");
	
		var nextEndOfPlayFiler = eventFilterFactory();
		nextEndOfPlayFiler.setEventTypes(["15","16"]);
		return endOfPlayFilter.or(nextEndOfPlayFiler).or(eventFilterFactory().setEventTypes(["6","5","4"]).setOutcome("0"));
  	};
  	
  	return {
  		getEndOfPlayFilter:function() {
  			return endOfPlayFilter;
  		},
  		isEndOfPlay:function(event) {
  			return endOfPlayFilter.isMatch(event);
  		}
  	}
  	
  }])
  
   angular.module('eventFilterModule')
  	.factory('eventFilter', [function() {
  		return {
  			filterMatchEvents: filterMatchEvents
  		}
  		function filterMatchEvents(matchService, eventFilter) {
  			var matchingEvents = [];
  			matchService.iterateEvents( function(event) {
				if (eventFilter.isMatch(event)) {
					matchingEvents.push(event);
				} 
			});
			return matchingEvents;
  		}
  	}]);
  
  angular.module('eventFilterModule')
  	.factory('groupedEventFactory', [function() {
  		return function (displayName, fieldName, positiveFilter, negativeFilter) {
  			return {
  						displayName:displayName,
  						fieldName:fieldName,
  						positiveFilter: positiveFilter,
  						negativeFilter: negativeFilter
  			}
  		}
  	}]); 
  angular.module('eventFilterModule')
  	.factory('playerGroupingService', ['matchService',function(matchService) {
  		
  		function groupPlayers(groupedEventArray) {
  			var playerTotalsById = [];
  			var playerTotals = [];
  			
  			
  			function recordMatch(playerId, isGood, isBad, groupedEvent) {
  				var playerTotal = playerTotalsById[playerId];
				if (playerTotal == null) {
					playerTotal = {player_id:playerId};
					playerTotalsById[playerId]=playerTotal;
					playerTotals.push(playerTotal);
				}
				if (playerTotal[groupedEvent.fieldName]==null) {
					playerTotal[groupedEvent.fieldName]=0;
					playerTotal[groupedEvent.fieldName+"_bad"]=0;
					playerTotal[groupedEvent.fieldName+"_good"]=0;
				}
				playerTotal[groupedEvent.fieldName]++;
				playerTotal[groupedEvent.fieldName+"_bad"]+=isBad?1:0;
				playerTotal[groupedEvent.fieldName+"_good"]+=isGood?1:0;
				
  			}
  			
			matchService.iterateEvents( function(event) {
  				for (groupedEventIndex in groupedEventArray) {
  					var groupedEvent = groupedEventArray[groupedEventIndex];
					var isGood = false;
					var isBad = false;
					
					if (groupedEvent.positiveFilter.isMatch(event)) {
						isGood = true;
					} else if (groupedEvent.negativeFilter.isMatch(event)) {
						isBad = true;
					}
					if (isGood || isBad) {
						var playerId = event._player_id;
						recordMatch(playerId, isGood, isBad, groupedEvent);
					}
  				}
			});
  			return playerTotals;
  		}
  		
  		return {
  			groupPlayers:groupPlayers
  		}
  }]);