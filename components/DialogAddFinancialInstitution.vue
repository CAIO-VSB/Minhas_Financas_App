<script lang="ts" setup>

    // Importações logo bancos
    import BancoNubankLogo from "~/assets/banks/banco-nubank-logo.svg"
    import BancoBrasilLogo from "~/assets/banks/banco-bb-logo.png"
    import BancoAmericanExpressLogo from "~/assets/banks/amex-logo.png"
    import BancoBradescoLogo from "~/assets/banks/banco-bradesco-logo.png"
    import BancoBmgLogo from "~/assets/banks/banco-bmg-logo.png"
    import BancoC6Logo from "~/assets/banks/banco-c6-logo.png"
    import BancoCaixaLogo from "~/assets/banks/banco-caixa-logo.png"
    import BancoInterLogo from "~/assets/banks/banco-inter-logo.png"
    import BancoItauLogo from "~/assets/banks/banco-itau-logo.png"
    import BancoItiLogo from "~/assets/banks/banco-iti-logo.png"
    import BancoMercadoPagoLogo from "~/assets/banks/banco-mercado-pago-logo.png"
    import BancoPicPayLogo from "~/assets/banks/banco-pic-pay-logo.png"
    import BancoSantanderLogo from "~/assets/banks/banco-santander-logo.png"
    import BancoSicrediLogo from "~/assets/banks/banco-sicredi-logo.png"
    import BancoSofisaLogo from "~/assets/banks/banco-sofisa-logo.png"
    import BancoWillLogo from "~/assets/banks/banco-will-logo.png"
    import BancoXpLogo from "~/assets/banks/banco-xp-logo.png"

    // Importações logos bandeiras
    import EloLogo from "~/assets/banks/elo-logo.png"
    import HiperCardLogo from "~/assets/banks/hipercard-logo.png"
    import MasterCardLogo from "~/assets/banks/mastercard-logo.png"
    import VisaLogo from "~/assets/banks/visa-logo.png"

    // Importações logos genericas
    import BancoGenericoLogo from "~/assets/banks/generic-bank-logo.jpg"
    import CarteiraGenericaLogo from "~/assets/banks/carteira-generic-logo.jpg"
    import ManGenericLogo from "~/assets/banks/man-generic-logo.jpg"
    import CofreGenericLogo from "~/assets/banks/cofre-generic-logo.jpg"


    // Lista contendo todos os bancos, value e tipo 
    const banks = [
    {avatar: BancoBrasilLogo, text: "Banco do Brasil", value: "BancoBB", type: "instituicoes"},
    {avatar: BancoNubankLogo, text: "Banco Nubank", value: "BancoNu", type: "instituicoes"},
    {avatar: BancoBmgLogo, text: "Banco BMG", value: "BancoBmg", type: "instituicoes"},
    {avatar: BancoBradescoLogo, text: "Banco Bradesco", value: "BancoBradesco", type: "instituicoes"},
    {avatar: BancoC6Logo, text: "Banco C6", value: "BancoC6", type: "instituicoes"},
    {avatar: BancoCaixaLogo, text: "Banco Caixa", value: "BancoCaixa", type: "instituicoes"},
    {avatar: BancoInterLogo, text: "Banco Inter", value: "BancoInter", type: "instituicoes"},
    {avatar: BancoItauLogo, text: "Banco Itaú", value: "BancoItau", type: "instituicoes"},
    {avatar: BancoItiLogo, text: "Banco ITI", value: "BancoIti", type: "instituicoes"},
    {avatar: BancoMercadoPagoLogo, text: "Banco Mercado Pago", value: "BancoMercadoPago", type: "instituicoes"},
    {avatar: BancoPicPayLogo, text: "Banco PicPay", value: "BancoPicPay", type: "instituicoes"},
    {avatar: BancoSantanderLogo, text: "Banco Santander", value: "BancoSantander",  type: "instituicoes"},
    {avatar: BancoSicrediLogo, text: "Banco Sicredi", value: "BancoSicredi", type: "instituicoes"},
    {avatar: BancoSofisaLogo, text: "Banco Sofisa", value: "BancoSofisa", type: "instituicoes"},
    {avatar: BancoWillLogo, text: "Banco Will", value: "BancoWill", type: "instituicoes"},
    {avatar: BancoXpLogo, text: "Banco Xp Investimentos", value: "BancoXp", type: "instituicoes"},
    {avatar: BancoAmericanExpressLogo, text: "Banco American Express", value: "AmericanExpress", type: "instituicoes"},
    {avatar: EloLogo, text: "Elo", value: "Elo", type: "bandeiras"},
    {avatar: HiperCardLogo, text: "HiperCard", value: "HiperCard", type: "bandeiras"},
    {avatar: MasterCardLogo, text: "MasterCard", value: "MasterCard", type: "bandeiras"},
    {avatar: VisaLogo, text: "Visa", value: "Visa", type: "bandeiras"},
    {avatar: BancoGenericoLogo, text: "Banco", value: "BancoGeneric", type: "generics"},
    {avatar: CarteiraGenericaLogo, text: "Carteira", value: "CarteiraGeneric", type: "generics"},
    {avatar: ManGenericLogo, text: "Man", value: "ManGeneric", type: "generic"},
    {avatar: CofreGenericLogo, text: "Cofre", value: "CofreGeneric", type: "generics"},
    ]

    // Controla a abertura dos dialog
    const dialogMain = ref(true)
    const dialogFilter = ref(false)

    const currentBank = ref("")
    const currentAvatar = ref("")
    const valueEntered = ref("")
    const loading = ref(false)
    const radios = ref("")
    const currentRadio = ref("")

    function selectdBank(banco: string, avatar: string) {
        currentBank.value = banco 
        currentAvatar.value = avatar 
        dialogMain.value = false
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

</script>

<template>
  <div class="text-center pa-4">
    <v-btn @click="dialogMain = true">
      Open Dialog
    </v-btn>

    <v-dialog
      v-model="dialogMain"
      max-width="600"
      min-height="600"
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
            @click="selectdBank(item.value, item.avatar)"
          >

          <template v-slot:prepend>
            <v-avatar :image="item.avatar" size="54"></v-avatar>
          </template>

          <v-list-item-title class="item-text" v-text="item.text"></v-list-item-title>
          
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