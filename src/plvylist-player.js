import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import placeholderArtwork from "./placeholder-artwork.svg";
import styles from "./plvylist-player.css?inline";

export class Plvylist extends LitElement {
  static styles = styles;

  static properties = {
    icons: { type: Object },
    placeholder: { type: String },
    tracks: { type: String },
    startingVolume: { type: Number, attribute: "starting-volume" },
    startingTime: { type: Number, attribute: "starting-time" },
  };

  constructor() {
    super();
    this.placeholder = placeholderArtwork;

    // Wrapped in backticks to allow single and double quotes in the string
    this.icons = [
      {
        name: "play",
        icon: `<title>Play</title><path d="M7 4v16l13 -8z"/>`,
      },
      {
        name: "pause",
        icon: `<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`,
      },
      {
        name: "previous",
        icon: `<title>Previous</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>`,
      },
      {
        name: "next",
        icon: `<title>Next</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M3 5v14l8-7z"></path><path d="M14 5v14l8-7z"></path>`,
      },
      {
        name: "shuffle",
        icon: `<title>Shuffle</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><rect x="3" y="3" width="6" height="6" rx="1"></rect><rect x="15" y="15" width="6" height="6" rx="1"></rect><path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path><path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>`,
      },
      {
        name: "loop",
        icon: `<title>Loop</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path><path d="M11 11l1 -1v4"></path>`,
      },
      {
        name: "volumeOff",
        icon: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path d="M16 10l4 4m0 -4l-4 4" />`,
      },
      {
        name: "volumeLow",
        icon: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
      },
      {
        name: "volumeMid",
        icon: `<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
      },
    ];
  }

  _query(queryString) {
    return this?.renderRoot.querySelector(queryString);
  }

  /**
   * Creates a button element with the chosen SVG icon
   * @param id
   * @param icon
   * @param type
   * @returns {HTMLButtonElement}
   */
  _renderIcon(id, icon, type = "") {
    const size = type === "large" ? "34" : "24";

    return html`
      <button id=${id}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          width=${size}
          height=${size}>
          ${icon}
        </svg>
      </button>
    `;
  }

  get audioElement() {
    return this._query("#audio");
  }

  get albumArtwork() {
    return this._query("#artwork");
  }

  render() {
    return html`
      <audio id="audio"></audio>
      <section class="metadata">
        <img
          src="${this.placeholder}"
          alt="album artwork"
          id="artwork"
          width="300"
          height="300"
          loading="lazy"
          decoding="async" />
        <div class="track-info">
          <p class="artist">--</p>
          <p class="track">--</p>
          <p class="album">--</p>
          <p class="timer">
            <span class="currentTime">--</span> / <span class="duration">--</span>
          </p>
        </div>
      </section>
      <section class="seeker">
        <input
          id="track-seeker"
          type="range"
          min="0"
          step="0.01"
          value="0"
          aria-label="Seek through the track" />
      </section>
      <section class="controls">
        <div class="controls__primary">
          ${map(this.icons, (icon) => this._renderIcon(icon.name, icon.icon))}
        </div>
        <div class="controls__secondary">
          <div class="volume">
            <input
              id="volume-slider"
              type="range"
              min="0"
              step="0.01"
              max="1"
              aria-label="Volume control" />
          </div>
        </div>
      </section>
      <section class="tracklist">
        <ol id="songs"></ol>
      </section>
    `;
  }
}

customElements.define("plvylist-player", Plvylist);
