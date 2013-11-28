function Rotatengine( config, levelNumber ) {
    this.config = config;

    this.container = null;
    
    this.isMouseDown = false;
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
//    rotateElementsOnACircle: function( viewRotation ) {
//        var self = this;
//        this.items.each(function(i){
//            var thisItemRadians = (self.radiansPerItem * i) + viewRotation;
//            
//            $(this).css({"transform": ""});
//        });
//    },
    spreadElementsOnACircle: function( viewRotation ) {
        var self = this;
//        if( undefined === centerElement ) {
//            var items = $(container).find('.rotatem');
//            centerElement = items.eq(Math.floor(items.length/2));
//        }
//        
//        var leftElements = centerElement.prevAll('.rotatem');
//        var rightElements = centerElement.nextAll('.rotatem');
        
//        var transform_center = "translateX(0px) rotateY(0deg) translateZ(0)";
//        centerElement.css({"transform": transform_center});
        
        var perspective = this.viewWidth / 2;
        
        var radius = this.viewWidth * 1.2;
        
        self.container.css({"transform": "perspective("+perspective+")"});
        
        this.items.each(function(i){
            var thisItemRadians = (self.radiansPerItem * i) + viewRotation;
            // http://javascript.info/tutorial/number-math#rounding-to-given-precision
            var x = (Math.round( Math.cos(thisItemRadians) * 100 ) / 100) * radius;
            var z = -( (Math.round( Math.sin(thisItemRadians) * 100 ) / 100) * radius );
            //console.log( $(this).find('span').text() + " - x: " + x + ", z: " + z + ", rota: " + thisItemRadians );
            var transform =  
                "perspective("+ (perspective) +") " +
                "translateZ("+(z - radius)+"px) " + 
                
                "translateX("+(x)+"px) " + 
                
                "rotateY("+(thisItemRadians - (Math.PI/2))+"rad)";
            $(this).css({"transform": transform});
        });
        
        
//        var degreePerItem = Math.floor(360/items.length);
//        var xTranslationPerItem = Math.floor(2000/items.length);
        
//        var leftCompensation = -60;
//        leftElements.each(function(i){
//            leftCompensation += 60;
//            var itemDelta = i+1;
//            var rotationRadians = radiansPerItem * itemDelta;
//            var transform_left = "translateX("+((itemDelta)*-250+leftCompensation)+"px) rotateY("+(rotationRadians)+"rad) translateZ("+((itemDelta*xTranslationPerItem))+"px)";
//            $(this).css({"transform": transform_left});
////            if( rotationDegrees > 90 ) {
////                $(this).hide();
////            }
//        });
        
//        var rightCompensation = -60;
//        rightElements.each(function(i) {
//            rightCompensation += 60;
//            var itemDelta = i+1;
//            var rotationRadians = radiansPerItem * itemDelta;
//            var transform_right = "translateX("+((itemDelta)*200+rightCompensation)+"px) rotateY(-"+(rotationRadians)+"rad) translateZ("+((itemDelta*xTranslationPerItem))+"px)";
//            $(this).css({"transform": transform_right});
////            if( rotationDegrees > 90 ) {
////                $(this).hide();
////            }
//        });
    },
    mouseDown: function( a ) {
        this.isMouseDown = true;
        this.lastX = a.pageX;
        this.lastY = a.pageY;
    },
    mouseMove: function( a ) {
        if( this.isMouseDown ) {
            this.rotateByMouseMoveDelta(this.lastX, this.lastY, a.pageX, a.pageY);
            this.lastX = a.pageX;
            this.lastY = a.pageY;
        }
    },
    mouseUp: function() {
        this.isMouseDown = false;
    },
    rotateByMouseMoveDelta: function( lastX, lastY, pageX, pageY ) {
        this.viewRotation -= ((pageX - lastX) * this.radiansPerDegree);
        console.log(this.viewRotation);
        this.spreadElementsOnACircle( this.viewRotation );
    },
    initialize: function( levelNumber ) {
        var self = this;
        var level = this.config.levels[levelNumber];
        
        self.container = $('#rotaspace');
        
        self.viewWidth = $(window).width() / 1.0205;
        self.viewHeight = $(window).height() / 1.0205;
        
        
        //rotaSpace.width(this.viewWidth).height(this.viewHeight).css("overflow", "hidden");
        
        level.items.forEach(function(item){
            
            var itemContainer = self.getOneItemContainer();
            var itemElement = self.getElementForItemByType( item, level.itemsType );
            itemContainer.appendChild( itemElement );
            
            self.container.append(itemContainer);
        });
        
        self.items = self.container.find('.rotatem');
        self.radiansPerItem = self.fullCircleRadians / self.items.length;
        
        self.spreadElementsOnACircle( 0 );
        
        self.container.width(self.viewWidth).height(self.viewHeight).css("overflow", "hidden");
    }
}
