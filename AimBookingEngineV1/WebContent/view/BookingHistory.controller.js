sap.ui.controller("sap.ui.medApp.view.BookingHistory", {

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
    this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
  },
  _handleRouteMatched : function(oEvent) {
    var scope = oEvent.getParameter("config").name;
    if (scope === "_history") {
      this.oView.setBusy(true);
      this.oModel = sap.ui.medApp.global.util.getHistoryModel();
      if (sessionStorage.medAppUID != undefined) {
        var _this = this;
        if (_this.oModel.getProperty("/LoggedUser")) {
          _this.getBookingHistory();
        } else {
          var param = [ {
            "key" : "details",
            "value" : {
              "USRID" : sessionStorage.medAppUID,
              "UERPW" : sessionStorage.medAppPWD
            }
          } ];
          var fnSuccess = function(oData) {
            _this.oModel.setProperty("/LoggedUser", oData.results);
            _this.getBookingHistory();
          }
          sap.ui.medApp.global.util.getLoginData(param, fnSuccess);
        }

      } else {
        this.getView().setModel(this.oModel);
        this.oView.setBusy(false);
      }
    }
  },
  getBookingHistory : function() {
    var _this = this;
    var fnSuccess = function(oData) {
      _this.oModel.setProperty("/BookingList", oData.results);
      _this.getView().setModel(_this.oModel);
      _this.oView.setBusy(false);
    }
    sap.ui.medApp.global.util.loadBookingHistory(fnSuccess);
  },
  /*
   * Handle Press Tile
   */
  handleBackButton : function(evt) {
    // open the loading dialog
    this._oRouter.navTo("_homeTiles");
  },
  getMonth : function(monthStr) {
    return new Date(monthStr + '-1-01').getMonth() + 1
  },
  handleCancelBooking : function(oEvent) {
    this.oView.setBusy(true);
    var _this = this;
    var sPath = oEvent.oSource.getBindingContext().getPath();
    var bookingData = this.oModel.getProperty(sPath);
    var fnSuccess = function(oData) {
      _this.getBookingHistory();
      sap.m.MessageToast.show("Booking has been cancelled");
      _this.oView.setBusy(false);
    };
    var fnError = function() {
      sap.m.MessageToast.show("Booking cannot be cancelled");
      _this.oView.setBusy(false);
    }
    sap.ui.medApp.global.util.cancelBooking(bookingData, fnSuccess, fnError);
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