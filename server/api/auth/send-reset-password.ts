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

export const sendForgotPassword = async (user: User, url: string) => {
   const htmlTemplate = `
  
<div style="margin:0; padding:56px 16px; background:#FFFFFF; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
    style="max-width:520px; margin:0 auto; background:#FFFFFF;">

    <tr>
        <div style="margin-top:14px; font-size:26px; line-height:1.2; font-weight:700; color:#2563EB; letter-spacing:-0.6px;">
          Velto Finance
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding:0 0 30px;">
        <p style="margin:0; font-size:14px; line-height:1.6; color:#7A7F87;">
          Olá, <strong style="color:#111827;">${user.email}</strong>. Recebemos uma solicitação para redefinir a senha da sua conta.
        </p>
      </td>
    </tr>

    <tr>
      <td style="text-align:center; padding:0 0 34px;">
        <a href="${url}"
          style="display:inline-block; background:#2563EB; color:#FFFFFF; text-decoration:none;
          padding:12px 30px; border-radius:9px; font-size:14px; font-weight:600;">
          Redefinir senha
        </a>
      </td>
    </tr>

    <tr>
      <td style="padding:0 0 28px;">
        <p style="margin:0; font-size:14px; line-height:1.55; color:#7A7F87;">
          Se não foi você que solicitou a redefinição, ignore este e-mail com segurança. Sua senha atual continuará a mesma.
        </p>
      </td>
    </tr>

    <tr>
    <td style="padding:0 0 28px;">
      <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px 16px;">
        <p style="margin:0; font-size:14px; line-height:1.55; color:#475569;">
          <strong style="color:#111827;">Este link é válido por 1 hora.</strong>
          Após esse período, será necessário solicitar uma nova redefinição de senha.
        </p>
      </div>
    </td>
  </tr>
  
    <tr>
      <td style="padding-top:22px; border-top:1px solid #EEF2F7;">
        <p style="margin:0 0 8px; font-size:12px; line-height:1.5; color:#9CA3AF;">
          Se o botão não funcionar, copie e cole este link no navegador:
        </p>

        <p style="margin:0; font-size:12px; line-height:1.5; color:#2563EB; word-break:break-all;">
          ${url}
        </p>
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
    console.error("Falha ao enviar o email:", error)
  }
}






