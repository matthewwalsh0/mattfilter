const ATTRIBUTE = "data-mattfilter-option";

export function addDivider() {
  const dividerReference = getContainer().querySelector(".SelectMenu-divider");

  const newDivider = dividerReference.cloneNode(true);

  getForm().appendChild(newDivider);
}

export function addHeader(text: string) {
  const headerReference = getContainer().querySelector(".SelectMenu-header");

  const header = headerReference.cloneNode(true);
  (header as HTMLElement).querySelector("h3").textContent = text;

  getForm().appendChild(header);
}

export function addOption(text: string, key: string, onClick: () => void) {
  const labelReference = [
    ...getContainer().querySelectorAll(".SelectMenu-item"),
  ].slice(-1)[0];

  const label = labelReference.cloneNode(true);
  label.removeChild([...label.childNodes].slice(-1)[0]);
  label.appendChild(document.createTextNode(text));

  const input = (label as HTMLElement).querySelector("input");
  input.checked = false;

  input.addEventListener("change", () => onClick());
  input.setAttribute(ATTRIBUTE, key);

  getForm().appendChild(label);
}

export function getSelectedOwners(): string[] {
  return [...document.querySelectorAll("[" + ATTRIBUTE + "]")]
    .filter((filter) => (filter as HTMLInputElement).checked)
    .map((filter) => filter.getAttribute(ATTRIBUTE));
}

function getForm() {
  return getContainer().querySelector(".js-file-filter-form");
}

function getContainer() {
  return document.querySelector(".js-file-filter");
}
