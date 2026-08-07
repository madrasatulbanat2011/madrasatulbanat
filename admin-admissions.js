import { db } from "./firebase.js";
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 🔑 অ্যাডমিন পাসওয়ার্ড (প্রয়োজনে এখান থেকে পরিবর্তন করুন)
const ADMIN_PASSWORD = "bmb@admin2026";

const loginOverlay = document.getElementById("loginOverlay");
const adminContent = document.getElementById("adminContent");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("adminPassword");
const logoutBtn = document.getElementById("logoutBtn");

// পূর্বের সেশন চেক করা (ব্রাউজার খোলা থাকলে বারবার পাসওয়ার্ড লাগবে না)
document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
        grantAccess();
    }
});

// লগইন সাবমিট হ্যান্ডলার
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem("isAdminLoggedIn", "true");
        grantAccess();
    } else {
        alert("❌ ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন।");
        passwordInput.value = "";
    }
});

// এক্সেস প্রদান ও ডাটা লোড
function grantAccess() {
    loginOverlay.style.display = "none";
    adminContent.style.display = "block";
    loadAdmissions();
}

// লগআউট হ্যান্ডলার
logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    location.reload();
});

// ফায়ারবেস থেকে ডাটা পাওয়ার ফাংশন
async function loadAdmissions() {
    const listContainer = document.getElementById("applicantList");
    listContainer.innerHTML = `<tr><td colspan="6" style="text-align: center;">ডাটা লোড হচ্ছে...</td></tr>`;

    try {
        const q = query(collection(db, "admissions"), orderBy("appliedAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            listContainer.innerHTML = `<tr><td colspan="6" style="text-align: center;">কোনো আবেদন জমা পড়েনি।</td></tr>`;
            return;
        }

        let html = "";
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dateStr = data.appliedAt ? new Date(data.appliedAt.seconds * 1000).toLocaleDateString("bn-IN") : "N/A";

            html += `
                <tr>
                    <td><strong>${data.studentName}</strong></td>
                    <td>${data.className}</td>
                    <td>${data.fatherName}</td>
                    <td><a href="tel:${data.mobileNumber}">${data.mobileNumber}</a></td>
                    <td>${data.village}, ${data.district}</td>
                    <td>${dateStr}</td>
                </tr>
            `;
        });

        listContainer.innerHTML = html;
    } catch (error) {
        console.error("Error loading admissions: ", error);
        listContainer.innerHTML = `<tr><td colspan="6" style="text-align: center; color: red;">ডাটা পেতে সমস্যা হয়েছে!</td></tr>`;
    }
}

document.getElementById("refreshBtn").addEventListener("click", loadAdmissions);
