jQuery.sap.declare("sap.ui.medApp.Component");
var oService;
sap.ui.core.UIComponent
    .extend(
        "sap.ui.medApp.Component",
        {

          /* Meta data of Component */
          metadata : {
            rootView : null, // Root View of the App
            routing : {
              config : {
                routerClass : sap.ui.medApp.MyRouter,
                viewType : "XML",
                viewPath : "sap.ui.medApp.view",
                targetAggregation : "detailPages",
                clearTarget : false
              },
              routes : [
                  {
                    pattern : "", // patern matching
                    name : "_homeTiles", // router name
                    view : "Home", // View of the _DealsList Router
                    targetAggregation : "pages",
                    targetControl : "idAppControl", // Target Control Id
                  },
                  {
                    pattern : "signup", // patern matching
                    name : "_Signup", // router name
                    view : "Signup", // View of the _DealsList Router
                    targetAggregation : "pages",
                    targetControl : "idAppControl", // Target Control Id
                  },
                  {
                    pattern : "searchList/{ENTID}/{UID}/{ETYID}/{ETCID}/{FILTER}/filter",
                    name : "_searchVendors",
                    view : "VendorFilter",
                    viewLevel : 0,
                    targetAggregation : "masterPages",
                    targetControl : "idSplitAppControl",
                    subroutes : [
                        {
                          pattern : "searchList/{ENTID}/{UID}/{ETYID}/{ETCID}/{FILTER}",
                          name : "VendorListDetail",
                          view : "VendorListDetail",
                          viewLevel : 1,
                          targetAggregation : "detailPages",
                          targetControl : "idSplitAppControl",
                        },
                        {
                          pattern : "searchList/{USRID}/{RULID}/{VPATH}/{VINDEX}/{ETYID}/{UID}/{ENTID}/{ETCID}/{FILTER}",
                          name : "_VendorDetail",
                          view : "VendorDetail",
                          viewLevel : 2,
                          targetAggregation : "detailPages",
                          targetControl : "idSplitAppControl",
                        } ]
                  }, {
                    pattern : "login/{flagID}", // patern matching
                    name : "_loginPage", // router name
                    view : "Login", // View of the _DealsList Router
                    targetAggregation : "pages",
                    targetControl : "idAppControl", // Target Control Id
                  }, {
                    pattern : "confirm/{UID}", // patern matching
                    name : "ConfirmBooking", // router name
                    view : "ConfirmBooking", // View of the _DealsList Router
                    targetAggregation : "pages",
                    targetControl : "idAppControl", // Target Control Id
                  } ]
            }
          },

          /**
           * !!! The steps in here are sequence dependent !!!
           */
          init : function() {
            // 1. some very generic requires
            jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
            jQuery.sap.require("sap.ui.core.routing.Router");
            jQuery.sap.require("sap.ui.medApp.global.util");
            jQuery.sap.require("sap.ui.medApp.global.globalFormatter");
            // 1.a Loading MyRouter

            jQuery.sap.require("sap.ui.medApp.MyRouter");
            jQuery.sap.require("sap.m.MessageBox");
            // jQuery.sap.require("sap.ui.medApp.util.Context");

            // 2. call overwritten init (calls createContent)
            sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

            // 3a. monkey patch the router
            var oRouter = this.getRouter();

            oRouter.myNavBack = sap.ui.medApp.MyRouter.myNavBack;
            oRouter.myNavToWithoutHash = sap.ui.medApp.MyRouter.myNavToWithoutHash;
            // 4. initialize the router
            this.oRouteHandler = new sap.m.routing.RouteMatchedHandler(oRouter);
            oRouter.initialize();
          },
          createContent : function() {

            // create root view
            var oView = sap.ui.view({
              id : "medApp",
              viewName : "sap.ui.medApp.view.App",
              type : "XML",
              viewData : {
                component : this
              }
            });
            // i18n Model Initialization
            var i18nModel = new sap.ui.model.resource.ResourceModel({
              bundleUrl : "assets/text/i18n.properties"
            });
            oView.setModel(i18nModel, "i18n");
            var oDeviceModel = new sap.ui.model.json.JSONModel({
              isTouch : sap.ui.Device.support.touch,
              isNoTouch : !sap.ui.Device.support.touch,
              isPhone : sap.ui.Device.system.phone,
              isNoPhone : !sap.ui.Device.system.phone,
              listMode : (sap.ui.Device.system.phone) ? "None"
                  : "SingleSelectMaster",
              listItemType : (sap.ui.Device.system.phone) ? "Active"
                  : "Inactive"
            });
            oDeviceModel.setDefaultBindingMode("OneWay");
            sap.ui.getCore().setModel(oDeviceModel, "device");
            oView.setModel(oDeviceModel, "device");
            oView.setDisplayBlock(true);
            return oView
          },

          destroy : function() {
            if (this.oRouteHandler) {
              this.oRouteHandler.destroy();
            }
            // call overwritten destroy
            sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
          }
        });