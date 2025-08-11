// Retrieve API key from query string, defaulting to demo
const apiKey = new URLSearchParams(window.location.search).get('apikey') || 'demo';

function formatMarketCap(value) {
  if (!value && value !== 0) return 'N/A';
  if (value >= 1e12) {
    return (value / 1e12).toFixed(2) + 'T';
  }
  return (value / 1e9).toFixed(2) + 'B';
}

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
    // Use stock-screener to retrieve a manageable list of large-cap stocks
    const url =
      `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=100000000000&limit=100&apikey=${apiKey}`;
    let data;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('API error');
      }
      data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data');
      }
    } catch (networkErr) {
      const fallback = await fetch('data/top_companies.json');
      data = await fallback.json();
    }
    const top = data
      .filter(c => c.marketCap && c.pe && c.pe > 0 && c.pe < 25)
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, 10);

    const table = document.getElementById('company-table');
    table.innerHTML = '';
    top.forEach(c => {
      const marketCap = formatMarketCap(c.marketCap);
      const pe = c.pe ? c.pe.toFixed(2) : 'N/A';
      const row = `<tr><td>${c.name}</td><td>${c.symbol}</td><td>${marketCap}</td><td>${pe}</td></tr>`;
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
    // Retrieve dividend-paying stocks and rank by yield with positive growth
    const url =
      `https://financialmodelingprep.com/api/v3/stock-screener?dividendMoreThan=0&limit=100&apikey=${apiKey}`;
    let data;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('API error');
      }
      data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data');
      }
    } catch (networkErr) {
      const fallback = await fetch('data/dividend_companies.json');
      data = await fallback.json();
    }
    const top = data
      .filter(
        c =>
          c.dividendYield &&
          c.changesPercentage &&
          parseFloat(c.changesPercentage) > 0
      )
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
