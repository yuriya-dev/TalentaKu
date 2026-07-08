**SISTEM PAKAR PENENTUAN BAKAT ANAK DENGAN MENGGUNAKAN METODE *FORWARD CHAINING***   
   
 

# **Febi Nur Salisah1, Leony Lidya2, Sarjon Defit3** 

1Jurusan Sistem Informasi, Fakultas Sains dan Teknologi, UIN SUSKA, Riau 

2,3UPI – YPTK Padang 

Email: 1febinursalisah@uin-suska.ac.id, 2leony@if-unpas,org, 3sarjon\_d@hotmail.com  

   
 

# **ABSTRAK** 

Saat ini masih banyak orang tua yang belum mengetahui bakat pada anak mereka. Sedikitnya jumlah pakar untuk berkonsultasi merupakan salah satu penyebab hal ini. Penelitian ini menggunakan sistem pakar untuk mengatasi permasalahan tersebut. Sistem pakar akan memindahkan kemampuan pakar tersebut ke dalam komputer. Bakat-bakat yang digunakan dalam penelitian ini adalah bakat anak menurut standar USOE America. Untuk mesin inferensi penelitian ini menggunakan forward chaining. Anak-anak yang diidentifikasi bakatnya adalah anak TK usia 4-6 tahun.  Hasil analisa menunjukan bahwa sistem pakar ini membutuh 27 indikator, 83 variabel dan 33 rule. Berdasarkan hasil percobaan, sistem pakar ini berhasil mengidentifkasi 

bakat anak. 

**Kata kunci :** bakat anak, forward chaining, sistem pakar 

    
 

1. # **PENDAHULUAN** 

Identifikasi bakat anak merupakan hal yang sangat penting dilakukan. Hal ini dikarenakan setiap anak memerlukan program pendidikan yang sesuai dengan bakat mereka masing-masing sehingga dapat mengembangkan dan menggunakan bakat mereka secara maksimal. Lucy \[1\] menyatakan bahwa disekolah ditemukan kurang lebih 40% anak berbakat yang tidak mampu berprestasi sesuai dengan kemampuan mereka sehingga tergolong sebagai anak kurang berprestasi. 

Saat ini masih banyak orang tua dan guru sebagai penanggung jawab dalam keberlangsungan pendidikan anak yang belum mengetahui bakat pada anak mereka. 

Terbatasnya jumlah pakar untuk berkonsultasi tentang bakat anak merupakan salah satu penyebab hal ini. Penelitian ini menggunakan sistem pakar untuk mengatasi permasalahan tersebut. Sistem pakar bisa digunakan karena sistem pakar adalah sistem yang menggunakan pengetahuan, fakta, dan teknik penalaran untuk pemecahan masalah \[2\] akan memindahkan kemampuan pakar tersebut ke dalam komputer. 

Kelompok anak yang digunakan pada penelitian ini adalah anak taman kanak-kanak (TK) dengan usia 4-6 tahun. Kelompok usia tersebut dipilih karena menurut Santrock dan Yussen \[3\] pada usia tersebut merupakan masa yang penting untuk meletakkan dasar bagi seseorang di masa dewasa. Bakat-bakat yang akan diidentifikasi pada penelitian ini adalah bakat-bakat menurut US Office Of Education (USOE) America \[4\]. 

Penelitian ini menggunakan forward chaining untuk mesin inferensi di sistem pakar yang dibangun. Teknik inferensi ini dipilih karena teknik ini telah sukses digunakan untuk sistem pakar pada berbagai bidang \[5, 6, 7\]. 

 

2. # **KAJIAN LITERATUR** 

1. Sistem Pakar 

Sistem pakar adalah program komputer yang meniru kemampuan beberapa pakar di bidang tertentu dalam memecahkan masalah seperti para pakar tersebut memecahkan masalah dalam bidangnya \[8\]. Proses peniruan tersebut melibatkan empat hal \[9\], yaitu: (1) akuisisi pengetahuan, (2) representasi pengetahuan, (3) inferensi pengetahuan, (4) pemindahan pengetahuan ke pengguna. 

 

2. *Forward Chaining* 

Inferensi merupakan kumpulan prosedur yang bertujuan untuk melakukan penalaran \[9\]. Inferensi tersebut diimplementasikan di mesin inferensi. Mesin ini berfungsi untuk mengambil kesimpulan berdasarkan basis pengetahuan yang dimilikinya. 

| Jurnal Rekayasa dan Manajemen Sistem Informasi, Vol. 1, No. 1, Februari 2015, pp.62-66   |
| :---- |

