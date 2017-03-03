;(function($) {
  "use strict";

  var defaults;
  
  var show = function(params) {

    var mask = $("<div class='ui-mask ui-actions-mask'></div>").appendTo(document.body);

    var actions = params.actions || [];

    var actionsHtml = actions.map(function(d, i) {
      return '<div class="ui-actionsheet-cell ui-light ' + (d.className || "") + '">' + d.text + '</div>';
    }).join("");

    var titleHtml = "";
    
    if (params.title) {
      titleHtml = '<div class="ui-actionsheet-title">' + params.title + '</div>';
    }

    var tpl = '<div class="ui-actionsheet " id="ui-actionsheet">'+
                titleHtml +
                '<div class="ui-actionsheet-menu">'+
                actionsHtml +
                '</div>'+
                '<div class="ui-actionsheet-action">'+
                  '<div class="ui-actionsheet-cell ui-actionsheet-cancel ui-light">取消</div>'+
                  '</div>'+
                '</div>';
    var dialog = $(tpl).appendTo(document.body);

    dialog.find(".ui-actionsheet-menu .ui-actionsheet-cell, .ui-actionsheet-action .ui-actionsheet-cell").each(function(i, e) {
      $(e).click(function() {
        $.closeActions();
        params.onClose && params.onClose();
        if(actions[i] && actions[i].onClick) {
          actions[i].onClick();
        }
      })
    });

    mask.show();
    dialog.show();
    mask.addClass("ui-mask-visible");
    dialog.addClass("ui-actionsheet-toggle");
  };

  var hide = function() {
    $(".ui-mask").removeClass("ui-mask-visible").transitionEnd(function() {
      $(this).remove();
    });
    $(".ui-actionsheet").removeClass("ui-actionsheet-toggle").transitionEnd(function() {
      $(this).remove();
    });
  }

  $.actions = function(params) {
    params = $.extend({}, defaults, params);
    show(params);
  }

  $.closeActions = function() {
    hide();
  }

  $(document).on("click", ".ui-actions-mask", function() {
    $.closeActions();
  });

  var defaults = $.actions.prototype.defaults = {
    title: undefined,
    onClose: undefined,
    /*actions: [{
      text: "菜单",
      className: "color-danger",
      onClick: function() {
        console.log(1);
      }
    },{
      text: "菜单2",
      className: "color-success",
      onClick: function() {
        console.log(2);
      }
    }]*/
  }

})($);
