# BLE Workforce Efficiency Management System

A BLE-based workforce monitoring system that uses ESP32 and BLE beacons to automate employee attendance and provide workforce efficiency insights.

## Overview

The system uses **BLE beacons** assigned to employees and an **ESP32 gateway** to detect their presence.

When an employee enters or leaves the monitored area, the ESP32 detects the corresponding state change and records an **ENTRY** or **EXIT** event in Firebase.

The React dashboard uses this attendance data to calculate working hours, workforce utilization, and estimated labor cost.

## Features

- BLE-based employee presence detection
- Automatic Entry/Exit attendance tracking
- Firebase Realtime Database integration
- React-based dashboard
- Work-hour calculation
- Planned vs Actual working hours
- Workforce utilization
- Estimated labor cost
- ESP32 gateway monitoring
- Event-based Firebase writes to reduce unnecessary database usage

## System Flow

```text
BLE Beacon
    ↓
ESP32 BLE Gateway
    ↓
Firebase Realtime Database
    ↓
React Dashboard
    ↓
Work Hours
    ↓
Workforce Utilization
    ↓
Estimated Labor Cost
Hardware
ESP32 Development Board
SparkFun NanoBeacon IN100 BLE Beacons
CR2032 Batteries
Wi-Fi Network
Technologies Used
Embedded: Arduino / C++, ESP32
Communication: Bluetooth Low Energy (BLE), Wi-Fi
Backend: Firebase Realtime Database
Authentication: Firebase Authentication
Frontend: React, JavaScript, HTML, CSS
Attendance Logic

The ESP32 continuously scans for configured BLE beacons.

To avoid false detections:

Multiple detections are used to confirm an entry.
An exit is generated only after the beacon remains undetected for a configured timeout.
Firebase is written only when a confirmed ENTRY or EXIT event occurs.
Beacon Detected
      ↓
Entry Confirmation
      ↓
ENTRY → Firebase

Beacon Missing
      ↓
Timeout
      ↓
EXIT → Firebase
Workforce Efficiency

Attendance data is used as the foundation for workforce analysis.

The dashboard can provide:

Total employees present
Average tracked hours
Expected vs actual working hours
Workforce utilization
Estimated labor cost
Workforce Utilization
Utilization =
Total Tracked Hours / Total Expected Hours × 100
Estimated Labor Cost
Estimated Cost =
Tracked Hours × Hourly Rate

Estimated labor cost is intended for workforce analysis and is not a complete payroll calculation.

Firebase Structure
attendance/
└── YYYY-MM-DD/
    └── employee/
        └── logs/
            ├── timestamp_ENTRY
            └── timestamp_EXIT
Project Goal

The goal of this project is to go beyond simple attendance tracking and provide useful information about workforce time, utilization, and estimated labor cost, helping management better understand workforce efficiency.

Future Improvements
Employee and shift management
Multiple ESP32 gateways
Advanced workforce analytics
Historical reports
Overtime tracking
Role-based access
Payroll integration
Project

BLE Workforce Efficiency Management System

Detect. Track. Analyze. Improve.
