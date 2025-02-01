import { LitElement, html } from "lit";
import { Task } from "@lit/task";
import placeholderArtwork from "./placeholder-artwork.svg"; // Placeholder image attribution: https://www.svgrepo.com/svg/36360/compact-disc
import { map } from "lit/directives/map.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";
import styles from "./plvylist.styles.js";

const emptyData = "--";

/**
 * @param {any[]} arr Array of objects.
 * @param {string} key Key to look for in array of objects.
 * @returns {Boolean}
 */
const checkForKeyInArray = (arr, key) => arr?.some((obj) => Object.keys(obj).includes(key));

/**
 * @element plvy-list
 * @summary A media player for playlists or other collections of audio.
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
 * @csspart tracklist - wrapper for the tracklist.
 * @csspart tracklist-table - table element wrapping the track list.
 * @csspart tracklist-thead - thead element in the tracklist.
 * @csspart tracklist-header - th elements in the tracklist.
 * @csspart tracklist-tbody - tbody element in the tracklist.
 * @csspart tracklist-track-artist-text - span wrapping the track artist.
 * @csspart tracklist-track-album-text - span wrapping the track album.
 * @csspart tracklist-track - td element of the track in the tracklist.
 * @csspart tracklist-track-title - button element for the track title.
 * @csspart tracklist-track-artist - td element of the track artist.
 * @csspart tracklist-track-artist-link - anchor link if the artist is linked.
 * @csspart tracklist-track-album - td element of the track album.
 * @csspart tracklist-track-album-link - anchor link if the album is linked.
 * @csspart metadata - wrapper for the metadata section.
 * @csspart metadata-artwork - artwork image element.
 * @csspart metadata-trackinfo - wrapper for the track info text area.
 * @csspart metadata-track-title - current track title.
 * @csspart metadata-track-artist - current track artist.
 * @csspart metadata-track-album - current track album.
 * @csspart metadata-track-times - wrapper for the track times.
 * @csspart metadata-track-current-time - current time of the current track.
 * @csspart metadata-track-duration - current track duration.
 * @csspart controls - wrapper for all the controls.
 * @csspart sliders - wrapper for the sliders.
 * @csspart seeker-container
 * @csspart seeker - seeker input.
 * @csspart volume-container
 * @csspart volume-button
 * @csspart volume - volume input.
 * @csspart controls-buttons - wrapper for all the buttons in the controls.
 * @csspart shuffle-button
 * @csspart previous-button
 * @csspart action-button
 * @csspart next-button
 * @csspart loop-button
 *
 * @slot artwork - Opt for full control over the HTML of the artwork.
 * @slot - Child `<audio>` elements will be used as the data source if no file or dataset is provided.
 *
 * @example
 * ```html
 * <!-- using a data file -->
 * <plvy-list file="./tracks.json" starting-volume="0.75" starting-time="4" placeholder="./image.jpg"></plvy-list>
 *
 * <!-- using raw data -->
 * <script type="module">
 *   document.getElementById("plvylist").data = [...];
 * </script>
 * <plvy-list id="plvylist"></plvy-list>
 *
 * <!-- using slotted audio -->
 * <plvy-list>
 *   <audio controls src="" data-tile="" data-artist="" data-artist-url="" data-album="" data-album-url="" data-artwork=""></audio>
 * </plvy-list>
 * ```
 */
export default class Plvylist extends LitElement {
  constructor() {
    super();
    this.data;
    this.file = "";
    this.tracks = [];
    this.placeholder = placeholderArtwork;
    this.startingVolume = 0.5;
    this.startingTime = 0;
    this.skipForwardTime = 30;
    this.skipBackwardTime = 10;
    this.currentTrackIndex;
    this.currentTrackTitle = emptyData;
    this.currentTrackArtist = emptyData;
    this.currentTrackAlbum = emptyData;
    this.currentTrackTime = emptyData;
    this.currentTrackDuration = emptyData;
    this.currentTrackAlbumAltText = "";
    this.recentlyPlayedTrackIndex;
    this.volumeIcon = "#icon--volumeMid";
    this.showPlayIcon = true;
    this.isPlaying = false;
    this.isLooping = false;
    this.isSeeking = false;
    this.hasPlayed = false;
    this.pausedByEnding = false;
    this.forcePause = false;
    this.playedThrough = false;
  }

