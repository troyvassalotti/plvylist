import { LitElement, html } from "lit";
import styles from "./plvylist-player.css?inline";

export class Plvylist extends LitElement {
  static properties = {};

  static styles = styles;

  constructor() {
    super();
  }

  render() {
    return html`
      <audio id="plvylist"></audio>
      <section class="meta">
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
      <section class="seeker"></section>
      <section class="controls">
        <div class="controls__primary"></div>
        <div class="controls__secondary">
          <div class="volume"></div>
        </div>
      </section>
      <section class="tracklist">
        <ol id="songs"></ol>
      </section>
    `;
  }
}

customElements.define("plvylist-player", Plvylist);
