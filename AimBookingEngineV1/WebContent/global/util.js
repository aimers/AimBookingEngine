jQuery.sap.declare("sap.ui.medApp.global.util");
jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui.medApp.global.util = {
  getHomeModel : function(_oRouter) {
    var that = this;
    if (!this._mainModel) {
      this._mainModel = new sap.ui.model.json.JSONModel();
    }
    return this._mainModel;
  },
  getMainModel : function() {
    if (!this._mainModel) {
      this._mainModel = this.getHomeModel();
    }
    // this.loadListCategory();
    // this.loadAddress();
    return this._mainModel;
  },
  loadListCategory : function(fnSuccess) {
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    param = [ {
      "key" : "INTENT",
      "value" : "1"
    }, {
      "key" : "UID",
      "value" : "1"
    } ]
    this._vendorListServiceFacade.getRecords(fnSuccess, null,
        "/vendorsCategory", "getVendorCategory", param);
  },
  loadAddress : function(fnSuccess) {
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    param = [];
    this._vendorListServiceFacade.getRecords(fnSuccess, null,
        "/vendorsAddress", "getUniqueAddress", param);

  },
  getVendorModel : function(paramValue) {
    if (!this._mainModel) {
      this._mainModel = this.getHomeModel();
    }
    // this.loadVendorData(paramValue);
    return this._mainModel;
  },
  getVendorFilterModel : function(paramValue) {
    if (!this._mainModel) {
      this._mainModel = this.getHomeModel();
    }
    this.loadVendorFILTERData(paramValue);
    return this._mainModel;
  },
  loadVendorData : function(paramValue, fnSuccess) {
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
    this._vendorListServiceFacade.getRecords(fnSuccess, null, "/vendorsList",
        "getVendorData", param);

  },
  loadVendorFILTERData : function(paramValue, fnSuccess) {
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
    }, {
      "key" : "filters",
      "value" : '{"USRID" = "' + paramValue.FILTER + '"}'
    } ]
    this._vendorListServiceFacade.getRecords(fnSuccess, null, "/vendorsList",
        "getVendorData", param);

  },
  getHistoryModel : function(paramValue) {
    var that = this;
    if (!this._mainModel) {
      this._mainModel = this.getHomeModel();
    }
    return this._mainModel;
  },
  loadBookingHistory : function(fnSuccess) {
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    var userData = this._mainModel.getProperty("/LoggedUser");
    var param = [ {
      "key" : "details",
      "value" : {
        "CUSID" : userData.USRID,
        "CUTID" : userData.UTYID
      }
    } ];
    this._vendorListServiceFacade.getRecords(fnSuccess, null, "/BookingList",
        "getBookingHistory", param);
  },
  distance : function(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * Number(sessionStorage.LATIT) / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * Number(sessionStorage.LONGT) / 180
    var theta = lon1 - Number(sessionStorage.LONGT)
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
  handleBooking : function(_source, oRouter, oRuleSelected) {
    var timedata = this._mainModel.getProperty(_source.getBindingContext()
        .getPath());
    var sTime = timedata.START + "-" + timedata.END;
    var sContextPath = _source.oParent.getBindingContext().getPath();
    var vendorIndexPath;
    var modelData = this._mainModel.getProperty(sContextPath);
    var vendorIndexPath = "/" + sContextPath.split("/")[1] + "/"
        + sContextPath.split("/")[2];
    var vendordata = this._mainModel.getProperty(vendorIndexPath);
    var sDate = modelData.Date;
    var BookingData = [ {
      bookTime : sTime,
      bookDate : sDate,
      IPATH : vendorIndexPath,
      DSPNM : vendordata.DSPNM,
      RULEID : oRuleSelected
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
  getLoginData : function(param, fnSuccess) {
    // var _oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
    var _this = this;
    var bool;
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
        "loginUser");
  },
  getRegisterData : function(param, fnSuccess) {
    // var _oRouter = sap.ui.core.UIComponent.getRouterFor(_this);
    var _this = this;
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
        "registerUser");
  },
  setFavorite : function(userId, fnSuccess) {
    var value = -1;
    var oData;
    var bool;
    var chars;
    var userData = this._mainModel.getProperty("/LoggedUser");
    if (userData.Characteristics == undefined) {
      chars = [];
    } else {
      chars = userData.Characteristics;
    }

    for (var i = 0; i < chars.length; i++) {
      if (chars[i].CHRID == 11) {
        if (chars[i].VALUE == userId) {
          value = i;
        }
      }
    }
    if (value >= 0) {
      delete userData.Characteristics.splice(value, 1);
      bool = false;

    } else {
      bool = true;
      oData = {
        CHRID : 11,
        DESCR : "Fav Char",
        LNTXT : "fav char",
        MDTEXT : "fav char",
        REGXT : "uid",
        SRTXT : "uid",
        USRID : userData.USRID,
        VALUE : userId
      }
      userData.Characteristics.push(oData);
    }
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    var param = [ {
      "key" : "details",
      "value" : userData
    } ];
    this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
        "updateUser");
  },
  userUpdate : function(userData) {

    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    var param = [ {
      "key" : "details",
      "value" : userData
    } ];

    var fnSuccess = function(oData) {
      if (typeof oData.results == "object") {
        sap.m.MessageToast.show("User Data updated");
      }
    };
    fnError = function() {
      sap.m.MessageToast.show("Improper Data entered");
    }
    this._vendorListServiceFacade.updateParameters(param, fnSuccess, fnError,
        "updateUser");
  },
  updateUserDetails : function(fnSuccess) {

    // this._mainModel.setProperty("/vendorsList/0/Entities", this._mainModel
    // .getProperty("/vendorsCategory"));

    var userData = this._mainModel.getProperty("/LoggedUser");

    param = [ {
      "key" : "details",
      "value" : userData
    } ];
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    this._vendorListServiceFacade.updateParameters(param, fnSuccess, null,
        "updateUser");
  },
  cancelBooking : function(boomingData, fnSuccess, fnError) {
    if (!this._vendorListServiceFacade) {
      this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
          this._mainModel);
    }
    var param = [ {
      "key" : "details",
      "value" : {
        "VTRMI" : boomingData.VTRMI,
        "RULID" : boomingData.RULID.toString(),
        "USRID" : boomingData.USRID,
        "BDTIM" : boomingData.BDTIM,
        "BTIMZ" : boomingData.BTIMZ,
        "BOSTM" : boomingData.BOSTM,
        "BOETM" : boomingData.BOETM,
        "CUEML" : boomingData.USRNM,
        "VSEML" : boomingData.VERNM,
      }
    } ];
    this._vendorListServiceFacade.updateParameters(param, fnSuccess, fnError,
        "cancelBooking");
  },
  showMessage : function(oEvent) {
    if (!this.MessageToast) {
      this.MessageToast = sap.m.MessageToast;
    }
    return this.MessageToast;
  },
  getCorrectTime : function(oValue) {
    if (oValue != null && oValue != undefined) {
      var splitValue = oValue.split(":");
      if (sap.ui.medApp.global.util._mainModel.getProperty("/filterTime")) {
        var time = sap.ui.medApp.global.util._mainModel
            .getProperty("/filterTime");
        var starttime = parseInt(time[0].startTime / 60);
        if (starttime <= parseInt(splitValue[0])) {
          return splitValue[0] + ":" + splitValue[1];
        }
      } else {
        return splitValue[0] + ":" + splitValue[1];
      }
    }
  },
  getDateLabel : function(oValue) {
    if (oValue != null && oValue != undefined) {
      var splitValue = oValue.split(" ");
      return splitValue[0] + " " + splitValue[1] + " " + splitValue[2];
    }
  },
  handleFilterDays : function(oValue) {
    if (oValue != null && oValue != undefined) {
      var splitValue = oValue.split(" ");
      if (sap.ui.medApp.global.util._mainModel.getProperty("/filterDays")) {
        var days = sap.ui.medApp.global.util._mainModel
            .getProperty("/filterDays");
        for (var i = 0; i < days.length; i++) {
          if (days[i].day == splitValue[0]) {
            return days[i].selected;
          }
        }
      }
      return splitValue[0] + " " + splitValue[1] + " " + splitValue[2];
    }
  },
  getTimeSlot : function(results) {

    for (var j = 0; j < results.length; j++) {
      if (results[j].TimeSlots) {
        var TimesSlots = results[j].TimeSlots;
        var morningSlots = [];
        var AfternoonSlots = [];
        var eveningSlots = [];
        var nightSlots = [];
        for (var i = 0; i < TimesSlots.length; i++) {
          if (TimesSlots[i].START.split(":")[0] < 12
              && TimesSlots[i].START.split(":")[0] > 3) {
            morningSlots.push(TimesSlots[i]);
          } else if (TimesSlots[i].START.split(":")[0] < 16
              && TimesSlots[i].START.split(":")[0] > 12) {
            AfternoonSlots.push(TimesSlots[i]);
          } else if (TimesSlots[i].START.split(":")[0] > 16
              && TimesSlots[i].START.split(":")[0] < 20) {
            eveningSlots.push(TimesSlots[i]);
          } else if ((TimesSlots[i].START.split(":")[0] < 24 && TimesSlots[i].START
              .split(":")[0] > 20)
              || (TimesSlots[i].START.split(":")[0] < 3 && TimesSlots[i].START
                  .split(":")[0] >= 0)) {
            nightSlots.push(TimesSlots[i]);
          }
        }
        results[j].TimeSlotsMorning = morningSlots;
        results[j].TimeSlotsAfterNoon = AfternoonSlots;
        results[j].TimeSlotsEvening = eveningSlots;
        results[j].TimeSlotsNight = nightSlots;
      }
    }

    return results;
  },
  getAllCities : function(fnSuccess) {
    var param = [ {} ];
    this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
        this._mainModel);
    this._vendorListServiceFacade.getRecords(fnSuccess, null, "/City",
        "getAllCities", param);
  },
}
