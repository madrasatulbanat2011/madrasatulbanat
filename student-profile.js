import { db } from "./firebase.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const studentId = localStorage.getItem("studentId");
alert(studentId);

async function loadStudent() {

  if (!studentId) {
    alert("Student ID পাওয়া যায়নি");
    return;
  }

  const studentRef = doc(db, "students", studentId);

  const studentSnap = await getDoc(studentRef);

  if (!studentSnap.exists()) {
    alert("Student পাওয়া যায়নি");
    return;
  }

  const s = studentSnap.data();
document.getElementById("studentName").textContent = s.studentName || "";
document.getElementById("class").textContent = s.class || "";
document.getElementById("dob").textContent = s.dob || "";
document.getElementById("religion").textContent = s.religion || "";
document.getElementById("fatherName").textContent = s.fatherName || "";
document.getElementById("motherName").textContent = s.motherName || "";
document.getElementById("mobile").textContent = s.mobile || "";
document.getElementById("whatsapp").textContent = s.whatsapp || "";
document.getElementById("village").textContent = s.village || "";
document.getElementById("district").textContent = s.district || "";

}

loadStudent();
