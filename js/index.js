/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var interpolationIncrementEndTime;
var lastCompassTimestamp;
var lastHeading;
var nextToLastHeading;

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
		
		this.watchID = undefined;
		this.lastCompassTimestamp = 0;
		this.nextToLastCompassTimestamp = 0;
		
		this.interpolationIncrement = 0;
		this.interpolationIncrementEndTime = 0;
		
		this.compassGranula = 0;
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		alert("ready");
        app.receivedEvent('deviceready');
		
		//navigator.compass.getCurrentHeading(onSuccess, function(){});
		
		if( window.DeviceMotionEvent !== undefined && isMobile.iOS() ) {
			// let's use the gyroscope on iOS, as it works decently
			window.ondeviceorientation = app.gyroMove;			
		} else {
			// otherwise we'll use the compass
			app.startCompassWatch();
		}
    },	
//	 onSuccess: function (heading) {
//        alert('Heading: ' + heading.magneticHeading);
//    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
	
	startCompassWatch: function() {
//		alert(navigator.compass);
		var self = this;
		var options = { frequency: 200 };
		this.watchID = navigator.compass.watchHeading(
				self.onCompassSuccess, self.onCompassError, options);
		
		this.compassGranula = setInterval( function(){
			self.compassInterpolater(); 
		}, 50 );
	},
	compassInterpolater: function() {
		// let's get an interval to average our way through
		document.getElementById("heading").innerText = 
				"end:"+this.interpolationIncrementEndTime+", last:"+lastCompassTimestamp;
//		document.getElementById("heading").innerText = "last: "+this.lastCompassTimestamp;
//		if( this.interpolationIncrementEndTime < this.lastCompassTimestamp ) {
		if( this.interpolationIncrementEndTime < lastCompassTimestamp ) {
			this.interpolationIncrement = 
//				(this.lastHeading - this.nextToLastHeading) / 4;
				(lastHeading - nextToLastHeading) / 4;
//			this.interpolationIncrementEndTime = this.lastCompassTimestamp;
			this.interpolationIncrementEndTime = lastCompassTimestamp;
		} else {
			// increment the rotation by an average from last interval
			document.getElementById("heading").innerText = 
					"increment by "+this.interpolationIncrement;
			rotatengineInstance.incrementSceneRotationByDegrees( 
					this.interpolationIncrement );
		}
	},
	onCompassSuccess: function( heading ) {
		var self = this;
		
//		clearInterval( this.compassGranula );
		
		var timestampDelta = heading.timestamp - this.lastCompassTimestamp;
		
		if( timestampDelta ) {
			document.getElementById("heading").innerText = timestampDelta;

			rotatengineInstance.rotateSceneToDegree( heading.magneticHeading );
		}
		
		this.nextToLastCompassTimestamp = this.lastCompassTimestamp;
		this.nextToLastHeading = this.lastHeading;
		
		this.lastCompassTimestamp = heading.timestamp;
		lastCompassTimestamp = this.lastCompassTimestamp;
		
		this.lastHeading = heading.magneticHeading;
		if( ! this.nextToLastCompassTimestamp ) {
//		if( ! this.nextToLastHeading ) {
			this.nextToLastCompassTimestamp = heading.timestamp;
			this.nextToLastHeading = heading.magneticHeading;
		}
		
		lastHeading = this.lastHeading;
		nextToLastHeading = this.nextToLastHeading;
		
//		this.compassGranula = setInterval( function(){
//			self.compassInterpolater(); 
//		}, 50 );

		//alert(heading.magneticHeading);
	},
	onCompassError: function( compassError ) {
		// no-op
	},
	gyroMove: function( event ) {
		rotatengineInstance.rotateSceneToDegree( 360 - event.alpha );
	}
};



var isMobile = { // from http://projects.3232design.com/html5_3d/include/main.js
    Android: function () {
        return navigator.userAgent.match(/Android/i) ? true : false
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false
    },
    iPad: function () {
        return navigator.userAgent.match(/iPad/i) ? true : false
    },
    iPhone: function () {
        return navigator.userAgent.match(/iPhone|iPod/i) ? true : false
    },
    Safari: function () {
        return navigator.userAgent.match(/Safari/i) ? true : false
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i) ? true : false
    },
    hasTouch: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows())
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows())
    }
};