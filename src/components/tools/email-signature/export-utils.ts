import { toPng } from "html-to-image";
import { SocialIconsHtml } from "./social-icons";
import type { EmailSignatureData } from "./types";

export async function generatePng(element: HTMLElement): Promise<Blob> {
	const dataUrl = await toPng(element, {
		pixelRatio: 2,
		backgroundColor: "#ffffff",
	});
	const res = await fetch(dataUrl);
	return res.blob();
}

function spacingValue(spacing: EmailSignatureData["spacing"]): number {
	switch (spacing) {
		case "compact":
			return 4;
		case "spacious":
			return 16;
		default:
			return 8;
	}
}

export function generateInlineHTML(data: EmailSignatureData): string {
	const sp = spacingValue(data.spacing);
	const fontSize = data.fontSize || 14;

	const greeting = data.greeting
		? `<p style="margin:0 0 ${sp}px 0;font-size:${fontSize}px;color:#374151;">${data.greeting}</p>`
		: "";

	const photo = data.photoUrl
		? `<img src="${data.photoUrl}" alt="" width="64" height="64" style="border-radius:50%;object-fit:cover;display:block;" />`
		: "";

	const logo = data.logoUrl
		? `<img src="${data.logoUrl}" alt="${data.company}" height="32" style="object-fit:contain;display:block;" />`
		: "";

	const banner = data.bannerUrl
		? `<img src="${data.bannerUrl}" alt="${data.company}" width="100%" height="80" style="object-fit:cover;display:block;border-radius:4px;" />`
		: "";

	const nameBlock = `<p style="margin:0;font-size:${fontSize + 2}px;font-weight:700;color:${data.primaryColor};">${data.fullName}</p>`;

	const titleBlock = data.jobTitle
		? `<p style="margin:${sp / 2}px 0 0 0;font-size:${fontSize}px;color:${data.secondaryColor};">${data.jobTitle}${data.department ? ` — ${data.department}` : ""}${data.company ? ` | ${data.company}` : ""}</p>`
		: "";

	const contactLines: string[] = [];
	if (data.email)
		contactLines.push(
			`<a href="mailto:${data.email}" style="color:${data.secondaryColor};text-decoration:none;font-size:${fontSize}px;">${data.email}</a>`,
		);
	if (data.phone)
		contactLines.push(
			`<span style="color:${data.secondaryColor};font-size:${fontSize}px;">${data.phone}</span>`,
		);
	if (data.mobile)
		contactLines.push(
			`<span style="color:${data.secondaryColor};font-size:${fontSize}px;">${data.mobile}</span>`,
		);
	if (data.website)
		contactLines.push(
			`<a href="${data.website}" target="_blank" style="color:${data.primaryColor};text-decoration:none;font-size:${fontSize}px;">${data.website}</a>`,
		);
	if (data.address)
		contactLines.push(
			`<span style="color:${data.secondaryColor};font-size:${fontSize}px;">${data.address}</span>`,
		);

	const contactBlock = contactLines.length
		? `<div style="margin-top:${sp}px;display:flex;flex-wrap:wrap;gap:${sp}px;align-items:center;">${contactLines.join('<span style="color:#d1d5db;">|</span>')}</div>`
		: "";

	const socialsHtml = SocialIconsHtml({
		socials: data.socials,
		color: data.secondaryColor,
		size: 16,
	});

	const cta = data.ctaText
		? `<div style="margin-top:${sp}px;">
        <a href="${data.ctaUrl || "#"}" style="display:inline-block;padding:6px 14px;background:${data.primaryColor};color:#fff;text-decoration:none;border-radius:4px;font-size:${fontSize}px;">${data.ctaText}</a>
      </div>`
		: "";

	const disclaimer =
		data.includeDisclaimer && data.disclaimerText
			? `<p style="margin-top:${sp * 2}px;font-size:${Math.max(10, fontSize - 2)}px;color:#9ca3af;max-width:480px;">
        ${data.disclaimerText}
      </p>`
			: "";

	switch (data.template) {
		case "classic": {
			return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:Arial,Helvetica,sans-serif;font-size:${fontSize}px;color:#374151;">
        <tr><td style="padding-bottom:${sp}px;">${greeting}</td></tr>
        <tr><td style="padding-bottom:${sp}px;"><strong style="color:${data.primaryColor};font-size:${fontSize + 2}px;">${data.fullName}</strong><br/>${data.jobTitle}${data.company ? `, ${data.company}` : ""}</td></tr>
        <tr><td style="padding-bottom:${sp}px;">${contactLines.join("<br/>")}</td></tr>
        ${socialsHtml ? `<tr><td style="padding-bottom:${sp}px;">${socialsHtml}</td></tr>` : ""}
        ${cta ? `<tr><td style="padding-bottom:${sp}px;">${cta}</td></tr>` : ""}
        ${disclaimer ? `<tr><td>${disclaimer}</td></tr>` : ""}
      </table>`;
		}

		case "minimal": {
			return `<div style="font-family:Arial,Helvetica,sans-serif;color:#374151;">
        ${greeting}
        <div style="margin-bottom:${sp}px;">${nameBlock}${titleBlock}</div>
        ${contactBlock}
        ${socialsHtml ? `<div style="margin-top:${sp}px;">${socialsHtml}</div>` : ""}
        ${cta}
        ${disclaimer}
      </div>`;
		}

		case "professional": {
			return `<div style="font-family:Arial,Helvetica,sans-serif;color:#374151;">
        ${greeting}
        <div style="border-left:3px solid ${data.primaryColor};padding-left:${sp * 2}px;">
          ${nameBlock}
          ${titleBlock}
          ${contactBlock}
          ${socialsHtml ? `<div style="margin-top:${sp}px;">${socialsHtml}</div>` : ""}
          ${cta}
        </div>
        ${disclaimer}
      </div>`;
		}

		case "modern": {
			return `<div style="font-family:Arial,Helvetica,sans-serif;color:#374151;">
        ${greeting}
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="width:3px;background:${data.primaryColor};"></td>
          <td style="padding-left:${sp * 2}px;">
            ${nameBlock}
            ${titleBlock}
            ${contactBlock}
            ${socialsHtml ? `<div style="margin-top:${sp}px;">${socialsHtml}</div>` : ""}
            ${cta}
          </td>
        </tr></table>
        ${disclaimer}
      </div>`;
		}

		case "photo": {
			return `<div style="font-family:Arial,Helvetica,sans-serif;color:#374151;">
        ${greeting}
        <table cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="padding-right:${sp * 2}px;vertical-align:top;">${photo}</td>
          <td style="vertical-align:top;">
            ${nameBlock}
            ${titleBlock}
            ${contactBlock}
            ${socialsHtml ? `<div style="margin-top:${sp}px;">${socialsHtml}</div>` : ""}
            ${cta}
          </td>
        </tr></table>
        ${disclaimer}
      </div>`;
		}

		case "banner": {
			return `<div style="font-family:Arial,Helvetica,sans-serif;color:#374151;max-width:520px;">
        ${banner ? `<div style="margin-bottom:${sp}px;">${banner}</div>` : ""}
        ${greeting}
        <table cellpadding="0" cellspacing="0" border="0" style="width:100%;"><tr>
          <td style="vertical-align:top;">
            ${nameBlock}
            ${titleBlock}
            ${contactBlock}
          </td>
          <td style="vertical-align:top;text-align:right;padding-left:${sp * 2}px;">
            ${logo}
          </td>
        </tr></table>
        ${socialsHtml ? `<div style="margin-top:${sp}px;">${socialsHtml}</div>` : ""}
        ${cta}
        ${disclaimer}
      </div>`;
		}

		default:
			return "";
	}
}
