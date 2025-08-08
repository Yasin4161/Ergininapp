// === Yardımcılar ===
const $ = (s)=>document.querySelector(s);
const birth = $('#birth'), age = $('#age');
const phone = $('#phone'), tckn = $('#tckn'), iban = $('#iban');
const citySel = $('#city'), distSel = $('#district');
const form = $('#profileForm'), toast = $('#toast');

// Bugünden ileri tarih doğum olmasın
birth.max = new Date().toISOString().slice(0,10);

// Yaş hesaplama
function calcAge(){
  if(!birth.value){ age.value=''; return; }
  const b=new Date(birth.value), t=new Date();
  let a=t.getFullYear()-b.getFullYear();
  const m=t.getMonth()-b.getMonth();
  if(m<0 || (m===0 && t.getDate()<b.getDate())) a--;
  age.value = isFinite(a)&&a>=0 ? a : '';
}
birth.addEventListener('change', calcAge);

// Maske/biçimlendirme
const digits = v => v.replace(/\D+/g,'');

// TCKN: sadece 11 rakam
tckn.addEventListener('input', ()=> tckn.value = digits(tckn.value).slice(0,11));

// Telefon: 0 (5xx) xxx xx xx
phone.addEventListener('input', ()=>{
  const d = digits(phone.value).slice(0,11); // 0 + 10 hane
  let out='';
  if(d.length>=1) out = d[0] + ' ';
  if(d.length>=2) out += '(' + d.slice(1,Math.min(4,d.length)) + (d.length<4?'':') ');
  if(d.length>=7) out += d.slice(4,7) + ' ';
  if(d.length>=9) out += d.slice(7,9) + ' ';
  if(d.length>=11) out += d.slice(9,11);
  phone.value = out.trim();
});

// IBAN: TR + 24 hane, 4'lü gruplar
iban.addEventListener('input', ()=>{
  let v = iban.value.toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(!v.startsWith('TR')) v = 'TR' + v.replace(/^TR/,'');
  v = (v.match(/.{1,4}/g) || [v]).join(' ');
  iban.value = v.slice(0, 29);
});

// === İl / İlçe ===
// Not: Tam Türkiye listesi istersen dosyaya ekleyebilirim.
// Burada örnek ve yaygın iller var.
const ilceler = {
  "Adana":["Seyhan","Yüreğir","Çukurova","Sarıçam"],
  "Ankara":["Çankaya","Keçiören","Yenimahalle","Mamak","Etimesgut","Sincan"],
  "Antalya":["Kepez","Muratpaşa","Konyaaltı","Alanya"],
  "Bursa":["Osmangazi","Yıldırım","Nilüfer","İnegöl"],
  "Gaziantep":["Şahinbey","Şehitkamil","Nizip"],
  "İstanbul":["Adalar","Beşiktaş","Beylikdüzü","Kadıköy","Kartal","Küçükçekmece","Pendik","Şişli","Ümraniye","Üsküdar"],
  "İzmir":["Bornova","Buca","Karşıyaka","Konak","Bayraklı"],
  "Kocaeli":["İzmit","Gebze","Derince","Gölcük","Körfez","Başiskele","Kartepe"],
  "Konya":["Selçuklu","Meram","Karatay"],
  "Sakarya":["Adapazarı","Serdivan","Erenler","Akyazı"]
};

// İlleri doldur
(function fillCities(){
  const cities = Object.keys(ilceler).sort();
  cities.forEach(c=>{
    const o = document.createElement('option');
    o.value=o.textContent=c;
    citySel.appendChild(o);
  });
})();

citySel.addEventListener('change', ()=>{
  distSel.innerHTML = '';
  distSel.disabled = !citySel.value;
  if(!citySel.value){
    const opt = new Option('Önce İl Seçiniz','');
    distSel.add(opt); return;
  }
  ilceler[citySel.value].forEach(d=> distSel.add(new Option(d,d)));
  distSel.insertAdjacentHTML('afterbegin','<option value="" selected disabled>İlçe seçin</option>');
});

// === Parola kontrolleri ===
const newPass = $('#newPass'), newPass2 = $('#newPass2');
const passLen = $('#passLen'), passMatch = $('#passMatch');

function validatePass(){
  passLen.textContent = newPass.value && newPass.value.length<6 ? 'En az 6 karakter.' : '';
  passMatch.textContent = (newPass2.value && newPass.value !== newPass2.value) ? 'Şifreler eşleşmiyor.' : '';
}
newPass.addEventListener('input', validatePass);
newPass2.addEventListener('input', validatePass);

// === Form gönderimi ===
form.addEventListener('submit', (e)=>{
  e.preventDefault();

  // Adres uzunluğu
  const addr = $('#address').value.trim();
  if(addr && (addr.length<10 || addr.length>255)){
    alert('Adres 10–255 karakter olmalıdır.');
    return;
  }

  // Zorunlu alanların yerleşik doğrulaması
  if(!form.checkValidity()){
    form.reportValidity();
    return;
  }

  // Örnek payload (gerçekte API'ye fetch ile gönderilebilir)
  const payload = {
    fullname: $('#fullname').value.trim(),
    username: $('#username').value.trim(),
    tckn: tckn.value.replace(/\D/g,''),
    birth: birth.value || null,
    phone: phone.value,
    email: $('#email').value.trim(),
    iban: iban.value.replace(/\s+/g,''),
    city: citySel.value || null,
    district: distSel.value || null,
    address: addr,
    password: newPass.value && newPass.value===newPass2.value ? newPass.value : undefined
  };
  console.log('Gönderilecek veri:', payload);

  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2000);
});

// Yazdır & Temizle
$('#printBtn').addEventListener('click', ()=>window.print());
$('#resetBtn').addEventListener('click', ()=>{
  setTimeout(()=>{
    age.value=''; distSel.innerHTML='<option value="" selected>Önce İl Seçiniz</option>'; distSel.disabled=true;
    passLen.textContent=''; passMatch.textContent='';
  },0);
});

// İlk kurulum
calcAge();
