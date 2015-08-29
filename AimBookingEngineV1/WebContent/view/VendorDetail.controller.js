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
            if (evt.getParameter("name") === "_VendorDetail") {
              this.oView.setBusy(true);
              var sPath = "/" + this.paramValue.VPATH + "/"
                  + this.paramValue.VINDEX;
              if (!this.oModel) {
                this.oModel = sap.ui.medApp.global.util
                    .getVendorModel(this.paramValue);
              }
              this.oModel = sap.ui.medApp.global.util
                  .getVendorModel(this.paramValue);
              var _that = this;
              // this.vendorDetail = [ this.oModel.getProperty(sPath) ];
              var fnSuccess = function(oData) {
                _that.oModel.setProperty("/vendorsList", oData.results);
                _that.oModel.setProperty("/vendorsDetail", [ _that.oModel
                    .getProperty(sPath) ]);
                _that.oView.setModel(_that.oModel);
                _that.setAggregation(sPath);
                _that.getView().setBusy(false);
              };
              sap.ui.medApp.global.util.loadVendorData(this.paramValue,
                  fnSuccess);
            }
          },
          setAggregation : function(sPath) {
            var weekCalender = this.getView().byId("weekCalenderView");
            var oLinkTemplate = new sap.m.Link({
              press : [ this.handleBookingTime, this ]
            }).bindProperty('text', {
              parts : [ {
                path : "START",
              // formatter : oController.getCorrectTime()
              }, {
                path : "END",
              // formatter : oController.getCorrectTime()
              } ],
              formatter : sap.ui.medApp.global.util.getCorrectTime
            }).bindProperty("enabled", {
              path : 'STATUS',
              formatter : sap.ui.medApp.global.globalFormatter.getBookingStatus
            });
            var oTemplate = new sap.m.VBox({
              renderType : "Div",
              items : [
                  new sap.m.VBox({
                    items : [ new sap.m.Label({
                      text : {
                        path : 'Date',
                        formatter : sap.ui.medApp.global.util.getDateLabel
                      }
                    }) ]
                  }).addStyleClass("CalenderDate"),
                  new sap.m.VBox({}).addStyleClass("CalenderTime")
                      .bindAggregation("items", "TimeSlots", oLinkTemplate) ],
              visible : {
                path : 'Date',
                formatter : sap.ui.medApp.global.util.handleFilterDays
              }
            }).addStyleClass("daySchedule");
            weekCalender.bindAggregation("items", sPath
                + "/vendorsAvailableTime", oTemplate);
            weekCalender.setVisible(false);
            this.getView().byId("monthCalenderView").setVisible(true);
            this.getView().byId("radioWeekly").setSelectedIndex(1);
          },
          loadListDetailFacade : function(sPath, d, fnSuccess) {
            var deviceModel = sap.ui.getCore().getModel("device");
            var UserData = this.oModel.getProperty(sPath);
            this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                this.oModel);
            var dd = d.getDate();
            var mm = d.getMonth() + 1; // January is 0!
            var yyyy = d.getFullYear();
            var startDate = dd + "-" + mm + "-" + yyyy;
            if (deviceModel.oData.isPhone) {
              d.setDate(d.getDate() + 3);
            } else {
              d.setDate(d.getDate() + 7);
            }
            mm = d.getMonth() + 1;
            var endData = d.getDate() + "-" + mm + "-" + d.getFullYear();
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
              "value" : startDate
            }, {
              "key" : "ENDATE",
              "value" : endData
            } ]
            this._vendorListServiceFacade.getRecords(fnSuccess, null, sPath
                + "/vendorsAvailableTime", "getVendorRuleDetail", param);

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
            this.oView.setBusy(true);
            var _oSource = oEvent.oSource;
            var _this = this;
            if (_oSource.getSelectedIndex() == 0) {
              var sPath = "/" + this.paramValue.VPATH + "/"
                  + this.paramValue.VINDEX;
              var fnSuccess = function(oData) {
                _this.getView().byId("monthCalenderView").setVisible(false);
                _this.getView().byId("weekCalenderView").setVisible(true);

                var vendorTimeDetail = oData.results;
                vendorTimeDetail[0].SPATH = sPath;
                _this.oModel.setProperty(sPath + "/vendorsAvailableTime",
                    vendorTimeDetail);
                _this.oView.setBusy(false);
              }
              this.loadListDetailFacade(sPath, new Date(), fnSuccess);

            } else {
              this.getView().byId("monthCalenderView").setVisible(true);
              this.getView().byId("weekCalenderView").setVisible(false);
              this.oView.setBusy(false);
            }
          },
          handleAddFavorite : function(oEvent) {
            var flag = oEvent.oSource.getPressed();
            if (sessionStorage.medAppUID != undefined) {
              this.oView.setBusy(true);
              var _this = this;
              var sPath = oEvent.oSource.getBindingContext().getPath();
              var fnSuccess = function(oData) {
                if (flag) {
                  sap.m.MessageToast.show("Added to your favorite");
                } else {
                  sap.m.MessageToast.show("Removed from your favorite");
                }
                _this.oView.setBusy(false);
              };
              var vendorData = this.oModel.getProperty(sPath);
              sap.ui.medApp.global.util
                  .setFavorite(vendorData.USRID, fnSuccess);
            } else {
              this._oRouter.navTo('_loginPage', {
                flagID : 0
              });
            }
          },
          handleWeekCalender : function(oEvent) {
            this.oView.setBusy(true);
            var oBookingBox = oEvent.oSource.oParent;
            var selectedDate = oEvent.oSource.getSelectedDates()[0]
                .getStartDate();
            var oBookingBox = oEvent.oSource.oParent;
            var sPath = "/" + this.paramValue.VPATH + "/"
                + this.paramValue.VINDEX;
            var _this = this;
            var fnSuccess = function(oData) {
              this.getView().byId("monthCalenderView").setVisible(false);
              this.getView().byId("weekCalenderView").setVisible(true);
              oBookingBox.oParent.getItems()[0].getItems()[1].getItems()[1]
                  .setSelected(false);
              oBookingBox.oParent.getItems()[0].getItems()[1].getItems()[0]
                  .setSelected(true);
              _this.oModel.getProperty(sPath + "/vendorsAvailableTime",
                  oData.results);
              _this.oView.setBusy(false);
            };
            this.loadListDetailFacade(sPath, selectedDate, fnSuccess);
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
              ETCID : this.paramValue.ETCID,
              FILTER : this.paramValue.FILTER
            });
          },
          handleBookingTime : function(oEvt) {
            sap.ui.medApp.global.util.handleBooking(oEvt, this.router);
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