const audio = document.getElementById('audio');

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'play') {
        audio.play();
    } else if (message.action === 'pause') {
        audio.pause();
    } else if (message.action === 'setTrack') {
        audio.src = `music/${message.track}.mp3`; // Убедитесь, что имена файлов совпадают с опциями в HTML
        audio.load();
        audio.play();
    } else if (message.action === 'syncTrack') {
        audio.src = `music/${message.track}.mp3`; // Убедитесь, что имена файлов совпадают с опциями в HTML
        audio.load();
    }
});
