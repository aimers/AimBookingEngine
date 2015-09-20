sap.ui
    .controller(
        "sap.ui.medApp.view.Login",
        {

          /**
           * Called when a controller is instantiated and its View controls (if
           * available) are already created. Can be used to modify the View
           * before it is displayed, to bind event handlers and do other
           * one-time initialization.
           * 
           * @memberOf view.Home
           */
          onInit : function() {
            // getting Router
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.router = sap.ui.core.UIComponent.getRouterFor(this);

            this._oRouter.attachRoutePatternMatched(this._handleRouteMatched,
                this);
          },
          _handleRouteMatched : function(evt) {
            this.parameter = evt.getParameter("arguments");
            if (evt.getParameter("name") === "_loginPage") {
              if (sessionStorage.medAppUID != undefined
                  && sessionStorage.medAppPWD != undefined) {
                this._oRouter.navTo('_homeTiles');
              } else {
                if (sap.ui.medApp.global.util._mainModel) {
                  this.oModel = sap.ui.medApp.global.util._mainModel;
                } else {
                  this.oModel = new sap.ui.model.json.JSONModel();
                }
                this.getView().setModel(this.oModel);
              }
            }
          },
          /*
           * Handle Press Tile
           */
          handleSearchKeyword : function(evt) {
            // open the loading dialog
            this._oRouter.navTo("_searchVendors", {
              vendorId : "123"
            });

          },
          handleLogin : function() {
            var _this = this;
            this.oView.setBusy(true);
            var username = this.oView.byId("usrNme").getValue();
            var password = this.oView.byId("pswd").getValue();
            var param = [ {
              "key" : "details",
              "value" : {
                "USRNM" : username,
                "UERPW" : password
              }
            } ];
            var fnSuccess = function(oData) {
              if (!oData.results.USRID) {
                _this.oView.byId("MessageBox").setVisible(true);
                _this.oView.byId("MessageBox").setText(
                    "Email/Password is incorrect");
                sap.ui.medApp.global.busyDialog.close();
              } else {
                _this.oView.byId("MessageBox").setVisible(false);
                sessionStorage.setItem("medAppUID", oData.results.USRID);
                sessionStorage.setItem("medAppPWD", oData.results.UERPW);
                _this.oModel.setProperty("/LoggedUser", oData.results);
                if (oData.results.Address !== undefined) {
                  if (oData.results.Address.length) {
                    sessionStorage.LATIT = oData.results.Address[0].LATIT;
                    sessionStorage.LONGT = oData.results.Address[0].LONGT;
                  }
                }

                // Code to register device Id to User
                // *************************************
                var oChar = oData.results.Characteristics;
                var bFound = false;
                if (oChar) {
                  for (c in oChar) {
                    if (oChar[c].CHRID == 12) {
                      bFound = true;
                      if (oChar[c].VALUE != vEngine.RegisteredId) {
                        oChar[c].VALUE = vEngine.RegisteredId;
                        var fnSuccess2 = function() {
                          _this.oView.setBusy(false);
                          $("#medApp--myShell-header-hdr-end").css("display",
                              "block");
                          if (_this.parameter.flagID == 2) {
                            _this._oRouter.navTo("ConfirmBooking", {
                              "UID" : sessionStorage.medAppUID
                            });
                          } else {
                            var fav = _this.handleFovoriteUsers(oData.results);
                            if (fav) {
                              _this._oRouter.navTo('_homeTiles');
                            }
                          }
                        };
                        sap.ui.medApp.global.util.updateUserDetails(fnSuccess2);
                        break;
                      }
                    }
                  }
                } else {
                  oData.results.Characteristics = [];
                  _this.oModel.setProperty("/LoggedUser", oData.results);
                }
                if (!bFound) {
                  oChar.push({
                    "CHRID" : "12",
                    "DESCR" : "Device Registration Id",
                    "LNTXT" : "Device Registration Id",
                    "MDTEXT" : "Device Reg Id",
                    "REGXT" : "regid",
                    "SRTXT" : "Dev Reg Id",
                    "USRID" : oData.results.USRID,
                    "VALUE" : vEngine.RegisteredId.toString()
                  });
                  var fnSuccess3 = function() {
                    if (_this.parameter.flagID == 2) {
                      _this._oRouter.navTo("ConfirmBooking", {
                        "UID" : sessionStorage.medAppUID
                      });
                    } else {
                      var fav = _this.handleFovoriteUsers(oData.results);
                      if (fav) {
                        _this._oRouter.navTo('_homeTiles');
                      }
                    }
                  }
                  sap.ui.medApp.global.util.updateUserDetails(fnSuccess3);
                } else {
                  if (_this.parameter.flagID == 2) {
                    _this._oRouter.navTo("ConfirmBooking", {
                      "UID" : sessionStorage.medAppUID
                    });
                  } else {
                    var fav = _this.handleFovoriteUsers(oData.results);
                    if (fav) {
                      _this._oRouter.navTo('_homeTiles');
                    }
                  }
                }
              }
            };
            /*
             * var fnSuccess = function(oData) { if (!oData.results.USRID) {
             * _this.oView.byId("MessageBox").setVisible(true);
             * _this.oView.byId("MessageBox").setText( "Email/Password is
             * incorrect"); } else {
             * _this.oView.byId("MessageBox").setVisible(false);
             * sessionStorage.setItem("medAppUID", oData.results.USRID);
             * sessionStorage.setItem("medAppPWD", oData.results.UERPW);
             * _this.oModel.setProperty("/LoggedUser", oData.results); if
             * (oData.results.Address !== undefined) { if
             * (oData.results.Address.length) { sessionStorage.LATIT =
             * oData.results.Address[0].LATIT; sessionStorage.LONGT =
             * oData.results.Address[0].LONGT; } } if (_this.parameter.flagID ==
             * 2) { _this._oRouter.navTo("ConfirmBooking", { "UID" :
             * sessionStorage.medAppUID }); } else { var fav =
             * _this.handleFovoriteUsers(oData.results); if (fav) {
             * _this._oRouter.navTo('_homeTiles'); } } }
             * _this.oView.setBusy(false); };
             */
            sap.ui.medApp.global.util.getLoginData(param, fnSuccess);

          },
          handleFovoriteUsers : function(uData) {
            var aUserIds = [];
            if (uData.Characteristics) {
              for (var i = 0; i < uData.Characteristics.length; i++) {
                if (uData.Characteristics[i].CHRID == 11) {
                  aUserIds.push(uData.Characteristics[i].VALUE);
                }
              }
              if (aUserIds.length > 0) {
                this._oRouter.navTo("VendorListDetail", {
                  ENTID : "1",
                  ETYID : "1",
                  ETCID : "1",
                  UID : uData.USRID,
                  FILTER : aUserIds.toString()
                });
                return false;
              }
            }
            return true;
          },
          validateEmail : function(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
          },
          navToBack : function() {
            this._oRouter.myNavBack();
          },
          signupPress : function(oEvent) {
            this._oRouter.navTo("signup", {
              "flagID" : this.parameter.flagID
            });
          },
        /**
         * Similar to onAfterRendering, but this hook is invoked before the
         * controller's View is re-rendered (NOT before the first rendering!
         * onInit() is used for that one!).
         * 
         * @memberOf view.Home
         */
        // onBeforeRendering: function() {
        // },
        /**
         * Called when the View has been rendered (so its HTML is part of the
         * document). Post-rendering manipulations of the HTML could be done
         * here. This hook is the same one that SAPUI5 controls get after being
         * rendered.
         * 
         * @memberOf view.Home
         */
        // onAfterRendering: function() {
        // },
        /**
         * Called when the Controller is destroyed. Use this one to free
         * resources and finalize activities.
         * 
         * @memberOf view.Home
         */
        // onExit: function() {
        // }
        });