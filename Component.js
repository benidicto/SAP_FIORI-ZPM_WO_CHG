sap.ui.define([
	"sap/ui/core/UIComponent",
	"ZPM_WO/model/formatter",
	"ZPM_WO/model/models",
	"ZPM_WO/model/errorHandling",
	"sap/ui/model/resource/ResourceModel"
], function(UIComponent, formatter, models, errorHandling, ResourceModel) {
	"use strict";
	return UIComponent.extend("ZPM_WO.Component", {
		metadata: {
			manifest: "json",
			dependencies: {
				"libs": ["sap.ui.commons", "sap.ui.table", "sap.m", "sap.me", "sap.ui.core", "sap.ui.layout", "sap.uxap", "sap.m.semantic", "sap.ui.comp.filterbar"],
				"components": []
			},
			config: {
				serviceConfig: {
					name: "ZPM_WO_SRV", //service name
					serviceUrl: "/sap/opu/odata/sap/ZPM_WO_SRV/" //OData service url

				}
			},
			routing: {
				// The default values for routes
				config: {
					"targetsClass": "sap.m.routing.Targets",
					"viewType": "XML",
					"viewPath": "ZPM_WO.view",
					"targetAggregation": "pages", // This is the aggregation in which the new views will be placed
					"clearTarget": false,
					"transition": "slide"
				},
				routes: [ 
				{
					pattern: "Page5/:Aufnr::Vornr:",
					name: "Page5",
					view: "Page5",
					targetControl: "mainContent" // This is the control in which new views are placed
				},{
					pattern: "Page4/:Aufnr:",
					name: "Page4",
					view: "Page4",
					targetControl: "mainContent" // This is the control in which new views are placed
				},
				{
					pattern: "Page3/:Aufnr::Eqfnr::Ingrp:",
					name: "Page3",
					view: "Page3",
					targetControl: "mainContent" // This is the control in which new views are placed
				},
			//	{
			//		pattern: "Page2/:Aufnr::Vornr:",
			//		name: "Page2",
			//		view: "Page2",
			//		targetControl: "mainContent" // This is the control in which new views are placed
			//	},
				{
					pattern: "", // load overtime history using master detail view
					name: "Page1",
					view: "Page1",
					targetControl: "mainContent" // This is the control in which new views are placed
				}]
			}
		},

		init: function() {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			// additional initialization can be done here
			var mConfig = this.getMetadata().getConfig();
			var sServiceUrl = mConfig.serviceConfig.serviceUrl;

			var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, {
				useBatch: true,
				refreshAfterChange: false,
				setCountSupported: false
			});
			oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);

			this.setModel(oModel);

			// set i18n
			var i18nModel = new ResourceModel({
				bundleName: "ZPM_WO.i18n.i18n"
			});
			this.setModel(i18nModel, "i18n");

			// delegate error handling
			// errorHandling.register(this);

			this._routeMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter(), this._bRouterCloseDialogs);
			this.getRouter().initialize();
		},

		exit: function() {
			this._routeMatchedHandler.destroy();
		}

	});
});