  static get properties() {
    return {
      /** Array of tracks if you'd rather pass the data directly instead of through a file. */
      data: { type: Array },

      /** Path to a JSON file with an array of tracks. */
      file: { type: String },

      /** Path to image file to replace the default placeholder image of albums. */
      placeholder: { type: String },

      /** Number between 0 and 1 to set the volume at. */
      startingVolume: { type: Number, attribute: "starting-volume" },

      /**  Some number (format unsure) if you want to change the initial starting time of component. Through testing, I don't really know how this works aside from knowing it's an option I've given you. */
      startingTime: { type: Number, attribute: "starting-time" },

      /** Number of seconds to skip forward when using the device's MediaSession. */
      skipForwardTime: { type: Number, attribute: "skip-forward-time" },

      /** Number of seconds to skip backward when using the device's MediaSession. */
      skipBackwardTime: { type: Number, attribute: "skip-backward-time" },

      /** @private */
      tracks: { state: true, attribute: false, type: Array },

      /** @private */
      currentTrackIndex: { state: true, attribute: false, type: Number },

      /** @private */
      currentTrack: { state: true, attribute: false, type: Object },

      /** @private */
      currentTrackFile: { state: true, attribute: false, type: Object },

      /** @private */
      currentTrackTitle: { state: true, attribute: false, type: String },

      /** @private */
      currentTrackArtist: { state: true, attribute: false, type: String },

      /** @private */
      currentTrackAlbum: { state: true, attribute: false, type: String },

      /** @private */
      currentTrackArtwork: { state: true, attribute: false, type: String },

      /** @private */
      currentTrackTime: { state: true, attribute: false, type: String },

      /** @private */
      currentTrackDuration: { state: true, attribute: false, type: String },

      /** @private */
      currentTrackAlbumAltText: { state: true, attribute: false, type: String },

      /** @private */
      recentlyPlayedTrackIndex: { state: true, attribute: false, type: Number },

      /** @private */
      volumeIcon: { state: true, attribute: false, type: String },

      /** @private */
      showPlayIcon: { state: true, attribute: false, type: Boolean },

      /** @private */
      hasPlayed: { state: true, attribute: false, type: Boolean },

      /** @private */
      isPlaying: { state: true, attribute: false, type: Boolean },

      /** @private */
      isSeeking: { state: true, attribute: false, type: Boolean },

      /** @private */
      isLooping: { state: true, attribute: false, type: Boolean },

      /** @private */
      pausedByEnding: { state: true, attribute: false, type: Boolean },

      /** @private */
      playedThrough: { state: true, attribute: false, type: Boolean },

      /** @private */
      forcePause: { state: true, attribute: false, type: Boolean },
    };
  }

  static styles = [styles];

  /** @private */
  static handleMetadata(value) {
    return value ?? emptyData;
  }

