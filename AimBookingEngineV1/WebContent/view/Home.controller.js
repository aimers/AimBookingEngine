jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.controller("sap.ui.medApp.view.Home", {

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
    this.oModel = sap.ui.medApp.global.util.getMainModel();
    this.getView().setModel(this.oModel);
    this._getTileIcons();
  },
  _getTileIcons : function() {
    var vendorData = this.oModel.getProperty("/vendorsCategory");
    var tileVendorData = [];
    for (var i = 0; i < vendorData.length; i++) {
      var flag = false;
      if (vendorData[i].Characteristics.length) {
        for (var k = 0; k < vendorData[i].Characteristics.length; k++) {
          if (vendorData[i].Characteristics[k].CHRID == 9
              && vendorData[i].Characteristics[k].VALUE == "1") {
            flag = true
          }
        }
        for (var k = 0; k < vendorData[i].Characteristics.length; k++) {
          if (vendorData[i].Characteristics[k].CHRID == 10 && flag) {
            tileVendorData[tileVendorData.length] = {
              "SICON" : vendorData[i].Characteristics[k].VALUE,
              "DESCR" : vendorData[i].DESCR,
              "ENTID" : vendorData[i].ENTID
            };
          }
        }
      }
    }
    this.oModel.setProperty("/vendorsTileCategory", tileVendorData);
  },
  getVendorList : function(evt) {
    this._oRouter.navTo("VendorListDetail", {
      entityId : evt.oSource.getUseMap()
    });
  },
  /*
   * Handle Press Tile
   */
  handleSearchKeyword : function(evt) {
    // open the loading dialog
    var searchBar = this.oView.byId("homeSearchBar");
    var keys = searchBar.getSelectedKeys().join();
    this._oRouter.navTo("VendorListDetail", {
      ENTID : keys,
      ETYID : "1",
      ETCID : "1",
      UID : "1"
    });

  },
  /*
   * handleSelectionChange : function(oEvent) { var selectedItems =
   * oEvent.getParameter("selectedItems"); for (var i = 0; i <
   * selectedItems.length; i++) { messageText += "'" +
   * selectedItems[i].getText() + "'"; if (i != selectedItems.length - 1) {
   * messageText += ","; } } },
   */

  handleSearchVendor : function() {

    var selectedItems = oEvent.getParameter("selectedItems");
    for (var i = 0; i < selectedItems.length; i++) {
      messageText += "'" + selectedItems[i].getText() + "'";
      if (i != selectedItems.length - 1) {
        messageText += ",";
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