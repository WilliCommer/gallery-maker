var __defProp = Object.defineProperty;
var __export = (target, all2) => {
  for (var name in all2)
    __defProp(target, name, { get: all2[name], enumerable: true });
};

// node_modules/vanjs-bootstrap/dist/index.modern.js
var index_modern_exports = {};
__export(index_modern_exports, {
  Button: () => P,
  CheckboxInput: () => M,
  ComboboxInput: () => q,
  ComboboxInputP: () => W,
  FormBuilder: () => _,
  FormCheckInput: () => O,
  FormControl: () => L,
  FormController: () => T,
  FormGroup: () => R,
  FormLabel: () => $,
  Icon: () => be,
  Input: () => j,
  NavItem: () => ie,
  NavLink: () => oe,
  NavMenu: () => se,
  Navbar: () => ne,
  RadioInput: () => N,
  RadioSelectInput: () => E,
  SelectInput: () => A,
  SwitchInput: () => D,
  Textarea: () => I,
  getIcon: () => ve,
  iconMap: () => de,
  selectOptions: () => n,
  setElementValid: () => V,
  setIcon: () => pe,
  setSvgAttributes: () => me,
  spriteify: () => ge,
  stringToSvgElement: () => fe,
  typeMap: () => C,
  van: () => van_default,
  version: () => he,
  versionInfo: () => ye
});

// node_modules/vanjs-core/src/van.js
var protoOf = Object.getPrototypeOf;
var changedStates;
var derivedStates;
var curDeps;
var curNewDerives;
var alwaysConnectedDom = { isConnected: 1 };
var gcCycleInMs = 1e3;
var statesToGc;
var propSetterCache = {};
var objProto = protoOf(alwaysConnectedDom);
var funcProto = protoOf(protoOf);
var _undefined;
var addAndScheduleOnFirst = (set, s3, f3, waitMs) => (set ?? (waitMs ? setTimeout(f3, waitMs) : queueMicrotask(f3), /* @__PURE__ */ new Set())).add(s3);
var runAndCaptureDeps = (f3, deps, arg) => {
  let prevDeps = curDeps;
  curDeps = deps;
  try {
    return f3(arg);
  } catch (e) {
    console.error(e);
    return arg;
  } finally {
    curDeps = prevDeps;
  }
};
var keepConnected = (l3) => l3.filter((b3) => b3._dom?.isConnected);
var addStatesToGc = (d3) => statesToGc = addAndScheduleOnFirst(statesToGc, d3, () => {
  for (let s3 of statesToGc)
    s3._bindings = keepConnected(s3._bindings), s3._listeners = keepConnected(s3._listeners);
  statesToGc = _undefined;
}, gcCycleInMs);
var stateProto = {
  get val() {
    curDeps?._getters?.add(this);
    return this.rawVal;
  },
  get oldVal() {
    curDeps?._getters?.add(this);
    return this._oldVal;
  },
  set val(v2) {
    curDeps?._setters?.add(this);
    if (v2 !== this.rawVal) {
      this.rawVal = v2;
      this._bindings.length + this._listeners.length ? (derivedStates?.add(this), changedStates = addAndScheduleOnFirst(changedStates, this, updateDoms)) : this._oldVal = v2;
    }
  }
};
var state = (initVal) => ({
  __proto__: stateProto,
  rawVal: initVal,
  _oldVal: initVal,
  _bindings: [],
  _listeners: []
});
var bind = (f3, dom) => {
  let deps = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, binding = { f: f3 }, prevNewDerives = curNewDerives;
  curNewDerives = [];
  let newDom = runAndCaptureDeps(f3, deps, dom);
  newDom = (newDom ?? document).nodeType ? newDom : new Text(newDom);
  for (let d3 of deps._getters)
    deps._setters.has(d3) || (addStatesToGc(d3), d3._bindings.push(binding));
  for (let l3 of curNewDerives) l3._dom = newDom;
  curNewDerives = prevNewDerives;
  return binding._dom = newDom;
};
var derive = (f3, s3 = state(), dom) => {
  let deps = { _getters: /* @__PURE__ */ new Set(), _setters: /* @__PURE__ */ new Set() }, listener = { f: f3, s: s3 };
  listener._dom = dom ?? curNewDerives?.push(listener) ?? alwaysConnectedDom;
  s3.val = runAndCaptureDeps(f3, deps, s3.rawVal);
  for (let d3 of deps._getters)
    deps._setters.has(d3) || (addStatesToGc(d3), d3._listeners.push(listener));
  return s3;
};
var add = (dom, ...children) => {
  for (let c3 of children.flat(Infinity)) {
    let protoOfC = protoOf(c3 ?? 0);
    let child = protoOfC === stateProto ? bind(() => c3.val) : protoOfC === funcProto ? bind(c3) : c3;
    child != _undefined && dom.append(child);
  }
  return dom;
};
var tag = (ns, name, ...args) => {
  let [{ is, ...props }, ...children] = protoOf(args[0] ?? 0) === objProto ? args : [{}, ...args];
  let dom = ns ? document.createElementNS(ns, name, { is }) : document.createElement(name, { is });
  for (let [k2, v2] of Object.entries(props)) {
    let getPropDescriptor = (proto) => proto && (Object.getOwnPropertyDescriptor(proto, k2) ?? getPropDescriptor(protoOf(proto)));
    let propSetter = !ns && !is && !name.includes("-") ? propSetterCache[name + "," + k2] ??= getPropDescriptor(protoOf(dom))?.set ?? 0 : getPropDescriptor(protoOf(dom))?.set;
    let isEvent = k2.startsWith("on");
    let setter = isEvent ? (v3, oldV) => {
      let event2 = k2.slice(2);
      dom.removeEventListener(event2, oldV);
      dom.addEventListener(event2, v3);
    } : propSetter ? propSetter.bind(dom) : dom.setAttribute.bind(dom, k2);
    let protoOfV = protoOf(v2 ?? 0);
    isEvent || protoOfV === funcProto && (v2 = derive(v2, _undefined, dom), protoOfV = stateProto);
    protoOfV === stateProto ? bind(() => (setter(v2.val, v2._oldVal), dom)) : setter(v2);
  }
  return add(dom, children);
};
var handler = (ns) => ({ get: (_2, name) => tag.bind(_undefined, ns, name) });
var update = (dom, newDom) => newDom ? newDom !== dom && dom.replaceWith(newDom) : dom.remove();
var updateDoms = () => {
  let iterationsLeft = 100, derivedStatesArray = [...changedStates].filter((s3) => s3.rawVal !== s3._oldVal);
  do {
    derivedStates = /* @__PURE__ */ new Set();
    for (let l3 of new Set(derivedStatesArray.flatMap((s3) => s3._listeners = keepConnected(s3._listeners))))
      derive(l3.f, l3.s, l3._dom), l3._dom = _undefined;
  } while (--iterationsLeft && (derivedStatesArray = [...derivedStates]).length);
  let changedStatesArray = [...changedStates].filter((s3) => s3.rawVal !== s3._oldVal);
  changedStates = _undefined;
  for (let b3 of new Set(changedStatesArray.flatMap((s3) => s3._bindings = keepConnected(s3._bindings))))
    update(b3._dom, bind(b3.f, b3._dom)), b3._dom = _undefined;
  for (let s3 of changedStatesArray) s3._oldVal = s3.rawVal;
};
var van_default = {
  tags: new Proxy((ns) => new Proxy(tag, handler(ns)), handler()),
  hydrate: (dom, f3) => update(dom, bind(f3, dom)),
  add,
  state,
  derive
};

