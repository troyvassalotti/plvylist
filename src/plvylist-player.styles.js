import { css } from "lit";

export const styles = css`
  :host {
    accent-color: var(--plvylist-accent, royalblue);
    box-sizing: border-box;
    display: block;
    font-family: var(--plvylist-font, inherit);
    line-height: var(--plvlist-line-height, 1.5);
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  * {
    margin: 0;
  }

  #artwork {
    block-size: auto;
    max-inline-size: 100%;
  }

  .metadata {
    align-items: flex-end;
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
  }

  plvy-button[type="next"] {
    margin-inline-end: auto;
  }

  plvy-button[active] ::part(icon) {
    stroke: var(--plvylist-changed, crimson);
  }

  .seeker {
    margin-block: 1rem;
  }

  .volume {
    display: inline-flex;
  }

  .song button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    stroke: currentColor;
  }

  .controls {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-block: 1rem;
  }

  .controls__primary {
    display: flex;
    flex: 1;
    inline-size: 100%;
    justify-content: center;
  }

  .song__title {
    text-align: inherit;
    transition: 0.1s color ease-in-out;
  }

  .song__active button,
  .song__title:hover {
    opacity: 0.666;
    text-decoration: underline;
  }

  img[src^="data:image/svg+xml"] {
    filter: contrast(0.5);
  }

  input[type="range"] {
    inline-size: 100%;
  }
`;
