import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const form = document.getElementById("admissionForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const formData = new FormData(form);

  const student = {
    studentName: formData.get("studentName"),
    dob: formData.get("dob"),
    class: formData.get("class"),
    religion: formData.get("religion"),
    fatherName: formData.get("fatherName"),
    motherName: formData.get("motherName"),
    mobile: formData.get("mobile"),
    whatsapp: formData.get("whatsapp"),
    village: formData.get("village"),
    postOffice: formData.get("postOffice"),
    policeStation: formData.get("policeStation"),
    district: formData.get("district"),
    pinCode: formData.get("pinCode"),
    previousSchool: formData.get("previousSchool"),
    remarks: formData.get("remarks")
  };  
  try {

    await addDoc(collection(db, "students"), student);

    alert("Admission Successful!");

    form.reset();

  } catch (error) {

    console.error(error);

    alert("Data Save Failed!");

  }

});
