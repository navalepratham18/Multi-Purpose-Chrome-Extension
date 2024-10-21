// Add your API key here
const apiKey = '';           //Insert your API Key inside ''
const weatherApiKey = ''           //Insert your API Key inside ''


// Load the opt-out analytics setting on popup open
chrome.storage.sync.get({ optOutAnalytics: false }, results => {
    const optOutAnalyticsCheckbox = document.querySelector('#optOutAnalytics');

    optOutAnalyticsCheckbox.checked = results.optOutAnalytics;
    optOutAnalyticsCheckbox.onchange = () => {
        chrome.storage.sync.set({
            optOutAnalytics: optOutAnalyticsCheckbox.checked
        }, () => {
            // Reload extension to make opt-out change immediate.
            chrome.runtime.reload();
            window.close();
        });
    };
});

// Handle PiP button click
const pipButton = document.getElementById('pipButton');
pipButton.addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    pipButton.classList.toggle("enabled");
    // const pipSymbol = document.querySelector('.pip-enable-symbol');
    if (pipButton.classList.contains('enabled')) {
        let pipButtonContent = `<svg class="pip-enable-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15"><path fill="none" d="M4 7.5L7 10l4-5m-3.5 9.5a7 7 0 1 1 0-14a7 7 0 0 1 0 14Z"/></svg>PiP Enabled`;
        pipButton.innerHTML = pipButtonContent;
        pipButton.style.background = "var(--secondary-cta)";
    } else {
        pipButton.innerHTML = "Enable PiP";
        pipButton.style.background = "var(--primary-cta)";
    }


    chrome.scripting.executeScript({
        target: { tabId: tab.id, allFrames: true },
        files: ['script.js']
    });
});

// Currency Exchange - initialization
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const amountInput = document.getElementById('amount');
const convertButton = document.getElementById('convertButton');
const resultNum = document.getElementById('result-num');
const resultCurrency = document.getElementById('result-currency');
const currencyResult = document.querySelector(".currency-result");
const currencyError = document.getElementById('currency-error');

// Populate currency dropdowns with top 20 currencies
const currencies = [
    { code: "USD", name: "United States Dollar" },
    { code: "CNY", name: "Chinese Yuan" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "EUR", name: "Euro" },
    { code: "INR", name: "Indian Rupee" },
    { code: "GBP", name: "British Pound" },
    { code: "BRL", name: "Brazilian Real" },
    { code: "RUB", name: "Russian Ruble" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "KRW", name: "South Korean Won" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "MXN", name: "Mexican Peso" },
    { code: "IDR", name: "Indonesian Rupiah" },
    { code: "TRY", name: "Turkish Lira" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "CHF", name: "Swiss Franc" },
    { code: "NZD", name: "New Zealand Dollar" },
    { code: "SGD", name: "Singapore Dollar" },
    { code: "NOK", name: "Norwegian Krone" },
    { code: "ZAR", name: "South African Rand" },
    { code: "HKD", name: "Hong Kong Dollar" }
];

currencies.forEach(currency => {
    const fromOption = document.createElement('option');
    fromOption.value = currency.code;
    fromOption.textContent = `${currency.name} (${currency.code})`;
    fromCurrencySelect.appendChild(fromOption);

    const toOption = document.createElement('option');
    toOption.value = currency.code;
    toOption.textContent = `${currency.name} (${currency.code})`;
    toCurrencySelect.appendChild(toOption);
});

