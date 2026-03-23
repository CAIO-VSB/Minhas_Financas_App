  // Lista contendo todos os bancos, value e tipo 
  import BancoNubankLogo from "~~/public/logos-banks/banco-nubank-logo.svg"
  import BancoBrasilLogo from "~~/public/logos-banks/banco-bb-logo.png"
  import BancoAmericanExpressLogo from "~~/public/logos-banks/amex-logo.png"
  import BancoBradescoLogo from "~~/public/logos-banks/banco-bradesco-logo.png"
  import BancoBmgLogo from "~~/public/logos-banks/banco-bmg-logo.png"
  import BancoC6Logo from "~~/public/logos-banks/banco-c6-logo.png"
  import BancoCaixaLogo from "~~/public/logos-banks/banco-caixa-logo.png"
  import BancoInterLogo from "~~/public/logos-banks/banco-inter-logo.png"
  import BancoItauLogo from "~~/public/logos-banks/banco-itau-logo.png"
  import BancoItiLogo from "~~/public/logos-banks/banco-iti-logo.png"
  import BancoMercadoPagoLogo from "~~/public/logos-banks/banco-mercado-pago-logo.png"
  import BancoPicPayLogo from "~~/public/logos-banks/banco-pic-pay-logo.png"
  import BancoSantanderLogo from "~~/public/logos-banks/banco-santander-logo.png"
  import BancoSicrediLogo from "~~/public/logos-banks/banco-sicredi-logo.png"
  import BancoSofisaLogo from "~~/public/logos-banks/banco-sofisa-logo.png"
  import BancoWillLogo from "~~/public/logos-banks/banco-will-logo.png"
  import BancoXpLogo from "~~/public/logos-banks/banco-xp-logo.png"

  // Importações logos bandeiras
  import EloLogo from "~~/public/logos-banks/elo-logo.png"
  import HiperCardLogo from "~~/public/logos-banks/hipercard-logo.png"
  import MasterCardLogo from "~~/public/logos-banks/mastercard-logo.png"
  import VisaLogo from "~~/public/logos-banks/visa-logo.png"

  // Importações logos genericas
  import BancoGenericoLogo from "~~/public/logos-banks/generic-bank-logo.jpg"
  import CarteiraGenericaLogo from "~~/public/logos-banks/carteira-generic-logo.jpg"
  import ManGenericLogo from "~~/public/logos-banks/man-generic-logo.jpg"
  import CofreGenericLogo from "~~/public/logos-banks/cofre-generic-logo.jpg"

  const banks = [
    {avatar: BancoBrasilLogo, text: "Banco do Brasil", value: "BancoBB", type: "instituicoes", url: "/logos-banks/banco-bb-logo.png"},

    {avatar: BancoNubankLogo, text: "Banco Nubank", value: "BancoNu", type: "instituicoes", url: "/logos-banks/banco-nubank-logo.svg"},

    {avatar: BancoBmgLogo, text: "Banco BMG", value: "BancoBmg", type: "instituicoes", url: "/logos-banks/banco-bmg-logo.png"},

    {avatar: BancoBradescoLogo, text: "Banco Bradesco", value: "BancoBradesco", type: "instituicoes", url: "/logos-banks/banco-bradesco-logo.png"},

    {avatar: BancoC6Logo, text: "Banco C6", value: "BancoC6", type: "instituicoes", url: "/logos-banks/banco-c6-logo.png"},

    {avatar: BancoCaixaLogo, text: "Banco Caixa", value: "BancoCaixa", type: "instituicoes", url: "/logos-banks/banco-caixa-logo.png"},

    {avatar: BancoInterLogo, text: "Banco Inter", value: "BancoInter", type: "instituicoes", url: "/logos-banks/banco-inter-logo.png"},

    {avatar: BancoItauLogo, text: "Banco Itaú", value: "BancoItau", type: "instituicoes", url: "/logos-banks/banco-itau-logo.png"},

    {avatar: BancoItiLogo, text: "Banco ITI", value: "BancoIti", type: "instituicoes", url: "/logos-banks/banco-iti-logo.png"},

    {avatar: BancoMercadoPagoLogo, text: "Banco Mercado Pago", value: "BancoMercadoPago", type: "instituicoes", url: "logos-banks/banco-mercado-pago-logo.png"},

    {avatar: BancoPicPayLogo, text: "Banco PicPay", value: "BancoPicPay", type: "instituicoes", url: "/logos-banks/banco-pic-pay-logo.png"},

    {avatar: BancoSantanderLogo, text: "Banco Santander", value: "BancoSantander",  type: "instituicoes", url: "/logos-banks/banco-santander-logo.png"},

    {avatar: BancoSicrediLogo, text: "Banco Sicredi", value: "BancoSicredi", type: "instituicoes", url: "/logos-banks/banco-sicredi-logo.png"},

    {avatar: BancoSofisaLogo, text: "Banco Sofisa", value: "BancoSofisa", type: "instituicoes", url: "/logos-banks/banco-sofisa-logo.png"},

    {avatar: BancoWillLogo, text: "Banco Will", value: "BancoWill", type: "instituicoes", url: "/logos-banks/banco-will-logo.png"},

    {avatar: BancoXpLogo, text: "Banco Xp Investimentos", value: "BancoXp", type: "instituicoes", url: "/logos-banks/banco-xp-logo.png"},

    {avatar: BancoAmericanExpressLogo, text: "Banco American Express", value: "AmericanExpress", type: "instituicoes", url: "/logos-banks/amex-logo.png"},

    {avatar: EloLogo, text: "Elo", value: "Elo", type: "bandeiras", url: "public/logos-banks/elo-logo.png"},

    {avatar: HiperCardLogo, text: "HiperCard", value: "HiperCard", type: "bandeiras", url: "/logos-banks/hipercard-logo.png"},

    {avatar: MasterCardLogo, text: "MasterCard", value: "MasterCard", type: "bandeiras", url: "/logos-banks/mastercard-logo.png"},
    
    {avatar: VisaLogo, text: "Visa", value: "Visa", type: "bandeiras", url: "/logos-banks/visa-logo.png"},

    {avatar: BancoGenericoLogo, text: "Banco", value: "BancoGeneric", type: "generics", url: "/logos-banks/generic-bank-logo.jpg"},

    {avatar: CarteiraGenericaLogo, text: "Carteira", value: "CarteiraGeneric", type: "generics", url: "/logos-banks/carteira-generic-logo.jpg"},

    {avatar: ManGenericLogo, text: "Man", value: "ManGeneric", type: "generic", url: "/logos-banks/man-generic-logo.jpg"},

    {avatar: CofreGenericLogo, text: "Cofre", value: "CofreGeneric", type: "generics", url: "/logos-banks/cofre-generic-logo.jpg"},
  ]

  export default banks