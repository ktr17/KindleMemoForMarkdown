chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Backgroundの実行");
  // 期待通りのリクエストかどうかをチェック
  if (request.name === 'displayUrl:background') {
		console.log("リクエスト名: " +  request.name);
    var url;
    var id;

    console.log("background.js");
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs.length <= 0){
				try {
					console.log(tabs[0]);
				} catch (error){
					console.log(error);
				}
				return;
			}
      url = tabs[0].url;
      id = tabs[0].id
      console.log("url: " + url);
      console.log("id: " + id);

      let promise = chrome.tabs.sendMessage(id, { message: "test", name: "download:memo"});
			promise.then((response) => {
				console.log("送出完了");

			}).catch((error) => {
				console.log(error);
			});
    });
  }
});

async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab;
}

