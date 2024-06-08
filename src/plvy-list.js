import { LitElement, html, css } from "lit";
import { Task } from "@lit/task";
import placeholderArtwork from "./placeholder-artwork.svg";
import { map } from "lit/directives/map.js";
import { ifDefined } from "lit/directives/if-defined.js";

const EMPTY_METADATA = "--";

/**
 * Check if a given key exists in any object within an array of objects.
 * @param {any[]} arr Array of objects.
 * @param {string} key Key to look for in array of objects.
 * @returns {Boolean}
 */
const checkForKeyInArray = (arr, key) => arr.some((obj) => Object.keys(obj).includes(key));

/**
 * @tag plvy-list
 * @summary A media player for playlists or other collections of audio.
 *
 * @attribute {string} file - Path to JSON file containing tracks.
 * @attribute {string} placeholder - Path to image file to replace the default placeholder image of albums.
 * @attribute {string} starting-volume - Number between 0 and 1 to set the volume at.
 * @attribute {string} starting-time - Some number (format unsure) if you want to change the initial starting time of component. Through testing, I don't really know how this works aside from knowing it's an option I've given you.
 * @attribute {string} skip-forward-time - Number of seconds to skip forward when using the device's MediaSession.
 * @attribute {string} skip-backward-time - Number of seconds to skip backward when using the device's MediaSession.
 *
 * @cssproperty [--plvylist-color-accent=#2277cc] - Accent color for form elements.
 * @cssproperty [--plvylist-color-button-active=--plvylist-color-accent] - Color for buttons when hovered.
 * @cssproperty [--plvylist-color-button-border=transparent] - Border color for button controls.
 * @cssproperty [--plvylist-color-button-stroke=currentColor] - Stroke color for button controls.
 * @cssproperty [--plvylist-color-active=#ee0011] - Color to use for changed button states (currently only the loop button).
 * @cssproperty [--plvylist-action-button-background=currentColor] - Background color for the action button.
 * @cssproperty [--plvylist-action-button-stroke=canvas] - Stroke color for the action button.
 * @cssproperty [--plvylist-tracklist-font-size=unset] - Font size for the track list.
 *
 * @example
 * ```html
 * <plvy-list file="./tracks.json" starting-volume="0.75" starting-time=".4" placeholder="./image.jpg"></plvy-list>
 * ```
 */
export default class Plvylist extends LitElement {
  static tagName = "plvy-list";

  static properties = {
    file: { type: String },
    placeholder: { type: String },
    startingVolume: { type: Number, attribute: "starting-volume" },
    startingTime: { type: Number, attribute: "starting-time" },
    skipForwardTime: { type: Number, attribute: "skip-forward-time" },
    skipBackwardTime: { type: Number, attribute: "skip-backward-time" },
    tracks: { type: Array, state: true },
    currentTrack: { type: Object, state: true },
    currentTrackFile: { state: true },
    currentTrackTitle: { state: true },
    currentTrackArtist: { state: true },
    currentTrackAlbum: { state: true },
    currentTrackTime: { state: true },
    currentTrackDuration: { state: true },
    currentTrackAlbumAltText: { state: true },
    currentTrackIndex: { state: true },
    volumeIcon: { state: true },
    isPlaying: { state: true, type: Boolean },
    isLooping: { state: true, type: Boolean },
  };

  #currentTrackIndex = undefined;

  get currentTrackIndex() {
    return this.#currentTrackIndex;
  }

  set currentTrackIndex(value) {
    this.#currentTrackIndex = value;
    this.currentTrack = this.tracks[value];
  }

  #currentTrack = undefined;

  get currentTrack() {
    return this.#currentTrack;
  }

  set currentTrack(value) {
    this.#currentTrack = value;
    this.currentTrackFile = this.currentTrack?.file;

    debugger;

    if (this.currentTrack) {
      this.currentTrackTitle = Plvylist.handleMetadata(this.currentTrack.title);
      this.currentTrackArtist = Plvylist.handleMetadata(this.currentTrack.artist);
      this.currentTrackAlbum = Plvylist.handleMetadata(this.currentTrack.album);

      this.audio.play();
      this.setPlayState();
    }
  }

