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
                  var address;
                  /*
                   * if (!userData.Address.length) { address = { 'USRID' : "",
                   * 'PRIMR' : "", 'STREET' : "", 'LNDMK' : "", 'LOCLT' : "",
                   * 'CTYID' : "", 'CTYNM' : "", 'PINCD' : "", 'LONGT' : "",
                   * 'LATIT' : "" }; userData.Address.push(address); }
                   */
                  this.oModel.setProperty("/LoggedUser", [ userData ]);
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
                    _this.oModel.setProperty("/LoggedUser", [ oData.results ]);
                    _this.oView.setBusy(false);
                  }
                  sap.ui.medApp.global.util.getLoginData(param, fnSuccess);
                }

              }
              this.getView().setModel(this.oModel);
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
          getMobileNumber : function(chrid, value) {
            if (chrid != null && chrid != undefined) {
              if (chrid == 7) {
                return value;
              }
            }
          },
          handleUpdateUser : function() {
            sap.ui.medApp.global.util.userUpdate();
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