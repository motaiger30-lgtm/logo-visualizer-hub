export const WHATSAPP_NUMBER = "201008333287";

export type QuoteSelection = {
  category?: string;
  product?: string;
  color?: string;
  quantity?: number;
  unitPriceEgp?: number;
  totalEgp?: number;
  designUrl?: string;
};

export function buildWhatsAppUrl(sel: QuoteSelection) {
  const lines = [
    "Hi Urgent Advertising 👋",
    "I'd like a quote for:",
    sel.category && `• Category: ${sel.category}`,
    sel.product && `• Product: ${sel.product}`,
    sel.color && `• Color: ${sel.color}`,
    sel.quantity && `• Quantity: ${sel.quantity}`,
    sel.unitPriceEgp && `• Unit price: ${sel.unitPriceEgp.toFixed(2)} EGP`,
    sel.totalEgp && `• Total: ${sel.totalEgp.toFixed(2)} EGP`,
    sel.designUrl && `• Design preview: ${sel.designUrl}`,
  ].filter(Boolean);
  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
