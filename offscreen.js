const audio = document.getElementById('audio');

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'play') {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then().catch(error => {
                console.log({error})
            });
        }
    } else if (message.action === 'pause') {
        audio.pause();
    } else if (message.action === 'setTrack') {
        audio.src = `music/${message.track}.mp3`;
        audio.load();

        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then().catch(error => {
                console.log({error})
            });
        }
    }
});
