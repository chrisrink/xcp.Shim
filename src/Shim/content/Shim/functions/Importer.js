Ext.define('Shim.functions.Importer', {
	requires: ['Shim.utils.PropertiesMap','Shim.utils.Component','Shim.utils.Json', 'Shim.overrides.ImportFile'],
	singleton: true,
	
	setImportButtonTypes: function(xcpID,typeSystemNames){
		//check if typeSystemNames is an Array.
		if(typeof(typeSystemNames)!=="object" && (typeSystemNames instanceof Array === false)){
			console.log("typeSystemNames not an Array or String",xcpID,typeSystemNames);
			return "";
		}

		//check if typeSystemNames is a String and then make it an Array.
		if(typeof typeSystemNames === "string"){
			typeSystemNames = [typeSystemNames];
		}
		
		Shim.utils.Component.setProperties(xcpID,"action.allowedTypeValues",typeSystemNames);
		return "";
	},

	setFolderImportTypes: function(folderName,allowedTypes){
		var folderImportCnfg;
		//check if allowedTypes is a String and then make it an Array.
		if(typeof allowedTypes === "string"){
			typeSystemNames = [typeSystemNames];
		}

		//check if allowedTypes is an Array.
		if(typeof(allowedTypes)!=="object" && (allowedTypes instanceof Array === false)){
			console.log("allowedTypes is not an Array",AllowedTypes);
			return "";
		}

		//remove bad entries
		allowedTypes= Ext.Array.filter(allowedTypes,function(item,index){
			return typeof item === "string";
		});

		//get Import Folder Import Configuration
		folderImportCnfg = Shim.utils.PropertiesMap.get("folderImport");
		
		//if this is the first time, create an empty object;
		if(folderImportCnfg === undefined){
			folderImportCnfg = {};
		}

		//for the folder type, set the allowable types
		folderImportCnfg[folderName] =allowedTypes;

		//update Property Map
		Shim.utils.PropertiesMap.set("folderImport",folderImportCnfg);
		return "";
	}
	
});
	