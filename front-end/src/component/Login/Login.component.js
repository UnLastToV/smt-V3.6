import React, { useState, useEffect } from 'react';
import "../Login/Login.css";
import LOGO from "../../image/logo.jpg";
import VIEW from "../../image/view.jpg";
import { Snackbar, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ username: '', password: '' });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const navigate = useNavigate();

    useEffect(() => {
        const savedUsername = localStorage.getItem('rememberedUsername');
        const savedPassword = localStorage.getItem('rememberedPassword');
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('username');
        if (isLoggedIn) {
            navigate('/mobiledasboard', { replace: true });
        }
    }, [navigate]);

    const validateForm = () => {
        let valid = true;
        let errors = {};

        if (!username) {
            errors.username = '';
            valid = false;
        } else if (!/^[a-zA-Z0-9]+$/.test(username)) {
            errors.username = '';
            valid = false;
        }

        if (!password) {
            errors.password = '';
            valid = false;
        } else if (password.length < 8) {
            errors.password = '';
            valid = false;
        } else if (!/[A-Z]/.test(password)) {
            errors.password = '';
            valid = false;
        } else if (!/[a-z]/.test(password)) {
            errors.password = '';
            valid = false;
        } else if (!/[0-9]/.test(password)) {
            errors.password = '';
            valid = false;
        } else if (!/[\W_]/.test(password)) {
            errors.password = '" !';
            valid = false;
        }

        setErrors(errors);
        return valid;
    };

    const handleLogin = () => {
        if (validateForm()) {

            if (username === 'Kitpanich' && password === 'rtv7410T!') {
                if (rememberMe) {
                    localStorage.setItem('rememberedUsername', username);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedUsername');
                    localStorage.removeItem('rememberedPassword');
                }

                setSnackbarMessage('Login Successfully');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);

                localStorage.setItem('username', username);

                setTimeout(() => window.location.href = '/mobiledasboard', 1800);
                // setTimeout(() => window.location.href = '/dashboard', 2000);
                // setTimeout(() => window.location.href = 'http://127.0.0.1:5000', 2000); 
            } else {
                setSnackbarMessage(' "ชื่อผู้ใช้" หรือ "รหัสผ่าน" ไม่ถูกต้อง!');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } else {
            setSnackbarMessage(' "ชื่อผู้ใช้" หรือ "รหัสผ่าน" ไม่ถูกต้อง!');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }


    };

    // const handleSignUpRedirect = () => {
    //     navigate('/signup');
    // };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className="app-container">
            <img className='bg-img' src={VIEW} alt="background" />
            <div className="login-box">
                <div className="user-icon">
                    <img src={LOGO} alt="logo" />
                </div>
                <div className='text'>
                    <h2>SMART TICKET</h2>
                    <p>สำนักงานตำรวจแห่งชาติ</p>
                </div>

                <div className="input-group">
                    <label htmlFor="username"></label>
                    <input
                        placeholder='ชื่อผู้ใช้'
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^[a-zA-Z0-9]*$/;
                            if (regex.test(value) && value.length <= 20) {
                                setUsername(value);
                            }
                        }}

                        maxLength={20}
                    />
                    {errors.username && <p className="error">{errors.username}</p>}
                </div>

                <div className="input-group" style={{ position: 'relative' }}>
                    <label htmlFor="password"></label>
                    <input
                        placeholder='รหัสผ่าน'
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => {
                            const value = e.target.value;
                            const regex = /^[a-zA-Z0-9!@#$%^&*()_+=[\]{};':"\\|,.<>/?`~]*$/; 
                            if (regex.test(value) && value.length <= 24) {
                                setPassword(value);
                            }
                        }}
                        
                        maxLength={24}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            position: 'absolute',
                            right: '10px',
                            top: '60%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#007bff'
                        }}
                    >
                        {showPassword ? <VisibilityOffIcon></VisibilityOffIcon> : <VisibilityIcon></VisibilityIcon>}
                    </button>
                </div>

                <div className="input-group">
                    <div className='list-password'>
                        <div className='remember'>
                            <input type='checkbox'
                                className='remem'
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />จำรหัสผ่าน
                        </div>
                        <div className='forgot'>
                            <a href="!#">ลืมรหัสผ่าน</a>
                        </div>
                    </div>
                </div>

                <button className="log" onClick={handleLogin}>เข้าสู่ระบบ</button>
                {/* <button className="sign-up" onClick={handleSignUpRedirect}>สร้างบัญชีใหม่</button> */}

                {/* Snackbar for notifications */}
                {/* <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    className="snackbar-container"
                    anchorOrigin={{ vertical: 'cneter', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%', fontSize: '1.2rem' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar> */}
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={handleCloseSnackbar}
                    className="snackbar-container"
                    anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbarSeverity}
                        iconMapping={{
                            success: <CheckCircleIcon className="snackbar-icon success-icon" />,
                            error: <ErrorIcon className="snackbar-icon error-icon" />
                        }}
                        sx={{
                            width: '100%',
                            fontSize: '1.2rem',
                            textAlign: 'center',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </div>
        </div>
    );
}

export default Login;
