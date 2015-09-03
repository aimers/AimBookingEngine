jQuery.sap.require("jquery.sap.history");
sap.ui
    .controller(
        "sap.ui.medApp.view.App",
        {

          onInit : function() {

            /*
             * For getting user information
             */

            /*
             * if(!this.oLoadingDialog){ this.oLoadingDialog = new
             * sap.m.BusyDialog({text: "Please Wait Data is Loading..."});
             * console.log(this.oLoadingDialog); }
             */
            this.fullWidthApp = new sap.m.App("idAppControl", {
              defaultTransitionName : "slide"
            });

            this.splitApp = new sap.m.SplitApp("idSplitAppControl", {
              mode : "PopoverMode",
              defaultTransitionNameDetail : "slide"
            });

            var bus = sap.ui.getCore().getEventBus();
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.router = sap.ui.core.UIComponent.getRouterFor(this);
            this.router.attachRoutePatternMatched(this._handleRouteMatched,
                this);
            this.oLoadingDialog = sap.ui.getCore().byId("loadingDialog");
            bus.subscribe("nav", "back", this.navHandler, this);
            jQuery(".loader").remove();
          },
          navHandler : function(channelId, eventId, data) {
            if (data && data.id) {
              this.navBack(data.id);
            } else {
              jQuery.sap.history.back();
            }
          },
          _handleRouteMatched : function(oEvent) {
            this.oModel = sap.ui.medApp.global.util.getHomeModel();
            var scope = oEvent.getParameter("config").name;
            var fullWidthRoutes = [ "_homeTiles", "_loginPage", "_Signup",
                "ConfirmBooking", "_history", "_profile" ];
            var bIsFullWidthRoute = (jQuery.inArray(scope, fullWidthRoutes) >= 0);
            var bIsHomeRoute = (scope === "_homeTiles");
            var app = (bIsFullWidthRoute) ? this.fullWidthApp : this.splitApp;
            if (this.getView().byId('myShell').getContent()[0] === undefined
                || this.getView().byId('myShell').getContent()[0].getId() !== app
                    .getId()) {
              this.getView().byId('myShell').removeAllContent();
              this.getView().byId('myShell').addContent(app);
            }

            var that = this;
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
                  if (oData.results.Address !== undefined) {
                    if (oData.results.Address.length) {
                      medApp.global.config.user.Address.LATIT = oData.results.Address[0].LATIT;
                      medApp.global.config.user.Address.LONGT = oData.results.Address[0].LONGT;
                    }
                  }
                  that.getView().byId('myShell').setModel(that.oModel);
                }
                sap.ui.medApp.global.util.getLoginData(param, fnSuccess);
              } else {
                this.getView().byId('myShell').setModel(this.oModel);
              }
            } else {
              this.getView().byId('myShell').setModel(this.oModel);
            }
          },
          onAfterRendering : function() {

          },
          handelHomeBtn : function(evt) {
            this._oRouter.navTo('_homeTiles');
          },

          handleLogin : function(oEvent) {
            this._oRouter.navTo('_loginPage', {
              flagID : 0
            });
          },
          okCallback : function() {
            var oService = new oDataService();
            oService.handleLogout(this);
          },
          settingsSelect : function(oEvent) {
            var oController = this;
            if (!this.oSettingsloginHeaderActionSheet) {
              this.oSettingsloginHeaderActionSheet = new sap.m.ActionSheet({
                placement : sap.m.PlacementType.Bottom,
                buttons : [ new sap.m.Button({
                  icon : "sap-icon://log",
                  text : "Login",
                  tooltip : "Login",
                  press : oController.handleLogin.bind(oController)
                }) ]
              });
            }
            if (!this.oSettingsLogoutHeaderActionSheet) {
              this.oSettingsLogoutHeaderActionSheet = new sap.m.ActionSheet({
                placement : sap.m.PlacementType.Bottom,
                buttons : [ new sap.m.Button({
                  icon : "sap-icon://account",
                  text : "Profile",
                  tooltip : "Profile",
                  press : oController.handleProfile.bind(oController)
                }), new sap.m.Button({
                  icon : "sap-icon://log",
                  text : "Logout",
                  tooltip : "Logout",
                  press : oController.logout.bind(oController)
                }) ]
              });
            }
            if (sessionStorage.medAppUID != undefined
                && sessionStorage.medAppPWD != undefined) {
              this.oSettingsHeaderActionSheet = this.oSettingsLogoutHeaderActionSheet;
            } else {
              this.oSettingsHeaderActionSheet = this.oSettingsloginHeaderActionSheet;
            }

            this.oSettingsHeaderActionSheet.openBy(oEvent.oSource);
          },

          handleProfile : function(evt) {
            this._oRouter.navTo('_profile');
          },
          logout : function(evt) {
            sessionStorage.removeItem("medAppUID");
            sessionStorage.removeItem("medAppPWD");
            this.oModel.setProperty("/LoggedUser", []);
            this._oRouter.navTo('_homeTiles');
          },
          handleHistoryBooking : function() {
            this._oRouter.navTo('_history');
          },
          handleFavorite : function() {
            if (sessionStorage.medAppUID != undefined) {
              var userData = this.oModel.getProperty("/LoggedUser");
              var aUserIds = [];
              if (userData.Characteristics) {
                for (var i = 0; i < userData.Characteristics.length; i++) {
                  if (userData.Characteristics[i].CHRID == 11) {
                    aUserIds.push(userData.Characteristics[i].VALUE);
                  }
                }
                if (aUserIds.length > 0) {
                  this._oRouter.navTo("VendorListDetail", {
                    ENTID : "1",
                    ETYID : "1",
                    ETCID : "1",
                    UID : userData.USRID,
                    FILTER : aUserIds.toString()
                  });
                  return false;
                } else {
                  this._oRouter.navTo('_loginPage', {
                    flagID : 0
                  });
                }
              }
            } else {
              this._oRouter.navTo('_loginPage', {
                flagID : 0
              });
            }
          }
        });