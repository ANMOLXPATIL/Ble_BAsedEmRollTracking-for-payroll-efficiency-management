#include <WiFi.h>
#include <FirebaseESP32.h>
#include <BLEDevice.h>
#include <BLEScan.h>
#include <time.h>

// ============================================================
//                     CONFIGURATION
// ============================================================

// ---------------- Wi-Fi ----------------
#define WIFI_SSID "BLEPROJECT"
#define WIFI_PASSWORD "Anmol@<>"

// ---------------- Firebase ----------------
// Rotate the old secret before using this version.
#define FIREBASE_HOST "emprolltracking-default-rtdb.firebaseio.com"
#define FIREBASE_SECRET "tEsqKC0bUzeeyBQ2HCfxFZeynQoUyhX6eEXVu3gT"

// ---------------- Gateway ----------------
#define GATEWAY_ID "GATEWAY_01"
#define ZONE_ID "ZONE_ENTRANCE"
#define ZONE_NAME "Main Gate & Entrance"

// ---------------- BLE ----------------
#define SCAN_TIME_SEC 3

// Beacon must remain unseen for this long before EXIT.
#define EXIT_TIMEOUT_SEC 30

// Number of valid detections required to confirm ENTRY.
#define ENTRY_CONFIRMATIONS 2

// Maximum allowed time between ENTRY confirmation detections.
#define ENTRY_CONFIRM_WINDOW_SEC 10

// Ignore very weak BLE detections.
#define RSSI_MIN_THRESHOLD -85

// ---------------- Gateway heartbeat ----------------
#define HEARTBEAT_INTERVAL_SEC 60

// ---------------- Firebase retry ----------------
#define MAX_PENDING_EVENTS 5
#define EVENT_RETRY_INTERVAL_SEC 5

// ---------------- Wi-Fi retry ----------------
#define WIFI_RETRY_INTERVAL_MS 5000

// ============================================================
//                     FIREBASE OBJECTS
// ============================================================

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// ============================================================
//                  BEACON STATE
// ============================================================
//
// Important:
// These are temporary runtime states only.
// No employee salary, work hours, payroll, or daily totals
// are stored here.
//

struct BeaconState {

  const char* beaconId;

  // Current confirmed BLE presence.
  bool isPresent;

  // Last successful BLE detection.
  time_t lastSeen;

  // Most recently observed RSSI.
  int lastRssi;

  // Temporary ENTRY confirmation.
  uint8_t confirmationCount;
  time_t firstConfirmationTime;
};

// Your two already-burned beacons.
// DO NOT CHANGE THESE NAMES.
BeaconState beacons[] = {

  {
    "Emp1Anmol@comp&iot",
    false,
    0,
    -127,
    0,
    0
  },

  {
    "Emp2Manthan@comp&iot",
    false,
    0,
    -127,
    0,
    0
  }
};

const size_t BEACON_COUNT =
  sizeof(beacons) / sizeof(beacons[0]);

BLEScan* pBLEScan = nullptr;

// ============================================================
//                 PENDING EVENT QUEUE
// ============================================================
//
// Only used temporarily if Firebase is unavailable.
//
// This is NOT a database.
// It is a very small retry buffer.
//

struct PendingEvent {

  bool used;

  char beaconId[64];
  char eventType[20];
  char timestamp[20];
  char date[11];
  int rssi;

  // Unix timestamp used as deterministic event ID.
  time_t eventTimestamp;
};

PendingEvent pendingEvents[MAX_PENDING_EVENTS];

// ============================================================
//                         TIMERS
// ============================================================

unsigned long lastHeartbeatMillis = 0;
unsigned long lastRetryMillis = 0;
unsigned long lastWiFiAttemptMillis = 0;

// ============================================================
//                    FUNCTION DECLARATIONS
// ============================================================

void initializeWiFi();
void maintainWiFi();

void initializeFirebase();
void initializeTime();
void initializeBLE();

void processBLEScan();
void processScanResults(BLEScanResults* scanResults, time_t now);

BeaconState* findBeacon(const String& advertisedName);

void handleBeaconDetection(
  BeaconState& beacon,
  time_t now,
  int rssi
);

void checkForExits(time_t now);

void createAttendanceEvent(
  const char* beaconId,
  const char* eventType,
  time_t timestamp,
  int rssi
);

bool writeAttendanceEvent(
  const char* beaconId,
  const char* eventType,
  time_t timestamp,
  int rssi
);

void queuePendingEvent(
  const char* beaconId,
  const char* eventType,
  time_t timestamp,
  int rssi
);

