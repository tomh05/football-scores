(function() {
	var app = angular.module('footballPrototypeApp');
	
	

	app.controller('analysisController',[
			'fixtureService','$routeParams','$scope', 'commonViewFunctionality','dataLoaderService','f9Reader',
			function(fixtureService,$routeParams,$scope,commonViewFunctionality,dataLoaderService,f9Reader) {
				commonViewFunctionality.initCommonFunctions($scope);
				var competitionid =  $routeParams.competitionid,
					year = $routeParams.year;
				$scope.finished = false;
				$scope.status = "Loading Fixtures";
				$scope.matchesLoaded = 0;
				$scope.errorsLoading=0;
				$scope.totalMatches = "TBC";
				fixtureService.loadFixtures(competitionid,year);
				
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
						{name: "Analysis", url:rootBreadCrumb.url+"/analysis"}
					];
					
					$scope.totalMatches = $scope.matches.length;
					$scope.optaStats = optaStats;
					
					startLoadingAllF9Files();
				});
				
				var matchesLoaded = 0;
				var errorsLoading= 0;
				var maxToLoad = 380; 
				function startLoadingAllF9Files() {
					$scope.status = "Downloading Match files to calculate stats";
					$scope.matchesLoaded = matchesLoaded;
					$scope.errorsLoading=errorsLoading;
					loadNextF9();
				}
				
				function loadNextF9() {
					var match = fixtureService.getMatchList()[matchesLoaded];
					var matchid =dataLoaderService.stripInitialLetterFromId(match._uID);
					dataLoaderService.loadF9(matchid,function(matchData,status) {
						matchesLoaded++;
						$scope.matchesLoaded=matchesLoaded;
						if (status == "500") {
							errorsLoading++;
							$scope.errorsLoading=errorsLoading;
						} else {
							mapSeasonStats(matchData);
						}
						var errorThreshold = ($scope.matches.length/10);
						var abandonDueToErrors = (errorsLoading>errorThreshold);
						var matchesLeftToLoad = Math.min(maxToLoad,$scope.matches.length)-matchesLoaded;
						if (!abandonDueToErrors && matchesLeftToLoad) {
							loadNextF9();
							if (matchesLoaded % 5 ==0) {
								$scope.seasonStats = seasonStats;
							}
						} else {
							finaliseSeasonStats();
							$scope.seasonStats = seasonStats;
							$scope.overviewSeasonStats = overviewSeasonStats;
							$scope.finished = true;
							if (abandonDueToErrors) {
								$scope.status = "Downloading abandoned due to "+errorsLoading+" errors downloading files";
							} else {
								$scope.status = "Downloading Completed";
							}
						}
					});
				}
				
				var seasonStats = {};
				var overViewStats = {};
				function mapSeasonStats(matchData) {
					for (var teamDataIndex in matchData.MatchData.TeamData) {
						var teamDataNode=matchData.MatchData.TeamData[teamDataIndex];
						// read all the team stats from the f9
						var teamData=f9Reader.readTeamStats(teamDataNode);
						// integrate the data into the season stats
						for (var key in teamData) {
							if (seasonStats[key]== null) {
								seasonStats[key]={key:key,total:0,count:0,mean:0,stdev:0,data:[]};
							}
							var data = seasonStats[key].data;
							var value = teamData[key].FT;
							data.push(value);
							seasonStats[key].total += value;
							seasonStats[key].count = data.length;
							if (seasonStats[key].total>0) {
								seasonStats[key].mean = seasonStats[key].total/data.length;
							}
						}
					}
				}
				
				function finaliseSeasonStats() {
					overviewSeasonStats= {}
					for (var key in optaStats) {
						var statLine = seasonStats[key];
						var average = calculateStandardDeviation(statLine.data);
						statLine.stdev = average.deviation;
						overviewSeasonStats[key]={key:key,mean:statLine.mean,stdev:statLine.stdev}
					}
				}
				
				function calculateStandardDeviation(data) {
					var result = {mean: 0, variance: 0, deviation: 0}, 
						total = data.length;
					for(var m, s = 0, l = total; l--; s += data[l]); {
						for(m = result.mean = s / total, l = total, s = 0; l--; s += Math.pow(data[l] - m, 2));
					}
					result.deviation = Math.sqrt(result.variance = s / total);
					return result;
				}
				
				/*var teamSeasonStats = {};
				
				function mapMatchTeamStats(matchData) {
					for (var teamDataIndex in matchData.MatchData.TeamData) {
						var teamData=match.MatchData.TeamData[teamDataIndex]
						var teamId = dataLoaderService.stripInitialLetterFromId(teamData._TeamRef);
						if (teamSeasonStats[teamId]== null) {
							teamSeasonStats[teamId]={"teamid":teamId,"data":[]};
						}
						var teamStats = teamSeasonStats[teamId].data;
						
						for (var statIndex in teamData.Stat) {
							var stat = teamData.Stat[statIndex];
							var key = stat._Type;
							if (teamStats[key]== null) {
								teamStats[key]=[];
							}
							teamStats[key].push(stat.__text);
						}
					}
					$scope.teamSeasonStats = teamSeasonStats;
				}*/
	
				
	}]);

	
})();