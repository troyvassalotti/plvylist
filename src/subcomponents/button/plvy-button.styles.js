import { css } from "lit";

export const styles = css`
  :host {
    box-sizing: border-box;
    display: block;
  }

  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  * {
    margin: 0;
  }

  button {
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    font: inherit;
    stroke: currentColor;
  }

  button:hover svg {
    opacity: 0.666;
  }
`;
