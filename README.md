# EMPTRACK

BLE-powered workforce attendance and labor-cost visibility using ESP32, Firebase Realtime Database, and React.

EMPTRACK records confirmed employee presence transitions, reconstructs work sessions, and gives managers a same-day view of attendance, tracked hours, planned-vs-actual time, utilization, and estimated labor cost. BLE presence is an attendance signal; it does not prove that an employee was productive every second.

## System flow

```text
NanoBeacon
    -> ESP32 BLE gateway
    -> confirmed ENTRY / EXIT event
    -> Firebase Realtime Database
    -> React dashboard
    -> work sessions, hours, utilization, cost estimate
```

The ESP32 scans frequently, but Firebase attendance writes happen only when local state changes:

- beacon detected after being absent and confirmed: one `ENTRY`
- beacon continuously detected: no additional attendance writes
- beacon unseen for the exit timeout: one `EXIT`

The gateway heartbeat is separate from employee attendance and is written to:

```text
/gateways/GATEWAY_01/status
```

The project does not use periodic employee `/presence` heartbeats in the current architecture.

## Repository layout

```text
embedded/esp32_gateway.ino   ESP32 BLE gateway firmware
src/components/Home.js       Shift-filtered workforce dashboard
src/components/EmployeeDetails.js
                             Session view and CSV export
src/components/Registration.js
                             Employee and beacon registration
src/dbOperations.js          Firebase reads and session calculations
src/firebase.js               React Firebase client configuration
```

## Requirements

- Node.js 18 or newer
- npm
- Arduino IDE or PlatformIO
- ESP32 board support for Arduino
- Firebase project with Realtime Database and Authentication
- SparkFun NanoBeacon IN100 devices or compatible BLE advertisers

## Run the dashboard

```bash
npm install
npm start
```

The development dashboard runs at `http://localhost:3000`.

For a production build:

```bash
npm test -- --watchAll=false
npm run build
```

Deploy the generated `build/` directory to a static hosting provider configured to serve `index.html` for client-side routes.

## Firebase configuration

The React app uses the Firebase web configuration in `src/firebase.js`. Firebase web API keys are identifiers, not admin credentials, but Realtime Database rules and Authentication must still be configured correctly.

The ESP32 requires:

- Firebase Realtime Database host
- a write credential supported by the installed `FirebaseESP32` library
- Wi-Fi SSID and password

Do not commit Wi-Fi passwords, Firebase legacy database secrets, service-account keys, or other private credentials. The firmware contains safe placeholders; replace them locally before uploading. Any credential that was previously committed must be rotated in Firebase and on the Wi-Fi network.

## ESP32 firmware

The supplied firmware:

- actively scans BLE approximately every three seconds
- recognizes the two existing advertised names:
  - `Emp1Anmol@comp&iot`
  - `Emp2Manthan@comp&iot`
- ignores very weak detections
- confirms entry using repeated detections within a short window
- confirms exit only after sustained absence
- writes one canonical event under `/attendance`
- retries a small number of failed attendance writes in RAM
- reconnects Wi-Fi without permanently blocking BLE scanning
- writes a gateway heartbeat approximately every 60 seconds

Before uploading:

1. Open `embedded/esp32_gateway.ino`.
2. Fill in the local Wi-Fi and Firebase values.
3. Select the correct ESP32 board and serial port.
4. Compile and upload.
5. Open Serial Monitor at `115200` baud.

Expected startup messages include:

```text
Gateway is ready.
Waiting for BLE devices...
```

The physical ESP32 is not updated by a Git push. The firmware must be compiled and uploaded manually after firmware changes.

## Attendance data model

New events use the canonical structure:

```text
/attendance/{YYYY-MM-DD}/{beaconAdvertisedName}/logs/{unixTimestamp}_{ENTRY|EXIT}
```

Example:

```json
{
  "type": "ENTRY",
  "timestamp": "2026-09-12 09:00:00",
  "unixTimestamp": 1780000000,
  "rssi": -61,
  "gatewayId": "GATEWAY_01",
  "zoneId": "ZONE_ENTRANCE",
  "eventSource": "ESP32_BLE_GATEWAY"
}
```

The dashboard sorts events by `unixTimestamp` and reconstructs sessions:

```text
ENTRY -> EXIT = completed session
ENTRY without EXIT = ongoing session
```

Legacy records without an explicit transition type are not treated as reliable attendance sessions.

## Dashboard behavior

- The dashboard uses the local calendar date, not UTC, for daily data.
- The Day/Night toggle filters employees by their registered shift.
- Night sessions that continue past midnight are associated with the night-shift start date.
- Employee details show reconstructed sessions rather than raw BLE observations.
- CSV export contains one row per session with entry, exit, duration, and status.
- The dashboard displays gateway health separately from employee presence.
- Clicking the EMPTRACK logo returns to the landing page.

## Registering another beacon

Dashboard registration stores employee metadata, but the current ESP32 firmware uses a fixed list of advertised names. To add a physical beacon:

1. Add its exact advertised name to the `beacons[]` array in the firmware.
2. Register the matching employee and advertised name in the dashboard.
3. Assign the employee to the required shift.
4. Upload the firmware again.

Do not rename the two existing NanoBeacon advertisements.

## Troubleshooting

### Gateway status is not updating

- Confirm the ESP32 is connected to Wi-Fi.
- Confirm the Firebase host and credential are correct.
- Check Serial Monitor for `Heartbeat failed`.
- Verify `/gateways/GATEWAY_01/status` in Realtime Database.
- Confirm the ESP32 clock synchronized before writes begin.

### Employee is not shown as present

- Confirm the exact advertised name is in `beacons[]`.
- Confirm the beacon is advertising and within range.
- Check that the entry event was written under today's local date.
- Confirm the dashboard employee registration contains the same advertised name.
- Remember that a single missed BLE scan is not an exit; the configured timeout must elapse.

### Old data appears

The dashboard intentionally reads the selected local day and ignores legacy raw records that do not contain `ENTRY` or `EXIT`. Check the browser date/time and the ESP32 NTP synchronization if the calendar date is wrong.

## Security checklist

- Rotate any Firebase legacy secret that was ever committed.
- Change the Wi-Fi password if it was exposed.
- Use Firebase Authentication and restrictive Realtime Database rules.
- Never place Firebase admin credentials in React source code.
- Review Git history before making the repository public.

## Scope

This is an attendance and workforce-insight prototype. It estimates tracked labor cost from configured hourly rates. 
