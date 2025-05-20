import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../components/common/Sidebar';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import Header from '../../components/common/Header';
import auth from "../../services/auth";
import { FlickeringGrid } from '../../components/magicui/flickering-grid';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        faculty: "",
        studyProgram: "",
        nim: "",
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { register } = auth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.username) newErrors.username = "Full name is required";
        if (!formData.nim) newErrors.nim = "NIM is required";
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.studyProgram) newErrors.studyProgram = "Study program is required";
        if (!formData.faculty) newErrors.faculty = "Faculty is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await register(
                formData.username,
                formData.email,
                formData.password,
                formData.faculty,
                formData.studyProgram,
                formData.nim
            );
            if (response?.message) {
                toast.success("Registration successful!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "colored",
                });
                setTimeout(() => navigate("/login"), 1000);
            } else {
                throw new Error("Registration failed");
            }
        } catch (error) {
            toast.error(error.message || "An error occurred during registration", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                theme: "colored",
            });
        }
    };

    return (
        <div className="relative flex h-screen items-center justify-center overflow-hidden">
            {/* Background FlickeringGrid */}
            <div className="absolute inset-0 -z-10">
                <FlickeringGrid squareSize={8} />
            </div>

            {/* Container Register */}
            <div className="flex max-w-5xl w-full h-full bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
                <div className="w-1/2 h-full">
                    <Sidebar />
                </div>

                <div className="w-1/2 bg-white p-12 h-full flex flex-col justify-center">
                    <Header className="-mt-6 mb-4" />
                    <h1 className="text-4xl font-bold text-[#090446] mb-2">Register Account</h1>
                    <p className="text-lg text-[#090446] mb-6">Pendaftaran Member</p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="flex flex-col items-center space-y-2">
                            <InputField
                                label="Nama Lengkap"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                error={errors.username}
                                className="w-full max-w-xs"
                                inputClassName="h-9"
                            />
                            <InputField
                                label="NIM"
                                id="nim"
                                name="nim"
                                value={formData.nim}
                                onChange={handleChange}
                                required
                                error={errors.nim}
                                className="w-full max-w-xs"
                                inputClassName="h-9"
                            />
                            <InputField
                                label="Email"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={errors.email}
                                className="w-full max-w-xs"
                                inputClassName="h-9"
                            />
                            <InputField
                                label="Password"
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                error={errors.password}
                                toggleVisibility
                                className="w-full max-w-xs"
                                inputClassName="h-9"
                            />
                            <InputField
                                label="Jurusan"
                                id="studyProgram"
                                name="studyProgram"
                                value={formData.studyProgram}
                                onChange={handleChange}
                                required
                                error={errors.studyProgram}
                                className="w-full max-w-xs"
                                inputClassName="h-9"
                            />
                            <InputField
                                label="Fakultas"
                                id="faculty"
                                name="faculty"
                                value={formData.faculty}
                                onChange={handleChange}
                                required
                                error={errors.faculty}
                                className="w-full max-w-xs"
                                inputClassName="h-9"
                            />
                            <Button
                                type="submit"
                                size="large"
                                variant="primary"
                                className="w-full max-w-xs bg-red-600 text-white"
                            >
                                Sign up
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;