import type { BlockAnalysis } from './types.ts';

/**
 * 블록 분석 — Claude가 이미지를 직접 보고 기존 한국어 설명과 책(9판)을 대조해 작성한 초안.
 * 키는 Are.na 블록 번호(제목 앞 숫자).
 *
 * - en: 블록에 붙일 영어 설명
 * - concepts: 라우어 개념 태그 → 개념별 채널 커넥션에 쓴다
 * - check: ok(책과 맞음) · expand(맞지만 더 쓸 것) · revise(책 용어와 다름)
 * - notes: 점검 메모(한국어)
 *
 * Are.na에는 review/에서 승인된 것만 반영한다(scripts/arena-push.mjs).
 */
export const analysis: Record<number, BlockAnalysis> = {
  1: {
    en: 'A pop-up poster for 5M pairs a grayscale aerial map of Seoul with a faint alphanumeric grid. The darkened coordinates trace the same curve as the Han River above, so the grid repeats the line of the map and ties the two halves together, while the scattered event details continue the path downward.',
    concepts: ['unity.continuity-grid', 'unity.repetition', 'line.implied', 'emphasis.contrast'],
    check: 'revise',
    notes: [
      '‘중앙에 5M을 위치시켰다’보다 더 중요한 장치: 진하게 표시된 좌표(3A → 4B → … → 2Z)가 위 지도의 한강 곡선을 그대로 따라간다. 그리드 위에 암시된 선(136쪽)이 지도와 반복되어 두 영역을 잇는다.',
      '‘반복과 강조’를 책 용어로: 그리드(40쪽)의 반복 + 명도 대비에 의한 강조(58쪽).',
    ],
  },
  2: {
    en: 'A walking figure dissolves into horizontal streaks, as if scanned mid-step. The blurred outlines and the layered traces trailing behind the body read as speed, while the dark silhouette against a pale wall keeps the stride legible.',
    concepts: ['motion.blurred', 'motion.multiple-image', 'value.contrast', 'shape.figure-ground'],
    check: 'expand',
    notes: [
      '‘흔들림 혹은 흐림 효과’는 책의 흐린 윤곽(Blurred Outlines, 236쪽). 몸 뒤로 겹겹이 남은 층은 다중 이미지(238쪽)와도 이어진다.',
      '대각선으로 벌어진 보폭이 예상되는 움직임을 만든다는 점을 더할 수 있다.',
    ],
  },
  3: {
    en: 'A bust seems cast from liquid light: glossy swirls stand in for skin, and the contour melts into the white ground. Dark, warped streaks radiate from a burst of light at the throat, which becomes the focal point and appears to bend the surrounding space.',
    concepts: ['texture.visual', 'line.lost-found', 'emphasis.focal-point', 'balance.radial'],
    check: 'expand',
    notes: [
      '‘미지의 재질’을 시각적 질감(192쪽)으로 구체화: 액체처럼 매끈한 반사와 소용돌이 무늬.',
      '목의 빛은 방사형으로 퍼지는 어두운 선들이 모이는 초점. 윤곽이 흰 바탕으로 녹아드는 것은 사라졌다 나타나는 윤곽(148쪽).',
    ],
  },
  4: {
    en: 'A walker reduced to a flat black silhouette crosses a bright, empty wall. With detail removed, value contrast alone separates figure from ground, and the vertical edge of the wall against the diagonal stride turns the scene into an arrangement of line and negative space.',
    concepts: ['value.contrast', 'shape.figure-ground', 'shape.positive-negative', 'line.direction'],
    check: 'expand',
    notes: [
      '‘선과 여백’을 책 용어로: 왼쪽 벽 모서리의 수직선과 인물의 대각선 보폭(선의 방향, 138쪽), 여백은 음형(170쪽).',
      '명암 대비가 형과 바탕(152쪽)을 극단적으로 가른다는 점까지 쓰면 분석이 완성된다.',
    ],
  },
  5: {
    en: 'A body folded into a single arc fills the frame, its black knit catching just enough light to reveal a fine textile texture. The curvilinear silhouette is cropped at the edges in an open form, so the bend seems to continue beyond the picture.',
    concepts: ['shape.curvilinear', 'texture.visual', 'value.contrast', 'space.open-closed'],
    check: 'revise',
    notes: [
      '‘기하학적인 실루엣’ → 실제로는 활처럼 휜 곡선형(curvilinear, 166쪽) 형태다.',
      '팔과 몸이 화면 가장자리에서 잘리는 열린 형식(222쪽)이 굽힘을 화면 밖까지 확장한다.',
      '‘만져질 듯한 물질성’은 시각적 질감(192쪽).',
    ],
  },
  6: {
    en: 'Shot from below, a hand pushed toward the lens looms larger than the face, an amplified perspective that makes the figure feel overwhelming. Petal-like black shoulders against pale skin create strong value contrast and turn the portrait into a sculptural mass.',
    concepts: ['space.amplified', 'scale.contrast', 'value.contrast', 'shape.curvilinear'],
    check: 'revise',
    notes: [
      '‘극단적인 원근감’ · ‘왜곡된 비율’은 라우어의 증폭된 원근(Amplified Perspective, 216쪽): 대상이 관람자를 정면으로 향할 때의 극적인 단축이다.',
      '비례 자체를 바꾼 왜곡(8장 160쪽)과는 구분한다 — 여기서 손은 시점 때문에 커 보인다.',
    ],
  },
  7: {
    en: 'A dark profile wears a visor of what looks like rippling liquid metal. As the only bright, glossy area on the head, the visor becomes the focal point by contrast, and its organic, wavering texture plays against the flat, anonymous silhouette.',
    concepts: ['emphasis.contrast', 'texture.visual', 'shape.biomorphic', 'value.contrast'],
    check: 'ok',
    notes: ['‘선명하게 대비된다’의 결과까지 쓰면 좋다: 바이저가 대비에 의한 강조(58쪽)로 초점이 된다. 일렁이는 액체 금속은 시각적 질감(192쪽).'],
  },
  8: {
    en: 'Hundreds of bright, tangled lines build a head and neck out of darkness. Where the strokes crowd together they read as light planes, so line becomes value and suggests volume, while the contour keeps fading into the black ground.',
    concepts: ['line.value', 'line.lost-found', 'line.quality', 'value.contrast'],
    check: 'expand',
    notes: [
      '빛의 선이 모여 형태를 이루는 방식은 명도로서의 선(142쪽): 선이 촘촘한 곳이 밝은 면이 되어 부피를 만든다.',
      '윤곽이 끊기며 어둠으로 사라지는 사라졌다 나타나는 윤곽(148쪽)도 함께 쓸 수 있다.',
    ],
  },
  9: {
    en: 'A figure glows white against a black field, its surface dusted with coarse grain. Soft, bleeding edges and sharp spikes at the shoulders blur the boundary between body and light, so the extreme value contrast reads as something luminous rather than human.',
    concepts: ['value.contrast', 'texture.visual', 'line.lost-found', 'shape.distortion'],
    check: 'ok',
    notes: [
      '거친 입자(노이즈)는 시각적 질감(192쪽), 번지는 경계선은 사라졌다 나타나는 윤곽(148쪽).',
      '오탈자: ‘다가오게 끔’ → ‘다가오게끔’.',
    ],
  },
  10: {
    en: 'Here the light, not the face, is the figure: a glowing mass of hair and skin tilts diagonally across a dark, starry field, while the profile itself is left as a dark negative shape. Faint color fringes along the edges make the boundary flicker like a lens glitch.',
    concepts: ['shape.ambiguity', 'shape.positive-negative', 'value.contrast', 'color.discord'],
    check: 'expand',
    notes: [
      '제목 ‘Reverse’가 핵심: 밝은 빛 덩어리가 형이 되고 얼굴 옆선은 어두운 음형으로 남는 형 · 바탕 반전(176쪽).',
      '색수차는 책의 용어가 아니다. 경계가 떨려 보이는 효과는 진동하는 색(283쪽)으로 옮겨 쓸 수 있다.',
      '설명이 두 문장으로 짧다 — 사선으로 기운 빛 덩어리의 구도를 더하면 좋다.',
    ],
  },
  11: {
    en: 'A face is almost entirely a black shape cut out of a white ground; only a few sharp white strokes mark the eye, brow and lips. With contour and volume removed, these quick lines carry the whole expression, and the single drawn eye becomes the focal point.',
    concepts: ['line.lost-found', 'line.quality', 'shape.figure-ground', 'emphasis.focal-point'],
    check: 'expand',
    notes: [
      '‘몇 가닥의 흰 선이 표정을 암시’ → 사라졌다 나타나는 윤곽(148쪽)과 선의 질(140쪽, 날카롭고 빠른 선).',
      '유일하게 그려진 눈이 초점이라는 점, 아래로 숙인 사선 구도를 더할 수 있다.',
    ],
  },
  12: {
    en: 'A close-up eye holds a full moon in its iris, and star shapes drip down like tears. The bright iris is the only high-contrast area in a gray, monochrome frame, so it anchors the gaze, while the moon-in-an-eye shift of scale gives the image its dreamlike logic.',
    concepts: ['value.emphasis', 'emphasis.focal-point', 'scale.fantasy', 'color.monochromatic'],
    check: 'expand',
    notes: [
      '설명이 한 문장: 회색 화면에서 유일한 고대비인 눈동자가 초점(명도에 의한 강조, 248쪽).',
      '눈 속의 달은 스케일과 환상(78쪽)의 예 — 크기 관계를 뒤섞어 초현실적 장면을 만든다.',
      '머리카락 선이 화면을 가로질러 눈을 감싸는 구도도 더할 수 있다.',
    ],
  },
  13: {
    en: 'Seen from behind, a translucent body reveals a spine of machinery, pistons and cables. Transparency lets skin and mechanism read at once, setting the smooth curvilinear silhouette against the dense, hard-edged parts inside.',
    concepts: ['space.transparency', 'shape.curvilinear', 'shape.rectilinear', 'value.contrast'],
    check: 'ok',
    notes: ['‘반투명한 외피 너머’는 투명성(224쪽) — 겉과 속이 동시에 보인다. 유려한 곡선(곡선형)과 기계 부품(직선형)의 조합(168쪽)으로 정리할 수 있다.'],
  },
  14: {
    en: 'Clear plastic plates and tubing wrap a head like a prosthetic apparatus. The transparent layers overlap without hiding one another, and the tubes act as lines that loop around the skull, pulling the eye in circles over a soft gray ground.',
    concepts: ['space.transparency', 'unity.continuation', 'texture.visual', 'unity.repetition'],
    check: 'expand',
    notes: [
      '‘기하학적인 장치’ — 실제로는 휘어진 튜브가 많다. 튜브가 선이 되어 머리 둘레로 시선을 돌린다.',
      '겹친 투명판이 서로를 가리지 않는 투명성(224쪽), 투명 플라스틱의 시각적 질감(192쪽).',
    ],
  },
  15: {
    en: 'An android in profile is cased in a glass-clear shell, so the dark machinery inside reads straight through the surface. Swelling, muscle-like curves and two cables arcing from the helmet keep the hard-edged object feeling alive against the empty white ground.',
    concepts: ['space.transparency', 'shape.curvilinear', 'texture.visual', 'value.contrast'],
    check: 'expand',
    notes: ['‘유기적인 생동감’의 근거를 형태로: 근육처럼 부푼 곡선형(166쪽) 외피와 헬멧에서 휘어 나온 케이블. 겉과 속이 함께 보이는 것은 투명성(224쪽).'],
  },
  16: {
    en: 'A faceless chrome bust stands in near-perfect bilateral symmetry inside a thin ring of light. The halo centers attention on the reflective head, while the tangle of cables spilling below breaks the formal order just enough to keep the icon unsettling.',
    concepts: ['balance.symmetrical', 'balance.radial', 'emphasis.placement', 'texture.visual'],
    check: 'ok',
    notes: [
      '대칭이 주는 성스러움 = 형식적 균형(92쪽)의 영속 · 위엄. 머리를 중심에 둔 후광 원은 배치에 의한 강조(62쪽)와 방사 균형(106쪽).',
      '오른팔 쪽 부품과 아래로 늘어진 케이블이 대칭을 살짝 깨 변화를 준다는 점을 더할 수 있다.',
    ],
  },
  17: {
    en: 'A glossy black helmet-head rises from a sheer, flower-printed robe, flanked by two fan-shaped mesh forms like sound waves. The frontal symmetry is calm and ceremonial, but the textures clash: a smooth, featureless dome against floral pattern and dotted mesh.',
    concepts: ['balance.symmetrical', 'texture.pattern', 'texture.visual', 'space.transparency'],
    check: 'expand',
    notes: [
      '‘극명한 이질감’의 조형적 근거: 질감이 전혀 없는 매끈한 검은 두상 vs 꽃무늬 패턴(180쪽)과 점 망사의 대비.',
      '정면 좌우 대칭(92쪽)이 고전적 · 의식적인 인상을 만들고, 양옆 망사가 머리를 둘러싸 후광처럼 작동한다.',
    ],
  },
  18: {
    en: 'A robotic hand is rendered in clear silicone, exposing a skeleton of white bones, screws and hinged joints. The same joint structure repeats down each finger at slightly different lengths, a varied repetition that gives the precise mechanism an anatomical rhythm.',
    concepts: ['space.transparency', 'unity.varied-repetition', 'value.contrast', 'texture.visual'],
    check: 'ok',
    notes: ['손가락마다 같은 관절 구조가 길이만 바뀌어 되풀이된다 — 변화된 반복(44쪽). 검은 바탕 위 투명 외피는 투명성(224쪽).'],
  },
  19: {
    en: 'Flowers appear as if X-rayed: translucent petals and stems glow white on black, overlapping without hiding each other. With color removed, five blossoms repeat at different sizes and angles, so the eye reads their thin edges and layered structure rather than their hue.',
    concepts: ['space.transparency', 'color.monochromatic', 'unity.varied-repetition', 'shape.curvilinear'],
    check: 'ok',
    notes: ['‘색을 소거해 본질에 집중’은 책의 단색(무채색) 배색 설명과 일치(278쪽: 형태와 질감을 부각). 꽃 다섯 송이가 크기 · 각도를 바꿔 반복되는 변화된 반복(44쪽)도 더할 수 있다.'],
  },
  20: {
    en: 'A folded dress shirt is seen as an X-ray, its collar, cuffs and folded panels stacked as translucent gray layers. Wherever layers overlap the value deepens, building a quiet scale of grays, while the vertical row of buttons anchors the composition like a spine.',
    concepts: ['space.transparency', 'value.pattern', 'unity.repetition', 'shape.rectilinear'],
    check: 'ok',
    notes: ['겹친 층마다 명도가 한 단계씩 어두워지는 것이 깊이의 근거(투명성 224쪽, 명도 패턴 246쪽). 단추의 수직 반복(36쪽)이 중심축 역할을 한다.'],
  },
  21: {
    en: 'A skeletal torso, from shoulders to pelvis, is laid out in strict bilateral symmetry on a white field. Ribs and vertebrae repeat while gradually changing size from top to bottom, so the structure reads both as a stable frame and as a progressive rhythm.',
    concepts: ['balance.symmetrical', 'rhythm.progressive', 'unity.repetition', 'space.transparency'],
    check: 'expand',
    notes: ['좌우 대칭은 대칭 균형(92쪽). 갈비뼈와 척추 마디가 위에서 아래로 크기를 바꿔 반복되는 것은 점진적 리듬(120쪽)으로도 읽을 수 있다.'],
  },
  22: {
    en: 'A transparent machine is shown in vertical section: stacked cylinders, rows of fins and a bundle of tubes. The rectilinear body is almost symmetrical, but the clear hoses curling in from the left break that order with a fluid, asymmetrical line.',
    concepts: ['space.transparency', 'shape.rectilinear', 'shape.curvilinear', 'rhythm.alternating'],
    check: 'expand',
    notes: [
      '직선형 몸체 속 곡선 튜브 — 형태 조합(168쪽). 세로축 대칭을 왼쪽에서 휘어 드는 튜브가 깨뜨려 변화를 준다.',
      '양옆에 일정 간격으로 박힌 핀은 교차 리듬(118쪽)처럼 박자를 만든다.',
    ],
  },
  23: {
    en: 'A small rectangular device is X-rayed to reveal gears, motors and a lens inside its smooth case. Within the soft grays, the darkest circle of the lens becomes the focal point, and the round parts play against the rectilinear outline of the housing.',
    concepts: ['space.transparency', 'value.emphasis', 'shape.rectilinear', 'shape.curvilinear'],
    check: 'ok',
    notes: ['가장 어두운 원(렌즈)이 회색 톤 속 초점이 된다(명도에 의한 강조, 248쪽). 직사각형 외곽과 원형 부품의 조합(168쪽).'],
  },
  24: {
    en: 'A transparent hard case is cropped to a single corner and hinge, set on a steep diagonal against white. The open form lets the object run off the frame, and the large empty area on the left balances the dense layered edges on the right.',
    concepts: ['line.direction', 'space.open-closed', 'shape.positive-negative', 'balance.asymmetrical'],
    check: 'ok',
    notes: ['‘사선의 구도’ = 대각선(138쪽) — 정지한 사물에 움직임을 준다. 화면 밖으로 잘린 열린 형식(222쪽), 왼쪽의 큰 여백(음형)과 오른쪽 사물이 이루는 비대칭 균형(96쪽).'],
  },
  25: {
    en: 'A single translucent tube bends into a mirror-symmetrical glyph, half sign, half organism. Soft gradients give the tube volume, and where it overlaps itself the hidden turns stay visible, so a flat emblem gains depth.',
    concepts: ['balance.symmetrical', 'shape.biomorphic', 'value.space', 'space.transparency'],
    check: 'expand',
    notes: [
      '좌우 대칭(92쪽)이 이것을 ‘기호’처럼 읽히게 하는 이유다. 굵기가 일정한 튜브의 반복(36쪽).',
      '명암 그라데이션은 명도와 공간(250쪽) — 부피감. 겹친 부분이 비치는 것은 투명성(224쪽).',
    ],
  },
  26: {
    en: 'The same soft tube zigzags through space, each bend shading from pale on the left to dark on the right. The eye follows the unbroken path from end to end, a smooth legato line whose stepwise change in value also reads as a progressive rhythm.',
    concepts: ['unity.continuation', 'rhythm.legato', 'rhythm.progressive', 'value.space'],
    check: 'expand',
    notes: [
      '‘시선이 튜브를 따라 이동’ = 연속(38쪽). 왼쪽 밝음 → 오른쪽 어둠으로 굽이마다 명도가 바뀌는 것은 점진적 리듬(120쪽), 끊김 없는 곡선은 레가토(116쪽).',
      '‘조형적 리듬감’에 이 두 이름을 붙이면 4주차 리듬 용어와도 이어진다.',
    ],
  },
  27: {
    en: 'Translucent vertical bands ripple down the frame like falling fabric or smoke, darkening steadily toward the bottom. The flowing, overlapping curves form a legato rhythm that ends abruptly in three solid black semicircles, a hard full stop under a soft cascade.',
    concepts: ['rhythm.legato', 'rhythm.progressive', 'space.transparency', 'emphasis.contrast'],
    check: 'ok',
    notes: ['‘부드러운 리듬감’ = 레가토(116쪽), 위에서 아래로 짙어지는 명도는 점진적 리듬(120쪽). 끝의 검은 반원 세 개는 대비에 의한 강조(58쪽)로 마침표가 된다.'],
  },
  28: {
    en: 'Soft, rounded planes overlap like pooled liquid in a pale gray space. There are almost no hard edges; low value contrast and gentle shadows alone separate one plane from the next, creating a shallow, calm depth.',
    concepts: ['shape.curvilinear', 'space.overlapping', 'value.contrast', 'value.space'],
    check: 'ok',
    notes: ['‘윤곽선 대신 빛과 그림자로 면을 구분’ = 저대비 명도(244쪽)와 겹침(200쪽)이 만든 얕은 공간. 곡선형(166쪽).'],
  },
  29: {
    en: 'Three rock-like masses in a ruined landscape are encrusted with beads, whorls, holes and coiling lines, like coral or eroded stone. The forms are unnameable but their textures are rendered with uncanny precision, and the restless surface patterns animate otherwise heavy, static shapes.',
    concepts: ['shape.biomorphic', 'texture.visual', 'value.space', 'balance.symmetrical'],
    check: 'revise',
    notes: [
      '내용은 책과 잘 맞는다: 생물형태(163쪽), 시각적 질감(192쪽 — 책도 막스 에른스트의 질감 기법을 예로 든다).',
      'PDF에서 옮겨 붙인 줄바꿈이 남아 단어가 끊겨 있다: ‘형태 가’ → ‘형태가’, ‘생물형태 적’ → ‘생물형태적’, ‘소용돌 이’ → ‘소용돌이’, ‘시 각적’ → ‘시각적’ 등.',
      '업로드한 이미지는 흑백인데 설명은 녹색 · 황색 · 적색을 다룬다 — 원본 색을 기준으로 썼다고 밝히거나 컬러 이미지를 함께 올리는 것을 권한다. 작품 출처(작가 · 제목) 표기도 권장.',
    ],
  },
  30: {
    en: 'Loose biomorphic shapes float across a pale ground, outlined by quick black lines that do not quite match the patches of tone beneath them. The offset between line and shape records the speed of the brush, and the repeated directions of the strokes hold the scattered forms in one drifting current.',
    concepts: ['shape.biomorphic', 'line.painting', 'motion.kinesthetic', 'unity.repetition'],
    check: 'revise',
    notes: [
      '‘잔상의 표현’은 책의 잔상(afterimage, 망막 피로 · 240쪽)과 다르다. 윤곽선과 색면이 어긋난 것은 회화 속 선(144쪽) · 명시적 제스처 선(146쪽)으로, 형태는 생물형태(163쪽 — 책도 고르키의 그림을 예로 든다)로 쓰는 편이 정확하다.',
      '‘근육운동 감정이입’은 책 용어 운동감각적 공감(232쪽)과 정확히 같다 — 좋은 연결.',
      '형태들이 떨어져 있어도 방향이 반복되어 묶인다는 관찰은 반복(36쪽)에 의한 통일.',
    ],
  },
  31: {
    en: 'A standing nude is drawn with only a handful of quick contour lines that thicken and thin as they travel. The varying weight and the S-curve of the body carry the pose, so a nearly empty drawing still conveys weight, twist and balance.',
    concepts: ['line.gesture', 'line.quality', 'line.contour', 'motion.anticipated'],
    check: 'expand',
    notes: ['‘라인의 굵기 변화와 흐름’ = 선의 질(140쪽). 형태보다 자세와 무게를 잡는 빠른 선이므로 제스처 드로잉(132쪽)이라는 책 용어를 붙일 수 있다. 몸의 S자 곡선이 세로 화면을 가로지른다.'],
  },
  32: {
    en: 'A thin, wandering outline encloses a figure whose interior is packed with rough black brushwork and scraped grays. The contour holds the overall mass while the dense gestural marks inside churn against it, so the still image seems to pulse.',
    concepts: ['line.contour', 'line.painting', 'value.contrast', 'texture.tactile'],
    check: 'ok',
    notes: ['책 용어로: 가는 윤곽선(130쪽) + 붓질 자체가 선으로 독립하는 명시적 제스처 선(146쪽). 윤곽과 내부 붓질이 일치하지 않아 생기는 긴장이 움직임의 근거다.'],
  },
  33: {
    en: 'A crouching figure seen from behind is built from two languages: faint pencil lines for the upper body and heavy black brush strokes for the legs and hips. The weight sinks to the bottom of the sheet, and the contrast between barely-there line and dense mass charges the pose with coiled force.',
    concepts: ['line.gesture', 'line.lost-found', 'line.quality', 'balance.vertical'],
    check: 'expand',
    notes: [
      '위쪽은 가는 연필선, 아래는 묵직한 붓질 — 선의 질 대비(140쪽)와 사라졌다 나타나는 윤곽(148쪽).',
      '무게가 화면 아래로 쏠린 수직 배치(90쪽)가 웅크린 힘을 만든다.',
    ],
  },
  34: {
    en: 'A running horse is reduced to a dark smear on grainy white; legs, mane and tail dissolve into streaks. The blurred outlines and comet-like trailing shapes read as speed, and the strong figure-ground contrast keeps the motion legible.',
    concepts: ['motion.blurred', 'motion.fast-shapes', 'value.contrast', 'texture.visual'],
    check: 'revise',
    notes: [
      '‘잔상’ · ‘블러’는 책의 흐린 윤곽(236쪽). 갈기와 꼬리가 꼬리를 끄는 것은 속도를 띤 형태(237쪽).',
      '기술 단계에서 대상(달리는 말)을 먼저 밝히면 좋다 — 지금 설명에는 무엇이 움직이는지가 없다.',
    ],
  },
  35: {
    en: 'Several blurred runners overlap across the frame, like one figure exposed again and again in motion. Multiple image and blurred outlines turn time into space, and the evenly spaced silhouettes set a running beat that continues off the right edge.',
    concepts: ['motion.multiple-image', 'motion.blurred', 'motion.cropped', 'rhythm.alternating'],
    check: 'ok',
    notes: [
      '책 용어와 정확히 맞는다: 다중 이미지(238쪽) + 흐린 윤곽(236쪽).',
      '같은 간격으로 반복되는 인물은 교차 리듬처럼 박자를 만들고, 오른쪽에서 잘린 인물(235쪽)이 질주를 화면 밖까지 이어 간다.',
    ],
  },
  36: {
    en: 'A dancer is caught mid-leap, body tilted on a strong diagonal with hands flung back and knees tucked. The frozen instant implies the next one, and the viewer almost feels the stretch and lift in their own muscles.',
    concepts: ['motion.arrested', 'motion.anticipated', 'motion.kinesthetic', 'line.direction'],
    check: 'ok',
    notes: ['‘감정이입’ = 운동감각적 공감(232쪽), ‘사선으로 흐르는 신체의 축’ = 대각선(138쪽). 공중에 멈춘 찰나는 멈춘 동작(230쪽)과 예상되는 움직임(232쪽).'],
  },
  37: {
    en: 'Shot from the ground, a model mid-stride towers overhead; the near leg and sneaker swell enormously while the head shrinks against the sky. This amplified perspective and the long diagonal of the legs make the figure seem to stride out of the frame.',
    concepts: ['space.amplified', 'scale.contrast', 'line.direction', 'motion.anticipated'],
    check: 'revise',
    notes: [
      '‘강제 원근법’ → 라우어의 증폭된 원근(216쪽): 대상이 관람자를 향할 때의 극적 단축. 책의 신발 광고 예(다리가 관람자에게 뻗은 사진)와 같은 구도다.',
      '6번 블록과 제목이 같다(Distortion) — 구분되는 제목을 권한다(예: Stride).',
    ],
  },
  38: {
    en: 'An open hand thrusts toward the lens, its fingers spreading like rays around a small, impassive face. Amplified perspective makes the palm dominate the frame, while the radiating fingers frame the face and pull the eye back to it as the focal point.',
    concepts: ['space.amplified', 'scale.contrast', 'balance.radial', 'emphasis.placement'],
    check: 'revise',
    notes: [
      '‘강제 원근법’ → 증폭된 원근(216쪽). 책이 예로 드는 ‘관람자를 가리키는 손가락’과 거의 같은 구도다.',
      '37번과 문장이 거의 같다(‘극단적인 로우 앵글과 강제 원근법을 사용하여 동세감을 완성한다’). 이 이미지만의 특징을 쓰면 좋다: 펼친 손가락이 방사형으로 얼굴을 둘러싸 초점을 만든다(방사 균형 106쪽, 배치에 의한 강조 62쪽).',
    ],
  },
  39: {
    en: 'In a dark still life, pears, apples, a tulip and a small vase share the same swelling curves, while the knife and cutting board supply hard straight edges. The tulip stem arcs from the upper left down into the vase, a line of continuation that links distant objects into one loop for the eye.',
    concepts: ['unity.repetition', 'unity.varied-repetition', 'unity.continuation', 'shape.curvilinear'],
    check: 'ok',
    notes: [
      '통일 장의 장치를 거의 모두 정확히 짚은 모범 분석: 반복(36쪽), 변화된 반복(44쪽), 연속(38쪽).',
      '‘응집력’은 근접(34쪽)으로, ‘곡선 vs 직선’은 곡선형 · 직선형의 조합(168쪽)으로 옮겨 쓸 수 있다.',
    ],
  },
  40: {
    en: 'A band of rotund musicians crowds the stage, their round faces and bodies echoing the swollen curves of their instruments. Packed close together they read first as one mass, while the tilting couple dancing in front breaks the vertical rhythm with a lively diagonal.',
    concepts: ['unity.proximity', 'unity.repetition', 'unity.unity-variety', 'scale.human-standard'],
    check: 'expand',
    notes: [
      '근접 · 반복 · 게슈탈트 · 변화를 동반한 통일까지 정확하다.',
      '보테로 화풍으로 보인다 — 책 81쪽은 보테로의 부풀린 인물을 ‘비례’의 예로 든다. 제목 Fat Variation의 핵심인 과장된 비례를 4장 용어로 덧붙일 수 있다.',
      '오탈자: ‘없촏다’ → ‘없앴다’. 업로드 이미지는 흑백이라 색 설명은 원본 기준임을 밝히면 좋다.',
    ],
  },
  41: {
    en: 'A cable-stayed bridge is shot dead center: the pylon rises as a single vertical axis and the cables fan out symmetrically on both sides. Every line converges toward a vanishing point where a tiny figure stands, a placement that makes the smallest element the focus of the whole structure.',
    concepts: ['balance.symmetrical', 'space.one-point', 'balance.radial', 'emphasis.placement'],
    check: 'expand',
    notes: [
      '‘소실점’ 언급은 정확(1점 투시 210쪽). 케이블은 방사 균형(106쪽).',
      '놓치기 쉬운 점: 소실점 자리에 아주 작은 사람이 서 있다 — 배치에 의한 강조(62쪽)이자 스케일 대비(76쪽).',
    ],
  },
  42: {
    en: 'Zigzag concrete stairs repeat down the left half of the frame like a rigid pattern, while the right half is empty white. One tiny figure on a landing interrupts the repetition; isolated and minute, it becomes the focal point and gives the massive structure its scale.',
    concepts: ['unity.repetition', 'emphasis.isolation', 'scale.contrast', 'balance.asymmetrical'],
    check: 'ok',
    notes: [
      '‘작은 파격’은 고립에 의한 강조(60쪽)와 스케일 대비(76쪽)로 설명된다.',
      '오른쪽의 넓은 여백(음형)과 왼쪽 계단 덩어리의 비대칭 균형(96쪽), 계단 반복의 교차 리듬(118쪽)도 더할 수 있다.',
    ],
  },
  43: {
    en: 'Looking straight up, a rectilinear skylight grid is framed by four sweeping concrete curves. The rigid grid and the flowing forms could clash, but the four-way symmetry and continuous light along the curves bind them into one ordered, dreamlike whole.',
    concepts: ['unity.continuity-grid', 'unity.unity-variety', 'balance.radial', 'shape.curvilinear'],
    check: 'ok',
    notes: ['정확하다. 사방 대칭에 가까워 방사 균형(106쪽)으로도 볼 수 있다. 직선 그리드 + 곡선 = 형태 조합(168쪽), 변화를 동반한 통일(42쪽).'],
  },
  44: {
    en: 'Identical cylinders are packed edge to edge into one block that recedes on a diagonal. Proximity fuses them into a single graphic mass, and the gradient from black sides to white caps, plus the shrinking ends, gives the repetition depth and direction.',
    concepts: ['unity.proximity', 'unity.repetition', 'rhythm.progressive', 'line.direction'],
    check: 'ok',
    notes: ['책 용어로: 근접(34쪽) + 반복(36쪽). 원근 때문에 끝면이 점점 작아지는 것은 점진적 리듬(120쪽)으로도 읽히며, 대각선(138쪽)이 역동성을 더한다.'],
  },
  45: {
    en: 'A strict grid holds white bars that grow thinner toward the bottom and wider-spaced toward the right. Because the rule stays constant while the proportions shift step by step, the panel shows unity with variety and a progressive rhythm that flickers like an optical illusion.',
    concepts: ['rhythm.progressive', 'unity.unity-variety', 'unity.continuity-grid', 'motion.optical'],
    check: 'expand',
    notes: [
      '‘점진적인 변화’는 리듬 장의 점진적 리듬(120쪽) 그 자체다 — 3주차(통일) 블록이지만 4주차 개념의 정확한 사례.',
      '흰 막대가 왼쪽 위에서 촘촘하고 오른쪽 · 아래로 갈수록 성기고 가늘어져 깊이감과 깜빡임(광학적 움직임, 240쪽)을 만든다.',
    ],
  },
  46: {
    en: 'Scattered pixel islands of gray, each outlined in black, look random at first. Proximity gathers them into larger clusters, and the white channel left between the clusters reads as a single sweeping S-curve, so the empty space becomes a shape of its own.',
    concepts: ['unity.gestalt', 'unity.proximity', 'shape.positive-negative', 'shape.ambiguity'],
    check: 'expand',
    notes: [
      '근접과 게슈탈트의 연결은 정확하다.',
      '더할 점: 조각들 사이의 흰 음형이 큰 S자 통로를 만든다 — 책 32쪽 ‘빈 공간도 조직되어 보인다’, 170쪽 양형 · 음형.',
    ],
  },
  47: {
    en: 'Ellipses of different sizes are plotted on a visible construction grid, each labeled with its scale factor and anchored by points on guide circles. The hidden geometry is made explicit, so what looks like a scatter becomes a system of proportional variations.',
    concepts: ['line.inherent', 'unity.continuity-grid', 'unity.varied-repetition', 'scale.internal'],
    check: 'ok',
    notes: ['‘보이지 않는 그리드와 보조선’ = 내재된 선(134쪽)이 드러난 경우. 타원마다 ×1 ~ ×4.2의 비율이 적힌 내부 비례(74쪽) 실험이며, 크기를 바꾼 반복은 변화된 반복(44쪽).'],
  },
  48: {
    en: 'Identical white circles overlap around one center on a black field, forming a flower of life. Every circle turns around the same point, a radial balance of perfect order, and their overlaps generate new petal shapes that none of the circles contains on its own.',
    concepts: ['balance.radial', 'unity.repetition', 'shape.positive-negative', 'unity.gestalt'],
    check: 'expand',
    notes: [
      '‘중앙을 기준으로 대칭’보다 방사 균형(106쪽)이 더 정확하다 — 모든 원이 하나의 중심 둘레로 돈다(제목 Radial과도 맞음).',
      '겹침에서 생긴 꽃잎은 게슈탈트의 ‘전체는 부분의 합보다 크다’(32쪽)의 좋은 예.',
    ],
  },
  49: {
    en: 'A brick museum facade stacks several rhythms: round openings alternating with corner notches along the top, a regular row of arches at the base, windows that change size, and short bollards along the sidewalk. Framed by dark leaves above, these overlapping beats make a heavy wall feel lively.',
    concepts: ['rhythm.polyrhythmic', 'rhythm.alternating', 'rhythm.staccato', 'rhythm.progressive'],
    check: 'expand',
    notes: [
      '여러 리듬이 위아래로 겹친다는 관찰은 책의 다중 리듬 구조(Polyrhythmic Structures, 122쪽) — 그 이름을 붙이면 완성된다.',
      '위쪽 둥근 구멍과 ㄱ자 홈의 교대 = 교차 리듬(118쪽), 크기가 변하는 창 = 점진적 리듬(120쪽).',
      '업로드 이미지는 흑백이라 ‘붉은 벽돌’은 보이지 않는다 — 원본 기준임을 밝히면 좋다.',
    ],
  },
  50: {
    en: 'Sinuous beech trunks rise from a carpet of leaves into fog. Dark, sharply textured trees in front give way to paler, thinner ones behind, so the curving legato rhythm also recedes step by step into atmospheric depth.',
    concepts: ['rhythm.legato', 'rhythm.progressive', 'space.aerial', 'rhythm.kinesthetic'],
    check: 'expand',
    notes: [
      '책 115쪽에도 너도밤나무 숲 사진(렝거-파치)이 리듬의 예로 나온다 — 책은 그 리듬을 ‘구불구불하지만 조금 덜컹거리는’ 것으로 설명한다. 비교해 보면 좋다.',
      '뒤로 갈수록 옅어지는 나무는 대기 원근(204쪽)이라는 공간 용어로 정확히 짚을 수 있다. ‘근육운동감각’ → 운동감각적 공감(112쪽).',
    ],
  },
  51: {
    en: 'Angular metal panels with ribbed surfaces hang in staggered rows, their pointed ends jabbing downward. The broken, overlapping diagonals and crisp value contrast create a staccato rhythm, quick and percussive rather than flowing.',
    concepts: ['rhythm.staccato', 'rhythm.alternating', 'line.direction', 'texture.visual'],
    check: 'ok',
    notes: ['정확하다. 같은 패널이 엇갈려 되풀이되는 구조는 교차 리듬(118쪽), 패널의 세로 골은 시각적 질감(192쪽). 아래를 향한 화살표 같은 사선(138쪽)이 시선을 끌어내린다.'],
  },
  52: {
    en: 'A grid of shadowed cells is dusted with heavy grain, and a few cells blaze white. The bright squares step diagonally from upper right to lower left, giving the noisy surface an irregular, staccato beat that feels almost audible, like static.',
    concepts: ['texture.visual', 'rhythm.kinesthetic', 'rhythm.staccato', 'line.implied'],
    check: 'expand',
    notes: [
      '‘공감각적 리듬’ = 책 112쪽 감각의 공명: 시각적 리듬이 소리를 불러온다(버치필드의 매미 소리 그림과 같은 원리). 정확한 연결.',
      '더할 점: 밝은 칸이 오른쪽 위에서 왼쪽 아래로 계단처럼 이어져 사선의 암시된 선(136쪽)을 만든다. 노이즈는 시각적 질감(192쪽).',
    ],
  },
  53: {
    en: 'Translucent rectangles, thin lines and small checkered clusters drift over a pale field, overlapping so that no layer is clearly in front. The equivocal space keeps the eye moving, while an implied vertical and horizontal grid keeps the scattered parts in order.',
    concepts: ['space.transparency', 'unity.continuity-grid', 'unity.varied-repetition', 'line.inherent'],
    check: 'expand',
    notes: [
      '반투명한 사각형이 겹쳐 앞뒤가 모호한 공간 = 투명성과 모호한 공간(equivocal space, 224쪽).',
      '‘단일 모티프의 반복이 없다’면 엄밀히 리듬(분명한 반복)보다는 그리드에 의한 통일과 변화에 가깝다. 왼쪽 아래 · 오른쪽 아래의 작은 체크 무늬가 짝을 이루는 것이 반복 요소다.',
      '설명 안의 ** 굵게 표시는 Are.na에서 그대로 보인다 — 의도한 것인지 확인.',
    ],
  },
  54: {
    en: 'Identical stepped modules fill the frame in strict rows and columns. Nothing changes in size or shape; only the value contrast fades from crisp black-and-white on the left to an even mid-gray on the right, a progressive rhythm carried by light alone.',
    concepts: ['rhythm.progressive', 'value.contrast', 'unity.repetition', 'space.aerial'],
    check: 'revise',
    notes: [
      '‘점진적으로 짙어진다’ → 실제로는 오른쪽으로 갈수록 명도 대비가 약해져 고른 회색으로 모인다.',
      '책 120쪽: 점진적 리듬은 크기뿐 아니라 명도로도 만들 수 있다 — 정확한 사례. 대비가 약한 쪽이 멀어 보이는 대기 원근(204쪽) 효과도 있다.',
    ],
  },
  55: {
    en: 'Seen from below, a tower of horizontal slabs is wrapped in vertical slats that swell into soft waves. The repeated slabs converge upward in perspective while the slats ripple without a break, a legato rhythm inside a rigid frame.',
    concepts: ['rhythm.legato', 'rhythm.progressive', 'space.linear', 'unity.unity-variety'],
    check: 'ok',
    notes: ['레가토 판단은 정확하다. 위로 갈수록 슬래브 간격이 좁아지는 원근은 점진적 리듬(120쪽 — 책: 비스듬히 본 건물의 수렴 패턴)으로, 직선 구조 안의 곡선은 변화를 동반한 통일(42쪽)로 더할 수 있다.'],
  },
  56: {
    en: 'Straight white panels, each tilted a few degrees more than the last, twist into a vast wave that recedes along the roofline. The steady change of angle is a progressive rhythm, and the continuous ripple pulls the eye forward into the distance.',
    concepts: ['rhythm.progressive', 'unity.continuation', 'line.direction', 'space.linear'],
    check: 'ok',
    notes: ['각도가 조금씩 바뀌는 반복 = 점진적 리듬(120쪽). 물결이 멀어질수록 작아지는 원근이 더해지고, ‘시각적 연속성’은 연속(38쪽)으로 쓸 수 있다.'],
  },
  57: {
    en: 'Heavy curved steel bars, scarred with rust, crowd together and rise in uneven steps. Their mass and corroded texture make the upward push feel effortful, a rhythm of resistance the viewer seems to feel in their own muscles.',
    concepts: ['rhythm.kinesthetic', 'texture.visual', 'unity.proximity', 'rhythm.staccato'],
    check: 'expand',
    notes: [
      '책 113쪽 말레비치의 ‘움직임과 저항의 감각’과 같은 주제다. ‘근육운동감각’ → 운동감각적 공감(112쪽).',
      '부식된 표면은 시각적 질감(192쪽). 높이가 들쭉날쭉한 끝단은 끊어지는 스타카토 리듬으로 읽을 수 있다.',
    ],
  },
  58: {
    en: 'Flat metal discs are stacked around a central axis, each shifted slightly so the column twists into an S-curve. The repeated motif with a steady change of position forms a progressive rhythm, giving a static, heavy stack an organic sway.',
    concepts: ['rhythm.progressive', 'unity.repetition', 'rhythm.legato', 'texture.visual'],
    check: 'ok',
    notes: ['‘점진적인 위치 변화’ = 점진적 리듬(120쪽). 원판이 S자로 흔들리며 쌓여 레가토처럼 이어진다. 브러시드 금속은 시각적 질감(192쪽).'],
  },
};

/** 텍스트 블록 Expression List — WK04가 비어 있어 블록 내용에서 뽑은 후보 */
export const expressionSuggestions = {
  WK04: ['레가토', '스타카토', '교차 리듬', '점진적 리듬', '다중 리듬'],
};
