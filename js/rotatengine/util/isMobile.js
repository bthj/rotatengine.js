/* 
 * bangsi@bthj.is
 * 
 * Module detecting platforms form user ageng string.
 */


define(function(){
	return {
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
});