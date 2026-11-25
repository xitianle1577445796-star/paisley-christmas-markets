export type Lang = 'en' | 'zh';

export const TRANSLATIONS = {
  en: {
    nav: {
      discover: 'Discover Market',
      apply: 'Trader Application',
      admin: 'Admin Console',
      gdpr: 'GDPR Privacy'
    },
    controls: {
      title: 'Visual & Display Studio',
      language: 'Language / 语言',
      theme: 'Atmosphere Mode',
      day: 'Daylight',
      night: 'Winter Night',
      brightness: 'Screen Brightness',
      reset: 'Reset'
    },
    hero: {
      ctaApply: 'Reserve a Trader Chalet',
      openSuffix: 'Open',
      ctaAdmin: 'White-Label Admin Demo',
      medallionTop: 'PAISLEY ABBEY · EST. 1163',
      medallionCenter: 'WINTER',
      medallionSub: 'HERITAGE EDITION'
    },
    info: {
      dates: 'Season Dates',
      venue: 'Venue & Heritage Site',
      hours: 'Opening Hours'
    },
    map: {
      eyebrow: 'Live Spatial Pitch Allocation',
      title: 'Paisley Abbey & County Square Masterplan',
      available: 'Available',
      pending: 'Pending',
      booked: 'Booked',
      abbeyFacade: 'HISTORIC PAISLEY ABBEY FAÇADE (1163)',
      zoneA: 'ZONE A · ABBEY GASTRONOMY ROW (32A POWER + WATER)',
      zoneB: 'ZONE B · PAISLEY LOOM ARTISAN QUARTER',
      zoneC: 'ZONE C · COUNTY SQUARE PROMENADE',
      stage: 'STAGE',
      inspectorTrader: 'Selected Pitch Specs',
      inspectorVisitor: 'Chalet Inspector',
      emptyTrader: 'Click any emerald Available chalet on the map to auto-populate your application.',
      emptyVisitor: 'Select any chalet on the Abbey map to inspect the resident trader or pitch details.',
      chaletLabel: 'Chalet',
      dimensions: 'Dimensions',
      fee: 'Seasonal Fee',
      utilities: 'Included Utilities',
      confirmedTrader: 'Confirmed Resident Trader',
      signature: 'Signature',
      pendingNotice: 'This pitch currently has an application under administrator review.',
      availableNotice: 'Ready for immediate reservation via the Trader Application workflow.'
    },
    directory: {
      eyebrow: 'Live Database Directory',
      title: 'Confirmed Market Traders',
      all: 'All',
      food: 'Food & Drink',
      craft: 'Artisan & Crafts',
      gifts: 'Gifts & Heritage',
      chaletPrefix: 'Chalet'
    },
    apply: {
      eyebrow: 'Step 2 · Trader Onboarding',
      title: 'Apply for a Market Chalet',
      subtitle: 'Submitting reserves your chosen pitch immediately in our database until reviewed by the Market Director.',
      successTitle: 'Application Received & Pitch Reserved',
      successRefLabel: 'Save your GDPR & Tracking Reference Code:',
      successHint: 'You can now log into the Admin Console to approve this application and see it publish live.',
      chaletLabel: 'Selected Chalet Pitch *',
      chaletPlaceholder: '-- Choose an available chalet --',
      categoryLabel: 'Trading Category *',
      businessLabel: 'Business / Stall Name *',
      businessPlaceholder: 'e.g., Renfrewshire Artisan Chocolatier',
      contactLabel: 'Primary Contact Name *',
      contactPlaceholder: 'Full name',
      emailLabel: 'Contact Email *',
      signatureLabel: 'Signature Product & Price',
      signaturePlaceholder: 'e.g., Spiced Sea-Salt Truffle Box (£12)',
      descLabel: 'Stall Description (Published upon Approval) *',
      descPlaceholder: 'Describe your craft, provenance, and what visitors can expect...',
      complianceTitle: 'Regulatory & UK GDPR Compliance',
      insuranceText: 'I confirm my business holds valid £5M Public Liability Insurance (Mandatory).',
      hygieneText: 'Food Standards Scotland Hygiene Pass Certificate held (if selling food/drink).',
      gdprText: 'UK GDPR Consent: I consent to the processing of my application data for pitch allocation. I may export or erase my data anytime via the GDPR Portal.',
      submit: 'Submit Application & Reserve Pitch',
      submitting: 'Reserving Chalet...'
    },
    admin: {
      loginTitle: 'Market Director Console',
      loginSub: 'JWT-protected administration for trader approvals & white-label event configuration.',
      email: 'Admin Email',
      password: 'Password',
      signIn: 'Sign In to Admin Console',
      demoHint: 'Pre-filled demo credentials: admin@paisleymarkets.co.uk / Paisley2026!',
      sessionPrefix: 'Authenticated Session',
      consoleTitle: 'Operations & White-Label Control',
      signOut: 'Sign Out',
      whiteLabelTitle: 'White-Label Event Template Switcher (Generic Commercial Pattern)',
      whiteLabelDesc: 'Demonstrates how this platform can be redeployed for any seasonal market client in one click via database-driven SiteConfig.',
      pipelineTitle: 'Trader Approval Pipeline',
      pendingBadge: 'Pending Review',
      approvedBadge: 'Live Approved',
      colPitch: 'Pitch',
      colBusiness: 'Business & Contact',
      colCategory: 'Category',
      colStatus: 'Status',
      colActions: 'Actions',
      approve: 'Approve',
      reject: 'Reject'
    },
    gdpr: {
      eyebrow: 'UK GDPR Articles 15 & 17',
      title: 'Self-Service Data Privacy Portal',
      subtitle: 'Traders can verify, export (Right of Access), or permanently delete (Right to Erasure) their stored application records directly from our database.',
      email: 'Registered Email',
      refCode: 'Reference Code',
      exportBtn: 'Export My Personal Data (JSON)',
      eraseBtn: 'Permanently Erase My Data'
    },
    cookie: {
      title: 'Privacy & Essential Cookies (UK GDPR)',
      desc: 'We only use strictly necessary storage for theme, language, brightness preference and admin security. No advertising trackers are loaded.',
      btn: 'Acknowledge & Continue'
    },
    footer: {
      copy: 'Proof-of-Concept Tender Architecture · COMP10020 Internet Technologies',
      stack: 'Stack: React + TypeScript + Vite + Express +'
    }
  },
  zh: {
    nav: {
      discover: '探索集市',
      apply: '摊主入驻申请',
      admin: '管理员后台',
      gdpr: 'GDPR 隐私门户'
    },
    controls: {
      title: '视觉与显示控制中心',
      language: '界面语言 / Language',
      theme: '明暗氛围模式',
      day: '白天模式',
      night: '黑夜模式',
      brightness: '画面亮度调节',
      reset: '重置'
    },
    hero: {
      ctaApply: '预订集市木屋摊位',
      openSuffix: '席空闲',
      ctaAdmin: '体验白标多租户后台',
      medallionTop: '佩斯利修道院 · 始建于 1163',
      medallionCenter: '冬夜',
      medallionSub: '苏格兰非遗限定版'
    },
    info: {
      dates: '活动开放日期',
      venue: '举办地标与广场',
      hours: '每日营业时间'
    },
    map: {
      eyebrow: '实时空间摊位分配系统',
      title: '佩斯利修道院与郡广场交互平面图',
      available: '空闲可订',
      pending: '审核锁定中',
      booked: '已入驻',
      abbeyFacade: '佩斯利修道院历史立面 (1163)',
      zoneA: 'A区 · 修道院美食长廊（含 32A 电力与供水）',
      zoneB: 'B区 · 佩斯利织布匠人手作区',
      zoneC: 'C区 · 郡广场黄金主干道',
      stage: '演出舞台',
      inspectorTrader: '已选摊位参数',
      inspectorVisitor: '木屋摊位详情',
      emptyTrader: '点击地图上任意绿色“空闲可订”木屋，系统将自动填入您的申请表单。',
      emptyVisitor: '点击地图上任意木屋，查看已入驻摊主的招牌商品或摊位规格。',
      chaletLabel: '号木屋',
      dimensions: '木屋尺寸',
      fee: '展期租金',
      utilities: '配套水电设施',
      confirmedTrader: '已认证入驻摊主',
      signature: '招牌推荐',
      pendingNotice: '该摊位已有新申请提交，正在等待管理员审核。',
      availableNotice: '该黄金摊位目前空闲，可立即通过摊主申请流程锁定预订。'
    },
    directory: {
      eyebrow: '实时数据库同步目录',
      title: '官方认证集市摊主',
      all: '全部品类',
      food: '特色美食饮品',
      craft: '手工艺品',
      gifts: '文创与非遗礼赠',
      chaletPrefix: '木屋'
    },
    apply: {
      eyebrow: '第二步 · 摊主入驻登记',
      title: '在线申请集市木屋',
      subtitle: '提交后，系统将在数据库中实时锁定所选木屋为审核状态，等待集市总监审批。',
      successTitle: '申请已提交，摊位已为您临时锁定',
      successRefLabel: '请妥善保存您的 GDPR 与进度追踪码：',
      successHint: '您现在可以前往“管理员后台”一键批准该申请，亲眼见证它实时发布到首页目录与地图。',
      chaletLabel: '已选木屋摊位 *',
      chaletPlaceholder: '-- 请选择一个空闲木屋 --',
      categoryLabel: '经营品类 *',
      businessLabel: '商铺 / 品牌名称 *',
      businessPlaceholder: '例如：伦弗鲁郡手工热巧克工坊',
      contactLabel: '主理人姓名 *',
      contactPlaceholder: '请输入真实姓名',
      emailLabel: '联系邮箱 *',
      signatureLabel: '主打招牌商品与参考价',
      signaturePlaceholder: '例如：海盐焦糖松露礼盒 (£12)',
      descLabel: '摊位简介（审核通过后将公开展示）*',
      descPlaceholder: '请介绍您的品牌故事、工艺特色以及为游客带来的冬日体验...',
      complianceTitle: '安全合规与英国 GDPR 隐私授权',
      insuranceText: '我确认本商户持有有效的 500 万英镑公众责任险（必填项）。',
      hygieneText: '已取得苏格兰食品标准局卫生合格证（餐饮类商户勾选）。',
      gdprText: '英国 GDPR 授权：我同意平台处理我的申请数据用于摊位审核。我知晓可随时通过“GDPR 隐私门户”导出或彻底删除个人数据。',
      submit: '提交申请并锁定木屋',
      submitting: '正在锁定摊位...'
    },
    admin: {
      loginTitle: '集市总监管理控制台',
      loginSub: '采用 JWT 令牌保护，支持摊主全链路审批与白标多租户主题一键切换。',
      email: '管理员邮箱',
      password: '登录密码',
      signIn: '安全登录管理后台',
      demoHint: '已为您预填演示账号：admin@paisleymarkets.co.uk / Paisley2026!',
      sessionPrefix: '已认证会话',
      consoleTitle: '运营审批与白标多租户中控台',
      signOut: '退出登录',
      whiteLabelTitle: '白标活动模板一键切换（商业复用架构演示）',
      whiteLabelDesc: '向客户直观展示：同一套核心代码与数据库 SiteConfig，1 秒即可无缝复用到格拉斯哥或爱丁堡等其他季节性活动。',
      pipelineTitle: '摊主入驻全链路审批流',
      pendingBadge: '待审核',
      approvedBadge: '已上架公开',
      colPitch: '摊位号',
      colBusiness: '商铺与联系人',
      colCategory: '经营品类',
      colStatus: '当前状态',
      colActions: '审批操作',
      approve: '批准上架',
      reject: '驳回释放'
    },
    gdpr: {
      eyebrow: '英国 GDPR 第 15 条 & 第 17 条',
      title: '自助数据隐私管理门户',
      subtitle: '入驻摊主可随时凭邮箱与追踪码，直接从数据库导出个人完整档案（访问权），或一键永久擦除所有记录（被遗忘权）。',
      email: '申请时填写的邮箱',
      refCode: '申请追踪码 (Reference Code)',
      exportBtn: '导出我的个人数据 (JSON)',
      eraseBtn: '永久删除我的数据记录'
    },
    cookie: {
      title: '隐私与必要 Cookie 说明 (UK GDPR)',
      desc: '本网站仅在本地保存您的主题模式、中英文语言、亮度设置及管理员安全会话，不加载任何第三方广告追踪脚本。',
      btn: '知悉并继续'
    },
    footer: {
      copy: '商业竞标概念验证平台 · COMP10020 Internet Technologies',
      stack: '技术栈：React + TypeScript + Vite + Express +'
    }
  }
} as const;
