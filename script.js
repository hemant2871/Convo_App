const fileInput = document.getElementById("fileInput");
const fileLabel = document.getElementById("fileLabel");
const convertBtn = document.getElementById("convertBtn");
const message = document.getElementById("message");

let selectedFile = null;

fileInput.addEventListener("change", function () {
  selectedFile = fileInput.files[0];
  fileLabel.textContent = selectedFile ? selectedFile.name : "Choose File";
  convertBtn.disabled = !selectedFile;
});



convertBtn.addEventListener("click", async () => {
  if (!selectedFile) {
    message.textContent = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);

  message.textContent = "Converting...";

  try {
    const response = await fetch("http://localhost:4000/convertFile", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Conversion failed.");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();

    message.textContent = "File Converted Successfully ✅";
    selectedFile = null;
    fileInput.value = "";
    fileLabel.textContent = "Choose File";
    convertBtn.disabled = true;
  } catch (error) {
    console.error(error);
    message.textContent = "❌ " + error.message;
  }
});
