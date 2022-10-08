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

  input {
	inline-size: 100%;
  }
`;
