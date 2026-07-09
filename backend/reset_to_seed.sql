-- ============================================================
-- RESET SCRIPT: Kembalikan data ke kondisi awal (seed.go)
-- Hanya memengaruhi: variables, indicators, criterions,
--                    indicator_variables, criterion_indicators
-- TIDAK menghapus: admin_users, settings, consultations, dll.
-- ============================================================

PRAGMA foreign_keys = OFF;

-- 1. Hapus semua relasi (mapping tables)
DELETE FROM indicator_variables;
DELETE FROM criterion_indicators;

-- 2. Hapus semua variables, indicators, criterions
DELETE FROM variables;
DELETE FROM indicators;
DELETE FROM criterions;

-- ============================================================
-- 3. Isi ulang: CRITERIONS (Preschool K1-K6)
-- ============================================================
INSERT INTO criterions (code, label, description, suggestions, age_group) VALUES
('K1','Intelektual Umum','Kemampuan intelektual anak yang menyeluruh, mencakup daya tangkap verbal yang baik, ingatan yang kuat, serta kemampuan berpikir dan menggunakan kata-kata abstrak di atas rata-rata usianya.','Dukung dengan membacakan buku cerita interaktif, ajak berdiskusi tentang kejadian sehari-hari, berikan permainan kata-kata (tebak kata), dan dorong anak menceritakan kembali kegiatannya secara terstruktur.','preschool'),
('K2','Akademik Khusus','Kemampuan menonjol anak pada bidang akademik tertentu, khususnya penguasaan konsep angka/matematika dasar, pemahaman kuantitas benda, serta keingintahuan ilmiah terhadap alam sekitar (sains anak usia dini).','Fasilitasi dengan permainan hitung-menghitung benda nyata, puzzle angka, eksperimen sains sederhana di rumah (seperti mencampur warna atau menenggelamkan benda), serta eksplorasi alam terbuka.','preschool'),
('K3','Berpikir Kreatif dan Produktif','Kemampuan mengemukakan ide unik, menggambar ekspresif, menunjukkan empati sosial yang tinggi, mandiri dalam bertindak, serta menghargai karya orang lain.','Sediakan beragam media seni (cat, krayon, tanah liat), hargai setiap gagasan barunya tanpa langsung mengoreksi, libatkan dalam kegiatan bermain peran yang membutuhkan penyelesaian konflik sederhana secara mandiri.','preschool'),
('K4','Kepemimpinan','Kemampuan sosial untuk memimpin teman sebaya, bertanggung jawab terhadap tugas mandiri maupun kelompok, bekerja sama dengan baik, mengendalikan emosi, serta bersikap kooperatif.','Berikan tanggung jawab kecil di rumah (merapikan mainan), libatkan dalam permainan kelompok bergiliran (board games), latih anak mendengarkan pendapat orang lain, dan berikan apresiasi saat ia mau berbagi.','preschool'),
('K5','Seni Visual dan Pertunjukan','Kepekaan estetika yang tinggi pada bidang visual (melukis/menggambar detail), musik (peka nada dan ritme), serta seni pertunjukan (ekspresi gerakan tubuh dan bermain peran drama).','Perkenalkan alat musik anak-anak, dengarkan lagu dengan berbagai ketukan, fasilitasi ruang untuk menari secara bebas mengikuti alunan musik, dan ajjak bermain peran (drama boneka/sandiwara boneka tangan).','preschool'),
('K6','Psikomotorik','Keterampilan fisik dan motorik yang matang, mencakup keseimbangan motorik kasar (berlari, melompat, meniti) serta kelenturan motorik halus dan mekanis (melipat origami, menggunting pola, memanipulasi obeng mainan).','Ajak melakukan aktivitas luar ruangan (bersepeda, memanjat jaring bermain, berdiri satu kaki), latih motorik halus dengan melipat kertas, menggunting pola gambar, merakit lego/mainan bongkar-pasang mekanik.','preschool');

-- Toddler
INSERT INTO criterions (code, label, description, suggestions, age_group) VALUES
('TK1','Intelektual Umum','Kemampuan komunikasi dan memori dasar pada anak usia 3 tahun.','Dukung dengan membacakan buku bergambar, bernyanyi bersama, dan merespons celoteh anak dengan kalimat lengkap.','toddler'),
('TK2','Akademik Khusus','Kemampuan mengenal konsep angka dasar (1-3) dan bentuk/warna dasar.','Ajak bermain puzzle balok sederhana, menyebutkan warna mainan, dan berhitung jari.','toddler'),
('TK3','Berpikir Kreatif dan Produktif','Kemampuan imajinasi awal dan rasa ingin tahu yang tinggi.','Sediakan kertas kosong dan krayon besar untuk mencoret-coret, ajak bermain pura-pura (pretend play) sederhana.','toddler'),
('TK4','Kepemimpinan','Kemampuan sosialisasi awal, kepatuhan instruksi, dan empati sederhana.','Latih kepatuhan dengan instruksi satu langkah (seperti membereskan mainan), beri contoh berempati secara hangat.','toddler'),
('TK5','Seni Visual dan Pertunjukan','Kepekaan dasar anak terhadap irama musik dan gambar berwarna.','Putar musik anak-anak dan ajak bergoyang/bertepuk tangan bersama, sediakan buku bergambar besar.','toddler'),
('TK6','Psikomotorik','Keterampilan motorik kasar dan halus dasar seperti berlari stabil dan menggenggam krayon.','Ajak anak bermain lempar-tangkap bola besar, berlari di taman, dan meronce manik-manik besar.','toddler');

