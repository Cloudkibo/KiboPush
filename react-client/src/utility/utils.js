import cookie from 'react-cookie'

export function formatAMPM (date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  return hours + ':' + minutes + ' ' + ampm
}

export function localeCodeToEnglish(loc) {
    if (typeof loc !== 'string') throw new TypeError('Input must be string');
    var parts = loc.split('_'),
        ISO639_1 = {"ab":"Abkhazian","aa":"Afar","af":"Afrikaans","ak":"Akan","sq":"Albanian","am":"Amharic","ar":"Arabic","an":"Aragonese","hy":"Armenian","as":"Assamese","av":"Avaric","ae":"Avestan","ay":"Aymara","az":"Azerbaijani","bm":"Bambara","ba":"Bashkir","eu":"Basque","be":"Belarusian","bn":"Bengali","bh":"Bihari languages","bi":"Bislama","nb":"Norwegian Bokmål","bs":"Bosnian","br":"Breton","bg":"Bulgarian","my":"Burmese","es":"Spanish","ca":"Valencian","km":"Central Khmer","ch":"Chamorro","ce":"Chechen","ny":"Nyanja","zh":"Chinese","za":"Zhuang","cu":"Old Slavonic","cv":"Chuvash","kw":"Cornish","co":"Corsican","cr":"Cree","hr":"Croatian","cs":"Czech","da":"Danish","dv":"Maldivian","nl":"Flemish","dz":"Dzongkha","en":"English","eo":"Esperanto","et":"Estonian","ee":"Ewe","fo":"Faroese","fj":"Fijian","fi":"Finnish","fr":"French","ff":"Fulah","gd":"Scottish Gaelic","gl":"Galician","lg":"Ganda","ka":"Georgian","de":"German","ki":"Kikuyu","el":"Greek, Modern (1453-)","kl":"Kalaallisut","gn":"Guarani","gu":"Gujarati","ht":"Haitian Creole","ha":"Hausa","he":"Hebrew","hz":"Herero","hi":"Hindi","ho":"Hiri Motu","hu":"Hungarian","is":"Icelandic","io":"Ido","ig":"Igbo","id":"Indonesian","ia":"Interlingua (International Auxiliary Language Association)","ie":"Occidental","iu":"Inuktitut","ik":"Inupiaq","ga":"Irish","it":"Italian","ja":"Japanese","jv":"Javanese","kn":"Kannada","kr":"Kanuri","ks":"Kashmiri","kk":"Kazakh","rw":"Kinyarwanda","ky":"Kyrgyz","kv":"Komi","kg":"Kongo","ko":"Korean","kj":"Kwanyama","ku":"Kurdish","lo":"Lao","la":"Latin","lv":"Latvian","lb":"Luxembourgish","li":"Limburgish","ln":"Lingala","lt":"Lithuanian","lu":"Luba-Katanga","mk":"Macedonian","mg":"Malagasy","ms":"Malay","ml":"Malayalam","mt":"Maltese","gv":"Manx","mi":"Maori","mr":"Marathi","mh":"Marshallese","ro":"Romanian","mn":"Mongolian","na":"Nauru","nv":"Navajo","nd":"North Ndebele","nr":"South Ndebele","ng":"Ndonga","ne":"Nepali","se":"Northern Sami","no":"Norwegian","nn":"Nynorsk, Norwegian","ii":"Sichuan Yi","oc":"Occitan (post 1500)","oj":"Ojibwa","or":"Oriya","om":"Oromo","os":"Ossetic","pi":"Pali","pa":"Punjabi","ps":"Pushto","fa":"Persian","pl":"Polish","pt":"Portuguese","qu":"Quechua","rm":"Romansh","rn":"Rundi","ru":"Russian","sm":"Samoan","sg":"Sango","sa":"Sanskrit","sc":"Sardinian","sr":"Serbian","sn":"Shona","sd":"Sindhi","si":"Sinhalese","sk":"Slovak","sl":"Slovenian","so":"Somali","st":"Sotho, Southern","su":"Sundanese","sw":"Swahili","ss":"Swati","sv":"Swedish","tl":"Tagalog","ty":"Tahitian","tg":"Tajik","ta":"Tamil","tt":"Tatar","te":"Telugu","th":"Thai","bo":"Tibetan","ti":"Tigrinya","to":"Tonga (Tonga Islands)","ts":"Tsonga","tn":"Tswana","tr":"Turkish","tk":"Turkmen","tw":"Twi","ug":"Uyghur","uk":"Ukrainian","ur":"Urdu","uz":"Uzbek","ve":"Venda","vi":"Vietnamese","vo":"Volapük","wa":"Walloon","cy":"Welsh","fy":"Western Frisian","wo":"Wolof","xh":"Xhosa","yi":"Yiddish","yo":"Yoruba","zu":"Zulu"},
        ISO639_2 = {"abk":"Abkhazian","ace":"Achinese","ach":"Acoli","ada":"Adangme","ady":"Adyghe","aar":"Afar","afh":"Afrihili","afr":"Afrikaans","afa":"Afro-Asiatic languages","ain":"Ainu","aka":"Akan","akk":"Akkadian","alb":"Albanian","sqi":"Albanian","gsw":"Swiss German","ale":"Aleut","alg":"Algonquian languages","tut":"Altaic languages","amh":"Amharic","anp":"Angika","apa":"Apache languages","ara":"Arabic","arg":"Aragonese","arp":"Arapaho","arw":"Arawak","arm":"Armenian","hye":"Armenian","rup":"Macedo-Romanian","art":"Artificial languages","asm":"Assamese","ast":"Leonese","ath":"Athapascan languages","aus":"Australian languages","map":"Austronesian languages","ava":"Avaric","ave":"Avestan","awa":"Awadhi","aym":"Aymara","aze":"Azerbaijani","ban":"Balinese","bat":"Baltic languages","bal":"Baluchi","bam":"Bambara","bai":"Bamileke languages","bad":"Banda languages","bnt":"Bantu languages","bas":"Basa","bak":"Bashkir","baq":"Basque","eus":"Basque","btk":"Batak languages","bej":"Beja","bel":"Belarusian","bem":"Bemba","ben":"Bengali","ber":"Berber languages","bho":"Bhojpuri","bih":"Bihari languages","bik":"Bikol","byn":"Blin","bin":"Edo","bis":"Bislama","zbl":"Blissymbols","nob":"Norwegian Bokmål","bos":"Bosnian","bra":"Braj","bre":"Breton","bug":"Buginese","bul":"Bulgarian","bua":"Buriat","bur":"Burmese","mya":"Burmese","cad":"Caddo","spa":"Spanish","cat":"Valencian","cau":"Caucasian languages","ceb":"Cebuano","cel":"Celtic languages","cai":"Central American Indian languages","khm":"Central Khmer","chg":"Chagatai","cmc":"Chamic languages","cha":"Chamorro","che":"Chechen","chr":"Cherokee","nya":"Nyanja","chy":"Cheyenne","chb":"Chibcha","chi":"Chinese","zho":"Chinese","chn":"Chinook jargon","chp":"Dene Suline","cho":"Choctaw","zha":"Zhuang","chu":"Old Slavonic","chk":"Chuukese","chv":"Chuvash","nwc":"Old Newari","syc":"Classical Syriac","rar":"Rarotongan","cop":"Coptic","cor":"Cornish","cos":"Corsican","cre":"Cree","mus":"Creek","crp":"Creoles and pidgins","cpe":"Creoles and pidgins, English based","cpf":"Creoles and pidgins, French-based","cpp":"Creoles and pidgins, Portuguese-based","crh":"Crimean Turkish","hrv":"Croatian","cus":"Cushitic languages","cze":"Czech","ces":"Czech","dak":"Dakota","dan":"Danish","dar":"Dargwa","del":"Delaware","div":"Maldivian","zza":"Zazaki","din":"Dinka","doi":"Dogri","dgr":"Dogrib","dra":"Dravidian languages","dua":"Duala","dut":"Flemish","nld":"Flemish","dum":"Dutch, Middle (ca.1050-1350)","dyu":"Dyula","dzo":"Dzongkha","frs":"Eastern Frisian","efi":"Efik","egy":"Egyptian (Ancient)","eka":"Ekajuk","elx":"Elamite","eng":"English","enm":"English, Middle (1100-1500)","ang":"English, Old (ca.450-1100)","myv":"Erzya","epo":"Esperanto","est":"Estonian","ewe":"Ewe","ewo":"Ewondo","fan":"Fang","fat":"Fanti","fao":"Faroese","fij":"Fijian","fil":"Pilipino","fin":"Finnish","fiu":"Finno-Ugrian languages","fon":"Fon","fre":"French","fra":"French","frm":"French, Middle (ca.1400-1600)","fro":"French, Old (842-ca.1400)","fur":"Friulian","ful":"Fulah","gaa":"Ga","gla":"Scottish Gaelic","car":"Galibi Carib","glg":"Galician","lug":"Ganda","gay":"Gayo","gba":"Gbaya","gez":"Geez","geo":"Georgian","kat":"Georgian","ger":"German","deu":"German","nds":"Saxon, Low","gmh":"German, Middle High (ca.1050-1500)","goh":"German, Old High (ca.750-1050)","gem":"Germanic languages","kik":"Kikuyu","gil":"Gilbertese","gon":"Gondi","gor":"Gorontalo","got":"Gothic","grb":"Grebo","grc":"Greek, Ancient (to 1453)","gre":"Greek, Modern (1453-)","ell":"Greek, Modern (1453-)","kal":"Kalaallisut","grn":"Guarani","guj":"Gujarati","gwi":"Gwich'in","hai":"Haida","hat":"Haitian Creole","hau":"Hausa","haw":"Hawaiian","heb":"Hebrew","her":"Herero","hil":"Hiligaynon","him":"Western Pahari languages","hin":"Hindi","hmo":"Hiri Motu","hit":"Hittite","hmn":"Mong","hun":"Hungarian","hup":"Hupa","iba":"Iban","ice":"Icelandic","isl":"Icelandic","ido":"Ido","ibo":"Igbo","ijo":"Ijo languages","ilo":"Iloko","arc":"Official Aramaic (700-300 BCE)","smn":"Inari Sami","inc":"Indic languages","ine":"Indo-European languages","ind":"Indonesian","inh":"Ingush","ina":"Interlingua (International Auxiliary Language Association)","ile":"Occidental","iku":"Inuktitut","ipk":"Inupiaq","ira":"Iranian languages","gle":"Irish","mga":"Irish, Middle (900-1200)","sga":"Irish, Old (to 900)","iro":"Iroquoian languages","ita":"Italian","jpn":"Japanese","jav":"Javanese","kac":"Kachin","jrb":"Judeo-Arabic","jpr":"Judeo-Persian","kbd":"Kabardian","kab":"Kabyle","xal":"Oirat","kam":"Kamba","kan":"Kannada","kau":"Kanuri","pam":"Pampanga","kaa":"Kara-Kalpak","krc":"Karachay-Balkar","krl":"Karelian","kar":"Karen languages","kas":"Kashmiri","csb":"Kashubian","kaw":"Kawi","kaz":"Kazakh","kha":"Khasi","khi":"Khoisan languages","kho":"Sakan","kmb":"Kimbundu","kin":"Kinyarwanda","kir":"Kyrgyz","tlh":"tlhIngan-Hol","kom":"Komi","kon":"Kongo","kok":"Konkani","kor":"Korean","kos":"Kosraean","kpe":"Kpelle","kro":"Kru languages","kua":"Kwanyama","kum":"Kumyk","kur":"Kurdish","kru":"Kurukh","kut":"Kutenai","lad":"Ladino","lah":"Lahnda","lam":"Lamba","day":"Land Dayak languages","lao":"Lao","lat":"Latin","lav":"Latvian","ltz":"Luxembourgish","lez":"Lezghian","lim":"Limburgish","lin":"Lingala","lit":"Lithuanian","jbo":"Lojban","dsb":"Lower Sorbian","loz":"Lozi","lub":"Luba-Katanga","lua":"Luba-Lulua","lui":"Luiseno","smj":"Lule Sami","lun":"Lunda","luo":"Luo (Kenya and Tanzania)","lus":"Lushai","mac":"Macedonian","mkd":"Macedonian","mad":"Madurese","mag":"Magahi","mai":"Maithili","mak":"Makasar","mlg":"Malagasy","may":"Malay","msa":"Malay","mal":"Malayalam","mlt":"Maltese","mnc":"Manchu","mdr":"Mandar","man":"Mandingo","mni":"Manipuri","mno":"Manobo languages","glv":"Manx","mao":"Maori","mri":"Maori","arn":"Mapudungun","mar":"Marathi","chm":"Mari","mah":"Marshallese","mwr":"Marwari","mas":"Masai","myn":"Mayan languages","men":"Mende","mic":"Micmac","min":"Minangkabau","mwl":"Mirandese","moh":"Mohawk","mdf":"Moksha","rum":"Romanian","ron":"Romanian","mkh":"Mon-Khmer languages","lol":"Mongo","mon":"Mongolian","mos":"Mossi","mul":"Multiple languages","mun":"Munda languages","nqo":"N'Ko","nah":"Nahuatl languages","nau":"Nauru","nav":"Navajo","nde":"North Ndebele","nbl":"South Ndebele","ndo":"Ndonga","nap":"Neapolitan","new":"Newari","nep":"Nepali","nia":"Nias","nic":"Niger-Kordofanian languages","ssa":"Nilo-Saharan languages","niu":"Niuean","zxx":"Not applicable","nog":"Nogai","non":"Norse, Old","nai":"North American Indian languages","frr":"Northern Frisian","sme":"Northern Sami","nso":"Sotho, Northern","nor":"Norwegian","nno":"Nynorsk, Norwegian","nub":"Nubian languages","iii":"Sichuan Yi","nym":"Nyamwezi","nyn":"Nyankole","nyo":"Nyoro","nzi":"Nzima","oci":"Occitan (post 1500)","pro":"Provençal, Old (to 1500)","oji":"Ojibwa","ori":"Oriya","orm":"Oromo","osa":"Osage","oss":"Ossetic","oto":"Otomian languages","pal":"Pahlavi","pau":"Palauan","pli":"Pali","pag":"Pangasinan","pan":"Punjabi","pap":"Papiamento","paa":"Papuan languages","pus":"Pushto","per":"Persian","fas":"Persian","peo":"Persian, Old (ca.600-400 B.C.)","phi":"Philippine languages","phn":"Phoenician","pon":"Pohnpeian","pol":"Polish","por":"Portuguese","pra":"Prakrit languages","que":"Quechua","raj":"Rajasthani","rap":"Rapanui","qaa-qtz":"Reserved for local use","roa":"Romance languages","roh":"Romansh","rom":"Romany","run":"Rundi","rus":"Russian","sal":"Salishan languages","sam":"Samaritan Aramaic","smi":"Sami languages","smo":"Samoan","sad":"Sandawe","sag":"Sango","san":"Sanskrit","sat":"Santali","srd":"Sardinian","sas":"Sasak","sco":"Scots","sel":"Selkup","sem":"Semitic languages","srp":"Serbian","srr":"Serer","shn":"Shan","sna":"Shona","scn":"Sicilian","sid":"Sidamo","sgn":"Sign Languages","bla":"Siksika","snd":"Sindhi","sin":"Sinhalese","sit":"Sino-Tibetan languages","sio":"Siouan languages","sms":"Skolt Sami","den":"Slave (Athapascan)","sla":"Slavic languages","slo":"Slovak","slk":"Slovak","slv":"Slovenian","sog":"Sogdian","som":"Somali","son":"Songhai languages","snk":"Soninke","wen":"Sorbian languages","sot":"Sotho, Southern","sai":"South American Indian languages","alt":"Southern Altai","sma":"Southern Sami","srn":"Sranan Tongo","suk":"Sukuma","sux":"Sumerian","sun":"Sundanese","sus":"Susu","swa":"Swahili","ssw":"Swati","swe":"Swedish","syr":"Syriac","tgl":"Tagalog","tah":"Tahitian","tai":"Tai languages","tgk":"Tajik","tmh":"Tamashek","tam":"Tamil","tat":"Tatar","tel":"Telugu","ter":"Tereno","tet":"Tetum","tha":"Thai","tib":"Tibetan","bod":"Tibetan","tig":"Tigre","tir":"Tigrinya","tem":"Timne","tiv":"Tiv","tli":"Tlingit","tpi":"Tok Pisin","tkl":"Tokelau","tog":"Tonga (Nyasa)","ton":"Tonga (Tonga Islands)","tsi":"Tsimshian","tso":"Tsonga","tsn":"Tswana","tum":"Tumbuka","tup":"Tupi languages","tur":"Turkish","ota":"Turkish, Ottoman (1500-1928)","tuk":"Turkmen","tvl":"Tuvalu","tyv":"Tuvinian","twi":"Twi","udm":"Udmurt","uga":"Ugaritic","uig":"Uyghur","ukr":"Ukrainian","umb":"Umbundu","mis":"Uncoded languages","und":"Undetermined","hsb":"Upper Sorbian","urd":"Urdu","uzb":"Uzbek","vai":"Vai","ven":"Venda","vie":"Vietnamese","vol":"Volapük","vot":"Votic","wak":"Wakashan languages","wln":"Walloon","war":"Waray","was":"Washo","wel":"Welsh","cym":"Welsh","fry":"Western Frisian","wal":"Wolaytta","wol":"Wolof","xho":"Xhosa","sah":"Yakut","yao":"Yao","yap":"Yapese","yid":"Yiddish","yor":"Yoruba","ypk":"Yupik languages","znd":"Zande languages","zap":"Zapotec","zen":"Zenaga","zul":"Zulu","zun":"Zuni"},
        ISO3166_1 = {"AF":"AFGHANISTAN","AX":"ÅLAND ISLANDS","AL":"ALBANIA","DZ":"ALGERIA","AS":"AMERICAN SAMOA","AD":"ANDORRA","AO":"ANGOLA","AI":"ANGUILLA","AQ":"ANTARCTICA","AG":"ANTIGUA AND BARBUDA","AR":"ARGENTINA","AM":"ARMENIA","AW":"ARUBA","AU":"AUSTRALIA","AT":"AUSTRIA","AZ":"AZERBAIJAN","BS":"BAHAMAS","BH":"BAHRAIN","BD":"BANGLADESH","BB":"BARBADOS","BY":"BELARUS","BE":"BELGIUM","BZ":"BELIZE","BJ":"BENIN","BM":"BERMUDA","BT":"BHUTAN","BO":"BOLIVIA, PLURINATIONAL STATE OF","BQ":"BONAIRE, SINT EUSTATIUS AND SABA","BA":"BOSNIA AND HERZEGOVINA","BW":"BOTSWANA","BV":"BOUVET ISLAND","BR":"BRAZIL","IO":"BRITISH INDIAN OCEAN TERRITORY","BN":"BRUNEI DARUSSALAM","BG":"BULGARIA","BF":"BURKINA FASO","BI":"BURUNDI","KH":"CAMBODIA","CM":"CAMEROON","CA":"CANADA","CV":"CAPE VERDE","KY":"CAYMAN ISLANDS","CF":"CENTRAL AFRICAN REPUBLIC","TD":"CHAD","CL":"CHILE","CN":"CHINA","CX":"CHRISTMAS ISLAND","CC":"COCOS (KEELING) ISLANDS","CO":"COLOMBIA","KM":"COMOROS","CG":"CONGO","CD":"CONGO, THE DEMOCRATIC REPUBLIC OF THE","CK":"COOK ISLANDS","CR":"COSTA RICA","CI":"CÔTE D'IVOIRE","HR":"CROATIA","CU":"CUBA","CW":"CURAÇAO","CY":"CYPRUS","CZ":"CZECH REPUBLIC","DK":"DENMARK","DJ":"DJIBOUTI","DM":"DOMINICA","DO":"DOMINICAN REPUBLIC","EC":"ECUADOR","EG":"EGYPT","SV":"EL SALVADOR","GQ":"EQUATORIAL GUINEA","ER":"ERITREA","EE":"ESTONIA","ET":"ETHIOPIA","FK":"FALKLAND ISLANDS (MALVINAS)","FO":"FAROE ISLANDS","FJ":"FIJI","FI":"FINLAND","FR":"FRANCE","GF":"FRENCH GUIANA","PF":"FRENCH POLYNESIA","TF":"FRENCH SOUTHERN TERRITORIES","GA":"GABON","GM":"GAMBIA","GE":"GEORGIA","DE":"GERMANY","GH":"GHANA","GI":"GIBRALTAR","GR":"GREECE","GL":"GREENLAND","GD":"GRENADA","GP":"GUADELOUPE","GU":"GUAM","GT":"GUATEMALA","GG":"GUERNSEY","GN":"GUINEA","GW":"GUINEA-BISSAU","GY":"GUYANA","HT":"HAITI","HM":"HEARD ISLAND AND MCDONALD ISLANDS","VA":"HOLY SEE (VATICAN CITY STATE)","HN":"HONDURAS","HK":"HONG KONG","HU":"HUNGARY","IS":"ICELAND","IN":"INDIA","ID":"INDONESIA","IR":"IRAN, ISLAMIC REPUBLIC OF","IQ":"IRAQ","IE":"IRELAND","IM":"ISLE OF MAN","IL":"ISRAEL","IT":"ITALY","JM":"JAMAICA","JP":"JAPAN","JE":"JERSEY","JO":"JORDAN","KZ":"KAZAKHSTAN","KE":"KENYA","KI":"KIRIBATI","KP":"KOREA, DEMOCRATIC PEOPLE'S REPUBLIC OF","KR":"KOREA, REPUBLIC OF","KW":"KUWAIT","KG":"KYRGYZSTAN","LA":"LAO PEOPLE'S DEMOCRATIC REPUBLIC","LV":"LATVIA","LB":"LEBANON","LS":"LESOTHO","LR":"LIBERIA","LY":"LIBYA","LI":"LIECHTENSTEIN","LT":"LITHUANIA","LU":"LUXEMBOURG","MO":"MACAO","MK":"MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF","MG":"MADAGASCAR","MW":"MALAWI","MY":"MALAYSIA","MV":"MALDIVES","ML":"MALI","MT":"MALTA","MH":"MARSHALL ISLANDS","MQ":"MARTINIQUE","MR":"MAURITANIA","MU":"MAURITIUS","YT":"MAYOTTE","MX":"MEXICO","FM":"MICRONESIA, FEDERATED STATES OF","MD":"MOLDOVA, REPUBLIC OF","MC":"MONACO","MN":"MONGOLIA","ME":"MONTENEGRO","MS":"MONTSERRAT","MA":"MOROCCO","MZ":"MOZAMBIQUE","MM":"MYANMAR","NA":"NAMIBIA","NR":"NAURU","NP":"NEPAL","NL":"NETHERLANDS","NC":"NEW CALEDONIA","NZ":"NEW ZEALAND","NI":"NICARAGUA","NE":"NIGER","NG":"NIGERIA","NU":"NIUE","NF":"NORFOLK ISLAND","MP":"NORTHERN MARIANA ISLANDS","NO":"NORWAY","OM":"OMAN","PK":"PAKISTAN","PW":"PALAU","PS":"PALESTINIAN TERRITORY, OCCUPIED","PA":"PANAMA","PG":"PAPUA NEW GUINEA","PY":"PARAGUAY","PE":"PERU","PH":"PHILIPPINES","PN":"PITCAIRN","PL":"POLAND","PT":"PORTUGAL","PR":"PUERTO RICO","QA":"QATAR","RE":"RÉUNION","RO":"ROMANIA","RU":"RUSSIAN FEDERATION","RW":"RWANDA","BL":"SAINT BARTHÉLEMY","SH":"SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA","KN":"SAINT KITTS AND NEVIS","LC":"SAINT LUCIA","MF":"SAINT MARTIN (FRENCH PART)","PM":"SAINT PIERRE AND MIQUELON","VC":"SAINT VINCENT AND THE GRENADINES","WS":"SAMOA","SM":"SAN MARINO","ST":"SAO TOME AND PRINCIPE","SA":"SAUDI ARABIA","SN":"SENEGAL","RS":"SERBIA","SC":"SEYCHELLES","SL":"SIERRA LEONE","SG":"SINGAPORE","SX":"SINT MAARTEN (DUTCH PART)","SK":"SLOVAKIA","SI":"SLOVENIA","SB":"SOLOMON ISLANDS","SO":"SOMALIA","ZA":"SOUTH AFRICA","GS":"SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS","SS":"SOUTH SUDAN","ES":"SPAIN","LK":"SRI LANKA","SD":"SUDAN","SR":"SURINAME","SJ":"SVALBARD AND JAN MAYEN","SZ":"SWAZILAND","SE":"SWEDEN","CH":"SWITZERLAND","SY":"SYRIAN ARAB REPUBLIC","TW":"TAIWAN, PROVINCE OF CHINA","TJ":"TAJIKISTAN","TZ":"TANZANIA, UNITED REPUBLIC OF","TH":"THAILAND","TL":"TIMOR-LESTE","TG":"TOGO","TK":"TOKELAU","TO":"TONGA","TT":"TRINIDAD AND TOBAGO","TN":"TUNISIA","TR":"TURKEY","TM":"TURKMENISTAN","TC":"TURKS AND CAICOS ISLANDS","TV":"TUVALU","UG":"UGANDA","UA":"UKRAINE","AE":"UNITED ARAB EMIRATES","GB":"UNITED KINGDOM","US":"UNITED STATES","UM":"UNITED STATES MINOR OUTLYING ISLANDS","UY":"URUGUAY","UZ":"UZBEKISTAN","VU":"VANUATU","VE":"VENEZUELA, BOLIVARIAN REPUBLIC OF","VN":"VIET NAM","VG":"VIRGIN ISLANDS, BRITISH","VI":"VIRGIN ISLANDS, U.S.","WF":"WALLIS AND FUTUNA","EH":"WESTERN SAHARA","YE":"YEMEN","ZM":"ZAMBIA","ZW":"ZIMBABWE"};
    if (parts.length > 2) throw new SyntaxError('Unexpected number of segments ' + parts.length);
    if (parts.length > 1)
        return (ISO639_1[parts[0]] || ISO639_2[parts[0]] || parts[0]) + ', ' + (ISO3166_1[parts[1]] || parts[1]);
    if (parts.length > 0)
        return ISO639_1[parts[0]] || ISO639_2[parts[0]] || ISO3166_1[parts[0]] || parts[0];
    return '';
}

