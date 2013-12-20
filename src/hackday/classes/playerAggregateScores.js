function playerAggregateScores() {
	// this is effectively a singleton
	// public methods
	return {
		execute:execute

	}
	
	function execute(touchScoreSets) {
		var playerScoresMappedById = {};
		//playerScoresMappedById[123]=score;
		
		// need to get all the player ids for both teams in an array
		// [{playerID: 12345, score: 0}, {...}, {...}] ?
		// no, a map? 
		
		// for each block of play
		for (var blockIndex in touchScoreSets) {
			var block = touchScoreSets[blockIndex];
			
			// for each touch
			for (var scoredTouchIndex in block.scores) {
				var scoredTouch = block.scores[scoredTouchIndex];
	
				// find out the player and their score
				var playerId = scoredTouch.touch._player_id;
				if (playerId != null) {
					// and add their score to it
					if (playerScoresMappedById[playerId] == null) {
						playerScoresMappedById[playerId] = 0;
					}
					playerScoresMappedById[playerId] += scoredTouch.score;
				}
				
			}
			
		}
		var playerScores = [];
		for (key in playerScoresMappedById) {
			playerScores.push(
				{id:key,score:playerScoresMappedById[key]}
			);
		}
		return playerScores;
	}
	
}