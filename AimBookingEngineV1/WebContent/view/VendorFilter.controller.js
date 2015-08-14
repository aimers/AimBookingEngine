sap.ui.controller("sap.ui.medApp.view.VendorFilter", {

  /**
   * Called when a controller is instantiated and its View controls (if
   * available) are already created. Can be used to modify the View before it is
   * displayed, to bind event handlers and do other one-time initialization.
   * 
   * @memberOf ea.Landing
   */
  onInit : function() {
    this.router = sap.ui.core.UIComponent.getRouterFor(this);
    this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
  },

  _handleRouteMatched : function(evt) {
    this.paramValue = evt.getParameter("arguments");

    this.oModel = sap.ui.medApp.global.util.getMainModel();
    if (this.paramValue.ENTID !== undefined) {
      var selectedKeys = this.paramValue.ENTID.split(",");
      for (var i = 0; i < selectedKeys.length; i++) {
        selectedKeys[0] = parseInt(selectedKeys[0]);
      }
      var vendorCat = this.oModel.getProperty("/vendorsCategory");
      for (var i = 0; i < vendorCat.length; i++) {
        if (jQuery.inArray(vendorCat[i].ENTID, selectedKeys) != -1) {
          vendorCat[i].selected = true;
        } else {
          vendorCat[i].selected = false;
        }
      }
      this.oModel.setProperty("/vendorsCategory", vendorCat);
      this.oView.setModel(this.oModel);
    }
  },

  /**
   * Similar to onAfterRendering, but this hook is invoked before the
   * controller's View is re-rendered (NOT before the first rendering! onInit()
   * is used for that one!).
   * 
   * @memberOf ea.Landing
   */
  // onBeforeRendering: function() {
  // },
  /**
   * Called when the View has been rendered (so its HTML is part of the
   * document). Post-rendering manipulations of the HTML could be done here.
   * This hook is the same one that SAPUI5 controls get after being rendered.
   * 
   * @memberOf ea.Landing
   */
  // onAfterRendering: function() {
  // },
  /**
   * Called when the Controller is destroyed. Use this one to free resources and
   * finalize activities.
   * 
   * @memberOf ea.Landing
   */
  // onExit: function() {
  // }
  handleFilter : function(oEvent) {
    this.router.navTo("VendorListDetail", {
      ETYID : this.paramValue.ETYID,
      UID : this.paramValue.UID,
      ENTID : this.paramValue.ENTID,
      ETCID : this.paramValue.ETCID,
      FILTER : this.paramValue.FILTER
    });
  },
  onSearch : function(oEvt) {

    // add filter for search
    var aFilters = [];
    var sQuery = oEvt.getSource().getValue();
    if (sQuery && sQuery.length > 0) {
      var filter = new sap.ui.model.Filter("DESCR",
          sap.ui.model.FilterOperator.Contains, sQuery);
      aFilters.push(filter);
    }

    // update list binding
    var list = this.getView().byId("idList");
    var binding = list.getBinding("items");
    binding.filter(aFilters, "Application");
  },

});