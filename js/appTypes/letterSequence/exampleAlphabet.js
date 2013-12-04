/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


require.config({
	baseUrl: "/js",
	paths: {
		jquery: "libs/jquery/jquery"
	}
});

require([
	"rotatengine/cylindricalWorld", 
	"rotatengine/items/letters", 
	"./exampleAlphabetData"
], function( World, LettersController, Data ){
	
	var worldContainerDomId = "rotaspace";
	var itemContainerClass = "rotatem";
	var itemClass = "textItem";
	var initialViewRotation = Math.PI / 2;
	
	LettersController.initializeLetters( 
			Data.LEVEL_DATA.LEVEL_1.items, itemContainerClass, itemClass );
	
	World.initialize( 
			worldContainerDomId, initialViewRotation, LettersController);
});