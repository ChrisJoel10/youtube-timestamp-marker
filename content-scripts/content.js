console.log("extension 4 loaded");

document.addEventListener("keydown", timeStampListener);

function timeStampListener(event)
{
    if(event.keyCode == 85) {
        let video = document.querySelector("#movie_player > div.html5-video-container > video");
        video.currentTime = 10000;
    }
}