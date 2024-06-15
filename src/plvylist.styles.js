import { css } from "lit";

export default css`
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

  input[type="range"][disabled] {
    cursor: not-allowed;
  }

  input[type="range"]:not([disabled]) {
    cursor: pointer;
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
    padding: var(--space-2xs);
    transition: color 0.1s ease;
  }

  .controlButton[disabled] {
    cursor: not-allowed;
  }

  .controlButton:not([disabled]):hover {
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
    border-spacing: var(--space-2xs) var(--space-3xs);
    counter-reset: tracks;
    font-size: var(--plvylist-tracklist-font-size, unset);
    inline-size: 100%;
    min-inline-size: max-content;
  }

  .trackList__table :is(th, td) {
    text-align: start;
  }

  .trackList__table th {
    --cell-padding: var(--space-2xs);
  }

  .trackList__track {
    counter-increment: tracks;
  }

  .trackList__track::before {
    content: counter(tracks) ".";
  }

  button.song--active,
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
