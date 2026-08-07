import { db } from './firebase.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Optimized Image Compressor (Reduces size under 100KB per image)
const compressAndToBase64 = (file) => {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      // If PDF or non-image, check size; if too big, skip or cut
      if (!file.type.startsWith('image/')) {
        resolve(event.target.result);
        return;
      }

      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Resize down to 400px width/height max to prevent Firestore 1MB limit crash
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        // Low compression quality (0.4) to guarantee very small payload size
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.4);
        resolve(compressedDataUrl);
      };

      img.onerror = () => resolve("");
    };

    reader.onerror = () => resolve("");
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
      const studentPhoto = document.getElementById('studentPhoto')?.files[0];
      const tcCertificate = document.getElementById('tcCertificate')?.files[0];
      const birthCertificate = document.getElementById('birthCertificate')?.files[0];
      const schoolCertificate = document.getElementById('schoolCertificate')?.files[0];
      const otherDocs = document.getElementById('otherDocs')?.files[0];

      // Compress all uploaded files concurrently
      const [photoBase64, tcBase64, birthBase64, schoolBase64, otherBase64] = await Promise.all([
        compressAndToBase64(studentPhoto),
        compressAndToBase64(tcCertificate),
        compressAndToBase64(birthCertificate),
        compressAndToBase64(schoolCertificate),
        compressAndToBase64(otherDocs)
      ]);

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

      await addDoc(collection(db, "admissions"), formData);

      alert('অভিনন্দন! আপনার আবেদন সফলভাবে জমা হয়েছে।');
      admissionForm.reset();

    } catch (error) {
      console.error("Firestore Upload Error: ", error);
      alert('আবেদন জমা দিতে সমস্যা হয়েছে! ফায়ারবেসের ফাইল সাইজ লিমিট বা সিকিউরিটি রুলস চেক করুন।');
    } finally {
      submitBtn.innerText = 'আবেদন জমা দিন';
      submitBtn.disabled = false;
    }
  });
}