Salah satu teknik inferensi yang sering digunakan adalah forward chaining. Forward chaining atau sering juga disebut bottom up reasoning adalah cara penarikan kesimpulan yang dimulai dengan data atau fakta yang ada lalu bergerak maju melalui premis-premis untuk menuju ke kesimpulan \[5\]. Pada teknik ini data digunakan sebagai penentu aturan mana yang harus dijalankan, kemudian aturan tersebut dijalankan \[6\]. 

 

3. Bakat Anak 

Bakat adalah kemampuan alamiah untuk memperoleh pengetahuan atau keterampilan yang bisa bersifat umum atau khusus \[10\]. Perbedaan bakat anak bisa dilihat dari berbagai aspek, seperti IQ, bakat, minat, kemampuan, kepribadian, kondisi fisik, pengalaman, perkembangan dan interaksi social. 

Ada enam bakat menurut *US Office Of Education* (USOE) *America* \[4\], yaitu: (1) intelektual umum; (2) akademik khusus; (3) berfikir kreatif-produktif; (4) kemampuan memimpin; (5) bidang seni dan pertunjukkan; (6) kemampuan psikomotor. 

 

3. # **METODE PENELITIAN** 

Penelitian ini dibagi menjadi tiga buah tahap, yaitu: (1) tahap inisialisasi; (2) tahap analisa dan perancangan; (3) tahap implementasi dan pengujian. Untuk lebih jelasnya perhatikan Gambar 1\. 

Tahap pertama adalah tahap inisialisasi. Pada tahap ini dilakukan identifikasi masalah dengan cara mewawancarai pakar psikologi anak, guru taman kanak-kanak (TK) dan orang tua. 

Identifkasi masalah juga dilakukan melalui studi pustaka terhadap buku-buku, jurnal-jurnal dan karya ilmiah lainnya yang berhubungan dengan bakat anak. Setelah itu dilakukan analisis dari hasil identifiasi masalah untuk menentukan tujuan dan ruang lingkup dari penelitian ini. 

**Tahap Inisialisasi**

Identifikasi masalah

Penentuan tujuan

Penentuan ruang lingkup

**Tahap Analisa dan Perancangan**

Penentuan kriteriaPenentuan kriteria

Penentuan variablePenentuan variable

Pembuatan rulePembuatan rule

## ISSN 2460-8181 

   
Tahap kedua adalah tahap analisa dan perancangan. Pada tahap ini dianalisa kriteria untuk setiap bakat anak yang digunakan. Setelah itu dianalisa variabel-variabel yang dibutuhkan dari kriteria-kriteria yang dihasilkan. Hal terahir yang dilakukan pada tahap ini adalah perancangan aturan-aturan (rule) yang dibutuhkan untuk sitem pakar ini. 

Tahap terakhir adalah tahap implementasi dan pengujian. Pada tahap ini dibuat sistem pakar berdasarkan aturan-aturan yang telah dibuat di tahap kedua. Setelah itu dilakukan pengujian terhadap sistem pakar dengan cara mengukur akurasi dari sistem pakar. Akurasi dihitung dengan cara membandingkan antara hasil pendeteksian bakat yang dilakukan oleh sistem pakar dan hasil pendeteksian bakat yang dilakukan oleh pakar. Untuk lebih jelasnya perhatikan rumus berikut ini. 

 

        (1) 

     
   
Jumlah benar adalah jumlah hasil pendeteksian bakat yang sama antara yang dilakukan sistem pakar dan yang dilakukan oleh pakar. Jumlah data yang digunakan adalah 100 buah yang didapat dari TK Negeri Pembina II Pekanbaru. 

 

4. # **HASIL DAN PEMBAHASAN** A. 	Hasil Analisa 

Berdasarkan hasil analisa, untuk mengidentifikasi bakat anak menurut standar USOE America \[4\] (lihat Tabel 4\) diperlukan 27 indikator, 83 variabel dan 33 aturan (rule). 

   
Tabel 1\. Jenis-jenis bakat anak \[4\] 

| Kode   | Kriteria bakat anak  |
| :---: | ----- |
| K1  | Intelektual Umum  |
| K2  | Akademik Khusus  |
| K3  | Berpikir kreatif dan Produktif  |
| K4  | Kepemimpinan  |
| K5  | Seni Visual dan Pertunjukan  |
| K6  | Psikomotorik  |

   
Tabel 2\. berikut ini adalah daftar indikator yang digunakan untuk mendeteksi bakat anak menurut standar USOE America \[4\]. 

 

