// marksheet.js - Barbakpur Madrasatul Banat

document.addEventListener("DOMContentLoaded", () => {
    // URL Search Parameters থেকে ডাটা পড়া
    const urlParams = new URLSearchParams(window.location.search);
    
    // অথবা LocalStorage থেকে ডাটা নেওয়া (যদি থাকে)
    const storedData = JSON.parse(localStorage.getItem("currentStudentResult")) || {};

    // ছাত্রীর তথ্যাবলী বসানো
    setElementText("studentName", urlParams.get("name") || storedData.studentName || "N/A");
    setElementText("studentId", urlParams.get("id") || storedData.studentId || "N/A");
    setElementText("fatherName", urlParams.get("father") || storedData.fatherName || "N/A");
    setElementText("motherName", urlParams.get("mother") || storedData.motherName || "N/A");
    setElementText("class", urlParams.get("class") || storedData.className || "N/A");
    setElementText("exam", urlParams.get("exam") || storedData.examName || "Annual Exam 2026");

    // বিষয়ভিত্তিক নম্বরসমূহ (০ থেকে ১০০ এর মধ্যে)
    const marks = {
        bangla: parseFloat(urlParams.get("bangla") || storedData.bangla || 0),
        english: parseFloat(urlParams.get("english") || storedData.english || 0),
        math: parseFloat(urlParams.get("math") || storedData.math || 0),
        science: parseFloat(urlParams.get("science") || storedData.science || 0),
        history: parseFloat(urlParams.get("history") || storedData.history || 0),
        geography: parseFloat(urlParams.get("geography") || storedData.geography || 0)
    };

    // নম্বরগুলো HTML-এ দেখানো
    setElementText("bangla", marks.bangla);
    setElementText("english", marks.english);
    setElementText("math", marks.math);
    setElementText("science", marks.science);
    setElementText("history", marks.history);
    setElementText("geography", marks.geography);

    // অটো-ক্যালকুলেশন
    calculateResult(marks);
});

// নির্দিষ্ট Element ID-তে টেক্সট বসানোর হেল্পার ফাংশন
function setElementText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.innerText = value;
    }
}

// ফলাফল হিসাব করার ফাংশন
function calculateResult(marks) {
    const subjectList = Object.values(marks);
    const totalSubjects = subjectList.length;
    
    // মোট নম্বর
    const totalMarks = subjectList.reduce((acc, curr) => acc + curr, 0);
    const maxTotal = totalSubjects * 100;
    
    // শতাংশ (%)
    const percentage = ((totalMarks / maxTotal) * 100).toFixed(2);
    
    // গ্রেড নির্ধারণ লজিক
    let grade = "F";
    let isFail = subjectList.some(score => score < 34); // যেকোনো বিষেয়ে ৩৪-এর কম পেলে ফেল

    if (isFail) {
        grade = "F (Fail)";
    } else if (percentage >= 80) {
        grade = "A+ (Outstanding)";
    } else if (percentage >= 70) {
        grade = "A (Very Good)";
    } else if (percentage >= 60) {
        grade = "A- (Good)";
    } else if (percentage >= 50) {
        grade = "B (Satisfactory)";
    } else if (percentage >= 40) {
        grade = "C (Pass)";
    } else {
        grade = "F (Fail)";
    }

    // ফলাফলের ফলাফল HTML-এ প্রদর্শন
    setElementText("total", `${totalMarks} / ${maxTotal}`);
    setElementText("percentage", `${percentage}%`);
    
    const gradeEl = document.getElementById("grade");
    if (gradeEl) {
        gradeEl.innerText = grade;
        // ফেল করলে লাল কালার এবং পাস করলে সবুজ কালার
        gradeEl.style.color = isFail ? "#c5221f" : "#0B6E4F";
    }
}
