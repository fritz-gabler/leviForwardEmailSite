eventListeners();

function eventListeners() {
  const submitApiFile = document.getElementById("submitApiFile");

  submitApiFile.addEventListener("click", async ()=> { await handleApiFile()});
}

async function handleApiFile() {
  const apiFileInput = document.getElementById("apiFile");

  const file = apiFileInput.files[0];
  if (await validInputFileCheck(file) === true) {
    saveFileContentInLocalStorage(file);
  }
  else
    console.log("wrong File Format");
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

  const test = localStorage.getItem("kas_auth_data");
  const test2 = localStorage.getItem("kas_login");
  console.log(test);
  console.log(test2);
}

function createSoapBodyGetAccounts(
  kasLogin,
  kasAuthData,
  kasAuthType = "plain",
) {
  return `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
  <soapenv:Header/>
  <soapenv:Body>
    <get_mailaccounts>
      <kas_login>${kasLogin}</kas_login>
      <kas_auth_data>${kasAuthData}</kas_auth_data>
      <kas_auth_type>${kasAuthType}</kas_auth_type>
    </get_mailaccounts>
  </soapenv:Body>
</soapenv:Envelope>
  `;
}
