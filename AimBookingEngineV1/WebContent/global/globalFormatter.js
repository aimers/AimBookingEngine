jQuery.sap.declare("sap.ui.medApp.global.globalFormatter");
sap.ui.medApp.global.globalFormatter = {
  checkRating : function(oValue) {
    if (oValue != null && oValue != undefined) {
      return true;
    } else {
      return false;
    }
  },
  getDistance : function(oArray) {
    if (oArray != null && oArray != undefined) {
      var latt = oArray[0].LATIT;
      var longt = oArray[0].LONGT;
      var latt1 = medApp.global.config.user.Address.LATIT;
      var longt1 = medApp.global.config.user.Address.LONGT;
      var dist = sap.ui.medApp.global.util.distance(latt, longt, longt1, latt1,
          "K");
      return Math.round(dist);
      ;
    }
  },
  getDistanceFlag : function(oArray) {
    if (oArray != null && oArray != undefined) {
      var latt = oArray[0].LATIT;
      var longt = oArray[0].LONGT;
      var latt1 = medApp.global.config.user.Address.LATIT;
      var longt1 = medApp.global.config.user.Address.LONGT;
      var dist = sap.ui.medApp.global.util.distance(latt, longt, longt1, latt1,
          "K");
      if (Math.round(dist)) {
        return true;
      } else {
        return false;
      }
    }
  },
  checkImage : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == 8) {
        return true;
      } else {
        return false;
      }
    }
  },
  getVendorImageUrl : function(oValue) {
    if (oValue != null && oValue != undefined) {
      return "assets/img/vendor/" + oValue;
    }
  },
  getDayName : function(oValue) {
    if (oValue != null && oValue != undefined) {
      return oValue.split(" ")[0];
    }
  },
  getBookingStatus : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == 1) {
        return false;
      } else {
        return true;
      }
    }
  }
}
