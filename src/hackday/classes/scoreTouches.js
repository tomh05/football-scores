function scoreTouches() {
	// this is effectively a singleton
	// public methods
	return {
		getProp1:getProp1,
		setProp1:setProp1,
		incrementProp1:incrementProp1,
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
			if (touch._team_id == possesionTeamId) {
				var touchScore = {touch:touch,score:blockScore.score};
				touchScores.push(touchScore);
			}
		}
		return touchScores;
	}
	
	function getPossesionTeam(matchBlock) {
		return matchBlock[0]._team_id;
	}
	
	//implementation - unless returned above the methods are not accessible
	
	var prop1 = 0;
	
	function getProp1() {
		return prop1;
	}	
	
	function setProp1(value) {
		prop1 = value;
	}	
	function incrementProp1() {
		prop1++;
	}
}