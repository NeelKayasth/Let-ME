// Netlify Function: send-application-email
// Sends a structured HTML email to apply@letme.com after an application is submitted.

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.APPLICATIONS_TO_EMAIL || 'apply@letme.com';
    const FROM_EMAIL = process.env.FROM_EMAIL || 'LetMe <onboarding@resend.dev>';
    const SITE_URL = process.env.SITE_URL || '';

    if (!RESEND_API_KEY) {
      return { statusCode: 500, body: 'Missing RESEND_API_KEY' };
    }

    const payload = JSON.parse(event.body || '{}');
    const {
      propertyName,
      unitName,
      areaName,
      address,
      monthlyPrice,
      applicantName,
      email,
      phone,
      dateOfBirth,
      currentAddress,
      employmentStatus,
      monthlyIncome,
    } = payload;

    const logoUrl = SITE_URL ? `${SITE_URL.replace(/\/$/, '')}/letme-logo.png` : '';

    const html = `
      <div style="font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; background:#0b1020; padding:24px; color:#e6e9f5;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; margin:0 auto; background:#0e1326; border-radius:16px; overflow:hidden;">
          <tr>
            <td style="padding:24px 24px 0 24px; text-align:center;">
              ${logoUrl ? `<img src="${logoUrl}" alt="LetMe" style="height:48px; width:auto;" />` : `<div style="font-weight:700; font-size:24px;">LetMe</div>`}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 0 24px; text-align:center;">
              <h1 style="margin:0; font-size:22px; color:#ffffff;">New Rental Application</h1>
              <p style="margin:8px 0 0 0; color:#b8bfd9;">A candidate has submitted an application via the website.</p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px;">
              <div style="background:#121938; border:1px solid #2a3768; border-radius:12px; padding:16px;">
                <h2 style="margin:0 0 12px 0; font-size:16px; color:#dbe2ff;">Property & Unit</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#c8cdea;">
                  <tr>
                    <td style="padding:6px 0; width:180px; color:#8fa0d6;">Property</td>
                    <td style="padding:6px 0;">${escapeHtml(propertyName || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Unit</td>
                    <td style="padding:6px 0;">${escapeHtml(unitName || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Area</td>
                    <td style="padding:6px 0;">${escapeHtml(areaName || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Address</td>
                    <td style="padding:6px 0;">${escapeHtml(address || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Monthly Rent</td>
                    <td style="padding:6px 0;">£${Number(monthlyPrice || 0).toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <div style="height:12px;"></div>

              <div style="background:#121938; border:1px solid #2a3768; border-radius:12px; padding:16px;">
                <h2 style="margin:0 0 12px 0; font-size:16px; color:#dbe2ff;">Applicant Details</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px; color:#c8cdea;">
                  <tr>
                    <td style="padding:6px 0; width:180px; color:#8fa0d6;">Full Name</td>
                    <td style="padding:6px 0;">${escapeHtml(applicantName || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Email</td>
                    <td style="padding:6px 0;">${escapeHtml(email || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Phone</td>
                    <td style="padding:6px 0;">${escapeHtml(phone || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Date of Birth</td>
                    <td style="padding:6px 0;">${escapeHtml(dateOfBirth || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Current Address</td>
                    <td style="padding:6px 0;">${escapeHtml(currentAddress || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Employment Status</td>
                    <td style="padding:6px 0;">${escapeHtml(employmentStatus || '')}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0; color:#8fa0d6;">Monthly Income</td>
                    <td style="padding:6px 0;">£${Number(monthlyIncome || 0).toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <p style="margin:16px 0 0 0; font-size:12px; color:#7e8bb6; text-align:center;">This email was generated by the LetMe website.</p>
            </td>
          </tr>
        </table>
      </div>
    `;

    const subject = `New Application: ${unitName || ''} · ${propertyName || ''}`.trim();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return { statusCode: 500, body: `Email send failed: ${msg}` };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, body: `Server error: ${err}` };
  }
};

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}


