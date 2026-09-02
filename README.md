# AI-Powered Queue & Crowd Prediction System 🧠📊

**🌟 Live Demo:** [https://ai-queue-crowd-prediction-system.vercel.app/](https://ai-queue-crowd-prediction-system.vercel.app/)

An advanced, fully browser-based Computer Vision application designed to solve the problem of unpredictable queues and overcrowding in public-facing organizations like service centers, hospitals, banks, and government offices.

This project tackles **Problem Statement 2: AI-Powered Queue & Crowd Prediction System** by leveraging edge AI (TensorFlow.js) to monitor camera feeds, estimate wait times, predict queue buildups, and automatically recommend operational actions—all in real-time.

![System Overview UI Preview](https://img.shields.io/badge/UI-Modern_Claymorphism-3b82f6?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech-React_|_Vite_|_TensorFlow.js-8b5cf6?style=for-the-badge)

## 🚀 Key Features (Mandatory MVP & Bonus Achieved)

1. **Real-time Queue Detection:** Analyzes uploaded video or image feeds to detect individuals in designated queue regions.
2. **Current Status Estimation:** Calculates exactly how many people are in line and dynamically estimates the waiting time based on configurable service rates.
3. **Future Prediction:** Uses historical queue data and current trends to plot predictive charts, forecasting if a queue is likely to exceed capacity in the near future.
4. **Smart Resource Recommendations:** Automatically issues operational alerts (e.g., *"Open an additional counter or redirect customers to Counter 2"*).
5. **Crowd Density Alerts:** Measures the overall utilization of the room area and issues "Critical Density" warnings if the area becomes hazardously overcrowded.

## 🛠️ Technology Stack

* **Frontend Framework:** React (Vite)
* **Computer Vision Model:** TensorFlow.js (`coco-ssd` Object Detection)
* **Styling & UI:** Pure Vanilla CSS utilizing a premium, modern "Claymorphism" and Glassmorphism design system.
* **Data Visualization:** Recharts for predictive queue buildup graphs.
* **Icons:** Lucide React

## 💡 Why This Approach?

* **Privacy First (Edge AI):** All video processing and AI inference happen **locally inside the user's browser**. No video feeds or images are ever uploaded to a remote server, ensuring complete data privacy for monitored spaces.
* **Highly Responsive:** By eliminating server round-trips, the detection and analysis occur at high framerates directly on the client machine.
* **No Backend Required:** The application can be hosted entirely as a static site (e.g., on GitHub Pages, Vercel, or Netlify), drastically reducing hosting costs and complexity.

## 📱 Mobile Optimized & Themeable
The interface is fully responsive, adapting its grid layout, sidebars, and interactive elements seamlessly for mobile, tablet, and desktop viewing. It also features a built-in Dark/Light mode toggle for optimal viewing in any environment.

## ⚙️ How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/ShubhamAgre28/AI-Powered-Queue-Crowd-Prediction-System-.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AI-Powered-Queue-Crowd-Prediction-System-
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`).

---
*Built to optimize resource allocation, enhance customer experience, and streamline operational efficiency.*
