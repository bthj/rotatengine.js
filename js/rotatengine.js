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
    initialize: function( levelNumber ) {
        var self = this;
        var level = this.config.levels[levelNumber];
        
        var rotaSpace = document.getElementById('rotaspace');
        
        level.items.forEach(function(item){
            
            var itemContainer = self.getOneItemContainer();
            var itemElement = self.getElementForItemByType( item, level.itemsType );
            itemContainer.appendChild( itemElement );
            
            rotaSpace.appendChild(itemContainer);
        });
    }
}