export function handleDate (d) {
  if (d) {
    let c = new Date(d)
    return c.toDateString() + ' ' + formatAMPM(c)
  }
}
export function getMetaUrls (text) {
  /* eslint-disable */
  var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  /* eslint-enable */
  var testUrl = text.match(urlRegex)
  return testUrl
}
export function formatDateTime (x) {
  var today = new Date()
  var n = new Date(x)
  var days = ['SUN', 'MON', 'TUES', 'WED', 'THU', 'FRI', 'SAT']
  var month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  var s = ''
  if (today.getFullYear() === n.getFullYear()) {
    if (today.getMonth() === n.getMonth()) {
      if (today.getDay() === n.getDay()) {
        s = formatAMPM(n)
      } else {
        s = days[n.getDay()] + ', ' + formatAMPM(n)
      }
    } else {
      s = month[n.getMonth()] + ' ' + n.getDate() + 'TH, ' + formatAMPM(n)
    }
  } else {
    s = (n.getMonth() + 1) + '/' + n.getDate() + '/' + n.getFullYear() + ' ' + formatAMPM(n)
  }

  return s
}

export function getCurrentProduct () {
  const hostname = window.location.hostname
  if (hostname.includes('kiboengage.cloudkibo.com') || window.location.port.includes('3021')) {
    console.log('KiboEngage')
    return 'KiboEngage'
  } else if (hostname.includes('kibochat.cloudkibo.com') || window.location.port.includes('3022')) {
    console.log('KiboChat')
    return 'KiboChat'
  } else {
    return 'localhost'
  }
}

