import { Slim } from 'https://www.unpkg.com/slim-js@5.0.6/dist/index.js?module';

Slim.element(
  'settings-component',

  /*html*/ `
  
  <h1>Settings</h1>

  <label>Select theme<label>
  <select .value="{{this.currentTheme}}" @change="this.updateTheme(event.target.value)">
    <option value="dark">Dark</option>
    <option value="light">Light</option>
  </select>
  `,

  class extends Slim {
    constructor() {
      super();
      this.currentTheme = document.body.getAttribute('theme');
      if (!this.currentTheme) {
        this.currentTheme = 'light';
      }
    }

    updateTheme(value) {
      this.currentTheme = value;
      document.body.setAttribute('theme', this.currentTheme);
    }
  }
);
