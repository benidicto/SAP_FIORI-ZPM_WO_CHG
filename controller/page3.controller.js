sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/core/routing/History",
		"sap/m/MessageToast",
		"ZPM_WO/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function(BaseController, MessageBox, History, MessageToast, formatter, Filter, FilterOperator) {
		"use strict";
		return BaseController.extend("ZPM_WO.controller.page3", {
			formatter: formatter,
			onInit: function() {
				sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.handleRouteMatched, this);
			},
			getRouter: function() {
				return sap.ui.core.UIComponent.getRouterFor(this);
			},
			handleRouteMatched: function(oEvent) {
				var oParameters = oEvent.getParameters();
				if (oParameters.name !== "Page3") {
					return;
				}
				this.Aufnr = oParameters.arguments.Aufnr;
				this.Eqfnr = oParameters.arguments.Eqfnr;
				this.Ingrp = oParameters.arguments.Ingrp;
				//	var sEntityPath = "/wo_hdrSet(Aufnr='" + this.Aufnr + "'Eqfnr='" + this.Eqfnr + "'Ingrp='" + this.Ingrp + "')"; 
				//	this.getView().setBusy(true);
				//Bind Entity
				this.getwohdr(this.Aufnr, this.Eqfnr, this.Ingrp);
			},
			getwohdr: function(oAufnr, oEqfnr, oIngrp) {
				var oTableComponent = this.getView().byId("IdTableHeader");

				var aFilter = [];
				if (oAufnr !== "XXXXXXXXXXXX") {
					aFilter.push(new Filter("Aufnr", sap.ui.model.FilterOperator.EQ, oAufnr));
				}
				if (oEqfnr !== "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX") {
					aFilter.push(new Filter("Eqfnr", sap.ui.model.FilterOperator.EQ, oEqfnr));
				}
				if (oIngrp !== "XXX") {
					aFilter.push(new Filter("Ingpr", sap.ui.model.FilterOperator.EQ, oIngrp));
				}

				this.getView().setBusy(true);

				var oFilter = new sap.ui.model.Filter({
					filters: aFilter,
					and: true
				});
				//Filter Data  
				oTableComponent.getBinding("items").filter([oFilter]);
				//	oTableComponent.setBusy(false);
				this.getView().setBusy(false);
			},
			_onNavButtonPress: function() {
				var oHistory = History.getInstance();
				var sPreviousHash = oHistory.getPreviousHash();
				if (sPreviousHash !== undefined) {
					window.history.go(-1);
				} else {
					this.getRouter().navTo("Page1");
				}
			},
			getWoOpr: function(oEvent) {
				var oAufnr = oEvent.getSource().getTitle();

				this.getRouter().navTo("Page4", {
					from: "Page3",
					Aufnr: oAufnr
				});
			}
		});
	}, /* bExport= */
	true);