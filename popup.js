document.getElementById("download-btn").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

   
    if (tab.url.startsWith("chrome://")) {
        alert("This extension cannot run on Chrome internal pages.");
        return;
    }

    console.log("Current Tab URL:", tab.url); 
    
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: findAudioFiles,
        },
        (results) => {
            const audioList = document.getElementById("audio-list");
            audioList.innerHTML = '';

            
            if (chrome.runtime.lastError) {
                console.error("Script execution failed: ", chrome.runtime.lastError.message);
                audioList.innerHTML = '<li>Error executing script.</li>';
                return;
            }

            
            console.log("Script results:", results); 
            if (!results || results.length === 0 || !results[0] || !results[0].result) {
                console.error("No results from executeScript.");
                audioList.innerHTML = '<li>No audio/video files found.</li>';
                return;
            }

            
            const audios = results[0].result || [];
            if (audios.length === 0) {
                audioList.innerHTML = '<li>No audio/video files found.</li>';
                return;
            }

            audios.forEach((audioUrl, index) => {
                const listItem = document.createElement("li");
                const downloadLink = document.createElement("a");
                downloadLink.href = audioUrl;
                downloadLink.innerText = `Download Audio/Video ${index + 1}`;
                downloadLink.download = `media${index + 1}`; 
                listItem.appendChild(downloadLink);
                audioList.appendChild(listItem);
            });
        }
    );
});


function findAudioFiles() {
    const audioTags = Array.from(document.getElementsByTagName('audio'));
    const videoTags = Array.from(document.getElementsByTagName('video'));
    const audioUrls = audioTags.map(audio => audio.src).filter(src => src);
    const videoUrls = videoTags.map(video => video.src).filter(src => src);
    return [...audioUrls, ...videoUrls];  
}
