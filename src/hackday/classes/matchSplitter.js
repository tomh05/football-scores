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
		var oneBlock = {touches:[matchEvents.Event[0],matchEvents.Event[1]]};
		var twoBlock = {touches:[matchEvents.Event[2],matchEvents.Event[3]]};
		var matchBlocks = [oneBlock,twoBlock];
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