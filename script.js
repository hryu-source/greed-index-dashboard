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
    // Fetch live data from Financial Modeling Prep's stock screener
    const url =
      'https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=100000000000&peLowerThan=30&limit=100&apikey=demo';
    const response = await fetch(url);
    const data = await response.json();
    const top = data.sort((a, b) => b.marketCap - a.marketCap).slice(0, 10);

    const table = document.getElementById('company-table');
    table.innerHTML = '';
    top.forEach(c => {
      const marketCapB = (c.marketCap / 1e9).toFixed(2);
      const pe = c.pe ? c.pe.toFixed(2) : 'N/A';
      const row = `<tr><td>${c.companyName}</td><td>${c.symbol}</td><td>${marketCapB}</td><td>${pe}</td></tr>`;
      table.innerHTML += row;
    });
  } catch (err) {
    document.getElementById('company-table').innerHTML = '<tr><td colspan="4">Error fetching data</td></tr>';
  }
}

fetchGreedIndex();
fetchTopCompanies();
