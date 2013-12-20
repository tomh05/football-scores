function scoreTouches() {
	// this is effectively a singleton
	// public methods
	return {
		execute:execute
	}
	/**
	MatchBlock = {touches:matchEvents[]}
	
	ScoreTouches(MatchBlock, BlockScore) -> TouchScores[]
	TouchScore  - {touch:matchEvent,score:score}
	*/
	function execute(matchBlock, blockScore) {
		var possesionTeamId = matchBlock._team_id;
		var touchScores = {scores:[],blockScore:blockScore,_team_id:possesionTeamId};
		var score = blockScore.score;
		var percentage = 1;
		var totalTouches =  matchBlock.touches.length-1;
		var currentScoredTouchNumber = totalTouches;
		for (var touchIndex= totalTouches; percentage>0 && touchIndex>=0; touchIndex--) {
			var touch = matchBlock.touches[touchIndex];
			var touchScore = {touch:touch,score:0, percentage:0,awardRatio:0};
			if (touch._type_id != 5 && touch._type_id != 49) {
				var awardScore = false;
				var awardRatio = 1;
				if (touch._team_id == possesionTeamId) {
					awardScore = true;
				} else if (touch._outcome==1) {
					awardScore = true;
				}
				if (awardScore) {
					touchScore.percentage = percentage;
					touchScore.awardRatio = awardRatio;
					touchScore.score=score*percentage*awardRatio;
					percentage = calculatePercentage(percentage,currentScoredTouchNumber,totalTouches);
					currentScoredTouchNumber--;
				}
			}
			touchScores.scores[touchIndex]=touchScore;
		}
		return touchScores;
	}
	
	function calculatePercentage(currentPercentage,currentTouchNumber, totalTouches) {
		return currentPercentage-0.05;
	}
	
	function getPossesionTeam(matchBlock) {
		return matchBlock.touches[0]._team_id;
	}
	
	
}