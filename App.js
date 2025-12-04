//Estado de la aplicacion 
let total = 0;
const resumen = {
  Cantinera: { cantidad: 0, total: 0 },
  "5kg": { cantidad: 0, total: 0 },
  Molido: { cantidad: 0, total: 0 },
  "1/4 Entero": { cantidad: 0, total: 0 },
  "3kg": { cantidad: 0, total: 0 }
};
let productosIndirectos =[]; 


//Referencias con el DOM
const totalEl = document.getElementById("total");//Total en pantalla
const tablaResumen = document.querySelector("#tabla-directo tbody");

//Inputs de ventas directas
const vendedorInput = document.getElementById("vendedor");
const tipoIndirectoInput = document.getElementById("tipo-indirecto");
const cantidadIndirectaInput = document.getElementById("cant-indirecta");
const btnIndirecta = document.getElementById("btn-indirecta");

// Inputs de gastos
const descGastoInput = document.getElementById("desc-gasto");
const montoGastoInput = document.getElementById("monto-gasto");
const btnGasto = document.getElementById("btn-gasto");

//Funciones
//actualiza el total
function actualizarTotal() {
    totalEl.textContent = `$${Number(total).toFixed(2)}`;
}

//Actualizar la tabla en pantalla
function actualizarResumen() {
    tablaResumen.innerHTML ="";

    for(const producto in resumen) {
        const dato = resumen[producto];

        if(dato.cantidad === 0) continue;

        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto}</td>
            <td>${dato.cantidad}</td>
            <td>$${dato.total.toFixed(2)}</td>
        `;

        tablaResumen.appendChild(fila);

    }
}

//Agregar a cada boton una accion en directos
document.querySelectorAll(".ventas-directas button")
    .forEach(boton => {
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);

            total += precio;
            actualizarTotal();

            resumen[nombre].cantidad++;
            resumen[nombre].total += precio;
            actualizarResumen();
        })
    })

    actualizarTotal();

//agregar el evento a la venta indirecta
document.querySelector("#btn-agregar-indirecto").addEventListener("click", () => {
    const producto = document.getElementById("tipo-indirecto").value;
    const cantidad = Number(document.getElementById("cant-indirecta").value);
    const precio = Number(document.getElementById("precio-indirecto").value);
    const lista = document.querySelector("#lista-productos");

    if (!producto || cantidad <= 0 || precio <= 0) {
        alert("Completa todos los campos del producto");
        return;
    }

    productosIndirectos.push({ producto, cantidad, precio });

    const registros = document.createElement("li");
    registros.innerHTML = `${producto} x ${cantidad} a $${precio} = $${(precio * cantidad).toFixed(2)}`;

    lista.appendChild(registros);
    // Limpiar inputs después de agregar
    document.getElementById("tipo-indirecto").value = "";
    document.getElementById("cant-indirecta").value = "";
    document.getElementById("precio-indirecto").value = "";

});

document.querySelector("#btn-indirecta").addEventListener("click", () => {
    const vendedor = document.getElementById("vendedor").value;
    const tabla = document.querySelector("#tabla-indirecto");

    // Validación correcta
    if (!vendedor || productosIndirectos.length === 0) {
        alert("Faltan datos para registrar la venta indirecta");
        return;
    }

    const contenido = document.createElement("tr");

    // Columna vendedor
    const colVendedor = document.createElement("td");
    colVendedor.textContent = vendedor;
    contenido.appendChild(colVendedor);

    // Columna productos
    const colProductos = document.createElement("td");
    colProductos.innerHTML = productosIndirectos
        .map(p => `${p.producto} x ${p.cantidad} = $${(Number(p.cantidad) * Number(p.precio)).toFixed(2)}`)
        .join("<br>");
    contenido.appendChild(colProductos);

    //Columna cantidad
    const colCantidades = document.createElement("td");
    colCantidades.innerHTML = productosIndirectos
        .map(p => p.cantidad)
        .join("<br>");
    contenido.appendChild(colCantidades);

    //Columna Total
    const totalVenta = productosIndirectos
        .reduce((acc, p) => acc + (p.cantidad * p.precio), 0);

    const colTotal = document.createElement("td");
    colTotal.textContent = `$${totalVenta.toFixed(2)}`;
    contenido.appendChild(colTotal);

    // Agregar la contenido a la tabla
    tabla.appendChild(contenido);

    // Limpiar lista visual y array
    productosIndirectos = [];
    document.querySelector("#lista-productos").innerHTML = "";
});

//Gatos
function agregarGastoATabla(descripcion, monto){
    const tabla = document.querySelector("#tabla-gastos tbody");
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${descripcion}</td>
        <td>-$${monto.toFixed(2)}</td>
    `;

    tabla.appendChild(fila);
}

document.querySelector("#btn-gasto")
    .addEventListener("click", () => {
        const descripcion = descGastoInput.value;
        const monto = Number(montoGastoInput.value);

        if (!descripcion || monto <= 0) {
            alert("Completa los datos del gasto correctamente.");
            return;
        }

        total -= monto;
        actualizarTotal();

        // agregar registro a tabla
        agregarGastoATabla(descripcion, monto);

        // limpiar
        descGastoInput.value = "";
        montoGastoInput.value = "";

    })
