/**
 * Трекер юзер-тестов. Вставляется в прототип (директива делает это сама).
 * Пишет события по экранам/элементам — без пиксельных координат и без ввода пользователя.
 *
 * Конфиг (любой из):
 *   - <script src=".../track.js" data-endpoint="https://IP:порт/collect"></script>
 *   - window.__UT_ENDPOINT__ = "https://IP:порт/collect" до подключения скрипта
 *
 * События: session_start, pageview, click, action_result, screen_time, session_end.
 */
(function () {
  "use strict";

  var endpoint =
    (document.currentScript && document.currentScript.dataset.endpoint) ||
    window.__UT_ENDPOINT__ ||
    "/collect";

  // ── Сессия ───────────────────────────────────────────────
  function uid() {
    return (
      Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10)
    );
  }
  var sessionId;
  try {
    sessionId = sessionStorage.getItem("ut_sid");
    if (!sessionId) {
      sessionId = uid();
      sessionStorage.setItem("ut_sid", sessionId);
    }
  } catch {
    sessionId = uid();
  }
  // постоянный id тестировщика (между сессиями) — чтобы считать УНИКАЛЬНЫХ людей, а не сессии
  var visitorId;
  try {
    visitorId = localStorage.getItem("ut_vid");
    if (!visitorId) {
      visitorId = uid();
      localStorage.setItem("ut_vid", visitorId);
    }
  } catch {
    visitorId = sessionId;
  }

  // ── Метка U-теста ────────────────────────────────────────
  // Ссылка вида .../prototype?ut_task=<id-сценария> привязывает весь визит
  // к конкретному сценарию. Держим метку весь визит (даже после смены маршрута).
  var task = null;
  var actor = "unknown";
  try {
    var q = new URLSearchParams(location.search);
    var fromUrl = q.get("ut_task");
    if (fromUrl) {
      task = fromUrl;
      sessionStorage.setItem("ut_task", task);
    } else {
      task = sessionStorage.getItem("ut_task");
    }
    var actorFromUrl = q.get("ut_actor");
    if (actorFromUrl === "agent" || actorFromUrl === "human" || actorFromUrl === "internal") {
      actor = actorFromUrl;
      sessionStorage.setItem("ut_actor", actor);
    } else {
      var storedActor = sessionStorage.getItem("ut_actor");
      if (storedActor === "agent" || storedActor === "human" || storedActor === "internal") actor = storedActor;
    }
  } catch {
    task = null;
    actor = "unknown";
  }

  // ── Очередь и отправка ───────────────────────────────────
  var queue = [];
  var FLUSH_MS = 4000;
  var FLUSH_MAX = 20;

  function now() {
    return new Date().toISOString();
  }

  function push(type, extra) {
    var ev = {
      ts: now(),
      sessionId: sessionId,
      visitorId: visitorId,
      type: type,
      screen: currentScreen(),
      actor: actor,
    };
    if (task) ev.task = task;
    if (extra) for (var k in extra) ev[k] = extra[k];
    queue.push(ev);
    if (queue.length >= FLUSH_MAX) flush();
  }

  function flush(useBeacon) {
    if (!queue.length) return;
    var batch = queue.splice(0, queue.length);
    var body = JSON.stringify({ events: batch });
    try {
      if (useBeacon && navigator.sendBeacon) {
        navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      } else {
        fetch(endpoint, {
          method: "POST",
          headers: /ngrok/i.test(endpoint)
            ? { "Content-Type": "application/json", "ngrok-skip-browser-warning": "1" }
            : { "Content-Type": "application/json" },
          body: body,
          keepalive: true,
        }).catch(function () {
          /* тест продолжается даже если сбор недоступен */
        });
      }
      } catch {
      /* не мешаем прототипу */
    }
  }

  // ── Ключ экрана ──────────────────────────────────────────
  // ПРАВКА ПРОЕКТА поверх бандла dashboard/tracker/track.js. При обновлении
  // бандла перенести её заново — иначе воронки рассыпятся (см. ниже).
  //
  // 1. Префикс сборки. Прототип отдаётся с /learn/, но экран — это адрес
  //    внутри приложения, а не адрес хостинга. Иначе переезд на другой путь
  //    обнуляет накопленную историю.
  // 2. Параметризованные адреса. Продукт живёт на /material/<id>,
  //    /trajectory/<id> и /player/<id>/<n>. Без свёртки в шаблон каждый
  //    материал становится отдельным «экраном», и воронка распадается
  //    на визиты по одному. Кадры-состояния из реестра (partner-only,
  //    started, gate) — статичные адреса, их сворачивать нельзя.
  var UT_BASE = String(window.__UT_BASE__ || "/").replace(/\/$/, "");

  function currentScreen() {
    var path = location.pathname || "/";
    if (UT_BASE && path.indexOf(UT_BASE) === 0) path = path.slice(UT_BASE.length) || "/";
    return path
      .replace(/^\/material\/(?!partner-only$)[^/]+$/, "/material/:id")
      .replace(/^\/trajectory\/(?!started$|gate$)[^/]+$/, "/trajectory/:id")
      .replace(/^\/player\/[^/]+\/[^/]+$/, "/player/:trajectoryId/:index");
  }

  // ── Время на экране ──────────────────────────────────────
  var screenEnteredAt = Date.now();
  var lastScreen = currentScreen();

  function leaveScreen() {
    var ms = Date.now() - screenEnteredAt;
    if (ms > 0) push("screen_time", { screen: lastScreen, ms: ms });
  }

  function enterScreen() {
    screenEnteredAt = Date.now();
    lastScreen = currentScreen();
    push("pageview", { screen: lastScreen });
  }

  // ── Переходы (history API + popstate) ────────────────────
  function onRouteChange() {
    var next = currentScreen();
    if (next === lastScreen) return;
    leaveScreen();
    enterScreen();
  }

  ["pushState", "replaceState"].forEach(function (m) {
    var orig = history[m];
    if (typeof orig === "function") {
      history[m] = function () {
        var r = orig.apply(this, arguments);
        onRouteChange();
        return r;
      };
    }
  });
  window.addEventListener("popstate", onRouteChange);

  // ── Клики (по элементу, не по пикселям) ──────────────────
  var ACTION_WINDOW_MS = 3000;
  var actionSequence = 0;
  var pendingAction = null;

  function describe(el) {
    if (!el) return "unknown";
    // приоритет — явная разметка data-track, затем роль/текст
    var dt = el.closest && el.closest("[data-track]");
    if (dt) return dt.getAttribute("data-track");
    var t = el.closest && el.closest("button, a, [role='button'], input, textarea, select, [contenteditable]");
    if (t) {
      var label =
        (t.getAttribute && (t.getAttribute("aria-label") || t.name)) ||
        (t.textContent || "").trim().slice(0, 40);
      return (t.tagName.toLowerCase() + (label ? ": " + label : "")).trim();
    }
    return el.tagName ? el.tagName.toLowerCase() : "unknown";
  }

  function controlBehavior(el) {
    var control = el && el.closest && el.closest("input, textarea, select, [contenteditable]");
    if (!control) return null;
    if (control.hasAttribute("contenteditable")) return "contenteditable";
    return control.tagName.toLowerCase();
  }

  // выглядел ли клик «по интерактивному» (для честного dead-клика на стороне анализа)
  function isInteractive(el) {
    return !!(
      el && el.closest &&
      el.closest("button, a, [role='button'], input, select, textarea, label, [contenteditable], [data-track], [onclick], [tabindex]")
    );
  }

  function reportActionResult(result) {
    if (!pendingAction || pendingAction.reported) return;
    if (Date.now() - pendingAction.at > ACTION_WINDOW_MS) return;
    pendingAction.reported = true;
    push("action_result", {
      screen: currentScreen(),
      actionId: pendingAction.id,
      target: pendingAction.target,
      result: result,
    });
  }

  document.addEventListener(
    "click",
    function (e) {
      var target = describe(e.target);
      var actionId = sessionId + "-" + (++actionSequence);
      pendingAction = { id: actionId, target: target, at: Date.now(), reported: false };
      push("click", {
        screen: currentScreen(),
        target: target,
        interactive: isInteractive(e.target),
        control: controlBehavior(e.target),
        actionId: actionId,
      });
    },
    true
  );

  document.addEventListener("invalid", function () {
    reportActionResult("validation");
  }, true);

  var actionObserver = new MutationObserver(function (mutations) {
    if (!pendingAction || pendingAction.reported) return;
    var changed = mutations.some(function (mutation) {
      if (mutation.type === "childList") return mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0;
      if (mutation.type === "characterData") return true;
      return mutation.type === "attributes";
    });
    if (changed) reportActionResult("ui-change");
  });
  actionObserver.observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["aria-expanded", "aria-invalid", "aria-pressed", "aria-selected", "data-state", "data-status", "disabled", "hidden"],
  });

  // ── Жизненный цикл ───────────────────────────────────────
  window.addEventListener("load", function () {
    push("session_start", { ua: navigator.userAgent });
    enterScreen();
  });

  window.addEventListener("error", function (event) {
    push("runtime_error", {
      message: String((event && event.message) || "Runtime error").slice(0, 240),
      source: event && event.filename ? String(event.filename).split("/").pop() : null,
    });
  });

  window.addEventListener("unhandledrejection", function (event) {
    push("runtime_error", {
      message: String((event && event.reason && (event.reason.message || event.reason)) || "Unhandled promise rejection").slice(0, 240),
      source: "unhandledrejection",
    });
  });

  setInterval(function () {
    flush(false);
  }, FLUSH_MS);

  window.addEventListener("pagehide", function () {
    leaveScreen();
    push("session_end", {});
    flush(true);
  });
})();
