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
          updateProfileData : function(userDataNEW) {

            if (!userDataNEW.Address) {
              userDataNEW.Address = [];
              var address = {
                'USRID' : "",
                'PRIMR' : "",
                'STREET' : "",
                'LNDMK' : "",
                'LOCLT' : "",
                'CTYID' : "",
                'CTYNM' : "",
                'PINCD' : "",
                'LONGT' : 0.8,
                'LATIT' : 0.8
              };
              userDataNEW.Address.push(address);
            } else {
              if (!userDataNEW.Address.length) {
                var address = {
                  'USRID' : "",
                  'PRIMR' : "",
                  'STREET' : "",
                  'LNDMK' : "",
                  'LOCLT' : "",
                  'CTYID' : "",
                  'CTYNM' : "",
                  'PINCD' : "",
                  'LONGT' : 0.8,
                  'LATIT' : 0.8
                };
                userDataNEW.Address.push(address);
              }
            }
            var userData = userDataNEW;
            if (userData.Characteristics) {
              var flagcharPhone = false;
              var flagcharBEmail = false;
              var flagcharPEmail = false;
              for (var i = 0; i < userData.Characteristics.length; i++) {
                if (userData.Characteristics[i].CHRID == 6) {
                  flagcharPhone = true;
                  userData.Phone = userData.Characteristics[i].VALUE;
                }
                if (userData.Characteristics[i].CHRID == 5) {
                  flagcharBEmail = true;
                  userData.BEmail = userData.Characteristics[i].VALUE;
                }
                if (userData.Characteristics[i].CHRID == 4) {
                  flagcharPEmail = true;
                  userData.PEmail = userData.Characteristics[i].VALUE;
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
                userDataNEW.Characteristics.push(phoneData);
                userData.Phone = "";
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
                userDataNEW.Characteristics.push(phoneData);
                userData.BEmail = "";
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
                userDataNEW.Characteristics.push(phoneData);
                userData.PEmail = "";
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
            var userDataOriginal = this.oModel.getProperty("/LoggedUser");
            var oSelectedGndr = this.oView.byId("userGendr").getSelectedIndex();
            if (oSelectedGndr) {
              userDataOriginal.GENDR = 2;
            } else {
              userDataOriginal.GENDR = 1;
            }
            for (var i = 0; i < userDataOriginal.Characteristics.length; i++) {
              if (userDataOriginal.Characteristics[i].CHRID == 6) {
                userDataOriginal.Characteristics[i].VALUE = userData[0].Phone;
              }
              if (userDataOriginal.Characteristics[i].CHRID == 5) {
                userDataOriginal.Characteristics[i].VALUE = userData[0].BEmail;
              }
              if (userDataOriginal.Characteristics[i].CHRID == 4) {
                userDataOriginal.Characteristics[i].VALUE = userData[0].PEmail;
              }
            }
            sap.ui.medApp.global.util.userUpdate(userDataOriginal);
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