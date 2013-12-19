(function() {
	var app = angular.module('footballPrototypeApp');

	app.directive('competitionNavigation',['fixtureService',function(fixtureService){
		return {
			scope:{
				selected: "@"
			},
			restrict: 'E',
			replace:true,
			templateUrl: "templates/directives/competition-navigation.html",
			controller: function($scope){
				$scope.$on('fixtureLoaded',function(e) {
					var fixtureData = fixtureService.getFixtureData();
					$scope.competition_id = fixtureData._competition_id;
					$scope.season_id = fixtureData._season_id;
				});
			}
		}
	}]);

	app.directive('matchNavigation',['matchService','dataLoaderService',function(matchService,dataLoaderService){
		return {
			scope:{
				selected: "@",
				isFixture: "@"
			},
			restrict: 'E',
			replace:true,
			templateUrl: "templates/directives/match-navigation.html",
			controller: function($scope){
				$scope.$on('matchLoaded', function(e){  
					var match = matchService.getMatch();
					if ($scope.isFixture == 'true') {
						$scope.isResultOrLive = "false";
					} else {
						$scope.isResultOrLive = "true";
					}
					$scope.match_id = dataLoaderService.stripInitialLetterFromId(match._uID);
					var compdetails = matchService.getCompetitionDetails();
					$scope.competition_id =compdetails.competition_id;
					$scope.season_id = compdetails.season_id;
				});
			}
		}
	}]);
	
	app.directive('breadcrumbs',[function(){
		return {
			scope:{
				breadcrumbs: "=items",
			},
			restrict: 'E',
			replace:true,
			templateUrl: "templates/directives/breadcrumbs.html",
		}
	}]);

	app.directive('optaEventQualifier',[function() {
		return {
			restrict: 'E',
			scope: {
				qualifier: "="
			},
			templateUrl: "templates/directives/event-qualifier.html",
			controller: function($scope) {
				var qualifierDetail = optaQualifierCodes[$scope.qualifier._qualifier_id];
				if (qualifierDetail == null) {
					qualifierDetail = {name:"undocumented qualifier -"+$scope.qualifier._qualifier_id};
				}
				if (qualifierDetail.value=='Event_type') {
					var deletedEventType = optaEventCodes[$scope.qualifier._value];
					$scope.qualifier._value = deletedEventType.name;
				}
				$scope.qualifierDetail = qualifierDetail;
				$scope.qualifierid = $scope.qualifier._qualifier_id;
			}
		}
	}]);
	
	

	app.directive('playerImage',['playerImageService','matchService',function(playerImageService,matchService){
		return {
			scope:{
				playerid: "@",
			},
			controller: function($scope) {
				$scope.imageUrl = playerImageService.getPlayerImage($scope.playerid);
				$scope.playerName = matchService.getPlayerById($scope.playerid).getName();
			},
			restrict: 'E',
			replace:true,
			template: "<img width=\"120\" height=\"83\" ng-src=\"{{imageUrl}}\" alt=\"{{playerName}}\" />",
		}
	}]);
})();
