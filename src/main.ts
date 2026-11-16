import { createSearch, type SearchState } from './search.js';
import type { Country } from './country.js';

function element<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  return node;
}

const app = element('main', 'app');

const header = element('header', 'header');

const badge = element('span', 'eyebrow', 'EXPLORE THE WORLD');

const title = element('h1', '', 'Country Explorer');

const subtitle = element('p', 'subtitle', 'Discover countries, capitals, languages and cultures.');

header.append(badge, title, subtitle);

const searchBox = element('section', 'search-box');

const label = element('label', 'search-label', 'Search for a country');

label.htmlFor = 'country-input';

const input = element('input', 'search-input');

input.id = 'country-input';
input.type = 'search';
input.placeholder = 'Try Kazakhstan, Spain or Japan...';
input.autocomplete = 'off';

searchBox.append(label, input);

const status = element('div', 'status');
status.setAttribute('role', 'status');
status.setAttribute('aria-live', 'polite');

const retryButton = element('button', 'primary-button', 'Try again');

retryButton.type = 'button';
retryButton.hidden = true;

const results = element('section', 'results');

const dialog = element('dialog', 'country-dialog');

const footer = element('footer', 'footer', 'Country Explorer • Powered by countries.dev');

app.append(header, searchBox, status, retryButton, results, footer);

document.body.append(app, dialog);

function information(label: string, value: string) {
  const row = element('div', 'information');
  const name = element('strong', '', `${label}: `);
  const content = element('span', '', value);

  row.append(name, content);

  return row;
}

function countryFlag(country: Country) {
  if (!country.flag) {
    return element('div', 'flag-placeholder', country.emoji || '🌍');
  }

  const image = element('img', 'country-flag');

  image.src = country.flag;
  image.alt = `Flag of ${country.name}`;
  image.loading = 'lazy';

  return image;
}

function showDetails(country: Country) {
  dialog.replaceChildren();

  const closeButton = element('button', 'close-button', 'Close ×');

  closeButton.type = 'button';

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  const heading = element('h2', '', country.name);

  const description = element('p', 'description', country.description);

  const content = element('div', 'detail-content');

  content.append(
    information('Capital', country.capital),
    information('Region', country.region),
    information('Population', country.population.toLocaleString('en-US')),
    information(
      'Area',
      country.area === null ? 'Unknown' : `${country.area.toLocaleString('en-US')} km²`,
    ),
    information('Borders', country.borders.join(', ') || 'None'),
    information('Languages', country.languages.join(', ') || 'Unknown'),
    information('Currencies', country.currencies.join(', ') || 'Unknown'),
  );

  dialog.append(closeButton, countryFlag(country), heading, description, content);

  dialog.showModal();
}

function createCountryCard(country: Country) {
  const card = element('button', 'country-card');

  card.type = 'button';

  const body = element('div', 'card-body');

  const heading = element('span', 'country-name', country.name);

  body.append(
    heading,
    information('Capital', country.capital),
    information('Region', country.region),
    information('Population', country.population.toLocaleString('en-US')),
    element('span', 'details-link', 'View details →'),
  );

  card.append(countryFlag(country), body);

  card.addEventListener('click', () => {
    showDetails(country);
  });

  return card;
}

function render(state: SearchState) {
  results.replaceChildren();

  retryButton.hidden = true;
  status.className = `status ${state.kind}`;

  if (dialog.open) {
    dialog.close();
  }

  switch (state.kind) {
    case 'idle':
      status.textContent = 'Start typing a country name.';
      break;

    case 'loading':
      status.textContent = 'Searching countries...';
      break;

    case 'empty':
      status.textContent = 'No countries found. Try another name.';
      break;

    case 'error':
      status.textContent = state.message;
      retryButton.hidden = false;
      break;

    case 'results':
      status.textContent = `Found ${state.countries.length} countries`;

      results.append(...state.countries.map(createCountryCard));

      break;
  }
}

const search = createSearch(render);

input.addEventListener('input', () => {
  search.input(input.value);
});

retryButton.addEventListener('click', () => {
  search.retry();
});

render({ kind: 'idle' });
