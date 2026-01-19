// ==========================
//  PERSISTENCIA
// ==========================
let total = Number(localStorage.getItem("total")) || 0;

let resumen = JSON.parse(localStorage.getItem("resumen")) || {
    "Cantinera": { cantidad: 0, total: 0 },
    "5kg": { cantidad: 0, total: 0 },
    "Molido": { cantidad: 0, total: 0 },
    "1/4 Entero": { cantidad: 0, total: 0 },
    "3kg": { cantidad: 0, total: 0 }
};

let ventasIndirectas = JSON.parse(localStorage.getItem("ventasIndirectas")) || [];
let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

// ==========================
//  GUARDAR Y REFRESCAR
// ==========================
function guardar() {
    localStorage.setItem("total", total);
    localStorage.setItem("resumen", JSON.stringify(resumen));
    localStorage.setItem("ventasIndirectas", JSON.stringify(ventasIndirectas));
    localStorage.setItem("gastos", JSON.stringify(gastos));
}

function refrescarTodo() {
    document.getElementById("total").textContent = `$${total.toFixed(2)}`;
    cargarTablaDirecto();
    cargarTablaIndirecto();
    cargarTablaGastos();
    guardar();
}

// ==========================
//  TABLA VENTAS DIRECTAS
// ==========================
function cargarTablaDirecto() {
    const tbody = document.querySelector("#tabla-directo tbody");
    tbody.innerHTML = "";

    Object.keys(resumen).forEach(prod => {
        if (resumen[prod].cantidad > 0) {
            const fila = `
                <tr>
                    <td>${prod}</td>
                    <td>${resumen[prod].cantidad}</td>
                    <td>$${resumen[prod].total}</td>
                </tr>
            `;
            tbody.innerHTML += fila;
        }
    });
}

// ==========================
//  BOTONES DE VENTAS DIRECTAS
// ==========================
document.querySelectorAll("#ventas-directas .btn-directo")
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

// ==========================
//  VENTAS INDIRECTAS - AGREGAR PRODUCTO
// ==========================
let listaTemporal = [];

document.getElementById("btn-agregar-indirecto").addEventListener("click", () => {
    const prod = document.getElementById("tipo-indirecto").value;
    const cant = Number(document.getElementById("cant-indirecta").value);
    const precio = Number(document.getElementById("precio-indirecto").value);

    if (!prod || !cant || !precio) {
        alert("Completa todos los datos.");
        return;
    }

    listaTemporal.push({ producto: prod, cantidad: cant, total: cant * precio });

    const ul = document.getElementById("lista-productos");
    ul.innerHTML = listaTemporal
        .map(p => `<li>${p.producto} — x${p.cantidad} — $${p.total}</li>`)
        .join("");

    document.getElementById("cant-indirecta").value = "";
    document.getElementById("precio-indirecto").value = "";
});

// ==========================
//  REGISTRAR VENTA INDIRECTA
// ==========================
document.getElementById("btn-indirecta").addEventListener("click", () => {
    const vendedor = document.getElementById("vendedor").value;

    if (!vendedor || listaTemporal.length === 0) {
        alert("Falta vendedor o productos.");
        return;
    }

    listaTemporal.forEach(p => {
        ventasIndirectas.push({
            vendedor,
            producto: p.producto,
            cantidad: p.cantidad,
            total: p.total
        });

        total += p.total;
    });

    listaTemporal = [];
    document.getElementById("lista-productos").innerHTML = "";
    document.getElementById("vendedor").value = "";

    refrescarTodo();
});

// ==========================
//  TABLA INDIRECTOS
// ==========================
function cargarTablaIndirecto() {
    const tabla = document.getElementById("tabla-indirecto");

    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Vendedor</th>
                <th>Producto</th>
                <th>Cant</th>
                <th>Total</th>
            </tr>
        </thead>
    `;

    ventasIndirectas.forEach(v => {
        tabla.innerHTML += `
            <tr>
                <td>${v.vendedor}</td>
                <td>${v.producto}</td>
                <td>${v.cantidad}</td>
                <td>$${v.total}</td>
            </tr>
        `;
    });
}

// ==========================
//  GASTOS
// ==========================
document.getElementById("btn-gasto").addEventListener("click", () => {
    const desc = document.getElementById("desc-gasto").value;
    const monto = Number(document.getElementById("monto-gasto").value);

    if (!desc || !monto) {
        alert("Completa descripción y monto.");
        return;
    }

    gastos.push({ descripcion: desc, monto });

    total -= monto;

    document.getElementById("desc-gasto").value = "";
    document.getElementById("monto-gasto").value = "";

    refrescarTodo();
});

function cargarTablaGastos() {
    const tbody = document.querySelector("#tabla-gastos tbody");
    tbody.innerHTML = "";

    gastos.forEach(g => {
        tbody.innerHTML += `
            <tr>
                <td>${g.descripcion}</td>
                <td>$${g.monto}</td>
            </tr>
        `;
    });
}

// ==========================
//  REINICIAR DÍA
// ==========================
document.getElementById("reiniciar-dia").addEventListener("click", () => {
    if (!confirm("¿Seguro que deseas reiniciar el día?")) return;

    total = 0;

    Object.keys(resumen).forEach(k => {
        resumen[k].cantidad = 0;
        resumen[k].total = 0;
    });

    ventasIndirectas = [];
    gastos = [];

    refrescarTodo();
});

// Cargar datos al abrir
refrescarTodo();
