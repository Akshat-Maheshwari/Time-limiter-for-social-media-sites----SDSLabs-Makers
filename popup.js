
chrome.storage.sync.get(["WebsitesData"],(websitesData)=>{
    websitesData.WebsitesData.forEach((website, index)=>{  
        const container = `<div class="siteBox site${index}"><div class="siteName">${website.url}</div><div class="siteTime"><div contenteditable="true" class="editable time-hours">${website.hours===0?"00":website.hours}</div>:<div contenteditable="true" class="editable time-minutes">${website.minutes===0?"00":website.minutes}</div>:<div contenteditable="true" class="editable time-seconds">${website.seconds===0?"00":website.seconds}</div></div></div>`;
        document.querySelector(".individualTime").insertAdjacentHTML("beforeend",container);
    })

})

setTimeout(() => {
    chrome.storage.sync.get(['totalTime'],(time)=>{
        let totalHours=(time.totalTime.hours);
        let totalMinutes=(time.totalTime.minutes);
        let totalSeconds=(time.totalTime.seconds);
        document.querySelector(".totalHours").innerHTML=`${totalHours===0?"00":totalHours}`;
        document.querySelector(".totalMinutes").innerHTML=`${totalMinutes===0?"00":totalMinutes}`;
        document.querySelector(".totalSeconds").innerHTML=`${totalSeconds===0?"00":totalSeconds}`;
    })

    let saveBtn = document.querySelector(".saveBtn");

    for(let i=0; i<document.querySelectorAll(".editable").length; i++){
        document.querySelectorAll(".editable")[i].addEventListener('focus', function(){
            saveBtn.style.display="block";
        });
    }
    saveBtn.addEventListener("click",()=>{
        console.log("saved");
        saveBtn.style.display="none";
        const data =[];
        for(let i=0; i<document.querySelectorAll(".siteBox").length; i++){
            const site = document.querySelector(`.site${i}`);
            const url = site.querySelector(".siteName").innerHTML;
            const hours = site.querySelector(".time-hours").innerHTML;
            const minutes = site.querySelector(".time-minutes").innerHTML;
            const seconds = site.querySelector(".time-seconds").innerHTML;
            data.push({
                url:url,
                seconds:seconds,
                minutes:minutes,
                hours:hours
            })
        }
        chrome.storage.sync.set({WebsitesData:data});

        chrome.storage.sync.set({totalTime:
            {
                hours:document.querySelector(".totalHours").innerHTML,
                minutes:document.querySelector(".totalMinutes").innerHTML,
                seconds:document.querySelector(".totalSeconds").innerHTML
            }
        });
        chrome.runtime.sendMessage("refresh");
    })   
}, 500);

