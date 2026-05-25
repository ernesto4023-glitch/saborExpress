function convertirImagenABase64(inputFile) {
  return new Promise((resolve, reject) => {
    const archivo = inputFile.files[0];

    if (!archivo) {
      resolve("");
      return;
    }

    const lector = new FileReader();

    lector.onload = () => resolve(lector.result);
    lector.onerror = () => reject("Error al leer la imagen");

    lector.readAsDataURL(archivo);
  });
}

const productosIniciales = [
  {
    nombre: "Hamburguesa Clásica",
    categoria: "Hamburguesas",
    precio: 85000,
    vistas: 0,
    likes: 0
  },
  {
    nombre: "Hot Dog",
    categoria: "Hamburguesas",
    precio: 55000,
    vistas: 0,
    likes: 0
  },
  {
    nombre: "Papas a la Francesa",
    categoria: "Papas",
    precio: 45000,
    vistas: 0,
    likes: 0
  },
  {
    nombre: "Malteada",
    categoria: "Bebidas",
    precio: 65000,
    vistas: 0,
    likes: 0
  }
];

const IMAGEN_PRODUCTO_DEFAULT =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500";

const IMAGEN_CATEGORIA_DEFAULT =
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=400";

const categoriasIniciales = [
  "Hamburguesas",
  "Hot Dogs",
  "Papas",
  "Bebidas"
];

let productos = JSON.parse(localStorage.getItem("productos")) || productosIniciales;
let categorias = JSON.parse(localStorage.getItem("categorias")) || categoriasIniciales;

function guardarDatos() {
  localStorage.setItem("productos", JSON.stringify(productos));
  localStorage.setItem("categorias", JSON.stringify(categorias));
}

function actualizarEstadisticas() {
  const totalProductos = document.querySelector("#totalProductos");
  const totalCategorias = document.querySelector("#totalCategorias");
  const totalVistas = document.querySelector("#totalVistas");
  const totalLikes = document.querySelector("#totalLikes");

  if (totalProductos) totalProductos.textContent = productos.length;
  if (totalCategorias) totalCategorias.textContent = categorias.length;
  if (totalVistas) {
    totalVistas.textContent = productos.reduce((suma, p) => suma + p.vistas, 0);
  }
  if (totalLikes) {
    totalLikes.textContent = productos.reduce((suma, p) => suma + p.likes, 0);
  }
}

function mostrarProductos() {
  const lista = document.querySelector("#listaProductos");
  if (!lista) return;

  lista.innerHTML = "";

  productos.forEach((producto, index) => {
    lista.innerHTML += `
      <div class="product-item">
       <img src="${producto.imagen || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200'}" alt="${producto.nombre}">
        <div>
          <div class="product-name">${producto.nombre}</div>
          <div class="product-cat">${producto.categoria}</div>
        </div>

        <div>
          <div class="price">$${producto.precio.toLocaleString("es-CO")}</div>
          <div class="details">${producto.vistas} vistas · ${producto.likes} likes</div>
        </div>

        <div class="actions">
          <button class="icon-btn edit" onclick="editarProducto(${index})">✎</button>
          <button class="icon-btn delete" onclick="eliminarProducto(${index})">🗑</button>
        </div>
      </div>
    `;
  });
}

function mostrarCategorias() {
  const lista = document.querySelector("#listaCategorias");
  const select = document.querySelector("#categoriaProducto");

  if (lista) {
    lista.innerHTML = "";

    categorias.forEach((categoria, index) => {
      const nombreCategoria = typeof categoria === "object" ? categoria.nombre : categoria;

      const cantidadProductos = productos.filter(
        producto => producto.categoria === nombreCategoria
      ).length;

      lista.innerHTML += `
        <div class="category-item">
          <div class="cat-icon">🍔</div>
          <strong>${nombreCategoria}</strong>
          <strong>${cantidadProductos} producto${cantidadProductos !== 1 ? "s" : ""}</strong>
          <div class="actions">
            <button class="icon-btn edit" onclick="editarCategoria(${index})">✎</button>
            <button class="icon-btn delete" onclick="eliminarCategoria(${index})">🗑</button>
          </div>
        </div>
      `;
    });
  }

  if (select) {
    select.innerHTML = `<option value="">Seleccionar categoría</option>`;

    categorias.forEach(categoria => {
      const nombreCategoria = typeof categoria === "object" ? categoria.nombre : categoria;
      select.innerHTML += `<option value="${nombreCategoria}">${nombreCategoria}</option>`;
    });
  }
}