// node_modules/vanjs-bootstrap/dist/index.modern.js
function l() {
  return l = Object.assign ? Object.assign.bind() : function(e) {
    for (var l3 = 1; l3 < arguments.length; l3++) {
      var t8 = arguments[l3];
      for (var a3 in t8) ({}).hasOwnProperty.call(t8, a3) && (e[a3] = t8[a3]);
    }
    return e;
  }, l.apply(null, arguments);
}
function t(e, l3) {
  if (null == e) return {};
  var t8 = {};
  for (var a3 in e) if ({}.hasOwnProperty.call(e, a3)) {
    if (-1 !== l3.indexOf(a3)) continue;
    t8[a3] = e[a3];
  }
  return t8;
}
var { option: a } = van_default.tags;
function n(e, l3, t8) {
  return e && !Array.isArray(e) && "object" == typeof e && e.value && (e = (function(e2) {
    var { value: l4, text: t9 } = e2;
    return l4 ? (l4 = i(l4, true), t9 = i(t9, false), l4.map((e3, l5) => ({ value: e3, text: t9[l5] }))) : [];
  })(e)), e = (e = i(e || [], true)).map(function(e2) {
    let l4 = { value: "", children: "" };
    return e2 ? Array.isArray(e2) ? (e2.length > 0 && (l4.value = e2[0], l4.children = e2[0]), e2.length > 1 && (l4.value = e2[1]), l4) : "object" == typeof e2 ? (l4.value = e2.value, l4.children = e2.value, ["children", "text", "displayValue"].some((t9) => void 0 !== e2[t9] && (l4.children = e2[t9], true)), l4) : (l4.value = e2, l4.children = e2, l4) : l4;
  }), l3 ? e.map((e2) => {
    let l4 = { value: e2.value };
    return void 0 !== t8 && e2.value === t8 && (l4.selected = true), a(l4, e2.children);
  }) : e;
}
function i(e, l3) {
  return e ? ("string" == typeof e && (e = e.split(",")), Array.isArray(e) || (l3 && console.warn("parseSelectOptions value invalid"), e = []), e) : [];
}
var o = ["class", "bsSize", "col", "tag"];
var s = ["class", "isvalid", "bsSize"];
var r = ["class", "isvalid", "bsSize"];
var c = ["class", "isvalid", "bsSize"];
var u = ["options"];
var d = ["options", "class", "bsSize", "inline", "id", "oninput", "name", "value", "disabled", "isvalid"];
var v = ["label", "type", "class", "style", "bsSize", "reverse", "id", "value", "isvalid"];
var p = ["name", "input", "class", "bsSize", "id"];
var f = ["name", "label", "input", "class", "inputClass", "bsSize", "cols", "col", "id", "separated"];
var m = ["name", "value", "oninput", "cols", "onvalidate"];
var b = ["bsSize", "class", "color", "outline", "dropdown", "type"];
var { button: g, div: h, input: y, label: w, textarea: z, select: S } = van_default.tags;
var k = () => "id_" + Math.random().toString(36).substring(2, 9);
var x = ["button", "checkbox", "color", "combobox", "date", "datetime-local", "email", "file", "image", "month", "number", "password", "radio", "range", "reset", "search", "submit", "select", "switch", "tel", "text", "textarea", "time", "url", "week"];
var C = /* @__PURE__ */ new Map();
function $(a3, n4) {
  let { class: i3, bsSize: s3, col: r3, tag: c3 } = a3, u3 = t(a3, o);
  return van_default.tags[c3 || "label"](l({ class: () => {
    let l3 = "form-label";
    return van_default.val(r3) ? (l3 = "col-form-label", van_default.val(s3) ? l3 += " col-" + van_default.val(s3) + "-" + van_default.val(r3) + " col-form-label-" + van_default.val(s3) : l3 += " col-" + van_default.val(r3)) : van_default.val(s3) && (l3 += " col-form-label-" + van_default.val(s3)), van_default.val(i3) && (l3 += " " + van_default.val(i3)), l3;
  } }, u3), n4);
}
function j(a3) {
  let { class: n4, isvalid: i3, bsSize: o2 } = a3, r3 = t(a3, s);
  return r3.autocomplete || (r3.autocomplete = "off"), r3.id || (r3.id = k()), y(l({ class: () => {
    let l3 = "form-control";
    return van_default.val(o2) && (l3 += " form-control-" + van_default.val(o2)), van_default.val(n4) && (l3 += " " + van_default.val(n4)), null != i3 && (l3 += van_default.val(i3) ? " is-valid" : " is-invalid"), l3;
  } }, r3));
}
function I(a3) {
  let { class: n4, isvalid: i3, bsSize: o2 } = a3, s3 = t(a3, r);
  return s3.autocomplete || (s3.autocomplete = "off"), s3.id || (s3.id = k()), z(l({ class: () => {
    let l3 = "form-control";
    return van_default.val(o2) && (l3 += " form-control-" + van_default.val(o2)), van_default.val(n4) && (l3 += " " + van_default.val(n4)), null != i3 && (l3 += van_default.val(i3) ? " is-valid" : " is-invalid"), l3;
  } }, s3));
}
function A(a3) {
  let { class: i3, isvalid: o2, bsSize: s3 } = a3, r3 = t(a3, c);
  r3.autocomplete || (r3.autocomplete = "off"), r3.id || (r3.id = k());
  let { options: d3 = [] } = r3, v2 = t(r3, u);
  return d3 = "function" != typeof d3 ? n(d3, true, r3.value) : d3(), S(l({ class: () => {
    let l3 = "form-select";
    return van_default.val(s3) && (l3 += " form-select-" + van_default.val(s3)), van_default.val(i3) && (l3 += " " + van_default.val(i3)), null != o2 && (l3 += van_default.val(o2) ? " is-valid" : " is-invalid"), l3;
  } }, v2), d3);
}
function E(a3) {
  var { options: i3, class: o2, bsSize: s3, inline: r3, id: c3, oninput: u3, name: v2, value: p3, disabled: f3, isvalid: m2 } = a3, b3 = t(a3, d);
  v2 = v2 || k(), c3 = c3 || "rgi_" + v2, i3 = n(i3), f3 = f3 ? { disabled: true } : {};
  const g2 = (e) => {
    u3 && u3({ target: { name: v2, value: e.target.value, type: "radiogroup" } });
  }, z2 = i3.map((e, t8) => {
    let a4 = c3 + "_" + t8;
    return h({ class: "form-check" + (r3 ? " form-check-inline" : "") }, y(l({ class: "form-check-input", type: "radio", id: a4, value: e.value, name: v2, checked: p3 === e.value, oninput: g2 }, f3)), w({ class: "form-check-label", for: a4 }, e.children));
  });
  return h(l({ id: c3, role: "radiogroup", "aria-labelledby": c3, class: () => {
    let l3 = "form-control";
    return van_default.val(s3) && (l3 += " form-control-" + van_default.val(s3)), van_default.val(o2) && (l3 += " " + van_default.val(o2)), null != m2 && (l3 += van_default.val(m2) ? " is-valid" : " is-invalid"), l3;
  } }, f3, b3), z2);
}
function O(a3, ...n4) {
  let { label: i3, type: o2, class: s3, style: r3, bsSize: c3, reverse: u3, id: d3, value: p3, isvalid: f3 } = a3, m2 = t(a3, v);
  d3 = d3 || k();
  var b3 = "switch" === o2;
  return b3 && (o2 = "checkbox"), h({ class: () => {
    let l3 = "form-check";
    return b3 && (l3 += " form-switch"), van_default.val(c3) && (l3 += " form-control-" + van_default.val(c3)), van_default.val(u3) && (l3 += " form-check-reverse"), van_default.val(s3) && (l3 += " " + van_default.val(s3)), l3;
  }, style: r3 }, y(l({}, m2, { class: () => {
    let l3 = "form-check-input";
    return null != f3 && (l3 += van_default.val(f3) ? " is-valid" : " is-invalid"), l3;
  }, id: d3, type: o2, checked: p3 || false, oninput: (e) => {
    e.stopPropagation();
    var { checked: l3, name: t8, type: a4 } = e.target;
    m2.oninput({ target: { value: l3 = !!l3, checked: l3, name: t8, type: a4 } });
  }, role: b3 ? "switch" : void 0 })), () => i3 ? w({ class: "form-check-label", for: d3 }, i3) : null, ...n4);
}
function D(e) {
  return O(l({}, e, { type: "switch" }));
}
function M(e) {
  return O(l({}, e, { type: "checkbox" }));
}
function N(e) {
  return O(l({}, e, { type: "radio" }));
}
function L(e) {
  var a3;
  let { name: n4, input: i3, class: o2, bsSize: s3, id: r3 } = e, c3 = t(e, p);
  return r3 || (r3 = k()), (null != (a3 = null != i3 ? i3 : C.get(c3.type)) ? a3 : j)(l({ bsSize: s3, name: n4, id: r3, class: o2 }, c3));
}
function R(a3, ...n4) {
  var i3;
  let { name: o2, label: s3, input: r3, class: c3, inputClass: u3, bsSize: d3, cols: v2, col: p3, id: m2, separated: b3 } = a3, g2 = t(a3, f);
  const y2 = null != m2 ? m2 : k(), w2 = y2 + "-i", z2 = y2 + "-l";
  let S2 = null != (i3 = null != r3 ? r3 : C.get(g2.type)) ? i3 : j;
  const I2 = ["checkbox", "radio", "switch"].includes(g2.type), A2 = !r3 && (!g2.type || x.includes(g2.type)), E2 = A2 ? { for: w2 } : { tag: "span" }, O2 = A2 ? {} : { "aria-labelledby": z2 };
  let D2, M2;
  if (I2 ? (b3 ? (M2 = $(l({ bsSize: d3 }, E2), s3), u3 = (null != u3 ? u3 : "") + " mt-2", D2 = S2(l({ bsSize: d3, name: o2, id: w2, class: u3 }, g2), ...n4)) : (M2 = null, D2 = S2(l({ bsSize: d3, name: o2, id: w2, class: u3, label: s3 }, g2), ...n4)), n4 = []) : (M2 = s3 ? $(l({ id: z2, bsSize: d3 }, E2), s3) : null, D2 = S2(l({ bsSize: d3, name: o2, id: w2, class: u3 }, O2, g2))), v2) {
    let [e, t8] = v2.split(" ");
    t8 = t8 || 12 - Number(e);
    var N2 = [];
    return N2.push(M2 ? $(l({ bsSize: d3, col: e, id: z2 }, E2), s3) : h({ class: e ? `col-${e}` : "col" })), N2.push(h({ class: t8 ? `col-${t8}` : "col" }, D2, ...n4)), N2;
  }
  if (p3) return h({ class: p3 }, M2, D2, ...n4);
  const L2 = { id: y2 };
  return c3 && (L2.class = van_default.val(c3)), h(L2, M2, D2, ...n4);
}
function T({ values: t8 } = {}) {
  var a3 = [], n4 = 1, i3 = { values: l({}, null != t8 ? t8 : {}), onChange: (e) => (a3.push(e), () => i3.offChange(e)), offChange(e) {
    a3 = a3.filter((l3) => l3 !== e);
  }, emitChange(e, l3, t9) {
    a3.forEach((a4) => a4(e, l3, t9));
  }, handleInput(l3) {
    let { name: t9, value: a4 } = l3.target;
    var n5;
    van_default.val(n5 = i3.values[t9]) !== n5 ? i3.values[t9].val = a4 : i3.values[t9] = a4, i3.emitChange(t9, a4, l3);
  }, args(e = {}) {
    var l3;
    let { name: t9 = "v" + n4++, value: a4, oninput: o2 = i3.handleInput } = e;
    return a4 = null != (l3 = null != a4 ? a4 : i3.values[t9]) ? l3 : "", i3.values[t9] = a4, { name: t9, value: a4, oninput: o2 };
  } };
  return i3;
}
function _({ dom: a3, values: n4, rowClass: i3 = "", formClass: o2 = "", cols: s3, autoRow: r3, inline: c3, bsSize: u3, id: d3, onChange: v2 } = {}) {
  const p3 = (e) => {
    let l3 = Number(e);
    return isNaN(l3) ? 0 : l3;
  };
  var f3 = T({ values: n4 });
  v2 && f3.onChange(v2), a3 || (a3 = van_default.tags.form(o2 ? { class: o2 } : {}));
  var b3 = l({}, f3, { dom: a3, row: null, rowClass: i3, cols: s3, autoRow: r3, colCount: 0, id: null != d3 ? d3 : k(), valid: {}, onvalidate: {}, getFormValid: () => Object.keys(b3.valid).every((e) => b3.valid[e].val), add(a4 = {}, ...n5) {
    let { name: i4, value: o3, oninput: s4, cols: r4, onvalidate: d4 } = a4, v3 = t(a4, m);
    void 0 === o3 && i4 && (o3 = b3.values[i4]);
    let g2 = l({}, v3, f3.args({ name: i4, value: o3, oninput: s4 }));
    if (g2.id = g2.id || b3.id + "-" + g2.name, c3 && !a4.id && (g2.id += "-i"), u3 && void 0 === g2.bsSize && (g2.bsSize = u3), g2.cols = r4 || b3.cols || "", b3.autoRow && !c3 && (r4 = ((e) => {
      let [l3, t8] = e.split(" ");
      return l3 = p3(l3), t8 = p3(t8), t8 = t8 || 12 - l3, { l: l3, r: t8, t: l3 + t8, s: l3 + " " + t8 };
    })(g2.cols), b3.row || (b3.addRow(), b3.colCount = 0), b3.colCount += r4.t, g2.cols = r4.s, b3.colCount > 12 && (b3.addRow(), b3.colCount = r4.t)), d4 && (b3.onvalidate[g2.name] = d4, b3.valid[g2.name] = van_default.state(d4(b3.values[g2.name])), g2.isvalid = b3.valid[g2.name]), c3) {
      if (b3.row || b3.addRow(), delete g2.cols, ["checkbox", "radio", "switch"].includes(a4.type)) return b3.addChildren(h({ class: "input-group-text" }, L(g2)), ...n5), b3;
      if ("combobox" === a4.type && (g2.inline = true), g2.label) {
        const e = g2.label;
        return delete g2.label, b3.addChildren(h({ class: "input-group-text" }, e), L(g2), ...n5), b3;
      }
      return b3.addChildren(L(g2), ...n5), b3;
    }
    return b3.addChildren(R(g2, ...n5)), b3;
  }, addRow: (l3) => (b3.colCount = 0, null === l3 ? (b3.row = null, b3) : "string" == typeof l3 ? (b3.row = h({ class: l3 }), van_default.add(b3.dom, b3.row), b3) : !l3 && c3 ? (b3.row = (() => {
    let e = "input-group";
    return "sm" === u3 && (e += " input-group-sm"), "lg" === u3 && (e += " input-group-lg"), i3 && (e += " " + i3), h({ class: e });
  })(), van_default.add(b3.dom, b3.row), b3) : l3 ? (b3.row = l3, van_default.add(b3.dom, b3.row), b3) : (b3.row = h({ class: "row" + (b3.rowClass ? " " + b3.rowClass : "") }), van_default.add(b3.dom, b3.row), b3)), addChildren(...l3) {
    var t8;
    return van_default.add(null != (t8 = b3.row) ? t8 : b3.dom, ...l3), b3;
  }, groupIdByName: (e) => b3.id + "-" + e, inputIdByName: (e) => b3.id + "-" + e + "-i", labelIdByName: (e) => b3.id + "-" + e + "-l", getInputElement(e) {
    var l3;
    const t8 = b3.id + "-" + e + "-i";
    var a4;
    try {
      a4 = b3.dom.querySelectorAll("#" + t8)[0];
    } catch (e2) {
    }
    return a4 || (a4 = null == (l3 = document) ? void 0 : l3.getElementById(t8)), a4;
  }, setValuesImmediately(e) {
    for (const [l3, t8] of Object.entries(e)) {
      b3.values[l3] = t8, b3.onvalidate[l3] && (b3.valid[l3].val = b3.onvalidate[l3](t8));
      let e2 = b3.getInputElement(l3);
      e2 && ("checkbox" === e2.type ? e2.checked = !!t8 : e2.value = t8, b3.onvalidate[l3] && V(e2, b3.valid[l3].val));
    }
  }, setValues(e) {
    setTimeout(() => b3.setValuesImmediately(e), 80);
  } });
  return b3.onChange((e, l3) => {
    b3.onvalidate[e] && (b3.valid[e].val = b3.onvalidate[e](l3));
  }), b3;
}
function P(a3, n4) {
  let { bsSize: i3, class: o2, color: s3 = "secondary", outline: r3, dropdown: c3, type: u3 = "button" } = a3, d3 = t(a3, b);
  return van_default.val(c3) && (d3["data-bs-toggle"] = "dropdown"), g(l({ type: u3, class: () => {
    let l3 = "btn";
    return van_default.val(s3) && (van_default.val(r3) ? l3 += " btn-outline-" + van_default.val(s3) : l3 += " btn-" + van_default.val(s3)), van_default.val(i3) && (l3 += " btn-" + van_default.val(i3)), van_default.val(c3) && (l3 += " dropdown-toggle"), van_default.val(o2) && (l3 += " " + van_default.val(o2)), l3;
  } }, d3), n4);
}
function V(e, l3) {
  e && (e.classList.toggle("is_valid", l3), e.classList.toggle("is_invalid", !l3));
}
C.set("text", j), C.set("textarea", I), C.set("select", A), C.set("radioselect", E), C.set("checkbox", O), C.set("radio", O), C.set("switch", O);
var B = ["options", "style", "bsSize", "onitemclick", "afteritemclick", "disabled"];
function W(a3) {
  const { a: i3, div: o2, ul: s3, li: r3 } = van_default.tags;
  var { options: c3 = [], onitemclick: u3, disabled: d3 } = a3, v2 = t(a3, B);
  c3 = n(c3);
  var p3 = van_default.state(m2(c3, van_default.val(a3.value)));
  function f3(e, l3) {
    let t8 = e.find((e2) => e2.children === l3);
    return t8 && (l3 = t8.value), l3;
  }
  function m2(e, l3) {
    var t8 = e.find((e2) => e2.value === l3);
    return t8 && (l3 = t8.children), l3;
  }
  return o2({ style: van_default.val(a3.style), class: () => {
    let l3 = "input-group";
    return van_default.val(a3.bsSize) && (l3 += " input-group-" + van_default.val(a3.bsSize)), van_default.val(a3.class) && (l3 += " " + van_default.val(a3.class)), l3;
  } }, j(l({}, v2, { disabled: d3, value: p3, oninput: (e) => {
    let { value: l3 } = e.target;
    p3.val = l3, a3.oninput({ target: { value: f3(c3, l3), name: a3.name, type: a3.type } });
  } })), P({ dropdown: "true", disabled: d3 }), s3({ class: "dropdown-menu" }, c3.map((e) => r3(i3({ class: "dropdown-item", href: "javascript:void(0);", onclick: (l3) => (l3.preventDefault(), (function(e2) {
    let { name: l4, type: t8 } = a3;
    if (e2 = f3(c3, e2), u3) {
      let l5 = c3.find((l6) => l6.children === e2), t9 = u3(e2, l5);
      void 0 !== t9 && (e2 = t9);
    }
    p3.val = m2(c3, e2), a3.oninput && a3.oninput({ target: { name: l4, value: e2, type: t8 } }), a3.afteritemclick && a3.afteritemclick({ target: { name: l4, value: e2, type: t8 } });
  })(e.children), false) }, e.children)))));
}
C.set("comboboxp", W);
var H = ["options", "style", "bsSize", "disabled", "inline", "type"];
function q(a3) {
  const { div: i3, ul: o2, li: s3 } = van_default.tags;
  var { options: r3 = [], style: c3, bsSize: u3, disabled: d3, inline: v2 } = a3, p3 = t(a3, H);
  a3.name || (a3.name = "cb_" + Math.random().toString(36).substring(2, 9)), a3.id || (a3.id = "cbi_" + Math.random().toString(36).substring(2, 9));
  const f3 = a3.id + "-options", m2 = (e) => f3 + "-" + e;
  r3 = n(r3);
  var b3 = van_default.state((function(e, l3) {
    var t8 = e.find((e2) => e2.value === l3);
    return t8 && (l3 = t8.children), l3;
  })(r3, van_default.val(a3.value)));
  const g2 = van_default.state(false);
  function h2(e, l3) {
    let t8 = e.find((e2) => e2.children === l3);
    return t8 && (l3 = t8.value), l3;
  }
  function y2(e) {
    b3.val = e, a3.oninput && a3.oninput({ target: { value: h2(r3, e), name: a3.name, type: a3.type } });
  }
  function w2(e) {
    return y2(e), g2.val = false, false;
  }
  const z2 = { class: () => {
    let l3 = "d-flex flex-row form-control";
    return van_default.val(u3) && (l3 += " form-control-" + van_default.val(u3)), van_default.val(a3.class) && (l3 += " " + van_default.val(a3.class)), l3;
  }, style: () => {
    let l3 = "padding:0;";
    return van_default.val(c3) && (l3 += "; " + van_default.val(c3)), l3;
  }, onfocusout: (e) => {
    e.currentTarget.contains(e.relatedTarget) || (g2.val = false);
  } };
  void 0 !== a3.value && (z2.value = a3.value);
  const S2 = van_default.val(u3) ? "input-group input-group-" + van_default.val(u3) : "input-group";
  let k2;
  return v2 ? (k2 = (...e) => i3(z2, ...e), p3.class = (p3.class || "") + " rounded-0") : k2 = (...e) => i3(z2, i3({ class: S2 }, ...e)), k2(j(l({}, p3, { bsSize: u3, disabled: d3, value: b3, role: "combobox", "aria-autocomplete": "list", "aria-haspopup": "listbox", "aria-controls": f3, "aria-expanded": () => g2.val, onfocus: (e) => {
    p3.onfocus && p3.onfocus(e);
  }, oninput: (e) => {
    y2(e.target.value);
  }, onkeydown: (e) => {
    if (!r3.length || "ArrowDown" !== e.key && "ArrowUp" !== e.key) r3.length && "Enter" === e.key && g2.val ? (e.preventDefault(), w2(b3.val)) : "Escape" === e.key && g2.val && (e.preventDefault(), g2.val = false);
    else {
      e.preventDefault(), g2.val || (g2.val = true);
      const l3 = "ArrowDown" === e.key ? 1 : -1, t8 = r3.findIndex((e2) => b3.val === e2.children);
      y2(r3[t8 < 0 ? l3 > 0 ? 0 : r3.length - 1 : (t8 + l3 + r3.length) % r3.length].children);
    }
    p3.onkeydown && p3.onkeydown(e);
  } })), o2({ id: f3, role: "listbox", class: "dropdown-menu", style: () => `top:100%;left:0;right:0;max-height:16rem;overflow-y:auto;cursor:default;display: ${g2.val ? "block" : "none"};` }, r3.map((l3, t8) => s3(van_default.tags.button({ id: m2(t8), class: () => "dropdown-item" + (l3.children === b3.val ? " active" : ""), type: "button", role: "button", onmousedown: (e) => e.preventDefault(), onclick: () => w2(l3.children) }, l3.children)))), van_default.tags.span({ class: "input-group-text" + (v2 ? " rounded-0" : ""), style: "user-select:none;", role: "button", "aria-label": "Show options", "aria-haspopup": "listbox", "aria-controls": f3, "aria-expanded": () => g2.val, tabindex: -1, onclick: () => {
    g2.val = !g2.val;
  } }, "\u25BE"));
}
C.set("combobox", q);
var F = ["class", "containerClass", "sticky", "menu", "t"];
var U = ["href", "label", "icon", "items", "level", "Comp", "hidden", "t"];
var G = ["label", "class", "active", "disabled", "divider", "level"];
var J = ["label", "items", "t", "level"];
var { div: K, button: Q, hr: X, span: Y, nav: Z, a: ee, ul: le, li: te } = van_default.tags;
var ae = "javascript:void(0);";
function ne(a3) {
  let { class: n4, containerClass: i3 = "container-fluid align-items-center", sticky: o2 = true, menu: s3, t: r3 = (e) => e } = a3;
  t(a3, F);
  const c3 = s3.appendix || null;
  return delete s3.appendix, Z({ class: () => {
    let l3 = "navbar navbar-expand-lg bg-body-tertiary";
    return o2 && (l3 += " sticky-top"), van_default.val(n4) && (l3 += " " + van_default.val(n4)), l3;
  } }, K({ class: i3 }, s3.brand, Q({ class: "navbar-toggler", type: "button", "data-bs-toggle": "collapse", "data-bs-target": "#navbarSupportedContent", "aria-controls": "navbarSupportedContent", "aria-expanded": "false", "aria-label": "Toggle navigation" }, Y({ class: "navbar-toggler-icon" })), K({ class: "collapse navbar-collapse", id: "navbarSupportedContent" }, le({ class: "me-auto navbar-nav" }, s3.items.map((e) => "function" == typeof e ? e() : ie(l({}, e, { t: r3 })))), c3)));
}
function ie(a3) {
  let { href: n4 = ae, label: i3, icon: o2, items: s3, level: r3 = 0, Comp: c3, hidden: u3 = false, t: d3 = (e) => e } = a3, v2 = t(a3, U);
  return "function" == typeof u3 && (u3 = u3()), u3 ? null : ("function" == typeof i3 && (i3 = i3()), i3 = i3 ? d3(van_default.val(i3)) : "", v2.title && (v2.title = d3(van_default.val(v2.title))), s3 ? se(l({ label: i3, items: s3, level: r3, t: d3 }, v2)) : te({ class: () => {
    let l3 = "nav-item";
    return 0 !== r3 && (l3 = ""), van_default.val(v2.class) && (l3 += " " + van_default.val(v2.class)), l3;
  } }, c3 ? c3(l({ href: n4, label: i3, icon: o2, items: s3, level: r3, hidden: u3, t: d3 }, v2)) : oe(l({}, v2, { href: n4, label: i3, level: r3 }))));
}
function oe(a3) {
  let { label: n4, class: i3, active: o2, disabled: s3, divider: r3, level: c3 = 0 } = a3, u3 = t(a3, G);
  return r3 ? X({ class: "dropdown-divider" }) : ee(l({ class: () => {
    let l3 = "nav-link";
    return 0 !== c3 && (l3 = "dropdown-item"), van_default.val(o2) && (l3 += " active"), van_default.val(o2) && 0 === c3 && (l3 += " text-primary"), van_default.val(s3) && (l3 += " disabled"), van_default.val(i3) && (l3 += " " + van_default.val(i3)), l3;
  }, href: ae }, u3), n4);
}
function se(e) {
  let { label: a3, items: n4, t: i3 = (e2) => e2, level: o2 } = e, s3 = t(e, J);
  return o2 > 0 ? te({}, ee({ class: "dropdown-item", href: ae }, a3 + " \xBB"), le({ class: "submenu dropdown-menu" }, n4.map((e2) => ie(l({ level: o2 + 1, t: i3 }, e2))))) : te({ class: "nav-item dropdown", id: "NavDropdown" + o2 }, ee({ class: "nav-link dropdown-toggle", href: ae, "data-bs-toggle": "dropdown" }, a3), le({ class: "dropdown-menu" }, n4.map((e2) => ie(l({ level: o2 + 1 }, e2, { t: i3 }, s3)))));
}
function re(e) {
  const l3 = e.match(/^<([a-z0-9-]+)([^>]*)-?>/i);
  if (!l3) return {};
  const t8 = l3[2], a3 = {}, n4 = /([a-z0-9-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
  let i3;
  for (; null !== (i3 = n4.exec(t8)); ) {
    var o2, s3, r3;
    const e2 = null != (o2 = null != (s3 = null != (r3 = i3[2]) ? r3 : i3[3]) ? s3 : i3[4]) ? o2 : "";
    a3[i3[1]] = e2;
  }
  return a3;
}
function ce(e, l3) {
  const t8 = Object.entries(l3).map(([e2, l4]) => `${e2}="${l4}"`).join(" ");
  return e.replace(/^<([a-z0-9-]+)[^>]*>/i, (e2, l4) => {
    const a3 = t8 ? " " : "", n4 = e2.trim().endsWith("/>") ? " /" : "";
    return `<${l4}${a3}${t8}${n4}>`;
  });
}
var ue = ["size"];
var de = /* @__PURE__ */ new Map();
function ve(e) {
  return "string" == typeof e && de.get(e);
}
function pe(e, l3) {
  de.set(e, l3);
}
function fe(e, l3) {
  if ("string" != typeof e) return null;
  "object" == typeof l3 && (e = me(e, l3));
  const t8 = document.createElement("div");
  return "undefined" != typeof window ? (t8.innerHTML = e, t8.firstChild) : (t8.outerHTML = e, t8);
}
function me(e, l3) {
  if (e && l3) {
    l3.size && (l3.width = l3.size, l3.height = l3.size);
    const t8 = re(e);
    Object.entries(l3).forEach(([e2, l4]) => {
      "size" !== e2 && void 0 !== l4 && (t8[e2] = l4);
    }), e = ce(e, t8);
  }
  return e;
}
function be(a3, n4 = {}) {
  let { size: i3 } = n4, o2 = t(n4, ue);
  if ("string" == typeof a3) {
    const e = ve(a3);
    e && (a3 = e);
  }
  if ("function" == typeof a3) return void 0 !== i3 && (o2.size = i3), i3 = i3 || o2.size || "1em", delete o2.size, o2.width = i3, o2.height = i3, a3(l({}, o2));
  if ("string" == typeof a3 && a3.startsWith("fa")) return void 0 !== i3 && (o2.style = o2.style = l({}, o2.style || {}, { fontSize: i3 })), o2.class = o2.class ? o2.class + " " + a3 : a3, van_default.tags.i(l({}, o2));
  if ("string" == typeof a3 && a3.toLowerCase().startsWith("<svg ")) return i3 = void 0 === i3 ? "1em" : i3, fe(a3, l({ size: i3 }, o2));
  if ("string" == typeof a3) {
    let l3 = "";
    return void 0 !== i3 && (l3 = `font-size:${i3};`), o2.style && (l3 += o2.style), l3 && (o2.style = l3), van_default.tags.span(o2, a3);
  }
  if (a3.src) return void 0 === i3 && (i3 = "1em"), o2.style = (o2.style || a3.style || "") + `width:${i3}; height:${i3};`, o2.alt = a3.alt || o2.alt || a3.src.split("/").pop().split(".").shift(), o2 = l({}, a3, o2), van_default.tags.img(o2);
  i3 = void 0 === i3 ? "1em" : i3;
  let s3 = `width:${i3}; height:${i3}; min-width:${i3};`;
  return o2.style && (s3 += o2.style), o2.style = s3, van_default.tags.div(l({}, o2));
}
function ge(e) {
  const { idPrefix: l3 = "icon-", svgClass: t8, spriteId: a3, toDOM: n4 = false, prettify: i3 = false, map: o2 = de } = e || {};
  function s3(e2, l4) {
    let t9 = e2.replace(/<svg/i, `<symbol id="${l4}"`);
    t9 = t9.replace(/<\/svg>/i, "</symbol>");
    const a4 = re(t9);
    return delete a4.xmlns, delete a4.width, delete a4.height, t9 = ce(t9, a4), t9;
  }
  const r3 = [];
  for (const e2 of o2.keys()) {
    const a4 = o2.get(e2);
    if ("string" == typeof a4 && "<svg " === a4.slice(0, 5).toLowerCase()) {
      const n5 = l3 + e2;
      r3.push(s3(a4, n5)), o2.set(e2, `<svg ${t8 ? 'class="' + t8 + '"' : ""}><use href="#${n5}"></use></svg>`);
    }
  }
  if (!r3.length) return "";
  let c3 = `<svg ${a3 ? 'id="' + a3 + '"' : ""} style="display: none;" xmlns="http://w3.org">`;
  return i3 && (c3 += "\n  "), c3 += r3.join(i3 ? "\n  " : ""), i3 && (c3 += "\n"), c3 += "</svg>", n4 && document.body.appendChild(be(c3)), c3;
}
de.set("SPACE", (e) => be("\u2001", l({}, e))), van_default.val = (e) => e && "object" == typeof e && "val" in e ? e.val : e;
var he = "1.2.0";
var ye = "vanjs-bootstrap 1.2.0 LICENSE MIT (c) 2026 by Willi Commer";

// client/icons.js
pe("LOGO", (props) => be({ src: "./gallery-64x64.png", ...props }));
pe("theme light", (props) => be("SUN", props));
pe("theme dark", (props) => be("MOON", props));
pe("BARS", '<svg viewBox="0 0 448 512"  fill="currentColor" ><path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"/></svg>');
pe("EYE", '<svg viewBox="0 0 576 512" stroke="currentColor" fill="currentColor"><path d="M160 256C160 185.3 217.3 128 288 128C358.7 128 416 185.3 416 256C416 326.7 358.7 384 288 384C217.3 384 160 326.7 160 256zM288 336C332.2 336 368 300.2 368 256C368 211.8 332.2 176 288 176C287.3 176 286.7 176 285.1 176C287.3 181.1 288 186.5 288 192C288 227.3 259.3 256 224 256C218.5 256 213.1 255.3 208 253.1C208 254.7 208 255.3 208 255.1C208 300.2 243.8 336 288 336L288 336zM95.42 112.6C142.5 68.84 207.2 32 288 32C368.8 32 433.5 68.84 480.6 112.6C527.4 156 558.7 207.1 573.5 243.7C576.8 251.6 576.8 260.4 573.5 268.3C558.7 304 527.4 355.1 480.6 399.4C433.5 443.2 368.8 480 288 480C207.2 480 142.5 443.2 95.42 399.4C48.62 355.1 17.34 304 2.461 268.3C-.8205 260.4-.8205 251.6 2.461 243.7C17.34 207.1 48.62 156 95.42 112.6V112.6zM288 80C222.8 80 169.2 109.6 128.1 147.7C89.6 183.5 63.02 225.1 49.44 256C63.02 286 89.6 328.5 128.1 364.3C169.2 402.4 222.8 432 288 432C353.2 432 406.8 402.4 447.9 364.3C486.4 328.5 512.1 286 526.6 256C512.1 225.1 486.4 183.5 447.9 147.7C406.8 109.6 353.2 80 288 80V80z"></path></svg>');
pe("CLOSE", '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path></svg>');
pe("bsCaretDown", '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"></path></svg>');
pe("INSERT", '<svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="200px" width="200px" xmlns="http://www.w3.org/2000/svg"><path d="M9 8C8.44772 8 8 8.44772 8 9C8 9.55229 8.44772 10 9 10H11V12C11 12.5523 11.4477 13 12 13C12.5523 13 13 12.5523 13 12V10H15C15.5523 10 16 9.55229 16 9C16 8.44772 15.5523 8 15 8H13V6C13 5.44772 12.5523 5 12 5C11.4477 5 11 5.44772 11 6V8H9Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M4 4C4 2.34315 5.34315 1 7 1H17C18.6569 1 20 2.34315 20 4V14C20 15.6569 18.6569 17 17 17H7C5.34315 17 4 15.6569 4 14V4ZM7 3H17C17.5523 3 18 3.44772 18 4V14C18 14.5523 17.5523 15 17 15H7C6.44772 15 6 14.5523 6 14V4C6 3.44772 6.44772 3 7 3Z" fill="currentColor"></path><path d="M5 20C4.44772 20 4 20.4477 4 21C4 21.5523 4.44772 22 5 22H19C19.5523 22 20 21.5523 20 21C20 20.4477 19.5523 20 19 20H5Z" fill="currentColor"></path></svg>');
pe("CREATE", '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"></path><path d="M2 13h10"></path><path d="m9 16 3-3-3-3"></path></svg>');
pe("ADDPICT", '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M18 20H4V6h9V4H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-9h-2v9zm-7.79-3.17-1.96-2.36L5.5 18h11l-3.54-4.71zM20 4V1h-2v3h-3c.01.01 0 2 0 2h3v2.99c.01.01 2 0 2 0V6h3V4h-3z"></path></svg>');
pe("ROTATELEFT", '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M125.7 160l50.3 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L48 224c-17.7 0-32-14.3-32-32L16 64c0-17.7 14.3-32 32-32s32 14.3 32 32l0 51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3s-163.8-62.5-226.3 0L125.7 160z"></path></svg>');
pe("ROTATERIGHT", '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32l0-128c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z"></path></svg>');
pe("FILE", '<svg viewBox="0 0 384 512" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"></path></svg>');
pe("PROJECT", '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM4 19V5h7v14H4zm9 0V5h7l.001 14H13z"></path><path d="M15 7h3v2h-3zm0 4h3v2h-3z"></path></svg>');
pe("IMAGELIST", '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M149.333 216v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24v-80c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zM125.333 32H24C10.745 32 0 42.745 0 56v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24zm80 448H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm-24-424v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24zm24 264H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24z"></path></svg>');
pe("GALLERY", '<svg version="1.1" viewBox="0 0 17 17" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g></g><path d="M13 10v-10h-13v13h13v-3zM1 1h11v8h-0.755l-2.564-3.319-1.159 1.214-2.248-3.881-3.576 5.986h-0.698v-8zM9.982 9h-7.119l2.398-4.014 2.064 3.564 1.275-1.337 1.382 1.787zM1 12v-2h11v2h-11zM17 3v13h-13v-1.984h1v0.984h11v-11h-2v-1h3z"></path></svg>');
pe("OPTIONS", '<svg viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M32 384h272v32H32zM400 384h80v32h-80zM384 447.5c0 17.949-14.327 32.5-32 32.5-17.673 0-32-14.551-32-32.5v-95c0-17.949 14.327-32.5 32-32.5 17.673 0 32 14.551 32 32.5v95z"></path><g><path d="M32 240h80v32H32zM208 240h272v32H208zM192 303.5c0 17.949-14.327 32.5-32 32.5-17.673 0-32-14.551-32-32.5v-95c0-17.949 14.327-32.5 32-32.5 17.673 0 32 14.551 32 32.5v95z"></path></g><g><path d="M32 96h272v32H32zM400 96h80v32h-80zM384 159.5c0 17.949-14.327 32.5-32 32.5-17.673 0-32-14.551-32-32.5v-95c0-17.949 14.327-32.5 32-32.5 17.673 0 32 14.551 32 32.5v95z"></path></g></svg>');
pe("FILE-DOWN", '<svg viewBox="0 0 384 512" stroke="currentColor" fill="currentColor"><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232V334.1l31-31c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-72 72c-9.4 9.4-24.6 9.4-33.9 0l-72-72c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l31 31V232c0-13.3 10.7-24 24-24s24 10.7 24 24z"/></svg>');
pe("MOON", '<svg viewBox="0 0 384 512" stroke="currentColor" fill="currentColor"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg>');
pe("SUN", '<svg viewBox="0 0 512 512" stroke="currentColor" fill="currentColor"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM352 256c0 53-43 96-96 96s-96-43-96-96s43-96 96-96s96 43 96 96zm32 0c0-70.7-57.3-128-128-128s-128 57.3-128 128s57.3 128 128 128s128-57.3 128-128z"/></svg>');
pe("deleteItem", '<svg viewBox="0 0 448 512" fill="currentColor" stroke="currentColor"><path d="M160 400C160 408.8 152.8 416 144 416C135.2 416 128 408.8 128 400V192C128 183.2 135.2 176 144 176C152.8 176 160 183.2 160 192V400zM240 400C240 408.8 232.8 416 224 416C215.2 416 208 408.8 208 400V192C208 183.2 215.2 176 224 176C232.8 176 240 183.2 240 192V400zM320 400C320 408.8 312.8 416 304 416C295.2 416 288 408.8 288 400V192C288 183.2 295.2 176 304 176C312.8 176 320 183.2 320 192V400zM317.5 24.94L354.2 80H424C437.3 80 448 90.75 448 104C448 117.3 437.3 128 424 128H416V432C416 476.2 380.2 512 336 512H112C67.82 512 32 476.2 32 432V128H24C10.75 128 0 117.3 0 104C0 90.75 10.75 80 24 80H93.82L130.5 24.94C140.9 9.357 158.4 0 177.1 0H270.9C289.6 0 307.1 9.358 317.5 24.94H317.5zM151.5 80H296.5L277.5 51.56C276 49.34 273.5 48 270.9 48H177.1C174.5 48 171.1 49.34 170.5 51.56L151.5 80zM80 432C80 449.7 94.33 464 112 464H336C353.7 464 368 449.7 368 432V128H80V432z" /></svg>');
pe("CHECK", '<svg viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path></svg>');

// client/event-emitter.js
var EventEmitter = class {
  constructor() {
    this.events = {};
  }
  on(event2, listener) {
    if (typeof this.events[event2] !== "object") {
      this.events[event2] = [];
    }
    this.events[event2].push(listener);
    return () => this.off(event2, listener);
  }
  off(event2, listener) {
    if (typeof this.events[event2] === "object") {
      const idx = this.events[event2].indexOf(listener);
      if (idx > -1) {
        this.events[event2].splice(idx, 1);
      }
    }
  }
  emit(event2, ...args) {
    if (typeof this.events[event2] === "object") {
      this.events[event2].forEach((listener) => listener.apply(this, args));
    }
  }
  once(event2, listener) {
    const remove = this.on(
      event2,
      (...args) => {
        remove();
        listener.apply(this, args);
      }
    );
  }
};

// client/file-service/file-service-api.js
var file_service_api_exports = {};
__export(file_service_api_exports, {
  exists: () => exists,
  fsURL: () => fsURL,
  getDir: () => getDir,
  getFileSystemPath: () => getFileSystemPath,
  getURL: () => getURL,
  mkDir: () => mkDir,
  normalizeFilename: () => normalizeFilename,
  open: () => open,
  readTextFile: () => readTextFile,
  setURL: () => setURL,
  trash: () => trash,
  trashFile: () => trashFile,
  writeFile: () => writeFile
});

// client/file-service/joinpaths.js
function joinPaths(...paths) {
  const raw = paths.filter((p3) => typeof p3 === "string" && p3.length > 0).join("/").replace(/\\/g, "/");
  if (!raw) return "";
  const isAbsolute = raw.startsWith("/");
  const hasTrailingSlash = raw.endsWith("/") && raw.length > 1;
  const parts = raw.split("/");
  const stack = [];
  for (const part of parts) {
    if (!part || part === ".") continue;
    if (part === "..") {
      if (stack.length > 0 && stack[stack.length - 1] !== "..") {
        stack.pop();
      } else if (!isAbsolute) {
        stack.push("..");
      }
    } else {
      stack.push(part);
    }
  }
  let result = (isAbsolute ? "/" : "") + stack.join("/");
  if (hasTrailingSlash && result !== "/") {
    result += "/";
  }
  return result === "." ? "" : result;
}

// client/file-service/parse-path.js
function parsePath(pathString) {
  const normalized = pathString.replace(/\\/g, "/");
  let root = "";
  const driveMatch = normalized.match(/^([a-zA-Z]:)/);
  if (driveMatch) {
    root = normalized[2] === "/" ? driveMatch[1] + "/" : driveMatch[1];
  } else if (normalized.startsWith("/")) {
    root = "/";
  }
  const lastSlashIndex = normalized.lastIndexOf("/");
  let dir = "";
  let base = normalized;
  if (lastSlashIndex !== -1) {
    base = normalized.slice(lastSlashIndex + 1);
    dir = normalized.slice(0, lastSlashIndex);
    if (dir === "/" || dir === driveMatch?.[1]) {
      dir = root;
    }
  } else if (driveMatch && root === driveMatch[1]) {
    dir = root;
  }
  let path = "";
  if (dir && dir !== root) {
    path = dir.slice(root.length);
    if (path.startsWith("/")) {
      path = path.slice(1);
    }
  }
  const lastDotIndex = base.lastIndexOf(".");
  let name = base;
  let ext = "";
  if (lastDotIndex > 0) {
    name = base.slice(0, lastDotIndex);
    ext = base.slice(lastDotIndex);
  }
  return { root, dir, path, base, name, ext };
}
var parse_path_default = parsePath;

// client/file-service/file-service-api.js
var fsURL = "/app/file";
function setURL(url) {
  fsURL = url;
}
function getURL(filename) {
  const parsed = parse_path_default(filename);
  const url = joinPaths(fsURL, "get", parsed.path, parsed.base);
  return url;
}
async function postJson(command, data) {
  try {
    const response = await fetch(fsURL + "/" + command, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}
async function getDir(path = "") {
  return await postJson("files", { path });
}
async function mkDir(path, newDir) {
  if (typeof path === "string")
    path = path.split("/");
  if (newDir) path.push(newDir);
  return await postJson("mkdir", { path });
}
async function readTextFile(filename) {
  try {
    const response = await fetch(fsURL + "/readtextfile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename })
    });
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}
async function writeFile(filename, content) {
  return await postJson("write", { filename, content });
}
async function exists(filename) {
  return await postJson("exists", { filename });
}
async function trashFile(filename) {
  return await postJson("trash", { filename });
}
async function trash(directory, files) {
  return await postJson("trash", { directory, files });
}
async function open(filename, args) {
  return await postJson("open", { filename, args });
}
async function getFileSystemPath(path) {
  const info = await exists(path);
  return info?.path;
}
async function normalizeFilename(filename) {
  const fullName = await getFileSystemPath(filename) || filename;
  return joinPaths(fullName);
}

// client/file-service/file-tools.js
var file_tools_exports = {};
__export(file_tools_exports, {
  Directory: () => Directory,
  FileIcon: () => FileIcon,
  FileItem: () => FileItem,
  MIME_GROUPS: () => MIME_GROUPS,
  fileExtension: () => fileExtension,
  fileIsMime: () => fileIsMime,
  isValidDirectoryName: () => isValidDirectoryName,
  isValidFilename: () => isValidFilename
});

// client/file-service/sorter.js
function compareAny(a3, b3) {
  if (typeof a3 === "string" && typeof b3 === "string")
    return a3.localeCompare(b3);
  let result = a3 - b3;
  return Number.isNaN(result) ? 0 : result;
}
function parseSortList(cols = []) {
  if (typeof cols === "string")
    cols = cols.split(",");
  return cols.map((e) => {
    e = String(e);
    let key = e;
    let desc = e[0] === "-";
    if (desc) key = e.substring(1);
    var path = key.split(".");
    const val1 = (obj) => obj[key];
    const val2 = (obj) => {
      for (let i3 in path)
        try {
          obj = obj[path[i3]];
        } catch (err) {
          return;
        }
      return obj;
    };
    var val = path.length > 1 ? val2 : val1;
    return { key, desc, val };
  });
}
function sortFunc(cols, compare = compareAny) {
  cols = parseSortList(cols);
  return function(a3, b3) {
    let res = 0;
    for (let i3 = 0; i3 < cols.length; i3++) {
      let aa = cols[i3].val(a3);
      let bb = cols[i3].val(b3);
      ;
      res = compare(aa, bb);
      if (cols[i3].desc) res = -res;
      if (res !== 0) return res;
    }
    return res;
  };
}
function sortList(list, cols, compare = compareAny) {
  if (!list || !list.length || !cols)
    return list;
  return [...list].sort(sortFunc(cols, compare));
}

// node_modules/vanjs-bootstrap/dist/i18n.modern.js
function t2() {
  const t8 = { dict: {}, language: "en", languageDefault: "en", setLanguage(n4) {
    t8.language = String(n4).toLowerCase(), t8.dict[t8.language] || (t8.language = t8.languageDefault);
  }, getLanguage: () => t8.language, t(n4) {
    if ("function" == typeof n4 && (n4 = n4()), !n4) return "";
    var e = (function(t9, n5) {
      try {
        n5 = n5.split(".");
        for (let e2 = 0; e2 < n5.length; e2++) {
          if (!t9) return t9;
          t9 = t9[n5[e2]];
        }
      } catch (t10) {
        return false;
      }
      return t9;
    })(t8.dict[t8.language], n4);
    return e || (e = n4.split(".").pop()), e;
  }, tPath: (n4) => (n4.endsWith(".") || (n4 += "."), function(e) {
    return t8.t(n4 + e);
  }), addWords(e, a3, r3) {
    r3 && (e = { [r3]: e }), a3 && (e = { [a3]: e }), n2(t8.dict, e);
  } };
  return t8;
}
function n2(t8, e) {
  for (var a3 in e) try {
    t8[a3] = e[a3].constructor === Object ? n2(t8[a3], e[a3]) : e[a3];
  } catch (n4) {
    t8[a3] = e[a3];
  }
  return t8;
}

// client/file-service/i18n.js
var I18n = t2();
var i18n_default = I18n;
var addEnDe = (key, ten, tde) => I18n.addWords({ en: { [key]: ten }, de: { [key]: tde } });
addEnDe("Cancel", "Cancel", "Abbrechen");
addEnDe("ButtonCancel", "Cancel", "Abbrechen");
addEnDe("ButtonOpen", "Open", "\xD6ffnen");
addEnDe("ButtonSave", "Save", "Speichern");
addEnDe("ButtonSelectFolder", "Open", "\xD6ffnen");
addEnDe("ButtonNewFolder", "New Folder", "Neu Ordner");
addEnDe("ButtonDeleteSelection", "Delete", "L\xF6schen");
addEnDe("ButtonExplorer", "Explorer", "Explorer");
addEnDe("addDirectory-header", "New Folder", "Neuer Ordner");
addEnDe("AreYouSure-header", "Confirmation", "Best\xE4tigung");
addEnDe("AreYouSure-yes", "Yes", "Ja");
addEnDe("AreYouSure-no", "No", "Nein");
addEnDe("ButtonExplorer", "Explorer", "Explorer");
addEnDe("ButtonExplorer", "Explorer", "Explorer");
I18n.addWords({
  de: {
    "FilesToTrash": "Dateien in den Papierkorb ?"
  },
  en: {
    "FilesToTrash": "Files to Recycle Bin ?"
  }
});
I18n.addWords({
  de: {
    "image-files": "Bild Dateien",
    "audio-files": "Audio Dateien",
    "video-files": "Video Dateien",
    "word-files": "MS-Word Dateien",
    "exel-files": "Excel Dateien",
    "pdf-files": "PDF Dateien",
    "md-files": "Markdown Dateien",
    "svg-files": "SVG Dateien"
  },
  en: {
    "image-files": "Image Files",
    "audio-files": "Audio Files",
    "video-files": "Video Files",
    "word-files": "MS-Word Files",
    "exel-files": "Excel Files",
    "pdf-files": "PDF Files",
    "md-files": "Markdown Files",
    "svg-files": "SVG Files"
  }
});

// client/file-service/file-tools.js
var { t: t3 } = i18n_default;
var FileItem = class {
  /**
   * @param {string|object} [file={}] - Dateiname als String oder ein Objekt {name: string}
   * @param {Directory} directory - Das übergeordnete Verzeichnis (owner)
   * @constructor
   */
  constructor(file = {}, directory) {
    this.directory = directory || new Directory();
    if (typeof file === "string") {
      file = { name: file };
    }
    this.name = file.name;
    this.isDir = file.isDir;
    this.time = file.time;
    this.size = file.size;
    this.ext = fileExtension(this.name);
  }
  /**
   * Vergleicht diese Datei mit einer anderen Datei oder einem Dateinamen.
   * @param {string|FileItem} file - Die zu vergleichende Datei oder der Name.
   * @returns {boolean} True, wenn die Namen übereinstimmen.
   */
  sameAs(file) {
    if (typeof file === "string") return file === this.name;
    return file.name === this.name;
  }
  /**
   * Gibt den Pfad des übergeordneten Verzeichnisses zurück.
   * @type {string}
   */
  get dir() {
    return this.directory.dir;
  }
  /**
   * POSIX path relative to file system root like 'Documents/file.ext'
   * @returns {string}
   */
  get pathName() {
    return [...this.directory.path, this.name].join("/");
  }
  /**
   * file system path POSIX like 'C:/Users/wcs/Document/file.ext'
   * @returns {string}
   */
  get filePath() {
    return joinPaths(this.directory.resolvedDir, this.name);
  }
};
var Directory = class {
  /**
   * 
   * @param {Object} args - options
   * @param {function} args.sort - optional function (FileList)
   * @param {Object} args.filter - optional function (FileList)
   * @param {Array<String>} args.path - optional []
   * @param {Array<FileItem>} args.files - optional []
   * @constructor
   * 
   */
  constructor(args = {}) {
    this.path = args.path || [];
    this.files = [];
    this.sort = args.sort || ((files) => sortList(files, "-isDir,name"));
    this.filter = args.filter || ((files) => files);
    this.filesUrl = fsURL;
    this.setValues(args);
  }
  setValues(args = {}) {
    this.path = args.path || [];
    this.files = [];
    (args.files || []).forEach((f3) => this.addFile(f3));
  }
  /**
   * dir - path string "root/sub"
   */
  get dir() {
    return [...this.path].join("/");
  }
  /**
   * 
   * @param {FileItem} file 
   * @returns {FileItem}
   */
  addFile(file) {
    if (file) {
      file = new FileItem(file, this);
      this.files.push(file);
      return file;
    }
  }
  /**
   * fetch directory files from backend (sorted and filtered)
   * @param {Arra<string> | string} path 
   * @returns {boolean} - "true" or "false" if directory do not exists
   */
  async getDir(path) {
    let data = await getDir(path);
    if (data) {
      this.files = [];
      data.files.forEach((f3) => this.addFile(f3));
      this.files = this.filter(this.files);
      this.files = this.sort(this.files);
      this.path = data.path;
      this.resolvedDir = data.resolvedDir;
      return true;
    }
    return false;
  }
  /**
   * return the file item matching "name"
   * @param {string} name - a file name
   * @returns {FileItem} matching file item in files or undefined
   */
  fileByName(name) {
    if (!name) return;
    return this.files.find((file) => !name.localeCompare(file.name, void 0, { sensitivity: "base" }));
  }
};
function isValidFilename(name) {
  if (typeof name !== "string" || name.length === 0 || name.length > 255) return false;
  if (/[<>:"/\\|?*]/.test(name)) return false;
  if (/[. ]$/.test(name)) return false;
  const reserviert = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(\..*)?$/i;
  if (reserviert.test(name)) return false;
  return name.length > 0;
}
function isValidDirectoryName(name) {
  if (typeof name !== "string" || name.length === 0 || name.length > 255) return false;
  if (/[<>:"/\\|?*]/.test(name)) return false;
  if (/[. ]$/.test(name)) return false;
  const reserviert = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;
  if (reserviert.test(name)) return false;
  if (/[\x00-\x1f]/.test(name)) return false;
  return true;
}
var fileIcon = (name) => (props) => be(`<svg class="file-icon" fill="currentColor" stroke="currenColor"><use href="#icon-file-${name}"></use></svg>`, props);
var extMap = /* @__PURE__ */ new Map();
["png", "tif", "tiff", "wbmp", "ico", "jpeg", "jpg", "bmp", "gif", "svg", "webp"].forEach((e) => extMap.set(e, fileIcon("image")));
["mid", "midi", "kar", "mp3", "ogg", "ra"].forEach((e) => extMap.set(e, fileIcon("audio")));
["doc", "docx"].forEach((e) => extMap.set(e, fileIcon("word")));
["ppt"].forEach((e) => extMap.set(e, fileIcon("powerpoint")));
["xls", "ods", "xlsx"].forEach((e) => extMap.set(e, fileIcon("excel")));
["3gpp", "3gp", "mpeg", "mpg", "mov", "flv", "asx", "asf", "wmv", "avi", "m4p", "mp4"].forEach((e) => extMap.set(e, fileIcon("video")));
["jar", "7z", "rar", "zip", "tgz"].forEach((e) => extMap.set(e, fileIcon("zipper")));
["pdf"].forEach((e) => extMap.set(e, fileIcon("pdf")));
["xml", "js", "jsx", "ts", "wml", "pl", "pm", "go", "java"].forEach((e) => extMap.set(e, fileIcon("code")));
["html", "htm", "shtml", "txt", "rtf", "md"].forEach((e) => extMap.set(e, fileIcon("text")));
function FileIcon({ file, name = "", ext = "", isDir = false, ...props }) {
  if (file) {
    name = file.name;
    isDir = file.isDir;
  }
  if (isDir && name === "..") return be("\u21B0", props);
  if (isDir) return be(
    '<svg viewBox="0 0 36 36"><path fill="#269" d="M0 29c0 2.209 1.791 4 4 4h24c2.209 0 4-1.791 4-4V12c0-2.209-1.791-4-4-4h-9c-3.562 0-3-5-8.438-5H4C1.791 3 0 4.791 0 7v22z"/><path fill="#55ACEE" d="M30 10h-6.562C18 10 18.562 15 15 15H6c-2.209 0-4 1.791-4 4v10c0 .553-.448 1-1 1s-1-.447-1-1c0 2.209 1.791 4 4 4h26c2.209 0 4-1.791 4-4V14c0-2.209-1.791-4-4-4z"/></svg>',
    props
  );
  if (name && !ext) ext = fileExtension(name);
  let ico = extMap.get(ext);
  if (ico) return ico(props);
  return fileIcon("any")(props);
}
function fileExtension(file) {
  let name;
  if (typeof file === "string") {
    name = file;
  } else {
    name = !file || file.isDir ? "" : file.name;
  }
  if (!name) return "";
  let sn = name.split(".");
  let ext = sn.length > 1 ? sn.pop() : "";
  return ext.toLowerCase();
}
var fileSprite = be(`<svg style="display: none;" xmlns="http://w3.org">
  <symbol id="icon-file-word" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM214.6 248C211.3 238.4 202.2 232 192 232s-19.25 6.406-22.62 16L144.7 318.1l-25.89-77.66C114.6 227.8 101 221.2 88.41 225.2C75.83 229.4 69.05 243 73.23 255.6l48 144C124.5 409.3 133.5 415.9 143.8 416c10.17 0 19.45-6.406 22.83-16L192 328.1L217.4 400C220.8 409.6 229.8 416 240 416c10.27-.0938 19.53-6.688 22.77-16.41l48-144c4.188-12.59-2.594-26.16-15.17-30.38c-12.61-4.125-26.2 2.594-30.36 15.19l-25.89 77.66L214.6 248z" /></symbol>
  <symbol id="icon-file-zipper" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0L64-.0001c-35.35 0-64 28.65-64 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h48V64h64V48.13h48.01L224 128c0 17.67 14.33 32 32 32h79.1V448zM176 96h-64v32h64V96zM176 160h-64v32h64V160zM176 224h-64l-30.56 116.5C73.51 379.5 103.7 416 144.3 416c40.26 0 70.45-36.3 62.68-75.15L176 224zM160 368H128c-8.836 0-16-7.164-16-16s7.164-16 16-16h32c8.836 0 16 7.164 16 16S168.8 368 160 368z" /></symbol>
  <symbol id="icon-file-video" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM240 288c0-17.67-14.33-32-32-32h-96c-17.67 0-32 14.33-32 32v96c0 17.67 14.33 32 32 32h96c17.67 0 32-14.33 32-32v-16.52l43.84 30.2C292.3 403.5 304 397.6 304 387.4V284.6c0-10.16-11.64-16.16-20.16-10.32L240 304.5V288z" /></symbol>
  <symbol id="icon-file-powerpoint" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM200 224H128C119.2 224 112 231.2 112 240v168c0 13.25 10.75 24 24 24S160 421.3 160 408v-32h44c44.21 0 79.73-37.95 75.69-82.98C276.1 253.2 240 224 200 224zM204 328H160V272h44c15.44 0 28 12.56 28 28S219.4 328 204 328z" /></symbol>
  <symbol id="icon-file-pdf" viewBox="0 0 384 512"><path d="M320 464C328.8 464 336 456.8 336 448V416H384V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V416H48V448C48 456.8 55.16 464 64 464H320zM256 160C238.3 160 224 145.7 224 128V48H64C55.16 48 48 55.16 48 64V192H0V64C0 28.65 28.65 0 64 0H229.5C246.5 0 262.7 6.743 274.7 18.75L365.3 109.3C377.3 121.3 384 137.5 384 154.5V192H336V160H256zM88 224C118.9 224 144 249.1 144 280C144 310.9 118.9 336 88 336H80V368C80 376.8 72.84 384 64 384C55.16 384 48 376.8 48 368V240C48 231.2 55.16 224 64 224H88zM112 280C112 266.7 101.3 256 88 256H80V304H88C101.3 304 112 293.3 112 280zM160 240C160 231.2 167.2 224 176 224H200C226.5 224 248 245.5 248 272V336C248 362.5 226.5 384 200 384H176C167.2 384 160 376.8 160 368V240zM192 352H200C208.8 352 216 344.8 216 336V272C216 263.2 208.8 256 200 256H192V352zM336 224C344.8 224 352 231.2 352 240C352 248.8 344.8 256 336 256H304V288H336C344.8 288 352 295.2 352 304C352 312.8 344.8 320 336 320H304V368C304 376.8 296.8 384 288 384C279.2 384 272 376.8 272 368V240C272 231.2 279.2 224 288 224H336z" /></symbol>
  <symbol id="icon-file-image" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM215.3 292c-4.68 0-9.051 2.34-11.65 6.234L164 357.8l-11.68-17.53C149.7 336.3 145.3 334 140.7 334c-4.682 0-9.053 2.34-11.65 6.234l-46.67 70c-2.865 4.297-3.131 9.82-.6953 14.37C84.09 429.2 88.84 432 93.1 432h196c5.163 0 9.907-2.844 12.34-7.395c2.436-4.551 2.17-10.07-.6953-14.37l-74.67-112C224.4 294.3 220 292 215.3 292zM128 288c17.67 0 32-14.33 32-32S145.7 224 128 224S96 238.3 96 256S110.3 288 128 288z" /></symbol>
  <symbol id="icon-file-folder" viewBox="0 0 512 512"><path d="M447.1 96h-172.1L226.7 50.75C214.7 38.74 198.5 32 181.5 32H63.1c-35.35 0-64 28.66-64 64v320c0 35.34 28.65 64 64 64h384c35.35 0 64-28.66 64-64V160C511.1 124.7 483.3 96 447.1 96zM463.1 416c0 8.824-7.178 16-16 16h-384c-8.822 0-16-7.176-16-16V96c0-8.824 7.178-16 16-16h117.5c4.273 0 8.293 1.664 11.31 4.688L255.1 144h192c8.822 0 16 7.176 16 16V416z" /></symbol>
  <symbol id="icon-file-excel" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM229.1 233.3L192 280.9L154.9 233.3C146.8 222.8 131.8 220.9 121.3 229.1C110.8 237.2 108.9 252.3 117.1 262.8L161.6 320l-44.53 57.25c-8.156 10.47-6.25 25.56 4.188 33.69C125.7 414.3 130.8 416 135.1 416c7.156 0 14.25-3.188 18.97-9.25L192 359.1l37.06 47.65C233.8 412.8 240.9 416 248 416c5.125 0 10.31-1.656 14.72-5.062c10.44-8.125 12.34-23.22 4.188-33.69L222.4 320l44.53-57.25c8.156-10.47 6.25-25.56-4.188-33.69C252.2 220.9 237.2 222.8 229.1 233.3z" /></symbol>
  <symbol id="icon-file-audio" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0L64-.0001c-35.35 0-64 28.65-64 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM171.5 259.5L136 296H92C85.38 296 80 301.4 80 308v56C80 370.7 85.38 376 92 376H136l35.5 36.5C179.1 420 192 414.8 192 404v-136C192 257.3 179.1 251.9 171.5 259.5zM235.1 260.7c-6.25 6.25-6.25 16.38 0 22.62C235.3 283.5 256 305.1 256 336c0 30.94-20.77 52.53-20.91 52.69c-6.25 6.25-6.25 16.38 0 22.62C238.2 414.4 242.3 416 246.4 416s8.188-1.562 11.31-4.688C258.1 410.1 288 380.5 288 336s-29.05-74.06-30.28-75.31C251.5 254.4 241.3 254.4 235.1 260.7z" /></symbol>
  <symbol id="icon-file-any" viewBox="0 0 384 512"><path d="M0 64C0 28.65 28.65 0 64 0H229.5C246.5 0 262.7 6.743 274.7 18.75L365.3 109.3C377.3 121.3 384 137.5 384 154.5V448C384 483.3 355.3 512 320 512H64C28.65 512 0 483.3 0 448V64zM336 448V160H256C238.3 160 224 145.7 224 128V48H64C55.16 48 48 55.16 48 64V448C48 456.8 55.16 464 64 464H320C328.8 464 336 456.8 336 448z" /></symbol>
  <symbol id="icon-file-code" viewBox="0 0 384 512"><path d="M162.1 257.8c-7.812-7.812-20.47-7.812-28.28 0l-48 48c-7.812 7.812-7.812 20.5 0 28.31l48 48C137.8 386.1 142.9 388 148 388s10.23-1.938 14.14-5.844c7.812-7.812 7.812-20.5 0-28.31L128.3 320l33.86-33.84C169.1 278.3 169.1 265.7 162.1 257.8zM365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0H64C28.65 0 0 28.65 0 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM221.9 257.8c-7.812 7.812-7.812 20.5 0 28.31L255.7 320l-33.86 33.84c-7.812 7.812-7.812 20.5 0 28.31C225.8 386.1 230.9 388 236 388s10.23-1.938 14.14-5.844l48-48c7.812-7.812 7.812-20.5 0-28.31l-48-48C242.3 250 229.7 250 221.9 257.8z" /></symbol>
  <symbol id="icon-file-text" viewBox="0 0 384 512"><path d="M365.3 93.38l-74.63-74.64C278.6 6.742 262.3 0 245.4 0L64-.0001c-35.35 0-64 28.65-64 64l.0065 384c0 35.34 28.65 64 64 64H320c35.2 0 64-28.8 64-64V138.6C384 121.7 377.3 105.4 365.3 93.38zM336 448c0 8.836-7.164 16-16 16H64.02c-8.838 0-16-7.164-16-16L48 64.13c0-8.836 7.164-16 16-16h160L224 128c0 17.67 14.33 32 32 32h79.1V448zM96 280C96 293.3 106.8 304 120 304h144C277.3 304 288 293.3 288 280S277.3 256 264 256h-144C106.8 256 96 266.8 96 280zM264 352h-144C106.8 352 96 362.8 96 376s10.75 24 24 24h144c13.25 0 24-10.75 24-24S277.3 352 264 352z" /></symbol>
</svg>`);
document.body.appendChild(fileSprite);
var MIME_GROUPS = {
  "image": {
    extensions: ["png", "tif", "tiff", "wbmp", "ico", "jpeg", "jpg", "bmp", "gif", "svg", "webp"],
    get title() {
      return t3("image-files");
    }
  },
  "audio": {
    extensions: ["mid", "midi", "kar", "mp3", "ogg", "ra"],
    get title() {
      return t3("audio-files");
    }
  },
  "video": {
    extensions: ["3gpp", "3gp", , "mpeg", "mpg", "mov", "flv", "asx", "asf", "wmv", "avi", "m4p", "mp4"],
    get title() {
      return t3("video-files");
    }
  },
  "word": {
    extensions: ["doc", "docx"],
    get title() {
      return t3("word-files");
    }
  },
  "excel": {
    extensions: ["xls", "ods", "xlsx"],
    get title() {
      return t3("excel-files");
    }
  },
  "pdf": {
    extensions: ["pdf"],
    get title() {
      return t3("pdf-files");
    }
  },
  "markdown": {
    extensions: ["md", "markdown"],
    get title() {
      return t3("md-files");
    }
  },
  "svg": {
    extensions: ["svg"],
    get title() {
      return t3("svg-files");
    }
  }
};
function fileIsMime(file, mime) {
  const ext = fileExtension(file);
  const group = MIME_GROUPS[mime];
  if (!ext || !group) return;
  return group.extensions.includes(ext);
}

// client/file-service/file-dialog.js
var file_dialog_exports = {};
__export(file_dialog_exports, {
  ButtonCancel: () => ButtonCancel,
  ButtonDeleteSelection: () => ButtonDeleteSelection,
  ButtonExplorer: () => ButtonExplorer,
  ButtonNewFolder: () => ButtonNewFolder,
  ButtonOpen: () => ButtonOpen,
  ButtonOpenSingle: () => ButtonOpenSingle,
  ButtonSave: () => ButtonSave,
  ButtonSelectFolder: () => ButtonSelectFolder,
  DirectoryBreadCrumb: () => DirectoryBreadCrumb,
  FileDialog: () => FileDialog,
  FileDialogInput: () => FileDialogInput,
  FileInput: () => FileInput,
  SelectController: () => SelectController,
  SelectFileBox: () => SelectFileBox,
  selectDirectoryDlg: () => selectDirectoryDlg,
  selectFileDialog: () => selectFileDialog,
  selectFolderDialog: () => selectFolderDialog,
  selectImageFilesDlg: () => selectImageFilesDlg,
  selectSingleFileDialog: () => selectSingleFileDialog
});

// node_modules/@popperjs/core/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  afterMain: () => afterMain,
  afterRead: () => afterRead,
  afterWrite: () => afterWrite,
  applyStyles: () => applyStyles_default,
  arrow: () => arrow_default,
  auto: () => auto,
  basePlacements: () => basePlacements,
  beforeMain: () => beforeMain,
  beforeRead: () => beforeRead,
  beforeWrite: () => beforeWrite,
  bottom: () => bottom,
  clippingParents: () => clippingParents,
  computeStyles: () => computeStyles_default,
  createPopper: () => createPopper3,
  createPopperBase: () => createPopper,
  createPopperLite: () => createPopper2,
  detectOverflow: () => detectOverflow,
  end: () => end,
  eventListeners: () => eventListeners_default,
  flip: () => flip_default,
  hide: () => hide_default,
  left: () => left,
  main: () => main,
  modifierPhases: () => modifierPhases,
  offset: () => offset_default,
  placements: () => placements,
  popper: () => popper,
  popperGenerator: () => popperGenerator,
  popperOffsets: () => popperOffsets_default,
  preventOverflow: () => preventOverflow_default,
  read: () => read,
  reference: () => reference,
  right: () => right,
  start: () => start,
  top: () => top,
  variationPlacements: () => variationPlacements,
  viewport: () => viewport,
  write: () => write
});

// node_modules/@popperjs/core/lib/enums.js
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

// node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}

// node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}

// node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state2 = _ref.state;
  Object.keys(state2.elements).forEach(function(name) {
    var style = state2.styles[name] || {};
    var attributes = state2.attributes[name] || {};
    var element = state2.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect(_ref2) {
  var state2 = _ref2.state;
  var initialStyles = {
    popper: {
      position: state2.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state2.elements.popper.style, initialStyles.popper);
  state2.styles = initialStyles;
  if (state2.elements.arrow) {
    Object.assign(state2.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state2.elements).forEach(function(name) {
      var element = state2.elements[name];
      var attributes = state2.attributes[name] || {};
      var styleProperties = Object.keys(state2.styles.hasOwnProperty(name) ? state2.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
  return placement.split("-")[0];
}

// node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round = Math.round;

// node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}

// node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x2 = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y2 = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y2,
    right: x2 + width,
    bottom: y2 + height,
    left: x2,
    x: x2,
    y: y2
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}

// node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}

// node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}

// node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}

// node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}

// node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle2(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle2(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle2(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}

// node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}

// node_modules/@popperjs/core/lib/utils/within.js
function within(min2, value, max2) {
  return max(min2, min(value, max2));
}
function withinMaxClamp(min2, value, max2) {
  var v2 = within(min2, value, max2);
  return v2 > max2 ? max2 : v2;
}

// node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

// node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

// node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

// node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject2(padding, state2) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state2.rects, {
    placement: state2.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state2 = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state2.elements.arrow;
  var popperOffsets2 = state2.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state2.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state2);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state2.rects.reference[len] + state2.rects.reference[axis] - popperOffsets2[axis] - state2.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state2.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state2.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect2(_ref2) {
  var state2 = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state2.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state2.elements.popper, arrowElement)) {
    return;
  }
  state2.elements.arrow = arrowElement;
}
var arrow_default = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};

// node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split("-")[1];
}

// node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x2 = _ref.x, y2 = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x2 * dpr) / dpr || 0,
    y: round(y2 * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x2 = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y2 = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x: x2,
    y: y2
  }) : {
    x: x2,
    y: y2
  };
  x2 = _ref3.x;
  y2 = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y2 -= offsetY - popperRect.height;
      y2 *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x2 -= offsetX - popperRect.width;
      x2 *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x2,
    y: y2
  }, getWindow(popper2)) : {
    x: x2,
    y: y2
  };
  x2 = _ref4.x;
  y2 = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x2 + "px, " + y2 + "px)" : "translate3d(" + x2 + "px, " + y2 + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y2 + "px" : "", _Object$assign2[sideX] = hasX ? x2 + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state2 = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state2.placement),
    variation: getVariation(state2.placement),
    popper: state2.elements.popper,
    popperRect: state2.rects.popper,
    gpuAcceleration,
    isFixed: state2.options.strategy === "fixed"
  };
  if (state2.modifiersData.popperOffsets != null) {
    state2.styles.popper = Object.assign({}, state2.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state2.modifiersData.popperOffsets,
      position: state2.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state2.modifiersData.arrow != null) {
    state2.styles.arrow = Object.assign({}, state2.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state2.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state2.attributes.popper = Object.assign({}, state2.attributes.popper, {
    "data-popper-placement": state2.placement
  });
}
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};

// node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = {
  passive: true
};
function effect3(_ref) {
  var state2 = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state2.elements.popper);
  var scrollParents = [].concat(state2.scrollParents.reference, state2.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect: effect3,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}

// node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash2 = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash2[matched];
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

// node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x2 = 0;
  var y2 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y2 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2 + getWindowScrollBarX(element),
    y: y2
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x2 = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y2 = -winScroll.scrollTop;
  if (getComputedStyle2(body || html).direction === "rtl") {
    x2 += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y2
  };
}

// node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

// node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}

// node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  );
}

