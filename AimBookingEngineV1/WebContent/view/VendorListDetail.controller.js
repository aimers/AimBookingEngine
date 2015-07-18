jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.controller("sap.ui.medApp.view.VendorListDetail", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf EvidencePackage.app.BarGraph
	 */ 
	onInit : function() {
		this.oModel = sap.ui.getCore().getModel();
		this.loadListFacade();
		this.getView().setModel(this._vendorListServiceFacade.oModel);
		this.oIndexItem = -1;
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
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
		this.oBookingBox = new sap.m.Page(
				{
					
					showHeader: false,
					subHeader :  new sap.m.Bar({
						contentMiddle : new sap.m.Label({text:"Select Date"}),
						contentRight : new sap.m.HBox({
							width: "88%",
							justifyContent : "Center",
							items : [
							         new sap.m.RadioButton({
							        	 text : "Weekly",
							        	 select : [oController.changeToOneWeek, oController]
							         }),
							         new sap.m.RadioButton({
							        	 text : "Monthly",
							        	 select : [oController.changeToOneMonth, oController]
							         }),
							         ]
						})
					}),
					height: "300px",
					title : "Select Date",
					footer : new sap.m.Bar({
						contentRight : new sap.m.Button({
							text : "Cancel",
							press : [oController.handleCancelBooking, oController]
						})
					}),
					content : new sap.me.Calendar( {
						singleRow : false,		    		
						tapOnDate :  [oController.changeToOneWeek, oController],
					}),
				}		
		).addStyleClass("bookingBox");
		this.oItemSelected[0].addItem(this.oBookingBox);
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
});