'use client';
import React, { useState, useEffect } from "react";
import { auth } from "@/utils/firebase.config";
import {
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { useRouter } from "next/navigation"; // ✅ Correct import

function Page() { // ✅ Capitalized component
  const [phoneNumber, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);

  const router = useRouter(); // ✅ Proper usage

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA verified");
          },
          "expired-callback": () => {
            window.alert("reCAPTCHA expired. Please try again.");
          },
        }
      );
    }
    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        delete window.recaptchaVerifier;
      }
    };
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleLogin = () => {
    if (timer > 0) return;

    const appVerifier = window.recaptchaVerifier;
    const formatPh = `+91${phoneNumber}`;

    if (appVerifier) {
      signInWithPhoneNumber(auth, formatPh, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setConfirmationResult(confirmationResult);
          setOtpSent(true);
          setMessage("OTP sent successfully!");
          setTimer(30);
        })
        .catch((error) => {
          console.error("Error sending OTP:", error.code, error.message);
          setMessage("Error sending OTP, please try again.");
        });
    } else {
      setMessage("reCAPTCHA not initialized properly. Please refresh and try again.");
    }
  };

  const verifyOtp = async () => {
    if (confirmationResult) {
      confirmationResult
        .confirm(otp)
        .then((res) => {
          alert(`Phone number verified! Welcome ${res.user.phoneNumber}`);
          router.push('/');
        })
        .catch((err) => {
          console.error(err);
          setMessage("Incorrect OTP, please try again.");
        });
    } else {
      setMessage("Please request the OTP first.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-blue-800 ">
      <div className="hidden lg:flex lg:w-[700px] bg-[#8B5CF6] items-center justify-center rounded-r-3xl">
        <div className="text-white mt-3 font-sans text-center">
          <p className="text-3xl font-bold">Starts Here With Ai</p>
          <p className="mt-3 text-xl">Welcome to Heal Me!</p>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-4 bg-blue-100 rounded-r rounded-2xl text-black">
        <h2 className="text-3xl font-semibold mb-2">Login to Your Account</h2>
        <p className="text-black mb-6">find AI for personal healthcare</p>

        <form className="w-full max-w-md ">
          <div className="mb-4">
            <label className="block mb-2">Phone Number</label>
            <div className="flex">
              <span className="flex items-center px-4 bg-gray-200 border rounded-l-md text-black">
                +91
              </span>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your 10 digits"
                pattern="[6789][0-9]{9}"
                className="flex-1 border p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <div id="recaptcha-container"></div>
              <button
                type="button"
                onClick={handleLogin}
                className={`bg-[#8B5CF6] text-white p-2 rounded-r-md hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-purple-500 ${timer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={timer > 0}
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
              </button>
            </div>
          </div>

          {otpSent && (
            <>
              <div className="mb-4">
                <label className="block mb-2">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="****"
                  maxLength="6"
                  className="border p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <button
                type="button"
                onClick={verifyOtp}
                className="bg-[#8B5CF6] text-white w-full py-3 rounded-md hover:bg-[#6D28D9] focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Login
              </button>
            </>
          )}
          <p>{message}</p>
        </form>
      </div>
    </div>
  );
}

export default Page;
