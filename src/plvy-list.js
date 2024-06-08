import { LitElement, html, css } from "lit";
import { Task } from "@lit/task";
import placeholderArtwork from "./placeholder-artwork.svg";

const EMPTY_METADATA = "--";

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
  };

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
    this.hasArtists = undefined;
    this.hasAlbums = undefined;

    this.icons = {
      play: html`<title>Play</title><path d="M7 4v16l13 -8z" />`,
      pause: html` <title>Pause</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <rect x="6" y="5" width="4" height="14" rx="1" />
        <rect x="14" y="5" width="4" height="14" rx="1" />`,
      previous: html`<title>Previous</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M21 5v14l-8 -7z"></path>
        <path d="M10 5v14l-8 -7z"></path>`,
      next: html`<title>Next</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M3 5v14l8-7z"></path>
        <path d="M14 5v14l8-7z"></path>`,
      shuffle: html`<title>Shuffle</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <rect x="3" y="3" width="6" height="6" rx="1"></rect>
        <rect x="15" y="15" width="6" height="6" rx="1"></rect>
        <path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3"></path>
        <path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3"></path>`,
      loop: html`<title>Loop</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M4 12v-3a3 3 0 0 1 3 -3h13m-3 -3l3 3l-3 3"></path>
        <path d="M20 12v3a3 3 0 0 1 -3 3h-13m3 3l-3-3l3-3"></path>
        <path d="M11 11l1 -1v4"></path>`,
      volumeOff: html`<title>Volume</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />
        <path d="M16 10l4 4m0 -4l-4 4" />`,
      volumeLow: html`<title>Volume</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 8a5 5 0 0 1 0 8" />
        <path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
      volumeMid: html`<title>Volume</title>
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M15 8a5 5 0 0 1 0 8" />
        <path d="M17.7 5a9 9 0 0 1 0 14" />
        <path
          d="M6 15h-2a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h2l3.5 -4.5a.8 .8 0 0 1 1.5 .5v14a.8 .8 0 0 1 -1.5 .5l-3.5 -4.5" />`,
    };
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
      const response = await fetch(source, { signal });

      if (!response.ok) {
        throw new Error(response.status);
      }

      return response.json();
    },
    args: () => [this.file],
  });

  static createIconButton(id, icon, type) {
    const size = type === "large" ? 44 : 24;

    return html`
      <button class="controlButton" id="${id}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          width="${size}"
          height="${size}">
          ${icon}
        </svg>
      </button>
    `;
  }

  renderTrackList(shuffled = false) {}

  render() {
    return this.dataTask.render({
      pending: () => html` <p id="plvylist-loading-message">Generating your Plvylist...</p>`,
      complete: (data) => html`
        <audio id="audio" .volume=${this.startingVolume} .currentTime=${this.startingTime}></audio>
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
            <div class="seekerContainer">
              <input
                type="range"
                id="seeker"
                min="0"
                step="0.01"
                .defaultValue=${this.startingTime}
                aria-label="Seek through the track." />
            </div>
            <div class="volumeContainer">
              ${Plvylist.createIconButton("volumeButton", this.icons.volumeMid)}
              <input
                type="range"
                id="volume"
                min="0"
                max="1"
                .defaultValue=${this.startingVolume}
                step="0.01"
                aria-label="Volume control." />
            </div>
          </div>
          <div class="buttons">
            ${Plvylist.createIconButton("shuffle", this.icons.shuffle)}
            ${Plvylist.createIconButton("previous", this.icons.previous)}
            ${Plvylist.createIconButton("action", this.icons.play)}
            ${Plvylist.createIconButton("next", this.icons.next)}
            ${Plvylist.createIconButton("loop", this.icons.loop)}
          </div>
        </div>
        <div class="tracklist"><!-- dynamic content --></div>
      `,
      error: (e) => html`<p id="plvylist-error-message">Error: ${e}</p>`,
    });
  }
}

if (window.customElements.get(Plvylist.tagName)) {
  window.customElements.define(Plvylist.tagName, Plvylist);
}
