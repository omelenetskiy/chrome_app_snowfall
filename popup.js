document.addEventListener('DOMContentLoaded', function () {
    const toggleSnowfall = document.getElementById('toggleSnowfall');
    const toggleMusic = document.getElementById('toggleMusic');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const musicTrackSelect = document.getElementById('musicTrack');
    const snowflakeRadios = document.querySelectorAll('input[name="snowflake"]');
    const intensityRange = document.getElementById('intensity');
    const baseSizeRange = document.getElementById('baseSize');
    const colorRadios = document.querySelectorAll('input[name="color"]');

    let debounceTimer;


    // Debounce function to limit rapid storage calls
    function debounce(callback, delay) {
        return function () {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => callback.apply(context, args), delay);
        };
    }

    // Load the saved track
    chrome?.storage?.sync?.get(['currentTrack'], (result) => {
        if (result.currentTrack) {
            musicTrackSelect.value = result.currentTrack;
            chrome?.runtime?.sendMessage({action: 'syncTrack', track: result.currentTrack});
        } else {
            chrome?.runtime?.sendMessage({action: 'syncTrack', track: musicTrackSelect.value});
        }
    });

    chrome?.runtime?.sendMessage({action: 'getMusicStatus'}, (response) => {
        if (response.status === 'playing') {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        }
    });

    // Set initial state based on storage value
    chrome?.storage?.sync?.get(['snowfallEnabled', 'snowflakeIcon', 'snowfallIntensity', 'baseSnowflakeSize', 'snowflakeColor', 'musicEnabled'], (result) => {
        toggleSnowfall.checked = result.snowfallEnabled ?? false; // Defaults to false if not set
        intensityRange.value = result.snowfallIntensity || 50; // Default intensity
        baseSizeRange.value = result.baseSnowflakeSize || 2; // Default base size
        const defaultColor = result.snowflakeColor || '#87CEEB'; // Default to third color

        // Set the snowflake icon from storage
        if (result.snowflakeIcon) {
            document.getElementById(result.snowflakeIcon).checked = true;
        } else {
            document.getElementById('snowflake3').checked = true; // Default to snowflake3
        }

        // Disable color options if the first snowflake is selected
        const isSnowflake1 = result.snowflakeIcon === 'snowflake1';
        colorRadios.forEach((radio) => {
            radio.disabled = isSnowflake1;
            if (radio.value === defaultColor) {
                radio.checked = true;
            }
        });
    });

    // Add an event listener for checkbox changes
    toggleSnowfall.addEventListener('change', () => {
        chrome?.storage?.sync?.set({
            snowfallEnabled: toggleSnowfall.checked
        });
        chrome?.tabs?.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            chrome?.scripting?.executeScript({
                target: {
                    tabId: tabs[0].id
                },
                files: ['content.js'] // Re-run the content script to handle the change
            });
        });
    });

    const togglePlayButtonCallback = (response) => {
        if (response.status === 'playing') {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline';
        } else {
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
        }
    }

    // Toggle music playback
    toggleMusic.addEventListener('click', function () {
        chrome?.runtime?.sendMessage({action: 'toggleMusic'}, togglePlayButtonCallback);
    });

    musicTrackSelect.addEventListener('change', () => {
        const selectedTrack = musicTrackSelect.value;
        chrome?.storage?.sync?.set({currentTrack: selectedTrack});
        chrome?.runtime?.sendMessage({action: 'setTrack', track: selectedTrack}, togglePlayButtonCallback);
    });

    // Add an event listener for snowflake radio button changes
    snowflakeRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                const isSnowflake1 = radio.id === 'snowflake1';

                // Enable or disable color options based on the selected snowflake
                colorRadios.forEach((cradio) => {
                    cradio.disabled = isSnowflake1;
                });

                chrome?.storage?.sync?.set({
                    snowflakeIcon: radio.id,
                    snowflakeValue: radio.value
                });
                chrome?.tabs?.query({
                    active: true,
                    currentWindow: true
                }, (tabs) => {
                    chrome?.scripting?.executeScript({
                        target: {
                            tabId: tabs[0].id
                        },
                        files: ['content.js'] // Re-run the content script to apply icon change
                    });
                });
            }
        });
    });

    // Debounced event listener for intensity range changes
    intensityRange.addEventListener('input', debounce(() => {
        chrome?.storage?.sync?.set({
            snowfallIntensity: intensityRange.value
        });
        chrome?.tabs?.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            chrome?.scripting?.executeScript({
                target: {
                    tabId: tabs[0].id
                },
                files: ['content.js'] // Re-run the content script to apply intensity change
            });
        });
    }, 300));

    // Debounced event listener for base size range changes
    baseSizeRange.addEventListener('input', debounce(() => {
        chrome?.storage?.sync?.set({
            baseSnowflakeSize: baseSizeRange.value
        });
        chrome?.tabs?.query({
            active: true,
            currentWindow: true
        }, (tabs) => {
            chrome?.scripting?.executeScript({
                target: {
                    tabId: tabs[0].id
                },
                files: ['content.js'] // Re-run the content script to apply base size change
            });
        });
    }, 300));

    // Add an event listener for color radio button changes
    colorRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                chrome?.storage?.sync?.set({
                    snowflakeColor: radio.value
                });
                chrome?.tabs?.query({
                    active: true,
                    currentWindow: true
                }, (tabs) => {
                    chrome?.scripting?.executeScript({
                        target: {
                            tabId: tabs[0].id
                        },
                        files: ['content.js'] // Re-run the content script to apply color change
                    });
                });
            }
        });
    });
});
