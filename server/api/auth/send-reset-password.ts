import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "financevelto@gmail.com", 
    pass: process.env.APP_API_KEY 
  },
  secure: false,
  port: 587
});


type User = {
  email: string
}

export const sendForgotPassword = async (user: User, url: string) => {
   const htmlTemplate = `
  <div style="background-color: #F8FAFC; padding: 48px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0"
    style="max-width: 560px; margin: auto; background: #ffffff; border-radius: 16px;
    overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.04);">

    <tr>
      <td style="padding: 40px 40px 32px; text-align: center; border-bottom: 1px solid #F1F5F9;">
        <div style="display: inline-flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; background: #2563EB; border-radius: 8px;
            display: inline-flex; align-items: center; justify-content: center;">
            <span style="color: white; font-size: 18px; font-weight: bold;">V</span>
          </div>
          <span style="font-size: 18px; font-weight: 700; color: #0F172A; letter-spacing: -0.3px;">
            Velto Finance
          </span>
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding: 40px 40px 32px;">
        <div style="width: 48px; height: 48px; background: #EFF6FF; border-radius: 12px;
          display: inline-flex; align-items: center; justify-content: center; margin-bottom: 24px;">
          <span style="font-size: 24px;">🔐</span>
        </div>

        <h1 style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #0F172A; letter-spacing: -0.4px;">
          Redefinição de senha
        </h1>
        <p style="margin: 0 0 24px; font-size: 15px; color: #64748B; line-height: 1.6;">
          Olá, <strong style="color: #0F172A;">${user.email}</strong>. Recebemos um pedido para redefinir sua senha. Se foi você, clique no botão abaixo.
        </p>

        <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px;
          padding: 12px 16px; margin-bottom: 28px;">
          <span style="font-size: 14px; color: #92400E;">
            ⚠️ <strong>Este link expira em 1 hora</strong> por motivos de segurança.
          </span>
        </div>

        <div style="text-align: center; margin: 32px 0;">
          <a href="${url}" style="background: #2563EB; color: #ffffff; text-decoration: none;
            padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 600;
            display: inline-block; letter-spacing: -0.1px;">
            Redefinir senha →
          </a>
        </div>

        <p style="margin: 0 0 6px; font-size: 13px; color: #94A3B8;">
          Se o botão não funcionar, copie e cole no navegador:
        </p>
        <p style="font-size: 12px; color: #2563EB; word-break: break-all; background: #F8FAFC;
          padding: 10px 12px; border-radius: 6px; border: 1px solid #E2E8F0;">
          ${url}
        </p>

        <p style="margin-top: 28px; font-size: 13px; color: #CBD5E1; border-top: 1px solid #F1F5F9; padding-top: 20px;">
          Se você não solicitou a redefinição de senha, ignore este e-mail com segurança.
        </p>
      </td>
    </tr>

    <tr>
      <td style="background: #F8FAFC; text-align: center; padding: 20px 40px;
        font-size: 12px; color: #94A3B8; border-top: 1px solid #F1F5F9;">
        © ${new Date().getFullYear()} Velto Finance · Protegendo seus dados com segurança.
      </td>
    </tr>
  </table>
</div>
`

  try {
    const info = await transporter.sendMail({
        from: "Redefinição de Senha <financevelto@gmail.com>", 
        to: user.email, 
        subject: "Redefinir Senha",
        text: "Siga as intruções para fazer a redefinir sua senha", 
        html: htmlTemplate
    });

    return info.messageId

  } catch (error) {  
    //console.error("Falha ao enviar o email:", error)
  }
}






