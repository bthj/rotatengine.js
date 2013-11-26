function Rotatengine( config, levelNumber ) {
    this.config = config;
    
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
    spreadElementsOnACircle: function( container, viewRotation ) {
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
        
        var items = container.find('.rotatem');
        
        var radius = this.viewWidth * 1.2;
        var fullCircleRadians = 2 * Math.PI;
        var radiansPerItem = fullCircleRadians / items.length;
        
        container.css({"transform": "perspective("+perspective+")"});
        
        items.each(function(i){
            var thisItemRadians = (radiansPerItem * i) + viewRotation;
            // http://javascript.info/tutorial/number-math#rounding-to-given-precision
            var x = (Math.round( Math.cos(thisItemRadians) * 100 ) / 100) * radius;
            var z = -( (Math.round( Math.sin(thisItemRadians) * 100 ) / 100) * radius );
            //console.log( $(this).find('span').text() + " - x: " + x + ", z: " + z + ", rota: " + thisItemRadians );
            var transform =  
                "perspective("+ (perspective) +") " +
                "translateZ("+(z + radius)+"px) " + 
                
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
    initialize: function( levelNumber ) {
        var self = this;
        var level = this.config.levels[levelNumber];
        
        var rotaSpace = $('#rotaspace');
        
        this.viewWidth = $(window).width() / 1.0205;
        this.viewHeight = $(window).height() / 1.0205;
        
        //rotaSpace.width(this.viewWidth).height(this.viewHeight).css("overflow", "hidden");
        
        level.items.forEach(function(item){
            
            var itemContainer = self.getOneItemContainer();
            var itemElement = self.getElementForItemByType( item, level.itemsType );
            itemContainer.appendChild( itemElement );
            
            rotaSpace.append(itemContainer);
        });
        
        self.spreadElementsOnACircle( rotaSpace, 0 );
        
        rotaSpace.width(this.viewWidth).height(this.viewHeight).css("overflow", "hidden");
    }
}
