/* 
 * bangsi@bthj.is
 * 
 * Module arranging and managing elements around a circle.
 */


define(["jquery", "rotatengine/util/isMobile"], function( $, isMobile ) {
	
	var container;
	var itemsController;
	var viewWidth;
	var viewHeight;
	
	var viewRotation;
	
    var isMouseDown = false;
    var currentX = 0;
    var currentY = 0;
    var lastX = 0;
    var lastY = 0;
	
	var fullCircleRadians = 2 * Math.PI;
	
	function fitToView() {
		viewWidth = $(window).width() / 1.023;
		viewHeight = $(window).height() / 1.023;
		
		itemsController.sizeElementsToView();
		
		spreadElementsOnACircle( viewRotation );
		
		container.width(viewWidth).height(viewHeight).css("overflow", "hidden");
	}
	
	function getRadiansPerItem() {
		return fullCircleRadians / itemsController.getItemsContainers().length;
	}
	
	
	
	function initialize( containerId, rotation, itemsManager ) {
		
		container = $("#"+containerId);
		viewRotation = rotation;
		itemsController = itemsManager;
		
		fitToView();
		
		if( ! isMobile.any() ) {
			self.rotationPoller = setInterval( function(){
				self.rotateByMouseMoveDelta(); }, 50 );
		}
	}
	
	function spreadElementsOnACircle( rotation ) {
		
        var perspective = viewWidth / 2;
        
        var radius = viewWidth * 1.2;
        
        container.css({"transform": "perspective("+perspective+")"});
        
        var precision = 1000000000000000; // here 16 significant numbers, max 18 ?
        
        itemsController.getItemsContainers().each(function(i){
            // let's go clockwise, thus self.fullCircleRadins - ...
            var thisItemRadians = 
                self.fullCircleRadians - (getRadiansPerItem() * i) + rotation;

            // http://javascript.info/tutorial/number-math#rounding-to-given-precision
            var x = (Math.round( Math.cos(thisItemRadians) * precision ) / precision) * radius;
            var z = -( (Math.round( Math.sin(thisItemRadians) * precision ) / precision) * radius );

            var transform =  
                "perspective("+ (perspective) +") " +
                "translateZ("+(z + radius)+"px) " + 
                "translateX("+(x)+"px) " + 
                "rotateY("+(thisItemRadians - (Math.PI/2))+"rad)";
            $(this).css({"transform": transform});
        });
		viewRotation = rotation;
	}
	
	function rotateSceneToDegree( degree ) {
		var viewRotationInRadians = degree * (Math.PI / 180);
		spreadElementsOnACircle( viewRotationInRadians );
	}
	function incrementSceneRotationByDegrees( degree ) {
		var radiansToRotateTo = viewRotation + (degree*(Math.PI/180));
		spreadElementsOnACircle( radiansToRotateTo );
	}
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
            spreadElementsOnACircle( viewRotation );
            currentX = lastX;
            currentY = lastY;
        }
    }
    function getViewRotation() {
        return viewRotation;
    }
	
	
	
	return {
		initialize: initialize,
		spreadElementsOnACircle: spreadElementsOnACircle,
		rotateSceneToDegree: rotateSceneToDegree,
		incrementSceneRotationByDegrees: incrementSceneRotationByDegrees,
		mouseDown: mouseDown,
		mouseMove: mouseMove,
		mouseUp: mouseUp,
		rotateByMouseMoveDelta: rotateByMouseMoveDelta,
		getViewRotation: getViewRotation
	};
});