|  Kode   Indikator bakat anak    I1  Tingkat perbendaharaan kata yang tinggi  I2  Mempunyai Ingatan kuat  I3  Penguasaan kata \- kata abstrak  I4  Memiliki Pemikiran abstrak  I5  Memiliki Prestasi bidang matematika  I6  Memiliki Prestasi sains  I7  Keterbukaan terhadap pengalaman  I8  Menetapkan standar personal  Tahap Implementasi dan Pengujian Pembuatan sistem pakarPembuatan sistem pakar Pengujian sistem pakarPengujian sistem pakar   Gambar 1\. Metodologi Penelitian  63    |
| ----- |

Tabel 2\. Tabel Indikator bakat anak 

| I9  | Kemampuan memainkan ide-ide  |
| :---- | :---- |
| I10  | Keinginan untuk menghadapi resiko  |
| I11  | Kesukaan terhadap kompleksitas  |
| I12  | Toleran terhadap ambiguitas  |
| I13  | Image diri yang positif  |
| I14  | Kemampuan menyatu dengan tugas  |
| I15  | Kepercayaan diri  |
| I16  | Tanggung jawab  |
| I17  | Kerja sama  |
| I18  | Kecenderungan untuk mendominasi  |
| I19  | Beradaptasi dengan mudah terhadap situasi yang baru  |
| I20  | Keterbakatan dalam bidang seni visual  |
| I21  | Keterbakatan dalam bidang seni musik  |
| I22  | Keterbakatan dalam bidang drama  |
| I23  | Kemampuan motorik kinestetik  |
| I24  | Keterampilan praktik  |
| I25  | Keterampilan spasial  |
| I26  | Keterampilan mekanika  |
| I27  | Keterampilan fisikal  |

   
Bakat anak intelektual umum (K1) memerlukan 14 buah variabel dalam pengidentifikasiannya. 

Untuk lebih jelasnya perhatikan Tabel 3 : 

   
Tabel 3\. Variabel intelektual umum 

| Kode   | Variabel bakat anak    |
| :---: | ----- |
| C1  | Dapat menirukan kalimat sederhana  |
| C2  | Dapat meniru kembali 4-5 urutan kata  |
| C3  | Mengulangi kalimat yang sudah didengarnya  |
| C4  | Menyanyikan lagu anak-anak lebih dari 20 lebih lagu   |
| C5  | Dapat menyebutkan simbol-simbol huruf vokal dan konsonan  |
| C6  | Mengucapkan syair lagu sambil diiringi senandung lagunya  |
| C7  | Dapat mengelompokkan benda dengan berbagai cara menurut fungsinya  |
| C8  | Meniru berbagai lambang huruf vokal dan konsonan  |
| C9  | Mengelompokkan benda dengan berbagai cara menurut fungsinya : misalnya peralatan makan, peralatan mandi, peralatan kebersihan  |
| C10  | Dapat Menggunakan dan dapat menjawab pertanyaan apa, mengapa, dimana, berapa, bagaimana, dsb  |
| C11  | Bercerita tentang gambar yang disediakan atau dibuat sendiri  |
| C12  | Bercerita menggunakan kata ganti aku, saya, kamu, mereka, dlL  |
| C13  | Menceritakan pengalaman/kejadian secara sederhana  |
| C14  | Memberikan keterangan/informasi tentang suatu haL  |

   
Bakat anak akademik khusus (K2) memerlukan 11 buah variabel dalam pengidentifikasiannya. 

Untuk lebih jelasnya perhatikan Tabel 4 : 

   
Tabel 4\. Variabel akademik khusus 

| Kode   | Variabel bakat anak    |
| :---: | ----- |
| C15  | Dapat menyebutkan urutan bilangan 1-10  |
| C16  | Dapat menunjuk lambang bilangan 1-10  |
| C17  | Meniru lambang bilangan 1-10  |
| C18  | Mengenal lambang bilangan 1-20  |
| C19  | Membedakan dan membuat dua kumpulan benda berdasarkan kuantitasnya.  |
| C20  | Mengenal perbedaan benda berdasarkan bentuknya   |

| C21  | Mencoba dan menceritakan tentang proses pencampuran warna.  |
| :---- | :---- |
| C22  | Mencoba dan menceritakan tentang proses benda-benda dimasukkan kedalam air   (terapung, melayang, tenggelam)  |
| C23  | Menceritakan macam-macam bunyi  |
| C24  | Menceritakan macam-macam rasa  |
| C25  | Menceritakan macam-macam bau  |

   
Bakat anak berfikir kreatif dan produktif (K3) memerlukan 23 buah variabel dalam pengidentifikasiannya. Untuk lebih jelasnya perhatikan Tabel 5 : 

   
Tabel 5\. Variabel berpikir kreatif dan produktif 

