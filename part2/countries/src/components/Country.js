import React from 'react';

export default function Country({ country, buttonProps }) {
  return (
    <div>
      <div>
        <div>
          <h1>{country.name}</h1>
          {buttonProps ? (
            <button onClick={() => buttonProps.handleClick(country.key)}>
              {buttonProps.text}
            </button>
          ) : null}
        </div>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
      </div>
      <div>
        <h3>languages:</h3>
        <ul>
          {country.languages.map((lang) => (
            <li key={lang.key}>{lang.language}</li>
          ))}
        </ul>
      </div>
      <div>
        <img src={country.flagImgUrl} alt={`Flag Of ${country.name}`} />
      </div>
    </div>
  );
}
