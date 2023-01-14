import { LitElement, html } from "lit";
import { map } from "lit/directives/map.js";
import { until } from "lit/directives/until.js"
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
    audioOverride: { type: Boolean, state: true },
    currentTrack: { type: Number, state: true },
    tracks: { state: true },
    trackList: { state: true }
  };

  constructor() {
    super();
    this.placeholder = placeholderArtwork;
    this.file = "";
    this.tracks = this.fetchFileData();
    this.trackList = this.renderTrackList();
    this.audioOverride = false;
    this.currentTrack = undefined;
    this.startingVolume = 0.5;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === "file") {
      this.tracks = this.fetchFileData(newValue);
    }
  }

  _query(queryString) {
    return this?.renderRoot.querySelector(queryString);
  }

  _paddedTimeStrings(time) {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  get audioElement() {
    return this._query("#audio");
  }

  get isPlaying() {
    return !this.audioElement?.paused;
  }

  get isMuted() {
    return this.audioElement?.muted;
  }

  get isLooping() {
    return this.audioElement?.loop;
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
    return this.tracks?.length;
  }

  get currentTrackArtist() {
    return this.tracks[this.currentTrack]?.artist || EMPTY_METADATA;
  }

  get currentTrackTitle() {
    return this.tracks[this.currentTrack]?.title || EMPTY_METADATA;
  }

  get currentTrackAlbum() {
    return this.tracks[this.currentTrack]?.album || EMPTY_METADATA;
  }

  get currentTrackArtwork() {
    return this.tracks[this.currentTrack]?.artwork || this.placeholderArtwork;
  }

  get currentTrackDuration() {
    if (!this.audioElement?.duration) {
      return false;
    }

    return this._paddedTimeStrings(this.audioElement?.duration);
  }

  get currentTrackTime() {
    if (!this.audioElement?.currentTime) {
      return false;
    }

    return this._paddedTimeStrings(this.audioElement?.currentTime);
  }

  get currentTrackSeekerValue() {
    if (this.audioElement?.currentTime && this.audioElement?.duration) {
      return `${parseInt((this.audioElement?.currentTime / this.audioElement?.duration) * 100, 10)}`;
    } else {
      return 0;
    }
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
    if (this.isMuted) {
      return 0;
    } else {
      return this.audioElement?.volume;
    }
  }

  async fetchFileData() {
    const res = await fetch(this.file);
    const data = await res.json();

    console.log(data)

    return data.tracks;
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
      this.audioElement?.play();
    }
  }

  audioOverride() {
    this.audioOverride = !this.audioOverride;
  }

  pressPlay() {
    this.audioElement?.play();
    this.audioOverride();
  }

  pressPause() {
    this.audioElement?.pause();
    this.audioOverride();
  }

  loadPreviousTrack() {
    if (!this.currentTrack) {
      return false;
    }

    if (this.previousTrack > -1) {
      if (this.isPlaying) {
        this.loadTrack(this.previousTrack);
        this.audioElement?.play();
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
        this.audioElement?.play();
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

  toggleVolume() {
    this.audioElement.muted = !this.audioElement.muted;
  }

  toggleLoop() {
    this.audioElement.loop = !this.audioElement.loop;
  }

  shuffleTracks() {
    let tracks = [];

    for (let i = this.trackCount - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempTracks = tracks[i];
      tracks[i] = tracks[j];
      tracks[j] = tempTracks;
    }

    return tracks;
  }

  handleShuffle() {
    window.alert("This will stop your current track and start you over fresh, okay?");

    this.shuffleTracks();

    if (this.isPlaying) {
      this.loadTrack(0);
      this.audioElement?.play();
    } else {
      this.loadTrack(0);
    }
  }

  handleLoadStart() {
    this.renderRoot
      .querySelector(`[data-file="${this.tracks[this.currentTrack].file}"]`)
      .classList.add("song__active");
  }

  handleTrackEnded() {
    if (!this.isLooping) {
      if (this.currentTrack === this.trackCount - 1) {
        this.loadNextTrack();
      } else {
        this.loadNextTrack();
        this.audioElement?.play();
      }
    }
  }

  handleTrackEmptied() {
    this.renderRoot.querySelector(".song__active").classList.remove("song__active");
  }

  handleSeekerChange() {
    if (!this.currentTrack) {
      return false;
    } else {
      this.audioElement.currentTime = (this.trackSeeker.value * this.audioElement.duration) / 100;
      this.audioOverride ? this.audioElement?.play() : false;
    }
  }

  handleSeekerInput() {
    if (!this.currentTrack) {
      return false;
    } else {
      this.audioElement?.pause();
    }
  }

  handleActionButton() {
    if (!this.currentTrack) {
      return false;
    } else if (!this.isPlaying) {
      this.pressPlay();
    } else {
      this.pressPause();
    }
  }

  handleVolumeInput(event) {
    this.audioElement.volume = event.target.value;
  }

  async renderTrackList() {
    await this.tracks;

    return map(
            this.tracks,
            (track, index) => html`
              <li class="song" data-track=${index} data-file=${track.file}>
                <button class="song__title" @click=${this.handleSongClick(track, index)}>
                  ${track.title}
                </button>
              </li>`
    )
  }

  render() {
    return html`
      <audio
        id="audio"
        .volume=${this.startingVolume}
        @loadstart=${this.handleLoadStart}
        @ended=${this.handleTrackEnded}
        @emptied=${this.handleTrackEmptied}></audio>
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
            <span class="currentTime">${this.currentTrackTime}</span> /
            <span class="duration">${this.trackDuration}</span>
          </p>
        </div>
      </section>
      <section class="seeker">
        <input
          id="track-seeker"
          type="range"
          min="0"
          step="0.01"
          .value=${this.currentTrackSeekerValue}
          aria-label="Seek through the track"
          @change=${this.handleSeekerChange}
          @input=${this.handleSeekerInput} />
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
          <plvy-button
            type="loop"
            @click=${this.toggleLoop}
            ?active=${this.isLooping}></plvy-button>
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
              @input=${this.handleVolumeInput} />
            <plvy-button
              type="volume"
              .value=${this.volumeLevel}
              @click=${this.toggleVolume}></plvy-button>
          </div>
        </div>
      </section>
      <section class="tracklist">
        <ol id="songs">
       ${until(this.trackList, html`loading...`)}
        </ol>
      </section>
    `;
  }
}

customElements.define("plvylist-player", Plvylist);
