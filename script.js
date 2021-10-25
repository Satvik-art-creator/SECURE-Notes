const select = (selector) => document.querySelector(selector);

const DIV = select(".wholeDiv");
DIV.style.filter = "blur(8px)";

const addBtn = select("#add");

let clckCount = 0;

//updating the local strogae data
(const updateLSData = () => {
  const notes = document.querySelectorAll("textarea");
  
  const ourNotes = [];

  notes.forEach((note) => ourNotes.push(note.value));

  localStorage.setItem("Our Notes", JSON.stringify(ourNotes));
});

const newNote = (text = "") => {
  const note = document.createElement("div");
  note.classList.add("note");

  const htmlData = `
    <div class="formatting">
        <button class="save"><i class="fas fa-check"></i></button>
    </div>

    <div class="operation">
        <button class="edit"><i class="fas fa-edit"></i></button>
        <button class="delete"><i class="fas fa-trash-alt"></i></button>
    </div>

    <div class="main ${text ? "" : "hidden"}"></div>
    <textarea class="${text ? "hidden" : ""}"></textarea>   `;

  note.insertAdjacentHTML("afterbegin", htmlData);

  const selectNote = (selector) => note.querySelector(selector);

  const opers = selectNote(".operation");

  setInterval(() => {
    if(clckCount == 0){
      opers.classList.add("hidden");
    } else{
      opers.classList.remove("hidden");
    }
  }, 1);

  const saveBtn = selectNote(".save");
  const editBtn = selectNote(".edit");
  const deleteBtn = selectNote(".delete");
  const mainDiv = selectNote(".main");
  const textArea = selectNote("textarea");

  //save the note
  saveBtn.addEventListener("click", () => {
    mainDiv.classList.toggle("hidden");
    textArea.classList.toggle("hidden");
  });

  //delete the note
  deleteBtn.addEventListener("click", () => {
    note.remove();
    updateLSData();
  });

  textArea.value = text;
  mainDiv.innerHTML = text;

  //toggle the hidden class for editing the note in a certain condition
  editBtn.addEventListener("click", () => {
    mainDiv.classList.toggle("hidden");
    textArea.classList.toggle("hidden");
  });

  setInterval(function () {
    if (mainDiv.classList.contains("hidden")) {
      editBtn.classList.add("hidden");
      saveBtn.classList.remove("hidden");
    } else {
      saveBtn.classList.add("hidden");
      editBtn.classList.remove("hidden");
    }
  }, 1);

  //if any change in the textarea, display the changed data in the main div & store it on the local storage
  textArea.addEventListener("change", (event) => {
    const value = event.target.value;
    mainDiv.innerHTML = value;

    updateLSData();
  });

  DIV.appendChild(note);
};

//converting the string back to array
const ourEachNote = JSON.parse(localStorage.getItem("Our Notes"));

//creating new div for each note
if (ourEachNote) {
  ourEachNote.forEach((note) => newNote(note));
}

const encrypt = document.createElement("div");
encrypt.classList.add("encryption");

const htmlData = `
<div class="security">
      <h2>${
        ourEachNote.length >= 1 ? "Enter your Password" : "Encrypt your Notes"
      }</h2>

      <div class="inputs">
          <input type="password" id="password" class="${
            ourEachNote.length >= 1 ? "hidden" : ""
          }" placeholder="Password" required autocomplete="off">
          <input type="text" id="cpassword" class="${
            ourEachNote.length >= 1 ? "hidden" : ""
          }"  placeholder="Confirm Password" required autocomplete="off">

          <input type="password" id="yourPass" class="${
            ourEachNote.length >= 1 ? "" : "hidden"
          }" placeholder="Your Password" required autocomplete="off">

          <input type="submit" id="submit" style="display: block;" value="Submit">
      </div>
  </div>  `;

encrypt.insertAdjacentHTML("afterbegin", htmlData);

document.body.appendChild(encrypt);

const selectPass = (selector) => encrypt.querySelector(selector);

const passSetupSystem = () => {
  const pass = selectPass("#password");
  const cpass = selectPass("#cpassword");

  if (pass.value == "") {
    swal({
      title: "Verification",
      text: "Create your Password!",
      icon: "info",
      button: "Ohk!",
    });
  } else if (pass.value != cpass.value) {
    swal({
      title: "Verification",
      text: "Your password doesn't matches!",
      icon: "error",
      button: "Ohk!",
    });
  } else {
    swal({
      title: "Verification",
      text: "Your password successfully created!",
      icon: "success",
      button: "Ok!",
    });

    clckCount++;

    localStorage.setItem("Password", pass.value);

    encrypt.remove();
    DIV.style.filter = "blur(0px)";

    addBtn.addEventListener("click", () => newNote());
  }
};

if (ourEachNote.length >= 1) {
  const urPass = selectPass("#yourPass");

  urPass.value = localStorage.getItem("Password");

  submit.addEventListener("click", () => {
    if(urPass.value == ""){
      swal({
        title: "Verification",
        text: "Enter your Password!",
        icon: "info",
        button: "Ohk!",
      });
    } else if (urPass.value != localStorage.getItem("Password")) {
      swal({
        title: "Verification",
        text: "Wrong Password!",
        icon: "error",
        button: "Ohk!",
      });
    } else {
      clckCount++;

      encrypt.remove();
      DIV.style.filter = "blur(0px)";

      addBtn.addEventListener("click", () => newNote());
    }
  });
} else {
  submit.addEventListener("click", () => passSetupSystem());
}
