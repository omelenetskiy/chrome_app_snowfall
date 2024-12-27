document.addEventListener('DOMContentLoaded', function () {
    // Player
    const toggleMusic = document.getElementById('toggleMusic');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const musicTrackSelect = document.getElementById('musicTrack');
    const reloadApp = document.getElementById('reloadApp');

    const togglePlayButtonCallback = (response) => {
        if (response && response.status === 'playing') {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    };

    // Get the current music status
    chrome.runtime.sendMessage({ action: 'getMusicStatus' }, togglePlayButtonCallback);

    // Load saved track and sync if needed
    chrome.storage.session.get(['currentTrack'], (result) => {
        musicTrackSelect.value = result.currentTrack || musicTrackSelect.value;
    });

    toggleMusic.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: 'toggleMusic' }, togglePlayButtonCallback);
    });

    reloadApp.addEventListener('click', function () {
        chrome.runtime.reload();
    });

    musicTrackSelect.addEventListener('change', () => {
        const selectedTrack = musicTrackSelect.value;
        chrome.storage.session.set({ currentTrack: selectedTrack }, () => {
            chrome.runtime.sendMessage({ action: 'setTrack', track: selectedTrack });
            togglePlayButtonCallback({status: 'playing'})
        });
    });
});
