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

              this.oModel = sap.ui.medApp.global.util
                  .getVendorModel(this.paramValue);
              var _that = this;
              if (sessionStorage.medAppUID != undefined) {
                if (!_that.oModel.getProperty("/LoggedUser")) {
                  var param = [ {
                    "key" : "details",
                    "value" : {
                      "USRID" : sessionStorage.medAppUID,
                      "UERPW" : sessionStorage.medAppPWD
                    }
                  } ];
                  var fnSuccess = function(oData) {
                    _that.oModel.setProperty("/LoggedUser", oData.results);
                  }
                  sap.ui.medApp.global.util.getLoginData(param, fnSuccess);
                }
              }

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
            var oController = this;
            var oLinkTemplate1 = new sap.m.Link({
              press : [ oController.handleBookingTime, oController ],
            })
                .bindProperty('text', {
                  path : "START",
                  formatter : sap.ui.medApp.global.util.getCorrectTime
                })
                .bindProperty(
                    "enabled",
                    {
                      path : 'STATUS',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingStatus
                    })
                .bindProperty(
                    "visible",
                    {
                      path : 'START',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingTimeMorning
                    });
            var oLinkTemplate2 = new sap.m.Link({
              press : [ oController.handleBookingTime, oController ],
              layoutData : new sap.ui.layout.GridData({
                span : "L1 M3 S5"
              })
            })
                .bindProperty('text', {
                  path : "START",
                  formatter : sap.ui.medApp.global.util.getCorrectTime
                })
                .bindProperty(
                    "enabled",
                    {
                      path : 'STATUS',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingStatus
                    })
                .bindProperty(
                    "visible",
                    {
                      path : 'START',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingTimeAfternoon
                    });
            var oLinkTemplate3 = new sap.m.Link({
              press : [ oController.handleBookingTime, oController ],
              layoutData : new sap.ui.layout.GridData({
                span : "L1 M3 S5"
              })
            })
                .bindProperty('text', {
                  path : "START",
                  formatter : sap.ui.medApp.global.util.getCorrectTime
                })
                .bindProperty(
                    "enabled",
                    {
                      path : 'STATUS',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingStatus
                    })
                .bindProperty(
                    "visible",
                    {
                      path : 'START',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingTimeEvening
                    });
            var oLinkTemplate4 = new sap.m.Link({
              press : [ oController.handleBookingTime, oController ],
              layoutData : new sap.ui.layout.GridData({
                span : "L1 M3 S5"
              })
            })
                .bindProperty('text', {
                  path : "START",
                  formatter : sap.ui.medApp.global.util.getCorrectTime
                })
                .bindProperty(
                    "enabled",
                    {
                      path : 'STATUS',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingStatus
                    })
                .bindProperty(
                    "visible",
                    {
                      path : 'START',
                      formatter : sap.ui.medApp.global.globalFormatter.getBookingTimeNight
                    });
            var oTemplate = new sap.m.IconTabFilter({
              text : {
                path : 'Date',
                formatter : sap.ui.medApp.global.util.getDateLabel
              },
              content : new sap.m.VBox({
                items : [ new sap.m.VBox({
                  width : "100%",
                  items : [ new sap.m.Label({
                    text : "Morning"
                  }) ]
                }).addStyleClass("MorningSlot"), new sap.ui.layout.Grid({
                  hSpacing : 0,
                  vSpacing : 1,
                  content : {
                    path : "TimeSlots",
                    template : oLinkTemplate1
                  }
                }), new sap.m.VBox({
                  width : "100%",
                  items : [ new sap.m.Label({
                    text : "Afternoon"
                  }) ]
                }).addStyleClass("AfternoonSlot"), new sap.ui.layout.Grid({
                  hSpacing : 1,
                  vSpacing : 1,
                  content : {
                    path : "TimeSlots",
                    template : oLinkTemplate2
                  }
                }), new sap.m.VBox({
                  width : "100%",
                  items : [ new sap.m.Label({
                    text : "Evening"
                  }) ]
                }).addStyleClass("EveningSlot"), new sap.ui.layout.Grid({
                  hSpacing : 1,
                  vSpacing : 1,
                  content : {
                    path : "TimeSlots",
                    template : oLinkTemplate3
                  }
                }), new sap.m.VBox({
                  width : "100%",
                  items : [ new sap.m.Label({
                    text : "Night"
                  }) ]
                }).addStyleClass("NightSlot"), new sap.ui.layout.Grid({
                  hSpacing : 1,
                  vSpacing : 1
                }).bindAggregation("content", "TimeSlots", oLinkTemplate4) ]
              })
            });

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
              _this.getView().byId("monthCalenderView").setVisible(false);
              _this.getView().byId("weekCalenderView").setVisible(true);
              oBookingBox.oParent.getItems()[0].getItems()[1].getItems()[0]
                  .setSelectedIndex(0);
              var vendorTimeDetail = oData.results;
              vendorTimeDetail[0].SPATH = sPath;
              _this.oModel.setProperty(sPath + "/vendorsAvailableTime",
                  vendorTimeDetail);
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
            // var selectBoxRule =
            // this.oView.byId("SelectRule").getSelectedKey();
            sap.ui.medApp.global.util.handleBooking(oEvt.oSource, this.router,
                1);
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
          handleRuleSelection : function(oEvent) {
            if (oEvent.oSource.getSelectedKey() == 3) {
              this.getView().byId("monthCalenderView").setVisible(false);
              this.getView().byId("weekCalenderView").setVisible(false);
              var sPath = "/" + this.paramValue.VPATH + "/"
                  + this.paramValue.VINDEX;
              var oText = this.getView().byId("callBox").getItems()[1];
              oText.bindProperty("text", {
                path : sPath + "/Characteristics",
                formatter : sap.ui.medApp.global.globalFormatter.getCallNumber
              });
              this.getView().byId("callBox").setVisible(true);
            } else {
              this.getView().byId("monthCalenderView").setVisible(true);
              this.getView().byId("weekCalenderView").setVisible(false);
              this.getView().byId("callBox").setVisible(false);
            }
          },
          handleLocation : function(oEvent) {
            var oBindingPath = oEvent.oSource.oParent.getBindingContext()
                .getPath();
            var locationData = this.oModel.getProperty(oBindingPath
                + "/Address");
            var win = window
                .open("http://maps.google.com/?q=" + locationData[0].LONGT
                    + "," + locationData[0].LATIT, '_blank');
            win.focus();
          }
        });