eventListeners();

function eventListeners() {
  const submitApiFile = document.getElementById("submitApiFile");
  const submintForwardEmail = document.getElementById("sumbmitForwardEmail");

  submitApiFile.addEventListener("click", async function(event) {
    await handleApiFile();
  });

  submintForwardEmail.addEventListener("click", async () => {
    await createFrowardEmail();
  });

  document
    .getElementById("redirect-form")
    .addEventListener("submit", function(event) {
      event.preventDefault();
    });
}

async function handleApiFile() {
  const apiFileInput = document.getElementById("apiFile");
  let file;

  changeUploadState("Uploading...");
  file = apiFileInput.files[0];

  if ((await validInputFileCheck(file)) === false)
    changeUploadState("Wrong File Format");

  saveFileContentInLocalStorage(file);
  changeUploadState("Success. Fetching email accounts");
  const emails = await fetchExistingMails();
  changeEmailField(emails);
}

function changeUploadState(message) {
  const uploadState = document.getElementById("uploadState");
  uploadState.textContent = message;
}

function changeEmailField(emails) {
  const select = document.getElementById("email-list");
  if (!select) {
    console.error('Select element with ID "email-list" not found');
    return;
  }
  select.innerHTML = "";

  if (Array.isArray(emails)) {
    emails.forEach((email) => {
      const option = document.createElement("option");
      option.value = email;
      option.textContent = email;
      select.appendChild(option);
    });
  } else {
    console.error("emails argument is not an array");
  }
}

async function validInputFileCheck(file) {
  try {
    if (file.type !== "application/json") return false;
    const fileContent = await getFileContent(file);
    if (fileContent.includes("kas_login") === false) return false;
    else if (fileContent.includes("kas_auth_data") === false) return false;

    return true;
  } catch (error) {
    console.error(error);
  }
}

function getFileContent(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.addEventListener("load", () => {
      resolve(fileReader.result);
    });
  });
}

async function saveFileContentInLocalStorage(file) {
  const fileContent = JSON.parse(await getFileContent(file));
  localStorage.setItem("kas_login", fileContent.kas_login);
  localStorage.setItem("kas_auth_data", fileContent.kas_auth_data);
}

async function fetchExistingMails() {
  let allMails;
  let allFilteredMails;

  await setLoginData();
  allMails = await getMailAccounts();
  allFilteredMails = filterMailAccounts(allMails, /\b\S*-levi@\S*\b/g);
  return allFilteredMails;
}

async function setLoginData() {
  const kasLogin = localStorage.getItem("kas_login");
  const kasAuthData = localStorage.getItem("kas_auth_data");

  try {
    const response = await fetch("http://localhost:3000/login-data/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kas_login: kasLogin,
        kas_auth: kasAuthData,
        kas_auth_type: "plain",
      }),
    });
  } catch (error) {
    console.error("Error setting login Data:", error);
  }
}

async function getMailAccounts() {
  let response;
  let textResponse;
  let allMails;

  try {
    response = await fetch("http://localhost:3000/mail-accounts/get", {
      method: "GET",
    });
    textResponse = await response.text();
  } catch (error) {
    console.error("Error geting mail: ", error);
  }
  return textResponse;
}

function filterMailAccounts(unfilteredGetMailOutput, filter) {
  let allMails;

  allMails = unfilteredGetMailOutput.match(filter);
  return allMails;
}

async function createFrowardEmail() {
  const selectedEmail = getInputValue("email-list");
  const localString = getInputValue("email-username");

  callApiToCreateForwardMail(selectedEmail, localString);
}

async function callApiToCreateForwardMail(selectedEmail, localString) {
  let response;
  let url;

  try {
    url = "http://localhost:3000/mail-forward/create";
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        selectedEmail: selectedEmail,
        localString: localString,
      }),
    });
    const textResponse = await response.text();
  } catch (error) {
    console.error("Error calling API create forward mail: ", error);
  }
}

function getInputValue(id) {
  const select = document.getElementById(id);

  const selectedValue = select.value;
  return selectedValue;
}
