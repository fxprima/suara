"use client";

import api from "@/services/api";
import { faUser, faAt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function Home() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    username: "",
    firstname: "",
    lastname: "",
    dob: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");

  const clearForm = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      username: "",
      firstname: "",
      lastname: "",
      dob: "",
    });
    setErrors([]);
    setSuccess("");
  };

  const handleLogin = async () => {
    const res = await signIn('credentials', {
      redirect: false, // biar kita kontrol redirect-nya manual
      email: formData.email,
      password: formData.password,
    });
  
    if (res?.error) {
      setErrors([res.error]);
    } else {
      setSuccess('Login successful!');
      // Optional: redirect ke halaman dashboard
      // router.push('/dashboard');
    }
  };
  

  const handleSignup = async () => {
    try {
      setErrors([]);
      setSuccess("");

      const data = {
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        phone: formData.phone,
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        dob: new Date(formData.dob).toISOString(),
      };

      const res = await api.post("/auth/register", data);

      // Reset form
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        username: "",
        firstname: "",
        lastname: "",
        dob: "",
      });
      // Set success message
      setSuccess(res.data.message);
    } catch (err: any) {
      console.error(err);
      const errorMessages = err.response?.data?.message || [err.message || "Internal server error"];

      if (Array.isArray(errorMessages)) setErrors(errorMessages);
      else setErrors([errorMessages]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-base-200 text-base-content">
      <div className="max-w-5xl mx-auto flex w-full h-full items-center justify-between p-10 space-x-10">
        {/* Left Section */}
        <div className="min-w-2/5 max-h-110 flex justify-center items-center">
          <svg width="502" height="520" viewBox="0 0 502 520" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M261.366 129.374C204.975 244.906 343.41 343.566 303.705 324.186C263.999 304.806 124.582 206.712 146.781 96.2565C156.252 49.1355 228.289 -15.2955 267.994 4.08471C307.7 23.4649 280.747 89.6682 261.366 129.374Z"
              fill="#FFD000"
            />
            <path
              d="M0.166065 333.144C-1.12078 377.308 29.0915 422.54 77.8021 415.44C284.266 385.345 301.297 556.192 302.584 512.028C303.871 467.864 254.1 321.94 88.4717 289.602C47.3836 281.58 1.45292 288.98 0.166065 333.144Z"
              fill="#FFD000"
            />
            <path
              d="M499.643 196.752C510.941 239.466 479.326 291.444 442.759 294.549C234.861 312.2 257.133 482.443 245.836 439.729C234.538 397.016 249.816 243.596 403.748 174.435C444.805 155.989 488.345 154.038 499.643 196.752Z"
              fill="#FFD000"
            />
          </svg>
        </div>

        {/* Right Section */}
        <div className="minw-3/5 flex flex-col justify-center items-center bg-base-300 p-10 rounded-4xl shadow-xl border border-neutral">
          <h1 className="text-4xl font-bold mb-4">Express your Suara</h1>
          <h2 className="text-xl font-semibold mb-6">Join us today.</h2>

          {/* Button Sign Up with Google */}
          <button className="w-full btn btn-outline btn-primary flex items-center justify-center mb-4 hover:scale-105 transition-transform">
            <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </button>

          {/* Divider */}
          <div className="flex items-center w-full my-4">
            <div className="flex-1 border-t border-white"></div>
            <span className="px-3 text-white">or</span>
            <div className="flex-1 border-t border-white"></div>
          </div>

          {/* Register Modal */}
          <input type="checkbox" id="signup-modal" className="modal-toggle" />
          <div className="modal">
            <div className="modal-box shadow-md bg-base-300 p-6 rounded-2xl m-auto flex flex-col">
              <h1 className="font-bold text-2xl mb-6">Create your account</h1>

              {/* Success Alert */}
              {success && (
                <div role="alert" className="alert alert-success mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4" />
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              {/* Error Alert */}
              {errors.length > 0 && (
                <div role="alert" className="alert alert-error mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <ul className="list-disc list-inside">
                    {errors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form className="w-full flex flex-col gap-4">
                {/* Username */}
                <label className="input  w-full">
                  <FontAwesomeIcon icon={faAt} className="h-5 w-5 opacity-50" />
                  <input
                    type="text"
                    placeholder="Username"
                    pattern="[A-Za-z][A-Za-z0-9\-]*"
                    title="Only letters, numbers or dash"
                    name="username"
                    value={formData.username}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        username: e.target.value,
                      });
                    }}
                  />
                </label>

                {/* Nama Depan & Belakang */}
                <div className="flex gap-4">
                  <label className="input  w-full">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 opacity-50" />
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      name="firstname"
                      value={formData.firstname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          firstname: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="input  w-full">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 opacity-50" />
                    <input
                      type="text"
                      required
                      placeholder="Last Name"
                      name="lastname"
                      value={formData.lastname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastname: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>

                {/* Email */}
                <label className="input flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </g>
                  </svg>
                  <input
                    className="w-full bg-transparent focus:outline-none"
                    type="email"
                    placeholder="Email"
                    required
                    autoComplete="off"
                    value={formData.email}
                    name="email"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                  />
                </label>

                {/* Password */}
                <label className="input flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input
                    className="w-full bg-transparent focus:outline-none"
                    type="password"
                    required
                    placeholder="Password"
                    autoComplete="new-password"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </label>

                {/* Confirm Password */}
                <label className="input  flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input
                    className="w-full bg-transparent focus:outline-none"
                    type="password"
                    required
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    name="confirmPassword"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                  />
                </label>

                {/* Phone */}
                <label className="input  flex items-center gap-2 w-full bg-base-100 px-4 py-2 rounded-lg shadow-inner focus-within:ring-2 focus-within:ring-primary">
                  <svg className="h-5 w-5 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                      <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input type="tel" className="tabular-nums" required placeholder="Phone" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </label>

                {/* DOB */}
                <label className="text-sm text-neutral-content">
                  <h3 className="font-semibold text-lg">Date of Birth</h3>
                  <p className="text-gray-400 my-3">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                  <input
                    type="date"
                    className="input w-full focus:outline-none"
                    required
                    name="dob"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                    title="Enter a valid date in YYYY-MM-DD format"
                  />
                </label>
              </form>

              <div className="modal-action flex justify-end mt-4">
                <button onClick={handleSignup} type="button" className="btn btn-primary">
                  Sign up
                </button>
                <label htmlFor="signup-modal" className="btn bg-transparent ml-2">
                  Close
                </label>
              </div>
            </div>
          </div>

          {/* Tombol untuk buka modal */}
          <label htmlFor="signup-modal" className="w-full btn btn-primary hover:scale-105 transition-transform" onClick={clearForm}>
            Create account
          </label>

          <p className="text-xs text-neutral-content mt-4 text-center">
            By signing up, you agree to the{" "}
            <a href="#" className="text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary">
              Privacy Policy
            </a>
            , including{" "}
            <a href="#" className="text-primary">
              Cookie Use
            </a>
            .
          </p>

          <div className="mt-6 text-center">
            <p className="text-neutral-content mb-2">Already have an account?</p>
            {/* Tombol untuk buka modal */}
            <label htmlFor="login-modal" className="w-full btn btn-outline btn-primary hover:scale-105 transition-transform" onClick={clearForm}>
              Login
            </label>

            <input type="checkbox" id="login-modal" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box shadow-md bg-base-300 p-6 rounded-2xl m-auto flex flex-col">
              
                <h2 className="text-2xl font-semibold text-center">Login</h2>
                <form className="flex flex-col gap-4 mt-4" method="dialog">
                  
                  <label className="input  w-full">
                    <FontAwesomeIcon icon={faAt} className="h-5 w-5 opacity-50" />
                    <input type="text" placeholder="Email" onChange={
                      (e) => setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }/>
                  </label>

                  <label className="input  w-full">
                    <FontAwesomeIcon icon={faUser} className="h-5 w-5 opacity-50" />
                    <input type="password" placeholder="Password" name="password" onChange={
                      (e) => setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }/>
                  </label>
                </form>

                {/* Forgot Password */}
                <a href="#" className=" text-center mt-5">
                  Forgot password?
                </a>

                <div className="modal-action flex justify-end mt-4">
                  <button onClick={handleLogin} type="button" className="btn btn-primary w-full">
                    Login
                  </button>                  
                  
                </div>

                {/* Divider */}
                <div className="flex items-center w-full my-4">
                  <div className="flex-1 border-t border-white"></div>
                  <span className="px-3 text-white">or</span>
                  <div className="flex-1 border-t border-white"></div>
                </div>

                {/* Button Sign Up with Google */}
                <button className="w-full btn btn-outline btn-primary flex items-center justify-center mb-4 hover:scale-105 transition-transform">
                  <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5 mr-2" />
                  Sign up with Google
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
