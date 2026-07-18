import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { notificationApi, useSubscribeToPushMutation } from "../api/notificationApi";

interface NotificationSocketPayload {
  message: string;
  type: string;
  module: string;
  timestamp: string;
}

// Helper to convert base64 VAPID public key to Uint8Array for PushManager
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const NotificationInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [subscribeToPush] = useSubscribeToPushMutation();
  const socketRef = useRef<Socket | null>(null);

  // 1. Socket.IO Real-time Connection Setup
  useEffect(() => {
    if (!user || !user.tenant?.id) {
      // Disconnect socket if user logs out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";
    // Strip trailing route to get the base socket server url
    const socketUrl = apiUrl.replace(/\/api\/v1\/?$/, "");

    const socket = io(socketUrl, {
      query: { tenantId: user.tenant.id },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected for real-time notifications");
    });

    // Listen for live alerts
    socket.on("notification", (data: NotificationSocketPayload) => {
      // Invalidate cache to auto-reload lists/counts
      dispatch(notificationApi.util.invalidateTags(["Notification"]));

      // Show responsive interactive in-app toast
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-black/5 p-4 border border-slate-100`}
          >
            <div className="flex-1 w-0">
              <div className="flex items-start">
                <div className="shrink-0 pt-0.5">
                  <span className="text-xl">🔔</span>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                    {data.module} Alert
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800 leading-normal">
                    {data.message}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400 font-mono">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="ml-4 shrink-0 flex">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-2 flex items-center justify-center text-xs font-bold text-slate-400 hover:text-slate-600 focus:outline-none transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 6000 }
      );
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, dispatch]);

  // 2. Browser Push Service worker setup
  useEffect(() => {
    if (!user) return;

    const setupPushNotifications = async () => {
      // Check for browser support
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        console.warn("Service workers or Push notifications are not supported by this browser.");
        return;
      }

      try {
        // Register sw.js service worker
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        console.log("Service Worker registered successfully:", registration);

        // Check permission state
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          console.warn("Notification permissions denied.");
          return;
        }

        const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || "BKJ9AmYmhZRofw_eMVmLo1RSiYMo04QzODpQDJ6TMPMx9i-qfzuuon3iTHyAZKYvUpkHmifRepNdg6c58Fih8wI";
        if (!vapidPublicKey) {
          console.warn("VITE_VAPID_PUBLIC_KEY not set in environment.");
          return;
        }

        // Get active subscription
        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          // Register a new push subscription token
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
          });
        }

        // Parse key buffers to push raw payloads
        const p256dh = subscription.getKey("p256dh");
        const auth = subscription.getKey("auth");

        const subscriptionPayload = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: p256dh ? btoa(String.fromCharCode(...new Uint8Array(p256dh))) : "",
            auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : "",
          },
        };

        // Post push credentials to the backend
        await subscribeToPush(subscriptionPayload).unwrap();
        console.log("Browser push notification subscription synchronized with backend.");
      } catch (err) {
        console.error("Failed to register browser push notifications:", err);
      }
    };

    setupPushNotifications();
  }, [user, subscribeToPush]);

  return <>{children}</>;
};
