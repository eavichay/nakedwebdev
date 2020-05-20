import './simple-router.js';



class HomePage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/ `
        <h1>This is the home page</h1>
        <img src="https://lh3.googleusercontent.com/proxy/tTI49eLVXEfUj3e2xQtVVJimiooyfCnRmzF63XcbM8FZjasZVF-Go_4Spry6aSh8j8B1eTqfM6P1-0TQQt9VFgZg8eHAaro10J3_VKR_WAMOpO7KF9bZANl3W-IkQlCrDJixSXmEbQ">
      `;
  }
}

customElements.define('home-page', HomePage);



class SettingsPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = /*html*/ `
        <h1>This is the settings page</h1>
        <h2>:( no picture here</h2>
      `;
  }
}


customElements.define('settings-page', SettingsPage);


window.location.hash = 'home';