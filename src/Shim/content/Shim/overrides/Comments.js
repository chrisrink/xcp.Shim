Ext.define("Shim.widget.Comments",{
	override: 'xcp.widget.comments.Comments',
	constructor: function(config) {
		this.callParent(arguments);
		delete this.height;
		this.minHeight= 250;
		this.autoscroll= true;
	}
});
Ext.require("shim2.widget.Comments");