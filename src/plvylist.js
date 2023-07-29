/**
 * @file Plvylist Web Component
 */

import { html } from "common-tags";
import placeholderArtwork from "./placeholder-artwork.svg";

const EMPTY_METADATA = "--";
const BREAKPOINT_MEDIUM = "750px";

/**
 * Fetches data from a JSON file to look for its tracks.
 * @param {string} location Path to JSON file.
 * @returns {Record<string, string>[]} Tracks field from data.
 */
const fetchTrackData = async (location) => {
  if (location) {
    const res = await fetch(location);
    const data = await res.json();

    return data.tracks;
  }
};

/**
 * Check if a given key exists in any object within an array of objects.
 * @param {any[]} arr Array of objects.
 * @param {string} key Key to look for in array of objects.
 * @returns {Boolean}
 */
const checkForKeyInArray = (arr, key) => arr.some((obj) => Object.keys(obj).includes(key));

/**
 * Creates a range input for sliders.
 * @param id ID of the element.
 * @param options Any additional attributes and their values to apply.
 * @returns {HTMLInputElement}
 */
function createSlider(id, options = {}) {
  const input = document.createElement("input");
  input.id = id;
  input.type = "range";

  for (const option in options) {
    input.setAttribute(option, options[option]);
  }

  return input;
}

/**
 * Creates a button element with the chosen SVG icon.
 * @param id ID of the element.
 * @param icon Type of icon to use from the library.
 * @param type Icon could be "large" or default size.
 * @returns {HTMLButtonElement}
 */
