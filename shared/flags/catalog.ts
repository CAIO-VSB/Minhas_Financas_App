import amexLogo from "~~/public/flags/american-logo.png"
import eloLogo from "~~/public/flags/elo-logo.png"
import hiperLogo from "~~/public/flags/hiper-logo.png"
import masterLogo from "~~/public/flags/master-logo.png"
import outraLogo from "~~/public/flags/outra-logo.png"
import visaLogo from "~~/public/flags/visa-logo.png"

const flags = [

    {avatar: masterLogo, text: "MasterCard", value: "master", type: "banderia", url: "/flags/master-logo.png"},
    {avatar: eloLogo, text: "Elo", value: "elo", type: "banderia", url: "/flags/elo-logo.png"},
    {avatar: visaLogo, text: "Visa", value: "visa", type: "banderia", url: "/flags/visa-logo.png"},
    {avatar: amexLogo, text: "American Express", value: "amex", type: "banderia", url: "/flags/american-logo.png"},
    {avatar: hiperLogo, text: "HiperCard", value: "hiper", type: "banderia", url: "/flags/hiper-logo.png"},
    {avatar: outraLogo, text: "Outra bandeira", value: "outra", type: "banderia", url: "/flags/outra-logo.png"},

]

export default flags