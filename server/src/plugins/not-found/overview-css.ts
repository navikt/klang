const css = (strings: TemplateStringsArray): string => String.raw({ raw: strings });

export const overviewCss = css`
*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 2rem;
  margin-bottom: 8rem;
}

table {
  border-collapse: collapse;
  max-width: 100%;
}

tbody tr:nth-child(odd) {
  background-color: #f2f3f5;
}

tbody tr:hover {
  background-color: #eceef0;
}

th {
  font-size: 1.25rem;
  font-weight: bold;
}

th,
td {
  padding-block: 0.75rem;
  padding-inline: 0.25rem;
  overflow: hidden;
  white-space: nowrap;
}

.link {
  background-color: #0067c5;
  color: white;
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: 4px;
  display: block;
  width: 100%;
  white-space: nowrap;
}

.link:hover {
  background-color: #0056b4;
}

.link:active {
  background-color: #00459c;
}

.link:visited {
  background-color: #634689;
}

.link:visited:hover {
  background-color: #523874;
}

.link:visited:active {
  background-color: #412b5d;
}

.ytelse {
  text-align: left;
  padding-right: 1rem;
  max-width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-left {
  text-align: left;
}

.capitalized:not(:first-letter) {
  text-transform: lowercase;
}

.capitalized:first-letter {
  text-transform: uppercase;
}

.key-cell {
  text-align: left;
  max-width: 650px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: monospace;
  font-size: 1rem;
}

.key-cell:hover {
  max-width: unset;
}

dt {
  font-weight: bold;
}

dd {
  margin: 0;
}

.two-columns-grid {
  display: grid;
  grid-template-columns: min-content min-content;
  margin: 0;
  grid-gap: .25rem;
}
`;
