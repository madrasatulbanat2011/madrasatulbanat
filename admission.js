import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("admissionForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.innerText = "সাবমিট হচ্ছে...";
    submitBtn.disabled = true;

    const formData = {
        studentName: document.getElementById("studentName").value.trim(),
        dob: document.getElementById("dob").value,
        className: document.getElementById("className").value,
        religion: document.getElementById("religion").value.trim(),
        fatherName: document.getElementById("fatherName").value.trim(),
        motherName: document.getElementById("motherName").value.trim(),
        mobileNumber: document.getElementById("mobileNumber").value.trim(),
        whatsappNumber: document.getElementById("whatsappNumber").value.trim(),
        village: document.getElementById("village").value.trim(),
        postOffice: document.getElementById("postOffice").value.trim(),
        policeStation: document.getElementById("policeStation").value.trim(),
        district: document.getElementById("district").value.trim(),
        pinCode: document.getElementById("pinCode").value.trim(),
        previousSchool: document.getElementById("previousSchool").value.trim(),
        remarks: document.getElementById("remarks").value.trim(),
        appliedAt: new Date()
    };

    try {
        await addDoc(collection(db, "admissions"), formData);
        alert("✅ ভর্তি ফর্ম সফলভাবে সাবমিট করা হয়েছে!");
        document.getElementById("admissionForm").reset();
    } catch (error) {
        console.error("Error submitting form: ", error);
        alert("❌ সাবমিট করতে সমস্যা হয়েছে: " + error.message);
    } finally {
        submitBtn.innerText = "Submit Admission Form";
        submitBtn.disabled = false;
    }
});
