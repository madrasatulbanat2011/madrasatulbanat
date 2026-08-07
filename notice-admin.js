import { db } from "./firebase.js";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const ADMIN_PASSWORD = "bmb@admin2026"; // আপনার পাসওয়ার্ড

const loginOverlay = document.getElementById("loginOverlay");
const adminContent = document.getElementById("adminContent");
const loginForm = document.getElementById("loginForm");
const passwordInput = document.getElementById("adminPassword");
const logoutBtn = document.getElementById("logoutBtn");

// পাসওয়ার্ড ভ্যালিডেশন
document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("isAdminLoggedIn") === "true") {
        grantAccess();
    }
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
        sessionStorage.setItem("isAdminLoggedIn", "true");
        grantAccess();
    } else {
        alert("❌ ভুল পাসওয়ার্ড!");
        passwordInput.value = "";
    }
});

function grantAccess() {
    loginOverlay.style.display = "none";
    adminContent.style.display = "block";
    loadNotices();
}

logoutBtn.addEventListener("click", () => {
    sessionStorage.removeItem("isAdminLoggedIn");
    location.reload();
});

// নোটিশ সাবমিট করা
document.getElementById("noticeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "প্রকাশ হচ্ছে...";
    submitBtn.disabled = true;

    const noticeData = {
        title: document.getElementById("noticeTitle").value.trim(),
        description: document.getElementById("noticeDescription").value.trim(),
        link: document.getElementById("noticeLink").value.trim(),
        createdAt: new Date()
    };

    try {
        await addDoc(collection(db, "notices"), noticeData);
        alert("✅ নতুন নোটিশ সফলভাবে প্রকাশ করা হয়েছে!");
        document.getElementById("noticeForm").reset();
        loadNotices();
    } catch (error) {
        console.error("Error adding notice: ", error);
        alert("❌ সমস্যা হয়েছে: " + error.message);
    } finally {
        submitBtn.innerText = "প্রকাশ করুন";
        submitBtn.disabled = false;
    }
});

// প্রকাশিত নোটিশ লোড করা
async function loadNotices() {
    const listContainer = document.getElementById("noticeList");
    listContainer.innerHTML = `<tr><td colspan="4" style="text-align: center;">ডাটা লোড হচ্ছে...</td></tr>`;

    try {
        const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            listContainer.innerHTML = `<tr><td colspan="4" style="text-align: center;">কোনো নোটিশ পাওয়া যায়নি।</td></tr>`;
            return;
        }

        let html = "";
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const dateStr = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleDateString("bn-IN") : "N/A";
            const id = docSnap.id;

            html += `
                <tr>
                    <td>${dateStr}</td>
                    <td><strong>${data.title}</strong></td>
                    <td>${data.link ? `<a href="${data.link}" target="_blank">ডাউনলোড PDF</a>` : "N/A"}</td>
                    <td><button onclick="window.deleteNotice('${id}')" style="background: #dc2626; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">ডিলিট</button></td>
                </tr>
            `;
        });

        listContainer.innerHTML = html;
    } catch (error) {
        console.error("Error loading notices: ", error);
        listContainer.innerHTML = `<tr><td colspan="4" style="text-align: center; color: red;">ডাটা পেতে সমস্যা হয়েছে!</td></tr>`;
    }
}

// নোটিশ মুছে ফেলার ফাংশন
window.deleteNotice = async (id) => {
    if (confirm("আপনি কি নিশ্চিত যে এই নোটিশটি মুছে ফেলতে চান?")) {
        try {
            await deleteDoc(doc(db, "notices", id));
            alert("🗑️ নোটিশ মুছে ফেলা হয়েছে!");
            loadNotices();
        } catch (error) {
            alert("ডিলিট করতে সমস্যা হয়েছে: " + error.message);
        }
    }
};
          
