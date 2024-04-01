const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarning = document.getElementById("address-warn")

let cart = [];

// Abrir modal do carrinho
cartBtn.addEventListener('click', ()=>{
  updateCartModal()
  cartModal.style.display = 'flex'
})

// fechar modal do carrinho

cartModal.addEventListener('click', (event)=>{
  if(event.target === cartModal){
    cartModal.style.display = 'none'
  }
})

closeModalBtn.addEventListener('click', ()=>{
  cartModal.style.display = 'none'
})

menu.addEventListener('click', (event)=>{
  // console.log(event.target)
  let parentButton = event.target.closest(".add-to-cart-btn")
  if(parentButton){
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    addToCart(name, price)
  }
})
// funcao para add no carrinho
const addToCart = (name, price) =>{
  const existingItem = cart.find(item => item.name === name)
  if(existingItem){
    // se o item ja existe, aumenta apenas a quantidade +1
    existingItem.quantity += 1;
  }else{
    
      cart.push({
        name,
        price, 
        quantity: 1,
      })
  }

  updateCartModal()
}

// atualiza o carrinho
const updateCartModal = () => {
  cartItemsContainer.innerHTML = '';
  let total = 0;


  cart.forEach(item => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("fle", "justify-between", "mb-4", "flex-col")
    
    cartItemElement.innerHTML=`
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium">${item.name}</p>
        <p>Qntd ${item.quantity}</p>
        <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
      </div>

        <button class="remove-from-cart-btn" data-name="${item.name}">
          Remover
        </button>

    </div>
    `

    total += item.price * item.quantity

    cartItemsContainer.appendChild(cartItemElement)
  })

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency:"BRL"
  })

  cartCounter.innerText = cart.length;

}

// funcao para remover item do carrinho

cartItemsContainer.addEventListener("click", (event)=>{
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")

    removeItemCart(name)

  }
})

const removeItemCart = (name) =>{
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];
    if(item.quantity > 1){
      item.quantity -= 1;
      updateCartModal()
      return;
    }

    cart.splice(index, 1)
    updateCartModal();
    return;
  }
}

addressInput.addEventListener("input", (event)=>{
  let inputValue = event.target.value;
  
  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500");
    addressWarning.classList.add("hidden")
  }

})

// finalizar pedido
checkoutBtn.addEventListener("click", ()=>{
  const isOpen = checkRestaurantOpen()
  if(!isOpen){

    Toastify({
      text: "Ops, o restaurante está fechado!",
      duration: 2000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "#ef4444",
      }
    }).showToast();

    return;
  }

  if(cart.length ===0) return;

  if(addressInput.value === ""){
    addressWarning.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }


  // enviar pra api do whatsapp
  const cartItems = cart.map((item)=>{
    return(
      `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} | ` 
    )
  }).join("")

  const message = encodeURIComponent(cartItems)
  const phone = "92985515439"

  window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")
  cart = [];
  updateCartModal();


})

// verificar a hora e manippular o card horario
const checkRestaurantOpen = ()=>{
  const data = new Date();
  const hora = data.getHours();
  return hora >= 18 && hora < 22 //true
}

const spanItem = document.getElementById("data-span")
const isOpen = checkRestaurantOpen()

if(isOpen){
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-500")
}else{
  spanItem.classList.remove("bg-green-500")
  spanItem.classList.add("bg-red-500")
}