function matchSplitter() {
	// this is effectively a singleton
	
    // public methods
	return {
		execute:execute
	}

    var debugStatus;

    function isRestart(e) {
        // iterate through qualifiers - redundant with pass detection working   
        if (e.Q != null) {
            for (var j=0;j<e.Q.length;j++) {

                // free kick: start new block
                if (e.Q[j]._qualifier_id == 5) {
                    debugStatus="free kick"; 
                    return true;                      
                }
                // throw in: start new block
                else if (e.Q[j]._qualifier_id == 107) {
                    debugStatus="throw in";
                    return true;     
                }
                else if (e.Q[j]._qualifier_id == 6) {
                    debugStatus="corner taken";
                    return true;     
                }
                else if (e.Q[j]._qualifier_id == 124) {
                    debugStatus="goal kick";
                    return true;     
                }
            }
        }
    }
	
	function execute(matchEvents) {

        var matchBlocks = {blocks:[],stats:{}}; 
        var curBlock = {touches:[],_team_id:0, debug:"",color:""};
        var isNewBlock;

        for (var i=0;i<matchEvents.Event.length; i++) {
            
            isNewBlock = false;
            debugStatus="";

            var e = matchEvents.Event[i];

            // get rid of unhelpful events
            var t = e._type_id;
            // start, start, deleted event, 
            if (t == 32 || t==34 || t==43 || t ==5) {
                continue;
            }


            //assign team_id to current block, if it's the first pass
            //if (curBlock.touches.length <= 2 && e._type_id == 1 && e._outcome) {
               //  curBlock._team_id = e._team_id;

            //}

            if (isRestart(e)) {
                isNewBlock = true;
            }
            
            // if it's a keeper pickup, start new block
            if (e._type_id == 52) { 
               isNewBlock = true; 
                debugStatus="keeper pick-up";
            }
            
/*
            // if it's ball recovery and previous element belongs to other team, start new block
            if (e._type_id == 49) {
                var eminus1 = matchEvents.Event[i-1];
                if (eminus1._team_id != e._team_id) {
                   isNewBlock = true;
                  debugStatus = "ball recovery"; 
                }
            }



            // if it's dispossessed and next two elements belong to other team, start new block
            var eminus1 = matchEvents.Event[i-1];
            if (eminus1._type_id == 50) {
                var e1 = matchEvents.Event[i+1];
                if (e._team_id != curBlock._team_id && e1._team_id != curBlock._team_id) { 
                   isNewBlock = true;
                  debugStatus = "disposessed"; 
                }
            }



            // if previous event is a saved, start new block
             var eminus1 = matchEvents.Event[i-1];
            if ((eminus1._type_id == 10 && e._type_id != 15)|| (eminus1._type_id == 15 && e._type_id != 10)) {
                   isNewBlock = true;
                  debugStatus = "saved/attempt"; 
            }    */       

            // if it's a pass, and successful, and by a new team
            if (e._type_id == 1 && e._outcome == 1 && e._team_id != curBlock._team_id) { 
               isNewBlock = true; 
                debugStatus="pass";
            }

            // if it's an interception, and next element is same team, start new block
            if (e._type_id == 8) {
                var e1 = matchEvents.Event[i+1];
                if (e1._team_id == e._team_id) { 
                   isNewBlock = true;
                  debugStatus = "intercepted"; 
                }
            }

            if (isNewBlock) {
                matchBlocks.blocks.push(curBlock);
                curBlock = {touches:[],_team_id:e._team_id, debug:debugStatus, color:"#0F0"};
                curBlock.touches.push(e);
            } else
            {
                curBlock.touches.push(e);
            }

        }

        matchBlocks.blocks.push(curBlock);
        
        // delete any blocks with no touches
        for (var i=matchBlocks.blocks.length-1;i>=0;i--) {
        	if (matchBlocks.blocks[i].touches.length==0) {
        		matchBlocks.blocks.splice(i, 1);
        	}
        }
        


        // calculate average block size
        var idA = matchBlocks.blocks[0]._team_id;
        var nA = 0;
        var nB = 0;
        var totalA = 0;
        var totalB = 0;
        for (var i=0; i < matchBlocks.blocks.length;i++) {
            if (matchBlocks.blocks[i]._team_id== idA) {

                matchBlocks.blocks[i].color="#FF9";

                totalA += matchBlocks.blocks[i].touches.length;
                nA++;
            } else {

                matchBlocks.blocks[i].color="#CEF";
                totalB += matchBlocks.blocks[i].touches.length;
                nB++;
            }
        }

        matchBlocks.stats["averageA"] = 100* (totalA/nA) / (totalA/nA + totalB/nB);
        matchBlocks.stats["averageB"] = 100* (totalB/nB) / (totalA/nA + totalB/nB);
        
		return matchBlocks;
	}
	
}
