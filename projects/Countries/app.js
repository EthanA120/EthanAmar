const globalCountries = [];

async function getCountries() {
  try {
    const result = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,capital,currencies,flags",
    );
    const countries = await result.json();
    console.log(countries);

    //print for the first country the:
    countries.forEach((country) => {
      const currencyValue = Object.values(country.currencies)[0];
      const normalizeCountry = {
        name: country.name.common,
        capital: country.capital[0],
        currency: currencyValue?.name,
        flag: country.flags.png,
      };
      printCountry(normalizeCountry);
      globalCountries.push(normalizeCountry);
    });
  } catch (error) {
    console.log(error);
  }
}

function printCountry({ name, capital, currency, flag }) {
  const row = document.createElement("tr");
  const nameTd = document.createElement("td");
  const capitalTd = document.createElement("td");
  const currencyTd = document.createElement("td");
  const flagTd = document.createElement("td");
  row.appendChild(nameTd);
  row.appendChild(capitalTd);
  row.appendChild(currencyTd);
  row.appendChild(flagTd);

  const table = document.getElementById("countriesTable");
  table.appendChild(row);

  nameTd.innerText = name;
  capitalTd.innerText = capital;
  currencyTd.innerText = currency;
  flagTd.innerHTML = `<img src="${flag}"/>`;
}

function searchCountry() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();

  const filteredCountries = globalCountries.filter(
    (country) =>
      country.name?.toLowerCase()?.includes(searchQuery) ||
      country.capital?.toLowerCase()?.includes(searchQuery),
  );
  const table = document.getElementById("countriesTable");
  table.innerHTML = "";
  filteredCountries.forEach((c) => printCountry(c));
}

getCountries();

const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", searchCountry);
