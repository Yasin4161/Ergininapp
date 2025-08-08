// Maksimum doğum tarihi: bugün
const birth = document.getElementById('birth');
const age   = document.getElementById('age');
birth.max   = new Date().toISOString().slice(0,10);

// Yaş hesapla
function calcAge(){
  if(!birth.value){ age.value = ''; return; }
  const b = new Date(birth.value);
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  age.value = isFinite(a) && a >= 0 ? a : '';
}
birth.addEventListener('change', calcAge);

// Maskeler
const onlyDigits = v => v.replace(/\D+/g,'');

// Telefon: 0 (5xx) xxx xx xx
const phone = document.getElementById('phone');
phone.addEventListener('input', () => {
  const d = onlyDigits(phone.value).slice(0,11); // 0 + 10 hane
  let out = '';
  if(d.length>=1) out = d[0] + ' ';
  if(d.length>=2) out += '(' + d.slice(1,Math.min(4,d.length)) + (d.length<4 ? '' : ') ');
  if(d.length>=7) out += d.slice(4,7) + ' ';
  if(d.length>=9) out += d.slice(7,9) + ' ';
  if(d.length>=11) out += d.slice(9,11);
  phone.value = out.trim();
});

// IBAN: TRxx xxxx xxxx ...
const iban = document.getElementById('iban');
iban.addEventListener('input', () => {
  let v = iban.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!v.startsWith('TR')) v = 'TR' + v.replace(/^TR/,'');
  v = (v.match(/.{1,4}/g) || [v]).join(' ');
  iban.value = v.slice(0,29); // TR + 24 hane + boşluklar
});

// TCKN sadece rakam ve 11 hane
const tckn = document.getElementById('tckn');
tckn.addEventListener('input', () => {
  tckn.value = onlyDigits(tckn.value).slice(0,11);
});

// Form işlemleri
const form  = document.getElementById('profileForm');
const toast = document.getElementById('toast');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if(!form.checkValidity()){ form.reportValidity(); return; }
  // Buraya gerçek kayıt isteği eklenebilir (fetch ile API'ye gönderme vb.)
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2000);
});

document.getElementById('printBtn').addEventListener('click', () => window.print());
document.getElementById('resetBtn').addEventListener('click', () => {
  setTimeout(() => { age.value=''; }, 0); // reset sonrası yaş alanını boşalt
});