-- Early Elementary
INSERT INTO criterions (code, label, description, suggestions, age_group) VALUES
('EK1','Intelektual Umum','Kemampuan penalaran verbal dan logis yang berkembang baik pada usia sekolah awal.','Ajak anak membaca buku mandiri, bahas kosa kata baru, berikan teka-teki logika atau catur pemula.','early_elementary'),
('EK2','Akademik Khusus','Kecakapan dalam matematika dasar (penjumlahan/pengurangan) dan ketertarikan pada sains/alam.','Berikan latihan soal hitungan menyenangkan, ajak berkunjung ke museum sains, lakukan observasi alam.','early_elementary'),
('EK3','Berpikir Kreatif dan Produktif','Kemampuan menciptakan karya orisinal, kerajinan tangan, dan menemukan solusi alternatif.','Sediakan bahan daur ulang untuk crafting, ajak menulis buku harian/komik bergambar sendiri.','early_elementary'),
('EK4','Kepemimpinan','Tanggung jawab mandiri (PR/sekolah), kepemimpinan kelompok bermain, dan kerjasama tim.','Berikan tugas rumah tangga harian, dukung bergabung dalam klub olahraga atau pramuka sekolah.','early_elementary'),
('EK5','Seni Visual dan Pertunjukan','Bakat seni rupa detail (proporsi gambar) dan rasa percaya diri tampil seni pertunjukan/musik.','Ikutkan les menggambar, belajar alat musik dasar (pianika/recorder), dorong tampil di acara sekolah.','early_elementary'),
('EK6','Psikomotorik','Koordinasi motorik kasar lanjut (sepeda roda dua, lompat tali) dan motorik halus presisi (origami/menggunting pola).','Latih bersepeda roda dua, bermain bulu tangkis, melatih origami kreatif dan membuat kerajinan tangan rumit.','early_elementary');

-- Late Elementary
INSERT INTO criterions (code, label, description, suggestions, age_group) VALUES
('LK1','Intelektual Umum','Kemampuan penalaran verbal, logika abstrak, debat argumen, dan menulis esai runtut.','Ajak diskusi kritis tentang isu sosial, berikan buku bacaan sastra anak, dorong anak menulis artikel/esai pendek.','late_elementary'),
('LK2','Akademik Khusus','Kemampuan pemecahan matematika sekolah tingkat lanjut dan minat riset/teknologi (programming/robotik).','Dukung bergabung dalam klub matematika, berikan kit robotik sederhana, perkenalkan kelas coding pemula.','late_elementary'),
('LK3','Berpikir Kreatif dan Produktif','Bakat dalam desain kreatif (digital/seni), inovasi ide proyek, dan apresiasi estetika luas.','Kenalkan perangkat lunak desain digital, dorong pembuatan video/editing kreatif, ajak mengulas film secara kritis.','late_elementary'),
('LK4','Kepemimpinan','Kepemimpinan organisasi (ketua kelas/kelompok), resolusi konflik adil, dan sportivitas lomba.','Dukung berorganisasi di sekolah (OSIS/Pramuka), latih teknik mediasi konflik sebaya, latih sportivitas.','late_elementary'),
('LK5','Seni Visual dan Pertunjukan','Kemampuan teknik melukis 3D/desain grafis, kemahiran alat musik, dan tari kreasi mandiri.','Fasilitasi studio lukis sederhana, ikutkan les alat musik lanjutan (gitar/biola), dukung menciptakan koreografi sendiri.','late_elementary'),
('LK6','Psikomotorik','Penguasaan olahraga tim taktis, kelincahan atletik menonjol, dan keterampilan mekanis/bongkar-pasang presisi.','Dukung bergabung dengan klub olahraga prestasi (sepak bola/basket), fasilitasi perkakas bongkar pasang mainan mekanik.','late_elementary');

