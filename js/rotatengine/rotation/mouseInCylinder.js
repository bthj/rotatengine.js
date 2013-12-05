/* 
 * bangsi@bthj.is
 * 
 * Module that tracks mouse movement when the button is pressed, calculates and 
 * broadcasts view rotation in radians to a mediator channel.
 */


define([
	"jquery", "mediator", "rotatengine/rotation/eventsFromInput"
], function( $, mediator, eventsFromInput ){
	
	var isMouseDown = false;
    var currentX = 0;
    var currentY = 0;
    var lastX = 0;
    var lastY = 0;
	
	var rotationPoller;
	
    function mouseDown( a ) {
        isMouseDown = true;
        lastX = currentX = a.pageX;
        lastY = currentY = a.pageY;
    }
    function mouseMove( a ) {
        if( isMouseDown ) {
            lastX = a.pageX;
            lastY = a.pageY;
        }
    }
    function mouseUp() {
        isMouseDown = false;
    }
    function rotateByMouseMoveDelta() {
        if( lastX !== currentX || lastY !== currentY ) {
            var viewRotation = 
					viewRotation - ((lastX - currentX) * 0.005);
			
//            spreadElementsOnACircle( viewRotation );

			mediator.publish(eventsFromInput.newRotationRadians, viewRotation);

            currentX = lastX;
            currentY = lastY;
        }
    }
	
	
	
	function startMonitoring() {
		var $document = $( document );
		$document.mousedown(function(e) {
			e.preventDefault();
			mouseDown(e);
		});
		$document.mousemove(function(e) {
			e.preventDefault();
			mouseMove(e);
		});
		$document.mouseup(function(e) {
			e.preventDefault();
			mouseUp();
		});

		rotationPoller = setInterval( function(){
			rotateByMouseMoveDelta(); }, 50 );
	}
	
	return {
		startMonitoring: startMonitoring
	};
});