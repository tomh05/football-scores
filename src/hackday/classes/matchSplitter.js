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


        var curBlock = {touches:[]};
        curBlock["team_id"] = 0;


        for (var i=0;i<matchEvents.Event.length; i++) {
            var e = matchEvents.Event[i];


            // iterate through qualifiers
            if (e.Q != null) {

                for (var j=0;j<e.Q.length;j++) {
                    // free kick: start new block
                    if (e.Q[j]._qualifier_id == 5) {
                        matchBlocks.push(curBlock);
                        curBlock = {touches:[]};
                        continue;
                    }
                    // throw in: start new block
                    else if (e.Q[j]._qualifier_id == 131) {
                        matchBlocks.push(curBlock);
                        curBlock = {touches:[]};
                        continue;
                    }
            }
            }

            if (matchEvents.Event[i]._type_id == 4) { // if need new block

                curBlock.touches.push(matchEvents.Event[i]);
                matchBlocks.push(curBlock);
                curBlock = {touches:[]};
                continue;
            } 

                curBlock.touches.push(matchEvents.Event[i]);

        }

		//var oneBlock = {touches:[matchEvents.Event[0],matchEvents.Event[1]]};
		//var twoBlock = {touches:[matchEvents.Event[2],matchEvents.Event[3]]};
		//var matchBlocks = [oneBlock,twoBlock];
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
