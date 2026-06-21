package db

import (
	"log"

	"backend/models"
	"gorm.io/gorm"
)

func SeedData(db *gorm.DB) {
	// 0. Update empty or null age_group fields to "preschool" for backward compatibility
	db.Model(&models.Variable{}).Where("age_group = ? OR age_group IS NULL", "").Update("age_group", "preschool")
	db.Model(&models.Indicator{}).Where("age_group = ? OR age_group IS NULL", "").Update("age_group", "preschool")
	db.Model(&models.Criterion{}).Where("age_group = ? OR age_group IS NULL", "").Update("age_group", "preschool")

	// 1. Seed Settings
	var settingCount int64
	db.Model(&models.Setting{}).Count(&settingCount)
	if settingCount == 0 {
		log.Println("Seeding Settings...")
		settings := []models.Setting{
			{Key: "likert_threshold", Value: "4"},
			{Key: "app_name", Value: "TalentaKu"},
		}
		db.Create(&settings)
	}

	// 2. Seed Admin User
	var adminCount int64
	db.Model(&models.AdminUser{}).Count(&adminCount)
	if adminCount == 0 {
		log.Println("Seeding Admin User...")
		admin := models.AdminUser{
			Email:        "admin@talentaku.com",
			PasswordHash: "admin123", // Simple plain password for MVP testing, or we can implement hashing
			Role:         "superadmin",
		}
		db.Create(&admin)
	}

	// 3. Seed Criteria (K1-K6)
	var criteriaCount int64
	db.Model(&models.Criterion{}).Count(&criteriaCount)
	if criteriaCount == 0 {
		log.Println("Seeding Criteria...")
		criteria := []models.Criterion{
			{
				Code:        "K1",
				Label:       "Intelektual Umum",
				Description: "Kemampuan intelektual anak yang menyeluruh, mencakup daya tangkap verbal yang baik, ingatan yang kuat, serta kemampuan berpikir dan menggunakan kata-kata abstrak di atas rata-rata usianya.",
				Suggestions: "Dukung dengan membacakan buku cerita interaktif, ajak berdiskusi tentang kejadian sehari-hari, berikan permainan kata-kata (tebak kata), dan dorong anak menceritakan kembali kegiatannya secara terstruktur.",
			},
			{
				Code:        "K2",
				Label:       "Akademik Khusus",
				Description: "Kemampuan menonjol anak pada bidang akademik tertentu, khususnya penguasaan konsep angka/matematika dasar, pemahaman kuantitas benda, serta keingintahuan ilmiah terhadap alam sekitar (sains anak usia dini).",
				Suggestions: "Fasilitasi dengan permainan hitung-menghitung benda nyata, puzzle angka, eksperimen sains sederhana di rumah (seperti mencampur warna atau menenggelamkan benda), serta eksplorasi alam terbuka.",
			},
			{
				Code:        "K3",
				Label:       "Berpikir Kreatif dan Produktif",
				Description: "Kemampuan mengemukakan ide unik, menggambar ekspresif, menunjukkan empati sosial yang tinggi, mandiri dalam bertindak, serta menghargai karya orang lain.",
				Suggestions: "Sediakan beragam media seni (cat, krayon, tanah liat), hargai setiap gagasan barunya tanpa langsung mengoreksi, libatkan dalam kegiatan bermain peran yang membutuhkan penyelesaian konflik sederhana secara mandiri.",
			},
			{
				Code:        "K4",
				Label:       "Kepemimpinan",
				Description: "Kemampuan sosial untuk memimpin teman sebaya, bertanggung jawab terhadap tugas mandiri maupun kelompok, bekerja sama dengan baik, mengendalikan emosi, serta bersikap kooperatif.",
				Suggestions: "Berikan tanggung jawab kecil di rumah (merapikan mainan), libatkan dalam permainan kelompok bergiliran (board games), latih anak mendengarkan pendapat orang lain, dan berikan apresiasi saat ia mau berbagi.",
			},
			{
				Code:        "K5",
				Label:       "Seni Visual dan Pertunjukan",
				Description: "Kepekaan estetika yang tinggi pada bidang visual (melukis/menggambar detail), musik (peka nada dan ritme), serta seni pertunjukan (ekspresi gerakan tubuh dan bermain peran drama).",
				Suggestions: "Perkenalkan alat musik anak-anak, dengarkan lagu dengan berbagai ketukan, fasilitasi ruang untuk menari secara bebas mengikuti alunan musik, dan ajjak bermain peran (drama boneka/sandiwara boneka tangan).",
			},
			{
				Code:        "K6",
				Label:       "Psikomotorik",
				Description: "Keterampilan fisik dan motorik yang matang, mencakup keseimbangan motorik kasar (berlari, melompat, meniti) serta kelenturan motorik halus dan mekanis (melipat origami, menggunting pola, memanipulasi obeng mainan).",
				Suggestions: "Ajak melakukan aktivitas luar ruangan (bersepeda, memanjat jaring bermain, berdiri satu kaki), latih motorik halus dengan melipat kertas, menggunting pola gambar, merakit lego/mainan bongkar-pasang mekanik.",
			},
		}
		db.Create(&criteria)
	}

	// 4. Seed Indicators (I1-I27)
	var indicatorCount int64
	db.Model(&models.Indicator{}).Count(&indicatorCount)
	if indicatorCount == 0 {
		log.Println("Seeding Indicators...")
		indicators := []models.Indicator{
			{Code: "I1", Label: "Tingkat perbendaharaan kata yang tinggi"},
			{Code: "I2", Label: "Mempunyai ingatan kuat"},
			{Code: "I3", Label: "Penguasaan kata-kata abstrak"},
			{Code: "I4", Label: "Memiliki pemikiran abstrak"},
			{Code: "I5", Label: "Memiliki prestasi bidang matematika"},
			{Code: "I6", Label: "Memiliki prestasi sains"},
			{Code: "I7", Label: "Keterbukaan terhadap pengalaman"},
			{Code: "I8", Label: "Menetapkan standar personal"},
			{Code: "I9", Label: "Kemampuan memainkan ide-ide"},
			{Code: "I10", Label: "Keinginan untuk menghadapi resiko"},
			{Code: "I11", Label: "Kesukaan terhadap kompleksitas"},
			{Code: "I12", Label: "Toleran terhadap ambiguitas"},
			{Code: "I13", Label: "Image diri yang positif"},
			{Code: "I14", Label: "Kemampuan menyatu dengan tugas"},
			{Code: "I15", Label: "Kepercayaan diri"},
			{Code: "I16", Label: "Tanggung jawab"},
			{Code: "I17", Label: "Kerja sama"},
			{Code: "I18", Label: "Kecenderungan untuk mendominasi"},
			{Code: "I19", Label: "Beradaptasi dengan mudah terhadap situasi baru"},
			{Code: "I20", Label: "Keterbakatan dalam bidang seni visual"},
			{Code: "I21", Label: "Keterbakatan dalam bidang seni musik"},
			{Code: "I22", Label: "Keterbakatan dalam bidang drama"},
			{Code: "I23", Label: "Kemampuan motorik kinestetik"},
			{Code: "I24", Label: "Keterampilan praktik"},
			{Code: "I25", Label: "Keterampilan spasial"},
			{Code: "I26", Label: "Keterampilan mekanika"},
			{Code: "I27", Label: "Keterampilan fisikal"},
		}
		db.Create(&indicators)
	}

	// 5. Seed Variables (C1-C83)
	var variableCount int64
	db.Model(&models.Variable{}).Count(&variableCount)
	if variableCount == 0 {
		log.Println("Seeding Variables...")
		variables := []models.Variable{
			// K1
			{Code: "C1", Label: "Dapat menirukan kalimat sederhana dengan jelas", Category: "General Intellectual"},
			{Code: "C2", Label: "Dapat meniru kembali 4-5 urutan kata yang didengar", Category: "General Intellectual"},
			{Code: "C3", Label: "Mengulangi kalimat panjang yang baru saja didengarnya secara presisi", Category: "General Intellectual"},
			{Code: "C4", Label: "Menyanyikan lagu anak-anak lebih dari 20 lagu yang berbeda", Category: "General Intellectual"},
			{Code: "C5", Label: "Dapat menyebutkan simbol-simbol huruf vokal dan konsonan yang ditunjuk", Category: "General Intellectual"},
			{Code: "C6", Label: "Mengucapkan syair lagu secara lantang sambil bersenandung mengikuti irama", Category: "General Intellectual"},
			{Code: "C7", Label: "Dapat mengelompokkan benda-benda sekitar berdasarkan kesamaan fungsinya", Category: "General Intellectual"},
			{Code: "C8", Label: "Meniru penulisan berbagai lambang huruf vokal dan konsonan di atas kertas", Category: "General Intellectual"},
			{Code: "C9", Label: "Mengelompokkan peralatan makan, mandi, dan kebersihan secara terpisah", Category: "General Intellectual"},
			{Code: "C10", Label: "Menggunakan kata tanya (apa, mengapa, dimana, berapa, bagaimana) dengan tepat", Category: "General Intellectual"},
			{Code: "C11", Label: "Bercerita secara runtut tentang gambar yang disediakan atau buatannya sendiri", Category: "General Intellectual"},
			{Code: "C12", Label: "Aktif menggunakan kata ganti orang (aku, saya, kamu, mereka) dalam bercakap", Category: "General Intellectual"},
			{Code: "C13", Label: "Menceritakan kembali pengalaman menarik atau kejadian sederhana yang dialaminya", Category: "General Intellectual"},
			{Code: "C14", Label: "Memberikan keterangan lengkap atau informasi spontan tentang suatu hal", Category: "General Intellectual"},

			// K2
			{Code: "C15", Label: "Dapat menyebutkan urutan bilangan 1 sampai 10 secara runtut", Category: "Specific Academic"},
			{Code: "C16", Label: "Dapat menunjuk lambang bilangan 1 sampai 10 yang ditulis acak", Category: "Specific Academic"},
			{Code: "C17", Label: "Meniru penulisan lambang bilangan 1 sampai 10", Category: "Specific Academic"},
			{Code: "C18", Label: "Mengenal dan menyebutkan lambang bilangan 1 sampai 20", Category: "Specific Academic"},
			{Code: "C19", Label: "Membedakan dan membentuk dua kumpulan benda berdasarkan jumlah kuantitasnya", Category: "Specific Academic"},
			{Code: "C20", Label: "Mengenal perbedaan bentuk geometri benda (bulat, segitiga, kotak)", Category: "Specific Academic"},
			{Code: "C21", Label: "Mencoba mencampur warna cat dan antusias menceritakan perubahan warnanya", Category: "Specific Academic"},
			{Code: "C22", Label: "Suka bereksperimen menaruh benda ke air lalu menceritakan peristiwa tenggelam/terapung", Category: "Specific Academic"},
			{Code: "C23", Label: "Menirukan dan menceritakan macam-macam bunyi alam atau kendaraan sekitar", Category: "Specific Academic"},
			{Code: "C24", Label: "Mengenali dan menceritakan perbedaan macam-macam rasa makanan (manis, pahit, dll)", Category: "Specific Academic"},
			{Code: "C25", Label: "Menceritakan berbagai jenis bau wewangian atau bau tak sedap secara spesifik", Category: "Specific Academic"},

			// K3
			{Code: "C26", Label: "Mau mengungkapkan pendapat pribadinya secara sederhana dalam diskusi", Category: "Creative Thinking"},
			{Code: "C27", Label: "Menjawab pertanyaan dengan antusias ketika dimintai informasi atau keterangan", Category: "Creative Thinking"},
			{Code: "C28", Label: "Spontan menyapa teman sebaya maupun orang dewasa yang dikenalnya", Category: "Creative Thinking"},
			{Code: "C29", Label: "Mengucapkan salam saat masuk ruangan atau bertemu orang lain", Category: "Creative Thinking"},
			{Code: "C30", Label: "Mengucapkan terima kasih secara sadar setelah menerima sesuatu", Category: "Creative Thinking"},
			{Code: "C31", Label: "Mengekspresikan perasaannya (marah, sedih, gembira, cemas) secara wajar", Category: "Creative Thinking"},
			{Code: "C32", Label: "Membuat perencanaan sederhana mengenai aktivitas bermain yang ingin dilakukannya", Category: "Creative Thinking"},
			{Code: "C33", Label: "Mampu mengambil keputusan sederhana (misalnya memilih mainan atau pakaian sendiri)", Category: "Creative Thinking"},
			{Code: "C34", Label: "Menggambar secara bebas dan ekspresif menggunakan krayon/spidol", Category: "Creative Thinking"},
			{Code: "C35", Label: "Mampu membedakan perbuatan yang benar dan yang salah di lingkungannya", Category: "Creative Thinking"},
			{Code: "C36", Label: "Suka menolong teman yang mengalami kesulitan atau terjatuh", Category: "Creative Thinking"},
			{Code: "C37", Label: "Mau bermain dengan siapa saja tanpa membedakan latar belakang/perbedaan fisik", Category: "Creative Thinking"},
			{Code: "C38", Label: "Menghargai hasil gambar atau susunan balok karya temannya", Category: "Creative Thinking"},
			{Code: "C39", Label: "Mengakui dan memuji keunggulan atau kemampuan yang dimiliki temannya", Category: "Creative Thinking"},
			{Code: "C40", Label: "Menginisiasi permainan dengan mengajak teman-teman sekitar bergabung", Category: "Creative Thinking"},
			{Code: "C41", Label: "Mudah memberi maaf kepada teman yang tidak sengaja merusaknya/menyakitinya", Category: "Creative Thinking"},
			{Code: "C42", Label: "Dapat berinteraksi ramah dengan teman yang berbeda agama/keyakinan", Category: "Creative Thinking"},
			{Code: "C43", Label: "Memberikan pujian verbal kepada teman yang berbuat baik atau berhasil", Category: "Creative Thinking"},
			{Code: "C44", Label: "Berpakaian rapi dan menjaga kesopanan selama berada di sekolah/tempat umum", Category: "Creative Thinking"},
			{Code: "C45", Label: "Menghormati guru, orang tua, dan orang yang berusia lebih tua", Category: "Creative Thinking"},
			{Code: "C46", Label: "Mendengarkan dengan tenang ketika guru atau temannya sedang berbicara", Category: "Creative Thinking"},
			{Code: "C47", Label: "Menjaga dan memelihara hasil karyanya sendiri agar tidak rusak", Category: "Creative Thinking"},
			{Code: "C48", Label: "Mentaati aturan dan kesepakatan dalam permainan bersama teman", Category: "Creative Thinking"},

			// K4
			{Code: "C49", Label: "Berani mengajukan pertanyaan kritis dan menjawab pertanyaan guru di kelas", Category: "Leadership"},
			{Code: "C50", Label: "Bertanggung jawab merapikan mainan atau menyelesaikan tugas pribadinya", Category: "Leadership"},
			{Code: "C51", Label: "Fokus menyelesaikan tugas mandirinya dari awal sampai tuntas tanpa menyerah", Category: "Leadership"},
			{Code: "C52", Label: "Melaksanakan 3-5 perintah berurutan dengan benar (misal: ambil buku, taruh di meja, lalu duduk)", Category: "Leadership"},
			{Code: "C53", Label: "Dapat membagi peran dan menyelesaikan tugas kelompok dengan gembira", Category: "Leadership"},
			{Code: "C54", Label: "Dapat bekerja sama secara aktif dengan teman sebayanya dalam tim", Category: "Leadership"},
			{Code: "C55", Label: "Senang berinteraksi sosial dan bergaul dengan lingkungan baru", Category: "Leadership"},
			{Code: "C56", Label: "Inisiatif membantu teman kelompoknya yang tertinggal dalam aktivitas kelas", Category: "Leadership"},
			{Code: "C57", Label: "Menengahi dan mau membantu meredakan perselisihan di antara teman bermainnya", Category: "Leadership"},
			{Code: "C58", Label: "Mau berbagi makanan atau alat tulis secara suka rela kepada teman", Category: "Leadership"},
			{Code: "C59", Label: "Meminjamkan mainan miliknya kepada teman lain tanpa paksaan", Category: "Leadership"},
			{Code: "C60", Label: "Sabar mengantre atau menunggu gilirannya saat bermain bersama", Category: "Leadership"},
			{Code: "C61", Label: "Mengendalikan emosi dengan wajar saat keinginannya tidak terpenuhi", Category: "Leadership"},
			{Code: "C62", Label: "Menerima saran atau masukan sederhana dari guru/orang tua dengan tenang", Category: "Leadership"},

			// K5
			{Code: "C63", Label: "Melukiskan bentuk nyata yang dilihat atau didengarnya dengan proporsi baik", Category: "Visual & Performing Arts"},
			{Code: "C64", Label: "Mampu menggambar pola gabungan dari titik, garis, lingkaran, dan segitiga", Category: "Visual & Performing Arts"},
			{Code: "C65", Label: "Dapat membunyikan ketukan teratur pada alat musik anak (angklung, xylophone, dll)", Category: "Visual & Performing Arts"},
			{Code: "C66", Label: "Dapat membedakan bunyi nada tinggi dan rendah dengan tepat", Category: "Visual & Performing Arts"},
			{Code: "C67", Label: "Menyelaraskan gerakan tubuh secara indah sesuai syair lagu atau musik pengiring", Category: "Visual & Performing Arts"},
			{Code: "C68", Label: "Menampilkan ekspresi emosi wajah yang teatrikal saat menari atau bercerita", Category: "Visual & Performing Arts"},
			{Code: "C69", Label: "Bermain peran secara total memerankan karakter tertentu (misal: menjadi dokter/hewan)", Category: "Visual & Performing Arts"},

			// K6
			{Code: "C70", Label: "Berjalan, berlari, dan melompat secara seimbang (kemampuan motorik kasar dasar)", Category: "Psychomotor"},
			{Code: "C71", Label: "Melempar dan menangkap bola kecil dengan terarah (koordinasi mata dan tangan)", Category: "Psychomotor"},
			{Code: "C72", Label: "Meniti di atas papan titian atau berjalan dengan tumit ke jari kaki (keseimbangan dinamis)", Category: "Psychomotor"},
			{Code: "C73", Label: "Menggunakan sendok, garpu, dan cangkir minum sendiri dengan rapi (kemampuan motorik halus makan)", Category: "Psychomotor"},
			{Code: "C74", Label: "Membuka dan mengancingkan baju atau memakai tali sepatu sendiri (kemampuan motorik halus mandiri)", Category: "Psychomotor"},
			{Code: "C75", Label: "Menyusun balok tinggi atau merangkai puzzle 12+ keping (kemampuan spasial dan susun)", Category: "Psychomotor"},
			{Code: "C76", Label: "Melipat kertas menjadi bentuk sederhana seperti lipatan segitiga/amplop (kemampuan origami dasar)", Category: "Psychomotor"},
			{Code: "C77", Label: "Menggunting kertas mengikuti pola garis lurus, gelombang, atau lingkaran (kemampuan motorik koordinatif)", Category: "Psychomotor"},
			{Code: "C78", Label: "Membuka dan memutar tutup botol atau toples dengan tangan sendiri (kekuatan genggaman jari)", Category: "Psychomotor"},
			{Code: "C79", Label: "Memputar mur mainan atau merakit komponen mainan bongkar pasang (keterampilan mekanik dasar)", Category: "Psychomotor"},
			{Code: "C80", Label: "Memegang alat tulis (pensil/krayon) dengan tripod grasp yang benar (kontrol jemari menulis)", Category: "Psychomotor"},
			{Code: "C81", Label: "Menggunakan palu mainan atau memasukkan pasak kayu ke lubangnya (koordinasi mekanis presisi)", Category: "Psychomotor"},
			{Code: "C82", Label: "Berdiri dengan satu kaki selama 5-10 detik secara stabil (keseimbangan statis fisik)", Category: "Psychomotor"},
			{Code: "C83", Label: "Bergantung atau berayun pada palang besi di arena bermain (kekuatan fisik lengan dan punggung)", Category: "Psychomotor"},
		}
		db.Create(&variables)
	}

	// 6. Seed IndicatorVariable (Relation mapping Level 1)
	var mappingCount1 int64
	db.Model(&models.IndicatorVariable{}).Count(&mappingCount1)
	if mappingCount1 == 0 {
		log.Println("Seeding IndicatorVariable mappings (Level 1)...")
		mappings1 := []models.IndicatorVariable{
			// I1: C1, C2, C3
			{IndicatorCode: "I1", VariableCode: "C1"},
			{IndicatorCode: "I1", VariableCode: "C2"},
			{IndicatorCode: "I1", VariableCode: "C3"},

			// I2: C4, C5, C6, C7, C8, C9
			{IndicatorCode: "I2", VariableCode: "C4"},
			{IndicatorCode: "I2", VariableCode: "C5"},
			{IndicatorCode: "I2", VariableCode: "C6"},
			{IndicatorCode: "I2", VariableCode: "C7"},
			{IndicatorCode: "I2", VariableCode: "C8"},
			{IndicatorCode: "I2", VariableCode: "C9"},

			// I3: C10, C11, C12, C13, C14
			{IndicatorCode: "I3", VariableCode: "C10"},
			{IndicatorCode: "I3", VariableCode: "C11"},
			{IndicatorCode: "I3", VariableCode: "C12"},
			{IndicatorCode: "I3", VariableCode: "C13"},
			{IndicatorCode: "I3", VariableCode: "C14"},

			// I4: C15, C16, C17, C18
			{IndicatorCode: "I4", VariableCode: "C15"},
			{IndicatorCode: "I4", VariableCode: "C16"},
			{IndicatorCode: "I4", VariableCode: "C17"},
			{IndicatorCode: "I4", VariableCode: "C18"},

			// I5: C19, C20, C21, C22, C23, C24, C25
			{IndicatorCode: "I5", VariableCode: "C19"},
			{IndicatorCode: "I5", VariableCode: "C20"},
			{IndicatorCode: "I5", VariableCode: "C21"},
			{IndicatorCode: "I5", VariableCode: "C22"},
			{IndicatorCode: "I5", VariableCode: "C23"},
			{IndicatorCode: "I5", VariableCode: "C24"},
			{IndicatorCode: "I5", VariableCode: "C25"},

			// I6: C26, C27
			{IndicatorCode: "I6", VariableCode: "C26"},
			{IndicatorCode: "I6", VariableCode: "C27"},

			// I7: C28, C29, C30, C31, C32
			{IndicatorCode: "I7", VariableCode: "C28"},
			{IndicatorCode: "I7", VariableCode: "C29"},
			{IndicatorCode: "I7", VariableCode: "C30"},
			{IndicatorCode: "I7", VariableCode: "C31"},
			{IndicatorCode: "I7", VariableCode: "C32"},

			// I8: C33, C34
			{IndicatorCode: "I8", VariableCode: "C33"},
			{IndicatorCode: "I8", VariableCode: "C34"},

			// I9: C35, C36
			{IndicatorCode: "I9", VariableCode: "C35"},
			{IndicatorCode: "I9", VariableCode: "C36"},

			// I10: C37, C38, C39, C40
			{IndicatorCode: "I10", VariableCode: "C37"},
			{IndicatorCode: "I10", VariableCode: "C38"},
			{IndicatorCode: "I10", VariableCode: "C39"},
			{IndicatorCode: "I10", VariableCode: "C40"},

			// I11: C41, C42, C43
			{IndicatorCode: "I11", VariableCode: "C41"},
			{IndicatorCode: "I11", VariableCode: "C42"},
			{IndicatorCode: "I11", VariableCode: "C43"},

			// I12: C44, C45, C46
			{IndicatorCode: "I12", VariableCode: "C44"},
			{IndicatorCode: "I12", VariableCode: "C45"},
			{IndicatorCode: "I12", VariableCode: "C46"},

			// I13: C47, C48
			{IndicatorCode: "I13", VariableCode: "C47"},
			{IndicatorCode: "I13", VariableCode: "C48"},

			// I14: C49, C50
			{IndicatorCode: "I14", VariableCode: "C49"},
			{IndicatorCode: "I14", VariableCode: "C50"},

			// I15: C51, C52
			{IndicatorCode: "I15", VariableCode: "C51"},
			{IndicatorCode: "I15", VariableCode: "C52"},

			// I16: C53, C54, C55, C56, C57
			{IndicatorCode: "I16", VariableCode: "C53"},
			{IndicatorCode: "I16", VariableCode: "C54"},
			{IndicatorCode: "I16", VariableCode: "C55"},
			{IndicatorCode: "I16", VariableCode: "C56"},
			{IndicatorCode: "I16", VariableCode: "C57"},

			// I17: C58, C59
			{IndicatorCode: "I17", VariableCode: "C58"},
			{IndicatorCode: "I17", VariableCode: "C59"},

			// I18: C60, C61, C62
			{IndicatorCode: "I18", VariableCode: "C60"},
			{IndicatorCode: "I18", VariableCode: "C61"},
			{IndicatorCode: "I18", VariableCode: "C62"},

			// I19: C63, C64
			{IndicatorCode: "I19", VariableCode: "C63"},
			{IndicatorCode: "I19", VariableCode: "C64"},

			// I20: C65, C66
			{IndicatorCode: "I20", VariableCode: "C65"},
			{IndicatorCode: "I20", VariableCode: "C66"},

			// I21: C67, C68
			{IndicatorCode: "I21", VariableCode: "C67"},
			{IndicatorCode: "I21", VariableCode: "C68"},

			// I22: C69
			{IndicatorCode: "I22", VariableCode: "C69"},

			// I23: C70, C71, C72
			{IndicatorCode: "I23", VariableCode: "C70"},
			{IndicatorCode: "I23", VariableCode: "C71"},
			{IndicatorCode: "I23", VariableCode: "C72"},

			// I24: C73, C74
			{IndicatorCode: "I24", VariableCode: "C73"},
			{IndicatorCode: "I24", VariableCode: "C74"},

			// I25: C75, C76, C77
			{IndicatorCode: "I25", VariableCode: "C75"},
			{IndicatorCode: "I25", VariableCode: "C76"},
			{IndicatorCode: "I25", VariableCode: "C77"},

			// I26: C78, C79, C80, C81
			{IndicatorCode: "I26", VariableCode: "C78"},
			{IndicatorCode: "I26", VariableCode: "C79"},
			{IndicatorCode: "I26", VariableCode: "C80"},
			{IndicatorCode: "I26", VariableCode: "C81"},

			// I27: C82, C83
			{IndicatorCode: "I27", VariableCode: "C82"},
			{IndicatorCode: "I27", VariableCode: "C83"},
		}
		db.Create(&mappings1)
	}

	// 7. Seed CriterionIndicator (Relation mapping Level 2)
	var mappingCount2 int64
	db.Model(&models.CriterionIndicator{}).Count(&mappingCount2)
	if mappingCount2 == 0 {
		log.Println("Seeding CriterionIndicator mappings (Level 2)...")
		mappings2 := []models.CriterionIndicator{
			// K1: I1, I2, I3
			{CriterionCode: "K1", IndicatorCode: "I1"},
			{CriterionCode: "K1", IndicatorCode: "I2"},
			{CriterionCode: "K1", IndicatorCode: "I3"},

			// K2: I4, I5
			{CriterionCode: "K2", IndicatorCode: "I4"},
			{CriterionCode: "K2", IndicatorCode: "I5"},

			// K3: I6, I7, I8, I9, I10, I11, I12, I13
			{CriterionCode: "K3", IndicatorCode: "I6"},
			{CriterionCode: "K3", IndicatorCode: "I7"},
			{CriterionCode: "K3", IndicatorCode: "I8"},
			{CriterionCode: "K3", IndicatorCode: "I9"},
			{CriterionCode: "K3", IndicatorCode: "I10"},
			{CriterionCode: "K3", IndicatorCode: "I11"},
			{CriterionCode: "K3", IndicatorCode: "I12"},
			{CriterionCode: "K3", IndicatorCode: "I13"},

			// K4: I14, I15, I16, I17, I18
			{CriterionCode: "K4", IndicatorCode: "I14"},
			{CriterionCode: "K4", IndicatorCode: "I15"},
			{CriterionCode: "K4", IndicatorCode: "I16"},
			{CriterionCode: "K4", IndicatorCode: "I17"},
			{CriterionCode: "K4", IndicatorCode: "I18"},

			// K5: I19, I20, I21, I22
			{CriterionCode: "K5", IndicatorCode: "I19"},
			{CriterionCode: "K5", IndicatorCode: "I20"},
			{CriterionCode: "K5", IndicatorCode: "I21"},
			{CriterionCode: "K5", IndicatorCode: "I22"},

			// K6: I23, I24, I25, I26, I27
			{CriterionCode: "K6", IndicatorCode: "I23"},
			{CriterionCode: "K6", IndicatorCode: "I24"},
			{CriterionCode: "K6", IndicatorCode: "I25"},
			{CriterionCode: "K6", IndicatorCode: "I26"},
			{CriterionCode: "K6", IndicatorCode: "I27"},
		}
		db.Create(&mappings2)
	}

	// 8. Seed other age groups (Toddler, Early Elementary, Late Elementary)
	seedOtherAgeGroups(db)

	log.Println("Database seeding completed.")
}

