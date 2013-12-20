function blockScorer() {
	// this is effectively a singleton
	// public methods
	return {
		execute:execute
	}

	function execute(matchBlock) {
		var maxDistance = Math.sqrt(Math.pow(100, 2) + Math.pow(50, 2));

		var teamWithPossession = matchBlock._team_id;

		//  iterate backwards to find last touch by teamWithPossession
		var numTouches = matchBlock.touches.length;
		var lastTouch = null;
		for (i = numTouches - 1; i > 0; i--) {
			lastTouch = matchBlock.touches[i];

			// dis-regard outs (typeid = 5)
			if ((teamWithPossession == lastTouch._team_id) && (lastTouch._type_id != 5)) {
				break;
			}
			lastTouch = null;
		}

		if (lastTouch != null) {
			// calculate the distace from the goal
			var distanceFromOpponentsGoal = Math.sqrt(Math.pow(100 - lastTouch._x, 2) + Math.pow(50 - lastTouch._y, 2));

			var blockScoreValue = (1 - (distanceFromOpponentsGoal / maxDistance)) * 10;
		} else
			blockScoreValue = 0;

		var blockScore = {score: blockScoreValue, matchBlock: matchBlock};
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
