Ext.define('Shim.functions.Triggers',{
	singleton: true,
	triggerEval: function(onChangeValues){
		return "";
	},

	triggerEcho: function(onChangeValue){
		return onChangeValue;
	},

	toggle: function(state,alist){
		var index = alist.indexOf(state);
		var newState;
		if(index < 0 || (alist.length === (index + 1) )){
			newState = alist[0];
		} else{
			newState = alist[index + 1];
		}

		return newState;
	},

	setWidgetValue: function(xcpID,value){
		Shim.utils.Component.setValue(xcpID,value);
		return "";
	},

	setGlobalProperty: function(key,value){
		Shim.utils.PropertiesMap.set(key,value);
		return "";
	},

	getGlobalProperty: function(key){
		var value = Shim.utils.PropertiesMap.get(key);
		return (value !== undefined) ? value : '';
	}

});