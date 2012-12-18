Ext.define('Shim.functions.Picklist', {
singleton: true,
getPicklistLabel:function(picklistName,value){
		var picklistStoreKey = "xcp.picklist." + picklistName;
		var store = Ext.data.StoreManager.lookup(picklistStoreKey);
		var label= '';
		if (store) {
			var index = store.find("value", value, 0, false, true, true);
			if (index !== -1) {
				var record = store.getAt(index);
				label = record.get("label");
			}
			else{
			console.log("Value not found",value,picklistName,index);
		}
		}else{
			console.log("Picklist not found",picklistName);
		}
		return label;
	}
});