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
		for (var touchIndex= totalTouches; percentage>0 && touchIndex>=0; touchIndex--) {
			var touch = matchBlock.touches[touchIndex];
			var touchScore = {touch:touch,score:0, percentage:percentage};
			if (touch._team_id == possesionTeamId) {
				touchScore.score=score*percentage;
			} else if (touchIndex==matchBlock.touches.length-1) {
				touchScore.score=score*percentage;
			}
			touchScores.scores[touchIndex]=touchScore;
			percentage = calculatePercentage(percentage,touchIndex,totalTouches);
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