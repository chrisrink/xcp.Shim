xcp.Shim
========

A utilility for xCP 2.0 to work around some limitations of the platform

##Limiting Import to a particular content type

There is no way to specify a particular object type that should be imported. The following two utility functions can be called on either a master page or from an instance page to set the import configuration.  

1. setImportButtonTypes- Sets the import configuraiton that can be used for a particular import button.
  - **xcpID:** (String) - The xcp ID of the import button widget
  - **typesSystemNames:** ( [String] ) - The system names of the content types that can be imported to.

2. setFolderImportTypes- Sets the import configuraiton for a particular folder type.
  - **folderName:** (String) - The system name of the folder type.
  - **allowedTypes:** ( [String] ) - The system names of the content types that can be imported to.

##Passing Context in an Actionflow

There is no way pass context to an import page. There is also no way to set the default value of a input field on the import step. We need a way to set a global property and then retrieve it when the import dialog loads.

**Note:** This method could also be used for Selector or Relationship Actionflows.

1. setGlobalProperty- Sets a key value pair in a globally accessible location
  - **key:** (String) - The xcp ID of the import button widget.
  - **value:** ( Any ) - The value to set

2. getGlobalProperty- Gets a global key value pair. Returns an empty string if not found.
  - **key:** (String) - The system name of the folder type.


3. setWidgetValue- When the expression is evaluated, this function will set the value of a widget
  - **xcpID:** (String) - The xcp ID of the widget which value will be set.
  - **value:** (String) - The value to set.

##Picklists in Expressions

If you are using an html expression, there is no way to get the localized label of a picklist value.

1. getPicklistLabel - Returns the String label of the picklist value
  - **picklistName:** (String) - The system name of the picklist.
  - **value:** (String) - The value to lookup the label for.


##Getting an Instance ID

If you are in an Application Page with Content Tree or Actionflow, it is very useful to get the instance id of the selected item.

1. getLocationID - Returns the r\_object\_id from the url of the page

##Triggering a function

In order to execute these functions, a value display widget should be used which has no label. All of these utility functions will be called when the expression is evaluated. This is generally when the page loads. If you require to evaluate the the expression after the page loads, you can use other value changes to trigger the evaluation. I have created a function that makes this easier.

3. triggerEval- Subscribes to a value and will cause the entire expression to be re-evaluated when the parameter changes. This will always return an empty string.
  - **onChangeValue:** ([Any]) - The value to watch for a change

