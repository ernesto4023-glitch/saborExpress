let carrito =
  JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.querySelector("#contenedorProductos");

const productos = JSON.parse(localStorage.getItem("productos")) || [];

function mostrarProductos(listaProductos = productos) {

  contenedorProductos.innerHTML = "";

  if (listaProductos.length === 0) {

    contenedorProductos.innerHTML = `
      <p class="mensaje-vacio">
        No hay productos en esta categoría.
      </p>
    `;

    return;
  }

  listaProductos.forEach(producto => {

    contenedorProductos.innerHTML += `

      <div class="product-card">

        <img
          src="${producto.imagen}"
          alt="${producto.nombre}"
        >

        <div class="product-icon">
          ${obtenerIconoCategoria(producto.categoria)}
        </div>

        <h3>${producto.nombre}</h3>

        <p>
          Producto delicioso preparado al momento.
        </p>

        <strong>
          $${Number(producto.precio).toLocaleString("es-CO")}
        </strong>

        <button onclick="agregarAlCarrito('${producto.nombre}')">
          🛒 Ver producto
        </button>

      </div>

    `;
  });
}

mostrarProductos();

/*CATEGORIA EN INDEX */

const contenedorCategorias = document.querySelector("#contenedorCategorias");

const categorias = JSON.parse(localStorage.getItem("categorias")) || [
  "Hamburguesas",
  "Hot Dogs",
  "Papas",
  "Bebidas",
  "Malteadas",
  "Combos"
];

function obtenerIconoCategoria(nombre) {
  const categoria = nombre.toLowerCase();

  if (categoria.includes("hamburguesa")) return "🍔";
  if (categoria.includes("hot")) return "🌭";
  if (categoria.includes("papa")) return "🍟";
  if (categoria.includes("bebida")) return "🥤";
  if (categoria.includes("malteada")) return "🥤";
  if (categoria.includes("combo")) return "🎁";

  return "🍽️";
}

function mostrarCategoriasIndex() {
  if (!contenedorCategorias) return;

  contenedorCategorias.innerHTML = "";

  contenedorCategorias.innerHTML += `
    <div class="category-card active" onclick="filtrarProductos('todos', this)">
      <div class="category-icon">🍽️</div>
      <h3>Todo</h3>
      <p>Ver todo</p>
    </div>
  `;

  categorias.forEach(categoria => {
    const nombreCategoria =
      typeof categoria === "object" ? categoria.nombre : categoria;

    const imagenCategoria =
      typeof categoria === "object" && categoria.imagen
        ? categoria.imagen
        : "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400";

    contenedorCategorias.innerHTML += `
      <div class="category-card" onclick="filtrarProductos('${nombreCategoria}', this)">
        <div
          class="category-background"
          style="background-image:url('${imagenCategoria}')"
        >
          <div class="category-overlay">
            <h3>${nombreCategoria}</h3>
            <p>Ver productos</p>
          </div>
        </div>
      </div>
    `;
  });
}
function filtrarProductos(categoria, elemento) {

  document
    .querySelectorAll(".category-card")
    .forEach(card => card.classList.remove("active"));

  elemento.classList.add("active");

  if (categoria === "todos") {
    mostrarProductos(productos);
    return;
  }

  const productosFiltrados = productos.filter(
    producto => producto.categoria === categoria
  );

  mostrarProductos(productosFiltrados);
}

mostrarCategoriasIndex();

/*MODAL HAMBURGUESA */