-- ============================================================
-- 4. Isi ulang: INDICATORS (Preschool I1-I27)
-- ============================================================
INSERT INTO indicators (code, label, age_group) VALUES
('I1','Tingkat perbendaharaan kata yang tinggi','preschool'),
('I2','Mempunyai ingatan kuat','preschool'),
('I3','Penguasaan kata-kata abstrak','preschool'),
('I4','Memiliki pemikiran abstrak','preschool'),
('I5','Memiliki prestasi bidang matematika','preschool'),
('I6','Memiliki prestasi sains','preschool'),
('I7','Keterbukaan terhadap pengalaman','preschool'),
('I8','Menetapkan standar personal','preschool'),
('I9','Kemampuan memainkan ide-ide','preschool'),
('I10','Keinginan untuk menghadapi resiko','preschool'),
('I11','Kesukaan terhadap kompleksitas','preschool'),
('I12','Toleran terhadap ambiguitas','preschool'),
('I13','Image diri yang positif','preschool'),
('I14','Kemampuan menyatu dengan tugas','preschool'),
('I15','Kepercayaan diri','preschool'),
('I16','Tanggung jawab','preschool'),
('I17','Kerja sama','preschool'),
('I18','Kecenderungan untuk mendominasi','preschool'),
('I19','Beradaptasi dengan mudah terhadap situasi baru','preschool'),
('I20','Keterbakatan dalam bidang seni visual','preschool'),
('I21','Keterbakatan dalam bidang seni musik','preschool'),
('I22','Keterbakatan dalam bidang drama','preschool'),
('I23','Kemampuan motorik kinestetik','preschool'),
('I24','Keterampilan praktik','preschool'),
('I25','Keterampilan spasial','preschool'),
('I26','Keterampilan mekanika','preschool'),
('I27','Keterampilan fisikal','preschool');

-- Toddler
INSERT INTO indicators (code, label, age_group) VALUES
('TI1','Kemampuan Komunikasi & Bicara Dasar','toddler'),
('TI2','Konsep Angka & Warna Dasar','toddler'),
('TI3','Imajinasi Bermain Toddler','toddler'),
('TI4','Kepatuhan & Sosialisasi Dasar','toddler'),
('TI5','Respon Musik & Estetika Toddler','toddler'),
('TI6','Keterampilan Motorik Toddler','toddler');

-- Early Elementary
INSERT INTO indicators (code, label, age_group) VALUES
('EI1','Kemampuan Verbal & Pemahaman Cerita','early_elementary'),
('EI2','Penalaran Logis & Analitis Awal','early_elementary'),
('EI3','Keterampilan Matematika Dasar','early_elementary'),
('EI4','Minat Observasi Alam & Sains','early_elementary'),
('EI5','Orisinalitas & Pembuatan Karya','early_elementary'),
('EI6','Pemecahan Masalah & Kreativitas Praktis','early_elementary'),
('EI7','Kepemimpinan & Kerjasama Kelompok','early_elementary'),
('EI8','Kemandirian & Tanggung Jawab Akademik','early_elementary'),
('EI9','Menggambar dengan Detail & Proporsi','early_elementary'),
('EI10','Bakat Musik & Keberanian Tampil','early_elementary'),
('EI11','Keseimbangan & Kelincahan Fisik','early_elementary'),
('EI12','Keterampilan Motorik Halus Presisi','early_elementary');

-- Late Elementary
INSERT INTO indicators (code, label, age_group) VALUES
('LI1','Penalaran Abstrak & Debat Logis','late_elementary'),
('LI2','Literasi Karangan & Menulis Runtut','late_elementary'),
('LI3','Keterampilan Matematika Lanjut','late_elementary'),
('LI4','Eksperimen Sains & Minat Teknologi','late_elementary'),
('LI5','Inovasi Desain & Proyek Mandiri','late_elementary'),
('LI6','Apresiasi Estetika & Budaya Kritis','late_elementary'),
('LI7','Kepemimpinan Kelompok & Organisasi','late_elementary'),
('LI8','Sportivitas & Resolusi Konflik Sebaya','late_elementary'),
('LI9','Seni Rupa & Media Digital Lanjut','late_elementary'),
('LI10','Kemahiran Instrumen & Tari Mandiri','late_elementary'),
('LI11','Kecakapan Atletik & Olahraga Taktis','late_elementary'),
('LI12','Keterampilan Mekanis & Presisi Fisik','late_elementary');

