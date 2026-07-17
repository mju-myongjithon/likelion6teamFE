/* @ds-bundle: {"format":4,"namespace":"CampusLinkDesignSystem_e2dcda","components":[{"name":"Button","sourcePath":"components/actions/Button.tsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.tsx"},{"name":"Card","sourcePath":"components/cards/Card.tsx"},{"name":"EventCard","sourcePath":"components/cards/EventCard.tsx"},{"name":"FeatureCard","sourcePath":"components/cards/FeatureCard.tsx"},{"name":"MeetupCard","sourcePath":"components/cards/MeetupCard.tsx"},{"name":"PricingTierCard","sourcePath":"components/cards/PricingTierCard.tsx"},{"name":"TestimonialCard","sourcePath":"components/cards/TestimonialCard.tsx"},{"name":"ChatMessage","sourcePath":"components/chat/ChatMessage.tsx"},{"name":"ChatThreadItem","sourcePath":"components/chat/ChatThreadItem.tsx"},{"name":"PlaceVoteCard","sourcePath":"components/chat/PlaceVoteCard.tsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.tsx"},{"name":"Badge","sourcePath":"components/display/Badge.tsx"},{"name":"Calendar","sourcePath":"components/display/Calendar.tsx"},{"name":"ProfilePopover","sourcePath":"components/display/ProfilePopover.tsx"},{"name":"RatingStars","sourcePath":"components/display/RatingStars.tsx"},{"name":"Stat","sourcePath":"components/display/Stat.tsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.tsx"},{"name":"ProgressBar","sourcePath":"components/feedback/ProgressBar.tsx"},{"name":"Stepper","sourcePath":"components/feedback/Stepper.tsx"},{"name":"Chip","sourcePath":"components/forms/Chip.tsx"},{"name":"Field","sourcePath":"components/forms/Field.tsx"},{"name":"Input","sourcePath":"components/forms/Input.tsx"},{"name":"Select","sourcePath":"components/forms/Select.tsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.tsx"},{"name":"Icon","sourcePath":"components/foundations/Icon.tsx"},{"name":"NavPillGroup","sourcePath":"components/navigation/NavPillGroup.tsx"},{"name":"TopNav","sourcePath":"components/navigation/TopNav.tsx"}],"sourceHashes":{"components/actions/Button.tsx":"089f8404b413","components/actions/IconButton.tsx":"8449f65c2d66","components/cards/Card.tsx":"da6096dd22ee","components/cards/EventCard.tsx":"b0e5f76276b2","components/cards/FeatureCard.tsx":"7dd332b66423","components/cards/MeetupCard.tsx":"88cf6210a3f1","components/cards/PricingTierCard.tsx":"e9c591f8594f","components/cards/TestimonialCard.tsx":"14a0963cb39f","components/chat/ChatMessage.tsx":"d26fc5c4a644","components/chat/ChatThreadItem.tsx":"b9a0577a7c33","components/chat/PlaceVoteCard.tsx":"beaf8344e292","components/display/Avatar.tsx":"fe82352a6713","components/display/Badge.tsx":"9c01c0a5ccb2","components/display/Calendar.tsx":"545b4d64a9ec","components/display/ProfilePopover.tsx":"0428afe6f93e","components/display/RatingStars.tsx":"6147c3293cd0","components/display/Stat.tsx":"745500220188","components/feedback/Callout.tsx":"f822a5c35024","components/feedback/ProgressBar.tsx":"7933d006d65f","components/feedback/Stepper.tsx":"d70803277f5b","components/forms/Chip.tsx":"e4eb9d679a75","components/forms/Field.tsx":"d78dd70aa140","components/forms/Input.tsx":"b06ae507119a","components/forms/Select.tsx":"fd087dfe6ccc","components/forms/Textarea.tsx":"a7715781b9ff","components/foundations/Icon.tsx":"7a9e020a0142","components/navigation/NavPillGroup.tsx":"088aa15254fe","components/navigation/TopNav.tsx":"a5c98764c870"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.CampusLinkDesignSystem_e2dcda = window.CampusLinkDesignSystem_e2dcda || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button — CampusLink's primary action control.
 * Near-black primary CTA on white canvas; monochrome at the action layer.
 */
