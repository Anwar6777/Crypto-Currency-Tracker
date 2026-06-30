document.getElementById("search-button").addEventListener('click', () => {
    id = document.getElementById("search-inp").value
    fetch_data(id)
})

document.getElementById("theme_button").addEventListener("click", () => {
    const body = document.body;
    if (body.classList.contains("dark")) {
        body.classList.remove("dark")
        const img = document.getElementById("theme_img")
        img.src = "./assets/icons/sun.png"
        const img2 = document.getElementById("graph")
        img2.src = "./assets/icons/light_graph.png"
        const img3 = document.getElementById("graph2")
        img3.src = "./assets/icons/light_graph.png"
        const img4 = document.getElementById("search-img")
        img4.src = "./assets/icons/black_search.png"
    } else {
        body.classList.add("dark")
        const img = document.getElementById("theme_img")
        img.src = "./assets/icons/crescent.png"
        const img2 = document.getElementById("graph")
        img2.src = "./assets/icons/graph.png"
        const img3 = document.getElementById("graph2")
        img3.src = "./assets/icons/graph.png"
        const img4 = document.getElementById("search-img")
        img4.src = "./assets/icons/light_search.png"
    }
})

const formatToCompact = (num) => {
    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        compactDisplay: 'short', // Use 'long' for the full word "million"
        maximumFractionDigits: 1 // Controls decimal points
    }).format(num);
};

const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: 'UTC'
});

const last_update = document.getElementById("last_update")
const coin_img = document.getElementById("coin-img")
const coin_title = document.getElementById("coin-title")
const coin_symbol = document.getElementById("coin-symbol")
const rank = document.getElementById("rank")
const price = document.getElementById("price")
const price_indicator = document.getElementById("price-indicator")
const market_cap = document.getElementById("market-cap")
const volume_24h = document.getElementById("24h-volume")
const circulating_supply = document.getElementById("circulating-supply")
const max_supply = document.getElementById("max-supply")
const allth = document.getElementById("all-time-high")
const alltl = document.getElementById("all-time-low")

const mcap = document.getElementById("btm_market-cap")
const mcap_ptc = document.getElementById("market-percentage")
const btm_volume = document.getElementById("btm-volume")
const btm_volume_ptc = document.getElementById("volume-percentage")
const dominance = document.getElementById("Dominance")
const dominance_ptc = document.getElementById("Dominance-percentage")


async function fetch_data(id = "Bitcoin") {
    try {
        const data = {
            'id': id
        }
        const res = await fetch("http://127.0.0.1:5000/fetch_data", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (res.status == 200) {
            const data = await res.json()
            const parts = formatter.formatToParts(new Date(data['last_updated']));
            const p = Object.fromEntries(parts.map(part => [part.type, part.value]));
            const result = `${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}:${p.second} ${p.dayPeriod}`;
            last_update.innerText = `Last Updated: ${result}`
            coin_img.src = data['image']
            coin_title.innerText = data['name']
            coin_symbol.innerText = data['symbol'].toUpperCase()
            rank.innerText = `Rank #${data['market_cap_rank']}`
            price.innerText = `$${data['current_price']}`
            price_indicator.innerText = `${data['price_change_percentage_24h']}% (24h)`
            if (data['price_change_percentage_24h'] < 0) {
                price_indicator.style.color = "red"
            } else {
                price_indicator.style.color = "green"
            }
            market_cap.innerText = `$${formatToCompact(data['market_cap'])}`
            volume_24h.innerText = `$${formatToCompact(data['total_volume'])}`
            circulating_supply.innerText = `${formatToCompact(data['circulating_supply'])} ${data['symbol'].toUpperCase()}`
            max_supply.innerText = `${formatToCompact(data['max_supply'])} ${data['symbol'].toUpperCase()}`
            allth.innerText = `$${formatToCompact(data['ath'])}`
            alltl.innerText = `$${formatToCompact(data['atl'])}`
            mcap.innerText = `$${formatToCompact(data['market_cap_change_24h'])}`
            mcap_ptc.innerText = `${data['market_cap_change_percentage_24h']}%`
            btm_volume.innerText = `$${formatToCompact(data['high_24h'])}`
            btm_volume_ptc.innerText = `${data['price_change_percentage_24h']}%`
            dominance.innerText = `${data['price_change_percentage_24h']*100}%`
            dominance_ptc.innerText = `${data['market_cap_change_percentage_24h']*100}%`
        }
    } catch (err) {
        console.log(err);
    } finally {
        const timestamp = new Date().getTime();
        if (document.body.classList.contains('dark')) {
            document.getElementById("graph").src = "./assets/icons/graph.png?v=" + timestamp
            document.getElementById("graph2").src = "./assets/icons/graph.png?v=" + timestamp
        } else {
            document.getElementById("graph").src = "./assets/icons/light_graph.png?v=" + timestamp
            document.getElementById("graph2").src = "./assets/icons/light_graph.png?v=" + timestamp
        }
    }
}

document.getElementById("Top Coins").addEventListener('click', () => {
    fetch_top_coins()
})

async function fetch_top_coins() {
    const res = await fetch("http://127.0.0.1:5000/fetch-top-coins", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (res.status == 200) {
        const data = await res.json()
        let tbody = document.getElementById("tbody")
        
        tbody.innerHTML = ''
        for (var value of data) {
            const tr = document.createElement('tr')
            const srno = document.createElement('td')
            srno.innerHTML = value['#']
            const coin = document.createElement('td')
            coin.innerHTML = value['Coin']
            const prices = document.createElement('td')
            prices.innerHTML = value['Prices']
            const change_24h = document.createElement('td')
            change_24h.innerHTML = value['24h Change']
            const market_cap = document.createElement('td')
            market_cap.innerHTML = value['Market Cap']
            const volume_24h = document.createElement('td')
            volume_24h.innerHTML = value['24h Volume']
            const circulating_supply = document.createElement('td')
            circulating_supply.innerHTML = value['Circulating Supply']
            const last_7_days = document.createElement('td')
            const img = document.createElement('img')
            img.src = `./assets/sparklines/${value['Coin']}.png`
            img.style.width = "200px"
            img.style.height = "50px"
            last_7_days.appendChild(img)

            tr.appendChild(srno)
            tr.appendChild(coin)
            tr.appendChild(prices)
            tr.appendChild(change_24h)
            tr.appendChild(market_cap)
            tr.appendChild(volume_24h)
            tr.appendChild(circulating_supply)
            tr.appendChild(last_7_days)

            tbody.appendChild(tr)
        }
    }

}
