import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const table = document.getElementById("resultTable");

async function loadResults() {

    table.innerHTML = "";

    const querySnapshot = await getDocs(collection(db,"results"));

    querySnapshot.forEach((doc)=>{

        const r = doc.data();

        let grade = "F";

        if(r.percentage>=80) grade="A+";
        else if(r.percentage>=70) grade="A";
        else if(r.percentage>=60) grade="B";
        else if(r.percentage>=50) grade="C";
        else if(r.percentage>=40) grade="D";

        table.innerHTML += `

        <tr>

        <td>${r.studentId}</td>

        <td>${r.exam}</td>

        <td>${r.total}</td>

        <td>${r.percentage.toFixed(2)}%</td>

        <td>${grade}</td>

        <td>

        <button onclick="viewMarksheet('${r.studentId}')">

        View

        </button>

        </td>

        </tr>

        `;

    });

}

window.viewMarksheet = function(studentId){

    window.location.href =
    "marksheet.html?studentId="+studentId;

}

loadResults();
