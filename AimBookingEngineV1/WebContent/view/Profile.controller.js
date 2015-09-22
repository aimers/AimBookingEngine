sap.ui
    .controller(
        "sap.ui.medApp.view.Profile",
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
            if (evt.getParameter("name") === "_profile") {
              this.oModel = sap.ui.medApp.global.util.getMainModel();
              if (sessionStorage.medAppUID != undefined) {
                var _this = this;
                if (_this.oModel.getProperty("/LoggedUser")) {
                  var userData = this.oModel.getProperty("/LoggedUser");
                  userData = _this.updateProfileData(userData);
                  this.oModel.setProperty("/LoggedUserProfile", [ userData ]);
                  this.oView.setBusy(false);
                } else {
                  var param = [ {
                    "key" : "details",
                    "value" : {
                      "USRID" : sessionStorage.medAppUID,
                      "UERPW" : sessionStorage.medAppPWD
                    }
                  } ];
                  var fnSuccess = function(oData) {
                    var userData = _this.updateProfileData(oData.results);
                    _this.oModel
                        .setProperty("/LoggedUserProfile", [ userData ]);
                    _this.oModel.setProperty("/LoggedUser", userData);
                    _this.oView.setBusy(false);
                  }
                  sap.ui.medApp.global.util.getLoginData(param, fnSuccess);
                }

              }
              sap.ui.medApp.global.busyDialog.close();
              this.getView().setModel(this.oModel);
            }
          },
          updateProfileData : function(userData) {
            var address;

            if (!userData.Address) {
              userData.Address = [];
              address = {
                'USRID' : "",
                'PRIMR' : "",
                'STREET' : "",
                'LNDMK' : "",
                'LOCLT' : "",
                'CTYID' : "",
                'CTYNM' : "",
                'PINCD' : "",
                'LONGT' : "",
                'LATIT' : ""
              };
              userData.Address.push(address);
            } else {
              if (!userData.Address.length) {
                address = {
                  'USRID' : "",
                  'PRIMR' : "",
                  'STREET' : "",
                  'LNDMK' : "",
                  'LOCLT' : "",
                  'CTYID' : "",
                  'CTYNM' : "",
                  'PINCD' : "",
                  'LONGT' : "",
                  'LATIT' : ""
                };
                userData.Address.push(address);
              }
            }

            if (userData.Characteristics) {
              var flagcharPhone = false;
              var flagcharBEmail = false;
              var flagcharPEmail = false;
              for (var i = 0; i < userData.Characteristics.length; i++) {
                if (userData.Characteristics[i].CHRID == 6) {
                  flagcharPhone = true;
                }
                if (userData.Characteristics[i].CHRID == 5) {
                  flagcharBEmail = true;
                }
                if (userData.Characteristics[i].CHRID == 4) {
                  flagcharPEmail = true;
                }
              }
              if (!flagcharPhone) {
                var phoneData = {
                  "REGXT" : "phone",
                  "SRTXT" : "Phone",
                  "CHRID" : 6,
                  "USRID" : userData.USRID,
                  "VALUE" : "",
                  "LNTXT" : "Landline",
                  "MDTEXT" : "Landline",
                  "DESCR" : "Landline"
                }
                userData.Characteristics.push(phoneData);
              }
              if (!flagcharBEmail) {
                var phoneData = {
                  "REGXT" : "email",
                  "SRTXT" : "email",
                  "CHRID" : 5,
                  "USRID" : userData.USRID,
                  "VALUE" : "",
                  "LNTXT" : "Business Email",
                  "MDTEXT" : "Business Email",
                  "DESCR" : "Business Email"
                }
                userData.Characteristics.push(phoneData);
              }
              if (!flagcharPEmail) {
                var phoneData = {
                  "REGXT" : "email",
                  "SRTXT" : "email",
                  "CHRID" : 4,
                  "USRID" : userData.USRID,
                  "VALUE" : "",
                  "LNTXT" : "Personal Email",
                  "MDTEXT" : "Personal Email",
                  "DESCR" : "Personal Email"
                }
                userData.Characteristics.push(phoneData);
              }
            }
            return userData;
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

          validateEmail : function(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
          },
          navToBack : function() {
            this._oRouter.myNavBack();
          },
          handlePhoneNumber : function(chrid) {
            if (chrid == 6) {
              return true;
            } else {
              return false;
            }
          },
          getPhoneNumber : function(chrid, value) {
            if (chrid != null && chrid != undefined) {
              if (chrid == 6) {
                return value;
              }
            }
          },
          handleMobileNumber : function(chrid) {
            if (chrid == 7) {
              return true;
            } else {
              return false;
            }
          },
          handleBEmail : function(chrid) {
            if (chrid == 5) {
              return true;
            } else {
              return false;
            }
          },
          handlePEmail : function(chrid) {
            if (chrid == 4) {
              return true;
            } else {
              return false;
            }
          },
          getBEmail : function(chrid, value) {
            if (chrid != null && chrid != undefined) {
              if (chrid == 5) {
                return value;
              }
            }
          },
          getPEmail : function(chrid, value) {
            if (chrid != null && chrid != undefined) {
              if (chrid == 4) {
                return value;
              }
            }
          },
          handleUpdateUser : function() {
            var userData = this.oModel.getProperty("/LoggedUserProfile");
            var oSelectedGndr = this.oView.byId("userGendr").getSelectedIndex();
            if (oSelectedGndr) {
              userData[0].GENDR = false;
            } else {
              userData[0].GENDR = true;
            }
            for (var i = 0; i < userData[0].Characteristics.length; i++) {
              if (userData[0].Characteristics[i].CHRID == 6) {
                userData[0].Characteristics[i].VALUE = this.oView.byId(
                    "phoneNUmber").getValue();
              }
              if (userData[0].Characteristics[i].CHRID == 5) {
                userData[0].Characteristics[i].VALUE = this.oView.byId(
                    "BusinessEmail").getValue();
              }
              if (userData[0].Characteristics[i].CHRID == 4) {
                userData[0].Characteristics[i].VALUE = this.oView.byId(
                    "PersonalEmail").getValue();
              }
            }
            sap.ui.medApp.global.util.userUpdate(userData);
          },
          setGender : function(oEvent) {

            var selectedIndex = oEvent.oSource.getSelectedIndex();
            this.oView.byId("userGendr").setSelectedIndex(selectedIndex);
          }
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