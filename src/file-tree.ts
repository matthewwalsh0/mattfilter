export function isLoaded(): boolean {
  return Boolean(
    document.querySelector("[data-tree-entry-type='file'][data-codeowners]")
  );
}

export function getFilesByOwner(): Record<string, string[]> {
  const files = getFileElements();
  const user = getUser();

  return files.reduce<Record<string, string[]>>((owners, file) => {
    const path = getFilePath(file);
    const fileOwners = getFileOwners(file);

    for (const owner of fileOwners) {
      if (owner === "" || owner === user) {
        continue;
      }

      const ownerFiles = owners[owner] ?? [];

      owners[owner] = [...ownerFiles, path];
    }

    return owners;
  }, {});
}

export function filterFilesByOwner(owners: string[]): string[] {
  const files = getFileElements();

  return files
    .map((file) => {
      const path = getFilePath(file);
      const fileOwners = getFileOwners(file);

      const isVisible =
        owners.some((owner) => fileOwners.includes(owner)) || !owners.length;

      setFileVisibility(file, isVisible);

      return isVisible ? undefined : path;
    })
    .filter((path) => path !== undefined);
}

export function hideEmptyDirectories() {
  const directories = [
    ...document.querySelectorAll("[data-tree-entry-type='directory']"),
  ].reverse() as HTMLElement[];

  for (const directory of directories) {
    const files = [
      ...directory.querySelectorAll(
        "[data-tree-entry-type='file'], [data-tree-entry-type='directory']"
      ),
    ] as HTMLElement[];

    const hiddenFiles = [...files].filter(
      (file) =>
        file.getAttribute("data-mattfilter-visible") === "false" ||
        file.hidden === true
    );

    const isVisible = files.length !== hiddenFiles.length;

    setFileVisibility(directory, isVisible);
  }
}

function getFileOwners(file: HTMLElement): string[] {
  const owners = file.getAttribute("data-codeowners").split(",");
  return owners.length === 1 && owners[0] === "" ? ["No Owner"] : owners;
}

function getFilePath(file: HTMLElement): string {
  const data = file.getAttribute("data-hydro-click-payload");
  return JSON.parse(data).payload.data.path.trim();
}

function setFileVisibility(file: HTMLElement, isVisible: boolean) {
  file.style.display = isVisible ? "" : "none";
  file.setAttribute("data-mattfilter-visible", isVisible + "");
}

function getFileElements() {
  return [
    ...document.querySelectorAll("[data-tree-entry-type='file']"),
  ] as HTMLElement[];
}

function getUser() {
  return document
    .querySelector("meta[name='octolytics-actor-login']")
    .getAttribute("content")
    .trim();
}
