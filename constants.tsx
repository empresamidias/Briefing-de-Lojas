
import React from 'react';

export const SALES_MODELS = [
  "Quero que a pessoa compre e pague direto no site",
  "Quero que a pessoa escolha os produtos no site e finalize pelo WhatsApp",
  "Quero usar o site só como vitrine, e vender pelo WhatsApp",
  "Ainda não sei, quero orientação"
];

export const PAYMENT_CHANNELS = [
  { id: 'site', label: "Pagamento direto no site" },
  { id: 'whatsapp', label: "Pagamento pelo WhatsApp" },
  { id: 'unsure', label: "Ainda não sei" }
];

export const SITE_PAYMENT_METHODS = [
  "Cartão de crédito",
  "Pix",
  "Boleto"
];

export const WA_PAYMENT_METHODS = [
  "Pix (envio da chave pelo WhatsApp)",
  "Cartão de crédito (link de pagamento enviado pelo WhatsApp)",
  "Outro combinado pelo WhatsApp"
];

export const DELIVERY_OPTIONS = [
  "Eu mesma faço a entrega",
  "Envio pelos Correios",
  "Uso transportadora",
  "Combinar entrega pelo WhatsApp"
];

export const PRODUCT_VARIATIONS = [
  "Tamanhos diferentes (P, M, G…)",
  "Cores diferentes",
  "Kits ou conjuntos",
  "Produto único (sem variação)"
];

export const QUANTITY_OPTIONS = [
  "Poucos (até 10)",
  "Médio (10 a 30)",
  "Muitos (30+)",
  "Vou adicionar aos poucos"
];

export const EXPECTATIONS = [
  "Vender mais",
  "Passar mais profissionalismo",
  "Facilitar pedidos",
  "Parar de responder tudo manualmente no WhatsApp"
];

export const STYLE_OPTIONS = [
  "Clean",
  "Fitness / energético",
  "Feminino",
  "Luxo / premium",
  "Quero algo parecido com meu Instagram"
];
