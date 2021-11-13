const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name, fields=['name', 'capital', 'population', 'flags', 'languages']) {
  return fetch(`${BASE_URL}/name/${name}?fields=${fields.join(',')}`)
    .then(response => response.json())
    .catch(error => {console.log(error)});
}

export default { fetchCountries };