jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui
    .controller(
        "sap.ui.medApp.view.VendorListDetail",
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
            this.oIndexItem = [];
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this._handleRouteMatched,
                this);

          },
          _handleRouteMatched : function(evt) {
            this.paramValue = evt.getParameter("arguments");
            if (!this.oModel) {
              this.oModel = sap.ui.medApp.global.util
                  .getVendorModel(this.paramValue);
              this.oView.setModel(this.oModel);
            }
          },
          getImageUrl : function(oValue) {
            if (oValue != null && oValue != undefined) {

              return "assets/img/" + oValue;
            }
          },
          handleBookAppointment : function(oEvent) {
            var oController = this;
            var buttonId = oEvent.oSource.getId();
            var oFlagIndexItem = buttonId.slice(-1);
            var oFlag = jQuery.inArray(oFlagIndexItem, this.oIndexItem) + 1;
            if (oFlag) {
              this.handleCancelBooking(oFlagIndexItem);
            } else {
              this.oIndexItem[this.oIndexItem.length] = oFlagIndexItem;
              var oItemSelected = this.getView().byId("VendorsList").getItems()[oFlagIndexItem]
                  .getContent()[0];
              var oBookingBox = sap.ui.xmlfragment(
                  "sap.ui.medApp.view.Calender", this);
              oBookingBox.getSubHeader().getContentMiddle()[0].getItems()[1]
                  .getItems()[0].setGroupName(oFlagIndexItem);
              oBookingBox.getSubHeader().getContentMiddle()[0].getItems()[1]
                  .getItems()[1].setGroupName(oFlagIndexItem);
              oItemSelected.addContent(oBookingBox);
              var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
              this.loadVendorCalendorTime(sPath);
              oItemSelected.setExpanded(true);
            }

          },
          loadVendorCalendorTime : function(sPath) {
            var UserData = this.oModel.getProperty(sPath);
            this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                this.oModel);
            var param = [ {
              "key" : "USRID",
              "value" : UserData.USRID
            }, {
              "key" : "RULID",
              "value" : UserData.Rules[0].RULID
            }, {
              "key" : "ETCID",
              "value" : UserData.Rules[0].ETCID
            }, {
              "key" : "ETYID",
              "value" : UserData.Rules[0].ETYID
            }, {
              "key" : "ENTID",
              "value" : UserData.Rules[0].ENTID
            }, {
              "key" : "STDATE",
              "value" : "27-07-2015"
            }, {
              "key" : "ENDATE",
              "value" : "03-08-2015"
            } ]
            this._vendorListServiceFacade.getRecords(null, null,
                "/vendorsAvailableTime", "getVendorRuleDetail", param);
            var vendorTimeDetail = this.oModel
                .getProperty("/vendorsAvailableTime");
            vendorTimeDetail[0].SPATH = sPath;
          },
          handleCancelBooking : function(oFlagIndex) {
            var bookingBox = this.getView().byId("VendorsList").getItems()[oFlagIndex]
                .getContent();
            bookingBox[0].removeAllContent();
            bookingBox[0].setExpanded(false);
            this.oIndexItem.splice(this.oIndexItem.indexOf(oFlagIndex), 1);
          },
          handleDetailNav : function(oEvent) {
            var sPath = oEvent.oSource.getSelectedContexts()[0].getPath();
            var vIndex = sPath.split("/");
            var oVendorData = this.oModel.getProperty(sPath);
            this._oRouter.navTo("_VendorDetail", {
              USRID : oVendorData.USRID,
              RULID : oVendorData.Rules[0].RULID,
              VPATH : vIndex[1],
              VINDEX : vIndex[2],
              ETYID : 1,
              UID : 1,
              ENTID : 1,
              ETCID : 1
            });
          },
          changeToOneWeek : function(oEvent) {
            var oIndex = oEvent.oSource.getGroupName();
            var oItemSelected = this.getView().byId("VendorsList").getItems()[oIndex]
                .getContent()[0];
            var oBookingBox = oItemSelected.getContent();
            var oCalendar = oBookingBox[0].getContent()[0].setVisible(false);
            oBookingBox[0].getContent()[1].setVisible(true);
          },
          handleWeekCalender : function(oEvent) {
            console.log(oEvent);
          },
          changeToOneMonth : function(oEvent) {
            var oIndex = oEvent.oSource.getGroupName();
            var oItemSelected = this.getView().byId("VendorsList").getItems()[oIndex]
                .getContent()[0];
            var oBookingBox = oItemSelected.getContent();
            var oCalendar = oBookingBox[0].getContent()[0].setVisible(true);
            oBookingBox[0].getContent()[1].setVisible(false);
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
          handleBookingTime : function(oEvt) {
            sap.ui.medApp.global.util.handleBooking(oEvt, this._oRouter);
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
          getListCount : function(oArray) {
            if (oArray != null && oArray != undefined) {
              return oArray.length + " results found";
            }
          }
        });