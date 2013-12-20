function matchSplitter() {
	// this is effectively a singleton
	// public methods
	return {
		getProp1:getProp1,
		setProp1:setProp1,
		incrementProp1:incrementProp1,
		execute:execute

	}
	
	function execute(matchEvents) {

        var matchBlocks = []; 
        var curBlock = {touches:[],_team_id:0, debug:""};
        var isNewBlock;
        var debugStatus;

        for (var i=0;i<matchEvents.Event.length; i++) {
            
            isNewBlock = false;
            debugStatus="";

            var e = matchEvents.Event[i];

            // get rid of unhelpful events
            var t = e._type_id;
            // start, start, deleted event, 
            if (t == 32 || t==34 || t==43) {
                continue;
            }


            //assign team_id to current block, if it's the first pass
            //if (curBlock.touches.length <= 2 && e._type_id == 1 && e._outcome) {
               //  curBlock._team_id = e._team_id;

            //}

            // iterate through qualifiers - redundant with pass detection working
            
            if (e.Q != null) {
                for (var j=0;j<e.Q.length;j++) {

                    // free kick: start new block
                    if (e.Q[j]._qualifier_id == 5) {
               isNewBlock = true; 
                debugStatus="free kick";                       
                    }
                    // throw in: start new block
                    else if (e.Q[j]._qualifier_id == 107) {
               isNewBlock = true; 
                debugStatus="throw in";
                    }
                    else if (e.Q[j]._qualifier_id == 6) {
               isNewBlock = true; 
                debugStatus="corner taken";
                    }
                    else if (e.Q[j]._qualifier_id == 124) {
               isNewBlock = true; 
                debugStatus="goal kick";
                    }
                }
            }
            

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

            // if it's an interception, and next two elements are same team, start new block
            if (e._type_id == 8) {
                var e1 = matchEvents.Event[i+1];
                var e2 = matchEvents.Event[i+2];
                if (e1._team_id == e._team_id && e2._team_id == e._team_id) { 
                   isNewBlock = true;
                  debugStatus = "intercepted"; 
                }
            }

            // if it's a keeper pickup, start new block
            if (e._type_id == 52) { 
               isNewBlock = true; 
                debugStatus="keeper pick-up";
            }

            // if previous event is attempt saved, start new block
             var eminus1 = matchEvents.Event[i-1];
            if (eminus1._type_id == 15) {
                   isNewBlock = true;
                  debugStatus = "attempt saved"; 
            }           

            // if it's a pass, and successful, and by a new team
            if (e._type_id == 1 && e._outcome == 1 && e._team_id != curBlock._team_id) { 
               isNewBlock = true; 
                debugStatus="pass";
            }


            if (isNewBlock) {
                matchBlocks.push(curBlock);
                curBlock = {touches:[],_team_id:e._team_id, debug:debugStatus};
                curBlock.touches.push(e);
            } else
            {
                curBlock.touches.push(e);
            }

        }

        matchBlocks.push(curBlock);
        
        // delete any blocks with no touches
        for (var i=matchBlocks.length-1;i>=0;i--) {
        	if (matchBlocks[i].touches.length==0) {
        		matchBlocks.splice(i, 1);
        	}
        }
        


        // calculate average block size
        var idA = matchBlocks[0]._team_id;
        var nA = 0;
        var nB = 0;
        var totalA = 0;
        var totalB = 0;
        for (var i=0; i < matchBlocks.length;i++) {
            if (matchBlocks[i]._team_id== idA) {
                totalA += matchBlocks[i].length;
                nA++;
            } else {
                totalB += matchBlocks[i].length;
                nB++;
            }
        }

        //matchBlocks[averageA] = totalA/nA;
        //matchBlocks[averageB] = totalB/nB;
        
		return matchBlocks;
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