-- ============================================================
-- 5. Isi ulang: VARIABLES (Preschool C1-C83)
-- ============================================================
INSERT INTO variables (code, label, category, age_group) VALUES
('C1','Dapat menirukan kalimat sederhana dengan jelas','General Intellectual','preschool'),
('C2','Dapat meniru kembali 4-5 urutan kata yang didengar','General Intellectual','preschool'),
('C3','Mengulangi kalimat panjang yang baru saja didengarnya secara presisi','General Intellectual','preschool'),
('C4','Menyanyikan lagu anak-anak lebih dari 20 lagu yang berbeda','General Intellectual','preschool'),
('C5','Dapat menyebutkan simbol-simbol huruf vokal dan konsonan yang ditunjuk','General Intellectual','preschool'),
('C6','Mengucapkan syair lagu secara lantang sambil bersenandung mengikuti irama','General Intellectual','preschool'),
('C7','Dapat mengelompokkan benda-benda sekitar berdasarkan kesamaan fungsinya','General Intellectual','preschool'),
('C8','Meniru penulisan berbagai lambang huruf vokal dan konsonan di atas kertas','General Intellectual','preschool'),
('C9','Mengelompokkan peralatan makan, mandi, dan kebersihan secara terpisah','General Intellectual','preschool'),
('C10','Menggunakan kata tanya (apa, mengapa, dimana, berapa, bagaimana) dengan tepat','General Intellectual','preschool'),
('C11','Bercerita secara runtut tentang gambar yang disediakan atau buatannya sendiri','General Intellectual','preschool'),
('C12','Aktif menggunakan kata ganti orang (aku, saya, kamu, mereka) dalam bercakap','General Intellectual','preschool'),
('C13','Menceritakan kembali pengalaman menarik atau kejadian sederhana yang dialaminya','General Intellectual','preschool'),
('C14','Memberikan keterangan lengkap atau informasi spontan tentang suatu hal','General Intellectual','preschool'),
('C15','Dapat menyebutkan urutan bilangan 1 sampai 10 secara runtut','Specific Academic','preschool'),
('C16','Dapat menunjuk lambang bilangan 1 sampai 10 yang ditulis acak','Specific Academic','preschool'),
('C17','Meniru penulisan lambang bilangan 1 sampai 10','Specific Academic','preschool'),
('C18','Mengenal dan menyebutkan lambang bilangan 1 sampai 20','Specific Academic','preschool'),
('C19','Membedakan dan membentuk dua kumpulan benda berdasarkan jumlah kuantitasnya','Specific Academic','preschool'),
('C20','Mengenal perbedaan bentuk geometri benda (bulat, segitiga, kotak)','Specific Academic','preschool'),
('C21','Mencoba mencampur warna cat dan antusias menceritakan perubahan warnanya','Specific Academic','preschool'),
('C22','Suka bereksperimen menaruh benda ke air lalu menceritakan peristiwa tenggelam/terapung','Specific Academic','preschool'),
('C23','Menirukan dan menceritakan macam-macam bunyi alam atau kendaraan sekitar','Specific Academic','preschool'),
('C24','Mengenali dan menceritakan perbedaan macam-macam rasa makanan (manis, pahit, dll)','Specific Academic','preschool'),
('C25','Menceritakan berbagai jenis bau wewangian atau bau tak sedap secara spesifik','Specific Academic','preschool'),
('C26','Mau mengungkapkan pendapat pribadinya secara sederhana dalam diskusi','Creative Thinking','preschool'),
('C27','Menjawab pertanyaan dengan antusias ketika dimintai informasi atau keterangan','Creative Thinking','preschool'),
('C28','Spontan menyapa teman sebaya maupun orang dewasa yang dikenalnya','Creative Thinking','preschool'),
('C29','Mengucapkan salam saat masuk ruangan atau bertemu orang lain','Creative Thinking','preschool'),
('C30','Mengucapkan terima kasih secara sadar setelah menerima sesuatu','Creative Thinking','preschool'),
('C31','Mengekspresikan perasaannya (marah, sedih, gembira, cemas) secara wajar','Creative Thinking','preschool'),
('C32','Membuat perencanaan sederhana mengenai aktivitas bermain yang ingin dilakukannya','Creative Thinking','preschool'),
('C33','Mampu mengambil keputusan sederhana (misalnya memilih mainan atau pakaian sendiri)','Creative Thinking','preschool'),
('C34','Menggambar secara bebas dan ekspresif menggunakan krayon/spidol','Creative Thinking','preschool'),
('C35','Mampu membedakan perbuatan yang benar dan yang salah di lingkungannya','Creative Thinking','preschool'),
('C36','Suka menolong teman yang mengalami kesulitan atau terjatuh','Creative Thinking','preschool'),
('C37','Mau bermain dengan siapa saja tanpa membedakan latar belakang/perbedaan fisik','Creative Thinking','preschool'),
('C38','Menghargai hasil gambar atau susunan balok karya temannya','Creative Thinking','preschool'),
('C39','Mengakui dan memuji keunggulan atau kemampuan yang dimiliki temannya','Creative Thinking','preschool'),
('C40','Menginisiasi permainan dengan mengajak teman-teman sekitar bergabung','Creative Thinking','preschool'),
('C41','Mudah memberi maaf kepada teman yang tidak sengaja merusaknya/menyakitinya','Creative Thinking','preschool'),
('C42','Dapat berinteraksi ramah dengan teman yang berbeda agama/keyakinan','Creative Thinking','preschool'),
('C43','Memberikan pujian verbal kepada teman yang berbuat baik atau berhasil','Creative Thinking','preschool'),
('C44','Berpakaian rapi dan menjaga kesopanan selama berada di sekolah/tempat umum','Creative Thinking','preschool'),
('C45','Menghormati guru, orang tua, dan orang yang berusia lebih tua','Creative Thinking','preschool'),
('C46','Mendengarkan dengan tenang ketika guru atau temannya sedang berbicara','Creative Thinking','preschool'),
('C47','Menjaga dan memelihara hasil karyanya sendiri agar tidak rusak','Creative Thinking','preschool'),
('C48','Mentaati aturan dan kesepakatan dalam permainan bersama teman','Creative Thinking','preschool'),
('C49','Berani mengajukan pertanyaan kritis dan menjawab pertanyaan guru di kelas','Leadership','preschool'),
('C50','Bertanggung jawab merapikan mainan atau menyelesaikan tugas pribadinya','Leadership','preschool'),
('C51','Fokus menyelesaikan tugas mandirinya dari awal sampai tuntas tanpa menyerah','Leadership','preschool'),
('C52','Melaksanakan 3-5 perintah berurutan dengan benar (misal: ambil buku, taruh di meja, lalu duduk)','Leadership','preschool'),
('C53','Dapat membagi peran dan menyelesaikan tugas kelompok dengan gembira','Leadership','preschool'),
('C54','Dapat bekerja sama secara aktif dengan teman sebayanya dalam tim','Leadership','preschool'),
('C55','Senang berinteraksi sosial dan bergaul dengan lingkungan baru','Leadership','preschool'),
('C56','Inisiatif membantu teman kelompoknya yang tertinggal dalam aktivitas kelas','Leadership','preschool'),
('C57','Menengahi dan mau membantu meredakan perselisihan di antara teman bermainnya','Leadership','preschool'),
('C58','Mau berbagi makanan atau alat tulis secara suka rela kepada teman','Leadership','preschool'),
('C59','Meminjamkan mainan miliknya kepada teman lain tanpa paksaan','Leadership','preschool'),
('C60','Sabar mengantre atau menunggu gilirannya saat bermain bersama','Leadership','preschool'),
('C61','Mengendalikan emosi dengan wajar saat keinginannya tidak terpenuhi','Leadership','preschool'),
('C62','Menerima saran atau masukan sederhana dari guru/orang tua dengan tenang','Leadership','preschool'),
('C63','Melukiskan bentuk nyata yang dilihat atau didengarnya dengan proporsi baik','Visual & Performing Arts','preschool'),
('C64','Mampu menggambar pola gabungan dari titik, garis, lingkaran, dan segitiga','Visual & Performing Arts','preschool'),
('C65','Dapat membunyikan ketukan teratur pada alat musik anak (angklung, xylophone, dll)','Visual & Performing Arts','preschool'),
('C66','Dapat membedakan bunyi nada tinggi dan rendah dengan tepat','Visual & Performing Arts','preschool'),
('C67','Menyelaraskan gerakan tubuh secara indah sesuai syair lagu atau musik pengiring','Visual & Performing Arts','preschool'),
('C68','Menampilkan ekspresi emosi wajah yang teatrikal saat menari atau bercerita','Visual & Performing Arts','preschool'),
('C69','Bermain peran secara total memerankan karakter tertentu (misal: menjadi dokter/hewan)','Visual & Performing Arts','preschool'),
('C70','Berjalan, berlari, dan melompat secara seimbang (kemampuan motorik kasar dasar)','Psychomotor','preschool'),
('C71','Melempar dan menangkap bola kecil dengan terarah (koordinasi mata dan tangan)','Psychomotor','preschool'),
('C72','Meniti di atas papan titian atau berjalan dengan tumit ke jari kaki (keseimbangan dinamis)','Psychomotor','preschool'),
('C73','Menggunakan sendok, garpu, dan cangkir minum sendiri dengan rapi (kemampuan motorik halus makan)','Psychomotor','preschool'),
('C74','Membuka dan mengancingkan baju atau memakai tali sepatu sendiri (kemampuan motorik halus mandiri)','Psychomotor','preschool'),
('C75','Menyusun balok tinggi atau merangkai puzzle 12+ keping (kemampuan spasial dan susun)','Psychomotor','preschool'),
('C76','Melipat kertas menjadi bentuk sederhana seperti lipatan segitiga/amplop (kemampuan origami dasar)','Psychomotor','preschool'),
('C77','Menggunting kertas mengikuti pola garis lurus, gelombang, atau lingkaran (kemampuan motorik koordinatif)','Psychomotor','preschool'),
('C78','Membuka dan memutar tutup botol atau toples dengan tangan sendiri (kekuatan genggaman jari)','Psychomotor','preschool'),
('C79','Memputar mur mainan atau merakit komponen mainan bongkar pasang (keterampilan mekanik dasar)','Psychomotor','preschool'),
('C80','Memegang alat tulis (pensil/krayon) dengan tripod grasp yang benar (kontrol jemari menulis)','Psychomotor','preschool'),
('C81','Menggunakan palu mainan atau memasukkan pasak kayu ke lubangnya (koordinasi mekanis presisi)','Psychomotor','preschool'),
('C82','Berdiri dengan satu kaki selama 5-10 detik secara stabil (keseimbangan statis fisik)','Psychomotor','preschool'),
('C83','Bergantung atau berayun pada palang besi di arena bermain (kekuatan fisik lengan dan punggung)','Psychomotor','preschool');

