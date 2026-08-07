import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Get Student ID from URL params
const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id');

async function loadStudentProfile() {
  if (!studentId) {
    alert('কোনো ছাত্রীর ID পাওয়া যায়নি!');
    return;
  }

  try {
    const docRef = doc(db, "admissions", studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Basic Information
      document.getElementById('dispName').innerText = data.studentName || 'N/A';
      document.getElementById('dispClass').innerText = data.className || 'N/A';
      document.getElementById('dispDob').innerText = data.dob || 'N/A';
      document.getElementById('dispDept').innerText = data.department || 'N/A';
      document.getElementById('dispFather').innerText = data.fatherName || 'N/A';
      document.getElementById('dispMother').innerText = data.motherName || 'N/A';
      document.getElementById('dispMobile').innerText = data.mobileNumber || 'N/A';
      document.getElementById('dispResidence').innerText = data.residence || 'N/A';
      document.getElementById('dispPrevSchool').innerText = data.prevSchool || 'N/A';
      document.getElementById('dispPrevClass').innerText = data.prevClass || 'N/A';
      document.getElementById('dispAddress').innerText = data.address || 'N/A';

      // Load Profile Photo
      const photoImg = document.getElementById('displayPhoto');
      const noPhotoText = document.getElementById('noPhotoText');

      if (data.documents && data.documents.photo) {
        photoImg.src = data.documents.photo;
        photoImg.style.display = 'block';
        if (noPhotoText) noPhotoText.style.display = 'none';
      }

      // Load Attached Documents
      const docsContainer = document.getElementById('docsContainer');
      docsContainer.innerHTML = ''; // Clear loading text

      const docTitles = {
        birth: 'জন্ম সার্টিফিকেট',
        tc: 'টিসি সার্টিফিকেট',
        school: 'স্কুল সার্টিফিকেট',
        other: 'অন্যান্য ডকুমেন্ট'
      };

      let hasDocs = false;
      const docs = data.documents || {};

      Object.keys(docTitles).forEach(key => {
        if (docs[key]) {
          hasDocs = true;
          const card = document.createElement('div');
          card.className = 'doc-card';

          const isPdf = docs[key].startsWith('data:application/pdf');

          card.innerHTML = `
            <p>${docTitles[key]}</p>
            ${isPdf 
              ? `<div style="height:100px; display:flex; align-items:center; justify-content:center; background:#eee; font-size:12px; color:#555;">📄 PDF File</div>` 
              : `<img src="${docs[key]}" alt="${docTitles[key]}">`
            }
            <a href="${docs[key]}" target="_blank" download="${key}_document">দেখুন / ডাউনলোড</a>
          `;
          docsContainer.appendChild(card);
        }
      });

      if (!hasDocs) {
        docsContainer.innerHTML = '<p style="font-size: 13px; color: #888;">কোনো অতিরিক্ত ডকুমেন্ট আপলোড করা হয়নি।</p>';
      }

    } else {
      alert('ছাত্রীর কোনো তথ্য পাওয়া যায়নি!');
    }
  } catch (error) {
    console.error("Error loading profile: ", error);
    alert('প্রোফাইল লোড করতে সমস্যা হয়েছে!');
  }
}

// Execute on page load
loadStudentProfile();
