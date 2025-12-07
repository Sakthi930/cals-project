$(function () {
  const $expr = $('#expr');
  const $resultText = $('#resultText');

  function appendVal(val) {
    const cur = $expr.val() || '';
    $expr.val(cur + val);
  }

  $('.btn').not('#equals,#clear').on('click', function () {
    const v = $(this).data('val');
    appendVal(v);
  });

  $('#clear').on('click', function () {
    $expr.val('');
    $resultText.text('—');
  });

  $('#equals').on('click', function () {
    let expression = $expr.val().trim();
    if (!expression) {
      $resultText.text('Enter expression');
      return;
    }

    // Normalize symbols: ÷ → /, × → *, comma -> .
    const exprToSend = expression.replace(/÷/g, '/').replace(/×/g, '*').replace(/,/g, '.');

    $.ajax({
      url: 'http://localhost:3000/calculate', // absolute URL ensures correct routing
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ expr: exprToSend }),
      success: function (data) {
        $resultText.text(data.result);
      },
      error: function (xhr, status, err) {
        let msg = 'Error';
        if (xhr && xhr.responseJSON && xhr.responseJSON.error) msg = xhr.responseJSON.error;
        else if (xhr && xhr.responseText) msg = xhr.responseText;
        console.error('Calc request failed', status, err, xhr);
        $resultText.text(msg);
      }
    });
  });

  // keyboard support
  $(document).on('keydown', function (e) {
    if ((e.key >= '0' && e.key <= '9') || ['+','-','*','/','(',')','%','.'].includes(e.key)) {
      appendVal(e.key);
    } else if (e.key === 'Enter') {
      $('#equals').click();
    } else if (e.key === 'Backspace') {
      const cur = $expr.val();
      $expr.val(cur.slice(0, -1));
    } else if (e.key.toLowerCase() === 'c') {
      $('#clear').click();
    }
  });
});
