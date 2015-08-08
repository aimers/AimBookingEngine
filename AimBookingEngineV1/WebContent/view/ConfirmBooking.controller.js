sap.ui
    .controller(
        "sap.ui.medApp.view.ConfirmBooking",
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
            this.paramValue = [ {} ];
            if (sap.ui.medApp.global.util._vendorModel) {
              this.oModel = sap.ui.medApp.global.util._vendorModel;
            } else {
              this.oModel = new sap.ui.model.json.JSONModel();
            }
            this.getView().setModel(this.oModel);
          },
          /*
           * Handle Press Tile
           */
          handleSearchKeyword : function(evt) {
            // open the loading dialog
            this._oRouter.navTo("_searchVendors", {
              vendorId : "123"
            });
          },
          handleConfirmBooking : function() {
            var bookingdata = this.oModel.getProperty("/bookingdata");
            var vendorData = this.oModel.getProperty(bookingdata[0].IPATH);
            var bookingdate = bookingdata[0].bookDate;
            var month = this.getMonth(bookingdate.split(" ")[1]);
            var date = bookingdate.split(" ")[2];
            var year = bookingdate.split(" ")[5];
            var my_date = year + "/" + month + "/" + date
            " " + bookingdate.split(" ")[3];
            var bostm = bookingdata[0].bookTime.split("-")[0] + ":00";
            var BOETM = bookingdata[0].bookTime.split("-")[1] + ":00";
            var param = [ {
              "key" : "details",
              "value" : {
                "VSUID" : vendorData.USRID,
                "VUTID" : 2,
                "CUSID" : medApp.global.config.user.USRID,
                "CUTID" : medApp.global.config.user.UTYID,
                "ETYID" : vendorData.Rules[0].ETYID,
                "ETCID" : vendorData.Rules[0].ETCID,
                "ENTID" : vendorData.Rules[0].ENTID,
                "RULID" : vendorData.Rules[0].RULID,
                "BDTIM" : my_date,
                "BTIMZ" : bookingdate.split(" ")[4],
                "BOSTM" : bostm,
                "BOETM" : BOETM,
                "RTYPE" : "0"
              }
            } ];
            var fnSuccess = function(oData) {
              console.log(oData);
            };
            this._vendorListServiceFacade = new sap.ui.medApp.service.vendorListServiceFacade(
                this.oModel);
            this._vendorListServiceFacade.updateParameters(param, fnSuccess,
                null, "book");
          },
          getMonth : function(monthStr) {
            return new Date(monthStr + '-1-01').getMonth() + 1
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