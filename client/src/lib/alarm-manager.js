// Global Web Audio Engine & Alarm Manager for VediQ
const DAY_NAMES = { 0: "Sun", 1: "Mon", 2: "Tue", 3: "Wed", 4: "Thu", 5: "Fri", 6: "Sat" };

export function createToneBeep(id, ctx, volScale = 1.0) {
  const now = ctx.currentTime;

  function beep(start, freq, duration, type = "square", gainVal = 0.4) {
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(gainVal * volScale, start + 0.01);
      gain.gain.linearRampToValueAtTime(0, start + duration);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    } catch (_) {}
  }

  switch (id) {
    case "classic_beep": {
      for (let i = 0; i < 3; i++) beep(now + i * 0.28, 880 + i * 60, 0.18, "square");
      return 1.0;
    }
    case "gentle_rise": {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(660, now + 0.9);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4 * volScale, now + 0.2);
        gain.gain.linearRampToValueAtTime(0, now + 0.9);
        osc.start(now); osc.stop(now + 1.0);
      } catch (_) {}
      return 1.1;
    }
    case "digital_pulse": {
      for (let i = 0; i < 6; i++) beep(now + i * 0.12, 1046, 0.07, "square", 0.35);
      return 0.9;
    }
    case "zen_bell": {
      try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(523, now);
        gain.gain.setValueAtTime(0.5 * volScale, now);
        gain.gain.exponentialRampToValueAtTime(0.001 * volScale, now + 1.8);
        osc.start(now); osc.stop(now + 2.0);
      } catch (_) {}
      return 2.2;
    }
    case "school_bell": {
      for (let i = 0; i < 4; i++) {
        beep(now + i * 0.22, i % 2 === 0 ? 830 : 1050, 0.16, "square");
      }
      return 1.1;
    }
    case "rooster": {
      const freqs = [330, 415, 523, 659, 784];
      freqs.forEach((f, i) => beep(now + i * 0.18, f, 0.15, "sawtooth", 0.25));
      return 1.1;
    }
    default:
      beep(now, 880, 0.2, "square");
      return 0.5;
  }
}

export function buildAlarmSound(tone) {
  let ctx = null;
  let loopHandle = null;
  let audio = null;
  let volScale = 1.0;

  function start() {
    try {
      if (tone?.type === "custom" && tone.dataUrl) {
        audio = new Audio(tone.dataUrl);
        audio.loop = true;
        audio.volume = Math.min(1.0, 0.9 * volScale);
        audio.play().catch(() => {});
      } else {
        const id = tone?.id ?? "classic_beep";
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        function loop() {
          const dur = createToneBeep(id, ctx, volScale);
          loopHandle = setTimeout(loop, dur * 1000 + 200);
        }
        loop();
      }
    } catch (e) {
      console.warn("Audio playback start error:", e);
    }
  }

  function stop() {
    clearTimeout(loopHandle);
    if (audio) {
      audio.pause();
      audio = null;
    }
    try { ctx?.close(); } catch (_) {}
    ctx = null;
  }

  function setVolumeScale(scale) {
    volScale = scale;
    if (audio) {
      audio.volume = Math.min(1.0, 0.9 * scale);
    }
  }

  return { start, stop, setVolumeScale };
}

export function playGlobalAlarmSound(tone) {
  stopGlobalAlarmSound();
  const snd = buildAlarmSound(tone);
  snd.start();
  window.activeAlarmSound = snd;
  return snd;
}

export function stopGlobalAlarmSound() {
  try {
    if (window.activeAlarmSound) {
      window.activeAlarmSound.stop();
      window.activeAlarmSound = null;
    }
  } catch (_) {}
}

export function checkGlobalAlarms(navigate) {
  if (typeof window === "undefined") return;

  try {
    const raw = localStorage.getItem("VediQ_alarms_v2");
    if (!raw) return;
    const alarms = JSON.parse(raw);
    if (!Array.isArray(alarms) || alarms.length === 0) return;

    const now = new Date();
    const todayDay = DAY_NAMES[now.getDay()];
    const nowH = now.getHours();
    const nowM = now.getMinutes();

    // Check if an alarm is ALREADY ringing
    const activeRingingRaw = localStorage.getItem("VediQ_active_ringing_alarm");
    if (activeRingingRaw) {
      // If alarm is ringing and we are on another page, navigate to /app/alarms
      if (window.location.pathname !== "/app/alarms" && window.location.pathname !== "/qr-dismiss") {
        if (navigate) navigate({ to: "/app/alarms" });
      }
      return;
    }

    const minuteKey = `${now.toDateString()}_${nowH}_${nowM}`;

    for (const alarm of alarms) {
      if (!alarm.enabled) continue;
      if (Array.isArray(alarm.days) && !alarm.days.includes(todayDay)) continue;

      if (alarm.hour === nowH && alarm.minute === nowM) {
        // Prevent repeated triggers in the same minute
        const triggeredKey = `VediQ_alarm_triggered_${alarm.id}`;
        if (sessionStorage.getItem(triggeredKey) === minuteKey) continue;

        sessionStorage.setItem(triggeredKey, minuteKey);
        localStorage.setItem("VediQ_active_ringing_alarm", JSON.stringify(alarm));

        // Start ringing sound globally
        playGlobalAlarmSound(alarm.tone);

        // Notify and redirect to Alarms page!
        window.dispatchEvent(new CustomEvent("VediQ_alarm_triggered", { detail: alarm }));
        window.dispatchEvent(new StorageEvent("storage", { key: "VediQ_active_ringing_alarm" }));

        if (window.location.pathname !== "/app/alarms") {
          if (navigate) navigate({ to: "/app/alarms" });
        }
        break;
      }
    }
  } catch (err) {
    console.error("Global alarm check error:", err);
  }
}
