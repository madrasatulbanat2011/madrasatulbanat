import { db } from "./firebase.js";
import { collection, getDocs, query, where, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let loadedStudents = [];

document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("attendanceDate");
    const classSelect = document.getElementById("classSelect");
    const markAllBtn = document.getElementById("markAllPresent");
    const saveBtn = document.getElementById("saveAttendance");
    const bioBtn = document.getElementById("biometricBtn");

    // আজকের তারিখ ডিফল্টভাবে সেট করা
    dateInput.value = new Date().toISOString().split("T")[0];

    // শ্রেণী পরিবর্তন হলে ছাত্রীদের তালিকা লোড করা
    classSelect.addEventListener("change", fetchStudentsByClass);

    // সবাইকে এক ক্লিকে Present করা
    markAllBtn.addEventListener("click", () => {
        const presentRadios = document.querySelectorAll('.radio-present');
        presentRadios.forEach(radio => radio.checked = true);
    });

    // উপস্থিতি সেভ করা
    saveBtn.addEventListener("click", saveAttendanceData);

    // বায়োমেট্রিক স্ক্যানার ফিউচার হুক (Biometric Scanner Feature)
    bioBtn.addEventListener("click", initBiometricScan);
});

// ফায়ারবেস থেকে শ্রেণী অনুযায়ী ছাত্রী লোড করা
async function fetchStudentsByClass() {
    const className = document.getElementById("classSelect").value;
    const tableBody = document.getElementById("attendanceTable");
    const countLabel = document.getElementById("studentCount");

    if (!className) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">শ্রেণী নির্বাচন করুন...</td></tr>`;
        countLabel.innerText = "মোট ছাত্রী: ০";
        return;
    }

    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">ডাটা লোড হচ্ছে...</td></tr>`;

    try {
        const q = query(collection(db, "admissions"), where("className", "==", className));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">এই শ্রেণীতে কোনো ছাত্রী নিবন্ধিত নেই।</td></tr>`;
            countLabel.innerText = "মোট ছাত্রী: ০";
            return;
        }

        loadedStudents = [];
        let html = "";
        let sl = 1;

        querySnapshot.forEach((docSnap) => {
            const student = { id: docSnap.id, ...docSnap.data() };
            loadedStudents.push(student);

            html += `
                <tr>
                    <td>${sl++}</td>
                    <td><strong>${student.studentName || 'N/A'}</strong></td>
                    <td>${student.className || 'N/A'}</td>
                    <td>
                        <input type="radio" name="status_${student.id}" value="Present" class="status-radio radio-present" checked>
                    </td>
                    <td>
                        <input type="radio" name="status_${student.id}" value="Absent" class="status-radio absent">
                    </td>
                </tr>
            `;
        });

        tableBody.innerHTML = html;
        countLabel.innerText = `মোট ছাত্রী: ${loadedStudents.length}`;

    } catch (error) {
        console.error("Error fetching students: ", error);
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: red;">ডাটা পেতে সমস্যা হয়েছে!</td></tr>`;
    }
}

// ফায়ারবেসে হাজিরা সংরক্ষণ করা
async function saveAttendanceData() {
    const selectedDate = document.getElementById("attendanceDate").value;
    const selectedClass = document.getElementById("classSelect").value;

    if (!selectedClass) return alert("অনুগ্রহ করে শ্রেণী নির্বাচন করুন!");
    if (!selectedDate) return alert("অনুগ্রহ করে তারিখ নির্বাচন করুন!");
    if (loadedStudents.length === 0) return alert("সংরক্ষণ করার মতো কোনো ছাত্রী পাওয়া যায়নি!");

    const saveBtn = document.getElementById("saveAttendance");
    saveBtn.innerText = "সংরক্ষণ হচ্ছে...";
    saveBtn.disabled = true;

    try {
        // প্রতিটি ছাত্রীর উপস্থিতির স্টেট কালেক্ট করা
        const attendanceRecords = loadedStudents.map(student => {
            const statusRadio = document.querySelector(`input[name="status_${student.id}"]:checked`);
            return {
                studentId: student.id,
                studentName: student.studentName,
                className: student.className,
                status: statusRadio ? statusRadio.value : "Absent"
            };
        });

        // Document ID উদাহরণ: 2026-08-06_Class 1
        const docId = `${selectedDate}_${selectedClass.replace(/\s+/g, '_')}`;

        await setDoc(doc(db, "attendance", docId), {
            date: selectedDate,
            className: selectedClass,
            records: attendanceRecords,
            updatedAt: new Date()
        });

        alert(`✅ ${selectedClass}-এর ${selectedDate} তারিখের উপস্থিতি সফলভাবে সংরক্ষিত হয়েছে!`);

    } catch (error) {
        console.error("Error saving attendance: ", error);
        alert("❌ উপস্থিতি সংরক্ষণ করতে সমস্যা হয়েছে: " + error.message);
    } finally {
        saveBtn.innerText = "Save Attendance";
        saveBtn.disabled = false;
    }
}

// 🔮 পরবর্তীতে বায়োমেট্রিক ডিভাইস (WebUSB / Fingerprint API / RFID) যোগ করার জায়গা
async function initBiometricScan() {
    alert("ℹ️ বায়োমেট্রিক স্ক্যানার কানেক্ট করার জন্য প্রসেস শুরু করা হচ্ছে...\n(পরবর্তীতে WebUSB বা Fingerprint SDK এখানে যুক্ত করা হবে)");
    
    /* 
       বায়োমেট্রিক যোগ করার লজিক ধারণার নমুনা:
       1. WebSerial বা WebUSB ডায়ালগ খোলা
       2. ডিভাইসের ফিঙ্গারপ্রিন্ট হ্যাশ পড়া
       3. ছাত্রীর Student ID মেলানো
       4. স্বয়ংক্রিয়ভাবে রেডিও বাটন 'Present' চেক করে দেওয়া
    */
}
