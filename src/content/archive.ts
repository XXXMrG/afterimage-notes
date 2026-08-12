export type MediaType = 'song' | 'film' | 'book';
export type StyleId = 'paper-zine' | 'limited-screenprint';

export type StyleSystem = {
  id: StyleId;
  label: string;
  englishLabel: string;
  shortDescription: string;
};

export type PosterVariant = {
  id: string;
  styleId: StyleId;
  image: string;
  width: number;
  height: number;
  alt: string;
  interpretation: string;
  accent: string;
};

export type ArchiveItem = {
  id: string;
  archiveNo: string;
  type: MediaType;
  title: string;
  originalTitle?: string;
  creator: string;
  year: string;
  context: string;
  variants: PosterVariant[];
};

export const mediaLabels: Record<MediaType, string> = {
  song: '歌曲',
  film: '电影',
  book: '书籍',
};

export const styleSystems: StyleSystem[] = [
  {
    id: 'paper-zine',
    label: '纸上余白',
    englishLabel: 'Paper Zine',
    shortDescription: '暖灰纸、大留白、单色锚与扫描印痕。',
  },
  {
    id: 'limited-screenprint',
    label: '限色丝印',
    englishLabel: 'Limited Screenprint',
    shortDescription: '二至四色平涂、负形双关与套色偏移。',
  },
];

