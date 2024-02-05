/**
 * 起動処理
 * 拡張機能のアイコンがクリックされたときに実行される処理
 * content.jsへKindleのメモ取得依頼メッセージを送信する
 */
chrome.tabs.query({},function(tabs){
	// メモの取得依頼メッセージ送信
	chrome.tabs.query({ active: true, currentWindow: true}, initialMessage);
});

// 書籍タイトルのコピーイベントを登録
let bookTitleCopyBtn = document.getElementById("bookTitleCopyBtn");
bookTitleCopyBtn.addEventListener("click", () => {
	let eBookTitle = document.getElementById("bookTitle");
	let bookTitle = "";
	if (eBookTitle != null) {
		bookTitle = eBookTitle.value;
	}
	copyClipboad(bookTitle, bookTitleCopyBtn);
}, false);
// 書籍のメモをコピーするイベント登録
let bookMemoCopyBtn = document.getElementById("bookMemoCopyBtn");
bookMemoCopyBtn.addEventListener("click", () => {
	let eBookMemo = document.getElementById("bookMemo");
	let bookMemo = "";
	if (eBookMemo != null) {
		bookMemo = eBookMemo.value;
	}
	copyClipboad(bookMemo, bookMemoCopyBtn);
})



// Content.jsから受け取った書籍タイトルと書籍メモをテキストエリアに表示する処理を登録
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// 拡張機能をクリック時に取得したbookTitleをテキストエリア(ID: bookTitle)に表示する
	if (request.name === "content:popup:bookTitleAndMemo") {
		// 書籍タイトルが空欄のときは正常に取得できなかったため、エラー処理を行う
		if (request.message.Title == "") {
			alert("エラー");
			let eMemoArea = document.getElementById("memoArea");
			eMemoArea.style.display = 'none';
			return;
		}
		let eTitle = document.getElementById("bookTitle");
		if (eTitle != null) {
			eTitle.value = request.message.Title;
		}
		let eMemo = document.getElementById("bookMemo");
		if (eMemo != null) {
			eMemo.value = request.message.Memo;
		}
	}
});

/**
 * 現在開いているタブにデータを送信する
 */
function initialMessage(tabs) {
	// 現在開いているタブにメッセージを送る(send_data, callbackは省略可能)
	let promise = chrome.tabs.sendMessage(tabs[0].id, { name: "popup:content:initial"});
	promise.then((response) => {
		// 成功
		let eMemoArea = document.getElementById("memoArea");
		eMemoArea.style.display = 'block';
		let eErrorMessage = document.getElementById("errorMessage");
		eErrorMessage.style.display = 'none';

	})
	.catch((error) => {
		// 失敗
		let eMemoArea = document.getElementById("memoArea");
		eMemoArea.style.display = 'none';
		let eErrorMessage = document.getElementById("errorMessage");
		eErrorMessage.style.display = 'block';
	});
}

/**
 * クリップボードへのコピー処理
 * @param {copyText} コピー対象の文字列
 */
function copyClipboad(copyText, eDom) {
	// クリップボードにコピーできるかをチェック
	if(!navigator.clipboard) {
		alert("コピーできません。");
	}

	// コピー実行
	let promise = navigator.clipboard.writeText(copyText);
	promise.then((response) => {
		eDom.innerHTML = "Copied!"
		// 1秒後にボタンの文字列を「Copy」に変更する。
		setTimeout(() => (eDom.innerHTML = 'Copy'), 1000);
	}).catch((error) => {
		alert("コピーに失敗しました。");
	});
}
