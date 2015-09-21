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
              this.setVendorsList();
              // this.getDistanceForAllVendor();
              this.oView.setModel(this.oModel);
            }
          },
          getDistanceForAllVendor : function(results) {
            if (sessionStorage.LATIT != undefined
                && sessionStorage.LONGT != undefined) {
              for (var i = 0; i < results.length; i++) {
                if (results[i].Address) {
                  if (results[i].Address.length > 0) {
                    if (results[i].Address[0].LATIT
                        && results[i].Address[0].LONGT) {
                      var latt = results[i].Address[0].LATIT;
                      var longt = results[i].Address[0].LONGT;
                      var dist = sap.ui.medApp.global.util.distance(latt,
                          longt, "K");
                      results[i].Address[0].distance = Math.round(dist);
                    }
                  }
                }
              }
            }
            return results;
          },
          setVendorsList : function() {
            var that = this;
            if (this.paramValue.FILTER != 0) {
              var fnSuccess = function(oData) {

                that.oModel.setProperty("/vendorsList", that
                    .getDistanceForAllVendor(oData.results));
                that.getView().byId("VendorsList").setBusy(false);
              }
              sap.ui.medApp.global.util.loadVendorFILTERData(this.paramValue,
                  fnSuccess);

            } else {
              var fnSuccess = function(oData) {
                that.oModel.setProperty("/vendorsList", that
                    .getDistanceForAllVendor(oData.results));
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
            this.oView.setBusy(true);

            var oController = this;
            var oFlagIndexItem = oEvent.oSource.getBindingContext().getPath()
                .split("/")[2];
            var oFlag = jQuery.inArray(oFlagIndexItem, this.oIndexItem) + 1;

            if (oFlag) {
              this.handleCancelBooking(oFlagIndexItem);
              this.oView.setBusy(false);
            } else {
              if (this.oIndexItem.length > 0) {
                this.handleCancelBooking(this.oIndexItem[0]);
              }
              this.oRuleSelected = 1;// oRuleSelected
              var oItemSelected = this.getView().byId("VendorsList").getItems()[oFlagIndexItem]
                  .getContent()[0];
              var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
              if (this.oRuleSelected <= 2) {

                this.oIndexItem[this.oIndexItem.length] = oFlagIndexItem;
                var oBookingBox = sap.ui.xmlfragment(
                    "sap.ui.medApp.view.Calender", this);
                var oLinkTemplate1 = new sap.m.Button({
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
                        }).addStyleClass("LinkButton");
                var oLinkTemplate2 = new sap.m.Button({
                  press : [ oController.handleBookingTime, oController ],
                  layoutData : new sap.ui.layout.GridData({
                    span : "L1 M3 S5"
                  })
                })
                    .bindProperty('text', {
                      path : "START",
                      // formatter : oController.getCorrectTime()
                      formatter : sap.ui.medApp.global.util.getCorrectTime
                    })
                    .bindProperty(
                        "enabled",
                        {
                          path : 'STATUS',
                          formatter : sap.ui.medApp.global.globalFormatter.getBookingStatus
                        }).addStyleClass("LinkButton");
                var oLinkTemplate3 = new sap.m.Button({
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
                        }).addStyleClass("LinkButton");
                var oLinkTemplate4 = new sap.m.Button({
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
                        }).addStyleClass("LinkButton");

                var newTemplate = new sap.m.IconTabFilter({
                  text : {
                    path : 'Date',
                    formatter : sap.ui.medApp.global.util.getDateLabel
                  },
                  content : new sap.m.VBox({
                    items : [
                        new sap.m.VBox({
                          width : "100%",
                          items : [ new sap.m.Label({
                            text : "Morning"
                          }) ]
                        }).addStyleClass("MorningSlot"),
                        new sap.ui.layout.Grid({
                          hSpacing : 0,
                          vSpacing : 1,
                          content : {
                            path : "TimeSlotsMorning",
                            template : oLinkTemplate1
                          }
                        }),
                        new sap.m.VBox({
                          width : "100%",
                          items : [ new sap.m.Label({
                            text : "Afternoon"
                          }) ]
                        }).addStyleClass("AfternoonSlot"),
                        new sap.ui.layout.Grid({
                          hSpacing : 1,
                          vSpacing : 1,
                          content : {
                            path : "TimeSlotsAfterNoon",
                            template : oLinkTemplate2
                          }
                        }),
                        new sap.m.VBox({
                          width : "100%",
                          items : [ new sap.m.Label({
                            text : "Evening"
                          }) ]
                        }).addStyleClass("EveningSlot"),
                        new sap.ui.layout.Grid({
                          hSpacing : 1,
                          vSpacing : 1,
                          content : {
                            path : "TimeSlotsEvening",
                            template : oLinkTemplate3
                          }
                        }),
                        new sap.m.VBox({
                          width : "100%",
                          items : [ new sap.m.Label({
                            text : "Night"
                          }) ]
                        }).addStyleClass("NightSlot"),
                        new sap.ui.layout.Grid({
                          hSpacing : 1,
                          vSpacing : 1
                        }).bindAggregation("content", "TimeSlotsNight",
                            oLinkTemplate4) ]
                  })
                });
                oController.ShowOneWeek(oFlagIndexItem, sPath);
                oBookingBox.getSubHeader().getContentLeft()[0]
                    .setDateValue(new Date());
                oBookingBox.getSubHeader().getContentRight()[0].getItems()[1]
                    .bindProperty(
                        "text",
                        {
                          path : sPath + "/Characteristics",
                          formatter : sap.ui.medApp.global.globalFormatter.getCallNumber
                        });
                oBookingBox.getContent()[0].bindAggregation("items", sPath
                    + "/vendorsAvailableTime", newTemplate);
                oItemSelected.addContent(oBookingBox);
              }
              oItemSelected.setExpanded(true);
            }

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
          ShowOneWeek : function(oIndex, sPath) {
            var that = this;
            this.oView.setBusy(true);
            var fnSuccess = function(oData) {
              var updatedData = sap.ui.medApp.global.util
                  .getTimeSlot(oData.results);
              that.oModel.setProperty(sPath + "/vendorsAvailableTime/",
                  updatedData);
              that.oModel.getProperty(sPath + "/vendorsAvailableTime/");

              var vendorTimeDetail = that.oModel.getProperty(sPath
                  + "/vendorsAvailableTime/");
              vendorTimeDetail[0].SPATH = sPath;
              that.oView.setBusy(false);
            }
            that.loadVendorCalendorTime(sPath, new Date(), fnSuccess);
          },
          handleWeekCalender : function(oEvent) {
            this.oView.setBusy(true);
            var _source = oEvent.oSource;
            var oBookingBox = oEvent.oSource.oParent;
            var selectedDate = oEvent.oSource.getDateValue();
            var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
            var that = this;
            var fnSuccess = function(oData) {
              var updatedData = sap.ui.medApp.global.util
                  .getTimeSlot(oData.results);
              that.oModel.setProperty(sPath + "/vendorsAvailableTime/",
                  updatedData);
              that.oModel.getProperty(sPath + "/vendorsAvailableTime/");

              var vendorTimeDetail = that.oModel.getProperty(sPath
                  + "/vendorsAvailableTime/");
              vendorTimeDetail[0].SPATH = sPath;
              that.oView.setBusy(false);
            }
            this.loadVendorCalendorTime(sPath, selectedDate, fnSuccess);
          },
          handleSelectDialogPress : function(oEvent) {
            if (!this._oDialog) {
              this._oDialog = sap.ui.xmlfragment("sap.ui.medApp.view.Popover",
                  this);
            }
            var sPath = oEvent.oSource.oParent.getBindingContext().getPath();
            var vendorData = this.oModel.getProperty(sPath);
            var carousalData = [];
            if (vendorData.Characteristics) {
              for (var i = 0; i < vendorData.Characteristics.length; i++) {
                if (vendorData.Characteristics[i].LNTXT == "Image") {
                  carousalData.push(vendorData.Characteristics[i]);
                }
              }
            }
            var oTemplate = new sap.m.Image({
              src : "{value}",
              densityAware : false
            }).addStyleClass("clinicImages").bindProperty("src", "VALUE");
            this._oDialog.getContent()[0].bindAggregation("pages",
                "/ImageCarousal", oTemplate);
            this.oModel.setProperty("/ImageCarousal", carousalData);

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
              sap.ui.medApp.global.util.handleBooking(_Source, that._oRouter,
                  that.oRuleSelected);
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