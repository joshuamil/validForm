/**
 * ValidForm Plugin
 *
 * Use defaults: $.fn.validForm.defaults.foo = "bar";
 * Use defaults: $('form').validForm({foo: "bar"});
 *
 */

(function ($){

  $.fn.validForm = function(options) {

    // Default options
    var defaults = {
      event: "onsubmit",
      onSuccess : function() {},
      onFailure : function() {},
      targetSeparator : "<br/>",
      stopOnFirstError : false
    };

    // Expose settings
    // Use defaults: settings.foo
    var settings = $.extend( {}, defaults, options );

    // Set a local variable for the object
    var elem = $(this);
    var field;

    // Reset the target field
    var tgt = $(settings.target);

    // Loop through form elements
    $(this).on(settings.event,function(e){

      // Reset the target container
      tgt.removeClass('active').html('');

      $('form *').filter(':input').each(function(){

        // Reference to the current field
        field = $(this);

        // Check required condition
        if(
          (
            (field.attr("data-validation") && field.attr("data-validation").indexOf('required') > -1) &&
            (
              (field.prop("nodeName").toLowerCase() === "input" && field.attr("type") === "checkbox" && !field.is(':checked')) ||
              (field.prop("nodeName").toLowerCase() === "input" && field.val() === "") ||
              (field.prop("nodeName").toLowerCase() === "textarea" && field.val() === "") ||
              (field.prop("nodeName").toLowerCase() === "select" && field[0].selectedIndex === 0)

            )
          )
        ){

          // Stop the submission of the form
          e.preventDefault();

          // Log the validation failure
          console.log("Failed: " + field.attr("data-message"));

          // Populate the error target
          if(tgt.html().length > 0){
            tgt.html(tgt.html() + settings.targetSeparator);
          }

          // Add the message to the end of the target
          tgt.addClass('active').html(tgt.html() + field.attr("data-message"));

          // Stop processing if configured
          if(settings.stopOnFirstError === true){
            return false;
          }

        }

      });

    });


    // Enable callbacks
    settings.onSuccess.call();
    settings.onFailure.call();

    return this;
  };

}(jQuery));
