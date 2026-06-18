import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const TOTAL_QUESTIONS = 83

interface Question {
  id: number
  category: string
  code: string
  text: string
  example: string
}

const questions: Question[] = [
  // Bahasa & Intelektual Umum (C1-C14)
  { id: 1, category: 'Bahasa & Intelektual Umum', code: 'C1', text: 'Apakah anak dapat menirukan kalimat sederhana dengan jelas?', example: 'Misal: Menirukan kalimat "Ayo kita pergi bermain" secara lengkap tanpa salah ucap.' },
  { id: 2, category: 'Bahasa & Intelektual Umum', code: 'C2', text: 'Apakah anak dapat meniru kembali 4-5 urutan kata yang didengarnya?', example: 'Misal: Mengulangi kata "meja, kursi, buku, lemari" setelah diucapkan oleh orang tua.' },
  { id: 3, category: 'Bahasa & Intelektual Umum', code: 'C3', text: 'Apakah anak dapat mengulangi kalimat panjang yang baru didengarnya secara presisi?', example: 'Misal: Mengulangi instruksi "Tolong ambilkan krayon warna biru di atas meja belajar kakak."' },
  { id: 4, category: 'Bahasa & Intelektual Umum', code: 'C4', text: 'Apakah anak dapat menyanyikan lagu anak-anak lebih dari 20 lagu yang berbeda?', example: 'Misal: Menghafal lirik dan melodi lagu anak seperti Balonku, Pelangi, Bintang Kecil, dll.' },
  { id: 5, category: 'Bahasa & Intelektual Umum', code: 'C5', text: 'Apakah anak dapat menyebutkan simbol-simbol huruf vokal dan konsonan yang ditunjuk?', example: 'Misal: Menunjuk dan melafalkan huruf \'A\', \'B\', \'C\', \'O\', \'U\' pada poster atau kartu kata.' },
  { id: 6, category: 'Bahasa & Intelektual Umum', code: 'C6', text: 'Apakah anak mengucapkan syair lagu secara lantang sambil bersenandung mengikuti irama?', example: 'Misal: Bernyanyi dengan keras dan berirama tanpa malu-malu saat mendengar musik.' },
  { id: 7, category: 'Bahasa & Intelektual Umum', code: 'C7', text: 'Apakah anak dapat mengelompokkan benda-benda sekitar berdasarkan kesamaan fungsinya?', example: 'Misal: Mengumpulkan semua mainan mobil-mobilan di satu kotak, dan balok kayu di kotak lainnya.' },
  { id: 8, category: 'Bahasa & Intelektual Umum', code: 'C8', text: 'Apakah anak dapat meniru penulisan berbagai lambang huruf vokal dan konsonan di atas kertas?', example: 'Misal: Menyalin tulisan huruf vokal/konsonan yang dicontohkan di buku tulis.' },
  { id: 9, category: 'Bahasa & Intelektual Umum', code: 'C9', text: 'Apakah anak dapat mengelompokkan peralatan makan, mandi, dan kebersihan secara terpisah?', example: 'Misal: Membedakan piring/sendok dengan sabun/sikat gigi ke tempatnya masing-masing.' },
  { id: 10, category: 'Bahasa & Intelektual Umum', code: 'C10', text: 'Apakah anak dapat menggunakan kata tanya (apa, mengapa, di mana, berapa, bagaimana) dengan tepat?', example: 'Misal: Sering bertanya "Mengapa daun warnanya hijau?" atau "Berapa banyak mainan ini?".' },
  { id: 11, category: 'Bahasa & Intelektual Umum', code: 'C11', text: 'Apakah anak dapat bercerita secara runtut tentang gambar yang disediakan atau gambarnya sendiri?', example: 'Misal: Menjelaskan gambar rumah dengan cerita "Ini rumahku, ada pohon besar di sampingnya dan awan di atas".' },
  { id: 12, category: 'Bahasa & Intelektual Umum', code: 'C12', text: 'Apakah anak aktif menggunakan kata ganti orang (aku, saya, kamu, mereka) dalam percakapan sehari-hari?', example: 'Misal: Menyatakan "Aku mau makan buah" atau "Mereka sedang bermain di luar".' },
  { id: 13, category: 'Bahasa & Intelektual Umum', code: 'C13', text: 'Apakah anak dapat menceritakan kembali pengalaman menarik atau kejadian sederhana yang dialaminya?', example: 'Misal: Menceritakan kunjungannya ke kebun binatang atau kejadian saat bermain di taman sekolah.' },
  { id: 14, category: 'Bahasa & Intelektual Umum', code: 'C14', text: 'Apakah anak dapat memberikan keterangan lengkap atau informasi spontan tentang suatu hal?', example: 'Misal: Tiba-tiba bercerita "Tadi kucing warna jingga itu melompati pagar rumah tetangga".' },

  // Akademik Khusus (C15-C25)
  { id: 15, category: 'Akademik Khusus', code: 'C15', text: 'Apakah anak dapat menyebutkan urutan bilangan 1 sampai 10 secara runtut?', example: 'Misal: Lancar berhitung satu sampai sepuluh tanpa ada angka yang terlewat.' },
  { id: 16, category: 'Akademik Khusus', code: 'C16', text: 'Apakah anak dapat menunjuk lambang bilangan 1 sampai 10 yang ditulis secara acak?', example: 'Misal: Menunjuk angka 7 dengan benar saat ditanyakan pada kartu angka acak.' },
  { id: 17, category: 'Akademik Khusus', code: 'C17', text: 'Apakah anak dapat meniru penulisan lambang bilangan 1 sampai 10?', example: 'Misal: Menyalin penulisan angka 3 atau 8 di atas kertas pasir atau buku tulis.' },
  { id: 18, category: 'Akademik Khusus', code: 'C18', text: 'Apakah anak mengenal dan menyebutkan lambang bilangan 1 sampai 20?', example: 'Misal: Mampu mengidentifikasi angka belasan (11-20) pada buku atau jam dinding.' },
  { id: 19, category: 'Akademik Khusus', code: 'C19', text: 'Apakah anak dapat membedakan dan membuat dua kumpulan benda berdasarkan jumlah kuantitasnya?', example: 'Misal: Membagi 5 permen di kiri dan 3 permen di kanan, lalu menyebutkan mana yang lebih banyak.' },
  { id: 20, category: 'Akademik Khusus', code: 'C20', text: 'Apakah anak mengenal perbedaan bentuk geometri benda (lingkaran, segitiga, persegi)?', example: 'Misal: Menunjuk jam dinding sebagai bulat dan atap rumah sebagai segitiga.' },
  { id: 21, category: 'Akademik Khusus', code: 'C21', text: 'Apakah anak mencoba mencampur warna cat dan antusias menceritakan perubahan warnanya?', example: 'Misal: Mencampur kuning dengan biru, lalu gembira berteriak "Wah, jadi hijau!".' },
  { id: 22, category: 'Akademik Khusus', code: 'C22', text: 'Apakah anak suka bereksperimen menaruh benda ke air lalu menceritakan peristiwa tenggelam atau terapung?', example: 'Misal: Memasukkan batu (tenggelam) dan daun (terapung) ke dalam wadah air saat mandi atau bermain.' },
  { id: 23, category: 'Akademik Khusus', code: 'C23', text: 'Apakah anak dapat menirukan dan menceritakan macam-macam bunyi alam atau kendaraan di sekitar?', example: 'Misal: Menirukan bunyi hujan "tik-tik", bunyi petir, atau klakson mobil "tin-tin".' },
  { id: 24, category: 'Akademik Khusus', code: 'C24', text: 'Apakah anak dapat mengenali dan menceritakan perbedaan macam-macam rasa makanan?', example: 'Misal: Menyebut gula itu manis, garam itu asin, dan obat itu pahit dengan ekspresif.' },
  { id: 25, category: 'Akademik Khusus', code: 'C25', text: 'Apakah anak dapat menceritakan berbagai jenis bau wewangian atau bau tak sedap secara spesifik?', example: 'Misal: Menyebut bau masakan ibu harum atau bau tempat sampah busuk.' },

  // Kreatif & Seni (C26-C48)
  { id: 26, category: 'Kreatif & Seni', code: 'C26', text: 'Apakah anak mau mengungkapkan pendapat pribadinya secara sederhana?', example: 'Misal: Mengusulkan ide mainan atau kegiatan saat guru/orang tua bertanya.' },
  { id: 27, category: 'Kreatif & Seni', code: 'C27', text: 'Apakah anak menjawab pertanyaan dengan antusias ketika dimintai informasi atau keterangan?', example: 'Misal: Cepat dan bersemangat menjawab saat ditanya siapa nama temannya di sekolah.' },
  { id: 28, category: 'Kreatif & Seni', code: 'C28', text: 'Apakah anak secara spontan menyapa teman sebaya maupun orang dewasa yang dikenalnya?', example: 'Misal: Melambaikan tangan dan berseru "Halo!" saat berpapasan dengan teman di taman.' },
  { id: 29, category: 'Kreatif & Seni', code: 'C29', text: 'Apakah anak mengucapkan salam saat masuk ke dalam ruangan atau bertemu orang lain?', example: 'Misal: Mengucapkan "Assalamualaikum" atau "Selamat pagi" saat masuk kelas.' },
  { id: 30, category: 'Kreatif & Seni', code: 'C30', text: 'Apakah anak mengucapkan terima kasih secara sadar setelah menerima bantuan atau barang?', example: 'Misal: Mengatakan terima kasih saat diberi permen tanpa harus diingatkan terlebih dahulu.' },
  { id: 31, category: 'Kreatif & Seni', code: 'C31', text: 'Apakah anak dapat mengekspresikan perasaannya secara wajar?', example: 'Misal: Menangis sebentar saat sedih lalu tenang kembali setelah diberi penjelasan.' },
  { id: 32, category: 'Kreatif & Seni', code: 'C32', text: 'Apakah anak membuat perencanaan sederhana mengenai aktivitas bermain yang ingin dilakukannya?', example: 'Misal: Berkata "Nanti aku mau susun lego tinggi dulu, baru buat jalan mobil".' },
  { id: 33, category: 'Kreatif & Seni', code: 'C33', text: 'Apakah anak mampu mengambil keputusan sederhana sendiri?', example: 'Misal: Memilih baju warna merah dibanding biru saat bersiap untuk bepergian.' },
  { id: 34, category: 'Kreatif & Seni', code: 'C34', text: 'Apakah anak suka menggambar secara bebas dan ekspresif menggunakan krayon atau spidol?', example: 'Misal: Mencoret-coret kertas dengan warna-warni yang berani membentuk garis-garis imajinatif.' },
  { id: 35, category: 'Kreatif & Seni', code: 'C35', text: 'Apakah anak mampu membedakan perbuatan yang benar dan salah di lingkungannya?', example: 'Misal: Mengetahui bahwa membuang sampah sembarangan itu salah dan menaruhnya di tempat sampah itu benar.' },
  { id: 36, category: 'Kreatif & Seni', code: 'C36', text: 'Apakah anak suka menolong teman yang mengalami kesulitan atau terjatuh?', example: 'Misal: Spontan membantu membangunkan temannya yang tersandung di arena bermain.' },
  { id: 37, category: 'Kreatif & Seni', code: 'C37', text: 'Apakah anak mau bermain dengan siapa saja tanpa membedakan latar belakang atau fisik?', example: 'Misal: Langsung bergaul dengan anak baru tanpa ragu-ragu.' },
  { id: 38, category: 'Kreatif & Seni', code: 'C38', text: 'Apakah anak menghargai hasil gambar atau susunan balok karya temannya?', example: 'Misal: Tidak merusak menara balok yang dibuat temannya dan melihatnya dengan kagum.' },
  { id: 39, category: 'Kreatif & Seni', code: 'C39', text: 'Apakah anak mengakui dan memuji keunggulan atau kemampuan yang dimiliki temannya?', example: 'Misal: Memuji temannya dengan berkata "Wah, lari kamu cepat sekali!".' },
  { id: 40, category: 'Kreatif & Seni', code: 'C40', text: 'Apakah anak menginisiasi permainan dengan mengajak teman-teman sekitarnya bergabung?', example: 'Misal: Berkata "Ayo kita main petak umpet bersama!".' },
  { id: 41, category: 'Kreatif & Seni', code: 'C41', text: 'Apakah anak mudah memberi maaf kepada teman yang tidak sengaja menyakitinya atau merusak mainannya?', example: 'Misal: Berkata "Tidak apa-apa kok" ketika baloknya tidak sengaja tersenggol runtuh oleh teman.' },
  { id: 42, category: 'Kreatif & Seni', code: 'C42', text: 'Apakah anak dapat berinteraksi secara ramah dengan teman yang berbeda latar belakang atau agama?', example: 'Misal: Menghormati saat temannya berdoa sebelum makan dengan cara yang berbeda.' },
  { id: 43, category: 'Kreatif & Seni', code: 'C43', text: 'Apakah anak memberikan pujian verbal kepada teman yang berbuat baik atau berhasil?', example: 'Misal: Mengatakan "Gambar buatanmu bagus sekali!" secara spontan.' },
  { id: 44, category: 'Kreatif & Seni', code: 'C44', text: 'Apakah anak berpakaian rapi dan menjaga kesopanan selama berada di sekolah atau tempat umum?', example: 'Misal: Merapikan bajunya sendiri setelah dari kamar mandi atau menjaga sikap di restoran.' },
  { id: 45, category: 'Kreatif & Seni', code: 'C45', text: 'Apakah anak menghormati guru, orang tua, dan orang yang berusia lebih tua?', example: 'Misal: Mencium tangan orang tua saat berpamitan pergi sekolah atau berbicara dengan nada lembut.' },
  { id: 46, category: 'Kreatif & Seni', code: 'C46', text: 'Apakah anak mendengarkan dengan tenang ketika guru atau temannya sedang berbicara?', example: 'Misal: Tidak memotong pembicaraan orang lain dan memperhatikan dengan kontak mata.' },
  { id: 47, category: 'Kreatif & Seni', code: 'C47', text: 'Apakah anak menjaga dan memelihara hasil karyanya sendiri agar tidak rusak?', example: 'Misal: Menyimpan gambar buatannya dengan rapi di laci atau menaruh mainan balok ke tempatnya.' },
  { id: 48, category: 'Kreatif & Seni', code: 'C48', text: 'Apakah anak mentaati aturan dan kesepakatan dalam permainan bersama teman?', example: 'Misal: Tidak berbuat curang saat bermain ular tangga atau bersedia menjadi pencari saat bermain petak umpet.' },

  // Kepemimpinan (C49-C62)
  { id: 49, category: 'Kepemimpinan', code: 'C49', text: 'Apakah anak berani bertanya kritis dan menjawab pertanyaan di depan umum/kelas?', example: 'Misal: Mengacungkan tangan tinggi-tinggi saat guru bertanya atau menanyakan keheranan ilmiah.' },
  { id: 50, category: 'Kepemimpinan', code: 'C50', text: 'Apakah anak bertanggung jawab merapikan mainan atau menyelesaikan tugas pribadinya?', example: 'Misal: Mengembalikan lego ke wadahnya setelah selesai bermain tanpa harus disuruh berkali-kali.' },
  { id: 51, category: 'Kepemimpinan', code: 'C51', text: 'Apakah anak fokus menyelesaikan tugas mandirinya dari awal sampai tuntas tanpa menyerah?', example: 'Misal: Terus mewarnai gambarnya sampai selesai meskipun teman-teman lain sudah mulai bermain.' },
  { id: 52, category: 'Kepemimpinan', code: 'C52', text: 'Apakah anak dapat melaksanakan 3-5 instruksi berurutan dengan benar?', example: 'Misal: Mampu mengingat perintah: "Ambil tasmu, pakai sepatumu, lalu tunggu bunda di teras".' },
  { id: 53, category: 'Kepemimpinan', code: 'C53', text: 'Apakah anak dapat membagi peran dan menyelesaikan tugas kelompok dengan gembira?', example: 'Misal: Mengatur temannya "Kamu yang cari daun, aku yang tempel di kertas ya".' },
  { id: 54, category: 'Kepemimpinan', code: 'C54', text: 'Apakah anak dapat bekerja sama secara aktif dengan teman sebayanya dalam tim?', example: 'Misal: Membantu memegang kardus saat temannya menempelkan perekat saat membuat prakarya bersama.' },
  { id: 55, category: 'Kepemimpinan', code: 'C55', text: 'Apakah anak senang berinteraksi sosial dan mudah beradaptasi dengan lingkungan baru?', example: 'Misal: Cepat akrab dan mulai mengobrol dengan anak lain saat berkunjung ke tempat rekreasi baru.' },
  { id: 56, category: 'Kepemimpinan', code: 'C56', text: 'Apakah anak berinisiatif membantu teman kelompoknya yang tertinggal atau mengalami kesulitan?', example: 'Misal: Membantu membagikan krayon untuk teman sebangkunya yang belum memilikinya.' },
  { id: 57, category: 'Kepemimpinan', code: 'C57', text: 'Apakah anak mau menengahi dan membantu meredakan konflik di antara teman bermainnya?', example: 'Misal: Berkata "Sudah jangan berebut, kita mainnya gantian saja ya".' },
  { id: 58, category: 'Kepemimpinan', code: 'C58', text: 'Apakah anak mau berbagi makanan atau alat tulis secara sukarela kepada teman?', example: 'Misal: Memberikan sebagian biskuit bekalnya kepada teman yang tidak membawa makanan.' },
  { id: 59, category: 'Kepemimpinan', code: 'C59', text: 'Apakah anak bersedia meminjamkan mainan miliknya kepada teman lain tanpa harus dipaksa?', example: 'Misal: Menyodorkan boneka atau mobil-mobilan kesayangannya saat teman datang berkunjung.' },
  { id: 60, category: 'Kepemimpinan', code: 'C60', text: 'Apakah anak sabar menunggu antrean atau gilirannya saat bermain?', example: 'Misal: Menunggu di belakang perosotan dengan tenang sampai anak di depannya meluncur ke bawah.' },
  { id: 61, category: 'Kepemimpinan', code: 'C61', text: 'Apakah anak dapat mengendalikan emosi secara wajar saat keinginannya tidak terpenuhi?', example: 'Misal: Tidak menangis menjerit-jerit atau melempar barang ketika dilarang membeli permen.' },
  { id: 62, category: 'Kepemimpinan', code: 'C62', text: 'Apakah anak dapat menerima saran atau masukan sederhana dari guru atau orang tua dengan tenang?', example: 'Misal: Mau memperbaiki cara memegang pensil saat diarahkan tanpa merajuk atau marah.' },

  // Seni Visual & Pertunjukan (C63-C69)
  { id: 63, category: 'Seni Visual & Pertunjukan', code: 'C63', text: 'Apakah anak dapat melukiskan bentuk nyata yang dilihat atau didengarnya dengan proporsi yang baik?', example: 'Misal: Menggambar kucing lengkap dengan telinga segitiga, kaki empat, dan ekor panjang di tempatnya.' },
  { id: 64, category: 'Seni Visual & Pertunjukan', code: 'C64', text: 'Apakah anak mampu menggambar pola gabungan dari bentuk dasar titik, garis, lingkaran, dan segitiga?', example: 'Misal: Menggabungkan persegi dan segitiga untuk membentuk sebuah rumah dengan matahari bulat di atasnya.' },
  { id: 65, category: 'Seni Visual & Pertunjukan', code: 'C65', text: 'Apakah anak dapat membunyikan ketukan teratur pada alat musik anak (seperti angklung atau kolintang)?', example: 'Misal: Memukul alat musik mainan mengikuti tempo lambat dan cepat secara konsisten.' },
  { id: 66, category: 'Seni Visual & Pertunjukan', code: 'C66', text: 'Apakah anak dapat membedakan bunyi nada tinggi dan rendah dengan tepat?', example: 'Misal: Mengenali suara burung bernada tinggi dan suara gong bernada rendah secara intuitif.' },
  { id: 67, category: 'Seni Visual & Pertunjukan', code: 'C67', text: 'Apakah anak dapat menyelaraskan gerakan tubuhnya sesuai irama lagu atau musik pengiring?', example: 'Misal: Menari berputar dan melompat tepat mengikuti ketukan lagu tari yang diputar.' },
  { id: 68, category: 'Seni Visual & Pertunjukan', code: 'C68', text: 'Apakah anak menampilkan ekspresi wajah yang sesuai saat menari atau bercerita?', example: 'Misal: Memasang wajah terkejut yang berlebihan saat menceritakan tokoh dongeng yang kaget.' },
  { id: 69, category: 'Seni Visual & Pertunjukan', code: 'C69', text: 'Apakah anak mampu bermain peran secara total memerankan karakter tertentu?', example: 'Misal: Berpura-pura menjadi dokter dengan suara berwibawa memeriksa detak jantung bonekanya.' },

  // Psikomotorik (C70-C83)
  { id: 70, category: 'Psikomotorik', code: 'C70', text: 'Apakah anak dapat berjalan, berlari, dan melompat secara seimbang?', example: 'Misal: Berlari cepat dan langsung berbelok tajam tanpa goyah atau jatuh.' },
  { id: 71, category: 'Psikomotorik', code: 'C71', text: 'Apakah anak dapat melempar dan menangkap bola kecil dengan terarah?', example: 'Misal: Menangkap bola kasti yang dilempar pelan dari jarak 2 meter menggunakan kedua tangannya.' },
  { id: 72, category: 'Psikomotorik', code: 'C72', text: 'Apakah anak dapat meniti di atas papan titian atau berjalan dengan tumit menyentuh jempol kaki secara bergantian?', example: 'Misal: Berjalan lurus di atas seutas tali yang dibentangkan di lantai dengan merentangkan tangannya.' },
  { id: 73, category: 'Psikomotorik', code: 'C73', text: 'Apakah anak dapat menggunakan alat makan (sendok, garpu, gelas) sendiri dengan rapi?', example: 'Misal: Menyendok sup makanan masuk ke mulutnya tanpa tumpah berceceran di meja.' },
  { id: 74, category: 'Psikomotorik', code: 'C74', text: 'Apakah anak dapat membuka/mengancingkan baju atau memakai sepatu sendiri?', example: 'Misal: Mampu memasukkan kancing baju ke lubangnya satu per satu dari atas ke bawah.' },
  { id: 75, category: 'Psikomotorik', code: 'C75', text: 'Apakah anak dapat menyusun balok tinggi atau merangkai puzzle dengan 12+ keping?', example: 'Misal: Menyusun menara balok setinggi 10 tingkat tanpa runtuh atau menyelesaikan puzzle gambar hewan.' },
  { id: 76, category: 'Psikomotorik', code: 'C76', text: 'Apakah anak dapat melipat kertas menjadi bentuk sederhana (seperti lipatan segitiga atau amplop)?', example: 'Misal: Melipat kertas lipat/origami menyatukan sudut-sudutnya dengan presisi sedang.' },
  { id: 77, category: 'Psikomotorik', code: 'C77', text: 'Apakah anak dapat menggunting kertas mengikuti garis pola (lurus, gelombang, atau lingkaran)?', example: 'Misal: Menggunting pola gambar lingkaran mengikuti garis hitam secara perlahan dan rapi.' },
  { id: 78, category: 'Psikomotorik', code: 'C78', text: 'Apakah anak dapat membuka dan memutar tutup botol atau toples dengan kekuatan tangannya sendiri?', example: 'Misal: Memutar kencang tutup botol minum mineral atau membuka toples makanan ringan.' },
  { id: 79, category: 'Psikomotorik', code: 'C79', text: 'Apakah anak dapat memutar mur mainan atau merakit komponen mainan bongkar pasang?', example: 'Misal: Memasang bagian roda mobil-mobilan mainan rakitan menggunakan obeng plastik mainannya.' },
  { id: 80, category: 'Psikomotorik', code: 'C80', text: 'Apakah anak memegang alat tulis dengan genggaman tiga jari (tripod grasp) secara benar?', example: 'Misal: Menjepit pensil di antara ibu jari, jari telunjuk, dan disangga jari tengah saat menggambar.' },
  { id: 81, category: 'Psikomotorik', code: 'C81', text: 'Apakah anak dapat mengetuk palu mainan atau memasukkan pasak kayu ke dalam lubangnya secara presisi?', example: 'Misal: Memukul pasak mainan kayu hingga masuk rata ke dalam lubang papan pasak.' },
  { id: 82, category: 'Psikomotorik', code: 'C82', text: 'Apakah anak dapat berdiri dengan satu kaki selama 5-10 detik secara stabil?', example: 'Misal: Mengangkat kaki kirinya dan berdiri tegak dengan kaki kanan tanpa limbung saat berolahraga pagi.' },
  { id: 83, category: 'Psikomotorik', code: 'C83', text: 'Apakah anak dapat bergantung atau berayun pada palang besi di arena bermain dengan kuat?', example: 'Misal: Menggantungkan tubuhnya pada monkey bar selama beberapa detik menggunakan kekuatan tangannya.' },
]

