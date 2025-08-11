# Greed Index Dashboard

This simple dashboard displays the current Fear & Greed Index and lists the top 10 companies with the largest market capitalizations and low price-to-earnings ratios.

Company data is retrieved in real time from the [Financial Modeling Prep](https://financialmodelingprep.com/) stock screener API. The included demo key is suitable for limited testing—supply your own key via `index.html?apikey=YOUR_KEY` for up‑to‑date results and higher usage limits.

## Usage
Open `index.html` in a web browser. The page fetches real-time data from public APIs.
If the APIs are unreachable, the tables fall back to sample data located in the `data/` directory so the dashboard remains usable offline.