// node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

// node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }
  return offsets;
}

// node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state2, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state2.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state2.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state2.rects.popper;
  var element = state2.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state2.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state2.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state2.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}

// node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state2, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements2.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements2;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state2, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a3, b3) {
    return overflows[a3] - overflows[b3];
  });
}

// node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state2 = _ref.state, options = _ref.options, name = _ref.name;
  if (state2.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state2.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state2, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state2.rects.reference;
  var popperRect = state2.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i3 = 0; i3 < placements2.length; i3++) {
    var placement = placements2[i3];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state2, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state2.placement !== firstFittingPlacement) {
    state2.modifiersData[name]._skip = true;
    state2.placement = firstFittingPlacement;
    state2.reset = true;
  }
}
var flip_default = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};

// node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state2 = _ref.state, name = _ref.name;
  var referenceRect = state2.rects.reference;
  var popperRect = state2.rects.popper;
  var preventedOffsets = state2.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state2, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state2, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state2.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state2.attributes.popper = Object.assign({}, state2.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide_default = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};

// node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state2 = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state2.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state2.placement], x2 = _data$state$placement.x, y2 = _data$state$placement.y;
  if (state2.modifiersData.popperOffsets != null) {
    state2.modifiersData.popperOffsets.x += x2;
    state2.modifiersData.popperOffsets.y += y2;
  }
  state2.modifiersData[name] = data;
}
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};

// node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
  var state2 = _ref.state, name = _ref.name;
  state2.modifiersData[name] = computeOffsets({
    reference: state2.rects.reference,
    element: state2.rects.popper,
    strategy: "absolute",
    placement: state2.placement
  });
}
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}

// node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
  var state2 = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state2, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state2.placement);
  var variation = getVariation(state2.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state2.modifiersData.popperOffsets;
  var referenceRect = state2.rects.reference;
  var popperRect = state2.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state2.rects, {
    placement: state2.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state2.modifiersData.offset ? state2.modifiersData.offset[state2.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min2 = offset2 + overflow[mainSide];
    var max2 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state2.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state2.modifiersData["arrow#persistent"] ? state2.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state2.elements.arrow && getOffsetParent(state2.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min2, tetherMin) : min2, offset2, tether ? max(max2, tetherMax) : max2);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state2.modifiersData[name] = data;
}
var preventOverflow_default = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};

// node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

// node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}

// node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}