const menuToggle = document.querySelector("#menuToggle");
const navMenu = document.querySelector("#navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

const heroWrapper = document.querySelector("#heroWrapper");

const flyers = JSON.parse(localStorage.getItem("flyers")) || [];

function mostrarFlyers() {

  if (!heroWrapper) return;

  heroWrapper.innerHTML = "";

  flyers.forEach(flyer => {

    const imagenResponsive =
      window.innerWidth <= 768
        ? flyer.imagenMobile
        : flyer.imagenDesktop;

    heroWrapper.innerHTML += `

      <div
        class="swiper-slide hero-slide"
        style="background-image:url('${imagenResponsive}')"
      >

        <div class="hero-text">

          <h2>
            ${flyer.titulo || "EL SABOR QUE TE ENCANTA"}
          </h2>

          <p>
            ${flyer.descripcion || "Hamburguesas jugosas y papas crujientes"}
          </p>

          <a
            href="${flyer.linkBoton || "#productos"}"
            class="hero-btn"
          >
            🍔 ${flyer.textoBoton || "Ver productos"}
          </a>

        </div>

      </div>

    `;
  });

  if (flyers.length > 1) {

    new Swiper(".heroSwiper", {

      loop: true,

      autoplay: {
        delay: 3500,
        disableOnInteraction: false
      },

      pagination: {
        el: ".swiper-pagination",
        clickable: true
      },

      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      }
    });
  }
}


mostrarFlyers();

function agregarAlCarrito(nombreProducto) {
  const producto = productos.find(
    producto => producto.nombre === nombreProducto
  );

  if (!producto) {
    console.log("Producto no encontrado:", nombreProducto);
    return;
  }

  const existe = carrito.find(
    item => item.nombre === producto.nombre
  );

  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({
      ...producto,
      cantidad: 1
    });
  }

  guardarCarrito();

  Swal.fire({
    icon: "success",
    title: "Producto agregado",
    text: `${producto.nombre} agregado al carrito.`,
    timer: 1500,
    showConfirmButton: false
  });
}

function guardarCarrito() {

  localStorage.setItem(
    "carrito",
    JSON.stringify(carrito)
  );

  mostrarCarrito();
}
function mostrarCarrito() {
  const lista = document.querySelector("#listaCarrito");
  const total = document.querySelector("#totalCarrito");
  const cantidad = document.querySelector("#cantidadCarrito");

  if (!lista || !total || !cantidad) return;

  lista.innerHTML = "";

  let totalGeneral = 0;
  let totalCantidad = 0;

  if (carrito.length === 0) {
    lista.innerHTML = `<p class="carrito-vacio">Tu carrito está vacío.</p>`;
  }

  carrito.forEach((item, index) => {
    totalGeneral += Number(item.precio) * item.cantidad;
    totalCantidad += item.cantidad;

    lista.innerHTML += `
      <div class="cart-item">
        <img src="${item.imagen}" alt="${item.nombre}">

        <div class="cart-item-info">
          <h4>${item.nombre}</h4>
          <p>$${Number(item.precio).toLocaleString("es-CO")}</p>

          <div class="cart-quantity">
            <button onclick="disminuirCantidad(${index})">−</button>
            <span>${item.cantidad}</span>
            <button onclick="aumentarCantidad(${index})">+</button>
          </div>

          <div class="cart-item-price">
            $${(Number(item.precio) * item.cantidad).toLocaleString("es-CO")}
          </div>
        </div>

        <button class="btn-remove" onclick="eliminarProductoCarrito(${index})">
          ×
        </button>
      </div>
    `;
  });

  total.textContent = `$${totalGeneral.toLocaleString("es-CO")}`;
  cantidad.textContent = totalCantidad;
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function aumentarCantidad(index) {
  carrito[index].cantidad++;
  guardarCarrito();
}

function disminuirCantidad(index) {
  carrito[index].cantidad--;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  guardarCarrito();
}

function eliminarProductoCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
}

const btnCarrito = document.querySelector("#btnCarrito");
const modalCarrito = document.querySelector("#modalCarrito");
const cerrarCarrito = document.querySelector("#cerrarCarrito");

if (btnCarrito && modalCarrito) {
  btnCarrito.addEventListener("click", () => {
    modalCarrito.classList.add("active");
  });
}

if (cerrarCarrito && modalCarrito) {
  cerrarCarrito.addEventListener("click", () => {
    modalCarrito.classList.remove("active");
  });
}

window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarProductoCarrito = eliminarProductoCarrito;

mostrarCarrito();