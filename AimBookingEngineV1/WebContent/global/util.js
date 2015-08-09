jQuery.sap.declare("sap.ui.medApp.global.util");
jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.medApp.global.util = {
  getHomeModel : function(_oRouter) {
    if (!this._mainModel) {
      this._mainModel = new sap.ui.model.json.JSONModel();
      if (sessionStorage.medAppUID != undefined
          && sessionStorage.medAppPWD != undefined) {
        var param = [ {
          "key" : "details",
          "value" : {
            "USRID" : sessionStorage.medAppUID,
            "UERPW" : sessionStorage.medAppPWD
          }
        } ];
        var oData = this.getLoginData(param);
        this._mainModel.setProperty("/LoggedUser", oData.results);
      }

    }
    return this._mainModel;
  },
  getMainModel : function() {
    if (!this._mainModel) {
      this._mainModel = this.getHomeModel();
    }
    this.loadListCategory();
    return this._mainModel;
  },
  loadListCategory : function(facade) {
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    param = [ {
      "key" : "INTENT",
      "value" : "1"
    }, {
      "key" : "UID",
      "value" : "1"
    } ]
    this._vendorListServiceFacade.getRecords(null, null, "/vendorsCategory",
        "getVendorCategory", param);

  },
  getVendorModel : function(paramValue) {
    if (!this._mainModel) {
      this._mainModel = this.getHomeModel();
    }
    this.loadVendorData(paramValue);
    return this._mainModel;
  },
  loadVendorData : function(paramValue) {
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    var param = [ {
      "key" : "INTENT",
      "value" : "1"
    }, {
      "key" : "UID",
      "value" : paramValue.UID
    }, {
      "key" : "ETCID",
      "value" : paramValue.ETCID
    }, {
      "key" : "ETYID",
      "value" : paramValue.ETYID
    }, {
      "key" : "ENTID",
      "value" : paramValue.ENTID
    } ]
    this._vendorListServiceFacade.getRecords(null, null, "/vendorsList",
        "getVendorData", param);

  },
  distance : function(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1)
        * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
      dist = dist * 1.609344
    }
    if (unit == "N") {
      dist = dist * 0.8684
    }
    return dist
  },
  handleBooking : function(oEvent, oRouter) {
    var sTime = oEvent.oSource.getText();
    var sContextPath = oEvent.oSource.oParent.getBindingContext().getPath();
    var vendorIndexPath;
    var modelData = this._mainModel.getProperty(sContextPath);
    if (sContextPath == "/vendorsAvailableTime/0") {
      vendorIndexPath = modelData.SPATH;
    } else {
      var modelData1 = this._mainModel.getProperty("/vendorsAvailableTime/0");
      vendorIndexPath = modelData1.SPATH;
    }
    var vendordata = this._mainModel.getProperty(vendorIndexPath);
    var sDate = modelData.Date;
    var BookingData = [ {
      bookTime : sTime,
      bookDate : sDate,
      IPATH : vendorIndexPath,
      DSPNM : vendordata.DSPNM
    } ];
    this._mainModel.setProperty("/bookingdata", BookingData);
    if (!sessionStorage.medAppUID) {
      oRouter.navTo("_loginPage", {
        "flagID" : 2
      });
    } else {
      oRouter.navTo("ConfirmBooking", {
        "UID" : sessionStorage.medAppUID
      });
    }
  },
  getLoginData : function(param, args) {
    // var _oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
    var _this = this;
    var bool;
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    var fnSuccess = function(oData) {
      bool = oData;
    };
    this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
        "loginUser");
    return bool;
  }
}
