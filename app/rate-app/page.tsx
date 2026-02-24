"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Dock from "../components/Dock";
import styles from "./rateapp.module.css";

export default function RateAppPage() {
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, message }),
    });

    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1600);
    }
  };

  return (
    <main className={styles["rate-root"]}>
      <div className={styles["rate-inner"]}>
        <div className={styles["rate-card"]}>
          {success ? (
            <div className={styles["success-msg"]}>
              ✨ Thank you for your feedback!
            </div>
          ) : (
            <>
              <h1 className={styles["rate-title"]}>
                Rate Your Experience
              </h1>

              <p className={styles["rate-subtitle"]}>
                Your feedback helps us improve the learning experience.
              </p>

              <div className={styles["stars"]}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`${styles["star-btn"]} ${
                      rating >= star ? styles["active"] : ""
                    }`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                rows={4}
                placeholder="Tell us what you love or what we can improve..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles["textarea"]}
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={styles["submit-btn"]}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </>
          )}
        </div>
      </div>

      <Dock />
    </main>
  );
}
