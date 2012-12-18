Ext.define('Shim.functions.Navigation',{
	singleton: true,
	getLocationID:function(){
		var	location = xcp.navigationManager.currentNavigationContext.objectId;
		return location ? location : '';
	}
});
