
window.getBlooketReactOwner = function() {
    try {
        const allDivs = document.querySelectorAll('div');
        for (let i = 0; i < allDivs.length; i++) {
            const node = allDivs[i];
            const reactKey = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (reactKey && node[reactKey]) {
                let fiber = node[reactKey];

                while(fiber) {
                    if (fiber.memoizedProps && fiber.memoizedProps.client) {
                        return { stateNode: { props: fiber.memoizedProps }, props: fiber.memoizedProps };
                    }
                    if (fiber.memoizedProps && fiber.memoizedProps.liveGameController) {
                         return { stateNode: { props: fiber.memoizedProps }, props: fiber.memoizedProps };
                    }

                    if (fiber.stateNode && fiber.stateNode.props) {
                        if (fiber.stateNode.props.client || fiber.stateNode.props.liveGameController) {
                             return fiber.stateNode._reactInternals || fiber;
                        }
                    }
                    fiber = fiber.return;
                }
            }
        }

        const nodes = [
            document.querySelector('#app>div>div'),
            document.querySelector('body div[id] > div > div'),
            document.querySelector('body div[class*="_body"]')
        ];

        for (let node of nodes) {
            if (!node) continue;

            const vals = Object.values(node);
            if (vals[1] && vals[1].children) {
                if (vals[1].children[0] && vals[1].children[0]._owner) return vals[1].children[0]._owner;
                if (vals[1].children[1] && vals[1].children[1]._owner) return vals[1].children[1]._owner;
            }

            const reactKey = Object.keys(node).find(k => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
            if (reactKey && node[reactKey]) {
                let fiber = node[reactKey];
                while(fiber && !fiber.stateNode) {
                    fiber = fiber.return;
                }
                if (fiber && fiber.stateNode) {
                    return fiber.stateNode._reactInternals || fiber;
                }
            }
        }
    } catch(e) {}

    return Object.values(document.querySelector('#app>div>div') || {})[1]?.children?.[0]?._owner;
};

window._capturedLogs = window._capturedLogs || [];
window._originalConsoleLog = window._originalConsoleLog || console.log;

function safeStringify(obj) {
    let cache = [];
    try {
        return JSON.stringify(obj, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) return '[Circular]';
                cache.push(value);
            }
            return value;
        });
    } catch (e) {
        return '[Object]';
    } finally {
        cache = null;
    }
}

console.log = function(...args) {
    const msg = args.map(a => typeof a === 'object' ? safeStringify(a) : String(a)).join(' ');

    window._capturedLogs.push('[' + new Date().toLocaleTimeString() + '] ' + msg);
    if(window._capturedLogs.length > 200) window._capturedLogs.shift();

    const debugUI = document.getElementById('blooket-gui-debugger');
    if (debugUI) {
        debugUI.value = window._capturedLogs.join('\n');
        debugUI.scrollTop = debugUI.scrollHeight;
    }
};

