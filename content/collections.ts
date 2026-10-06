/**
 * 태그 컬렉션 — 블록들이 공유하는 소재 · 형식을 Claude가 찾아 묶은 것.
 * Are.na에서는 컬렉션마다 채널(`AL · 실루엣 Silhouette`)을 만들고 블록을 커넥션으로 연결한다(scripts/arena-collections.mjs).
 * 라우어 개념 태그(analysis.ts)가 ‘책의 언어’라면, 컬렉션은 ‘내 아카이브의 언어’다.
 *
 * 새 블록은 맞는 컬렉션의 blocks에 번호를 더하고, 어디에도 맞지 않으면 새 컬렉션을 만든다(최소 3개 블록).
 */
export type Collection = {
  id: string;
  ko: string;
  en: string;
  /** Are.na 채널 설명에도 쓰는 한 문장 */
  body: string;
  /** 블록 번호 */
  blocks: number[];
};

export const collections: Collection[] = [
  { id: 'silhouette', ko: '실루엣', en: 'Silhouette', body: '세부를 지우고 검은 형태 하나로 읽히는 인물.', blocks: [2, 4, 5, 6, 7, 11, 34, 35, 37] },
  { id: 'luminous', ko: '빛나는 형상', en: 'Luminous Figures', body: '어둠 속에서 빛이 몸이 되거나, 몸이 빛으로 녹아드는 이미지.', blocks: [3, 8, 9, 10, 12] },
  { id: 'transparency', ko: '투명과 투과', en: 'Transparency', body: '겉과 속이 함께 보이는 엑스레이 · 반투명 레이어.', blocks: [13, 14, 15, 18, 19, 20, 21, 22, 23, 24, 25, 27, 53] },
  { id: 'machine-body', ko: '기계와 몸', en: 'Machine and Body', body: '사람의 몸과 기계 장치가 결합한 포스트휴먼 형상.', blocks: [7, 13, 14, 15, 16, 17, 18] },
  { id: 'blur', ko: '흐림과 잔상', en: 'Blur and Trace', body: '움직임이 흐린 윤곽과 겹친 흔적으로 남은 장면.', blocks: [2, 34, 35] },
  { id: 'drawing', ko: '그림과 드로잉', en: 'Painting and Drawing', body: '사진이 아닌 손의 흔적 — 선, 붓질, 회화.', blocks: [8, 11, 12, 29, 30, 31, 32, 33, 40] },
  { id: 'hands', ko: '손', en: 'Hands', body: '손이 화면의 주인공이 되는 이미지.', blocks: [6, 18, 36, 38] },
  { id: 'looking-up', ko: '올려다보기', en: 'Looking Up', body: '아래에서 올려다본 시점 — 증폭된 원근과 하늘을 향한 구조.', blocks: [6, 37, 38, 43, 55, 56] },
  { id: 'symmetry', ko: '대칭', en: 'Symmetry', body: '가운데 축을 두고 양쪽이 마주 보는 구성.', blocks: [16, 17, 21, 25, 41, 43, 48] },
  { id: 'radial', ko: '원과 방사', en: 'Circles and Radials', body: '한 중심에서 퍼지거나 그 둘레를 도는 형태.', blocks: [3, 16, 38, 41, 47, 48] },
  { id: 'grid', ko: '그리드', en: 'Grid', body: '가로세로 격자가 보이거나 숨어서 화면을 조직하는 이미지.', blocks: [1, 43, 45, 46, 47, 52, 53, 54] },
  { id: 'modules', ko: '쌓기와 모듈', en: 'Stacks and Modules', body: '같은 단위를 쌓고 늘어놓아 만든 구조.', blocks: [21, 22, 42, 44, 54, 58] },
  { id: 'flowing', ko: '흐르는 곡선', en: 'Flowing Curves', body: '끊김 없이 굽이치는 곡선과 부드러운 면.', blocks: [25, 26, 27, 28, 50, 55, 58] },
  { id: 'architecture', ko: '건축', en: 'Architecture', body: '건물 · 다리 · 구조물의 반복과 리듬.', blocks: [41, 42, 43, 49, 51, 55, 56] },
  { id: 'texture', ko: '표면과 질감', en: 'Surface and Texture', body: '입자 · 부식 · 골 · 니트처럼 표면이 말을 거는 이미지.', blocks: [5, 9, 29, 51, 52, 57, 58] },
  { id: 'nature', ko: '자연', en: 'Nature', body: '꽃 · 숲 · 과일 · 바위 같은 자연의 형태.', blocks: [19, 29, 39, 50] },
];

/** 컬렉션 채널 이름 */
export const collectionTitle = (c: Collection) => `AL · ${c.ko} ${c.en}`;
