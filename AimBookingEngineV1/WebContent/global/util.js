jQuery.sap.declare("sap.ui.medApp.global.util");
jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.medApp.global.util = {
    getMainModel: function(){
    	if(!this._mainModel){
    		this._mainModel = new sap.ui.model.json.JSONModel();
    		this.loadListCategory();
    		this.loadListTileCategory();
    	}
    	
    	return this._mainModel;
    },
    loadListCategory:function(facade){
		this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(this._mainModel);
		this._vendorListServiceFacade.getRecords(null, null, "/vendorsCategory", "vendorCatList" , "");

	},
	loadListTileCategory:function(facade){
		this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(this._mainModel);
		this._vendorListServiceFacade.getRecords(null, null, "/vendorsTileCategory", "vendorTileCatList" , "");

	},
}