| Kode   | Variabel bakat anak    |
| :---: | ----- |
| C26  | Mau mengungkapkan pendapat secara sederhana  |
| C27  | Menjawab pertanyaan tentang informasi/keterangan   |
| C28  | Menyapa teman dan orang lain  |
| C29  | Mengucapkan salam  |
| C30  | Selalu mengucapkan terima kasih jika memperoleh sesuatu  |
| C31  | Mengekspresikan perasaannya, misalnya :  marah, sedih, gembira, dll  |
| C32  | Membuat perencanaan kegiatan yang dilakukan anak  |
| C33  | Mampu mengambil keputusan secara sederhana  |
| C34  | Menggambar bebas dengan berbagai media   |
| C35  | Mau menunjukkan perbuatan yang benar dan yang salah  |
| C36  | Suka menolong  |
| C37  | Mau bermain dengan teman sebaya tanpa membedakan : warna kulit, keturunan, rambut, agama, dll   |
| C38  | Menghargai hasil karya teman/orang lain  |
| C39  | Menghargai keunggulan teman/orang lain  |
| C40  | Mengajak teman untuk bermain  |
| C41  | Mau menolong dan memberi maaf  |
| C42  | Dapat hidup berdampingan dengan teman agama lain  |
| C43  | Memuji teman atau orang lain  |
| C44  | Berpakaian rapi dan sopan  |
| C45  | Menghormati guru, orang tua dan orang yang lebih tua  |
| C46  | Mendengarkan dan memperhatikan teman yang berbicara  |
| C47  | Memelihara hasil karya sendiri  |
| C48  | Mentaati aturan permainan  |

   
Bakat anak kepemimpinan (K4) memerlukan 14 buah variabel dalam pengidentifikasiannya. Untuk lebih jelasnya perhatikan Tabel 6 : 

   
Tabel 6\. Variabel kepemimpinan 

| Kode   | Variabel bakat anak    |
| :---: | ----- |
| C49  | Berani bertanya dan menjawab pertanyaan   |
| C50  | Bertanggung jawab akan tugasnya  |
| C51  | Melaksanakan tugas sendiri sampai selesai  |
| C52  | Melakukan 3-5 perintah secara berurutan dengan benar  |
| C53  | Dapat melaksanakan tugas kelompok   |
| C54  | Dapat bekerja sama dengan teman  |
| C55  | Mau bermain dengan teman  |
| C56  | Saling membantu sesama teman  |
| C57  | Mau membantu memecahkan perselisihan/permasalahan  |

| C58  | Mau berbagi dengan teman  |
| :---- | :---- |
| C59  | Mau meminjamkan miliknya  |
| C60  | Sabar menunggu giliran  |
| C61  | Mengendalikan emosi dengan cara wajar  |
| C62  | Dapat menerima kritik  |

| Jurnal Rekayasa dan Manajemen Sistem Informasi, Vol. 1, No. 1, Februari 2015, pp.62-66   |
| :---- |

   
Bakat anak seni visual dan pertunjukan (K5) memerlukan 	7 	buah 	variabel 	dalam pengidentifikasiannya. 	Untuk 	lebih 	jelasnya perhatikan Tabel 7 :   
 

| Kode   | Variabel bakat anak    |
| :---- | ----- |
| C63  | Melukiskan apa yang dilihat, didengar dalam sebuah kertas   |
| C64  | Menggambar bebas dari bentuk dasar titik, garis, lingkaran, segitiga, segiempat  |
| C65  | Dapat memainkan alat musik, seperti angklunh, piano  |
| C66  | Dapat memahami tangga nada  |
| C67  | Mengekspresikan gerakan sesuai dengan syair lagi/cerita, iringan musik/lagu  |
| C68  | Mengekspresikan diri dalam gerakan  |
| C69  | Mampu bermain peran  |

Tabel 7\. Variabel seni visual dan pertunjukan 

   
Bakat anak psikomotorik (K6) memerlukan 14 buah variabel dalam pengidentifikasiannya. Untuk lebih jelasnya perhatikan Tabel 8 : 

   
Tabel 8\. Variabel psikomotorik 

**if** C1 **and** C2 a**nd** C3 **then** I1 

2. **if** C4 **and** C5 **and** C6 **and** C7 **and** C8 **and** C9 **then** I2 

3. **if** C10 **and** C11 **and** C12 **and** C13 **and** 

   C14 **then** I3 

4. **if** I1 **and** I2 a**nd** I3 **then** K1 

5. **if** C15 **and** C16 a**nd** C17 a**nd** C18 **then** 

   I4 

