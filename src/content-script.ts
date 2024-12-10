import * as FileFilters from "./file-filters";
import * as FileTree from "./file-tree";
import * as FileContent from "./file-content";

function updateFilterForm(onClick: () => void) {
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

async function init() {
  let ownerFilters: string[] = [];

  const onFilterClick = () => {
    ownerFilters = FileFilters.getSelectedOwners();
    filter(ownerFilters);
  };

  updateFilterForm(onFilterClick);
}

init();
