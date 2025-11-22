import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { addEmployee } from "../dbOperations";

function Registration() {
    const [formFilled, setFormFilled] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const [imgSrc, setImgSrc] = useState(""); // Default image
    const [otherImage, setOtherImage] = useState(false); // Tracks if a custom image is uploaded
    const [error, setError] = useState(""); // Error message for invalid images
    const [showError, setShowError] = useState(false); // Controls error visibility

    const imageUploader = useRef(null); // Ref for file input
    const uploadedImage = useRef(null); // Ref for displaying the uploaded image

    const handleImageUpload = (e) => {
        const [file] = e.target.files;
        const selected = e.target.files[0];
        const allowedTypes = ["image/png", "image/jpeg"];

        if (selected && allowedTypes.includes(selected.type)) {
            if (file.size <= 2000000) {
                setOtherImage(true);
                setImgSrc(file);
                setShowError(false);

                const reader = new FileReader();
                reader.onload = (event) => {
                    uploadedImage.current.src = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                setShowError(true);
                setError("Image size should be less than 2MB");
            }
        } else {
            setShowError(true);
            setError("Please select an image file (png or jpg)");
        }
    };

    const onSubmit = (data) => {
        setLoading(true);

        const getBase64Data = (file) => {
            return new Promise((resolve, reject) => {
                if (otherImage) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        data["dp"] = reader.result; // Add base64 image to form data
                        resolve("data loaded");
                    };
                    reader.readAsDataURL(file);
                } else {
                    data["dp"] = "default"; // Use default image
                    resolve("default data");
                }
            });
        };

        getBase64Data(imgSrc).then(() => {
            addEmployee(data)
                .then(() => {
                    setLoading(false);
                    setFormFilled(true);
                })
                .catch((err) => {
                    console.error("Error adding employee:", err);
                    setLoading(false);
                });
        });
    };

    return (
        <div style={styles.container}>
            {loading ? (
                <div style={styles.loader}>Loading...</div>
            ) : formFilled ? (
                <div style={styles.successMessage}>Employee added successfully!</div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
                    {/* Profile Picture */}
                    <div style={styles.imageContainer}>
                        <img
                            ref={uploadedImage}
                            src={typeof imgSrc === "string" ? imgSrc : URL.createObjectURL(imgSrc)}
                            alt="Profile"
                            style={styles.profileImage}
                        />
                        <input
                            type="file"
                            accept="image/png, image/jpeg"
                            onChange={handleImageUpload}
                            ref={imageUploader}
                            style={styles.hiddenInput}
                        />
                        <button
                            type="button"
                            onClick={() => imageUploader.current.click()}
                            style={styles.uploadButton}
                        >
                            Upload Photo
                        </button>
                        {showError && <p style={styles.errorMessage}>{error}</p>}
                    </div>

                    {/* Name Field */}
                    <div style={styles.inputGroup}>
                        <label>Name</label>
                        <input
                            type="text"
                            {...register("name", { required: "Name is required" })}
                            style={styles.input}
                        />
                        {errors.name && <p style={styles.errorMessage}>{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email is required" })}
                            style={styles.input}
                        />
                        {errors.email && <p style={styles.errorMessage}>{errors.email.message}</p>}
                    </div>

                    {/* Department Field */}
                    <div style={styles.inputGroup}>
                        <label>Department</label>
                        <select {...register("department")} style={styles.input}>
                            <option value="Admin">Admin</option>
                            <option value="Development">Development</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" style={styles.submitButton}>
                        Register Employee
                    </button>
                </form>
            )}
        </div>
    );
}

const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        maxWidth: "500px",
        margin: "0 auto",
    },
    loader: {
        textAlign: "center",
        fontSize: "1.5rem",
        marginTop: "50px",
    },
    successMessage: {
        textAlign: "center",
        fontSize: "1.5rem",
        color: "green",
        marginTop: "50px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    imageContainer: {
        textAlign: "center",
        marginBottom: "20px",
    },
    profileImage: {
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        objectFit: "cover",
        margin: "0 auto",
    },
    hiddenInput: {
        display: "none",
    },
    uploadButton: {
        marginTop: "10px",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    input: {
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    errorMessage: {
        color: "red",
        fontSize: "0.9rem",
    },
    submitButton: {
        padding: "10px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Registration;