void retryPendingEvents();

void checkHeartbeat();
void sendGatewayHeartbeat();

String formatTimestamp(time_t timestamp);
void formatDate(
  time_t timestamp,
  char* output,
  size_t outputSize
);

void resetEntryConfirmation(BeaconState& beacon);

bool isSystemTimeValid();

// ============================================================
//                           SETUP
// ============================================================

void setup() {

  Serial.begin(115200);
  delay(200);

  Serial.println();
  Serial.println("==========================================");
  Serial.println("   BLE WORKFORCE GATEWAY");
  Serial.println("==========================================");

  // Initialize retry queue.
  for (int i = 0; i < MAX_PENDING_EVENTS; i++) {
    pendingEvents[i].used = false;
  }

  initializeWiFi();
  initializeFirebase();
  initializeTime();
  initializeBLE();

  // First heartbeat immediately after startup.
  sendGatewayHeartbeat();

  Serial.println();
  Serial.println("Gateway is ready.");
  Serial.println("Waiting for BLE devices...");
}

// ============================================================
//                            LOOP
// ============================================================

void loop() {

  // Keep Wi-Fi available without blocking BLE unnecessarily.
  maintainWiFi();

  // Scan BLE.
  processBLEScan();

  // Check whether a confirmed presence has timed out.
  if (isSystemTimeValid()) {
    checkForExits(time(nullptr));
  }

  // Retry only failed ENTRY/EXIT events.
  retryPendingEvents();

  // Gateway health heartbeat.
  checkHeartbeat();

  // Very short yield instead of a large blocking delay.
  delay(20);
}

// ============================================================
//                         WIFI
// ============================================================

void initializeWiFi() {

  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);

  WiFi.begin(
    WIFI_SSID,
    WIFI_PASSWORD
  );

  Serial.print("Connecting to Wi-Fi");

  unsigned long start = millis();

  while (
    WiFi.status() != WL_CONNECTED &&
    millis() - start < 15000
  ) {

    Serial.print(".");
    delay(300);
  }

  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {

    Serial.println(
      "Wi-Fi connected: " +
      WiFi.localIP().toString()
    );

  } else {

    Serial.println(
      "Wi-Fi unavailable."
    );

    Serial.println(
      "BLE scanning will continue."
    );
  }
}

// ------------------------------------------------------------
// Non-blocking Wi-Fi maintenance
// ------------------------------------------------------------

void maintainWiFi() {

  if (WiFi.status() == WL_CONNECTED) {
    return;
  }

  if (
    millis() - lastWiFiAttemptMillis
    < WIFI_RETRY_INTERVAL_MS
  ) {
    return;
  }

  lastWiFiAttemptMillis = millis();

  Serial.println(
    "Wi-Fi disconnected. Reconnecting..."
  );

  WiFi.reconnect();
}

// ============================================================
//                       FIREBASE
// ============================================================

void initializeFirebase() {

  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_SECRET;

  Firebase.begin(
    &config,
    &auth
  );

  Firebase.reconnectWiFi(true);

  Serial.println(
    "Firebase initialized."
  );
}

// ============================================================
//                         TIME
// ============================================================

void initializeTime() {

  configTime(
    19800,
    0,
    "pool.ntp.org",
    "time.nist.gov"
  );

  Serial.print(
    "Synchronizing time"
  );

  unsigned long start = millis();

  while (
    !isSystemTimeValid() &&
    millis() - start < 30000
  ) {

    Serial.print(".");
    delay(500);
  }

  Serial.println();

  if (isSystemTimeValid()) {

    Serial.println(
      "Time synchronized: " +
      formatTimestamp(time(nullptr))
    );

  } else {

    Serial.println(
      "WARNING: Time synchronization failed."
    );
  }
}

// ============================================================
//                           BLE
// ============================================================

void initializeBLE() {

  BLEDevice::init("");

  pBLEScan =
    BLEDevice::getScan();

  if (pBLEScan == nullptr) {

    Serial.println(
      "ERROR: BLE scanner initialization failed."
    );

    return;
  }

  // Active scan is retained because the current prototype
  // depends on the advertised device name.
  pBLEScan->setActiveScan(true);

  pBLEScan->setInterval(97);
  pBLEScan->setWindow(37);

  Serial.println(
    "BLE scanner initialized."
  );
}

// ============================================================
//                     BLE SCAN PROCESSING
// ============================================================

