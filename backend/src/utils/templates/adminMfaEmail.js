/**
 * adminMfaEmail.js
 * Generates a premium HTML email for Admin MFA login from a new device.
 *
 * @param {string} otp - The 6-digit OTP code to embed in the email.
 * @returns {string} Full HTML string for the admin MFA email.
 */
const adminMfaEmail = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login – New Device Detected</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8;padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:36px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#7fb8f5;font-weight:600;">
                American Muslim Medical Association
              </p>
              <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                Admin Login – New Device
              </h1>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#fffbeb;padding:14px 48px;border-bottom:1px solid #fde68a;">
              <p style="margin:0;font-size:13px;color:#92400e;text-align:center;">
                🛡️ &nbsp;<strong>Security Alert:</strong> A login attempt was made from an unrecognized device.
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:44px 48px 36px;">

              <p style="margin:0 0 8px;font-size:16px;color:#374151;line-height:1.6;">
                We detected an admin login attempt from a <strong>new or unrecognized device</strong>.
              </p>
              <p style="margin:0 0 32px;font-size:15px;color:#6b7280;line-height:1.7;">
                Enter the One-Time Password (OTP) below to verify your identity and authorize this device.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%);border:2px solid #93c5fd;border-radius:16px;padding:28px 48px;margin:0 auto;">
                      <p style="margin:0 0 8px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#9ca3af;font-weight:600;">
                        Admin MFA Code
                      </p>
                      <p style="margin:0;font-size:48px;font-weight:800;letter-spacing:10px;color:#1d4ed8;font-family:'Courier New',Courier,monospace;">
                        ${otp}
                      </p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Info Pills -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;">
                <tr>
                  <td style="padding:12px 16px;background:#f9fafb;border-radius:8px;border-left:4px solid #1d4ed8;">
                    <p style="margin:0;font-size:13px;color:#374151;line-height:1.5;">
                      ⏱️ &nbsp;<strong>Expires in 10 minutes.</strong> Enter it promptly to continue.
                    </p>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:#f9fafb;border-radius:8px;border-left:4px solid #AD1F23;">
                    <p style="margin:0;font-size:13px;color:#374151;line-height:1.5;">
                      🔒 &nbsp;<strong>Do not share this code</strong> with anyone, including AMMA staff.
                    </p>
                  </td>
                </tr>
                <tr><td style="height:10px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:#fff7ed;border-radius:8px;border-left:4px solid #f97316;">
                    <p style="margin:0;font-size:13px;color:#374151;line-height:1.5;">
                      ⚠️ &nbsp;If this was <strong>not you</strong>, please change your password immediately and contact AMMA IT support.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 48px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#042C53;">
                American Muslim Medical Association
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                © ${new Date().getFullYear()} AMMA National. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;

module.exports = adminMfaEmail;
