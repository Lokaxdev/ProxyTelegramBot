const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs'); // Import the fs module

// Replace with your Telegram Bot Token
const token = 'YOUR_TELEGRAM_BOT_TOKEN'; // Insert your bot token here
const bot = new TelegramBot(token, { polling: true });

// Your Telegram Channel Username or Channel ID (e.g., "@your_channel" or "-100xxxxxxxxxx")
const channelId = '@your_channel'; // Use the username with '@' for a public channel, or the channel ID for private channels

// Extensive list of free proxy sources, including more updated ones
const proxySources = [
    // Existing sources
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
    "https://www.sslproxies.org/",
    "https://free-proxy-list.net/",
    "https://us-proxy.org/",
    "https://socks-proxy.net/",
    "https://openproxy.space/list/socks5",
    "https://openproxy.space/list/http",
    "https://www.my-proxy.com/free-proxy-list.html",
    "https://hidemy.name/en/proxy-list/?type=hs&anon=34#list",
    "https://proxy-daily.com/",

    // Newly added proxy sources (updated)
    "https://www.cool-proxy.net/proxies/http_proxy_list/country_code:/port:/anonymous:1",
    "https://free-proxy-list.net/anonymous-proxy.html",
    "https://proxylist.geonode.com/api/proxy-list?limit=300&page=1&sort_by=lastChecked&sort_type=desc",
    "https://www.proxyscan.io/api/proxy?type=socks4",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt",
    "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list.txt",
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt",
    "https://raw.githubusercontent.com/roosterkid/openproxylist/main/SOCKS5_RAW.txt",
    "https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt",
    "https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTP_RAW.txt",
    "https://openproxy.space/list/https",
    "https://proxylist.geonode.com/api/proxy-list?limit=300&page=1&sort_by=lastChecked&sort_type=desc&protocols=http%2Chttps",
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks4&timeout=10000",
    "https://api.proxyscrape.com/?request=getproxies&proxytype=socks4",
    "https://api.proxyscrape.com/?request=getproxies&proxytype=socks5",
    "https://api.proxyscrape.com/?request=getproxies&proxytype=http",
    "https://www.proxy-list.download/api/v1/get?type=socks4",
    "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt",
    "https://proxyspace.pro/http",
    "https://proxyspace.pro/https",
    "https://proxyspace.pro/socks4",
    "https://proxyspace.pro/socks5",
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
            return proxy; // Return the working proxy
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
        // Format the proxies in "IP : Port" format
        const proxyList = workingProxies.map(p => p.trim().replace(/(\d+\.\d+\.\d+\.\d+):(\d+)/, "$1 : $2")).join('\n');
        
        // Write the working proxies to BERSERKPROXY.txt
        fs.writeFile('BERSERKPROXY.txt', proxyList, (err) => {
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
            bot.sendDocument(channelId, 'BERSERKPROXY.txt', {}, { caption: message });
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
