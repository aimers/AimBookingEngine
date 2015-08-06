jQuery.sap.declare("sap.ui.medApp.global.util");
jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.medApp.global.util = {
  getMainModel : function() {
    if (!this._mainModel) {
      this._mainModel = new sap.ui.model.json.JSONModel();
      this.loadListCategory();
    }

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
    if (!this._vendorModel) {
      this._vendorModel = new sap.ui.model.json.JSONModel();
      this.loadVendorData(paramValue);
    }

    return this._vendorModel;
  },
  loadVendorData : function(paramValue) {
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._vendorModel);
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
  handleBooking : function(oEvent, oModel, oRouter) {
    var sTime = oEvent.oSource.getText();
    var sContextPath = oEvent.oSource.oParent.getBindingContext().getPath();
    var modelData = oModel.getProperty(sContextPath);
    var sDate = modelData.Date;
    if (!sessionStorage.medAppUID) {
      oRouter.navTo("_loginPage", {
        "flagID" : 2
      });
    }
    console.log(oEvent);
  }
}
