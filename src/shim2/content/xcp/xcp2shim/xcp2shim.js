//Shim2
Ext.namespace ("shim2");


(function(){
	"use strict";
	var shim2 = {
		action:{},
		config:{
			import:{}
		},
		widget:{}	
	};
	    
	
	//Overrides
	
	Ext.define("shim2.action.ImportFile", {
		override: "xcp.action.ImportFile",
		handler: function(actionArgs, action) {
			var id;
			var target = action.getTargets(actionArgs)[0];
			var args={};
			var folderType=action.actionArgs.selection[0].raw.r_object_type;
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
				if(this.action.allowedTypeValues !== undefined)
				{
					args.allowedTypeValues = this.action.allowedTypeValues;
				}else if(shim2.conf.import[folderType] !== undefined){
					args.allowedTypeValues =  shim2.config.import[folderType].allowedTypeValues;
				}
				Ext.create("xcp_import_file", args).show();
			}
		}
	});
	shim2={widget:{}};
	Ext.define("shim2.widget.Comments",{
		override: 'xcp.widget.comments.Comments',
		constructor: function(config) {
			this.callParent(arguments);
			delete this.height
			this.minHeight: 250,
			this.autoscroll:true
		}
	});
	Ext.require("shim2.widget.Comments");	
	Ext.require("shim2.action.ImportFile");
	
	//Variables

	var setAllowedTypeValues = function(xcpID,typeSystemNames){
		//check if typeSystemNames is an Array.
		if(isArray(typeSystemNames) !== true ){
			//check if typeSystemNames is a String and then make it an Array.
			if(typeof typeSystemNames === "string"){
				typeSystemNames = [typeSystemNames];
			}else{
				console.log("typeSystemNames not an Array or String",xcpID,typeSystemNames);
				return "";
			}		
		}
			shim2.setCmpConfiguration(xcpID,"action.allowedTypeValues",typeSystemNames);
			return "";
	};
	
	var isArray = function(input){
		return typeof(input)==="object" && (input instanceof Array);
	};
  
	/* JSONPath 0.8.0 - XPath for JSON
	 *
	 * Copyright (c) 2007 Stefan Goessner (goessner.net)
	 * Licensed under the MIT (MIT-LICENSE.txt) licence.
	 */
	var jsonPath = shim2.jsonPath = function(obj, expr, arg) {
		var P = {
			resultType: arg && arg.resultType || "VALUE",
			result: [],
			normalize: function(expr){
				var subx = [];
				return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0,$1){return "[#"+(subx.push($1)-1)+"]";})
					.replace(/'?\.'?|\['?/g, ";")
						.replace(/;;;|;;/g, ";..;")
					.replace(/;$|'?\]|'$/g, "")
					.replace(/#([0-9]+)/g, function($0,$1){return subx[$1];});
			},
			asPath: function(path){
				var x = path.split(";"), p = "$";
				for (var i=1,n=x.length; i<n; i++){
					p += /^[0-9*]+$/.test(x[i]) ? ("["+x[i]+"]") : ("['"+x[i]+"']");
				}
				return p;
			},
			store: function(p, v){
				if (p){
					P.result[P.result.length] = P.resultType === "PATH" ? P.asPath(p) : v;
				}
				return !!p;
			},
			trace: function(expr, val, path) {
				var x,s,loc,i,n;
				if (expr){
					x = expr.split(";"), loc = x.shift();
					x = x.join(";");
					if (val && val.hasOwnProperty(loc)){
						P.trace(x, val[loc], path + ";" + loc);
					}
					else if (loc === "*"){
						P.walk(loc, x, val, path, function(m,l,x,v,p){
							P.trace(m+";"+x,v,p); 
						});
					}
					else if (loc === ".."){
						P.trace(x, val, path);
						P.walk(loc, x, val, path, function(m,l,x,v,p) {
							typeof v[m] === "object" && P.trace("..;"+x,v[m],p+";"+m);
						});
					}
					else if (/,/.test(loc)){ // [name1,name2,...]
						for (s=loc.split(/'?,'?/),i=0,n=s.length; i<n; i++){
							P.trace(s[i]+";"+x, val, path);
						}
					}
					else if (/^\(.*?\)$/.test(loc)){ // [(expr)]
						P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";")+1))+";"+x, val, path);
					}
					else if (/^\?\(.*?\)$/.test(loc)){ // [?(expr)]
						P.walk(loc, x, val, path, function(m,l,x,v,p){
							if ( P.eval(l.replace(/^\?\((.*?)\)$/,"$1"),v[m],m)){
								P.trace(m+";"+x,v,p);
							}
						});
					}
					else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)){ // [start:end:step]  phyton slice syntax
						P.slice(loc, x, val, path);
					}
				}
				else{
					P.store(path, val);
				}
			},
			walk: function(loc, expr, val, path, f){
				if (val instanceof Array){
					for (var i=0,n=val.length; i<n; i++){
						if (i in val){
							f(i,loc,expr,val,path);
						}
					}
				}
				else if (typeof val === "object"){
					for (var m in val){
						if (val.hasOwnProperty(m)){
							f(m,loc,expr,val,path);
						}
					}
				}
			},
			slice: function(loc, expr, val, path){
				if (val instanceof Array){
					var len=val.length, start=0, end=len, step=1;
					loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0,$1,$2,$3){start=parseInt($1||start);end=parseInt($2||end);step=parseInt($3||step);});
					start = (start < 0) ? Math.max(0,start+len) : Math.min(len,start);
					end   = (end < 0)   ? Math.max(0,end+len)   : Math.min(len,end);
					for (var i=start; i<end; i+=step){
						P.trace(i+";"+expr, val, path);
					}
				}
			},
			eval: function(x, _v, _vname) {
				try{ 
					return $ && _v && eval(x.replace(/@/g, "_v"));
				}
				catch(e){
					throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a"));
				}
			}
		};

		var $ = obj;
		if (expr && obj && (P.resultType === "VALUE" || P.resultType === "PATH")){
			P.trace(P.normalize(expr).replace(/^\$;/,""), obj, "$");
			return P.result.length ? P.result : false;
		}
	}; 
  
	
	/*
	 * Returns the r_object_id of the location of the page.
	 * 
	 */
	shim2.getLocationID = function(){
		var	location = xcp.navigationManager.currentNavigationContext.objectId;
		return location ? location : '';
	};
	
	/*
	 * Returns the label of a picklist item based on the picklistName and item value.
	 * 
	 */
	shim2.getPicklistLabel = function(picklistName,value){
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
	};
	
	
	
	shim2.getXCPCmp = function(xcpID){
		var cmp;
		cmp = Ext.ComponentQuery.query("component[xcpId =" + xcpID + "]");
		if(cmp && cmp[0]){
			return cmp[0];
		}
		return undefined;
	};
	
	
	
	shim2.setCmpConfiguration = function(xcpID,path,value){
		var pathAtts,key,parentNode;
		var cmp = shim2.getXCPCmp(xcpID);	
		if(cmp !== undefined){
			pathAtts = path.split(".");
			key = pathAtts.pop();
			if(pathAtts.length === 0){
				cmp[key]=value;
			}
			else{
				parentNode = jsonPath(cmp,"$." + pathAtts.join("."));
				parentNode[0][key]=value;
			}
		}else{
			console.log("Failed to get Component " + xcpID);
			return "";
		}
		return "";
	};

	shim2.getCmpConfiguration = function(xcpID,name){
		var cmp = shim2.getXCPCmp(xcpID);
		var value;
		if(cmp !== undefined){
			value = cmp[name]=value;
		}else{
			console.log("Failed to get Component " + xcpID);
			return "";
		}
		return value;
	};
	
	
	
	shim2.setImportButtonTypes = function(xcpID,typeSystemNames){
		return setAllowedTypeValues(xcpID,typeSystemNames);
	};
	
	/*********************************************************
	Example:
	setFolderImportTypes("dm_folder",["ns_document","ns_otherdoc"]);
	*********************************************************/
	shim2.setFolderImportTypes = function(folderName,allowedTypes){
		if(isArray(allowedTypes) === true && typeof folderName ==='string'){
			//remove bad entries
			allowedTypes= Ext.Array.filter(allowedTypes,function(item,index){
				return typeof item === "string";
			});
			
			if(shim2.config.import[folderName] === undefined){
				shim2.config.import[folderName]={};
			}
			shim2.config.import[folderName].allowedTypeValues=allowedTypes;
			
		}else{
			console.log("setFolderImportTypes has invalid parameters",folderName,allowedTypes);
		}
	
		return "";
	};
	
	shim2.setButtonImportTypes = function(xcpID,typeSystemNames){
		return setAllowedTypeValues(xcpID,typeSystemNames);
	};
	
	shim2.triggerEval = function(onChangeValues){
		return "";
	};
	
	/*Not implemented yet
	shim2.setNewFolderTypes = function(xcpID,typeSystemNames){
		return setAllowedTypeValues(xcpID,typeSystemNames);
	};
/*
	/************************************
			Exposing Shim2
		************************************/

		// CommonJS module is defined
		if (window.module !== undefined && module.exports !== undefined) {
			module.exports = shim2;
		} /*global ender:false */
		if (window.ender === undefined) {
			window.shim2 = shim2;
		} /*global define:false */
		if (typeof define === "function" && define.amd) {
			define("shim2", [], function() {
				return shim2;
			});
		}
}());


