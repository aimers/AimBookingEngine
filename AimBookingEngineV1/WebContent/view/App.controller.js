sap.ui.controller("sap.ui.medApp.view.App", {

  onInit : function() {

    /*
     * For getting user information
     */
    var oModel = new sap.ui.model.json.JSONModel();

    /*
     * if(!this.oLoadingDialog){ this.oLoadingDialog = new
     * sap.m.BusyDialog({text: "Please Wait Data is Loading..."});
     * console.log(this.oLoadingDialog); }
     */
    this.fullWidthApp = new sap.m.App("idAppControl", {
      defaultTransitionName : "slide"
    });

    this.splitApp = new sap.m.SplitApp("idSplitAppControl", {
      mode : "ShowHideMode",
      defaultTransitionNameDetail : "slide"
    });
    this.getView().byId('myShell').setModel(oModel);

    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    this.router = sap.ui.core.UIComponent.getRouterFor(this);
    this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
    this.oLoadingDialog = sap.ui.getCore().byId("loadingDialog");

  },
  _handleRouteMatched : function(oEvent) {

    var scope = oEvent.getParameter("config").name;
    var fullWidthRoutes = [ "_homeTiles", "_loginPage", "_Signup",
        "ConfirmBooking" ];
    var bIsFullWidthRoute = (jQuery.inArray(scope, fullWidthRoutes) >= 0);
    var bIsHomeRoute = (scope === "_homeTiles");
    var app = (bIsFullWidthRoute) ? this.fullWidthApp : this.splitApp;
    if (this.getView().byId('myShell').getContent()[0] === undefined
        || this.getView().byId('myShell').getContent()[0].getId() !== app
            .getId()) {
      this.getView().byId('myShell').removeAllContent();
      this.getView().byId('myShell').addContent(app);
    }
  },
  onAfterRendering : function() {

  },
  handelHomeBtn : function(evt) {
    this._oRouter.navTo('_homeTiles');
  },

  handleLogin : function(oEvent) {
    this._oRouter.navTo('_loginPage');
  },
  okCallback : function() {
    var oService = new oDataService();
    oService.handleLogout(this);
  },
});