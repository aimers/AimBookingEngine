jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.controller("sap.ui.medApp.view.VendorDetail", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf EvidencePackage.app.BarGraph
	 */ 
	onInit : function() {
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.oModel = new sap.ui.model.json.JSONModel();
		this.loadListDetailFacade();
		this.getView().setModel(this.oModel);
	},
	loadListDetailFacade:function(facade){
		this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(this.oModel);
		this._vendorListServiceFacade.getRecords(null, null, "/vendorsDetail", "vendorDataDetail" , "");

	},
	getImageUrl : function(oValue) {
		if (oValue != null && oValue != undefined) {

			return "assets/img/" + oValue;
		}
	},
	handleCancelBooking : function(){
		this.oItemSelected[0].removeItem(this.oItemSelected[0].getItems()[1]);
		this.oIndexItem = -1;
	},
	handleDetailNav : function(oEvent){
		this._oRouter.navTo("_vendorDetail", {vendorDetailId : "123"});
	},
	getDayName : function(oValue){
		if (oValue != null && oValue != undefined) {
			if(oValue == 1){
				return "Mon";
			}
			else if(oValue == 2){
				return ", Tues";
			}
			else if(oValue == 3){
				return ", Wed";
			}
			else if(oValue == 4){
				return ", Thu";
			}
			else if(oValue == 5){
				return ", Fri";
			}
			else if(oValue == 6){
				return ", Sat";
			}
			else if(oValue == 7){
				return ", Sun";
			}
			
		}
	},
	navToListPage : function(oEvent){
		this._oRouter.navTo("VendorListDetail", {vendorId : "123"});
	}
});