function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  fullWidth = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      height: 32,
      padding: "0 14px",
      fontSize: 13
    },
    md: {
      height: 40,
      padding: "0 20px",
      fontSize: 14
    },
    lg: {
      height: 48,
      padding: "0 24px",
      fontSize: 15
    }
  };
  const s = sizes[size] || sizes.md;
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: s.height,
    padding: s.padding,
    width: fullWidth ? "100%" : "auto",
    fontFamily: "var(--font-sans)",
    fontSize: s.fontSize,
    fontWeight: 600,
    lineHeight: 1,
    borderRadius: "var(--radius-md)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color .15s ease, border-color .15s ease, color .15s ease",
    whiteSpace: "nowrap",
    ...style
  };
  const variants = {
    primary: {
      background: disabled ? "var(--primary-disabled)" : "var(--primary)",
      color: disabled ? "var(--muted)" : "var(--on-primary)"
    },
    secondary: {
      background: "var(--canvas)",
      color: "var(--ink)",
      borderColor: "var(--hairline)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      ...base,
      ...variants[variant]
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.tsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — circular icon-only control (36px). Share, more, carousel arrows.
 */
function IconButton({
  children,
  size = 36,
  variant = "outline",
  disabled = false,
  style = {},
  ...rest
}) {
  const variants = {
    outline: {
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      color: "var(--ink)"
    },
    ghost: {
      background: "transparent",
      border: "1px solid transparent",
      color: "var(--ink)"
    },
    solid: {
      background: "var(--primary)",
      border: "1px solid var(--primary)",
      color: "var(--on-primary)"
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-full)",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      transition: "background-color .15s ease, border-color .15s ease",
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.tsx", error: String((e && e.message) || e) }); }

// components/cards/Card.tsx
try { (() => {
/**
 * Card — base content container. Two surface modes:
 *  - "card" (light gray, no border): abstract feature claims
 *  - "outline" (white + hairline): product / real-content cards
 *  - "dark" (near-black): scarce featured signal (footer / featured tier only)
 */
function Card({
  surface = "outline",
  padding = 24,
  radius = "lg",
  shadow = false,
  children,
  style = {}
}) {
  const surfaces = {
    card: {
      background: "var(--surface-card)",
      border: "1px solid transparent",
      color: "var(--ink)"
    },
    outline: {
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      color: "var(--ink)"
    },
    soft: {
      background: "var(--surface-soft)",
      border: "1px solid transparent",
      color: "var(--ink)"
    },
    dark: {
      background: "var(--surface-dark)",
      border: "1px solid transparent",
      color: "var(--on-dark)"
    }
  };
  const radii = {
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: radii[radius] || radii.lg,
      padding,
      boxShadow: shadow ? "var(--shadow-raised)" : "none",
      ...surfaces[surface],
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/Card.tsx", error: String((e && e.message) || e) }); }

// components/cards/FeatureCard.tsx
try { (() => {
/**
 * FeatureCard — light-gray card for a feature claim. Icon, title, description.
 */
function FeatureCard({
  icon = null,
  title,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      padding: 32,
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 44,
      height: 44,
      borderRadius: "var(--radius-md)",
      background: "var(--canvas)",
      color: "var(--ink)",
      marginBottom: 20,
      boxShadow: "var(--shadow-soft)"
    }
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.4,
      color: "var(--ink)"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      lineHeight: 1.5,
      color: "var(--body)"
    }
  }, children));
}
Object.assign(__ds_scope, { FeatureCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/FeatureCard.tsx", error: String((e && e.message) || e) }); }

// components/cards/PricingTierCard.tsx
try { (() => {
/**
 * PricingTierCard — a pricing plan. Featured tier flips to the dark surface
 * (the only dark card on light pages) — the color IS the featured signal.
 */
function PricingTierCard({
  name,
  price,
  period = "/월",
  description,
  features = [],
  cta = "시작하기",
  featured = false,
  style = {}
}) {
  const fg = featured ? "var(--on-dark)" : "var(--ink)";
  const sub = featured ? "var(--on-dark-soft)" : "var(--muted)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: featured ? "var(--surface-dark)" : "var(--canvas)",
      border: featured ? "1px solid transparent" : "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      padding: 32,
      boxShadow: featured ? "none" : "var(--shadow-soft)",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 22,
      fontWeight: 600,
      letterSpacing: "-0.3px",
      color: fg
    }
  }, name), description && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: sub
    }
  }, description)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 36,
      fontWeight: 600,
      letterSpacing: "-1px",
      color: fg
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: sub
    }
  }, period)), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: featured ? "secondary" : "primary",
    fullWidth: true
  }, cta), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
      marginTop: 4
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      color: featured ? "var(--on-dark-soft)" : "var(--body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: featured ? "var(--badge-emerald)" : "var(--success)",
      flexShrink: 0
    }
  }, "\u2713"), f))));
}
Object.assign(__ds_scope, { PricingTierCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/PricingTierCard.tsx", error: String((e && e.message) || e) }); }

// components/chat/PlaceVoteCard.tsx
try { (() => {
/**
 * PlaceVoteCard — KakaoTalk-style place-vote card embedded in a chat message.
 * Each option shows a near-black fill bar for its share; tapping selects it.
 * Monochrome — the bar and selected outline carry the state, not color.
 */
function PlaceVoteCard({
  title = "약속 장소 투표",
  options,
  selectedId = null,
  totalVoters = null,
  deadline,
  closed = false,
  onVote,
  style = {}
}) {
  const total = options.reduce((s, o) => s + o.votes, 0);
  const voters = totalVoters ?? total;
  const leadVotes = Math.max(0, ...options.map(o => o.votes));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 320,
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      boxShadow: "var(--shadow-soft)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "14px 16px",
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15
    }
  }, "\uD83D\uDCCD"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, options.map(o => {
    const pct = total > 0 ? Math.round(o.votes / total * 100) : 0;
    const selected = o.id === selectedId;
    const lead = o.votes === leadVotes && o.votes > 0;
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      type: "button",
      disabled: closed,
      onClick: () => onVote && onVote(o.id),
      style: {
        position: "relative",
        textAlign: "left",
        padding: "10px 12px",
        borderRadius: "var(--radius-md)",
        border: `1px solid ${selected ? "var(--primary)" : "var(--hairline)"}`,
        background: "var(--canvas)",
        cursor: closed ? "default" : "pointer",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        inset: 0,
        width: `${pct}%`,
        background: lead ? "var(--surface-strong)" : "var(--surface-card)",
        transition: "width .3s ease"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: 600,
        color: "var(--ink)"
      }
    }, o.label), o.sub && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--muted)"
      }
    }, o.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, selected && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: "var(--ink)"
      }
    }, "\u2713"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: 600,
        color: "var(--ink)"
      }
    }, o.votes), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--muted)",
        width: 34,
        textAlign: "right"
      }
    }, pct, "%"))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 16px",
      borderTop: "1px solid var(--hairline-soft)",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted)"
    }
  }, /*#__PURE__*/React.createElement("span", null, voters, "\uBA85 \uCC38\uC5EC"), (deadline || closed) && /*#__PURE__*/React.createElement("span", null, closed ? "투표 마감" : deadline)));
}
Object.assign(__ds_scope, { PlaceVoteCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/PlaceVoteCard.tsx", error: String((e && e.message) || e) }); }

// components/display/Avatar.tsx
try { (() => {
const FILLS = {
  neutral: "var(--surface-card)",
  orange: "var(--badge-orange)",
  pink: "var(--badge-pink)",
  violet: "var(--badge-violet)",
  emerald: "var(--badge-emerald)"
};

/**
 * Avatar — perfect circle (default 36px). Photo, or pastel fill with initials.
 */
function Avatar({
  src = null,
  name = "",
  size = 36,
  tone = "neutral",
  style = {}
}) {
  const initials = name.trim().split(/\s+/).map(p => p[0]).slice(0, 2).join("").toUpperCase();
  const dark = tone === "neutral";
  return /*#__PURE__*/React.createElement("span", {
    title: name || undefined,
    style: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: size,
      height: size,
      borderRadius: "var(--radius-full)",
      background: src ? "var(--surface-card)" : FILLS[tone] || FILLS.neutral,
      color: dark ? "var(--ink)" : "#fff",
      fontFamily: "var(--font-sans)",
      fontSize: Math.round(size * 0.36),
      fontWeight: 600,
      overflow: "hidden",
      flexShrink: 0,
      ...style
    }
  }, src ? /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: name,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : initials || "·");
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.tsx", error: String((e && e.message) || e) }); }

// components/chat/ChatMessage.tsx
try { (() => {
/**
 * ChatMessage — a single chat bubble. Mine = right-aligned near-black on white;
 * theirs = left-aligned soft-gray with avatar + name. Monochrome.
 */
function ChatMessage({
  mine = false,
  sender,
  senderTone = "neutral",
  time,
  hideAvatar = false,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: mine ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      ...style
    }
  }, !mine && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 32,
      flexShrink: 0
    }
  }, !hideAvatar && /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: sender || "",
    tone: senderTone,
    size: 32
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "68%",
      display: "flex",
      flexDirection: "column",
      alignItems: mine ? "flex-end" : "flex-start"
    }
  }, !mine && !hideAvatar && sender && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted)",
      margin: "0 4px 4px"
    }
  }, sender), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: mine ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "9px 13px",
      borderRadius: 14,
      background: mine ? "var(--primary)" : "var(--surface-card)",
      color: mine ? "var(--on-primary)" : "var(--ink)",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      lineHeight: 1.5,
      wordBreak: "break-word",
      borderBottomRightRadius: mine ? 4 : 14,
      borderBottomLeftRadius: mine ? 14 : 4
    }
  }, children), time && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      color: "var(--muted-soft)"
    }
  }, time))));
}
Object.assign(__ds_scope, { ChatMessage });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/ChatMessage.tsx", error: String((e && e.message) || e) }); }

