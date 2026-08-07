import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let allStudents = [];

document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.getElementById("studentTable");
    const searchBox = document.getElementById("searchBox");

    try {
        // ১. ফায়ারবেস থেকে সকল ছাত্রীর ডাটা আনায়ন
        const q = query(collection(db, "admissions"), orderBy("studentName", "asc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">কোনো ছাত্রীর তথ্য পাওয়া যায়নি।</td></tr>`;
            return;
        }

        // ডাটা সংরক্ষণ
        allStudents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // ২. টেবিল রেন্ডার করা
        renderTable(allStudents);

        // ৩. লাইভ সার্চ ফিল্টারিং
        searchBox.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase().trim();

            const filteredStudents = allStudents.filter(student => {
                const name = (student.studentName || "").toLowerCase();
                const className = (student.className || "").toLowerCase();
                const mobile = (student.mobileNumber || "").toLowerCase();
                const village = (student.village || "").toLowerCase();

                return name.includes(searchTerm) || 
                       className.includes(searchTerm) || 
                       mobile.includes(searchTerm) || 
                       village.includes(searchTerm);
            });

            renderTable(filteredStudents);
        });

    } catch (error) {
        console.error("Error fetching students list: ", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: red;">ডাটা পেতে সমস্যা হয়েছে! আবার চেষ্টা করুন।</td></tr>`;
    }
});

// টেবিল ডাটা প্রিন্ট ফাংশন
function renderTable(students) {
    const tableBody = document.getElementById("studentTable");

    if (students.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">কোনো মিল পাওয়া যায়নি।</td></tr>`;
        return;
    }

    let html = "";
    students.forEach(student => {
        html += `
            <tr>
                <td><strong>${student.studentName || 'N/A'}</strong></td>
                <td>${student.className || 'N/A'}</td>
                <td><a href="tel:${student.mobileNumber}" style="color:#006b3c; text-decoration:none;">${student.mobileNumber || 'N/A'}</a></td>
                <td>${student.village || 'N/A'}</td>
                <td>
                    <a href="student-profile.html?id=${student.id}" target="_blank" class="btn-view">
                        View Profile
                    </a>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = html;
}
