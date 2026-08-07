import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("searchForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const studentId = document.getElementById("searchId").value.trim();
    const searchBtn = document.getElementById("searchBtn");
    const displayCard = document.getElementById("resultDisplay");

    searchBtn.innerText = "খোঁজা হচ্ছে...";
    searchBtn.disabled = true;

    try {
        const docRef = doc(db, "results", studentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            document.getElementById("resStudentName").innerText = data.studentName;
            document.getElementById("resExamName").innerText = data.examName;
            document.getElementById("resId").innerText = data.studentId;
            document.getElementById("resClass").innerText = data.className;
            document.getElementById("resFather").innerText = data.fatherName;
            document.getElementById("resMother").innerText = data.motherName || "N/A";

            document.getElementById("resBangla").innerText = data.bangla;
            document.getElementById("resEnglish").innerText = data.english;
            document.getElementById("resMath").innerText = data.math;
            document.getElementById("resScience").innerText = data.science;
            document.getElementById("resHistory").innerText = data.history;
            document.getElementById("resGeography").innerText = data.geography;

            // মোট ও গ্রেড ক্যালকুলেশন
            const total = data.bangla + data.english + data.math + data.science + data.history + data.geography;
            const percentage = (total / 600) * 100;

            let grade = percentage >= 80 ? "A+" : percentage >= 70 ? "A" : percentage >= 60 ? "A-" : percentage >= 50 ? "B" : percentage >= 40 ? "C" : "F";

            document.getElementById("resTotal").innerText = `${total} / 600 (${percentage.toFixed(1)}%)`;
            document.getElementById("resGrade").innerText = grade;

            displayCard.style.display = "block";
        } else {
            alert("❌ এই আইডি নম্বরের কোনো রেজাল্ট পাওয়া যায়নি!");
            displayCard.style.display = "none";
        }
    } catch (error) {
        console.error("Error fetching result:", error);
        alert("অসুবিধা হয়েছে: " + error.message);
    } finally {
        searchBtn.innerText = "Search";
        searchBtn.disabled = false;
    }
});