const likertOptions = [
  { value: 1, label: 'Tidak Pernah' },
  { value: 2, label: 'Jarang' },
  { value: 3, label: 'Kadang' },
  { value: 4, label: 'Sering' },
  { value: 5, label: 'Selalu' },
]

const categoryInsights: Record<string, string> = {
  'Bahasa & Intelektual Umum': 'Intelektual Umum mencakup kemampuan verbal dan memori dasar. Tahap ini membantu mengidentifikasi potensi dasar komunikasi anak.',
  'Akademik Khusus': 'Akademik Khusus menilai kemampuan numerik dan logis yang mendasari potensi akademik di bidang sains dan matematika.',
  'Kreatif & Seni': 'Kreativitas mencerminkan kemampuan anak untuk berpikir orisinal dan mengekspresikan diri melalui berbagai media artistik.',
  'Kepemimpinan': 'Kepemimpinan mencakup kecerdasan sosial, kemampuan memotivasi orang lain, dan inisiatif dalam situasi kelompok.',
  'Seni Visual & Pertunjukan': 'Seni Visual & Pertunjukan menilai kepekaan estetika anak pada bidang seni rupa, musik, drama, dan ekspresi gerak tubuh.',
  'Psikomotorik': 'Psikomotorik menilai koordinasi fisik, ketangkasan, dan kemampuan kinestetik anak dalam aktivitas sehari-hari.',
}

