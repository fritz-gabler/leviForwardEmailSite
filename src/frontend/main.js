eventListeners();

function eventListeners() {
  const submitApiFile = document.getElementById("submitApiFile");

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


async function validInputFileCheck(file) {
  try {
    if (file.type !== "application/json") return false;
    const fileContent = await getFileContent(file);
    if (fileContent.includes("kas_login") === false) return false;
    else if (fileContent.includes("kas_auth_data") === false) return false;

    return true;
  }
  catch (error) {
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
  setLoginData();
  getMailAccounts();
}

async function setLoginData() {
  const kasLogin = localStorage.getItem("kas_login");
  const kasAuthData = localStorage.getItem("kas_auth_data");

  console.log("set login data was called");
  const response = await fetch('http://localhost:3000/login-data/set', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      kas_login: kasLogin,
      kas_auth: kasAuthData,
      kas_auth_type: "plain"
    })
  });
  const result = await response.text();
  console.log("API STATMENT: ", result);
}

async function getMailAccounts() {
  console.log("Test from get mail frontend")
  const response = await fetch('http://localhost:3000/mail-accounts/get', {
    method: "GET"
  });


  console.log("Response get mail accounts:");
  console.log(response);
}
