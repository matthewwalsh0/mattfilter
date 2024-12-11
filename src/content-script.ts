import * as FileFilters from "./file-filters";
import * as FileTree from "./file-tree";
import * as FileContent from "./file-content";

function updateFilterForm(onClick: () => void) {
  if (FileFilters.isUpdated()) {
    return;
  }

  const filesByOwner = FileTree.getFilesByOwner();

  FileFilters.addDivider();
  FileFilters.addHeader("Filter by ownership");

  const owners = Object.keys(filesByOwner).sort();

  for (const owner of owners) {
    const count = filesByOwner[owner].length;
    const text = `${owner} (${count})`;

    FileFilters.addOption(text, owner, onClick);
  }
}

function filter(ownerFilters: string[]) {
  const hiddenPaths = FileTree.filterFilesByOwner(ownerFilters);

  FileTree.hideEmptyDirectories();
  FileContent.hideFiles(hiddenPaths);
}

function isReady() {
  const path = window.location.pathname;

  return (
    path?.includes("/pull/") && path?.includes("/files") && FileTree.isLoaded()
  );
}

async function init() {
  try {
    if (!isReady()) {
      setTimeout(init, 1000);
      return;
    }

    let ownerFilters: string[] = [];

    const onFilterClick = () => {
      ownerFilters = FileFilters.getSelectedOwners();
      filter(ownerFilters);
    };

    setInterval(() => {
      updateFilterForm(onFilterClick);
    }, 1000);

  } catch (e) {
    console.error("MattFilter - Error", e);
  }
}

init();
