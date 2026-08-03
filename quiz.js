
// ============ 成語測驗引擎（練習模式／測驗模式共用） ============

function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function sample(arr, n) {
  return shuffle(arr).slice(0, n);
}

// 依選取的類別過濾成語池；categories 為空陣列時代表「全部類別」
function filterIdiomsByCategory(categories) {
  if (!categories || categories.length === 0) return IDIOM_DB.slice();
  return IDIOM_DB.filter(function (it) {
    return it.c.some(function (c) { return categories.indexOf(c) !== -1; });
  });
}

function filterExamByCategory(categories) {
  if (!categories || categories.length === 0) return EXAM_BANK.slice();
  return EXAM_BANK.filter(function (q) {
    if (!q.categories || q.categories.length === 0) return true; // 未分類題目一律納入
    return q.categories.some(function (c) { return categories.indexOf(c) !== -1; });
  });
}

// 產生「看釋義選成語」題目
function makeDefToIdiomQuestion(pool, subject, usedIdiomTexts) {
  var distractPool = IDIOM_DB.filter(function (it) {
    return it.i !== subject.i && usedIdiomTexts.indexOf(it.i) === -1;
  });
  var sameCat = distractPool.filter(function (it) {
    return it.c.some(function (c) { return subject.c.indexOf(c) !== -1; });
  });
  var candidates = sameCat.length >= 3 ? sameCat : distractPool;
  var distractors = sample(candidates, 3);
  var options = shuffle([subject].concat(distractors)).map(function (it) { return it.i; });
  var correctIndex = options.indexOf(subject.i);
  return {
    type: 'defToIdiom',
    stem: subject.d,
    stemLabel: '請選出符合下列釋義的成語：',
    options: options,
    correctIndex: correctIndex,
    explanation: subject.i + '：' + subject.d,
    hint: '提示：這個成語共 ' + subject.i.length + ' 個字，第一個字是「' + subject.i.charAt(0) + '」。',
    subjectIdiom: subject.i
  };
}

// 產生「看成語選釋義」題目
function makeIdiomToDefQuestion(pool, subject, usedIdiomTexts) {
  var distractPool = IDIOM_DB.filter(function (it) {
    return it.i !== subject.i && usedIdiomTexts.indexOf(it.i) === -1;
  });
  var distractors = sample(distractPool, 3);
  var options = shuffle([subject].concat(distractors)).map(function (it) { return it.d; });
  var correctIndex = options.indexOf(subject.d);
  return {
    type: 'idiomToDef',
    stem: subject.i,
    stemLabel: '請選出「' + subject.i + '」正確的釋義：',
    options: options,
    correctIndex: correctIndex,
    explanation: subject.i + '：' + subject.d,
    hint: '提示：這個成語屬於「' + subject.c[0] + '」。',
    subjectIdiom: subject.i
  };
}

// 轉換段考題庫題目為統一格式
function makeExamQuestion(q) {
  var letters = ['A', 'B', 'C', 'D'];
  var options = letters.map(function (l) { return q.options[l]; });
  var correctIndex = letters.indexOf(q.answer);
  var hintIdiom = null;
  if (q.matched_idioms && q.matched_idioms.length) {
    hintIdiom = q.matched_idioms[0];
  }
  return {
    type: 'exam',
    stem: q.stem,
    stemLabel: '',
    options: options,
    correctIndex: correctIndex,
    explanation: (q.explanation || '').replace(/^（\d+\.?/, '（').trim() || '（教材未提供詳解）',
    hint: hintIdiom ? ('提示：這一題與成語「' + hintIdiom + '」有關，可以先想想它的意思。') : '提示：請仔細閱讀題幹，先刪去明顯不合文意的選項。',
    subjectIdiom: hintIdiom || q.stem.slice(0, 6)
  };
}

/**
 * 組一份測驗
 * categories: string[]  選取的類別（空陣列＝全部）
 * count: number 題數（10~15）
 */
function assembleQuiz(categories, count) {
  var idiomPool = filterIdiomsByCategory(categories);
  var examPool = filterExamByCategory(categories);

  if (idiomPool.length < 8) {
    // 類別題庫太少，自動補上全部成語庫，避免無法出題
    idiomPool = IDIOM_DB.slice();
  }

  var examTarget = Math.min(Math.round(count * 0.4), examPool.length);
  var chosenExam = sample(examPool, examTarget);

  var remaining = count - chosenExam.length;
  var idiomShuffled = shuffle(idiomPool);
  var used = [];
  var generated = [];
  var idx = 0;
  while (generated.length < remaining && idx < idiomShuffled.length) {
    var subject = idiomShuffled[idx++];
    if (used.indexOf(subject.i) !== -1) continue;
    used.push(subject.i);
    var q = (generated.length % 2 === 0)
      ? makeDefToIdiomQuestion(idiomPool, subject, used)
      : makeIdiomToDefQuestion(idiomPool, subject, used);
    generated.push(q);
  }
  // pool 不夠時，允許重複補足（極端情況）
  while (generated.length < remaining && idiomPool.length > 0) {
    var subject2 = idiomShuffled[Math.floor(Math.random() * idiomShuffled.length)];
    var q2 = makeDefToIdiomQuestion(idiomPool, subject2, used);
    generated.push(q2);
  }

  var examQuestions = chosenExam.map(makeExamQuestion);
  var all = shuffle(generated.concat(examQuestions));
  return all.slice(0, count);
}