function agregarProducto() {
  const nombre = document.querySelector("#nombreProducto").value.trim();
  const categoria = document.querySelector("#categoriaProducto").value;
  const precio = Number(document.querySelector("#precioProducto").value);
  const stock = Number(document.querySelector("#stockProducto").value);
  
  if (!nombre || !categoria || !precio || stock < 0 || isNaN(stock)) {
  Swal.fire({
    icon: "warning",
    title: "Campos incompletos",
    text: "Completa nombre, categoría, precio y stock."
  });
  return;
}

  productos.push({
    nombre,
    categoria,
    precio,
    imagen, 
    vistas: 0,
    likes: 0
  });

  guardarDatos();
  renderizarTodo();

  document.querySelector("#formProducto").reset();
}

function mostrarCategorias() {
  const lista = document.querySelector("#listaCategorias");
  const select = document.querySelector("#categoriaProducto");

  if (lista) {
    lista.innerHTML = "";

    categorias.forEach((categoria, index) => {
      const nombreCategoria =
        typeof categoria === "object" ? categoria.nombre : categoria;

      const imagenCategoria =
        typeof categoria === "object" && categoria.imagen
          ? categoria.imagen
          : "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300";

      const cantidadProductos = productos.filter(
        producto => producto.categoria === nombreCategoria
      ).length;

      lista.innerHTML += `
        <div class="category-item">
          <img class="cat-img" src="${imagenCategoria}" alt="${nombreCategoria}">
          <strong>${nombreCategoria}</strong>
          <strong>${cantidadProductos} producto${cantidadProductos !== 1 ? "s" : ""}</strong>

          <div class="actions">
            <button class="icon-btn edit" onclick="editarCategoria(${index})">✎</button>
            <button class="icon-btn delete" onclick="eliminarCategoria(${index})">🗑</button>
          </div>
        </div>
      `;
    });
  }

  if (select) {
    select.innerHTML = `<option value="">Seleccionar categoría</option>`;

    categorias.forEach(categoria => {
      const nombreCategoria =
        typeof categoria === "object" ? categoria.nombre : categoria;

      select.innerHTML += `
        <option value="${nombreCategoria}">${nombreCategoria}</option>
      `;
    });
  }
}
function eliminarProducto(index) {
  const confirmar = confirm("¿Deseas eliminar este producto?");

  if (!confirmar) return;

  productos.splice(index, 1);

  guardarDatos();
  renderizarTodo();
}

function eliminarCategoria(index) {
  const categoria =
    typeof categorias[index] === "object"
      ? categorias[index].nombre
      : categorias[index];

  const productosUsandoCategoria = productos.some(
    producto => producto.categoria === categoria
  );

  if (productosUsandoCategoria) {
    Swal.fire({
      icon: "warning",
      title: "No se puede eliminar",
      text: "No puede eliminar esta Categoria porque tiene elementos asociado."
    });;
    return;
  }

  const confirmar = confirm("¿Deseas eliminar esta categoría?");

  if (!confirmar) return;

  categorias.splice(index, 1);

  guardarDatos();
  renderizarTodo();
}
function editarProducto(index) {
  const producto = productos[index];

  const nuevoNombre = prompt("Editar nombre:", producto.nombre);
  const nuevoPrecio = prompt("Editar precio:", producto.precio);

  if (!nuevoNombre || !nuevoPrecio) return;

  producto.nombre = nuevoNombre.trim();
  producto.precio = Number(nuevoPrecio);

  guardarDatos();
  renderizarTodo();
}

function editarCategoria(index) {
  const categoriaActual = categorias[index];
  const nuevaCategoria = prompt("Editar categoría:", categoriaActual);

  if (!nuevaCategoria) return;

  categorias[index] = nuevaCategoria.trim();

  productos = productos.map(producto => {
    if (producto.categoria === categoriaActual) {
      producto.categoria = nuevaCategoria.trim();
    }
    return producto;
  });

  guardarDatos();
  renderizarTodo();
}

function renderizarTodo() {
  mostrarProductos();
  mostrarCategorias();
  actualizarEstadisticas();
}

