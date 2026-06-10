import React, { useState, useEffect } from "react";
import { NOTIF_TYPES } from "../ui/NotificationTypes";
import {
  ToastWrapper,
  ToastIconBox,
  ToastContent,
  ToastTitle,
  ToastBody,
  ToastProgressBar,
} from "../ui/NotificationBell";

const VISIBLE_MS = 4000;
const CLOSE_ANIM_MS = 350;

function NotificationToast({ notification, onDone }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const closeTimer = setTimeout(() => {
      setClosing(true);
      setTimeout(onDone, CLOSE_ANIM_MS);
    }, VISIBLE_MS);

    return () => clearTimeout(closeTimer);
  }, [onDone]);

  const cfg = NOTIF_TYPES[notification.type];

  return (
    <ToastWrapper $closing={closing}>
      <ToastIconBox $color={notification.iconBg ?? cfg?.iconBg}>
        {notification.icon ?? (cfg?.Icon
          ? <cfg.Icon size={13} color={cfg.iconColor} />
          : "🔔"
        )}
      </ToastIconBox>
      <ToastContent>
        <ToastTitle>{notification.title}</ToastTitle>
        <ToastBody>{notification.body}</ToastBody>
      </ToastContent>
      <ToastProgressBar $duration={VISIBLE_MS} $accentColor={cfg?.accentColor} />
    </ToastWrapper>
  );
}

export default NotificationToast;