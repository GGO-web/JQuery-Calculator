$(function () {
  const displayInput = $('.calculator__display');
  const logs = $('.logs');

  function evil(fn) {
    try {
      return new Function('return ' + fn)();
    } catch {
      setValue('ERROR');
      $(displayInput).css('color', 'var(--color-red)');
      $(displayInput).addClass('calculator__display-error');
    }
  }

  function isOperator(value) {
    return /[+-/*]/g.test(value);
  }

  function getValue() {
    return $(displayInput).val();
  }

  function setValue(value) {
    $(displayInput).attr('value', value);
  }

  function addEquation(equation) {
    logs.prepend(`
      <li class="logs__item">
        <button aria-label="circle decoration" class="logs__item-circle button-reset"></button>
        <span class="logs__equation">${equation}</span>
        <button aria-label="remove equation" class="logs__item-remove button-reset">×</button>
      </li>
    `);

    if (/48/g.test(equation)) {
      $(logs).children(':first').find('.logs__equation').css('text-decoration', 'underline');
    }
  }

  $('.calculator__button').each(function () {
    $(this).on('click', function () {
      if ($(displayInput).hasClass('calculator__display-error')) {
        setValue('0');
        $(displayInput).removeClass('calculator__display-error');
        $(displayInput).css('color', '');
      }

      if ($(this).attr('id') === 'reset') {
        setValue('0');
      } else if ($(this).attr('id') === 'clear') {
        const withoutLastChar = getValue().slice(0, -1);

        if (!withoutLastChar) {
          setValue('0');
        } else {
          setValue(withoutLastChar);
        }
      } else if ($(this).attr('id') === 'equal') {
        const result = evil(getValue());

        if (!Number.isFinite(result)) {
          setValue('ERROR');
          $(displayInput).css('color', 'var(--color-red)');
          $(displayInput).addClass('calculator__display-error');
        } else {
          const precision = 4;
          addEquation(`${getValue()}=${result % 1 === 0 ? result : result.toFixed(precision)}`);
          setValue(result);
        }
      } else {
        if (isOperator($(this).text())) {
          const LAST = -1;
          const lastChar = getValue().slice(LAST);
          let value = getValue() + $(this).text();

          if (isOperator(lastChar)) {
            value = getValue().replace(lastChar, $(this).text());
          }

          setValue(value);
        } else if (getValue() === '0') {
          setValue($(this).text());
        } else {
          setValue(getValue() + $(this).text());
        }
      }
    });
  });

  $('.logs').on('click', function (event) {
    if ($(event.target).hasClass('logs__item-remove')) {
      $(event.target).parent().remove();
    } else if ($(event.target).hasClass('logs__item-circle')) {
      $(event.target).toggleClass('active');
    }
  });

  $('.logs').on('scroll', function () {
    console.log('Scroll Top: ', $(this).scrollTop());
  });
});