6. **if** C19 **and** C20 a**nd** C21 a**nd** C22 a**nd** C23 a**nd** C24 a**nd** C25 **then** I5 

7. **if** I4 **and** I5 **then** K2 

8. **if** C26 **and** C27 **then** I6 

9. **if** C28 **and** C29 a**nd** C30 a**nd** C31 a**nd** 

   C32 **then** I7 

10. **if** C33 **and** C34 **then** I8 

11. **if** C35 **and** C36 **then** I9 

12. **if** C37 **and** C38 a**nd** C39 a**nd** C40 **then** I10 

13. **if** C41 **and** C42 a**nd** C43 **then** I11 

14. **if** C44 **and** C45 a**nd** C46 **then** I12 

15. **if** C47 **and** C48 **then** I13 

16. **if** I6 **and** I7 a**nd** I8 a**nd** I9 a**nd** I10 a**nd** I11 a**nd** I12 a**nd** I13 **then** K3 

17. **if** C49 **and** C50 **then** I14 

18. **if** C51 **and** C52 **then** I15 

19. **if** C53 **and** C54 **and** C55 **and** C56 **and** 

    C57 **then** I16 

20. **if** C58 **and** C59 **then** I17 

21. **if** C60 **and** C61 **and** C62 **then** I18 

22. **if** I14 **and** I15 a**nd** I16 a**nd** I17 a**nd** 

    I18 **then** K4 

23. **if** C63 **and** C64 **then** I19 

24. **if** C65 **and** C66 **then** I20 

25. **if** C67 **and** C68 **then** I21 

26. **if** C69 **then** I22 

27. **if** I19 **and** I20 a**nd** I21 a**nd** I22 **then** K5 

28. **if** C70 **and** C71 **and** C72 **then** I23 

65 

 

## ISSN 2460-8181 

29. **if** C73 **and** C74 **then** I24 

30. **if** C75 **and** C76 **and** C77 **then** I25 

31. **if** C78 **and** C79 **and** C80 **and** C81 **then** I26 

32. **if** C82 **and** C83 **then** I27 

33. **if** I23 **and** I24 a**nd** I25 a**nd** I26 a**nd** 

I27 **then** K6 

   
B. Implementasi 

Gambar 2\. adalah antarmuka form identifkasi bakat anak. Form ini berfungsi sebagai tempat memasukan variabel bakat anak oleh pengguna. 

   
   
Gambar 2\. Form identifikasi bakat anak 

   
Setelah pengguna memilih variabel-variabel yang ada pada anak maka pengguna menekan tombol periksa konsultasi untuk melihat hasil identifikasi bakat anak. Pada sistem akan dilakukan inferensi dengan metode forward chaining untuk menentukan bakat anak. Setelah itu, pada tampilan akan muncul form seperti pada Gambar 3\. 

   
   
Gambar 3\. Tampilah hasil identifikasi bakat anak 

 

5. # **KESIMPULAN** 

Hasil analisa menunjukan bahwa sistem pakar ini memerlukan 27 indikator, 83 variabel dan 33 rule. Mesin inferensi forward chaining berhasil digunakan untuk mengidentifikasi bakat anak menurut standar USOE America \[4\]. 

   
 

# **REFERENSI** 

1\) Lucy, Bunda. 2010\. Mendidik Sesuai Minat dan Bakat Anak (Painting Your Children’s Future). Jakarta: PT. Tangga Pustaka. 2\) Kusrini. 2006\. Sistem Pakar (Teori dan Aplikasi). Yogyakarta: Andi Offset. 

3) Santrock, J.W. dan Yussen S.R.(1992). Child Development. Edisi 5\. Dubuque LA: Wm.C. Brown. 

4) Kathena, J. 1992\. Gifted: Challege and response of educatio. Itasca Illinois: Peacock Publ. Inc. 

5) Mohamad, S. N. dan Hashim, A. B. 2015\. Forward-Chaining Approach to Expert System for Machine Maintenance. Proceedings of Mechanical Engineering Research Day 2015\. MERD'15, 2015\. Hal. 79-80. 

6) Brezovan, M. dan Badica, C. 2015\. Event-B Modeling of a Rule Base for an Expert System Using Forward Chaining. Proceedings of the 7th Balkan Conference on Informatics Conference ACM. Hal. 7 

7) Fakhrahmad, S. M., Sadreddini, M. H., dan Zolghadri Jahromi, M. 2015\. A Proposed 

Expert System for Word Sense Disambiguation: Deductive Ambiguity Resolution Based on Data Mining and Forward Chaining. Expert Systems. 32(2): 178-191. 