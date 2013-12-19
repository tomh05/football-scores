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
		var oneBlock = {touches:[matchEvents.Event[34],matchEvents.Event[35]]};
		var twoBlock = {touches:[matchEvents.Event[36]]};
		var threeBlock = {touches:[matchEvents.Event[37],matchEvents.Event[38]]};
		var matchBlocks = [oneBlock,twoBlock,threeBlock];
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