import { db } from "./firebase.js";

import {
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("saveResult").addEventListener("click", saveResult);

async function saveResult() {

  const studentId = document.getElementById("studentId").value;
  const exam = document.getElementById("exam").value;

  const bangla = Number(document.getElementById("bangla").value);
  const english = Number(document.getElementById("english").value);
  const math = Number(document.getElementById("math").value);
  const science = Number(document.getElementById("science").value);
  const history = Number(document.getElementById("history").value);
  const geography = Number(document.getElementById("geography").value);

  const total =
    bangla +
    english +
    math +
    science +
    history +
    geography;

  const percentage = (total / 600) * 100;

  await addDoc(collection(db, "results"), {
    studentId,
    exam,
    bangla,
    english,
    math,
    science,
    history,
    geography,
    total,
    percentage
  });

  alert("Result Saved Successfully!");

  document.querySelectorAll("input").forEach(input => input.value = "");
}
