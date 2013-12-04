/* 
 * bangsi@bthj.is
 * 
 * Module creating letters within container elements, 
 * to be arranged by world modules (spherical, cylindrical).
 */


define(["jquery"], function( $ ) {
	
	var itemContainers = [];
	
	var letterContainerClass;
	var letterClass;
	
    function getOneItemContainer( containerClass ) {
        var oneItem = document.createElement('div');
        var oneItemClass = document.createAttribute('class');
        oneItemClass.nodeValue = containerClass;
        oneItem.setAttributeNode(oneItemClass);
        return oneItem;
    }
	
    function getElementForLetter( item, itemClass ) {
		var itemElement = document.createElement('span');
		var textSpanClass = document.createAttribute('class');
		textSpanClass.nodeValue = itemClass;
		itemElement.setAttributeNode(textSpanClass);
		if(document.all){
			itemElement.innerText = item;
		} else { // Firefox
			itemElement.textContent = item;
		}
        return itemElement;
    }
	
	
	function initializeLetters( letters, itemContainerClass, itemClass ) {
		
		letterContainerClass = itemContainerClass;
		letterClass = itemClass;
		
		letters.forEach(function(letter) {
			var letterContainer = getOneItemContainer( letterContainerClass );
			var letterElement = getElementForLetter( letter, letterClass );
			letterContainer.appendChild(letterElement);
			
			itemContainers.push(letterContainer);
		});
	}
	
	function sizeElementsToView() {
		itemContainers.forEach(function(itemContainer){
            // http://www.sitepoint.com/new-css3-relative-font-size/
            // 1vw is 1% of the viewport width 
            // 1vh is 1% of the viewport height
            // 1vmin is the smallest of 1vw and 1vh
			$(itemContainer).find("."+letterClass).css("font-size", "35vmin");
		});
	}
	
	function getItemContainers() {
		return $(itemContainers);
	}
	
	
	return {
		initializeLetters: initializeLetters,
		sizeElementsToView: sizeElementsToView,
		getItemContainers: getItemContainers
	};
});