// components/chat/ChatThreadItem.tsx
try { (() => {
/**
 * ChatThreadItem — one row in the chat directory (left rail). Avatar + name +
 * last-message preview + time + unread count. Monochrome; active row fills soft.
 */
function ChatThreadItem({
  name,
  preview = "",
  time = "",
  unread = 0,
  avatarTone = "neutral",
  memberCount = null,
  active = false,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: "var(--radius-md)",
      background: active ? "var(--surface-card)" : "transparent",
      cursor: "pointer",
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: name,
    tone: avatarTone,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--ink)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, name), memberCount != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted-soft)"
    }
  }, memberCount), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      flexShrink: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted-soft)"
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--muted)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, preview), unread > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      borderRadius: "var(--radius-pill)",
      background: "var(--primary)",
      color: "var(--on-primary)",
      fontFamily: "var(--font-sans)",
      fontSize: 11,
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, unread))));
}
Object.assign(__ds_scope, { ChatThreadItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/chat/ChatThreadItem.tsx", error: String((e && e.message) || e) }); }

// components/display/Badge.tsx
try { (() => {
const PASTELS = {
  neutral: {
    bg: "var(--surface-card)",
    fg: "var(--ink)"
  },
  orange: {
    bg: "var(--badge-orange)",
    fg: "#fff"
  },
  pink: {
    bg: "var(--badge-pink)",
    fg: "#fff"
  },
  violet: {
    bg: "var(--badge-violet)",
    fg: "#fff"
  },
  emerald: {
    bg: "var(--badge-emerald)",
    fg: "#0b3b2e"
  },
  success: {
    bg: "rgba(16,185,129,.12)",
    fg: "var(--success)"
  },
  warning: {
    bg: "rgba(245,158,11,.14)",
    fg: "#8a5a00"
  },
  error: {
    bg: "rgba(239,68,68,.12)",
    fg: "var(--error)"
  }
};

/**
 * Badge — small pill label for category tags and status. Neutral by default;
 * pastel tones reserved for category accents (never on CTAs).
 */
function Badge({
  tone = "neutral",
  children,
  style = {}
}) {
  const c = PASTELS[tone] || PASTELS.neutral;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 12px",
      background: c.bg,
      color: c.fg,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1.4,
      borderRadius: "var(--radius-pill)",
      whiteSpace: "nowrap",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.tsx", error: String((e && e.message) || e) }); }

// components/cards/EventCard.tsx
try { (() => {
/**
 * EventCard — a one-off event listing (distinct from MeetupCard's recurring
 * meetup). Left date block + title + venue row. White outline, monochrome.
 */
function EventCard({
  title,
  month = "",
  day = "",
  time,
  venue,
  tag = "행사",
  tagTone = "neutral",
  matchScore = null,
  attendance,
  onClick,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "flex",
      gap: 16,
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      padding: 16,
      boxShadow: "var(--shadow-soft)",
      cursor: onClick ? "pointer" : "default",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      width: 60,
      height: 64,
      borderRadius: "var(--radius-md)",
      background: "var(--surface-dark)",
      color: "var(--on-dark)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 500,
      opacity: 0.75
    }
  }, month), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 24,
      fontWeight: 600,
      letterSpacing: "-0.5px",
      lineHeight: 1
    }
  }, day)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: tagTone
  }, tag), matchScore != null && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--brand-accent)"
    }
  }, "\u2726 ", matchScore, "% \uC77C\uCE58")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      fontWeight: 600,
      lineHeight: 1.35,
      color: "var(--ink)",
      textWrap: "pretty"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--muted)"
    }
  }, time && /*#__PURE__*/React.createElement("span", null, "\uD83D\uDD51 ", time), venue && /*#__PURE__*/React.createElement("span", null, "\uD83D\uDCCD ", venue), attendance && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto"
    }
  }, attendance))));
}
Object.assign(__ds_scope, { EventCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/EventCard.tsx", error: String((e && e.message) || e) }); }

// components/cards/MeetupCard.tsx
try { (() => {
/**
 * MeetupCard — CampusLink's core content unit: a meetup/event listing.
 * White outline card with category tag, title, meta, host, and member count.
 */
function MeetupCard({
  title,
  category = "모임",
  categoryTone = "neutral",
  when,
  where,
  host,
  hostTone = "violet",
  members,
  capacity,
  matchScore = null,
  image = null,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxShadow: "var(--shadow-soft)",
      ...style
    }
  }, image && /*#__PURE__*/React.createElement("div", {
    style: {
      height: 132,
      background: `var(--surface-card) center/cover no-repeat`,
      backgroundImage: `url(${image})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 12,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: categoryTone
  }, category), matchScore != null && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--brand-accent)"
    }
  }, "\u2726 ", matchScore, "% \uC77C\uCE58")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 17,
      fontWeight: 600,
      lineHeight: 1.35,
      color: "var(--ink)",
      textWrap: "pretty"
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, when && /*#__PURE__*/React.createElement(Meta, {
    glyph: "\uD83D\uDDD3"
  }, when), where && /*#__PURE__*/React.createElement(Meta, {
    glyph: "\uD83D\uDCCD"
  }, where)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: "auto",
      paddingTop: 4
    }
  }, host && /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: host,
    tone: hostTone,
    size: 28
  }), host && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--muted)"
    }
  }, host), members != null && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--muted)"
    }
  }, members, capacity ? ` / ${capacity}` : "", "\uBA85"))));
}
function Meta({
  glyph,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      color: "var(--body)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      opacity: 0.7
    }
  }, glyph), children);
}
Object.assign(__ds_scope, { MeetupCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/MeetupCard.tsx", error: String((e && e.message) || e) }); }

// components/display/Calendar.tsx
try { (() => {
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

/**
 * Calendar — month-grid calendar widget for scheduling surfaces (마이페이지).
 * Near-black dot marks days with events; today gets a filled circle. Monochrome.
 */
function Calendar({
  monthLabel,
  startOffset,
  daysInMonth,
  events = [],
  today = null,
  onPrev,
  onNext,
  onSelectDay,
  style = {}
}) {
  const cells = [...Array(startOffset).fill(null), ...Array.from({
    length: daysInMonth
  }, (_, i) => i + 1)];
  const eventsByDay = new Map();
  events.forEach(e => {
    const list = eventsByDay.get(e.day) || [];
    list.push(e);
    eventsByDay.set(e.day, list);
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      padding: 20,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onPrev,
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--muted)",
      fontSize: 16,
      padding: 4
    }
  }, "\u2039"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, monthLabel), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onNext,
    style: {
      border: "none",
      background: "transparent",
      cursor: "pointer",
      color: "var(--muted)",
      fontSize: 16,
      padding: 4
    }
  }, "\u203A")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 4,
      marginBottom: 6
    }
  }, WEEKDAYS.map(w => /*#__PURE__*/React.createElement("div", {
    key: w,
    style: {
      textAlign: "center",
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 500,
      color: "var(--muted-soft)",
      padding: "4px 0"
    }
  }, w))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(7,1fr)",
      gap: 4
    }
  }, cells.map((day, i) => {
    if (day == null) return /*#__PURE__*/React.createElement("div", {
      key: i
    });
    const isToday = day === today;
    const dayEvents = eventsByDay.get(day) || [];
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      onClick: () => onSelectDay && onSelectDay(day),
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: "6px 0",
        border: "none",
        borderRadius: "var(--radius-md)",
        background: isToday ? "var(--primary)" : "transparent",
        cursor: onSelectDay ? "pointer" : "default"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: isToday ? 600 : 500,
        color: isToday ? "var(--on-primary)" : "var(--ink)"
      }
    }, day), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        gap: 2,
        height: 4
      }
    }, dayEvents.slice(0, 3).map((e, idx) => /*#__PURE__*/React.createElement("span", {
      key: idx,
      style: {
        width: 4,
        height: 4,
        borderRadius: "var(--radius-full)",
        background: isToday ? "var(--on-primary)" : "var(--muted)"
      }
    }))));
  })));
}
Object.assign(__ds_scope, { Calendar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Calendar.tsx", error: String((e && e.message) || e) }); }

// components/display/ProfilePopover.tsx
try { (() => {
/**
 * ProfilePopover — header avatar dropdown showing profile summary + upcoming
 * schedule. White card, hairline border, soft shadow. Monochrome.
 */
function ProfilePopover({
  name,
  meta,
  avatarSrc = null,
  avatarTone = "violet",
  events = [],
  onViewProfile,
  onLogout,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 280,
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-raised)",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 16,
      borderBottom: "1px solid var(--hairline-soft)"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: avatarSrc,
    name: name,
    tone: avatarTone,
    size: 44
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 15,
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, name), meta && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted)"
    }
  }, meta))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "12px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 600,
      color: "var(--muted)",
      marginBottom: 10
    }
  }, "\uB2E4\uAC00\uC624\uB294 \uC77C\uC815"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, events.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--muted-soft)"
    }
  }, "\uC608\uC815\uB41C \uC77C\uC815\uC774 \uC5C6\uC5B4\uC694."), events.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "var(--radius-full)",
      background: "var(--ink)",
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--ink)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, e.title), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted)"
    }
  }, e.when))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: "1px solid var(--hairline-soft)",
      padding: 8,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onViewProfile,
    style: {
      textAlign: "left",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "8px 8px",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--ink)"
    }
  }, "\uB9C8\uC774\uD398\uC774\uC9C0"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onLogout,
    style: {
      textAlign: "left",
      border: "none",
      background: "transparent",
      cursor: "pointer",
      padding: "8px 8px",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--muted)"
    }
  }, "\uB85C\uADF8\uC544\uC6C3")));
}
Object.assign(__ds_scope, { ProfilePopover });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProfilePopover.tsx", error: String((e && e.message) || e) }); }

// components/display/RatingStars.tsx
try { (() => {
/**
 * RatingStars — inline 5-star rating in badge-orange. Read-only display.
 */
function RatingStars({
  value = 5,
  max = 5,
  size = 14,
  showValue = false,
  style = {}
}) {
  const stars = [];
  for (let i = 0; i < max; i++) {
    const fill = i + 1 <= Math.round(value);
    stars.push(/*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        color: fill ? "var(--badge-orange)" : "var(--surface-strong)",
        fontSize: size,
        lineHeight: 1
      }
    }, "\u2605"));
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 2,
      ...style
    }
  }, stars, showValue && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      color: "var(--muted)"
    }
  }, value.toFixed(1)));
}
Object.assign(__ds_scope, { RatingStars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/RatingStars.tsx", error: String((e && e.message) || e) }); }

// components/cards/TestimonialCard.tsx
try { (() => {
/**
 * TestimonialCard — light-gray quote card. Avatar row + quote.
 */
function TestimonialCard({
  name,
  role,
  avatarSrc = null,
  avatarTone = "neutral",
  rating = null,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--surface-card)",
      borderRadius: "var(--radius-lg)",
      padding: 24,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    src: avatarSrc,
    name: name,
    tone: avatarTone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, name), role && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--muted)"
    }
  }, role)), rating != null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.RatingStars, {
    value: rating
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 0",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      lineHeight: 1.5,
      color: "var(--body)"
    }
  }, children));
}
Object.assign(__ds_scope, { TestimonialCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/TestimonialCard.tsx", error: String((e && e.message) || e) }); }

// components/display/Stat.tsx
try { (() => {
/**
 * Stat — a single activity-statistic tile (참여 모임 수, 매칭 성사 수, …).
 * White outline card; large Geist-display value + muted label. Monochrome.
 */
function Stat({
  value,
  label,
  icon = null,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--muted)",
      display: "inline-flex"
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 32,
      fontWeight: 600,
      letterSpacing: "-1px",
      color: "var(--ink)",
      lineHeight: 1
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      color: "var(--muted)"
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Stat.tsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.tsx
try { (() => {
/**
 * Callout — inline info / warning banner. Info uses the soft-gray surface with
 * the ✦ brand glyph; danger uses the semantic error tint. Monochrome at rest.
 */
function Callout({
  tone = "info",
  marker,
  children,
  style = {}
}) {
  const isDanger = tone === "danger";
  const glyph = marker ?? (isDanger ? "!" : "✦");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "12px 14px",
      borderRadius: "var(--radius-md)",
      background: isDanger ? "rgba(239,68,68,.08)" : "var(--surface-soft)",
      border: `1px solid ${isDanger ? "var(--error)" : "var(--hairline)"}`,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      lineHeight: 1.5,
      color: isDanger ? "var(--error)" : "var(--body)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      fontWeight: 700,
      color: isDanger ? "var(--error)" : "var(--ink)",
      lineHeight: 1.5
    }
  }, glyph), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Callout });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.tsx", error: String((e && e.message) || e) }); }

// components/feedback/ProgressBar.tsx
try { (() => {
/**
 * ProgressBar — thin step progress indicator for multi-step flows (onboarding).
 * Near-black fill on a light track.
 */
function ProgressBar({
  step = 1,
  total = 5,
  value,
  showLabel = true,
  label,
  style = {}
}) {
  const ratio = value != null ? value : total > 0 ? step / total : 0;
  const pct = Math.max(0, Math.min(1, ratio)) * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 4,
      borderRadius: "var(--radius-pill)",
      background: "var(--surface-strong)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${pct}%`,
      height: "100%",
      background: "var(--primary)",
      borderRadius: "var(--radius-pill)",
      transition: "width .25s ease"
    }
  })), showLabel && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      fontWeight: 500,
      color: "var(--muted)",
      whiteSpace: "nowrap"
    }
  }, label ?? `${step} / ${total} 단계`));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/ProgressBar.tsx", error: String((e && e.message) || e) }); }

