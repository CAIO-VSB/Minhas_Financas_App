<script lang="ts" setup>

  // Importações logo bancos
  import BancoNubankLogo from "../public/banks/banco-nubank-logo.svg"
  import BancoBrasilLogo from "../public/banks/banco-bb-logo.png"
  import BancoAmericanExpressLogo from "../public/banks/amex-logo.png"
  import BancoBradescoLogo from "../public/banks/banco-bradesco-logo.png"
  import BancoBmgLogo from "../public/banks/banco-bmg-logo.png"
  import BancoC6Logo from "../public/banks/banco-c6-logo.png"
  import BancoCaixaLogo from "../public/banks/banco-caixa-logo.png"
  import BancoInterLogo from "../public/banks/banco-inter-logo.png"
  import BancoItauLogo from "../public/banks/banco-itau-logo.png"
  import BancoItiLogo from "../public/banks/banco-iti-logo.png"
  import BancoMercadoPagoLogo from "../public/banks/banco-mercado-pago-logo.png"
  import BancoPicPayLogo from "../public/banks/banco-pic-pay-logo.png"
  import BancoSantanderLogo from "../public/banks/banco-santander-logo.png"
  import BancoSicrediLogo from "../public/banks/banco-sicredi-logo.png"
  import BancoSofisaLogo from "../public/banks/banco-sofisa-logo.png"
  import BancoWillLogo from "../public/banks/banco-will-logo.png"
  import BancoXpLogo from "../public/banks/banco-xp-logo.png"

  // Importações logos bandeiras
  import EloLogo from "../public/banks/elo-logo.png"
  import HiperCardLogo from "../public/banks/hipercard-logo.png"
  import MasterCardLogo from "../public/banks/mastercard-logo.png"
  import VisaLogo from "../public/banks/visa-logo.png"

  // Importações logos genericas
  import BancoGenericoLogo from "../public/banks/generic-bank-logo.jpg"
  import CarteiraGenericaLogo from "../public/banks/carteira-generic-logo.jpg"
  import ManGenericLogo from "../public/banks/man-generic-logo.jpg"
  import CofreGenericLogo from "../public/banks/cofre-generic-logo.jpg"

  import { useSelectedBank } from "~/composables/useAccount/useSelectedBank"

  // Lista contendo todos os bancos, value e tipo 
  const banks = [
  {avatar: BancoBrasilLogo, text: "Banco do Brasil", value: "BancoBB", type: "instituicoes", url: "/banks/banco-bb-logo.png"},

  {avatar: BancoNubankLogo, text: "Banco Nubank", value: "BancoNu", type: "instituicoes", url: "/banks/banco-nubank-logo.svg"},

  {avatar: BancoBmgLogo, text: "Banco BMG", value: "BancoBmg", type: "instituicoes", url: "/banks/banco-bmg-logo.png"},

  {avatar: BancoBradescoLogo, text: "Banco Bradesco", value: "BancoBradesco", type: "instituicoes", url: "/banks/banco-bradesco-logo.png"},

  {avatar: BancoC6Logo, text: "Banco C6", value: "BancoC6", type: "instituicoes", url: "/banks/banco-c6-logo.png"},

  {avatar: BancoCaixaLogo, text: "Banco Caixa", value: "BancoCaixa", type: "instituicoes", url: "/banks/banco-caixa-logo.png"},

  {avatar: BancoInterLogo, text: "Banco Inter", value: "BancoInter", type: "instituicoes", url: "/banks/banco-inter-logo.png"},

  {avatar: BancoItauLogo, text: "Banco Itaú", value: "BancoItau", type: "instituicoes", url: "/banks/banco-itau-logo.png"},

  {avatar: BancoItiLogo, text: "Banco ITI", value: "BancoIti", type: "instituicoes", url: "/banks/banco-iti-logo.png"},

  {avatar: BancoMercadoPagoLogo, text: "Banco Mercado Pago", value: "BancoMercadoPago", type: "instituicoes", url: "/banks/banco-mercado-pago-logo.png"},

  {avatar: BancoPicPayLogo, text: "Banco PicPay", value: "BancoPicPay", type: "instituicoes", url: "/banks/banco-pic-pay-logo.png"},

  {avatar: BancoSantanderLogo, text: "Banco Santander", value: "BancoSantander",  type: "instituicoes", url: "/banks/banco-santander-logo.png"},

  {avatar: BancoSicrediLogo, text: "Banco Sicredi", value: "BancoSicredi", type: "instituicoes", url: "/banks/banco-sicredi-logo.png"},

  {avatar: BancoSofisaLogo, text: "Banco Sofisa", value: "BancoSofisa", type: "instituicoes", url: "/banks/banco-sofisa-logo.png"},

  {avatar: BancoWillLogo, text: "Banco Will", value: "BancoWill", type: "instituicoes", url: "/banks/banco-will-logo.png"},

  {avatar: BancoXpLogo, text: "Banco Xp Investimentos", value: "BancoXp", type: "instituicoes", url: "/banks/banco-xp-logo.png"},

  {avatar: BancoAmericanExpressLogo, text: "Banco American Express", value: "AmericanExpress", type: "instituicoes", url: "/banks/amex-logo.png"},

  {avatar: EloLogo, text: "Elo", value: "Elo", type: "bandeiras", url: "public/banks/elo-logo.png"},

  {avatar: HiperCardLogo, text: "HiperCard", value: "HiperCard", type: "bandeiras", url: "/banks/hipercard-logo.png"},

  {avatar: MasterCardLogo, text: "MasterCard", value: "MasterCard", type: "bandeiras", url: "/banks/mastercard-logo.png"},
  
  {avatar: VisaLogo, text: "Visa", value: "Visa", type: "bandeiras", url: "/banks/visa-logo.png"},

  {avatar: BancoGenericoLogo, text: "Banco", value: "BancoGeneric", type: "generics", url: "/banks/generic-bank-logo.jpg"},

  {avatar: CarteiraGenericaLogo, text: "Carteira", value: "CarteiraGeneric", type: "generics", url: "/banks/carteira-generic-logo.jpg"},

  {avatar: ManGenericLogo, text: "Man", value: "ManGeneric", type: "generic", url: "/banks/man-generic-logo.jpg"},

  {avatar: CofreGenericLogo, text: "Cofre", value: "CofreGeneric", type: "generics", url: "/banks/cofre-generic-logo.jpg"},
  ]

  const { selectdBank } = useSelectedBank()

  const dialogFilter = ref(false)
  const valueEntered = ref("")
  const radios = ref("")
  const currentRadio = ref("")
  const loading = ref(false)

  function selectdItem(bank_name: string, avatar: string, url_avatar: string) {
    selectdBank(bank_name, avatar, url_avatar)
  }

  watch(radios, (newValue: string) => {
    currentRadio.value = newValue
    dialogFilter.value = false
  })

  watch(valueEntered, () => {
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 2000);
  })

  const finalData = computed(() => {
    return banks.filter(item => {
      const onlyText = item.text.toLowerCase().includes(valueEntered.value.toLowerCase())
      const onlyRadio = item.type.toLowerCase().includes(currentRadio.value.toLowerCase())
      return onlyText && onlyRadio
    })
  })

  const modelValue = defineModel<boolean>()


