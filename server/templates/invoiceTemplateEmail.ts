export const invoiceClosingTemplate = (fatura: {
  user_email: string
  card_name: string
  closing_day: number
  due_day: number
  tipo: 'fechamento' | 'vencimento'
}) => {
  const mensagemPrincipal = fatura.tipo === 'fechamento'
    ? `Sua fatura do cartão <strong style="color:#111827;">${fatura.card_name}</strong> fecha hoje.`
    : `Sua fatura do cartão <strong style="color:#111827;">${fatura.card_name}</strong> vence hoje.`

  const mensagemDestaque = fatura.tipo === 'fechamento'
    ? `<strong style="color:#111827;">Vencimento: dia ${fatura.due_day}.</strong> Confira os lançamentos da fatura e organize o pagamento dentro do prazo pra evitar juros.`
    : `<strong style="color:#111827;">Hoje é o último dia.</strong> Pague até o fim do dia pra evitar juros e multa por atraso.`

  return `
<div style="margin:0; padding:56px 16px; background:#FFFFFF; font-family:Arial, Helvetica, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
    style="max-width:520px; margin:0 auto; background:#FFFFFF;">

    <tr>
      <td>
        <div style="margin-top:14px; font-size:26px; line-height:1.2; font-weight:700; color:#2563EB; letter-spacing:-0.6px;">
          Velto Finance
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding:24px 0 30px;">
        <p style="margin:0; font-size:14px; line-height:1.6; color:#7A7F87;">
          Olá, <strong style="color:#111827;">${fatura.user_email}</strong>. ${mensagemPrincipal}
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding:0 0 28px;">
        <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:10px; padding:14px 16px;">
          <p style="margin:0; font-size:14px; line-height:1.55; color:#475569;">
            ${mensagemDestaque}
          </p>
        </div>
      </td>
    </tr>

    <tr>
      <td style="text-align:center; padding:0 0 34px;">
        <a href="https://veltofinance.bid/cartoes"
          style="display:inline-block; background:#2563EB; color:#FFFFFF; text-decoration:none;
          padding:12px 30px; border-radius:9px; font-size:14px; font-weight:600;">
          Ver fatura
        </a>
      </td>
    </tr>

    <tr>
      <td style="padding:0 0 28px;">
        <p style="margin:0; font-size:14px; line-height:1.55; color:#7A7F87;">
          Se você já pagou ou organizou tudo, pode ignorar este e-mail — é só um lembrete automático.
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding-top:22px; border-top:1px solid #EEF2F7;">
        <p style="margin:0; font-size:12px; line-height:1.5; color:#9CA3AF;">
          Você recebeu este e-mail porque tem uma fatura ativa cadastrada no Velto Finance.
        </p>
      </td>
    </tr>

  </table>
</div>
`
}