// components/feedback/Stepper.tsx
try { (() => {
/**
 * Stepper — vertical numbered-step tracker for a pending multi-stage process
 * (e.g. application review: 신청 완료 → 호스트 확인 대기 → 확정). Distinct from
 * ProgressBar (linear fill for a form flow) — this shows discrete stage status
 * (done / current / upcoming) with a description per step. Monochrome.
 */
function Stepper({
  steps,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-lg)",
      padding: "6px 16px",
      ...style
    }
  }, steps.map((s, i) => {
    const status = s.status ?? "upcoming";
    const done = status === "done";
    const current = status === "current";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "12px 0",
        borderBottom: i < steps.length - 1 ? "1px solid var(--hairline-soft)" : "none"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: "var(--radius-full)",
        border: `1px solid ${done || current ? "var(--primary)" : "var(--hairline)"}`,
        background: done ? "var(--primary)" : "var(--canvas)",
        color: done ? "var(--on-primary)" : "var(--ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-sans)",
        fontSize: 11,
        fontWeight: 700
      }
    }, done ? "✓" : i + 1), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: 600,
        color: current || done ? "var(--ink)" : "var(--muted)"
      }
    }, s.title), s.description && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        color: "var(--muted)",
        marginTop: 2
      }
    }, s.description)));
  }));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Stepper.tsx", error: String((e && e.message) || e) }); }

