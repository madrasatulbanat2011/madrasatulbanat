import { db } from './firebase.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Get Student ID from URL search query
const urlParams = new URLSearchParams(window.location.search);
const studentId = urlParams.get('id');

async function loadStudentProfile() {
  if (!studentId) {
    alert('⚠️ কোনো ছাত্রীর ID পাওয়া যায়নি! দয়া করে লিস্ট থেকে নির্বাচন করুন।');
    return;
  }

  try {
    const docRef = doc(db, "admissions", studentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();

      // Display Basic Information with Fallbacks
      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.innerText = val || 'N/A';
      };

      setText('dispName', data.studentName || data.name);
      setText('dispClass', data.className || data.class);
      setText('dispDob', data.dob);
      setText('dispDept', data.department || data.course);
      setText('dispFather', data.fatherName);
      setText('dispMother', data.motherName);
      setText('dispMobile', data.mobileNumber || data.mobile);
      setText('dispResidence', data.residence);
      setText('dispPrevSchool', data.prevSchool);
      setText('dispPrevClass', data.prevClass);
      setText('dispAddress', data.address);

      // Handle Student Profile Photo
      const photoImg = document.getElementById('displayPhoto');
      const noPhotoText = document.getElementById('noPhotoText');
      
      const photoUrl = data.documents?.photo || data.photo;

      if (photoUrl && photoImg) {
        photoImg.src = photoUrl;
        photoImg.style.display = 'block';
        if (noPhotoText) noPhotoText.style.display = 'none';
      } else if (noPhotoText) {
        noPhotoText.style.display = 'block';
        if (photoImg) photoImg.style.display = 'none';
      }

      // Handle Uploaded Documents
      const docsContainer = document.getElementById('docsContainer');
      if (docsContainer) {
        docsContainer.innerHTML = '';

        const docTitles = {
          birth: 'জন্ম সার্টিফিকেট',
          tc: 'টিসি সার্টিফিকেট',
          school: 'স্কুল সার্টিফিকেট',
          other: 'অন্যান্য ডকুমেন্ট'
        };

        const docs = data.documents || {};
        let hasDocs = false;

        Object.keys(docTitles).forEach(key => {
          if (docs[key]) {
            hasDocs = true;
            const card = document.createElement('div');
            card.className = 'doc-card';

            const isPdf = typeof docs[key] === 'string' && docs[key].startsWith('data:application/pdf');

            card.innerHTML = `
              <p>${docTitles[key]}</p>
              ${isPdf 
                ? `<div style="height:80px; display:flex; align-items:center; justify-content:center; background:#eee; font-size:11px; color:#555; border-radius:4px;">📄 PDF ফাইল</div>` 
                : `<img src="${docs[key]}" alt="${docTitles[key]}">`
              }
              <a href="${docs[key]}" target="_blank" download="${key}_doc">দেখুন / ডাউনলোড</a>
            `;
            docsContainer.appendChild(card);
          }
        });

        if (!hasDocs) {
          docsContainer.innerHTML = '<p style="font-size: 13px; color: #888;">কোনো অতিরিক্ত ডকুমেন্ট আপলোড করা হয়নি।</p>';
        }
      }

    } else {
      alert('❌ ছাত্রীর কোনো তথ্য ফায়ারবেসে পাওয়া যায়নি!');
    }
  } catch (error) {
    console.error("Error loading student profile: ", error);
    alert('❌ ডাটা লোড করতে সমস্যা হয়েছে! ফায়ারবেস বা নেটওয়ার্ক সংযোগ চেক করুন।');
  }
}

// Execute on page load
loadStudentProfile();
