// const videoId = localStorage.getItem("videoId");
const videoId = localStorage.getItem("videoId");
const apiKey = "AIzaSyDbYlMKuKS9Nm2wWCM-20SDLe8f1M8TEkQ";
const endpoint = "https://www.googleapis.com/youtube/v3/";


const videoPlayer = document.getElementById("videoPlayer");

const videoContainer = document.getElementById("video-data");

async function fetchComments() {

    const result = await fetch(`${endpoint}comments?part=snippet&id=${videoId}&key=${apiKey}`);
    const comments = await result.json();
    console.log(comments)
}

async function getChannelDetails(channelId) {

    let result = await fetch(`${endpoint}channels?part=snippet,contentDetails,statistics&id=${channelId}&key=${apiKey}`);
    let channel = result.json();
    return channel;
}

async function loadUi(item) {
    let title = item.snippet.localized.title;
    let channelName = item.snippet.channelTitle;
    let channelId = item.snippet.channelId;
    let views = item.statistics.viewCount;
    let date = (item.snippet.publishedAt).split("T")[0];
    let like = item.statistics.likeCount;
    let commentCount = item.statistics.commentCount;


    // adding recomended videoss

    await getRecommendedData(title);

    // adding video descritpion.......

    const videoDescription = document.createElement("div");
    videoDescription.className = "video-description";
    videoDescription.style = "color: white;"
    videoDescription.innerHTML = ` <span class="title" style="font-size: 24px;">${title}</span>
                                        <div class="video-description-bottom">
                                            <div class="bottom-left" style="color: rgb(70,70,70); font-size: 18px;">
                                                <span>${views} views . ${date}</span>
                                            </div>
                                            <div class="bottom-right">
                                                <div class="like">
                                                    <img src="./resources/like.png" alt="">
                                                    <span>${like}</span>
                                                </div>
                                                <div class="share">
                                                    <img src="./resources/share.png" alt="">
                                                    <span>Share</span>
                                                </div>
                                                <div class="watchlist">
                                                    <img src="./resources/watchlist.png" alt="">
                                                    <span>Save</span>
                                                </div>
                                                <div class="3dots">
                                                    <img src="./resources/3dotsV.png" alt="">
                                                </div>
                                            </div>
                                        </div>`

    videoContainer.appendChild(videoDescription);


    // adding channel description...

    const channelData = document.createElement("div");

    const channelDetails = await getChannelDetails(channelId)
    let channelDescription = channelDetails.items[0].snippet.description;
    let subscribers = channelDetails.items[0].statistics.subscriberCount;
    let thumbnail = channelDetails.items[0].snippet.thumbnails.high.url;
    // console.log(channelDetails);

    channelData.className = "channel-description";
    channelData.innerHTML = `    <div class="channel-description-top">
                                            <div class="channel-details">
                                                <img src="${thumbnail}" alt="">
                                                <div>
                                                    <span>${channelName}</span>
                                                    <span style=" color: #AAAAAA;">${subscribers}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <img src="./resources/Subscribes-Btn.png" alt="">
                                            </div>
                                        </div>
                                        <div class="channel-description-bottom">
                                            <span>${channelDescription}.</span>
                                        </div>`

    videoContainer.appendChild(channelData);


    // Adding Add comment section......


    const addComment = document.createElement("div");
    addComment.className = "add-comment";
    addComment.innerHTML = `<div class="add-comment-top">
                                <span>${commentCount} Comments</span>
                                <img src="./resources/Short-by.png" alt="">
                            </div>
                            <div class="add-comment-bottom">
                                <img src="./resources/Profile-pic.svg" alt="">
                                <input placeholder="Add a public comment..." type="text">
                            </div>`

    videoContainer.appendChild(addComment);


    // Adding comment section......


    fetchComments();


}


// Adding recomendation part.......

async function getRecommendedData(value) {
    try {
        const result = await fetch(`${endpoint}/search?key=${apiKey}&q=sachin&type=video&maxResults=10`);
        const data = await result.json();
        let videoData = await getVideoDetails(data);
        renderDataIntoUi(videoData);
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
        const result = await fetch(`${endpoint}/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${videoId}`, {
            method: "GET",
        });
        const videoDetails = await result.json();
        videoData.push(videoDetails);
    }
    return videoData;

}

function renderDataIntoUi(videosData) {
    for (let i = 0; i < videosData.length; i++) {
        let item = videosData[i].items[0];

        videoId = item.id;
        let thumbnail = item.snippet.thumbnails.high.url;
        let title = item.snippet.localized.title;
        let channelName = item.snippet.channelTitle;
        const container = document.getElementById("recommendation-container");
        const video = document.createElement("div");
        video.className = "video";
        video.innerHTML = ` <div class=" thumbnail">
                                <img src="${thumbnail}" alt="thumbnail">
                            </div>
                            <div class="description">
                                <div class="right">
                                    <span style="color: white;">${title}</span>
                                    <p>${channelName}</p>
                                    <p>1K views. 1 week ago</p>
                                </div>
                            </div>`

        container.appendChild(video);


    }
}


async function LoadVideo() {
    videoPlayer.src = "https://www.youtube.com/embed/" + videoId;

    const videoDetails = await getVideoDetails();

    const item = videoDetails.items[0];
    await loadUi(item);
    // console.log(videoDetails)

}

async function getVideoDetails() {

    const result = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet,contentDetails,statistics&id=${videoId}`, {

    })


    const videoDetails = await result.json();
    return videoDetails;
}
LoadVideo();
// console.log(videoPlayer);