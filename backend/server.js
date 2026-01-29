const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";

/* =====================
   Security & Performance Middleware
===================== */
// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for now to avoid issues with inline scripts/styles if any, or configure properly
    crossOriginEmbedderPolicy: false,
  }),
);

// Gzip Compression
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter); // Apply rate limiting only to API routes

/* =====================
   Standard Middleware
===================== */
app.use(
  cors({
    origin: isProduction
      ? process.env.ALLOWED_ORIGIN || false // In production, restrict to allowed origin or same-origin
      : ["http://localhost:5173", "http://localhost:8080"],
    methods: ["GET", "POST"],
    credentials: true,
  }),
);
app.use(express.json());

/* =====================
   Google Sheets Setup
===================== */
let googleAuthOptions = {};

const loadCredentialsFromEnv = () => {
  const raw = process.env.GOOGLE_CREDENTIALS;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (err) {
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf8");
      return JSON.parse(decoded);
    } catch (err2) {
      console.error(
        "❌ Failed to parse GOOGLE_CREDENTIALS from env:",
        err2.message,
      );
      return null;
    }
  }
};

let creds = loadCredentialsFromEnv();
if (!creds) {
  const credPath = path.join(__dirname, "credentials.json");
  if (fs.existsSync(credPath)) {
    try {
      creds = JSON.parse(fs.readFileSync(credPath, "utf8"));
      console.log(
        "ℹ️ Loaded Google credentials from backend/credentials.json (local fallback)",
      );
    } catch (err) {
      console.error("❌ Failed to read backend/credentials.json:", err.message);
    }
  }
}

if (creds) googleAuthOptions.credentials = creds;
googleAuthOptions.scopes = ["https://www.googleapis.com/auth/spreadsheets"];

const auth = new google.auth.GoogleAuth(googleAuthOptions);
const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = (process.env.GOOGLE_SHEET_ID || "").trim();
// Default to 'Sheet1' but allow override.
// Note: Vietnamese Google Sheets often default to 'Trang tính 1' or user might rename to 'Bảng_1'
const SHEET_TAB = process.env.GOOGLE_SHEET_TAB || "Sheet1";

if (!SPREADSHEET_ID) {
  console.warn("⚠️ GOOGLE_SHEET_ID is missing. API calls will fail.");
}

/* =====================
   API - Register
===================== */
app.post("/api/submit-registration", async (req, res) => {
  try {
    const data = req.body;

    // Validation
    if (!data.name || !data.phone) {
      return res.status(400).json({
        success: false,
        message: "Tên và số điện thoại là bắt buộc",
      });
    }

    const timestamp = new Date().toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    });

    // Helper to join arrays
    const formatArray = (arr) =>
      Array.isArray(arr) ? arr.join(", ") : arr || "";

    // Prepare row for Google Sheets
    // Column Order (Vietnamese Headers):
    // 1. Thời gian
    // 2. Họ và tên
    // 3. Số điện thoại
    // 4. Tuổi/Năm sinh
    // 5. Link Facebook/Zalo
    // 6. Khóa học quan tâm
    // 7. Trình độ hiện tại
    // 8. Mục đích học
    // 9. Kỹ năng muốn cải thiện
    // 10. Hình thức học
    // 11. Số buổi/tuần
    // 12. Mục tiêu cụ thể
    // 13. Kinh nghiệm học trước đây
    // 14. Nguồn giới thiệu
    // 15. Câu hỏi thêm
    const values = [
      [
        timestamp,
        data.name || "",
        data.phone || "",
        data.age || "",
        data.socialLink || "",
        data.course || "",
        data.currentLevel || "",
        formatArray(data.purposes),
        formatArray(data.skills),
        formatArray(data.learningFormats),
        data.sessionsPerWeek || "",
        data.goals || "",
        data.previousExperience || "",
        data.source || "",
        data.additionalQuestions || "",
      ],
    ];

    if (!SPREADSHEET_ID) {
      throw new Error("Server configuration error: GOOGLE_SHEET_ID missing");
    }

    // Append to Google Sheet (Fire and Forget - Non-blocking for speed)
    sheets.spreadsheets.values
      .append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_TAB}!A:O`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: values },
      })
      .then(() => {
        console.log("✅ Data successfully saved to Google Sheets");
      })
      .catch((err) => {
        console.error(
          "❌ Error saving to Google Sheets (Background):",
          err.message,
        );
      });

    // Respond immediately to the user
    res.status(200).json({
      success: true,
      message: "Đăng ký thành công!",
    });
  } catch (error) {
    console.error("Error processing registration:", error);
    res.status(500).json({
      success: false,
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau.",
      error: isProduction ? undefined : error.message,
    });
  }
});

/* =====================
   Static Files (Production)
===================== */
// Serve static files from the React app if in production
if (isProduction) {
  const distPath = path.join(__dirname, "../dist");
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log(`📂 Serving static files from ${distPath}`);
  } else {
    console.warn(
      "⚠️ Production mode but ../dist not found. Run 'npm run build' in root.",
    );
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
