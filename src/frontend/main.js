eventListeners();

function eventListeners() {
  const submitApiFile = document.getElementById("submitApiFile");
  const submintForwardEmail = document.getElementById("sumbmitForwardEmail");

  submitApiFile.addEventListener("click", async function (event) {
    await handleApiFile();
  });

  submintForwardEmail.addEventListener("click", async () => {
    await createFrowardEmail();
  });

}

async function handleApiFile() {
  const apiFileInput = document.getElementById("apiFile");
  let file;

  changeMessage("uploadState", "Uploading...", "white");
  file = apiFileInput.files[0];

  if ((await validInputFileCheck(file)) === false) {
    changeMessage("uploadState", "Error: Invalid File", "bad");
    return;
  }

  saveFileContentInLocalStorage(file);
  changeMessage("uploadState", "Success. Fetching email accounts", "good");
  const emails = await fetchExistingMails();
  changeEmailField(emails);
}

function changeMessage(elementId, message, messageType) {
  const uploadState = document.getElementById(elementId);

  if (message.size > 115)
    message = message.substring(0, 115);

  if (messageType === "bad") uploadState.style.color = "#ffb3ba";
  else if (messageType === "good") uploadState.style.color = "#b7e4ba";
  else uploadState.style.color = "white";
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
    if (!file || file.size === 0) return false;
    else if (file.type !== "application/json") return false;
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

  if (localString.includes(" ") === true) {
    console.log("local_string includes spaces: {", localString, "}");
    return;
  }

  await callApiToCreateForwardMail(selectedEmail, localString);
}

async function callApiToCreateForwardMail(selectedEmail, localString) {
  let response;
  let url;

  localString = localString + "-levi";

  if (localString === "-levi") {
    changeMessage("creationState", "Error: forward field is empty", "bad");
    return;
  }

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
    const message = "State: Sucess created forwardmail [" + localString + "@family-gaebler.com] forwarting to account: [" + selectedEmail + "].";
    changeMessage("creationState", message, "good");
    const textResponse = await response.text();
  } catch (error) {
    changeMessage("creationState", "Error create forward mail", "good");
    console.error("Error calling API create forward mail: ", error);
  }
}

function getInputValue(id) {
  const select = document.getElementById(id);

  const selectedValue = select.value;
  return selectedValue;

}
