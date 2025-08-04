const mangoData = {
  fazli: { price: 70,},
  langra : {price:80,},
  himshagar : {price:85,},
  gopalvog : {price:80,},
  amrupali : {price:85,},
  bari : {price:85,},
  bananamango : {price:130,},
  gouromoti : {price:130,},
  katimon : {price:140,},


};
function updateMangoInfo() {
    const type = document.getElementById("mangoType").value;
    document.getElementById("pricePerKg").textContent = mangoData[type].price;
    document.getElementById("mangoImage").src = mangoData[type].image;
    calculateTotal();
}
function calculateTotal() {
    const type = document.getElementById("mangoType").value;
    const qty = parseInt(document.getElementById("quantity").value);
    const total = qty * mangoData[type].price;
    document.getElementById("totalPrice").textContent = total;
}

function confirmOrder() {
    const type = document.getElementById("mangoType").value;
    const qty = parseInt(document.getElementById("quantity").value);
    const total = qty * mangoData[type].price;
    alert(`আপনি ${qty} কেজি ${type} আম কিনেছেন। মোট দাম: ${total} টাকা`);
}

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const mobile = document.getElementById("mobile").value;
  const address = document.getElementById("address").value;
  const note = document.getElementById("note").value;
  const mango = document.getElementById("mangoType").value;
  const quantity = document.getElementById("quantity").value;

  const message = `নাম: ${name}%0aমোবাইল: ${mobile}%0aঠিকানা: ${address}%0aআমের জাত: ${mango}%0aপরিমাণ: ${quantity} কেজি%0aমন্তব্য: ${note}`;
  const url = `https://wa.me/8801911976731?text=${message}`;
  window.open(url, "_blank");
});