-- Toddler
INSERT INTO variables (code, label, category, age_group) VALUES
('T1','Dapat menyebutkan namanya sendiri dan menunjuk anggota tubuhnya','General Intellectual','toddler'),
('T2','Dapat meniru kata-kata baru yang didengarnya','General Intellectual','toddler'),
('T3','Dapat menghitung secara verbal 1-3 benda secara runtut','Specific Academic','toddler'),
('T4','Mengenal warna dasar (merah, biru, kuning)','Specific Academic','toddler'),
('T5','Suka mencoret-coret kertas secara bebas','Creative Thinking','toddler'),
('T6','Suka bermain pura-pura (pretend play) sederhana dengan mainannya','Creative Thinking','toddler'),
('T7','Mau menunjukkan empati (misal memeluk temannya yang menangis)','Leadership','toddler'),
('T8','Mau mengikuti petunjuk sederhana satu langkah (misal: ambil mainan)','Leadership','toddler'),
('T9','Suka bertepuk tangan atau bergoyang saat mendengar lagu anak','Visual & Performing Arts','toddler'),
('T10','Tertarik mencoba memukul mainan yang berbunyi/musik','Visual & Performing Arts','toddler'),
('T11','Bisa berlari tanpa sering terjatuh','Psychomotor','toddler'),
('T12','Bisa memegang krayon dengan genggaman tangannya untuk mencoret','Psychomotor','toddler');

