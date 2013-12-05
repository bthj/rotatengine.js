/* 
 * bangsi@bthj.is
 * 
 * Module that monitors input from motion sensors - compass or gyroscope - 
 * and provides rotation information from their raw (unfiltered) data
 * (basic extrapolation is done for the compass).
 * Fires events via mediator channel for each available rotation.
 */


define([
	"mediator", 
	"rotatengine/rotation/eventsFromInput", 
	"rotatengine/util/isMobile"
], function( mediator, eventsFromInput, isMobile ) {
	
	var watchID = undefined;
	var lastCompassTimestamp = 0;
	var nextToLastCompassTimestamp = 0;

	var interpolationIncrement = 0;
	var interpolationIncrementEndTime = 0;

	var compassGranula = 0;
	
	var interpolationIncrementEndTime;
	var lastCompassTimestamp;
	var lastHeading;
	var nextToLastHeading;
	
	// Bind startup events from the device via PhoneGap
	function bindEvents() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    }
	
	function onDeviceReady() {

		if( window.DeviceMotionEvent !== undefined && isMobile.iOS() ) {
			// let's use the gyroscope on iOS, as it works decently
			window.ondeviceorientation = gyroMove;			
		} else {
			// otherwise we'll use the compass
			startCompassWatch();
		}
    }
	
	function startCompassWatch() {
		var self = this;
		var options = { frequency: 200 };
		watchID = navigator.compass.watchHeading(
				onCompassSuccess, onCompassError, options);
		
		compassGranula = setInterval( function(){
			compassInterpolator(); 
		}, 50 );
	}
	function compassInterpolator() {
		// let's get an interval to average our way through
		document.getElementById("heading").innerText = 
				"end:"+interpolationIncrementEndTime+", last:"+lastCompassTimestamp;
		if( interpolationIncrementEndTime < lastCompassTimestamp ) {
			
			interpolationIncrement = (lastHeading - nextToLastHeading) / 4;
			interpolationIncrementEndTime = lastCompassTimestamp;
		} else {
			// increment the rotation by an average from last interval
			document.getElementById("heading").innerText = 
					"increment by "+interpolationIncrement;
//			rotatengineInstance.incrementSceneRotationByDegrees( 
//					interpolationIncrement );
			mediator.publish(
					eventsFromInput.newRotationIncrementInDegrees, 
					interpolationIncrement );
		}
	}
	function onCompassSuccess( heading ) {
		
//		clearInterval( this.compassGranula );
		
		var timestampDelta = heading.timestamp - lastCompassTimestamp;
		
		if( timestampDelta ) {
			document.getElementById("heading").innerText = timestampDelta;

//			rotatengineInstance.rotateSceneToDegree( heading.magneticHeading );
			mediator.publish(
					eventsFromInput.newRotationDegrees, heading.magneticHeading);
		}
		
		nextToLastCompassTimestamp = lastCompassTimestamp;
		nextToLastHeading = lastHeading;
		
		lastCompassTimestamp = heading.timestamp;
		
		lastHeading = heading.magneticHeading;
		if( ! nextToLastCompassTimestamp ) {
			nextToLastCompassTimestamp = heading.timestamp;
			nextToLastHeading = heading.magneticHeading;
		}
		
//		this.compassGranula = setInterval( function(){
//			self.compassInterpolater(); 
//		}, 50 );
	}
	function onCompassError( compassError ) {
		// no-op
	}
	function gyroMove( event ) {
//		rotatengineInstance.rotateSceneToDegree( 360 - event.alpha );
		mediator.publish(eventsFromInput.newRotationDegrees, 360 - event.alpha);
	}
	
	
	
	function startWatching() {
		
		bindEvents();
	}
	
	return {
		startWatching: startWatching
	};
});