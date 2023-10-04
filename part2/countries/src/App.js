import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import countryService from './services/countryService';
import Weather from './components/Weather';
import Country from './components/Country';

function App() {
  const [countries, setCountries] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [warning, setWarning] = useState(false);
  const [showCountries, setShowCountries] = useState(false);
  const [isFetched, setIsFetched] = useState(false);
  const [filterCountries, setFilterCountries] = useState([]);
  useEffect(() => {
    countryService.getAll().then((data) => setCountries(data));
    setIsFetched(true);
  }, []);
  useEffect(() => {
    if (isFetched) {
      const listFilteredCountries = countries.filter((c) => {
        const commonName = c.name.common.toLowerCase();
        const searchStr = searchValue.toLowerCase();
        return commonName.includes(searchStr) ? true : false;
      });
      if (listFilteredCountries.length > 10) {
        setShowCountries(false);
        if (searchValue === '') {
          setWarning(false);
        } else {
          setWarning(true);
        }
      } else if (
        listFilteredCountries.length > 0 &&
        listFilteredCountries.length <= 10
      ) {
        setWarning(false);
        setFilterCountries(
          listFilteredCountries.map((c) => ({
            latlng: c.capitalInfo.latlng,
            showDetailedView: false,
            key: uuidv4(),
            name: c.name.common,
            capital: c.capital,
            area: c.area,
            languages: Object.values(c.languages).map((lang) => ({
              language: lang,
              key: uuidv4(),
            })),
            flagImgUrl: c.flags.png,
          }))
        );
        setShowCountries(true);
      } else {
        setShowCountries(false);
        setWarning(false);
      }
    }
  }, [searchValue]);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  if (!countries) {
    setShowCountries(false);
  }

  const handleShowCountryInfo = (key) => {
    setFilterCountries(
      filterCountries.map((country) =>
        country.key === key
          ? { ...country, showDetailedView: !country.showDetailedView }
          : country
      )
    );
  };

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          find countries: <input value={searchValue} onChange={handleChange} />
        </form>
        {warning ? 'Too many matches, specify another filter' : null}
      </div>
      {showCountries
        ? filterCountries.length > 1
          ? filterCountries.map((country) =>
              country.showDetailedView ? (
                <Country
                  key={country.key}
                  country={country}
                  buttonProps={{
                    handleClick: handleShowCountryInfo,
                    text: 'Hide',
                  }}
                />
              ) : (
                <div key={country.key}>
                  <div>
                    {country.name}
                    <button onClick={() => handleShowCountryInfo(country.key)}>
                      show
                    </button>
                  </div>
                </div>
              )
            )
          : filterCountries.map((country) => (
              <div key={country.key}>
                <Country country={country} />
                <Weather capital={country.capital} latlng={country.latlng} />
              </div>
            ))
        : null}
    </div>
  );
}

export default App;
