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
    this.oView.setBusy(true);
  },

  _handleRouteMatched : function(evt) {
    this.paramValue = evt.getParameter("arguments");
    this.oModel = sap.ui.medApp.global.util.getMainModel();
    var _this = this;
    if (this.paramValue.ENTID !== undefined) {
      var selectedKeys = this.paramValue.ENTID.split(",");
      for (var i = 0; i < selectedKeys.length; i++) {
        selectedKeys[i] = parseInt(selectedKeys[i]);
      }
      var vendorCat = this.oModel.getProperty("/vendorsCategory");
      if (vendorCat == undefined) {
        var fnSuccess = function(oData) {
          // do what you need here
          vendorCat = oData.results;
          for (var i = 0; i < vendorCat.length; i++) {
            if (jQuery.inArray(vendorCat[i].ENTID, selectedKeys) != -1) {
              vendorCat[i].selected = true;
            } else {
              vendorCat[i].selected = false;
            }
          }
          _this.oModel.setProperty("/vendorsCategory", vendorCat);
          _this.oView.setBusy(false);
        }
        sap.ui.medApp.global.util.loadListCategory(fnSuccess);
      } else {
        for (var i = 0; i < vendorCat.length; i++) {
          if (jQuery.inArray(vendorCat[i].ENTID, selectedKeys) != -1) {
            vendorCat[i].selected = true;
          } else {
            vendorCat[i].selected = false;
          }
        }
        _this.oModel.setProperty("/vendorsCategory", vendorCat);
      }
      if (!this.oModel.getProperty("/filterDays")) {
        var filterDays = [ {
          "day" : "Mon",
          "selected" : true
        }, {
          "day" : "Tue",
          "selected" : true
        }, {
          "day" : "Wed",
          "selected" : true
        }, {
          "day" : "Thu",
          "selected" : true
        }, {
          "day" : "Fri",
          "selected" : true
        }, {
          "day" : "Sat",
          "selected" : true
        }, {
          "day" : "Sun",
          "selected" : true
        } ];
        this.oModel.setProperty("/filterDays", filterDays);
      }
      if (!this.oModel.getProperty("/filterTime")) {
        var filterTime = [ {
          "startTime" : 0,
          "endTime" : 1440
        } ];
        this.oModel.setProperty("/filterTime", filterTime);
      }
      this.oView.setModel(this.oModel);
      this.oView.setBusy(false);
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
    var vendorCat = this.oModel.getProperty("/vendorsCategory");
    var selectedKeys = [];
    for (var i = 0; i < vendorCat.length; i++) {
      if (vendorCat[i].selected) {
        selectedKeys.push(vendorCat[i].ENTID);
      }
    }
    this.router.navTo("VendorListDetail", {
      ETYID : selectedKeys.join(),
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
  handleDayChange : function(oEvent) {
    var oMessage = sap.ui.medApp.global.util.showMessage();
    oMessage
        .show("Please click again on Book Appointment to see filtered list");
  }
});