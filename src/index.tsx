import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as sentry from "@sentry/react";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

sentry.init({
  dsn: process.env.REACT_APP_SENTRY_CDN,
  tracesSampleRate: 1.0,
  integrations: [new sentry.BrowserTracing()],
});

const FallbackComponent = () => {
  return (
    <>
      <div
        style={{
          width: "100px",
          height: "100px",
          background: "red",
          position: "absolute",
          zIndex: "100",
        }}
      >
        An error has occurred
      </div>
    </>
  );
};

const Test = () => {
  const handleClick = () => {
    try {
      throw new Error("Test Error！");
    } catch (error: any) {
      // 捕獲錯誤並發送到 Sentry
      sentry.configureScope((scope) => {
        sentry.setContext("Error-Test", error);
        sentry.setTag("Error-Test-Tags", "Error-Test");
        sentry.captureException(error);
      });
      console.log(error);

      sentry.captureException(error);
      sentry.showReportDialog({ eventId: sentry.lastEventId() });
    }
  };
  return (
    <>
      <button onClick={handleClick}>Switch</button>
    </>
  );
};

const myFallback = <FallbackComponent />;

root.render(
  <React.StrictMode>
    <sentry.ErrorBoundary fallback={myFallback}>
      <Test />

      <App />
    </sentry.ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