(async () => {
    _blsbu = "https://www.googleapis.com";
    var wfcall = window.fetch.call;
    window.fetch.call = function() {
        if (!arguments[1].includes("s.blooket.com/rc"))
            return wfcall.apply(this, arguments);
    }
    if (console.log("%c Zip´s Blooket Hacks / Cheats %c\n	Modified by Zip-On on GitHub", "color: #0bc2cf; font-size: 3rem", "color: #8000ff; font-size: 1rem"), console.log("%c	gui.js", "color: #0bc2cf; font-size: 1rem"), console.log("%c	Star the github repo!%c  https://github.com/Zip-On/Blooket-Cheat-GUI-aka-Swaggers-GUI", "color: #ffd000; font-size: 1rem", ""), document.querySelector("script[src*='bfs/index.js']") && !window.clearId) {
        for (var e, t, a, o, r, i, n, s, e = document.createElement("iframe"), t = (document.body.appendChild(e), window.clearId = window.setInterval(() => {}, 0)); t--;)
            e.contentWindow.clearInterval.call(window, t);
        e.remove()
    }

    (() => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', 'https://fonts.googleapis.com/css?family=Nunito:400,700|Titan+One|Creepster|Satisfy|Eczar:700');
        document.head.appendChild(link);
    })()

    function l(e, t = {}, ...a) {
        var o = document.createElement(e);
        if ("object" == typeof t.style) {
            let r = "";
            for (let i in t.style)
                r += `${i.replace(/[A-Z]/g, e => "-" + e.toLowerCase())}: ${t.style[i]}; `;
            t.style = r
        }
        for (let n in t)
            o[n] = t[n];
        for (let s of a)
            o.append(s);
        return o
    }
    let c = {
        data: null,
        setItem(e, t) {
            return e.split(".").reduce((e, a, o, r) => (e[a] = (e[a] ? e[a] : {}), ++o == r.length && (e[a] = t), e[a]), this.data),
                localStorage.setItem("ZIPGUISettings", JSON.stringify(this.data)),
                this.data
        },
        deleteItem(e) {
            return e.split(".").reduce((e, t, a, o) => (++a == o.length && delete e[t], e[t]), this.data),
                localStorage.setItem("ZIPGUISettings", JSON.stringify(this.data)),
                this.data
        },
        setData(e) {
            this.data = e,
                localStorage.setItem("ZIPGUISettings", JSON.stringify(this.data))
        }
    };
    try {
        for (let d of (c.data = JSON.parse(localStorage.getItem("ZIPGUISettings") || "{}"), ["backgroundColor", "cheatList", "contentBackground", "defaultButton", "disabledButton", "enabledButton", "infoColor", "inputColor", "textColor"]))
            c.data[d] && (c.setItem("theme." + d, c.data[d]), c.deleteItem(d))
    } catch {
        c.setData({})
    }
    let p,
        u,
        h,
        m,
        $,
        g,
        y,
        b,
        v,
        _ = l("div", {
            id: "ZIPGUI",
            style: {
                top: Math.max(10, window.innerHeight - 600) / 2 + "px",
                left: Math.max(10, window.innerWidth - 1e3) / 2 + "px",
                transform: `scale(${c.data.scale})`,
                position: "fixed",
                height: "80%",
                width: "80%",
                maxHeight: "600px",
                maxWidth: "1000px",
                zIndex: "999",
                display: "block"
            }
        }, p = l("style", {
            id: "variables",
            innerHTML: `:root {--backgroundColor: ${c.data?.theme?.backgroundColor || "rgb(11, 194, 207)"};--infoColor: ${c.data?.theme?.infoColor || "#9a49aa"};--cheatList: ${c.data?.theme?.cheatList || "#9a49aa"};--defaultButton: ${c.data?.theme?.defaultButton || "#9a49aa"};--disabledButton: ${c.data?.theme?.disabledButton || "#A02626"};--enabledButton: ${c.data?.theme?.enabledButton || "#47A547"};--textColor: ${c.data?.theme?.textColor || "white"};--inputColor: ${c.data?.theme?.inputColor || "#7a039d"};--contentBackground: ${c.data?.theme?.contentBackground || "rgb(64, 17, 95)"};}`
        }), l("style", {
            innerHTML: '.alertList::-webkit-scrollbar{display:none;}.alertList{-ms-overflow-style: none;scrollbar-width: none;}.contentWrapper::-webkit-scrollbar{display:none;}.contentWrapper{-ms-overflow-style: none;scrollbar-width: none;}.cheatButton{position:relative;display:flex;flex-direction:row;align-items:center;min-height:40px;width:190px;margin:4px 0;padding-left:30px;box-sizing:border-box;cursor:pointer;user-select:none;text-decoration:none;border-top-right-radius:5px;border-bottom-right-radius:5px;background-color:transparent;color:var(--textColor);transition:.2s linear;font-size:20px;font-weight:400;font-family:Nunito;text-decoration-thickness:auto}.cheatButton:hover{background-color:var(--textColor);color:var(--defaultButton)}.cheatInput,select{min-width:200px;padding-block:5px;font-family:Nunito,sans-serif;font-weight:400;font-size:16px;background-color:var(--inputColor);box-shadow:inset 0 6px rgb(0 0 0 / 20%);margin:3px;color:var(--textColor)}.bigButton:hover{filter:brightness(110%);transform:translateY(-2px)}.bigButton:active{transform:translateY(2px)}.cheatList::-webkit-scrollbar{width:10px}.cheatList::-webkit-scrollbar-track{background:var(--cheatList)}.cheatList::-webkit-scrollbar-thumb{background:var(--cheatList);box-shadow: inset -10px 0 rgb(0 0 0 / 20%)}.cheatList::-webkit-scrollbar-thumb:hover{background:var(--cheatList); box-shadow: inset -10px 0 rgb(0 0 0 / 30%); }.scriptButton:hover{filter:brightness(120%)}.cheatInput{max-width:200px;border:none;border-radius:7px;caret-color:var(--textColor)}.cheatInput::placeholder{color:var(--textColor)}.cheatInput:focus,select:focus{outline:0}.cheatInput::-webkit-inner-spin-button,.cheatInput::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}.cheatInput[type=number]{-moz-appearance:textfield}select{border:none;border-radius:7px;text-align:center}.scriptButton{align-items: center; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center; margin: 10px; padding: 5px 5px 11px; position: relative; width: 250px; font-family: Nunito, sans-serif; font-weight: 400; color: var(--textColor); box-shadow: inset 0 -6px rgb(0 0 0 / 20%); border-radius: 7px; cursor: pointer; transition: filter .25s;}.tooltip::after {content: "";position: absolute;width: 10px;height: 10px;background-color: inherit;top: -5px;left: 50%;margin-left: -6px;transform: rotate(135deg)}'
        }), u = l("div", {
            style: {
                width: "100%",
                height: "100%",
                position: "relative",
                outline: "3px solid #3a3a3a",
                borderRadius: "15px",
                overflow: "hidden"
            }
        }, l("div", {
            id: "background",
            style: {
                display: "block",
                top: "0",
                left: "0",
                height: "100%",
                overflowY: "hidden",
                overflowX: "hidden",
                position: "absolute",
                width: "100%",
                background: "var(--backgroundColor)",
                visibility: "visible"
            }
        }, l("div", {
            id: "backgroundImage",
            style: {
                backgroundImage: "url(https://ac.blooket.com/dashboard/65a43218fd1cabe52bdf1cda34613e9e.png)",
                display: "block",
                height: "200%",
                position: "absolute",
                width: "200%",
                top: "50%",
                left: "50%",
                backgroundPositionX: "-100px",
                backgroundPositionY: "-100px",
                backgroundSize: "550px",
                visibility: "visible",
                transform: "translate(-50%,-50%) rotate(15deg)",
                appearance: "none",
                opacity: "0.175"
            }
        })), m = l("div", {
            id: "controls",
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingBottom: "8px",
                paddingInline: "15px",
                position: "absolute",
                left: "220px",
                top: "0",
                visibility: "visible",
                zIndex: "5",
                height: "52px",
                width: "max-content",
                background: "var(--infoColor)",
                boxShadow: "inset 0 -8px rgb(0 0 0 / 20%), 0 0 4px rgb(0 0 0 / 15%)",
                borderBottomRightRadius: "10px",
                color: "var(--textColor)",
                fontFamily: "Nunito, sans-serif",
                fontWeight: "700",
                userSelect: "text"
            },
            innerText: ([{
                ctrl: e,
                shift: t,
                alt: a,
                key: o
            }, {
                ctrl: r,
                shift: i,
                alt: n,
                key: s
            }] = [c.data.hide || {
                ctrl: !0,
                key: "e"
            }, c.data.close || {
                ctrl: !0,
                key: "x"
            }], `${[e && "Ctrl", t && "Shift", a && "Alt", o && o.toUpperCase()].filter(Boolean).join(" + ")} to hide | ${[r && "Ctrl", i && "Shift", n && "Alt", s && s.toUpperCase()].filter(Boolean).join(" + ")} for quick disable Click and drag here`),
            update: ({
                ctrl: e,
                shift: t,
                alt: a,
                key: o
            } = {
                ctrl: !0,
                key: "e"
            }, {
                ctrl: r,
                shift: i,
                alt: n,
                key: s
            } = {
                ctrl: !0,
                key: "x"
            }) => m.innerText = `${[e && "Ctrl", t && "Shift", a && "Alt", o && o.toUpperCase()].filter(Boolean).join(" + ")} to hide | ${[r && "Ctrl", i && "Shift", n && "Alt", s && s.toUpperCase()].filter(Boolean).join(" + ")} for quick disable Click and drag here`
        }), l("div", {
        }), $ = l("div", {
            id: "controlButtons",
            style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                right: "0",
                bottom: "0",
                visibility: "visible",
                zIndex: "5",
                height: "55px",
                width: "165px",
                background: "#none",
                borderLeft: "3px solid black",
                borderTop: "3px solid black",
                borderTopLeftRadius: "10px",
                color: "white",
                fontFamily: "Nunito, sans-serif",
                fontWeight: "700",
                userSelect: "text",
                overflow: "hidden",
                pointerEvents: "all"
            }
        }, g = l("button", {
            style: {
                height: "55px",
                width: "55px",
                fontFamily: "Nunito",
                color: "white",
                backgroundColor: "#00a0ff",
                border: "none",
                fontSize: "2rem",
                cursor: "move"
            },
            innerHTML: "✥"
        }), l("button", {
            style: {
                height: "55px",
                width: "55px",
                fontFamily: "Nunito",
                color: "white",
                backgroundColor: "grey",
                border: "none",
                fontSize: "2rem",
                fontWeight: "bolder",
                cursor: "pointer"
            },
            innerHTML: "-",
            onclick: function() {
                    let e = !1;
                    return () => {
                        for (var t of [...u.children])
                            t != $ && (e ? t.style.display = t.style._display : (t.style._display = t.style.display, t.style.display = "none"));
                        u.style.height = e ? "100%" : "55px",
                            u.style.width = e ? "100%" : "165px",
                            _.style.top = parseInt(_.style.top) + (_.offsetHeight - 55) * (e ? -1 : 1) + "px",
                            _.style.left = parseInt(_.style.left) + (_.offsetWidth - 165) * (e ? -1 : 1) + "px",
                            _.style.pointerEvents = e ? "unset" : "none",
                            e = !e
                    }
                }
                ()
        }), l("button", {
            style: {
                height: "55px",
                width: "55px",
                fontFamily: "Nunito",
                color: "white",
                backgroundColor: "red",
                border: "none",
                fontSize: "2rem",
                fontWeight: "bolder",
                cursor: "pointer"
            },
            innerHTML: "X",
            onclick: D
        })), h = l("div", {
            className: "cheatList",
            style: {
                overflowY: "scroll",
                background: "var(--cheatList)",
                boxShadow: "inset -10px 0 rgb(0 0 0 / 20%)",
                zIndex: "5",
                width: "220px",
                position: "absolute",
                top: "0",
                left: "0",
                height: "100%",
                fontFamily: "Titan One",
                color: "var(--textColor)",
                fontSize: "40px",
                textAlign: "center",
                paddingTop: "20px",
                userSelect: "none",
                padding: "20px 10px 20px 0",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column"
            },
            innerHTML: '<span style="text-shadow: 1px 1px rgb(0 0 0 / 40%); font-size: 0.8em;">Zip´s Cheats<sup>v2.1</sup></span>'
        }, l("a", {
            className: "bigButton",
            style: {
                cursor: "pointer",
                display: "block",
                fontFamily: "Titan One",
                margin: "20px auto 10px",
                position: "relative",
                transition: ".25s",
                textDecoration: "none",
                userSelect: "none",
                visibility: "visible"
            },
            target: "_blank",
            href: "#",
            innerHTML: '<div style="background: rgba(0,0,0,.25); border-radius: 5px; display: block; width: 100%; height: 100%; left: 0; top: 0; position: absolute; transform: translateY(2px); width: 100%; transition: transform .6s cubic-bezier(.3,.7,.4,1)"></div> <div style="background-color: rgb(11, 194, 207); filter: brightness(.7); position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 5px;"></div> <div style="font-weight: 400; background-color: rgb(11, 194, 207); color: white; display: flex; flex-direction: row; align-items: center; justify-content: center; text-align: center; padding: 5px; border-radius: 5px; transform: translateY(-4px); transition: transform .6s cubic-bezier(.3,.7,.4,1)"> <div style="font-family: Titan One, sans-serif; color: white; font-size: 16px; text-shadow: 2px 2px rgb(0 0 0 / 20%); height: 40px; padding: 0 15px; display: flex; flex-direction: row; align-items: center; justify-content: center"> <img style="filter: drop-shadow(2px 2px 0 rgb(0 0 0 / 20%)); margin-right: 10px;" src="https://pbs.twimg.com/media/GrUoURrXQAAW6hV?format=png&name=240x240" width="35" height="35">  COMING SOON </div> </div>'
        })), l("div", {
            className: "contentWrapper",
            style: {
                position: "absolute",
                left: "220px",
                top: "70px",
                overflowY: "scroll",
                width: "calc(100% - 220px)",
                height: "calc(100% - 70px)",
                borderRadius: "7px"
            }
        }, l("div", {
            id: "content",
            style: {
                position: "absolute",
                inset: "27px 50px 50px 50px"
            }
        }, y = l("div", {
            className: "tooltip",
            style: {
                position: "absolute",
                top: "0",
                left: "0",
                backgroundColor: "black",
                height: "fit-content",
                maxWidth: "300px",
                zIndex: "5",
                borderRadius: "7.5px",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "5px",
                paddingInline: "15px",
                pointerEvents: "none",
                opacity: "0",
                textAlign: "center"
            },
            innerText: "description"
        }), b = l("div", {
            style: {
                alignItems: "center",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                padding: "20px 5px 20px",
                position: "relative",
                width: "100%",
                fontFamily: "Nunito, sans-serif",
                fontWeight: "400",
                color: "var(--textColor)",
                background: "var(--contentBackground)",
                boxShadow: "inset 0 -6px rgb(0 0 0 / 20%)",
                borderRadius: "7px"
            }
        }, v = l("div", {
            className: "headerText",
            style: {
                boxSizing: "border-box",
                display: "block",
                height: "45px",
                left: "-10px",
                padding: "4px 4px 8px",
                position: "absolute",
                top: "-28px",
                backgroundColor: "#ef7426",
                boxShadow: "0 4px rgb(0 0 0 / 20%), inset 0 -4px rgb(0 0 0 / 20%)",
                borderRadius: "7px"
            }
        }, l("div", {
            style: {
                alignItems: "center",
                boxSizing: "border-box",
                display: "flex",
                height: "100%",
                justifyContent: "center",
                padding: "0 15px",
                width: "100%",
                fontFamily: "Titan One, sans-serif",
                fontSize: "26px",
                fontWeight: "400",
                textShadow: "-1px -1px 0 #646464, 1px -1px 0 #646464, -1px 1px 0 #646464, 2px 2px 0 #646464",
                color: "white",
                background: "linear-gradient(#fcd843,#fcd843 50%,#feb31a 50.01%,#feb31a)",
                borderRadius: "5px"
            }
        })))))));
    for (let f of document.querySelectorAll("#ZIPGUI"))
        f.remove();

    function w(e, t, a, o) {
        let r = l("div", {
            className: "cheatButton",
            innerHTML: ("string" == typeof t ? `<img style="height: 30px; margin-right: 5px" src="${t}">` : t || "") + e,
            onclick: () => k(r.innerText, a, o)
        });
        return h.appendChild(r),
            r.onclick
    }

    function insertElemBefore(name, imgSrc, a, o, elem) {
        let r = l("div", {
            className: "cheatButton",
            innerHTML: ("string" == typeof imgSrc ? `<img style="height: 30px; margin-right: 5px" src="${imgSrc}">` : imgSrc || "") + name,
            onclick: () => k(r.innerText, a, o)
        });
        return h.insertBefore(r, elem),
            r.onclick
    }
    async function k(e, t, a) {
        b.innerHTML = "",
            v.firstChild.innerText = e + (a ? "" : " Cheats"),
            b.append(v);
        for (let o = 0; o < t.length; o++) {
            let {
                name: r,
                description: i,
                type: n,
                inputs: s,
                enabled: c,
                run: d,
                element: p
            } = t[o];
            if (!p) {
                let u = l("div", {
                    className: "scriptButton",
                    style: {
                        background: "toggle" == n ? c ? "var(--enabledButton)" : "var(--disabledButton)" : "var(--defaultButton)"
                    }
                }, l("div", {
                    className: "cheatName",
                    innerHTML: r
                }));
                if (u.dataset.description = i, u.onclick = (function({
                        target: e,
                        key: t
                    }) {
                        (e == u || e.classList.contains("cheatName") || "Enter" == t && e.classList.contains("cheatInput")) && (t = [...u.children].slice(1), d.apply(this, t.map(e => "number" == e.type ? parseInt("0" + e.value) : "SELECT" == e.nodeName ? JSON.parse(e.value) : e.data || e.value)), "toggle" == n && (u.style.background = this.enabled ? "var(--enabledButton)" : "var(--disabledButton)"), C.alerts?.[0].addLog(`${"toggle" == n ? this.enabled ? "Enabled" : "Disabled" : "Ran"} <strong>${this.name}</strong>` + (s?.length ? ` with inputs: (${t.map(e => "SELECT" == e.nodeName ? e.selectedOptions[0].innerText : e.value).join(", ")})` : ""), "toggle" == n ? this.enabled ? "var(--enabledButton)" : "var(--disabledButton)" : null))
                    }).bind(t[o]), s?.length)
                    for (let h = 0; h < s.length; h++) {
                        var {
                            name: m,
                            type: $,
                            options: g,
                            min: y,
                            max: _,
                            value: f
                        } = s[h];
                        let w;
                        try {
                            w = await ("function" == typeof g ? g?.() : g)
                        } catch {
                            w = []
                        }
                        if ("options" == $ && w?.length) {
                            let k = document.createElement("select");
                            w.forEach(e => {
                                    var t = document.createElement("option");
                                    t.value = JSON.stringify(e?.value || e),
                                        t.innerHTML = e?.name || e,
                                        k.appendChild(t)
                                }),
                                u.appendChild(k)
                        } else if ("function" == $) {
                            let S = document.createElement("input");
                            S.classList.add("cheatInput"),
                                S.placeholder = m,
                                S.style.textAlign = "center";
                            let x = (S.readOnly = !0, !1);
                            S.onclick = async () => {
                                    x || (S.value = "Waiting for input...", x = !0, S.data = await s[h].function(e => S.value = e + "..."), x = !1, S.value = S.value.slice(0, -3))
                                },
                                u.appendChild(S)
                        } else(g = document.createElement("input")).classList.add("cheatInput"), "number" == $ && (g.type = "number", g.min = y, g.max = _, g.value = f || (null != y ? y : 0)), g.placeholder = m, g.style.textAlign = "center", g.onkeyup = u.onclick, u.appendChild(g)
                    }
                t[o].element = u
            }
            b.appendChild(t[o].element)
        }
    }
    document.body.appendChild(_);
    let C = {
        global: [{
            name: "Auto Answer",
            description: "Toggles auto answer on",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null) : (this.enabled = !0, this.data = setInterval(() => {
                    var {
                        state: {
                            question: e,
                            stage: t,
                            feedback: a
                        },
                        props: {
                            client: {
                                question: o
                            }
                        }
                    } = window.getBlooketReactOwner().stateNode;
                    let r = e || o;
                    try {
                        "typing" != r.qType ? ("feedback" === t || a ? document.querySelector('[class*="feedback"]')?.firstChild : [...document.querySelectorAll('[class*="answerContainer"]')][r.answers.map((e, t) => r.correctAnswers.includes(e) ? t : null).filter(e => null != e)[0]])?.click?.() : window.getBlooketReactOwner().stateNode.sendAnswer(r.answers[0])
                    } catch {}
                }, 50))
            }
        }, {
            name: "Highlight Answers",
            description: "Toggles highlight answers on",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null) : (this.enabled = !0, this.data = setInterval(() => {
                    let {
                        stateNode: {
                            state: e,
                            props: t
                        }
                    } = window.getBlooketReactOwner();
                    [...document.querySelectorAll('[class*="answerContainer"]')].forEach((a, o) => {
                        (e.question || t.client.question).correctAnswers.includes((e.question || t.client.question).answers[o]) ? a.style.backgroundColor = "rgb(0, 207, 119)" : a.style.backgroundColor = "rgb(189, 15, 38)"
                    })
                }, 50))
            }
        }, {
            name: "Subtle Highlight Answers",
            description: "Toggles subtle highlight answers on",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                this.enabled ? (this.enabled = !1, clearInterval(this.data), this.data = null) : (this.enabled = !0, this.data = setInterval(() => {
                    let {
                        stateNode: {
                            state: e,
                            props: t
                        }
                    } = window.getBlooketReactOwner();
                    [...document.querySelectorAll('[class*="answerContainer"]')].forEach((a, o) => {
                        (e.question || t.client.question).correctAnswers.includes((e.question || t.client.question).answers[o]) && (a.style.boxShadow = "unset")
                    })
                }, 50))
            }
        }, {
            name: "Freeze Leaderboard",
            description: "Freezes the leaderboard on the host's screen",
            type: "toggle",
            enabled: !1,
            data: null,
            run: function() {
                var e = window.getBlooketReactOwner().stateNode;
                if (this.enabled)
                    this.enabled = !1, clearInterval(this.data), this.data = null, e.props.liveGameController.removeVal(`c/${e.props.client.name}/tat`);
                else {
                    this.enabled = !0;
                    let t = () => {
                        e.props.liveGameController.setVal({
                            path: `c/${e.props.client.name}/tat/Freeze`,
                            val: "freeze"
                        })
                    };
                    this.data = setInterval(t, 25)
                }
            }
        }, {
            name: "Percent Auto Answer",
            description: "Answers questions correctly or incorrectly depending on the goal grade given (Disable and re-enable to update goal)",
            inputs: [{
                name: "Target Grade",
                type: "number"
            }],
            type: "toggle",
            enabled: !1,
            data: null,
            run: function(e) {
                if (this.enabled)
                    this.enabled = !1, clearInterval(this.data), this.data = null;
                else {
                    this.enabled = !0;
                    let {
                        stateNode: t
                    } = window.getBlooketReactOwner();
                    this.data = setInterval(e => {
                        try {
                            let a = t.state.question || t.props.client.question;
                            if ("feedback" == t.state.stage || t.state.feedback)
                                return document.querySelector('[class*="feedback"], [id*="feedback"]')?.firstChild?.click?.();
                            if (document.querySelector("[class*='answerContainer']") || document.querySelector("[class*='typingAnswerWrapper']")) {
                                let o = 0,
                                    r = 0;
                                for (let i in t.corrects)
                                    o += t.corrects[i];
                                for (let n in t.incorrects)
                                    r += t.incorrects[n];
                                r += o;
                                let s = 0 == r || Math.abs(o / (r + 1) - e) >= Math.abs((o + 1) / (r + 1) - e);
                                if ("typing" != t.state.question.qType) {
                                    let l = document.querySelectorAll("[class*='answerContainer']");
                                    for (let c = 0; c < l.length; c++) {
                                        let d = a.correctAnswers.includes(a.answers[c]);
                                        if (s && d || !s && !d)
                                            return l[c]?.click?.()
                                    }
                                    l[0].click()
                                } else
                                    window.getBlooketReactOwner().stateNode.sendAnswer(s ? a.answers[0] : Math.random().toString(36).substring(2))
                            }
                        } catch {}
                    }, 100, (e ?? 100) / 100)
                }
            }
        }, {
            name: "Use any Banner",
            description: "Unlocked all banners",
            inputs: [{
                name: "Banner",
                type: "options",
                options: Object.entries({
                    Starter: "starter",
                    Fire: "fire",
                    "Tech Chip": "techChip",
                    Shamrocks: "shamrocks",
                    "Orange Ice Pop": "orangeIcePop",
                    Slime: "slime",
                    Sushi: "sushi",
                    "Falling Blocks": "fallingBlocks",
                    Racetrack: "racetrack",
                    "Football Field": "footballField",
                    "Ice Cream Sandwich": "iceCreamSandwich",
                    "Winter Landscape": "winterLandscape",
                    Leaves: "leaves",
                    "Music Class": "musicClass",
                    "Science Class": "scienceClass",
                    "Art Class": "artClass",
                    Clockwork: "clockwork",
                    "Hockey Rink": "hockeyRink",
                    "Outer Space": "outerSpace",
                    "Soccer Field": "soccerField",
                    Ice: "ice",
                    "Toaster Pastry": "toasterPastry",
                    "Fish Tank": "fishTank",
                    Theater: "theater",
                    Farm: "farm",
                    Spooky: "spooky",
                    "Spooky Cat": "spookyCat",
                    "Spooky Window": "spookyWindow",
                    Frankenstein: "frankenstein",
                    Ghosts: "ghosts",
                    Mummy: "mummy",
                    Spiders: "spiders",
                    Coffin: "coffin",
                    Pumpkins: "pumpkins",
                    "Christmas Tree": "christmasTree",
                    Chalkboard: "chalkboard",
                    Balloons: "balloons",
                    Skateboard: "skateboard",
                    Sunset: "sunset",
                    Tiger: "tiger",
                    "Pirate Map": "pirateMap",
                    Pencil: "pencil",
                    "Road Sign": "roadSign",
                    "Corn Dog": "cornDog",
                    Leaf: "leaf",
                    "Chili Pepper": "chiliPepper",
                    "Love Letter": "loveLetter",
                    Gifts: "gifts",
                    "Winter Train": "winterTrain",
                    "Winter Drive": "winterDrive",
                    Workbench: "workbench",
                    Harvest: "harvest",
                    Chocolate: "chocolate",
                    "Fall Picnic": "fallPicnic",
                    Bookshelf: "bookshelf",
                    "Easter Pattern": "easterPattern",
                    Carrot: "carrot",
                    "Easter Field": "easterField",
                    Garden: "garden",
                    Bakery: "bakery",
                    "Gummy Worm": "gummyWorm",
                    "Basketball Court": "basketballCourt",
                    "Flying Kite": "flyingKite",
                    "Hot Dog": "hotDog",
                    "Japanese Garden": "japaneseGarden",
                    Sandwich: "sandwich",
                    Ruler: "ruler",
                    "Ball Pit": "ballPit",
                    "Xylophone": "xylophone",
                    "Holiday Lights": "holidayLights",
                    "Ice Cream Truck": "iceCreamTruck",
                    "Holiday Gift Wrap": "holidayGiftWrap",
                    "Winter Sweater": "winterSweater",
                    "Holiday Ornaments": "holidayOrnaments",
                    Watermelon: "watermelon",
                    Baguette: "baguette",
                    Rollerblades: "rollerblades",
                    Surfboard: "surfboard",
                    Cookout: "cookout",
                    Comic: "comic",
                    Crayon: "crayon",
                    Lightning: "lightning",
                    Baseball: "baseball",
                    "Shamrock Coins": "shamrockCoins",
                    "End Of The Rainbow": "endRainbow",
                    "Easter Field": "easterField",
                    Marker: "marker",
                    Pizza: "pizza",
                    Leaf: "leaf",
                    "Alphabet Soup": "alphabetSoup"
                }).map(([e, t]) => ({
                    name: e,
                    value: t
                }))
            }],
            run: function(e) {
                var t = document.createElement("iframe");

                function a() {
                    return window.getBlooketReactOwner()
                }
                document.head.appendChild(t),
                    window.alert = t.contentWindow.alert.bind(window),
                    window.prompt = t.contentWindow.prompt.bind(window),
                    t.remove(),
                    a().stateNode.props.liveGameController.setVal({
                        path: "c/" + a().stateNode.props.client.name + "/bg",
                        val: e
                    })
            }
        }, {
            name: "Spam Buy Blooks",
            description: "Opens a box an amount of times",
            inputs: [{
                name: "Box",
                type: "options",
                options: () => Array.from(document.querySelectorAll("[class*='packsWrapper'] > div")).reduce((e, t) => (t.querySelector("[class*='blookContainer'] > img") || e.push(t.querySelector("[class*='packImgContainer'] > img").alt), e), [])
            }, {
                name: "Amount",
                type: "number"
            }, {
                name: "Show Unlocks",
                type: "options",
                options: [{
                    name: "Show Unlocks",
                    value: !0
                }, {
                    name: "Don't Show Unlocks",
                    value: !1
                }]
            }],
            run: async function(e, t, a) {
                let o = document.createElement("iframe");
                document.body.append(o),
                    window.alert = o.contentWindow.alert.bind(window),
                    window.prompt = o.contentWindow.prompt.bind(window),
                    window.confirm = o.contentWindow.confirm.bind(window),
                    o.remove();
                let {
                    stateNode: r
                } = window.getBlooketReactOwner(),
                    i = Array.from(document.querySelectorAll("[class*='packsWrapper'] > div")).reduce((e, t) => (t.querySelector("[class*='blookContainer'] > img") || (e[t.querySelector("[class*='packImgContainer'] > img").alt] = parseInt(t.querySelector("[class*='packBottom']").textContent)), e), {}),
                    n = e.split(" ").map(e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()).join(" "),
                    s = i[n];
                if (!s)
                    return alert("I couldn't find that box!");
                let l = Math.min(Math.floor(r.state.tokens / s), t);
                if (0 == l)
                    return alert("You do not have enough tokens!");
                let c = {},
                    d = Date.now();
                for (let p = 0; p < l; p++) {
                    await r.buyPack(!0, n),
                        c[r.state.unlockedBlook] ||= 0,
                        c[r.state.unlockedBlook]++;
                    let u = Date.now();
                    d += Date.now() - u,
                        r.setState({
                            canOpen: !0,
                            currentPack: "",
                            opening: a,
                            doneOpening: a,
                            openPack: a
                        }),
                        clearTimeout(r.canOpenTimeout)
                }
                await new Promise(e => setTimeout(e)),
                    alert(`(${Date.now() - d}ms) Results: ${Object.entries(c).map(([e, t]) => `    ${e} ${t}`).join(` `)}`)
            }
        }, {
            name: "Flood Game",
            description: "Floods a game with a number of fake accounts",
            inputs: [{
                name: "Name",
                type: "string"
            }, {
                name: "Amount",
                type: "number"
            }, {
                name: "Blook",
                type: "options",
                options: ["Chick", "Chicken", "Cow", "Goat", "Horse", "Pig", "Sheep", "Duck", "Alpaca", "Dog", "Cat", "Rabbit", "Goldfish", "Hamster", "Turtle", "Kitten", "Puppy", "Bear", "Moose", "Fox", "Raccoon", "Squirrel", "Owl", "Hedgehog", "Deer", "Wolf", "Beaver", "Tiger", "Orangutan", "Cockatoo", "Parrot", "Anaconda", "Jaguar", "Macaw", "Toucan", "Panther", "Capuchin", "Gorilla", "Hippo", "Rhino", "Giraffe", "Snowy Owl", "Polar Bear", "Arctic Fox", "Baby Penguin", "Penguin", "Arctic Hare", "Seal", "Walrus", "Witch", "Wizard", "Elf", "Fairy", "Slime Monster", "Jester", "Dragon", "Queen", "Unicorn", "King", "Two of Spades", "Eat Me", "Drink Me", "Alice", "Queen of Hearts", "Dormouse", "White Rabbit", "Cheshire Cat", "Caterpillar", "Mad Hatter", "King of Hearts", "Toast", "Cereal", "Yogurt", "Breakfast Combo", "Orange Juice", "Milk", "Waffle", "Pancakes", "French Toast", "Pizza", "Earth", "Meteor", "Stars", "Alien", "Planet", "UFO", "Spaceship", "Astronaut", "Lil Bot", "Lovely Bot", "Angry Bot", "Happy Bot", "Watson", "Buddy Bot", "Brainy Bot", "Mega Bot", "Old Boot", "Jellyfish", "Clownfish", "Frog", "Crab", "Pufferfish", "Blobfish", "Octopus", "Narwhal", "Dolphin", "Baby Shark", "Megalodon", "Panda", "Sloth", "Tenrec", "Flamingo", "Zebra", "Elephant", "Lemur", "Peacock", "Chameleon", "Lion", "Amber", "Dino Egg", "Dino Fossil", "Stegosaurus", "Velociraptor", "Brontosaurus", "Triceratops", "Tyrannosaurus Rex", "Ice Bat", "Ice Bug", "Ice Elemental", "Rock Monster", "Dink", "Donk", "Bush Monster", "Yeti", "Dingo", "Echidna", "Koala", "Kookaburra", "Platypus", "Joey", "Kangaroo", "Crocodile", "Sugar Glider", "Deckhand", "Buccaneer", "Swashbuckler", "Treasure Map", "Seagull", "Jolly Pirate", "Pirate Ship", "Kraken", "Captain Blackbeard", "Snow Globe", "Holiday Gift", "Hot Chocolate", "Holiday Wreath", "Stocking", "Gingerbread Man", "Gingerbread House", "Reindeer", "Snowman", "Santa Claus", "Pumpkin", "Swamp Monster", "Frankenstein", "Vampire", "Zombie", "Mummy", "Caramel Apple", "Candy Corn", "Werewolf", "Ghost", "Rainbow Jellyfish", "Blizzard Clownfish", "Lovely Frog", "Lucky Frog", "Spring Frog", "Poison Dart Frog", "Lucky Hamster", "Chocolate Rabbit", "Spring Rabbit", "Lemon Crab", "Pirate Pufferfish", "Donut Blobfish", "Crimson Octopus", "Rainbow Narwhal", "Frost Wreath", "Tropical Globe", "New York Snow Globe", "London Snow Globe", "Japan Snow Globe", "Egypt Snow Globe", "Paris Snow Globe", "Red Sweater Snowman", "Blue Sweater Snowman", "Elf Sweater Snowman", "Santa Claws", "Cookies Combo", "Chilly Flamingo", "Snowy Bush Monster", "Nutcracker Koala", "Sandwich", "Ice Slime", "Frozen Fossil", "Ice Crab", "Rainbow Panda", "White Peacock", "Tiger Zebra", "Teal Platypus", "Red Astronaut", "Orange Astronaut", "Yellow Astronaut", "Lime Astronaut", "Green Astronaut", "Cyan Astronaut", "Blue Astronaut", "Pink Astronaut", "Purple Astronaut", "Brown Astronaut", "Black Astronaut", "Lovely Planet", "Lovely Peacock", "Haunted Pumpkin", "Pumpkin Cookie", "Ghost Cookie", "Red Gummy Bear", "Blue Gummy Bear", "Green Gummy Bear", "Chick Chicken", "Chicken Chick", "Raccoon Bandit", "Owl Sheriff", "Vampire Frog", "Pumpkin King", "Leprechaun", "Anaconda Wizard", "Spooky Pumpkin", "Spooky Mummy", "Agent Owl", "Master Elf", "Party Pig", "Wise Owl", "Spooky Ghost", "Phantom King", "Tim the Alien", "Rainbow Astronaut", "Hamsta Claus", "Light Blue", "Black", "Red", "Purple", "Pink", "Orange", "Lime", "Green", "Teal", "Tan", "Maroon", "Gray", "Mint", "Salmon", "Burgandy", "Baby Blue", "Dust", "Brown", "DullBlue", "Yellow", "Blue"].map(e => ({
                    name: e,
                    value: e
                }))
            }, {
                name: "Banner",
                type: "options",
                options: Object.entries({
                    Starter: "starter",
                    Fire: "fire",
                    "Tech Chip": "techChip",
                    Shamrocks: "shamrocks",
                    "Orange Ice Pop": "orangeIcePop",
                    Slime: "slime",
                    Sushi: "sushi",
                    "Falling Blocks": "fallingBlocks",
                    Racetrack: "racetrack",
                    "Football Field": "footballField",
                    "Ice Cream Sandwich": "iceCreamSandwich",
                    "Winter Landscape": "winterLandscape",
                    Leaves: "leaves",
                    "Music Class": "musicClass",
                    "Science Class": "scienceClass",
                    "Art Class": "artClass",
                    Clockwork: "clockwork",
                    "Hockey Rink": "hockeyRink",
                    "Outer Space": "outerSpace",
                    "Soccer Field": "soccerField",
                    Ice: "ice",
                    "Toaster Pastry": "toasterPastry",
                    "Fish Tank": "fishTank",
                    Theater: "theater",
                    Farm: "farm",
                    Spooky: "spooky",
                    "Spooky Cat": "spookyCat",
                    "Spooky Window": "spookyWindow",
                    Frankenstein: "frankenstein",
                    Ghosts: "ghosts",
                    Mummy: "mummy",
                    Spiders: "spiders",
                    Coffin: "coffin",
                    Pumpkins: "pumpkins",
                    "Christmas Tree": "christmasTree",
                    Chalkboard: "chalkboard",
                    Balloons: "balloons",
                    Skateboard: "skateboard",
                    Sunset: "sunset",
                    Tiger: "tiger",
                    "Pirate Map": "pirateMap",
                    Pencil: "pencil",
                    "Road Sign": "roadSign",
                    "Corn Dog": "cornDog",
                    Leaf: "leaf",
                    "Chili Pepper": "chiliPepper",
                    "Love Letter": "loveLetter",
                    Gifts: "gifts",
                    "Winter Train": "winterTrain",
                    "Winter Drive": "winterDrive",
                    Workbench: "workbench",
                    Harvest: "harvest",
                    Chocolate: "chocolate",
                    "Fall Picnic": "fallPicnic",
                    Bookshelf: "bookshelf",
                    "Easter Pattern": "easterPattern",
                    Carrot: "carrot",
                    "Easter Field": "easterField",
                    Garden: "garden",
                    Bakery: "bakery",
                    "Gummy Worm": "gummyWorm",
                    "Basketball Court": "basketballCourt",
                    "Flying Kite": "flyingKite",
                    "Hot Dog": "hotDog",
                    "Japanese Garden": "japaneseGarden",
                    Sandwich: "sandwich",
                    Ruler: "ruler",
                    "Ball Pit": "ballPit",
                    "Xylophone": "xylophone",
                    "Holiday Lights": "holidayLights",
                    "Ice Cream Truck": "iceCreamTruck",
                    "Holiday Gift Wrap": "holidayGiftWrap",
                    "Winter Sweater": "winterSweater",
                    "Holiday Ornaments": "holidayOrnaments",
                    Watermelon: "watermelon",
                    Baguette: "baguette",
                    Rollerblades: "rollerblades",
                    Surfboard: "surfboard",
                    Cookout: "cookout",
                    Comic: "comic",
                    Crayon: "crayon",
                    Lightning: "lightning",
                    Baseball: "baseball",
                    "Shamrock Coins": "shamrockCoins",
                    "End Of The Rainbow": "endRainbow",
                    "Easter Field": "easterField",
                    Marker: "marker",
                    Pizza: "pizza",
                    Leaf: "leaf",
                    "Alphabet Soup": "alphabetSoup"
                }).map(([e, t]) => ({
                    name: e,
                    value: t
                }))
            }],
            run: async function(e, t, a, o) {
                let r = document.createElement("iframe");

                function i() {
                    return window.getBlooketReactOwner().stateNode
                }
                document.body.append(r),
                    window.prompt = r.contentWindow.prompt.bind(window),
                    window.alert = r.contentWindow.alert.bind(window),
                    r.remove();
                var n = {
                    randomNames: !1
                };
                if (!i().props.liveGameController._liveApp) {
                    alert("You must be in a game to use the flooder!");
                    return
                }
                var s = i().props.liveGameController._liveApp.firebase;
                async function l(e, t) {
                    let r = await fetch("https://fb.blooket.com/c/firebase/join", {
                        body: JSON.stringify({
                            id: e,
                            name: t
                        }),
                        credentials: "include",
                        method: "PUT"
                    }).then(e => e.json());
                    if (r.success) {
                        let i = s.initializeApp({
                            apiKey: "AIzaSyCA-cTOnX19f6LFnDVVsHXya3k6ByP_MnU",
                            authDomain: "blooket-2020.firebaseapp.com",
                            projectId: "blooket-2020",
                            storageBucket: "blooket-2020.appspot.com",
                            messagingSenderId: "741533559105",
                            appId: "1:741533559105:web:b8cbb10e6123f2913519c0",
                            measurementId: "G-S3H5NGN10Z",
                            databaseURL: r.fbShardURL
                        }, t);
                        await i.auth().signInWithCustomToken(r.fbToken);
                        let n = i.database();
                        await n.ref(`${e}/c/${t}`).set({
                                b: a,
                                bg: o
                            }),
                            C.alerts[0].addLog(`Bot ${t} joined!`)
                    } else
                        alert("Connect error: " + r.msg)
                }
                async function c() {
                    if (!i().props.liveGameController._liveApp) {
                        alert("You must be in a game for the flooder to work!");
                        return
                    }
                    var a,
                        o = i().props.client.hostId,
                        r = parseInt(t);
                    if (!r) {
                        alert("You must use a valid number!");
                        return
                    }
                    if (!n.randomNames)
                        var s = e;
                    for (var c = 0; c < r; c++)
                        await l(o, a = n.randomNames ? d(15) : s + Math.floor(4e3 * Math.random()))
                }

                function d(e) {
                    for (var t = "", a = 0; a < e; a++)
                        t += String.fromCharCode(65 + Math.floor(25 * Math.random()));
                    return t
                }
                c()
            }
        }, {
            name: "Simulate Unlock",
            description: "Simulates unlocking a certian blook",
            inputs: [{
                name: "Blook (Case Sensitive)"
            }],
            run: (unlockedBlook) => {
                const stateNode = window.getBlooketReactOwner().stateNode;
                stateNode.setState({
                    loadingPack: !1,
                    openPack: !0,
                    unlockedBlook,
                    newUnlock: !0,
                    canOpen: !1
                });
                setTimeout(() => stateNode.setState({
                    canOpen: !0
                }), 200);
            }
        }, {
            name: "Simulate Pack",
            description: "Simulates unlocking a pack",
            inputs: [{
                name: "Pack",
                type: "options",
                options: () => [...document.querySelector("[class*=packsWrapper]")?.children]?.map(e => e.children[0].children[0].alt)
            }],
            run: async (packName) => {
                let i = document.createElement('iframe');
                document.body.append(i);
                const alert = i.contentWindow.alert.bind(window);
                i.remove();
                if (window.location.pathname !== "/market") {
                    alert("You must be on the market page to run this cheat!");
                    return;
                }
                const stateNode = window.getBlooketReactOwner().stateNode;
                const getProbs = (pack) => (new Promise(res => {
                    if (!Array.prototype.map2) {
                        Array.prototype.map2 = Array.prototype.map;
                    }
                    Array.prototype.map = function() {
                        if (typeof this[0]?.[1] == "number") {
                            res(this);
                            Array.prototype.map = Array.prototype.map2;
                        }
                        return Array.prototype.map2.apply(this, arguments);
                    }
                    var a = new(stateNode.constructor)();
                    a.state.currentPack = pack;
                    a.render();
                    res(null);
                }));
                async function pickRandom(pack) {
                    let probs = (await getProbs(pack));
                    const choice = pickW(probs.map(e => e[1]));
                    return probs[choice];
                }

                function pickW(a) {
                    let v = 0;
                    let sum = [];
                    const rand = Math.floor(Math.random() * a.reduce((a, b) => a + b, 0));
                    a.forEach(e => (sum.push(v), v += e));
                    return sum.map(e => rand < e).findLastIndex(e => e ? 0 : 1);
                }
                stateNode.setState({
                    loadingPack: !1,
                    openPack: !0,
                    unlockedBlook: (await pickRandom(packName))[0],
                    newUnlock: !0,
                    canOpen: !1
                });
                setTimeout(() => stateNode.setState({
                    canOpen: !0
                }), 200);
            }
        }, {
            name: "Bypass Filter",
            description: "Bypasses the name filter",
            inputs: [{
                name: "Text",
                type: "text",
            }],
            run: function(e) {
                var t,
                    a,
                    o;
                let r;
                a = function e(t) {
                        for (var a = t.split(""), o = "", r = 0; r < a.length; r++)
                            o += "\xad" + a[r];
                        return o
                    }
                    (t = e),
                    r = document.createElement("iframe"),
                    document.body.appendChild(r),
                    window.alert = r.contentWindow.alert.bind(r.contentWindow),
                    (o = document.createElement("textarea")).value = a,
                    o.style.position = "fixed",
                    o.style.top = 0,
                    o.style.left = 0,
                    o.style.opacity = 0,
                    document.body.appendChild(o),
                    o.select(),
                    document.execCommand("copy"),
                    alert("Bypassed text copied to clipboard!"),
                    r.remove(),
                    document.body.removeChild(o)
            }
        }, {
            name: "Change Name Ingame",
            description: "Changes your name ingame",
            inputs: [{
                name: "New Name",
                type: "text"
            }],
            run: (function(newname) {
                (async () => {
                    const reactHandler = (e => window.getBlooketReactOwner().stateNode);
                    let i = document.createElement('iframe');
                    document.body.append(i);
                    let alert = i.contentWindow.alert.bind(window);
                    i.remove();

                    async function genToken(name) {
                        const res = await fetch("https://fb.blooket.com/c/firebase/join", {
                            body: JSON.stringify({
                                id: reactHandler().props.client.hostId,
                                name
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            method: "PUT",
                            credentials: "include"
                        }).then(e => e.json());
                        if (!res.success) {
                            alert("Error: " + res.msg);
                            return;
                        }
                        return res.fbToken;
                    }

                    const oldname = reactHandler().props.client.name;
                    reactHandler().props.client.name = newname;
                    const olddata = await reactHandler().props.liveGameController.getDatabaseVal(`c/${oldname}`);
                    await reactHandler().props.liveGameController.removeVal(`c/${oldname}`);
                    const token = await genToken(newname);
                    if (!token) {
                        return;
                    }
                    await reactHandler().props.liveGameController._liveApp.auth().signInWithCustomToken(token);
                    reactHandler().props.liveGameController._liveApp.auth().onAuthStateChanged(e => {
                        if (e.uid.split(":")[1] === newname) {
                            reactHandler().props.liveGameController.setVal({
                                path: `c/${newname}`,
                                val: olddata
                            });
                        }
                    });
                    reactHandler().setState({});
                })();
