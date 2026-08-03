// ============ 送出測驗結果到 Google 表單（隱藏 iframe 方式） ============

function formatWrongDetailsText(wrongDetails) {
  if (!wrongDetails || !wrongDetails.length) return '（沒有錯題，全部答對！）';
  return wrongDetails.map(function (w, i) {
    return (i + 1) + '. ' + w.question +
      '\n   你的答案：' + w.yourAnswer +
      '\n   正確答案：' + w.correctAnswer +
      '\n   解析：' + w.explanation;
  }).join('\n\n');
}

function submitResultToForm(payload) {
  if (!CONFIG.FORM_ACTION_URL || CONFIG.FORM_ACTION_URL.indexOf('http') !== 0) {
    console.warn('尚未設定 Google 表單網址（CONFIG.FORM_ACTION_URL），成績不會被送出。');
    return;
  }

  var iframeName = 'hidden_submit_frame';
  var iframe = document.getElementById(iframeName);
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = iframeName;
    iframe.id = iframeName;
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  var form = document.createElement('form');
  form.action = CONFIG.FORM_ACTION_URL;
  form.method = 'POST';
  form.target = iframeName;
  form.style.display = 'none';

  function addField(entryKey, value) {
    var entryName = CONFIG.ENTRY[entryKey];
    if (!entryName) return;
    var input = document.createElement('input');
    input.type = 'hidden';
    input.name = entryName;
    input.value = value;
    form.appendChild(input);
  }

  addField('name', payload.name || '');
  addField('classSeat', payload.classSeat || '');
  addField('categories', (payload.categories || []).join('、'));
  addField('totalQuestions', String(payload.totalQuestions || 0));
  addField('correctCount', String(payload.correctCount || 0));
  addField('wrongCount', String(payload.wrongCount || 0));
  addField('wrongDetails', formatWrongDetailsText(payload.wrongDetails));

  document.body.appendChild(form);
  form.submit();
  setTimeout(function () { document.body.removeChild(form); }, 1000);
}
