// do some ajax, get whitelist array of all allowed tags, then set it onto the State
// set "showDropdown" to some value, which will filter the dropdown by that value
export const serverDelay = func => duration =>
  new Promise((resolve, reject) =>
    setTimeout(() => {
      resolve(func());
    }, duration || 1000)
  );

export const getWhitelistFromServer = serverDelay(() => [
  "Design",
  "Development",
  "Process",
  "Dropbox",
  "Ecom",
  "Javascript",
  "Testing",
  "Ux"
]);

export const getValue = serverDelay(() => [""]);
