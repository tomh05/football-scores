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
        var curBlock = {touches:[],_team_id:0};

        for (var i=0;i<matchEvents.Event.length; i++) {

            var e = matchEvents.Event[i];

            // get rid of unhelpful events
            var t = e._type_id;
            // start, start, deleted event, 
            if (t == 32 || t==34 || t==43) {
                continue;
            }
            if (t==5 && e._outcome == 1) {
            	continue;
            }

            //assign team_id to current block, if it's the first pass
            if (curBlock.touches.length <= 2 && e._type_id == 1 && e._outcome) {
               //  curBlock._team_id = e._team_id;

            }

            // iterate through qualifiers
            if (e.Q != null) {
                for (var j=0;j<e.Q.length;j++) {

                    // free kick: start new block
                    if (e.Q[j]._qualifier_id == 5) {
                        matchBlocks.push(curBlock);
                        curBlock = {touches:[],_team_id:0};
                        continue;
                    }
                    // throw in: start new block
                    else if (e.Q[j]._qualifier_id == 107) {
                        matchBlocks.push(curBlock);
                        curBlock = {touches:[],_team_id:0};

                        continue;
                    }
                }
            }
            // if it's a pass, and successful, and by a new team
            if (e._type_id == 1 && e._outcome && e._team_id != curBlock._team_id) { 
                matchBlocks.push(curBlock);
                curBlock = {touches:[],_team_id: e._team_id };
                
                continue;
            }
            /*if (e._type_id == 99994) { // if need new block

                curBlock.touches.push(matchEvents.Event[i]);
                matchBlocks.push(curBlock);
                curBlock = {touches:[],_team_id:0};
                continue;
            }*/ 

                curBlock.touches.push(matchEvents.Event[i]);

        }

		//var oneBlock = {touches:[matchEvents.Event[0],matchEvents.Event[1]]};
		//var twoBlock = {touches:[matchEvents.Event[2],matchEvents.Event[3]]};
		//var matchBlocks = [oneBlock,twoBlock];
        
        matchBlocks.push(curBlock);
        
        // delete any blocks with no touches
        for (var i=matchBlocks.length-1;i>=0;i--) {
        	if (matchBlocks[i].touches.length==0) {
        		matchBlocks.splice(i, 1);
        	}
        }
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