document.addEventListener("DOMContentLoaded", () => {
  guardarDatos();
  renderizarTodo();

  const formProducto = document.querySelector("#formProducto");
  const btnAgregarCategoria = document.querySelector("#btnAgregarCategoria");

  if (formProducto) {
    formProducto.addEventListener("submit", e => {
      e.preventDefault();
      agregarProducto();
    });
  }

  if (btnAgregarCategoria) {
    btnAgregarCategoria.addEventListener("click", agregarCategoria);
  }

  mostrarFlyers();

if (btnAbrirModalFlyer) {
  btnAbrirModalFlyer.addEventListener("click", () => abrirModalFlyer());
}

if (btnCerrarModalFlyer) {
  btnCerrarModalFlyer.addEventListener("click", cerrarModalFlyer);
}

const formFlyer = document.querySelector("#formFlyer");

if (formFlyer) {
  formFlyer.addEventListener("submit", e => {
    e.preventDefault();
    guardarFlyerModal();
  });
}
});

/*MODAL PRODUCTOS */

const modalProducto = document.querySelector("#modalProducto");
const btnAbrirModalProducto = document.querySelector("#btnAbrirModalProducto");
const btnCerrarModalProducto = document.querySelector("#btnCerrarModalProducto");
const tituloModalProducto = document.querySelector("#tituloModalProducto");

btnAbrirModalProducto.addEventListener("click", () => {
  abrirModalProducto();
});

btnCerrarModalProducto.addEventListener("click", () => {
  cerrarModalProducto();
});

function abrirModalProducto(index = null) {
  modalProducto.classList.add("active");

  const inputEditando = document.querySelector("#productoEditando");
  const nombre = document.querySelector("#nombreProducto");
  const categoria = document.querySelector("#categoriaProducto");
  const precio = document.querySelector("#precioProducto");

  if (index !== null) {
    const producto = productos[index];

    tituloModalProducto.textContent = "Editar producto";
    inputEditando.value = index;
    nombre.value = producto.nombre;
    categoria.value = producto.categoria;
    precio.value = producto.precio;
  } else {
    tituloModalProducto.textContent = "Agregar producto";
    inputEditando.value = "";
    document.querySelector("#formProducto").reset();
  }
}

function cerrarModalProducto() {
  modalProducto.classList.remove("active");
}

async function agregarProducto() {
  const indexEditando = document.querySelector("#productoEditando").value;
  const nombre = document.querySelector("#nombreProducto").value.trim();
  const categoria = document.querySelector("#categoriaProducto").value;
  const precio = Number(document.querySelector("#precioProducto").value);
  const inputImagen = document.querySelector("#imagenProducto");

  if (!nombre || !categoria || !precio) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Completa todos los campos."
    });
    return;
  }

  const imagenNueva = await convertirImagenABase64(inputImagen);

  if (indexEditando !== "") {
    productos[indexEditando].nombre = nombre;
    productos[indexEditando].categoria = categoria;
    productos[indexEditando].precio = precio;

    if (imagenNueva) {
      productos[indexEditando].imagen = imagenNueva;
    }
  } else {
    productos.push({
      nombre,
      categoria,
      precio,
      imagen: imagenNueva || IMAGEN_PRODUCTO_DEFAULT,
      vistas: 0,
      likes: 0
    });
  }

  guardarDatos();
  renderizarTodo();
  cerrarModalProducto();

  document.querySelector("#formProducto").reset();
}

function editarProducto(index) {
  abrirModalProducto(index);
}

function mostrarCategorias() {
  const lista = document.querySelector("#listaCategorias");
  const select = document.querySelector("#categoriaProducto");

  if (lista) {
    lista.innerHTML = "";

    categorias.forEach((categoria, index) => {
      const nombreCategoria = typeof categoria === "object" ? categoria.nombre : categoria;

      const cantidadProductos = productos.filter(
        producto => producto.categoria === nombreCategoria
      ).length;

      lista.innerHTML += `
        <div class="category-item">
          <div class="cat-icon">🍔</div>
          <strong>${nombreCategoria}</strong>
          <strong>${cantidadProductos} producto${cantidadProductos !== 1 ? "s" : ""}</strong>

          <div class="actions">
            <button class="icon-btn edit" onclick="editarCategoria(${index})">✎</button>
            <button class="icon-btn delete" onclick="eliminarCategoria(${index})">🗑</button>
          </div>
        </div>
      `;
    });
  }

  if (select) {
    select.innerHTML = `<option value="">Seleccionar categoría</option>`;

    categorias.forEach(categoria => {
      const nombreCategoria = typeof categoria === "object" ? categoria.nombre : categoria;
      select.innerHTML += `<option value="${nombreCategoria}">${nombreCategoria}</option>`;
    });
  }
}