// components/forms/Chip.tsx
try { (() => {
/**
 * Chip — selectable tag for interests / purpose / role pickers. Monochrome:
 * inactive = hairline outline, active = near-black fill. (Distinct from Badge,
 * which is a read-only label.)
 */
function Chip({
  active = false,
  variant = "default",
  onClick,
  children,
  style = {}
}) {
  const dashed = variant === "add";
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "7px 14px",
      borderRadius: "var(--radius-pill)",
      border: `1px ${dashed ? "dashed" : "solid"} ${active ? "var(--primary)" : "var(--hairline)"}`,
      background: active ? "var(--primary)" : "var(--canvas)",
      color: active ? "var(--on-primary)" : dashed ? "var(--muted)" : "var(--body)",
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 500,
      lineHeight: 1,
      cursor: "pointer",
      transition: "background-color .15s ease, border-color .15s ease, color .15s ease",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Chip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Chip.tsx", error: String((e && e.message) || e) }); }

// components/forms/Field.tsx
try { (() => {
/**
 * Field — label + control wrapper for forms. Consistent label type + spacing.
 */
function Field({
  label,
  hint,
  labelAside,
  children,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      ...style
    }
  }, (label || labelAside) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: 8
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--ink)"
    }
  }, label), labelAside && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted)"
    }
  }, labelAside)), children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-sans)",
      fontSize: 12,
      color: "var(--muted)",
      lineHeight: 1.5
    }
  }, hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.tsx", error: String((e && e.message) || e) }); }

