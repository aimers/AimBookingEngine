sap.ui.controller("sap.ui.medApp.view.Login", {

  /**
   * Called when a controller is instantiated and its View controls (if available) are already created.
   * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
   * @memberOf view.Home
   */
  onInit: function() {
    //getting Router
    this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    this.router = sap.ui.core.UIComponent.getRouterFor(this);

    this.oLoadingDialog = sap.ui.getCore().byId("medApp").getController().oLoadingDialog;

    var oModel = new sap.ui.model.json.JSONModel();
    this.getView().setModel(oModel);
  },
  /*
   * Handle Press Tile
   */
  handleSearchKeyword: function(evt){
    //open the loading dialog
    this._oRouter.navTo("_searchVendors", {vendorId : "123"});
    
  }

  /**
   * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
   * (NOT before the first rendering! onInit() is used for that one!).
   * @memberOf view.Home
   */
//onBeforeRendering: function() {

//},

  /**
   * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
   * This hook is the same one that SAPUI5 controls get after being rendered.
   * @memberOf view.Home
   */
//onAfterRendering: function() {

//},

  /**
   * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
   * @memberOf view.Home
   */
//onExit: function() {

//}

});