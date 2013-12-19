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
		
		for (var touchIndex in matchBlock.touches) {
			var touch = matchBlock.touches[touchIndex];
			var touchScore = {touch:touch,score:0};
			if (touch._team_id == possesionTeamId) {
				touchScore.score=blockScore.score;
			}
			touchScores.push(touchScore);
		}
		return touchScores;
	}
	
	function getPossesionTeam(matchBlock) {
		return matchBlock.touches[0]._team_id;
	}
	
	
}