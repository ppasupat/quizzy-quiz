// ################################
// Utilities

function randRange(a, b) {
  if (b === undefined)
    return Math.floor(Math.random() * a);
  return Math.floor(Math.random() * (b - a) + a);
}

function randChoice(stuff) {
  return stuff[randRange(stuff.length)];
}

function randTwoChoices(stuff) {
  let a = randRange(stuff.length), b = randRange(stuff.length - 1);
  if (b >= a) b++;
  return [stuff[a], stuff[b]];
}

// Shuffle in-place
function randShuffle(stuff) {
  let n = stuff.length;
  for (let i = n - 1; i >= 0; i--) {
    let j = randRange(i + 1);
    let tmp = stuff[i]; stuff[i] = stuff[j]; stuff[j] = tmp;
  }
  return stuff;
}

// ################################
// Level generators

/*
A level generator is a function that returns:
  {
    question: something appendable to question-pane,
    answers: array of [is_correct, answer],
    message: (optional) message for wrong answer,
  }.
No need to shuffle the answers.

The function can take an argument "utils" which provides
special functions (see main.js).
*/

// Mapping level name --> generator
const LGs = {};

// Simple arithmetic
LGs['simple_arith'] = function () {
  let a = randChoice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  let b = randChoice([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  let d = randChoice([-1, 1]);
  return {
    question: $('<p>').append("" + a + " + " + b),
    answers: [
      [true, "" + (a + b)],
      [false, "" + (a + b + d)],
    ],
  };
};
LGs['simple_arith_2'] = function () {
  let a = randChoice([3, 4, 5, 6, 7, 8, 9]);
  let b = randChoice([3, 4, 5, 6, 7, 8, 9]);
  let d = randChoice([[-1, 0], [1, 0], [0, -1], [0, 1]]);
  return {
    question: $('<p>').append("" + a + " × " + b),
    answers: [
      [true, "" + (a * b)],
      [false, "" + ((a + d[0]) * (b + d[1]))],
    ],
  };
};
LGs['simple_arith_parity'] = function () {
  let a = randChoice([1, 2, 3, 4, 5]);
  let b = randChoice([1, 2, 3, 4, 5]);
  let c = randChoice([1, 2, 3, 4, 5]);
  let d = a + b + c;
  return {
    question: $('<p>').append("" + a + " + " + b + " + " + c),
    answers: [
      [true, d % 2 == 0 ? "คู่" : "คี่"],
      [false, d % 2 == 0 ? "คี่" : "คู่"],
    ],
  };
};
LGs['simple_arith_parity_2'] = function () {
  let a = randChoice([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let b = randChoice([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  let c = randChoice([1, 2, 3, 4, 5]);
  let d = a * b + c;
  return {
    question: $('<p>').append("(" + a + " × " + b + ") + " + c),
    answers: [
      [true, d % 2 == 0 ? "คู่" : "คี่"],
      [false, d % 2 == 0 ? "คี่" : "คู่"],
    ],
  };
};

// Day of the Week
LGs['day_of_the_week'] = function () {
  let names = ["วันอาทิตย์", "วันจันทร์", "วันอังคาร", "วันพุธ", "วันพฤหัส", "วันศุกร์", "วันเสาร์"];
  let d = new Date(), a = d.getDay();
  let b = randRange(6);
  if (b >= a) b++;
  return {
    question: $('<p>').append("วันนี้วันอะไร"),
    answers: [[true, names[a]], [false, names[b]]],
  }
};

// Thai province
LGs['province'] = function () {
  let a = randChoice([
    ["เชียงใหม่", "เชียงเก่า"],
    ["กระบี่", "กระบอง"],
    ["แม่ฮ่องสอน", "พ่อฮ่องสอน"],
    ["ร้อยเอ็ด", "ร้อยสอง"],
    ["เลย", "เลย์"],
    ["นครปฐม", "นครมัธยม"],
    ["อ่างทอง", "อ่างเงิน"],
    ["ยะลา", "ละยา"],
    ["ระยอง", "ยะรอง"],
    ["สมุทรสาคร", "สมุทรสาคู"],
    ["สระแก้ว", "สระน้ำ"],
  ]);
  return {
    question: $('<p>').append("ข้อใดเป็นชื่อ<span class=emp>จังหวัด</span>"),
    answers: [[true, a[0]], [false, a[1]]],
  };
}

// Country
LGs['country'] = function () {
  let a = randChoice([
    ["ฝรั่งเศส", "เศษฝรั่ง"],
    ["เยอรมัน", "เยอรเผือก"],
    ["อินเดีย", "เอาท์เดีย"],
    ["เกาหลีใต้", "เกาหลีตะวันออก"],
    ["อิรัก", "อิชัง"],
    ["เปรู", "เรปู"],
    ["เยเมน", "เยเนม"],
    ["มาลี", "มานี"],
    ["จอร์แดน", "จอแบน"],
    ["ปานามา", "ปามานา"],
    ["บรูไน", "บรูนอก"],
  ]);
  return {
    question: $('<p>').append("ข้อใดเป็นชื่อ<span class=emp>ประเทศ</span>"),
    answers: [[true, a[0]], [false, a[1]]],
  };
}

// Geography Trivia
LGs['geography_trivia'] = function () {
  let qa = randChoice([
    ["ยอดเขาที่<span class=emp>สูง</span>ที่สุดในโลก", "เอเวอเรสต์", "ดอยสุเทพ"],
    ["มหาสมุทรที่<span class=emp>ใหญ่</span>ที่สุดในโลก", "แปซิฟิก", "แอตแลนติก"],
    ["มหาสมุทรที่<span class=emp>เล็ก</span>ที่สุดในโลก", "อาร์กติก", "อินเดีย"],
    ["น้ำตกที่<span class=emp>สูง</span>ที่สุดในโลก", "เอนเจล", "ไนแอการา"],
    ["แม่น้ำที่<span class=emp>ยาว</span>ที่สุดในโลก", "ไนล์", "แอมะซอน"],
    ["ทวีปที่<span class=emp>ใหญ่</span>ที่สุดในโลก", "เอเชีย", "แอฟริกา"],
    ["ทวีปที่<span class=emp>เล็ก</span>ที่สุดในโลก", "ออสเตรเลีย", "แอนตาร์กติกา"],
    ["ร่องสมุทรที่<span class=emp>ลึก</span>ที่สุดในโลก", "มาเรียนา", "มินดาเนา"],
  ]);
  return {
    question: $('<p>').append(qa[0]),
    answers: [[true, qa[1]], [false, qa[2]]],
  };
}

// Thai Trivia
LGs['thai_trivia'] = function () {
  let qa = randChoice([
    ["ธนบัตร", "รัชกาลที่ 5", "รัชกาลที่ 7"],
    ["นามสกุล", "รัชกาลที่ 6", "รัชกาลที่ 4"],
    ["ถนนแบบตะวันตก", "รัชกาลที่ 4", "รัชกาลที่ 6"],
    ["หนังสือพิมพ์", "รัชกาลที่ 3", "รัชกาลที่ 5"],
    ["รถไฟ", "รัชกาลที่ 5", "รัชกาลที่ 7"],
    ["ธนาคารเอกชน", "รัชกาลที่ 5", "รัชกาลที่ 3"],
    ["โรงภาพยนตร์", "รัชกาลที่ 9", "รัชกาลที่ 7"],
    ["โทรเลข", "รัชกาลที่ 5", "รัชกาลที่ 6"],
  ]);
  return {
    question: $('<p>').append('<span class=emp>' + qa[0] + '</span><br>มีในไทยเมื่อใด'),
    answers: [[true, qa[1]], [false, qa[2]]],
  };
}

// Noun Unit
LGs['noun_unit'] = function () {
  let qa = randChoice([
    ["พระพุทธรูป", "องค์", "รูป"],
    ["ขลุ่ย", "เลา", "ลำ"],
    ["พลั่ว", "เล่ม", "คัน"],
    ["อิฐ", "แผ่น", "อัด"],
    ["ค้อน", "เต้า", "เล่ม"],
    ["เจดีย์", "องค์", "ยอด"],
    ["ชิงช้า", "อัน", "ตัว"],
    ["ปรอท", "อัน", "แท่ง"],
    ["ไม้ยมก", "ตัว", "หยัก"],
    ["หวี", "เล่ม", "คัน"],
  ]);
  return {
    question: $('<p>').append('ลักษณนามของ<br><span class=emp>' + qa[0] + '</span>'),
    answers: [[true, qa[1]], [false, qa[2]]],
  };
}

// Misnomer Trivia
LGs['misnomer_trivia'] = function () {
  let qa = randChoice([
    ["<span class=emp>สงครามร้อยปี</span><br><span class=tiny>(อังกฤษ - ฝรั่งเศส)</span><br>ยาวกี่ปี", "116 ปี", "100 ปี"],
    ["<span class=emp>Thousand Islands</span><br><span class=tiny>(อเมริกา - แคนาดา)</span><br>มีกี่เกาะ ", "1864 เกาะ", "1000 เกาะ"],
    ["<span class=emp>เลขอารบิก</span>แต่แรกมาจากชาติใด", "อินเดีย", "จีน"],
    ["<span class=emp>เฟรนช์ฮอร์น</span>มาจากชาติใด", "เยอรมัน", "อิตาลี"],
    ["<span class=emp>หมากฮอสจีน</span>มาจากชาติใด", "เยอรมัน", "อินเดีย"],
    ["<span class=emp>ข้าวผัดอเมริกัน</span>มาจากชาติใด", "ไทย", "จีน"],
    ["<span class=emp>ขนมจีน</span>มาจากชาติใด", "มอญ", "มลายู"],
    ["<span class=emp>คุกกี้สิงคโปร์</span>มาจากชาติใด", "ไทย", "เบลเยียม"],
    ["<span class=emp>กระเพาะปลา</span>เป็นอวัยวะอะไร", "ถุงลม", "ไต"],
    ["<span class=emp>ปูอัด</span>ทำมาจากอะไร", "ปลา", "กุ้ง"],
  ]);
  return {
    question: $('<p>').append(qa[0]),
    answers: [[true, qa[1]], [false, qa[2]]],
  };
}

// Blue whale
LGs['blue_whale'] = function () {
  return {
    question: "สิ่งมีชีวิตอะไรที่ใหญ่ที่สุด",
    answers: [[true, "วาฬสีน้ำเงิน"], [false, "วาฬสีน้ำเงินชุบแป้งทอด"]],
    message: ["ถ้าชุบแป้งทอด", "ก็ไม่มีชีวิตแล้วสิ"],
  };
}

// Crow color
LGs['crow_color'] = function () {
  let qas = randTwoChoices([
    ["red", "สีแดง", "กาชาด"],
    ["orange", "สีส้ม", "การ์ฟีลด์"],
    ["#CCCC00", "สีเหลือง", "กาสาวพัสตร์"],
    ["brown", "สีน้ำตาล", "กาแฟนม"],
    ["green", "สีเขียว", "กาฝาก"],
    ["gray", "สีเทา", "กาน้ำเหล็ก"],
    ["black", "สีดำ", "กาปกติ"],
  ])
  return {
    question: $('<p>').append('กาอะไร')
      .append($('<span>').css('color', qas[0][0]).text(qas[0][1])),
    answers: [[true, qas[0][2]], [false, qas[1][2]]],
  };
}

// Physician types
LGs['physician'] = function () {
  let qas = randTwoChoices([
    ["หัวใจ", "Cardiologist"],
    ["ผิวหนัง", "Dermatologist"],
    ["ระบบฮอร์โมน", "Endocrinologist"],
    ["ระบบย่อยอาหาร", "Gastroenterologist"],
    ["เลือด", "Hematologist"],
    ["ไต", "Nephrologist"],
    ["มะเร็ง", "Oncologist"],
    ["ตา", "Ophthalmologist"],
    ["หูคอจมูก", "Otolaryngologist"],
    ["ปอด", "Pulmonologist"],
    ["ข้อ", "Rheumatologist"],
    ["ทางเดินฉี่", "Urologist"],
  ]);
  return {
    question: $('<p>').append('หมออะไรดูแลโรค<br><span class=emp>' + qas[0][0] + '</span>'),
    answers: [[true, qas[0][1]], [false, qas[1][1]]],
  };
}

// Fish pun
LGs['fish_pun'] = function () {
  let qas = randTwoChoices([
    ["สุภาพ", "ปลาคาร์พ"],
    ["ขี้เกียจ", "ปลาวาฬ"],
    ["เหนื่อย", "ปลาร้า"],
    ["ครูชอบ", "ปาเจรา"],
    ["มีสองหน้า", "ปลาทูน่า"],
    ["ผู้ชายกลัว", "ปลาปักเป้า"],
    ["มีสามหน้า", "ปลากระป๋องสามแม่ครัว"],
    ["ครองถิ่น", "ปลาเก๋า"],
    ["อึไม่ออก", "ปลาไส้ตัน"],
    ["เป็นลูกไก่", "ปลาช่อน"],
  ]);
  return {
    question: $('<p>').append('ปลาอะไร<br><span class=emp>' + qas[0][0] + '</span>'),
    answers: [[true, qas[0][1]], [false, qas[1][1]]],
  };
}

// Province pun
LGs['province_pun'] = function () {
  let qas = randTwoChoices([
    ["เณรเยอะ", "พะเยา"],
    ["ช้างกลัว", "พังงา"],
    ["แห้งสนิท", "ตาก"],
    ["ผีกล้วยกลัว", "ปัตตานี"],
    ["ข้าวลอย", "นครนายก"],
    ["แม่ค้าเยอะ", "ตราด"],
    ["สัตว์ป่าเกรงกลัว", "นครราชสีมา"],
    ["ต้องย้อนกลับ", "เลย"],
    ["ไม่ได้อยู่นี่", "น่าน"],
    ["พี่ชายพ่อเย็น", "พัทลุง"],
  ]);
  return {
    question: $('<p>').append('จังหวัดอะไร<br><span class=emp>' + qas[0][0] + '</span>'),
    answers: [[true, qas[0][1]], [false, qas[1][1]]],
  };
}

// Water pun
LGs['water_pun'] = function() {
  let qa = randChoice([
    ["น้ำกลัวอะไร", "รุ้ง", "ลม"],
    ["อะไรกลัวน้ำ", "ลม", "รุ้ง"],
  ]);
  return {
    question: $('<p>').append(qa[0]),
    answers: [[true, qa[1]], [false, qa[2]]],
  };
}

// Letter before
LGs['letter_before_eng'] = function() {
  let a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let b = randRange(2, a.length);
  return {
    question: $('<p>').append('พยัญชนะก่อน <span class=emp>' + a[b] + '</span>'),
    answers: [[true, a[b-1]], [false, a[b-2]]],
  };
}
LGs['letter_before_thai'] = function() {
  let a = "กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรลวศษสหฬอฮ";
  let b = randRange(2, a.length);
  return {
    question: $('<p>').append('พยัญชนะก่อน <span class=emp>' + a[b] + '</span>'),
    answers: [[true, a[b-1]], [false, a[b-2]]],
  };
}

// Shirt color
LGs['shirt_color'] = function () {
  let qas = randTwoChoices([
    ["จันทร์", "แดง"],
    ["อังคาร", "ขาว / เหลือง"],
    ["พุธ", "ชมพู / ส้ม"],
    ["พฤหัส", "ดำ / ม่วง"],
    ["ศุกร์", "เทา / ดำ"],
    ["เสาร์", "เขียว"],
    ["อาทิตย์", "น้ำเงิน / ฟ้า"],
  ]);
  return {
    question: $('<p>')
      .append($('<span class=emp>').text('วัน' + qas[0][0]))
      .append('<br>ไม่ควรใส่เสื้อสีอะไร'),
    answers: [[true, qas[0][1]], [false, qas[1][1]]],
  };
}

// Fruit
LGs['x3_fruit'] = function () {
  let corrects = randTwoChoices([
    "มะก่อ", "มะขวิด", "มะงั่ว", "มะดัน",
    "มะดูก", "มะตูม", "มะไฟ", "มะยม",
    "มะปริง", "มะปี๊ด", "มะพลับ", "มะพูด",
    "มะเฟือง", "มะแฟน", "มะเม่า", "มะริด",
    "มะหวด", "มะหลอด", "มะหาด", "มะพร้าว", "มะนาวไม่รู้โห่",
  ]);
  let wrong = randChoice([
    "มะกะโรนี", "มะงุมมะงาหรา", "มะเดหวี", "มะโต",
    "มะมี่", "มะแม", "มะเรื่อง", "มะตะบะ",
    "มะโรง", "มะลิ่ม", "มะเส็ง", "มะเหงก", "มะเมีย",
  ]);
  return {
    question: $('<p>').append("ข้อใดเป็นชื่อ<span class=emp>ผลไม้</span>"),
    answers: [[true, corrects[0]], [true, corrects[1]], [false, wrong]],
  };
}

// Hormones
LGs['x3_hormone'] = function () {
  let corrects = randTwoChoices([
    "Adrenaline", "Aldosterone",
    "Calcitonin", "Cortisol", "Estrogen", "Gastrin",
    "Glucagon", "Insulin", "Leptin",
    "Melatonin", "Norepinephrine", "Oxytocin", "Progesterone",
    "Prolactin", "Serotonin", "Testosterone", "Thyroxine",
  ]);
  let wrong = randChoice([
    "Auxin", "Cytokinin", "Gibberellin",
  ]);
  return {
    question: $('<p>').append("ข้อใดเป็นชื่อ<br><span class=emp>ฮอร์โมนในมนุษย์</span>"),
    answers: [[true, corrects[0]], [true, corrects[1]], [false, wrong]],
  };
}

// Hormones
LGs['x3_spelling'] = function () {
  let corrects = randTwoChoices([
    "กะเพรา", "ไข่มุก", "ขาดดุล", "ต้นตำรับ",
    "ทะนุถนอม", "ทแยง", "นวัตกรรม", "บำเหน็จ",
    "ไผท", "อนุญาต", "อัญชัน", "สำอาง", "เสลด",
  ]);
  let wrong = randChoice([
    "กระเพรา", "ไข่มุข", "ขาดดุลย์", "ต้นตำหรับ",
    "ทนุถนอม", "ทะแยง", "นวัฒกรรม", "บำเน็จ",
    "ผไท", "อนุญาติ", "อัญชัญ", "สำอางค์", "สเลด",
  ]);
  return {
    question: $('<p>').append("คำใด<span class=emp>สะกดถูก</span>"),
    answers: [[true, corrects[0]], [true, corrects[1]], [false, wrong]],
  };
}

// Animal
LGs['x3_animal'] = function () {
  let bank = {
    "0": [
      "กบแรกเกิด", "งูเห่า", "ปลา", "หนอน",
      "หอย", "แมวน้ำ", "พยาธิ", "วาฬสีน้ำเงิน",
    ],
    "2": [
      "กบ สุวนันท์", "ค้างคาว",
      "นกแก้ว", "คนแขนขาด", "แมวมอง",
      "<span>หนู<span class=tiny>น้อยหมวกแดง</span></span>",
    ],
    "4": [
      "กบ", "หมีขาว", "กวาง", "หนู",
      "ยีราฟยกขา", "แมวเปอร์เซีย",
    ],
  };
  let keys = randTwoChoices(["0", "2", "4"]);
  let corrects = randTwoChoices(bank[keys[0]]);
  let wrong = randChoice(bank[keys[1]]);
  return {
    question: $('<p>').append("สัตว์ใดมี <span class=emp>" + keys[0] + "</span> ขา"),
    answers: [[true, corrects[0]], [true, corrects[1]], [false, wrong]],
  };
}

// Pokemon
LGs['x4_pokemon'] = function () {
  let answers = [];
  let corrects = randShuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 3);
  let wrong = randRange(12);
  corrects.forEach(function (x) {
    answers.push(
      [true, $('<div class=img-pokemon>').css({
        'background-position-x': '' + (x * 130) + 'px',
      })]);
  });
  answers.push(
    [false, $('<div class=img-pokemon>').css({
      'background-position-x': '' + (wrong * 130) + 'px',
      'background-position-y': '130px',
    })]);
  return {
    question: $('<p>').append("ข้อใดเป็น<span class=emp>โปเกมอน</span>"),
    answers: answers,
  };
}

// ASEAN flags
LGs['x4_asean'] = function () {
  let answers = [];
  let corrects = randShuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
  let wrong = randRange(10);
  corrects.forEach(function (x) {
    answers.push(
      [true, $('<div class=img-asean>').css({
        'background-position-x': '' + (x * 130) + 'px',
      })]);
  });
  answers.push(
    [false, $('<div class=img-asean>').css({
      'background-position-x': '' + (wrong * 130) + 'px',
      'background-position-y': '130px',
    })]);
  return {
    question: $('<p>').append("ข้อใดเป็น<br><span class=emp>ประเทศ ASEAN</span>"),
    answers: answers,
  };
}

// Last question
LGs['x3_last'] = function (utils) {
  return {
    question: $('<p>').append("ใคร<span class=emp>น่ารัก</span>ที่สุด"),
    answers: [[true, "ผู้เล่น"], [true, "ฉันเอง"], [true, utils.getPlayerName()]],
  };
}
