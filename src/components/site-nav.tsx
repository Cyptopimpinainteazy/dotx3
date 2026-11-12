import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  NAV,
  NAV_CTA,
  groupContainsPath,
  isCurrentPage,
  type NavGroup,
  type NavItem,
} from "@/lib/site-nav";

const HOVER_CLOSE_MS = 160;

/** One menu entry. Route items use the router; files and external links are plain anchors. */
function NavEntry({
  item,
  path,
  onNavigate,
  compact,
}: {
  item: NavItem;
  path: string;
  onNavigate: () => void;
  compact?: boolean;
}) {
  const current = isCurrentPage(item, path);
  const cls = `nav-entry group/entry flex items-start gap-3 rounded-lg px-3 ${
    compact ? "py-2" : "py-2.5"
  } outline-none hover:bg-surface-2 focus-visible:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary/60 ${
    current ? "bg-surface-2" : ""
  }`;
  const body = (
    <span className="min-w-0 flex-1">
      <span
        className={`flex items-center gap-1.5 text-sm font-semibold ${
          current ? "text-primary" : "text-fg group-hover/entry:text-primary"
        }`}
      >
        {item.label}
        {item.kind === "external" ? (
          <ArrowUpRight className="size-3.5 shrink-0 text-muted" aria-hidden="true" />
        ) : null}
        {item.kind === "route" && item.hash ? (
          <span className="font-mono text-[0.7rem] font-normal text-muted">#</span>
        ) : null}
      </span>
      <span className="mt-0.5 block text-xs leading-snug text-muted">{item.description}</span>
    </span>
  );

  if (item.kind === "route") {
    return (
      <Link
        to={item.to}
        hash={item.hash}
        onClick={onNavigate}
        className={cls}
        aria-current={current ? "page" : undefined}
        data-nav-entry
      >
        {body}
      </Link>
    );
  }
  if (item.kind === "file") {
    return (
      <a href={item.href} onClick={onNavigate} className={cls} data-nav-entry>
        {body}
      </a>
    );
  }
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      className={cls}
      data-nav-entry
    >
      {body}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function focusEntry(panel: HTMLElement | null, which: "first" | "last" | 1 | -1) {
  if (!panel) return;
  const entries = Array.from(panel.querySelectorAll<HTMLElement>("[data-nav-entry]"));
  if (!entries.length) return;
  if (which === "first") return entries[0].focus();
  if (which === "last") return entries[entries.length - 1].focus();
  const at = entries.indexOf(document.activeElement as HTMLElement);
  entries[(at + which + entries.length) % entries.length].focus();
}

/** A desktop dropdown: a disclosure button and a panel of links. */
function DesktopGroup({
  group,
  index,
  open,
  path,
  onOpen,
  onClose,
}: {
  group: NavGroup;
  index: number;
  open: boolean;
  path: string;
  onOpen: () => void;
  onClose: (opts?: { returnFocus?: boolean }) => void;
}) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const active = groupContainsPath(group, path);
  const wide = group.items.length > 6;
  const alignEnd = index >= NAV.length - 2;

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };
  useEffect(() => cancelClose, []);

  useEffect(() => {
    if (open && pendingFocus.current) {
      focusEntry(panelRef.current, pendingFocus.current);
      pendingFocus.current = null;
    }
  }, [open]);

  const openAndFocus = (which: "first" | "last") => {
    pendingFocus.current = which;
    if (open) {
      focusEntry(panelRef.current, which);
      pendingFocus.current = null;
    } else onOpen();
  };

  return (
    <li
      className="relative"
      onPointerEnter={(e) => {
        if (e.pointerType !== "mouse") return;
        cancelClose();
        onOpen();
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse") return;
        cancelClose();
        closeTimer.current = setTimeout(() => onClose(), HOVER_CLOSE_MS);
      }}
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) onClose();
      }}
      onKeyDown={(e) => {
        if (!open) return;
        if (e.key === "Escape") {
          e.preventDefault();
          onClose({ returnFocus: true });
          triggerRef.current?.focus();
        } else if (panelRef.current?.contains(document.activeElement)) {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            focusEntry(panelRef.current, 1);
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            focusEntry(panelRef.current, -1);
          } else if (e.key === "Home") {
            e.preventDefault();
            focusEntry(panelRef.current, "first");
          } else if (e.key === "End") {
            e.preventDefault();
            focusEntry(panelRef.current, "last");
          }
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? onClose() : onOpen())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            openAndFocus("first");
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            openAndFocus("last");
          }
        }}
        className={`tap flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
          open || active ? "text-primary" : "text-muted hover:text-fg"
        }`}
      >
        {group.label}
        <ChevronDown
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {active ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 -bottom-[17px] left-3 h-0.5 rounded-full bg-primary"
        />
      ) : null}

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className={`nav-panel absolute top-full z-50 pt-3 ${alignEnd ? "right-0" : "left-0"}`}
      >
        <div
          className={`rounded-2xl border border-border bg-surface p-2 shadow-2xl shadow-black/60 ${
            wide ? "w-[36rem]" : "w-[22rem]"
          }`}
        >
          <p className="border-b border-border px-3 pt-2 pb-3 text-xs leading-snug text-muted">
            <span className="font-display text-sm tracking-wide text-accent">{group.label}</span>
            <span className="mt-1 block">{group.summary}</span>
          </p>
          <ul className={`mt-1 grid gap-0.5 ${wide ? "grid-cols-2" : ""}`}>
            {group.items.map((item) => (
              <li key={`${item.label}-${item.kind}`}>
                <NavEntry item={item} path={path} onNavigate={() => onClose()} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

/** The mobile menu: every group as an accordion section. */
function MobileMenu({ path, onNavigate }: { path: string; onNavigate: () => void }) {
  const [expanded, setExpanded] = useState<string | null>(
    () => NAV.find((g) => groupContainsPath(g, path))?.id ?? NAV[0].id,
  );
  return (
    <div className="max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-surface p-2 shadow-2xl shadow-black/60">
      <ul className="grid gap-1">
        {NAV.map((group) => {
          const isOpen = expanded === group.id;
          const panelId = `mobile-nav-${group.id}`;
          return (
            <li key={group.id} className="rounded-xl">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setExpanded(isOpen ? null : group.id)}
                className={`tap flex min-h-12 w-full items-center justify-between rounded-xl px-3 text-left font-display text-base ${
                  isOpen || groupContainsPath(group, path) ? "text-primary" : "text-fg"
                }`}
              >
                {group.label}
                <ChevronDown
                  className={`size-5 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div id={panelId} hidden={!isOpen} className="pb-2">
                <ul className="grid gap-0.5 border-l border-border pl-2 ml-3">
                  {group.items.map((item) => (
                    <li key={`${item.label}-${item.kind}`}>
                      <NavEntry item={item} path={path} onNavigate={onNavigate} compact />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
      <Link
        to={NAV_CTA.to}
        onClick={onNavigate}
        className="tap mt-2 flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-bg hover:brightness-110"
      >
        {NAV_CTA.label}
      </Link>
    </div>
  );
}

const HASH_SETTLE_MS = 2500;

/**
 * Keep a section jump on target while late content (3D hero, video, lazy panels) changes the
 * page height above it. Re-aligns on each layout change for a short window, and stops the
 * moment the visitor scrolls, types or touches, so it never fights them.
 */
function useHashSettle(path: string, hash: string) {
  useEffect(() => {
    if (!hash || typeof ResizeObserver === "undefined") return;
    const target = () => document.getElementById(decodeURIComponent(hash));
    let done = false;
    const stop = () => {
      done = true;
      observer.disconnect();
      clearTimeout(timer);
      for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"] as const) {
        window.removeEventListener(ev, stop);
      }
    };
    const align = () => {
      const el = target();
      if (done || !el) return;
      const top = el.getBoundingClientRect().top;
      const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      if (Math.abs(top - margin) > 4) el.scrollIntoView({ block: "start", behavior: "instant" });
    };
    const observer = new ResizeObserver(align);
    observer.observe(document.body);
    const timer = setTimeout(stop, HASH_SETTLE_MS);
    for (const ev of ["wheel", "touchstart", "keydown", "pointerdown"] as const) {
      window.addEventListener(ev, stop, { passive: true });
    }
    return stop;
  }, [path, hash]);
}

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hash = useRouterState({ select: (s) => s.location.hash });
  useHashSettle(path, hash);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const closeAll = useCallback(() => {
    setOpenId(null);
    setMobileOpen(false);
  }, []);

  // Close on route change (covers back/forward as well as clicks).
  useEffect(() => {
    closeAll();
  }, [path, closeAll]);

  // Close on a click outside the header, and on Escape for the mobile menu.
  useEffect(() => {
    if (!openId && !mobileOpen) return;
    const onPointer = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeAll();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [openId, mobileOpen, closeAll]);

  return (
    <header
      ref={navRef}
      data-copy-exclude
      className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur"
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-bg"
      >
        Skip to content
      </a>
      <nav
        aria-label="Main"
        className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4"
      >
        <Link
          to="/"
          className="font-display text-2xl tracking-wide text-primary"
          aria-label="dotx3.net home"
        >
          .X<span className="text-accent">3</span>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV.map((group, i) => (
            <DesktopGroup
              key={group.id}
              group={group}
              index={i}
              path={path}
              open={openId === group.id}
              onOpen={() => setOpenId(group.id)}
              onClose={() => setOpenId((cur) => (cur === group.id ? null : cur))}
            />
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            to={NAV_CTA.to}
            className="tap hidden min-h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-bg hover:brightness-110 sm:inline-flex"
          >
            {NAV_CTA.label}
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg border border-border text-fg lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        <div
          id="mobile-nav"
          hidden={!mobileOpen}
          className="absolute top-full right-3 left-3 mt-2 lg:hidden"
        >
          {mobileOpen ? <MobileMenu path={path} onNavigate={closeAll} /> : null}
        </div>
      </nav>
    </header>
  );
}

/** Footer sitemap built from the same groups as the header. */
export function SiteFooterNav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      aria-label="Site map"
      className="grid grid-cols-2 gap-x-6 gap-y-8 text-left sm:grid-cols-3 lg:grid-cols-6"
    >
      {NAV.map((group) => (
        <div key={group.id}>
          <p className="font-display text-sm tracking-wide text-accent">{group.label}</p>
          <ul className="mt-3 grid gap-2">
            {group.items.map((item) => {
              const cls = "text-sm text-muted hover:text-fg";
              return (
                <li key={`${item.label}-${item.kind}`}>
                  {item.kind === "route" ? (
                    <Link
                      to={item.to}
                      hash={item.hash}
                      className={cls}
                      aria-current={isCurrentPage(item, path) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  ) : item.kind === "file" ? (
                    <a href={item.href} className={cls}>
                      {item.label}
                    </a>
                  ) : (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {item.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