func seedOtherAgeGroups(db *gorm.DB) {
	// A. Seed Criteria for other age groups
	var otherCriteriaCount int64
	db.Model(&models.Criterion{}).Where("age_group != ?", "preschool").Count(&otherCriteriaCount)
	if otherCriteriaCount == 0 {
		log.Println("Seeding Criteria for other age groups...")
		criteria := []models.Criterion{
			// Toddler (3 Years)
			{Code: "TK1", Label: "Intelektual Umum", Description: "Kemampuan komunikasi dan memori dasar pada anak usia 3 tahun.", Suggestions: "Dukung dengan membacakan buku bergambar, bernyanyi bersama, dan merespons celoteh anak dengan kalimat lengkap.", AgeGroup: "toddler"},
			{Code: "TK2", Label: "Akademik Khusus", Description: "Kemampuan mengenal konsep angka dasar (1-3) dan bentuk/warna dasar.", Suggestions: "Ajak bermain puzzle balok sederhana, menyebutkan warna mainan, dan berhitung jari.", AgeGroup: "toddler"},
			{Code: "TK3", Label: "Berpikir Kreatif dan Produktif", Description: "Kemampuan imajinasi awal dan rasa ingin tahu yang tinggi.", Suggestions: "Sediakan kertas kosong dan krayon besar untuk mencoret-coret, ajak bermain pura-pura (pretend play) sederhana.", AgeGroup: "toddler"},
			{Code: "TK4", Label: "Kepemimpinan", Description: "Kemampuan sosialisasi awal, kepatuhan instruksi, dan empati sederhana.", Suggestions: "Latih kepatuhan dengan instruksi satu langkah (seperti membereskan mainan), beri contoh berempati secara hangat.", AgeGroup: "toddler"},
			{Code: "TK5", Label: "Seni Visual dan Pertunjukan", Description: "Kepekaan dasar anak terhadap irama musik dan gambar berwarna.", Suggestions: "Putar musik anak-anak dan ajak bergoyang/bertepuk tangan bersama, sediakan buku bergambar besar.", AgeGroup: "toddler"},
			{Code: "TK6", Label: "Psikomotorik", Description: "Keterampilan motorik kasar dan halus dasar seperti berlari stabil dan menggenggam krayon.", Suggestions: "Ajak anak bermain lempar-tangkap bola besar, berlari di taman, dan meronce manik-manik besar.", AgeGroup: "toddler"},

			// Early Elementary (7-9 Years)
			{Code: "EK1", Label: "Intelektual Umum", Description: "Kemampuan penalaran verbal dan logis yang berkembang baik pada usia sekolah awal.", Suggestions: "Ajak anak membaca buku mandiri, bahas kosa kata baru, berikan teka-teki logika atau catur pemula.", AgeGroup: "early_elementary"},
			{Code: "EK2", Label: "Akademik Khusus", Description: "Kecakapan dalam matematika dasar (penjumlahan/pengurangan) dan ketertarikan pada sains/alam.", Suggestions: "Berikan latihan soal hitungan menyenangkan, ajak berkunjung ke museum sains, lakukan observasi alam.", AgeGroup: "early_elementary"},
			{Code: "EK3", Label: "Berpikir Kreatif dan Produktif", Description: "Kemampuan menciptakan karya orisinal, kerajinan tangan, dan menemukan solusi alternatif.", Suggestions: "Sediakan bahan daur ulang untuk crafting, ajak menulis buku harian/komik bergambar sendiri.", AgeGroup: "early_elementary"},
			{Code: "EK4", Label: "Kepemimpinan", Description: "Tanggung jawab mandiri (PR/sekolah), kepemimpinan kelompok bermain, dan kerjasama tim.", Suggestions: "Berikan tugas rumah tangga harian, dukung bergabung dalam klub olahraga atau pramuka sekolah.", AgeGroup: "early_elementary"},
			{Code: "EK5", Label: "Seni Visual dan Pertunjukan", Description: "Bakat seni rupa detail (proporsi gambar) dan rasa percaya diri tampil seni pertunjukan/musik.", Suggestions: "Ikutkan les menggambar, belajar alat musik dasar (pianika/recorder), dorong tampil di acara sekolah.", AgeGroup: "early_elementary"},
			{Code: "EK6", Label: "Psikomotorik", Description: "Koordinasi motorik kasar lanjut (sepeda roda dua, lompat tali) dan motorik halus presisi (origami/menggunting pola).", Suggestions: "Latih bersepeda roda dua, bermain bulu tangkis, melatih origami kreatif dan membuat kerajinan tangan rumit.", AgeGroup: "early_elementary"},

			// Late Elementary (10-12 Years)
			{Code: "LK1", Label: "Intelektual Umum", Description: "Kemampuan penalaran verbal, logika abstrak, debat argumen, dan menulis esai runtut.", Suggestions: "Ajak diskusi kritis tentang isu sosial, berikan buku bacaan sastra anak, dorong anak menulis artikel/esai pendek.", AgeGroup: "late_elementary"},
			{Code: "LK2", Label: "Akademik Khusus", Description: "Kemampuan pemecahan matematika sekolah tingkat lanjut dan minat riset/teknologi (programming/robotik).", Suggestions: "Dukung bergabung dalam klub matematika, berikan kit robotik sederhana, perkenalkan kelas coding pemula.", AgeGroup: "late_elementary"},
			{Code: "LK3", Label: "Berpikir Kreatif dan Produktif", Description: "Bakat dalam desain kreatif (digital/seni), inovasi ide proyek, dan apresiasi estetika luas.", Suggestions: "Kenalkan perangkat lunak desain digital, dorong pembuatan video/editing kreatif, ajak mengulas film secara kritis.", AgeGroup: "late_elementary"},
			{Code: "LK4", Label: "Kepemimpinan", Description: "Kepemimpinan organisasi (ketua kelas/kelompok), resolusi konflik adil, dan sportivitas lomba.", Suggestions: "Dukung berorganisasi di sekolah (OSIS/Pramuka), latih teknik mediasi konflik sebaya, latih sportivitas.", AgeGroup: "late_elementary"},
			{Code: "LK5", Label: "Seni Visual dan Pertunjukan", Description: "Kemampuan teknik melukis 3D/desain grafis, kemahiran alat musik, dan tari kreasi mandiri.", Suggestions: "Fasilitasi studio lukis sederhana, ikutkan les alat musik lanjutan (gitar/biola), dukung menciptakan koreografi sendiri.", AgeGroup: "late_elementary"},
			{Code: "LK6", Label: "Psikomotorik", Description: "Penguasaan olahraga tim taktis, kelincahan atletik menonjol, dan keterampilan mekanis/bongkar-pasang presisi.", Suggestions: "Dukung bergabung dengan klub olahraga prestasi (sepak bola/basket), fasilitasi perkakas bongkar pasang mainan mekanik.", AgeGroup: "late_elementary"},
		}
		db.Create(&criteria)
	}

	// B. Seed Indicators for other age groups
	var otherIndicatorCount int64
	db.Model(&models.Indicator{}).Where("age_group != ?", "preschool").Count(&otherIndicatorCount)
	if otherIndicatorCount == 0 {
		log.Println("Seeding Indicators for other age groups...")
		indicators := []models.Indicator{
			// Toddler (3 Years)
			{Code: "TI1", Label: "Kemampuan Komunikasi & Bicara Dasar", AgeGroup: "toddler"},
			{Code: "TI2", Label: "Konsep Angka & Warna Dasar", AgeGroup: "toddler"},
			{Code: "TI3", Label: "Imajinasi Bermain Toddler", AgeGroup: "toddler"},
			{Code: "TI4", Label: "Kepatuhan & Sosialisasi Dasar", AgeGroup: "toddler"},
			{Code: "TI5", Label: "Respon Musik & Estetika Toddler", AgeGroup: "toddler"},
			{Code: "TI6", Label: "Keterampilan Motorik Toddler", AgeGroup: "toddler"},

			// Early Elementary (7-9 Years)
			{Code: "EI1", Label: "Kemampuan Verbal & Pemahaman Cerita", AgeGroup: "early_elementary"},
			{Code: "EI2", Label: "Penalaran Logis & Analitis Awal", AgeGroup: "early_elementary"},
			{Code: "EI3", Label: "Keterampilan Matematika Dasar", AgeGroup: "early_elementary"},
			{Code: "EI4", Label: "Minat Observasi Alam & Sains", AgeGroup: "early_elementary"},
			{Code: "EI5", Label: "Orisinalitas & Pembuatan Karya", AgeGroup: "early_elementary"},
			{Code: "EI6", Label: "Pemecahan Masalah & Kreativitas Praktis", AgeGroup: "early_elementary"},
			{Code: "EI7", Label: "Kepemimpinan & Kerjasama Kelompok", AgeGroup: "early_elementary"},
			{Code: "EI8", Label: "Kemandirian & Tanggung Jawab Akademik", AgeGroup: "early_elementary"},
			{Code: "EI9", Label: "Menggambar dengan Detail & Proporsi", AgeGroup: "early_elementary"},
			{Code: "EI10", Label: "Bakat Musik & Keberanian Tampil", AgeGroup: "early_elementary"},
			{Code: "EI11", Label: "Keseimbangan & Kelincahan Fisik", AgeGroup: "early_elementary"},
			{Code: "EI12", Label: "Keterampilan Motorik Halus Presisi", AgeGroup: "early_elementary"},

			// Late Elementary (10-12 Years)
			{Code: "LI1", Label: "Penalaran Abstrak & Debat Logis", AgeGroup: "late_elementary"},
			{Code: "LI2", Label: "Literasi Karangan & Menulis Runtut", AgeGroup: "late_elementary"},
			{Code: "LI3", Label: "Keterampilan Matematika Lanjut", AgeGroup: "late_elementary"},
			{Code: "LI4", Label: "Eksperimen Sains & Minat Teknologi", AgeGroup: "late_elementary"},
			{Code: "LI5", Label: "Inovasi Desain & Proyek Mandiri", AgeGroup: "late_elementary"},
			{Code: "LI6", Label: "Apresiasi Estetika & Budaya Kritis", AgeGroup: "late_elementary"},
			{Code: "LI7", Label: "Kepemimpinan Kelompok & Organisasi", AgeGroup: "late_elementary"},
			{Code: "LI8", Label: "Sportivitas & Resolusi Konflik Sebaya", AgeGroup: "late_elementary"},
			{Code: "LI9", Label: "Seni Rupa & Media Digital Lanjut", AgeGroup: "late_elementary"},
			{Code: "LI10", Label: "Kemahiran Instrumen & Tari Mandiri", AgeGroup: "late_elementary"},
			{Code: "LI11", Label: "Kecakapan Atletik & Olahraga Taktis", AgeGroup: "late_elementary"},
			{Code: "LI12", Label: "Keterampilan Mekanis & Presisi Fisik", AgeGroup: "late_elementary"},
		}
		db.Create(&indicators)
	}

	// C. Seed Variables for other age groups
	var otherVariableCount int64
	db.Model(&models.Variable{}).Where("age_group != ?", "preschool").Count(&otherVariableCount)
	if otherVariableCount == 0 {
		log.Println("Seeding Variables for other age groups...")
		variables := []models.Variable{
			// Toddler (3 Years)
			{Code: "T1", Label: "Dapat menyebutkan namanya sendiri dan menunjuk anggota tubuhnya", Category: "General Intellectual", AgeGroup: "toddler"},
			{Code: "T2", Label: "Dapat meniru kata-kata baru yang didengarnya", Category: "General Intellectual", AgeGroup: "toddler"},
			{Code: "T3", Label: "Dapat menghitung secara verbal 1-3 benda secara runtut", Category: "Specific Academic", AgeGroup: "toddler"},
			{Code: "T4", Label: "Mengenal warna dasar (merah, biru, kuning)", Category: "Specific Academic", AgeGroup: "toddler"},
			{Code: "T5", Label: "Suka mencoret-coret kertas secara bebas", Category: "Creative Thinking", AgeGroup: "toddler"},
			{Code: "T6", Label: "Suka bermain pura-pura (pretend play) sederhana dengan mainannya", Category: "Creative Thinking", AgeGroup: "toddler"},
			{Code: "T7", Label: "Mau menunjukkan empati (misal memeluk temannya yang menangis)", Category: "Leadership", AgeGroup: "toddler"},
			{Code: "T8", Label: "Mau mengikuti petunjuk sederhana satu langkah (misal: ambil mainan)", Category: "Leadership", AgeGroup: "toddler"},
			{Code: "T9", Label: "Suka bertepuk tangan atau bergoyang saat mendengar lagu anak", Category: "Visual & Performing Arts", AgeGroup: "toddler"},
			{Code: "T10", Label: "Tertarik mencoba memukul mainan yang berbunyi/musik", Category: "Visual & Performing Arts", AgeGroup: "toddler"},
			{Code: "T11", Label: "Bisa berlari tanpa sering terjatuh", Category: "Psychomotor", AgeGroup: "toddler"},
			{Code: "T12", Label: "Bisa memegang krayon dengan genggaman tangannya untuk mencoret", Category: "Psychomotor", AgeGroup: "toddler"},

			// Early Elementary (7-9 Years)
			{Code: "E1", Label: "Dapat menjelaskan jalan cerita dari buku yang dibacanya", Category: "General Intellectual", AgeGroup: "early_elementary"},
			{Code: "E2", Label: "Memiliki kosakata yang kaya dan mampu menggunakannya dalam kalimat yang benar", Category: "General Intellectual", AgeGroup: "early_elementary"},
			{Code: "E3", Label: "Suka bermain puzzle yang membutuhkan pemikiran logis", Category: "General Intellectual", AgeGroup: "early_elementary"},
			{Code: "E4", Label: "Mampu mengidentifikasi sebab-akibat sederhana dalam kehidupan sehari-hari", Category: "General Intellectual", AgeGroup: "early_elementary"},
			{Code: "E5", Label: "Mampu melakukan penjumlahan dan pengurangan matematika dasar dengan lancar", Category: "Specific Academic", AgeGroup: "early_elementary"},
			{Code: "E6", Label: "Tertarik memecahkan teka-teki angka atau logika matematika", Category: "Specific Academic", AgeGroup: "early_elementary"},
			{Code: "E7", Label: "Suka mengamat serangga, tanaman, atau fenomena alam di sekitar", Category: "Specific Academic", AgeGroup: "early_elementary"},
			{Code: "E8", Label: "Tertarik membaca buku tentang antariksa, dinosaurus, atau tubuh manusia", Category: "Specific Academic", AgeGroup: "early_elementary"},
			{Code: "E9", Label: "Sering menemukan cara baru untuk merakit mainan block/lego", Category: "Creative Thinking", AgeGroup: "early_elementary"},
			{Code: "E10", Label: "Suka mengarang cerita imajinatif atau membuat gambar komik sederhana", Category: "Creative Thinking", AgeGroup: "early_elementary"},
			{Code: "E11", Label: "Mampu menemukan solusi alternatif saat mainannya rusak", Category: "Creative Thinking", AgeGroup: "early_elementary"},
			{Code: "E12", Label: "Menunjukkan minat tinggi pada kegiatan kerajinan tangan (crafting)", Category: "Creative Thinking", AgeGroup: "early_elementary"},
			{Code: "E13", Label: "Mampu memimpin kelompok kecil dalam permainan atau tugas sekolah", Category: "Leadership", AgeGroup: "early_elementary"},
			{Code: "E14", Label: "Mengalah demi kepentingan bersama saat bermain dengan teman", Category: "Leadership", AgeGroup: "early_elementary"},
			{Code: "E15", Label: "Mampu menyiapkan perlengkapan sekolahnya sendiri setiap hari", Category: "Leadership", AgeGroup: "early_elementary"},
			{Code: "E16", Label: "Menyelesaikan tugas pekerjaan rumah (PR) tepat waktu secara mandiri", Category: "Leadership", AgeGroup: "early_elementary"},
			{Code: "E17", Label: "Mampu menggambar objek dengan detail yang cukup baik (misal ada bayangan/proporsi)", Category: "Visual & Performing Arts", AgeGroup: "early_elementary"},
			{Code: "E18", Label: "Suka mewarnai dengan kombinasi warna yang harmonis", Category: "Visual & Performing Arts", AgeGroup: "early_elementary"},
			{Code: "E19", Label: "Mampu menyanyikan lagu dengan nada yang tepat (pitch control)", Category: "Visual & Performing Arts", AgeGroup: "early_elementary"},
			{Code: "E20", Label: "Percaya diri tampil menari atau menyanyi di depan kelas/keluarga", Category: "Visual & Performing Arts", AgeGroup: "early_elementary"},
			{Code: "E21", Label: "Lancar mengendarai sepeda roda dua tanpa bantuan roda samping", Category: "Psychomotor", AgeGroup: "early_elementary"},
			{Code: "E22", Label: "Mampu melakukan lompat tali (skipping) beberapa kali berturut-turut", Category: "Psychomotor", AgeGroup: "early_elementary"},
			{Code: "E23", Label: "Mampu menggunakan gunting dengan rapi untuk memotong pola yang rumit", Category: "Psychomotor", AgeGroup: "early_elementary"},
			{Code: "E24", Label: "Dapat meronce manik-manik kecil atau melipat kertas origami dengan rapi", Category: "Psychomotor", AgeGroup: "early_elementary"},

			// Late Elementary (10-12 Years)
			{Code: "L1", Label: "Mampu memahami konsep abstrak (seperti keadilan, toleransi, atau ekonomi dasar)", Category: "General Intellectual", AgeGroup: "late_elementary"},
			{Code: "L2", Label: "Suka berdebat secara logis mengenai suatu topik dengan orang tua atau guru", Category: "General Intellectual", AgeGroup: "late_elementary"},
			{Code: "L3", Label: "Suka membaca novel anak atau artikel pengetahuan yang panjang", Category: "General Intellectual", AgeGroup: "late_elementary"},
			{Code: "L4", Label: "Mampu menulis karangan atau esai pendek dengan alur pemikiran yang runtut", Category: "General Intellectual", AgeGroup: "late_elementary"},
			{Code: "L5", Label: "Cepat memahami materi matematika sekolah yang kompleks (pecahan desimal, bangun ruang)", Category: "Specific Academic", AgeGroup: "late_elementary"},
			{Code: "L6", Label: "Mampu membaca dan membuat grafik atau tabel sederhana secara mandiri", Category: "Specific Academic", AgeGroup: "late_elementary"},
			{Code: "L7", Label: "Suka melakukan eksperimen sains sekolah dan antusias mencatat hasilnya", Category: "Specific Academic", AgeGroup: "late_elementary"},
			{Code: "L8", Label: "Tertarik pada teknologi baru, pemrograman komputer dasar, atau robotik", Category: "Specific Academic", AgeGroup: "late_elementary"},
			{Code: "L9", Label: "Suka mendesain sesuatu (misal poster digital, maket rumah, atau pakaian boneka)", Category: "Creative Thinking", AgeGroup: "late_elementary"},
			{Code: "L10", Label: "Sering memberikan ide-ide orisinal dalam proyek kelompok sekolah", Category: "Creative Thinking", AgeGroup: "late_elementary"},
			{Code: "L11", Label: "Suka mengapresiasi karya seni, musik klasik, atau film dengan ulasan kritis sendiri", Category: "Creative Thinking", AgeGroup: "late_elementary"},
			{Code: "L12", Label: "Tertarik mempelajari budaya, bahasa, atau sejarah daerah/negara lain", Category: "Creative Thinking", AgeGroup: "late_elementary"},
			{Code: "L13", Label: "Sering ditunjuk atau bersedia menjadi ketua kelas atau pemimpin kelompok", Category: "Leadership", AgeGroup: "late_elementary"},
			{Code: "L14", Label: "Mampu mengorganisir teman-teman untuk menyelesaikan proyek kelompok dengan baik", Category: "Leadership", AgeGroup: "late_elementary"},
			{Code: "L15", Label: "Mampu menerima kegagalan dalam lomba dengan sikap sportif dan positif", Category: "Leadership", AgeGroup: "late_elementary"},
			{Code: "L16", Label: "Mampu membantu menyelesaikan perselisihan antara teman-temannya secara adil", Category: "Leadership", AgeGroup: "late_elementary"},
			{Code: "L17", Label: "Mampu membuat lukisan atau karya seni tiga dimensi dengan teknik dan arsiran yang baik", Category: "Visual & Performing Arts", AgeGroup: "late_elementary"},
			{Code: "L18", Label: "Mahir menggunakan media digital untuk menggambar atau mengedit foto/video", Category: "Visual & Performing Arts", AgeGroup: "late_elementary"},
			{Code: "L19", Label: "Bisa memainkan satu alat musik dengan baik (misal gitar, keyboard, atau biola)", Category: "Visual & Performing Arts", AgeGroup: "late_elementary"},
			{Code: "L20", Label: "Mampu menciptakan gerakan tari atau melodi lagu sederhana sendiri", Category: "Visual & Performing Arts", AgeGroup: "late_elementary"},
			{Code: "L21", Label: "Menguasai teknik dasar olahraga tim (seperti sepak bola, basket, atau bulu tangkis)", Category: "Psychomotor", AgeGroup: "late_elementary"},
			{Code: "L22", Label: "Memiliki kelincahan, kekuatan, dan daya tahan fisik yang menonjol dalam olahraga", Category: "Psychomotor", AgeGroup: "late_elementary"},
			{Code: "L23", Label: "Suka membongkar dan memperbaiki mainan mekanik atau barang elektronik yang rusak", Category: "Psychomotor", AgeGroup: "late_elementary"},
			{Code: "L24", Label: "Memiliki ketelitian tinggi dalam menjahit, merakit model miniatur, atau kerajinan tangan presisi", Category: "Psychomotor", AgeGroup: "late_elementary"},
		}
		db.Create(&variables)
	}

	// D. Seed IndicatorVariable mappings (Level 1)
	var otherMapping1Count int64
	db.Model(&models.IndicatorVariable{}).Where("indicator_code LIKE ? OR indicator_code LIKE ? OR indicator_code LIKE ?", "TI%", "EI%", "LI%").Count(&otherMapping1Count)
	if otherMapping1Count == 0 {
		log.Println("Seeding IndicatorVariable mappings (Level 1) for other age groups...")
		mappings := []models.IndicatorVariable{
			// Toddler (3 Years)
			{IndicatorCode: "TI1", VariableCode: "T1"},
			{IndicatorCode: "TI1", VariableCode: "T2"},
			{IndicatorCode: "TI2", VariableCode: "T3"},
			{IndicatorCode: "TI2", VariableCode: "T4"},
			{IndicatorCode: "TI3", VariableCode: "T5"},
			{IndicatorCode: "TI3", VariableCode: "T6"},
			{IndicatorCode: "TI4", VariableCode: "T7"},
			{IndicatorCode: "TI4", VariableCode: "T8"},
			{IndicatorCode: "TI5", VariableCode: "T9"},
			{IndicatorCode: "TI5", VariableCode: "T10"},
			{IndicatorCode: "TI6", VariableCode: "T11"},
			{IndicatorCode: "TI6", VariableCode: "T12"},

			// Early Elementary (7-9 Years)
			{IndicatorCode: "EI1", VariableCode: "E1"},
			{IndicatorCode: "EI1", VariableCode: "E2"},
			{IndicatorCode: "EI2", VariableCode: "E3"},
			{IndicatorCode: "EI2", VariableCode: "E4"},
			{IndicatorCode: "EI3", VariableCode: "E5"},
			{IndicatorCode: "EI3", VariableCode: "E6"},
			{IndicatorCode: "EI4", VariableCode: "E7"},
			{IndicatorCode: "EI4", VariableCode: "E8"},
			{IndicatorCode: "EI5", VariableCode: "E9"},
			{IndicatorCode: "EI5", VariableCode: "E10"},
			{IndicatorCode: "EI6", VariableCode: "E11"},
			{IndicatorCode: "EI6", VariableCode: "E12"},
			{IndicatorCode: "EI7", VariableCode: "E13"},
			{IndicatorCode: "EI7", VariableCode: "E14"},
			{IndicatorCode: "EI8", VariableCode: "E15"},
			{IndicatorCode: "EI8", VariableCode: "E16"},
			{IndicatorCode: "EI9", VariableCode: "E17"},
			{IndicatorCode: "EI9", VariableCode: "E18"},
			{IndicatorCode: "EI10", VariableCode: "E19"},
			{IndicatorCode: "EI10", VariableCode: "E20"},
			{IndicatorCode: "EI11", VariableCode: "E21"},
			{IndicatorCode: "EI11", VariableCode: "E22"},
			{IndicatorCode: "EI12", VariableCode: "E23"},
			{IndicatorCode: "EI12", VariableCode: "E24"},

			// Late Elementary (10-12 Years)
			{IndicatorCode: "LI1", VariableCode: "L1"},
			{IndicatorCode: "LI1", VariableCode: "L2"},
			{IndicatorCode: "LI2", VariableCode: "L3"},
			{IndicatorCode: "LI2", VariableCode: "L4"},
			{IndicatorCode: "LI3", VariableCode: "L5"},
			{IndicatorCode: "LI3", VariableCode: "L6"},
			{IndicatorCode: "LI4", VariableCode: "L7"},
			{IndicatorCode: "LI4", VariableCode: "L8"},
			{IndicatorCode: "LI5", VariableCode: "L9"},
			{IndicatorCode: "LI5", VariableCode: "L10"},
			{IndicatorCode: "LI6", VariableCode: "L11"},
			{IndicatorCode: "LI6", VariableCode: "L12"},
			{IndicatorCode: "LI7", VariableCode: "L13"},
			{IndicatorCode: "LI7", VariableCode: "L14"},
			{IndicatorCode: "LI8", VariableCode: "L15"},
			{IndicatorCode: "LI8", VariableCode: "L16"},
			{IndicatorCode: "LI9", VariableCode: "L17"},
			{IndicatorCode: "LI9", VariableCode: "L18"},
			{IndicatorCode: "LI10", VariableCode: "L19"},
			{IndicatorCode: "LI10", VariableCode: "L20"},
			{IndicatorCode: "LI11", VariableCode: "L21"},
			{IndicatorCode: "LI11", VariableCode: "L22"},
			{IndicatorCode: "LI12", VariableCode: "L23"},
			{IndicatorCode: "LI12", VariableCode: "L24"},
		}
		db.Create(&mappings)
	}

	// E. Seed CriterionIndicator mappings (Level 2)
	var otherMapping2Count int64
	db.Model(&models.CriterionIndicator{}).Where("criterion_code LIKE ? OR criterion_code LIKE ? OR criterion_code LIKE ?", "TK%", "EK%", "LK%").Count(&otherMapping2Count)
	if otherMapping2Count == 0 {
		log.Println("Seeding CriterionIndicator mappings (Level 2) for other age groups...")
		mappings := []models.CriterionIndicator{
			// Toddler (3 Years)
			{CriterionCode: "TK1", IndicatorCode: "TI1"},
			{CriterionCode: "TK2", IndicatorCode: "TI2"},
			{CriterionCode: "TK3", IndicatorCode: "TI3"},
			{CriterionCode: "TK4", IndicatorCode: "TI4"},
			{CriterionCode: "TK5", IndicatorCode: "TI5"},
			{CriterionCode: "TK6", IndicatorCode: "TI6"},

			// Early Elementary (7-9 Years)
			{CriterionCode: "EK1", IndicatorCode: "EI1"},
			{CriterionCode: "EK1", IndicatorCode: "EI2"},
			{CriterionCode: "EK2", IndicatorCode: "EI3"},
			{CriterionCode: "EK2", IndicatorCode: "EI4"},
			{CriterionCode: "EK3", IndicatorCode: "EI5"},
			{CriterionCode: "EK3", IndicatorCode: "EI6"},
			{CriterionCode: "EK4", IndicatorCode: "EI7"},
			{CriterionCode: "EK4", IndicatorCode: "EI8"},
			{CriterionCode: "EK5", IndicatorCode: "EI9"},
			{CriterionCode: "EK5", IndicatorCode: "EI10"},
			{CriterionCode: "EK6", IndicatorCode: "EI11"},
			{CriterionCode: "EK6", IndicatorCode: "EI12"},

			// Late Elementary (10-12 Years)
			{CriterionCode: "LK1", IndicatorCode: "LI1"},
			{CriterionCode: "LK1", IndicatorCode: "LI2"},
			{CriterionCode: "LK2", IndicatorCode: "LI3"},
			{CriterionCode: "LK2", IndicatorCode: "LI4"},
			{CriterionCode: "LK3", IndicatorCode: "LI5"},
			{CriterionCode: "LK3", IndicatorCode: "LI6"},
			{CriterionCode: "LK4", IndicatorCode: "LI7"},
			{CriterionCode: "LK4", IndicatorCode: "LI8"},
			{CriterionCode: "LK5", IndicatorCode: "LI9"},
			{CriterionCode: "LK5", IndicatorCode: "LI10"},
			{CriterionCode: "LK6", IndicatorCode: "LI11"},
			{CriterionCode: "LK6", IndicatorCode: "LI12"},
		}
		db.Create(&mappings)
	}
}
