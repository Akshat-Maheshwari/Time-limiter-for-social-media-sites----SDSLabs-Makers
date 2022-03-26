var imgURL = chrome.runtime.getURL("meme.jpg");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message)
    if(message === "block"){
        document.body.innerHTML=`<div class="blockPage"><h1>Enough for today</h1><p>come back tomorrow</p><img class="memeImg" src=${imgURL} /></div>`
    }
    sendResponse("blocked");
    return true;
});

