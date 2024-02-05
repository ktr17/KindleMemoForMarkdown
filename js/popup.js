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

/**
 * 現在開いているタブにデータを送信する
 */
function initialMessage(tabs) {
	// 現在開いているタブにメッセージを送る(send_data, callbackは省略可能)
	chrome.tabs.sendMessage(tabs[0].id, { message: "test", name: "popup:initial"});

}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// 拡張機能をクリック時に取得したbookTitleをテキストエリア(ID: bookTitle)に表示する
	if (request.name === "content:popup:bookTitleAndMemo") {
		let eTitle = document.getElementById("bookTitle");
		if (eTitle != null) {
			eTitle.value = request.message.Title;
		}
		let eMemo = document.getElementById("bookMemo");
		if (eMemo != null) {
			eMemo.value = request.message.Memo;
		}
	}
	// 取得したメモをmemoエリアに表示
	if (request.name === "download:memo") {
	}
	if(request.name === "update") {
		let eTitle = document.getElementById("bookTitle");
		if (eTitle != null) {
			eTitle.innerText = request.message;
		}
	}
});