/*MODAL CATEGORIA */

const modalCategoria = document.querySelector("#modalCategoria");
const btnAbrirModalCategoria = document.querySelector("#btnAbrirModalCategoria");
const btnCerrarModalCategoria = document.querySelector("#btnCerrarModalCategoria");
const tituloModalCategoria = document.querySelector("#tituloModalCategoria");

btnAbrirModalCategoria.addEventListener("click", () => {
  abrirModalCategoria();
});

btnCerrarModalCategoria.addEventListener("click", () => {
  cerrarModalCategoria();
});

function abrirModalCategoria(index = null) {
  modalCategoria.classList.add("active");

  const inputEditando = document.querySelector("#categoriaEditando");
  const nombre = document.querySelector("#nombreCategoria");
  const imagen = document.querySelector("#imagenCategoria");

  if (index !== null) {
    const categoriaActual = categorias[index];

    const nombreCategoria =
      typeof categoriaActual === "object" ? categoriaActual.nombre : categoriaActual;

    const imagenCategoria =
      typeof categoriaActual === "object" ? categoriaActual.imagen : "";

    tituloModalCategoria.textContent = "Editar categoría";
    inputEditando.value = index;
    nombre.value = nombreCategoria;
    imagen.value = imagenCategoria;
  } else {
    tituloModalCategoria.textContent = "Agregar categoría";
    inputEditando.value = "";
    document.querySelector("#formCategoria").reset();
  }
}

function cerrarModalCategoria() {
  modalCategoria.classList.remove("active");
}

async function guardarCategoriaModal() {
  const indexEditando = document.querySelector("#categoriaEditando").value;
  const nombre = document.querySelector("#nombreCategoria").value.trim();
  const inputImagen = document.querySelector("#imagenCategoria");

  if (!nombre) {
    Swal.fire({
      icon: "warning",
      title: "Falta el nombre",
      text: "Escribe el nombre de la Categoria"
    });
    return;
  }

  const imagenNueva = await convertirImagenABase64(inputImagen);

  if (indexEditando !== "") {
    const imagenAnterior =
      typeof categorias[indexEditando] === "object"
        ? categorias[indexEditando].imagen
        : "";

    categorias[indexEditando] = {
      nombre: nombre,
      imagen: imagenNueva || imagenAnterior || IMAGEN_CATEGORIA_DEFAULT
    };
  } else {
    categorias.push({
      nombre: nombre,
      imagen: imagenNueva || IMAGEN_CATEGORIA_DEFAULT
    });
  }

  guardarDatos();
  renderizarTodo();
  cerrarModalCategoria();
  document.querySelector("#formCategoria").reset();
}

function editarCategoria(index) {
  abrirModalCategoria(index);
}

/*FLYERS */

const IMAGEN_FLYER_DESKTOP_DEFAULT =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1400";

const IMAGEN_FLYER_MOBILE_DEFAULT =
  "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800";

let flyers = JSON.parse(localStorage.getItem("flyers")) || [
  {
    imagenDesktop: IMAGEN_FLYER_DESKTOP_DEFAULT,
    imagenMobile: IMAGEN_FLYER_MOBILE_DEFAULT
  }
];

function guardarFlyers() {
  localStorage.setItem("flyers", JSON.stringify(flyers));
}

const modalFlyer = document.querySelector("#modalFlyer");
const btnAbrirModalFlyer = document.querySelector("#btnAbrirModalFlyer");
const btnCerrarModalFlyer = document.querySelector("#btnCerrarModalFlyer");
const tituloModalFlyer = document.querySelector("#tituloModalFlyer");

function abrirModalFlyer(index = null) {

  modalFlyer.classList.add("active");

  const inputEditando =
    document.querySelector("#flyerEditando");

  if (index !== null) {

    const flyer = flyers[index];

    tituloModalFlyer.textContent = "Editar flyer";

    inputEditando.value = index;

    document.querySelector("#tituloFlyer").value =
      flyer.titulo || "";

    document.querySelector("#descripcionFlyer").value =
      flyer.descripcion || "";

    document.querySelector("#textoBotonFlyer").value =
      flyer.textoBoton || "";

    document.querySelector("#linkBotonFlyer").value =
      flyer.linkBoton || "";

  } else {

    tituloModalFlyer.textContent = "Agregar flyer";

    inputEditando.value = "";

    document.querySelector("#formFlyer").reset();
  }
}

