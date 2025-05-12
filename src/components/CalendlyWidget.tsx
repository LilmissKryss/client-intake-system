"use client";

import { useEffect } from "react";
import Script from "next/script";
// Import types for global augmentation
import "../types/global";

export default function CalendlyWidget() {
  // To avoid issues with Calendly widget not loading properly
  useEffect(() => {
    // Check if the Calendly script is already loaded
    if (typeof window !== "undefined" && window.Calendly) {
      window.Calendly.initInlineWidget({
        url: "https://calendly.com/krisdaangel?hide_event_type_details=1&hide_gdpr_banner=1",
        parentElement: document.getElementById("calendly-inline-widget"),
        prefill: {},
        utm: {},
      });

      // Apply custom styling via CSS
      setTimeout(() => {
        const calendarFrame = document.querySelector(
          'iframe[src*="calendly.com"]'
        );
        if (calendarFrame) {
          // Add a class to the iframe for styling
          calendarFrame.classList.add("calendly-custom-theme");

          // Create a style element for custom CSS
          const styleEl = document.createElement("style");
          styleEl.innerHTML = `
            .calendly-custom-theme {
              --calendly-primary-color: #3b82f6 !important; /* blue-500 */
              --calendly-text-color: #1e3a8a !important; /* blue-900 */
            }

            /* Set the Calendly widget height */
            .calendly-inline-widget {
              min-height: 350px !important;
            }

            /* Reduce padding and margins */
            .calendly-inline-widget .calendar-view {
              padding: 0 !important;
            }

            /* Make the date picker more compact */
            .calendly-inline-widget .date-picker-day {
              padding: 4px !important;
              font-size: 12px !important;
            }

            /* Reduce spacing in the time slots */
            .calendly-inline-widget .spots-available {
              font-size: 10px !important;
            }

            /* Hide unnecessary elements */
            .calendly-inline-widget .calendly-powered-by {
              display: none !important;
            }
          `;
          document.head.appendChild(styleEl);
        }
      }, 1000); // Small delay to ensure the iframe is loaded
    }
  }, []);

  return (
    <>
      {/* Load Calendly Script */}
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== "undefined" && window.Calendly) {
            window.Calendly.initInlineWidget({
              url: "https://calendly.com/krisdaangel?hide_event_type_details=1&hide_gdpr_banner=1",
              parentElement: document.getElementById("calendly-inline-widget"),
              prefill: {},
              utm: {},
            });

            // Apply custom styling via CSS since the styles property isn't supported
            const calendarFrame = document.querySelector(
              'iframe[src*="calendly.com"]'
            );
            if (calendarFrame) {
              // Add a class to the iframe for styling
              calendarFrame.classList.add("calendly-custom-theme");

              // Create a style element for custom CSS
              const styleEl = document.createElement("style");
              styleEl.innerHTML = `
                .calendly-custom-theme {
                  --calendly-primary-color: #3b82f6 !important; /* blue-500 */
                  --calendly-text-color: #1e3a8a !important; /* blue-900 */
                }

                /* Set the Calendly widget height */
                .calendly-inline-widget {
                  min-height: 350px !important;
                }

                /* Reduce padding and margins */
                .calendly-inline-widget .calendar-view {
                  padding: 0 !important;
                }

                /* Make the date picker more compact */
                .calendly-inline-widget .date-picker-day {
                  padding: 4px !important;
                  font-size: 12px !important;
                }

                /* Reduce spacing in the time slots */
                .calendly-inline-widget .spots-available {
                  font-size: 10px !important;
                }

                /* Hide unnecessary elements */
                .calendly-inline-widget .calendly-powered-by {
                  display: none !important;
                }
              `;
              document.head.appendChild(styleEl);
            }
          }
        }}
      />

      {/* Calendly inline widget container */}
      <div
        id="calendly-inline-widget"
        style={{
          minWidth: "320px",
          height: "350px",
          margin: "0 auto",
          maxWidth: "100%",
        }}
        className="rounded-lg overflow-hidden"
      />
    </>
  );
}