// components/forms/Input.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — standard text field. 40px, hairline border, ink text on white.
 */
function Input({
  iconLeft = null,
  invalid = false,
  disabled = false,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = invalid ? "var(--error)" : focused ? "var(--ink)" : "var(--hairline)";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      height: 40,
      padding: "0 14px",
      background: disabled ? "var(--surface-soft)" : "var(--canvas)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      transition: "border-color .15s ease",
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      color: "var(--muted)"
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      flex: 1,
      border: "none",
      outline: "none",
      background: "transparent",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      color: "var(--ink)",
      minWidth: 0
    }
  })));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.tsx", error: String((e && e.message) || e) }); }

// components/forms/Select.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Select — native dropdown styled to match Input (40px, hairline, ink text).
 */
function Select({
  options = [],
  value,
  onChange,
  disabled = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      height: 40,
      width: "100%",
      background: disabled ? "var(--surface-soft)" : "var(--canvas)",
      border: "1px solid var(--hairline)",
      borderRadius: "var(--radius-md)",
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange,
    disabled: disabled
  }, rest, {
    style: {
      appearance: "none",
      WebkitAppearance: "none",
      border: "none",
      outline: "none",
      background: "transparent",
      width: "100%",
      height: "100%",
      padding: "0 36px 0 14px",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      color: "var(--ink)",
      cursor: disabled ? "not-allowed" : "pointer"
    }
  }), options.map(o => {
    const val = typeof o === "string" ? o : o.value;
    const label = typeof o === "string" ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, label);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 12,
      pointerEvents: "none",
      color: "var(--muted)",
      fontSize: 12
    }
  }, "\u25BE"));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.tsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.tsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Textarea — multi-line text field matching Input (hairline border, ink text).
 */