-- Early Elementary
INSERT INTO variables (code, label, category, age_group) VALUES
('E1','Dapat menjelaskan jalan cerita dari buku yang dibacanya','General Intellectual','early_elementary'),
('E2','Memiliki kosakata yang kaya dan mampu menggunakannya dalam kalimat yang benar','General Intellectual','early_elementary'),
('E3','Suka bermain puzzle yang membutuhkan pemikiran logis','General Intellectual','early_elementary'),
('E4','Mampu mengidentifikasi sebab-akibat sederhana dalam kehidupan sehari-hari','General Intellectual','early_elementary'),
('E5','Mampu melakukan penjumlahan dan pengurangan matematika dasar dengan lancar','Specific Academic','early_elementary'),
('E6','Tertarik memecahkan teka-teki angka atau logika matematika','Specific Academic','early_elementary'),
('E7','Suka mengamat serangga, tanaman, atau fenomena alam di sekitar','Specific Academic','early_elementary'),
('E8','Tertarik membaca buku tentang antariksa, dinosaurus, atau tubuh manusia','Specific Academic','early_elementary'),
('E9','Sering menemukan cara baru untuk merakit mainan block/lego','Creative Thinking','early_elementary'),
('E10','Suka mengarang cerita imajinatif atau membuat gambar komik sederhana','Creative Thinking','early_elementary'),
('E11','Mampu menemukan solusi alternatif saat mainannya rusak','Creative Thinking','early_elementary'),
('E12','Menunjukkan minat tinggi pada kegiatan kerajinan tangan (crafting)','Creative Thinking','early_elementary'),
('E13','Mampu memimpin kelompok kecil dalam permainan atau tugas sekolah','Leadership','early_elementary'),
('E14','Mengalah demi kepentingan bersama saat bermain dengan teman','Leadership','early_elementary'),
('E15','Mampu menyiapkan perlengkapan sekolahnya sendiri setiap hari','Leadership','early_elementary'),
('E16','Menyelesaikan tugas pekerjaan rumah (PR) tepat waktu secara mandiri','Leadership','early_elementary'),
('E17','Mampu menggambar objek dengan detail yang cukup baik (misal ada bayangan/proporsi)','Visual & Performing Arts','early_elementary'),
('E18','Suka mewarnai dengan kombinasi warna yang harmonis','Visual & Performing Arts','early_elementary'),
('E19','Mampu menyanyikan lagu dengan nada yang tepat (pitch control)','Visual & Performing Arts','early_elementary'),
('E20','Percaya diri tampil menari atau menyanyi di depan kelas/keluarga','Visual & Performing Arts','early_elementary'),
('E21','Lancar mengendarai sepeda roda dua tanpa bantuan roda samping','Psychomotor','early_elementary'),
('E22','Mampu melakukan lompat tali (skipping) beberapa kali berturut-turut','Psychomotor','early_elementary'),
('E23','Mampu menggunakan gunting dengan rapi untuk memotong pola yang rumit','Psychomotor','early_elementary'),
('E24','Dapat meronce manik-manik kecil atau melipat kertas origami dengan rapi','Psychomotor','early_elementary');