// node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers3 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper4(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state2 = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state2,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state2.options) : setOptionsAction;
        cleanupModifierEffects();
        state2.options = Object.assign({}, defaultOptions, state2.options, options2);
        state2.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers3, state2.options.modifiers)));
        state2.orderedModifiers = orderedModifiers.filter(function(m2) {
          return m2.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state2.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state2.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state2.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state2.reset = false;
        state2.placement = state2.options.placement;
        state2.orderedModifiers.forEach(function(modifier) {
          return state2.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state2.orderedModifiers.length; index++) {
          if (state2.reset === true) {
            state2.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state2.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state2 = fn2({
              state: state2,
              options: _options,
              name,
              instance
            }) || state2;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state2);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state3) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state3);
      }
    });
    function runModifierEffects() {
      state2.orderedModifiers.forEach(function(_ref) {
        var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect4 = _ref.effect;
        if (typeof effect4 === "function") {
          var cleanupFn = effect4({
            state: state2,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var createPopper = /* @__PURE__ */ popperGenerator();

// node_modules/@popperjs/core/lib/popper-lite.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default];
var createPopper2 = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers2 = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper3 = /* @__PURE__ */ popperGenerator({
  defaultModifiers: defaultModifiers2
});

// node_modules/bootstrap/dist/js/bootstrap.esm.js
var elementMap = /* @__PURE__ */ new Map();
var Data = {
  set(element, key, instance) {
    if (!elementMap.has(element)) {
      elementMap.set(element, /* @__PURE__ */ new Map());
    }
    const instanceMap = elementMap.get(element);
    if (!instanceMap.has(key) && instanceMap.size !== 0) {
      console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
      return;
    }
    instanceMap.set(key, instance);
  },
  get(element, key) {
    if (elementMap.has(element)) {
      return elementMap.get(element).get(key) || null;
    }
    return null;
  },
  remove(element, key) {
    if (!elementMap.has(element)) {
      return;
    }
    const instanceMap = elementMap.get(element);
    instanceMap.delete(key);
    if (instanceMap.size === 0) {
      elementMap.delete(element);
    }
  }
};
var MAX_UID = 1e6;
var MILLISECONDS_MULTIPLIER = 1e3;
var TRANSITION_END = "transitionend";
var parseSelector = (selector) => {
  if (selector && window.CSS && window.CSS.escape) {
    selector = selector.replace(/#([^\s"#']+)/g, (match, id) => `#${CSS.escape(id)}`);
  }
  return selector;
};
var toType = (object) => {
  if (object === null || object === void 0) {
    return `${object}`;
  }
  return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
};
var getUID = (prefix) => {
  do {
    prefix += Math.floor(Math.random() * MAX_UID);
  } while (document.getElementById(prefix));
  return prefix;
};
var getTransitionDurationFromElement = (element) => {
  if (!element) {
    return 0;
  }
  let {
    transitionDuration,
    transitionDelay
  } = window.getComputedStyle(element);
  const floatTransitionDuration = Number.parseFloat(transitionDuration);
  const floatTransitionDelay = Number.parseFloat(transitionDelay);
  if (!floatTransitionDuration && !floatTransitionDelay) {
    return 0;
  }
  transitionDuration = transitionDuration.split(",")[0];
  transitionDelay = transitionDelay.split(",")[0];
  return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
};
var triggerTransitionEnd = (element) => {
  element.dispatchEvent(new Event(TRANSITION_END));
};
var isElement2 = (object) => {
  if (!object || typeof object !== "object") {
    return false;
  }
  if (typeof object.jquery !== "undefined") {
    object = object[0];
  }
  return typeof object.nodeType !== "undefined";
};
var getElement = (object) => {
  if (isElement2(object)) {
    return object.jquery ? object[0] : object;
  }
  if (typeof object === "string" && object.length > 0) {
    return document.querySelector(parseSelector(object));
  }
  return null;
};
var isVisible = (element) => {
  if (!isElement2(element) || element.getClientRects().length === 0) {
    return false;
  }
  const elementIsVisible = getComputedStyle(element).getPropertyValue("visibility") === "visible";
  const closedDetails = element.closest("details:not([open])");
  if (!closedDetails) {
    return elementIsVisible;
  }
  if (closedDetails !== element) {
    const summary = element.closest("summary");
    if (summary && summary.parentNode !== closedDetails) {
      return false;
    }
    if (summary === null) {
      return false;
    }
  }
  return elementIsVisible;
};
var isDisabled = (element) => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    return true;
  }
  if (element.classList.contains("disabled")) {
    return true;
  }
  if (typeof element.disabled !== "undefined") {
    return element.disabled;
  }
  return element.hasAttribute("disabled") && element.getAttribute("disabled") !== "false";
};
var findShadowRoot = (element) => {
  if (!document.documentElement.attachShadow) {
    return null;
  }
  if (typeof element.getRootNode === "function") {
    const root = element.getRootNode();
    return root instanceof ShadowRoot ? root : null;
  }
  if (element instanceof ShadowRoot) {
    return element;
  }
  if (!element.parentNode) {
    return null;
  }
  return findShadowRoot(element.parentNode);
};
var noop = () => {
};
var reflow = (element) => {
  element.offsetHeight;
};
var getjQuery = () => {
  if (window.jQuery && !document.body.hasAttribute("data-bs-no-jquery")) {
    return window.jQuery;
  }
  return null;
};
var DOMContentLoadedCallbacks = [];
var onDOMContentLoaded = (callback) => {
  if (document.readyState === "loading") {
    if (!DOMContentLoadedCallbacks.length) {
      document.addEventListener("DOMContentLoaded", () => {
        for (const callback2 of DOMContentLoadedCallbacks) {
          callback2();
        }
      });
    }
    DOMContentLoadedCallbacks.push(callback);
  } else {
    callback();
  }
};
var isRTL = () => document.documentElement.dir === "rtl";
var defineJQueryPlugin = (plugin) => {
  onDOMContentLoaded(() => {
    const $2 = getjQuery();
    if ($2) {
      const name = plugin.NAME;
      const JQUERY_NO_CONFLICT = $2.fn[name];
      $2.fn[name] = plugin.jQueryInterface;
      $2.fn[name].Constructor = plugin;
      $2.fn[name].noConflict = () => {
        $2.fn[name] = JQUERY_NO_CONFLICT;
        return plugin.jQueryInterface;
      };
    }
  });
};
var execute = (possibleCallback, args = [], defaultValue = possibleCallback) => {
  return typeof possibleCallback === "function" ? possibleCallback.call(...args) : defaultValue;
};
var executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
  if (!waitForTransition) {
    execute(callback);
    return;
  }
  const durationPadding = 5;
  const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
  let called = false;
  const handler2 = ({
    target
  }) => {
    if (target !== transitionElement) {
      return;
    }
    called = true;
    transitionElement.removeEventListener(TRANSITION_END, handler2);
    execute(callback);
  };
  transitionElement.addEventListener(TRANSITION_END, handler2);
  setTimeout(() => {
    if (!called) {
      triggerTransitionEnd(transitionElement);
    }
  }, emulatedDuration);
};
var getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
  const listLength = list.length;
  let index = list.indexOf(activeElement);
  if (index === -1) {
    return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
  }
  index += shouldGetNext ? 1 : -1;
  if (isCycleAllowed) {
    index = (index + listLength) % listLength;
  }
  return list[Math.max(0, Math.min(index, listLength - 1))];
};
var namespaceRegex = /[^.]*(?=\..*)\.|.*/;
var stripNameRegex = /\..*/;
var stripUidRegex = /::\d+$/;
var eventRegistry = {};
var uidEvent = 1;
var customEvents = {
  mouseenter: "mouseover",
  mouseleave: "mouseout"
};
var nativeEvents = /* @__PURE__ */ new Set(["click", "dblclick", "mouseup", "mousedown", "contextmenu", "mousewheel", "DOMMouseScroll", "mouseover", "mouseout", "mousemove", "selectstart", "selectend", "keydown", "keypress", "keyup", "orientationchange", "touchstart", "touchmove", "touchend", "touchcancel", "pointerdown", "pointermove", "pointerup", "pointerleave", "pointercancel", "gesturestart", "gesturechange", "gestureend", "focus", "blur", "change", "reset", "select", "submit", "focusin", "focusout", "load", "unload", "beforeunload", "resize", "move", "DOMContentLoaded", "readystatechange", "error", "abort", "scroll"]);
function makeEventUid(element, uid) {
  return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
}
function getElementEvents(element) {
  const uid = makeEventUid(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}
function bootstrapHandler(element, fn2) {
  return function handler2(event2) {
    hydrateObj(event2, {
      delegateTarget: element
    });
    if (handler2.oneOff) {
      EventHandler.off(element, event2.type, fn2);
    }
    return fn2.apply(element, [event2]);
  };
}
function bootstrapDelegationHandler(element, selector, fn2) {
  return function handler2(event2) {
    const domElements = element.querySelectorAll(selector);
    for (let {
      target
    } = event2; target && target !== this; target = target.parentNode) {
      for (const domElement of domElements) {
        if (domElement !== target) {
          continue;
        }
        hydrateObj(event2, {
          delegateTarget: target
        });
        if (handler2.oneOff) {
          EventHandler.off(element, event2.type, selector, fn2);
        }
        return fn2.apply(target, [event2]);
      }
    }
  };
}
function findHandler(events, callable, delegationSelector = null) {
  return Object.values(events).find((event2) => event2.callable === callable && event2.delegationSelector === delegationSelector);
}
function normalizeParameters(originalTypeEvent, handler2, delegationFunction) {
  const isDelegated = typeof handler2 === "string";
  const callable = isDelegated ? delegationFunction : handler2 || delegationFunction;
  let typeEvent = getTypeEvent(originalTypeEvent);
  if (!nativeEvents.has(typeEvent)) {
    typeEvent = originalTypeEvent;
  }
  return [isDelegated, callable, typeEvent];
}
function addHandler(element, originalTypeEvent, handler2, delegationFunction, oneOff) {
  if (typeof originalTypeEvent !== "string" || !element) {
    return;
  }
  let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler2, delegationFunction);
  if (originalTypeEvent in customEvents) {
    const wrapFunction = (fn3) => {
      return function(event2) {
        if (!event2.relatedTarget || event2.relatedTarget !== event2.delegateTarget && !event2.delegateTarget.contains(event2.relatedTarget)) {
          return fn3.call(this, event2);
        }
      };
    };
    callable = wrapFunction(callable);
  }
  const events = getElementEvents(element);
  const handlers = events[typeEvent] || (events[typeEvent] = {});
  const previousFunction = findHandler(handlers, callable, isDelegated ? handler2 : null);
  if (previousFunction) {
    previousFunction.oneOff = previousFunction.oneOff && oneOff;
    return;
  }
  const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ""));
  const fn2 = isDelegated ? bootstrapDelegationHandler(element, handler2, callable) : bootstrapHandler(element, callable);
  fn2.delegationSelector = isDelegated ? handler2 : null;
  fn2.callable = callable;
  fn2.oneOff = oneOff;
  fn2.uidEvent = uid;
  handlers[uid] = fn2;
  element.addEventListener(typeEvent, fn2, isDelegated);
}
function removeHandler(element, events, typeEvent, handler2, delegationSelector) {
  const fn2 = findHandler(events[typeEvent], handler2, delegationSelector);
  if (!fn2) {
    return;
  }
  element.removeEventListener(typeEvent, fn2, Boolean(delegationSelector));
  delete events[typeEvent][fn2.uidEvent];
}
function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  const storeElementEvent = events[typeEvent] || {};
  for (const [handlerKey, event2] of Object.entries(storeElementEvent)) {
    if (handlerKey.includes(namespace)) {
      removeHandler(element, events, typeEvent, event2.callable, event2.delegationSelector);
    }
  }
}
function getTypeEvent(event2) {
  event2 = event2.replace(stripNameRegex, "");
  return customEvents[event2] || event2;
}
var EventHandler = {
  on(element, event2, handler2, delegationFunction) {
    addHandler(element, event2, handler2, delegationFunction, false);
  },
  one(element, event2, handler2, delegationFunction) {
    addHandler(element, event2, handler2, delegationFunction, true);
  },
  off(element, originalTypeEvent, handler2, delegationFunction) {
    if (typeof originalTypeEvent !== "string" || !element) {
      return;
    }
    const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler2, delegationFunction);
    const inNamespace = typeEvent !== originalTypeEvent;
    const events = getElementEvents(element);
    const storeElementEvent = events[typeEvent] || {};
    const isNamespace = originalTypeEvent.startsWith(".");
    if (typeof callable !== "undefined") {
      if (!Object.keys(storeElementEvent).length) {
        return;
      }
      removeHandler(element, events, typeEvent, callable, isDelegated ? handler2 : null);
      return;
    }
    if (isNamespace) {
      for (const elementEvent of Object.keys(events)) {
        removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
      }
    }
    for (const [keyHandlers, event2] of Object.entries(storeElementEvent)) {
      const handlerKey = keyHandlers.replace(stripUidRegex, "");
      if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
        removeHandler(element, events, typeEvent, event2.callable, event2.delegationSelector);
      }
    }
  },
  trigger(element, event2, args) {
    if (typeof event2 !== "string" || !element) {
      return null;
    }
    const $2 = getjQuery();
    const typeEvent = getTypeEvent(event2);
    const inNamespace = event2 !== typeEvent;
    let jQueryEvent = null;
    let bubbles = true;
    let nativeDispatch = true;
    let defaultPrevented = false;
    if (inNamespace && $2) {
      jQueryEvent = $2.Event(event2, args);
      $2(element).trigger(jQueryEvent);
      bubbles = !jQueryEvent.isPropagationStopped();
      nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
      defaultPrevented = jQueryEvent.isDefaultPrevented();
    }
    const evt = hydrateObj(new Event(event2, {
      bubbles,
      cancelable: true
    }), args);
    if (defaultPrevented) {
      evt.preventDefault();
    }
    if (nativeDispatch) {
      element.dispatchEvent(evt);
    }
    if (evt.defaultPrevented && jQueryEvent) {
      jQueryEvent.preventDefault();
    }
    return evt;
  }
};
function hydrateObj(obj, meta = {}) {
  for (const [key, value] of Object.entries(meta)) {
    try {
      obj[key] = value;
    } catch (_unused) {
      Object.defineProperty(obj, key, {
        configurable: true,
        get() {
          return value;
        }
      });
    }
  }
  return obj;
}
function normalizeData(value) {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (value === Number(value).toString()) {
    return Number(value);
  }
  if (value === "" || value === "null") {
    return null;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (_unused) {
    return value;
  }
}
function normalizeDataKey(key) {
  return key.replace(/[A-Z]/g, (chr) => `-${chr.toLowerCase()}`);
}
var Manipulator = {
  setDataAttribute(element, key, value) {
    element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
  },
  removeDataAttribute(element, key) {
    element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
  },
  getDataAttributes(element) {
    if (!element) {
      return {};
    }
    const attributes = {};
    const bsKeys = Object.keys(element.dataset).filter((key) => key.startsWith("bs") && !key.startsWith("bsConfig"));
    for (const key of bsKeys) {
      let pureKey = key.replace(/^bs/, "");
      pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1);
      attributes[pureKey] = normalizeData(element.dataset[key]);
    }
    return attributes;
  },
  getDataAttribute(element, key) {
    return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
  }
};
var Config = class {
  // Getters
  static get Default() {
    return {};
  }
  static get DefaultType() {
    return {};
  }
  static get NAME() {
    throw new Error('You have to implement the static method "NAME", for each component!');
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    return config;
  }
  _mergeConfigObj(config, element) {
    const jsonConfig = isElement2(element) ? Manipulator.getDataAttribute(element, "config") : {};
    return {
      ...this.constructor.Default,
      ...typeof jsonConfig === "object" ? jsonConfig : {},
      ...isElement2(element) ? Manipulator.getDataAttributes(element) : {},
      ...typeof config === "object" ? config : {}
    };
  }
  _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
    for (const [property, expectedTypes] of Object.entries(configTypes)) {
      const value = config[property];
      const valueType = isElement2(value) ? "element" : toType(value);
      if (!new RegExp(expectedTypes).test(valueType)) {
        throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
      }
    }
  }
};
var VERSION = "5.3.9";
var BaseComponent = class extends Config {
  constructor(element, config) {
    super();
    element = getElement(element);
    if (!element) {
      return;
    }
    this._element = element;
    this._config = this._getConfig(config);
    Data.set(this._element, this.constructor.DATA_KEY, this);
  }
  // Public
  dispose() {
    Data.remove(this._element, this.constructor.DATA_KEY);
    EventHandler.off(this._element, this.constructor.EVENT_KEY);
    for (const propertyName of Object.getOwnPropertyNames(this)) {
      this[propertyName] = null;
    }
  }
  // Private
  _queueCallback(callback, element, isAnimated = true) {
    executeAfterTransition(callback, element, isAnimated);
  }
  _getConfig(config) {
    config = this._mergeConfigObj(config, this._element);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  // Static
  static getInstance(element) {
    return Data.get(getElement(element), this.DATA_KEY);
  }
  static getOrCreateInstance(element, config = {}) {
    return this.getInstance(element) || new this(element, typeof config === "object" ? config : null);
  }
  static get VERSION() {
    return VERSION;
  }
  static get DATA_KEY() {
    return `bs.${this.NAME}`;
  }
  static get EVENT_KEY() {
    return `.${this.DATA_KEY}`;
  }
  static eventName(name) {
    return `${name}${this.EVENT_KEY}`;
  }
};
var getSelector = (element) => {
  let selector = element.getAttribute("data-bs-target");
  if (!selector || selector === "#") {
    let hrefAttribute = element.getAttribute("href");
    if (!hrefAttribute || !hrefAttribute.includes("#") && !hrefAttribute.startsWith(".")) {
      return null;
    }
    if (hrefAttribute.includes("#") && !hrefAttribute.startsWith("#")) {
      hrefAttribute = `#${hrefAttribute.split("#")[1]}`;
    }
    selector = hrefAttribute && hrefAttribute !== "#" ? hrefAttribute.trim() : null;
  }
  return selector ? selector.split(",").map((sel) => parseSelector(sel)).join(",") : null;
};
var SelectorEngine = {
  find(selector, element = document.documentElement) {
    return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
  },
  findOne(selector, element = document.documentElement) {
    return Element.prototype.querySelector.call(element, selector);
  },
  children(element, selector) {
    return [].concat(...element.children).filter((child) => child.matches(selector));
  },
  parents(element, selector) {
    const parents = [];
    let ancestor = element.parentNode.closest(selector);
    while (ancestor) {
      parents.push(ancestor);
      ancestor = ancestor.parentNode.closest(selector);
    }
    return parents;
  },
  prev(element, selector) {
    let previous = element.previousElementSibling;
    while (previous) {
      if (previous.matches(selector)) {
        return [previous];
      }
      previous = previous.previousElementSibling;
    }
    return [];
  },
  // TODO: this is now unused; remove later along with prev()
  next(element, selector) {
    let next = element.nextElementSibling;
    while (next) {
      if (next.matches(selector)) {
        return [next];
      }
      next = next.nextElementSibling;
    }
    return [];
  },
  focusableChildren(element) {
    const focusables = ["a", "button", "input", "textarea", "select", "details", "[tabindex]", '[contenteditable="true"]'].map((selector) => `${selector}:not([tabindex^="-"])`).join(",");
    return this.find(focusables, element).filter((el) => !isDisabled(el) && isVisible(el));
  },
  getSelectorFromElement(element) {
    const selector = getSelector(element);
    if (selector) {
      return SelectorEngine.findOne(selector) ? selector : null;
    }
    return null;
  },
  getElementFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.findOne(selector) : null;
  },
  getMultipleElementsFromSelector(element) {
    const selector = getSelector(element);
    return selector ? SelectorEngine.find(selector) : [];
  }
};
var enableDismissTrigger = (component, method = "hide") => {
  const clickEvent = `click.dismiss${component.EVENT_KEY}`;
  const name = component.NAME;
  EventHandler.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function(event2) {
    if (["A", "AREA"].includes(this.tagName)) {
      event2.preventDefault();
    }
    if (isDisabled(this)) {
      return;
    }
    const target = SelectorEngine.getElementFromSelector(this) || this.closest(`.${name}`);
    const instance = component.getOrCreateInstance(target);
    instance[method]();
  });
};
var NAME$f = "alert";
var DATA_KEY$a = "bs.alert";
var EVENT_KEY$b = `.${DATA_KEY$a}`;
var EVENT_CLOSE = `close${EVENT_KEY$b}`;
var EVENT_CLOSED = `closed${EVENT_KEY$b}`;
var CLASS_NAME_FADE$5 = "fade";
var CLASS_NAME_SHOW$8 = "show";
var Alert = class _Alert extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$f;
  }
  // Public
  close() {
    const closeEvent = EventHandler.trigger(this._element, EVENT_CLOSE);
    if (closeEvent.defaultPrevented) {
      return;
    }
    this._element.classList.remove(CLASS_NAME_SHOW$8);
    const isAnimated = this._element.classList.contains(CLASS_NAME_FADE$5);
    this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
  }
  // Private
  _destroyElement() {
    this._element.remove();
    EventHandler.trigger(this._element, EVENT_CLOSED);
    this.dispose();
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Alert.getOrCreateInstance(this);
      if (typeof config !== "string") {
        return;
      }
      if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
};
enableDismissTrigger(Alert, "close");
defineJQueryPlugin(Alert);
var NAME$e = "button";
var DATA_KEY$9 = "bs.button";
var EVENT_KEY$a = `.${DATA_KEY$9}`;
var DATA_API_KEY$6 = ".data-api";
var CLASS_NAME_ACTIVE$3 = "active";
var SELECTOR_DATA_TOGGLE$5 = '[data-bs-toggle="button"]';
var EVENT_CLICK_DATA_API$6 = `click${EVENT_KEY$a}${DATA_API_KEY$6}`;
var Button = class _Button extends BaseComponent {
  // Getters
  static get NAME() {
    return NAME$e;
  }
  // Public
  toggle() {
    this._element.setAttribute("aria-pressed", this._element.classList.toggle(CLASS_NAME_ACTIVE$3));
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Button.getOrCreateInstance(this);
      if (config === "toggle") {
        data[config]();
      }
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$5, (event2) => {
  event2.preventDefault();
  const button2 = event2.target.closest(SELECTOR_DATA_TOGGLE$5);
  const data = Button.getOrCreateInstance(button2);
  data.toggle();
});
defineJQueryPlugin(Button);
var NAME$d = "swipe";
var EVENT_KEY$9 = ".bs.swipe";
var EVENT_TOUCHSTART = `touchstart${EVENT_KEY$9}`;
var EVENT_TOUCHMOVE = `touchmove${EVENT_KEY$9}`;
var EVENT_TOUCHEND = `touchend${EVENT_KEY$9}`;
var EVENT_POINTERDOWN = `pointerdown${EVENT_KEY$9}`;
var EVENT_POINTERUP = `pointerup${EVENT_KEY$9}`;
var POINTER_TYPE_TOUCH = "touch";
var POINTER_TYPE_PEN = "pen";
var CLASS_NAME_POINTER_EVENT = "pointer-event";
var SWIPE_THRESHOLD = 40;
var Default$c = {
  endCallback: null,
  leftCallback: null,
  rightCallback: null
};
var DefaultType$c = {
  endCallback: "(function|null)",
  leftCallback: "(function|null)",
  rightCallback: "(function|null)"
};
var Swipe = class _Swipe extends Config {
  constructor(element, config) {
    super();
    this._element = element;
    if (!element || !_Swipe.isSupported()) {
      return;
    }
    this._config = this._getConfig(config);
    this._startX = 0;
    this._deltaX = 0;
    this._supportPointerEvents = Boolean(window.PointerEvent);
    this._initEvents();
  }
  // Getters
  static get Default() {
    return Default$c;
  }
  static get DefaultType() {
    return DefaultType$c;
  }
  static get NAME() {
    return NAME$d;
  }
  // Public
  dispose() {
    EventHandler.off(this._element, EVENT_KEY$9);
  }
  // Private
  _start(event2) {
    this._deltaX = 0;
    if (!this._supportPointerEvents) {
      this._startX = event2.touches[0].clientX;
      return;
    }
    if (this._eventIsPointerPenTouch(event2)) {
      this._startX = event2.clientX;
    }
  }
  _end(event2) {
    if (this._eventIsPointerPenTouch(event2)) {
      this._deltaX = event2.clientX - this._startX;
    }
    this._handleSwipe();
    execute(this._config.endCallback);
  }
  _move(event2) {
    this._deltaX = event2.touches && event2.touches.length > 1 ? 0 : event2.touches[0].clientX - this._startX;
  }
  _handleSwipe() {
    const absDeltaX = Math.abs(this._deltaX);
    if (absDeltaX <= SWIPE_THRESHOLD) {
      return;
    }
    const direction = absDeltaX / this._deltaX;
    this._deltaX = 0;
    if (!direction) {
      return;
    }
    execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
  }
  _initEvents() {
    if (this._supportPointerEvents) {
      EventHandler.on(this._element, EVENT_POINTERDOWN, (event2) => this._start(event2));
      EventHandler.on(this._element, EVENT_POINTERUP, (event2) => this._end(event2));
      this._element.classList.add(CLASS_NAME_POINTER_EVENT);
    } else {
      EventHandler.on(this._element, EVENT_TOUCHSTART, (event2) => this._start(event2));
      EventHandler.on(this._element, EVENT_TOUCHMOVE, (event2) => this._move(event2));
      EventHandler.on(this._element, EVENT_TOUCHEND, (event2) => this._end(event2));
    }
  }
  _eventIsPointerPenTouch(event2) {
    return this._supportPointerEvents && (event2.pointerType === POINTER_TYPE_PEN || event2.pointerType === POINTER_TYPE_TOUCH);
  }
  // Static
  static isSupported() {
    return "ontouchstart" in document.documentElement || navigator.maxTouchPoints > 0;
  }
};
var NAME$c = "carousel";
var DATA_KEY$8 = "bs.carousel";
var EVENT_KEY$8 = `.${DATA_KEY$8}`;
var DATA_API_KEY$5 = ".data-api";
var ARROW_LEFT_KEY$1 = "ArrowLeft";
var ARROW_RIGHT_KEY$1 = "ArrowRight";
var TOUCHEVENT_COMPAT_WAIT = 500;
var ORDER_NEXT = "next";
var ORDER_PREV = "prev";
var DIRECTION_LEFT = "left";
var DIRECTION_RIGHT = "right";
var EVENT_SLIDE = `slide${EVENT_KEY$8}`;
var EVENT_SLID = `slid${EVENT_KEY$8}`;
var EVENT_KEYDOWN$1 = `keydown${EVENT_KEY$8}`;
var EVENT_MOUSEENTER$1 = `mouseenter${EVENT_KEY$8}`;
var EVENT_MOUSELEAVE$1 = `mouseleave${EVENT_KEY$8}`;
var EVENT_DRAG_START = `dragstart${EVENT_KEY$8}`;
var EVENT_LOAD_DATA_API$3 = `load${EVENT_KEY$8}${DATA_API_KEY$5}`;
var EVENT_CLICK_DATA_API$5 = `click${EVENT_KEY$8}${DATA_API_KEY$5}`;
var CLASS_NAME_CAROUSEL = "carousel";
var CLASS_NAME_ACTIVE$2 = "active";
var CLASS_NAME_SLIDE = "slide";
var CLASS_NAME_END = "carousel-item-end";
var CLASS_NAME_START = "carousel-item-start";
var CLASS_NAME_NEXT = "carousel-item-next";
var CLASS_NAME_PREV = "carousel-item-prev";
var SELECTOR_ACTIVE = ".active";
var SELECTOR_ITEM = ".carousel-item";
var SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
var SELECTOR_ITEM_IMG = ".carousel-item img";
var SELECTOR_INDICATORS = ".carousel-indicators";
var SELECTOR_DATA_SLIDE = "[data-bs-slide], [data-bs-slide-to]";
var SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
var KEY_TO_DIRECTION = {
  [ARROW_LEFT_KEY$1]: DIRECTION_RIGHT,
  [ARROW_RIGHT_KEY$1]: DIRECTION_LEFT
};
var Default$b = {
  interval: 5e3,
  keyboard: true,
  pause: "hover",
  ride: false,
  touch: true,
  wrap: true
};
var DefaultType$b = {
  interval: "(number|boolean)",
  // TODO:v6 remove boolean support
  keyboard: "boolean",
  pause: "(string|boolean)",
  ride: "(boolean|string)",
  touch: "boolean",
  wrap: "boolean"
};
var Carousel = class _Carousel extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._interval = null;
    this._activeElement = null;
    this._isSliding = false;
    this.touchTimeout = null;
    this._swipeHelper = null;
    this._indicatorsElement = SelectorEngine.findOne(SELECTOR_INDICATORS, this._element);
    this._addEventListeners();
    if (this._config.ride === CLASS_NAME_CAROUSEL) {
      this.cycle();
    }
  }
  // Getters
  static get Default() {
    return Default$b;
  }
  static get DefaultType() {
    return DefaultType$b;
  }
  static get NAME() {
    return NAME$c;
  }
  // Public
  next() {
    this._slide(ORDER_NEXT);
  }
  nextWhenVisible() {
    if (!document.hidden && isVisible(this._element)) {
      this.next();
    }
  }
  prev() {
    this._slide(ORDER_PREV);
  }
  pause() {
    if (this._isSliding) {
      triggerTransitionEnd(this._element);
    }
    this._clearInterval();
  }
  cycle() {
    this._clearInterval();
    this._updateInterval();
    this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
  }
  _maybeEnableCycle() {
    if (!this._config.ride) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.cycle());
      return;
    }
    this.cycle();
  }
  to(index) {
    const items = this._getItems();
    if (index > items.length - 1 || index < 0) {
      return;
    }
    if (this._isSliding) {
      EventHandler.one(this._element, EVENT_SLID, () => this.to(index));
      return;
    }
    const activeIndex = this._getItemIndex(this._getActive());
    if (activeIndex === index) {
      return;
    }
    const order2 = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
    this._slide(order2, items[index]);
  }
  dispose() {
    if (this._swipeHelper) {
      this._swipeHelper.dispose();
    }
    super.dispose();
  }
  // Private
  _configAfterMerge(config) {
    config.defaultInterval = config.interval;
    return config;
  }
  _addEventListeners() {
    if (this._config.keyboard) {
      EventHandler.on(this._element, EVENT_KEYDOWN$1, (event2) => this._keydown(event2));
    }
    if (this._config.pause === "hover") {
      EventHandler.on(this._element, EVENT_MOUSEENTER$1, () => this.pause());
      EventHandler.on(this._element, EVENT_MOUSELEAVE$1, () => this._maybeEnableCycle());
    }
    if (this._config.touch && Swipe.isSupported()) {
      this._addTouchEventListeners();
    }
  }
  _addTouchEventListeners() {
    for (const img3 of SelectorEngine.find(SELECTOR_ITEM_IMG, this._element)) {
      EventHandler.on(img3, EVENT_DRAG_START, (event2) => event2.preventDefault());
    }
    const endCallBack = () => {
      if (this._config.pause !== "hover") {
        return;
      }
      this.pause();
      if (this.touchTimeout) {
        clearTimeout(this.touchTimeout);
      }
      this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
    };
    const swipeConfig = {
      leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
      rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
      endCallback: endCallBack
    };
    this._swipeHelper = new Swipe(this._element, swipeConfig);
  }
  _keydown(event2) {
    if (/input|textarea/i.test(event2.target.tagName)) {
      return;
    }
    const direction = KEY_TO_DIRECTION[event2.key];
    if (direction) {
      event2.preventDefault();
      this._slide(this._directionToOrder(direction));
    }
  }
  _getItemIndex(element) {
    return this._getItems().indexOf(element);
  }
  _setActiveIndicatorElement(index) {
    if (!this._indicatorsElement) {
      return;
    }
    const activeIndicator = SelectorEngine.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
    if (activeIndicator) {
      activeIndicator.classList.remove(CLASS_NAME_ACTIVE$2);
      activeIndicator.removeAttribute("aria-current");
    }
    const newActiveIndicator = SelectorEngine.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
    if (newActiveIndicator) {
      newActiveIndicator.classList.add(CLASS_NAME_ACTIVE$2);
      newActiveIndicator.setAttribute("aria-current", "true");
    }
  }
  _updateInterval() {
    const element = this._activeElement || this._getActive();
    if (!element) {
      return;
    }
    const elementInterval = Number.parseInt(element.getAttribute("data-bs-interval"), 10);
    this._config.interval = elementInterval || this._config.defaultInterval;
  }
  _slide(order2, element = null) {
    if (this._isSliding) {
      return;
    }
    const activeElement = this._getActive();
    const isNext = order2 === ORDER_NEXT;
    const nextElement = element || getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
    if (nextElement === activeElement) {
      return;
    }
    const nextElementIndex = this._getItemIndex(nextElement);
    const triggerEvent = (eventName) => {
      return EventHandler.trigger(this._element, eventName, {
        relatedTarget: nextElement,
        direction: this._orderToDirection(order2),
        from: this._getItemIndex(activeElement),
        to: nextElementIndex
      });
    };
    const slideEvent = triggerEvent(EVENT_SLIDE);
    if (slideEvent.defaultPrevented) {
      return;
    }
    if (!activeElement || !nextElement) {
      return;
    }
    const isCycling = Boolean(this._interval);
    this.pause();
    this._isSliding = true;
    this._setActiveIndicatorElement(nextElementIndex);
    this._activeElement = nextElement;
    const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
    const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
    nextElement.classList.add(orderClassName);
    reflow(nextElement);
    activeElement.classList.add(directionalClassName);
    nextElement.classList.add(directionalClassName);
    const completeCallBack = () => {
      nextElement.classList.remove(directionalClassName, orderClassName);
      nextElement.classList.add(CLASS_NAME_ACTIVE$2);
      activeElement.classList.remove(CLASS_NAME_ACTIVE$2, orderClassName, directionalClassName);
      this._isSliding = false;
      triggerEvent(EVENT_SLID);
    };
    this._queueCallback(completeCallBack, activeElement, this._isAnimated());
    if (isCycling) {
      this.cycle();
    }
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_SLIDE);
  }
  _getActive() {
    return SelectorEngine.findOne(SELECTOR_ACTIVE_ITEM, this._element);
  }
  _getItems() {
    return SelectorEngine.find(SELECTOR_ITEM, this._element);
  }
  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
  }
  _directionToOrder(direction) {
    if (isRTL()) {
      return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
    }
    return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
  }
  _orderToDirection(order2) {
    if (isRTL()) {
      return order2 === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return order2 === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Carousel.getOrCreateInstance(this, config);
      if (typeof config === "number") {
        data.to(config);
        return;
      }
      if (typeof config === "string") {
        if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$5, SELECTOR_DATA_SLIDE, function(event2) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
    return;
  }
  event2.preventDefault();
  const carousel = Carousel.getOrCreateInstance(target);
  const slideIndex = this.getAttribute("data-bs-slide-to");
  if (slideIndex) {
    carousel.to(slideIndex);
    carousel._maybeEnableCycle();
    return;
  }
  if (Manipulator.getDataAttribute(this, "slide") === "next") {
    carousel.next();
    carousel._maybeEnableCycle();
    return;
  }
  carousel.prev();
  carousel._maybeEnableCycle();
});
EventHandler.on(window, EVENT_LOAD_DATA_API$3, () => {
  const carousels = SelectorEngine.find(SELECTOR_DATA_RIDE);
  for (const carousel of carousels) {
    Carousel.getOrCreateInstance(carousel);
  }
});
defineJQueryPlugin(Carousel);
var NAME$b = "collapse";
var DATA_KEY$7 = "bs.collapse";
var EVENT_KEY$7 = `.${DATA_KEY$7}`;
var DATA_API_KEY$4 = ".data-api";
var EVENT_SHOW$6 = `show${EVENT_KEY$7}`;
var EVENT_SHOWN$6 = `shown${EVENT_KEY$7}`;
var EVENT_HIDE$6 = `hide${EVENT_KEY$7}`;
var EVENT_HIDDEN$6 = `hidden${EVENT_KEY$7}`;
var EVENT_CLICK_DATA_API$4 = `click${EVENT_KEY$7}${DATA_API_KEY$4}`;
var CLASS_NAME_SHOW$7 = "show";
var CLASS_NAME_COLLAPSE = "collapse";
var CLASS_NAME_COLLAPSING = "collapsing";
var CLASS_NAME_COLLAPSED = "collapsed";
var CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
var CLASS_NAME_HORIZONTAL = "collapse-horizontal";
var WIDTH = "width";
var HEIGHT = "height";
var SELECTOR_ACTIVES = ".collapse.show, .collapse.collapsing";
var SELECTOR_DATA_TOGGLE$4 = '[data-bs-toggle="collapse"]';
var Default$a = {
  parent: null,
  toggle: true
};
var DefaultType$a = {
  parent: "(null|element)",
  toggle: "boolean"
};
var Collapse = class _Collapse extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isTransitioning = false;
    this._triggerArray = [];
    const toggleList = SelectorEngine.find(SELECTOR_DATA_TOGGLE$4);
    for (const elem of toggleList) {
      const selector = SelectorEngine.getSelectorFromElement(elem);
      const filterElement = SelectorEngine.find(selector).filter((foundElement) => foundElement === this._element);
      if (selector !== null && filterElement.length) {
        this._triggerArray.push(elem);
      }
    }
    this._initializeChildren();
    if (!this._config.parent) {
      this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
    }
    if (this._config.toggle) {
      this.toggle();
    }
  }
  // Getters
  static get Default() {
    return Default$a;
  }
  static get DefaultType() {
    return DefaultType$a;
  }
  static get NAME() {
    return NAME$b;
  }
  // Public
  toggle() {
    if (this._isShown()) {
      this.hide();
    } else {
      this.show();
    }
  }
  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }
    let activeChildren = [];
    if (this._config.parent) {
      activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter((element) => element !== this._element).map((element) => _Collapse.getOrCreateInstance(element, {
        toggle: false
      }));
    }
    if (activeChildren.length && activeChildren[0]._isTransitioning) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_SHOW$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    for (const activeInstance of activeChildren) {
      activeInstance.hide();
    }
    const dimension = this._getDimension();
    this._element.classList.remove(CLASS_NAME_COLLAPSE);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.style[dimension] = 0;
    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
      this._element.style[dimension] = "";
      EventHandler.trigger(this._element, EVENT_SHOWN$6);
    };
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    this._queueCallback(complete, this._element, true);
    this._element.style[dimension] = `${this._element[scrollSize]}px`;
  }
  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }
    const startEvent = EventHandler.trigger(this._element, EVENT_HIDE$6);
    if (startEvent.defaultPrevented) {
      return;
    }
    const dimension = this._getDimension();
    this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW$7);
    for (const trigger of this._triggerArray) {
      const element = SelectorEngine.getElementFromSelector(trigger);
      if (element && !this._isShown(element)) {
        this._addAriaAndCollapsedClass([trigger], false);
      }
    }
    this._isTransitioning = true;
    const complete = () => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE);
      EventHandler.trigger(this._element, EVENT_HIDDEN$6);
    };
    this._element.style[dimension] = "";
    this._queueCallback(complete, this._element, true);
  }
  // Private
  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW$7);
  }
  _configAfterMerge(config) {
    config.toggle = Boolean(config.toggle);
    config.parent = getElement(config.parent);
    return config;
  }
  _getDimension() {
    return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
  }
  _initializeChildren() {
    if (!this._config.parent) {
      return;
    }
    const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE$4);
    for (const element of children) {
      const selected = SelectorEngine.getElementFromSelector(element);
      if (selected) {
        this._addAriaAndCollapsedClass([element], this._isShown(selected));
      }
    }
  }
  _getFirstLevelChildren(selector) {
    const children = SelectorEngine.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent);
    return SelectorEngine.find(selector, this._config.parent).filter((element) => !children.includes(element));
  }
  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }
    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute("aria-expanded", isOpen);
    }
  }
  // Static
  static jQueryInterface(config) {
    const _config = {};
    if (typeof config === "string" && /show|hide/.test(config)) {
      _config.toggle = false;
    }
    return this.each(function() {
      const data = _Collapse.getOrCreateInstance(this, _config);
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config]();
      }
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$4, function(event2) {
  if (event2.target.tagName === "A" || event2.delegateTarget && event2.delegateTarget.tagName === "A") {
    event2.preventDefault();
  }
  for (const element of SelectorEngine.getMultipleElementsFromSelector(this)) {
    Collapse.getOrCreateInstance(element, {
      toggle: false
    }).toggle();
  }
});
defineJQueryPlugin(Collapse);
var NAME$a = "dropdown";
var DATA_KEY$6 = "bs.dropdown";
var EVENT_KEY$6 = `.${DATA_KEY$6}`;
var DATA_API_KEY$3 = ".data-api";
var ESCAPE_KEY$2 = "Escape";
var TAB_KEY$1 = "Tab";
var ARROW_UP_KEY$1 = "ArrowUp";
var ARROW_DOWN_KEY$1 = "ArrowDown";
var RIGHT_MOUSE_BUTTON = 2;
var EVENT_HIDE$5 = `hide${EVENT_KEY$6}`;
var EVENT_HIDDEN$5 = `hidden${EVENT_KEY$6}`;
var EVENT_SHOW$5 = `show${EVENT_KEY$6}`;
var EVENT_SHOWN$5 = `shown${EVENT_KEY$6}`;
var EVENT_CLICK_DATA_API$3 = `click${EVENT_KEY$6}${DATA_API_KEY$3}`;
var EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY$6}${DATA_API_KEY$3}`;
var EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY$6}${DATA_API_KEY$3}`;
var CLASS_NAME_SHOW$6 = "show";
var CLASS_NAME_DROPUP = "dropup";
var CLASS_NAME_DROPEND = "dropend";
var CLASS_NAME_DROPSTART = "dropstart";
var CLASS_NAME_DROPUP_CENTER = "dropup-center";
var CLASS_NAME_DROPDOWN_CENTER = "dropdown-center";
var SELECTOR_DATA_TOGGLE$3 = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
var SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE$3}.${CLASS_NAME_SHOW$6}`;
var SELECTOR_MENU = ".dropdown-menu";
var SELECTOR_NAVBAR = ".navbar";
var SELECTOR_NAVBAR_NAV = ".navbar-nav";
var SELECTOR_VISIBLE_ITEMS = ".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)";
var PLACEMENT_TOP = isRTL() ? "top-end" : "top-start";
var PLACEMENT_TOPEND = isRTL() ? "top-start" : "top-end";
var PLACEMENT_BOTTOM = isRTL() ? "bottom-end" : "bottom-start";
var PLACEMENT_BOTTOMEND = isRTL() ? "bottom-start" : "bottom-end";
var PLACEMENT_RIGHT = isRTL() ? "left-start" : "right-start";
var PLACEMENT_LEFT = isRTL() ? "right-start" : "left-start";
var PLACEMENT_TOPCENTER = "top";
var PLACEMENT_BOTTOMCENTER = "bottom";
var Default$9 = {
  autoClose: true,
  boundary: "clippingParents",
  display: "dynamic",
  offset: [0, 2],
  popperConfig: null,
  reference: "toggle"
};
var DefaultType$9 = {
  autoClose: "(boolean|string)",
  boundary: "(string|element)",
  display: "string",
  offset: "(array|string|function)",
  popperConfig: "(null|object|function)",
  reference: "(string|element|object)"
};
var Dropdown = class _Dropdown extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._popper = null;
    this._parent = this._element.parentNode;
    this._menu = SelectorEngine.next(this._element, SELECTOR_MENU)[0] || SelectorEngine.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine.findOne(SELECTOR_MENU, this._parent);
    this._inNavbar = this._detectNavbar();
  }
  // Getters
  static get Default() {
    return Default$9;
  }
  static get DefaultType() {
    return DefaultType$9;
  }
  static get NAME() {
    return NAME$a;
  }
  // Public
  toggle() {
    return this._isShown() ? this.hide() : this.show();
  }
  show() {
    if (isDisabled(this._element) || this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$5, relatedTarget);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._createPopper();
    if ("ontouchstart" in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, "mouseover", noop);
      }
    }
    this._element.focus();
    this._element.setAttribute("aria-expanded", true);
    this._menu.classList.add(CLASS_NAME_SHOW$6);
    this._element.classList.add(CLASS_NAME_SHOW$6);
    EventHandler.trigger(this._element, EVENT_SHOWN$5, relatedTarget);
  }
  hide() {
    if (isDisabled(this._element) || !this._isShown()) {
      return;
    }
    const relatedTarget = {
      relatedTarget: this._element
    };
    this._completeHide(relatedTarget);
  }
  dispose() {
    if (this._popper) {
      this._popper.destroy();
    }
    super.dispose();
  }
  update() {
    this._inNavbar = this._detectNavbar();
    if (this._popper) {
      this._popper.update();
    }
  }
  // Private
  _completeHide(relatedTarget) {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$5, relatedTarget);
    if (hideEvent.defaultPrevented) {
      return;
    }
    if ("ontouchstart" in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, "mouseover", noop);
      }
    }
    if (this._popper) {
      this._popper.destroy();
    }
    this._menu.classList.remove(CLASS_NAME_SHOW$6);
    this._element.classList.remove(CLASS_NAME_SHOW$6);
    this._element.setAttribute("aria-expanded", "false");
    Manipulator.removeDataAttribute(this._menu, "popper");
    EventHandler.trigger(this._element, EVENT_HIDDEN$5, relatedTarget);
  }
  _getConfig(config) {
    config = super._getConfig(config);
    if (typeof config.reference === "object" && !isElement2(config.reference) && typeof config.reference.getBoundingClientRect !== "function") {
      throw new TypeError(`${NAME$a.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
    }
    return config;
  }
  _createPopper() {
    if (typeof lib_exports === "undefined") {
      throw new TypeError("Bootstrap's dropdowns require Popper (https://github.com/floating-ui/popper-docs/blob/main/docs/v2/index.md)");
    }
    let referenceElement = this._element;
    if (this._config.reference === "parent") {
      referenceElement = this._parent;
    } else if (isElement2(this._config.reference)) {
      referenceElement = getElement(this._config.reference);
    } else if (typeof this._config.reference === "object") {
      referenceElement = this._config.reference;
    }
    const popperConfig = this._getPopperConfig();
    this._popper = createPopper3(referenceElement, this._menu, popperConfig);
  }
  _isShown() {
    return this._menu.classList.contains(CLASS_NAME_SHOW$6);
  }
  _getPlacement() {
    const parentDropdown = this._parent;
    if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
      return PLACEMENT_RIGHT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
      return PLACEMENT_LEFT;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
      return PLACEMENT_TOPCENTER;
    }
    if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
      return PLACEMENT_BOTTOMCENTER;
    }
    const isEnd = getComputedStyle(this._menu).getPropertyValue("--bs-position").trim() === "end";
    if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
      return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
    }
    return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
  }
  _detectNavbar() {
    return this._element.closest(SELECTOR_NAVBAR) !== null;
  }
  _getOffset() {
    const {
      offset: offset2
    } = this._config;
    if (typeof offset2 === "string") {
      return offset2.split(",").map((value) => Number.parseInt(value, 10));
    }
    if (typeof offset2 === "function") {
      return (popperData) => offset2(popperData, this._element);
    }
    return offset2;
  }
  _getPopperConfig() {
    const defaultBsPopperConfig = {
      placement: this._getPlacement(),
      modifiers: [{
        name: "preventOverflow",
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: "offset",
        options: {
          offset: this._getOffset()
        }
      }]
    };
    if (this._inNavbar || this._config.display === "static") {
      Manipulator.setDataAttribute(this._menu, "popper", "static");
      defaultBsPopperConfig.modifiers = [{
        name: "applyStyles",
        enabled: false
      }];
    }
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [void 0, defaultBsPopperConfig])
    };
  }
  _selectMenuItem({
    key,
    target
  }) {
    const items = SelectorEngine.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter((element) => isVisible(element));
    if (!items.length) {
      return;
    }
    getNextActiveElement(items, target, key === ARROW_DOWN_KEY$1, !items.includes(target)).focus();
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Dropdown.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
  static clearMenus(event2) {
    if (event2.button === RIGHT_MOUSE_BUTTON || event2.type === "keyup" && event2.key !== TAB_KEY$1) {
      return;
    }
    const openToggles = SelectorEngine.find(SELECTOR_DATA_TOGGLE_SHOWN);
    for (const toggle of openToggles) {
      const context = _Dropdown.getInstance(toggle);
      if (!context || context._config.autoClose === false) {
        continue;
      }
      const composedPath = event2.composedPath();
      const isMenuTarget = composedPath.includes(context._menu);
      if (composedPath.includes(context._element) || context._config.autoClose === "inside" && !isMenuTarget || context._config.autoClose === "outside" && isMenuTarget) {
        continue;
      }
      if (context._menu.contains(event2.target) && (event2.type === "keyup" && event2.key === TAB_KEY$1 || /input|select|option|textarea|form/i.test(event2.target.tagName))) {
        continue;
      }
      const relatedTarget = {
        relatedTarget: context._element
      };
      if (event2.type === "click") {
        relatedTarget.clickEvent = event2;
      }
      context._completeHide(relatedTarget);
    }
  }
  static dataApiKeydownHandler(event2) {
    const isInput = /input|textarea/i.test(event2.target.tagName);
    const isEscapeEvent = event2.key === ESCAPE_KEY$2;
    const isUpOrDownEvent = [ARROW_UP_KEY$1, ARROW_DOWN_KEY$1].includes(event2.key);
    if (!isUpOrDownEvent && !isEscapeEvent) {
      return;
    }
    if (isInput && !isEscapeEvent) {
      return;
    }
    event2.preventDefault();
    const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE$3) ? this : SelectorEngine.prev(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.next(this, SELECTOR_DATA_TOGGLE$3)[0] || SelectorEngine.findOne(SELECTOR_DATA_TOGGLE$3, event2.delegateTarget.parentNode);
    const instance = _Dropdown.getOrCreateInstance(getToggleButton);
    if (isUpOrDownEvent) {
      event2.stopPropagation();
      instance.show();
      instance._selectMenuItem(event2);
      return;
    }
    if (instance._isShown()) {
      event2.stopPropagation();
      instance.hide();
      getToggleButton.focus();
    }
  }
};
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$3, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, Dropdown.clearMenus);
EventHandler.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
EventHandler.on(document, EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$3, function(event2) {
  event2.preventDefault();
  Dropdown.getOrCreateInstance(this).toggle();
});
defineJQueryPlugin(Dropdown);
var NAME$9 = "backdrop";
var CLASS_NAME_FADE$4 = "fade";
var CLASS_NAME_SHOW$5 = "show";
var EVENT_MOUSEDOWN = `mousedown.bs.${NAME$9}`;
var Default$8 = {
  className: "modal-backdrop",
  clickCallback: null,
  isAnimated: false,
  isVisible: true,
  // if false, we use the backdrop helper without adding any element to the dom
  rootElement: "body"
  // give the choice to place backdrop under different elements
};
var DefaultType$8 = {
  className: "string",
  clickCallback: "(function|null)",
  isAnimated: "boolean",
  isVisible: "boolean",
  rootElement: "(element|string)"
};
var Backdrop = class extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isAppended = false;
    this._element = null;
  }
  // Getters
  static get Default() {
    return Default$8;
  }
  static get DefaultType() {
    return DefaultType$8;
  }
  static get NAME() {
    return NAME$9;
  }
  // Public
  show(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._append();
    const element = this._getElement();
    if (this._config.isAnimated) {
      reflow(element);
    }
    element.classList.add(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      execute(callback);
    });
  }
  hide(callback) {
    if (!this._config.isVisible) {
      execute(callback);
      return;
    }
    this._getElement().classList.remove(CLASS_NAME_SHOW$5);
    this._emulateAnimation(() => {
      this.dispose();
      execute(callback);
    });
  }
  dispose() {
    if (!this._isAppended) {
      return;
    }
    EventHandler.off(this._element, EVENT_MOUSEDOWN);
    this._element.remove();
    this._isAppended = false;
  }
  // Private
  _getElement() {
    if (!this._element) {
      const backdrop = document.createElement("div");
      backdrop.className = this._config.className;
      if (this._config.isAnimated) {
        backdrop.classList.add(CLASS_NAME_FADE$4);
      }
      this._element = backdrop;
    }
    return this._element;
  }
  _configAfterMerge(config) {
    config.rootElement = getElement(config.rootElement);
    return config;
  }
  _append() {
    if (this._isAppended) {
      return;
    }
    const element = this._getElement();
    this._config.rootElement.append(element);
    EventHandler.on(element, EVENT_MOUSEDOWN, () => {
      execute(this._config.clickCallback);
    });
    this._isAppended = true;
  }
  _emulateAnimation(callback) {
    executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
  }
};
var NAME$8 = "focustrap";
var DATA_KEY$5 = "bs.focustrap";
var EVENT_KEY$5 = `.${DATA_KEY$5}`;
var EVENT_FOCUSIN$2 = `focusin${EVENT_KEY$5}`;
var EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY$5}`;
var TAB_KEY = "Tab";
var TAB_NAV_FORWARD = "forward";
var TAB_NAV_BACKWARD = "backward";
var Default$7 = {
  autofocus: true,
  trapElement: null
  // The element to trap focus inside of
};
var DefaultType$7 = {
  autofocus: "boolean",
  trapElement: "element"
};
var FocusTrap = class extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
    this._isActive = false;
    this._lastTabNavDirection = null;
  }
  // Getters
  static get Default() {
    return Default$7;
  }
  static get DefaultType() {
    return DefaultType$7;
  }
  static get NAME() {
    return NAME$8;
  }
  // Public
  activate() {
    if (this._isActive) {
      return;
    }
    if (this._config.autofocus) {
      this._config.trapElement.focus();
    }
    EventHandler.off(document, EVENT_KEY$5);
    EventHandler.on(document, EVENT_FOCUSIN$2, (event2) => this._handleFocusin(event2));
    EventHandler.on(document, EVENT_KEYDOWN_TAB, (event2) => this._handleKeydown(event2));
    this._isActive = true;
  }
  deactivate() {
    if (!this._isActive) {
      return;
    }
    this._isActive = false;
    EventHandler.off(document, EVENT_KEY$5);
  }
  // Private
  _handleFocusin(event2) {
    const {
      trapElement
    } = this._config;
    if (event2.target === document || event2.target === trapElement || trapElement.contains(event2.target)) {
      return;
    }
    const elements = SelectorEngine.focusableChildren(trapElement);
    if (elements.length === 0) {
      trapElement.focus();
    } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
      elements[elements.length - 1].focus();
    } else {
      elements[0].focus();
    }
  }
  _handleKeydown(event2) {
    if (event2.key !== TAB_KEY) {
      return;
    }
    this._lastTabNavDirection = event2.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
  }
};
var SELECTOR_FIXED_CONTENT = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top";
var SELECTOR_STICKY_CONTENT = ".sticky-top";
var PROPERTY_PADDING = "padding-right";
var PROPERTY_MARGIN = "margin-right";
var ScrollBarHelper = class {
  constructor() {
    this._element = document.body;
  }
  // Public
  getWidth() {
    const documentWidth = document.documentElement.clientWidth;
    return Math.abs(window.innerWidth - documentWidth);
  }
  hide() {
    const width = this.getWidth();
    this._disableOverFlow();
    this._setElementAttributes(this._element, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
    this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, (calculatedValue) => calculatedValue + width);
    this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, (calculatedValue) => calculatedValue - width);
  }
  reset() {
    this._resetElementAttributes(this._element, "overflow");
    this._resetElementAttributes(this._element, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
    this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
  }
  isOverflowing() {
    return this.getWidth() > 0;
  }
  // Private
  _disableOverFlow() {
    this._saveInitialAttribute(this._element, "overflow");
    this._element.style.overflow = "hidden";
  }
  _setElementAttributes(selector, styleProperty, callback) {
    const scrollbarWidth = this.getWidth();
    const manipulationCallBack = (element) => {
      if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
        return;
      }
      this._saveInitialAttribute(element, styleProperty);
      const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
      element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _saveInitialAttribute(element, styleProperty) {
    const actualValue = element.style.getPropertyValue(styleProperty);
    if (actualValue) {
      Manipulator.setDataAttribute(element, styleProperty, actualValue);
    }
  }
  _resetElementAttributes(selector, styleProperty) {
    const manipulationCallBack = (element) => {
      const value = Manipulator.getDataAttribute(element, styleProperty);
      if (value === null) {
        element.style.removeProperty(styleProperty);
        return;
      }
      Manipulator.removeDataAttribute(element, styleProperty);
      element.style.setProperty(styleProperty, value);
    };
    this._applyManipulationCallback(selector, manipulationCallBack);
  }
  _applyManipulationCallback(selector, callBack) {
    if (isElement2(selector)) {
      callBack(selector);
      return;
    }
    for (const sel of SelectorEngine.find(selector, this._element)) {
      callBack(sel);
    }
  }
};
var NAME$7 = "modal";
var DATA_KEY$4 = "bs.modal";
var EVENT_KEY$4 = `.${DATA_KEY$4}`;
var DATA_API_KEY$2 = ".data-api";
var ESCAPE_KEY$1 = "Escape";
var EVENT_HIDE$4 = `hide${EVENT_KEY$4}`;
var EVENT_HIDE_PREVENTED$1 = `hidePrevented${EVENT_KEY$4}`;
var EVENT_HIDDEN$4 = `hidden${EVENT_KEY$4}`;
var EVENT_SHOW$4 = `show${EVENT_KEY$4}`;
var EVENT_SHOWN$4 = `shown${EVENT_KEY$4}`;
var EVENT_RESIZE$1 = `resize${EVENT_KEY$4}`;
var EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY$4}`;
var EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY$4}`;
var EVENT_KEYDOWN_DISMISS$1 = `keydown.dismiss${EVENT_KEY$4}`;
var EVENT_CLICK_DATA_API$2 = `click${EVENT_KEY$4}${DATA_API_KEY$2}`;
var CLASS_NAME_OPEN = "modal-open";
var CLASS_NAME_FADE$3 = "fade";
var CLASS_NAME_SHOW$4 = "show";
var CLASS_NAME_STATIC = "modal-static";
var OPEN_SELECTOR$1 = ".modal.show";
var SELECTOR_DIALOG = ".modal-dialog";
var SELECTOR_MODAL_BODY = ".modal-body";
var SELECTOR_DATA_TOGGLE$2 = '[data-bs-toggle="modal"]';
var Default$6 = {
  backdrop: true,
  focus: true,
  keyboard: true
};
var DefaultType$6 = {
  backdrop: "(boolean|string)",
  focus: "boolean",
  keyboard: "boolean"
};
var Modal = class _Modal extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._dialog = SelectorEngine.findOne(SELECTOR_DIALOG, this._element);
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._isShown = false;
    this._isTransitioning = false;
    this._scrollBar = new ScrollBarHelper();
    this._addEventListeners();
  }
  // Getters
  static get Default() {
    return Default$6;
  }
  static get DefaultType() {
    return DefaultType$6;
  }
  static get NAME() {
    return NAME$7;
  }
  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown || this._isTransitioning) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$4, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._isTransitioning = true;
    this._scrollBar.hide();
    document.body.classList.add(CLASS_NAME_OPEN);
    this._adjustDialog();
    this._backdrop.show(() => this._showElement(relatedTarget));
  }
  hide() {
    if (!this._isShown || this._isTransitioning) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$4);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._isShown = false;
    this._isTransitioning = true;
    this._focustrap.deactivate();
    this._element.classList.remove(CLASS_NAME_SHOW$4);
    this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
  }
  dispose() {
    EventHandler.off(window, EVENT_KEY$4);
    EventHandler.off(this._dialog, EVENT_KEY$4);
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  handleUpdate() {
    this._adjustDialog();
  }
  // Private
  _initializeBackDrop() {
    return new Backdrop({
      isVisible: Boolean(this._config.backdrop),
      // 'static' option will be translated to true, and booleans will keep their value,
      isAnimated: this._isAnimated()
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _showElement(relatedTarget) {
    if (!document.body.contains(this._element)) {
      document.body.append(this._element);
    }
    this._element.style.display = "block";
    this._element.removeAttribute("aria-hidden");
    this._element.setAttribute("aria-modal", true);
    this._element.setAttribute("role", "dialog");
    this._element.scrollTop = 0;
    const modalBody = SelectorEngine.findOne(SELECTOR_MODAL_BODY, this._dialog);
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW$4);
    const transitionComplete = () => {
      if (this._config.focus) {
        this._focustrap.activate();
      }
      this._isTransitioning = false;
      EventHandler.trigger(this._element, EVENT_SHOWN$4, {
        relatedTarget
      });
    };
    this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS$1, (event2) => {
      if (event2.key !== ESCAPE_KEY$1) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      this._triggerBackdropTransition();
    });
    EventHandler.on(window, EVENT_RESIZE$1, () => {
      if (this._isShown && !this._isTransitioning) {
        this._adjustDialog();
      }
    });
    EventHandler.on(this._element, EVENT_MOUSEDOWN_DISMISS, (event2) => {
      EventHandler.one(this._element, EVENT_CLICK_DISMISS, (event22) => {
        if (this._element !== event2.target || this._element !== event22.target) {
          return;
        }
        if (this._config.backdrop === "static") {
          this._triggerBackdropTransition();
          return;
        }
        if (this._config.backdrop) {
          this.hide();
        }
      });
    });
  }
  _hideModal() {
    this._element.style.display = "none";
    this._element.setAttribute("aria-hidden", true);
    this._element.removeAttribute("aria-modal");
    this._element.removeAttribute("role");
    this._isTransitioning = false;
    this._backdrop.hide(() => {
      document.body.classList.remove(CLASS_NAME_OPEN);
      this._resetAdjustments();
      this._scrollBar.reset();
      EventHandler.trigger(this._element, EVENT_HIDDEN$4);
    });
  }
  _isAnimated() {
    return this._element.classList.contains(CLASS_NAME_FADE$3);
  }
  _triggerBackdropTransition() {
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED$1);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const initialOverflowY = this._element.style.overflowY;
    if (initialOverflowY === "hidden" || this._element.classList.contains(CLASS_NAME_STATIC)) {
      return;
    }
    if (!isModalOverflowing) {
      this._element.style.overflowY = "hidden";
    }
    this._element.classList.add(CLASS_NAME_STATIC);
    this._queueCallback(() => {
      this._element.classList.remove(CLASS_NAME_STATIC);
      this._queueCallback(() => {
        this._element.style.overflowY = initialOverflowY;
      }, this._dialog);
    }, this._dialog);
    this._element.focus();
  }
  /**
   * The following methods are used to handle overflowing modals
   */
  _adjustDialog() {
    const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
    const scrollbarWidth = this._scrollBar.getWidth();
    const isBodyOverflowing = scrollbarWidth > 0;
    if (isBodyOverflowing && !isModalOverflowing) {
      const property = isRTL() ? "paddingLeft" : "paddingRight";
      this._element.style[property] = `${scrollbarWidth}px`;
    }
    if (!isBodyOverflowing && isModalOverflowing) {
      const property = isRTL() ? "paddingRight" : "paddingLeft";
      this._element.style[property] = `${scrollbarWidth}px`;
    }
  }
  _resetAdjustments() {
    this._element.style.paddingLeft = "";
    this._element.style.paddingRight = "";
  }
  // Static
  static jQueryInterface(config, relatedTarget) {
    return this.each(function() {
      const data = _Modal.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](relatedTarget);
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$2, SELECTOR_DATA_TOGGLE$2, function(event2) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (["A", "AREA"].includes(this.tagName)) {
    event2.preventDefault();
  }
  EventHandler.one(target, EVENT_SHOW$4, (showEvent) => {
    if (showEvent.defaultPrevented) {
      return;
    }
    EventHandler.one(target, EVENT_HIDDEN$4, () => {
      if (isVisible(this)) {
        this.focus();
      }
    });
  });
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR$1);
  if (alreadyOpen) {
    Modal.getInstance(alreadyOpen).hide();
  }
  const data = Modal.getOrCreateInstance(target);
  data.toggle(this);
});
enableDismissTrigger(Modal);
defineJQueryPlugin(Modal);
var NAME$6 = "offcanvas";
var DATA_KEY$3 = "bs.offcanvas";
var EVENT_KEY$3 = `.${DATA_KEY$3}`;
var DATA_API_KEY$1 = ".data-api";
var EVENT_LOAD_DATA_API$2 = `load${EVENT_KEY$3}${DATA_API_KEY$1}`;
var ESCAPE_KEY = "Escape";
var CLASS_NAME_SHOW$3 = "show";
var CLASS_NAME_SHOWING$1 = "showing";
var CLASS_NAME_HIDING = "hiding";
var CLASS_NAME_BACKDROP = "offcanvas-backdrop";
var OPEN_SELECTOR = ".offcanvas.show";
var EVENT_SHOW$3 = `show${EVENT_KEY$3}`;
var EVENT_SHOWN$3 = `shown${EVENT_KEY$3}`;
var EVENT_HIDE$3 = `hide${EVENT_KEY$3}`;
var EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY$3}`;
var EVENT_HIDDEN$3 = `hidden${EVENT_KEY$3}`;
var EVENT_RESIZE = `resize${EVENT_KEY$3}`;
var EVENT_CLICK_DATA_API$1 = `click${EVENT_KEY$3}${DATA_API_KEY$1}`;
var EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY$3}`;
var SELECTOR_DATA_TOGGLE$1 = '[data-bs-toggle="offcanvas"]';
var Default$5 = {
  backdrop: true,
  keyboard: true,
  scroll: false
};
var DefaultType$5 = {
  backdrop: "(boolean|string)",
  keyboard: "boolean",
  scroll: "boolean"
};
var Offcanvas = class _Offcanvas extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._isShown = false;
    this._backdrop = this._initializeBackDrop();
    this._focustrap = this._initializeFocusTrap();
    this._addEventListeners();
  }
  // Getters
  static get Default() {
    return Default$5;
  }
  static get DefaultType() {
    return DefaultType$5;
  }
  static get NAME() {
    return NAME$6;
  }
  // Public
  toggle(relatedTarget) {
    return this._isShown ? this.hide() : this.show(relatedTarget);
  }
  show(relatedTarget) {
    if (this._isShown) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW$3, {
      relatedTarget
    });
    if (showEvent.defaultPrevented) {
      return;
    }
    this._isShown = true;
    this._backdrop.show();
    if (!this._config.scroll) {
      new ScrollBarHelper().hide();
    }
    this._element.setAttribute("aria-modal", true);
    this._element.setAttribute("role", "dialog");
    this._element.classList.add(CLASS_NAME_SHOWING$1);
    const completeCallBack = () => {
      if (!this._config.scroll || this._config.backdrop) {
        this._focustrap.activate();
      }
      this._element.classList.add(CLASS_NAME_SHOW$3);
      this._element.classList.remove(CLASS_NAME_SHOWING$1);
      EventHandler.trigger(this._element, EVENT_SHOWN$3, {
        relatedTarget
      });
    };
    this._queueCallback(completeCallBack, this._element, true);
  }
  hide() {
    if (!this._isShown) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE$3);
    if (hideEvent.defaultPrevented) {
      return;
    }
    this._focustrap.deactivate();
    this._element.blur();
    this._isShown = false;
    this._element.classList.add(CLASS_NAME_HIDING);
    this._backdrop.hide();
    const completeCallback = () => {
      this._element.classList.remove(CLASS_NAME_SHOW$3, CLASS_NAME_HIDING);
      this._element.removeAttribute("aria-modal");
      this._element.removeAttribute("role");
      if (!this._config.scroll) {
        new ScrollBarHelper().reset();
      }
      EventHandler.trigger(this._element, EVENT_HIDDEN$3);
    };
    this._queueCallback(completeCallback, this._element, true);
  }
  dispose() {
    this._backdrop.dispose();
    this._focustrap.deactivate();
    super.dispose();
  }
  // Private
  _initializeBackDrop() {
    const clickCallback = () => {
      if (this._config.backdrop === "static") {
        EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
        return;
      }
      this.hide();
    };
    const isVisible2 = Boolean(this._config.backdrop);
    return new Backdrop({
      className: CLASS_NAME_BACKDROP,
      isVisible: isVisible2,
      isAnimated: true,
      rootElement: this._element.parentNode,
      clickCallback: isVisible2 ? clickCallback : null
    });
  }
  _initializeFocusTrap() {
    return new FocusTrap({
      trapElement: this._element
    });
  }
  _addEventListeners() {
    EventHandler.on(this._element, EVENT_KEYDOWN_DISMISS, (event2) => {
      if (event2.key !== ESCAPE_KEY) {
        return;
      }
      if (this._config.keyboard) {
        this.hide();
        return;
      }
      EventHandler.trigger(this._element, EVENT_HIDE_PREVENTED);
    });
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Offcanvas.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config](this);
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE$1, function(event2) {
  const target = SelectorEngine.getElementFromSelector(this);
  if (["A", "AREA"].includes(this.tagName)) {
    event2.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  EventHandler.one(target, EVENT_HIDDEN$3, () => {
    if (isVisible(this)) {
      this.focus();
    }
  });
  const alreadyOpen = SelectorEngine.findOne(OPEN_SELECTOR);
  if (alreadyOpen && alreadyOpen !== target) {
    Offcanvas.getInstance(alreadyOpen).hide();
  }
  const data = Offcanvas.getOrCreateInstance(target);
  data.toggle(this);
});
EventHandler.on(window, EVENT_LOAD_DATA_API$2, () => {
  for (const selector of SelectorEngine.find(OPEN_SELECTOR)) {
    Offcanvas.getOrCreateInstance(selector).show();
  }
});
EventHandler.on(window, EVENT_RESIZE, () => {
  for (const element of SelectorEngine.find("[aria-modal][class*=show][class*=offcanvas-]")) {
    if (getComputedStyle(element).position !== "fixed") {
      Offcanvas.getOrCreateInstance(element).hide();
    }
  }
});
enableDismissTrigger(Offcanvas);
defineJQueryPlugin(Offcanvas);
var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
var DefaultAllowlist = {
  // Global attributes allowed on any supplied element below.
  "*": ["class", "dir", "id", "lang", "role", ARIA_ATTRIBUTE_PATTERN],
  a: ["target", "href", "title", "rel"],
  area: [],
  b: [],
  br: [],
  col: [],
  code: [],
  dd: [],
  div: [],
  dl: [],
  dt: [],
  em: [],
  hr: [],
  h1: [],
  h2: [],
  h3: [],
  h4: [],
  h5: [],
  h6: [],
  i: [],
  img: ["src", "srcset", "alt", "title", "width", "height"],
  li: [],
  ol: [],
  p: [],
  pre: [],
  s: [],
  small: [],
  span: [],
  sub: [],
  sup: [],
  strong: [],
  u: [],
  ul: []
};
var uriAttributes = /* @__PURE__ */ new Set(["background", "cite", "href", "itemtype", "longdesc", "poster", "src", "xlink:href"]);
var SAFE_URL_PATTERN = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
var allowedAttribute = (attribute, allowedAttributeList) => {
  const attributeName = attribute.nodeName.toLowerCase();
  if (allowedAttributeList.includes(attributeName)) {
    if (uriAttributes.has(attributeName)) {
      return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue));
    }
    return true;
  }
  return allowedAttributeList.filter((attributeRegex) => attributeRegex instanceof RegExp).some((regex) => regex.test(attributeName));
};
function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
  if (!unsafeHtml.length) {
    return unsafeHtml;
  }
  if (sanitizeFunction && typeof sanitizeFunction === "function") {
    return sanitizeFunction(unsafeHtml);
  }
  const domParser = new window.DOMParser();
  const createdDocument = domParser.parseFromString(unsafeHtml, "text/html");
  const elements = [].concat(...createdDocument.body.querySelectorAll("*"));
  for (const element of elements) {
    const elementName = element.nodeName.toLowerCase();
    if (!Object.keys(allowList).includes(elementName)) {
      element.remove();
      continue;
    }
    const attributeList = [].concat(...element.attributes);
    const allowedAttributes = [].concat(allowList["*"] || [], allowList[elementName] || []);
    for (const attribute of attributeList) {
      if (!allowedAttribute(attribute, allowedAttributes)) {
        element.removeAttribute(attribute.nodeName);
      }
    }
  }
  return createdDocument.body.innerHTML;
}
var NAME$5 = "TemplateFactory";
var Default$4 = {
  allowList: DefaultAllowlist,
  content: {},
  // { selector : text ,  selector2 : text2 , }
  extraClass: "",
  html: false,
  sanitize: true,
  sanitizeFn: null,
  template: "<div></div>"
};
var DefaultType$4 = {
  allowList: "object",
  content: "object",
  extraClass: "(string|function)",
  html: "boolean",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  template: "string"
};
var DefaultContentType = {
  entry: "(string|element|function|null)",
  selector: "(string|element)"
};
var TemplateFactory = class extends Config {
  constructor(config) {
    super();
    this._config = this._getConfig(config);
  }
  // Getters
  static get Default() {
    return Default$4;
  }
  static get DefaultType() {
    return DefaultType$4;
  }
  static get NAME() {
    return NAME$5;
  }
  // Public
  getContent() {
    return Object.values(this._config.content).map((config) => this._resolvePossibleFunction(config)).filter(Boolean);
  }
  hasContent() {
    return this.getContent().length > 0;
  }
  changeContent(content) {
    this._checkContent(content);
    this._config.content = {
      ...this._config.content,
      ...content
    };
    return this;
  }
  toHtml() {
    const templateWrapper = document.createElement("div");
    templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
    for (const [selector, text] of Object.entries(this._config.content)) {
      this._setContent(templateWrapper, text, selector);
    }
    const template = templateWrapper.children[0];
    const extraClass = this._resolvePossibleFunction(this._config.extraClass);
    if (extraClass) {
      template.classList.add(...extraClass.split(" "));
    }
    return template;
  }
  // Private
  _typeCheckConfig(config) {
    super._typeCheckConfig(config);
    this._checkContent(config.content);
  }
  _checkContent(arg) {
    for (const [selector, content] of Object.entries(arg)) {
      super._typeCheckConfig({
        selector,
        entry: content
      }, DefaultContentType);
    }
  }
  _setContent(template, content, selector) {
    const templateElement = SelectorEngine.findOne(selector, template);
    if (!templateElement) {
      return;
    }
    content = this._resolvePossibleFunction(content);
    if (!content) {
      templateElement.remove();
      return;
    }
    if (isElement2(content)) {
      this._putElementInTemplate(getElement(content), templateElement);
      return;
    }
    if (this._config.html) {
      templateElement.innerHTML = this._maybeSanitize(content);
      return;
    }
    templateElement.textContent = content;
  }
  _maybeSanitize(arg) {
    return this._config.sanitize ? sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [void 0, this]);
  }
  _putElementInTemplate(element, templateElement) {
    if (this._config.html) {
      templateElement.innerHTML = "";
      templateElement.append(element);
      return;
    }
    templateElement.textContent = element.textContent;
  }
};
var NAME$4 = "tooltip";
var DISALLOWED_ATTRIBUTES = /* @__PURE__ */ new Set(["sanitize", "allowList", "sanitizeFn"]);
var CLASS_NAME_FADE$2 = "fade";
var CLASS_NAME_MODAL = "modal";
var CLASS_NAME_SHOW$2 = "show";
var SELECTOR_TOOLTIP_INNER = ".tooltip-inner";
var SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
var EVENT_MODAL_HIDE = "hide.bs.modal";
var TRIGGER_HOVER = "hover";
var TRIGGER_FOCUS = "focus";
var TRIGGER_CLICK = "click";
var TRIGGER_MANUAL = "manual";
var EVENT_HIDE$2 = "hide";
var EVENT_HIDDEN$2 = "hidden";
var EVENT_SHOW$2 = "show";
var EVENT_SHOWN$2 = "shown";
var EVENT_INSERTED = "inserted";
var EVENT_CLICK$1 = "click";
var EVENT_FOCUSIN$1 = "focusin";
var EVENT_FOCUSOUT$1 = "focusout";
var EVENT_MOUSEENTER = "mouseenter";
var EVENT_MOUSELEAVE = "mouseleave";
var AttachmentMap = {
  AUTO: "auto",
  TOP: "top",
  RIGHT: isRTL() ? "left" : "right",
  BOTTOM: "bottom",
  LEFT: isRTL() ? "right" : "left"
};
var Default$3 = {
  allowList: DefaultAllowlist,
  animation: true,
  boundary: "clippingParents",
  container: false,
  customClass: "",
  delay: 0,
  fallbackPlacements: ["top", "right", "bottom", "left"],
  html: false,
  offset: [0, 6],
  placement: "top",
  popperConfig: null,
  sanitize: true,
  sanitizeFn: null,
  selector: false,
  template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
  title: "",
  trigger: "hover focus"
};
var DefaultType$3 = {
  allowList: "object",
  animation: "boolean",
  boundary: "(string|element)",
  container: "(string|element|boolean)",
  customClass: "(string|function)",
  delay: "(number|object)",
  fallbackPlacements: "array",
  html: "boolean",
  offset: "(array|string|function)",
  placement: "(string|function)",
  popperConfig: "(null|object|function)",
  sanitize: "boolean",
  sanitizeFn: "(null|function)",
  selector: "(string|boolean)",
  template: "string",
  title: "(string|element|function)",
  trigger: "string"
};
var Tooltip = class _Tooltip extends BaseComponent {
  constructor(element, config) {
    if (typeof lib_exports === "undefined") {
      throw new TypeError("Bootstrap's tooltips require Popper (https://github.com/floating-ui/popper-docs/blob/main/docs/v2/index.md)");
    }
    super(element, config);
    this._isEnabled = true;
    this._timeout = 0;
    this._isHovered = null;
    this._activeTrigger = {};
    this._popper = null;
    this._templateFactory = null;
    this._newContent = null;
    this.tip = null;
    this._setListeners();
    if (!this._config.selector) {
      this._fixTitle();
    }
  }
  // Getters
  static get Default() {
    return Default$3;
  }
  static get DefaultType() {
    return DefaultType$3;
  }
  static get NAME() {
    return NAME$4;
  }
  // Public
  enable() {
    this._isEnabled = true;
  }
  disable() {
    this._isEnabled = false;
  }
  toggleEnabled() {
    this._isEnabled = !this._isEnabled;
  }
  toggle() {
    if (!this._isEnabled) {
      return;
    }
    if (this._isShown()) {
      this._leave();
      return;
    }
    this._enter();
  }
  dispose() {
    clearTimeout(this._timeout);
    EventHandler.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
    if (this._element.getAttribute("data-bs-original-title")) {
      this._element.setAttribute("title", this._element.getAttribute("data-bs-original-title"));
    }
    this._disposePopper();
    super.dispose();
  }
  show() {
    if (this._element.style.display === "none") {
      throw new Error("Please use show on visible elements");
    }
    if (!(this._isWithContent() && this._isEnabled)) {
      return;
    }
    const showEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOW$2));
    const shadowRoot = findShadowRoot(this._element);
    const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
    if (showEvent.defaultPrevented || !isInTheDom) {
      return;
    }
    this._disposePopper();
    const tip = this._getTipElement();
    this._element.setAttribute("aria-describedby", tip.getAttribute("id"));
    const {
      container
    } = this._config;
    if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
      container.append(tip);
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
    }
    this._popper = this._createPopper(tip);
    tip.classList.add(CLASS_NAME_SHOW$2);
    if ("ontouchstart" in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.on(element, "mouseover", noop);
      }
    }
    const complete = () => {
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_SHOWN$2));
      if (this._isHovered === false) {
        this._leave();
      }
      this._isHovered = false;
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  hide() {
    if (!this._isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDE$2));
    if (hideEvent.defaultPrevented) {
      return;
    }
    const tip = this._getTipElement();
    tip.classList.remove(CLASS_NAME_SHOW$2);
    if ("ontouchstart" in document.documentElement) {
      for (const element of [].concat(...document.body.children)) {
        EventHandler.off(element, "mouseover", noop);
      }
    }
    this._activeTrigger[TRIGGER_CLICK] = false;
    this._activeTrigger[TRIGGER_FOCUS] = false;
    this._activeTrigger[TRIGGER_HOVER] = false;
    this._isHovered = null;
    const complete = () => {
      if (this._isWithActiveTrigger()) {
        return;
      }
      if (!this._isHovered) {
        this._disposePopper();
      }
      this._element.removeAttribute("aria-describedby");
      EventHandler.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN$2));
    };
    this._queueCallback(complete, this.tip, this._isAnimated());
  }
  update() {
    if (this._popper) {
      this._popper.update();
    }
  }
  // Protected
  _isWithContent() {
    return Boolean(this._getTitle());
  }
  _getTipElement() {
    if (!this.tip) {
      this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
    }
    return this.tip;
  }
  _createTipElement(content) {
    const tip = this._getTemplateFactory(content).toHtml();
    if (!tip) {
      return null;
    }
    tip.classList.remove(CLASS_NAME_FADE$2, CLASS_NAME_SHOW$2);
    tip.classList.add(`bs-${this.constructor.NAME}-auto`);
    const tipId = getUID(this.constructor.NAME).toString();
    tip.setAttribute("id", tipId);
    if (this._isAnimated()) {
      tip.classList.add(CLASS_NAME_FADE$2);
    }
    return tip;
  }
  setContent(content) {
    this._newContent = content;
    if (this._isShown()) {
      this._disposePopper();
      this.show();
    }
  }
  _getTemplateFactory(content) {
    if (this._templateFactory) {
      this._templateFactory.changeContent(content);
    } else {
      this._templateFactory = new TemplateFactory({
        ...this._config,
        // the `content` var has to be after `this._config`
        // to override config.content in case of popover
        content,
        extraClass: this._resolvePossibleFunction(this._config.customClass)
      });
    }
    return this._templateFactory;
  }
  _getContentForTemplate() {
    return {
      [SELECTOR_TOOLTIP_INNER]: this._getTitle()
    };
  }
  _getTitle() {
    return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute("data-bs-original-title");
  }
  // Private
  _initializeOnDelegatedTarget(event2) {
    return this.constructor.getOrCreateInstance(event2.delegateTarget, this._getDelegateConfig());
  }
  _isAnimated() {
    return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE$2);
  }
  _isShown() {
    return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW$2);
  }
  _createPopper(tip) {
    const placement = execute(this._config.placement, [this, tip, this._element]);
    const attachment = AttachmentMap[placement.toUpperCase()];
    return createPopper3(this._element, tip, this._getPopperConfig(attachment));
  }
  _getOffset() {
    const {
      offset: offset2
    } = this._config;
    if (typeof offset2 === "string") {
      return offset2.split(",").map((value) => Number.parseInt(value, 10));
    }
    if (typeof offset2 === "function") {
      return (popperData) => offset2(popperData, this._element);
    }
    return offset2;
  }
  _resolvePossibleFunction(arg) {
    return execute(arg, [this._element, this._element]);
  }
  _getPopperConfig(attachment) {
    const defaultBsPopperConfig = {
      placement: attachment,
      modifiers: [{
        name: "flip",
        options: {
          fallbackPlacements: this._config.fallbackPlacements
        }
      }, {
        name: "offset",
        options: {
          offset: this._getOffset()
        }
      }, {
        name: "preventOverflow",
        options: {
          boundary: this._config.boundary
        }
      }, {
        name: "arrow",
        options: {
          element: `.${this.constructor.NAME}-arrow`
        }
      }, {
        name: "preSetPlacement",
        enabled: true,
        phase: "beforeMain",
        fn: (data) => {
          this._getTipElement().setAttribute("data-popper-placement", data.state.placement);
        }
      }]
    };
    return {
      ...defaultBsPopperConfig,
      ...execute(this._config.popperConfig, [void 0, defaultBsPopperConfig])
    };
  }
  _setListeners() {
    const triggers = this._config.trigger.split(" ");
    for (const trigger of triggers) {
      if (trigger === "click") {
        EventHandler.on(this._element, this.constructor.eventName(EVENT_CLICK$1), this._config.selector, (event2) => {
          const context = this._initializeOnDelegatedTarget(event2);
          context._activeTrigger[TRIGGER_CLICK] = !(context._isShown() && context._activeTrigger[TRIGGER_CLICK]);
          context.toggle();
        });
      } else if (trigger !== TRIGGER_MANUAL) {
        const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN$1);
        const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT$1);
        EventHandler.on(this._element, eventIn, this._config.selector, (event2) => {
          const context = this._initializeOnDelegatedTarget(event2);
          context._activeTrigger[event2.type === "focusin" ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
          context._enter();
        });
        EventHandler.on(this._element, eventOut, this._config.selector, (event2) => {
          const context = this._initializeOnDelegatedTarget(event2);
          context._activeTrigger[event2.type === "focusout" ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event2.relatedTarget);
          context._leave();
        });
      }
    }
    this._hideModalHandler = () => {
      if (this._element) {
        this.hide();
      }
    };
    EventHandler.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
  }
  _fixTitle() {
    const title = this._element.getAttribute("title");
    if (!title) {
      return;
    }
    if (!this._element.getAttribute("aria-label") && !this._element.textContent.trim()) {
      this._element.setAttribute("aria-label", title);
    }
    this._element.setAttribute("data-bs-original-title", title);
    this._element.removeAttribute("title");
  }
  _enter() {
    if (this._isShown() || this._isHovered) {
      this._isHovered = true;
      return;
    }
    this._isHovered = true;
    this._setTimeout(() => {
      if (this._isHovered) {
        this.show();
      }
    }, this._config.delay.show);
  }
  _leave() {
    if (this._isWithActiveTrigger()) {
      return;
    }
    this._isHovered = false;
    this._setTimeout(() => {
      if (!this._isHovered) {
        this.hide();
      }
    }, this._config.delay.hide);
  }
  _setTimeout(handler2, timeout) {
    clearTimeout(this._timeout);
    this._timeout = setTimeout(handler2, timeout);
  }
  _isWithActiveTrigger() {
    return Object.values(this._activeTrigger).includes(true);
  }
  _getConfig(config) {
    const dataAttributes = Manipulator.getDataAttributes(this._element);
    const title = this._element.getAttribute("data-bs-title");
    const content = this._element.getAttribute("data-bs-content");
    if (title !== null) {
      dataAttributes.title = title;
    }
    if (content !== null) {
      dataAttributes.content = content;
    }
    for (const dataAttribute of Object.keys(dataAttributes)) {
      if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
        delete dataAttributes[dataAttribute];
      }
    }
    config = {
      ...dataAttributes,
      ...typeof config === "object" && config ? config : {}
    };
    config = this._mergeConfigObj(config);
    config = this._configAfterMerge(config);
    this._typeCheckConfig(config);
    return config;
  }
  _configAfterMerge(config) {
    config.container = config.container === false ? document.body : getElement(config.container);
    if (typeof config.delay === "number") {
      config.delay = {
        show: config.delay,
        hide: config.delay
      };
    }
    if (typeof config.title === "number") {
      config.title = config.title.toString();
    }
    if (typeof config.content === "number") {
      config.content = config.content.toString();
    }
    return config;
  }
  _getDelegateConfig() {
    const config = {};
    for (const [key, value] of Object.entries(this._config)) {
      if (this.constructor.Default[key] !== value) {
        config[key] = value;
      }
    }
    config.selector = false;
    config.trigger = "manual";
    return config;
  }
  _disposePopper() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
    if (this.tip) {
      this.tip.remove();
      this.tip = null;
    }
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Tooltip.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
};
defineJQueryPlugin(Tooltip);
var NAME$3 = "popover";
var SELECTOR_TITLE = ".popover-header";
var SELECTOR_CONTENT = ".popover-body";
var Default$2 = {
  ...Tooltip.Default,
  content: "",
  offset: [0, 8],
  placement: "right",
  template: '<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',
  trigger: "click"
};
var DefaultType$2 = {
  ...Tooltip.DefaultType,
  content: "(null|string|element|function)"
};
var Popover = class _Popover extends Tooltip {
  // Getters
  static get Default() {
    return Default$2;
  }
  static get DefaultType() {
    return DefaultType$2;
  }
  static get NAME() {
    return NAME$3;
  }
  // Overrides
  _isWithContent() {
    return this._getTitle() || this._getContent();
  }
  // Private
  _getContentForTemplate() {
    return {
      [SELECTOR_TITLE]: this._getTitle(),
      [SELECTOR_CONTENT]: this._getContent()
    };
  }
  _getContent() {
    return this._resolvePossibleFunction(this._config.content);
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Popover.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (typeof data[config] === "undefined") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
};
defineJQueryPlugin(Popover);
var NAME$2 = "scrollspy";
var DATA_KEY$2 = "bs.scrollspy";
var EVENT_KEY$2 = `.${DATA_KEY$2}`;
var DATA_API_KEY = ".data-api";
var EVENT_ACTIVATE = `activate${EVENT_KEY$2}`;
var EVENT_CLICK = `click${EVENT_KEY$2}`;
var EVENT_LOAD_DATA_API$1 = `load${EVENT_KEY$2}${DATA_API_KEY}`;
var CLASS_NAME_DROPDOWN_ITEM = "dropdown-item";
var CLASS_NAME_ACTIVE$1 = "active";
var SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
var SELECTOR_TARGET_LINKS = "[href]";
var SELECTOR_NAV_LIST_GROUP = ".nav, .list-group";
var SELECTOR_NAV_LINKS = ".nav-link";
var SELECTOR_NAV_ITEMS = ".nav-item";
var SELECTOR_LIST_ITEMS = ".list-group-item";
var SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
var SELECTOR_DROPDOWN = ".dropdown";
var SELECTOR_DROPDOWN_TOGGLE$1 = ".dropdown-toggle";
var Default$1 = {
  offset: null,
  // TODO: v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: "0px 0px -25%",
  smoothScroll: false,
  target: null,
  threshold: [0.1, 0.5, 1]
};
var DefaultType$1 = {
  offset: "(number|null)",
  // TODO v6 @deprecated, keep it for backwards compatibility reasons
  rootMargin: "string",
  smoothScroll: "boolean",
  target: "element",
  threshold: "array"
};
var ScrollSpy = class _ScrollSpy extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._targetLinks = /* @__PURE__ */ new Map();
    this._observableSections = /* @__PURE__ */ new Map();
    this._rootElement = getComputedStyle(this._element).overflowY === "visible" ? null : this._element;
    this._activeTarget = null;
    this._observer = null;
    this._previousScrollData = {
      visibleEntryTop: 0,
      parentScrollTop: 0
    };
    this.refresh();
  }
  // Getters
  static get Default() {
    return Default$1;
  }
  static get DefaultType() {
    return DefaultType$1;
  }
  static get NAME() {
    return NAME$2;
  }
  // Public
  refresh() {
    this._initializeTargetsAndObservables();
    this._maybeEnableSmoothScroll();
    if (this._observer) {
      this._observer.disconnect();
    } else {
      this._observer = this._getNewObserver();
    }
    for (const section of this._observableSections.values()) {
      this._observer.observe(section);
    }
  }
  dispose() {
    this._observer.disconnect();
    super.dispose();
  }
  // Private
  _configAfterMerge(config) {
    config.target = getElement(config.target) || document.body;
    config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
    if (typeof config.threshold === "string") {
      config.threshold = config.threshold.split(",").map((value) => Number.parseFloat(value));
    }
    return config;
  }
  _maybeEnableSmoothScroll() {
    if (!this._config.smoothScroll) {
      return;
    }
    EventHandler.off(this._config.target, EVENT_CLICK);
    EventHandler.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, (event2) => {
      const observableSection = this._observableSections.get(event2.delegateTarget.hash);
      if (observableSection) {
        event2.preventDefault();
        const root = this._rootElement || window;
        const height = observableSection.offsetTop - this._element.offsetTop;
        if (root.scrollTo) {
          root.scrollTo({
            top: height,
            behavior: "smooth"
          });
          return;
        }
        root.scrollTop = height;
      }
    });
  }
  _getNewObserver() {
    const options = {
      root: this._rootElement,
      threshold: this._config.threshold,
      rootMargin: this._config.rootMargin
    };
    return new IntersectionObserver((entries) => this._observerCallback(entries), options);
  }
  // The logic of selection
  _observerCallback(entries) {
    const targetElement = (entry) => this._targetLinks.get(`#${entry.target.id}`);
    const activate = (entry) => {
      this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
      this._process(targetElement(entry));
    };
    const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
    const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
    this._previousScrollData.parentScrollTop = parentScrollTop;
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        this._activeTarget = null;
        this._clearActiveClass(targetElement(entry));
        continue;
      }
      const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop;
      if (userScrollsDown && entryIsLowerThanPrevious) {
        activate(entry);
        if (!parentScrollTop) {
          return;
        }
        continue;
      }
      if (!userScrollsDown && !entryIsLowerThanPrevious) {
        activate(entry);
      }
    }
  }
  _initializeTargetsAndObservables() {
    this._targetLinks = /* @__PURE__ */ new Map();
    this._observableSections = /* @__PURE__ */ new Map();
    const targetLinks = SelectorEngine.find(SELECTOR_TARGET_LINKS, this._config.target);
    for (const anchor of targetLinks) {
      if (!anchor.hash || isDisabled(anchor)) {
        continue;
      }
      const observableSection = SelectorEngine.findOne(decodeURI(anchor.hash), this._element);
      if (isVisible(observableSection)) {
        this._targetLinks.set(decodeURI(anchor.hash), anchor);
        this._observableSections.set(anchor.hash, observableSection);
      }
    }
  }
  _process(target) {
    if (this._activeTarget === target) {
      return;
    }
    this._clearActiveClass(this._config.target);
    this._activeTarget = target;
    target.classList.add(CLASS_NAME_ACTIVE$1);
    this._activateParents(target);
    EventHandler.trigger(this._element, EVENT_ACTIVATE, {
      relatedTarget: target
    });
  }
  _activateParents(target) {
    if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
      SelectorEngine.findOne(SELECTOR_DROPDOWN_TOGGLE$1, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE$1);
      return;
    }
    for (const listGroup of SelectorEngine.parents(target, SELECTOR_NAV_LIST_GROUP)) {
      for (const item of SelectorEngine.prev(listGroup, SELECTOR_LINK_ITEMS)) {
        item.classList.add(CLASS_NAME_ACTIVE$1);
      }
    }
  }
  _clearActiveClass(parent) {
    parent.classList.remove(CLASS_NAME_ACTIVE$1);
    const activeNodes = SelectorEngine.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE$1}`, parent);
    for (const node of activeNodes) {
      node.classList.remove(CLASS_NAME_ACTIVE$1);
    }
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _ScrollSpy.getOrCreateInstance(this, config);
      if (typeof config !== "string") {
        return;
      }
      if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
};
EventHandler.on(window, EVENT_LOAD_DATA_API$1, () => {
  for (const spy of SelectorEngine.find(SELECTOR_DATA_SPY)) {
    ScrollSpy.getOrCreateInstance(spy);
  }
});
defineJQueryPlugin(ScrollSpy);
var NAME$1 = "tab";
var DATA_KEY$1 = "bs.tab";
var EVENT_KEY$1 = `.${DATA_KEY$1}`;
var EVENT_HIDE$1 = `hide${EVENT_KEY$1}`;
var EVENT_HIDDEN$1 = `hidden${EVENT_KEY$1}`;
var EVENT_SHOW$1 = `show${EVENT_KEY$1}`;
var EVENT_SHOWN$1 = `shown${EVENT_KEY$1}`;
var EVENT_CLICK_DATA_API = `click${EVENT_KEY$1}`;
var EVENT_KEYDOWN = `keydown${EVENT_KEY$1}`;
var EVENT_LOAD_DATA_API = `load${EVENT_KEY$1}`;
var ARROW_LEFT_KEY = "ArrowLeft";
var ARROW_RIGHT_KEY = "ArrowRight";
var ARROW_UP_KEY = "ArrowUp";
var ARROW_DOWN_KEY = "ArrowDown";
var HOME_KEY = "Home";
var END_KEY = "End";
var CLASS_NAME_ACTIVE = "active";
var CLASS_NAME_FADE$1 = "fade";
var CLASS_NAME_SHOW$1 = "show";
var CLASS_DROPDOWN = "dropdown";
var SELECTOR_DROPDOWN_TOGGLE = ".dropdown-toggle";
var SELECTOR_DROPDOWN_MENU = ".dropdown-menu";
var NOT_SELECTOR_DROPDOWN_TOGGLE = `:not(${SELECTOR_DROPDOWN_TOGGLE})`;
var SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
var SELECTOR_OUTER = ".nav-item, .list-group-item";
var SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
var SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]';
var SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
var SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
var Tab = class _Tab extends BaseComponent {
  constructor(element) {
    super(element);
    this._parent = this._element.closest(SELECTOR_TAB_PANEL);
    if (!this._parent) {
      return;
    }
    this._setInitialAttributes(this._parent, this._getChildren());
    EventHandler.on(this._element, EVENT_KEYDOWN, (event2) => this._keydown(event2));
  }
  // Getters
  static get NAME() {
    return NAME$1;
  }
  // Public
  show() {
    const innerElem = this._element;
    if (this._elemIsActive(innerElem)) {
      return;
    }
    const active = this._getActiveElem();
    const hideEvent = active ? EventHandler.trigger(active, EVENT_HIDE$1, {
      relatedTarget: innerElem
    }) : null;
    const showEvent = EventHandler.trigger(innerElem, EVENT_SHOW$1, {
      relatedTarget: active
    });
    if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
      return;
    }
    this._deactivate(active, innerElem);
    this._activate(innerElem, active);
  }
  // Private
  _activate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.add(CLASS_NAME_ACTIVE);
    this._activate(SelectorEngine.getElementFromSelector(element));
    const complete = () => {
      if (element.getAttribute("role") !== "tab") {
        element.classList.add(CLASS_NAME_SHOW$1);
        return;
      }
      element.removeAttribute("tabindex");
      element.setAttribute("aria-selected", true);
      this._toggleDropDown(element, true);
      EventHandler.trigger(element, EVENT_SHOWN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _deactivate(element, relatedElem) {
    if (!element) {
      return;
    }
    element.classList.remove(CLASS_NAME_ACTIVE);
    element.blur();
    this._deactivate(SelectorEngine.getElementFromSelector(element));
    const complete = () => {
      if (element.getAttribute("role") !== "tab") {
        element.classList.remove(CLASS_NAME_SHOW$1);
        return;
      }
      element.setAttribute("aria-selected", false);
      element.setAttribute("tabindex", "-1");
      this._toggleDropDown(element, false);
      EventHandler.trigger(element, EVENT_HIDDEN$1, {
        relatedTarget: relatedElem
      });
    };
    this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE$1));
  }
  _keydown(event2) {
    if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY, HOME_KEY, END_KEY].includes(event2.key)) {
      return;
    }
    event2.stopPropagation();
    event2.preventDefault();
    const children = this._getChildren().filter((element) => !isDisabled(element));
    let nextActiveElement;
    if ([HOME_KEY, END_KEY].includes(event2.key)) {
      nextActiveElement = children[event2.key === HOME_KEY ? 0 : children.length - 1];
    } else {
      const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event2.key);
      nextActiveElement = getNextActiveElement(children, event2.target, isNext, true);
    }
    if (nextActiveElement) {
      nextActiveElement.focus({
        preventScroll: true
      });
      _Tab.getOrCreateInstance(nextActiveElement).show();
    }
  }
  _getChildren() {
    return SelectorEngine.find(SELECTOR_INNER_ELEM, this._parent);
  }
  _getActiveElem() {
    return this._getChildren().find((child) => this._elemIsActive(child)) || null;
  }
  _setInitialAttributes(parent, children) {
    this._setAttributeIfNotExists(parent, "role", "tablist");
    for (const child of children) {
      this._setInitialAttributesOnChild(child);
    }
  }
  _setInitialAttributesOnChild(child) {
    child = this._getInnerElement(child);
    const isActive = this._elemIsActive(child);
    const outerElem = this._getOuterElement(child);
    child.setAttribute("aria-selected", isActive);
    if (outerElem !== child) {
      this._setAttributeIfNotExists(outerElem, "role", "presentation");
    }
    if (!isActive) {
      child.setAttribute("tabindex", "-1");
    }
    this._setAttributeIfNotExists(child, "role", "tab");
    this._setInitialAttributesOnTargetPanel(child);
  }
  _setInitialAttributesOnTargetPanel(child) {
    const target = SelectorEngine.getElementFromSelector(child);
    if (!target) {
      return;
    }
    this._setAttributeIfNotExists(target, "role", "tabpanel");
    if (child.id) {
      this._setAttributeIfNotExists(target, "aria-labelledby", `${child.id}`);
    }
  }
  _toggleDropDown(element, open2) {
    const outerElem = this._getOuterElement(element);
    if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
      return;
    }
    const toggle = (selector, className) => {
      const element2 = SelectorEngine.findOne(selector, outerElem);
      if (element2) {
        element2.classList.toggle(className, open2);
      }
    };
    toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
    toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW$1);
    outerElem.setAttribute("aria-expanded", open2);
  }
  _setAttributeIfNotExists(element, attribute, value) {
    if (!element.hasAttribute(attribute)) {
      element.setAttribute(attribute, value);
    }
  }
  _elemIsActive(elem) {
    return elem.classList.contains(CLASS_NAME_ACTIVE);
  }
  // Try to get the inner element (usually the .nav-link)
  _getInnerElement(elem) {
    return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine.findOne(SELECTOR_INNER_ELEM, elem);
  }
  // Try to get the outer element (usually the .nav-item)
  _getOuterElement(elem) {
    return elem.closest(SELECTOR_OUTER) || elem;
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Tab.getOrCreateInstance(this);
      if (typeof config !== "string") {
        return;
      }
      if (data[config] === void 0 || config.startsWith("_") || config === "constructor") {
        throw new TypeError(`No method named "${config}"`);
      }
      data[config]();
    });
  }
};
EventHandler.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function(event2) {
  if (["A", "AREA"].includes(this.tagName)) {
    event2.preventDefault();
  }
  if (isDisabled(this)) {
    return;
  }
  Tab.getOrCreateInstance(this).show();
});
EventHandler.on(window, EVENT_LOAD_DATA_API, () => {
  for (const element of SelectorEngine.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
    Tab.getOrCreateInstance(element);
  }
});
defineJQueryPlugin(Tab);
var NAME = "toast";
var DATA_KEY = "bs.toast";
var EVENT_KEY = `.${DATA_KEY}`;
var EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
var EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
var EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
var EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
var EVENT_HIDE = `hide${EVENT_KEY}`;
var EVENT_HIDDEN = `hidden${EVENT_KEY}`;
var EVENT_SHOW = `show${EVENT_KEY}`;
var EVENT_SHOWN = `shown${EVENT_KEY}`;
var CLASS_NAME_FADE = "fade";
var CLASS_NAME_HIDE = "hide";
var CLASS_NAME_SHOW = "show";
var CLASS_NAME_SHOWING = "showing";
var DefaultType = {
  animation: "boolean",
  autohide: "boolean",
  delay: "number"
};
var Default = {
  animation: true,
  autohide: true,
  delay: 5e3
};
var Toast = class _Toast extends BaseComponent {
  constructor(element, config) {
    super(element, config);
    this._timeout = null;
    this._hasMouseInteraction = false;
    this._hasKeyboardInteraction = false;
    this._setListeners();
  }
  // Getters
  static get Default() {
    return Default;
  }
  static get DefaultType() {
    return DefaultType;
  }
  static get NAME() {
    return NAME;
  }
  // Public
  show() {
    const showEvent = EventHandler.trigger(this._element, EVENT_SHOW);
    if (showEvent.defaultPrevented) {
      return;
    }
    this._clearTimeout();
    if (this._config.animation) {
      this._element.classList.add(CLASS_NAME_FADE);
    }
    const complete = () => {
      this._element.classList.remove(CLASS_NAME_SHOWING);
      EventHandler.trigger(this._element, EVENT_SHOWN);
      this._maybeScheduleHide();
    };
    this._element.classList.remove(CLASS_NAME_HIDE);
    reflow(this._element);
    this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  hide() {
    if (!this.isShown()) {
      return;
    }
    const hideEvent = EventHandler.trigger(this._element, EVENT_HIDE);
    if (hideEvent.defaultPrevented) {
      return;
    }
    const complete = () => {
      this._element.classList.add(CLASS_NAME_HIDE);
      this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
      EventHandler.trigger(this._element, EVENT_HIDDEN);
    };
    this._element.classList.add(CLASS_NAME_SHOWING);
    this._queueCallback(complete, this._element, this._config.animation);
  }
  dispose() {
    this._clearTimeout();
    if (this.isShown()) {
      this._element.classList.remove(CLASS_NAME_SHOW);
    }
    super.dispose();
  }
  isShown() {
    return this._element.classList.contains(CLASS_NAME_SHOW);
  }
  // Private
  _maybeScheduleHide() {
    if (!this._config.autohide) {
      return;
    }
    if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
      return;
    }
    this._timeout = setTimeout(() => {
      this.hide();
    }, this._config.delay);
  }
  _onInteraction(event2, isInteracting) {
    switch (event2.type) {
      case "mouseover":
      case "mouseout": {
        this._hasMouseInteraction = isInteracting;
        break;
      }
      case "focusin":
      case "focusout": {
        this._hasKeyboardInteraction = isInteracting;
        break;
      }
    }
    if (isInteracting) {
      this._clearTimeout();
      return;
    }
    const nextElement = event2.relatedTarget;
    if (this._element === nextElement || this._element.contains(nextElement)) {
      return;
    }
    this._maybeScheduleHide();
  }
  _setListeners() {
    EventHandler.on(this._element, EVENT_MOUSEOVER, (event2) => this._onInteraction(event2, true));
    EventHandler.on(this._element, EVENT_MOUSEOUT, (event2) => this._onInteraction(event2, false));
    EventHandler.on(this._element, EVENT_FOCUSIN, (event2) => this._onInteraction(event2, true));
    EventHandler.on(this._element, EVENT_FOCUSOUT, (event2) => this._onInteraction(event2, false));
  }
  _clearTimeout() {
    clearTimeout(this._timeout);
    this._timeout = null;
  }
  // Static
  static jQueryInterface(config) {
    return this.each(function() {
      const data = _Toast.getOrCreateInstance(this, config);
      if (typeof config === "string") {
        if (typeof data[config] === "undefined") {
          throw new TypeError(`No method named "${config}"`);
        }
        data[config](this);
      }
    });
  }
};
enableDismissTrigger(Toast);
defineJQueryPlugin(Toast);

// node_modules/vanjs-bootstrap/dist/modal.modern.js
function t4() {
  return t4 = Object.assign ? Object.assign.bind() : function(e) {
    for (var o2 = 1; o2 < arguments.length; o2++) {
      var t8 = arguments[o2];
      for (var n4 in t8) ({}).hasOwnProperty.call(t8, n4) && (e[n4] = t8[n4]);
    }
    return e;
  }, t4.apply(null, arguments);
}
function n3(e, o2) {
  if (null == e) return {};
  var t8 = {};
  for (var n4 in e) if ({}.hasOwnProperty.call(e, n4)) {
    if (-1 !== o2.indexOf(n4)) continue;
    t8[n4] = e[n4];
  }
  return t8;
}
var l2 = ["id", "class", "header", "body", "footer", "close", "centered", "scrollable", "position", "width", "color", "dialogstyle", "bodystyle"];
var s2 = ["label", "header", "divider", "text", "active", "disabled", "class", "tag"];
var { div: a2, button: d2, h5: i2 } = van_default.tags;
function r2(e = {}) {
  var { id: o2, class: s3, header: d3, body: r3, footer: c3, close: u3 = true, centered: m2 = true, scrollable: b3, position: f3, width: h2, color: v2, dialogstyle: y2 = "", bodystyle: g2 = "" } = e, w2 = n3(e, l2);
  h2 && (y2 += `width: ${h2};`), h2 && (y2 += "max-width: inherit;"), f3 && (y2 += `margin-left: ${f3.left}px; margin-top: ${f3.top}px;`, m2 = false);
  const x2 = "modal-dialog" + (m2 ? " modal-dialog-centered" : "") + (b3 ? " modal-dialog-scrollable" : "") + (s3 ? " " + s3 : ""), O2 = "modal-content" + (v2 ? " " + v2 : "");
  if ("string" == typeof d3) {
    let e2 = i2({ class: "modal-title" }, d3);
    d3 = a2({ class: "modal-header" }, e2, u3 ? p2 : null);
  }
  return !d3 && u3 && (d3 = a2({ class: "modal-header" }, p2)), a2(t4({ class: () => "modal", id: o2, "aria-hidden": "true", tabindex: "-1" }, w2), a2({ class: x2, style: y2 }, a2({ class: O2 }, d3, r3 && a2({ class: "modal-body", style: g2 }, r3), c3 && a2({ class: "modal-footer" }, c3))));
}
function c2(e = {}, n4) {
  var l3, s3, a3, d3 = null == (l3 = null == n4 ? void 0 : n4.dispose) || l3, i3 = { dom: null, isOpen: false, modalResult: void 0, open(o2, n5) {
    i3.modalResult = void 0, null != o2 && null != n5 && (e = t4({}, e, { position: { left: o2, top: n5 } })), i3.bsm.show();
  }, close(e2) {
    i3.modalResult = e2, i3.bsm.hide();
  }, asyncOpen: async (e2, o2) => new Promise((t8) => {
    i3.open(e2, o2), i3.dom.addEventListener("hidden.bs.modal", () => t8(i3.modalResult));
  }), get bsm() {
    return s3 || (i3.dom = r2(e), s3 = new Modal(i3.dom, n4), i3.dom.addEventListener("shown.bs.modal", i3.onShown), i3.dom.addEventListener("hidden.bs.modal", i3.onHidden)), s3;
  }, dispose() {
    s3 && (s3.dispose(), s3 = null), i3.dom && (i3.dom.remove(), i3.dom = null);
  }, hide(e2) {
    a3 = e2, s3.hide();
  }, show() {
    s3.show();
  }, onShown(e2) {
    i3.isOpen = true;
  }, onHidden(e2) {
    i3.isOpen = false, a3 ? a3 = false : d3 && i3.dispose();
  } };
  return i3;
}
function p2({ class: e } = {}, o2) {
  return d2({ type: "button", class: e || "btn-close", "data-bs-dismiss": "modal", "aria-label": "Close" }, o2);
}
function u2(...o2) {
  const { ul: t8 } = van_default.tags;
  return t8({ class: "dropdown-menu", style: "display: table; z-index: 0; position: inherit; min-width: 10rem; max-height: 400px; overflow-y: auto;" }, ...o2.map((e) => e instanceof HTMLElement ? e : b2(e)));
}
function b2(o2) {
  const { li: l3, span: a3, hr: d3, button: i3 } = van_default.tags, r3 = (e) => {
    e.preventDefault(), e.stopPropagation();
  };
  var { label: c3, header: p3, divider: u3, text: m2, active: b3, disabled: f3, class: h2, tag: v2 } = o2, y2 = n3(o2, s2), g2 = (o3) => () => {
    let t8 = o3;
    return van_default.val(b3) && (t8 += " active"), van_default.val(f3) && (t8 += " disabled"), van_default.val(h2) && (t8 += " " + van_default.val(h2)), t8;
  };
  return p3 ? l3((v2 = v2 ? van_default.tags[v2] : a3)(t4({ class: g2("dropdown-header fw-bold border-bottom"), onclick: r3 }, y2), c3)) : u3 ? l3((v2 = v2 ? van_default.tags[v2] : d3)(t4({ class: g2("dropdown-divider"), onclick: r3 }, y2), c3)) : m2 ? l3((v2 = v2 ? van_default.tags[v2] : a3)(t4({ class: g2("dropdown-item-text"), onclick: r3 }, y2), c3)) : (v2 = v2 ? van_default.tags[v2] : i3, y2.type = "button", l3(v2(t4({ class: g2("dropdown-item"), role: "button" }, y2), c3)));
}
function f2(...e) {
  const o2 = u2(...e), t8 = c2({ close: false, dialogstyle: "display: table; padding: 0;", bodystyle: "padding: 0;", body: o2 });
  return o2.addEventListener("click", () => t8.close()), t8;
}

// client/file-service/event-emitter.js
var EventEmitter2 = class {
  constructor() {
    this.events = {};
  }
  on(event2, listener) {
    if (typeof this.events[event2] !== "object") {
      this.events[event2] = [];
    }
    this.events[event2].push(listener);
    return () => this.off(event2, listener);
  }
  off(event2, listener) {
    if (typeof this.events[event2] === "object") {
      const idx = this.events[event2].indexOf(listener);
      if (idx > -1) {
        this.events[event2].splice(idx, 1);
      }
    }
  }
  emit(event2, ...args) {
    if (typeof this.events[event2] === "object") {
      this.events[event2].forEach((listener) => listener.apply(this, args));
    }
  }
  once(event2, listener) {
    const remove = this.on(
      event2,
      (...args) => {
        remove();
        listener.apply(this, args);
      }
    );
  }
};

// client/file-service/file-dialog.js
var { t: t5 } = i18n_default;
var { div, img } = van_default.tags;
var isImageFile = (file) => fileIsMime(file, "image");
var selectFileBoxId = "select-file-box";
function SelectController(opt = {}) {
  var {
    initialDir,
    initialFileName,
    fallbackDir = "",
    mode,
    filter,
    sort,
    multiple,
    widthDirectoryUp,
    useSelection
  } = opt;
  var directory = new Directory({ filter, sort });
  var selection = new Directory();
  const anySelected = van_default.state(false);
  const emitter2 = new EventEmitter2();
  const self = {
    returnRelativePath: false,
    ...opt,
    directory,
    selection,
    anySelected,
    selectedFile: null,
    fileName: "",
    updateSelection,
    // updateSelection( selectValue )
    fileItemView: simpleFileItem,
    get path() {
      return directory.path;
    },
    isSelectedFile(file) {
      return !!(useSelection && selection.files.find((f3) => f3.name === file.name));
    },
    init() {
      if (initialFileName) {
        const parsed = parse_path_default(initialFileName);
        self.fileName = parsed.base;
        initialDir = parsed.dir;
      }
      emitter2.on("fileItemDblClick", (file) => self.getDirByFile(file));
      emitter2.emit("init");
      self.loadDirectoryFiles(initialDir);
    },
    async loadDirectoryFiles(path) {
      anySelected.val = false;
      if (!await directory.getDir(path)) {
        console.log("directory not exists", path);
        if (!await directory.getDir(fallbackDir)) {
          console.error("can not access directory");
          return false;
        }
      }
      if (widthDirectoryUp) {
        let file = {
          name: "..",
          isDir: true
        };
        directory.files.unshift(file);
      }
      selection = new Directory({ path: directory.path });
      selection.resolvedDir = directory.resolvedDir;
      self.selection = selection;
      if (useSelection && self.fileName) {
        const file = directory.fileByName(self.fileName);
        if (file) {
          selection.addFile(file);
          anySelected.val = true;
        }
      }
      if (mode === "dir") anySelected.val = true;
      emitter2.emit("directoryChange");
      return true;
    },
    async getDirByFile(file) {
      if (file?.isDir && await self.loadDirectoryFiles([...self.path, file.name]))
        return true;
    },
    async dirUp() {
      let path = [...self.path];
      path.pop();
      if (await self.loadDirectoryFiles(path))
        return true;
    },
    isValidExtension(ext) {
      if (!Array.isArray(self.validExtensions)) return true;
      return self.validExtensions.includes(ext);
    },
    on(event2, listener) {
      return emitter2.on(event2, listener);
    },
    off(event2, listener) {
      return emitter2.off(event2, listener);
    },
    once(event2, listener) {
      return emitter2.once(event2, listener);
    },
    emit(event2, ...args) {
      return emitter2.emit(event2, ...args);
    }
  };
  function updateSelection(selectValue) {
    if (!selectValue) selectValue = [];
    if (!Array.isArray(selectValue)) selectValue = [selectValue];
    selection.files = [];
    for (let name of selectValue) {
      let file = directory.fileByName(name);
      if (file) selection.addFile(file);
    }
    anySelected.val = mode === "dir" || selection.files[0];
    self.selectedFile = selection.files.find((o2) => !o2.isDir);
    if (self.selectedFile) {
      self.fileName = self.selectedFile.name;
    }
    emitter2.emit("selectionChange");
  }
  return self;
}
function simpleFileItem({ file, controller }) {
  const icon = controller.previewImage && isImageFile(file) ? img({
    src: getURL(file.pathName),
    class: "thumb-item me-2"
  }) : FileIcon({ file, class: "me-2" });
  const sel = controller.isSelectedFile(file) ? { selected: true } : {};
  return div(
    {
      class: "filebox-item",
      ...sel,
      value: file.name,
      onclick: () => controller.emit("fileItemClick", file),
      ondblclick: () => controller.emit("fileItemDblClick", file)
    },
    div({ title: file.name }, icon, file.name)
  );
}
function SelectFileBox({
  controller,
  onclick = () => {
  },
  style,
  class: clas
} = {}) {
  const { multiple } = controller;
  const options = controller.directory.files.map((file) => controller.fileItemView({ file, controller }));
  const select = van_default.tags["flexible-select"](
    {
      id: selectFileBoxId,
      multiple,
      class: "filebox overflow-y-auto" + (clas ? " " + clas : ""),
      style: `user-select: none;${style ? " " + style : ""}`,
      onclick,
      onchange: (event2) => controller.updateSelection(event2.target.value)
    },
    ...options
  );
  return select;
}
function DirectoryBreadCrumb(directoryPath, getDir2) {
  const { nav, a: a3, li, ol } = van_default.tags;
  const click = (link) => (event2) => {
    event2.preventDefault();
    getDir2(link);
  };
  const Item = (label2, active, link) => {
    if (active) {
      return li({ class: "breadcrumb-item directory active" }, label2);
    } else {
      return li(
        { class: "breadcrumb-item directory" },
        a3({ href: "#", role: "button", onclick: click(link) }, label2)
      );
    }
  };
  const itemList = () => {
    const items = [];
    if (directoryPath.length === 0) {
      items.push(Item("\u{1F5C0}"));
    } else {
      items.push(Item("\u{1F5C1}", false, []));
      for (let i3 = 0; i3 < directoryPath.length - 1; i3++)
        items.push(Item(directoryPath[i3], false, directoryPath.slice(0, i3 + 1)));
      items.push(Item(directoryPath[directoryPath.length - 1], true));
    }
    return items;
  };
  return nav(
    { class: "bg-body-tertiary", "aria-label": "breadcrumb" },
    ol(
      { class: "breadcrumb mb-1" },
      ...itemList()
    )
  );
}
function ButtonCancel(args) {
  const { controller, label: label2 = t5("ButtonCancel"), ...props } = args;
  return P({
    onclick: () => controller.dlgClose(false),
    ...props
  }, label2);
}
function ButtonOpen(args) {
  const { controller, label: label2 = t5("ButtonOpen"), ...props } = args;
  function onclick() {
    const selectedDir = controller.selection.files.find((o2) => o2.isDir);
    if (selectedDir) {
      controller.getDirByFile(selectedDir);
      return;
    }
    controller.dlgClose(controller.selection);
  }
  ;
  controller.on("fileItemDblClick", (file) => {
    if (file.isDir) {
    } else {
      controller.dlgClose(controller.selection);
    }
  });
  return P({
    disabled: () => !controller.anySelected.val,
    onclick,
    ...props
  }, label2);
}
function ButtonOpenSingle(args) {
  const { controller, label: label2 = t5("ButtonOpen"), ...props } = args;
  function onclick() {
    let file = controller.selection.files.find((o2) => o2.isDir);
    if (file) {
      controller.getDirByFile(file);
      return;
    }
    file = controller.selection.files[0];
    if (file) {
      const result = controller.returnRelativePath ? file.pathName : file.filePath;
      controller.dlgClose(result);
      return;
    }
    console.error("problem in ButtonOpenSingle");
  }
  ;
  controller.on("fileItemDblClick", (file) => {
    if (file.isDir) {
    } else {
      const result = controller.returnRelativePath ? file.pathName : file.filePath;
      controller.dlgClose(result);
    }
  });
  return P({
    disabled: () => !controller.anySelected.val,
    onclick,
    ...props
  }, label2);
}
function ButtonSave(args) {
  const { controller, label: label2 = t5("ButtonSave"), ...props } = args;
  const fileOk = van_default.state(false);
  const checkName = () => {
    const { name, ext } = parse_path_default(controller.fileName);
    fileOk.val = isValidFilename(name) && controller.isValidExtension(ext);
  };
  controller.on("fileNameChange", checkName);
  controller.on("selectionChange", checkName);
  controller.on("directoryChange", checkName);
  function onclick() {
    const dir = controller.returnRelativePath ? controller.directory.dir : controller.directory.resolvedDir;
    const filePath = joinPaths(dir, controller.fileName);
    controller.dlgClose(filePath);
  }
  ;
  return P({
    disabled: () => !fileOk.val,
    onclick,
    ...props
  }, label2);
}
function ButtonSelectFolder(args) {
  const { controller, label: label2 = t5("ButtonSelectFolder"), ...props } = args;
  function onclick() {
    const selected = controller.selection.files[0];
    if (selected) {
      const result = controller.returnRelativePath ? selected.pathName : selected.filePath;
      controller.dlgClose(result);
    }
    const dir = controller.returnRelativePath ? controller.directory.dir : controller.directory.resolvedDir;
    controller.dlgClose(dir);
  }
  ;
  return P({
    onclick,
    ...props
  }, label2);
}
function ButtonNewFolder(args) {
  const { controller, label: label2 = t5("ButtonNewFolder"), ...props } = args;
  return P({
    onclick: () => addDirectory({ controller }),
    ...props
  }, label2);
}
function ButtonDeleteSelection(args) {
  const { controller, label: label2 = t5("ButtonDeleteSelection"), ...props } = args;
  return P({
    disabled: () => !controller.anySelected.val,
    onclick: () => deleteSelection(controller),
    ...props
  }, label2);
}
function ButtonExplorer(args) {
  const { controller, label: label2 = t5("ButtonExplorer"), ...props } = args;
  return P({
    onclick: () => openExplorer(controller),
    ...props
  }, label2);
}
function openExplorer(controller) {
  open("powershell.exe", ["-Command", `"start \\"${controller.directory.resolvedDir}\\"`]);
}
async function addDirectory(args) {
  const { controller, label: label2 = t5("Cancel"), ...props } = args;
  const validate = (name2) => {
    if (!isValidDirectoryName(name2)) return false;
    if (controller.directory.files.find((f3) => f3.name.localeCompare(name2, void 0, { sensitivity: "base" }) === 0))
      return false;
    return true;
  };
  console.log("addDirectory", controller.directory);
  let name = await AskName({
    header: t5("addDirectory-header"),
    label: "Name",
    validate
  });
  if (!name) return;
  console.log("addDirectory", controller.directory.path, name);
  await mkDir(controller.directory.path, name);
  await controller.loadDirectoryFiles(controller.directory.path);
}
async function deleteSelection(controller) {
  const files = controller.selection.files.map((f3) => f3.name);
  if (!files.length) return;
  if (!await AreYouSure(`${files.length} ${t5("FilesToTrash")}`)) return;
  await trash(controller.directory.path, files);
  await controller.loadDirectoryFiles(controller.directory.path);
}
async function AskName({ header, label: label2, validate, aname = "" }) {
  const id = "ask-name-input";
  const name = van_default.state(aname);
  const isvalid = van_default.state(validate(aname));
  const oninput = (event2) => {
    name.val = event2.target.value;
    isvalid.val = validate(event2.target.value);
  };
  const dlg = c2({
    header,
    body: j({ id, value: name.val, oninput, isvalid }),
    footer: [
      P({ onclick: () => dlg.close(true), disabled: () => !isvalid.val }, "Ok"),
      P({ onclick: () => dlg.close(false) }, t5("Cancel"))
    ],
    onkeydown: (event2) => {
      if (event2.key === "Enter" && isvalid.val) dlg.close(true);
    }
  });
  dlg.onShown = () => {
    document.getElementById(id).focus();
  };
  var res = await dlg.asyncOpen();
  if (res) return name.val;
  return false;
}
async function AreYouSure(text = "") {
  const dlg = c2({
    color: "text-bg-danger",
    header: t5("AreYouSure-header"),
    body: text,
    footer: [
      P({ onclick: () => dlg.close(true) }, t5("AreYouSure-yes")),
      P({ onclick: () => dlg.close(false) }, t5("AreYouSure-no"))
    ]
  });
  return await dlg.asyncOpen();
}
async function FileDialog({
  controller,
  buttons,
  header,
  fileBoxStyle = "max-height: 300px;",
  modalProps = {},
  event: event2
  // benutzt die popup Position des Dialogs zu berechnen 
}) {
  const { class: modalClass, ...modalOptions } = modalProps;
  const dlg = c2({
    header,
    body: div({ id: "select-file-body" }),
    footer: buttons,
    // onkeydown: handleKeyDown,
    ...modalOptions,
    class: modalClass
  });
  controller.dlgClose = dlg.close;
  controller.on("directoryChange", () => {
    document.getElementById("select-file-body").replaceChildren(
      DirectoryBreadCrumb(controller.path, controller.loadDirectoryFiles),
      SelectFileBox({ controller, style: fileBoxStyle })
    );
  });
  controller.init();
  let res = await dlg.asyncOpen(event2);
  return res;
}
function FileInput({
  controller
}) {
  const oninput = (event2) => {
    controller.fileName = event2.target.value;
    controller.emit("fileNameChange");
  };
  const input2 = j({
    value: controller.fileName,
    id: "file-dialog-input",
    oninput,
    style: "margin-top: 0.5em;"
  });
  controller.on("selectionChange", () => {
    if (controller.selectedFile) {
      const newValue = controller.fileName;
      input2.value = newValue;
    }
  });
  return input2;
}
async function FileDialogInput({
  controller,
  buttons,
  header,
  fileBoxStyle = "max-height: 300px;",
  modalProps = {}
}) {
  const { class: modalClass, ...modalOptions } = modalProps;
  const dlg = c2({
    header,
    body: div({ id: "select-file-body" }),
    footer: buttons,
    // onkeydown: handleKeyDown,
    ...modalOptions,
    class: modalClass
  });
  controller.dlgClose = dlg.close;
  controller.on("directoryChange", () => {
    document.getElementById("select-file-body").replaceChildren(
      DirectoryBreadCrumb(controller.path, controller.loadDirectoryFiles),
      SelectFileBox({ controller, style: fileBoxStyle }),
      FileInput({ controller })
    );
  });
  controller.init();
  let res = await dlg.asyncOpen(event);
  return res;
}
async function selectImageFilesDlg({ dir, header, multiple = true }) {
  const mime = MIME_GROUPS["image"];
  const filter = (files) => files.filter((item) => item.isDir || fileIsMime(item, "image"));
  header = header || mime.title;
  const controller = SelectController({
    initialDir: dir,
    multiple,
    previewImage: true,
    mode: "image",
    filter
  });
  const buttonProps = { class: "me-2", controller };
  const res = await FileDialog({
    controller,
    header,
    // fileBoxStyle: 'height: 100%;',
    fileBoxStyle: "height: 70vh;",
    modalProps: { class: "modal-fullscreen" },
    buttons: [
      ButtonOpen(buttonProps),
      ButtonNewFolder(buttonProps),
      ButtonDeleteSelection(buttonProps),
      ButtonExplorer(buttonProps),
      ButtonCancel(buttonProps)
    ]
  });
  return res;
}
async function selectDirectoryDlg({ dir, header, event: event2 }) {
  return selectFilesDlg({ dir, header, mode: "dir", multiple: false, event: event2 });
}
async function selectFileDialog({ dir, header, mime, filter, multiple = false, event: event2 }) {
  if (mime && MIME_GROUPS[mime]) {
    filter = (files) => files.filter((item) => item.isDir || fileIsMime(item, mime));
    header = header || MIME_GROUPS[mime].title;
  }
  const controller = SelectController({
    initialDir: dir,
    multiple,
    filter,
    mode: "file"
  });
  const buttonProps = { class: "me-2", controller };
  const res = await FileDialog({
    controller,
    header,
    buttons: [ButtonOpen(buttonProps), ButtonCancel(buttonProps)],
    event: event2
    // benutzt die popup Position des Dialogs zu berechnen 
  });
  return res;
}
async function selectSingleFileDialog({ dir, fileName, header, mime, filter }) {
  if (mime && MIME_GROUPS[mime]) {
    filter = (files) => files.filter((item) => item.isDir || fileIsMime(item, mime));
    header = header || MIME_GROUPS[mime].title;
  }
  const controller = SelectController({
    initialDir: dir,
    initialFileName: fileName,
    multiple: false,
    filter,
    mode: "file"
  });
  const buttonProps = { class: "me-2", controller };
  const res = await FileDialog({
    controller,
    header,
    buttons: [ButtonOpenSingle(buttonProps), ButtonCancel(buttonProps)]
  });
  return res;
}
async function selectFolderDialog({ dir, header, event: event2 }) {
  const controller = SelectController({
    initialDir: dir,
    multiple: false,
    mode: "dir",
    filter: (files) => files.filter((item) => item.isDir)
  });
  const buttonProps = { class: "me-2", controller };
  const res = await FileDialog({
    controller,
    header,
    buttons: [ButtonSelectFolder(buttonProps), ButtonCancel(buttonProps)],
    event: event2
    // benutzt die popup Position des Dialogs zu berechnen 
  });
  return res;
}

