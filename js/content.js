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
		bookMemo = eBookMemos[i].getElementsByClassName("a-size-base-plus a-color-base");
		memoPosition = eBookMemos[i].getElementsByClassName("a-size-small a-color-secondary kp-notebook-selectable kp-notebook-metadata");
		if (bookMemo.length){
			console.log(bookMemo);
			// メモ箇所を取得
			if (bookMemo.note.innerText != "") {
				let newstr = bookMemo.note.innerText.replace('■', '## ');
				retMemoText += newstr + "\n\n";
			}
			// ハイライト箇所を取得
			if (bookMemo.highlight.innerText != "") {
				retMemoText += "■ハイライト\n> " + bookMemo.highlight.innerText + "\n" + memoPosition[1].innerText + "\n\n";
			}
		}
	}
	return retMemoText;

}

/**
 * メモを取得する
 */
function getMemo() {
	let queryBookImg = "#annotation-scroller > div > div.a-row.a-spacing-base > div.a-column.a-span1.kp-notebook-bookcover-container > a > span > img";
	let bookAmazonUrlQuery = "#annotation-scroller > div > div.a-row.a-spacing-base > div.a-column.a-span1.kp-notebook-bookcover-container > a";
	let bookTitleQuery = "#annotation-scroller > div > div.a-row.a-spacing-base > div.a-column.a-span5 > h3";


	// 書籍の画像URLを取得
	let eBookImg = getElement(queryBookImg);
	let bookImgSrc = "";
	if (eBookImg != null) {
		bookImgSrc = eBookImg.src;
	}

	// 書籍のAmazonリンクを取得
	let eBookUrl = getElement(bookAmazonUrlQuery);
	let bookAmazonUrl = "";
	if (eBookUrl != null) {
		bookAmazonUrl = eBookUrl.href;
	}

	// 書籍のタイトルを取得
	let bookTitle = getBookTitle();

	// メモの内容を取得
	let eBookMemos = document.getElementById("kp-notebook-annotations").children;

	// メモを取得して、マークダウンに変換する処理
	let downloadText = "";
	for (var i = 0; i < eBookMemos.length; i++){
		bookMemo = eBookMemos[i].getElementsByClassName("a-size-base-plus a-color-base");
		memoPosition = eBookMemos[i].getElementsByClassName("a-size-small a-color-secondary kp-notebook-selectable kp-notebook-metadata");
		if (bookMemo.length){
			if (bookMemo.note.innerText != ""){
				let newstr = bookMemo.note.innerText.replace('■', '## ');
				downloadText += newstr + "\n" + memoPosition[1].innerText + "\n\n";
			}
		}
	}
}

/**
 * メッセージに対する処理を登録
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// 初期化処理(拡張機能を実行時)
	if (request.name === "popup:initial") {
		console.log("content.js : " + request.name);
		let bookTitle = getBookTitle();
		let bookMemo = getBookMemo();
		let promise = chrome.runtime.sendMessage({ name: "content:popup:bookTitleAndMemo", message: {Title: bookTitle, Memo: bookMemo}});
		promise.then((response) => {
			// 成功
		})
		.catch((error) => {
			// 失敗
			console.log(error);
		});
	}

	if (request.name === "download:memo") {
		let promise = chrome.runtime.sendMessage({ name: "update", message: "サンプルタイトル" });
		promise.then((response) => {
			console.log("サンプルタイトルの送信");
		})
		.catch((error) => {
			console.log(error);
		});
		getMemo();
	}

});

