"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function QuestionJar() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
    message: "",
    agree: false,
  });

  const [loading, setLoading] = useState(false); // NEW: loading state

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: form.name,
          from_email: form.email,
          phone: form.phone,
          question: form.question,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      toast.success("Question submitted successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        question: "",
        message: "",
        agree: false,
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error("Oops! Something went wrong. Please try again later.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <section
      id="question-jar"
      className="w-full bg-[rgb(255,250,246)] py-16 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl mb-4 ppe-header">
            Ask Any Question
          </h2>
          <p className="text-lg text-black max-w-2xl mx-auto">
            Got questions about your studies or need academic guidance? Ask anything and we'll provide personalized answers to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-full">
          {/* LEFT FORM */}
          <div className="rounded-2xl p-8 h-full flex flex-col">
            <div className="mb-6">
              <h3 className="text-2xl mb-2 ppe-header">
                Submit Your Question
              </h3>
              <p className="text-black">
                Fill out the form below and we'll get back to you via message or email.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 flex-grow flex flex-col"
            >
              <div className="space-y-4 flex-grow">
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black"
                  required
                />

                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black"
                  required
                />

                <input
                  name="phone"
                  placeholder="Phone Number (Optional)"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black"
                />

                <input
                  name="question"
                  placeholder="Your Question"
                  value={form.question}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black"
                  required
                />

                <textarea
                  name="message"
                  placeholder="Additional Details (Optional)"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg border border-gray-300 min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black text-black"
                />
              </div>

              {/* CHECKBOX */}
              <label className="flex items-start gap-2 text-sm text-black mt-4">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="w-4 h-4 mt-1 flex-shrink-0"
                  required
                />
                <span>
                  By providing your information, you agree to receive academic updates and responses via SMS or email. Msg & data rates may apply. You can unsubscribe anytime by replying STOP.
                </span>
              </label>

              {/* 🔥 BRUTALIST 3D BUTTON */}
              <button
                type="submit"
                className="battle-btn mt-6"
                disabled={loading} // disable button while loading
              >
                <span className="battle-btn-content">
                  {loading ? "Submitting your question…" : "Submit Question →"}
                </span>
              </button>
            </form>
          </div>

          {/* RIGHT VIDEO */}
          <div className="relative h-full">
            <div className="rounded-2xl h-full overflow-hidden">
              <video
                src="/question-jar.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {/* CSS */}
      <style jsx>{`
        .ppe-header {
          font-family: "PPE";
          font-weight: 400;
          color: rgb(0, 0, 0);
        }

        .battle-btn {
          position: relative;
          width: 100%;
          border-radius: 9999px;
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .battle-btn::before {
          content: "";
          position: absolute;
          top: 6px;
          left: 6px;
          width: 100%;
          height: 100%;
          background-color: white;
          border: 2px solid black;
          border-radius: inherit;
          transition: 0.2s ease;
        }

        .battle-btn-content {
          position: relative;
          z-index: 2;
          background-color: #63cfbf;
          border: 2px solid black;
          border-radius: inherit;
          height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 1rem;
          transition: transform 0.2s ease;
        }

        .battle-btn:hover .battle-btn-content {
          transform: translate(6px, 6px);
        }

        .battle-btn:hover::before {
          opacity: 0;
        }

        /* Toastify Custom Styles */
        .Toastify__toast {
          border-radius: 16px !important;
          padding: 14px !important;
        }
        .Toastify__toast--success {
          background: #ecfdf5 !important;
          color: #065f46 !important;
        }
        .Toastify__toast--error {
          background: #fef2f2 !important;
          color: #991b1b !important;
        }
      `}</style>
    </section>
  );
}