export type Work = {
  id: string;
  index: string;
  artist: string;
  title: string;
  archiveTitle: string;
  year: string;
  image: string;
  alt: string;
  accent: string;
  request: string;
  reading: string;
  prompt: string;
  recipe: string;
  layout: 'breath' | 'memory' | 'motion' | 'distance';
  promptStatus: '完整记录' | '依据截图整理';
};

export const works: Work[] = [
  {
    id: 'one-breath',
    index: '01',
    artist: 'TOOL',
    title: 'Pneuma',
    archiveTitle: 'ONE BREATH',
    year: '2019',
    image: '/works/one-breath.jpg',
    alt: '暖灰旧纸上的种壳标本，裂隙中有一枚梨绿色圆点，底部垂下一颗钉子，尘雾向上散开。',
    accent: '#9fc65a',
    request: '给你两个比较复杂的歌曲：一个是 TOOL 乐队的 Pneuma。',
    reading:
      '种壳同时接近肺和肉身；底部的钉子表示身体的限制，绿色火种与向上散开的气息代表意识醒来。Pneuma 本身便含有呼吸、灵魂和生命之气的意思。',
    prompt: `Tall vertical 3:5 poster on warm gray aged paper with visible fibers, dust and quiet scan noise. Keep most of the sheet empty. Place one antique botanical specimen low and slightly right of center: a dry seed pod split into two lung-like halves, rendered as an old printed illustration. A thin metal nail continues downward from its base, making the body feel pinned to matter.

Inside the narrow opening, print one small but saturated pear-green circle as the only chromatic event. From the opening, let a column of gray particulate breath rise and dissolve into faint ghost letters. Set “P N E U M A” in widely spaced serif capitals to the right, with “ONE BREATH / TOOL / 2019” as tiny archive text at lower left.

Use halftone degradation, xerox softness, slight ink bleed and a flat orthographic scan. No hard shadow, no frame, no glossy depth, no commercial headline. The emotional order is bodily confinement, breath, then awakening.`,
    recipe:
      'single-specimen / old printed illustration / gray ghost text / pear-green / halftone degradation / slight surrealism',
    layout: 'breath',
    promptStatus: '依据截图整理',
  },
  {
    id: 'still-riding',
    index: '02',
    artist: 'Dream Theater',
    title: 'The Best of Times',
    archiveTitle: 'STILL RIDING',
    year: '2009',
    image: '/works/still-riding.jpg',
    alt: '褪色旧照片里，一个孩子骑自行车远去，父亲从照片边缘伸出手，一条明黄色丝带仍将两人连在一起。',
    accent: '#e1b91b',
    request: '另一个是 Dream Theater 的 The Best of Times。',
    reading:
      '父亲的手刚刚松开自行车，孩子仍在向前。黄色丝带让两个人没有真正断开：快乐发生在照片里，失去则藏在父亲逐渐消失的画面边缘。',
    prompt: `Tall vertical 3:5 poster on warm cream aged paper with fibers, small scratches and restrained film grain. Keep generous empty space. Place a single worn horizontal family photograph around the upper-middle of the page, as if it has been kept for years.

Show a joyful summer memory from behind: a father has just released a small bicycle and a child continues riding down a quiet suburban road. Let the father fade into the overexposed left edge while the child remains clear. Tie one saturated lemon-yellow ribbon to the father’s hand and the bicycle, the only vivid color in the image.

Set “THE BEST OF TIMES” beneath the photograph in small typewriter capitals. Add “FOR HOWARD” above-left and “STILL RIDING. / DREAM THEATER / 2009” far below as private archive notes. Use diffuse light, faded photography, worn corners and subtle scan noise. The emotional order is warmth, gratitude, then absence.`,
    recipe:
      'center-fragment / tiny faded photo / short phrase / lemon-yellow / film grain / childhood-memory',
    layout: 'memory',
    promptStatus: '依据截图整理',
  },
  {
    id: 'downhill-love',
    index: '03',
    artist: '普信主义',
    title: '我爱你就像拖拉机下山叮铃哐当叮铃',
    archiveTitle: 'DOWNHILL LOVE',
    year: '2021',
    image: '/works/downhill-love.jpg',
    alt: '橙色旧式拖拉机沿斜坡冲下，螺母、扳手和铃铛一路散落，车后红橙色旗帜写着“我爱你”。',
    accent: '#dc5c22',
    request: '试一个比较好玩的歌曲：我爱你就像拖拉机下山叮铃哐当叮铃。',
    reading:
      '它把喜欢说得又响又笨拙：拖拉机快散架了，仍然沿着坡往前。好笑的是失控的零件，浪漫的是“我爱你”那面旗还站得特别直。',
    prompt: `Tall vertical 3:5 poster on dusty aged paper, printed like a damaged rural instruction leaflet. Preserve a large quiet field. Draw one antique agricultural-manual illustration of a vintage tractor descending a steep diagonal from upper right toward lower left.

Print the tractor body in saturated safety-orange, the only strong color. Let nuts, bolts, a wrench and a small metal bell shake loose behind it, following a dotted path. Arrange the Chinese onomatopoeia “叮铃 / 哐当 / 叮铃” as scattered black letterpress fragments along that path. Fix a perfectly upright orange flag to the tractor with the words “我爱你”.

Use dry deadpan humor, reckless momentum, letterpress ink bleed and slight misregistration. Keep the tractor small against the paper; avoid a full scene or cartoon treatment. Add “普信主义 / 2021” as a tiny archive line at the bottom.`,
    recipe:
      'dot-orbit / old printed illustration / diagonal scattered words / safety-orange / letterpress ink bleed / slight surrealism',
    layout: 'motion',
    promptStatus: '依据截图整理',
  },
  {
    id: 'wanli',
    index: '04',
    artist: 'HYUKOH',
    title: '万里',
    archiveTitle: 'WANLI',
    year: '2017',
    image: '/works/wanli.jpg',
    alt: '大面积暖灰旧纸留白中，左下方一张撕边黑白照片里三名骑行者向前，右上方悬着一轮番茄红的圆月。',
    accent: '#c64235',
    request: '理解一下 HYUKOH《万里》的 vibe，然后用这个 skill 生成一张海报。',
    reading:
      '这里的气质是辽阔、行进、荒凉，同时带着一种忘掉现实后继续远行的平静。红月是遥远而无法抵达的目标，三名骑行者对应歌曲不断向前推进的节奏。',
    prompt: `Create a finished vertical 3:5 minimal zine poster on full-frame warm gray aged paper. Use a flat orthographic scan with fibers, dust, faint stains and very high negative space. Place one small torn-paper black-and-white clipping in the lower-left quadrant: three distant riders moving in one direction across a nearly empty horizon.

High above the travelers and slightly to the right, print one saturated tomato-red circle as a remote moon. It is the only color and should remain isolated from the photograph. Under the clipping, set the Chinese title “万里” vertically and add “WANLI / 2017” in tiny monospaced type.

Add xerox softness, risograph grain, ink bleed and slight print misregistration. Keep the riders as silhouettes and the landscape stripped of detail. No border, no dramatic sky, no extra symbols. The image should feel vast, forward-moving and quietly unreachable.`,
    recipe:
      'lower-left-float / torn-paper clipping / almost textless / tomato-red / xerox softness / solitude',
    layout: 'distance',
    promptStatus: '依据截图整理',
  },
];
