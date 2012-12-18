Ext.define("Shim.overrides.ImportFile", {
	override: "xcp.action.ImportFile",
	handler: function(actionArgs, action) {
		var id;
		var target = action.getTargets(actionArgs)[0];
		var args={};
		var folderType=action.actionArgs.selection[0].raw.r_object_type;
		var importFolderCnfg;
		if (!target){
			return;
		}
		
		id= target.getId();
		console.log("action",this.action,action,folderType);
		//  Show this dialog only in runtime, never in design time
		if(id !== undefined && window.xcp !== undefined && xcp.navigationManager !== undefined){
			id=xcp.navigationManager.currentNavigationContext.objectId;
		}
		if(id){
			args.targetFolderId=id;
			//check button configuration for allowed types
			if(this.action.allowedTypeValues !== undefined)
			{
				args.allowedTypeValues = this.action.allowedTypeValues;
			}else{
				//lookup folderconfig
				importFolderCnfg = Shim.utils.PropertyMap.get("folderImport");
				if(importFolderCnfg !== undefined && importFolderCnfg[folderType] !== undefined){
					args.allowedTypeValues =  importFolderCnfg[folderType];
				}
			}

			Ext.create("xcp_import_file", args).show();
		}
	}
});
Ext.require("shim2.action.ImportFile");