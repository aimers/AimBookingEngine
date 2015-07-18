jQuery.sap.require("sap.ca.ui.dialog.factory");
jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("sap.ui.fisa.view.OrderDetails", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.OrderDetails
*/
	onInit: function() {
		
		this.intialHeightOfParties = 0;
		this.isNewelyLoaded = false; //for tracking weather it is loaded directly or through navigated
		this.isDataCanceled = false; //checking for whether data is cancelled or not.
		
		
		this.changedData = [];
		this.partyData = [];
		
		this.msgData = []; //need to remove in future
		
		//getting Router
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.oLoadingDialog = sap.ui.getCore().byId("fisaApp").getController().oLoadingDialog;
		//if we directly reload the salesOrderList page we don't have oService Object
		if(!oService){
			
			this.oLoadingDialog.open();
			//initializing the oData
			 oService = new oDataService();
			 this.isNewelyLoaded = true;
			
			 
		}
		
		var bus = sap.ui.getCore().getEventBus();
		this.router.attachRoutePatternMatched(this._getOrder_Id,this);
		
		
		
		
		orderDetailsPagePointer = this;
		
		//listening the initialOrderListLoaded Event.
		bus.subscribe("fisaApp", "OrderDetailsLoaded", function(){
			
			
			this.oLoadingDialog = sap.ui.getCore().byId("fisaApp").getController().oLoadingDialog;
			
			/*
			 * Build Message data based on conditions and set that model to the details page
			 * 
			 * Separate the Parties data as Customers and companies.
			 * 
			 * And set the part set Model to the Parties Tab.
			 * 
			 */
			
			var initialOrderListModel = sap.ui.getCore().getModel("salesOrderDetailsModel"); 
			initialOrderListModel.oData = this.addPopoverIconsToModel(initialOrderListModel.oData);
			this.getView().byId('details_page').setModel(initialOrderListModel);
			
			
			
		
			
			
			this.oLoadingDialog.close();
			
			if(!this.isDataCanceled){
				oService.getAttachments(initialOrderListModel.oData.DOC_ID);
				oService.getOrderInfo(initialOrderListModel.oData.DOC_ID, initialOrderListModel.oData.DOC_CATEGORY);
				oService.getCommentsInfo(initialOrderListModel.oData.DOC_ID, initialOrderListModel.oData.DOC_CATEGORY);
			}
			
			//restting the cancelled flag.
			this.isDataCanceled = false;
			
		}, this);
		
		//attachements details
		
		bus.subscribe("fisaApp", "attachementDetailsLoaded", function(){
			
			
			//this.oLoadingDialog = sap.ui.getCore().byId("fisaApp").getController().oLoadingDialog;
			
			
			
			var attachmentListModel = sap.ui.getCore().getModel("attachementDetailsModel"); 
			
			this.getView().byId('attachements').setModel(attachmentListModel);
			console.log(attachmentListModel);
			//this.oLoadingDialog.close();
			
			
			
		}, this);
		
		//Invoices Tab
		bus.subscribe("fisaApp", "OrderInfoLoaded", function(){
			
			
			//this.oLoadingDialog = sap.ui.getCore().byId("fisaApp").getController().oLoadingDialog;
			
			
			
			var attachmentListModel = sap.ui.getCore().getModel("salesOrderInfo"); 
			
			this.getView().byId('orderInfo').setModel(attachmentListModel);
			console.log(attachmentListModel);
			//this.oLoadingDialog.close();
			
			
			
		}, this);
		
		//Comments
		bus.subscribe("fisaApp", "commentsListInfoLoaded", function(){
			
			
			//this.oLoadingDialog = sap.ui.getCore().byId("fisaApp").getController().oLoadingDialog;
			
			
			
			var commentsListModel = sap.ui.getCore().getModel("commentsListInfo"); 
			commentsListModel = this.buildCommentsRepliesDataStructure(commentsListModel);
			
			this.getView().byId('commentSection').setModel(commentsListModel);
			console.log(commentsListModel);
			//this.oLoadingDialog.close();
			
			
		
		
			
			
		}, this);
		
	},
	_getOrder_Id : function(oEvent){
		var order_id = oEvent.getParameter("arguments").order_id;
		var mode = oEvent.getParameter("arguments").isEditable;
		
		if(mode == 'edit' && order_id){
			oService.getSaleOrderDetails(order_id);
			orderDetailsPagePointer.displayOrHide(true);
		}
		else if(mode == 'view' && order_id){
			oService.getSaleOrderDetails(order_id);
			orderDetailsPagePointer.displayOrHide(false);
			
		}
		
	},
	/*
	 * Updating the model with which icons to show in the table
	 * 
	 * 
	 * Finding the Error Info, MessagesInfo Messages and Ship To Information
	 * 
	 * 
	 */
	addPopoverIconsToModel: function(listModel){
		//var listModel = sap.ui.getCore().getModel("salesOrderDetailsModel");
		
		var partySetModel = sap.ui.getCore().getModel('salesOrderPartyModel');
		
		$.each(listModel.SDocItmSet.results, function(itemSetIndex, itemSetValue){
			var warringMsgs = false, infoMsgs = false, shippingInfoMsgs = false, warningData = [], infoData = [], itemPartyInfo = [];
			
			var filteredPartyData, customerPartyData, companyPartyData;
			
			/* Message Data */
			if(listModel.SDocMessageSet.results != undefined){
				
			
				if(listModel.SDocMessageSet.results.length>0){
					
				
					var filteredMsgData = (listModel.SDocMessageSet.results).filter(function(value, index){ return itemSetValue.ITEM_ID == value.ITEM_ID; });
					
					
					
					for(i = 0; i<filteredMsgData.length; i++){
						if(filteredMsgData[i].MSG_TYPE == 'E'){
							warringMsgs = true;
							warningData.push(filteredMsgData[i]);
						}
						else{
							infoMsgs = true;
							infoData.push(filteredMsgData[i]);
						}
					}
				}
			}
			
			/* Party Set Data */
			
			if(listModel.SDocPartySet.results != undefined){
				
				
				if(listModel.SDocPartySet.results.length>0){
					filteredPartyData = (listModel.SDocPartySet.results).filter(function(value, index){
						return (itemSetValue.ITEM_ID == value.ITEM_ID && value.FUNCTION_ID == 'WE') 
						
					});
					if(filteredPartyData.length<=0){
						//if we don't have any data find for the parent item (ITEM_ID == ''). Took only one data
					
						filteredPartyData = (listModel.SDocPartySet.results).filter(function(value, index){
							return (value.ITEM_ID == '' && value.FUNCTION_ID == 'WE') 
							
						});
						
					}
					itemPartyInfo = filteredPartyData;
					if(itemPartyInfo.length>0){
						shippingInfoMsgs = true;
					}
					
					/** End for Shipping address **/
					
					/** Customer Details from SDOCParty Set Entity**/
					customerPartyData = (listModel.SDocPartySet.results).filter(function(value, index){ return (value.PARTNER_TYPE == 'C'); });
					companyPartyData = (listModel.SDocPartySet.results).filter(function(value, index){ return (value.PARTNER_TYPE == 'E'); });
					
					
				}
			}
			
			
			
			listModel.SDocItmSet.results[itemSetIndex].warringMsgs = warringMsgs; //boolean varaibles
			listModel.SDocItmSet.results[itemSetIndex].infoMsgs = infoMsgs;  //boolean varaibles
			listModel.SDocItmSet.results[itemSetIndex].shippingInfoMsgs = shippingInfoMsgs; //boolean varaibles
			listModel.SDocItmSet.results[itemSetIndex].warningMsgData = {"results" : warningData};
			listModel.SDocItmSet.results[itemSetIndex].infoMsgData = {"results" : infoData};
			listModel.SDocItmSet.results[itemSetIndex].itemPartyInfoData = {"results" : itemPartyInfo}; //Shipping info
			
			
			listModel.partiesInfo = {"results": {"customers" : customerPartyData, "companies" : companyPartyData }};
			
			
			
		});
		
		return (listModel);
		
	},
	
	
	
	/*
	 * Handels the less btn
	 */
	expandShippingInfo: function(evt){
		
		var currentTabKey = this.getView().byId('iconbars').getSelectedKey();
		var srcBtn = evt.getSource();
		var height = $('.panelInfo').height();

		//for the first time it is intializing the height variable of the Parties Div
		if(this.intialHeightOfParties == 0){
			this.intialHeightOfParties = height;
		}
		
		
		//if attachament tab is selected 
		
		//showing only half part of the attachments.
		if(currentTabKey == 'attachment'){
			if(height == "70"){
				$('.panelInfo').css("overflow", "none");
				
				$('.panelInfo').animate( { height: this.intialHeightOfParties+"px"}, {queue:false, duration:500 });
				srcBtn.setText('Less');
				srcBtn.setIcon('sap-icon://up');
			}
			else{
				$('.panelInfo').css("overflow", "hidden");
				
				$('.panelInfo').animate( { height: "70px"}, {queue:false, duration:500 });
				
				srcBtn.setText('View More');
				srcBtn.setIcon('sap-icon://down');
			}
			
			
			
		}else{
			$('.panelInfo').slideToggle('slow', function(){
				srcBtn.setText(($('.panelInfo').css('display') == 'none') ? 'View More' :  'Less');
				srcBtn.setIcon(($('.panelInfo').css('display') == 'none') ? 'sap-icon://down' :  'sap-icon://up');
				console.log($('.panelInfo').css('display'));
			});
		}
			
		
		
		
		
		
	},
	/*
	 * 
	 * Handle Popover events
	 * 
	 */
	handlePressPopover: function(evt){
		
		var src = evt.getSource();
		var listModel = this.getView().byId('details_page').getModel();
		var currentContext = src.getBindingContext();
		var currentContextPath = currentContext.getPath();
		var currentPopover;
		
		
		//deciding the which data to binded by icon
	    if(src.getSrc() == 'sap-icon://notification'){
	    
			// create popover
		    if (! this._oWarrningPopover) {
		      this._oWarrningPopover = sap.ui.xmlfragment("popoverMsgInfo", "sap.ui.fisa.view.Popover", this);
		      this.getView().addDependent(this._oWarrningPopover);
		    }
	    
	    	    
		    
	    	if(src.getColor() == '#D33F3F'){
	    		path = currentContextPath+'/warningMsgData';
	    		
	    	}
	    	else{
	    		path = currentContextPath+'/infoMsgData';
	    	}
	    	currentPopover = this._oWarrningPopover;
	    }
	    else{
	    	// create popover
		    if (! this._oPartyInfoPopover) {
		      this._oPartyInfoPopover = sap.ui.xmlfragment("popoverPartyInfo", "sap.ui.fisa.view.PartyInfoPopover", this);
		      this.getView().addDependent(this._oPartyInfoPopover);
		    }
		    
	    	path = currentContextPath+'/itemPartyInfoData';
	    	currentPopover = this._oPartyInfoPopover;
	    }
	    
	    var popupData = new sap.ui.model.json.JSONModel();
		console.log(listModel.getProperty(path));
	    popupData.setData(listModel.getProperty(path));
	    
	    currentPopover.setModel(popupData);
    
    	
	    
	    // delay because addDependent will do a async rerendering and the popover will immediately close without it
	    var oButton = evt.getSource();
	    jQuery.sap.delayedCall(0, this, function () {
	      currentPopover.openBy(oButton);
	    });
	    
	},
	
	/* Open Invoice in Orders List Table below of the all tabs */
	openInvoicePdf: function(evt){
		
		var listModel = this.getView().byId('details_page').getModel();
		var src = evt.getSource();
		var currentContext = src.getBindingContext();
		var currentContextPath = currentContext.getPath();
		var currentSelectedData = listModel.getProperty(currentContextPath);
		console.log(currentSelectedData);
		if(currentSelectedData){
			sap.m.URLHelper.redirect(oService.url+"SDocAttachmentSet(DOC_ID='"+currentSelectedData.INV_NUMBER+"',DOC_CATEGORY='"+currentSelectedData.INV_NUMBER_CATG+"',FILE_ID='TRANSACTION')/$value", true);
		}
		
	},
	//open orders Pdf in Invoices tab
	openOrdersPdf: function(evt){
		
		var listModel = this.getView().byId('orderInfo').getModel(); //order table info in Invoices Tab
		var src = evt.getSource();
		var currentContext = src.getBindingContext();
		var currentContextPath = currentContext.getPath();
		var currentSelectedData = listModel.getProperty(currentContextPath);
		console.log(currentSelectedData);
		if(currentSelectedData){
			sap.m.URLHelper.redirect(oService.url+"SDocAttachmentSet(DOC_ID='"+currentSelectedData.DOC_ID+"',DOC_CATEGORY='"+currentSelectedData.DOC_CATEGORY+"',FILE_ID='TRANSACTION')/$value", true);
		}
	},
	
	/*
	 * Handle click event for ItemBarIcons 
	 */
	handleTabBarPress: function(evt){
		
		
		
		var key = (evt.getSource()).getSelectedKey();
		
		
		/*
		 * Resetting the Lessbtn text and visibility of table
		 */
		this.getView().byId('order-details-tabel').setVisible(true);
		this.getView().byId('less-btn').setVisible(true);
		this.getView().byId('less-btn').setText("Less");
		this.getView().byId('less-btn').setIcon('sap-icon://up');
		this.intialHeightOfParties = 0;
		
		this.getView().byId('details_page').setShowFooter(true);
		
		if(key == 'people' || key == 'orders' || key == 'comments'){
			this.getView().byId('less-btn').setVisible(false);
			this.getView().byId('order-details-tabel').setVisible(false);
			this.getView().byId('details_page').setShowFooter(false);
			
		}
	
	},
	/*
	 * Prev Page Handler
	 */
	handlePrevPage: function(evt){
		
		if(this.changedData.length > 0){
			this.handelCancelChanges(true);
		}
		else{
			if(this.isNewelyLoaded){
  				this.oLoadingDialog.open();
  				oService.intialSalesOrderList();
  				this.isNewelyLoaded = false;
  			}
			this._oRouter.navTo("_searchInvoice");
			this.displayOrHide(false);
		}
			
	},
	/* Construct the Comments & Replies data structure */
	
	buildCommentsRepliesDataStructure: function(commentsListModel){
		
		console.log(commentsListModel);
		
		var parent = this;
		
		/* Step-1 Get Parent Comments*/
		var final_result = [];
		
		var parentComments = (commentsListModel.oData.results).filter(function(value, index){ return (value.PARENT_TEXTS_KEY == ''); }); 
		//console.log(parentComments);
		
		/* Step2 Loop Through all Parent Comments */
		$.each(parentComments, function(index, value){
			
			/*
			 * Step 3: buildInnerChildsForComments is a recursive function for finding the inner childs
			 */
			value = parent.buildInnerChildsForComments(value, commentsListModel);
			final_result.push(value);
		});
		
		commentsListModel.oData.results = final_result;
		
		return commentsListModel;
	},
	/*
	 * Recursion function for finding the child Comments
	 */
	buildInnerChildsForComments: function(parentValue, commentsListModel){
		var parent = this;
		
		//finding child elements
		var childComments = (commentsListModel.oData.results).filter(function(value, index){ return (value.PARENT_TEXTS_KEY == parentValue.TEXTS_KEY); });
		parentValue.childComments = []; //intializing the Child Comments to empty array
		
		//Finding the childs of each child element 
		
			$.each(childComments, function(index, value){
				//recursive call for finding inner childs
				value = parent.buildInnerChildsForComments(value, commentsListModel);
				parentValue.childComments.push(value); //pushing the finding data..
			});
		
		return parentValue;
	},
	onAfterRendering: function(){
		
		var target = this;
		$("body").on("click", ".sapMFeedListItemFooter>span[id$='-info']:first-child", function(event){
			
			//Parent Comment
			
			/*
			 * Getting the Current Comment id by using the custom class 'parent comment' which is added in the formatter
			 * 
			 * Get the Current Binding Context of the Comment
			 * 
			 * Get the Model and 
			 * 
			 */
			
			var parentCommentId = ($(this).parents('.parentComment')).attr('id');
			
			var currentCommentSAPInstance = sap.ui.getCore().byId(parentCommentId);
			
			orderDetailsPagePointer.currentCommentBindingContextPath = currentCommentSAPInstance.getBindingContextPath(); //global variables
			
			var model_data = (currentCommentSAPInstance.getModel()).getProperty(orderDetailsPagePointer.currentCommentBindingContextPath);
			
			var popupData = new sap.ui.model.json.JSONModel();
			popupData.setData(model_data);
			
			if(!target.replyPopUp){
				target.replyPopUp = sap.ui.xmlfragment("sap.ui.fisa.view.ReplyPopup", target);
				target.getView().addDependent(target.replyPopUp);
			}
			
			//assign the Model to the reply Popup
			// Get the ID from the comment)_____
			// From the Id,m get the LongText object - x = sap.ui.getCore().byId('__xmlview0--commentSection').getModel().oData.results[0]
			// Create a JSON model with the above resuly
			// Set the above result as Model for the popup
			
			target.replyPopUp.setModel(popupData);
			target.replyPopUp.open();
			
		});
	},
	onReplyDialogCloseButton: function(evt){
		this.replyPopUp.close();
	},
	/*
	 * This function handles the Reply for the Comment 
	 * 
	 */
	commentPostHandler: function(evt){
		this.oLoadingDialog.open();
		var replyPopup  =sap.ui.getCore().byId('replyPopup');
		
		var oData = (replyPopup.getModel()).oData;
		
		var requestedModel = {"DOC_ID": oData.DOC_ID, "NOTES": sap.ui.getCore().byId('popOverCommentBox').getValue(), "DOC_CATEGORY": oData.DOC_CATEGORY, "TEXT_ID": oData.TEXT_ID, "REPLYABLE" : 'X', "PARENT_TEXTS_KEY":  oData.TEXTS_KEY}
		console.log(requestedModel);
		oService.postComments(requestedModel, this.onSuccessReplyPost);
	},
	/*
	 * Success Handler for the Reply
	 */
	onSuccessReplyPost: function(data, oResponse, aErrorResponses){
		
		if(data.MESSAGE_TYPE == 'E'){
			sap.m.MessageBox.show(
					data.MESSAGE, {
  			        title: "Error !",
  			        actions: [sap.m.MessageBox.Action.OK],
  			        onClose: function(oAction) {
  			        	
  			        }
  			      }
  			  );
			
		}
		else{
			
			/*
			 * 1 -- Getting Current Data binding from the replypopup box
			 * 
			 * 2 -- Add the child comments to the newly created Comment.
			 * 
			 * 3 -- Getting the Current Binding Context path for the ReplypopupBox (currentCommentBindingContextPath).
			 * 
			 * 4 -- Insert the modified new comment to the child comments of the current binding path.
			 * 
			 * 5 -- Refresh the Model 
			 * 
			 */

			data.childComments = []; //intializing the child comments to new Data
			
			
			var commentsModelData = orderDetailsPagePointer.getView().byId('commentSection').getModel();
			
			var final_path = orderDetailsPagePointer.currentCommentBindingContextPath+'/childComments';
			var currentChildComments = commentsModelData.getProperty(final_path); //array of the current child comments
			currentChildComments.push(data);
			
			commentsModelData.setProperty(final_path, currentChildComments);
			
			
			orderDetailsPagePointer.getView().byId('commentSection').setModel(commentsModelData);
			
			
			
			console.log(commentsModelData);
			
	
			orderDetailsPagePointer.oLoadingDialog.close();
			
			orderDetailsPagePointer.replyPopUp.close();
			
			
			
			//reset the data in comment box
			sap.ui.getCore().byId('popOverCommentBox').setValue("");
			sap.ui.getCore().byId('postComment').setEnabled(false);
			
			orderDetailsPagePointer.getView().byId('commentSection').getModel().refresh();
			
			orderDetailsPagePointer.getView().byId('commentSection').rerender();
		}
		
	},
	/*
	 * success Handler for the Comment
	 */
	onSuccessCommentPost: function(data, oResponse , aErrorResponses){
		
		if(data.MESSAGE_TYPE == 'E'){
			orderDetailsPagePointer.oLoadingDialog.close();
			console.log(data);
			sap.m.MessageBox.show(
					data.MESSAGE, {
  			        title: "Error !",
  			        actions: [sap.m.MessageBox.Action.OK],
  			        onClose: function(oAction) {
  			        	
  			        }
  			      }
  			  );
		}
		else{
			var modelData = orderDetailsPagePointer.getView().byId('commentSection').getModel();
			modelData.oData.results.push(data);
		
			orderDetailsPagePointer.getView().byId('commentSection').setModel(modelData);
			modelData.refresh();
			orderDetailsPagePointer.changedData = [];
			orderDetailsPagePointer.oLoadingDialog.close();
			
		}
		
		
	},
	/*
	 * Post the New Comment to backend
	 */
	handlePostNewComment: function(evt){
		var selectedCategory = (this.getView().byId('commentCategoryGroup').getSelectedButton()).getText();
		console.log(selectedCategory);
		var catKey = '';
		if(selectedCategory == 'General Comments'){
			catKey = 'GEN';
		}
		else if(selectedCategory == 'Shipping Information'){
			catKey = 'SHIP';
		}
		else if(selectedCategory == 'Carrier Information'){
			catKey = 'CARR';
		}
		
		var listModel = this.getView().byId('details_page').getModel();
		var requestedModel = {"DOC_ID": listModel.oData.DOC_ID, "NOTES": (evt.getSource()).getValue(), "DOC_CATEGORY": '', "TEXT_ID": catKey, "REPLYABLE" : 'X'}
		console.log(requestedModel);
		oService.postComments(requestedModel, this.onSuccessCommentPost);
		
	},
	/*
	 * handleLiveChangeEventOnCommentBox
	 */
	handleLiveChangeEventOnCommentBox: function(evt){
		console.log(evt.getSource());
		//postComment
		var val = (evt.getSource()).getValue();
		if(val.length == 0){
			sap.ui.getCore().byId('postComment').setEnabled(false);
		}
		else{
			sap.ui.getCore().byId('postComment').setEnabled(true);
		}
	},
	/*Footer Buttons Actions
	 * 
	 */
	handelEditOrders: function(evt){
		
		
		
		this.displayOrHide(true);
		//Enable the edited rows.
		
		
	},
	handleSaveOrders: function(){
		
		this.oLoadingDialog.open();
		console.log(this.updateModel);
		var d = this.updateModel.oData;
		var parent = this;
		//console.log(sap.ui.getCore().getModel("salesOrderDetailsModel"));
		
		var results = [];
		$(this.changedData).each(function(index, val){
			/* Unwanted Data in list items*/
			delete val.infoMsgData;
			delete val.infoMsgs;
			delete val.itemPartyInfoData;
			delete val.shippingInfoMsgs;
			delete val.warningMsgData;
			delete val.warringMsgs;
			
			
		});
		d.SDocItmSet.results = this.changedData; //updating the 
		
		/* This for temprory */
		this.partyData = d.SDocPartySet;
		this.msgData = d.SDocMessageSet;
		
		/* Unwanted Data */
		delete d.partiesInfo;
		delete d.__metadata;
		delete d.DynDropDownListSet;
		delete d.SDocAttachmentSet;
		delete d.SDocMessageSet;
		delete d.SDocPartySet;
		delete d.SDocTextSet;
		
		
		oService.updateOrderItems(d, this.onSuccessSave);
	},
	
	/*
	 * Show / hide the editable columns by using boolean flag.
	 * 
	 */
	displayOrHide: function(flag){
		
		//footer buttons
		this.getView().byId('editOrders').setVisible(!flag);
		this.getView().byId('saveOrders').setVisible(flag);
		this.getView().byId('cancel').setVisible(flag);
		
		/* Columns */
		this.getView().byId('quantity').setVisible(!flag);
		this.getView().byId('editQuantity').setVisible(flag);
		this.getView().byId('requestedDeliveryDate').setVisible(!flag);
		this.getView().byId('editRequestedDeliveryDate').setVisible(flag);
		this.getView().byId('itemDelete').setVisible(flag);
		this.getView().byId('lastColumnItemDelete').setVisible(flag);
		
		
		if(flag == false){
			this.getView().byId('saveOrders').setEnabled(false);
		}
		
		
	},
	onSuccessSave: function(data){
		
		var oSapMessage = data.__batchResponses[0].__changeResponses[0].headers["sap-message"];
		var oData = data.__batchResponses[0].__changeResponses[0].data;
		if (oSapMessage) {
			detailPagePointer.oLoadingDialog.close();
			var oSapMessage = JSON.parse(oSapMessage).message;
			orderDetailsPagePointer.showError("ERROR",oSapMessage);
			//detailPagePointer.refBusyDialog.close();
			return;
		}
		if (oData.MSG_TYPE == 'E') {
			
			orderDetailsPagePointer.showError("ERROR",oData.MESSAGE);
			
		} else {
			
				
			
			var oModel = sap.ui.getCore().getModel("salesOrderDetailsModel");
			
			//appending previously saved SDocPartySet Data
			oData.SDocPartySet = orderDetailsPagePointer.partyData;
			
			oData.SDocMessageSet = orderDetailsPagePointer.msgData;
			
			var updatedListModel = orderDetailsPagePointer.addPopoverIconsToModel(oData);
			
			oModel.setData(updatedListModel,true);
			
			orderDetailsPagePointer.displayOrHide(false);
			
			this.updatedModel = '';
			orderDetailsPagePointer.oLoadingDialog.close();
			sap.m.MessageToast.show(oData.MESSAGE);
			
		}
	},
	showError : function(oTitle,oMessage, messagetype){
		var refThis = this;
		sap.m.MessageBox.show(oMessage, {
		      icon : sap.m.MessageBox.Icon.ERROR,
		      title : oTitle,
		      actions : [sap.m.MessageBox.Action.CLOSE],
		      onClose : function(oAction) { 
		    	  orderDetailsPagePointer.oLoadingDialog.close();
		    	  orderDetailsPagePointer.displayOrHide(false);
		      },
		      dialogId : "messageBoxId" 
		    });
	},
	handelCancelChanges: function(isBackNav){
		var parent = this;
		if(this.changedData.length > 0){
			sap.m.MessageBox.show('Do you want to leave without saving?', {
			      icon : sap.m.MessageBox.Icon.WARNING,
			      title : 'Warning',
			      actions : [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
			      onClose : function(oAction) { 
			    	  console.log(isBackNav);
			    	  //detailPagePointer.oLoadingDialog.close();
			    	  if(oAction == 'OK' && isBackNav != true){
			    		  console.log(oAction);
			    		  orderDetailsPagePointer.oLoadingDialog.open();
				    	  var parentModel = sap.ui.getCore().getModel("salesOrderDetailsModel");
				    	  console.log(parentModel.oData.DOC_ID);
				    	  
				    	  orderDetailsPagePointer.isDataCanceled = true;
				    	  oService.getSaleOrderDetails(parentModel.oData.DOC_ID);
				    	  orderDetailsPagePointer.changedData = []; //resetting the changed data
				    	  orderDetailsPagePointer.displayOrHide(false);
			    	  }
			    	  else if(oAction == 'OK' && isBackNav){
			    		  orderDetailsPagePointer.displayOrHide(false);
			    		  
				    		//this.getView().destroy();
				  			if(orderDetailsPagePointer.isNewelyLoaded){
				  				orderDetailsPagePointer.oLoadingDialog.open();
				  				oService.intialSalesOrderList();
				  				orderDetailsPagePointer.isNewelyLoaded = false;
				  			}
				  			 orderDetailsPagePointer.changedData = []; //resetting the changed data
			    		  //for backbutton
			    		  orderDetailsPagePointer._oRouter.navTo("_searchInvoice");
			    	  }
			    	  
			      },
			      dialogId : "cancelMessageBoxId" 
			    });
		}
		else{
			//if i don't have any changes
			orderDetailsPagePointer.displayOrHide(false);
		}
			
		
	},
	/*
	 * Track Table Changes
	 */
	trackQuantityChanges: function(evt){
	
		var src = evt.getSource();
		
		/* Intialize the Updated Odata */
		this.initializeUpdatedOData();
		
		/* get the current Context Path*/
		var contextPath = ((evt.getSource()).getBindingContext()).getPath();
		
		this.updateModel.setProperty(contextPath+'/QUANTITY_T', src.getValue());
		this.updateModel.setProperty(contextPath+'/QUANTITY_T_X', 'X');
		var currentBindedData = this.updateModel.getProperty(contextPath);
		
		this.buildChangedData(currentBindedData);
		
		console.log(this.updateModel.getProperty(contextPath));
		this.getView().byId('saveOrders').setEnabled(true);
		
		
	},
	trackDeliveryDateChanges: function(evt){
		
		
		/* Intialize the Updated Odata */
		this.initializeUpdatedOData();
		var contextPath = ((evt.getSource()).getBindingContext()).getPath();
		
		
		var changedValue = (evt.getSource()).getValue();
		
		
		this.updateModel.setProperty(contextPath+'/REQ_DELV_DATE', changedValue);
		this.updateModel.setProperty(contextPath+'/REQ_DELV_DATE_X', 'X');
		
		
		var currentBindedData = this.updateModel.getProperty(contextPath); //after updating
		this.buildChangedData(currentBindedData);
		console.log(this.updateModel.getProperty(contextPath));
		this.getView().byId('saveOrders').setEnabled(true);
		
		
	},
	handleItemDeletion: function(evt){
		this.initializeUpdatedOData();
		
		var contextPath = ((evt.getSource()).getBindingContext()).getPath();
		var currentBindedData = this.updateModel.getProperty(contextPath);
		var parent = this;
		var data = this.updateModel.getProperty(contextPath);
		
		/* if the parent has the child elements we need to set those child items deleted flag to X */
		var childElements = (this.updateModel.oData.SDocItmSet.results).filter(function(item, index){ return item.PARENT_ITEM_ID == data.ITEM_ID; });
		
		
		if(childElements.length>0){
			$.each(childElements, function(index, child){
				child.DELETED = 'X';
				parent.buildChangedData(child);
			});
		}
		
		
		
		this.updateModel.setProperty(contextPath+'/DELETED', 'X');
		
		
		this.buildChangedData(data);
		
		
		console.log(this.updateModel);
		
		this.getView().byId('saveOrders').setEnabled(true);
		
	},
	
	initializeUpdatedOData: function(){
		if(this.updatedModel == undefined || this.updatedModel == ''){
			this.updateModel = sap.ui.getCore().getModel("salesOrderDetailsModel");
		}
		//console.log(this.updateModel);
	},
	buildChangedData: function(changedData){
		
		//initial state
		if(this.changedData.length == 0){
			this.changedData.push(changedData);
		}
		else{
			
			
			var filterData = (this.changedData).filter(function(value, index){ return changedData.ITEM_ID == value.ITEM_ID; });
			//for excluding repeated data changing...
			if(filterData.length == 0){
				this.changedData.push(changedData);
			}
		
		}
		//console.log(this.changedData);
	}
	
	
	

});