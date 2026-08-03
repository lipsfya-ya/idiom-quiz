// ============================================================
// 設定檔：請依照「部署與使用說明」文件填入你自己的資料
// ============================================================
var CONFIG = {
  // Google 表單「送出回應」用的網址，格式類似：
  // https://docs.google.com/forms/d/e/1FAIpQLSxxxxxxxxxxxxxxxx/formResponse
  FORM_ACTION_URL: 'https://docs.google.com/forms/d/e/1FAIpQLSfoIXHP02kCWYWv4UQix6gIciPv1uJxKWuPaYDb7sVKiQki8A/formResponse',

  // 表單各題對應的 entry.xxxxxxxxx 代號
  ENTRY: {
    name: 'entry.1202603',             // 姓名
    classSeat: 'entry.1967007406',     // 班級座號
    categories: 'entry.956597690',     // 測驗類別
    totalQuestions: 'entry.397522254', // 題數
    correctCount: 'entry.1329239015',  // 答對題數
    wrongCount: 'entry.1317844581',    // 答錯題數
    wrongDetails: 'entry.1974511819'   // 錯題明細
  },

  // 教師端網頁的密碼（僅為簡易防呆，非嚴格保護，請勿用於機密資料）
  TEACHER_PASSCODE: 'teacher',

  // 把 Google 試算表「回應」分頁發布到網路（CSV 格式）後取得的網址
  // 用於教師端自動載入成績儀表板；若留空或載入失敗，會改用下面的備援連結
  SHEET_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKMSUM2oHrjYk0XaUE2Uvb-0xkNphawIog3x2btVJhrxgmNDkZOe3A_R6llEXaSnBKkj7FNc2s5jCz/pub?gid=1595150972&single=true&output=csv',

  // Google 試算表的一般檢視／共用連結（備援用，一定要填寫）
  SHEET_VIEW_URL: 'https://docs.google.com/spreadsheets/d/1ysx3xEeqPgnqCVMpjCkK17K3YcP6oHGuNk7R0Rbz-WY/edit?usp=sharing'
};
