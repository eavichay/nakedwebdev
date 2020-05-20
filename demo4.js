import './simple-router.js';
import { DependencyInjectionMixin, define } from './dependency.js';
import { Dispatcher } from './messaging.js';
import { Observable } from './observable.js';


// Let's create an observable

const observable = Observable();




const messageBus = Dispatcher('search');

// code taken from demo #1

document.querySelector('#demo-input').onchange = (event) => {
  messageBus.emit('search', event.target.value);
};




// Lets define a service to be injected,
// this time the service updates the observable instead of dispatching an event

class SearchService {
  constructor() {
    messageBus.on('search', (query) => this.search(query));
  }

  search(query) {
    fetch(`https://randomuser.me/api?seed=${query}`)
      .then((r) => r.json())
      .then((data) => {
        observable.value.data = { ...data.results[0] };
      })
      .catch((err) => {
      });
  }
}

const searchService = new SearchService();

define('searchService', () => searchService);





class HomePage extends DependencyInjectionMixin(HTMLElement) {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/ `
        <h1>This is the home page</h1>
        <label>Username: </label><span id="username"></span>
        <br/>
        <label>UUID: </label><span id="uuid"></span>
      `;
  }

  connectedCallback() {
    this.unsubscribe1 = observable.watch('.data.login.username', (value) =>
      this.updateUsername(value)
    );
    this.unsubscribe2 = observable.watch('.data.login.uuid', (value) =>
      this.updateUUID(value)
    );
  }

  disconnectedCallback() {
    this.unsubscribe1();
    this.unsubscribe2();
  }

  static get dependencies() {
    return ['searchService'];
  }

  updateUsername(data) {
    this.shadowRoot.querySelector('#username').innerHTML = data;
  }

  updateUUID(data) {
    this.shadowRoot.querySelector('#uuid').innerHTML = data;
  }
}
customElements.define('home-page', HomePage);















class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/ `
        <h1>This is the settings page</h1>
        <img id="picture">
      `;
  }

  connectedCallback() {
    this.unsubscribe = observable.watch('.data.picture.large', (data) =>
      this.shadowRoot.querySelector('#picture').src = data
    );
  }

  disconnectedCallback() {
    this.unsubscribe();
  }
}

customElements.define('settings-page', SettingsPage);

window.location.hash = 'home';