// client/file-service/flexible-select.js
var FlexibleSelect = class extends HTMLElement {
  static formAssociated = true;
  // Überwacht Änderungen am 'multiple'-Attribut live
  static get observedAttributes() {
    return ["multiple"];
  }
  constructor() {
    super();
    this._internals = this.attachInternals();
    this._selectedValues = [];
    this._lastClickedIndex = 0;
  }
  connectedCallback() {
    if (!this.hasAttribute("tabindex")) this.setAttribute("tabindex", "0");
    this._getOptions().forEach((el) => {
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    });
    this.addEventListener("click", (e) => this._handleClick(e));
    this.addEventListener("keydown", (e) => this._handleKeyDown(e));
    this._enforceSingleSelectionRule();
    this._updateValuesFromDOM();
  }
  // Falls das Attribut dynamisch per JavaScript geändert wird
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "multiple") {
      this._enforceSingleSelectionRule();
      this._updateValuesFromDOM();
    }
  }
  _getOptions() {
    return Array.from(this.children);
  }
  _getMultiple() {
    return this.hasAttribute("multiple") && this.getAttribute("multiple") !== "false";
  }
  // Stellt sicher, dass bei Einzelauswahl nur maximal ein Element aktiv ist
  _enforceSingleSelectionRule() {
    if (!this._getMultiple()) {
      const options = this._getOptions();
      const selected = options.filter((el) => el.hasAttribute("selected"));
      if (selected.length > 1) {
        options.forEach((el) => {
          el.removeAttribute("selected");
          el.classList.remove("active");
        });
        selected[0].setAttribute("selected", "");
      }
    }
  }
  _handleClick(e) {
    let target = e.target;
    while (target && target.parentElement !== this) {
      target = target.parentElement;
    }
    const options = this._getOptions();
    if (!target || !options.includes(target)) return;
    const currentIndex = options.indexOf(target);
    const isMultiple = this._getMultiple();
    if (isMultiple && e.shiftKey) {
      const start2 = Math.min(this._lastClickedIndex, currentIndex);
      const end2 = Math.max(this._lastClickedIndex, currentIndex);
      options.forEach((el, idx) => {
        if (idx >= start2 && idx <= end2) {
          el.setAttribute("selected", "");
        } else if (!e.ctrlKey && !e.metaKey) {
          el.removeAttribute("selected");
        }
      });
    } else if (isMultiple && (e.ctrlKey || e.metaKey)) {
      if (target.hasAttribute("selected")) {
        target.removeAttribute("selected");
      } else {
        target.setAttribute("selected", "");
      }
      this._lastClickedIndex = currentIndex;
    } else {
      options.forEach((el) => {
        el.removeAttribute("selected");
      });
      target.setAttribute("selected", "");
      this._lastClickedIndex = currentIndex;
    }
    target.focus();
    this._updateValuesFromDOM();
    this.dispatchEvent(new Event("input", { bubbles: true }));
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
  _handleKeyDown(e) {
    const options = this._getOptions();
    let currentFocusIdx = options.findIndex((el) => el === document.activeElement);
    if (currentFocusIdx === -1) currentFocusIdx = this._lastClickedIndex;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.min(currentFocusIdx + 1, options.length - 1);
      this._navigateAndSelect(options, nextIdx, e.shiftKey && this._getMultiple());
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIdx = Math.max(currentFocusIdx - 1, 0);
      this._navigateAndSelect(options, prevIdx, e.shiftKey && this._getMultiple());
    } else if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      if (currentFocusIdx !== -1) {
        this._handleClick({ target: options[currentFocusIdx], shiftKey: e.shiftKey, ctrlKey: this.hasAttribute("multiple") });
      }
    }
  }
  _navigateAndSelect(options, targetIdx, isShift) {
    const targetElement = options[targetIdx];
    targetElement.focus();
    if (isShift) {
      const start2 = Math.min(this._lastClickedIndex, targetIdx);
      const end2 = Math.max(this._lastClickedIndex, targetIdx);
      options.forEach((el, idx) => {
        if (idx >= start2 && idx <= end2) {
          el.setAttribute("selected", "");
        }
      });
    } else {
      options.forEach((el) => {
        el.removeAttribute("selected");
      });
      targetElement.setAttribute("selected", "");
      this._lastClickedIndex = targetIdx;
    }
    this._updateValuesFromDOM();
    this.dispatchEvent(new Event("input", { bubbles: true }));
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }
  _updateValuesFromDOM() {
    const selectedElements = this.querySelectorAll(`${this.tagName.toLowerCase()} > div[selected]`);
    this._selectedValues = Array.from(selectedElements).map((el) => el.getAttribute("value") || el.innerText.trim());
    const formData = new FormData();
    this._selectedValues.forEach((val) => formData.append(this.getAttribute("name") || "select", val));
    this._internals.setFormValue(formData);
  }
  formResetCallback() {
    this._getOptions().forEach((el) => {
      el.removeAttribute("selected");
    });
    this._updateValuesFromDOM();
  }
  // GETTER: Gibt String bei Einzelauswahl oder ein Array bei Mehrfachauswahl zurück
  get value() {
    if (this._getMultiple()) {
      return this._selectedValues;
    }
    return this._selectedValues.length > 0 ? this._selectedValues[0] : "";
  }
  // SETTER: Akzeptiert String (Einzelwert) oder ein Array (Mehrfachwerte)
  set value(newValues) {
    const valuesToSet = Array.isArray(newValues) ? newValues : [newValues];
    this._getOptions().forEach((el) => {
      const val = el.getAttribute("value");
      if (valuesToSet.includes(val)) {
        el.setAttribute("selected", "");
      } else {
        el.removeAttribute("selected");
      }
    });
    this._enforceSingleSelectionRule();
    this._updateValuesFromDOM();
  }
  get selected() {
    return this._selectedValues.length > 0;
  }
  get form() {
    return this._internals.form;
  }
  get name() {
    return this.getAttribute("name");
  }
};
customElements.define("flexible-select", FlexibleSelect);

