function createSnowfall(iconHTML, intensity, baseSize, color) {
    try {
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
          font-size: 16px;
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
        style.id = 'snowfall-style';
        document.head.appendChild(style);

        for (let i = 0; i < intensity; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = `snowflake`;
            snowflake.innerHTML = iconHTML;
            const sizeValue = (Math.random() * 0.5 + 0.5) * baseSize;
            snowflake.style.fontSize = `${sizeValue}vw`;
            snowflake.style.setProperty('--left-ini', `${Math.random() * 20 - 10}vw`);
            snowflake.style.setProperty('--left-end', `${Math.random() * 20 - 10}vw`);
            snowflake.style.left = `${Math.random() * 100}vw`;
            snowflake.style.animationDuration = `${(5 + Math.random() * 5)}s`;
            snowflake.style.animationDelay = `-${Math.random() * 5}s`;
            document.body.appendChild(snowflake);
        }
    } catch(e) {
        console.error('Error creating snowfall:', e);
    }
}

function removeSnowfall() {
    try {
        const style = document.getElementById('snowfall-style');
        if (style) {
            style.remove();
        }

        const snowflakes = document.querySelectorAll('.snowflake');
        snowflakes.forEach(snowflake => snowflake.remove());
    } catch(e) {
        console.error('Error removing snowfall:', e);
    }
}

try {
    chrome.storage.sync.get(['snowfallEnabled', 'snowflakeValue', 'snowfallIntensity', 'baseSnowflakeSize', 'snowflakeColor'], (result) => {
        const iconHTML = result.snowflakeValue || '&#10052;';
        const intensity = result.snowfallIntensity || 50;
        const baseSize = result.baseSnowflakeSize || 2;
        const color = result.snowflakeColor || '#87CEEB';

        if (result.snowfallEnabled) {
            createSnowfall(iconHTML, intensity, baseSize, color);
        } else {
            removeSnowfall();
        }
    });
} catch (e) {
    console.error('Error retrieving storage for snowfall:', e);
}

try {
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
} catch(e) {
    console.error('Error listening to storage changes:', e);
}
