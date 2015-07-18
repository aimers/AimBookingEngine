jQuery.sap.require("app.home.service.PrimePartServiceFacade");
sap.ui.controller("app.home.detailLayer",{

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf live_chart.Chart
	 */
	onInit: function() {

		this.oData = [ {
			"Label1" : 962,
			"Label2" : 324,
			"Id" : 0,
			"TIMESTAMP" : "2005-07-14T14:47:52.927Z"
		}, {
			"Label1" : 101,
			"Label2" : 14,
			"Id" : 1,
			"TIMESTAMP" : "1994-03-30T07:50:49.071Z"
		}, {
			"Label1" : 45,
			"Label2" : 856,
			"Id" : 2,
			"TIMESTAMP" : "1985-08-21T21:13:07.709Z"
		}, {
			"Label1" : 131,
			"Label2" : 274,
			"Id" : 3,
			"TIMESTAMP" : "1996-05-03T23:29:08.665Z"
		}, {
			"Label1" : 335,
			"Label2" : 86,
			"Id" : 4,
			"TIMESTAMP" : "2010-06-15T02:25:10.930Z"
		} ];
		this.measures = {
				results1 : [],
				results : []
		};
		this.measures.results = this.oData;
		this.measures.results1 = [{"name":"Label2"},{"name":"Label1"}];

		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData(this.oData);
		var line = this.getView().byId("lineChart");
		var model = new sap.ui.model.json.JSONModel();
		model.setData(this.measures);
		line.setModel(model, "measures");
		line.getTitle().setText("GraphTitle");
		sap.viz.format.FormatManager.formatFunc({
			format : function(v, p) {
				if (p == "%")
					return v +"%";
				else
					return v;
			}
		});

		line.getYAxis().getLabel().setFormatString("%");

		var measureDataset = line.getDataset().getMeasures();
		for (var i = 0; i < measureDataset.length; i++) {
			var path = "";
			path += measureDataset[i].getName();
			measureDataset[i].bindProperty("value", path);
		}
		var oModel = new sap.ui.model.json.JSONModel("assets/data/PrimePart.json");
	    this.getView().byId("detailTable").setModel(oModel);
	},
	_fetchPrimeServiceData : function() {
		this._DTCServiceFacade.getRecords(null, null);
	},
	navtoNew:function(){
		//alert("test");
	},
	navToGraphPage : function(){

		app.to("secondLayer");
		app.placeAt("content");
	},
	
	onAfterRendering : function(){
			    // set explored app's demo model on this sample
	}
});