</script>

<template>
  <div class="text-center pa-4">
    <v-dialog
      v-model="modelValue"
      max-width="600"
      min-height="600"
      persistent
    >

      <v-card
        class="mx-auto"
        width="360"
      >
        <v-toolbar>
          <v-toolbar-title class="title-card">Selecione uma instituição financeira</v-toolbar-title>
        </v-toolbar>

        <div>
            <v-text-field
                color="blue"
                :loading="loading"
                label="Buscar…"
                class="!p-4"
                prepend-inner-icon="mdi-magnify"
                v-model="valueEntered"
            >
            <template #append-inner>
                <v-btn
                text="Fechar"
                icon="mdi-filter"
                variant="text"
                @click="dialogFilter = true"
                >
                </v-btn>
            </template>
            </v-text-field>
        </div>

        <v-divider></v-divider>

        <v-list
          lines="two"
          item-props
          activatable
          >

          <v-list-item
            v-for="(item, i) in finalData"
            :key="i"
            rounded="xl"
            @click="selectdItem(item.text, item.avatar, item.url)"
          >

          <template v-slot:prepend>
            <v-avatar :image="item.avatar" size="54"></v-avatar>
          </template>

          <v-list-item-title class="item-text">{{ item.text }}</v-list-item-title>
          
          </v-list-item>

        </v-list>
    </v-card>

  </v-dialog>

  <v-dialog
      v-model="dialogFilter"
      max-width="250"
    >
      <v-card title="Filtro">

        <v-radio-group v-model="radios">
          <v-radio label="Instituições Financeiras" value="instituicoes" ></v-radio>
          <v-radio label="Bandeiras Cartão" value="bandeiras"></v-radio>
          <v-radio label="Ícones Genéricos" value="generics"></v-radio>
        </v-radio-group>

      </v-card>
    </v-dialog>

  </div>

</template>

<style scoped>

.container-icons {
  padding: 5px;
  height: 100vh;
}

.item-text {
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  color: #AFB1AC;
}

.title-card {
  font-family: "Poppins", sans-serif;
  font-size: 1rem;
}

::v-deep(.v-selection-control .v-label ) {
  font-family: "Poppins", sans-serif;
  font-size: 0.85rem;
}

::v-deep(.v-card-item .v-card-title ) {
  font-family: "Poppins", sans-serif;
  font-size: 1.3rem;
}
</style> 