  /**
   * @private
   * @param {number} time Number to turn into a time string.
   * @returns {string} minutes:seconds
   */
  static timeToString(time) {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  /** @type {undefined | number} */
  #currentTrackIndex = undefined;

  get currentTrackIndex() {
    return this.#currentTrackIndex;
  }

  set currentTrackIndex(value) {
    this.#currentTrackIndex = value;
    this.currentTrack = this.tracks[value];
  }

  /** @type {undefined | number} */
  #currentTrack = undefined;

  get currentTrack() {
    return this.#currentTrack;
  }

  set currentTrack(value) {
    this.#currentTrack = value;
    this.currentTrackFile = this.currentTrack?.file;

    if (this.currentTrack) {
      this.currentTrackTitle = Plvylist.handleMetadata(this.currentTrack.title);
      this.currentTrackArtist = Plvylist.handleMetadata(this.currentTrack.artist);
      this.currentTrackAlbum = Plvylist.handleMetadata(this.currentTrack.album);
      this.currentTrackArtwork = this.currentTrack.artwork;

      this.updateMediaSessionMetadata();
    }
  }

  /**
   * @private
   * @type {HTMLAudioElement}
   */
  get audio() {
    return this.queryShadowRoot("audio#audio");
  }

  /**
   * @private
   * @type {HTMLInputElement}
   */
  get seeker() {
    return this.queryShadowRoot("#seeker");
  }

  /**
   * @private
   * @type {HTMLInputElement}
   */
  get volume() {
    return this.queryShadowRoot("#volume");
  }

  /**
   * @private
   * @type {HTMLTableCellElement | undefined}
   */
  get activeTrackNode() {
    return this.queryShadowRoot(".song--active");
  }

  /**
   * @private
   * @type {HTMLTableCellElement | undefined}
   */
  get currentTrackIndexNode() {
    return this.queryShadowRoot(`[data-index="${this.currentTrackIndex}"]`);
  }

  /**
   * @private
   * @type {number | undefined}
   */
  get previousTrack() {
    const track = this.currentTrackIndex - 1;

    if (isNaN(track)) {
      return undefined;
    }

    return track;
  }

  /**
   * @private
   * @type {number | undefined}
   */
  get nextTrack() {
    const track = this.currentTrackIndex + 1;

    if (track >= this.trackCount) {
      return undefined;
    }

    return track;
  }

  /**
   * @private
   * @type {boolean}
   */
  get playingLastTrack() {
    return this.currentTrackIndex === this.trackCount - 1;
  }

  /**
   * @private
   * @type {number}
   */
  get trackCount() {
    return this.tracks.length;
  }

  /**
   * @private
   * @type {HTMLAudioElement[]}
   */
  get audioElements() {
    return [...this.querySelectorAll("audio")];
  }

  /**
   * @private
   */
  fetchTracks = new Task(this, {
    task: async ([file, dataset], { signal }) => {
      if (dataset) return dataset;

      if (file) {
        const response = await fetch(file, { signal });

        if (!response.ok) {
          throw new Error(response.status);
        }

        const data = await response.json();

        return data;
      }

      if (this.audioElements.length > 0) {
        return this.audioElements.map((audio) => {
          const {
            src: file,
            dataset: { title, artist, artistUrl, album, albumUrl, artwork },
          } = audio;

          return { file, title, artist, artistUrl, album, albumUrl, artwork };
        });
      }

      throw new Error("No data is available.");
    },
    args: () => [this.file, this.data],
  });

  /**
   * @private
   * @param {string} query Query string.
   * @param {boolean} all Whether to use querySelectorAll or querySelector.
   * @type {Element | NodeListOf<Element> | null | undefined}
   */
  queryShadowRoot(query, all = false) {
    if (all) {
      return this.shadowRoot?.querySelectorAll(query);
    }

    return this.shadowRoot?.querySelector(query);
  }

  /**
   * @private
   * @param {number} index Valid index as number for the tracks array.
   */
  loadTrack(index) {
    this.currentTrackIndex = index;
    this.updateActiveSong();
    this.resetInputs();
    this.loadCurrentTime();
  }

  /** @private */
  resetInputs() {
    this.seeker.valueAsNumber = 0;

    if (!this.hasPlayed) {
      this.audio.currentTime = this.startingTime;
    } else {
      this.audio.currentTime = 0; // explicitly do this because there's a visual glitch where the seeker appears half filled otherwise
    }
  }

  /** @private */
  updateActiveSong() {
    this.activeTrackNode?.classList.remove("song--active");
    this.currentTrackIndexNode?.classList.add("song--active");
  }

  /** @private */
  addMediaSessionActionHandlers() {
    const actionHandlers = [
      ["play", this.handleActionClick],
      ["pause", this.handleActionClick],
      ["previoustrack", this.loadPreviousTrack],
      ["nexttrack", this.loadNextTrack],
      ["seekforward", this.handleMediaSessionSeek],
      ["seekbackward", this.handleMediaSessionSeek],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch (error) {
        console.log(`The media session action "${action}" is not supported yet.`);
      }
    }
  }

  /** @private */
  updateMediaSessionMetadata() {
    navigator.mediaSession.metadata.title = this.currentTrack?.title ?? "";
    navigator.mediaSession.metadata.artist = this.currentTrack?.artist ?? "";
    navigator.mediaSession.metadata.album = this.currentTrack?.album ?? "";
    navigator.mediaSession.metadata.artwork = [{ src: this.currentTrack?.artwork ?? "" }];
  }

  /** @private */
  loadPreviousTrack() {
    if (this.previousTrack >= 0) {
      this.loadTrack(this.previousTrack);
    } else {
      this.loadTrack(this.currentTrackIndex);
    }

    return this;
  }

  /** @private */
  loadNextTrack() {
    if (this.nextTrack >= 0) {
      this.loadTrack(this.nextTrack);
    } else {
      if (this.playingLastTrack) {
        this.handleLastTrackCondition();
      }
      this.loadTrack(0);
    }

    return this;
  }

  /** @private */
  handleLastTrackCondition() {
    this.playedThrough = true;
    this.showPlayIcon = true;
    this.isPlaying = false;
  }

  /** @private */
  setRecentlyPlayedTrack(index) {
    this.recentlyPlayedTrackIndex = index;
  }

  /** @private */
  loadCurrentTime(time = this.audio.currentTime) {
    this.currentTrackTime = Plvylist.timeToString(time);
  }

  play() {
    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  /** @private */
  handleAudioPlay() {
    this.forcePause = false;
    this.pausedByEnding = false;
    this.playedThrough = false;
    this.isPlaying = true;
    navigator.mediaSession.playbackState = "playing";
    this.showPlayIcon = false;

    if (!this.hasPlayed) this.hasPlayed = true;
  }

  /** @private */
  handleAudioPause() {
    this.isPlaying = false;
    navigator.mediaSession.playbackState = "paused";
    if (this.forcePause) {
      this.showPlayIcon = true;
    } else {
      this.showPlayIcon = false;
    }
  }

  /** @private */
  handleAudioCanPlay() {
    if (!this.hasPlayed) {
      this.play();
    }

    if (this.playedThrough) {
      return this;
    }

    if (this.isPlaying || this.pausedByEnding) {
      this.play();
    }

    return this;
  }

  /** @private */
  handleAudioVolumeChange() {
    this.setVolumeIcon();
  }

  /** @private */
  handleAudioEmptied() {
    this.setRecentlyPlayedTrack(this.currentTrackIndex);
  }

  /** @private */
  handleAudioLoadedMetadata() {
    this.currentTrackDuration = Plvylist.timeToString(this.audio.duration);
  }

  /** @private */
  handleAudioEnded() {
    this.pausedByEnding = true;

    if (!this.isLooping) {
      this.loadNextTrack();
    } else {
      this.resetInputs();
    }
  }

  /** @private */
  handleAudioTimeUpdate() {
    if (!this.isSeeking) {
      const time = (this.audio.currentTime / this.audio.duration) * 100;
      this.seeker.valueAsNumber = time;
      this.loadCurrentTime();
    }
  }

  /** @private */
  handleSeekerChange() {
    this.isSeeking = false;
    this.audio.currentTime = (this.seeker.value * this.audio.duration) / 100;
  }

  /** @private */
  handleSeekerInput(event) {
    this.isSeeking = true;
    const newTime = (event.target.value * this.audio.duration) / 100;
    this.loadCurrentTime(newTime);
  }

  /** @private */
  handleVolumeInput() {
    this.audio.volume = this.volume.valueAsNumber;
  }

  /** @private */
  setVolumeIcon() {
    if (this.audio.volume === 0 || this.audio.muted) {
      this.volumeIcon = "#icon--volumeOff";
    } else if (this.audio.volume <= 0.45) {
      this.volumeIcon = "#icon--volumeLow";
    } else {
      this.volumeIcon = "#icon--volumeMid";
    }
  }

  toggleVolume() {
    if (!this.audio.muted) {
      this.volumeIcon = "#icon--volumeOff";
      this.volume.valueAsNumber = 0;
    } else {
      this.setVolumeIcon();
      this.volume.valueAsNumber = this.audio.volume;
    }

    this.audio.muted = !this.audio.muted;
  }

  /** @private */
  handleMediaSessionSeek(details) {
    switch (details.action) {
      case "seekforward":
        const newTime = Math.min(
          this.audio.currentTime + this.skipForwardTime,
          this.audio.duration,
        );
        this.audio.currentTime = newTime;
        break;
      case "seekbackward":
        this.audio.currentTime = Math.max(this.audio.currentTime - this.skipBackwardTime, 0);
        break;
    }
  }

  /** @private */
  handleTrackTitleClick(event) {
    const { target } = event;
    const index = target.dataset.index;
    this.loadTrack(Number(index));
  }

  /** @private */
  handleActionClick() {
    if (this.currentTrackIndex === undefined) {
      this.loadTrack(0);
      this.showPlayIcon = false;
      return this;
    }

    if (this.isPlaying) {
      this.forcePause = true;
      this.pause();
    } else {
      this.play();
    }

    return this;
  }

  /** @private */
  handleShuffle() {
    if (this.hasPlayed) {
      if (window.confirm("This will stop your current track and start you over fresh, okay?")) {
        this.shuffleTracks();
        this.loadTrack(0);
      }
    }
  }

  toggleLoop() {
    this.isLooping = !this.isLooping;
  }

  shuffleTracks() {
    let tracks = this.tracks;

    for (let i = tracks.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let tempTracks = tracks[i];
      tracks[i] = tracks[j];
      tracks[j] = tempTracks;
    }

    this.tracks = tracks;
  }

  renderIconSprite() {
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

  renderTrackList(tracks) {
    const hasAlbums = checkForKeyInArray(tracks, "album");
    const hasArtists = checkForKeyInArray(tracks, "artist");

    return html`
      <table class="trackList__table" part="tracklist-table">
        <thead part="tracklist-thead">
          <th part="tracklist-header">Track</th>
          ${hasArtists ? html`<th part="tracklist-header">Artist</th>` : html``}
          ${hasAlbums ? html`<th part="tracklist-header">Album</th>` : html``}
        </thead>
        <tbody part="tracklist-tbody">
          ${map(tracks, (track, index) => {
            const artistHTML = html`<span
              part="tracklist-track-artist-text"
              class="track__trackArtist"
              >${track.artist}</span
            >`;
            const albumHTML = html`<span part="tracklist-track-album-text" class="track__trackAlbum"
              >${track.album}</span
            >`;

            return html`
              <tr>
                <td class="trackList__track" part="tracklist-track">
                  <button
                    part="tracklist-track-title"
                    class="track__trackTitleButton"
                    data-index="${index}"
                    @click=${this.handleTrackTitleClick}>
                    ${track.title}
                  </button>
                </td>
                ${hasArtists && track.artist
                  ? html`
                      <td part="tracklist-track-artist">
                        ${track.artistUrl
                          ? html`
                              <a
                                part="tracklist-track-artist-link"
                                class="track__trackArtistUrl"
                                href="${track.artistUrl}"
                                >${artistHTML}</a
                              >
                            `
                          : html`${artistHTML}`}
                      </td>
                    `
                  : html``}
                ${hasAlbums && track.album
                  ? html`
                      <td part="tracklist-track-album">
                        ${track.albumUrl
                          ? html`
                              <a
                                part="tracklist-track-album-link"
                                class="track__trackAlbumUrl"
                                href="${track.albumUrl}"
                                >${albumHTML}</a
                              >
                            `
                          : html`${albumHTML}`}
                      </td>
                    `
                  : html``}
              </tr>
            `;
          })}
        </tbody>
      </table>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.handleActionClick = this.handleActionClick.bind(this);
    this.loadPreviousTrack = this.loadPreviousTrack.bind(this);
    this.loadNextTrack = this.loadNextTrack.bind(this);
    this.handleMediaSessionSeek = this.handleMediaSessionSeek.bind(this);
    this.addMediaSessionActionHandlers();
    navigator.mediaSession.metadata = new MediaMetadata(null);
  }

  render() {
    return this.fetchTracks.render({
      pending: () => html` <p id="plvylist-loading-message">Generating your Plvylist...</p>`,
      complete: (data) => {
        this.tracks = data;

        const loopButtonClasses = {
          "button--active": this.isLooping,
          "controlButton": true,
        };

        return html`
          ${this.renderIconSprite()}
          <audio
            id="audio"
            src=${ifDefined(this.currentTrackFile)}
            ?loop=${this.isLooping}
            .volume=${this.startingVolume}
            .currentTime=${this.startingTime}
            @play=${this.handleAudioPlay}
            @pause=${this.handleAudioPause}
            @canplay=${this.handleAudioCanPlay}
            @loadedmetadata=${this.handleAudioLoadedMetadata}
            @volumechange=${this.handleAudioVolumeChange}
            @ended=${this.handleAudioEnded}
            @emptied=${this.handleAudioEmptied}
            @timeupdate=${this.handleAudioTimeUpdate}>
            HTML Audio is not supported in your browser.
          </audio>
          <div class="meta" part="metadata">
            <slot name="artwork">
              <img
                part="metadata-artwork"
                src="${this.currentTrackArtwork || this.placeholder}"
                alt="${this.currentTrackArtwork && this.currentTrackAlbum
                  ? `Album art for ${this.currentTrackAlbum}`
                  : ""}"
                id="artwork"
                width="350"
                height="350"
                loading="lazy"
                decoding="async" />
            </slot>
            <div class="trackInfo" part="metadata-trackinfo">
              <div class="trackInfo__track" part="metadata-track-title">
                ${this.currentTrackTitle}
              </div>
              <div class="trackInfo__artist" part="metadata-track-artist">
                ${this.currentTrackArtist}
              </div>
              <div class="trackInfo__album" part="metadata-track-album">
                ${this.currentTrackAlbum}
              </div>
              <div class="trackInfo__timer" part="metadata-track-times">
                <span part="metadata-track-current-time" class="trackInfo__currentTime"
                  >${this.currentTrackTime}</span
                >
                /
                <span part="metadata-track-duration" class="trackInfo__duration"
                  >${this.currentTrackDuration}</span
                >
              </div>
            </div>
          </div>
          <div part="controls" class="controls">
            <div part="sliders" class="sliders">
              <div part="seeker-container" class="seekerContainer">
                <input
                  part="seeker"
                  type="range"
                  id="seeker"
                  min="0"
                  step="0.01"
                  aria-label="Seek through the track."
                  .defaultValue=${Number(0)}
                  ?disabled=${!this.hasPlayed}
                  @change=${this.handleSeekerChange}
                  @input=${this.handleSeekerInput} />
              </div>
              <div part="volume-container" class="volumeContainer">
                <button
                  part="volume-button"
                  id="volumeButton"
                  class="controlButton"
                  @click=${this.toggleVolume}>
                  <svg width="24" height="24">
                    <use href="${this.volumeIcon}"></use>
                  </svg>
                </button>
                <input
                  part="volume"
                  type="range"
                  id="volume"
                  min="0"
                  max="1"
                  step="0.01"
                  aria-label="Volume control."
                  .defaultValue=${this.startingVolume}
                  @input=${this.handleVolumeInput} />
              </div>
            </div>
            <div part="controls-buttons" class="buttons">
              <button
                part="shuffle-button"
                id="shuffle"
                class="controlButton"
                @click=${this.handleShuffle}>
                <svg width="24" height="24">
                  <use href="#icon--shuffle"></use>
                </svg>
              </button>
              <button
                part="previous-button"
                id="previous"
                class="controlButton"
                ?disabled=${!this.hasPlayed}
                @click=${this.loadPreviousTrack}>
                <svg width="24" height="24">
                  <use href="#icon--previous"></use>
                </svg>
              </button>
              <button
                part="action-button"
                id="action"
                class="controlButton"
                @click=${this.handleActionClick}>
                <svg width="24" height="24">
                  <use href="#icon--${this.showPlayIcon ? "play" : "pause"}"></use>
                </svg>
              </button>
              <button
                part="next-button"
                id="next"
                class="controlButton"
                ?disabled=${!this.hasPlayed}
                @click=${this.loadNextTrack}>
                <svg width="24" height="24">
                  <use href="#icon--next"></use>
                </svg>
              </button>
              <button
                part="loop-button"
                id="loop"
                class="${classMap(loopButtonClasses)}"
                @click=${this.toggleLoop}>
                <svg width="24" height="24">
                  <use href="#icon--loop"></use>
                </svg>
              </button>
            </div>
          </div>
          <div part="tracklist" class="tracklist">${this.renderTrackList(this.tracks)}</div>
        `;
      },
      error: (e) => html`<p id="plvylist-error-message">${e}</p>`,
    });
  }
}

if (!window.customElements.get("plvy-list")) {
  window.customElements.define("plvy-list", Plvylist);
}
