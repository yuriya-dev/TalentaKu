package db

import (
	"log"

	"backend/models"
	"gorm.io/gorm"
)

func SeedData(db *gorm.DB) {
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

	log.Println("Database seeding completed.")
}
