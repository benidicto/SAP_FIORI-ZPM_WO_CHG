sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/core/Fragment",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"ZPM_WO/model/formatter"
], function(BaseController, MessageBox, History, Fragment, Filter, FilterOperator, formatter) {
	"use strict";

	return BaseController.extend("ZPM_WO.controller.Page1", {
		formatter: formatter,
		onInit: function() {

		},

		getRouter: function() {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		_onInputValueHelpRequest: function() {
			if (!this._oDialogOrderSH) {
				this._oDialogOrderSH = sap.ui.xmlfragment("ZPM_WO.Fragment.OrderSearchHelp", this);
				this.getView().addDependent(this._oDialogOrderSH);
			}
			this._oDialogOrderSH.open();
		},

		_onSelectOrder: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("idInputOrder").setValue(oSelectedItem.getTitle()); //Set Header title after selection
				this.getView().byId("idInputOrderText").setText(oSelectedItem.getDescription()); //Set Header description after selection
				this.getView().byId("idStatusEdit").setText(oSelectedItem.getBindingContext().getObject().Status);
			}

		},

		_onSelectOrderLiveChange: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Aufnr", FilterOperator.Contains, sQuery));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectOrder");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		_onInputValueHelpRequestEqfnr: function() {
			if (!this._oDialogEqfnrSH) {
				this._oDialogEqfnrSH = sap.ui.xmlfragment("ZPM_WO.Fragment.EqfnrSearchHelp", this);
				this.getView().addDependent(this._oDialogEqfnrSH);
			}
			this._oDialogEqfnrSH.open();
		},

		_onSelectEqfnr: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("idInputEqfnr").setValue(oSelectedItem.getTitle()); //Set Header title after selection 
			}

		},

		_onSelectEqfnrLiveChange: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Eqfnr", FilterOperator.Contains, sQuery));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectEqfnr");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		_onInputValueHelpRequestIngrp: function() {
			if (!this._oDialogIngrpSH) {
				this._oDialogIngrpSH = sap.ui.xmlfragment("ZPM_WO.Fragment.IngrpSearchHelp", this);
				this.getView().addDependent(this._oDialogIngrpSH);
			}
			this._oDialogIngrpSH.open();
		},

		_onSelectIngrp: function(oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			if (oSelectedItem) {
				this.getView().byId("idInputIngrp").setValue(oSelectedItem.getTitle()); //Set Header title after selection 
				this.getView().byId("idInputIngrpText").setText(oSelectedItem.getDescription()); //Set Header title after selection 
			}

		},

		_onSelectIngrpLiveChange: function(oEvent) {
			var aFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				aFilter.push(new Filter("Ingrp", FilterOperator.Contains, sQuery));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectIngrp");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},

		_onSelectOprtLiveChange: function(oEvent) {
			var bFilter = [];
			var sQuery = oEvent.getParameter("value");
			if (sQuery) {
				bFilter.push(new Filter("Vornr", FilterOperator.Contains, sQuery));
			}
			// filter binding
			var oList = sap.ui.getCore().byId("idSelectOperation");
			var oBinding = oList.getBinding("items");
			oBinding.filter(bFilter);
		},

		_onSelectOperation: function(oEvent) {
			var oSelectedOperation = oEvent.getParameter("selectedItem");
			var oAufnr = oSelectedOperation.getBindingContext().getObject("Aufnr");
			var oVornr = oSelectedOperation.getBindingContext().getObject("Vornr");

			this.getRouter().navTo("Page2", {
				from: "Page1",
				Aufnr: oAufnr,
				Vornr: oVornr
			});
		},

		_onExecute: function() {
			var oAufnrCheck = this.getView().byId("idInputOrder").getValue();
			var oStatusCheck = this.getView().byId("idStatusEdit").getText();
			if (oStatusCheck === "X") {
				MessageBox.show("Error : Order already Completed", {
					icon: MessageBox.Icon.ERROR,
					title: "Error",
					width: "100%"
				});
			} else if (oStatusCheck === "") {
				var oAufnr = this.getView().byId("idInputOrder").getValue();
				var oEqfnr = this.getView().byId("idInputEqfnr").getValue();
				var oIngrp = this.getView().byId("idInputIngrp").getValue();

				if ((oAufnr === undefined || oAufnr === "") &&
					(oEqfnr === undefined || oEqfnr === "") &&
					(oIngrp === undefined || oIngrp === "")) {
					MessageBox.show("Please fill at least 1 selection", {
						icon: MessageBox.Icon.ERROR,
						title: "Error",
						width: "100%"
					});
				} else {
					if (oAufnr === undefined || oAufnr === "") {
						oAufnr = "XXXXXXXXXXXX";
					}
					if (oEqfnr === undefined || oEqfnr === "") {
						oEqfnr = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
					}
					if (oIngrp === undefined || oIngrp === "") {
						oIngrp = "XXX";
					}

					this.getRouter().navTo("Page3", {
						from: "Page1",
						Aufnr: oAufnr,
						Eqfnr: oEqfnr,
						Ingrp: oIngrp
					});
				}
			}
		},

		_onNavButtonPress: function() {
			var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			// Navigate back to FLP home
			oCrossAppNavigator.toExternal({
				target: {
					shellHash: "#"
				}
			});
		}
	});
}, /* bExport= */ true);