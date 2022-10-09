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

  get trackCount() {
    return this.tracks.length;
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

  get previousTrack() {
    if (this.currentTrack) {
      return this.currentTrack - 1;
    }
  }

  get nextTrack() {
    if (this.currentTrack) {
      return this.currentTrack + 1;
    }
  }

  get volumeLevel() {
    if (this.audioElement.muted) {
      return 0;
    } else {
      return this.audioElement.volume;
    }
  }

  async fetchFileData(location) {
    const res = await fetch(location);
    const data = await res.json();

    this.tracks = data.tracks;

    return data;
  }

  loadTrack(index) {
    this.trackSeeker.value = 0;
    this.audioElement.currentTime = 0;

    this.audioElement.src = this.tracks[index].file;
    this.currentTrack = index;

    this.loadCurrentTime();
  }

  handleSongClick(index) {
    if (!this.currentTrack) {
      this.loadTrack(index);
      this.pressPlay();
    } else if (!this.isPlaying) {
      this.loadTrack(index);
    } else {
      this.loadTrack(index);
      this.audioElement.play();
    }
  }

  audioOverride() {
    this.audioOverride = !this.audioOverride;
  }

  pressPlay() {
    this.audioElement.play();
    this.audioOverride();
  }

  pressPause() {
    this.audioElement.pause();
    this.audioOverride();
  }

  loadPreviousTrack() {
    if (!this.currentTrack) {
      return false;
    }

    if (this.previousTrack > -1) {
      if (this.isPlaying) {
        this.loadTrack(this.previousTrack);
        this.audioElement.play();
      } else {
        this.loadTrack(this.previousTrack);
      }

      return true;
    } else {
      this.pressPause();
      this.loadTrack(this.currentTrack);
      this.audioOverride = false;

      return true;
    }
  }

  loadNextTrack() {
    if (!this.currentTrack) {
      return this.loadTrack(0);
    }

    if (this.nextTrack < this.trackCount) {
      if (this.isPlaying) {
        this.loadTrack(this.nextTrack);
        this.audioElement.play();
      } else {
        this.loadTrack(this.nextTrack);
      }

      return true;
    } else {
      this.pressPause();
      this.loadTrack(0);
      this.audioOverride = false;

      return true;
    }
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
          <plvy-button type="previous" @click=${this.loadPreviousTrack}></plvy-button>
          <plvy-button
            type="action"
            size="large"
            ?playing=${this.isPlaying}
            @click=${this.handleActionButton}></plvy-button>
          <plvy-button type="next" @click=${this.loadNextTrack}></plvy-button>
          <plvy-button type="shuffle" @click=${this.handleShuffle}></plvy-button>
          <plvy-button type="loop" @click=${this.toggleLoop}></plvy-button>
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
              @click=${this.toggleVolume}></plvy-button>
          </div>
        </div>
      </section>
      <section class="tracklist">
        <ol id="songs">
          ${map(
            this.tracks,
            (track, index) => html`
              <li class="song" data-track=${index} data-file=${track.file}>
                <button class="song__title" @click=${this.handleSongClick(track, index)}>
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
