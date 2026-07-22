const student = JSON.parse(localStorage.getItem("studentData"));

if (!student) {
    alert("Student data not found");
} else {
    document.getElementById("studentName").textContent = student.studentName || "";
    document.getElementById("class").textContent = student.class || "";
    document.getElementById("dob").textContent = student.dob || "";
    document.getElementById("religion").textContent = student.religion || "";
    document.getElementById("fatherName").textContent = student.fatherName || "";
    document.getElementById("motherName").textContent = student.motherName || "";
    document.getElementById("mobile").textContent = student.mobile || "";
    document.getElementById("whatsapp").textContent = student.whatsapp || "";
    document.getElementById("village").textContent = student.village || "";
    document.getElementById("district").textContent = student.district || "";
}