-- Late Elementary
INSERT INTO variables (code, label, category, age_group) VALUES
('L1','Mampu memahami konsep abstrak (seperti keadilan, toleransi, atau ekonomi dasar)','General Intellectual','late_elementary'),
('L2','Suka berdebat secara logis mengenai suatu topik dengan orang tua atau guru','General Intellectual','late_elementary'),
('L3','Suka membaca novel anak atau artikel pengetahuan yang panjang','General Intellectual','late_elementary'),
('L4','Mampu menulis karangan atau esai pendek dengan alur pemikiran yang runtut','General Intellectual','late_elementary'),
('L5','Cepat memahami materi matematika sekolah yang kompleks (pecahan desimal, bangun ruang)','Specific Academic','late_elementary'),
('L6','Mampu membaca dan membuat grafik atau tabel sederhana secara mandiri','Specific Academic','late_elementary'),
('L7','Suka melakukan eksperimen sains sekolah dan antusias mencatat hasilnya','Specific Academic','late_elementary'),
('L8','Tertarik pada teknologi baru, pemrograman komputer dasar, atau robotik','Specific Academic','late_elementary'),
('L9','Suka mendesain sesuatu (misal poster digital, maket rumah, atau pakaian boneka)','Creative Thinking','late_elementary'),
('L10','Sering memberikan ide-ide orisinal dalam proyek kelompok sekolah','Creative Thinking','late_elementary'),
('L11','Suka mengapresiasi karya seni, musik klasik, atau film dengan ulasan kritis sendiri','Creative Thinking','late_elementary'),
('L12','Tertarik mempelajari budaya, bahasa, atau sejarah daerah/negara lain','Creative Thinking','late_elementary'),
('L13','Sering ditunjuk atau bersedia menjadi ketua kelas atau pemimpin kelompok','Leadership','late_elementary'),
('L14','Mampu mengorganisir teman-teman untuk menyelesaikan proyek kelompok dengan baik','Leadership','late_elementary'),
('L15','Mampu menerima kegagalan dalam lomba dengan sikap sportif dan positif','Leadership','late_elementary'),
('L16','Mampu membantu menyelesaikan perselisihan antara teman-temannya secara adil','Leadership','late_elementary'),
('L17','Mampu membuat lukisan atau karya seni tiga dimensi dengan teknik dan arsiran yang baik','Visual & Performing Arts','late_elementary'),
('L18','Mahir menggunakan media digital untuk menggambar atau mengedit foto/video','Visual & Performing Arts','late_elementary'),
('L19','Bisa memainkan satu alat musik dengan baik (misal gitar, keyboard, atau biola)','Visual & Performing Arts','late_elementary'),
('L20','Mampu menciptakan gerakan tari atau melodi lagu sederhana sendiri','Visual & Performing Arts','late_elementary'),
('L21','Menguasai teknik dasar olahraga tim (seperti sepak bola, basket, atau bulu tangkis)','Psychomotor','late_elementary'),
('L22','Memiliki kelincahan, kekuatan, dan daya tahan fisik yang menonjol dalam olahraga','Psychomotor','late_elementary'),
('L23','Suka membongkar dan memperbaiki mainan mekanik atau barang elektronik yang rusak','Psychomotor','late_elementary'),
('L24','Memiliki ketelitian tinggi dalam menjahit, merakit model miniatur, atau kerajinan tangan presisi','Psychomotor','late_elementary');

-- ============================================================
-- 6. Isi ulang: INDICATOR_VARIABLES (Level 1)
-- ============================================================
INSERT INTO indicator_variables (indicator_code, variable_code) VALUES
('I1','C1'),('I1','C2'),('I1','C3'),
('I2','C4'),('I2','C5'),('I2','C6'),('I2','C7'),('I2','C8'),('I2','C9'),
('I3','C10'),('I3','C11'),('I3','C12'),('I3','C13'),('I3','C14'),
('I4','C15'),('I4','C16'),('I4','C17'),('I4','C18'),
('I5','C19'),('I5','C20'),('I5','C21'),('I5','C22'),('I5','C23'),('I5','C24'),('I5','C25'),
('I6','C26'),('I6','C27'),
('I7','C28'),('I7','C29'),('I7','C30'),('I7','C31'),('I7','C32'),
('I8','C33'),('I8','C34'),
('I9','C35'),('I9','C36'),
('I10','C37'),('I10','C38'),('I10','C39'),('I10','C40'),
('I11','C41'),('I11','C42'),('I11','C43'),
('I12','C44'),('I12','C45'),('I12','C46'),
('I13','C47'),('I13','C48'),
('I14','C49'),('I14','C50'),
('I15','C51'),('I15','C52'),
('I16','C53'),('I16','C54'),('I16','C55'),('I16','C56'),('I16','C57'),
('I17','C58'),('I17','C59'),
('I18','C60'),('I18','C61'),('I18','C62'),
('I19','C63'),('I19','C64'),
('I20','C65'),('I20','C66'),
('I21','C67'),('I21','C68'),
('I22','C69'),
('I23','C70'),('I23','C71'),('I23','C72'),
('I24','C73'),('I24','C74'),
('I25','C75'),('I25','C76'),('I25','C77'),
('I26','C78'),('I26','C79'),('I26','C80'),('I26','C81'),
('I27','C82'),('I27','C83');

