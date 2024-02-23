/**
 * クエリを受け取り、domを返却する
 */
function getElement(domQuery) {
  let eDom = document.querySelector(domQuery);
  return eDom;
}

/**
 * 書籍タイトルを取得する
 */
function getBookTitle() {
  let bookTitle = "";
  let bookTitleQuery = "#annotation-scroller > div > div.a-row.a-spacing-base > div.a-column.a-span5 > h3";
  let eBookTitle = getElement(bookTitleQuery);
  if (eBookTitle != null) {
    bookTitle = eBookTitle.innerText;
  }
  return bookTitle;
}

/**
 * 書籍のメモを取得する
 */
function getBookMemo() {
  // メモの内容を取得
  let eBookMemos = document.getElementById("kp-notebook-annotations").children;

  // メモを取得して、マークダウンに変換する処理
  let retMemoText = "";
  for (var i = 0; i < eBookMemos.length; i++){
    try{
      bookMemo = eBookMemos[i].getElementsByClassName("a-size-base-plus a-color-base");
      memoPosition = eBookMemos[i].getElementsByClassName("a-size-small a-color-secondary kp-notebook-selectable kp-notebook-metadata");
      let firstLine = "";
      if (bookMemo.length){
        // メモ箇所を取得
        if (bookMemo.note.innerText != "") {
          // 1行目に見出し2を設定する
          retMemoText += "## " + bookMemo.note.innerText + "\n\n";
        }
        // ハイライト箇所を取得
        if (bookMemo.highlight.innerText != "") {
          retMemoText += "> " + bookMemo.highlight.innerText + "\n\n" + memoPosition[1].innerText + "\n\n";
        }
      }
    } catch {
      retMemoText += "申し訳ありませんが、このメモは「メモとハイライト」で表示されていません。" + "\n\n" + memoPosition[1].innerText + "\n\n";
    }
  }
  return retMemoText;

}

/**
 * 書籍の表紙イメージのリンクを取得するf
 */
function getBookImgLink() {
  // 書籍の表紙イメージ
  let eBookImgLink = document.querySelector("#annotation-scroller > div > div.a-row.a-spacing-base > div.a-column.a-span1.kp-notebook-bookcover-container > a > span > img");
  let retBookImgLink = "";
  if (eBookImgLink != null) {
    retBookImgLink = eBookImgLink.src;
  }
  return retBookImgLink;
}
/**
 * メッセージに対する処理を登録
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // 初期化処理(拡張機能を実行時)
  if (request.name === "popup:content:initial") {
    try {
      let bookTitle = getBookTitle();
      let bookMemo = getBookMemo();
      let bookImgLink = getBookImgLink();
      let promise = chrome.runtime.sendMessage({ name: "content:popup:bookTitleAndMemo", message: {Title: bookTitle, Memo: bookMemo, BookImgLink: bookImgLink}});
      promise.then((response) => {
        // 成功
      })
      .catch((error) => {
        // 失敗
        console.error(error);
      });
    } catch {
      console.log("エラー");
    }
  }
});

