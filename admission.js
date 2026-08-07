import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Helper function to compress and convert image to Base64
const compressAndToBase64 = (file) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }

    // If file is PDF, directly convert (small pdfs) or skip heavy processing
    if (file.type === "application/pdf") {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => resolve("");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Max dimension width/height
      const MAX_WIDTH = 600;
      const MAX_HEIGHT = 600;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      // Compress to JPEG with 0.6 quality
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
      resolve(compressedDataUrl);
    };

    img.onerror = () => resolve("");
    reader.readAsDataURL(file);
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

      // Compress files to Base64 strings
      const photoBase64 = await compressAndToBase64(studentPhoto);
      const tcBase64 = await compressAndToBase64(tcCertificate);
      const birthBase64 = await compressAndToBase64(birthCertificate);
      const schoolBase64 = await compressAndToBase64(schoolCertificate);
      const otherBase64 = await compressAndToBase64(otherDocs);

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
      alert('আবেদন জমা দিতে সমস্যা হয়েছে! ফায়ারবেস বা নেটওয়ার্ক চেক করুন।');
    } finally {
      submitBtn.innerText = 'আবেদন জমা দিন';
      submitBtn.disabled = false;
    }
  });
}
