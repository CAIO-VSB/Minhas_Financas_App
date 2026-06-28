import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "financevelto@gmail.com", 
      pass: process.env.SMTP_PASSWORD
    },
    secure: false,
    port: 587
});


type User = {
  email: string
}

export const sendUserEmail = async (user: User, url: string) => {
    const htmlTemplate = `
  <div style="background-color: #F8FAFC; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0"
    style="max-width: 560px; margin: auto; background: #ffffff; border-radius: 16px;
    overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04);">

    <tr>
      <td style="padding: 32px 40px; text-align: center; border-bottom: 1px solid #F1F5F9;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: auto;">
          <tr>
            <td style="vertical-align: middle;">
              <span style="font-size: 18px; font-weight: 700; color: #0F172A; letter-spacing: -0.3px;">
                Velto Finance
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px 40px 32px;">
        <p style="margin: 0 0 16px; font-size: 15px; color: #334155; line-height: 1.7;">
          Olá, <strong style="color: #0F172A;">${user.email}</strong>! Obrigado por criar sua conta no <strong>Velto Finance</strong>.
          Estamos felizes em ter você por aqui.
        </p>

        <p style="margin: 0 0 28px; font-size: 15px; color: #334155; line-height: 1.7;">
          Para começar, confirme seu e-mail clicando no botão abaixo:
        </p>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background: #2563EB; color: #ffffff; text-decoration: none;
            padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600;
            display: inline-block;">
            Confirmar e-mail →
          </a>
        </div>

        <p style="margin: 0 0 28px; font-size: 13px; color: #94A3B8; line-height: 1.7;">
          ⚠️ Este link expira em <strong style="color: #334155;">1 hora</strong>. Após esse prazo, será necessário solicitar um novo.
        </p>

        <p style="margin: 0 0 6px; font-size: 13px; color: #94A3B8;">
          Se o botão não funcionar, copie e cole este link no navegador:
        </p>
        <p style="font-size: 12px; color: #2563EB; word-break: break-all; background: #F8FAFC;
          padding: 10px 12px; border-radius: 6px; border: 1px solid #E2E8F0; margin: 0;">
          ${url}
        </p>

        <p style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #F1F5F9;
          font-size: 13px; color: #CBD5E1;">
          Se você não criou esta conta, pode ignorar este e-mail.
        </p>
      </td>
    </tr>

    <tr>
      <td style="background: #F8FAFC; text-align: center; padding: 20px 40px;
        font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9;">
        © ${new Date().getFullYear()} Velto Finance
      </td>
    </tr>
  </table>
</div>
`

  try {
    const info = await transporter.sendMail({
      from: "E-mail de verificação <financevelto@gmail.com>", 
      to: user.email, 
      subject: "Verifique seu e-mail",
      text: "Siga as intruções para fazer a verificação do seu e-mail", 
      html: htmlTemplate
    });

    console.log("E-mail enviado com sucesso", info.response)
    return info.messageId
  } catch (error) {
    console.error("Falha ao enviar o email:", error)
  }
}






