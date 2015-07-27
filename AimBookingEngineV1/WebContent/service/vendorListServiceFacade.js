(function() {
	"use strict";

	jQuery.sap.declare("sap.ui.medApp.service.vendorListServiceFacade");
	jQuery.sap.require("sap.ui.medApp.service.BaseServiceFacade");

	/**
	 *
	 * @name sap.ui.medApp.service.vendorListServiceFacade
	 * @extends sap.ui.medAppe.service.BaseServiceFacade
	 */
	sap.ui.medApp.service.BaseServiceFacade.extend("sap.ui.medApp.service.vendorListServiceFacade", /** @lends app.home.service.DinmensionServiceFacade */
			{
		getRecords : function(fnSuccess, fnError,modelPath, fnPath,param) {
			var sServicePath = "";
			var sModelPath = modelPath;
			var extractListVendor;
			if(fnPath =="vendorDataList"){

				sServicePath = encodeURI(evidencePackage.global.config.endPoint.vendorDataList+param);
				extractListVendor = function(oData) {
					return oData.results;
				};
			}
			if(fnPath =="vendorDataDetail"){

				sServicePath = encodeURI(evidencePackage.global.config.endPoint.vendorDataDetail+param);
				extractListVendor = function(oData) {
					return oData.results;
				};
			}
			if(fnPath =="vendorCatList"){

				sServicePath = encodeURI(evidencePackage.global.config.endPoint.vendorCatList);
				extractListVendor = function(oData) {
					return oData.results;
				};
			}
			if(fnPath =="vendorTileCatList"){

				sServicePath = encodeURI(evidencePackage.global.config.endPoint.vendorTileCatList);
				extractListVendor = function(oData) {
					return oData.results;
				};
			}
			var _fnSuccess = function(){
			};
			this._get(sServicePath, sModelPath,undefined, _fnSuccess, fnError, extractListVendor);
		},
			});
})();
