import { Book } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'buku-vanderwijck',
    title: 'Tenggelamnya Kapal Van der Wijck',
    author: 'Haji Abdul Malik Karim Amrullah (Buya Hamka)',
    description: 'Kisah cinta mengharukan antara Zainuddin, seorang pemuda berdarah campuran Mengkasar dan Minang, dengan Hayati, kembang desa Batipuh yang terhalang oleh adat istiadat yang kokoh.',
    category: 'Novel Sastra',
    status: 'reading',
    isFavorite: true,
    rating: 5,
    price: 29.0,
    currency: 'RM',
    sku: 'MYK-VDW-01',
    salesCount: 142,
    coverTheme: {
      variant: 'navy',
      pattern: 'ornate',
    },
    tags: ['Klasik', 'Romansa', 'Nusantara', 'Sastra Melayu'],
    totalWords: 4850,
    estimatedReadTimeMinutes: 24,
    dateAdded: '2026-09-01T10:00:00.000Z',
    lastReadDate: '2026-09-28T07:30:00.000Z',
    currentProgress: 35,
    currentChapterIndex: 0,
    fileType: 'custom',
    chapters: [
      {
        id: 'vdw-ch-1',
        title: 'Bab I: Mengembang Layar ke Tanah Leluhur',
        wordCount: 1620,
        content: `Ketika kapal api yang membawanya dari pelabuhan Makassar mulai merapat di Teluk Bayur, hati Zainuddin berdebar kencang laksana ombak yang memecah di karang karang Pantai Padang. Telah bertahun-tahun lamanya ia mengangankan tanah Minangkabau, negeri tumpah darah ayahnya yang sering dikisahkan oleh orang-orang tua sebelum mereka berpulang ke rahmatullah.

"Inilah Ranah Minang yang permai itu," bisiknya seraya memandang barisan bukit barisan yang membiru di kejauhan, diselimuti mega putih yang berarak perlahan. Matanya berkaca-kaca. Di dadanya tersimpan segumpal harapan: ingin mencari kaum kerabat, mereguk hangatnya persaudaraan yang selama ini terasa hampa di rantau orang.

Namun, adat yang teguh berakar tidaklah semudah yang disangka oleh seorang anak muda yang jiwanya penuh dengan impian kesusastraan. Tatkala ia sampai di Batipuh, sebuah nagari yang sejuk dan asri di kaki Gunung Marapi, ia disambut dengan sopan santun, tetapi ada jarak yang tak kasatmata. Bagi orang Batipuh, Zainuddin bukanlah orang Minang sejati, sebab ibunya adalah orang Mengkasar. Di tanah beradat matrilinear ini, ia tak bersuku dan tak bertali darah pusaka.

Di tengah kesunyian dan kesendirian itulah, takdir mempertemukannya dengan seorang dara jelita bernama Hayati. Pertemuan itu bermula di suatu senja ketika hujan gerimis menyiram dedaunan kelapa di tepi jalan. Hayati berdiri berteduh di bawah atap pondok sawah, memegang payung kertas merah jambu. Ketika mata mereka bertaut, ada keteduhan yang memancar dari sepasang bola mata gadis itu, seolah-olah mengobati luka rindu di lubuk sanubari Zainuddin.`
      },
      {
        id: 'vdw-ch-2',
        title: 'Bab II: Surat-Surat Cinta yang Terhalang Dinding Adat',
        wordCount: 1750,
        content: `Malam itu dingin sekali di nagari Batipuh. Di kamarnya yang diterangi lampu semprong berbahan minyak kelapa, Zainuddin menuangkan segala rasa hatinya ke atas secarik kertas surat. Tangannya gemetar ketika mencelupkan mata pena ke dalam tinta hitam pekat.

"Aduhai Hayati, permata hatiku yang bercahaya di kala gulita..." demikian ia memulai guratan penanya. "Jika sekiranya cinta ini adalah dosa di mata adat nenek moyangmu, mengapakah Tuhan menanamkan benih kasih yang begitu murni di dadaku? Demi Allah, aku tidak memandang harta dan kemegahan bangsamu. Bagiku, engkaulah penuntun jiwaku di alam fana ini."

Keesokan harinya, surat itu disampaikan melalui perantara seorang anak gembala yang setia. Ketika Hayati membaca baris demi baris kata yang disusun dengan kepiawaian penyair itu, air matanya menetes membasahi kertas putih. Hayati mencintai Zainuddin dengan segenap kesucian jiwanya. Namun, di balai adat, ninik mamak dan para tetua telah berunding. 

Khabar angin telah sampai ke telinga keluarga besar Hayati bahwa anak gadis mereka sering berkirim surat dengan "orang asing" yang tak berpenghulu. Seorang pemuda kaya bernama Aziz, anak saudagar terpandang dari Padang yang gemar berpelesir dan berpendidikan modern, telah datang meminang. Di hadapan adat dan harta, lamaran Zainuddin yang miskin dan tak bersuku bagaikan debu dihembus angin badai.`
      },
      {
        id: 'vdw-ch-3',
        title: 'Bab III: Surat Terakhir dan Perjalanan ke Surabaya',
        wordCount: 1480,
        content: `Perpisahan itu akhirnya tak terelakkan lagi. Dengan hati yang remuk redam laksana cermin yang jatuh terhempas ke batu padas, Zainuddin meninggalkan ranah Batipuh. Tubuhnya kurus kering, hampir saja ia menghembuskan nafas terakhirnya karena sakit menahan penderitaan asmara yang patah di tengah jalan.

Tetapi seorang sahabat setia, Muluk, membangkitkan kembali semangat hidupnya. "Zainuddin! Bangkitlah! Bakat mengarangmu adalah kurnia Tuhan. Jika cintamu ditolak oleh manusia karena adat, biarlah seluruh dunia mengenal kebesaran jiwamu lewat mata penamu!"

Mereka merantau jauh ke tanah Jawa, menetap di kota Surabaya. Di sana, Zainuddin menumpahkan segenap derita dan cintanya ke dalam buku-buku roman yang laris dibaca oleh ribuan orang di Hindia Belanda. Namanya masyhur dengan nama samaran "Z". Uang mengalir, kemegahan menyambutnya, tetapi di sudut rumahnya yang megah dan asri, hanya ada satu lukisan terpajang: potret Hayati dengan selendang putihnya yang lembut.`
      }
    ]
  },
  {
    id: 'buku-sherlock-skandal',
    title: 'Skandal di Bohemia: Petualangan Sherlock Holmes',
    author: 'Sir Arthur Conan Doyle',
    description: 'Bagi Sherlock Holmes, dia selalu dipanggil sebagai "Wanita Itu". Inilah kisah legendaris tentang satu-satunya sosok yang berhasil mengelabui kejeniusan sang detektif Baker Street: Irene Adler.',
    category: 'Misteri & Detektif',
    status: 'completed',
    isFavorite: true,
    rating: 5,
    price: 24.5,
    currency: 'RM',
    sku: 'MYK-SH-02',
    salesCount: 89,
    coverTheme: {
      variant: 'noir',
      pattern: 'geometric',
    },
    tags: ['Detektif', 'Misteri', 'London', 'Klasik'],
    totalWords: 5200,
    estimatedReadTimeMinutes: 26,
    dateAdded: '2026-09-05T14:20:00.000Z',
    lastReadDate: '2026-09-27T18:45:00.000Z',
    currentProgress: 100,
    currentChapterIndex: 2,
    fileType: 'custom',
    chapters: [
      {
        id: 'sh-ch-1',
        title: 'Bab I: Sosok Wanita Itu',
        wordCount: 1720,
        content: `Bagi Sherlock Holmes, dia selalu dipanggil sebagai "Sang Wanita". Jarang sekali kudengar ia menyebut namanya dengan cara lain. Di matanya, dia mengungguli dan menundukkan seluruh kaumnya. Bukannya Holmes merasakan emosi yang mirip cinta kepada Irene Adler. Semua emosi, terutama yang satu itu, amat bertentangan dengan pikirannya yang jernih, dingin, namun seimbang dan tepat.

Aku telah menikah dan menjauh dari kehidupan Baker Street selama beberapa bulan, menyibukkan diri dalam praktik kedokteranku sendiri. Pada suatu malam musim semi yang dingin, jalanku membawaku melintasi Baker Street. Ketika aku mendongak menatap jendela yang kukenal baik, kulihat siluet sosoknya yang tinggi dan kurus bergerak mondar-mandir di dalam ruangan.

"Masuklah, Watson!" serunya begitu aku melangkah ke ambang pintu. Matanya menatap tajam ke arahku. "Aku melihat praktik medismu berjalan lancar. Kau telah basah kuyup karena hujan lumpur di sebelah kirimu, dan aku mencium bau iodoform yang khas dari jasmu."

Aku hanya bisa tersenyum takjub mendengar ketepatan analisanya yang tak pernah luntur. Namun malam itu bukanlah malam untuk lelucon biasa. Sebuah surat aneh dari Bohemia di atas kertas perkamen mahal telah tiba tanpa nama pengirim, menandakan sebuah kunjungan dari tamu yang sangat penting dan penuh rahasia.`
      },
      {
        id: 'sh-ch-2',
        title: 'Bab II: Tamu Bertopeng dari Istana Praha',
        wordCount: 1680,
        content: `Tepat pukul delapan malam, sebuah kereta kuda beroda dua berhenti di depan pintu Baker Street nomor 221B. Terdengar derap langkah berat menaiki anak tangga kayu kami. Pintu terbuka perlahan, dan seorang pria bertubuh raksasa melangkah masuk.

Tamu itu berpostur tegap dengan dada bidang, mengenakan jubah mewah berhiaskan bulu cerpelai dan topeng sutra hitam yang menutupi separuh wajahnya. Ia memegang sebuah topi tinggi di tangannya yang bersarung kulit.

"Tuan Sherlock Holmes?" tanyanya dengan aksen Jerman yang pekat. "Dan ini sahabat karibmu, Dr. Watson?"

"Tuan dapat berbicara bebas di hadapan Dr. Watson," kata Holmes santai sambil duduk di kursi berlengan kulitnya. "Dan Yang Mulia tidak perlu bersusah payah memakai topeng ini lagi, Paduka Raja Wilhelm Gottsreich Sigismond von Ormstein, Pangeran Agung Bohemia."

Pria itu tersentak ke belakang, lalu melepaskan topengnya dengan tawa getir. "Benar sekali dugaan orang-orang. Tak ada yang luput dari pandanganmu, Holmes. Aku datang meminta pertolonganmu sebelum reputasi dan masa depanku hancur berkeping-keping karena selembar foto rahasia."`
      },
      {
        id: 'sh-ch-3',
        title: 'Bab III: Tipuan Asap di Kediaman Irene Adler',
        wordCount: 1800,
        content: `Strategi Holmes sungguh cerdik. Ia menyamar sebagai seorang pendeta tua berjubah hitam dengan syal wol compang-camping di lehernya. Tak ada seorang pun di dunia ini yang akan menyangka bahwa di balik dandanan ringkih itu tersembunyi detektif paling tajam di Eropa.

"Watson," bisiknya kepadaku di sudut Briony Lodge, kediaman mewah Irene Adler di St. John's Wood. "Ketika aku terlempar ke dalam ruang tamunya karena keributan yang telah kuatur dengan para kusir sewaan, aku akan berpura-pura pingsan. Ketika aku mengangkat tanganku di dekat jendela, lemparkan tabung roket asap ini ke dalam ruangan, lalu teriakkan 'Kebakaran!' sekeras-kerasnya."

Rencana itu berjalan mulus. Begitu asap memenuhi ruangan, teriakanku memicu kepanikan warga di jalanan. Di saat kebakaran terjadi, naluri manusia selalu menuntunnya menyelamatkan harta yang paling berharga. Holmes memperhatikan gerak-gerik Irene Adler yang seketika berlari ke sebuah panel rahasia di dinding.

Foto itu ada di sana! Holmes telah menemukan letaknya. Namun, ketika kami kembali keesokan harinya bersama sang Raja, burung kenari itu telah terbang jauh meninggalkan London, hanya menyisakan sepucuk surat penghargaan untuk Holmes dan selembar fotonya sendiri. Untuk pertama kalinya, Sherlock Holmes berhasil ditaklukkan oleh akal sehat seorang wanita.`
      }
    ]
  },
  {
    id: 'buku-pendekar-rimba',
    title: 'Hikayat Si Gunting Emas: Pendekar Rimba',
    author: 'Raden Mas Sastrawan',
    description: 'Petualangan silat legendaris di belantara Nusantara. Mengisahkan Bayu Samudera, pemuda pewaris jurus sembilan bayangan yang harus membongkar persekongkolan jahat di Lembah Kabut.',
    category: 'Fantasi & Petualangan',
    status: 'want_to_read',
    isFavorite: false,
    rating: 4,
    price: 35.0,
    currency: 'RM',
    sku: 'MYK-PR-03',
    salesCount: 65,
    coverTheme: {
      variant: 'emerald',
      pattern: 'classic_border',
    },
    tags: ['Silat', 'Nusantara', 'Petualangan', 'Aksi'],
    totalWords: 3900,
    estimatedReadTimeMinutes: 20,
    dateAdded: '2026-09-12T09:15:00.000Z',
    currentProgress: 0,
    currentChapterIndex: 0,
    fileType: 'custom',
    chapters: [
      {
        id: 'pr-ch-1',
        title: 'Bab 1: Kilatan Mandau di Hulu Mahakam',
        wordCount: 1250,
        content: `Kabut tebal masih menyelimuti aliran sungai hulu yang deras di belantara timur Kalimantan. Suara riam membentur cadas terdengar bersahut-sahutan dengan pekik burung enggang yang melintas di puncak-puncak pohon meranti raksasa.

Di atas sebuah batu hitam yang menjulang di tengah arus, seorang pemuda duduk bersila dengan mata terpejam. Pakaiannya ringkas, terbuat dari kain tenun kasar berwarna nila. Di punggungnya terikat sebilah mandau bersarung kayu ulin tua dengan hiasan tatah perak berbentuk naga air. Pemuda itu adalah Bayu Samudera.

Tiba-tiba, telinganya menangkap desau angin yang janggal. Bukan tiupan angin gunung biasa, melainkan deru hawa tenaga dalam yang diiringi derak ranting patah seratus depa di sebelah barat. Bayu tidak bergeming. Ujung jari telunjuk tangan kanannya perlahan menyentuh permukaan air sungai.

Tiga sosok berkerudung hitam melayang turun dari dahan pohon ara bagaikan kelelawar malam. "Serahkan peta makam Patih Singosari, anak muda! Jangan sampai darahmu mencemari kesucian sungai ini!" desis salah seorang dengan suara parau bercampur racun.`
      },
      {
        id: 'pr-ch-2',
        title: 'Bab 2: Rahasia Kitab Rajawali Hitam',
        wordCount: 1350,
        content: `Gerakan mandau Bayu Samudera bagaikan kilat menyambar di siang bolong. Ketika bilah logamnya yang berkilau emas beradu dengan pedang ketiga pendekar berkerudung itu, denting baja memecah kesunyian rimba raya.

"Jurus Sembilan Bayangan!" pekik pemimpin penyerang dengan mata terbelalak ketakutan. Sebelum musuhnya sempat menarik kembali senjatanya, dorongan angin dahsyat menghempaskan mereka ke semak belukar.

Bayu melangkah tenang mendekati pria yang terkapar. Dari dalam saku jubah musuh yang robek, terjatuh sebuah gulungan perkamen bertinta perak. Pada kulit pembungkusnya tergambar lambang rajawali hitam dengan mata merah darah. Ini adalah tanda kebesaran Sekte Bayangan Hitam yang telah menghilang selama tiga dasawarsa sejak keruntuhan benteng pasir di Selat Malaka.`
      },
      {
        id: 'pr-ch-3',
        title: 'Bab 3: Sumpah di Puncak Karang',
        wordCount: 1300,
        content: `Malam menjelang ketika Bayu sampai di puncak bukit kapur. Api unggun kecil menyala, mengusir dinginnya angin malam yang bertiup kencang dari arah samudra. Di hadapannya terbentang luasnya kepulauan Nusantara yang megah di bawah selimut bintang gemintang.

Ia membuka gulungan perkamen itu perlahan. Di dalamnya tertera bait-bait ramalan kuno mengenai pusaka yang dapat mengendalikan arus pasang surut selat perdagangan terbesar di dunia. Jika jatuh ke tangan serakah para perompak laut utara, malapetaka besar akan menimpa ribuan pelaut dan rakyat jelata.

"Demi arwah para guru yang telah berkorban di medan laga," ucap Bayu dengan suara mantap, menancapkan mata mandaunya ke tanah, "aku bersumpah tidak akan membiarkan api permusuhan membakar tanah air ini lagi."`
      }
    ]
  },
  {
    id: 'buku-kopi-senja',
    title: 'Filosofi Aroma Senja: Catatan dari Sudut Kafe Kecil',
    author: 'Nirmala Rahayu',
    description: 'Sebuah kumpulan esai naratif dan cerita fiksi singkat tentang kenangan, secangkir seduhan manual brew, dan makna hening di tengah keriuhan kota metropolitan.',
    category: 'Non-Fiksi & Esai',
    status: 'reading',
    isFavorite: false,
    rating: 4,
    price: 19.9,
    currency: 'RM',
    sku: 'MYK-FAS-04',
    salesCount: 210,
    coverTheme: {
      variant: 'terracotta',
      pattern: 'minimal',
    },
    tags: ['Esai', 'Refleksi', 'Kehidupan', 'Kopi'],
    totalWords: 3400,
    estimatedReadTimeMinutes: 17,
    dateAdded: '2026-09-18T16:00:00.000Z',
    lastReadDate: '2026-09-28T06:10:00.000Z',
    currentProgress: 50,
    currentChapterIndex: 1,
    fileType: 'custom',
    chapters: [
      {
        id: 'ks-ch-1',
        title: 'Bab 1: Menghargai Air yang Mendidih Perlahan',
        wordCount: 1100,
        content: `Ada hal magis yang terjadi ketika jarum jam menunjukkan pukul lima sore di sebuah gang sempit di selatan Jakarta. Lampu temaram warna kuning madu mulai menyala di balik etalase kaca kafe tua ini, memantulkan bayangan rintik hujan yang baru saja membasahi aspal.

Di meja seduh kayu jati, air bersuhu sembilan puluh derajat mengucur perlahan dari leher ceret angsa. Membasahi bubuk biji kopi Gayo yang baru saja digiling kasar. Aroma melati, rempah manis, dan karamel menguar lembut ke seluruh ruangan.

Di era di mana segala sesuatu dituntut serba instan—pesan singkat berbalas detik, transportasi tiba dalam hitungan menit, dan informasi meluncur tanpa jeda—menyeduh kopi secara manual adalah sebuah pembangkangan kecil yang menenteramkan. Kita dipaksa menunggu. Kita dipaksa menghargai tetes demi tetes waktu yang jatuh ke cangkir keramik tanah liat.`
      },
      {
        id: 'ks-ch-2',
        title: 'Bab 2: Percakapan dengan Orang Asing di Bawah Payung',
        wordCount: 1150,
        content: `Seorang pria paruh baya dengan tas jinjing kulit tua duduk di hadapanku. Ia memesan kopi tubruk tanpa gula. Kerutan di dahinya menceritakan bertahun-tahun perjalanan hidup yang tak mudah, tetapi senyum di sudut bibirnya ramah sekali.

"Buku apa yang sedang kaubaca, anak muda?" tanyanya membuka pembicaraan.

"Sebuah roman lama tentang seseorang yang kehilangan tanah kelahirannya," jawabku seraya meletakkan buku di meja.

Ia mengangguk pelan, lalu menyesap kopinya dengan khidmat. "Manusia seringkali menyangka bahwa rumah adalah bangunan empat dinding dengan genteng merah. Padahal, seiring bertambahnya usia, kau akan mengerti bahwa rumah sejati adalah ketenangan di dalam dadamu sendiri saat kau bisa memaafkan masa lalumu."

Kata-kata itu tertancap dalam di benakku. Malam itu, hujan makin deras, tetapi percakapan kami mengalir hangat bagaikan perapian di tengah musim salju.`
      },
      {
        id: 'ks-ch-3',
        title: 'Bab 3: Epilog: Menyimpan Kenangan di Antara Halaman Kertas',
        wordCount: 1150,
        content: `Mengapa kita mencintai buku? Di tengah ribuan kilatan layar gawai yang memancarkan cahaya biru dingin, buku tetap menjadi tempat perlindungan yang paling setia bagi jiwa yang lelah.

Buku tidak pernah mendesakmu untuk segera membalasnya. Ia tidak membunyikan dering notifikasi yang menuntut perhatianmu. Ia menunggu dengan sabar di rak kayu, tertutup debu tipis, siap membukakan pintu ke dunia lain begitu jemarimu menyentuh lembaran halamannya.

Setiap buku yang kausimpan adalah sepotong dari dirimu sendiri pada saat kau membacanya. Simpanlah buku-bukumu dengan kasih sayang, karena di sanalah riwayat hatimu pernah berlayar.`
      }
    ]
  },
  {
    id: 'buku-resepi-bonda',
    title: 'Resepi Warisan Dapur Bonda: Sajian Tradisional & Moden',
    author: 'Chef Fatimah Zahra',
    description: 'Himpunan 50+ resepi masakan warisan istimewa merangkumi lauk-pauk tradisional, gulai kawah, kuih-muih Melayu, dan teknik rahsia adunan rempah ratus asli turun-temurun.',
    category: 'Resepi',
    status: 'reading',
    isFavorite: true,
    rating: 5,
    price: 28.0,
    currency: 'RM',
    sku: 'MYK-RSP-01',
    salesCount: 310,
    coverTheme: {
      variant: 'terracotta',
      pattern: 'ornate',
    },
    tags: ['Resepi', 'Masakan Tradisional', 'Dapur Bonda', 'Kulinari'],
    totalWords: 3450,
    estimatedReadTimeMinutes: 18,
    dateAdded: '2026-09-15T09:00:00.000Z',
    lastReadDate: '2026-09-28T12:00:00.000Z',
    currentProgress: 40,
    currentChapterIndex: 0,
    fileType: 'custom',
    chapters: [
      {
        id: 'rsp-ch-1',
        title: 'Bab 1: Asas Rempah & Rahsia Minyak Tumisan Wangi',
        wordCount: 1100,
        content: `Keenakan masakan Melayu tradisional terletak pada keikhlasan penyediaan bahan tumisnya. Bonda sering berpesan, "Jangan sesekali terburu-buru ketika menumis rempah. Biarkan cili dan bawang pecah minyak dengan api yang perlahan."

Bahan Asas Pes Rempah Warisan:
- 15 ulas bawang merah ros (ditumbuk lesung batu untuk aroma lebih manis)
- 6 ulas bawang putih kampung
- 2 inci halia tua
- 1 inci lengkuas muda
- 3 batang serai segar, diketuk pangkalnya
- 2 sudu besar ketumbar biji, disangai & dikisar halus
- 1 sudu besar jintan manis & jintan putih, disangai

Petua Bonda:
Apabila menumis pes bawang dan rempah, masukkan sedikit garam kasar di awal proses. Garam membantu mengeluarkan sari manis semula jadi bawang dan mempercepatkan proses penyerapan aroma rempah ke dalam minyak.`
      },
      {
        id: 'rsp-ch-2',
        title: 'Bab 2: Daging Salai Masak Lemak Cili Api & Rendang Tok',
        wordCount: 1250,
        content: `Resepi Daging Salai Masak Lemak Cili Api Negeri Sembilan:

Bahan-Bahan:
- 500g daging lembu yang disalai menggunakan sabut kelapa dan kayu arang
- 1 kg santan kelapa segar (perahan pertama dan kedua)
- 25 biji cili padi kampung hijau (ditumbuk lumat bersama sedikit garam)
- 2 inci kunyit hidup (wajib ditumbuk lumat untuk warna kuning emas asli)
- 2 batang serai dititik
- 2 keping asam gelugur kering
- 1 helai daun kunyit, dicarik dan disimpul rapi

Cara Memasak:
1. Masukkan cili padi tumbuk, kunyit hidup, serai, dan daging salai ke dalam kuali tanpa minyak. 
2. Panaskan sebentar dengan api sederhana supaya aroma asap daging salai berpadu mesra dengan cili dan kunyit.
3. Tuangkan santan cair dahulu sambil dikacau berterusan secara menimba agar santan tidak pecah minyak secara mendadak.
4. Masukkan asam keping dan perasakan dengan garam secukup rasa.
5. Akhir sekali, masukkan santan pekat dan daun kunyit. Renihkan perlahan sehingga kuah pekat bersalut mesra pada daging salai. Sedia dihidangkan bersama nasi putih panas.`
      },
      {
        id: 'rsp-ch-3',
        title: 'Bab 3: Kuih Tradisional: Seri Muka Pandan & Bingka Bakar',
        wordCount: 1100,
        content: `Seri Muka Pandan Asli:

Lapisan Bawah (Pulut Gurih):
- 300g beras pulut berkualiti, direndam 2 jam
- 200ml santan cair sederhana pekat
- 1 sudu teh garam
- 2 helai daun pandan

Lapisan Atas (Kastard Pandan Wangi):
- 1 cawan pati air daun pandan asli (dikisar daripada 10 helai daun pandan suji dan daun pandan wangi)
- 1 cawan santan pekat
- 3/4 cawan gula pasir halus
- 3 sudu besar tepung gandum
- 2 sudu besar tepung kastard
- 2 biji telur gred A

Cara Penyediaan:
Kukus pulut hingga naik wap dan lembut berkilat. Tekan pulut padat-padat di dalam loyang berlapik plastik masakan. Kemudian tuangkan adunan kepala kastard pandan secara perlahan melalui penapis. Kukus dengan api sederhana selama 30 minit dengan penutup periuk dibalut kain bersih supaya titisan wap tidak mencacatkan permukaan halus kuih.`
      }
    ]
  },
  {
    id: 'buku-panduan-penulis-pantas',
    title: 'Panduan Menulis Buku Dengan Pantas: Dari Idea Menjadi Naskhah Terbitan',
    author: 'Akademi Karya Digital',
    description: 'Hadiah percuma khas untuk semua penulis berdaftar Karya Digital. Kupasan terperinci langkah demi langkah untuk merangka plot, menghasilkan naskhah berkualiti tinggi dalam tempoh 30 hari, dan strategi jualan laris.',
    category: 'Panduan',
    status: 'reading',
    isFavorite: true,
    rating: 5,
    price: 0,
    currency: 'RM',
    sku: 'MYK-PND-01',
    salesCount: 890,
    coverTheme: {
      variant: 'emerald',
      pattern: 'classic_border',
    },
    tags: ['Panduan', 'Penulisan', 'Percuma', 'Tips Penulis', 'Karya Digital'],
    totalWords: 3850,
    estimatedReadTimeMinutes: 20,
    dateAdded: '2026-09-01T00:00:00.000Z',
    lastReadDate: '2026-09-29T10:00:00.000Z',
    currentProgress: 100,
    currentChapterIndex: 0,
    fileType: 'custom',
    freeChapterCount: 99,
    chapters: [
      {
        id: 'pnd-ch-1',
        title: 'Bab 1: Menemukan Idea Emas & Menembusi Writer’s Block',
        wordCount: 1250,
        content: `Ramai orang beranggapan bahawa untuk menulis sebuah buku, seseorang itu perlu menunggu datangnya "ilham ajaib" dari langit. Hakikatnya, ilham tidak pernah menunggu orang yang pasif; ilham datang kepada mereka yang memulakan langkah pertama di hadapan helaian kertas atau papan kekunci.

1. Formula Tiga Soalan Menemukan Idea:
- Apakah pengalaman hidup atau kepakaran yang anda tahu lebih baik daripada rakan sekeliling?
- Apakah masalah yang sering dihadapi oleh pembaca yang memerlukan penyelesaian segera?
- Kisah atau emosi apakah yang paling ingin anda sampaikan kepada dunia sebelum anda tiada?

2. Mengatasi Writer’s Block dengan Kaedah "Freewriting 15 Minit":
Apabila anda berasa tersekat dan tidak tahu apa yang ingin ditulis, pasang pemasa jam selama 15 minit. Tulis apa sahaja yang terlintas di fikiran anda tanpa sesekali menekan butang 'Backspace' atau memadam perkataan. Jangan menyunting semasa menulis draf pertama! Ingatlah prinsip emas ini: "Draf pertama tidak perlu sempurna, ia hanya perlu wujud."`
      },
      {
        id: 'pnd-ch-2',
        title: 'Bab 2: Teknik Menulis 1,000 Patah Perkataan Setiap Hari',
        wordCount: 1300,
        content: `Sebuah novel atau buku digital purata mengandungi antara 20,000 hingga 30,000 patah perkataan. Jika anda mampu menulis 1,000 patah perkataan sehari, anda boleh menamatkan sebuah buku lengkap dalam masa hanya 20 hingga 30 hari!

Bagaimanakah cara membina disiplin 1,000 patah perkataan ini?

1. Pecahkan kepada Sesi Menulis Kecil (Micro-writing Sprints):
Daripada berazam untuk duduk selama 4 jam berturut-turut, bahagikan sesi anda kepada 2 blok waktu:
- Sesi Pagi (Subuh / Sebelum Kerja): 30 minit = 500 patah perkataan.
- Sesi Malam (Sebelum Tidur): 30 minit = 500 patah perkataan.
Jumlah = 1,000 patah perkataan sehari tanpa tekanan.

2. Gunakan Rangka Bab (Chapter Skeleton):
Sebelum tidur, sediakan 3 hingga 5 poin ringkas untuk bab keesokan harinya. Apabila anda duduk menulis pada keesokan harinya, minda anda sudah mengetahui arah tuju bab tersebut tanpa perlu termenung mencari idea.`
      },
      {
        id: 'pnd-ch-3',
        title: 'Bab 3: Membina Tajuk, Kulit Buku & Menjana Royalti 95% di Karya Digital',
        wordCount: 1300,
        content: `Di era digital masa kini, pembaca menilai sesebuah naskhah dalam masa 3 saat pertama:
1. Tajuk yang Menarik Emosi & Rasa Ingin Tahu:
Gunakan formula 'Manfaat + Emosi' atau 'Konflik Utama'. Contoh tajuk yang kuat:
- Daripada "Buku Masakan Melayu" -> "Resepi Warisan Dapur Bonda: Rahsia Tumisan Asli Nusantara".
- Daripada "Kisah Cinta Sedih" -> "Tenggelamnya Kapal Van der Wijck".

2. Memanfaatkan Ekosistem Karya Digital:
Di platform Karya Digital, anda memegang 100% hak cipta karya anda. Dengan caj platform yang sangat rendah iaitu hanya 5%, anda menikmati 95% royalti bersih terus ke akaun bank anda. 

Kelebihan Menjual di Karya Digital:
- Terbitkan seberapa banyak buku tanpa had (unlimited).
- Tentukan sendiri bilangan bab percuma sebagai 'umpan' rasa ingin tahu pembaca.
- Pantau jualan dan mohon pengeluaran tunai pada bila-bila masa terus ke akaun bank anda.`
      }
    ]
  },
  {
    id: 'proj-karya-ereader',
    title: 'Platform Web E-Reader & Pustaka Digital',
    author: 'Karya Digital Engineering Team',
    description: 'Aplikasi web interaktif moden dengan sokongan mod gelap, sistem penanda buku, penyesuaian saiz tipografi dan enjin pemapar EPUB responsif tanpa kebergantungan internet.',
    category: 'Aplikasi Web',
    status: 'reading',
    isFavorite: true,
    rating: 5,
    price: 0,
    currency: 'RM',
    sku: 'MYK-APP-WEB',
    salesCount: 1250,
    coverTheme: {
      variant: 'emerald',
      pattern: 'geometric',
    },
    tags: ['Aplikasi Web', 'E-Reader', 'Tailwind CSS', 'Vite', 'React SPA'],
    totalWords: 3200,
    estimatedReadTimeMinutes: 16,
    dateAdded: '2026-09-15T08:00:00.000Z',
    lastReadDate: '2026-10-02T14:30:00.000Z',
    currentProgress: 60,
    currentChapterIndex: 0,
    fileType: 'custom',
    freeChapterCount: 99,
    chapters: [
      {
        id: 'ereader-ch-1',
        title: 'Bab 1: Seni Bina Aplikasi Web & Pustaka Digital',
        wordCount: 1500,
        content: `Aplikasi web Karya Digital dibina berasaskan React moden, Vite, dan Tailwind CSS. Matlamat utama rekaan adalah membolehkan pembaca membaca buku dan naskhah digital dengan kelajuan tinggi, tipografi yang selesa pada mata (Playfair Display & Newsreader), serta keupayaan simpanan luar talian melalui IndexedDB.

Ciri Utama:
- Antaramuka minimalis dan responsif untuk mudah alih dan komputer.
- Mod Cerah & Mod Gelap pintar dengan penyesuaian kontras automatik.
- Enjin penanda muka surat (bookmark) dan rak kustom peribadi.
- Sokongan muat turun dan simpanan sandaran JSON/EPUB secara terus.`
      }
    ]
  },
  {
    id: 'proj-royalti-automasi',
    title: 'Sistem Agihan Royalti 95% & Automasi EPUB',
    author: 'Sistem Kewangan & Penerbitan KD',
    description: 'Sistem automasi pintar pemprosesan manuskrip teks ke format EPUB digital, kalkulator royalti 95% masa nyata, dan papan pemuka analitik jualan penulis digital.',
    category: 'Sistem & Automasi',
    status: 'completed',
    isFavorite: true,
    rating: 5,
    price: 39.0,
    currency: 'RM',
    sku: 'MYK-SYS-AUT',
    salesCount: 460,
    coverTheme: {
      variant: 'navy',
      pattern: 'geometric',
    },
    tags: ['Sistem & Automasi', 'Bisnes & E-Dagang', 'Fintech', 'Royalti 95%', 'Automasi'],
    totalWords: 2800,
    estimatedReadTimeMinutes: 14,
    dateAdded: '2026-09-18T09:00:00.000Z',
    lastReadDate: '2026-10-01T11:00:00.000Z',
    currentProgress: 100,
    currentChapterIndex: 0,
    fileType: 'custom',
    freeChapterCount: 1,
    chapters: [
      {
        id: 'sys-ch-1',
        title: 'Bab 1: Struktur Automasi Pengiraan Royalti 95%',
        wordCount: 1400,
        content: `Sistem automasi royalti Karya Digital mengira agihan hasil jualan secara terus: 95% royalti bersih disalurkan ke dompet maya penulis secara automatik sejurus selepas transaksi selesai, manakala 5% diperuntukkan untuk kos infrastruktur pelayan.

Kelebihan Automasi:
- Tiada kelewatan pembayaran royalti bulanan.
- Penulis boleh memohon pengeluaran terus ke akaun bank tempatan (Maybank, CIMB, Bank Islam, dll).
- Ketelusan penuh dengan log transaksi jualan tanpa orang tengah.`
      }
    ]
  }
];
