"use client";

import { useState, useEffect, useCallback } from "react";

/* ─── Icon Components ─── */
const ShieldIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const WifiIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

const BatteryIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
    <line x1="23" y1="13" x2="23" y2="11" />
  </svg>
);

const CpuIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
    <rect x="9" y="9" width="6" height="6" />
    <line x1="9" y1="1" x2="9" y2="4" /><line x1="15" y1="1" x2="15" y2="4" />
    <line x1="9" y1="20" x2="9" y2="23" /><line x1="15" y1="20" x2="15" y2="23" />
    <line x1="20" y1="9" x2="23" y2="9" /><line x1="20" y1="14" x2="23" y2="14" />
    <line x1="1" y1="9" x2="4" y2="9" /><line x1="1" y1="14" x2="4" y2="14" />
  </svg>
);

const ActivityIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const VolumeIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─── Notification Toast ─── */
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    alert: "border-danger bg-danger/10 text-danger",
    success: "border-success bg-success/10 text-success",
    warning: "border-warning bg-warning/10 text-warning",
  };

  return (
    <div className={`fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border px-5 py-3 shadow-2xl backdrop-blur-md animate-slide-up ${colors[type]}`}>
      {type === "alert" && <BellIcon className="h-5 w-5 flex-shrink-0" />}
      {type === "success" && <CheckIcon className="h-5 w-5 flex-shrink-0" />}
      {type === "warning" && <ActivityIcon className="h-5 w-5 flex-shrink-0" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }) {
  const map = {
    armed: { color: "bg-success/20 text-success border-success/30", label: "Armed" },
    alert: { color: "bg-danger/20 text-danger border-danger/30", label: "THEFT ALERT" },
    idle: { color: "bg-muted/20 text-muted border-muted/30", label: "Idle" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${s.color}`}>
      <span className={`h-2 w-2 rounded-full ${status === "alert" ? "bg-danger animate-ping" : status === "armed" ? "bg-success" : "bg-muted"}`} />
      {s.label}
    </span>
  );
}

/* ─── Demo Simulation Panel ─── */
function DemoPanel({ status, onArm, onTrigger, onReset }) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Live Demo Simulation</h3>
      <div className="mb-5 flex items-center justify-center">
        <div className="relative">
          <div className={`flex h-28 w-28 items-center justify-center rounded-full ${status === "alert" ? "bg-danger/20" : status === "armed" ? "bg-success/20" : "bg-zinc-800"}`}>
            {status === "alert" && <div className="absolute inset-0 rounded-full bg-danger/30 animate-pulse-ring" />}
            <ShieldIcon className={`h-12 w-12 ${status === "alert" ? "text-danger animate-shake" : status === "armed" ? "text-success animate-float" : "text-muted"}`} />
          </div>
        </div>
      </div>
      <div className="mb-5 flex justify-center"><StatusBadge status={status} /></div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {status === "idle" && (
          <button onClick={onArm} className="w-full rounded-xl bg-success/90 px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-success active:scale-95 sm:w-auto">
            Arm Device
          </button>
        )}
        {status === "armed" && (
          <button onClick={onTrigger} className="w-full rounded-xl bg-danger/90 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-danger active:scale-95 sm:w-auto">
            Simulate Theft
          </button>
        )}
        {status === "alert" && (
          <button onClick={onReset} className="w-full rounded-xl bg-zinc-700 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-zinc-600 active:scale-95 sm:w-auto">
            Reset Device
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Section Card ─── */
function SectionCard({ icon: Icon, title, children, delay = 0 }) {
  return (
    <div className={`animate-slide-up rounded-2xl border border-card-border bg-card p-5 sm:p-6 stagger-${delay}`}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

/* ─── Requirement Item ─── */
function ReqItem({ text }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-zinc-300">
      <CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
      <span>{text}</span>
    </li>
  );
}

/* ─── Demo Step ─── */
function DemoStep({ number, title, desc }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">
        {number}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function Home() {
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const handleArm = () => {
    setStatus("armed");
    notify("Device armed — monitoring for movement.", "success");
  };

  const handleTrigger = () => {
    setStatus("alert");
    notify("THEFT DETECTED! Wireless alert sent.", "alert");
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const handleReset = () => {
    setStatus("idle");
    notify("Device reset to idle state.", "warning");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Hero ── */}
      <header className="relative overflow-hidden border-b border-card-border px-4 pb-10 pt-12 sm:px-8 sm:pb-16 sm:pt-20">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
            <LockIcon className="h-3.5 w-3.5" /> Lab Exam Project
          </div>
          <h1 className="animate-slide-up text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl">
            Wireless Battery-Powered{" "}
            <span className="text-accent">Anti-Theft</span> Bag Alarm
          </h1>
          <p className="mx-auto mt-4 max-w-xl animate-slide-up stagger-1 text-sm leading-relaxed text-muted sm:text-base">
            A compact, embedded device that detects unauthorized bag movement or
            opening, triggers a local alarm, and sends a wireless alert to your
            phone — all while running on battery power.
          </p>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-8 sm:py-12">

        {/* Live Demo */}
        <DemoPanel
          status={status}
          onArm={handleArm}
          onTrigger={handleTrigger}
          onReset={handleReset}
        />

        {/* Purpose */}
        <SectionCard icon={ShieldIcon} title="Purpose" delay={1}>
          <p className="text-sm leading-relaxed text-zinc-300">
            Protect your bag or personal belongings by detecting unauthorized
            movement or opening and instantly sending a wireless alert. Ideal
            for personal anti-theft alarms, luggage security, and laptop bag
            protection.
          </p>
        </SectionCard>

        {/* Function Requirements */}
        <SectionCard icon={ActivityIcon} title="Device Function Requirements" delay={2}>
          <ul className="space-y-3">
            <ReqItem text="Detect possible theft by sensing bag movement, opening, tilt, or vibration." />
            <ReqItem text="Trigger an alarm condition when a theft event is detected." />
            <ReqItem text="Transmit a wireless alert when a theft event occurs." />
            <ReqItem text="Provide a local alert such as sound, light, or vibration." />
            <ReqItem text="Operate using battery power during the demonstration." />
            <ReqItem text="Continue working while being carried or moved." />
            <ReqItem text="Handle all sensing, decision-making, and alerting using an embedded processor." />
          </ul>
        </SectionCard>

        {/* Implementation */}
        <SectionCard icon={CpuIcon} title="Implementation" delay={3}>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: ActivityIcon, label: "Sensor", desc: "Tilt switch, accelerometer, PIR, or magnetic reed switch" },
              { icon: WifiIcon, label: "Wireless", desc: "Bluetooth, Wi-Fi, or RF module for alert transmission" },
              { icon: CpuIcon, label: "Processor", desc: "Any MCU, MPU, or SoC (e.g., ESP32, Arduino, STM32)" },
              { icon: VolumeIcon, label: "Local Alert", desc: "Buzzer, LED indicator, or vibration motor output" },
              { icon: BatteryIcon, label: "Power", desc: "Battery-powered for portability and demo use" },
              { icon: LockIcon, label: "Form Factor", desc: "Small enough to attach to or place inside a bag" },
            ].map(({ icon: I, label, desc }) => (
              <div key={label} className="flex items-start gap-3 rounded-xl bg-zinc-900/60 p-4">
                <I className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent" />
                <div>
                  <p className="text-sm font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Demo Steps */}
        <SectionCard icon={BellIcon} title="Demonstration Flow" delay={4}>
          <div className="space-y-4">
            <DemoStep number={1} title="Idle State" desc="Device is powered on, bag is undisturbed — system monitors quietly." />
            <DemoStep number={2} title="Theft Detection" desc="Sensor detects movement, tilt, or bag opening event." />
            <DemoStep number={3} title="Local Alarm" desc="Buzzer sounds and/or LED flashes to alert nearby people." />
            <DemoStep number={4} title="Wireless Alert" desc="Device transmits a theft notification via Bluetooth/Wi-Fi/RF." />
            <DemoStep number={5} title="Battery Operation" desc="Full operation on battery power — no external power needed." />
            <DemoStep number={6} title="In-Motion Test" desc="Device correctly functions while being carried or moved." />
          </div>
        </SectionCard>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-card-border px-4 py-6 text-center text-xs text-muted sm:px-8">
        MES Prelim Lab Exam &middot; Wireless Anti-Theft Bag Alarm
      </footer>
    </div>
  );
}