export function isWebURL (value) {
  let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/
  return regexp.test(value)
}

export function getHostName (url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
    return match[2]
  } else {
    return null
  }
}

export function validateYoutubeURL (url) {
  if (url !== undefined || url !== '') {
      /* eslint-disable */
      let regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/
      /* eslint-disable */
      let match = url.match(regExp)
      return match && match[2].length === 11
  } else {
      return false
  }
}

export function isWebViewUrl (value) {
  let regexp = /^(http|https):///
  return regexp.test(value)
}
export function isFacebookPageUrl (value) {
  /* contains facebook url followed by alphabets, numerals or dot */
  let regexp = /^(https?:\/\/)?(www\.|web\.)?facebook.com\/(?!\/)[.a-zA-Z0-9/]*/g
  return regexp.test(value)
}
export function isTwitterUrl (value) {
  /* contains twitter url followed by alphabets, numerals or underscore */
  let regexp = /^(https?:\/\/)?(www\.)?twitter.com\/(?!\/)[_a-zA-Z0-9/]*/g
  return regexp.test(value)
}

export function isRssUrl(value) {
  let regexp = /(feed|rss)/
  return regexp.test(value)
}
export function testUserName (userName) {
  if (userName.length < 1) {
    return false
  }
  /* must not end with .com or .net */
  let regexp = /^(?!.*[.]com$)(?!.*[.]net$).*$/
  return regexp.test(userName)
}
export function doesPageHaveSubscribers (pages, pageId) {
  console.log('doesPageHaveSubscribers pages', pages)
  console.log('doesPageHaveSubscribers pageId', pageId)
  if (pages && pageId[0]) {
    let result = pages.find(page => {
      return page.pageId === pageId[0]
    })
    console.log('doesPageHaveSubscribers result', result)
    if (result) {
      return result.subscribers > 0
    }
  }
  return true
}
export function getAccountsUrl () {
  var url = 'http://localhost:3024'
  const hostname = window.location.hostname

  if (['skiboengage.cloudkibo.com', 'skibochat.cloudkibo.com', 'skibolite.cloudkibo.com'].indexOf(hostname) > -1) {
    url = 'https://saccounts.cloudkibo.com'
  } else if (['kiboengage.cloudkibo.com', 'kibochat.cloudkibo.com', 'kibolite.cloudkibo.com'].indexOf(hostname) > -1) {
    url = 'https://accounts.cloudkibo.com'
  }
  return url
}

export function readShopifyInstallRequest () {
  return cookie.load('installByShopifyStore')
}

export function removeShopifyInstallRequest () {
  cookie.remove('installByShopifyStore')
}

export function setWebViewUrl(url){
  let newUrl = isWebViewUrl(url) ? url : `http://${url}`
  return newUrl
}

export function getVideoId (url) {
  /* eslint-disable */
  let r, rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/
  /* eslint-enable */
  r = url.match(rx)
  return r ? r[1] : false
}
