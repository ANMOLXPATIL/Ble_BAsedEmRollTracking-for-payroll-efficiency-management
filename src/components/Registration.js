import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addEmployee } from "../dbOperations";
import NavBar from "./Navbar";

function Registration() {
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setLoading(true);
        setSuccessMsg("");
        try {
            await addEmployee(data);
            setSuccessMsg(`Worker ${data.name} successfully registered in registry.`);
            reset();
            setTimeout(() => navigate("/home"), 1500);
        } catch (err) {
            console.error("Error registering worker:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
            <div style={{ width: "80px", position: "fixed", top: 0, bottom: 0, left: 0, backgroundColor: "#FFFFFF", borderRight: "1px solid #E2E8F0" }}>
                <NavBar logOut={() => navigate("/login")} />
            </div>

            <div style={{ marginLeft: "80px", flex: 1, padding: "40px", maxWidth: "800px" }}>
                <div style={{ marginBottom: "24px" }}>
                    <button onClick={() => navigate("/home")} style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #E2E8F0", background: "#FFFFFF", color: "#475569", cursor: "pointer", fontWeight: "500", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                        &larr; Back to Dashboard
                    </button>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "36px", boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: "0 0 8px 0" }}>Register Factory Worker</h2>
                    <p style={{ color: "#64748B", fontSize: "14px", margin: "0 0 28px 0" }}>Add worker details, hourly rate, and beacon mapping to the system.</p>

                    {successMsg && (
                        <div style={{ backgroundColor: "#ECFDF5", color: "#059669", padding: "14px", borderRadius: "10px", fontSize: "14px", fontWeight: "600", marginBottom: "24px", border: "1px solid #A7F3D0" }}>
                            {successMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#475569", letterSpacing: "0.05em" }}>Worker ID</label>
                                <input
                                    type="text"
                                    placeholder="EMP003"
                                    {...register("id", { required: "Worker ID is required" })}
                                    style={{ padding: "12px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                                />
                                {errors.id && <span style={{ color: "#EF4444", fontSize: "12px" }}>{errors.id.message}</span>}
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#475569", letterSpacing: "0.05em" }}>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Ramesh Kumar"
                                    {...register("name", { required: "Full Name is required" })}
                                    style={{ padding: "12px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                                />
                                {errors.name && <span style={{ color: "#EF4444", fontSize: "12px" }}>{errors.name.message}</span>}
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#475569", letterSpacing: "0.05em" }}>Department</label>
                                <select {...register("department")} style={{ padding: "12px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", backgroundColor: "#FFFFFF" }}>
                                    <option value="Assembly Floor">Assembly Floor</option>
                                    <option value="Packaging & Loading">Packaging & Loading</option>
                                    <option value="Quality Control">Quality Control</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Engineering & IoT">Engineering & IoT</option>
                                </select>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#475569", letterSpacing: "0.05em" }}>Shift Schedule</label>
                                <select {...register("shiftId")} style={{ padding: "12px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit", backgroundColor: "#FFFFFF" }}>
                                    <option value="SHIFT_DAY">Standard Day Shift (09:00 - 18:00 | 8.0h)</option>
                                    <option value="SHIFT_NIGHT">Night Production Shift (21:00 - 06:00 | 8.0h)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#475569", letterSpacing: "0.05em" }}>Hourly Rate (₹)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue="87.5"
                                {...register("hourlyRate")}
                                style={{ padding: "12px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                            />
                        </div>

                        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "20px", marginTop: "10px" }}>
                            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#0F172A" }}>Physical BLE Beacon Association</h4>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#475569" }}>Beacon ID</label>
                                    <input
                                        type="text"
                                        placeholder="beacon_003"
                                        {...register("beaconId")}
                                        style={{ padding: "12px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                                    />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", color: "#475569" }}>Advertised Name</label>
                                    <input
                                        type="text"
                                        placeholder="Emp3Ramesh@comp&iot"
                                        {...register("beaconName")}
                                        style={{ padding: "12px 14px", border: "1px solid #CBD5E1", borderRadius: "8px", fontSize: "14px", outline: "none", fontFamily: "inherit" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} style={{ padding: "14px", backgroundColor: "#0F172A", color: "#FFFFFF", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", marginTop: "12px" }}>
                            {loading ? "Registering Worker..." : "Save Worker Record"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration;