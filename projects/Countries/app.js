// Global array to store normalized country data
let globalCountries = [];

// Fetches country data from the REST Countries API
async function fetchCountriesData() {
    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags"
        );
        
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const rawData = await response.json();

        // Map and normalize the data for easier access
        globalCountries = rawData.map((country) => {
            const currencyKey = country.currencies ? Object.keys(country.currencies)[0] : null;
            
            return {
                name: country.name.common || "N/A",
                capital: country.capital && country.capital.length > 0 ? country.capital[0] : "N/A",
                currency: currencyKey ? country.currencies[currencyKey].name : "N/A",
                flag: country.flags.png || ""
            };
        });

        // Initial render
        // globalCountries.sort((a, b) => a.name.localeCompare(b.name));
        hundleSortBy(globalCountries);
        renderTable(globalCountries);

    } catch (error) {
        console.error("Application Error:", error);
        document.getElementById("tableBody").innerHTML = 
            `<tr><td colspan="4" class="no-results">Error loading data. Please try again later.</td></tr>`;
    }
}

/**
 * Renders the filtered/full list of countries into the DOM
 * @param {Array} countryList - The array of country objects to display
 */
function renderTable(countryList) {
    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = ""; 

    if (countryList.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="no-results">No matches found.</td></tr>`;
        return;
    }

    countryList.forEach((country) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${country.flag}" class="flag-img" alt="Flag"></td>
            <td><strong>${country.name}</strong></td>
            <td>${country.capital}</td>
            <td>${country.currency}</td>
        `;
        tableBody.appendChild(row);
    });
}

/**
 * Filters the globalCountries array based on user input
 * Matches against name, capital, currency, and flag URL
 */
function handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();

    const filtered = globalCountries.filter((country) => {
        return (
            country.name.toLowerCase().includes(query) ||
            country.capital.toLowerCase().includes(query) ||
            country.currency.toLowerCase().includes(query) ||
            country.flag.toLowerCase().includes(query)
        );
    });

    renderTable(filtered);
}


// Sorting by clicking on headers name
function hundleSortBy(countryList) {
    const sortByButtons = document.querySelectorAll("th");

    sortByButtons.forEach(header => header.addEventListener("click", () => {
        const column = header.getAttribute("data-sort");
        const sortedAs = header.getAttribute("aria-sort"); // Ascending or Descending
        
        // Ascending or Descending depends on the aria-sort in the html
        if (!sortedAs || sortedAs !== 'ascending'){
            countryList.sort((a, b) => a[column].localeCompare(b[column]));
            sortByButtons.forEach(head => head.removeAttribute("aria-sort")); // Resets other headers sort status
            header.setAttribute("aria-sort", 'ascending');
        } else {
            countryList.sort((a, b) => b[column].localeCompare(a[column]));
            header.setAttribute("aria-sort", 'descending');
        }
        renderTable(countryList);
    }));
}

// Initialize data fetch on load
fetchCountriesData();

// Search on button click
document.getElementById("searchButton").addEventListener("click", handleSearch);

// Search as you type (Real-time filtering)
document.getElementById("searchInput").addEventListener("input", handleSearch);