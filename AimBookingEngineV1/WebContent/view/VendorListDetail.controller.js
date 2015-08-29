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
            this.bus = sap.ui.getCore().getEventBus();
          },
          _handleRouteMatched : function(evt) {
            this.getView().byId("VendorsList").setBusy(true);
            this.paramValue = evt.getParameter("arguments");
            // JT FIX for refresh from home button
            if (evt.getParameter("name") === "VendorListDetail") {

              this.oIndexItem = [];
              var that = this;
              this.oModel = sap.ui.medApp.global.util.getVendorModel();
              if (sessionStorage.medAppUID != undefined
                  && that.oModel.getProperty("/LoggedUser") == undefined) {

                if (!that.oModel.getProperty("/LoggedUser")) {
                  var param = [ {
                    "key" : "details",
                    "value" : {
                      "USRID" : sessionStorage.medAppUID,
                      "UERPW" : sessionStorage.medAppPWD
                    }
                  } ];
                  var fnSuccess = function(oData) {
                    that.oModel.setProperty("/LoggedUser", oData.results);
                    that.setVendorsList();
                  }
                }
                sap.ui.medApp.global.util.getLoginData(param, fnSuccess);
              } else {
                that.setVendorsList();
              }

              this.oView.setModel(this.oModel);
            }
          },
          setVendorsList : function() {
            var that = this;
            if (this.paramValue.FILTER != 0) {
              var fnSuccess = function(oData) {
                that.oModel.setProperty("/vendorsList", oData.results);
                that.getView().byId("VendorsList").setBusy(false);
              }
              sap.ui.medApp.global.util.loadVendorFILTERData(this.paramValue,
                  fnSuccess);

            } else {
              var fnSuccess = function(oData) {
                that.oModel.setProperty("/vendorsList", oData.results);
                that.getView().byId("VendorsList").setBusy(false);
              }
              sap.ui.medApp.global.util.loadVendorData(this.paramValue,
                  fnSuccess);
            }
          },
          getImageUrl : function(oValue) {
            if (oValue != null && oValue != undefined) {

              return "assets/img/" + oValue;
            }
          },
          handleBookAppointment : function(oEvent) {
            oEvent.oSource.setBusy(true);
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
                  .getItems()[0].getButtons()[0].setGroupName(oFlagIndexItem);
              oBookingBox.getSubHeader().getContentMiddle()[0].getItems()[1]
                  .getItems()[0].getButtons()[1].setGroupName(oFlagIndexItem);
              var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
              var oLinkTemplate = new sap.m.Link({
                press : [ oController.handleBookingTime, oController ]
              })
                  .bindProperty('text', {
                    parts : [ {
                      path : "START",
                    // formatter : oController.getCorrectTime()
                    }, {
                      path : "END",
                    // formatter : oController.getCorrectTime()
                    } ],
                    formatter : sap.ui.medApp.global.util.getCorrectTime
                  })
                  .bindProperty(
                      "enabled",
                      {
                        path : 'STATUS',
                        formatter : sap.ui.medApp.global.globalFormatter.getBookingStatus
                      });
              var oTemplate = new sap.m.VBox(
                  {
                    renderType : "Div",
                    items : [
                        new sap.m.VBox(
                            {
                              items : [ new sap.m.Label(
                                  {
                                    text : {
                                      path : 'Date',
                                      formatter : sap.ui.medApp.global.util.getDateLabel
                                    }
                                  }) ]
                            }).addStyleClass("CalenderDate"),
                        new sap.m.VBox({}).addStyleClass("CalenderTime")
                            .bindAggregation("items", "TimeSlots",
                                oLinkTemplate) ],
                    visible : {
                      path : 'Date',
                      formatter : sap.ui.medApp.global.util.handleFilterDays
                    }
                  }).addStyleClass("daySchedule");
              oBookingBox.getContent()[1].bindAggregation("items", sPath
                  + "/vendorsAvailableTime", oTemplate);
              oItemSelected.addContent(oBookingBox);
              oItemSelected.setExpanded(true);
            }
            oEvent.oSource.setBusy(false);
          },
          loadVendorCalendorTime : function(sPath, d, fnSuccess) {
            // var iPathIndex = sPath.split("/")[2];
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
          handleCancelBooking : function(oFlagIndex) {
            var bookingBox = this.getView().byId("VendorsList").getItems()[oFlagIndex]
                .getContent();
            bookingBox[0].removeAllContent();
            bookingBox[0].setExpanded(false);
            this.oIndexItem.splice(this.oIndexItem.indexOf(oFlagIndex), 1);
          },
          handleDetailNav : function(oEvent) {
            var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
            var vIndex = sPath.split("/");
            var oVendorData = this.oModel.getProperty(sPath);
            this._oRouter.navTo("_VendorDetail", {
              USRID : oVendorData.USRID,
              RULID : oVendorData.Rules[0].RULID,
              VPATH : vIndex[1],
              VINDEX : vIndex[2],
              ETYID : this.paramValue.ETYID,
              UID : this.paramValue.UID,
              ENTID : this.paramValue.ENTID,
              ETCID : this.paramValue.ETCID,
              FILTER : this.paramValue.FILTER
            });
          },
          changeToOneWeek : function(oEvent) {
            var that = this;
            var _oSource = oEvent.oSource;
            this.oView.setBusy(true);
            if (_oSource.getSelectedIndex() == 0) {
              var oIndex = _oSource.getButtons()[_oSource.getSelectedIndex()]
                  .getGroupName();
              var oItemSelected = that.getView().byId("VendorsList").getItems()[oIndex]
                  .getContent()[0];
              var oBookingBox = oItemSelected.getContent();
              var oCalendar = oBookingBox[0].getContent()[0].setVisible(false);
              var sPath = oCalendar.getBindingContext().getPath();
              var fnSuccess = function(oData) {

                oBookingBox[0].getContent()[1].setVisible(true);
                that.oModel.setProperty(sPath + "/vendorsAvailableTime/",
                    oData.results);
                that.oModel.getProperty(sPath + "/vendorsAvailableTime/");

                var vendorTimeDetail = that.oModel.getProperty(sPath
                    + "/vendorsAvailableTime/");
                vendorTimeDetail[0].SPATH = sPath;
                that.oView.setBusy(false);
              }
              that.loadVendorCalendorTime(sPath, new Date(), fnSuccess);

            } else {
              var oIndex = _oSource.getButtons()[_oSource.getSelectedIndex()]
                  .getGroupName();
              var oItemSelected = this.getView().byId("VendorsList").getItems()[oIndex]
                  .getContent()[0];
              var oBookingBox = oItemSelected.getContent();
              var oCalendar = oBookingBox[0].getContent()[0].setVisible(true);
              oBookingBox[0].getContent()[1].setVisible(false);
              that.oView.setBusy(false);
            }
          },
          handleWeekCalender : function(oEvent) {
            this.oView.setBusy(true);
            var _source = oEvent.oSource;
            var oBookingBox = oEvent.oSource.oParent;
            var selectedDate = oEvent.oSource.getSelectedDates()[0]
                .getStartDate();
            var oBookingBox = oEvent.oSource.oParent;
            var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
            var that = this;
            oBookingBox.getContent()[0].setVisible(false);
            var fnSuccess = function(oData) {
              oBookingBox.getContent()[1].setVisible(true);
              oBookingBox.getSubHeader().getContentMiddle()[0].getItems()[1]
                  .getItems()[0].setSelectedIndex(0);
              that.oModel.setProperty(sPath + "/vendorsAvailableTime/",
                  oData.results);
              that.oModel.getProperty(sPath + "/vendorsAvailableTime/");

              var vendorTimeDetail = that.oModel.getProperty(sPath
                  + "/vendorsAvailableTime/");
              vendorTimeDetail[0].SPATH = sPath;
              that.oView.setBusy(false);
            }
            this.loadVendorCalendorTime(sPath, selectedDate, fnSuccess);

          },
          changeToOneMonth : function(oEvent) {

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
            this.oView.setBusy(true);
            var _Source = oEvt.oSource;
            var that = this;
            setTimeout(function() {
              sap.ui.medApp.global.util.handleBooking(_Source, that._oRouter);
              that.oView.setBusy(false);
            }, 2000);
          },
          doNavBack : function(event) {
            this._oRouter.navTo("_searchVendors", {
              ETYID : this.paramValue.ETYID,
              UID : this.paramValue.UID,
              ENTID : this.paramValue.ENTID,
              ETCID : this.paramValue.ETCID,
              FILTER : this.paramValue.FILTER
            });
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
          }
        });