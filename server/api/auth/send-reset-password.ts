import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: "minhasfinancasapp900@gmail.com", 
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
  <div style="background-color: #f4f6f9; padding: 40px 0; font-family: Arial, sans-serif;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" 
      style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; 
      overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">

      <tr>
        <td style="background: #0096FF; padding: 20px; text-align: center; color: #fff;">
          <span style="font-size: 28px;">🔒</span>
          <div style="font-size: 22px; font-weight: bold; margin-top: 8px;">
            Minhas Finanças
          </div>
        </td>
      </tr>

      <tr>
        <td style="padding: 30px; color: #333;">
          <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #0096FF;">
            Redefinição de Senha 🔐
          </h2>

          <p style="margin: 0 0 12px; font-size: 15px; line-height: 1.6;">
            Olá, <strong>${user.email}</strong>
          </p>

          <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6;">
            Recebemos um pedido para redefinir sua senha em <strong>Minhas Finanças</strong>.  
            Se foi você quem fez a solicitação, clique no botão abaixo para continuar:
          </p>

          <div style="background: #FFF3CD; color: #856404; border: 1px solid #FFEEBA; 
            border-radius: 6px; padding: 12px; margin-bottom: 24px; text-align: center; font-size: 14px; font-weight: 600;">
            ⚠️ Este link expira em <strong>1 hora</strong> por motivos de segurança.
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${url}" style="background: #0096FF; color: #fff; text-decoration: none; 
              padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: bold; 
              display: inline-block;">
              🔁 Redefinir Senha
            </a>
          </div>

          <p style="margin: 0 0 8px; font-size: 14px; color: #555;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
          </p>
          <p style="font-size: 13px; color: #0096FF; word-break: break-word;">
            ${url}
          </p>

          <p style="margin-top: 24px; font-size: 13px; color: #999;">
            Se você não solicitou a redefinição de senha, ignore este e-mail com segurança.
          </p>
        </td>
      </tr>

      <tr>
        <td style="background: #f9fafb; text-align: center; padding: 16px; 
          font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} Minhas Finanças – Protegendo seus dados com segurança.  
        </td>
      </tr>
    </table>
  </div>
`

    try {
        const info = await transporter.sendMail({
            from: "Redefinição de Senha <minhasfinancasapp900@gmail.com>", 
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






