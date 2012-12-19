Ext.define('Shim.utils.Component', {
	requires: ['Shim.utils.Json'],
	singleton: true,

	getXCPCmp: function(xcpID){
		var cmp;
		cmp = Ext.ComponentQuery.query("component[xcpId =" + xcpID + "]");
		if(cmp && cmp[0]){
			return cmp[0];
		}
		return undefined;
	},
	
	setProperty:function(xcpID,name,value){
		var cmp = this.getXCPCmp(xcpID);
		if(cmp === undefined){
			console.log("Failed to get Component " + xcpID);
			return false;
		}
			
		if(name.indexOf(".") > -1){
			Shim.utils.Json.setProperty(name,value,cmp);
		}else{
			cmp[name]=value;
		}
		//value has been set
		return true;

	},

	getProperty: function(xcpID,name){
		var cmp = this.getXCPCmp(xcpID);
		if(cmp === undefined){
			console.log("Failed to get Component " + xcpID);
			return undefined;
		}

		//check if single property or path
		if(name.indexOf(".") > -1){
			return Shim.utils.Json.getProperty(cmp,name);
		}

		return cmp[name];
	}
});