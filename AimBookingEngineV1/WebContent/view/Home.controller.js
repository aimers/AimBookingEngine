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
            this.oView.setBusy(true);
            // getting Router
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this.router = sap.ui.core.UIComponent.getRouterFor(this);

            this.router.attachRoutePatternMatched(this._handleRouteMatched,
                this);
          },
          _handleRouteMatched : function(oEvent) {
            this.bUpdateAddress = false;
            var scope = oEvent.getParameter("config").name;
            this.parameter = oEvent.getParameter("arguments");
            if (scope === "_homeTiles") {

              var _that = this;
              _that.oModel = sap.ui.medApp.global.util.getMainModel();
              var fnSuccess = function(oData) {
                // do what you need here
                _that.oModel.setProperty("/vendorsCategory", oData.results);
                _that.getAddress();

              }
              sap.ui.medApp.global.util.loadListCategory(fnSuccess);
              this.getView().setModel(this.oModel);
            }
            // 
          },
          getAddress : function(oEvent) {
            var _that = this;
            var fnSuccess = function(oData) {
              _that.oModel.setProperty("/vendorsAddress", oData.results);
              _that._getTileIcons();
              _that.getAddressSuggestions();
              _that.oView.setBusy(false);
            }
            sap.ui.medApp.global.util.loadAddress(fnSuccess);
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
            this.oView.byId("multiInput2").setFilterFunction(
                function(sTerm, oItem) {
                  // A case-insensitive 'string contains' style filter
                  return oItem.getText().match(new RegExp(sTerm, "i"));
                });
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
            this.oView.byId("homePageContent").setBusy(true);
            var _that = this;
            // do what you need here
            var medAppUID;

            if (sessionStorage.medAppUID) {
              medAppUID = sessionStorage.medAppUID
            } else {
              medAppUID = "1";
              var addressBar = _that.oView.byId("multiInput2");
            }
            // open the loading dialog
            var searchBar = _that.oView.byId("homeSearchBar");
            var keys = searchBar.getSelectedKeys().join();
            if (keys != "") {
              _that._oRouter.navTo("VendorListDetail", {
                ENTID : keys,
                ETYID : "1",
                ETCID : "1",
                UID : medAppUID,
                FILTER : "0"
              });
            } else {
              sap.m.MessageToast.show("Please select category");
              // return false; // TODO
            }
            _that.oView.byId("homePageContent").setBusy(false);
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
            this.oView.setBusy(true);
            var _this = this;
            var display_user_location = function display_user_location(
                user_position) {
              _this.lat = user_position.coords.latitude;
              _this.lon = user_position.coords.longitude;
              var location = _this.lat + "," + _this.lon;
              _this.setAddressModel(location);
            };
            var error_response = function(error) {
              console.log(error);
            };
            navigator.geolocation.getCurrentPosition(display_user_location,
                error_response);
          },
          setAddressModel : function(location) {
            var _this = this;
            var geocoder = new google.maps.Geocoder();
            var address = location;

            if (geocoder) {
              geocoder
                  .geocode(
                      {
                        'address' : address
                      },
                      function(results, status) {
                        var lndmrk = "";
                        var locly = "";
                        var city = "";
                        if (status == google.maps.GeocoderStatus.OK) {
                          var AddressData = results[0].address_components;
                          if (AddressData != undefined) {
                            for (var i = 0; i < AddressData.length; i++) {
                              if (AddressData[i].types[0] == "administrative_area_level_1") {
                                city = AddressData[i].long_name;
                              } else if (AddressData[i].types[0] == "locality") {
                                locly = AddressData[i].long_name;
                              } else if (AddressData[i].types[0] == "sublocality_level_1") {
                                lndmrk = AddressData[i].long_name;
                              }

                            }
                          } else {
                            sap.m.MessageToast.show("Couldn't find location");
                          }
                          var oDataNew = [ {
                            LANDMARK : lndmrk,
                            LOCALITY : locly,
                            CITY : city,
                            LAT : results[0].geometry.location.G,
                            LOG : results[0].geometry.location.K
                          } ];
                          medApp.global.config.user.Address.LATIT = results[0].geometry.location.G;
                          medApp.global.config.user.Address.LONGT = results[0].geometry.location.K;
                          _this.oModel.setProperty("/GeoLocation", oDataNew);
                          _this.oView.byId("multiInput2").setValue(
                              oDataNew[0].LANDMARK + "," + oDataNew[0].LOCALITY
                                  + "," + oDataNew[0].CITY);

                        } else {
                          console.log("Geocoding failed: " + status);
                        }
                        _this.oView.setBusy(false);
                      });
            }
          },
          setLocationParam : function(oEvent) {
            this.oView.setBusy(true);
            var parameters = oEvent.getParameters().selectedItem.getKey();
            medApp.global.config.user.Address.LATIT = parameters.split(",")[0];
            medApp.global.config.user.Address.LONGT = parameters.split(",")[1];
            this.bUpdateAddress = true;
            this.oView.setBusy(false);
          },
          handleAddessLocation : function(oEvent) {
            if (!this.bUpdateAddress) {
              var oValue = oEvent.oSource.getValue();
              this.setAddressModel(oValue);
              this.bUpdateAddress = false;
            }

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