export const archiveItems: ArchiveItem[] = [
  {
    id: 'pneuma',
    archiveNo: '01',
    type: 'song',
    title: 'Pneuma',
    creator: 'TOOL',
    year: '2019',
    context: 'Fear Inoculum',
    variants: [
      {
        id: 'pneuma-paper-zine',
        styleId: 'paper-zine',
        image: '/works/one-breath.jpg',
        width: 971,
        height: 1619,
        alt: '暖灰旧纸上的种壳标本，裂隙中有一枚梨绿色圆点，底部垂下一颗钉子，尘雾向上散开。',
        interpretation:
          '种壳同时接近肺和肉身；底部的钉子表示身体的限制，绿色火种与向上散开的气息代表意识醒来。Pneuma 本身便含有呼吸、灵魂和生命之气的意思。',
        accent: '#9fc65a',
      },
    ],
  },
  {
    id: 'the-best-of-times',
    archiveNo: '02',
    type: 'song',
    title: 'The Best of Times',
    creator: 'Dream Theater',
    year: '2009',
    context: 'Black Clouds & Silver Linings',
    variants: [
      {
        id: 'the-best-of-times-paper-zine',
        styleId: 'paper-zine',
        image: '/works/still-riding.jpg',
        width: 971,
        height: 1619,
        alt: '褪色旧照片里，一个孩子骑自行车远去，父亲从照片边缘伸出手，一条明黄色丝带仍将两人连在一起。',
        interpretation:
          '父亲的手刚刚松开自行车，孩子仍在向前。黄色丝带让两个人没有真正断开：快乐发生在照片里，失去则藏在父亲逐渐消失的画面边缘。',
        accent: '#e1b91b',
      },
    ],
  },
  {
    id: 'downhill-love',
    archiveNo: '03',
    type: 'song',
    title: '我爱你就像拖拉机下山叮铃哐当叮铃',
    creator: '普信主义',
    year: '2021',
    context: '单曲',
    variants: [
      {
        id: 'downhill-love-paper-zine',
        styleId: 'paper-zine',
        image: '/works/downhill-love.jpg',
        width: 971,
        height: 1619,
        alt: '橙色旧式拖拉机沿斜坡冲下，螺母、扳手和铃铛一路散落，车后红橙色旗帜写着“我爱你”。',
        interpretation:
          '它把喜欢说得又响又笨拙：拖拉机快散架了，仍然沿着坡往前。好笑的是失控的零件，浪漫的是“我爱你”那面旗还站得特别直。',
        accent: '#dc5c22',
      },
    ],
  },
  {
    id: 'wanli',
    archiveNo: '04',
    type: 'song',
    title: '万里',
    creator: 'HYUKOH',
    year: '2017',
    context: '23',
    variants: [
      {
        id: 'wanli-paper-zine',
        styleId: 'paper-zine',
        image: '/works/wanli.jpg',
        width: 971,
        height: 1619,
        alt: '大面积暖灰旧纸留白中，左下方一张撕边黑白照片里三名骑行者向前，右上方悬着一轮番茄红的圆月。',
        interpretation:
          '这里的气质是辽阔、行进、荒凉，同时带着一种忘掉现实后继续远行的平静。红月是遥远而无法抵达的目标，三名骑行者对应歌曲不断向前推进的节奏。',
        accent: '#c64235',
      },
    ],
  },
  {
    id: 'everything-in-its-right-place',
    archiveNo: '05',
    type: 'song',
    title: 'Everything in Its Right Place',
    creator: 'Radiohead',
    year: '2000',
    context: 'Kid A',
    variants: [
      {
        id: 'right-place-paper-zine',
        styleId: 'paper-zine',
        image: '/works/right-place-zine.webp',
        width: 1054,
        height: 1492,
        alt: '旧纸右上方是一组九宫格档案框，被切成横向条带的人脸从错位格子中露出，一块酸黄色方块卡在边缘。',
        interpretation:
          '九宫格看似归位，人的侧脸却被切成条带，黄色方块卡在秩序之外。歌曲的冷静不是安宁，而是一个人不断尝试把自己塞回正确位置，却始终保留半格偏差。',
        accent: '#e6d300',
      },
      {
        id: 'right-place-limited-screenprint',
        styleId: 'limited-screenprint',
        image: '/works/right-place-screenprint.webp',
        width: 1024,
        height: 1536,
        alt: '深蓝档案柜占满上半张海报，酸黄色侧脸内嵌另一组网格，两枚方块从脑后脱落。',
        interpretation:
          '柜格扩大成制度性的背景，黄色头部把同样的网格装进脑内，却又掉出两个方块。丝印版把焦虑从私人呼吸转成结构压力：秩序越巨大，偏差越醒目。',
        accent: '#f0d20b',
      },
    ],
  },
  {
    id: 'in-the-mood-for-love',
    archiveNo: '06',
    type: 'film',
    title: '花样年华',
    originalTitle: 'In the Mood for Love',
    creator: '王家卫',
    year: '2000',
    context: '香港电影',
    variants: [
      {
        id: 'in-the-mood-paper-zine',
        styleId: 'paper-zine',
        image: '/works/in-the-mood-zine.webp',
        width: 1024,
        height: 1536,
        alt: '暖灰纸下方并置两块褪色门廊照片，衣袖与花纹裙边分处两侧，一根红线在中间缝隙处断开。',
        interpretation:
          '两块门廊里只剩衣袖、裙边和靠近却不交叠的影子。红线穿过各自的生活，又在空隙处断开：这段感情最真实的形态，恰恰是它始终没有被说出口。',
        accent: '#b42c24',
      },
      {
        id: 'in-the-mood-limited-screenprint',
        styleId: 'limited-screenprint',
        image: '/works/in-the-mood-screenprint.webp',
        width: 1024,
        height: 1536,
        alt: '黑色双门在米白色走廊两侧打开，红色与玉绿色线条从门内伸出，在中央相向却没有触及。',
        interpretation:
          '两扇门把人物从画面里彻底撤走，只留下红绿两条线向中间靠拢又停下。这里的爱情不是相遇，而是被礼法、时间和自我克制共同保存的一毫米距离。',
        accent: '#b82d25',
      },
    ],
  },
  {
    id: 'the-left-hand-of-darkness',
    archiveNo: '07',
    type: 'book',
    title: '黑暗的左手',
    originalTitle: 'The Left Hand of Darkness',
    creator: '厄休拉·勒古恩',
    year: '1969',
    context: '科幻小说',
    variants: [
      {
        id: 'left-hand-paper-zine',
        styleId: 'paper-zine',
        image: '/works/left-hand-zine.webp',
        width: 1024,
        height: 1536,
        alt: '冷灰旧纸下方，两只方向相反的手叠成山口，中央有一小片钴蓝色，两名旅人并肩穿过雪地。',
        interpretation:
          '两只手不是性别二分，而是不同经验；重叠处露出的山口和并行旅人，说明理解并非抹平差异，而是在极端环境里先把彼此当作同行者。',
        accent: '#2167a6',
      },
      {
        id: 'left-hand-limited-screenprint',
        styleId: 'limited-screenprint',
        image: '/works/left-hand-screenprint.webp',
        width: 1024,
        height: 1536,
        alt: '钴蓝与焦橙的两张侧脸背向而立，共同构成冰川，骨白裂隙里两名旅人向前。',
        interpretation:
          '蓝与橙的侧脸背向而立，却共同组成同一座冰川。中央白色裂隙既是隔阂，也是唯一可通行的路；信任不是抵达共识，而是愿意一起穿过寒冷。',
        accent: '#245cad',
      },
    ],
  },
];

export const archiveStats = {
  items: archiveItems.length,
  posters: archiveItems.reduce((total, item) => total + item.variants.length, 0),
  styles: styleSystems.length,
};