  static handleMetadata(value) {
    return value ?? EMPTY_METADATA;
  }

  constructor() {
    super();
    this.file = "";
    this.tracks = [];
    this.placeholder = placeholderArtwork;
    this.startingVolume = 0.5;
    this.startingTime = 0;
    this.skipForwardTime = 30;
    this.skipBackwardTime = 10;
    this.audioOverride = false; // Helps manage when tracks should be started or paused during selection.
    this.currentTrackIndex = undefined;
    this.hasArtists = false;
    this.hasAlbums = false;
    this.currentTrackTitle = EMPTY_METADATA;
    this.currentTrackArtist = EMPTY_METADATA;
    this.currentTrackAlbum = EMPTY_METADATA;
    this.currentTrackTime = EMPTY_METADATA;
    this.currentTrackDuration = EMPTY_METADATA;
    this.currentTrackAlbumAltText = "";
    this.volumeIcon = "#icon--volumeMid";
    this.isLooping = false;

    this.actionHandlers = [
      ["play", this.handleActionClick],
      ["pause", this.handleActionClick],
      ["previoustrack", this.previousTrack],
      ["nexttrack", this.nextTrack],
      ["seekforward", this.handleMediaSessionSeek],
      ["seekbackward", this.handleMediaSessionSeek],
    ];
  }

  static styles = css`
    :host {
      box-sizing: border-box;
      display: block;
    }

    *,
    *::after,
    *::before {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }

    img {
      block-size: auto;
      display: block;
      max-inline-size: 100%;
    }

    button {
      background: none;
      border: none;
      color: inherit;
      cursor: pointer;
      font: inherit;
      text-align: inherit;
    }

    :host {
      /* FONT SIZE */
      --step--2: clamp(0.78rem, calc(0.77rem + 0.07vw), 0.84rem);
      --step--1: clamp(0.94rem, calc(0.91rem + 0.14vw), 1.05rem);
      --step-0: clamp(1.13rem, calc(1.08rem + 0.23vw), 1.31rem);

      /* SPACING */
      --space-3xs: clamp(0.31rem, calc(0.31rem + 0vw), 0.31rem);
      --space-2xs: clamp(0.56rem, calc(0.53rem + 0.16vw), 0.69rem);
      --space-xs: clamp(0.88rem, calc(0.84rem + 0.16vw), 1rem);
      --space-s: clamp(1.13rem, calc(1.08rem + 0.23vw), 1.31rem);

      /* OTHER */
      --accent-color: #2277cc;
      --active-color: #ee0011;

      accent-color: var(--plvylist-color-accent, var(--accent-color));
    }

    img[src^="data:image/svg+xml"] {
      filter: contrast(0.5); /* Covers the placeholder image */
    }

    #artwork {
      margin-inline: auto;
    }

    .meta {
      align-items: end;
      display: grid;
      gap: var(--space-s);
    }

    .controls {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xs);
      margin-block: var(--space-s);
    }

    input[type="range"] {
      display: block;
      inline-size: 100%;
    }

    .sliders {
      align-items: center;
      display: grid;
      gap: var(--space-s);
    }

    .sliders > * {
      inline-size: 100%;
    }

    .seekerContainer {
      flex: 1;
    }

    .volumeContainer {
      display: flex;
      gap: var(--space-3xs);
    }

    .controlButton {
      border: 1px solid var(--plvylist-color-button-border, transparent);
      border-radius: 50%;
      display: flex;
      stroke: var(--plvylist-color-button-stroke, currentColor);
      padding: var(--space-3xs);
      transition: color 0.1s ease;
    }

    .controlButton:hover {
      color: var(--plvylist-color-button-active, var(--accent-color));
    }

    .buttons {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-2xs);
      justify-content: center;
    }

    .button--active {
      color: var(--plvylist-color-active, var(--active-color));
    }

    #action {
      background-color: var(--plvylist-action-button-background, currentColor);
      stroke: var(--plvylist-action-button-stroke, canvas);
    }

    .tracklist {
      overflow: auto;
    }

    .trackList__table {
      border-collapse: collapse;
      counter-reset: tracks;
      font-size: var(--plvylist-tracklist-font-size, unset);
      inline-size: 100%;
      min-inline-size: max-content;
    }

    .trackList__table :is(th, td) {
      padding-block: var(--cell-padding, var(--space-3xs));
      padding-inline: var(--space-2xs);
      text-align: start;
    }

    .trackList__table thead tr {
      border-block-end: 1px solid;
    }

    .trackList__table th {
      --cell-padding: var(--space-2xs);

      text-transform: uppercase;
    }

    .trackList__track {
      counter-increment: tracks;
    }

    .trackList__track::before {
      content: counter(tracks) ".";
    }

    .song--active button,
    .track__trackTitleButton:hover {
      color: var(--plvylist-color-active, var(--active-color));
    }

    .track__trackAlbumUrl,
    .track__trackArtistUrl {
      color: currentColor;
      text-decoration: none;
    }

    :is(.track__trackAlbumUrl, .track__trackArtistUrl, .track__trackTitleButton):hover {
      text-decoration: underline;
    }

    @media (min-width: 750px) {
      .meta {
        grid-template-columns: auto 1fr;
      }

      .sliders {
        grid-template-columns: 2.5fr 1fr;
      }
    }
  `;

