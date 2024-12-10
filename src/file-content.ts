export function hideFiles(paths: string[]) {
  const files = [
    ...document.querySelectorAll("copilot-diff-entry"),
  ] as HTMLElement[];

  for (const file of files) {
    const path = file.getAttribute("data-file-path");
    const isVisible = !paths.includes(path);

    setFileVisibility(file, isVisible);
  }
}

function setFileVisibility(file: HTMLElement, isVisible: boolean) {
  file.style.display = isVisible ? "" : "none";
}
