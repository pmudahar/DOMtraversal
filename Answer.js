// pull out the string until the next #, ., or end of string
var selectorSubstring = function(selector){
	var str = {}	;
	var lastIndex = selector.search(/(\.|#)/) > 0 ? selector.search(/(\.|#)/) : selector.length;

	str.main = selector.slice(0, lastIndex);
	str.remaining = selector.slice(lastIndex, selector.length)

	return str;
}


// convert selector string into an object
var selectorOrganize = function(selector){
	var selectorObj = {
		'tag': "",
		'#': [],
		'.': []
	}; 

	// traverse the selector and place each tag, class, id into obj
	var selectorTraverse = function(selector){
		var strObj = selectorSubstring(selector.slice(selector.search(/[a-z]/i)));

		if (selector.charAt(0) != '#' && selector.charAt(0) != '.')
			selectorObj.tag = strObj.main;

		else 
			selectorObj[selector.charAt(0)].push(strObj.main);
		
		if (strObj.remaining != '')
			selectorTraverse(strObj.remaining);
	}

	selectorTraverse(selector);
	return selectorObj;
}


// create an object from DOM element so you can easily compare to selector object
var createNodeObj = function(node){
	var nodeObj = {};

	nodeObj.tag = node.tagName || '';
	nodeObj['#'] = node.id ? [node.id] : [];
	nodeObj['.'] = node.className ? node.className.split(' ') : [];

	return nodeObj;
}


// see if everything in the selector array is in the node array (used for classes and ids)
var compareArr = function(selectorArr, nodeArr){
	for (var i = 0; i < selectorArr.length; i++)
		if (nodeArr.indexOf(selectorArr[i]) === -1)
			return false;

	return true;
}


// compare the selector object to the node object (DOM element)
var compareObjs = function(selectorObj, nodeObj){

	for (key in selectorObj){

		// compare classes and id's
		if (typeof selectorObj[key] === 'object'){
			if (!(compareArr(selectorObj[key], nodeObj[key])))
				return false;
		}

		// compare tag property
		else if (selectorObj[key] != '' && selectorObj[key].toLowerCase() != nodeObj[key].toLowerCase()){
			return false;
		}
	}

	return true;
}


// traverse the DOM, converting each DOM element to an object and comparing to the selector object
var traverseDOM = function(selectorObj, startEl){
	var matchingArr = [];

	if (startEl === undefined)
		startEl = document.body;

    	for(var i=0; i<startEl.childNodes.length; i++) {
    		if (startEl.nodeName != '#text'){
      		var node = startEl.childNodes[i];
      		var nodeObj = createNodeObj(node);

	      	if (compareObjs(selectorObj, nodeObj))
	      		matchingArr.push(node);
			
			// if DOM element has children, go down that branch        
		      matchingArr = matchingArr.concat(traverseDOM(selectorObj, node));
		}
      }

      return matchingArr;
}


var $ = function (selector) {
	// break the selector down into an object that you can compare DOM elements to
	var selectorObj = selectorOrganize(selector);

	// return array 
	return traverseDOM(selectorObj);
}