// client/file-service/index.js
var all = { ...file_service_api_exports, ...file_tools_exports, ...file_dialog_exports, i18n: i18n_default, parsePath: parse_path_default, joinPaths };
var file_service_default = all;

// client/file-service.js
var file_service_default2 = file_service_default;

// client/i18n.js
var I18n2 = t2();
var i18n_default2 = I18n2;
var back = I18n2.setLanguage;
I18n2.setLanguage = (value) => {
  back(value);
  file_service_default2.i18n.setLanguage(value);
};
var { addWords } = I18n2;
addWords({
  "File": "Datei",
  "New Project": "Neu",
  "Open Project": "\xD6ffnen",
  "Open Recent Project": "Zuletzt benutzt..",
  "Save Project": "Speichern",
  "Save Project As": "Speichern unter..",
  "Project": "Projekt",
  "Images": "Bilder",
  "Make": "Galerie",
  "Add Images": "Bilder hinzuf\xFCgen",
  "Options": "Optionen",
  "compactMode": "Kompakte Liste zum Veschieben",
  "darkTheme": "Dunkelmodus",
  "language": "English Language"
}, "de", "appMenu");
addWords({
  "File": "File",
  "New Project": "New",
  "Open Project": "Open",
  "Open Recent Project": "Open Recent Project..",
  "Save Project": "Save",
  "Save Project As": "Save as..",
  "Project": "Project",
  "Images": "Images",
  "Make": "Gallery",
  "Add Images": "Add Images",
  "Options": "Options",
  "compactMode": "Compact Mode For Moving",
  "darkTheme": "Dark Theme",
  "language": "Deutsche Sprache"
}, "en", "appMenu");

