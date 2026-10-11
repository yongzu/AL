import type { BlockAnalysis } from './types.ts';

/**
 * Color 컬렉션(WK05 · 책 13장 색) — 메인 Are.na 채널(흑백 무드)에 넣지 않고 따로 모은 컬러 이미지.
 * Are.na에서는 별도 채널 al-color에 있다(npm run arena:color로 반영, 블록 id는 content/color-arena.json).
 * 이미지는 public/color/에 두고 사이트가 직접 보여 준다.
 * 번호는 메인 채널과 겹치지 않게 C01부터 따로 센다. 점수는 content/scores.json의 `c1`… 키(사용자가 매김).
 *
 * - ko: 한국어 설명(색 중심 · 형태는 보조). Are.na에 올릴 때 `**KR**` 원문이 된다.
 * - analysis: 메인 블록과 같은 형식(en · concepts · check · notes)
 */
export type ColorBlock = {
  no: number;
  /** public/color/ 안의 파일 이름 */
  file: string;
  width: number;
  height: number;
  title: { ko: string; en: string };
  ko: string;
  analysis: BlockAnalysis;
};

export const colorCollection = {
  id: 'color',
  ko: '색',
  en: 'Color',
  week: 'WK05',
  body: '책 13장 색. 메인 채널의 흑백 분위기를 지키려고 따로 모은 컬러 이미지 — 보색 · 온도 · 명도 · 임의색.',
} as const;

