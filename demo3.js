import './simple-router.js';
import { DependencyInjectionMixin, define } from './dependency.js';
import { Dispatcher } from './messaging.js';

const messageBus = Dispatcher('search');

// code taken from demo #1

document.querySelector('#demo-input').onchange = (event) => {
  messageBus.emit('search', event.target.value);
};




// Lets define a service to be injected

class SearchService {
  constructor() {
    messageBus.on('search', (query) => this.search(query));
  }

  search(query) {
    fetch(`https://randomuser.me/api?seed=${query}`)
      .then(r => r.json())
      .then(data => {
        this.lastResult = data.results[0].login.username;
        messageBus.emit('search-result', this.lastResult);
      })
      .catch(() => {
        this.lastResult = 'Connection error, take this instead ' + Math.random();
        messageBus.emit('search-result', this.lastResult);
      })
  }
}

const searchService = new SearchService();

define('searchService', () => searchService);



class HomePage extends DependencyInjectionMixin(HTMLElement) {
  
  // THIS IS WHERE WE DEFINE REQUIREMENTS
  static get dependencies() {
    return ['searchService'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/ `
        <h1>This is the home page</h1>
        <h2 id="result"></h2>
      `;
  }

  connectedCallback() {
    this.unsubscribe = messageBus.on('search-result', (data) =>
      this.updateResult(this.injections.searchService.lastResult)
    );
  }

  disconnectedCallback() {
    this.unsubscribe();
  }

  updateResult(data) {
    this.shadowRoot.querySelector('#result').innerHTML =
      'Found username: ' + data;
  }
}
customElements.define('home-page', HomePage);








class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/ `
        <h1>This is the settings page</h1>
      `;
  }
}

customElements.define('settings-page', SettingsPage);

window.location.hash = 'home';
