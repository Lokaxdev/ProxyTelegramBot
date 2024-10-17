const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

// Replace with your Telegram Bot Token
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

// Extensive list of free proxy sources
const proxySources = [
    "https://www.proxy-list.download/api/v1/get?type=socks5",      // SOCKS5 proxy list
    "https://www.proxy-list.download/api/v1/get?type=https",       // HTTPS proxy list
    "https://www.proxy-list.download/api/v1/get?type=http",        // HTTP proxy list
    "https://www.proxyscan.io/api/proxy?type=socks5",              // Proxyscan SOCKS5 API
    "https://www.proxyscan.io/api/proxy?type=https",               // Proxyscan HTTPS API
    "https://www.proxyscan.io/api/proxy?type=http",                // Proxyscan HTTP API
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000",  // ProxyScrape SOCKS5
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=http&timeout=10000",    // ProxyScrape HTTP
    "https://api.proxyscrape.com/v2/?request=displayproxies&protocol=https&timeout=10000",   // ProxyScrape HTTPS
    "https://spys.me/proxy.txt",                                   // Spys.me proxy list
    "https://www.sslproxies.org/",                                 // SSLProxies.org
    "https://free-proxy-list.net/",                                // Free Proxy List (HTTP/HTTPS)
    "https://us-proxy.org/",                                       // US Proxy list (HTTP/HTTPS)
    "https://socks-proxy.net/",                                    // SOCKS Proxy list
    "https://www.proxy-listen.de/Proxy/Proxyliste.html",           // Proxy-Listen.de (SOCKS4, SOCKS5, HTTP)
    "https://openproxy.space/list/socks5",                         // OpenProxy SOCKS5
    "https://openproxy.space/list/http",                           // OpenProxy HTTP
    "https://www.my-proxy.com/free-proxy-list.html",               // My-Proxy HTTP
    "https://hidemy.name/en/proxy-list/?type=hs&anon=34#list",     // HideMyName (HTTPS and SOCKS5)
    "https://www.cool-proxy.net/proxies/http_proxy_list/country_code:/port:/anonymous:1", // Cool-Proxy (Anonymous HTTP)
    "https://proxy-daily.com/",                                    // Proxy-Daily free proxy list (HTTP, HTTPS, SOCKS)
    "https://www.freeproxylists.net/",                             // FreeProxyLists.net (HTTP, HTTPS, SOCKS4/5)
    "https://proxoid.net/",                                        // Proxoid (SOCKS5 and HTTP)
    "https://proxysearcher.sourceforge.io/Proxy%20List.php?type=http", // ProxySearcher (HTTP)
    "https://www.proxydb.net/",                                    // ProxyDB.net
    "https://www.advanced.name/freeproxy",                         // AdvancedName (SOCKS5, HTTP)
    "https://api.getproxylist.com/proxy",                          // GetProxyList API
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt", // SpeedX SOCKS5
    "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list.txt", // Clarketm proxy list
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt", // ShiftyTR HTTP proxy list
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt", // ShiftyTR HTTPS proxy list
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt", // ShiftyTR SOCKS4 proxy list
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt", // ShiftyTR SOCKS5 proxy list
    "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt", // Mert HTTP proxy list
    "https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt", // HookzOf SOCKS5
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt", // JetKai SOCKS5
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt", // JetKai HTTP
    "https://www.proxylists.net/",                                 // ProxyLists.net (Free proxies)
    "https://www.proxynova.com/proxy-server-list/",                // ProxyNova (Updated list)
    "https://www.proxy-list.download/api/v1/get?type=all",        // All types of proxies (HTTP, HTTPS, SOCKS)
    "https://www.proxysite.com/proxy-list",                        // Proxysite.com proxy list
    "https://www.freeproxycafe.com/",                              // FreeProxyCafe (Rotating list)
    "https://www.pacproxy.com/free-proxy-list",                    // PACProxy (Free Proxy)
    "https://www.proxylist1.com/",                                 // ProxyList1 (Multiple types)
    "https://www.proxiesforrent.com/free-proxy-list/",             // Proxies For Rent (Free proxy list)
    "https://free-proxy.cz/en/proxylist/country/all/1",           // Free Proxy CZ
    "https://www.getproxylist.com/",                               // GetProxyList
    "https://www.gatherproxy.com/proxylist",                       // GatherProxy
    "https://www.my-proxy.com/free-proxy-list.html",               // My-Proxy (free list)
    "https://www.proxytube.com/",                                  // ProxyTube (Proxy List)
    "https://www.proxypanel.com/free-proxy-list/",                // ProxyPanel (Free Proxy)
    "https://www.proxylists.net/free-proxy-list/",                 // ProxyLists Free Proxy
    "https://www.proxy-list.net/",                                  // Proxy List (Various Types)
    "https://www.dizproxy.com/",                                   // Dizproxy (Public Proxies)
    "https://www.proxydb.net/api/proxy?count=50&type=http",       // ProxyDB (50 random HTTP proxies)
    "https://www.proxydb.net/api/proxy?count=50&type=https",      // ProxyDB (50 random HTTPS proxies)
    "https://www.proxydb.net/api/proxy?count=50&type=socks5",     // ProxyDB (50 random SOCKS5 proxies)
    "https://proxies.world/",                                      // Proxies World
    "https://pubproxy.com/api/proxy?count=20",                    // PubProxy (20 random proxies)
    "https://www.proxy-list.download/api/v1/get?type=socks4",     // SOCKS4 proxy list
    "https://www.freeproxy.world/",                                 // Free Proxy World
    "https://www.proxyscan.io/api/proxy?type=socks4",              // Proxyscan SOCKS4 API
    "https://www.proxysite.com/api/proxy",                         // Proxysite API
    "https://github.com/robertknight/Proxy-List/raw/master/proxylist.txt", // GitHub Proxy List
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
        bot.sendMessage(chatId, `Here are the active proxies:\n\n${proxyList}`);
    } else {
        bot.sendMessage(chatId, "No active proxies found.");
    }
});

// Log bot start
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code}`, error.message);
});
