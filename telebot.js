const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');
const fs = require('fs'); // Import the fs module

// Replace with your Telegram Bot Token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

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
    "https://www.sslproxies.org/",
    "https://free-proxy-list.net/",
    "https://us-proxy.org/",
    "https://socks-proxy.net/",
    "https://www.proxy-listen.de/Proxy/Proxyliste.html",
    "https://openproxy.space/list/socks5",
    "https://openproxy.space/list/http",
    "https://www.my-proxy.com/free-proxy-list.html",
    "https://hidemy.name/en/proxy-list/?type=hs&anon=34#list",
    "https://www.cool-proxy.net/proxies/http_proxy_list/country_code:/port:/anonymous:1",
    "https://proxy-daily.com/",
    "https://www.freeproxylists.net/",
    "https://proxoid.net/",
    "https://proxysearcher.sourceforge.io/Proxy%20List.php?type=http",
    "https://www.proxydb.net/",
    "https://www.advanced.name/freeproxy",
    "https://api.getproxylist.com/proxy",
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt",
    "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt",
    "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt",
    "https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
    "https://www.proxylists.net/",
    "https://www.proxy-nova.com/proxy-server-list/",
    "https://www.proxy-list.download/api/v1/get?type=all",
    "https://www.proxysite.com/proxy-list",
    "https://www.freeproxycafe.com/",
    "https://www.pacproxy.com/free-proxy-list",
    "https://www.proxylist1.com/",
    "https://www.proxiesforrent.com/free-proxy-list/",
    "https://free-proxy.cz/en/proxylist/country/all/1",
    "https://www.getproxylist.com/",
    "https://www.gatherproxy.com/proxylist",
    "https://www.my-proxy.com/free-proxy-list.html",
    "https://www.proxytube.com/",
    "https://www.proxy-panel.com/free-proxy-list/",
    "https://www.proxy-lists.net/free-proxy-list/",
    "https://www.proxylist.net/",
    "https://www.dizproxy.com/",
    "https://www.proxydb.net/api/proxy?count=50&type=http",
    "https://www.proxydb.net/api/proxy?count=50&type=https",
    "https://www.proxydb.net/api/proxy?count=50&type=socks5",
    "https://proxies.world/",
    "https://pubproxy.com/api/proxy?count=20",
    "https://www.proxy-list.download/api/v1/get?type=socks4",
    "https://www.freeproxy.world/",
    "https://www.proxyscan.io/api/proxy?type=socks4",
    "https://www.proxysite.com/api/proxy",
    "https://github.com/robertknight/Proxy-List/raw/master/proxylist.txt",
];

// Function to fetch proxies from all sources
async function getProxies() {
    let allProxies = [];

    for (let source of proxySources) {
        try {
            const response = await fetch(source);
            const proxyList = await response.text();
            // If the source contains plain proxies, split them by line and add to the list
            allProxies = allProxies.concat(proxyList.split("\n").filter(Boolean));
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

// Command handler for /sendproxy
bot.onText(/\/sendproxy/, async (msg) => {
    const chatId = msg.chat.id;
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
                bot.sendMessage(chatId, "Failed to create proxy file.");
                return;
            }

            // Send the file back to the user
            bot.sendDocument(chatId, 'LokaXProxy.txt', {}, { caption: "Here are the active proxies:" });
        });
    } else {
        bot.sendMessage(chatId, "No active proxies found.");
    }
});

// Log bot start
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code}`, error.message);
});
