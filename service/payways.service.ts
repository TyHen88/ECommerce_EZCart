import axios from "axios";

const ServiceId = {
  PAYWAYS: "/api/payway/purchase",
  GENERATE_QR: "/api/payway/generate-qr",
};

async function payway(payload: any) {
  return await axios.post(ServiceId.PAYWAYS, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    responseType: "json",
    validateStatus: () => true,
  });
}

async function generateQr(payload: any) {
  return await axios.post(ServiceId.GENERATE_QR, payload, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    responseType: "json",
    validateStatus: () => true,
  });
}

export const paywaysService = {
  payway,
  generateQr,
};
