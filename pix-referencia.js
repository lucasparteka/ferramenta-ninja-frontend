(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
	"object" == typeof document ? document.currentScript : void 0,
	18566,
	(e, a, r) => {
		a.exports = e.r(76562);
	},
	52683,
	(e) => {
		var a = e.i(43476),
			r = e.i(71645),
			t = e.i(18566);
		const n = {
				"00": "Payload Format Indicator",
				"01": "Point of Initiation Method",
				"02": "Merchant Account Information (Visa)",
				"03": "Merchant Account Information (Visa Electron)",
				"04": "Merchant Account Information (Mastercard)",
				"05": "Merchant Account Information (Mastercard)",
				"06": "Merchant Account Information (Cielo)",
				"07": "Merchant Account Information",
				"08": "Merchant Account Information",
				"09": "Merchant Account Information",
				10: "Merchant Account Information",
				11: "Merchant Account Information",
				12: "Merchant Account Information",
				13: "Merchant Account Information",
				14: "Merchant Account Information",
				15: "Merchant Account Information (EMVCo)",
				16: "Merchant Account Information (EMVCo)",
				17: "Merchant Account Information (EMVCo)",
				18: "Merchant Account Information (EMVCo)",
				19: "Merchant Account Information (EMVCo)",
				20: "Merchant Account Information",
				21: "Merchant Account Information",
				22: "Merchant Account Information",
				23: "Merchant Account Information",
				24: "Merchant Account Information",
				25: "Merchant Account Information",
				26: "Merchant Account Information - PIX",
				27: "Merchant Account Information - PIX",
				28: "Merchant Account Information",
				29: "Merchant Account Information",
				30: "Merchant Account Information",
				31: "Merchant Account Information",
				32: "Merchant Account Information",
				33: "Merchant Account Information",
				34: "Merchant Account Information",
				35: "Merchant Account Information",
				36: "Merchant Account Information",
				37: "Merchant Account Information",
				38: "Merchant Account Information",
				39: "Merchant Account Information",
				40: "Merchant Account Information",
				41: "Merchant Account Information",
				42: "Merchant Account Information",
				43: "Merchant Account Information",
				44: "Merchant Account Information",
				45: "Merchant Account Information",
				46: "Merchant Account Information",
				47: "Merchant Account Information",
				48: "Merchant Account Information",
				49: "Merchant Account Information",
				50: "Merchant Account Information",
				51: "Merchant Account Information",
				52: "Merchant Category Code",
				53: "Transaction Currency",
				54: "Transaction Amount",
				55: "Tip or Convenience Indicator",
				56: "Value of Convenience Fee Fixed",
				57: "Value of Convenience Fee Percentage",
				58: "Country Code",
				59: "Merchant Name",
				60: "Merchant City",
				61: "Postal Code",
				62: "Additional Data Field Template",
				63: "CRC",
				64: "Merchant Information - Language Template",
				65: "RFU for EMVCo",
				80: "Unreserved Templates",
				81: "Unreserved Templates",
				82: "Unreserved Templates",
				83: "Unreserved Templates",
				84: "Unreserved Templates",
				85: "Unreserved Templates",
				86: "Unreserved Templates",
				87: "Unreserved Templates",
				88: "Unreserved Templates",
				89: "Unreserved Templates",
				90: "Unreserved Templates",
				91: "Unreserved Templates",
				92: "Unreserved Templates",
				93: "Unreserved Templates",
				94: "Unreserved Templates",
				95: "Unreserved Templates",
				96: "Unreserved Templates",
				97: "Unreserved Templates",
				98: "Unreserved Templates",
				99: "Unreserved Templates",
			},
			o = {
				"00": "GUI (Globally Unique Identifier)",
				"01": "Chave PIX",
				"02": "Informacao Adicional",
				"03": "FSSRS (BACEN)",
				21: "URL",
				22: "URL",
				23: "URL",
				24: "URL",
				25: "URL",
			},
			s = {
				"00": "Payment System Specific Template",
				"01": "Bill Number",
				"02": "Mobile Number",
				"03": "Store Label",
				"04": "Loyalty Number",
				"05": "Reference Label (TXID)",
				"06": "Customer Label",
				"07": "Terminal Label",
				"08": "Purpose of Transaction",
				"09": "Additional Consumer Data Request",
				10: "Merchant Tax ID",
				11: "Source Account",
				50: "Payment System Specific",
				51: "Payment System Specific",
				52: "Payment System Specific",
				53: "Payment System Specific",
				54: "Payment System Specific",
				55: "Payment System Specific",
				56: "Payment System Specific",
				57: "Payment System Specific",
				58: "Payment System Specific",
				59: "Payment System Specific",
				60: "Payment System Specific",
				61: "Payment System Specific",
				62: "Payment System Specific",
				63: "Payment System Specific",
				64: "Payment System Specific",
				65: "Payment System Specific",
				66: "Payment System Specific",
				67: "Payment System Specific",
				68: "Payment System Specific",
				69: "Payment System Specific",
				70: "Payment System Specific",
				71: "Payment System Specific",
				72: "Payment System Specific",
				73: "Payment System Specific",
				74: "Payment System Specific",
				75: "Payment System Specific",
				76: "Payment System Specific",
				77: "Payment System Specific",
				78: "Payment System Specific",
				79: "Payment System Specific",
				80: "Payment System Specific",
				81: "Payment System Specific",
				82: "Payment System Specific",
				83: "Payment System Specific",
				84: "Payment System Specific",
				85: "Payment System Specific",
				86: "Payment System Specific",
				87: "Payment System Specific",
				88: "Payment System Specific",
				89: "Payment System Specific",
				90: "Payment System Specific",
				91: "Payment System Specific",
				92: "Payment System Specific",
				93: "Payment System Specific",
				94: "Payment System Specific",
				95: "Payment System Specific",
				96: "Payment System Specific",
				97: "Payment System Specific",
				98: "Payment System Specific",
				99: "Payment System Specific",
			},
			l = {
				"00": "Language Preference",
				"01": "Merchant Name - Alternate Language",
				"02": "Merchant City - Alternate Language",
			},
			i = {
				986: "BRL (Real Brasileiro)",
				840: "USD (US Dollar)",
				978: "EUR (Euro)",
			},
			c = {
				BR: "Brasil",
				US: "United States",
			},
			d = {
				11: "Static QR Code (can be reused)",
				12: "Dynamic QR Code (single use)",
			};

		function m(e) {
			let a = 65535;
			for (let r = 0; r < e.length; r++) {
				a ^= e.charCodeAt(r) << 8;
				for (let e = 0; e < 8; e++)
					a = 32768 & a ? ((a << 1) ^ 4129) & 65535 : (a << 1) & 65535;
			}
			return a.toString(16).toUpperCase().padStart(4, "0");
		}

		function u(e) {
			const a = e.trim().replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, ""),
				r = a.lastIndexOf("6304");
			if (-1 === r) return !1;
			const t = a.substring(0, r + 4);
			return a.substring(r + 4, r + 8).toUpperCase() === m(t);
		}

		function x(e) {
			let a = e.trim().replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, ""),
				r = a.lastIndexOf("6304");
			-1 !== r && (a = a.substring(0, r));
			const t = m((a += "6304"));
			return a + t;
		}
		const h = [
			"26",
			"27",
			"28",
			"29",
			"30",
			"31",
			"32",
			"33",
			"34",
			"35",
			"36",
			"37",
			"38",
			"39",
			"40",
			"41",
			"42",
			"43",
			"44",
			"45",
			"46",
			"47",
			"48",
			"49",
			"50",
			"51",
			"62",
			"64",
			"80",
			"81",
			"82",
			"83",
			"84",
			"85",
			"86",
			"87",
			"88",
			"89",
			"90",
			"91",
			"92",
			"93",
			"94",
			"95",
			"96",
			"97",
			"98",
			"99",
		];

		function p(e) {
			const a = e.trim().replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, ""),
				r = [],
				t = u(a);
			if (!t) {
				let e,
					t,
					n =
						-1 ===
							(t = (e = a
								.trim()
								.replace(/[\r\n\t\u00A0\u200B-\u200D\uFEFF]/g, "")).lastIndexOf(
								"6304",
							)) || e.length < t + 8
							? null
							: e.substring(t + 4, t + 8).toUpperCase();
				r.push(`Invalid CRC: ${n || "not found"}`);
			}
			const { fields: i, errors: c } = (function e(a, r) {
				let t = [],
					i = [],
					c = 0;
				for (
					;
					c < a.length &&
					(r || !(t.length > 0) || "63" !== t[t.length - 1].id) &&
					!(c + 2 > a.length);
				) {
					const d = a.substring(c, c + 2);
					if (!/^\d{2}$/.test(d)) {
						if (!r) break;
						i.push(`Invalid field ID '${d}' at position ${c}`);
						break;
					}
					if ((c += 2) + 2 > a.length) {
						i.push(
							`Incomplete field at position ${c - 2}: missing length for ID ${d}`,
						);
						break;
					}
					const m = a.substring(c, c + 2),
						u = parseInt(m, 10);
					if (((c += 2), isNaN(u))) {
						i.push(`Invalid length '${m}' for field ID ${d}`);
						break;
					}
					if (c + u > a.length) {
						i.push(
							`Incomplete field: expected ${u} characters for ID ${d}, but only ${a.length - c} remaining`,
						);
						break;
					}
					const x = a.substring(c, c + u),
						p = `${d}${m}${x}`;
					c += u;
					const g = {
						id: d,
						name: ((e, a) => {
							if (a) {
								if (parseInt(a) >= 26 && 51 >= parseInt(a))
									return o[e] || `Unknown Field (${e})`;
								if ("62" === a) return s[e] || `Unknown Field (${e})`;
								if ("64" === a) return l[e] || `Unknown Field (${e})`;
							}
							return n[e] || `Unknown Field (${e})`;
						})(d, r),
						length: u,
						value: x,
						rawValue: p,
					};
					if (h.includes(d) && x.length > 0) {
						const a = e(x, d);
						a.fields.length > 0 && (g.children = a.fields), i.push(...a.errors);
					}
					t.push(g);
				}
				return {
					fields: t,
					errors: i,
				};
			})(a);
			r.push(...c);
			const d = i.some((e) => "00" === e.id && "01" === e.value),
				m = i.some((e) => ["26", "27", "28", "29", "30", "31"].includes(e.id)),
				x = i.some((e) => "52" === e.id),
				p = i.some((e) => "53" === e.id),
				g = i.some((e) => "58" === e.id),
				b = i.some((e) => "59" === e.id),
				f = i.some((e) => "60" === e.id),
				y = i.some((e) => "63" === e.id);
			d || r.push("Missing or invalid Payload Format Indicator (ID 00)"),
				m || r.push("Missing Merchant Account Information (ID 26-31)"),
				x || r.push("Missing Merchant Category Code (ID 52)"),
				p || r.push("Missing Transaction Currency (ID 53)"),
				g || r.push("Missing Country Code (ID 58)"),
				b || r.push("Missing Merchant Name (ID 59)"),
				f || r.push("Missing Merchant City (ID 60)"),
				y || r.push("Missing CRC (ID 63)");
			const v = d && m && x && p && g && b && f && y,
				k = t && 0 === c.length && v,
				j = ((e) => {
					const a = {
						type: "static",
						oneTime: !1,
					};
					for (const r of e)
						switch (r.id) {
							case "01":
								(a.type = "12" === r.value ? "dynamic" : "static"),
									(a.oneTime = "12" === r.value);
								break;
							case "52":
								a.merchantCategoryCode = r.value;
								break;
							case "53":
								a.transactionCurrency = parseInt(r.value, 10);
								break;
							case "54":
								a.amount = r.value;
								break;
							case "58":
								a.countryCode = r.value;
								break;
							case "59":
								a.merchantName = r.value;
								break;
							case "60":
								a.merchantCity = r.value;
								break;
							case "63":
								a.crc = r.value;
								break;
							case "26":
							case "27":
								if (r.children)
									for (const e of r.children)
										"00" === e.id && e.value.toLowerCase(),
											"01" === e.id && (a.key = e.value),
											"02" === e.id && (a.additionalInfo = e.value),
											("25" === e.id ||
												"21" === e.id ||
												"22" === e.id ||
												"23" === e.id ||
												"24" === e.id) &&
												(a.url = e.value);
								break;
							case "62":
								if (r.children)
									for (const e of r.children)
										"05" === e.id && (a.txid = e.value);
						}
					return a;
				})(i);
			return (
				(j.isValid = k),
				{
					fields: i,
					pixInfo: j,
					raw: a,
					isValid: k,
					errors: r,
				}
			);
		}
		const g = [
			(e) => `https://corsproxy.io/?${encodeURIComponent(e)}`,
			(e) => `https://api.allorigins.win/raw?url=${encodeURIComponent(e)}`,
		];
		async function b(e) {
			const a = await fetch(e, {
					method: "GET",
					headers: {
						Accept: "application/jose, application/json, text/plain, */*",
					},
				}),
				r = await a.text();
			return {
				ok: a.ok,
				status: a.status,
				body: r,
			};
		}

		function f(e) {
			const { ok: a, status: r, body: t } = e;
			if (t.includes("<!DOCTYPE") || t.includes("<html")) return null;
			if (!a) {
				const e = ((e) => {
					try {
						const a = JSON.parse(e);
						if (a.type || a.title || a.status) return a;
						return null;
					} catch {
						return null;
					}
				})(t);
				return e
					? {
							success: !1,
							type: "error",
							raw: t,
							error: e.title || `HTTP ${r}`,
							apiError: e,
						}
					: null;
			}
			if (t.includes(".") && 3 === t.split(".").length) {
				const e = ((e) => {
					try {
						const a = e.split(".");
						if (3 !== a.length) return null;
						const r = a[1],
							t = ((e) => {
								let a = e.replace(/-/g, "+").replace(/_/g, "/");
								for (; a.length % 4; ) a += "=";
								return atob(a);
							})(r);
						return JSON.parse(t);
					} catch {
						return null;
					}
				})(t);
				if (e)
					return {
						success: !0,
						type: "jwt",
						raw: t,
						payload: e,
					};
			}
			try {
				const e = JSON.parse(t);
				return {
					success: !0,
					type: "json",
					raw: t,
					payload: e,
				};
			} catch {}
			const n = ((e) => {
				try {
					const a = atob(e);
					if (a && /^[\x20-\x7E\s]*$/.test(a)) return a;
					return null;
				} catch {
					return null;
				}
			})(t);
			if (n)
				try {
					const e = JSON.parse(n);
					return {
						success: !0,
						type: "base64",
						raw: t,
						decoded: n,
						payload: e,
					};
				} catch {
					return {
						success: !0,
						type: "base64",
						raw: t,
						decoded: n,
					};
				}
			return {
				success: !0,
				type: "raw",
				raw: t,
			};
		}
		async function y(e) {
			let a = e;
			for (const r of (e.startsWith("http://") ||
				e.startsWith("https://") ||
				(a = `https://${e}`),
			g)) {
				const e = r(a);
				try {
					const a = await b(e),
						r = f(a);
					if (r) return r;
				} catch (a) {
					console.log(`Proxy failed: ${e}`, a);
				}
			}
			try {
				const e = await b(a),
					r = f(e);
				if (r) return r;
			} catch (e) {
				console.log("Direct fetch also failed:", e);
			}
			return {
				success: !1,
				type: "error",
				error:
					"Nao foi possivel buscar a URL. Todos os metodos falharam (proxies CORS e fetch direto).",
			};
		}

		function v({ field: e, parentId: t, depth: n = 0 }) {
			var o, s;
			const [l, m] = (0, r.useState)(!0),
				u = e.children && e.children.length > 0,
				x =
					((o = e.id),
					(s = e.value),
					"53" === o
						? i[s] || s
						: "58" === o
							? c[s] || s
							: "01" === o
								? d[s] || s
								: "54" === o
									? `R$ ${parseFloat(s).toFixed(2)}`
									: s);
			return (0, a.jsxs)("div", {
				className:
					"border-l-2 border-kobana-100 dark:border-[#333333] pl-3 ml-1",
				children: [
					(0, a.jsxs)("div", {
						className: `flex items-start gap-2 py-2 px-3 rounded-lg transition-colors ${u ? "cursor-pointer hover:bg-kobana-50 dark:hover:bg-[#1a1a1a]" : ""}`,
						onClick: () => u && m(!l),
						children: [
							u &&
								(0, a.jsx)("span", {
									className:
										"text-kobana-500 dark:text-lime-accent mt-0.5 font-mono text-sm",
									children: l ? "[-]" : "[+]",
								}),
							(0, a.jsxs)("div", {
								className: "flex-1 min-w-0",
								children: [
									(0, a.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											(0, a.jsxs)("span", {
												className:
													"inline-flex items-center px-2 py-0.5 rounded bg-kobana-100 dark:bg-lime-accent/20 text-kobana-700 dark:text-lime-accent font-mono text-xs font-semibold",
												children: ["ID: ", e.id],
											}),
											(0, a.jsxs)("span", {
												className:
													"inline-flex items-center px-2 py-0.5 rounded bg-gray-100 dark:bg-[#222222] text-gray-600 dark:text-gray-400 font-mono text-xs",
												children: ["Len: ", e.length],
											}),
											(0, a.jsx)("span", {
												className:
													"text-sm font-medium text-gray-700 dark:text-gray-200",
												children: e.name,
											}),
										],
									}),
									!u &&
										(0, a.jsx)("div", {
											className: "mt-1.5",
											children: (0, a.jsx)("code", {
												className:
													"block p-2 bg-gray-50 dark:bg-[#0a0a0a] rounded text-sm text-gray-800 dark:text-gray-100 break-all font-mono",
												children: x,
											}),
										}),
								],
							}),
						],
					}),
					u &&
						l &&
						(0, a.jsx)("div", {
							className: "mt-1",
							children: e.children.map((r, t) =>
								(0, a.jsx)(
									v,
									{
										field: r,
										parentId: e.id,
										depth: n + 1,
									},
									`${r.id}-${t}`,
								),
							),
						}),
				],
			});
		}

		function k({ fields: e }) {
			return 0 === e.length
				? (0, a.jsx)("div", {
						className: "text-center text-gray-500 dark:text-gray-400 py-8",
						children: "Nenhum campo decodificado",
					})
				: (0, a.jsx)("div", {
						className: "space-y-1",
						children: e.map((e, r) =>
							(0, a.jsx)(
								v,
								{
									field: e,
								},
								`${e.id}-${r}`,
							),
						),
					});
		}

		function j({ text: e, className: t = "" }) {
			const [n, o] = (0, r.useState)(!1),
				s = (0, r.useCallback)(async () => {
					try {
						await navigator.clipboard.writeText(e),
							o(!0),
							setTimeout(() => o(!1), 2e3);
					} catch (e) {
						console.error("Failed to copy:", e);
					}
				}, [e]);
			return (0, a.jsx)("button", {
				onClick: s,
				className: `p-1.5 rounded-md transition-colors cursor-pointer ${n ? "bg-green-500/20 text-green-400" : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-gray-200"} ${t}`,
				title: n ? "Copiado!" : "Copiar",
				children: n
					? (0, a.jsx)("svg", {
							className: "w-4 h-4",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: (0, a.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M5 13l4 4L19 7",
							}),
						})
					: (0, a.jsx)("svg", {
							className: "w-4 h-4",
							fill: "none",
							stroke: "currentColor",
							viewBox: "0 0 24 24",
							children: (0, a.jsx)("path", {
								strokeLinecap: "round",
								strokeLinejoin: "round",
								strokeWidth: 2,
								d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3",
							}),
						}),
			});
		}

		function N({ text: e }) {
			const [t, n] = (0, r.useState)(!1),
				o = (0, r.useCallback)(async () => {
					try {
						await navigator.clipboard.writeText(e),
							n(!0),
							setTimeout(() => n(!1), 1500);
					} catch (e) {
						console.error("Failed to copy:", e);
					}
				}, [e]);
			return e && "-" !== e
				? (0, a.jsx)("button", {
						onClick: o,
						className: `ml-1.5 p-0.5 rounded transition-colors cursor-pointer ${t ? "text-green-500 dark:text-green-400" : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"}`,
						title: t ? "Copiado!" : "Copiar",
						children: t
							? (0, a.jsx)("svg", {
									className: "w-3.5 h-3.5",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: (0, a.jsx)("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 2,
										d: "M5 13l4 4L19 7",
									}),
								})
							: (0, a.jsx)("svg", {
									className: "w-3.5 h-3.5",
									fill: "none",
									stroke: "currentColor",
									viewBox: "0 0 24 24",
									children: (0, a.jsx)("path", {
										strokeLinecap: "round",
										strokeLinejoin: "round",
										strokeWidth: 2,
										d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3",
									}),
								}),
					})
				: null;
		}

		function C({ pixInfo: e, dynamicPayload: t }) {
			const [n, o] = (0, r.useState)("table"),
				[s, l] = (0, r.useState)("static");
			(0, r.useEffect)(() => {
				t ? l("dynamic") : l("static");
			}, [t]);
			const i = e => {
                if (!e) return "-";
                try {
                    return new Date(e).toLocaleString("pt-BR", {
                        timeZone: "UTC"
                    })
                } catch {
                    return e
                }
            },
            c = e => e ? parseFloat(e).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            }) : "-",
            d = {
                type: e.type,
                merchantCategoryCode: e.merchantCategoryCode || null,
                transactionCurrency: e.transactionCurrency || null,
                countryCode: e.countryCode || null,
                merchantName: e.merchantName || null,
                merchantCity: e.merchantCity || null,
                transactionAmount: e.amount ? parseFloat(e.amount) : null,
                oneTime: e.oneTime ? ? !1,
                url: e.url || null
            },
            m = [{
                label: "Tipo",
                value: "dynamic" === e.type ? "Dinâmico" : "Estático"
            }, {
                label: "Código de Categoria do Comerciante",
                value: e.merchantCategoryCode || "-"
            }, {
                label: "Moeda da Transação",
                value: e.transactionCurrency ? .toString() || "-"
            }, {
                label: "Código do País",
                value: e.countryCode || "-"
            }, {
                label: "Nome do Beneficiário",
                value: e.merchantName || "-"
            }, {
                label: "Cidade do Beneficiário",
                value: e.merchantCity || "-"
            }, {
                label: "Valor da Transação",
                value: e.amount ? c(e.amount) : "-"
            }, {
                label: "Uso Único",
                value: e.oneTime ? "Sim" : "Não"
            }, ...e.key ? [{
                label: "Chave PIX",
                value: e.key
            }] : [], ...e.txid ? [{
                label: "TXID",
                value: e.txid
            }] : [], {
                label: "URL",
                value: e.url || "-",
                isUrl: !!e.url
            }],
            u = (() => {
                if (!t) return [];
                const e = [];
                return t.calendario && (t.calendario.criacao && e.push({
                    label: "Criação",
                    value: i(t.calendario.criacao)
                }), t.calendario.apresentacao && e.push({
                    label: "Apresentação",
                    value: i(t.calendario.apresentacao)
                }), void 0 !== t.calendario.expiracao && e.push({
                    label: "Expiração",
                    value: `${t.calendario.expiracao} segundos`
                }), t.calendario.dataDeVencimento && e.push({
                    label: "Vencimento",
                    value: (e => {
                        if (!e) return "-";
                        try {
                            if (/^\d{4}-\d{2}-\d{2}$/.test(e)) {
                                const [a, r, t] = e.split("-").map(Number);
                                return `${t.toString().padStart(2,"0")}/${r.toString().padStart(2,"0")}/${a}`
                            }
                            return new Date(e).toLocaleDateString("pt-BR", {
                                timeZone: "UTC"
                            })
                        } catch {
                            return e
                        }
                    })(t.calendario.dataDeVencimento)
                })), t.valor && (t.valor.original && e.push({
                    label: "Valor Original",
                    value: c(t.valor.original)
                }), t.valor.abatimento && e.push({
                    label: "Valor do Abatimento",
                    value: c(t.valor.abatimento)
                }), t.valor.desconto && e.push({
                    label: "Desconto",
                    value: `${t.valor.desconto.valorPerc}%`
                }), t.valor.final && e.push({
                    label: "Valor Final",
                    value: c(t.valor.final)
                }), t.valor.multa && e.push({
                    label: "Multa",
                    value: `${t.valor.multa.valorPerc}%`
                }), t.valor.juros && e.push({
                    label: "Juros",
                    value: `${t.valor.juros.valorPerc}%`
                })), t.devedor && (t.devedor.nome && e.push({
                    label: "Nome do Devedor",
                    value: t.devedor.nome
                }), (t.devedor.cpf || t.devedor.cnpj) && e.push({
                    label: "CPF/CNPJ do Devedor",
                    value: (e => {
                        if (!e) return "-";
                        const a = e.replace(/\D/g, "");
                        return 11 === a.length ? a.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : 14 === a.length ? a.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : e
                    })(t.devedor.cpf || t.devedor.cnpj)
                })), t.txid && e.push({
                    label: "TXID",
                    value: t.txid
                }), t.chave && e.push({
                    label: "Chave PIX",
                    value: t.chave
                }), t.status && e.push({
                    label: "Status",
                    value: t.status
                }), void 0 !== t.revisao && e.push({
                    label: "Revisão",
                    value: t.revisao.toString()
                }), t.loc && (t.loc.location && e.push({
                    label: "Location URL",
                    value: t.loc.location,
                    isUrl: !0
                }), t.loc.tipoCob && e.push({
                    label: "Tipo Cobrança",
                    value: t.loc.tipoCob
                })), t.solicitacaoPagador && e.push({
                    label: "Solicitação ao Pagador",
                    value: t.solicitacaoPagador
                }), t.infoAdicionais && t.infoAdicionais.forEach(a => {
                    e.push({
                        label: a.nome,
                        value: a.valor
                    })
                }), e
            })(),
            x = e => (0, a.jsx)("div", {
                className: "divide-y divide-gray-100 dark:divide-[#222222]",
                children: e.map((e, r) => (0, a.jsxs)("div", {
                    className: "px-4 py-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4",
                    children: [(0, a.jsx)("span", {
                        className: "text-sm font-medium text-gray-500 dark:text-gray-400 sm:w-44 shrink-0",
                        children: e.label
                    }), (0, a.jsxs)("span", {
                        className: "text-sm text-gray-900 dark:text-gray-100 break-all flex items-center",
                        children: [e.isUrl && "-" !== e.value ? (0, a.jsx)("a", {
                            href: e.value.startsWith("http") ? e.value : `https://${e.value}`,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-kobana-600 hover:text-kobana-700 dark:text-lime-accent dark:hover:text-[#c4ee45] underline",
                            children: e.value
                        }) : e.value, (0, a.jsx)(N, {
                            text: e.value
                        })]
                    })]
                }, r))
            });
			return (0, a.jsxs)("div", {
				className:
					"bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] overflow-hidden",
				children: [
					(0, a.jsxs)("div", {
						className:
							"bg-kobana-600 dark:bg-lime-accent px-4 py-3 flex items-center justify-between",
						children: [
							(0, a.jsxs)("h3", {
								className:
									"text-white dark:text-black font-semibold flex items-center gap-2",
								children: [
									(0, a.jsx)("svg", {
										className: "w-5 h-5",
										fill: "none",
										stroke: "currentColor",
										viewBox: "0 0 24 24",
										children: (0, a.jsx)("path", {
											strokeLinecap: "round",
											strokeLinejoin: "round",
											strokeWidth: 2,
											d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
										}),
									}),
									"Informações do PIX",
								],
							}),
							(0, a.jsxs)("div", {
								className:
									"flex rounded-lg border border-kobana-400 dark:border-[#333333] overflow-hidden",
								children: [
									(0, a.jsx)("button", {
										onClick: () => o("table"),
										className: `px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${"table" === n ? "bg-white dark:bg-black text-kobana-600 dark:text-lime-accent" : "bg-transparent text-white dark:text-black hover:bg-kobana-500 dark:hover:bg-[#c4ee45]"}`,
										children: "Tabela",
									}),
									(0, a.jsx)("button", {
										onClick: () => o("json"),
										className: `px-3 py-1 text-xs font-medium border-l border-kobana-400 dark:border-[#333333] transition-colors cursor-pointer ${"json" === n ? "bg-white dark:bg-black text-kobana-600 dark:text-lime-accent" : "bg-transparent text-white dark:text-black hover:bg-kobana-500 dark:hover:bg-[#c4ee45]"}`,
										children: "JSON",
									}),
								],
							}),
						],
					}),
					(0, a.jsx)("div", {
						className: "border-b border-gray-200 dark:border-[#222222]",
						children: (0, a.jsxs)("div", {
							className: "flex",
							children: [
								(0, a.jsx)("button", {
									onClick: () => l("static"),
									className: `flex-1 px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${"static" === s ? "text-kobana-600 dark:text-lime-accent border-b-2 border-kobana-600 dark:border-lime-accent bg-kobana-50 dark:bg-[#1a1a1a]" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]"}`,
									children: "Estático",
								}),
								(0, a.jsxs)("button", {
									onClick: () => l("dynamic"),
									disabled: !t,
									className: `flex-1 px-4 py-2 text-sm font-medium transition-colors ${"dynamic" === s ? "text-kobana-600 dark:text-lime-accent border-b-2 border-kobana-600 dark:border-lime-accent bg-kobana-50 dark:bg-[#1a1a1a] cursor-pointer" : t ? "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer" : "text-gray-300 dark:text-gray-600 cursor-not-allowed"}`,
									children: [
										"Dinâmico",
										!t &&
											(0, a.jsx)("span", {
												className: "ml-1 text-xs",
												children: "(Consultar Location)",
											}),
									],
								}),
							],
						}),
					}),
					(0, a.jsx)("div", {
						className: "max-h-[400px] overflow-auto",
						children:
							"table" === n
								? "static" === s
									? x(m)
									: t
										? u.length > 0
											? x(u)
											: (0, a.jsx)("div", {
													className:
														"p-8 text-center text-gray-400 dark:text-gray-500",
													children: (0, a.jsx)("p", {
														className: "text-sm",
														children: "Nenhuma informação dinâmica disponível",
													}),
												})
										: (0, a.jsx)("div", {
												className:
													"p-8 text-center text-gray-400 dark:text-gray-500",
												children: (0, a.jsx)("p", {
													className: "text-sm",
													children:
														'Clique em "Consultar Location" para carregar o payload dinâmico',
												}),
											})
								: (0, a.jsx)("div", {
										className: "p-4",
										children: (0, a.jsxs)("div", {
											className: "relative",
											children: [
												("static" === s || t) &&
													(0, a.jsx)(j, {
														text:
															"static" === s
																? JSON.stringify(d, null, 2)
																: JSON.stringify(t, null, 2),
														className: "absolute top-2 right-2 z-10",
													}),
												(0, a.jsx)("pre", {
													className:
														"text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-[300px]",
													children:
														"static" === s
															? JSON.stringify(d, null, 2)
															: t
																? JSON.stringify(t, null, 2)
																: '// Clique em "Fetch URL" para carregar o payload dinâmico',
												}),
											],
										}),
									}),
					}),
					(0, a.jsx)("div", {
						className:
							"px-4 py-3 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-[#222222]",
						children: (0, a.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								(0, a.jsx)("span", {
									className:
										"text-sm font-medium text-gray-500 dark:text-gray-400",
									children: "Status:",
								}),
								e.isValid
									? (0, a.jsxs)("span", {
											className:
												"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 dark:bg-lime-accent/20 text-green-700 dark:text-lime-accent text-xs font-medium",
											children: [
												(0, a.jsx)("svg", {
													className: "w-3.5 h-3.5",
													fill: "currentColor",
													viewBox: "0 0 20 20",
													children: (0, a.jsx)("path", {
														fillRule: "evenodd",
														d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
														clipRule: "evenodd",
													}),
												}),
												"Válido",
											],
										})
									: (0, a.jsxs)("span", {
											className:
												"inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium",
											children: [
												(0, a.jsx)("svg", {
													className: "w-3.5 h-3.5",
													fill: "currentColor",
													viewBox: "0 0 20 20",
													children: (0, a.jsx)("path", {
														fillRule: "evenodd",
														d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
														clipRule: "evenodd",
													}),
												}),
												"Inválido",
											],
										}),
							],
						}),
					}),
				],
			});
		}

		function w() {
			const [e, t] = (0, r.useState)(null),
				[n, o] = (0, r.useState)(!1);
			return ((0, r.useEffect)(() => {
				o(!0);
				const e = localStorage.getItem("theme");
				e
					? t(e)
					: t(
							window.matchMedia("(prefers-color-scheme: dark)").matches
								? "dark"
								: "light",
						);
			}, []),
			(0, r.useEffect)(() => {
				if (!n || !e) return;
				const a = document.documentElement;
				localStorage.setItem("theme", e),
					a.classList.toggle("dark", "dark" === e);
			}, [e, n]),
			n && e)
				? (0, a.jsx)("button", {
						onClick: () => {
							t((e) => ("light" === e ? "dark" : "light"));
						},
						className:
							"p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer",
						title:
							"light" === e
								? "Mudar para tema escuro"
								: "Mudar para tema claro",
						children:
							"dark" === e
								? (0, a.jsx)("svg", {
										className: "w-5 h-5 text-yellow-500",
										fill: "currentColor",
										viewBox: "0 0 20 20",
										children: (0, a.jsx)("path", {
											d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z",
										}),
									})
								: (0, a.jsx)("svg", {
										className: "w-5 h-5 text-yellow-500",
										fill: "currentColor",
										viewBox: "0 0 20 20",
										children: (0, a.jsx)("path", {
											fillRule: "evenodd",
											d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z",
											clipRule: "evenodd",
										}),
									}),
					})
				: (0, a.jsx)("button", {
						className:
							"p-2 rounded-lg bg-gray-100 dark:bg-gray-800 cursor-pointer",
						children: (0, a.jsx)("div", {
							className: "w-5 h-5",
						}),
					});
		}
		const S = (e) => {
				if (!e) return;
				const a = parseFloat(e);
				return isNaN(a)
					? e
					: a.toLocaleString("pt-BR", {
							style: "currency",
							currency: "BRL",
						});
			},
			M = (e) => {
				if (!e) return;
				const a = e.replace(/\D/g, "");
				return 11 === a.length
					? a.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
					: 14 === a.length
						? a.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5")
						: e;
			},
			I = (e, a, r) => {
				if (r) {
					if (r)
						try {
							if (/^\d{4}-\d{2}-\d{2}$/.test(r)) {
								const [e, a, t] = r.split("-").map(Number);
								return `${t.toString().padStart(2, "0")}/${a.toString().padStart(2, "0")}/${e}`;
							}
							return new Date(r).toLocaleDateString("pt-BR", {
								timeZone: "UTC",
							});
						} catch {}
					return;
				}
				if (e && a)
					try {
						const r = new Date(e);
						return new Date(r.getTime() + 1e3 * a).toLocaleDateString("pt-BR", {
							timeZone: "UTC",
						});
					} catch {
						return;
					}
			},
			P = "pix-inspector-history",
			L = async (e, a, r = null) => {
				try {
					await fetch(
						"https://webhooks.auto.kobana.com.br/webhook/decodificador-pix/save",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								emv: e,
								static: a.pixInfo,
								dynamic: r,
								decoded: a.fields,
							}),
						},
					);
				} catch {}
			};

		function A() {
			const e = (0, t.useSearchParams)(),
				[n, o] = (0, r.useState)(""),
				[s, l] = (0, r.useState)(null),
				[i, c] = (0, r.useState)("tree"),
				[d, h] = (0, r.useState)(null),
				[g, b] = (0, r.useState)(null),
				[f, v] = (0, r.useState)(!1),
				[N, A] = (0, r.useState)(null),
				[$, R] = (0, r.useState)(null),
				[T, U] = (0, r.useState)(null),
				[D, B] = (0, r.useState)(null),
				[E, V] = (0, r.useState)(!1),
				[z, F] = (0, r.useState)(!1),
				[O, W] = (0, r.useState)([]),
				[H, J] = (0, r.useState)(!1),
				[X, q] = (0, r.useState)(null),
				_ = (0, r.useRef)(!1);
			(0, r.useEffect)(() => {
				try {
					const e = localStorage.getItem(P);
					e && W(JSON.parse(e));
				} catch (e) {
					console.error("Failed to load history:", e);
				}
			}, []);
			const Q = (0, r.useCallback)((e, a, r) => {
				if (!a.pixInfo.isValid) return;
				const t = {
                emv: e,
                beneficiario: a.pixInfo.merchantName || "-",
                expiracao: I(r ? .calendario ? .criacao, r ? .calendario ? .expiracao, r ? .calendario ? .dataDeVencimento),
                valorOriginal: S(r ? .valor ? .original || a.pixInfo.amount),
                devedorNome: r ? .devedor ? .nome,
                devedorCpfCnpj: M(r ? .devedor ? .cpf || r ? .devedor ? .cnpj),
                timestamp: Date.now()
            };
				W((a) => {
					if (a.some((a) => a.emv === e)) return a;
					const r = [t, ...a].slice(0, 10);
					try {
						localStorage.setItem(P, JSON.stringify(r));
					} catch (e) {
						console.error("Failed to save history:", e);
					}
					return r;
				});
			}, []);
			(0, r.useEffect)(() => {
				if (_.current) return;
				const a = e.get("emv");
				if (a) {
					_.current = !0;
					const e = x(a),
						r = p(e);
					o(e),
						l(r),
						A(r.errors.length > 0 ? r.errors.join("\n") : null),
						h(null),
						b(null),
						R(null),
						U(null);
					const t = encodeURIComponent(e);
					B(
						`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${t}`,
					),
						q(e),
						r.pixInfo.isValid && (Q(e, r), L(e, r));
				}
			}, [e, Q]);
			const K = (0, r.useCallback)((e, a) => {
					W((r) => {
						const t = r.findIndex((a) => a.emv === e);
						if (-1 === t) return r;
						const n = [...r];
						n[t] = { ...n[t],
                        expiracao: I(a.calendario ? .criacao, a.calendario ? .expiracao, a.calendario ? .dataDeVencimento) || n[t].expiracao,
                        valorOriginal: S(a.valor ? .original) || n[t].valorOriginal,
                        devedorNome: a.devedor ? .nome || n[t].devedorNome,
                        devedorCpfCnpj: M(a.devedor ? .cpf || a.devedor ? .cnpj) || n[t].devedorCpfCnpj
                    };
						try {
							localStorage.setItem(P, JSON.stringify(n));
						} catch (e) {
							console.error("Failed to update history:", e);
						}
						return n;
					});
				}, []),
				Z = (0, r.useCallback)((e) => {
					o(e.emv), A(null), h(null), b(null), R(null), U(null);
					const a = p(e.emv);
					l(a), q(e.emv), a.errors.length > 0 && A(a.errors.join("\n"));
				}, []),
				G = (0, r.useCallback)(() => {
					W([]), J(!1);
					try {
						localStorage.removeItem(P);
					} catch (e) {
						console.error("Failed to clear history:", e);
					}
				}, []);
			(0, r.useEffect)(() => {
				if (n.trim()) {
					const e = encodeURIComponent(n.trim());
					B(
						`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${e}`,
					);
				} else
					_.current ||
						(B(null), l(null), h(null), b(null), A(null), R(null), U(null));
			}, [n]);
			const Y = (0, r.useCallback)(() => {
					if ((A(null), h(null), b(null), R(null), U(null), !n.trim())) {
						A("Por favor, insira um código PIX"), l(null);
						return;
					}
					try {
						const e = x(n);
						o(e);
						const a = p(e);
						l(a),
							a.errors.length > 0 && A(a.errors.join("\n")),
							q(e),
							a.pixInfo.isValid && (Q(e, a), L(e, a));
					} catch (e) {
						A(e instanceof Error ? e.message : "Erro ao decodificar"), l(null);
					}
				}, [n, Q]),
				ee = (0, r.useCallback)(() => {
					if (!n.trim()) return void A("Por favor, insira um código PIX");
					try {
						const e = x(n.trim());
						o(e), A(null);
						const a = p(e);
						l(a);
					} catch (e) {
						A(e instanceof Error ? e.message : "Erro ao corrigir CRC");
					}
				}, [n]),
				ea = (0, r.useCallback)(async () => {
					if ((R(null), U(null), h(null), b(null), !s))
						return void R("Primeiro decodifique o QR Code");
					const e = ((e) => {
						for (const a of e)
							if (parseInt(a.id) >= 26 && 51 >= parseInt(a.id) && a.children)
								for (const e of a.children) {
									if ("25" === e.id || e.value.startsWith("http")) {
										const a = e.value;
										return a.startsWith("http") ? a : `https://${a}`;
									}
									if (
										e.value.includes("/") &&
										e.value.includes(".") &&
										!e.value.toLowerCase().startsWith("br.gov")
									)
										return e.value.startsWith("http")
											? e.value
											: `https://${e.value}`;
								}
						return null;
					})(s.fields);
					if (!e)
						return void R(
							"URL nao encontrada no QR Code. Este pode ser um PIX estatico.",
						);
					v(!0);
					try {
						const a = await y(e);
						if (!a.success) {
							R(a.error || "Erro ao buscar URL"), a.apiError && U(a.apiError);
							return;
						}
						if ((a.raw && b(a.raw), a.payload))
							h(a.payload), K(n, a.payload), L(n, s, a.payload);
						else if (a.decoded)
							try {
								const e = JSON.parse(a.decoded);
								h(e), K(n, e), L(n, s, e);
							} catch {
								R("Nao foi possivel interpretar o payload");
							}
					} catch (e) {
						R(e instanceof Error ? e.message : "Erro ao buscar URL");
					} finally {
						v(!1);
					}
				}, [s, n, K]),
				er = (0, r.useCallback)(() => {
					o(""), l(null), h(null), b(null), A(null), R(null), U(null), q(null);
				}, []),
				et = (0, r.useCallback)(async () => {
					if (n.trim())
						try {
							await navigator.clipboard.writeText(n),
								V(!0),
								setTimeout(() => V(!1), 2e3);
						} catch (e) {
							console.error("Failed to copy:", e);
						}
				}, [n]),
				en = (0, r.useCallback)(async () => {
					try {
						const e = await navigator.clipboard.readText();
						if (!e.trim()) return;
						F(!0),
							setTimeout(() => F(!1), 2e3),
							A(null),
							h(null),
							b(null),
							R(null),
							U(null);
						const a = x(e);
						o(a);
						const r = p(a);
						l(r),
							r.errors.length > 0 && A(r.errors.join("\n")),
							q(a),
							r.pixInfo.isValid && (Q(a, r), L(a, r));
					} catch {
						A("Nao foi possivel acessar a area de transferencia");
					}
				}, [Q]),
				eo = (0, r.useCallback)(
					(e) => {
						e.preventDefault();
						const a = e.clipboardData.getData("text");
						if (!a.trim()) return;
						A(null), h(null), b(null), R(null), U(null);
						const r = x(a);
						o(r);
						const t = p(r);
						l(t),
							t.errors.length > 0 && A(t.errors.join("\n")),
							q(r),
							t.pixInfo.isValid && (Q(r, t), L(r, t));
					},
					[Q],
				);
			return (0, a.jsxs)("div", {
            className: "min-h-screen bg-gray-50 dark:bg-black transition-colors",
            children: [(0, a.jsx)("div", {
                className: "bg-gray-100 dark:bg-[#111111] border-b border-gray-200 dark:border-[#222222]",
                children: (0, a.jsx)("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: (0, a.jsxs)("div", {
                        className: "flex items-center justify-end h-10 gap-6",
                        children: [(0, a.jsx)("a", {
                            href: "https://www.kobana.com.br",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-lime-accent transition-colors",
                            children: "Site"
                        }), (0, a.jsx)("a", {
                            href: "https://status.kobana.com.br",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-lime-accent transition-colors",
                            children: "Server Status"
                        }), (0, a.jsx)("a", {
                            href: "https://developers.kobana.com.br",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-lime-accent transition-colors",
                            children: "Documentação da API"
                        }), (0, a.jsx)("a", {
                            href: "https://ajuda.kobana.com.br",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-lime-accent transition-colors",
                            children: "Central de Ajuda"
                        }), (0, a.jsx)("a", {
                            href: "https://app.kobana.com.br/users/sign_in",
                            target: "_blank",
                            rel: "noopener noreferrer",
                            className: "text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-lime-accent transition-colors",
                            children: "Entrar"
                        })]
                    })
                })
            }), (0, a.jsx)("header", {
                className: "bg-white dark:bg-black border-b border-gray-200 dark:border-[#222222]",
                children: (0, a.jsx)("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                    children: (0, a.jsxs)("div", {
                        className: "flex items-center justify-between h-16",
                        children: [(0, a.jsxs)("div", {
                            className: "flex items-center gap-3",
                            children: [(0, a.jsx)("a", {
                                href: "https://www.kobana.com.br",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                children: (0, a.jsx)("img", {
                                    src: "/kobana-logo.png",
                                    alt: "Kobana",
                                    className: "w-[180px] dark:invert-0 invert"
                                })
                            }), (0, a.jsx)("div", {
                                className: "border-l border-gray-300 dark:border-[#333333] pl-3 ml-1",
                                children: (0, a.jsx)("h1", {
                                    className: "text-lg font-bold text-gray-900 dark:text-lime-accent",
                                    children: "Decodificador Pix"
                                })
                            })]
                        }), (0, a.jsx)(w, {})]
                    })
                })
            }), (0, a.jsxs)("main", {
                className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8",
                children: [(0, a.jsxs)("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
                    children: [(0, a.jsxs)("div", {
                        className: "lg:col-span-2 space-y-4",
                        children: [(0, a.jsxs)("div", {
                            className: "bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] overflow-hidden",
                            children: [(0, a.jsx)("div", {
                                className: "bg-gray-50 dark:bg-[#0a0a0a] px-4 py-3 border-b border-gray-200 dark:border-[#222222]",
                                children: (0, a.jsx)("h2", {
                                    className: "text-sm font-semibold text-gray-700 dark:text-lime-accent uppercase tracking-wide",
                                    children: "Código PIX (EMV)"
                                })
                            }), (0, a.jsxs)("div", {
                                className: "p-4",
                                children: [(0, a.jsx)("textarea", {
                                    value: n,
                                    onChange: e => o(e.target.value),
                                    onPaste: eo,
                                    placeholder: "Cole aqui o código PIX copiado do QR Code...  Exemplo: 00020101021226900014br.gov.bcb.pix2568pix.santander.com.br/qr/v2/cobv/...",
                                    rows: 4,
                                    className: "w-full p-3 border border-gray-200 dark:border-[#333333] rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-kobana-500 dark:focus:ring-lime-accent focus:border-kobana-500 dark:focus:border-lime-accent outline-none bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                                }), (0, a.jsxs)("div", {
                                    className: "flex flex-wrap gap-2 mt-3",
                                    children: [(0, a.jsxs)("button", {
                                        onClick: en,
                                        className: `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${z?"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400":"text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 dark:hover:bg-[#333333]"}`,
                                        children: [z ? (0, a.jsx)("svg", {
                                            className: "w-3.5 h-3.5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: (0, a.jsx)("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M5 13l4 4L19 7"
                                            })
                                        }) : (0, a.jsx)("svg", {
                                            className: "w-3.5 h-3.5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: (0, a.jsx)("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                            })
                                        }), z ? "Colado" : "Colar"]
                                    }), (0, a.jsxs)("button", {
                                        onClick: et,
                                        className: `inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${E?"bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400":"text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 dark:hover:bg-[#333333]"}`,
                                        children: [E ? (0, a.jsx)("svg", {
                                            className: "w-3.5 h-3.5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: (0, a.jsx)("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M5 13l4 4L19 7"
                                            })
                                        }) : (0, a.jsx)("svg", {
                                            className: "w-3.5 h-3.5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: (0, a.jsx)("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                            })
                                        }), E ? "Copiado" : "Copiar"]
                                    }), (0, a.jsxs)("button", {
                                        onClick: er,
                                        className: "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 dark:hover:bg-[#333333] rounded-md transition-colors cursor-pointer",
                                        children: [(0, a.jsx)("svg", {
                                            className: "w-3.5 h-3.5",
                                            fill: "none",
                                            stroke: "currentColor",
                                            viewBox: "0 0 24 24",
                                            children: (0, a.jsx)("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            })
                                        }), "Limpar"]
                                    })]
                                })]
                            })]
                        }), (0, a.jsxs)("div", {
                            className: "grid grid-cols-3 gap-3",
                            children: [(0, a.jsxs)("button", {
                                onClick: Y,
                                disabled: !n.trim() || n === X,
                                className: "flex items-center justify-center gap-2 px-4 py-3 bg-kobana-600 hover:bg-kobana-700 dark:bg-lime-accent dark:hover:bg-[#c4ee45] text-white dark:text-black font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                children: [(0, a.jsx)("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: (0, a.jsx)("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                    })
                                }), "Decodificar"]
                            }), (0, a.jsxs)("button", {
                                onClick: ee,
                                disabled: !n.trim() || u(n.trim()),
                                className: "flex items-center justify-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 dark:bg-[#333333] dark:hover:bg-[#444444] text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                children: [(0, a.jsx)("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: (0, a.jsx)("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    })
                                }), "Corrigir CRC"]
                            }), (0, a.jsxs)("button", {
                                onClick: ea,
                                disabled: !s || f || !!d || !s ? .pixInfo ? .url,
                                className: "flex items-center justify-center gap-2 px-4 py-3 bg-kobana-700 hover:bg-kobana-800 dark:bg-[#333333] dark:hover:bg-[#444444] text-white font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                                children: [f ? (0, a.jsxs)("svg", {
                                    className: "w-5 h-5 animate-spin",
                                    fill: "none",
                                    viewBox: "0 0 24 24",
                                    children: [(0, a.jsx)("circle", {
                                        className: "opacity-25",
                                        cx: "12",
                                        cy: "12",
                                        r: "10",
                                        stroke: "currentColor",
                                        strokeWidth: "4"
                                    }), (0, a.jsx)("path", {
                                        className: "opacity-75",
                                        fill: "currentColor",
                                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    })]
                                }) : (0, a.jsx)("svg", {
                                    className: "w-5 h-5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: (0, a.jsx)("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 2,
                                        d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    })
                                }), "Consultar Location"]
                            })]
                        }), N && (0, a.jsx)("div", {
                            className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4",
                            children: (0, a.jsxs)("div", {
                                className: "flex items-start gap-3",
                                children: [(0, a.jsx)("svg", {
                                    className: "w-5 h-5 text-red-500 mt-0.5 shrink-0",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: (0, a.jsx)("path", {
                                        fillRule: "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                        clipRule: "evenodd"
                                    })
                                }), (0, a.jsx)("div", {
                                    className: "text-sm text-red-700 dark:text-red-400 whitespace-pre-wrap",
                                    children: N
                                })]
                            })
                        }), $ && (0, a.jsx)("div", {
                            className: "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4",
                            children: (0, a.jsxs)("div", {
                                className: "flex items-start gap-3",
                                children: [(0, a.jsx)("svg", {
                                    className: "w-5 h-5 text-amber-500 mt-0.5 shrink-0",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20",
                                    children: (0, a.jsx)("path", {
                                        fillRule: "evenodd",
                                        d: "M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z",
                                        clipRule: "evenodd"
                                    })
                                }), (0, a.jsxs)("div", {
                                    className: "flex-1",
                                    children: [(0, a.jsx)("div", {
                                        className: "text-sm text-amber-700 dark:text-amber-400",
                                        children: $
                                    }), T && (0, a.jsxs)("div", {
                                        className: "mt-3 p-3 bg-amber-100 dark:bg-amber-900/30 rounded-md font-mono text-xs",
                                        children: [(0, a.jsx)("div", {
                                            className: "text-amber-800 dark:text-amber-300 font-semibold mb-2",
                                            children: "Resposta da API:"
                                        }), (0, a.jsxs)("div", {
                                            className: "space-y-1 text-amber-700 dark:text-amber-400",
                                            children: [T.status && (0, a.jsxs)("div", {
                                                children: [(0, a.jsx)("span", {
                                                    className: "text-amber-600 dark:text-amber-500",
                                                    children: "status:"
                                                }), " ", T.status]
                                            }), T.title && (0, a.jsxs)("div", {
                                                children: [(0, a.jsx)("span", {
                                                    className: "text-amber-600 dark:text-amber-500",
                                                    children: "title:"
                                                }), " ", T.title]
                                            }), T.type && (0, a.jsxs)("div", {
                                                children: [(0, a.jsx)("span", {
                                                    className: "text-amber-600 dark:text-amber-500",
                                                    children: "type:"
                                                }), " ", T.type]
                                            }), T.detail && (0, a.jsxs)("div", {
                                                children: [(0, a.jsx)("span", {
                                                    className: "text-amber-600 dark:text-amber-500",
                                                    children: "detail:"
                                                }), " ", T.detail]
                                            })]
                                        })]
                                    })]
                                })]
                            })
                        })]
                    }), (0, a.jsx)("div", {
                        className: "lg:col-span-1",
                        children: (0, a.jsxs)("div", {
                            className: "bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] overflow-hidden h-full",
                            children: [(0, a.jsx)("div", {
                                className: "bg-gray-50 dark:bg-[#0a0a0a] px-4 py-3 border-b border-gray-200 dark:border-[#222222]",
                                children: (0, a.jsx)("h2", {
                                    className: "text-sm font-semibold text-gray-700 dark:text-lime-accent uppercase tracking-wide",
                                    children: "QR Code"
                                })
                            }), (0, a.jsx)("div", {
                                className: "p-4 flex items-center justify-center",
                                children: D && s ? .pixInfo ? .isValid ? (0, a.jsxs)("div", {
                                    className: "text-center",
                                    children: [(0, a.jsx)("img", {
                                        src: D,
                                        alt: "QR Code PIX",
                                        className: "mx-auto rounded-lg border border-gray-200 dark:border-[#333333] bg-white",
                                        width: 150,
                                        height: 150
                                    }), (0, a.jsx)("p", {
                                        className: "text-xs text-gray-500 dark:text-gray-400 mt-2",
                                        children: "QR Code gerado a partir do código"
                                    })]
                                }) : (0, a.jsxs)("div", {
                                    className: "text-center text-gray-400 dark:text-gray-500 py-4",
                                    children: [(0, a.jsx)("svg", {
                                        className: "w-12 h-12 mx-auto mb-2",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: (0, a.jsx)("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 1.5,
                                            d: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                        })
                                    }), (0, a.jsx)("p", {
                                        className: "text-xs",
                                        children: "Cole um código PIX para visualizar o QR Code"
                                    })]
                                })
                            })]
                        })
                    })]
                }), (0, a.jsxs)("div", {
                    className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
                    children: [(0, a.jsx)("div", {
                        className: "space-y-4",
                        children: s ? (0, a.jsx)(C, {
                            pixInfo: s.pixInfo,
                            dynamicPayload: d
                        }) : (0, a.jsxs)("div", {
                            className: "bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] overflow-hidden",
                            children: [(0, a.jsx)("div", {
                                className: "bg-kobana-600 dark:bg-lime-accent px-4 py-3",
                                children: (0, a.jsxs)("h3", {
                                    className: "text-white dark:text-black font-semibold flex items-center gap-2",
                                    children: [(0, a.jsx)("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: (0, a.jsx)("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 2,
                                            d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        })
                                    }), "Informações do PIX"]
                                })
                            }), (0, a.jsxs)("div", {
                                className: "p-8 text-center text-gray-400 dark:text-gray-500",
                                children: [(0, a.jsx)("svg", {
                                    className: "w-12 h-12 mx-auto mb-3",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24",
                                    children: (0, a.jsx)("path", {
                                        strokeLinecap: "round",
                                        strokeLinejoin: "round",
                                        strokeWidth: 1.5,
                                        d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    })
                                }), (0, a.jsx)("p", {
                                    className: "text-sm",
                                    children: "Decodifique um código PIX para ver as informações"
                                })]
                            })]
                        })
                    }), (0, a.jsx)("div", {
                        className: "space-y-4",
                        children: (0, a.jsxs)("div", {
                            className: "bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] overflow-hidden",
                            children: [(0, a.jsxs)("div", {
                                className: "bg-gray-50 dark:bg-[#0a0a0a] px-4 py-3 border-b border-gray-200 dark:border-[#222222] flex items-center justify-between",
                                children: [(0, a.jsx)("h2", {
                                    className: "text-sm font-semibold text-gray-700 dark:text-lime-accent uppercase tracking-wide",
                                    children: "Estrutura Decodificada"
                                }), (0, a.jsxs)("div", {
                                    className: "flex rounded-lg border border-gray-200 dark:border-[#333333] overflow-hidden",
                                    children: [(0, a.jsx)("button", {
                                        onClick: () => c("tree"),
                                        disabled: !s,
                                        className: `px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${"tree"===i?"bg-kobana-600 dark:bg-lime-accent text-white dark:text-black":"bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222222]"}`,
                                        children: "Árvore"
                                    }), (0, a.jsx)("button", {
                                        onClick: () => c("json"),
                                        disabled: !s,
                                        className: `px-3 py-1.5 text-xs font-medium border-l border-gray-200 dark:border-[#333333] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${"json"===i?"bg-kobana-600 dark:bg-lime-accent text-white dark:text-black":"bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222222]"}`,
                                        children: "JSON"
                                    }), (0, a.jsx)("button", {
                                        onClick: () => c("raw"),
                                        disabled: !s,
                                        className: `px-3 py-1.5 text-xs font-medium border-l border-gray-200 dark:border-[#333333] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${"raw"===i?"bg-kobana-600 dark:bg-lime-accent text-white dark:text-black":"bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222222]"}`,
                                        children: "Raw"
                                    })]
                                })]
                            }), (0, a.jsx)("div", {
                                className: "p-4 max-h-[500px] overflow-auto",
                                children: s ? "tree" === i ? (0, a.jsx)(k, {
                                    fields: s.fields
                                }) : "json" === i ? (0, a.jsxs)("div", {
                                    className: "relative",
                                    children: [(0, a.jsx)(j, {
                                        text: JSON.stringify(s.fields, null, 2),
                                        className: "absolute top-2 right-2 z-10"
                                    }), (0, a.jsx)("pre", {
                                        className: "text-xs bg-gray-900 dark:bg-[#0a0a0a] text-green-400 dark:text-lime-accent p-4 rounded-lg overflow-auto",
                                        children: JSON.stringify(s.fields, null, 2)
                                    })]
                                }) : (0, a.jsxs)("div", {
                                    className: "space-y-3",
                                    children: [(0, a.jsxs)("div", {
                                        children: [(0, a.jsx)("h4", {
                                            className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2",
                                            children: "Payload Original"
                                        }), (0, a.jsx)("code", {
                                            className: "block p-3 bg-gray-100 dark:bg-[#0a0a0a] rounded-lg text-xs break-all font-mono text-gray-900 dark:text-gray-100",
                                            children: s.raw
                                        })]
                                    }), (0, a.jsxs)("div", {
                                        children: [(0, a.jsx)("h4", {
                                            className: "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2",
                                            children: "CRC Info"
                                        }), (0, a.jsxs)("div", {
                                            className: "p-3 bg-gray-100 dark:bg-[#0a0a0a] rounded-lg text-xs font-mono space-y-1 text-gray-900 dark:text-gray-100",
                                            children: [(0, a.jsxs)("div", {
                                                children: ["CRC Encontrado: ", s.pixInfo.crc || "N/A"]
                                            }), (0, a.jsxs)("div", {
                                                children: ["CRC Calculado: ", m(s.raw.substring(0, s.raw.lastIndexOf("6304") + 4))]
                                            }), (0, a.jsxs)("div", {
                                                children: ["Válido: ", u(s.raw) ? "Sim" : "Não"]
                                            })]
                                        })]
                                    })]
                                }) : (0, a.jsxs)("div", {
                                    className: "text-center text-gray-500 dark:text-gray-400 py-12",
                                    children: [(0, a.jsx)("svg", {
                                        className: "w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: (0, a.jsx)("path", {
                                            strokeLinecap: "round",
                                            strokeLinejoin: "round",
                                            strokeWidth: 1.5,
                                            d: "M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                                        })
                                    }), (0, a.jsx)("p", {
                                        children: "Cole um código PIX e clique em Decodificar"
                                    })]
                                })
                            })]
                        })
                    })]
                }), O.length > 0 && (0, a.jsxs)("div", {
                    className: "bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] overflow-hidden",
                    children: [(0, a.jsxs)("div", {
                        className: "bg-gray-50 dark:bg-[#0a0a0a] px-4 py-3 border-b border-gray-200 dark:border-[#222222] flex items-center justify-between",
                        children: [(0, a.jsx)("h2", {
                            className: "text-sm font-semibold text-gray-700 dark:text-lime-accent uppercase tracking-wide",
                            children: "Histórico de Consultas"
                        }), (0, a.jsx)("button", {
                            onClick: () => J(!0),
                            className: "p-1.5 rounded-md text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-[#222222] transition-colors cursor-pointer",
                            title: "Limpar histórico",
                            children: (0, a.jsx)("svg", {
                                className: "w-4 h-4",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: (0, a.jsx)("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                })
                            })
                        })]
                    }), (0, a.jsx)("div", {
                        className: "overflow-x-auto",
                        children: (0, a.jsxs)("table", {
                            className: "w-full text-sm",
                            children: [(0, a.jsx)("thead", {
                                className: "bg-gray-50 dark:bg-[#0a0a0a] text-gray-600 dark:text-gray-400",
                                children: (0, a.jsxs)("tr", {
                                    children: [(0, a.jsx)("th", {
                                        className: "px-4 py-2 text-left font-medium",
                                        children: "Beneficiário"
                                    }), (0, a.jsx)("th", {
                                        className: "px-4 py-2 text-left font-medium",
                                        children: "Expiração"
                                    }), (0, a.jsx)("th", {
                                        className: "px-4 py-2 text-left font-medium",
                                        children: "Valor Original"
                                    }), (0, a.jsx)("th", {
                                        className: "px-4 py-2 text-left font-medium",
                                        children: "Nome do Devedor"
                                    }), (0, a.jsx)("th", {
                                        className: "px-4 py-2 text-left font-medium",
                                        children: "CPF/CNPJ do Devedor"
                                    }), (0, a.jsx)("th", {
                                        className: "px-4 py-2 text-center font-medium w-16",
                                        children: "Ação"
                                    })]
                                })
                            }), (0, a.jsx)("tbody", {
                                className: "divide-y divide-gray-100 dark:divide-[#222222]",
                                children: O.map((e, r) => (0, a.jsxs)("tr", {
                                    className: "hover:bg-gray-50 dark:hover:bg-[#1a1a1a]",
                                    children: [(0, a.jsx)("td", {
                                        className: "px-4 py-2 text-gray-900 dark:text-gray-100",
                                        children: e.beneficiario
                                    }), (0, a.jsx)("td", {
                                        className: "px-4 py-2 text-gray-600 dark:text-gray-400",
                                        children: e.expiracao || "-"
                                    }), (0, a.jsx)("td", {
                                        className: "px-4 py-2 text-gray-600 dark:text-gray-400",
                                        children: e.valorOriginal || "-"
                                    }), (0, a.jsx)("td", {
                                        className: "px-4 py-2 text-gray-600 dark:text-gray-400",
                                        children: e.devedorNome || "-"
                                    }), (0, a.jsx)("td", {
                                        className: "px-4 py-2 text-gray-600 dark:text-gray-400",
                                        children: e.devedorCpfCnpj || "-"
                                    }), (0, a.jsx)("td", {
                                        className: "px-4 py-2 text-center",
                                        children: (0, a.jsx)("button", {
                                            onClick: () => Z(e),
                                            className: "p-1.5 rounded-md bg-kobana-100 dark:bg-lime-accent/20 text-kobana-600 dark:text-lime-accent hover:bg-kobana-200 dark:hover:bg-lime-accent/30 transition-colors cursor-pointer",
                                            title: "Carregar este EMV",
                                            children: (0, a.jsx)("svg", {
                                                className: "w-4 h-4",
                                                fill: "none",
                                                stroke: "currentColor",
                                                viewBox: "0 0 24 24",
                                                children: (0, a.jsx)("path", {
                                                    strokeLinecap: "round",
                                                    strokeLinejoin: "round",
                                                    strokeWidth: 2,
                                                    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                })
                                            })
                                        })
                                    })]
                                }, r))
                            })]
                        })
                    })]
                })]
            }), H && (0, a.jsx)("div", {
                className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
                children: (0, a.jsxs)("div", {
                    className: "bg-white dark:bg-[#111111] rounded-xl border border-gray-200 dark:border-[#222222] p-6 max-w-sm mx-4 shadow-xl",
                    children: [(0, a.jsxs)("div", {
                        className: "flex items-center gap-3 mb-4",
                        children: [(0, a.jsx)("div", {
                            className: "p-2 rounded-full bg-red-100 dark:bg-red-900/30",
                            children: (0, a.jsx)("svg", {
                                className: "w-6 h-6 text-red-600 dark:text-red-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: (0, a.jsx)("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                })
                            })
                        }), (0, a.jsx)("h3", {
                            className: "text-lg font-semibold text-gray-900 dark:text-gray-100",
                            children: "Limpar Histórico"
                        })]
                    }), (0, a.jsx)("p", {
                        className: "text-sm text-gray-600 dark:text-gray-400 mb-6",
                        children: "Tem certeza que deseja limpar todo o histórico de consultas? Esta ação não pode ser desfeita."
                    }), (0, a.jsxs)("div", {
                        className: "flex gap-3 justify-end",
                        children: [(0, a.jsx)("button", {
                            onClick: () => J(!1),
                            className: "px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#222222] hover:bg-gray-200 dark:hover:bg-[#333333] rounded-lg transition-colors cursor-pointer",
                            children: "Cancelar"
                        }), (0, a.jsx)("button", {
                            onClick: G,
                            className: "px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer",
                            children: "Limpar"
                        })]
                    })]
                })
            }), (0, a.jsx)("footer", {
                className: "bg-white dark:bg-black border-t border-gray-200 dark:border-[#222222] mt-auto",
                children: (0, a.jsx)("div", {
                    className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6",
                    children: (0, a.jsxs)("div", {
                        className: "flex flex-col sm:flex-row items-center justify-between gap-4",
                        children: [(0, a.jsxs)("div", {
                            className: "text-sm text-gray-500 dark:text-gray-400",
                            children: ["Desenvolvido por", " ", (0, a.jsx)("a", {
                                href: "https://www.kobana.com.br",
                                className: "text-kobana-600 hover:text-kobana-700 dark:text-lime-accent dark:hover:text-[#c4ee45] font-medium",
                                children: "Kobana"
                            }), " ", "| Baseado no padrao EMV-QRCPS e especificacoes do BCB"]
                        }), (0, a.jsxs)("div", {
                            className: "flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400",
                            children: [(0, a.jsx)("a", {
                                href: "https://www.bcb.gov.br/content/estabilidadefinanceira/spb_docs/ManualBRCode.pdf",
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "hover:text-kobana-600 dark:hover:text-lime-accent",
                                children: "Manual BR Code"
                            }), (0, a.jsx)("span", {
                                className: "text-gray-300 dark:text-gray-600",
                                children: "|"
                            }), (0, a.jsx)("span", {
                                children: "v1.0.0"
                            })]
                        })]
                    })
                })
            })]
        })
		}

		function $() {
			return (0, a.jsx)(r.Suspense, {
				fallback: (0, a.jsx)("div", {
					className:
						"min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center",
					children: (0, a.jsx)("div", {
						className: "text-gray-500 dark:text-gray-400",
						children: "Carregando...",
					}),
				}),
				children: (0, a.jsx)(A, {}),
			});
		}
		e.s(["default", () => $], 52683);
	},
]);
