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
		this.oIndexItem = [];
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
		var oFlagIndexItem = buttonId.slice(-1);
		var oFlag = jQuery.inArray(oFlagIndexItem,this.oIndexItem) + 1;
		if(oFlag){
			this.handleCancelBooking(oFlagIndexItem);
		}
		else {
			this.oIndexItem[this.oIndexItem.length] = oFlagIndexItem;
			var oItemSelected = this.getView().byId("VendorsList").getItems()[oFlagIndexItem].getContent()[0];	
			var oBookingBox = sap.ui.xmlfragment("sap.ui.medApp.view.Calender", this);
			oBookingBox.getSubHeader().getContentMiddle()[0].getItems()[1].getItems()[0].setGroupName(oFlagIndexItem);
			oBookingBox.getSubHeader().getContentMiddle()[0].getItems()[1].getItems()[1].setGroupName(oFlagIndexItem);
			oItemSelected.addContent(oBookingBox);
			this.loadVendorCalendorTime();
			oItemSelected.setExpanded(true);
		}
		
	},
	loadVendorCalendorTime : function(){
		this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(this.oModel);
		this._vendorListServiceFacade.getRecords(null, null, "/vendorsAvailableTime", "vendorsAvailableTime" , "");
	},
	handleCancelBooking : function(oFlagIndex){
		var bookingBox = this.getView().byId("VendorsList").getItems()[oFlagIndex].getContent();
		bookingBox[0].removeAllContent();
		bookingBox[0].setExpanded(false);
		this.oIndexItem.splice(this.oIndexItem.indexOf(oFlagIndex), 1);
	},
	handleDetailNav : function(oEvent){
		this._oRouter.navTo("_VendorDetail", { vendorId : "123", vendorDetailId : "123"});
	},
	changeToOneWeek: function (oEvent) {
		var oIndex = oEvent.oSource.getGroupName();
		var oItemSelected = this.getView().byId("VendorsList").getItems()[oIndex].getContent()[0];
		var oBookingBox = oItemSelected.getContent();
		var oCalendar = oBookingBox[0].getContent()[0].setVisible(false);
		oBookingBox[0].getContent()[1].setVisible(true);
	},
	changeToOneMonth: function (oEvent) {
		var oIndex = oEvent.oSource.getGroupName();
		var oItemSelected = this.getView().byId("VendorsList").getItems()[oIndex].getContent()[0];
		var oBookingBox = oItemSelected.getContent();
		var oCalendar = oBookingBox[0].getContent()[0].setVisible(true);
		oBookingBox[0].getContent()[1].setVisible(false);
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
	},
	handleDayTime : function(oValue){
		if (oValue != null && oValue != undefined) {
			
		}
	},
	groupTime : function(oGroup){

		if (oGroup.key != null && oGroup.key != undefined) {
			var hours = oGroup.key.split(":")[0];
			if(hours <= 12) {
				return new sap.m.GroupHeaderListItem( {
				      title: "Morning",
				      upperCase: false
				    } );
			}
			if(hours > 12 && hours <=16) {
				return new sap.m.GroupHeaderListItem( {
				      title: "Afternoon",
				      upperCase: false
				    } );
			}
			if(hours > 16 && hours <20) {
				return new sap.m.GroupHeaderListItem( {
				      title: "Evening",
				      upperCase: false
				    } );
			}
			if(hours >  20 && hours <=23) {
				return new sap.m.GroupHeaderListItem( {
				      title: "Night",
				      upperCase: false
				    } );
			}
		}
	},

	getTimeAF : function(oValue){
		if (oValue != null && oValue != undefined) {
			var hours = oValue.split(":")[0];
			if(hours < 16) {
				return oValue;
			}
		}
	},
	getTimeEVE : function(oValue){
		if (oValue != null && oValue != undefined) {
			var hours = oValue.split(":")[0];
			if(hours < 20) {
				return oValue;
			}
		}
	},
	getTimeNIGHT : function(oValue){
		if (oValue != null && oValue != undefined) {
			var hours = oValue.split(":")[0];
			if(hours > 20) {
				return oValue;
			}
		}
	},
	handleBookingTime : function(oEvt) {
		this._oRouter.navTo("_Signup");
	},
	getDateLabel : function(oValue){
		if (oValue != null && oValue != undefined) {
			var splitValue = oValue.split(" ");
			return splitValue[0]+" "+splitValue[1]+" "+splitValue[2];
		}
	},
	getCorrectTime : function(oValue){
		if (oValue != null && oValue != undefined) {
			var splitValue = oValue.split(":");
			return splitValue[0]+":"+splitValue[1];
		}
	},
	getListCount : function(oArray){
		if (oArray != null && oArray != undefined) {
			return oArray.length + " results found";
		}
	}
});