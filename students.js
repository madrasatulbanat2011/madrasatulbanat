import { db } from "./firebase.js";

import {
  collection,
  getDocs
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
          <button onclick="alert('এই ফিচার পরের ধাপে যোগ করব')">
            View
          </button>
        </td>
      </tr>
    `;

  });

}

loadStudents();
