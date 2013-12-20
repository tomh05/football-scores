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
		var touchScores = [];
		var possesionTeamId = getPossesionTeam(matchBlock);
		var score = blockScore.score;
		for (var touchIndex=  matchBlock.touches.length-1; score>0 && touchIndex>=0; touchIndex--) {
			var touch = matchBlock.touches[touchIndex];
			var touchScore = {touch:touch,score:0};
			if (touch._team_id == possesionTeamId) {
				touchScore.score=score;
			} else if (touchIndex==matchBlock.touches.length-1) {
				touchScore.score=score;
			}
			touchScores[touchIndex]=touchScore;
			score -=0.5;
		}
		return touchScores;
	}
	
	function getPossesionTeam(matchBlock) {
		return matchBlock.touches[0]._team_id;
	}
	
	
}