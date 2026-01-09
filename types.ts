
export interface BriefingData {
  salesModel: string[];
  paymentChannel: string;
  paymentMethods: string[];
  delivery: string[];
  productType: string[];
  productQuantity: string;
  expectations: string[];
  otherExpectation: string;
  style: string[];
  contact: {
    name: string;
    instagram: string;
    whatsapp: string;
    email: string;
  };
}

export enum Step {
  INTRO = 0,
  SALES_MODEL = 1,
  PAYMENT = 2,
  DELIVERY = 3,
  PRODUCTS = 4,
  QUANTITY = 5,
  EXPECTATIONS = 6,
  STYLE = 7,
  CONTACT = 8,
  SUMMARY = 9
}
