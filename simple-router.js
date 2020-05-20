class SimpleRouter extends HTMLElement {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  connectedCallback() {
    window.addEventListener('popstate', this.handleChange);
    this.handleChange();
  }

  disconnectedCallback() {
    window.removeEventListener('popstate', this.handleChange);
  }

  handleChange() {
    const myRoute = this.getAttribute('route');
    if (window.location.hash.slice(1) === myRoute) {
      const component = this.getAttribute('component');
      if (component) {
        this.innerHTML = `<${component}></${component}>`;
        this.style.display = 'inline-block';
      }
    } else {
      this.innerHTML = '';
      this.style.display = 'none';
    }
  }
}

customElements.define('simple-router', SimpleRouter);
