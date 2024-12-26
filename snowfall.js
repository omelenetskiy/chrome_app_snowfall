document.addEventListener('DOMContentLoaded', function () {
    // Snowfall
    const toggleSnowfall = document.getElementById('toggleSnowfall');
    const snowflakeRadios = document.querySelectorAll('input[name="snowflake"]');
    const intensityRange = document.getElementById('intensity');
    const baseSizeRange = document.getElementById('baseSize');
    const colorRadios = document.querySelectorAll('input[name="color"]');

    let debounceTimer;

    // Debounce function
    const debounce = (callback, delay) => {
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => callback.apply(context, args), delay);
        };
    };

    // Set initial state
    chrome.storage.sync.get(['snowfallEnabled', 'snowflakeIcon', 'snowfallIntensity', 'baseSnowflakeSize', 'snowflakeColor'], (result) => {
        toggleSnowfall.checked = result.snowfallEnabled ?? false;
        intensityRange.value = result.snowfallIntensity || 50;
        baseSizeRange.value = result.baseSnowflakeSize || 2;
        const defaultColor = result.snowflakeColor || '#87CEEB';

        if (result.snowflakeIcon) {
            document.getElementById(result.snowflakeIcon).checked = true;
        } else {
            document.getElementById('snowflake3').checked = true;
        }

        const isSnowflake1 = result.snowflakeIcon === 'snowflake1';
        colorRadios.forEach((radio) => {
            radio.disabled = isSnowflake1;
            if (radio.value === defaultColor) {
                radio.checked = true;
            }
        });
    });

    // Event listeners
    toggleSnowfall.addEventListener('change', () => {
        chrome.storage.sync.set({ snowfallEnabled: toggleSnowfall.checked }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                });
            });
        });
    });

    // Snowflake icon changes
    snowflakeRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const isSnowflake1 = radio.id === 'snowflake1';

                colorRadios.forEach((cradio) => {
                    cradio.disabled = isSnowflake1;
                });

                chrome.storage.sync.set({
                    snowflakeIcon: radio.id,
                    snowflakeValue: radio.value
                }, () => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ['content.js']
                        });
                    });
                });
            }
        });
    });

    // Intensity changes
    intensityRange.addEventListener('input', debounce(() => {
        chrome.storage.sync.set({ snowfallIntensity: intensityRange.value }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                });
            });
        });
    }, 300));

    // Base size changes
    baseSizeRange.addEventListener('input', debounce(() => {
        chrome.storage.sync.set({ baseSnowflakeSize: baseSizeRange.value }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['content.js']
                });
            });
        });
    }, 300));

    // Color changes
    colorRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                chrome.storage.sync.set({ snowflakeColor: radio.value }, () => {
                    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                        chrome.scripting.executeScript({
                            target: { tabId: tabs[0].id },
                            files: ['content.js']
                        });
                    });
                });
            }
        });
    });
});
