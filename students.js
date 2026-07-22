import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const table = document.getElementById("studentTable");

async function loadStudents() {

  table.innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "students"));

  querySnapshot.forEach((doc) => {

    const s = doc.data();

    table.innerHTML += `
      <tr>
        <td>${s.studentName}</td>
        <td>${s.class}</td>
        <td>${s.mobile}</td>
        <td>${s.village}</td>
        <td>
          <button onclick="viewStudent('${doc.id}')">
    View
</button>
        </td>
      </tr>
    `;

  });

}

loadStudents();

  window.viewStudent = async function(id){

    const ref = doc(db,"students",id);

    const snap = await getDoc(ref);

    if(!snap.exists()){
        alert("Student not found");
        return;
    }

    localStorage.setItem(
        "studentData",
        JSON.stringify(snap.data())
    );

    window.location.href="student-profile.html";

}
