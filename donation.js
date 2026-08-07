import { db } from "./firebase.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Quick Amount সিলেক্ট করার ফাংশন Global উইন্ডোতে দেওয়া
window.setAmount = function(val) {
    document.getElementById("amount").value = val;
};

document.addEventListener("DOMContentLoaded", () => {
    const donationForm = document.getElementById("donationForm");
    const submitBtn = document.getElementById("submitBtn");

    donationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const donationType = document.getElementById("donationType").value;
        const amount = document.getElementById("amount").value;
        const donorName = document.getElementById("donorName").value;
        const donorMobile = document.getElementById("donorMobile").value;
        const trxId = document.getElementById("trxId").value;
        const address = document.getElementById("address").value;

        submitBtn.innerText = "জমা হচ্ছে...";
        submitBtn.disabled = true;

        try {
            // Firestore-এ 'donations' কালেকশনে সেভ করা
            await addDoc(collection(db, "donations"), {
                donationType: donationType,
                amount: Number(amount),
                donorName: donorName,
                donorMobile: donorMobile,
                trxId: trxId,
                address: address,
                status: "Pending Verification", // অ্যাডমিন ভেরিফাই করবে
                date: new Date().toISOString().split("T")[0],
                createdAt: new Date()
            });

            alert("✅ আপনার অনুদানের তথ্য সফলভাবে জমা নেওয়া হয়েছে! কর্তৃপক্ষ ভেরিফাই করে রসিদ পাঠাবে।");
            donationForm.reset();

        } catch (error) {
            console.error("Error submitting donation: ", error);
            alert("❌ জমা দিতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।");
        } finally {
            submitBtn.innerText = "রসিদের জন্য জমা দিন";
            submitBtn.disabled = false;
        }
    });
});

