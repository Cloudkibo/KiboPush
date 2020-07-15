import cookie from 'react-cookie'
import auth from './auth.service'

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

export function validatePhoneNumber (number) {
  const regex = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/g
  return number.match(regex)
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
  /* eslint-disable */
  var regexp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
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

export function deleteFile (serverPath, handleResponse) {
  console.log('deleting file', serverPath)
  fetch(`${getAccountsUrl()}/deleteFile/${serverPath}`, {
    method: 'delete',
    headers: new Headers({
      'Authorization': `Bearer ${auth.getToken()}`
    })
  }).then((res) => {
      console.log('deleteFile response', res)
      if (handleResponse) {
        handleResponse(res)
      }
    }
  )
}

export function deleteFiles (payload, newFiles, filesToKeep) {
  let files = getFileIdsOfBroadcast(payload)
  for (let i = 0; i < files.length; i++) {
    let canBeDeleted = true
    if (filesToKeep) {
      for (let j = 0; j < filesToKeep.length; j++) {
        if (files[i] === filesToKeep[j]) {
          canBeDeleted = false
          break
        }
      }
    }
    if (canBeDeleted) {
      if (newFiles) {
        for (let j = newFiles.length-1; j >= 0; j--) {
          if (files[i] === newFiles[j]) {
            newFiles.splice(j, 1)
          }
        }
      }
      deleteFile(files[i])
    }
  }
  return newFiles
}

export function getFileIdsOfComponent (component) {
  let files = []
  if (component.file && component.file.fileurl && component.file.fileurl.id) {
    files.push(component.file.fileurl.id)
  } else if (component.fileurl && component.fileurl.id) {
    files.push(component.fileurl.id)
  } else if (component.cards) {
    for (let j = 0; j < component.cards.length; j++) {
      if (component.cards[j].fileurl) {
        files.push(component.cards[j].fileurl.id)
      }
    }
  }
  return files
}

export function getFileIdsOfBroadcast (payload) {
  let files = []
  if (payload) {
    for (let i = 0; i < payload.length; i++) {
      let component = payload[i]
      files = files.concat(getFileIdsOfComponent(component))
    }
  }
  return files
}


export function getFileIdsOfMenu (menuItems) {
  let initialFiles = []
  for (let i = 0; i < menuItems.length; i++) {
    let menuItem = menuItems[i]
    if (menuItem.payload) {
      initialFiles = initialFiles.concat(getFileIdsOfBroadcast(JSON.parse(menuItem.payload)))
    }
    if (menuItem.submenu) {
      for (let j = 0; j < menuItem.submenu.length; j++) {
        let subItem = menuItem.submenu[j]
        if (subItem.payload) {
          initialFiles = initialFiles.concat(getFileIdsOfBroadcast(JSON.parse(subItem.payload)))
        }
        if (subItem.submenu) {
          for (let k = 0; k < subItem.submenu.length; k++) {
            let nestedItem = subItem.submenu[k]
            if (nestedItem.payload) {
              initialFiles = initialFiles.concat(getFileIdsOfBroadcast(JSON.parse(nestedItem.payload)))
            }
          }
        }
      }
    }
  }
  return initialFiles
}

export function deleteInitialFiles (initialFiles, currentFiles) {
  for (let i = initialFiles.length - 1; i >= 0; i--) {
    let foundFile = false
    for (let j = 0; j < currentFiles.length; j++) {
      if (initialFiles[i] === currentFiles[j]) {
        foundFile = true
        break
      }
    }
    if (!foundFile) {
      deleteFile(initialFiles[i])
      initialFiles.splice(i, 1)
    }
  }
  return initialFiles
}

export function getTimeZone() {
  var offset = new Date().getTimezoneOffset(), o = Math.abs(offset);
  return (offset < 0 ? "+" : "-") + ("00" + Math.floor(o / 60)).slice(-2) + ":" + ("00" + (o % 60)).slice(-2);
}

export function getFileIdFromUrl (url) {
  let index = url.lastIndexOf('/')
  let fileId = url.substr(index+1, url.length)
  return fileId
}

export var LANGUAGE_BY_LOCALE = {
  af_NA: "Afrikaans (Namibia)",
  af_ZA: "Afrikaans (South Africa)",
  af: "Afrikaans",
  ak_GH: "Akan (Ghana)",
  ak: "Akan",
  sq_AL: "Albanian (Albania)",
  sq: "Albanian",
  am_ET: "Amharic (Ethiopia)",
  am: "Amharic",
  ar_DZ: "Arabic (Algeria)",
  ar_BH: "Arabic (Bahrain)",
  ar_EG: "Arabic (Egypt)",
  ar_IQ: "Arabic (Iraq)",
  ar_JO: "Arabic (Jordan)",
  ar_KW: "Arabic (Kuwait)",
  ar_LB: "Arabic (Lebanon)",
  ar_LY: "Arabic (Libya)",
  ar_MA: "Arabic (Morocco)",
  ar_OM: "Arabic (Oman)",
  ar_QA: "Arabic (Qatar)",
  ar_SA: "Arabic (Saudi Arabia)",
  ar_SD: "Arabic (Sudan)",
  ar_SY: "Arabic (Syria)",
  ar_TN: "Arabic (Tunisia)",
  ar_AE: "Arabic (United Arab Emirates)",
  ar_YE: "Arabic (Yemen)",
  ar: "Arabic",
  hy_AM: "Armenian (Armenia)",
  hy: "Armenian",
  as_IN: "Assamese (India)",
  as: "Assamese",
  asa_TZ: "Asu (Tanzania)",
  asa: "Asu",
  az_Cyrl: "Azerbaijani (Cyrillic)",
  az_Cyrl_AZ: "Azerbaijani (Cyrillic, Azerbaijan)",
  az_Latn: "Azerbaijani (Latin)",
  az_Latn_AZ: "Azerbaijani (Latin, Azerbaijan)",
  az: "Azerbaijani",
  bm_ML: "Bambara (Mali)",
  bm: "Bambara",
  eu_ES: "Basque (Spain)",
  eu: "Basque",
  be_BY: "Belarusian (Belarus)",
  be: "Belarusian",
  bem_ZM: "Bemba (Zambia)",
  bem: "Bemba",
  bez_TZ: "Bena (Tanzania)",
  bez: "Bena",
  bn_BD: "Bengali (Bangladesh)",
  bn_IN: "Bengali (India)",
  bn: "Bengali",
  bs_BA: "Bosnian (Bosnia and Herzegovina)",
  bs: "Bosnian",
  bg_BG: "Bulgarian (Bulgaria)",
  bg: "Bulgarian",
  my_MM: "Burmese (Myanmar [Burma])",
  my: "Burmese",
  yue_Hant_HK: "Cantonese (Traditional, Hong Kong SAR China)",
  ca_ES: "Catalan (Spain)",
  ca: "Catalan",
  tzm_Latn: "Central Morocco Tamazight (Latin)",
  tzm_Latn_MA: "Central Morocco Tamazight (Latin, Morocco)",
  tzm: "Central Morocco Tamazight",
  chr_US: "Cherokee (United States)",
  chr: "Cherokee",
  cgg_UG: "Chiga (Uganda)",
  cgg: "Chiga",
  zh_Hans: "Chinese (Simplified Han)",
  zh_Hans_CN: "Chinese (Simplified Han, China)",
  zh_Hans_HK: "Chinese (Simplified Han, Hong Kong SAR China)",
  zh_Hans_MO: "Chinese (Simplified Han, Macau SAR China)",
  zh_Hans_SG: "Chinese (Simplified Han, Singapore)",
  zh_Hant: "Chinese (Traditional Han)",
  zh_Hant_HK: "Chinese (Traditional Han, Hong Kong SAR China)",
  zh_Hant_MO: "Chinese (Traditional Han, Macau SAR China)",
  zh_Hant_TW: "Chinese (Traditional Han, Taiwan)",
  zh: "Chinese",
  kw_GB: "Cornish (United Kingdom)",
  kw: "Cornish",
  hr_HR: "Croatian (Croatia)",
  hr: "Croatian",
  cs_CZ: "Czech (Czech Republic)",
  cs: "Czech",
  da_DK: "Danish (Denmark)",
  da: "Danish",
  nl_BE: "Dutch (Belgium)",
  nl_NL: "Dutch (Netherlands)",
  nl: "Dutch",
  ebu_KE: "Embu (Kenya)",
  ebu: "Embu",
  en_AS: "English (American Samoa)",
  en_AU: "English (Australia)",
  en_BE: "English (Belgium)",
  en_BZ: "English (Belize)",
  en_BW: "English (Botswana)",
  en_CA: "English (Canada)",
  en_GU: "English (Guam)",
  en_HK: "English (Hong Kong SAR China)",
  en_IN: "English (India)",
  en_IE: "English (Ireland)",
  en_IL: "English (Israel)",
  en_JM: "English (Jamaica)",
  en_MT: "English (Malta)",
  en_MH: "English (Marshall Islands)",
  en_MU: "English (Mauritius)",
  en_NA: "English (Namibia)",
  en_NZ: "English (New Zealand)",
  en_MP: "English (Northern Mariana Islands)",
  en_PK: "English (Pakistan)",
  en_PH: "English (Philippines)",
  en_SG: "English (Singapore)",
  en_ZA: "English (South Africa)",
  en_TT: "English (Trinidad and Tobago)",
  en_UM: "English (U.S. Minor Outlying Islands)",
  en_VI: "English (U.S. Virgin Islands)",
  en_GB: "English (United Kingdom)",
  en_US: "English (United States)",
  en_ZW: "English (Zimbabwe)",
  en: "English",
  eo: "Esperanto",
  et_EE: "Estonian (Estonia)",
  et: "Estonian",
  ee_GH: "Ewe (Ghana)",
  ee_TG: "Ewe (Togo)",
  ee: "Ewe",
  fo_FO: "Faroese (Faroe Islands)",
  fo: "Faroese",
  fil_PH: "Filipino (Philippines)",
  fil: "Filipino",
  fi_FI: "Finnish (Finland)",
  fi: "Finnish",
  fr_BE: "French (Belgium)",
  fr_BJ: "French (Benin)",
  fr_BF: "French (Burkina Faso)",
  fr_BI: "French (Burundi)",
  fr_CM: "French (Cameroon)",
  fr_CA: "French (Canada)",
  fr_CF: "French (Central African Republic)",
  fr_TD: "French (Chad)",
  fr_KM: "French (Comoros)",
  fr_CG: "French (Congo - Brazzaville)",
  fr_CD: "French (Congo - Kinshasa)",
  fr_CI: "French (Côte d’Ivoire)",
  fr_DJ: "French (Djibouti)",
  fr_GQ: "French (Equatorial Guinea)",
  fr_FR: "French (France)",
  fr_GA: "French (Gabon)",
  fr_GP: "French (Guadeloupe)",
  fr_GN: "French (Guinea)",
  fr_LU: "French (Luxembourg)",
  fr_MG: "French (Madagascar)",
  fr_ML: "French (Mali)",
  fr_MQ: "French (Martinique)",
  fr_MC: "French (Monaco)",
  fr_NE: "French (Niger)",
  fr_RW: "French (Rwanda)",
  fr_RE: "French (Réunion)",
  fr_BL: "French (Saint Barthélemy)",
  fr_MF: "French (Saint Martin)",
  fr_SN: "French (Senegal)",
  fr_CH: "French (Switzerland)",
  fr_TG: "French (Togo)",
  fr: "French",
  ff_SN: "Fulah (Senegal)",
  ff: "Fulah",
  gl_ES: "Galician (Spain)",
  gl: "Galician",
  lg_UG: "Ganda (Uganda)",
  lg: "Ganda",
  ka_GE: "Georgian (Georgia)",
  ka: "Georgian",
  de_AT: "German (Austria)",
  de_BE: "German (Belgium)",
  de_DE: "German (Germany)",
  de_LI: "German (Liechtenstein)",
  de_LU: "German (Luxembourg)",
  de_CH: "German (Switzerland)",
  de: "German",
  el_CY: "Greek (Cyprus)",
  el_GR: "Greek (Greece)",
  el: "Greek",
  gu_IN: "Gujarati (India)",
  gu: "Gujarati",
  guz_KE: "Gusii (Kenya)",
  guz: "Gusii",
  ha_Latn: "Hausa (Latin)",
  ha_Latn_GH: "Hausa (Latin, Ghana)",
  ha_Latn_NE: "Hausa (Latin, Niger)",
  ha_Latn_NG: "Hausa (Latin, Nigeria)",
  ha: "Hausa",
  haw_US: "Hawaiian (United States)",
  haw: "Hawaiian",
  he_IL: "Hebrew (Israel)",
  he: "Hebrew",
  hi_IN: "Hindi (India)",
  hi: "Hindi",
  hu_HU: "Hungarian (Hungary)",
  hu: "Hungarian",
  is_IS: "Icelandic (Iceland)",
  is: "Icelandic",
  ig_NG: "Igbo (Nigeria)",
  ig: "Igbo",
  id_ID: "Indonesian (Indonesia)",
  id: "Indonesian",
  ga_IE: "Irish (Ireland)",
  ga: "Irish",
  it_IT: "Italian (Italy)",
  it_CH: "Italian (Switzerland)",
  it: "Italian",
  ja_JP: "Japanese (Japan)",
  ja: "Japanese",
  kea_CV: "Kabuverdianu (Cape Verde)",
  kea: "Kabuverdianu",
  kab_DZ: "Kabyle (Algeria)",
  kab: "Kabyle",
  kl_GL: "Kalaallisut (Greenland)",
  kl: "Kalaallisut",
  kln_KE: "Kalenjin (Kenya)",
  kln: "Kalenjin",
  kam_KE: "Kamba (Kenya)",
  kam: "Kamba",
  kn_IN: "Kannada (India)",
  kn: "Kannada",
  kk_Cyrl: "Kazakh (Cyrillic)",
  kk_Cyrl_KZ: "Kazakh (Cyrillic, Kazakhstan)",
  kk: "Kazakh",
  km_KH: "Khmer (Cambodia)",
  km: "Khmer",
  ki_KE: "Kikuyu (Kenya)",
  ki: "Kikuyu",
  rw_RW: "Kinyarwanda (Rwanda)",
  rw: "Kinyarwanda",
  kok_IN: "Konkani (India)",
  kok: "Konkani",
  ko_KR: "Korean (South Korea)",
  ko: "Korean",
  khq_ML: "Koyra Chiini (Mali)",
  khq: "Koyra Chiini",
  ses_ML: "Koyraboro Senni (Mali)",
  ses: "Koyraboro Senni",
  lag_TZ: "Langi (Tanzania)",
  lag: "Langi",
  lv_LV: "Latvian (Latvia)",
  lv: "Latvian",
  lt_LT: "Lithuanian (Lithuania)",
  lt: "Lithuanian",
  luo_KE: "Luo (Kenya)",
  luo: "Luo",
  luy_KE: "Luyia (Kenya)",
  luy: "Luyia",
  mk_MK: "Macedonian (Macedonia)",
  mk: "Macedonian",
  jmc_TZ: "Machame (Tanzania)",
  jmc: "Machame",
  kde_TZ: "Makonde (Tanzania)",
  kde: "Makonde",
  mg_MG: "Malagasy (Madagascar)",
  mg: "Malagasy",
  ms_BN: "Malay (Brunei)",
  ms_MY: "Malay (Malaysia)",
  ms: "Malay",
  ml_IN: "Malayalam (India)",
  ml: "Malayalam",
  mt_MT: "Maltese (Malta)",
  mt: "Maltese",
  gv_GB: "Manx (United Kingdom)",
  gv: "Manx",
  mr_IN: "Marathi (India)",
  mr: "Marathi",
  mas_KE: "Masai (Kenya)",
  mas_TZ: "Masai (Tanzania)",
  mas: "Masai",
  mer_KE: "Meru (Kenya)",
  mer: "Meru",
  mfe_MU: "Morisyen (Mauritius)",
  mfe: "Morisyen",
  naq_NA: "Nama (Namibia)",
  naq: "Nama",
  ne_IN: "Nepali (India)",
  ne_NP: "Nepali (Nepal)",
  ne: "Nepali",
  nd_ZW: "North Ndebele (Zimbabwe)",
  nd: "North Ndebele",
  nb_NO: "Norwegian Bokmål (Norway)",
  nb: "Norwegian Bokmål",
  nn_NO: "Norwegian Nynorsk (Norway)",
  nn: "Norwegian Nynorsk",
  nyn_UG: "Nyankole (Uganda)",
  nyn: "Nyankole",
  or_IN: "Oriya (India)",
  or: "Oriya",
  om_ET: "Oromo (Ethiopia)",
  om_KE: "Oromo (Kenya)",
  om: "Oromo",
  ps_AF: "Pashto (Afghanistan)",
  ps: "Pashto",
  fa_AF: "Persian (Afghanistan)",
  fa_IR: "Persian (Iran)",
  fa: "Persian",
  pl_PL: "Polish (Poland)",
  pl: "Polish",
  pt_BR: "Portuguese (Brazil)",
  pt_GW: "Portuguese (Guinea-Bissau)",
  pt_MZ: "Portuguese (Mozambique)",
  pt_PT: "Portuguese (Portugal)",
  pt: "Portuguese",
  pa_Arab: "Punjabi (Arabic)",
  pa_Arab_PK: "Punjabi (Arabic, Pakistan)",
  pa_Guru: "Punjabi (Gurmukhi)",
  pa_Guru_IN: "Punjabi (Gurmukhi, India)",
  pa: "Punjabi",
  ro_MD: "Romanian (Moldova)",
  ro_RO: "Romanian (Romania)",
  ro: "Romanian",
  rm_CH: "Romansh (Switzerland)",
  rm: "Romansh",
  rof_TZ: "Rombo (Tanzania)",
  rof: "Rombo",
  ru_MD: "Russian (Moldova)",
  ru_RU: "Russian (Russia)",
  ru_UA: "Russian (Ukraine)",
  ru: "Russian",
  rwk_TZ: "Rwa (Tanzania)",
  rwk: "Rwa",
  saq_KE: "Samburu (Kenya)",
  saq: "Samburu",
  sg_CF: "Sango (Central African Republic)",
  sg: "Sango",
  seh_MZ: "Sena (Mozambique)",
  seh: "Sena",
  sr_Cyrl: "Serbian (Cyrillic)",
  sr_Cyrl_BA: "Serbian (Cyrillic, Bosnia and Herzegovina)",
  sr_Cyrl_ME: "Serbian (Cyrillic, Montenegro)",
  sr_Cyrl_RS: "Serbian (Cyrillic, Serbia)",
  sr_Latn: "Serbian (Latin)",
  sr_Latn_BA: "Serbian (Latin, Bosnia and Herzegovina)",
  sr_Latn_ME: "Serbian (Latin, Montenegro)",
  sr_Latn_RS: "Serbian (Latin, Serbia)",
  sr: "Serbian",
  sn_ZW: "Shona (Zimbabwe)",
  sn: "Shona",
  ii_CN: "Sichuan Yi (China)",
  ii: "Sichuan Yi",
  si_LK: "Sinhala (Sri Lanka)",
  si: "Sinhala",
  sk_SK: "Slovak (Slovakia)",
  sk: "Slovak",
  sl_SI: "Slovenian (Slovenia)",
  sl: "Slovenian",
  xog_UG: "Soga (Uganda)",
  xog: "Soga",
  so_DJ: "Somali (Djibouti)",
  so_ET: "Somali (Ethiopia)",
  so_KE: "Somali (Kenya)",
  so_SO: "Somali (Somalia)",
  so: "Somali",
  es_AR: "Spanish (Argentina)",
  es_BO: "Spanish (Bolivia)",
  es_CL: "Spanish (Chile)",
  es_CO: "Spanish (Colombia)",
  es_CR: "Spanish (Costa Rica)",
  es_DO: "Spanish (Dominican Republic)",
  es_EC: "Spanish (Ecuador)",
  es_SV: "Spanish (El Salvador)",
  es_GQ: "Spanish (Equatorial Guinea)",
  es_GT: "Spanish (Guatemala)",
  es_HN: "Spanish (Honduras)",
  es_419: "Spanish (Latin America)",
  es_MX: "Spanish (Mexico)",
  es_NI: "Spanish (Nicaragua)",
  es_PA: "Spanish (Panama)",
  es_PY: "Spanish (Paraguay)",
  es_PE: "Spanish (Peru)",
  es_PR: "Spanish (Puerto Rico)",
  es_ES: "Spanish (Spain)",
  es_US: "Spanish (United States)",
  es_UY: "Spanish (Uruguay)",
  es_VE: "Spanish (Venezuela)",
  es: "Spanish",
  sw_KE: "Swahili (Kenya)",
  sw_TZ: "Swahili (Tanzania)",
  sw: "Swahili",
  sv_FI: "Swedish (Finland)",
  sv_SE: "Swedish (Sweden)",
  sv: "Swedish",
  gsw_CH: "Swiss German (Switzerland)",
  gsw: "Swiss German",
  shi_Latn: "Tachelhit (Latin)",
  shi_Latn_MA: "Tachelhit (Latin, Morocco)",
  shi_Tfng: "Tachelhit (Tifinagh)",
  shi_Tfng_MA: "Tachelhit (Tifinagh, Morocco)",
  shi: "Tachelhit",
  dav_KE: "Taita (Kenya)",
  dav: "Taita",
  ta_IN: "Tamil (India)",
  ta_LK: "Tamil (Sri Lanka)",
  ta: "Tamil",
  te_IN: "Telugu (India)",
  te: "Telugu",
  teo_KE: "Teso (Kenya)",
  teo_UG: "Teso (Uganda)",
  teo: "Teso",
  th_TH: "Thai (Thailand)",
  th: "Thai",
  bo_CN: "Tibetan (China)",
  bo_IN: "Tibetan (India)",
  bo: "Tibetan",
  ti_ER: "Tigrinya (Eritrea)",
  ti_ET: "Tigrinya (Ethiopia)",
  ti: "Tigrinya",
  to_TO: "Tonga (Tonga)",
  to: "Tonga",
  tr_TR: "Turkish (Turkey)",
  tr: "Turkish",
  uk_UA: "Ukrainian (Ukraine)",
  uk: "Ukrainian",
  ur_IN: "Urdu (India)",
  ur_PK: "Urdu (Pakistan)",
  ur: "Urdu",
  uz_Arab: "Uzbek (Arabic)",
  uz_Arab_AF: "Uzbek (Arabic, Afghanistan)",
  uz_Cyrl: "Uzbek (Cyrillic)",
  uz_Cyrl_UZ: "Uzbek (Cyrillic, Uzbekistan)",
  uz_Latn: "Uzbek (Latin)",
  uz_Latn_UZ: "Uzbek (Latin, Uzbekistan)",
  uz: "Uzbek",
  vi_VN: "Vietnamese (Vietnam)",
  vi: "Vietnamese",
  vun_TZ: "Vunjo (Tanzania)",
  vun: "Vunjo",
  cy_GB: "Welsh (United Kingdom)",
  cy: "Welsh",
  yo_NG: "Yoruba (Nigeria)",
  yo: "Yoruba",
  zu_ZA: "Zulu (South Africa)",
  zu: "Zulu"
}