// client/project-dialog.js
var t6 = i18n_default2.tPath("project-dialog");
var projectExtension = "gmp";
var projectFileFilter = (files) => files.filter((item) => item.isDir || file_service_default2.fileExtension(item) === projectExtension);
var getRecentDir = () => app_ctrl_default.session.projectDir;
var setRecentDir = (dir) => {
  app_ctrl_default.session.projectDir = dir;
};
async function newProjectDlg() {
  const initialFileName = file_service_default2.joinPaths(getRecentDir(), t6("New Gallery"));
  let newFilename = await saveFileDialog({
    initialFileName,
    header: t6("Save New Project"),
    filter: projectFileFilter,
    extension: projectExtension
  });
  if (!newFilename) return;
  newFilename = forceExtension(newFilename, projectExtension);
  let ok = !await file_service_default2.exists(newFilename);
  if (!ok) ok = await AreYouSure2("Vorhandenes Projekt \xFCberschreiben");
  if (ok) return newFilename;
}
async function AreYouSure2(text = "") {
  const dlg = c2({
    color: "text-bg-danger",
    header: t6("Best\xE4tigung"),
    body: text,
    footer: [
      P({ onclick: () => dlg.close(true) }, t6("Ja")),
      P({ onclick: () => dlg.close(false) }, t6("Nein"))
    ]
  });
  return await dlg.asyncOpen();
}
function forceExtension(filename, ext) {
  const parsed = file_service_default2.parsePath(filename);
  return file_service_default2.joinPaths(parsed.dir, parsed.name + "." + ext);
}
async function saveProjectAsDlg() {
  var newFilename = await saveFileDialog({
    initialFileName: app_ctrl_default.session.projectFile,
    fallbackDir: getRecentDir(),
    header: t6("Save Project As"),
    filter: projectFileFilter,
    extension: projectExtension
  });
  if (!newFilename) return;
  newFilename = forceExtension(newFilename, projectExtension);
  let ok = !await file_service_default2.exists(newFilename);
  if (!ok) ok = await AreYouSure2("Vorhandenes Projekt \xFCberschreiben");
  if (ok) return newFilename;
}
async function saveFileDialog({
  initialFileName,
  header = "",
  filter,
  extension
}) {
  const controller = file_service_default2.SelectController({
    initialFileName,
    fallbackDir: getRecentDir(),
    multiple: false,
    filter,
    mode: "file",
    useSelection: true
  });
  const buttonProps = { class: "btn-sm me-2", controller };
  const selectedFile = await file_service_default2.FileDialogInput({
    controller,
    header,
    buttons: [file_service_default2.ButtonSave(buttonProps), file_service_default2.ButtonNewFolder(buttonProps), file_service_default2.ButtonCancel(buttonProps)]
  });
  return selectedFile;
}
async function openProjectDlg() {
  const res = await file_service_default2.selectFileDialog({
    dir: getRecentDir(),
    header: t6("Open Project"),
    filter: projectFileFilter,
    multiple: false
  });
  const ok = res && res.files.length;
  if (!ok) return;
  const filename = res.files[0].filePath;
  setRecentDir(file_service_default2.parsePath(filename).dir);
  return filename;
}
async function selectDistFolderDialog({ dir }) {
  dir = dir || getRecentDir();
  const controller = file_service_default2.SelectController({
    initialDir: dir,
    fallbackDir: getRecentDir(),
    multiple: false,
    mode: "dir",
    filter: (files) => files.filter((item) => item.isDir)
  });
  const buttonProps = { class: "me-2", controller };
  const selectedDir = await file_service_default2.FileDialog({
    controller,
    header: t6("selectDistDirHeader"),
    buttons: [
      file_service_default2.ButtonSelectFolder({
        ...buttonProps,
        label: t6("selectDistDir")
      }),
      file_service_default2.ButtonCancel(buttonProps)
    ]
  });
  return selectedDir;
}
async function openRecentProjectDlg() {
  let items = app_ctrl_default.session.recentProjects || [];
  if (!items.length) return;
  items = items.map((file) => ({
    label: file,
    onclick: () => app_ctrl_default.openProjectFile(file)
  }));
  f2(...items).open();
}
i18n_default2.addWords({
  "New Gallery": "Neue Galerie",
  "Save New Project": "Neue Galerie anlegen",
  "Save Project As": "Projekt speichern unter",
  "Open Project": "Projektdatei \xF6ffnen",
  "selectDistDirHeader": "Ausgabeverzeichnis w\xE4hlen",
  "selectDistDir": "Ok"
}, "de", "project-dialog");
i18n_default2.addWords({
  // 'New Gallery': 'Neue Galerie',
  // 'Save New Project': 'Neue Galerie anlegen',
  // 'Save Project As': 'Projekt speichern unter',
  // 'Open Project': 'Projektdatei öffnen',
  "selectDistDirHeader": "Select output directory",
  "selectDistDir": "Ok"
}, "en", "project-dialog");