// Currency Exchange - main logic
convertButton.addEventListener('click', async () => {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (!amount || amount <= 0) {
        currencyResult.textContent = "";
        currencyResult.textContent = "";
        currencyError.textContent = 'Please Enter a Valid Amount';
        return;
    }

    try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}?apikey=${apiKey}`);
        const data = await response.json();

        if (data.rates[toCurrency]) {
            const convertedAmount = (amount * data.rates[toCurrency]).toFixed(2);
            currencyError.textContent = null;
            let currencyResultDisplay = `<h2 id="result-num">${convertedAmount}</h2><span id="result-currency">${toCurrency}</span>`;
            currencyResult.innerHTML = currencyResultDisplay;
            // resultNum.textContent = `${convertedAmount}`;
            // resultCurrency.textContent = `${toCurrency}`;
        } else {
            currencyResult.textContent = "";
            currencyResult.textContent = "";
            currencyError.textContent = 'Currency Conversion not Available';
        }
    } catch (error) {
        currencyResult.textContent = "";
        currencyResult.textContent = "";
        console.error('Error fetching exchange rates:', error);
        currencyError.textContent = 'Failed to Fetch Exchange Rates';
    }
});





// Weather API - logic
const weatherError = document.getElementById("weather-error");
document.getElementById('locationButton').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`);
                const data = await response.json();

                if (data.main) {
                    const temperature = data.main.temp;
                    const placeName = data.name;

                    // Update button text
                    // const locationButton = document.getElementById('locationButton');
                    const weatherLocation = document.getElementById("weather-location");
                    const weatherTemp = document.getElementById("weather-temp");
                    
                    weatherError.textContent = null;
                    weatherLocation.textContent = `${placeName}`;
                    weatherTemp.textContent = `${temperature}°C`;
                    // locationButton.textContent = `${placeName}: ${temperature}°C`;
                } else {
                    weatherError.textContent = "Could not Fetch Weather Data";
                    weatherLocation.textContent = "";
                    weatherTemp.textContent = "";
                    // alert('Could not fetch weather data.');
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
                weatherError.textContent = "Failed to Fetch Weather Data";
                weatherLocation.textContent = "";
                weatherTemp.textContent = "";
                // alert('Failed to fetch weather data.');
            }
        }, (error) => {
            console.error('Error getting location:', error);
            weatherError.textContent = 'Could not get Location';
            weatherLocation.textContent = "";
            weatherTemp.textContent = "";
            // alert('Could not get location.');
        });
    } else {
        weatherError.textContent = "Geolocation is not Supported by this Browser";
        weatherLocation.textContent = "";
        weatherTemp.textContent = "";
        // alert('Geolocation is not supported by this browser.');
    }
});




// Dictionary lookup feature
const dictionaryAPI = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const dictContent = document.getElementById("dict-content");
const dictionaryAudio = document.getElementById("dictionaryAudio");
const dictionaryBtn = document.getElementById("searchDictionary");

dictionaryBtn.addEventListener("click", () => {
    let word = document.getElementById("wordInput").value;
    if (word == "") {
        dictContent.innerHTML = `<p id="dict-error">Enter a Valid Word</p>`;
    }
    else{
        fetch(`${dictionaryAPI}${word}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.title === "No Definitions Found") {
                    dictContent.innerHTML = `<p id="dict-error">${word}</p>`;
                    console.log(word);
                    return;
                }
    
                const wordData = data[0];
                const meaning = wordData.meanings[0].definitions[0].definition;
                const phonetic = wordData.phonetics[0]?.text || "No phonetics available";
                const audioURL = wordData.phonetics.find(phonetic => phonetic.audio)?.audio || null;
    
                let resultHTML = `    
                    <div class="word-cont">
                        <h2 class="word">${wordData.word}</h2>
                    </div>
                    <div class="dict-result">
                        <p class="phonetics">${phonetic}</p>
                        <p class="meaning">${meaning}</p>
                    </div>`;
    
                if (audioURL) {
                    resultHTML += `<button id="play-audio">
                  <svg
                    class="dict-speaker"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 32 32"
                  >
                    <path
                    class="dict-speaker-path"
                      d="M18 5.604c0-1.114-1.346-1.671-2.134-.884l-4.694 4.695A2 2 0 0 1 9.757 10H6a4 4 0 0 0-4 4v4a4 4 0 0 0 4 4h3.757a2 2 0 0 1 1.415.585l4.694 4.695c.788.787 2.134.23 2.134-.884zm-5.414 5.225L16 7.415v17.171l-3.414-3.414A4 4 0 0 0 9.757 20H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h3.757a4 4 0 0 0 2.829-1.171m10.238-1.395a1 1 0 1 0-1.648 1.133c1.285 1.87 1.887 3.676 1.887 5.433c0 1.758-.602 3.565-1.887 5.434a1 1 0 1 0 1.648 1.133c1.465-2.13 2.238-4.324 2.238-6.567c0-2.242-.773-4.435-2.238-6.566m2.866-4.158a1 1 0 0 0-1.38 1.449c2.387 2.273 3.628 5.738 3.628 9.275s-1.241 7.003-3.628 9.276a1 1 0 1 0 1.38 1.449c2.863-2.727 4.247-6.762 4.247-10.725S28.554 8.003 25.69 5.276"
                    />
                  </svg>
                </button>`;
    
                    dictionaryAudio.src = audioURL.startsWith("https://") ? audioURL : `https:${audioURL}`;
                }
    
                dictContent.innerHTML = resultHTML;
                
                // const dictError = document.getElementById("dict-error");
    
                const playAudioButton = document.getElementById('play-audio');
                if (playAudioButton) {
                    playAudioButton.addEventListener('click', () => {
                        dictionaryAudio.play();
                    });
                }
            })
            .catch(() => {
                dictContent.innerHTML = `<p id="dict-error">Failed to Fetch the Word! Please Try Again</p>`;
            });
    }
});




const close = document.querySelector(".close").addEventListener('click', ()=>{
    window.close();
})