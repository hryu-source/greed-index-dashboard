// Fetch and display the current fear and greed index
async function fetchGreedIndex() {
  try {
    // Append query parameters to avoid CORS issues when deployed
    const response = await fetch('https://api.alternative.me/fng/?limit=1&format=json&cors=true');
    const data = await response.json();
    const { value, value_classification } = data.data[0];
    document.getElementById('greed-score').textContent = `${value} (${value_classification})`;
  } catch (err) {
    document.getElementById('greed-score').textContent = 'Error fetching data';
  }
}

// Fetch and display top 10 companies with large market cap and low P/E
async function fetchTopCompanies() {
  try {
    // Grab a broad list of stocks and compute the largest market caps
    const url = 'https://financialmodelingprep.com/api/v3/stock/list?limit=1000&apikey=demo';
    const response = await fetch(url);
    const data = await response.json();
    const top = data
      .filter(c => c.marketCap && c.pe)
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 10);

    const table = document.getElementById('company-table');
    table.innerHTML = '';
    top.forEach(c => {
      const marketCapB = (c.marketCap / 1e9).toFixed(2);
      const pe = c.pe ? c.pe.toFixed(2) : 'N/A';
      const row = `<tr><td>${c.name}</td><td>${c.symbol}</td><td>${marketCapB}</td><td>${pe}</td></tr>`;
      table.innerHTML += row;
    });
  } catch (err) {
    document.getElementById('company-table').innerHTML =
      '<tr><td colspan="4">Error fetching data</td></tr>';
  }
}

// Fetch and display top 10 dividend-paying companies with positive price change
async function fetchDividendCompanies() {
  try {
    // Retrieve a broad list and calculate dividend yield for gainers
    const url = 'https://financialmodelingprep.com/api/v3/stock/list?limit=1000&apikey=demo';
    const response = await fetch(url);
    const data = await response.json();
    const top = data
      .filter(
        c =>
          c.lastDiv &&
          c.price &&
          c.changesPercentage &&
          parseFloat(c.changesPercentage) > 0
      )
      .map(c => ({ ...c, dividendYield: (c.lastDiv / c.price) * 100 }))
      .sort((a, b) => b.dividendYield - a.dividendYield)
      .slice(0, 10);

    const table = document.getElementById('dividend-table');
    table.innerHTML = '';
    top.forEach(c => {
      const dividend = c.dividendYield.toFixed(2);
      const change = parseFloat(c.changesPercentage).toFixed(2);
      const row = `<tr><td>${c.name}</td><td>${c.symbol}</td><td>${dividend}</td><td>${change}</td></tr>`;
      table.innerHTML += row;
    });
  } catch (err) {
    document.getElementById('dividend-table').innerHTML =
      '<tr><td colspan="4">Error fetching data</td></tr>';
  }
}

fetchGreedIndex();
fetchTopCompanies();
fetchDividendCompanies();