  dataTask = new Task(this, {
    task: async ([source], { signal }) => {
      console.log("fetching the tracks from track JSON");
      const response = await fetch(source, { signal });

      if (!response.ok) {
        throw new Error(response.status);
      }

      const data = await response.json();

      return data?.tracks;
    },
    args: () => [this.file],
  });

  /** Apply all action handlers for the MediaSession API. */
  addMediaSessionActionHandlers() {
    for (const [action, handler] of this.actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.log(`The media session action "${action}" is not supported yet.`);
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.addMediaSessionActionHandlers();
    navigator.mediaSession.metadata = new MediaMetadata(null);
  }

  handleTrackTitleClick(event) {
    const { target } = event;
    const index = target.dataset.index;

    this.loadTrack(index);

    if (this.currentTrackIndex === undefined) {
      this.playOrPause("play");
    } else if (!this.audio.paused) {
      this.audio.play();
    }
  }

  /**
   * Query for an element within the shadow root.
   * @param {string} query Query string.
   * @param {boolean} all Whether to use querySelectorAll or querySelector.
   * @returns {Element|Element[]} Queried element.
   */
  queryShadowRoot(query, all = false) {
    if (all) {
      return this.shadowRoot?.querySelectorAll(query);
    }

    return this.shadowRoot?.querySelector(query);
  }

  /**
   * Audio element where tracks are played.
   * @type {HTMLAudioElement}
   */
  get audio() {
    return this.queryShadowRoot("audio#audio");
  }

  /**
   * Seeker bar.
   * @type {HTMLInputElement}
   */
  get seeker() {
    return this.queryShadowRoot("#seeker");
  }

  /**
   * Volume bar.
   * @type {HTMLInputElement}
   */
  get volume() {
    return this.queryShadowRoot("#volume");
  }

  /**
   * Load a given track by its indexed position in the tracks.
   * @param {number} index Valid index as number for the tracks array.
   */
  loadTrack(index) {
    this.currentTrackIndex = index;

    // Reset inputs
    this.seeker.value = 0;
    this.audio.currentTime = 0;

    this.loadCurrentTime();
    this.updateMediaSessionMetadata();
  }

  /** Changes selection to the previous track. */
  previousTrack() {
    const track = this.currentTrackIndex - 1;
    if (this.currentTrackIndex === undefined) {
      return false;
    } else if (track > -1) {
      this.loadTrack(index);

      if (this.isPlaying) {
        this.audio.play();
      }
    } else {
      this.playOrPause("pause");
      this.loadTrack(this.currentTrackIndex);
      this.audioOverride = false;
    }

    this.updateMediaSessionMetadata();
  }

  /** Changes selection to the next track. */
  nextTrack() {
    const track = this.currentTrackIndex + 1;
    if (this.currentTrackIndex === undefined) {
      this.loadTrack(0);
    } else if (track < this.trackCount) {
      this.loadTrack(track);

      if (this.isPlaying) {
        this.audio.play();
      }
    } else {
      this.playOrPause("pause");
      this.loadTrack(0);
      this.audioOverride = false;
    }

    this.updateMediaSessionMetadata();
  }

  /**
   * Turn a number into a string with minutes and seconds.
   * @param {number} time Number to turn into a time string.
   * @returns {string} minutes:seconds
   */
  timeToString(time = this.audio.currentTime) {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  /** Loads the current track's duration from metadata and displays it. */
  loadDuration() {
    this.currentTrackDuration = this.timeToString(this.audio.duration);
  }

  /** Loads the current track's play progress from metadata and displays it. */
  loadCurrentTime() {
    if (!this.audio.src) {
      return false;
    }

    this.currentTrackTime = this.timeToString();
  }

  /** Play or pause a track and set respective properties. */
  playOrPause(type = "play") {
    if (type === "play") {
      this.audio.play();
      this.setPlayState();
      navigator.mediaSession.playbackState = "playing";
    }

    if (type === "pause") {
      this.audio.pause();
      this.setPlayState();
      navigator.mediaSession.playbackState = "paused";
    }

    this.updateMediaSessionMetadata();
    this.audioOverride = !this.audioOverride;
  }

  /** Changes the icon in the volume button based on the current volume level. */
  setVolumeIcon() {
    if (this.audio.volume === 0 || this.audio.muted) {
      this.volumeIcon = "#icon--volumeOff";
    } else if (this.audio.volume <= 0.45) {
      this.volumeIcon = "#icon--volumeLow";
    } else {
      this.volumeIcon = "#icon--volumeMid";
    }
  }

  /** Mutes or unmutes the track based on muted state. */
  toggleVolume() {
    if (!this.audio.muted) {
      this.audio.muted = !this.audio.muted;
      this.volumeIcon = "#icon--volumeOff";
      this.volume.value = 0;
    } else {
      this.audio.muted = !this.audio.muted;
      this.setVolumeIcon();
      this.volume.value = this.audio.volume;
    }
  }

  /** Sets the track to loop or not based on loop state. */
  toggleLoop() {
    this.isLooping = !this.isLooping;
  }

  /**
   * Shuffles the track list.
   * @returns {Array<Record<string, string>} New track list.
   */
  shuffleTracks() {
    let tracks = this.tracks; // Original track list

    // Randomize the order
    for (let i = tracks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempTracks = tracks[i];
      tracks[i] = tracks[j];
      tracks[j] = tempTracks;
    }

    this.tracks = tracks; // Store new order in class property
  }

  /** Total number of tracks. */
  get trackCount() {
    return this.tracks?.length;
  }

  /** Run on audio end. */
  handleAudioEnded() {
    if (!this.isLooping) {
      this.nextTrack();
      if (this.currentTrackIndex !== this.trackCount - 1) {
        this.audio.play();
        this.setPlayState();
      }
    }
  }

  /** Update the seeker value as the track progresses. */
  handleTimeUpdate() {
    this.seeker.value = `${parseInt((this.audio.currentTime / this.audio.duration) * 100, 10)}`;
    this.loadCurrentTime();
  }

  /** Run when the seeker emits change. */
  handleSeekerChange() {
    if (this.currentTrackIndex === undefined) {
      return false;
    } else {
      this.audio.currentTime = (this.seeker.value * this.audio.duration) / 100;
      this.audioOverride ? this.audio.play() : false;
      this.setPlayState();
    }
  }

  /** Run when seeker emits input. */
  handleSeekerInput(event) {
    if (this.currentTrackIndex === undefined) {
      return false;
    } else {
      this.audio.pause();
      this.setPlayState();
      const newTime = (event.target.value * this.audio.duration) / 100;
      this.loadCurrentTime(newTime);
    }
  }

  /** Specific methods ran when using the device's MediaSession controller. */
  handleMediaSessionSeek(details) {
    switch (details.action) {
      case "seekforward":
        const newTime = Math.min(
          this.audio.currentTime + this.skipForwardTime,
          this.audio.duration
        );
        this.audio.currentTime = newTime;
        break;
      case "seekbackward":
        this.audio.currentTime = Math.max(this.audio.currentTime - this.skipBackwardTime, 0);
        break;
    }
  }

  /** Run when pressing the primary action button. */
  handleActionClick() {
    if (this.currentTrackIndex === undefined) {
      this.loadTrack(0);
      // this.playOrPause("play");
    } else if (!this.isPlaying) {
      this.playOrPause("play");
    } else {
      this.playOrPause("pause");
    }
  }

  setPlayState() {
    this.isPlaying = !this.audio.paused;
  }

  /** Run on shuffle click. */
  handleShuffle() {
    window.alert("This will stop your current track and start you over fresh, okay?");

    this.shuffleTracks();
    this.loadTrack(0);
    if (this.isPlaying) {
      this.audio.play();
    }
  }

  /** Run when volume bar emits input. */
  handleVolumeInput() {
    this.audio.volume = this.volume.value;
  }

  /** Update the metadata of the media session. */
  updateMediaSessionMetadata() {
    navigator.mediaSession.metadata.title = this.currentTrack?.title;
    navigator.mediaSession.metadata.artist = this.currentTrack?.artist;
    navigator.mediaSession.metadata.album = this.currentTrack?.album;
    navigator.mediaSession.metadata.artwork = [{ src: this.currentTrack?.artwork }];
  }

  renderTrackList() {
    return html`
      <table class="trackList__table">
        <thead>
          <th>Track</th>
          ${this.hasArtists ? html`<th>Artist</th>` : html``}
          ${this.hasAlbums ? html`<th>Album</th>` : html``}
        </thead>
        <tbody>
          ${map(this.tracks, (track, index) => {
            const artistHTML = html`<span class="track__trackArtist">${track.artist}</span>`;
            const albumHTML = html`<span class="track__trackAlbum">${track.album}</span>`;

            return html`<tr>
              <td
                class="trackList__track ${index === this.currentTrackIndex ? "song--active" : ""}"
                data-track="${index}">
                <button
                  class="track__trackTitleButton"
                  data-index="${index}"
                  @click=${this.handleTrackTitleClick}>
                  <span class="track__trackTitle">${track.title}</span>
                </button>
              </td>
              ${this.hasArtists && track.artist
                ? html`<td>
                    ${track.artistUrl
                      ? html`<a class="track__trackArtistUrl" href="${track.artistUrl}"
                          >${artistHTML}</a
                        >`
                      : html`${artistHTML}`}
                  </td>`
                : html``}
              ${this.hasAlbums && track.album
                ? html`<td>
                    ${track.albumUrl
                      ? html`<a class="track__trackAlbumUrl" href="${track.albumUrl}"
                          >${albumHTML}</a
                        >`
                      : html`${albumHTML}`}
                  </td>`
                : html``}
            </tr>`;
          })}
        </tbody>
      </table>
    `;
  }

  static renderIconSprite() {
    return html`
      <div aria-hidden="true" hidden id="icon-sprite">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--play"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Play</title>
            <path d="M7 4v16l13 -8z" />
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--pause"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Pause</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--previous"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Previous</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M21 5v14l-8 -7z"></path>
            <path d="M10 5v14l-8 -7z"></path>
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--next"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Next</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M3 5v14l8-7z"></path>
            <path d="M14 5v14l8-7z"></path>
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--shuffle"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Shuffle</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <rect x="3" y="3" width="6" height="6" rx="1"></rect>
            <rect x="15" y="15" width="6" height="6" rx="1"></rect>
            <path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path>
            <path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--loop"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Loop</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
            <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path>
            <path d="M11 11l1 -1v4"></path>
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--volumeOff"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Volume</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
            <path d="M16 10l4 4m0 -4l-4 4" />
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--volumeLow"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Volume</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8a5 5 0 0 1 0 8" />
            <path
              d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
          </symbol>
          <symbol
            xmlns="http://www.w3.org/2000/svg"
            id="icon--volumeMid"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none">
            <title>Volume</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M15 8a5 5 0 0 1 0 8" />
            <path d="M17.7 5a9 9 0 0 1 0 14" />
            <path
              d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
          </symbol>
        </svg>
      </div>
    `;
  }

  render() {
    return this.dataTask.render({
      pending: () => html` <p id="plvylist-loading-message">Generating your Plvylist...</p>`,
      complete: (data) => {
        this.tracks = data;
        this.hasAlbums = checkForKeyInArray(this.tracks, "album");
        this.hasArtists = checkForKeyInArray(this.tracks, "artist");

        return html`
          ${Plvylist.renderIconSprite()}
          <audio
            id="audio"
            src=${ifDefined(this.currentTrackFile)}
            .loop=${this.isLooping}
            .volume=${this.startingVolume}
            .currentTime=${this.startingTime}
            @loadedmetadata=${this.loadDuration}
            @volumechange=${this.setVolumeIcon}
            @ended=${this.handleAudioEnded}
            @timeupdate=${this.handleTimeUpdate}></audio>
          <div class="meta">
            <img
              src="${this.currentTrack?.artwork || this.placeholder}"
              alt="${this.currentTrack?.artwork ? "Album art for ${this.currentTrack?.album}" : ""}"
              id="artwork"
              width="350"
              height="350"
              loading="lazy"
              decoding="async" />
            <div class="trackInfo">
              <p class="trackInfo__track">${this.currentTrackTitle}</p>
              <p class="trackInfo__artist">${this.currentTrackArtist}</p>
              <p class="trackInfo__album">${this.currentTrackAlbum}</p>
              <p class="trackInfo__timer">
                <span class="trackInfo__currentTime">${this.currentTrackTime}</span> /
                <span class="trackInfo__duration">${this.currentTrackDuration}</span>
              </p>
            </div>
          </div>
          <div class="controls">
            <div class="sliders">
              <div class="seekerContainer">
                <input
                  type="range"
                  id="seeker"
                  min="0"
                  step="0.01"
                  .defaultValue=${this.startingTime}
                  aria-label="Seek through the track."
                  @change=${this.handleSeekerChange}
                  @input=${this.handleSeekerInput} />
              </div>
              <div class="volumeContainer">
                <button id="volumeButton" class="controlButton" @click=${this.toggleVolume}>
                  <svg width="24" height="24">
                    <use href="${this.volumeIcon}"></use>
                  </svg>
                </button>
                <input
                  type="range"
                  id="volume"
                  min="0"
                  max="1"
                  .defaultValue=${this.startingVolume}
                  step="0.01"
                  aria-label="Volume control."
                  @input=${this.handleVolumeInput} />
              </div>
            </div>
            <div class="buttons">
              <button id="shuffle" class="controlButton" @click=${this.handleShuffle}>
                <svg width="24" height="24">
                  <use href="#icon--shuffle"></use>
                </svg>
              </button>
              <button id="previous" class="controlButton" @click=${this.previousTrack}>
                <svg width="24" height="24">
                  <use href="#icon--previous"></use>
                </svg>
              </button>
              <button id="action" class="controlButton" @click=${this.handleActionClick}>
                <svg width="24" height="24">
                  <use href="#icon--${!this.isPlaying ? "play" : "pause"}"></use>
                </svg>
              </button>
              <button id="next" class="controlButton" @click=${this.nextTrack}>
                <svg width="24" height="24">
                  <use href="#icon--next"></use>
                </svg>
              </button>
              <button
                id="loop"
                class="controlButton ${this.isLooping ? "button--active" : ""}"
                @click=${this.toggleLoop}>
                <svg width="24" height="24">
                  <use href="#icon--loop"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="tracklist">${this.renderTrackList()}</div>
        `;
      },
      error: (e) => html`<p id="plvylist-error-message">Error: ${e}</p>`,
    });
  }
}

if (!window.customElements.get(Plvylist.tagName)) {
  window.customElements.define(Plvylist.tagName, Plvylist);
}