void processBLEScan() {

  if (pBLEScan == nullptr) {
    return;
  }

  if (!isSystemTimeValid()) {
    return;
  }

  BLEScanResults* scanResults =
    pBLEScan->start(
      SCAN_TIME_SEC,
      false
    );

  time_t now = time(nullptr);

  if (scanResults != nullptr) {

    processScanResults(
      scanResults,
      now
    );
  }

  pBLEScan->clearResults();
}

// ============================================================
//                 PROCESS SCAN RESULTS
// ============================================================

void processScanResults(
  BLEScanResults* scanResults,
  time_t now
) {

  int deviceCount =
    scanResults->getCount();

  for (int i = 0; i < deviceCount; i++) {

    BLEAdvertisedDevice device =
      scanResults->getDevice(i);

    String advertisedName =
      device.getName().c_str();

    int rssi =
      device.getRSSI();

    // Ignore unnamed BLE devices.
    if (advertisedName.length() == 0) {
      continue;
    }

    // Ignore very weak detections.
    if (rssi < RSSI_MIN_THRESHOLD) {
      continue;
    }

    BeaconState* beacon =
      findBeacon(advertisedName);

    // Unknown BLE device.
    if (beacon == nullptr) {
      continue;
    }

    handleBeaconDetection(
      *beacon,
      now,
      rssi
    );
  }
}

// ============================================================
//                    FIND KNOWN BEACON
// ============================================================

BeaconState* findBeacon(
  const String& advertisedName
) {

  for (size_t i = 0; i < BEACON_COUNT; i++) {

    if (
      advertisedName.equals(
        beacons[i].beaconId
      )
    ) {

      return &beacons[i];
    }
  }

  return nullptr;
}

// ============================================================
//                  HANDLE BEACON DETECTION
// ============================================================

void handleBeaconDetection(
  BeaconState& beacon,
  time_t now,
  int rssi
) {

  // Every valid detection updates local presence evidence.
  beacon.lastSeen = now;
  beacon.lastRssi = rssi;

  // ----------------------------------------------------------
  // CASE 1:
  // Employee is already confirmed PRESENT.
  // ----------------------------------------------------------

  if (beacon.isPresent) {

    // IMPORTANT:
    // No Firebase attendance write here.
    //
    // Repeated BLE detections are simply observations.
    //
    return;
  }

  // ----------------------------------------------------------
  // CASE 2:
  // Employee is currently ABSENT.
  // Start ENTRY confirmation.
  // ----------------------------------------------------------

  if (beacon.confirmationCount == 0) {

    beacon.confirmationCount = 1;
    beacon.firstConfirmationTime = now;

    Serial.println(
      String("ENTRY candidate: ") +
      beacon.beaconId
    );

    return;
  }

  // ----------------------------------------------------------
  // Confirmation window expired.
  // Start over.
  // ----------------------------------------------------------

  if (
    now -
    beacon.firstConfirmationTime
    >
    ENTRY_CONFIRM_WINDOW_SEC
  ) {

    beacon.confirmationCount = 1;
    beacon.firstConfirmationTime = now;

    return;
  }

  // ----------------------------------------------------------
  // Second/next valid detection.
  // ----------------------------------------------------------

  beacon.confirmationCount++;

  // ----------------------------------------------------------
  // ENTRY CONFIRMED
  // ----------------------------------------------------------

  if (
    beacon.confirmationCount >=
    ENTRY_CONFIRMATIONS
  ) {

    beacon.isPresent = true;

    resetEntryConfirmation(
      beacon
    );

    Serial.println();
    Serial.println(
      "------------------------------------------"
    );
    Serial.println(
      "ENTRY CONFIRMED"
    );
    Serial.println(
      String("Beacon: ") +
      beacon.beaconId
    );
    Serial.println(
      String("RSSI: ") +
      rssi
    );
    Serial.println(
      String("Time: ") +
      formatTimestamp(now)
    );
    Serial.println(
      "------------------------------------------"
    );

    // ONE Firebase attendance write.
    createAttendanceEvent(
      beacon.beaconId,
      "ENTRY",
      now,
      rssi
    );
  }
}

// ============================================================
//                      EXIT PROCESSING
// ============================================================

