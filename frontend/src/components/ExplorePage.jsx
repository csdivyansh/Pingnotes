import React from "react";
import "./ExplorePage.css";
import Navbar from "./Navbar";

const plans = [
  {
    title: "Free",
    price: "₹0/month",
    features: ["Basic notes access", "Google Drive sync", "Ads Shown"],
  },
  {
    title: "Student",
    price: "₹99/month",
    features: ["Unlimited notes", "Analytics access", "Ad-free experience"],
  },
  {
    title: "Teacher",
    price: "₹199/month",
    features: ["Sell notes", "Advanced analytics", "Priority support"],
  },
  {
    title: "Institution/",
    price: "₹5000+/month",
    features: ["Admin tools", "Custom branding", "Unlimited users"],
  },
];

const templates = [
  "Cornell Notes",
  "Bullet Journal",
  "Mind Map",
  "Flow Chart",
  "Q&A Format",
];

const ExplorePage = () => {
  return (
    <>
      <Navbar />
      <div className="explore">
        <header className="header">
          <h1>Welcome to PingNotes Explore 🧠</h1>
          <p>Organize smarter. Share faster. Learn better.</p>
        </header>

        <section className="pricing-section">
          <h2>💸 Pricing Plans</h2>
          <div className="cards">
            {plans.map((plan) => (
              <div key={plan.title} className="card">
                <h3>{plan.title}</h3>
                <p className="price">{plan.price}</p>
                <ul>
                  {plan.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="templates">
          <h2>📚 Famous Templates to Organize Your Notes</h2>
          <ul>
            {templates.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>

        <div className="upload-button">
          <button>📤 Upload Your Notes</button>
        </div>

        <footer className="footer">
          <p>
            &copy; {new Date().getFullYear()} PingNotes. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
};

export default ExplorePage;
