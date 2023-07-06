const endpoint = "https://www.googleapis.com/youtube/v3";
const apikKey = "AIzaSyDbYlMKuKS9Nm2wWCM-20SDLe8f1M8TEkQ";

const container = document.getElementById("container");
container.innerHTML = `<p style="color: white;">Loading.....</p>`;

const searchElement = document.getElementById("search-input");
searchElement.value = "";
const search = document.getElementById("search");

async function getData(value) {
    try {
        const result = await fetch(`${endpoint}/search?key=${apikKey}&q=${value}&type=video&maxResults=20`, {
            method: "GET",
        });
        const data = await result.json();
        let videoData = await getVideoDetails(data);
        await renderDataIntoUi(videoData);
    }

    catch (error) {
        console.log(error.message)
    }
}

async function getVideoDetails(data) {
    let videoData = [];
    const videos = data.items;
    let videoDetails = [];
    for (let i = 0; i < videos.length; i++) {
        let video = videos[i];
        let videoId = video.id.videoId;
        const result = await fetch(`${endpoint}/videos?key=${apikKey}&part=snippet,contentDetails,statistics&id=${videoId}`, {
            method: "GET",
        });
        const videoDetails = await result.json();
        videoData.push(videoDetails);
    }
    return videoData;

}

function renderDataIntoUi(videosData) {
    container.innerHTML = '';
    for (let i = 0; i < videosData.length; i++) {
        let item = videosData[i].items[0];

        let videoId = item.id;
        let thumbnail = item.snippet.thumbnails.high.url;
        let title = item.snippet.localized.title;
        let channelName = item.snippet.channelTitle;
        let views = getViewCount(item.statistics.viewCount);
        const video = document.createElement("div");
        video.className = "video";
        video.innerHTML = `
                            <div class="thumbnail">
                            <img src="${thumbnail}" alt="thumbnail">
                            </div>
                            <div class="description">
                                <div class="left">
                                    <img src="./resources/Profile-pic.svg" alt="Channel-Logo">
                                </div>
                                <div class="right">
                                    <span style="color: white;">${title}</span>
                                    <p>${channelName}</p>
                                    <p>${views}. 1 week ago</p>
                                </div>
                            </div>`


        // console.log(videosData);
        video.addEventListener("click", playVideo);
        function playVideo() {
            localStorage.setItem("videoId", videoId);
            localStorage.setItem("apiKey", apikKey);


            const a = document.createElement("a");
            a.href = `http://127.0.0.1:5500/playvideo.html`;
            a.click();


        }

        container.appendChild(video);


    }
}

function getViewCount(view) {
    let views = parseInt(view);
    if (views / 1000 < 0) {
        return views + " views";
    }
    else if (views / 1000 < 1000) {
        return Math.floor(views / 1000) + "K views"
    }
    else if (views / 1000 < 1000000) {
        return Math.floor(views / 1000000) + "M views"
    }

    return Math.floor(views / 1000000000) + "B views"

}

function searchWeb() {
    container.innerHTML = `<p style="color: white;">Loading.....</p>`

    searchValue = searchElement.value;
    getData(searchValue);
}





getData("");
search.addEventListener("click", searchWeb);

searchElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        searchWeb();
    }
});
