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
      var dist = sap.ui.medApp.global.util.distance(latt, longt, "K");
      return Math.round(dist);
      ;
    }
  },
  getDistanceFlag : function(oArray) {
    if (oArray != null && oArray != undefined) {
      var latt = oArray[0].LATIT;
      var longt = oArray[0].LONGT;
      var latt1 = sessionStorage.LATIT;
      var longt1 = sessionStorage.LONGT;
      var dist = sap.ui.medApp.global.util.distance(latt, longt, longt1, latt1,
          "K");
      if (latt1 && longt1) {
        if (Math.round(dist)) {
          return true;
        } else {
          return false;
        }
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
  },
  showLogoutButton : function(oValue) {
    if (oValue != null && oValue != undefined) {
      return false;
    } else {
      return true;
    }
  },
  showLoginButton : function(oValue) {
    if (oValue != null && oValue != undefined) {
      return true;
    } else {
      return false;
    }
  },
  getListCount : function(oArray) {
    if (oArray != null && oArray != undefined) {
      return oArray.length;
    }
  },
  checkFavorite : function(userId) {
    if (userId != null && userId != undefined) {
      var userData = sap.ui.medApp.global.util._mainModel
          .getProperty("/LoggedUser");
      if (userData != undefined) {
        var chars = userData.Characteristics;
        if (chars != undefined) {
          for (var i = 0; i < chars.length; i++) {
            if (chars[i].CHRID == 11) {
              if (chars[i].VALUE == userId) {
                return true;
              }
            }
          }
        }
      }

      return false;
    }
  },
  getBookConfirmStatus : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == 1) {
        return "Approved";
      } else {
        return "Pending";
      }
    }
  },
  getBooleanToNum : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == 1) {
        return 0;
      } else {
        return 1;
      }
    }
  },
  getBookingButton : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue < 3) {
        return "Book Appointment";
      } else {
        return "Call";
      }
    }
  },
  getBookingTimeMorning : function(oValue) {
    if (oValue != null && oValue != undefined) {

      if (oValue.split(":")[0] < 12 && oValue.split(":")[0] >= 3) {
        return true;
      } else {
        return false;
      }
    }
  },
  getBookingTimeAfternoon : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue.split(":")[0] < 16 && oValue.split(":")[0] >= 12) {
        return true;
      } else {
        return false;
      }
    }
  },
  getBookingTimeEvening : function(oValue) {
    if (oValue != null && oValue != undefined) {

      if (oValue.split(":")[0] >= 16 && oValue.split(":")[0] < 20) {
        return true;
      } else {
        return false;
      }
    }
  },
  getBookingTimeNight : function(oValue) {
    if (oValue != null && oValue != undefined) {

      if ((oValue.split(":")[0] < 24 && oValue.split(":")[0] >= 20)
          || (oValue.split(":")[0] < 3 && oValue.split(":")[0] >= 0)) {
        return true;
      } else {
        return false;
      }
    }
  },
  getLabelDisplayWrite : function(oValue) {
    if (oValue != null && oValue != undefined) {
      return true;
    } else {
      return false;
    }
  },
  getCallNumber : function(oArray) {
    if (oArray != null && oArray != undefined) {
      for (var i = 0; i < oArray.length; i++) {
        if (oArray[i].DESCR == "Landline") {
          return oArray[i].VALUE;
        }
      }
    }
  },
  checkVendorSocial : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == "url") {
        return true;
      } else {
        return false;
      }
    }
  },
  getVendorSocialUrl : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == "Facebook") {
        return "assets/img/facebook.png";
      }
      if (oValue == "Twitter") {
        return "assets/img/twitter.png";
      }
      if (oValue == "Google+") {
        return "assets/img/googleplus.png";
      }
    }
  },
  getVendorPhoneIcon : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == "Landline") {
        return "sap-icon://phone";
      }
      if (oValue == "Mobile") {
        return "sap-icon://iphone";
      }
    }
  },
  getVendorEmailIcon : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == "Personal Email" || oValue == "Business Email") {
        return "sap-icon://email";
      }
    }
  },
  checkVendorPhoneIcon : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == "Landline" || oValue == "Mobile") {
        return true;
      } else {
        return false;
      }
    }
  },
  checkVendorEmailIcon : function(oValue) {
    if (oValue != null && oValue != undefined) {
      if (oValue == "Personal Email" || oValue == "Business Email") {
        return true;
      } else {
        return false;
      }
    }
  }
}