function createIcon(id, icon, type = "", classes = ["controlButton"]) {
  const button = document.createElement("button");
  button.id = id;
  button.classList.add(...classes);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("stroke-width", "1.5");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("fill", "none");

  switch (type) {
    case "large":
      svg.setAttribute("width", "44");
      svg.setAttribute("height", "44");
      break;
    default:
      svg.setAttribute("width", "24");
      svg.setAttribute("height", "24");
      break;
  }

  svg.innerHTML = icon;
  button.appendChild(svg);

  return button;
}

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
export default class Plvylist extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.placeholder = placeholderArtwork;

    this.file = ""; // No default tracks file
    this.tracks = []; // Starts empty because no tracks have been loaded and we can't fetch data from an empty file string

    this.startingVolume = 0.5;
    this.startingTime = 0;
    this.skipForwardTime = 30;
    this.skipBackwardTime = 10;

    this.audioOverride = false; // Helps manage when tracks should be started or paused during selection.
    this.currentTrackIndex = undefined;

    this.hasArtists = undefined;
    this.hasAlbums = undefined;

    // Bind internal functions
    this.previousTrack = this.previousTrack.bind(this);
    this.nextTrack = this.nextTrack.bind(this);
    this.loadDuration = this.loadDuration.bind(this);
    this.loadCurrentTime = this.loadCurrentTime.bind(this);
    this.setVolumeIcon = this.setVolumeIcon.bind(this);
    this.toggleVolume = this.toggleVolume.bind(this);
    this.toggleLoop = this.toggleLoop.bind(this);
    this.shuffleTracks = this.shuffleTracks.bind(this);
    this.addActiveTrackClass = this.addActiveTrackClass.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
    this.handleAudioEmptied = this.handleAudioEmptied.bind(this);
    this.handleAudioEnded = this.handleAudioEnded.bind(this);
    this.handleSeekerChange = this.handleSeekerChange.bind(this);
    this.handleSeekerInput = this.handleSeekerInput.bind(this);
    this.handleMediaSessionSeek = this.handleMediaSessionSeek.bind(this);
    this.handleShuffle = this.handleShuffle.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.handleVolumeInput = this.handleVolumeInput.bind(this);
    this.addMediaSessionActionHandlers = this.addMediaSessionActionHandlers.bind(this);
    this.updateMediaSessionMetadata = this.updateMediaSessionMetadata.bind(this);

    /** All icons. */
    this.icons = {
      play: html`<title>Play</title><path d="M7 4v16l13 -8z" />`,
      pause: html`<title>Pause</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><rect
          x="6"
          y="5"
          width="4"
          height="14"
          rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" />`,
      previous: html`<title>Previous</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path>`,
      next: html`<title>Next</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><path d="M3 5v14l8-7z"></path><path d="M14 5v14l8-7z"></path>`,
      shuffle: html`<title>Shuffle</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><rect x="3" y="3" width="6" height="6" rx="1"></rect
        ><rect x="15" y="15" width="6" height="6" rx="1"></rect
        ><path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path
        ><path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>`,
      loop: html`<title>Loop</title><path stroke="none" d="M0 0h24v24H0z" fill="none"></path
        ><path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path
        ><path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path><path d="M11 11l1 -1v4"></path>`,
      volumeOff: html`<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" /><path
          d="M16 10l4 4m0 -4l-4 4" />`,
      volumeLow: html`<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
          d="M15 8a5 5 0 0 1 0 8" /><path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
      volumeMid: html`<title>Volume</title><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path
          d="M15 8a5 5 0 0 1 0 8" /><path d="M17.7 5a9 9 0 0 1 0 14" /><path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
    };

    this.actionHandlers = [
      ["play", this.handleActionClick],
      ["pause", this.handleActionClick],
      ["previoustrack", this.previousTrack],
      ["nexttrack", this.nextTrack],
      ["seekforward", this.handleMediaSessionSeek],
      ["seekbackward", this.handleMediaSessionSeek],
    ];
  }

  // Component API
  static get observedAttributes() {
    return [
      "file",
      "placeholder",
      "starting-volume",
      "starting-time",
      "skip-forward-time",
      "skip-backward-time",
    ];
  }

  // Changes based on API
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case "file":
        this.file = newValue;
        this.tracks = fetchTrackData(this.file); // Initialize new tracks with the new file
        break;
      case "placeholder":
        this.placeholder = newValue;
        break;
      case "starting-volume":
        this.startingVolume = newValue;
        break;
      case "starting-time":
        this.startingTime = newValue;
        break;
      default:
        return true;
    }
  }

  /**
   * Render component styles.
   * @returns {string} HTML string for the component styles in a `<style>` element.
   */
  renderStyles() {
    return html`
      <style>
        /* ======
         * Resets
         * ====== */
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

        /* =====
         * Theme
         * ===== */
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

        /* ============
         * Meta Section
         * ============ */
        .meta {
          align-items: end;
          display: grid;
          gap: var(--space-s);
        }

        @media (min-width: ${BREAKPOINT_MEDIUM}) {
          .meta {
            grid-template-columns: auto 1fr;
          }
        }

        /* ================
         * Controls Section
         * ================ */
        .controls {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xs);
          margin-block: var(--space-s);
        }

        /* ===================
         * Controls :: Sliders
         * =================== */
        input[type="range"] {
          display: block;
          inline-size: 100%;
        }

        .sliders {
          align-items: center;
          display: grid;
          gap: var(--space-s);
        }

        @media (min-width: ${BREAKPOINT_MEDIUM}) {
          .sliders {
            grid-template-columns: 2.5fr 1fr;
          }
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

        /* ===================
         * Controls :: Buttons
         * =================== */
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

        /* ==========
         * Track List
         * ========== */
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
      </style>
    `;
  }

  /**
   * Render the HTML shell of the component.
   * @returns {string} HTML string for the component's template.
   */
  renderContainer() {
    return html`
      <audio id="audio"></audio>
      <div class="meta">
        <img
          src="${this.placeholder}"
          alt=""
          id="artwork"
          width="350"
          height="350"
          loading="lazy"
          decoding="async" />
        <div class="trackInfo">
          <p class="trackInfo__track">${EMPTY_METADATA}</p>
          <p class="trackInfo__artist">${EMPTY_METADATA}</p>
          <p class="trackInfo__album">${EMPTY_METADATA}</p>
          <p class="trackInfo__timer">
            <span class="trackInfo__currentTime">${EMPTY_METADATA}</span> /
            <span class="trackInfo__duration">${EMPTY_METADATA}</span>
          </p>
        </div>
      </div>
      <div class="controls">
        <div class="sliders">
          <div class="seekerContainer"><!-- dynamic content --></div>
          <div class="volumeContainer"><!-- dynamic content --></div>
        </div>
        <div class="buttons"><!-- dynamic content --></div>
      </div>
      <div class="tracklist"><!-- dynamic content --></div>
    `;
  }

  /**
   * Render the styles and HTML shell together at the given location.
   * @param {HTMLElement|Node|DocumentFragment} root Where to render the component styles and shell.
   */
  renderTemplate(root) {
    root.innerHTML = `${this.renderStyles()} ${this.renderContainer()}`;
  }

  /**
   * Render the primary control bar by creating each button element and appending them to the container.
   * @see createIcon
   */
  renderPrimaryControls() {
    if (this.controlsPrimaryContainer) {
      this.controlsPrimaryContainer.appendChild(createIcon("shuffle", this.icons.shuffle));
      this.controlsPrimaryContainer.appendChild(createIcon("previous", this.icons.previous));
      this.controlsPrimaryContainer.appendChild(createIcon("action", this.icons.play, "large"));
      this.controlsPrimaryContainer.appendChild(createIcon("next", this.icons.next));
      this.controlsPrimaryContainer.appendChild(createIcon("loop", this.icons.loop));
    }
  }

  /**
   * Render the track seeker by creating the input element and appending it to the container.
   * @see createSlider
   */
  renderSeekerBar() {
    if (this.seekerContainer) {
      const bar = createSlider("seeker", {
        "min": "0",
        "step": "0.01",
        "value": "0",
        "aria-label": "seek through the track",
      });

      this.seekerContainer.appendChild(bar);
    }
  }

  /**
   * Render the volume bar by creating the input and associated button and appending them to the container.
   * @see createIcon
   */
  renderVolumeBar() {
    if (this.volumeContainer) {
      const button = createIcon("volumeButton", this.icons.volumeMid);
      const bar = createSlider("volume", {
        "min": "0",
        "max": "1",
        "step": "0.01",
        "aria-label": "volume control",
      });

      this.volumeContainer.appendChild(button);
      this.volumeContainer.appendChild(bar);
    }
  }

  /**
   * Render the track list by creating new list items and setting the resulting string as the inner HTML of the container.
   *
   * We fetch the tracks file here and set `this.tracks` to the return value. That property is used to iterate over and render list items.
   *
   * If we're shuffling tracks, then `this.tracks` is set to the return value of the shuffle method.
   *
   * @param {boolean} shuffled Whether or not we're getting tracks from a shuffled list or from the file.
   */
  async renderTrackList(shuffled = false) {
    try {
      if (!shuffled) {
        // Ignore VS Code saying await has no effect here.
        this.tracks = await fetchTrackData(this.file);
      } else {
        this.tracks = this.shuffleTracks();
      }

      if (!checkForKeyInArray(this.tracks, "file")) {
        throw new Error("No files were found.");
      }

      let list = html``;

      this.hasAlbums = checkForKeyInArray(this.tracks, "album");
      this.hasArtists = checkForKeyInArray(this.tracks, "artist");

      this.tracks.forEach((track, index) => {
        const artistHTML = html`<span class="track__trackArtist">${track.artist}</span>`;
        const albumHTML = html`<span class="track__trackAlbum">${track.album}</span>`;
        list += html`<tr>
          <td class="trackList__track" data-track="${index}">
            <button class="track__trackTitleButton">
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
                  ? html`<a class="track__trackAlbumUrl" href="${track.albumUrl}">${albumHTML}</a>`
                  : html`${albumHTML}`}
              </td>`
            : html``}
        </tr>`;
      });

      this.songsContainer.innerHTML = html`<table class="trackList__table">
        <thead>
          <th>Track</th>
          ${this.hasArtists ? html`<th>Artist</th>` : html``}
          ${this.hasAlbums ? html`<th>Album</th>` : html``}
        </thead>
        <tbody>
          ${list}
        </tbody>
      </table>`;

      this.trackList.forEach((track, index) =>
        track.addEventListener("click", () => {
          if (this.currentTrackIsUndefined()) {
            this.loadTrack(index);
            this.playOrPause("play");
          } else if (this.audio.paused) {
            this.loadTrack(index);
          } else {
            this.loadTrack(index);
            this.audio.play();
          }
        })
      );
    } catch (error) {
      console.error(error);
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
   * Album artwork.
   * @type {HTMLImageElement}
   */
  get artwork() {
    return this.queryShadowRoot("#artwork");
  }

  /**
   * Artist name.
   * @type {HTMLParagraphElement}
   */
  get artist() {
    return this.queryShadowRoot(".trackInfo__artist");
  }

  /**
   * Track name.
   * @type {HTMLParagraphElement}
   */
  get track() {
    return this.queryShadowRoot(".trackInfo__track");
  }

  /**
   * Album/Release name.
   * @type {HTMLParagraphElement}
   */
  get album() {
    return this.queryShadowRoot(".trackInfo__album");
  }

  /**
   * Current time position of the track.
   * @type {HTMLSpanElement}
   */
  get current() {
    return this.queryShadowRoot(".trackInfo__currentTime");
  }

  /**
   * Total duration of the track.
   * @type {HTMLSpanElement}
   */
  get duration() {
    return this.queryShadowRoot(".trackInfo__duration");
  }

  /**
   * Container for the seeker bar.
   * @type {HTMLDivElement}
   */
  get seekerContainer() {
    return this.queryShadowRoot(".seekerContainer");
  }

  /**
   * Seeker bar.
   * @type {HTMLInputElement}
   */
  get seeker() {
    return this.queryShadowRoot("#seeker");
  }

  /**
   * Previous track button.
   * @type {HTMLButtonElement}
   */
  get previous() {
    return this.queryShadowRoot("#previous");
  }

  /**
   * Primary action button.
   * @type {HTMLButtonElement}
   */
  get action() {
    return this.queryShadowRoot("#action");
  }

  /**
   * Inner SVG of the action button.
   * @type {SVGElement}
   */
  get actionSvg() {
    if (this.action) {
      return this.action.querySelector("svg");
    }
  }

  /**
   * Next track button.
   * @type {HTMLButtonElement}
   */
  get next() {
    return this.queryShadowRoot("#next");
  }

  /**
   * Shuffle tracks button.
   * @type {HTMLButtonElement}
   */
  get shuffle() {
    return this.queryShadowRoot("#shuffle");
  }

  /**
   * Track loop button.
   * @type {HTMLButtonElement}
   */
  get loop() {
    return this.queryShadowRoot("#loop");
  }

  /**
   * Container for the volume section.
   * @type {HTMLDivElement}
   */
  get volumeContainer() {
    return this.queryShadowRoot(".volumeContainer");
  }

  /**
   * Volume button.
   * @type {HTMLButtonElement}
   */
  get volumeButton() {
    return this.queryShadowRoot("#volumeButton");
  }

  /**
   * Inner SVG of the volume button.
   * @type {SVGElement}
   */
  get volumeButtonSvg() {
    if (this.volumeButton) {
      return this.volumeButton.querySelector("svg");
    }
  }

  /**
   * Volume bar.
   * @type {HTMLInputElement}
   */
  get volume() {
    return this.queryShadowRoot("#volume");
  }

  /**
   * Container for the track list.
   * @type {HTMLOListElement}
   */
  get songsContainer() {
    return this.queryShadowRoot(".tracklist");
  }

  /**
   * Primary controls container.
   * @type {HTMLDivElement}
   */
  get controlsPrimaryContainer() {
    return this.queryShadowRoot(".buttons");
  }

  /**
   * All the individual track list items.
   * @type {HTMLLIElement[]}
   */
  get trackList() {
    return this.queryShadowRoot(".track__trackTitleButton", true);
  }

  /**
   * Alt text for the artwork image.
   * @type {string}
   */
  get albumArtAltText() {
    return this.trackAlbumArt ? `Album art for ${this.trackAlbum}` : "";
  }

  /**
   * Current track object.
   * @type {Record<string, string>}
   */
  get currentTrack() {
    return this.tracks[this.currentTrackIndex];
  }

  /**
   * Current artist.
   * @type {string}
   */
  get trackArtist() {
    return this.currentTrack?.artist || EMPTY_METADATA;
  }

  /**
   * Current track title.
   * @type {string}
   */
  get trackTitle() {
    return this.currentTrack?.title || EMPTY_METADATA;
  }

  /**
   * Current album.
   * @type {string}
   */
  get trackAlbum() {
    return this.currentTrack?.album || EMPTY_METADATA;
  }

  /**
   * Current track's artwork.
   * @type {string}
   */
  get trackAlbumArt() {
    return this.currentTrack?.artwork;
  }

  /**
   * Current track's file.
   * @type {string}
   */
  get trackFile() {
    return this.currentTrack.file;
  }

  /** Total number of tracks. */
  get trackCount() {
    return this.tracks?.length;
  }

  /**
   * Check if the current track index is undefined.
   * @returns {boolean} If the currentTrackIndex is undefined.
   */
  currentTrackIsUndefined() {
    return this.currentTrackIndex === undefined;
  }

  /** Set default or custom settings from the API. */
  applySettings() {
    this.volume.value = this.startingVolume;
    this.audio.volume = this.startingVolume;
    this.seeker.value = this.startingTime;
    this.audio.currentTime = this.startingTime;
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

    // Reset metadata
    this.audio.src = this.trackFile;
    this.artist.innerHTML = this.trackArtist;
    this.track.innerHTML = this.trackTitle;
    this.album.innerHTML = this.trackAlbum;
    this.artwork.src = this.trackAlbumArt || this.placeholder;

    this.loadCurrentTime();
    this.updateMediaSessionMetadata();
  }

  /** Play or pause a track and set respective properties. */
  playOrPause(type = "play") {
    if (type === "play") {
      this.audio.play();
      this.actionSvg.innerHTML = this.icons.pause;
      navigator.mediaSession.playbackState = "playing";
    }

    if (type === "pause") {
      this.audio.pause();
      this.actionSvg.innerHTML = this.icons.play;
      navigator.mediaSession.playbackState = "paused";
    }

    this.updateMediaSessionMetadata();
    this.audioOverride = !this.audioOverride;
  }

  /** Changes selection to the previous track. */
  previousTrack() {
    const track = this.currentTrackIndex - 1;
    if (this.currentTrackIsUndefined()) {
      return false;
    } else if (track > -1) {
      if (!this.audio.paused) {
        this.loadTrack(track);
        this.audio.play();
      } else {
        this.loadTrack(track);
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
    if (this.currentTrackIsUndefined()) {
      this.loadTrack(0);
    } else if (track < this.trackCount) {
      if (!this.audio.paused) {
        this.loadTrack(track);
        this.audio.play();
      } else {
        this.loadTrack(track);
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
    this.duration.innerHTML = this.timeToString(this.audio.duration);
  }

  /** Loads the current track's play progress from metadata and displays it. */
  loadCurrentTime() {
    if (!this.audio.src) {
      return false; // Don't do anything if there's no audio source
    }

    this.current.innerHTML = this.timeToString();
  }

  /** Changes the icon in the volume button based on the current volume level. */
  setVolumeIcon() {
    if (this.audio.volume === 0 || this.audio.muted) {
      this.volumeButtonSvg.innerHTML = this.icons.volumeOff;
    } else if (this.audio.volume <= 0.45) {
      this.volumeButtonSvg.innerHTML = this.icons.volumeLow;
    } else {
      this.volumeButtonSvg.innerHTML = this.icons.volumeMid;
    }
  }

  /** Mutes or unmutes the track based on muted state. */
  toggleVolume() {
    if (!this.audio.muted) {
      this.audio.muted = !this.audio.muted;
      this.volumeButtonSvg.innerHTML = this.icons.volumeOff;
      this.volume.value = 0;
    } else {
      this.audio.muted = !this.audio.muted;
      this.setVolumeIcon();
      this.volume.value = this.audio.volume;
    }
  }

  /** Sets the track to loop or not based on loop state. */
  toggleLoop() {
    this.audio.loop = !this.audio.loop;
    this.loop.classList.toggle("button--active");
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

    return tracks;
  }

  /** Add a class to the active song. */
  addActiveTrackClass() {
    this.queryShadowRoot(`[data-track="${this.currentTrackIndex}"]`).classList.add("song--active");
  }

  /** Run on audio end. */
  handleAudioEnded() {
    if (!this.audio.loop) {
      if (this.currentTrackIndex === this.trackCount - 1) {
        this.nextTrack();
      } else {
        this.nextTrack();
        this.audio.play();
      }
    }
  }

  /** Update the seeker value as the track progresses. */
  handleTimeUpdate() {
    this.seeker.value = `${parseInt((this.audio.currentTime / this.audio.duration) * 100, 10)}`;
    this.loadCurrentTime();
  }

  /** Run on audio empty.  */
  handleAudioEmptied() {
    const activeSong = this.queryShadowRoot(".song--active");

    if (activeSong) activeSong.classList.remove("song--active");
  }

  /** Run when the seeker emits change. */
  handleSeekerChange() {
    if (this.currentTrackIsUndefined()) {
      return false;
    } else {
      this.audio.currentTime = (this.seeker.value * this.audio.duration) / 100;
      this.audioOverride ? this.audio.play() : false;
    }
  }

  /** Run when seeker emits input. */
  handleSeekerInput(event) {
    if (this.currentTrackIsUndefined()) {
      return false;
    } else {
      this.audio.pause();
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
    if (this.currentTrackIsUndefined()) {
      this.loadTrack(0);
      this.playOrPause("play");
    } else if (this.audio.paused) {
      this.playOrPause("play");
    } else {
      this.playOrPause("pause");
    }
  }

  /** Update the metadata of the media session. */
  updateMediaSessionMetadata() {
    navigator.mediaSession.metadata.title = this.trackTitle;
    navigator.mediaSession.metadata.artist = this.trackArtist;
    navigator.mediaSession.metadata.album = this.trackAlbum;
    navigator.mediaSession.metadata.artwork = [{ src: this.trackAlbumArt }];
  }

  /** Run on shuffle click. */
  handleShuffle() {
    window.alert("This will stop your current track and start you over fresh, okay?");

    this.renderTrackList(true);

    if (!this.audio.paused) {
      this.loadTrack(0);
      this.audio.play();
    } else {
      this.loadTrack(0);
    }
  }

  /** Run when volume bar emits input. */
  handleVolumeInput() {
    this.audio.volume = this.volume.value;
  }

  /** Add event listeners to all relevant elements. */
  addAllEventListeners() {
    this.audio.addEventListener("loadstart", this.addActiveTrackClass);
    this.audio.addEventListener("loadedmetadata", this.loadDuration);
    this.audio.addEventListener("volumechange", this.setVolumeIcon);
    this.audio.addEventListener("ended", this.handleAudioEnded);
    this.audio.addEventListener("timeupdate", this.handleTimeUpdate);
    this.audio.addEventListener("emptied", this.handleAudioEmptied);
    this.seeker.addEventListener("change", this.handleSeekerChange);
    this.seeker.addEventListener("input", this.handleSeekerInput);
    this.previous.addEventListener("click", this.previousTrack);
    this.action.addEventListener("click", this.handleActionClick);
    this.next.addEventListener("click", this.nextTrack);
    this.loop.addEventListener("click", this.toggleLoop);
    this.shuffle.addEventListener("click", this.handleShuffle);
    this.volumeButton.addEventListener("click", this.toggleVolume);
    this.volume.addEventListener("input", this.handleVolumeInput, false);
  }

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
    this.renderTemplate(this.shadowRoot);
    this.renderPrimaryControls();
    this.renderSeekerBar();
    this.renderVolumeBar();
    this.applySettings();
    this.renderTrackList();
    this.addAllEventListeners();
    this.addMediaSessionActionHandlers();

    navigator.mediaSession.metadata = new MediaMetadata(null);
  }
}

customElements.define("plvy-list", Plvylist);
