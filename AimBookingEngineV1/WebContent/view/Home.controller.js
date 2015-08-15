jQuery.sap.require("sap.ui.medApp.service.vendorListServiceFacade");
sap.ui
    .controller(
        "sap.ui.medApp.view.Home",
        {

          /**
           * Called when a controller is instantiated and its View controls (if
           * available) are already created. Can be used to modify the View
           * before it is displayed, to bind event handlers and do other
           * one-time initialization.
           * 
           * @memberOf view.Home
           */
          onInit : function() {
            // getting Router
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.router = sap.ui.core.UIComponent.getRouterFor(this);

            this.router.attachRoutePatternMatched(this._handleRouteMatched,
                this);
          },
          _handleRouteMatched : function(oEvent) {
            var scope = oEvent.getParameter("config").name;
            if (scope === "_homeTiles") {
              this.oModel = sap.ui.medApp.global.util.getMainModel();
              this.getView().setModel(this.oModel);
              this._getTileIcons();
              this.getAddressSuggestions();
            }
          },
          getAddressSuggestions : function() {
            var vendorData = this.oModel.getProperty("/vendorsAddress");
            var suggestionData = [];
            for (var k = 0; k < vendorData.length; k++) {
              suggestionData.push({
                "ADDR" : vendorData[k].LNDMK + ", " + vendorData[k].LOCLT
                    + ", " + vendorData[k].CTYNM,
                "LATIT" : vendorData[k].LATIT,
                "LONGT" : vendorData[k].LONGT
              });
            }
            this.oModel.setProperty("/suggestAddress", suggestionData);
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
            var medAppUID;
            if (sessionStorage.medAppUID) {
              medAppUID = sessionStorage.medAppUID
            } else {
              medAppUID = "1";
            }
            this._oRouter.navTo("VendorListDetail", {
              ENTID : evt.oSource.getUseMap(),
              ETYID : "1",
              ETCID : "1",
              UID : medAppUID,
              FILTER : "0"
            });
          },
          /*
           * Handle Press Tile
           */
          handleSearchKeyword : function(evt) {
            var medAppUID;
            if (sessionStorage.medAppUID) {
              medAppUID = sessionStorage.medAppUID
            } else {
              medAppUID = "1";
            }
            // open the loading dialog
            var searchBar = this.oView.byId("homeSearchBar");
            var keys = searchBar.getSelectedKeys().join();
            this._oRouter.navTo("VendorListDetail", {
              ENTID : keys,
              ETYID : "1",
              ETCID : "1",
              UID : medAppUID,
              FILTER : "0"
            });

          },
          /*
           * handleSelectionChange : function(oEvent) { var selectedItems =
           * oEvent.getParameter("selectedItems"); for (var i = 0; i <
           * selectedItems.length; i++) { messageText += "'" +
           * selectedItems[i].getText() + "'"; if (i != selectedItems.length -
           * 1) { messageText += ","; } } },
           */

          handleSearchVendor : function() {
            var selectedItems = oEvent.getParameter("selectedItems");
            for (var i = 0; i < selectedItems.length; i++) {
              messageText += "'" + selectedItems[i].getText() + "'";
              if (i != selectedItems.length - 1) {
                messageText += ",";
              }
            }
          },
          getGeoLocation : function() {
            var _this = this;
            var display_user_location = function display_user_location(
                user_position) {
              _this.lat = user_position.coords.latitude;
              _this.lon = user_position.coords.longitude;
              _this.setAddressModel(_this.lat, _this.lon);
            };
            var error_response = function(error) {
              console.log(error);
            };
            navigator.geolocation.getCurrentPosition(display_user_location,
                error_response);
          },
          setAddressModel : function(lat, log) {
            var _this = this;
            this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                this._mainModel);
            var fnSuccess = function(oData) {
              var AddressData = oData.results[0].address_components;

              var oDataNew = [ {
                LANDMARK : AddressData[1].long_name,
                LOCALITY : AddressData[4].long_name,
                CITY : AddressData[5].long_name,
                LAT : lat,
                LOG : lat
              } ];
              _this.oModel.setProperty("/GeoLocation", oDataNew);
              _this.oView.byId("productInput").setValue(
                  oDataNew[0].LANDMARK + "," + oDataNew[0].LOCALITY + ","
                      + oDataNew[0].CITY);
            };
            var fPath = "http://maps.googleapis.com/maps/api/geocode/json?latlng="
                + lat + "," + log;
            this._vendorListServiceFacade.getThirdPartyData(param, fnSuccess,
                null, fPath);
          }

        /**
         * Similar to onAfterRendering, but this hook is invoked before the
         * controller's View is re-rendered (NOT before the first rendering!
         * onInit() is used for that one!).
         * 
         * @memberOf view.Home
         */
        // onBeforeRendering: function() {
        // },
        /**
         * Called when the View has been rendered (so its HTML is part of the
         * document). Post-rendering manipulations of the HTML could be done
         * here. This hook is the same one that SAPUI5 controls get after being
         * rendered.
         * 
         * @memberOf view.Home
         */
        // onAfterRendering: function() {
        // },
        /**
         * Called when the Controller is destroyed. Use this one to free
         * resources and finalize activities.
         * 
         * @memberOf view.Home
         */
        // onExit: function() {
        // }
        });