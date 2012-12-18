Ext.define('Shim.util.PropertiesMap', {
    singleton: true,
    map: new Ext.util.MixedCollection(),

    get: function(key){
	return this.map.getKey(key);
    },

    set: function(key,value){
		if(this.map.containsKey(key)=== true){
			return this.map.replace(key,value);
		}
		return this.map.add(key,value);
    }
});