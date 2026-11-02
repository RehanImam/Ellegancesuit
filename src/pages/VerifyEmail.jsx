import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const runVerification = async () => {
      try {
        const response = await verifyEmail(token);
        setMessage(response?.message || "Your email has been verified successfully.");
        setStatus("success");
      } catch (error) {
        setMessage(error.message || "We could not verify your email. The link may be invalid or expired.");
        setStatus("error");
      }
    };

    if (token) {
      runVerification();
    } else {
      setStatus("error");
      setMessage("Verification token is missing.");
    }
  }, [token, verifyEmail]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#fff8fa] px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-pink-200 bg-white/80 p-8 text-center shadow-lg shadow-pink-100/50 backdrop-blur-md">
        {status === "loading" && (
          <>
            <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-pink-600" />
            <h2 className="mt-6 text-2xl font-serif font-bold text-rose-950">Verifying email</h2>
            <p className="mt-3 text-sm text-rose-900/70">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-6 text-2xl font-serif font-bold text-rose-950">Email verified</h2>
            <p className="mt-3 text-sm text-emerald-700">{message}</p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-rose-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-900"
            >
              Go to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="mx-auto h-12 w-12 text-red-600" />
            <h2 className="mt-6 text-2xl font-serif font-bold text-rose-950">Verification failed</h2>
            <p className="mt-3 text-sm text-red-700">{message}</p>
            <Link
              to="/signup"
              className="mt-6 inline-flex items-center justify-center rounded-xl border border-pink-200 bg-pink-50 px-5 py-3 text-sm font-semibold text-rose-900 transition hover:bg-pink-100"
            >
              Create a new account
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
