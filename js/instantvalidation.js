/*
 * 	InstandValidation 2.0 - jQuery plugin
 *	written by Kent Heberling, http://www.khwebdesign.net	
 *	http://khwebdesign.net/blog/instant-validation-jquery-plugin/
 *
 *	Copyright (c) 2010 Kent Heberling (http://www.khwebdesign.net)
 *	Dual licensed under the MIT (MIT-LICENSE.txt)
 *	and GPL (GPL-LICENSE.txt) licenses.
 *
 *	Built for jQuery library
 *	http://jquery.com
 *
  To add a validation type:
  1) Add the validation class to var collection
  2) Add regx for the new type
  3) Add "isValid = regexCheck(inputValue,new reg ex)" to function validateInput(obj)
 */

(function($){  
	$.fn.instantValidation = function(options) {  
		// Default Values
		var defaults = {  
			fadeSpeed: 250,
			customTextValidation: undefined,
			customEmailValidation: undefined,
			customIntValidation: undefined,
			customPhoneValidation: undefined,
			customZipValidation: undefined,
			customSubmit: undefined
		};  
		var options = $.extend(defaults, options);  
		var isEmail_re = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.([\w\-\+_]+\.)?[\w\-\+_]{2,4}\s*$/;
		var isWebsite_re = /^((https?|ftp):\/\/)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;
		var isInt_re = /[-+]?\b\d+\b/ ;
		var isPhone_re = /[0-9]{3}-[0-9]{3}-[0-9]{4}/;
		var isZip_re = /\b\d{5}\b/;
		var arrowHeight, arrowWidth, errorMessage;
		var collection = ".requiredText,.emailAddress,.int,.phone,.zip,.website";
		
		var formCustomSubmitPending = false;
		var emailCustomValidationPending = false;
		var emailCustomValidationResult = false;

		return this.each(function() {  
			$(this).find(collection).each(function(){				   
				// Initializing Code
				$(this).after("<div class=\"error-message\">" + $(this).attr("title") + "<div class=\"error-message-arrow-border\"></div><div class=\"error-message-arrow\"></div></div>"); // create pop up validation message
				errorMessage = $(this).next();
				arrowHeight = $(errorMessage).children(".error-message-arrow-border").outerHeight()/2;
				arrowWidth = $(errorMessage).children(".error-message-arrow-border").outerWidth()/2; 
				$(errorMessage).css({top: $(this).offset().top, left: $(this).offset().left}); // Set pop-up to location of input
				
				if ($(this).hasClass("showBottom")){
					$(errorMessage).children(".error-message-arrow-border").addClass("error-message-arrow-border-bottom");
					$(errorMessage).children(".error-message-arrow").addClass("error-message-arrow-bottom");
					$(errorMessage).css({marginLeft: "0px", marginTop: ($(this).outerHeight() + arrowHeight)  + "px"});				
				} else if ($(this).hasClass("showLeft")){
					$(errorMessage).children(".error-message-arrow-border").addClass("error-message-arrow-border-left");
					$(errorMessage).children(".error-message-arrow").addClass("error-message-arrow-left");
					$(errorMessage).css({marginLeft: "-" + ($(errorMessage).outerWidth() + arrowWidth)+ "px", marginTop: "0px"});				
				} else if ($(this).hasClass("showRight")){
					$(errorMessage).children(".error-message-arrow-border").addClass("error-message-arrow-border-right");
					$(errorMessage).children(".error-message-arrow").addClass("error-message-arrow-right");
					$(errorMessage).css({marginLeft: ($(this).outerWidth(true) + arrowWidth)+ "px", marginTop: "0px"});				
				} else {
					$(errorMessage).children(".error-message-arrow-border").addClass("error-message-arrow-border-top");
					$(errorMessage).children(".error-message-arrow").addClass("error-message-arrow-top");
					$(errorMessage).css({marginLeft: "0px", marginTop: "-" + ($(errorMessage).outerHeight() + arrowHeight) + "px"});						
				}


				// Event Bindings
				$(this).blur(function (){	
					handlePopUp(validateInput($(this)),$(this));											  
				});
				// jquery can't find outerheight of elements with display none, and can't fade in/out elements with visibility, thus...	
				 $(errorMessage).css({visibility: "visible", display: "none"});
			});
			
			// Prevent form submission if invalid inputs exist
			//TODO Fix Behaviour to support ajax requests
			$(this).submit(function(event){
			  var submitForm = true;
				$(this).children(collection).each(function(){
					if (handlePopUp(validateInput($(this)),$(this))){ 
						submitForm = false;
					}
				});
				// if(submitForm && options.customSubmit){ //commented until async behaviour fixed
				// now rely on customSubmit implementation
				if(options.customSubmit){
				  runCustomSubmitFunction(options.customSubmit,this);
				  return false;
				} else {
				  return submitForm;
				}
			});
		});
		

		// Plugin Methods
		function validateInput(obj) {		
			var isValid = true;
			inputValue = $(obj).val();
			if (inputValue == ""){
				if (!($(obj).hasClass("orEmpty"))){
					isValid = false;
				}
			} else {
				if ($(obj).hasClass("emailAddress")){ // validate for a valid email address
					isValid = regexCheck(inputValue,isEmail_re);
					if (options.customEmailValidation && isValid){
					  runCustomCheckFunction(options.customEmailValidation,obj);
					  isValid = (emailCustomValidationPending)? false:emailCustomValidationResult ;
					}
				} else if ($(obj).hasClass("int")){ 
					isValid = regexCheck(inputValue,isInt_re);
				} else if (($(obj).hasClass("phone"))){
					isValid = regexCheck(inputValue,isPhone_re);
				} else if (($(obj).hasClass("zip"))){
					isValid = regexCheck(inputValue,isZip_re);
				} else if (($(obj).hasClass("website"))){
					isValid = regexCheck(inputValue,isWebsite_re);
				}				
			}
			return isValid;
		}	
		
		function handlePopUp(isValid,obj) {		
			if (isValid){
				obj.next(".error-message").fadeOut(options.fadeSpeed);
				return false;
			} else {
				obj.next(".error-message").fadeIn(options.fadeSpeed);
				return true;
			}
		}	
		
		function regexCheck(value, re) { return String(value).search (re) != -1;}
		
		function runCustomCheckFunction(func,obj) {
		  //TODO generalize to custom fields validation not just email
	    emailCustomValidationPending = true;
		  emailCustomValidationResult = false;
		  var customValidationHandler = function(validationResult){
		    emailCustomValidationPending = false;
		    emailCustomValidationResult = validationResult;
		    handlePopUp(emailCustomValidationResult,obj);
		  };
		  func(customValidationHandler);
	  }
	  
	  function runCustomSubmitFunction(func,form){
	    formCustomSubmitPending = true;
	    var customSubmitHandler = function(submitResult){
	      formCustomSubmitPending = false;
	      $(form).submit(function(e){
	        return submitResult;
	      });
	    };
	    func(customSubmitHandler);
	  }
	};  
})(jQuery);  



