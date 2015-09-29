sap.ui
    .controller(
        "sap.ui.medApp.view.ForgotPassword",
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
            sap.ui.medApp.global.busyDialog.open();
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
            sap.ui.medApp.global.busyDialog.close();
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
            this._oRouter.navTo("_loginPage", {
              "flagID" : this.parameter.flagID
            });
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
          handleForgotPassword : function(oEvent) {
            sap.ui.medApp.global.busyDialog.open();
            if (this._validateInputs()) {
              var _this = this;
              var username = this.oView.byId("usrNme").getValue();
              var paswd = _this.oView.byId("pswd").getValue();
              var confmpaswd = _this.oView.byId("cnfmpswd").getValue();
              var param = [ {
                "key" : "details",
                "value" : {
                  "USRNM" : username.toString(),
                  "UERPW" : paswd.toString()
                }
              } ];
              var fnSuccess = function(oData) {
                sap.ui.medApp.global.busyDialog.close();
                if (oData.results) {
                  _this.oView.getModel().setProperty("/SuccessMessage", {
                    msg : "Your password has been changed"
                  });
                  _this._oRouter.navTo('_loginPage', {
                    flagID : _this.parameter.flagID
                  });
                }
              }
              sap.ui.medApp.global.util.updatePassword(param, fnSuccess);
            } else {
              sap.ui.medApp.global.busyDialog.close();
            }
          },
          _validateInputs : function() {
            var regxRequired = /([^\s])/;
            var email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            var mobile = /^[0-9]{10}$/;
            var oView = this.getView();

            var oUsrNm = oView.byId("usrNme");
            var oPswd = oView.byId("pswd");
            var oCpwd = oView.byId("cnfmpswd");
            var invalidInputs = false;
            if (!mobile.test(oUsrNm.getValue().toString())) {
              invalidInputs = true;
              oUsrNm.setValueState(sap.ui.core.ValueState.Error);
            } else {
              oUsrNm.setValueState(sap.ui.core.ValueState.None);
            }
            // } else {
            // oUsrNm1.setValueState(sap.ui.core.ValueState.None);
            // }
            // Password
            if (!regxRequired.test(oPswd.getValue().toString())) {
              invalidInputs = true;
              oPswd.setValueState(sap.ui.core.ValueState.Error);
            } else {
              oPswd.setValueState(sap.ui.core.ValueState.None);
            }
            // Confirm password
            if (!regxRequired.test(oCpwd.getValue().toString())) {
              invalidInputs = true;
              oCpwd.setValueState(sap.ui.core.ValueState.Error);
            } else {
              oCpwd.setValueState(sap.ui.core.ValueState.None);
            }
            if (oPswd.getValue() && oCpwd.getValue()) {
              // Password Match
              if (oPswd.getValue().toString() != oCpwd.getValue().toString()) {
                invalidInputs = true;
                oPswd.setValueState(sap.ui.core.ValueState.Error);
                oCpwd.setValueState(sap.ui.core.ValueState.Error);
              } else {
                oPswd.setValueState(sap.ui.core.ValueState.None);
                oCpwd.setValueState(sap.ui.core.ValueState.None);
              }
            }
            return !invalidInputs;
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