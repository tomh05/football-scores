function blockScorer() {
	// this is effectively a singleton
	// public methods
	return {
		getProp1:getProp1,
		setProp1:setProp1,
		incrementProp1:incrementProp1,
		execute:execute

	}

	function execute(matchBlock) {
		var blockScore = {score:10};

		/*

		teamWithPossesion = matchBlock.team_id;
		lastTouch = iterate backwards to find last touch by teamWithPossession
		if (lastTouch == goal)
			score = 10;
		else
			if (positionInField == onOtherTeamsSide ( /10)
				score = 2;
			else
				score = 0;

		*/

		return blockScore;
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