void checkForExits(time_t now) {

  for (size_t i = 0; i < BEACON_COUNT; i++) {

    BeaconState& beacon =
      beacons[i];

    // Only check employees currently PRESENT.
    if (!beacon.isPresent) {
      continue;
    }

    if (beacon.lastSeen == 0) {
      continue;
    }

    unsigned long absenceSeconds =
      (unsigned long)(
        now - beacon.lastSeen
      );

    // IMPORTANT:
    // A missed scan does NOT mean EXIT.
    //
    // EXIT is generated only after sustained absence.
    if (
      absenceSeconds >=
      EXIT_TIMEOUT_SEC
    ) {

      beacon.isPresent = false;

      Serial.println();
      Serial.println(
        "------------------------------------------"
      );
      Serial.println(
        "EXIT CONFIRMED"
      );
      Serial.println(
        String("Beacon: ") +
        beacon.beaconId
      );
      Serial.println(
        String("Time: ") +
        formatTimestamp(now)
      );
      Serial.println(
        "------------------------------------------"
      );

      // ONE Firebase attendance write.
      createAttendanceEvent(
        beacon.beaconId,
        "EXIT",
        now,
        beacon.lastRssi
      );

      // Clear temporary runtime state.
      beacon.lastSeen = 0;
      beacon.lastRssi = -127;
    }
  }
}

// ============================================================
//              CREATE ATTENDANCE EVENT
// ============================================================

void createAttendanceEvent(
  const char* beaconId,
  const char* eventType,
  time_t timestamp,
  int rssi
) {

  // Try immediately.
  if (
    writeAttendanceEvent(
      beaconId,
      eventType,
      timestamp,
      rssi
    )
  ) {

    Serial.println(
      String("Firebase event saved: ") +
      eventType
    );

    return;
  }

  // Firebase unavailable.
  //
  // Keep a small copy in RAM and retry later.
  Serial.println(
    "Firebase unavailable. Queueing event."
  );

  queuePendingEvent(
    beaconId,
    eventType,
    timestamp,
    rssi
  );
}

// ============================================================
//              WRITE ONE ATTENDANCE EVENT
// ============================================================

bool writeAttendanceEvent(
  const char* beaconId,
  const char* eventType,
  time_t timestamp,
  int rssi
) {

  if (
    WiFi.status() != WL_CONNECTED
  ) {
    return false;
  }

  if (!Firebase.ready()) {
    return false;
  }

  char dateString[11];

  formatDate(
    timestamp,
    dateString,
    sizeof(dateString)
  );

  FirebaseJson json;

  json.add(
    "beaconId",
    beaconId
  );

  json.add(
    "gatewayId",
    GATEWAY_ID
  );

  json.add(
    "zoneId",
    ZONE_ID
  );

  json.add(
    "zoneName",
    ZONE_NAME
  );

  json.add(
    "type",
    eventType
  );

  json.add(
    "timestamp",
    formatTimestamp(timestamp)
  );

  json.add(
    "unixTimestamp",
    (long)timestamp
  );

  json.add(
    "rssi",
    rssi
  );

  json.add(
    "eventSource",
    "ESP32_BLE_GATEWAY"
  );

  // ----------------------------------------------------------
  // CANONICAL DETERMINISTIC KEY: timestamp-first format
  // Example: 1700000000_ENTRY
  // This guarantees natural chronological sorting in Firebase!
  // ----------------------------------------------------------

  String eventId =
    String((unsigned long)timestamp) +
    "_" +
    String(eventType);

  String eventPath =
    String("/attendance/") +
    dateString +
    "/" +
    beaconId +
    "/logs/" +
    eventId;

  bool success =
    Firebase.setJSON(
      fbdo,
      eventPath,
      json
    );

  if (!success) {

    Serial.println(
      "Attendance write failed: " +
      fbdo.errorReason()
    );

    return false;
  }

  return true;
}

// ============================================================
//                   QUEUE FAILED EVENT
// ============================================================

void queuePendingEvent(
  const char* beaconId,
  const char* eventType,
  time_t timestamp,
  int rssi
) {

  for (int i = 0; i < MAX_PENDING_EVENTS; i++) {

    if (!pendingEvents[i].used) {

      pendingEvents[i].used = true;

      strncpy(
        pendingEvents[i].beaconId,
        beaconId,
        sizeof(
          pendingEvents[i].beaconId
        ) - 1
      );

      pendingEvents[i].beaconId[
        sizeof(
          pendingEvents[i].beaconId
        ) - 1
      ] = '\0';

      strncpy(
        pendingEvents[i].eventType,
        eventType,
        sizeof(
          pendingEvents[i].eventType
        ) - 1
      );

      pendingEvents[i].eventType[
        sizeof(
          pendingEvents[i].eventType
        ) - 1
      ] = '\0';

      formatDate(
        timestamp,
        pendingEvents[i].date,
        sizeof(
          pendingEvents[i].date
        )
      );

      String ts =
        formatTimestamp(timestamp);

      strncpy(
        pendingEvents[i].timestamp,
        ts.c_str(),
        sizeof(
          pendingEvents[i].timestamp
        ) - 1
      );

      pendingEvents[i].timestamp[
        sizeof(
          pendingEvents[i].timestamp
        ) - 1
      ] = '\0';

      pendingEvents[i].eventTimestamp =
        timestamp;

      pendingEvents[i].rssi =
        rssi;

      Serial.println(
        "Event stored in retry buffer."
      );

      return;
    }
  }

  // Queue is full.
  //
  // Do not block BLE processing.
  Serial.println(
    "WARNING: Event retry queue FULL."
  );
}