const QUESTIONS_PER_PAGE = 5
const TOTAL_PAGES = Math.ceil(TOTAL_QUESTIONS / QUESTIONS_PER_PAGE)

export default function AssessmentPage() {
  const { pageId } = useParams()
  const navigate = useNavigate()
  const currentPage = parseInt(pageId || '1', 10)
  const [answers, setAnswers] = useState<Record<number, number>>(() => {
    const cached = sessionStorage.getItem('assessment_answers')
    return cached ? JSON.parse(cached) : {}
  })
  const [animating, setAnimating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE
  const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, TOTAL_QUESTIONS)
  const pageQuestions = questions.slice(startIndex, endIndex)

  const progress = ((currentPage - 1) / TOTAL_PAGES) * 100
  const pageCategory = pageQuestions[0]?.category || 'Assessment'
  
  // Check if all questions on this page are answered
  const allAnswered = pageQuestions.every((q) => answers[q.id] !== undefined)

  useEffect(() => {
    document.title = `Assessment Wizard — Page ${currentPage} | TalentaKu`
    setAnimating(true)
    const t = setTimeout(() => setAnimating(false), 50)
    return () => clearTimeout(t)
  }, [currentPage])

  // Persist answers to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('assessment_answers', JSON.stringify(answers))
  }, [answers])

  async function handleNext() {
    if (!allAnswered) {
      alert('Silakan jawab semua pertanyaan di halaman ini sebelum melanjutkan.')
      return
    }
    if (currentPage >= TOTAL_PAGES) {
      setSubmitting(true)
      setSubmitError(null)
      const consId = sessionStorage.getItem('consultation_id')
      if (!consId) {
        setSubmitError('Sesi penilaian tidak ditemukan. Silakan mulai ulang dari halaman awal.')
        setSubmitting(false)
        return
      }

      // Format answers from Record<number, number> to array of { variable_code: string, score: number }
      const payloadAnswers = questions.map((q) => ({
        variable_code: q.code,
        score: answers[q.id] || 3, // Default fallback to 3
      }))

      try {
        const res = await fetch(`http://localhost:8080/api/consultation/${consId}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: payloadAnswers }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Gagal menyimpan hasil penilaian.')
        }

        // Navigate to the results page for this assessment
        navigate(`/results/${consId}`)
      } catch (err: any) {
        setSubmitError(err.message || 'Gagal mengirimkan jawaban. Silakan coba lagi.')
      } finally {
        setSubmitting(false)
      }
      return
    }

    setAnimating(true)
    setTimeout(() => navigate(`/assessment/${currentPage + 1}`), 200)
  }

  function handleBack() {
    if (currentPage <= 1) return
    navigate(`/assessment/${currentPage - 1}`)
  }

  function confirmExit() {
    if (confirm('Apakah Anda yakin ingin menghentikan sesi penilaian ini? Kemajuan Anda tidak akan disimpan.')) {
      sessionStorage.removeItem('assessment_answers')
      navigate('/')
    }
  }

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-[#f7f9fb]/80 glass-header sticky top-0 z-50 flex justify-between items-center w-full px-4 md:px-10 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#3525cd] text-3xl">psychology</span>
          <span className="text-2xl font-bold text-[#3525cd]">TalentaKu</span>
        </div>
        <button
          onClick={confirmExit}
          className="flex items-center gap-2 text-[#464555] text-sm font-semibold hover:text-[#3525cd] transition-colors px-4 py-2 rounded-lg"
        >
          <span className="material-symbols-outlined">close</span>
          <span className="hidden md:inline">Keluar Sesi</span>
        </button>
      </header>

      {/* Global Progress Bar */}
      <div className="w-full h-1.5 bg-[#eceef0]">
        <div
          className="h-full bg-[#3525cd] transition-all duration-700 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        {/* Category & Progress Info */}
        <div
          className={`max-w-[850px] w-full mb-8 animate-slide-in transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#57dffe] text-[#006172] text-xs font-semibold mb-2">
                <span className="material-symbols-outlined text-sm mr-1.5">category</span>
                {pageCategory}
              </span>
              <h2 className="text-2xl md:text-[32px] font-bold text-[#191c1e]">Evaluasi Bakat Anak</h2>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-[#464555]">Halaman {currentPage} dari {TOTAL_PAGES}</p>
              <div className="w-32 h-1 bg-[#eceef0] rounded-full mt-2 ml-auto overflow-hidden">
                <div className="h-full bg-[#00687a]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <section
          className={`max-w-[850px] w-full bg-white p-6 md:p-10 rounded-[2rem] border border-[#e0e3e5] shadow-sm transition-all duration-200 ${animating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto mb-10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#eceef0] text-xs font-bold text-[#464555] uppercase tracking-wider">
                  <th className="pb-4 text-left font-semibold text-[#464555]">Variabel Perilaku</th>
                  {likertOptions.map((opt) => (
                    <th key={opt.value} className="pb-4 text-center font-semibold text-[#464555] px-2 w-[85px]">
                      <span className="block text-sm font-bold text-[#191c1e]">{opt.value}</span>
                      <span className="text-[9px] text-[#777587] font-normal block mt-0.5 capitalize">{opt.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eceef0]/60">
                {pageQuestions.map((q) => {
                  const selectedVal = answers[q.id]
                  return (
                    <tr key={q.id} className="hover:bg-[#f8fafc]/50 transition-colors">
                      <td className="py-4 pr-4 align-top">
                        <div className="flex gap-3 items-start">
                          <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#3525cd]/15 text-[#3525cd] text-[10px] font-bold font-mono mt-0.5">{q.code}</span>
                          <div className="space-y-0.5">
                            <p className="text-sm text-[#191c1e] font-medium leading-relaxed">{q.text}</p>
                            {q.example && <p className="text-xs text-[#777587] italic">{q.example}</p>}
                          </div>
                        </div>
                      </td>
                      {likertOptions.map((opt) => (
                        <td key={opt.value} className="py-4 text-center align-middle px-2">
                          <label className="cursor-pointer inline-flex items-center justify-center p-0.5 group">
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={opt.value}
                              checked={selectedVal === opt.value}
                              onChange={() => setAnswers({ ...answers, [q.id]: opt.value })}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center font-semibold text-xs transition-all group-hover:scale-105 ${
                              selectedVal === opt.value
                                ? 'bg-[#3525cd] text-white border-[#3525cd] shadow-[0_4px_8px_rgba(53,37,205,0.2)] scale-110'
                                : 'bg-[#eceef0] border-transparent text-[#464555] group-hover:bg-[#e0e3e5]/70'
                            }`}>
                              {opt.value}
                            </div>
                          </label>
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden flex flex-col gap-6 mb-10">
            {pageQuestions.map((q) => {
              const selectedVal = answers[q.id]
              return (
                <div key={q.id} className="border-b border-[#eceef0]/80 pb-6 last:border-0 last:pb-0 space-y-3">
                  <div className="flex gap-2 items-start">
                    <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-[#3525cd]/15 text-[#3525cd] text-[10px] font-bold font-mono mt-0.5">{q.code}</span>
                    <div>
                      <p className="text-base text-[#191c1e] font-medium leading-normal">{q.text}</p>
                      {q.example && <p className="text-xs text-[#777587] italic mt-1">{q.example}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {likertOptions.map((opt) => (
                      <label key={opt.value} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <input
                          type="radio"
                          name={`mobile-question-${q.id}`}
                          value={opt.value}
                          checked={selectedVal === opt.value}
                          onChange={() => setAnswers({ ...answers, [q.id]: opt.value })}
                          className="sr-only"
                        />
                        <div className={`w-full aspect-square flex items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                          selectedVal === opt.value
                            ? 'bg-[#3525cd] text-white border-[#3525cd] shadow-[0_3px_6px_rgba(53,37,205,0.2)] scale-105'
                            : 'bg-[#eceef0] border-transparent text-[#464555]'
                        }`}>
                          {opt.value}
                        </div>
                        <span className="text-[8px] font-medium text-[#777587] text-center truncate max-w-full capitalize">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 rounded-lg text-red-800 text-sm flex items-start gap-2 shadow-sm">
              <span className="material-symbols-outlined text-red-600 text-lg">error</span>
              <span>{submitError}</span>
            </div>
          )}

          {/* Wizard Controls */}
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentPage <= 1 || submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#e0e3e5] text-sm font-semibold text-[#464555] hover:bg-[#eceef0] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Sebelumnya
            </button>
            <button
              onClick={handleNext}
              disabled={submitting}
              className="flex items-center gap-2 px-10 py-3 rounded-xl bg-[#3525cd] text-white text-sm font-semibold shadow-lg shadow-[#3525cd]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin">sync</span>
                  Memproses...
                </>
              ) : currentPage >= TOTAL_PAGES ? (
                'Lihat Hasil'
              ) : (
                'Berikutnya'
              )}
              {!submitting && (
                <span className="material-symbols-outlined">
                  {currentPage >= TOTAL_PAGES ? 'emoji_events' : 'arrow_forward'}
                </span>
              )}
            </button>
          </div>
        </section>

        {/* Encouraging Quote */}
        <div className="max-w-[850px] w-full mt-12 text-center">
          <div className="p-6 rounded-2xl bg-[#f2f4f6] border border-dashed border-[#c7c4d8] inline-block max-w-sm">
            <p className="text-sm font-semibold text-[#464555] italic">
              "Setiap anak adalah bintang yang bersinar dengan caranya sendiri. Mari kita temukan cahayanya bersama."
            </p>
          </div>
        </div>
      </main>

      {/* Desktop Floating Insight */}
      <aside className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 w-64 bg-[#e6e8ea]/50 p-6 rounded-3xl border border-[#e0e3e5]">
        <h4 className="text-sm font-semibold text-[#3525cd] mb-3">Informasi Kategori</h4>
        <p className="text-xs text-[#464555] leading-relaxed">
          {categoryInsights[pageCategory]}
        </p>
        <div className="mt-6 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#464555]">Metode Forward Chaining</span>
        </div>
      </aside>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-10 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-[#e0e3e5]/50">
        <p className="text-xs text-[#464555]">© 2024 TalentaKu Expert Systems. Profesional & Bersahabat.</p>
        <div className="flex gap-6">
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Bantuan</a>
          <a href="#" className="text-xs text-[#464555] hover:text-[#3525cd] transition-colors">Kebijakan Privasi</a>
        </div>
      </footer>
    </div>
  )
}
