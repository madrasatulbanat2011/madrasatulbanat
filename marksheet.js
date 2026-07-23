import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  getDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadMarksheet() {

  const params = new URLSearchParams(window.location.search);
  const studentId = params.get("studentId");

  // Result Data
  const resultSnapshot = await getDocs(collection(db, "results"));

  resultSnapshot.forEach((resultDoc) => {

    const r = resultDoc.data();

    if (r.studentId === studentId) {

      document.getElementById("studentId").textContent = r.studentId;
      document.getElementById("exam").textContent = r.exam;

      document.getElementById("bangla").textContent = r.bangla;
      document.getElementById("english").textContent = r.english;
      document.getElementById("math").textContent = r.math;
      document.getElementById("science").textContent = r.science;
      document.getElementById("history").textContent = r.history;
      document.getElementById("geography").textContent = r.geography;

      document.getElementById("total").textContent = r.total;
      document.getElementById("percentage").textContent =
        r.percentage.toFixed(2) + "%";

      let grade = "F";

      if (r.percentage >= 80) grade = "A+";
      else if (r.percentage >= 70) grade = "A";
      else if (r.percentage >= 60) grade = "B";
      else if (r.percentage >= 50) grade = "C";
      else if (r.percentage >= 40) grade = "D";

      document.getElementById("grade").textContent = grade;

    }

  });

  // Student Data
  const studentDoc = await getDoc(doc(db, "students", studentId));

  if (studentDoc.exists()) {

    const s = studentDoc.data();

    document.getElementById("studentName").textContent = s.studentName;
    document.getElementById("fatherName").textContent = s.fatherName;
    document.getElementById("motherName").textContent = s.motherName;
    document.getElementById("class").textContent = s.class;

  }

}

loadMarksheet();
