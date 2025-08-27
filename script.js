// === Config ===
// WhatsApp নম্বরে অবশ্যই কান্ট্রি কোডসহ দিন (BD = +880, এবং লিডিং 0 বাদ)
const WHATSAPP_NUMBER = "8801772177770";

// বাংলাদেশি মোবাইল নাম্বার ভ্যালিডেশন (11 digit, 013-019 সিরিজ)
const BD_PHONE_REGEX = /^01[3-9]\d{8}$/;

// Helper: টাকার ফরম্যাট
const money = (n) => new Intl.NumberFormat("bn-BD").format(n);

// প্রতি কেজির দাম বের করা (select option এর data-price থেকে)
function getSelectedPrice() {
  const sel = document.getElementById("variety");
  const opt = sel.options[sel.selectedIndex];
  if (!opt || !opt.dataset.price) return null;
  return parseInt(opt.dataset.price, 10);
}

// মোট হিসাব আপডেট
function updateTotals() {
  const price = getSelectedPrice();
  const qty = parseInt(document.getElementById("qty").value || "0", 10);

  document.getElementById("pricePerKg").textContent =
    price ? money(price) : "—";

  const total = price && qty ? price * qty : 0;
  document.getElementById("totalAmount").textContent =
    total ? money(total) : "—";
}

// Error UI
function setError(field, msg) {
  const el = document.querySelector(`.error[data-err-for="${field}"]`);
  if (el) el.textContent = msg || "";
}
function clearErrors() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}

// Form Submit
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("orderForm");
  const variety = document.getElementById("variety");
  const qty = document.getElementById("qty");

  // live total update
  ["change", "input"].forEach((ev) => {
    variety.addEventListener(ev, updateTotals);
    qty.addEventListener(ev, updateTotals);
  });
  updateTotals();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const note = document.getElementById("note").value.trim();
    const varietyName = variety.value;
    const price = getSelectedPrice();
    const quantity = parseInt(qty.value || "0", 10);

    // validations
    let valid = true;

    if (!name) { setError("name", "নাম লিখুন"); valid = false; }
    if (!BD_PHONE_REGEX.test(phone)) {
      setError("phone", "সঠিক বাংলাদেশি নাম্বার লিখুন (11 ডিজিট)");
      valid = false;
    }
    if (!address) { setError("address", "ঠিকানা লিখুন"); valid = false; }
    if (!varietyName) { setError("variety", "একটি জাত নির্বাচন করুন"); valid = false; }
    if (!quantity || quantity < 12) {
      setError("qty", "কমপক্ষে ১২ কেজি দিতে হবে");
      valid = false;
    }
    if (!price) { setError("variety", "দামের জন্য জাত নির্বাচন করুন"); valid = false; }

    if (!valid) return;

    // WhatsApp message compose
    const total = price * quantity;

    const lines = [
      "🟢 *Green Mango Hub — নতুন অর্ডার*",
      `👤 নাম: ${name}`,
      `📱 মোবাইল: ${phone}`,
      `🏠 ঠিকানা: ${address}`,
      `🥭 আমের জাত: ${varietyName}`,
      `💵 প্রতি কেজি: ৳${price}`,
      `⚖️ পরিমাণ: ${quantity} কেজি`,
      `🧮 মোট মূল্য (আনুমানিক): ৳${total}`,
      note ? `📝 মন্তব্য: ${note}` : null,
      "",
      "দয়া করে কনফার্ম করুন। ধন্যবাদ।",
    ].filter(Boolean);

    const encoded = encodeURIComponent(lines.join("\n"));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    // open WhatsApp
    window.open(url, "_blank", "noopener,noreferrer");
  });
});