function Textarea({
  invalid = false,
  disabled = false,
  rows = 3,
  style = {},
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const borderColor = invalid ? "var(--error)" : focused ? "var(--ink)" : "var(--hairline)";
  return /*#__PURE__*/React.createElement("textarea", _extends({
    rows: rows,
    disabled: disabled,
    onFocus: e => {
      setFocused(true);
      rest.onFocus && rest.onFocus(e);
    },
    onBlur: e => {
      setFocused(false);
      rest.onBlur && rest.onBlur(e);
    }
  }, rest, {
    style: {
      width: "100%",
      resize: "vertical",
      padding: "10px 14px",
      background: disabled ? "var(--surface-soft)" : "var(--canvas)",
      border: `1px solid ${borderColor}`,
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      fontSize: 16,
      lineHeight: 1.5,
      color: "var(--ink)",
      outline: "none",
      transition: "border-color .15s ease",
      opacity: disabled ? 0.6 : 1,
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.tsx", error: String((e && e.message) || e) }); }

// components/foundations/Icon.tsx
try { (() => {
/**
 * Icon — thin wrapper over Lucide (loaded via CDN in card/kit HTML).
 * Renders an inline SVG by name using the global `lucide` object, so it stays
 * consistent with CampusLink's 1.5px-stroke line-icon system.
 */
function Icon({
  name,
  size = 20,
  strokeWidth = 1.75,
  color = "currentColor",
  style = {}
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const L = (typeof window !== "undefined" ? window.lucide : null) || null;
    const node = ref.current;
    if (!L || !node) return;
    const icons = L.icons || {};
    const toPascal = name.split(/[-_]/).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
    const data = icons[toPascal] || icons[name];
    if (!data) return;
    const svg = L.createElement ? L.createElement(data) : null;
    if (svg) {
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      svg.setAttribute("stroke-width", String(strokeWidth));
      node.innerHTML = "";
      node.appendChild(svg);
    }
  }, [name, size, strokeWidth]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      display: "inline-flex",
      width: size,
      height: size,
      color,
      flexShrink: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/foundations/Icon.tsx", error: String((e && e.message) || e) }); }

// components/navigation/NavPillGroup.tsx
try { (() => {
/**
 * NavPillGroup — signature pill-in-pill segmented control. A soft-surface
 * wrapper; the active segment renders as a white pill with a soft shadow.
 */
function NavPillGroup({
  items = [],
  value,
  onChange,
  style = {}
}) {
  const first = items[0];
  const active = value ?? (first ? typeof first === "string" ? first : first.value : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      gap: 2,
      padding: 6,
      background: "var(--surface-soft)",
      borderRadius: "var(--radius-pill)",
      ...style
    }
  }, items.map(it => {
    const val = typeof it === "string" ? it : it.value;
    const label = typeof it === "string" ? it : it.label;
    const isActive = val === active;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      type: "button",
      onClick: () => onChange && onChange(val),
      style: {
        border: "none",
        cursor: "pointer",
        padding: "8px 14px",
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.4,
        background: isActive ? "var(--canvas)" : "transparent",
        color: isActive ? "var(--ink)" : "var(--muted)",
        boxShadow: isActive ? "var(--shadow-soft)" : "none",
        transition: "background-color .15s ease, color .15s ease"
      }
    }, label);
  }));
}
Object.assign(__ds_scope, { NavPillGroup });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavPillGroup.tsx", error: String((e && e.message) || e) }); }

// components/navigation/TopNav.tsx
try { (() => {
/**
 * TopNav — white 64px nav bar pinned to the top. Wordmark left, menu center,
 * action cluster right. Composes the brand wordmark in plain type (no logo mark).
 */
function TopNav({
  brand = "CampusLink",
  links = ["둘러보기", "모임", "이벤트", "요금제"],
  activeLink = null,
  right = null,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      height: 64,
      padding: "0 24px",
      background: "var(--canvas)",
      borderBottom: "1px solid var(--hairline-soft)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "var(--radius-full)",
      background: "var(--primary)",
      display: "inline-block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: "-0.5px",
      color: "var(--ink)"
    }
  }, brand)), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 4
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: {
      padding: "8px 12px",
      borderRadius: "var(--radius-md)",
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 500,
      textDecoration: "none",
      color: l === activeLink ? "var(--ink)" : "var(--muted)"
    }
  }, l)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, right));
}
Object.assign(__ds_scope, { TopNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopNav.tsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.EventCard = __ds_scope.EventCard;

__ds_ns.FeatureCard = __ds_scope.FeatureCard;

__ds_ns.MeetupCard = __ds_scope.MeetupCard;

__ds_ns.PricingTierCard = __ds_scope.PricingTierCard;

__ds_ns.TestimonialCard = __ds_scope.TestimonialCard;

__ds_ns.ChatMessage = __ds_scope.ChatMessage;

__ds_ns.ChatThreadItem = __ds_scope.ChatThreadItem;

__ds_ns.PlaceVoteCard = __ds_scope.PlaceVoteCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Calendar = __ds_scope.Calendar;

__ds_ns.ProfilePopover = __ds_scope.ProfilePopover;

__ds_ns.RatingStars = __ds_scope.RatingStars;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.NavPillGroup = __ds_scope.NavPillGroup;

__ds_ns.TopNav = __ds_scope.TopNav;

})();
