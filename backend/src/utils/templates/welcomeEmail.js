/**
 * welcomeEmail.js
 * Generates a welcome HTML email for newly registered users of AMMA National.
 *
 * @param {string} userName - The name of the registered user.
 * @returns {string} Full HTML string for the welcome email.
 */
const welcomeEmail = (userName) => `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AMMA Email Template</title>
<style>
    body { margin: 0; padding: 0; background-color: #f6f6f6; font-family: Arial, Helvetica, sans-serif; }
    .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; }
    .header-image { width: 100%; max-width: 560px; display: block; margin: 0 auto; }
    .content { padding: 20px; color: #333333; line-height: 24px; font-size: 16px; text-align: center; }
    .title { color: #AD1F23; font-size: 20px; font-weight: bold; text-align: center; }
    .section-title { color: #AD1F23; font-size: 20px; font-weight: bold; text-align: center; }
    .content ul { list-style-type: disc; padding-left: 22px; margin: 0 auto; display: inline-block; text-align: left; }
    .content li { margin-bottom: 8px; text-align: left; padding-left: 4px; }
    .cta-button { display: inline-block; background-color: #AD1F23; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 15px; font-weight: bold; font-size: 18px; }
    .footer { background-color: #0b1151; color: #ffffff; padding: 20px; font-size: 12px; text-align: center; }
    .footer a { color: #ffffff; text-decoration: underline; }
    .social-icons { margin-bottom: 20px; text-align: center; }
    .social-icons a { text-decoration: none; margin: 0 5px; display: inline-block; vertical-align: middle; }
    .social-icons img { width: 32px; height: 32px; border: none; outline: none; display: block; }
    .quote-block { background-color: #f6f6f6; border-left: 4px solid #AD1F23; padding: 14px 18px; margin: 10px auto; max-width: 480px; text-align: left; font-style: italic; color: #555555; font-size: 14px; line-height: 21px; }
</style>
</head>
<body>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f6f6;">
        <tr>
            <td align="center">
                <table class="container" cellpadding="0" cellspacing="0">
                    
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <img src="https://alyy.store/wp-content/uploads/2026/07/AMMA-Newsletter-Banner-1.png" alt="AMMA Banner" class="header-image">
                        </td>
                    </tr>

                    <tr>
                        <td class="content">
                            <p>Assalamu Alaikum wa Rahmatullahi wa Barakatuh${userName ? `, <strong>${userName}</strong>` : ''},</p>
                            <p class="title" style="color: #AD1F23; font-size: 20px; font-weight: bold; text-align: center;">Welcome to the American Muslim Medical Association (AMMA)!</p>
                            <p>Jazakum Allahu Khayran for becoming a member of our growing community of Muslim physicians, dentists, pharmacists, nurses, researchers, allied health professionals, trainees, and healthcare leaders across the United States.</p>
                            <p>By joining AMMA, you are becoming part of a network united by a shared purpose:</p>
                        </td>
                    </tr>

                    <tr>
                        <td class="content">
                            <ul style="list-style-type: disc; padding-left: 22px; margin: 0 auto; display: inline-block; text-align: left;">
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">To pursue excellence in healthcare and professional development.</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">To strengthen our faith, character, and spiritual growth.</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">To serve humanity with compassion and integrity.</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">To support one another as Muslim healthcare professionals.</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">To leave a lasting legacy of benefit for our communities and for the Ummah.</li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td class="content">
                            <p>As healthcare professionals, we have been entrusted with one of the greatest responsibilities, the care of human life. At AMMA, we believe our profession is more than a career; it is an opportunity to worship Allah through service, compassion, excellence, and sincere intention.</p>
                            <p class="section-title" style="color: #AD1F23; font-size: 20px; font-weight: bold; text-align: center;">Your Membership Will Give You Access To:</p>
                        </td>
                    </tr>

                    <tr>
                        <td class="content">
                            <ul style="list-style-type: disc; padding-left: 22px; margin: 0 auto; display: inline-block; text-align: left;">
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">Educational webinars and CME opportunities</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">Professional networking and mentorship</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">Leadership and volunteer opportunities</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">Advocacy initiatives that amplify the voice of Muslim healthcare professionals</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">Spiritual development and tarbiyah programs designed specifically for healthcare professionals</li>
                                <li style="margin-bottom: 8px; text-align: left; padding-left: 4px;">A national community committed to serving Allah through medicine and service</li>
                            </ul>
                        </td>
                    </tr>

                    <tr>
                        <td class="content">
                            <p class="section-title" style="color: #AD1F23; font-size: 20px; font-weight: bold; text-align: center;">Stay Connected</p>
                            <p>To make the most of your membership, we encourage you to join our WhatsApp Community where you'll receive updates on upcoming programs, networking opportunities, advocacy efforts, and ways to get involved.</p>
                            <p>Join the AMMA WhatsApp Community:</p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 10px 20px 20px 20px;">
                            <!--[if mso]>
                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://chat.whatsapp.com/JXDOW0jCurH22ZkA1e01y6" style="height:44px;v-text-anchor:middle;width:280px;" arcsize="35%" stroke="f" fillcolor="#AD1F23">
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:18px;font-weight:bold;">Join Our WhatsApp Community</center>
                            </v:roundrect>
                            <![endif]-->
                            <!--[if !mso]><!-->
                            <a href="https://chat.whatsapp.com/JXDOW0jCurH22ZkA1e01y6" class="cta-button" style="display: inline-block; background-color: #AD1F23; color: #ffffff !important; padding: 10px 20px; text-decoration: none; border-radius: 15px; font-weight: bold; font-size: 18px; font-family: Arial, Helvetica, sans-serif;">Join Our WhatsApp Community</a>
                            <!--<![endif]-->
                        </td>
                    </tr>

                    <tr>
                        <td class="content">
                            <p>May Allah (SWT) place barakah in your knowledge, your work, and your service to humanity. May He make your profession a means of drawing closer to Him, benefiting His creation, and leaving behind a legacy of lasting الخير (goodness).</p>
                        </td>
                    </tr>

                    <tr>
                        <td class="content">
                            <p>With du'as,<br><strong>The AMMA Leadership Team</strong><br>American Muslim Medical Association</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 0 20px 20px 20px;">
                            <div class="quote-block">"The most beloved people to Allah are those who are most beneficial to people." Al-Mu'jam al-Awsaṭ lil-Ṭabarānī 6026</div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="footer">
                            <div class="social-icons">
                                <a href="https://www.facebook.com/share/18ZuYQ6BGS/" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/facebook-new.png" alt="Facebook">
                                </a>
                                <a href="https://www.youtube.com/@ammanational" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png" alt="YouTube">
                                </a>
                                <a href="https://x.com/ammanational" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/x.png" alt="X">
                                </a>
                                <a href="https://www.linkedin.com/company/ammanational/" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" alt="LinkedIn">
                                </a>
                                <a href="https://www.instagram.com/ammanational?igsh=YnAxaThkNjdxdzhh" target="_blank">
                                    <img src="https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png" alt="Instagram">
                                </a>
                            </div>
                            <p>Copyright © ${new Date().getFullYear()}, All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

module.exports = welcomeEmail;
