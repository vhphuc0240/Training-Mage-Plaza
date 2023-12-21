/* eslint-disable no-invalid-this */

(function($) {
  'use strict';
  /* ==================================================================
  [ Validate ]*/
  const input = $('.Avada-Validate__Input .Avada-Login__Input');

  $('.Avada-Login__Button').on('click', function(event) {
    let check = true;

    for (let i = 0; i < input.length; i++) {
      if (validate(input[i]) === false) {
        showValidate(input[i]);
        check = false;
        event.stopImmediatePropagation();
      }
    }

    return check;
  });

  $('.Avada-Validate__Form .Avada-Login__Input').each(function() {
    $(this).focus(function() {
      hideValidate(this);
    });
  });

  function validate(input) {
    if ($(input).attr('type') === 'email' || $(input).attr('name') === 'email') {
      if (
        $(input)
          .val()
          .trim()
          .match(
            /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/
          ) == null
      ) {
        return false;
      }
    } else {
      if (
        $(input)
          .val()
          .trim() === ''
      ) {
        return false;
      }
    }
  }

  function showValidate(input) {
    const thisAlert = $(input).parent();

    $(thisAlert).addClass('alert-validate');
  }

  function hideValidate(input) {
    const thisAlert = $(input).parent();

    $(thisAlert).removeClass('alert-validate');
  }
})(jQuery);
