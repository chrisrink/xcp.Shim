Ext.define('Shim.functions.Triggers',{
	singleton: true,
	triggerEval: function(onChangeValues){
		return "";
	},

	triggerEcho: function(onChangeValues){
		return onChangeValues;
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
	}

});