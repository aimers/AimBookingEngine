jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.controller("sap.ui.medApp.view.VendorListDetail", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf EvidencePackage.app.BarGraph
	 */ 
	onInit : function() {
		this.oModel = new sap.ui.model.json.JSONModel();
		this.loadListFacade();
		this.getView().setModel(this.oModel);
		this.oIndexItem = -1;
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		//this._oRouter.attachRoutePatternMatched(this._handleRouteMatched, this);
	},
	loadListFacade:function(facade){
		this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(this.oModel);
		this._vendorListServiceFacade.getRecords(null, null, "/vendorsList", "vendorDataList" , "");

	},
	getImageUrl : function(oValue) {
		if (oValue != null && oValue != undefined) {

			return "assets/img/" + oValue;
		}
	},
	handleBookAppointment : function(oEvent){
		var oController = this;
		var buttonId = oEvent.oSource.getId();
		if(this.oIndexItem + 1){
			this.handleCancelBooking();
		}
		this.oIndexItem = buttonId.slice(-1);
		this.oItemSelected = this.getView().byId("VendorsList").getItems()[this.oIndexItem].getContent();
		this.loadVendorCalendorTime();
		this.oBookingBox = sap.ui.xmlfragment("sap.ui.medApp.view.Calender", this);
		this.oItemSelected[0].addItem(this.oBookingBox);
	},
	loadVendorCalendorTime : function(){
		this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(this.oModel);
		this._vendorListServiceFacade.getRecords(null, null, "/vendorsAvailableTime", "vendorsAvailableTime" , "");
	},
	handleCancelBooking : function(){
		this.oItemSelected[0].removeItem(this.oItemSelected[0].getItems()[1]);
		this.oIndexItem = -1;
	},
	handleDetailNav : function(oEvent){
		this._oRouter.navTo("_VendorDetail", { vendorId : "123", vendorDetailId : "123"});
	},
	changeToOneWeek: function () {
		var oCalendar = this.oBookingBox.getContent()[0];
		oCalendar.setMonthsPerRow(1);
		oCalendar.setWeeksPerRow(1);
		oCalendar.setSingleRow(true);
	},
	changeToOneMonth: function () {
		var oCalendar = this.oBookingBox.getContent()[0];
		oCalendar.setSingleRow(false);
		oCalendar.setMonthsToDisplay(1);
		oCalendar.setWeeksPerRow(1);
		oCalendar.setMonthsPerRow(1);
	},
	handleSelectDialogPress: function (oEvent) {
		if (! this._oDialog) {
			this._oDialog = sap.ui.xmlfragment("sap.ui.medApp.view.Popover", this);
			//this._oDialog.setModel(this.getView().getModel());
		}
		// toggle compact style
		//jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
		this._oDialog.open();
	},
	HandleCloseDialog : function(){
		this._oDialog.close();
	}
});