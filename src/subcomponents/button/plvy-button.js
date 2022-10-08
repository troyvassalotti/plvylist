import { LitElement, html } from "lit";
import { styles } from "./plvy-button.styles";

export class PlvyButton extends LitElement {
  static styles = styles;

  static properties = {
    playing: { type: Boolean },
    type: { type: String },
    size: { type: String },
    value: { type: Number },
    active: { type: Boolean }
  };

  constructor() {
    super();
    this.playing = false;
    this.type = "action";
    this.size = "standard";
    this.value = 0.5;
    this.active = false;

    // Wrapped in backticks to allow single and double quotes in the string
    this.icons = {
      play: `<title>Play</title><path d="M7 4v16l13 -8z"/>`,
      pause: `<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`,
      previous: `<title>Previous</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>`,
      next: `<title>Next</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 5v14l8-7z"></path><path d="M14 5v14l8-7z"></path>`,
      shuffle: `<title>Shuffle</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="15" width="6" height="6" rx="1"></rect><path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path><path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>`,
      loop: `<title>Loop</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path><path d="M11 11l1 -1v4"></path>`,
      volumeOff: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" />`,
      volumeLow: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
      volumeMid: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
    };
  }

  get sizingValue() {
    return this.size === "large" ? "34" : "24";
  }

  _renderIcon() {
    if (this.type === "action") {
      return this.playing ? html`${this.icons.play}` : html`${this.icons.pause}`;
    } else if (this.type === "volume") {
      return this.value === 0
        ? html`${this.icons.volumeOff}`
        : this.value <= 0.45
        ? html`${this.icons.volumeLow}`
        : html`${this.icons.volumeMid}`;
    } else {
      return html`${this.icons[this.type]}`;
    }
  }

  render() {
    return html`
      <button>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          width=${this.sizingValue}
          height=${this.sizingValue}
          part="icon">
          ${this._renderIcon()}
        </svg>
      </button>
    `;
  }
}

customElements.define("plvy-button", PlvyButton);
