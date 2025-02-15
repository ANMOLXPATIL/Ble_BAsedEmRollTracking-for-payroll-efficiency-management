import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { IonIcon } from "@ionic/react";
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from "ionicons/icons";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State for password visibility
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home");
        } catch (err) {
            setError(err.message || "An error occurred while logging in.");
        }
    };

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            navigate("/home");
        } catch (err) {
            setError(err.message || "An error occurred while signing in with Google.");
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="screen-1">
            {/* EMPTRACK Text */}
            <h1 className="logo-text">EMPTRACK</h1>

            {/* Email Input */}
            <div className="email">
                <label htmlFor="email">Email Address</label>
                <div className="sec-2">
                    <IonIcon icon={mailOutline} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Username@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Password Input */}
            <div className="password">
                <label htmlFor="password">Password</label>
                <div className="sec-2">
                    <IonIcon icon={lockClosedOutline} />
                    <input
                        type={showPassword ? "text" : "password"} // Toggle between text and password
                        name="password"
                        placeholder="············"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <IonIcon
                        icon={showPassword ? eyeOffOutline : eyeOutline} // Change icon based on visibility
                        className="show-hide"
                        onClick={togglePasswordVisibility} // Toggle password visibility
                    />
                </div>
            </div>

            {/* Login Button */}
            <button className="login" onClick={handleLogin}>
                Login
            </button>

            {/* Google Sign-In Button */}
            <button className="google-btn" onClick={handleGoogleSignIn}>
                Sign in with Google
            </button>

            {/* Error Message */}
            {error && <p className="error">{error}</p>}

            {/* Footer Links */}
            <div className="footer">
                <span>Sign up</span>
                <span>Forgot Password?</span>
            </div>
        </div>
    );
}

export default Login;