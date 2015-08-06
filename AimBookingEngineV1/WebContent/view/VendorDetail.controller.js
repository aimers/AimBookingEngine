jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui
    .controller(
        "sap.ui.medApp.view.VendorDetail",
        {

          /**
           * Called when a controller is instantiated and its View controls (if
           * available) are already created. Can be used to modify the View
           * before it is displayed, to bind event handlers and do other
           * one-time initialization.
           * 
           * @memberOf EvidencePackage.app.BarGraph
           */
          onInit : function() {
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this._handleRouteMatched,
                this);
          },
          _handleRouteMatched : function(evt) {
            this.paramValue = evt.getParameter("arguments");
            var sPath = "/" + this.paramValue.VPATH + "/"
                + this.paramValue.VINDEX;
            if (!this.oModel) {
              this.oModel = sap.ui.medApp.global.util
                  .getVendorModel(this.paramValue);
              var vendorDetail = [ this.oModel.getProperty(sPath) ];
              this.oModel.setProperty("/vendorsDetail", vendorDetail);
              this.loadListDetailFacade();
              this.oView.setModel(this.oModel);
            }
          },
          loadListDetailFacade : function(facade) {
            this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                this.oModel);
            var param = [ {
              "key" : "USRID",
              "value" : this.paramValue.USRID
            }, {
              "key" : "RULID",
              "value" : this.paramValue.RULID
            }, {
              "key" : "ETCID",
              "value" : 1
            }, {
              "key" : "ETYID",
              "value" : 1
            }, {
              "key" : "ENTID",
              "value" : 1
            }, {
              "key" : "STDATE",
              "value" : "27-07-2015"
            }, {
              "key" : "ENDATE",
              "value" : "03-08-2015"
            } ];
            this._vendorListServiceFacade.getRecords(null, null,
                "/vendorsAvailableTime", "getVendorRuleDetail", param);

          },
          getImageUrl : function(oValue) {
            if (oValue != null && oValue != undefined) {

              return "assets/img/" + oValue;
            }
          },
          handleCancelBooking : function() {
            this.oItemSelected[0]
                .removeItem(this.oItemSelected[0].getItems()[1]);
            this.oIndexItem = -1;
          },
          handleDetailNav : function(oEvent) {
            this._oRouter.myNavBack();
          },
          changeToOneWeek : function(oEvent) {
            this.getView().byId("monthCalenderView").setVisible(false);
            this.getView().byId("weekCalenderView").setVisible(true);
          },
          changeToOneMonth : function(oEvent) {
            this.getView().byId("monthCalenderView").setVisible(true);
            this.getView().byId("weekCalenderView").setVisible(false);
          },
          handleSelectDialogPress : function(oEvent) {
            if (!this._oDialog) {
              this._oDialog = sap.ui.xmlfragment("sap.ui.medApp.view.Popover",
                  this);
            }
            var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
            this.oModel.setProperty("/ImageCarousal", this.oModel
                .getProperty(sPath));
            this._oDialog.setModel(this.oModel);
            this._oDialog.open();
          },
          HandleCloseDialog : function() {
            this._oDialog.close();
          },
          navToListPage : function(oEvent) {
            this._oRouter.navTo("VendorListDetail", {
              ENTID : this.paramValue.ENTID,
              UID : this.paramValue.UID,
              ETYID : this.paramValue.ETYID,
              ETCID : this.paramValue.ETCID
            });
          },
          handleBookingTime : function(oEvt) {
            sap.ui.medApp.global.util.handleBooking(oEvt, this.oModel,
                this.router);
          },
          getDateLabel : function(oValue) {
            if (oValue != null && oValue != undefined) {
              var splitValue = oValue.split(" ");
              return splitValue[0] + " " + splitValue[1] + " " + splitValue[2];
            }
          },
          getCorrectTime : function(oValue) {
            if (oValue != null && oValue != undefined) {
              var splitValue = oValue.split(":");
              return splitValue[0] + ":" + splitValue[1];
            }
          },
        });