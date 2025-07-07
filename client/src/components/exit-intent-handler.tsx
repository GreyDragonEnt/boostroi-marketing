import { useState, useEffect } from "react";
import LeadCaptureModal from "./lead-capture-modal";

export default function ExitIntentHandler() {
  const [showExitModal, setShowExitModal] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    let mouseLeaveTimer: NodeJS.Timeout;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the viewport
      if (e.clientY <= 0 && !hasTriggered) {
        mouseLeaveTimer = setTimeout(() => {
          setShowExitModal(true);
          setHasTriggered(true);
          // Store in session storage to prevent showing again this session
          sessionStorage.setItem('exitIntentShown', 'true');
        }, 100);
      }
    };

    const handleMouseEnter = () => {
      if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer);
      }
    };

    // Check if already shown this session
    const alreadyShown = sessionStorage.getItem('exitIntentShown');
    if (alreadyShown) {
      setHasTriggered(true);
    }

    // Add delay before enabling exit intent (give user time to read)
    const enableTimer = setTimeout(() => {
      if (!alreadyShown) {
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
      }
    }, 10000); // Wait 10 seconds before enabling

    return () => {
      clearTimeout(enableTimer);
      clearTimeout(mouseLeaveTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [hasTriggered]);

  return (
    <LeadCaptureModal
      isOpen={showExitModal}
      onClose={() => setShowExitModal(false)}
      trigger="exit-intent"
      leadMagnet="audit-checklist"
    />
  );
}