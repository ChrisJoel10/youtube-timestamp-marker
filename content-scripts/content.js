console.log("extension 4 loaded");

document.addEventListener("keydown", timeStampListener);

function timeStampListener(event) {
    if (event.keyCode == 85) {
        let video = document.querySelector("#movie_player > div.html5-video-container > video");
        var currentTime = video.currentTime;

        const key = window.location.search;

        chrome.storage.local.get([key], function (result) {
            console.log('Value currently is ' + result[key]);
            var temp = result[key];
            if(temp == undefined)
                temp = [];
            temp.push({currentTime});
            chrome.storage.local.set({ [key]: temp }, function () {
                console.log('Value is set to ' + currentTime, key);
            });
        });
    }
}

chrome.runtime.onMessage.addListener(msgObj => {
    console.log(msgObj);
    const key = window.location.search;
    chrome.storage.local.get([key], function (result) {
        var temp = result[key];
        if(temp == undefined) return;
        let video = document.querySelector("#movie_player > div.html5-video-container > video");
        video.currentTime = temp[msgObj.selectedTimestamp].currentTime;
    });
});