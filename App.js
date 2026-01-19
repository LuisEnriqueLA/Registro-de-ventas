// -------------------------
//   ESTADO INICIAL
// -------------------------
let total = 0;
let resumen = {
    Cantinera: { cantidad: 0, total: 0 },
    "5kg": { cantidad: 0, total: 0 },
    Molido: { cantidad: 0, total: 0 },
    "1/4 Entero": { cantidad: 0, total: 0 },
    "3kg": { cantidad: 0, total: 0 }
};

let productosIndirectos = [];
let ventasIndirectas = [];
let gastos = [];


// -------------------------
//   Cargar Persistencia
// -------------------------
function cargarEstado() {
    const data = JSON.parse(localStorage.getItem("ventas-data"));
    if (!data) return;

    total = data.total ?? 0;
    resumen = data.resumen ?? resumen;
    ventasIndirectas = data.ventasIndirectas ?? [];
    gastos = data.gastos ?? [];
}

function guardarEstado() {
    localStorage.setItem(
        "ventas-data",
        JSON.stringify({
            total,
            resumen,
            ventasIndirectas,
            gastos
        })
    );
}


// -------------------------
//   REFERENCIAS DOM
// -------------------------

const totalEl = document.getElementById("total");
const tablaResumen = document.querySelector("#tabla-directo tbody");

const tablaIndirecto = document.querySelector("#tabla-indirecto");
const tbodyIndirecto = document.createElement("tbody");
tablaIndirecto.appendChild(tbodyIndirecto);

const tablaGastos = document.querySelector("#tabla-gastos tbody");


// -------------------------
//   FUNCIONES VISUALES
// -------------------------

function actualizarTotal() {
    totalEl.textContent = `$${Number(total).toFixed(2)}`;
}

function actualizarResumen() {
    tablaResumen.innerHTML = "";

    for (const prod in resumen) {
        const dato = resumen[prod];
        if (dato.cantidad === 0) continue;

        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${prod}</td>
            <td>${dato.cantidad}</td>
            <td>$${dato.total.toFixed(2)}</td>
        `;
        tablaResumen.appendChild(fila);
    }
}

function actualizarTablaIndirectos() {
    tbodyIndirecto.innerHTML = "";

    ventasIndirectas.forEach(v => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${v.vendedor}</td>
            <td>${v.productos
                .map(p => `${p.producto} x ${p.cantidad} = $${(p.cantidad * p.precio).toFixed(2)}`)
                .join("<br>")}</td>
            <td>${v.productos.map(p => p.cantidad).join("<br>")}</td>
            <td>$${v.total.toFixed(2)}</td>
        `;

        tbodyIndirecto.appendChild(fila);
    });
}

function actualizarTablaGastos() {
    tablaGastos.innerHTML = "";

    gastos.forEach(g => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${g.descripcion}</td>
            <td>-$${g.monto.toFixed(2)}</td>
        `;
        tablaGastos.appendChild(fila);
    });
}


// -------------------------
//   GUARDAR Y VOLVER A PINTAR
// -------------------------
function refrescarTodo() {
    guardarEstado();
    actualizarTotal();
    actualizarResumen();
    actualizarTablaIndirectos();
    actualizarTablaGastos();
}


// -------------------------
//   INICIALIZACIÓN
// -------------------------
cargarEstado();
refrescarTodo();


// -------------------------
//   VENTAS DIRECTAS
// -------------------------

document
    .querySelectorAll("#ventas-directas button")
    .forEach(boton => {
        boton.addEventListener("click", () => {
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);

            total += precio;
            resumen[nombre].cantidad++;
            resumen[nombre].total += precio;

            refrescarTodo();
        });
    });


// -------------------------
//   VENTAS INDIRECTAS
// -------------------------

document.getElementById("btn-agregar-indirecto").addEventListener("click", () => {
    const producto = document.getElementById("tipo-indirecto").value;
    const cantidad = Number(document.getElementById("cant-indirecta").value);
    const precio = Number(document.getElementById("precio-indirecto").value);

    if (!producto || cantidad <= 0 || precio <= 0) {
        alert("Completa todos los campos");
        return;
    }

    productosIndirectos.push({ producto, cantidad, precio });

    const lista = document.getElementById("lista-productos");
    const li = document.createElement("li");

    li.innerHTML = `${producto} (${cantidad}) a $${precio} = $${(cantidad * precio).toFixed(2)}`;
    lista.appendChild(li);

    document.getElementById("tipo-indirecto").value = "Producto";
    document.getElementById("cant-indirecta").value = "";
    document.getElementById("precio-indirecto").value = "";
});


document.getElementById("btn-indirecta").addEventListener("click", () => {
    const vendedor = document.getElementById("vendedor").value;

    if (!vendedor || productosIndirectos.length === 0) {
        alert("Datos incompletos");
        return;
    }

    const totalVenta = productosIndirectos.reduce(
        (acc, p) => acc + p.cantidad * p.precio,
        0
    );

    ventasIndirectas.push({
        vendedor,
        productos: [...productosIndirectos],
        total: totalVenta
    });

    total += totalVenta;

    productosIndirectos = [];
    document.getElementById("lista-productos").innerHTML = "";
    document.getElementById("vendedor").value = "";

    refrescarTodo();
});


// -------------------------
//   GASTOS
// -------------------------

document.getElementById("btn-gasto").addEventListener("click", () => {
    const descripcion = document.getElementById("desc-gasto").value;
    const monto = Number(document.getElementById("monto-gasto").value);

    if (!descripcion || monto <= 0) {
        alert("Datos inválidos");
        return;
    }

    gastos.push({ descripcion, monto });

    total -= monto;

    document.getElementById("desc-gasto").value = "";
    document.getElementById("monto-gasto").value = "";

    refrescarTodo();
});

// ----- BOTÓN REINICIAR DÍA -----
document.getElementById("reiniciar-dia").addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres reiniciar todo el día?")) return;

    // Borrar datos guardados
    localStorage.clear();

    // Reiniciar total
    document.getElementById("total").textContent = "$0.00";

    // Limpiar tablas
    document.querySelector("#tabla-directo tbody").innerHTML = "";
    document.querySelector("#tabla-indirecto").innerHTML = `
        <thead>
            <tr>
                <th>Vendedor</th>
                <th>Producto</th>
                <th>Cant</th>
                <th>Total</th>
            </tr>
        </thead>
    `;
    document.querySelector("#tabla-gastos tbody").innerHTML = "";

    // Limpiar lista de productos indirectos
    document.getElementById("lista-productos").innerHTML = "";

    alert("Día reiniciado correctamente.");
});

        
