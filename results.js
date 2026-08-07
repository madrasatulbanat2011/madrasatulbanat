import { db } from './firebase.js';
import { collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const studentSelect = document.getElementById('studentSelect');
const resultForm = document.getElementById('resultForm');

// ১. ফায়ারবেস ডেটাবেস থেকে স্টুডেন্টদের তালিকা লোড করার ফাংশন
async function loadStudents() {
  try {
    const querySnapshot = await getDocs(collection(db, "admissions"));
    studentSelect.innerHTML = '<option value="">-- স্টুডেন্ট সিলেক্ট করুন --</option>';

    if (querySnapshot.empty) {
      studentSelect.innerHTML = '<option value="">কোনো ছাত্রীর তথ্য পাওয়া যায়নি</option>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const student = doc.data();
      const option = document.createElement('option');
      option.value = doc.id;
      
      const sName = student.studentName || student.name || 'Unknown Name';
      const sClass = student.className || student.class || '';
      
      option.textContent = `${sName} ${sClass ? `(Class: ${sClass})` : ''}`;
      option.dataset.studentName = sName;
      option.dataset.className = sClass;
      
      studentSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching students: ", error);
    studentSelect.innerHTML = '<option value="">স্টুডেন্ট লোড করতে সমস্যা হয়েছে!</option>';
  }
}

// পেজ লোড হলেই স্টুডেন্ট লিস্ট নিয়ে আসা
document.addEventListener('DOMContentLoaded', loadStudents);

// ২. রেজাল্ট সেভ করার ফাংশন (শুধুমাত্র ইনপুট দেওয়া বিষয়গুলো সেভ হবে)
if (resultForm) {
  resultForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedOption = studentSelect.options[studentSelect.selectedIndex];
    if (!studentSelect.value) {
      alert('দয়া করে একজন ছাত্রী নির্বাচন করুন!');
      return;
    }

    const submitBtn = resultForm.querySelector('.btn-submit');
    submitBtn.innerText = 'সেভ হচ্ছে...';
    submitBtn.disabled = true;

    try {
      const subjectList = [
        { id: 'sub_bangla', chk: 'chk_bangla', name: 'বাংলা' },
        { id: 'sub_english', chk: 'chk_english', name: 'ইংরেজি' },
        { id: 'sub_math', chk: 'chk_math', name: 'গণিত' },
        { id: 'sub_pSc', chk: 'chk_pSc', name: 'ভৌত বিজ্ঞান' },
        { id: 'sub_lSc', chk: 'chk_lSc', name: 'জীবন বিজ্ঞান' },
        { id: 'sub_history', chk: 'chk_history', name: 'ইতিহাস' },
        { id: 'sub_geography', chk: 'chk_geography', name: 'ভূগোল' },
        { id: 'sub_env', chk: 'chk_env', name: 'পরিবেশ' },
        { id: 'sub_urdu', chk: 'chk_urdu', name: 'উর্দু' },
        { id: 'sub_arabic', chk: 'chk_arabic', name: 'আরবি' },
        { id: 'sub_arabicPath', chk: 'chk_arabicPath', name: 'আরবি পাঠ' },
        { id: 'sub_diniyat', chk: 'chk_diniyat', name: 'দিনিয়াত' },
        { id: 'sub_dua', chk: 'chk_dua', name: 'দোয়া' },
        { id: 'sub_durusulLughah', chk: 'chk_durusulLughah', name: 'দুরুসুল লোগাহ' },
        { id: 'sub_hidayah', chk: 'chk_hidayah', name: 'হেদায়াতুল্লাহ' },
        { id: 'sub_sharmiyat', chk: 'chk_sharmiyat', name: 'শারমিয়াত' },
        { id: 'sub_bukhari1', chk: 'chk_bukhari1', name: 'বুখারী-১' },
        { id: 'sub_bukhari2', chk: 'chk_bukhari2', name: 'বুখারী-২' },
        { id: 'sub_muslim1', chk: 'chk_muslim1', name: 'মুসলিম-১' },
        { id: 'sub_muslim2', chk: 'chk_muslim2', name: 'মুসলিম-২' },
        { id: 'sub_tirmidhi', chk: 'chk_tirmidhi', name: 'তিরমিজি' },
        { id: 'sub_abuDawud', chk: 'chk_abuDawud', name: 'আবু দাউদ' },
        { id: 'sub_raheeq', chk: 'chk_raheeq', name: 'আর-রাহীকুল মাখতূম' }
      ];

      let activeMarks = {};
      let totalMarks = 0;

      subjectList.forEach(sub => {
        const inputEl = document.getElementById(sub.id);
        const chkEl = document.getElementById(sub.chk);

        // যদি ঘরটিতে নম্বর লেখা থাকে অথবা টিক মার্ক দেওয়া থাকে, তবেই সেটিকে ধরা হবে
        if ((inputEl && inputEl.value.trim() !== '') || (chkEl && chkEl.checked && inputEl.value !== '')) {
          const val = parseFloat(inputEl.value) || 0;
          activeMarks[sub.name] = val;
          totalMarks += val;
        }
      });

      const resultPayload = {
        studentId: studentSelect.value,
        studentName: selectedOption.dataset.studentName,
        className: selectedOption.dataset.className,
        examName: document.getElementById('examName').value,
        marks: activeMarks, // শুধুমাত্র এন্ট্রি হওয়া বিষয়গুলো সেভ হচ্ছে
        totalMarks: totalMarks,
        createdAt: new Date().toISOString()
      };

      // Firestore-এ রেজাল্ট ডাটা সেভ করা
      await addDoc(collection(db, "results"), resultPayload);

      alert('অভিনন্দন! শুধুমাত্র সিলেক্ট করা বিষয়গুলোর রেজাল্ট সেভ করা হয়েছে।');
      resultForm.reset();

    } catch (error) {
      console.error("Error saving result: ", error);
      alert('রেজাল্ট সেভ করতে সমস্যা হয়েছে! আবার চেষ্টা করুন।');
    } finally {
      submitBtn.innerText = 'Save Result (রেজাল্ট সেভ করুন)';
      submitBtn.disabled = false;
    }
  });
}
