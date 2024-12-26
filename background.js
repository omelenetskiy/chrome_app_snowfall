let creating;

async function setupOffscreenDocument() {
    const offscreenUrl = chrome.runtime.getURL('offscreen.html');
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [offscreenUrl],
    });

    if (existingContexts.length > 0) {
        return;
    }

    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: offscreenUrl,
            reasons: ['AUDIO_PLAYBACK'],
            justification: 'Background audio playback.'
        });
        await creating;
        creating = null;
    }
}

chrome.runtime.onInstalled.addListener(setupOffscreenDocument);
chrome.runtime.onStartup.addListener(setupOffscreenDocument);

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    if (msg.action === 'toggleMusic') {
        chrome.storage.sync.get(['musicEnabled'], (result) => {
            const musicEnabled = !result.musicEnabled;
            chrome.storage.sync.set({musicEnabled});

            if (musicEnabled) {
                chrome.runtime.sendMessage({action: 'play'});
            } else {
                chrome.runtime.sendMessage({action: 'pause'});
            }

            response({status: musicEnabled ? 'playing' : 'paused'});
        });
        return true;
    }

    if (msg.action === 'setTrack') {
        chrome.storage.sync.set({musicEnabled: true}, () => {
            response({status: 'playing'});
        });
        return true;
    }


    if (msg.action === 'getMusicStatus') {
        chrome.storage.sync.get(['musicEnabled'], (result) => {
            response({status: result.musicEnabled ? 'playing' : 'paused'});
        });
        return true;
    }
});
