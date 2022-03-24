chrome.runtime.onInstalled.addListener(async () => {
    for (const cs of chrome.runtime.getManifest().content_scripts) {
      for (const tab of await chrome.tabs.query({url: cs.matches})) {
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          files: cs.js,
        });
      }
    }
    console.log("Installed");

    let initialData = [
        {
        url:"youtube.com",
        seconds:10,
        minutes:0,
        hours:0
        },
        {
        url:"facebook.com",
        seconds:15,
        minutes:0,
        hours:0
        },
        {
        url:"instagram.com",
        seconds:20,
        minutes:0,
        hours:0
        },
        {
        url:"netflix.com",
        seconds:20,
        minutes:0,
        hours:0
        }
    ];
    chrome.storage.sync.get(["WebsitesData"],(data)=>{
        if(!Object.keys(data).length){
            chrome.storage.sync.set({WebsitesData:initialData});   
        }else chrome.storage.sync.set({mutableWebsitesData:data.WebsitesData});
    });
    //////////////SET TOTAL TIME HERE
    chrome.storage.sync.set({totalTime:
        {
            hours:0,
            minutes:0,
            seconds:25
        }
    });
    ///////////////
});


let url=null;
let timer=null;
let seconds=0;
let minutes=0;
let hours=0;
let tabId=null;
let totalTime=0;
let limitWhen=null;
//For First time when the extension is installed
let websites =[];
chrome.storage.sync.get(['mutableWebsitesData'],(websitesData)=>{
    websites=websitesData.mutableWebsitesData;
});
chrome.storage.sync.get(['totalTime'],(time)=>{
    totalTime+=(time.totalTime.hours*3600);
    totalTime+=(time.totalTime.minutes*60);
    totalTime+=(time.totalTime.seconds);
})

function handleActivated() {   
    mainLogic();
}
function handleUpdated(tabId,changeInfo,tabInfo){
  if(changeInfo.status === "complete"){
     mainLogic(); 
  }
}
chrome.tabs.onActivated.addListener(handleActivated);
chrome.tabs.onUpdated.addListener(handleUpdated);
function mainLogic(){
    ///////////////////Need to improve this part
    const date = new Date();
    if(limitWhen && limitWhen<date.getDate()){
        chrome.runtime.reload();
    }
    limitWhen=date.getDate();
    //////////////////////////////
    endTimer();
    chrome.storage.sync.get(['mutableWebsitesData'],(websitesData)=>{
        websites=websitesData.mutableWebsitesData;
        chrome.tabs.query({active:true, currentWindow:true},(tabs)=>{
            url= tabs[0].url;
            websites.forEach((website)=>{
                if(url.includes(website.url)){ 
                    seconds=website.seconds;
                    minutes=website.minutes;
                    hours=website.hours;
                    tabId = tabs[0].id;
                    startTimer();
                }
            })
        })
    })
}

function startTimer(){
    timer = setInterval(tick,1000);
    function tick(){
        if(totalTime>0){
            console.log(url+": "+hours+":"+minutes+":"+seconds);
            if(seconds<=0 && minutes>0){
                seconds =59;
                minutes--;
            }
            if(minutes<=0 && hours>0){
                minutes = 59;
                hours--;
            }
            seconds--;
            totalTime--;
            if(seconds<=0 && minutes<=0 && hours<=0){
                chrome.tabs.sendMessage(tabId, "block");  
                clearInterval(timer);  
                seconds=0;
                minutes=0;
                hours=0;
            }
        }else{
            chrome.tabs.sendMessage(tabId, "block");
        }
         
    }
}

function endTimer(){
    websites.forEach((website)=>{
        if(url && url.includes(website.url)){
            website.seconds=seconds;
            website.minutes=minutes;
            website.hours=hours;
        }
    })
    clearInterval(timer);
    chrome.storage.sync.set({mutableWebsitesData:websites});
}