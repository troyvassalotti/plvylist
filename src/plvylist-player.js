/**
 * @TODO turn the buttons into components, in particular the play/pause button so it knows state of play vs. pause for icon
 */
import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import placeholderArtwork from "./placeholder-artwork.svg";
import { styles } from "./plvylist-player.styles";
import "./subcomponents/button/plvy-button";

const EMPTY_METADATA = "--";

export class Plvylist extends LitElement {
  static styles = styles;

  static properties = {
    icons: { type: Object },
    placeholder: { type: String },
    file: { type: String },
    startingVolume: { type: Number, attribute: "starting-volume" },
    startingTime: { type: Number, attribute: "starting-time" },
    audioOverride: { type: Boolean, state: true },
    currentTrack: { type: Number, state: true },
    tracks: { type: Array, state: true },
  };

  constructor() {
    super();
    this.placeholder = placeholderArtwork;
    this.file = "";
    this.tracks = [];
    this.audioOverride = false;
    this.currentTrack = undefined;
    this.startingVolume = 0.5;
    this.startingTime = 0;
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

  get isPlaying() {
    return !this.audioElement.paused;
  }

  get albumArtwork() {
    return this._query("#artwork");
  }

  get trackSeeker() {
    return this._query("#track-seeker");
  }

  get volumeSlider() {
    return this._query("#volume-slider");
  }

  get currentTrackArtist() {
    return this.tracks[this.currentTrack].artist || EMPTY_METADATA;
  }

  get currentTrackTitle() {
    return this.tracks[this.currentTrack].title || EMPTY_METADATA;
  }

  get currentTrackAlbum() {
    return this.tracks[this.currentTrack].album || EMPTY_METADATA;
  }

  get currentTrackArtwork() {
    return this.tracks[this.currentTrack].artwork || this.placeholderArtwork;
  }

  get volumeLevel() {
    if (this.audioElement.muted) {
      return 0;
    } else {
      return this.audioElement.volume;
    }
  }

  async _fetchFileData(location) {
    const res = await fetch(location);
    const data = await res.json();

    return data;
  }

  _loadTrack(index) {
    this.trackSeeker.value = 0;
    this.audioElement.currentTime = 0;

    this.audioElement.src = this.tracks[index].file;
    this.currentTrack = index;

    this.loadCurrentTime();
  }

  _handleSongClick(index) {
    if (!this.currentTrack) {
      this._loadTrack(index);
      this._pressPlay();
    } else if (!this.isPlaying) {
      this._loadTrack(index);
    } else {
      this._loadTrack(index);
      this.audioElement.play();
    }
  }

  _pressPlay() {
    this.audioElement.pause();
    this.audioOverride = !this.audioOverride;
  }

  render() {
    return html`
      <audio
        id="audio"
        .volume=${this.startingVolume}
        .currentTime=${this.startingTime}
        @loadstart
        @loadmetadata
        @volumechange
        @ended
        @timeupdate
        @emptied></audio>
      <section class="metadata">
        <img
          src=${this.currentTrackArtwork}
          alt=${this.currentTrackAlbum}
          id="artwork"
          width="300"
          height="300"
          loading="lazy"
          decoding="async" />
        <div class="track-info">
          <p class="artist">${this.currentTrackArtist}</p>
          <p class="track">${this.currentTrackName}</p>
          <p class="album">${this.currentTrackAlbum}</p>
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
          .value=${this.startingTime}
          aria-label="Seek through the track"
          @change
          @input />
      </section>
      <section class="controls">
        <div class="controls__primary">
          <plvy-button type="previous" @click=${this._loadPreviousTrack}></plvy-button>
          <plvy-button
            type="action"
            size="large"
            ?playing=${this.isPlaying}
            @click=${this._handleActionButton}></plvy-button>
          <plvy-button type="next" @click=${this._loadNextTrack}></plvy-button>
          <plvy-button type="shuffle" @click=${this._handleShuffle}></plvy-button>
          <plvy-button type="loop" @click=${this._toggleLoop}></plvy-button>
        </div>
        <div class="controls__secondary">
          <div class="volume">
            <input
              id="volume-slider"
              type="range"
              min="0"
              step="0.01"
              max="1"
              .value=${this.startingVolume}
              aria-label="Volume control"
              @input />
            <plvy-button
              type="volume"
              .value=${this.volumeLevel}
              @click=${this._toggleVolume}></plvy-button>
          </div>
        </div>
      </section>
      <section class="tracklist">
        <ol id="songs">
          ${map(
            this.tracks,
            (track, index) => html`
              <li class="song" data-track=${index} data-file=${track.file}>
                <button class="song__title" @click=${this._handleSongClick(track, index)}>
                  ${track.title}
                </button>
              </li>
            `
          )}
        </ol>
      </section>
    `;
  }
}

customElements.define("plvylist-player", Plvylist);
