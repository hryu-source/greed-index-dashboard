// Static Greed Index (replace with API later)
document.getElementById("greed-score").textContent = "75 (Extreme Greed)";

// Static company data
const companies = [
  { name: "Abbott Laboratories", ticker: "ABT", pe: 16 },
  { name: "Merck & Co", ticker: "MRK", pe: 11.64 },
  { name: "HSBC Holdings", ticker: "HSBC", pe: 6.41 },
  { name: "AstraZeneca", ticker: "AZN", pe: 6.91 },
  { name: "Adobe", ticker: "ADBE", pe: 23.42 },
  { name: "Applied Materials", ticker: "AMAT", pe: 23.17 },
  { name: "Sanofi", ticker: "SNY", pe: 9.94 },
  { name: "Lockheed Martin", ticker: "LMT", pe: 20.04 },
  { name: "General Dynamics", ticker: "GD", pe: 20.75 },
  { name: "CVS Health", ticker: "CVS", pe: 14.79 },
];

const table = document.getElementById("company-table");
companies.forEach(c => {
  const row = `<tr><td>${c.name}</td><td>${c.ticker}</td><td>${c.pe}</td></tr>`;
  table.innerHTML += row;
});


async function fetchGreedIndex() {
  const response = await fetch("https://fear-and-greed-index.p.rapidapi.com/v1/fgi", {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "x-rapidapi-key: ea053d13c0msh0a8e44046cd0debp11f2f1jsnc5cd5e77bbb4",
      "X-RapidAPI-Host": "fear-and-greed-index.p.rapidapi.com"
    }
  });

  const data = await response.json();  
  document.getElementById("greed-score").textContent = `${data.fgi.now.value} (${data.fgi.now.valueText})`;
}

fetchGreedIndex();
