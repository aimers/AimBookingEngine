sap.ui.controller("sap.ui.medApp.view.Login", {

  /**
   * Called when a controller is instantiated and its View controls (if
   * available) are already created. Can be used to modify the View before it is
   * displayed, to bind event handlers and do other one-time initialization.
   * 
   * @memberOf view.Home
   */
  onInit : function() {
    // getting Router
    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    this.router = sap.ui.core.UIComponent.getRouterFor(this);

    if (sap.ui.medApp.global.util._mainModel) {
      this.oModel = sap.ui.medApp.global.util._mainModel;
    } else {
      this.oModel = new sap.ui.model.json.JSONModel();
    }
    this.getView().setModel(this.oModel);
    this._oRouter.attachRoutePatternMatched(this._handleRouteMatched, this);
  },
  _handleRouteMatched : function(evt) {
    this.parameter = evt.getParameter("arguments");
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
    var username = this.oView.byId("usrNme").getValue();
    var password = this.oView.byId("pswd").getValue();
    var param = [ {
      "key" : "details",
      "value" : {
        "USRNM" : username,
        "UERPW" : password
      }
    } ];
    var oData = sap.ui.medApp.global.util.getLoginData(param);
    if (!oData.results.USRID) {
      this.oView.byId("MessageBox").setVisible(true);
      this.oView.byId("MessageBox").setText("Email/Password is incorrect");
    } else {
      this.oView.byId("MessageBox").setVisible(false);
      sessionStorage.setItem("medAppUID", oData.results.USRID);
      sessionStorage.setItem("medAppPWD", oData.results.UERPW);
      this.oModel.setProperty("/LoggedUser", oData.results);
      var fav = this.handleFovoriteUsers(oData.results);
      if (fav) {
        if (this.parameter.flagID == 2) {
          this._oRouter.navTo("ConfirmBooking", {
            "UID" : sessionStorage.medAppUID
          });
        } else {
          this._oRouter.navTo('_homeTiles');
        }
      }
    }
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
  handleRegister : function() {
    var _this = this;
    var username = this.oView.byId("usrNme").getValue();
    var param = [ {
      "key" : "details",
      "value" : {
        "USRNM" : username,
        "UTYID" : "2",
        "PRFIX" : "",
        "TITLE" : "",
        "FRNAM" : "",
        "LTNAM" : "",
        "URDOB" : "1900/01/01",
        "GENDR" : "2",
        "DSPNM" : ""
      }
    } ];
    var oData = sap.ui.medApp.global.util.getRegisterData(param);
    if (!oData.results.USRID) {
      this.oView.byId("MessageBox").setVisible(true);
      this.oView.byId("MessageBox").setText("User cannot be registered");
    } else {
      this.oView.byId("MessageBox").setVisible(false);
      sessionStorage.setItem("medAppUID", oData.results.USRID);
      sessionStorage.setItem("medAppPWD", oData.results.UERPW);
      this.oModel.setProperty("/LoggedUser", oData.results);
      if (this.parameter.flagID == 2) {
        this._oRouter.navTo("ConfirmBooking", {
          "UID" : sessionStorage.medAppUID
        });
      } else {
        this._oRouter.navTo('_homeTiles');
      }
    }
  }

/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's
 * View is re-rendered (NOT before the first rendering! onInit() is used for
 * that one!).
 * 
 * @memberOf view.Home
 */
// onBeforeRendering: function() {
// },
/**
 * Called when the View has been rendered (so its HTML is part of the document).
 * Post-rendering manipulations of the HTML could be done here. This hook is the
 * same one that SAPUI5 controls get after being rendered.
 * 
 * @memberOf view.Home
 */
// onAfterRendering: function() {
// },
/**
 * Called when the Controller is destroyed. Use this one to free resources and
 * finalize activities.
 * 
 * @memberOf view.Home
 */
// onExit: function() {
// }
});