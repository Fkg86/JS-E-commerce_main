const categoryList = document.querySelector(".categories");
const productList = document.querySelector(".products");
const modal = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const modalInfo = document.querySelector("#modal-info");

document.addEventListener("DOMContentLoaded", () => {
  //callback icerisinde farkli fonksiyonlar calistirir.)
  fetchCategories();
  fetchProduct();
});

function fetchCategories() {
  //*veri cekme istegi atma
  fetch("https://api.escuelajs.co/api/v1/categories")
    //*gelen veriyi isleme
    .then((res) => res.json())
    //*islenen veriyi foreach ile herbir obje icin ekrana basma
    .then((data) =>
      data.slice(0, 4).forEach((category) => {
        //*gelen herbir obje icin div olusturma
        const categoryDiv = document.createElement("div");
        //*div e class ekleme
        categoryDiv.classList.add("category");
        //* div in icerigini degistirme
        categoryDiv.innerHTML = `
          <img src="${category.image}" />
          <span>${category.name}</span>
        `;
        //olusan div in HTML deki listeye atma
        categoryList.appendChild(categoryDiv);
      })
    );
}

//*Ürünleri Cekme
function fetchProduct() {
  //apiye veri cekme istegi atma
  fetch("https://api.escuelajs.co/api/v1/products")
    //istek bassarili olursa veriyi isle
    .then((res) => res.json())
    //islenen veriyi al ve ekrana bas
    .then((data) =>
      data.slice(0, 24).forEach((item) => {
        console.log(item);
        //*div olusturma
        const productDiv = document.createElement("div");
        //*div e class ekleme
        productDiv.classList.add("product");
        //* div in icerigini degistirme
        productDiv.innerHTML = `
         <img src="${item.images[0]}"/>
         <p>${item.title}</p>
         <p>${item.category.name}</p>
         <div class="product-action">
           <p>${item.price}$</p>
           <button onclick="addToBasket({id:${item.id},title:'${item.title}',price:${item.price},img:'${item.images[0]}', amount:1})">Sepete Ekle</button>

         </div>
         `;
        //olusan ürünü HTML deki listeye atma
        productList.appendChild(productDiv);
      })
    );
}
//! fonksiyonlarda isimlendirme gönderilenlere arguman alinanlara parametre denir.

//Sepet

let basket = [];
let total = 0;

//sepete ekleme islemleri
function addToBasket(product) {
  //sepette eger bu eleman varsa onu degıskene aktar
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);
  //eger elemandan sepette varsa uyari ver
  if (foundItem) {
    //eger elemandan varsa bulunan elemanin miktarini arttirir
    foundItem.amount++;
  } else {
    //eger elemandan sepette bulunmadiysa sepete ekle
    basket.push(product);
  }
}
//Acma ve kapatma

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
  //*sepetin icine ürünleri listeleme
  addList();
  //toplam bilgisini güncelleme
  modalInfo.innerText = total;
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");

  //*sepeti kapatinca icini temizleme
  modalList.innerHTML = "";
  //*toplam degerini sifirlama
  total = 0;
});

//Sepete listeleme
function addList() {
  basket.forEach((product) => {
    //*sepet dizisindeki her obje icin div olustur.
    const listItem = document.createElement("div");
    //*bunlara class ekleme
    listItem.classList.add("list-item");
    //*icerigini degistirme
    listItem.innerHTML = `
  <img src="${product.img}">
  <h2>${product.title}</h2>
  <h2 class='price'>${product.price}$</h2>
  <p>Miktar: ${product.amount}</p>
  <button id="del" onclick="deleteItem({id:${product.id}, price:${product.price},amount:${product.amount})">Sil</button>
`;
    //elemani html deki listeye gönderme
    modalList.appendChild(listItem);

    //toplam degiskenini güncelleme

    total += product.price * product.amount;
  });
}

//*sepet dizisinden silme fonksiyonu
function deleteItem(deletingItem) {
  //id si silinecek elemanin id siyle esit olmayanlari al
  basket = basket.filter((i) => i.id !== deletingItem.id);
  //silinen elemanin fiyatini total den cikartma
  total -= deletingItem.price * deletingItem.amount;

  modalInfo.innerText = total;
}
//*silinen elemani html den kaldirma
modalList.addEventListener("click", (e) => {
  if (e.target.id == "del") {
    e.target.parentElement.remove();
  }
});

//*eger disari tiklanirsa kapatma
modal.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-wrapper")) {
    modal.classList.remove("active");
  }
});
