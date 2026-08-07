import { db } from "./firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
    // ১. URL প্যারামিটার থেকে ছাত্রীর ID বের করা
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("id");

    if (!studentId) {
        alert("❌ কোনো ছাত্রীর ID পাওয়া যায়নি!");
        return;
    }

    try {
        // ২. ফায়ারবেস admissions কালেকশন থেকে ডাটা আনায়ন
        const docRef = doc(db, "admissions", studentId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // ৩. HTML Element-এ তথ্য বসানো
            document.getElementById("studentName").innerText = data.studentName || "N/A";
            document.getElementById("class").innerText = data.className || "N/A";
            document.getElementById("dob").innerText = data.dob || "N/A";
            document.getElementById("religion").innerText = data.religion || "ইসলাম";
            document.getElementById("fatherName").innerText = data.fatherName || "N/A";
            document.getElementById("motherName").innerText = data.motherName || "N/A";
            document.getElementById("mobile").innerText = data.mobileNumber || "N/A";
            document.getElementById("whatsapp").innerText = data.whatsappNumber || data.mobileNumber || "N/A";
            document.getElementById("village").innerText = data.village || "N/A";
            document.getElementById("district").innerText = data.district || "N/A";

            // ছবির URL থাকলে তা সেট করা
            if (data.photoUrl) {
                document.getElementById("studentPhoto").src = data.photoUrl;
            }
        } else {
            alert("❌ উক্ত ID-র কোনো তথ্য খুঁজে পাওয়া যায়নি!");
        }
    } catch (error) {
        console.error("Error fetching student profile:", error);
        alert("❌ ডাটা লোড করতে সমস্যা হয়েছে!");
    }
});
