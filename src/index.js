import './css/styles.css';
import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import API from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const renderDropdown = (wrapper, object) => {
    object.forEach(element => {
        wrapper.insertAdjacentHTML('beforeend', `<li><img src="${element.flags.svg}" width="20"> ${element.name.official}</li>`);
    });
};

const renderInfoBox = (wrapper, object) => {
    if(object.length === 1) {
        clearInnerHtml(countryList);
        const langList = Object.values(object[0].languages);
        wrapper.insertAdjacentHTML('beforeend', `<h2><img src="${object[0].flags.svg}" width="40"> ${object[0].name.official}</h2>
        <dl>
            <dt>Capital</dt>
            <dd>${object[0].capital}</dd>
            <dt>Population</dt>
            <dd>${object[0].population}</dd>
            <dt>Languages</dt>
            <dd>${langList.join(', ')}</dd>
        </dl>`);
    }
};

const clearInnerHtml = wrapper => {
    wrapper.innerHTML = '';
};

const searchInputHandler = e => {
    const enteredText = e.target.value;
    const sanitiedText = enteredText.trim();
    
    // clear previous result
    clearInnerHtml(countryList);
    clearInnerHtml(countryInfo);

    // Если пользователь полностью очищает поле поиска, то HTTP-запрос не выполняется,
    // а разметка списка стран или информации о стране пропадает.
    if(enteredText.length === 0) {
        return;
    }

    const resultObject = API.fetchCountries(sanitiedText)
        .then(result=>{
            if(result.length > 10) {
                Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
                return;
            } 
            
            if(result.status === 404){
                Notiflix.Notify.failure('Oops, there is no country with that name');
                return;
            }

            renderDropdown(countryList, result);
            renderInfoBox(countryInfo, result);

        })
        .catch(error=>{
            console.log(error);
        });

};

searchInput.addEventListener('input', debounce(searchInputHandler, DEBOUNCE_DELAY));