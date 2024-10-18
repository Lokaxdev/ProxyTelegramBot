const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs'); // Import the fs module

// Replace with your Telegram Bot Token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Your Telegram Channel Username or Channel ID (e.g., "@your_channel" or "-100xxxxxxxxxx")
const channelId = '@your_channel'; // Use the username with '@' for a public channel

// Extensive list of free proxy sources
const proxySources = [
    "https://www.proxy-list.download/api/v1/get?type=socks5",
    "https://www.proxy-list.download/api/v1/get?type=https",
    "https://www.proxy-list.download/api/v1/get?type=http",
    "https://www.proxyscan.io/api/proxy?type=socks5",
    "https://www.proxyscan.io/api/proxy?type=https",
    "https://www.proxyscan.io/api/proxy?type=http",
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000",
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000",
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=10000",
    "https://spys.me/proxy.txt",
    // Add more sources as needed
];

// Function to fetch proxies from all sources
async function getProxies() {
    let allProxies = [];

    for (let source of proxySources) {
        try {
            const response = await fetch(source);
            const proxyList = await response.text();
            allProxies = allProxies.concat(proxyList.split("\n").filter(Boolean)); // Clean up blank lines
        } catch (error) {
            console.error(`Error fetching from ${source}:`, error);
        }
    }

    return allProxies;
}

// Function to test if a proxy is alive
async function testProxy(proxy) {
    const url = 'https://httpbin.org/ip'; // A simple endpoint to check proxy
    const options = {
        method: 'GET',
        agent: require('proxy-agent')(proxy),
        timeout: 5000, // 5 seconds timeout
    };

    try {
        const response = await fetch(url, options);
        if (response.ok) {
            const json = await response.json();
            return { proxy, ip: json.origin }; // Return working proxy with the resolved IP
        }
    } catch (error) {
        console.error(`Proxy failed: ${proxy}`, error.message);
    }
    return null; // Return null if the proxy fails
}

// Function to fetch, test proxies and send them to the channel
async function sendProxiesToChannel() {
    const proxies = await getProxies();
    console.log(`Total proxies fetched: ${proxies.length}`);

    const aliveProxiesPromises = proxies.map(proxy => testProxy(proxy));
    const aliveProxies = await Promise.all(aliveProxiesPromises);
    const workingProxies = aliveProxies.filter(proxy => proxy !== null);

    if (workingProxies.length > 0) {
        const proxyList = workingProxies.map(p => `${p.proxy} (Resolved IP: ${p.ip})`).join('\n');
        
        // Write the working proxies to LokaXProxy.txt
        fs.writeFile('LokaXProxy.txt', proxyList, (err) => {
            if (err) {
                console.error('Error writing to file', err);
                bot.sendMessage(channelId, "Failed to create proxy file.");
                return;
            }

            // Custom message with proxy details
            const message = `
BERSERK PROXY [24/7]🔥
Count: ${workingProxies.length}
Alive proxy: ${workingProxies.length}

FREE PROXY AT https://t.me/berserkproxy
            `;
            
            // Send the file to the channel with the custom message
            bot.sendDocument(channelId, 'LokaXProxy.txt', {}, { caption: message });
        });
    } else {
        bot.sendMessage(channelId, "No active proxies found.");
    }
}

// Schedule sending the proxy list every 5 minutes (300,000 milliseconds)
setInterval(() => {
    sendProxiesToChannel();
}, 300000); // 300,000 milliseconds = 5 minutes

// Log bot start
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code}`, error.message);
});
