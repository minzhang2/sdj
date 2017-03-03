/* global $:true */
;(function($) {
  "use strict";

  $(document).on("click", ".ui-search-bar label", function(e) {
    $(e.target).parents(".ui-search-bar").addClass("ui-search-focusing");
  }) 
  .on("blur", ".ui-search-input", function(e) {
    var $input = $(e.target);
    if(!$input.val()) $input.parents(".ui-search-bar").removeClass("ui-search-focusing");
  })
  .on("click", ".ui-search-cancel", function(e) {
    var $input = $(e.target).parents(".ui-search-bar").removeClass("ui-search-focusing").find(".ui-search-input").val("").blur();
  })
  .on("click", ".ui-icon-clear", function(e) {
    var $input = $(e.target).parents(".ui-search-bar").find(".ui-search-input").val("").focus();
  });

})($);