// ============================================================
//                     RETRY EVENTS
// ============================================================

void retryPendingEvents() {

  if (
    millis() - lastRetryMillis <
    EVENT_RETRY_INTERVAL_SEC * 1000UL
  ) {
    return;
  }

  lastRetryMillis =
    millis();

  if (
    WiFi.status() != WL_CONNECTED ||
    !Firebase.ready()
  ) {
    return;
  }

  for (int i = 0; i < MAX_PENDING_EVENTS; i++) {

    if (!pendingEvents[i].used) {
      continue;
    }

    bool success =
      writeAttendanceEvent(
        pendingEvents[i].beaconId,
        pendingEvents[i].eventType,
        pendingEvents[i].eventTimestamp,
        pendingEvents[i].rssi
      );

    if (success) {

      Serial.println(
        String("Queued event uploaded: ") +
        pendingEvents[i].eventType +
        " / " +
        pendingEvents[i].beaconId
      );

      pendingEvents[i].used = false;
    }
  }
}

// ============================================================
//                     HEARTBEAT
// ============================================================

void checkHeartbeat() {

  if (
    millis() - lastHeartbeatMillis >=
    HEARTBEAT_INTERVAL_SEC * 1000UL
  ) {

    lastHeartbeatMillis =
      millis();

    sendGatewayHeartbeat();
  }
}

// ============================================================
//                 SEND GATEWAY HEARTBEAT
// ============================================================

void sendGatewayHeartbeat() {

  if (
    WiFi.status() != WL_CONNECTED ||
    !Firebase.ready()
  ) {
    return;
  }

  if (!isSystemTimeValid()) {
    return;
  }

  time_t now =
    time(nullptr);

  FirebaseJson json;

  json.add(
    "gatewayId",
    GATEWAY_ID
  );

  json.add(
    "zoneId",
    ZONE_ID
  );

  json.add(
    "zoneName",
    ZONE_NAME
  );

  json.add(
    "status",
    "online"
  );

  json.add(
    "ip",
    WiFi.localIP().toString()
  );

  json.add(
    "lastSeen",
    formatTimestamp(now)
  );

  json.add(
    "unixTimestamp",
    (long)now
  );

  json.add(
    "uptimeSeconds",
    millis() / 1000UL
  );

  String path =
    String("/gateways/") +
    GATEWAY_ID +
    "/status";

  bool success =
    Firebase.setJSON(
      fbdo,
      path,
      json
    );

  if (success) {

    Serial.println(
      String("Gateway heartbeat: ") +
      formatTimestamp(now)
    );

  } else {

    Serial.println(
      "Heartbeat failed: " +
      fbdo.errorReason()
    );
  }
}

// ============================================================
//              RESET ENTRY CONFIRMATION
// ============================================================

void resetEntryConfirmation(
  BeaconState& beacon
) {

  beacon.confirmationCount = 0;
  beacon.firstConfirmationTime = 0;
}

// ============================================================
//                     TIME HELPERS
// ============================================================

bool isSystemTimeValid() {

  return time(nullptr) >= 1000000000;
}

String formatTimestamp(
  time_t timestamp
) {

  struct tm timeInfo;

  localtime_r(
    &timestamp,
    &timeInfo
  );

  char buffer[20];

  strftime(
    buffer,
    sizeof(buffer),
    "%Y-%m-%d %H:%M:%S",
    &timeInfo
  );

  return String(buffer);
}

void formatDate(
  time_t timestamp,
  char* output,
  size_t outputSize
) {

  struct tm timeInfo;

  localtime_r(
    &timestamp,
    &timeInfo
  );

  strftime(
    output,
    outputSize,
    "%Y-%m-%d",
    &timeInfo
  );
}