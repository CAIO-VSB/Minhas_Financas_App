import { defineStore } from "pinia"
import type { TMovements } from "../../types/movements/TMovements"
import type { TRecurrence } from "../../types/recurrence/TRecurrence"
import type { TRecurrencePayload } from "~~/schemas/recurrence.schema"
import type { TMovementCreditCard } from "../../types/credit_card/TMovementCreditCard"
import { RRule } from "rrule"

export const useRecurrenceStore = defineStore("recurrence", () => {

  const mapFrequency: Record<string, number> = {
    "Dias": RRule.DAILY,
    "Semanas": RRule.WEEKLY,
    "Meses": RRule.MONTHLY,
    "Anos": RRule.YEARLY,
  }

  const movementsFormated = async (movements: TMovements, recurrence: TRecurrence) => {

    if (!recurrence.day_maturity) {
      throw new Error("A data de vencimento é obrigatória.")
    }
    if (!recurrence.value_recurrence) {
      throw new Error("O valor da recorrência é obrigatório.")
    }

    const maturity = dateToDateOnly(recurrence.day_maturity!)
    const dtstart = dateOnlyToRRuleDate(maturity)

    if (recurrence.type_recurrence === "fixa") {
      const ruleFixed = new RRule({
        freq: RRule.MONTHLY,
        interval: 1,
        dtstart,
        count: 12
      })

      const movementsFixes = ruleFixed.all().map((data) => ({
        ...movements,
        date_transaction: rruleDateToDateOnly(data),
        status_transaction: "pendente"
      }))

      const recurrenceFormated = {
        ...recurrence,
        day_maturity: maturity,
        frequency_recurrence: "null",
        total_installments: null
      }

      return await $fetch<TRecurrencePayload>("/api/recurrence", {
        method: "POST",
        body: {
          recurrence: recurrenceFormated,
          movements: movementsFixes,
        },
      })
    }

    if (recurrence.type_recurrence === "parcelada") {

      const freq = mapFrequency[recurrence.frequency_recurrence ?? ""]

      const ruleInstallments = new RRule({
        freq,
        interval: 1,
        dtstart,
        count: recurrence.total_installments
      })

      const valueFractionated = Number((recurrence.value_recurrence! / recurrence.total_installments!)).toFixed(2)

      const movementsInstallments = ruleInstallments.all().map((data) => ({
        ...movements,
        value_transaction: Number(valueFractionated),
        date_transaction: rruleDateToDateOnly(data),
        status_transaction: "pendente"
      }))

      const recurrenceFormated = {
        ...recurrence,
        day_maturity: maturity
      }

      return await $fetch<TRecurrencePayload>("/api/recurrence/movements", {
        method: "POST",
        body: {
          recurrence: recurrenceFormated,
          movements: movementsInstallments
        }
      })
    }
  }

  const movementsCreditCardFormated = async (movementsCreditCard: TMovementCreditCard, recurrence: TRecurrence) => {

    if (!recurrence.day_maturity) {
      throw new Error("A data de vencimento é obrigatória.")
    }
    if (!recurrence.value_recurrence) {
      throw new Error("O valor da recorrência é obrigatório.")
    }

    const datePurchase = dateToDateOnly(recurrence.day_maturity!)
    const dtstart = dateOnlyToRRuleDate(datePurchase)

    if (recurrence.type_recurrence === "fixa") {
      const ruleFixed = new RRule({
        freq: RRule.MONTHLY,
        interval: 1,
        dtstart,
        count: 12
      })

      const movementsCreditCardFixes = ruleFixed.all().map((data) => ({
        ...movementsCreditCard,
        date_transaction: rruleDateToDateOnly(data),
      }))

      const recurrenceFormated = {
        ...recurrence,
        day_maturity: datePurchase,
        frequency_recurrence: "null",
        total_installments: null
      }

      return await $fetch<TRecurrencePayload>("/api/recurrence/credit-card", {
        method: "POST",
        body: {
          recurrence: recurrenceFormated,
          movements: movementsCreditCardFixes,
        },
      })
    }

    if (recurrence.type_recurrence === "parcelada") {

      const freq = mapFrequency[recurrence.frequency_recurrence ?? ""]

      const ruleInstallments = new RRule({
        freq,
        interval: 1,
        dtstart,
        count: recurrence.total_installments
      })

      const valueFractionated = Number((recurrence.value_recurrence! / recurrence.total_installments!)).toFixed(2)

      const movementsCreditCardInstallments = ruleInstallments.all().map((data) => ({
        ...movementsCreditCard,
        value_transaction: Number(valueFractionated),
        date_transaction: rruleDateToDateOnly(data),
      }))

      const recurrenceFormated = {
        ...recurrence,
        day_maturity: datePurchase
      }

      return await $fetch<TRecurrencePayload>("/api/recurrence", {
        method: "POST",
        body: {
          recurrence: recurrenceFormated,
          movements: movementsCreditCardInstallments
        }
      })
    }
  }

  return { movementsFormated, movementsCreditCardFormated }

})