-- Toddler
INSERT INTO indicator_variables (indicator_code, variable_code) VALUES
('TI1','T1'),('TI1','T2'),('TI2','T3'),('TI2','T4'),
('TI3','T5'),('TI3','T6'),('TI4','T7'),('TI4','T8'),
('TI5','T9'),('TI5','T10'),('TI6','T11'),('TI6','T12');

-- Early Elementary
INSERT INTO indicator_variables (indicator_code, variable_code) VALUES
('EI1','E1'),('EI1','E2'),('EI2','E3'),('EI2','E4'),
('EI3','E5'),('EI3','E6'),('EI4','E7'),('EI4','E8'),
('EI5','E9'),('EI5','E10'),('EI6','E11'),('EI6','E12'),
('EI7','E13'),('EI7','E14'),('EI8','E15'),('EI8','E16'),
('EI9','E17'),('EI9','E18'),('EI10','E19'),('EI10','E20'),
('EI11','E21'),('EI11','E22'),('EI12','E23'),('EI12','E24');

-- Late Elementary
INSERT INTO indicator_variables (indicator_code, variable_code) VALUES
('LI1','L1'),('LI1','L2'),('LI2','L3'),('LI2','L4'),
('LI3','L5'),('LI3','L6'),('LI4','L7'),('LI4','L8'),
('LI5','L9'),('LI5','L10'),('LI6','L11'),('LI6','L12'),
('LI7','L13'),('LI7','L14'),('LI8','L15'),('LI8','L16'),
('LI9','L17'),('LI9','L18'),('LI10','L19'),('LI10','L20'),
('LI11','L21'),('LI11','L22'),('LI12','L23'),('LI12','L24');

-- ============================================================
-- 7. Isi ulang: CRITERION_INDICATORS (Level 2)
-- ============================================================
INSERT INTO criterion_indicators (criterion_code, indicator_code) VALUES
('K1','I1'),('K1','I2'),('K1','I3'),
('K2','I4'),('K2','I5'),
('K3','I6'),('K3','I7'),('K3','I8'),('K3','I9'),('K3','I10'),('K3','I11'),('K3','I12'),('K3','I13'),
('K4','I14'),('K4','I15'),('K4','I16'),('K4','I17'),('K4','I18'),
('K5','I19'),('K5','I20'),('K5','I21'),('K5','I22'),
('K6','I23'),('K6','I24'),('K6','I25'),('K6','I26'),('K6','I27');

-- Toddler
INSERT INTO criterion_indicators (criterion_code, indicator_code) VALUES
('TK1','TI1'),('TK2','TI2'),('TK3','TI3'),
('TK4','TI4'),('TK5','TI5'),('TK6','TI6');

-- Early Elementary
INSERT INTO criterion_indicators (criterion_code, indicator_code) VALUES
('EK1','EI1'),('EK1','EI2'),('EK2','EI3'),('EK2','EI4'),
('EK3','EI5'),('EK3','EI6'),('EK4','EI7'),('EK4','EI8'),
('EK5','EI9'),('EK5','EI10'),('EK6','EI11'),('EK6','EI12');

-- Late Elementary
INSERT INTO criterion_indicators (criterion_code, indicator_code) VALUES
('LK1','LI1'),('LK1','LI2'),('LK2','LI3'),('LK2','LI4'),
('LK3','LI5'),('LK3','LI6'),('LK4','LI7'),('LK4','LI8'),
('LK5','LI9'),('LK5','LI10'),('LK6','LI11'),('LK6','LI12');

PRAGMA foreign_keys = ON;

SELECT 'Reset selesai!' as status,
  (SELECT COUNT(*) FROM variables) as total_variables,
  (SELECT COUNT(*) FROM indicators) as total_indicators,
  (SELECT COUNT(*) FROM criterions) as total_criteria,
  (SELECT COUNT(*) FROM indicator_variables) as total_iv_mappings,
  (SELECT COUNT(*) FROM criterion_indicators) as total_ci_mappings;