function cerrarModalFlyer() {
  modalFlyer.classList.remove("active");
}

async function guardarFlyerModal() {

  const indexEditando =
    document.querySelector("#flyerEditando").value;

  const titulo =
    document.querySelector("#tituloFlyer").value.trim();

  const descripcion =
    document.querySelector("#descripcionFlyer").value.trim();

  const textoBoton =
    document.querySelector("#textoBotonFlyer").value.trim();

  const linkBoton =
    document.querySelector("#linkBotonFlyer").value.trim();

  const inputDesktop =
    document.querySelector("#imagenFlyerDesktop");

  const inputMobile =
    document.querySelector("#imagenFlyerMobile");

  const imagenDesktopNueva =
    await convertirImagenABase64(inputDesktop);

  const imagenMobileNueva =
    await convertirImagenABase64(inputMobile);

  if (!titulo || !descripcion || !textoBoton || !linkBoton) {

    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Completa toda la información del flyer."
    });

    return;
  }

  if (indexEditando !== "") {

    const flyerAnterior = flyers[indexEditando];

    flyers[indexEditando] = {

      titulo,
      descripcion,
      textoBoton,
      linkBoton,

      imagenDesktop:
        imagenDesktopNueva ||
        flyerAnterior.imagenDesktop ||
        IMAGEN_FLYER_DESKTOP_DEFAULT,

      imagenMobile:
        imagenMobileNueva ||
        flyerAnterior.imagenMobile ||
        imagenDesktopNueva ||
        IMAGEN_FLYER_MOBILE_DEFAULT
    };

  } else {

    flyers.push({

      titulo,
      descripcion,
      textoBoton,
      linkBoton,

      imagenDesktop:
        imagenDesktopNueva ||
        IMAGEN_FLYER_DESKTOP_DEFAULT,

      imagenMobile:
        imagenMobileNueva ||
        imagenDesktopNueva ||
        IMAGEN_FLYER_MOBILE_DEFAULT
    });
  }

  guardarFlyers();

  mostrarFlyers();

  cerrarModalFlyer();

  document.querySelector("#formFlyer").reset();

  Swal.fire({
    icon: "success",
    title: "Flyer guardado",
    text: "El flyer fue guardado correctamente.",
    timer: 1800,
    showConfirmButton: false
  });
}

function mostrarFlyers() {

  const lista = document.querySelector("#listaFlyers");

  if (!lista) return;

  lista.innerHTML = "";

  flyers.forEach((flyer, index) => {

    lista.innerHTML += `

      <div class="product-item">

        <img
          src="${flyer.imagenDesktop}"
          alt="${flyer.titulo}"
        >

        <div>
          <div class="product-name">
            ${flyer.titulo}
          </div>

          <div class="product-cat">
            ${flyer.descripcion}
          </div>
        </div>

        <div>
          <div class="price">
            ${flyer.textoBoton}
          </div>

          <div class="details">
            Mobile + Desktop
          </div>
        </div>

        <div class="actions">

          <button
            class="icon-btn edit"
            onclick="editarFlyer(${index})"
          >
            ✎
          </button>

          <button
            class="icon-btn delete"
            onclick="eliminarFlyer(${index})"
          >
            🗑
          </button>

        </div>

      </div>

    `;
  });
}

function editarFlyer(index) {
  abrirModalFlyer(index);
}

function eliminarFlyer(index) {
  if (flyers.length === 1) {
    Swal.fire({
      icon: "warning",
      title: "Campos vacio",
      text: "Debe quedar al menos un flyer"
    });
    return;
  }

  const confirmar = confirm("¿Deseas eliminar este flyer?");
  if (!confirmar) return;

  flyers.splice(index, 1);

  guardarFlyers();
  mostrarFlyers();
}

window.editarProducto = editarProducto;
window.eliminarProducto = eliminarProducto;
window.editarCategoria = editarCategoria;
window.eliminarCategoria = eliminarCategoria;
window.editarFlyer = editarFlyer;
window.eliminarFlyer = eliminarFlyer;