export const colorBlocks: ColorBlock[] = [
  {
    no: 1,
    file: 'c01.webp',
    width: 736,
    height: 1103,
    title: { ko: '보색이 맞닿아 생기는 강렬한 긴장감', en: 'The Intense Tension Where Complements Meet' },
    ko: `+ 그리드와 레이아웃 - 위에서 내려다본 구도라 운동장이 깊이 없는 면으로 펼쳐지고, 그 위를 흰 라인이 나눈다. 잔디의 라인은 크고 작은 사각형을 이루고, 트랙의 라인은 같은 간격을 유지한 채 직선에서 곡선으로 매끄럽게 이어진다. 직선과 곡선이라는 서로 다른 형이 하나의 그리드 안에 정돈되어 있어 완성도 높은 조형으로 읽힌다.

+ 채도와 근사 보색 - 채도 높은 빨강과 초록이 화면 대부분을 채워 생동감이 크다. 주황 기운의 빨강과 노란 기운의 초록은 거의 마주 보는 근사 보색이라, 맞닿은 경계에서 서로를 더 강하게 만든다. 오른쪽 아래의 좁은 회색 면은 이 강한 색들의 무게를 받아 화면을 진정시킨다.

− 위계 - 넓은 잔디와 트랙은 둘 다 강해서 어느 쪽이 형이고 어느 쪽이 바탕인지 정해지지 않는다. 흰 라인도 같은 굵기와 간격으로 반복되어 모든 곳이 비슷한 세기로 시선을 끈다. 빨강의 보색인 청록 구역이 초점 후보이지만, 면적이 작아 두 색면의 다툼을 이기지 못한다. 그래서 요소들의 위계가 비슷해지고 강조 지점을 찾기 어렵다.`,
    analysis: {
      en: 'Seen from directly above, the field spreads out as flat planes divided by white lines: rectangles on the turf, and evenly spaced lanes that bend smoothly from straight to curved, so different shapes sit within one ordered grid. Saturated red-orange and yellow-green, near complements, intensify each other where they meet, while a narrow gray strip calms them. Yet both large planes are equally strong and the repeated lines pull with equal force, so the small cyan area, the likeliest focal point, cannot win and the hierarchy stays flat.',
      concepts: ['unity.continuity-grid', 'color.triadic-complementary', 'shape.ambiguity', 'emphasis.focal-point'],
      check: 'ok',
      notes: [
        '+ 같은 간격의 흰 라인이 화면을 정돈한다 — 그리드 40쪽, 반복에 의한 통일 36쪽. 직선에서 곡선으로 매끄럽게 이어지는 라인은 연속 38쪽, 곡선형 166쪽 · 직선형 168쪽.',
        '+ 근사 보색이 맞닿은 경계에서 서로를 강하게 만든다 — 보색 배색 280쪽, 동시 대비 265쪽, 채도 264쪽. 좁은 회색이 넓은 고채도를 받는 구도는 색과 균형 274쪽.',
        '빨강과 초록은 색상 대비는 강하지만 명도는 비슷하다. 면을 또렷이 나누는 명도 대비는 흰 라인과 회색 구역에서 생긴다 — 명도와 색 246쪽.',
        '− 잔디와 트랙이 형 · 바탕을 다투고(모호성 176쪽), 청록 초점 후보(초점 56쪽, 대비에 의한 강조 58쪽)가 이기지 못해 위계가 흐리다. 의도된 ‘초점의 부재’(66쪽)와는 구분한다.',
      ],
    },
  },
  {
    no: 2,
    file: 'c02.png',
    width: 736,
    height: 977,
    title: { ko: '사각형의 변주가 주는 다양성을 지닌 통일감', en: 'Unity with Variety Through Varied Rectangles' },
    ko: `+ 그리드와 변주 - 곡선 없이 수직 · 수평선과 직각만으로 이루어진 사각형들이 위아래 · 좌우로 맞물려 하나의 건물을 이룬다. 사각형마다 크기와 비율, 튀어나온 정도가 달라서 같은 형태 안에서 변주가 생기고, 짧은 그림자가 면의 경계와 부피를 또렷하게 한다. 건물의 형태는 제각각이지만 같은 질서를 공유해 통일감이 있다. 연한 하늘을 바탕으로 들쑥날쑥한 실루엣이 오려져 있어 단조롭지 않다.

+ 원색과 다초점 - 흰 면 사이의 노랑과 파랑이 먼저 눈에 들어오고, 작은 빨간 문과 위쪽의 초록이 약한 악센트가 된다. 강조되는 색면들이 서로 떨어져 있어 시선이 위아래 · 좌우로 움직이지만, 사각형과 색이 반복되어 여러 초점이 통일을 깨지 않는다. 그래서 어느 한 부분보다 건물 전체가 강조된다. 그리드와 원색은 몬드리안을 떠올리게 하지만, 순색만 쓴 몬드리안과 달리 초록 같은 2차색과 명도 · 채도의 변화를 더해 훨씬 다채롭다. 따뜻한 노랑 · 빨강은 앞으로, 차가운 파랑은 뒤로 물러나 색만으로도 앞뒤가 생긴다.

− 빛과 마감, 맥락 - 그림자의 방향이 통일되어 있지 않아 빛의 논리가 어긋나고, 그만큼 부피의 설득력이 약해진다. 창문의 선이 이어지지 않는 등 마감도 정리되지 않았다. 실제 건물로 보기에는 실용성이 부족해 보이고, 직선뿐인 화면에서 유일한 곡선인 오른쪽 아래의 풀은 왜 거기 있는지 납득되지 않는다.`,
    analysis: {
      en: 'Rectangles built only from vertical and horizontal lines interlock into one building, each varying in size, proportion and depth, so a shared order holds them together while the variations and the jagged silhouette against the pale sky keep it lively. Yellow and blue catch the eye first, with a small red door and a green block as accents; the scattered color areas move the eye around, yet repeated shapes and hues keep these multiple focal points from breaking the unity, and shifts in value and intensity make it richer than Mondrian. Its weak points are shadows that fall in different directions and undermine the volume, unfinished window lines, and a lone plant whose purpose is unclear.',
      concepts: ['unity.unity-variety', 'shape.rectilinear', 'emphasis.focal-point', 'color.warm-cool'],
      check: 'ok',
      notes: [
        '+ 같은 직사각형이 크기 · 비율 · 깊이만 바꿔 반복된다 — 변화를 동반한 통일 42쪽, 변화된 반복 44쪽, 직선형 168쪽. 하늘이 실루엣을 오려내는 음형은 양형과 음형 170쪽.',
        '+ 떨어진 색면들이 여러 초점이 되지만 반복된 형과 색이 통일을 지킨다 — 초점 56쪽, 색에 의한 강조 272쪽. 1번(C01)의 흐린 위계와 대비된다.',
        '+ 초록은 2차색(색상 260쪽), 명도 · 채도 변화는 262 · 264쪽. 따뜻한 색은 앞으로, 차가운 색은 뒤로 — 270쪽.',
        '− 그림자 방향이 어긋나 명암으로 만든 부피(명도와 공간 250쪽, 부피와 양감 156쪽)가 약해지고, 끊긴 창문 선은 연속(38쪽)을 깬다. 실용성은 조형 바깥의 기능 관점. 풀은 유일한 곡선이라 의도된 대비(곡선형 166쪽)로 읽을 여지도 있다.',
      ],
    },
  },
  {
    no: 3,
    file: 'c03.webp',
    width: 1080,
    height: 1080,
    title: { ko: '차가운 벽 사이의 불씨', en: 'An Ember Between Cool Walls' },
    ko: `세로로 나뉜 세 개의 색 기둥이 화면을 채운다. 양옆은 차가운 색, 가운데는 따뜻한 색이다. 왼쪽은 짙은 초록 위에 밝은 초록 원이, 오른쪽은 짙은 파랑 위에 옅은 하늘색 기둥이 놓여 있어서, 양옆은 각각 한 색상 안에서 명도만 바꾼 단색 배색처럼 읽힌다. 반면 가운데 분홍 기둥에는 주황 원과 크림색 반원이 놓여 색상 자체가 달라진다. 그래서 차분한 양옆 사이에서 따뜻한 가운데가 앞으로 나오고, 시선이 가장 먼저 그곳에 닿는다.

형태는 곧은 기둥과 원 · 반원 · 둥근 기둥 같은 곡선이 맞물린 구성이다. 원들은 한쪽으로 갈수록 어두워지는 그러데이션과 거친 입자를 입어서, 평평한 색면 위에서 살짝 부피를 얻는다. 같은 둥근 형태라도 바탕색이 바뀌면 전혀 다른 온도로 보인다는 점에서, 색이 주변과의 관계 속에서 읽힌다는 걸 보여 준다.`,
    analysis: {
      en: 'Three vertical columns divide the square: cool green and blue at the sides, warm pink in the middle. Each side column pairs a light and a dark version of one hue, while the center brings in new hues of orange and cream, so the warm column advances and holds the eye. Grainy gradients give the flat circles and rounded bars a slight volume against the straight edges.',
      concepts: ['color.warm-cool', 'color.monochromatic', 'color.value', 'shape.curvilinear'],
      check: 'ok',
      notes: [
        '양옆 기둥은 한 색상 안에서 명도만 바꾼 단색 배색(278쪽)에 가깝고, 가운데만 색상이 바뀐다.',
        '따뜻한 가운데가 앞으로 나오는 것은 따뜻한 색과 차가운 색(270쪽)의 공간 성질.',
        '원의 그러데이션은 색의 명도(262쪽), 거친 입자는 시각적 질감(192쪽). 곧은 기둥과 둥근 형태는 곡선형 166쪽 · 직선형 168쪽.',
      ],
    },
  },
  {
    no: 4,
    file: 'c04.webp',
    width: 970,
    height: 1300,
    title: { ko: '빛으로 녹는 색', en: 'Colors Melting into Light' },
    ko: `반투명한 유리판 같은 둥근 사각형과 원들이 겹쳐 있고, 그 뒤에서 빛이 새어 나온다. 주황 · 빨강 · 노랑의 따뜻한 바탕 위에 초록 · 파랑의 차가운 면이 얹혀서, 색의 온도 대비가 화면 전체를 이끈다. 색이 겹치는 경계마다 하얗게 타오르는 빛이 생긴다. 물감이라면 섞일수록 탁해졌을 색이 여기서는 빛처럼 섞일수록 밝아진다. 빛의 혼합이 가진 성질을 그대로 화면에 옮긴 셈이다.

형태는 모서리를 둥글린 사각형과 원으로, 직선형과 곡선형의 중간에 있다. 면들이 서로 겹쳐도 뒤의 색이 비쳐 보여서, 무엇이 앞인지 확정되지 않는 모호한 공간이 생긴다. 빨간 면에 새겨진 동심원의 골과 흐릿한 경계는 평평한 색면에 깊이와 움직임을 더한다.`,
    analysis: {
      en: 'Frosted, glass-like rounded squares and circles overlap in front of a glowing backlight. Cool green and blue panes sit over a warm field of orange, red and yellow, and wherever colors meet they flare into white, mixing like light rather than paint. Because every pane lets the colors behind it show through, the layers never settle into a fixed front and back.',
      concepts: ['color.light', 'color.warm-cool', 'space.transparency'],
      check: 'ok',
      notes: [
        '겹친 경계가 하얗게 밝아지는 것은 가산 혼합(256쪽) — 물감의 감산 혼합과 반대.',
        '따뜻한 바탕 위의 차가운 면 — 따뜻한 색과 차가운 색 270쪽.',
        '뒤의 색이 비쳐 앞뒤가 정해지지 않는 공간 — 투명성과 모호한 공간 224쪽.',
      ],
    },
  },
  {
    no: 5,
    file: 'c05.webp',
    width: 1200,
    height: 1200,
    title: { ko: '틈에서 피는 색', en: 'Color Blooming in the Gaps' },
    ko: `검은 바탕 위에 줄지어 선 원들이 서로 겹치고, 겹친 자리마다 렌즈 모양의 조각이 빛난다. 원 자체는 어둡고 탁한데 겹친 조각만 채도와 명도가 높아서, 색이 형태 안이 아니라 형태와 형태가 만나는 틈에서 피어난다. 같은 렌즈 모양이 반복되지만 색은 하나도 같지 않아서, 질서 있는 그리드 위에서 색만 끝없이 변주된다.

빛은 화면 가운데에서 가장 밝다. 분홍과 흰빛이 중심에 모이고 바깥으로 갈수록 파랑 · 짙은 빨강으로 어두워져, 명도의 변화가 방사형으로 퍼지는 초점을 만든다. 어두운 바탕은 색을 더 밝고 강렬하게 보이게 한다. 색은 홀로 보이지 않고 주변과의 관계 속에서 빛난다는 걸 보여 주는 이미지다.`,
    analysis: {
      en: 'A grid of overlapping circles sits on black, and every overlap forms a glowing lens of color. The circles themselves stay dim; color blooms only where shapes meet, repeating the same lens form while never repeating a hue. Brightness gathers at the pink-white center and fades toward the edges, so the dark ground and radial falloff turn color into the focal point.',
      concepts: ['color.context', 'color.value', 'unity.varied-repetition', 'emphasis.focal-point'],
      check: 'ok',
      notes: [
        '어두운 바탕이 색을 더 밝게 보이게 한다 — 맥락의 영향 259쪽.',
        '같은 렌즈 형태에 색만 바뀌는 반복 — 변화된 반복 44쪽.',
        '가운데가 가장 밝고 바깥으로 어두워지는 명도 변화(262쪽)가 초점(56쪽)을 만든다.',
      ],
    },
  },
  {
    no: 6,
    file: 'c06.webp',
    width: 1920,
    height: 1205,
    title: { ko: '폭풍의 눈', en: 'The Eye of the Storm' },
    ko: `화면 가득 빨강 · 파랑 · 청록 · 주황 · 보라가 소용돌이치며 퍼져 나간다. 마치 색으로 된 폭풍 같다. 그런데 시선이 가장 먼저 닿는 곳은 그 한가운데, 색이 없는 하얀 얼굴이다. 주변이 고채도의 색으로 빽빽하다 보니, 오히려 색이 빠진 자리가 가장 강한 초점이 된다. 거센 소용돌이 속에서 중심만 고요한 폭풍의 눈과 닮은 구조다.

얼굴은 따로 그려져 있다기보다 주변 색들이 비워 둔 자리에 가깝다. 장식과 눈 모양들이 흩어져 있는데도 전체가 한 사람의 얼굴로 읽힌다. 이목구비는 거의 없고, 이마에는 제3의 눈 같은 빛이 박혀 있고, 장식은 후광처럼 바깥으로 뻗어 있다. 그래서 실제 사람이라기보다는 폭풍을 일으키는 쪽, 개념적이고 초월적인 존재처럼 보인다.

빛은 모든 색을 섞으면 흰색이 된다는 점을 떠올리면, 이 흰 얼굴은 폭풍 속의 색들이 한데 모인 자리로도 읽을 수 있다. 빨강 · 주황의 따뜻한 흐름과 파랑 · 청록의 차가운 흐름이 얼굴 주위에서 뒤엉켜 형태보다 감정이 먼저 전해진다. 그래도 방사 구조 덕분에 이 소란은 흩어지지 않고, 폭풍이 눈을 중심으로 돌듯 가운데로 다시 모인다.`,
    analysis: {
      en: 'Swirls of red, blue, teal, orange and violet storm across the frame, yet the eye lands first on the pale, colorless face at the center, calm like the eye of a storm. The face is less drawn than left behind by the surrounding colors, and with its features nearly erased, a light like a third eye and ornaments spreading like a halo, it reads as a transcendent presence. Since all colors of light combine into white, the face can also be seen as the place where the whole storm gathers, while the radial structure keeps the turmoil circling the center.',
      concepts: ['color.emphasis', 'shape.positive-negative', 'color.light', 'balance.radial'],
      check: 'ok',
      notes: [
        '고채도 사이에서 색이 빠진 얼굴이 초점이 된다 — 색에 의한 강조 272쪽, 대비에 의한 강조 58쪽. 책의 ‘초점의 부재’(66쪽)는 초점을 일부러 없애는 정반대 개념이라 구분한다.',
        '얼굴은 주변 색이 남겨 둔 음형이 형이 된 것 — 양형과 음형 170쪽, 형과 바탕 152쪽. 흩어진 장식을 한 얼굴로 묶어 읽는 것은 게슈탈트 32쪽.',
        '빛은 모든 색이 섞이면 흰색 — 빛과 색 혼합 256쪽. 흰색 · 후광의 초월적 인상은 색 상징 288쪽.',
        '얼굴을 중심으로 장식이 퍼져 소란을 가운데로 모은다 — 방사 균형 106쪽. 따뜻한 색과 차가운 색의 충돌은 감정적 색 286쪽.',
      ],
    },
  },
  {
    no: 7,
    file: 'c07.webp',
    width: 1200,
    height: 762,
    title: { ko: '불꽃 날개', en: 'Wings of Flame' },
    ko: `흰 바탕 위에 좌우 대칭으로 날개를 펼친 생명체다. 진분홍 · 빨강 · 주황이 날개 대부분을 덮어, 색상환에서 이웃한 따뜻한 색들이 전체의 색조를 지배한다. 그 사이사이에 청록 점과 보라 테두리가 끼어 있다. 따뜻한 색의 반대편에 있는 차가운 색이라, 작은 면적으로도 날개 위에서 선명하게 튄다.

날개 안쪽은 원 · 물방울 · 지그재그 같은 무늬가 빽빽하게 반복되어 화려한 질감을 만든다. 무늬가 이렇게 복잡한데도 흩어지지 않는 건, 엄격한 좌우 대칭과 따뜻한 색조가 전체를 하나로 묶어 주기 때문이다. 넓은 흰 여백은 색이 더 강렬하게 보이도록 무대를 비워 둔다.`,
    analysis: {
      en: 'A winged creature spreads in strict bilateral symmetry across a white ground. Hot pink, red and orange, neighbors on the color wheel, set a warm tonality, while small cyan dots and violet edges from the opposite side of the wheel flicker as accents. The dense patterning would scatter on its own, but symmetry and the dominant warm hue hold it together.',
      concepts: ['color.analogous', 'color.triadic-complementary', 'balance.symmetrical', 'texture.pattern'],
      check: 'ok',
      notes: [
        '이웃한 따뜻한 색이 전체를 지배하는 색조 — 유사색 배색과 색조 279쪽.',
        '청록 점은 따뜻한 색의 보색 쪽 강조 — 보색 배색 280쪽.',
        '복잡한 무늬(패턴 180쪽)를 좌우 대칭(대칭 균형 92쪽)이 묶는다.',
      ],
    },
  },
  {
    no: 8,
    file: 'c08.webp',
    width: 736,
    height: 1030,
    title: { ko: '온도로 빚은 몸', en: 'Sculpted by Temperature' },
    ko: `웅크린 인물의 몸이 파랑 · 초록 · 분홍 · 주황으로 부드럽게 이어지는 그러데이션으로 칠해져 있다. 실제 피부색과는 상관없는 임의색이지만, 색의 온도가 몸의 입체를 대신 설명한다. 어깨와 팔은 차가운 파랑으로 뒤로 물러나고, 앞으로 내민 허벅지는 따뜻한 주황 · 분홍이라 가장 앞에 나와 보인다. 명암 대신 색의 온도로 부피를 빚은 셈이다.

형태는 굵고 둥근 곡선으로 단순화된 몸이다. 검은 머리카락은 화면에서 가장 어두운 덩어리라 무지갯빛 몸의 위쪽을 단단히 눌러 주고, 넓은 흰 바탕은 곡선의 실루엣을 또렷하게 오려낸다. 색연필의 결은 그러데이션에 촘촘한 질감을 더한다.`,
    analysis: {
      en: 'A crouching figure is colored in a smooth spectrum that slides from blue and green to pink and orange. The color is arbitrary, yet it models the body: cool blue shoulders recede while the warm orange thigh pushes forward, so temperature does the work that light and shadow usually do. The black hair anchors the top, and the white ground cuts out the swelling curvilinear silhouette.',
      concepts: ['color.uses', 'color.warm-cool', 'shape.curvilinear', 'shape.volume-mass'],
      check: 'ok',
      notes: [
        '피부와 무관한 그러데이션 — 임의색 284쪽.',
        '차가운 어깨는 물러나고 따뜻한 허벅지는 다가온다 — 따뜻한 색과 차가운 색 270쪽. 명암 대신 색 온도로 만든 부피(156쪽).',
        '둥글게 단순화된 몸 — 곡선형 166쪽.',
      ],
    },
  },
  {
    no: 9,
    file: 'c09.webp',
    width: 1200,
    height: 1499,
    title: { ko: '흩어진 색상환', en: 'A Scattered Color Wheel' },
    ko: `검은 몸통을 중심으로 노랑 · 빨강 · 보라 · 파랑 · 초록 · 주황의 팔다리가 흩어져 있다. 팔다리마다 색상환의 1차색과 2차색을 하나씩 맡아서, 한 사람의 몸이 색상환처럼 펼쳐진다. 실제 피부와 관계없는 임의색이지만, 각 색은 사실적인 명암과 광택으로 칠해져 있어 플라스틱 조각처럼 단단한 부피를 가진다.

가운데 몸통은 색을 거의 뺀 짙은 남색이라, 무채색에 가까운 중심이 주변의 원색들을 묶어 주는 축이 된다. 흩어진 팔다리가 각기 다른 방향을 향하면서 여러 동작이 한꺼번에 겹친 듯한 움직임이 생기고, 흰 바탕은 색 조각들을 공중에 띄운다.`,
    analysis: {
      en: 'Detached limbs in yellow, red, violet, blue, green and orange orbit a near-black torso, each limb claiming its own hue so the body unfolds like a color wheel. The colors are arbitrary, but each is modeled with realistic shading and gloss, giving the pieces a solid, almost plastic volume. The dark, neutral torso anchors the scattered hues, and limbs pointing in different directions suggest several movements at once.',
      concepts: ['color.hue', 'color.uses', 'color.value'],
      check: 'ok',
      notes: [
        '팔다리마다 다른 색상 — 색상환의 1차 · 2차색(색상 260쪽).',
        '피부와 무관한 색 — 임의색 284쪽. 각 색 안의 명암(틴트 · 셰이드, 262쪽)이 부피를 만든다.',
        '무채색에 가까운 몸통이 원색들을 묶는 축 — 색과 균형(274쪽)과도 이어진다.',
      ],
    },
  },
  {
    no: 10,
    file: 'c10.webp',
    width: 1200,
    height: 840,
    title: { ko: '다섯 색의 합창', en: 'A Chorus of Five Hues' },
    ko: `나무 한 그루에 말 · 표범 · 새 · 다람쥐 같은 동물들이 엉켜 있다. 쓰인 색은 주황빛 빨강 · 노랑 · 초록 · 파랑 · 보라 몇 가지뿐이고, 모두 그러데이션 없이 평평하게 칠해졌다. 대상이 수십 개로 늘어나도 같은 몇 가지 색이 화면 곳곳에서 되풀이되기 때문에, 복잡한 장면이 하나로 묶여 보인다.

노랑과 보라, 빨강과 초록처럼 보색 짝이 맞붙어 있어 경계마다 색이 서로를 더 강하게 만든다. 노란 말, 파랑 · 보라 줄무늬 짐승처럼 실제와 다른 임의색은 장면을 현실보다 동화처럼 보이게 한다. 윤곽선이 각 형태를 또렷하게 가두고, 흰 바탕으로 열린 채 사방으로 뻗은 가지와 꼬리는 화면 밖으로 이어질 듯한 움직임을 만든다.`,
    analysis: {
      en: 'Animals tangle through a single tree drawn in only a handful of flat hues: red-orange, yellow, green, blue and violet. However many creatures appear, the same few colors recur across the page, which holds the busy scene together. Complementary pairs such as yellow and violet or red and green sit side by side and sharpen each other, while arbitrary colors like a yellow horse push the scene toward fable.',
      concepts: ['unity.repetition', 'color.triadic-complementary', 'color.uses', 'line.contour'],
      check: 'ok',
      notes: [
        '몇 가지 색의 되풀이가 복잡한 장면을 묶는다 — 반복에 의한 통일 36쪽.',
        '노랑 · 보라, 빨강 · 초록의 보색 짝 — 보색 배색 280쪽, 동시 대비 265쪽.',
        '노란 말 같은 색 — 임의색 284쪽. 형태를 가두는 선 — 윤곽선 130쪽.',
      ],
    },
  },
];
