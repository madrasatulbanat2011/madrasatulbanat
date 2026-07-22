import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const table = document.getElementById("attendanceTable");

async function loadStudents() {

    table.innerHTML = "";

    const querySnapshot = await getDocs(collection(db,"students"));

    querySnapshot.forEach((doc)=>{

        const s = doc.data();

        table.innerHTML += `
        <tr>
            <td>${s.studentName}</td>
            <td>${s.class}</td>

            <td>
                <input type="radio"
                name="${doc.id}"
                value="Present"
                checked>
            </td>

            <td>
                <input type="radio"
                name="${doc.id}"
                value="Absent">
            </td>

        </tr>
        `;

    });

}
import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("saveAttendance").addEventListener("click", saveAttendance);

async function saveAttendance() {

    const querySnapshot = await getDocs(collection(db, "students"));

    const today = new Date().toISOString().split("T")[0];

    for (const docSnap of querySnapshot.docs) {

        const status = document.querySelector(
            `input[name="${docSnap.id}"]:checked`
        ).value;

        const s = docSnap.data();

        await addDoc(collection(db, "attendance"), {
            studentId: docSnap.id,
            studentName: s.studentName,
            class: s.class,
            status: status,
            date: today
        });

    }

    alert("Attendance Saved Successfully!");

}

loadStudents();
