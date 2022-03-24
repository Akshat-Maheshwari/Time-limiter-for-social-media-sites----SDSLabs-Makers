
chrome.storage.sync.get(["WebsitesData"],(websitesData)=>{
    let totalHours=0, totalMinutes=0, totalSeconds=0;

    websitesData.WebsitesData.forEach((website, index)=>{  
        const container = `<div class="siteBox site${index}"><div class="siteName">${website.url}</div><div class="siteTime">${website.hours===0?"00":website.hours}:${website.minutes===0?"00":website.minutes}:${website.seconds===0?"00":website.seconds}</div></div>`;
        document.querySelector(".individualTime").insertAdjacentHTML("beforeend",container);
        totalHours+=website.hours;
        totalMinutes+=website.minutes;
        totalSeconds+=website.seconds;
    })
    document.querySelector(".totalTime").innerHTML=`${totalHours===0?"00":totalHours}:${totalMinutes===0?"00":totalMinutes}:${totalSeconds===0?"00":totalSeconds}`
})

