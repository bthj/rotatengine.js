function Rotatengine( config, levelNumber ) {
    this.config = config;

    this.container = null;
    
    this.isMouseDown = false;
    this.currentX = 0;
    this.currentY = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.viewRotation = 0;
    
    this.fullCircleRadians = 2 * Math.PI;
    this.radiansPerDegree = (2*Math.PI) / 360;
    
    this.initialize( levelNumber );
}
Rotatengine.prototype = {
    getOneItemContainer: function(){
        var oneItem = document.createElement('div');
        var oneItemClass = document.createAttribute('class');
        oneItemClass.nodeValue = 'rotatem';
        oneItem.setAttributeNode(oneItemClass);
        return oneItem;
    },
    getElementForItemByType: function( item, itemType ) {
        var itemElement;
        switch( itemType ) {
            case 'text':
                var itemElement = document.createElement('span');
                var textSpanClass = document.createAttribute('class');
                textSpanClass.nodeValue = 'textItem';
                itemElement.setAttributeNode(textSpanClass);
                if(document.all){
                    itemElement.innerText = item;
                } else { // Firefox
                    itemElement.textContent = item;
                }
                break;
            default:
                break;
        }
        return itemElement;
    },
    spreadElementsOnACircle: function( viewRotation ) {
        var self = this;

        var perspective = this.viewWidth / 2;
        
        var radius = this.viewWidth * 1.2;
        
        self.container.css({"transform": "perspective("+perspective+")"});
        
        var precision = 1000000000000000; // here 16 significant numbers, max 18 ?
        
        this.items.each(function(i){
            // let's go clockwise, thus self.fullCircleRadins - ...
            var thisItemRadians = 
                self.fullCircleRadians - (self.radiansPerItem * i) + viewRotation;
		
            // http://javascript.info/tutorial/number-math#rounding-to-given-precision
            var x = (Math.round( Math.cos(thisItemRadians) * precision ) / precision) * radius;
            var z = -( (Math.round( Math.sin(thisItemRadians) * precision ) / precision) * radius );
//            if( i == 0 ) {
//                console.log( $(this).find('span').text() + " # x: " + x + ", z: " + z + ", rota: " + thisItemRadians );
//            }

            var transform =  
                "perspective("+ (perspective) +") " +
                "translateZ("+(z + radius)+"px) " + 
                
                "translateX("+(x)+"px) " + 
                
                "rotateY("+(thisItemRadians - (Math.PI/2))+"rad)";
                //"rotateY("+(thisItemRadians)+"deg)";
            $(this).css({"transform": transform});
        });
		this.viewRotation = viewRotation;
    },
	rotateSceneToDegree: function( degree ) {
		var viewRotationInRadians = degree * (Math.PI / 180);
		this.spreadElementsOnACircle( viewRotationInRadians );
	},
	incrementSceneRotationByDegrees: function( degree ) {
		var radiansToRotateTo = this.viewRotation + (degree*(Math.PI/180));
		this.spreadElementsOnACircle( radiansToRotateTo );
	},
    mouseDown: function( a ) {
        this.isMouseDown = true;
        this.lastX = this.currentX = a.pageX;
        this.lastY = this.currentY = a.pageY;
    },
    mouseMove: function( a ) {
        if( this.isMouseDown ) {
            //this.rotateByMouseMoveDelta(this.lastX, this.lastY, a.pageX, a.pageY);
            this.lastX = a.pageX;
            this.lastY = a.pageY;
        }
    },
    mouseUp: function() {
        this.isMouseDown = false;
    },
    rotateByMouseMoveDelta: function( /*lastX, lastY, pageX, pageY*/ ) {
        if( this.lastX !== this.currentX || this.lastY !== this.currentY ) {
            // this.viewRotation -= ((this.lastX - this.currentX) * this.radiansPerDegree);
            var viewRotation = 
					this.viewRotation - ((this.lastX - this.currentX) * 0.005);
//            console.log(this.viewRotation);
            this.spreadElementsOnACircle( viewRotation );
            this.currentX = this.lastX;
            this.currentY = this.lastY;
        }
    },
    getViewRotation: function() {
        return this.viewRotation;
    },
    fitToView: function() {
        this.viewWidth = $(window).width() / 1.023;
        this.viewHeight = $(window).height() / 1.023;
        
        this.container.find(".rotatem .textItem").each(function(){
            // http://www.sitepoint.com/new-css3-relative-font-size/
            // 1vw is 1% of the viewport width 
            // 1vh is 1% of the viewport height
            // 1vmin is the smallest of 1vw and 1vh
            $(this).css("font-size", "35vmin");
        });
        
        this.spreadElementsOnACircle( this.viewRotation );
        
        this.container.width(this.viewWidth).height(this.viewHeight)
                .css("overflow", "hidden");
    },
    initialize: function( levelNumber ) {
        var self = this;
        var level = this.config.levels[levelNumber];
        
        self.container = $('#rotaspace');
        
        level.items.forEach(function(item){
            
            var itemContainer = self.getOneItemContainer();
            var itemElement = self.getElementForItemByType( item, level.itemsType );
            itemContainer.appendChild( itemElement );
            
            self.container.append(itemContainer);
        });
        
        self.items = self.container.find('.rotatem');
        self.radiansPerItem = self.fullCircleRadians / self.items.length;
//        self.degreesPerItem = 360 / self.items.length;
        
        self.viewRotation = Math.PI/2;
        
        self.fitToView();
        
		if( ! isMobile.any() ) {
			self.rotationPoller = setInterval( function(){
				self.rotateByMouseMoveDelta(); }, 50 );
		}
    }
};
