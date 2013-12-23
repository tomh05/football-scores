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
	

	app.directive('databar',[function(){
		return {
			scope:{
				maxsize: "@",
				size:"@",
				alignment:"@"
			},
			controller: function($scope) {
				var size= parseFloat($scope.size);
				var maxsize = parseFloat($scope.maxsize);
				var percentage = (size*100)/maxsize;
				$scope.percentage = percentage;
				var alignment = $scope.alignment;
				var permittedAlignments = ["horizontal","vertical"];
				if (alignment == null || permittedAlignments.indexOf(alignment)==-1)
				{
					if (alignment != null) {
						console.error("Alignment property value "+alignment+" is not valid");
					}
					alignment = permittedAlignments[0];
				}
				var property="width";
				if (alignment == permittedAlignments[1]) {
					property="height";
				}
				$scope.alignment = alignment;
				$scope.property = property;
				
			},
			restrict: 'E',
			replace:true,
			template: "<span style='{{property}}:{{percentage|number:0}}%' class='data-bar data-bar-{{alignment}}' title='{{size|number:2}}'></span>",
		}
	}]);
	
	
  	app.directive('d3Bars', ['d3Service', '$window',function(d3Service,$window ) {
    return {
      restrict: 'EA',
      scope: {
        data:'=',
        invert: '@',
        max: '@'
      },
      link: function(scope, element, attrs) {
        if (scope.invert == null) {
            scope.invert = "0";
        }
        d3Service.d3().then(function(d3) {
            var margin = parseInt(attrs.margin) || 20,
            barHeight = parseInt(attrs.barHeight) || 20,
            barPadding = parseInt(attrs.barPadding) || 5;
            var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

            // Browser onresize event
            window.onresize = function() {
                scope.$apply();
            };

            // Watch for resize event
            scope.$watch(function() {
                return angular.element($window)[0].innerWidth;
            }, function() {
                scope.render(scope.data);
            });

            scope.$watch('data', function() {
               scope.render(scope.data);
             });

            scope.render = function(data) {
                // remove all previous items before render
        		svg.selectAll('*').remove();

        		// If we don't pass any data, return out of the element
        		if (!data) return;

        		// setup variables
        		var width = d3.select(element[0]).node().offsetWidth - margin,
        			// calculate the height
        			height = barHeight + barPadding,
        			// Use the category20() scale function for multicolor support
        			color = d3.scale.category20(),
        			// our xScale
        			 yScale =scope.max;
                    barWidth = (width / data.length) - barPadding;
                    ;

        		// set the height based on the calculations above
        		svg.attr('height', height);
                var bgRect = svg.append("rect")
                    .attr('fill', '#ffffff')
                    .attr('stroke','#cccccc')
                    .attr('width', width+margin)
                    .attr('x', 0)
                    .attr('height', height);

                var numGuides = 3;
                for (var i=0;i<numGuides;i++) {
                    var ypos = height*(i+1)/(numGuides+1);
                    var guideLine = svg.append("line")
                    .attr('stroke','#eeeeee')
                    .attr('x1',0)
                    .attr('x2',margin+width)
                    .attr('y1',ypos)
                    .attr('y2',ypos)

                }
                var g=svg.append("g");
        		//create the rectangles for the bar chart
        		g.selectAll('rect')
        		  .data(data).enter()
        			.append('rect')
        			.attr('height',  function (d) {
                        return (d.score*height/yScale);
                    })
        			.attr('width', barWidth)
        			.attr('x', function(d,i) { 
                        return (Math.round(margin/2) + i*(barWidth+barPadding));
                    })
        			.attr('y', function (d) {
                        if (scope.invert=="1") {
                            return height- (d.score*height/yScale);
                        } else {
                            return 0;
                        }
                    })
        			.attr('fill', '#fede2d')
        			.attr('title', function(d){return d.label})

        	}
            scope.render(scope.data);
		});
		}
		};
  }]);

})();