// client/app-ctrl.js
var emitter = new EventEmitter();
var appCtrl = {
  on(event2, listener) {
    return emitter.on(event2, listener);
  },
  off(event2, listener) {
    return emitter.off(event2, listener);
  },
  once(event2, listener) {
    return emitter.once(event2, listener);
  },
  emit(event2, ...args) {
    return emitter.emit(event2, ...args);
  },
  session: {
    // global backend data
    projectDir: "",
    // recent project dir
    imageDir: "",
    // recent image dir
    recentProjects: [],
    // list of last project files
    projectFile: "",
    // current project file path
    project: {}
    // current file content
  },
  // onChange( func ) { return emitter.on( 'change', func ) },
  // change() { emitter.emit( 'change' )},
  async init() {
    await appCtrl.fetchSession();
  },
  debugLog() {
    appCtrl.on("session", () => {
      console.log("session change", appCtrl.session);
    });
    appCtrl.on("project", () => {
      console.log("project change", appCtrl.session.project);
    });
  },
  async fetchSession() {
    try {
      const response = await fetch("api/session");
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
      const result = await response.json();
      appCtrl.session = result;
    } catch (error) {
      console.error(error.message);
    }
    appCtrl.emit("session");
    appCtrl.emit("project");
  },
  async postSession() {
    try {
      const response = await fetch("api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appCtrl.session)
      });
      if (!response.ok) throw new Error(`Response status: ${response.status}`);
    } catch (error) {
      console.error(error.message);
    }
  },
  async postFile() {
    if (!appCtrl.session.projectFile) return;
    const text = JSON.stringify(appCtrl.session.project, null, 2);
    return await file_service_default2.writeFile(appCtrl.session.projectFile, text);
  },
  // report changes for auto save and browser refresh
  // what: undefined or 'all' || 'session' = save to backend || 'project' = save to file
  changed(what, silent) {
    const toBackend = debounce2(appCtrl.postSession, 500);
    const toFile = debounce2(appCtrl.postFile, 500);
    const toApp = debounce2(() => {
      appCtrl.emit("session");
      appCtrl.emit("project");
    }, 80);
    if (!silent) toApp();
    if (!what || what === "project") toFile();
    if (!what || what === "session") toBackend();
  },
  async newProject() {
    const filename = await newProjectDlg();
    if (!filename) return;
    const parsed = file_service_default2.parsePath(filename);
    const project = {
      name: parsed.name,
      title: parsed.name,
      directory: parsed.dir,
      images: []
    };
    appCtrl.session.projectFile = filename;
    appCtrl.session.project = project;
    await file_service_default2.writeFile(filename, JSON.stringify(project, 2));
    handleRecentProject(filename);
    await appCtrl.postSession();
    appCtrl.emit("session");
    appCtrl.emit("project");
  },
  async saveProject() {
    if (!appCtrl.session.projectFile) return;
    const text = JSON.stringify(appCtrl.session.project, null, 2);
    const ok = await file_service_default2.writeFile(appCtrl.session.projectFile, text);
  },
  async openProjectFile(filename) {
    if (!filename) return;
    try {
      const txt = await file_service_default2.readTextFile(filename);
      if (!txt) {
        throw new Error(`${filename} not found`);
      }
      appCtrl.session.projectFile = filename;
      appCtrl.session.project = JSON.parse(txt);
      handleRecentProject(filename);
      appCtrl.changed("session");
    } catch (err) {
      console.error(err.message);
      handleRecentProject(filename, true);
      appCtrl.changed("session", true);
    }
  },
  async openProject() {
    const filename = await openProjectDlg();
    if (!filename) return;
    appCtrl.openProjectFile(filename);
  },
  async saveProjectAs() {
    const filename = await saveProjectAsDlg();
    if (!filename) return;
    appCtrl.session.projectFile = filename;
    handleRecentProject(appCtrl.session.projectFile);
    appCtrl.changed();
  },
  async openRecentProject() {
    openRecentProjectDlg();
  },
  addImageFiles
};
function handleRecentProject(filename, remove) {
  let list = appCtrl.session.recentProjects || [];
  if (remove) {
    list = list.filter((f3) => f3 !== filename);
  } else {
    let index = list.indexOf(filename);
    if (index !== -1) list.splice(index, 1);
    list.unshift(filename);
  }
  appCtrl.session.recentProjects = list;
}
function debounce2(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
async function addImageFiles() {
  const recentDir = appCtrl.session.imageDir || appCtrl.session.projectDir;
  const selection = await file_service_default2.selectImageFilesDlg({ dir: recentDir, header: "Bilder w\xE4hlen" });
  if (!selection || !selection.files.length) return;
  const images = appCtrl.session.project.images || [];
  const newImages = [];
  appCtrl.session.imageDir = selection.resolvedDir;
  for (let file of selection.files) {
    if (images.some((i3) => i3.img === file.filePath)) continue;
    let title = file.name.split(".").slice(0, -1).join(".");
    newImages.push({
      img: file.filePath,
      title,
      comment: "",
      rotate: 0
    });
  }
  appCtrl.session.project.images = [...images, ...newImages];
  appCtrl.changed();
}
var app_ctrl_default = appCtrl;

// client/heartbeat-client.js
function connectHeartbeat(options) {
  const {
    debug = true,
    forbiddenText: forbiddenText2 = "Die App ist in einem anderen Tab ge\xF6ffnet",
    forbiddenClass = "text-bg-danger p-3 fs-1",
    appId: appId2 = "main"
  } = options || {};
  const log = debug ? console.log : () => {
  };
  log("connectHeartbeat");
  const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
  const socket = new WebSocket(protocol + window.location.host + "/ws-heartbeat");
  socket.onmessage = (event2) => {
    if (event2.data === "reload") {
      log("heartbeat got reload");
      window.location.reload();
      return;
    }
    if (event2.data === "forbidden") {
      log("server send forbidden");
      const el = document.createElement("div");
      el.textContent = forbiddenText2;
      el.className = forbiddenClass;
      document.body.appendChild(el);
      document.getElementById(appId2).remove();
      socket.onclose = null;
      socket.close();
      return;
    }
  };
  socket.onclose = () => {
    setTimeout(() => connectHeartbeat(options), 1e3);
  };
}

// client/directory-input.js
var { van, Button: Button2, Input } = index_modern_exports;
var { div: div2 } = van.tags;
function DirectoryInput(props) {
  var dvalue = van.state(props.value);
  const btnclick = async () => {
    let res = await selectDistFolderDialog({ dir: dvalue.val });
    if (!res) return;
    dvalue.val = res;
    const event2 = { target: { name: props.name, value: dvalue.val } };
    props.oninput(event2);
  };
  return div2(
    {
      style: van.val(props.style),
      class: () => {
        let res = "input-group";
        if (van.val(props.bsSize)) res += " input-group-" + van.val(props.bsSize);
        if (van.val(props.class)) res += " " + van.val(props.class);
        return res;
      }
    },
    Input({
      ...props,
      value: dvalue,
      readonly: true
    }),
    Button2({ outline: true, disabled: props.disabled, onclick: btnclick }, "\u{1F4C2}")
  );
}

// client/page-gallery.js
var { div: div3, dialog, img: img2, input, textarea, button, span, label } = van_default.tags;
var imagesState = van_default.state([]);
var movingIndex = van_default.state(null);
var imageStateChange = () => {
  if (app_ctrl_default.session?.project) {
    app_ctrl_default.session.project.images = [...imagesState.val];
    app_ctrl_default.changed("", true);
  }
};
var moveItem = (fromIndex, toIndex) => {
  const list = [...imagesState.val];
  if (toIndex < 0 || toIndex >= list.length || fromIndex === toIndex) return;
  const [movedItem] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, movedItem);
  imagesState.val = list;
  movingIndex.val = null;
  imageStateChange();
};
var removeItem = (index) => {
  if (movingIndex.val === index) movingIndex.val = null;
  imagesState.val = imagesState.val.filter((_2, idx) => idx !== index);
  imageStateChange();
};
var updateField = (index, key, value) => {
  imagesState.val[index][key] = value;
  if (key === "rotate") {
    imagesState.val = [...imagesState.val];
    imageStateChange();
  }
};
var ModalStyle = () => {
  const s3 = van_default.tags.style();
  s3.innerText = `
    .fullscreen-modal {
      border: none;
      padding: 0;
      margin: 0;
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      background: rgba(0, 0, 0, 0.9);
      overflow: hidden;
    }
    .fullscreen-modal[open] {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .fullscreen-modal::backdrop {
      background: rgba(0, 0, 0, 0.9);
    }
    .fullscreen-modal img {
      max-width: 100vw;
      max-height: 100vh;
      object-fit: contain;
    }
    .fullscreen-modal img.rotated-sideways {
      max-width: 100vh;
      max-height: 100vw;
    }
    .fullscreen-modal-close {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 1;
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 1.75rem;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;
    }
    .fullscreen-modal-close:hover,
    .fullscreen-modal-close:focus-visible {
      background: rgba(255, 255, 255, 0.4);
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `;
  return s3;
};
var ModalImage = img2({
  id: "gallery-list-modal-img",
  src: "",
  alt: "Vollbildansicht"
});
var CloseButton = button(
  {
    type: "button",
    class: "fullscreen-modal-close",
    "aria-label": "Schlie\xDFen",
    onclick: (event2) => {
      event2.stopPropagation();
      hideFullscreen();
    }
  },
  be("CLOSE")
);
var ModalDialog = dialog(
  {
    id: "gallery-list-modal",
    class: "fullscreen-modal",
    "aria-label": "Vollbildansicht",
    onclick: () => hideFullscreen()
  },
  CloseButton,
  ModalImage
);
function showFullscreen(src, rotate = 0) {
  const angle = (Number(rotate) % 360 + 360) % 360;
  const isSideways = angle === 90 || angle === 270;
  ModalImage.setAttribute("src", src);
  ModalImage.style.transform = angle ? `rotate(${angle}deg)` : "none";
  ModalImage.classList.toggle("rotated-sideways", isSideways);
  ModalDialog.showModal();
}
function hideFullscreen() {
  ModalDialog.close();
}
var GalleryEditor = () => {
  imagesState.val = app_ctrl_default.session?.project?.images || [];
  return div3(
    // Bilder-Liste
    () => {
      const isCompact = app_ctrl_default.session.compactMode;
      const thumbSize = isCompact ? "50px" : "110px";
      if (imagesState.val.length === 0) {
        return div3(
          { class: "alert alert-light text-center border py-5" },
          "Noch keine Bilder vorhanden. Klicke oben rechts auf \u201E+ Bilder hinzuf\xFCgen\u201C."
        );
      }
      return div3(
        { class: "list-group shadow-sm" },
        imagesState.val.map((item, idx) => {
          const isBeingMoved = movingIndex.val === idx;
          return div3(
            {
              class: `list-group-item d-flex gap-3 ${isCompact ? "align-items-center py-1" : "align-items-start py-3"} ${isBeingMoved ? "border-primary bg-primary-subtle" : ""}`
            },
            // 1. Sortier-Steuerung (im Kompaktmodus nebeneinander, sonst gestapelt)
            div3(
              {
                class: isCompact ? "d-flex align-items-center gap-1" : "d-flex flex-column align-items-center gap-1",
                style: isCompact ? "width: 195px;" : "width: 75px;"
              },
              input({
                type: "number",
                class: "form-control form-control-sm text-center fw-bold",
                style: isCompact ? "width: 55px;" : "width: 100%;",
                value: idx + 1,
                min: 1,
                max: imagesState.val.length,
                onchange: (e) => {
                  const targetPos = parseInt(e.target.value, 10) - 1;
                  if (!isNaN(targetPos)) moveItem(idx, targetPos);
                }
              }),
              div3(
                { class: "btn-group btn-group-sm" },
                button({
                  class: "btn btn-outline-secondary",
                  disabled: idx === 0,
                  onclick: () => moveItem(idx, idx - 1),
                  title: "Nach oben"
                }, "\u2191"),
                button({
                  class: "btn btn-outline-secondary",
                  disabled: idx === imagesState.val.length - 1,
                  onclick: () => moveItem(idx, idx + 1),
                  title: "Nach unten"
                }, "\u2193")
              ),
              // Cut & Paste Button
              movingIndex.val === null ? button({
                class: `btn btn-outline-primary btn-sm ${isCompact ? "" : "w-100 py-0 mt-1"}`,
                style: "font-size: 0.75rem;",
                onclick: () => movingIndex.val = idx
              }, "Cut") : isBeingMoved ? button({
                class: `btn btn-secondary btn-sm ${isCompact ? "" : "w-100 py-0 mt-1"}`,
                style: "font-size: 0.75rem;",
                onclick: () => movingIndex.val = null
              }, "Abbruch") : button({
                class: `btn btn-success btn-sm ${isCompact ? "" : "w-100 py-0 mt-1"}`,
                style: "font-size: 0.75rem;",
                onclick: () => moveItem(movingIndex.val, idx)
              }, "Paste")
            ),
            // 2. Bild-Vorschau & Rotation
            div3(
              { class: "d-flex flex-column align-items-center gap-1" },
              div3(
                {
                  class: "bg-light border rounded d-flex align-items-center justify-content-center overflow-hidden",
                  style: `width: ${thumbSize}; height: ${thumbSize}; transition: all 0.15s;`
                },
                img2({
                  src: file_service_default2.getURL(item.img),
                  style: `max-width: 100%; max-height: 100%; object-fit: contain; transform: rotate(${item.rotate}deg); cursor: zoom-in;`,
                  onclick: () => showFullscreen(file_service_default2.getURL(item.img), item.rotate)
                })
              ),
              !isCompact && button({
                class: "btn btn-outline-secondary btn-sm w-100 py-0",
                style: "font-size: 0.75rem;",
                onclick: () => updateField(idx, "rotate", (item.rotate + 90) % 360)
              }, `\u21BB ${item.rotate}\xB0`)
            ),
            // 3. Text-Eingaben (im Kompaktmodus nur Titel als Text, sonst volle Felder)
            div3(
              { class: "flex-grow-1" },
              isCompact ? div3(
                { class: "d-flex flex-column" },
                span({ class: "fw-semibold text-truncate" }, item.title || "(Ohne Titel)"),
                item.comment && span({ class: "text-muted small text-truncate", style: "max-width: 450px;" }, item.comment)
              ) : [
                input({
                  type: "text",
                  class: "form-control form-control-sm mb-2 fw-semibold",
                  placeholder: "Titel eingeben...",
                  value: item.title,
                  oninput: (e) => updateField(idx, "title", e.target.value)
                }),
                textarea({
                  class: "form-control form-control-sm",
                  rows: 2,
                  placeholder: "Optionale Beschreibung...",
                  value: item.comment,
                  oninput: (e) => updateField(idx, "comment", e.target.value)
                })
              ]
            ),
            // 4. Löschen-Button ganz rechts
            button({
              class: "btn btn-outline-danger btn-sm",
              title: "Bild aus Liste entfernen",
              onclick: () => removeItem(idx)
            }, "\xD7")
          );
        })
      );
    },
    ModalStyle(),
    ModalDialog
  );
};
var page_gallery_default = GalleryEditor;

// client/app.js
var { t: t7 } = i18n_default2;
var mainPage = projectPanel;
var appPage = Page();
var app_default = appPage;
app_ctrl_default.on("project", () => {
  appPage.replaceChildren(Page());
});
app_ctrl_default.on("session", () => {
  updateDarkTheme();
  i18n_default2.setLanguage(app_ctrl_default.session.language);
});
function showProject() {
  mainPage = projectPanel;
  appPage.replaceChildren(Page());
}
function showImages() {
  mainPage = page_gallery_default;
  appPage.replaceChildren(Page());
}
function updateDarkTheme() {
  const bsTheme = app_ctrl_default.session.darkTheme ? "dark" : "light";
  document.documentElement.setAttribute("data-bs-theme", bsTheme);
}
function getDarkTheme() {
  return app_ctrl_default.session.darkTheme;
}
function setDarkTheme(value) {
  app_ctrl_default.session.darkTheme = value;
  updateDarkTheme();
}
async function showGallery() {
  const { a: a3, div: div4, h2, iframe, p: p3 } = van_default.tags;
  const t8 = i18n_default2.tPath("gallery-page");
  let generatorResult, resultPage;
  try {
    const response = await fetch("api/makegallery", {
      method: "POST"
      // no data, server take project from session
      // headers: { 'Content-Type': 'application/json' },
      // body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    generatorResult = await response.json();
  } catch (error) {
    console.error(error.message);
    generatorResult = { error: error.message };
  }
  if (!generatorResult || generatorResult.error || !generatorResult?.indexFilePath) {
    mainPage = () => div4(
      h2(t8("errorHeader")),
      div4(
        { class: "mt-4 p-4 bg-danger text-white fs-3" },
        p3("Error: ", generatorResult?.error || ""),
        p3("imgDir: ", generatorResult?.imgDir || ""),
        p3("indexFilePath: ", generatorResult?.indexFilePath || "")
      )
    );
    appPage.replaceChildren(Page());
    return;
  }
  mainPage = () => div4(
    // not allowed
    // a({href: 'file:///' + generatorResult.indexFilePath, target:"_blank", rel:"noopener noreferrer"}, t('open in new tab')),
    a3({ href: file_service_default2.getURL(generatorResult.indexFilePath), target: "_blank", rel: "noopener noreferrer" }, t8("open in new tab")),
    iframe({
      src: file_service_default2.getURL(generatorResult.indexFilePath),
      // filename as url
      class: "w-100 border-0 rounded shadow-sm",
      style: "height: 80vh; min-height: 500px;",
      title: "Bildergalerie",
      loading: "lazy"
    })
  );
  appPage.replaceChildren(Page());
}
i18n_default2.addWords({
  errorHeader: "Fehler beim Erzeugen der Galerie",
  "open in new tab": "In einem neuen Browsertab \xF6ffnen"
}, "de", "gallery-page");
i18n_default2.addWords({
  errorHeader: "Error creating the gallery",
  "open in new tab": "Open in a new browser tab"
}, "en", "gallery-page");
function Page() {
  const { div: div4 } = van_default.tags;
  return div4(
    { id: "app-content" },
    ne({
      class: "p-0",
      menu: appMenu()
    }),
    div4(
      { class: "container-fluid p-3" },
      mainPage()
    )
  );
}
function projectPanel() {
  const t8 = i18n_default2.tPath("project-panel");
  const project = app_ctrl_default.session.project || {};
  const values = { ...project, projectFile: app_ctrl_default.session.projectFile };
  const fb = _({ cols: "2 4", autoRow: true, rowClass: "mb-2", values }).add({ name: "title", label: t8("Title") }).add({ name: "name", label: t8("Name") }).add({ name: "directory", label: t8("Directory"), input: DirectoryInput, cols: "2 10" }).add({ name: "projectFile", label: t8("Filename"), readonly: true, cols: "2 10" });
  fb.onChange((name, value) => {
    const { projectFile, ...values2 } = fb.values;
    app_ctrl_default.session.project = { ...app_ctrl_default.session.project, ...values2 };
    app_ctrl_default.changed("", true);
  });
  return fb.dom;
}
i18n_default2.addWords({
  Title: "\xDCberschrift",
  Name: "Name",
  Directory: "Zielverzeichnis",
  Filename: "Dateiname"
}, "de", "project-panel");
i18n_default2.addWords({
  Title: "Title",
  Name: "Name",
  Directory: "Destination Folder",
  Filename: "File Name"
}, "en", "project-panel");
function appMenu() {
  const t8 = i18n_default2.tPath("appMenu");
  const { h4, span: span2 } = van_default.tags;
  const iconLabel = (icon, label2) => span2(be(icon, { class: "me-1" }), label2);
  const hash3 = window.location.hash;
  return {
    brand: h4(
      { class: "nav-brand me-3 my-0 d-flex align-items-center" },
      be("LOGO", { class: "me-2 mt-1" }),
      t8("Gallery Maker")
    ),
    items: [
      {
        label: iconLabel("FILE", t8("File")),
        items: [
          { label: iconLabel("SPACE", t8("New Project")), onclick: app_ctrl_default.newProject },
          { label: iconLabel("SPACE", t8("Open Project")), onclick: app_ctrl_default.openProject },
          { label: iconLabel("SPACE", t8("Open Recent Project")), onclick: app_ctrl_default.openRecentProject },
          { label: iconLabel("SPACE", t8("Save Project")), onclick: app_ctrl_default.saveProject },
          { label: iconLabel("SPACE", t8("Save Project As")), onclick: app_ctrl_default.saveProjectAs }
        ]
      },
      { label: iconLabel("PROJECT", t8("Project")), onclick: showProject },
      { label: iconLabel("IMAGELIST", t8("Images")), onclick: showImages },
      { label: iconLabel("GALLERY", t8("Make")), onclick: showGallery },
      { label: iconLabel("ADDPICT", t8("Add Images")), onclick: app_ctrl_default.addImageFiles },
      // {label: iconLabel('OPTIONS',t('Options')), onclick: appCtrl.addImageFiles},
      {
        label: iconLabel("OPTIONS", t8("Options")),
        items: [
          {
            label: app_ctrl_default.session.compactMode ? iconLabel("CHECK", t8("compactMode")) : iconLabel("SPACE", t8("compactMode")),
            // active: appCtrl.session.compactMode,
            onclick: () => {
              app_ctrl_default.session.compactMode = !app_ctrl_default.session.compactMode;
              app_ctrl_default.changed();
            }
          },
          {
            label: getDarkTheme() ? iconLabel("CHECK", t8("darkTheme")) : iconLabel("SPACE", t8("darkTheme")),
            // active: getDarkTheme(),
            onclick: () => {
              setDarkTheme(!getDarkTheme());
              app_ctrl_default.changed();
            }
          },
          {
            label: iconLabel("SPACE", t8("language")),
            onclick: () => {
              i18n_default2.setLanguage(i18n_default2.language === "en" ? "de" : "en");
              app_ctrl_default.session.language = i18n_default2.language;
              app_ctrl_default.changed();
            }
          }
        ]
      }
    ]
  };
}

// client/index.js
var appId = "main";
var userLang = navigator.language || navigator.userLanguage;
if (typeof userLang !== "string") userLang = "en";
else userLang = userLang.slice(0, 2).toLowerCase();
var forbiddenText = userLang === "de" ? "Die App ist in einem anderen Tab ge\xF6ffnet" : "The app is open in another tab";
connectHeartbeat({ forbiddenText, appId });
file_service_default2.setURL("/api");
van_default.add(document.getElementById(appId), app_default);
app_ctrl_default.init();
/*! Bundled license information:

bootstrap/dist/js/bootstrap.esm.js:
  (*!
    * Bootstrap v5.3.9 (https://getbootstrap.com/)
    * Copyright 2011-2026 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
    *)
*/
//# sourceMappingURL=client.js.map
