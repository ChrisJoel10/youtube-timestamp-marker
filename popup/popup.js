document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        key = tabs[0].url.match('\\?.*')[0];
        chrome.storage.local.get([key], function (result) {
            console.log('Value currently is ' + result[key]);
            var temp = result[key];
            if(temp == undefined) return;
            var a = document.getElementsByClassName('content')[0];
            temp.forEach((e, i) => {
                var b = document.createElement('li');
                var c = document.createTextNode(milliseconds_to_minutesandSeconds(e.currentTime));
                var d = document.createElement('button'); d.value = i; d.innerHTML = 'Click'; d.addEventListener('click', onSubmitClick);
                var e = document.createElement('button'); e.value = i; e.innerHTML = 'Remove'; e.addEventListener('click', onRemoveClick);
                b.append(c);
                b.append(d);
                b.append(e);
                a.appendChild(b);
            });
        });
    });
    document.getElementById("clearall").addEventListener('click', onClearAll);
})

function onSubmitClick(event) {
    console.log(event.path[0].value);
    sendMessageToCurrentTab({selectedTimestamp: event.path[0].value});
}

function onRemoveClick(event) {
    callback = function (key, index) {
        chrome.storage.local.get([key], function (result) {
            var temp = result[key];
            if(temp == undefined) return;
            temp.splice(index, 1)
            chrome.storage.local.set({ [key]: temp }, function () {
                window.location.reload();
            });
        });
    }
    getKey(callback, event.path[0].value);
}


function onClearAll(event) {
    callback = function (key, value) {
        chrome.storage.local.remove([key], function () {
            window.location.reload();
        });
    }
    getKey(callback, undefined);
}


function sendMessageToCurrentTab(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response){
            console.log(response)
        });
    });
}

function milliseconds_to_minutesandSeconds(duration){
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}

function getKey(callback = undefined, ...args) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var key = tabs[0].url.match('\\?.*')[0];
        callback != undefined && callback(key, ...args);
    });
}