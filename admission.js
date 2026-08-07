import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Helper function to convert File to Base64 String
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const admissionForm = document.getElementById('admissionForm');

if (admissionForm) {
  admissionForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = admissionForm.querySelector('.btn-submit');
    submitBtn.innerText = 'জমা হচ্ছে... অপেক্ষা করুন';
    submitBtn.disabled = true;

    try {
      // Get Files
      const studentPhoto = document.getElementById('studentPhoto')?.files[0];
      const tcCertificate = document.getElementById('tcCertificate')?.files[0];
      const birthCertificate = document.getElementById('birthCertificate')?.files[0];
      const schoolCertificate = document.getElementById('schoolCertificate')?.files[0];
      const otherDocs = document.getElementById('otherDocs')?.files[0];

      // Convert files to Base64 strings
      const photoBase64 = await fileToBase64(studentPhoto);
      const tcBase64 = await fileToBase64(tcCertificate);
      const birthBase64 = await fileToBase64(birthCertificate);
      const schoolBase64 = await fileToBase64(schoolCertificate);
      const otherBase64 = await fileToBase64(otherDocs);

      // Collect Form Data
      const formData = {
        studentName: document.getElementById('studentName').value,
        fatherName: document.getElementById('fatherName').value,
        motherName: document.getElementById('motherName').value || '',
        mobileNumber: document.getElementById('mobileNumber').value,
        dob: document.getElementById('dob').value,
        department: document.getElementById('department').value,
        className: document.getElementById('className').value,
        prevSchool: document.getElementById('prevSchool').value || '',
        prevClass: document.getElementById('prevClass').value || '',
        residence: document.getElementById('residence').value,
        address: document.getElementById('address').value,
        documents: {
          photo: photoBase64,
          tc: tcBase64,
          birth: birthBase64,
          school: schoolBase64,
          other: otherBase64
        },
        appliedAt: new Date().toISOString()
      };

      // Save to Firestore
      await addDoc(collection(db, "admissions"), formData);

      alert('অভিনন্দন! আপনার আবেদন সফলভাবে জমা হয়েছে।');
      admissionForm.reset();

    } catch (error) {
      console.error("Error submitting form: ", error);
      alert('আবেদন জমা দিতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      submitBtn.innerText = 'আবেদন জমা দিন';
      submitBtn.disabled = false;
    }
  });
}
