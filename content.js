// Function to create and start the snowfall
function createSnowfall(iconHTML, intensity, baseSize, color) {
    // Clear existing snowflakes if any
    removeSnowfall();

    const style = document.createElement('style');
    style.innerHTML = `
    .snowflake {
      position: fixed;
      top: -5vh;
      color: ${color};
      pointer-events: none;
      animation: snowfall linear infinite;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
      font-size: 16px; /* Default size to avoid 0 */
      z-index: 9999999999999999999;
    }

    @keyframes snowfall {
      0% {
        transform: translateY(0) translateX(var(--left-ini));
      }
      100% {
        transform: translateY(110vh) translateX(var(--left-end));
      }
    }

    .snowflake:nth-child(6n) {
      filter: blur(1px);
    }
  `;
    style.id = 'snowfall-style'; // Add an ID to easily remove it later
    document.head.appendChild(style);

    for (let i = 0; i < intensity; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = `snowflake`;
        snowflake.innerHTML = iconHTML;
        const sizeValue = (Math.random() * 0.5 + 0.5) * baseSize;
        snowflake.style.fontSize = `${sizeValue}vw`; // Adjusted according to base size
        snowflake.style.setProperty('--left-ini', `${Math.random() * 20 - 10}vw`);
        snowflake.style.setProperty('--left-end', `${Math.random() * 20 - 10}vw`);
        snowflake.style.left = `${Math.random() * 100}vw`;
        snowflake.style.animationDuration = `${(5 + Math.random() * 5)}s`;
        snowflake.style.animationDelay = `-${Math.random() * 5}s`;
        document.body.appendChild(snowflake);
    }
}

// Function to stop the snowfall
function removeSnowfall() {
    const style = document.getElementById('snowfall-style');
    if (style) {
        style.remove();
    }

    const snowflakes = document.querySelectorAll('.snowflake');
    snowflakes.forEach(snowflake => snowflake.remove());
}

// Check if snowfall is enabled and get the snowflake icon, intensity, base size, and color
chrome.storage.sync.get(['snowfallEnabled', 'snowflakeValue', 'snowfallIntensity', 'baseSnowflakeSize', 'snowflakeColor'], (result) => {
    const iconHTML = result.snowflakeValue || '&#10052;'; // Default to the first snowflake if the value is not found
    const intensity = result.snowfallIntensity || 50; // Default intensity if not set
    const baseSize = result.baseSnowflakeSize || 2; // Default base size if not set
    const color = result.snowflakeColor || '#87CEEB'; // Default to third color if not set

    if (result.snowfallEnabled) { // Defaults to on if not set
        createSnowfall(iconHTML, intensity, baseSize, color);
    } else {
        removeSnowfall();
    }
});

// Listen for changes in storage (in case the user toggles the switch or changes the icon, intensity, base size, or color)
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && (changes.snowfallEnabled || changes.snowflakeValue || changes.snowfallIntensity || changes.baseSnowflakeSize || changes.snowflakeColor)) {
        chrome.storage.sync.get(['snowfallEnabled', 'snowflakeValue', 'snowfallIntensity', 'baseSnowflakeSize', 'snowflakeColor'], (result) => {
            const iconHTML = result.snowflakeValue || '&#10052;';
            const intensity = result.snowfallIntensity || 50;
            const baseSize = result.baseSnowflakeSize || 2;
            const color = result.snowflakeColor || '#87CEEB';
            if (result.snowfallEnabled) {
                removeSnowfall();
                createSnowfall(iconHTML, intensity, baseSize, color);
            } else {
                removeSnowfall();
            }
        });
    }
});
