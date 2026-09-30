
// ==========================================
// 1. CREDENCIALES DE SUPABASE
// ==========================================
const SUPABASE_URL = "https://ndsxaytsnrnoxwsoxzfs.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kc3hheXRzbnJub3h3c294emZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NzA3NjMsImV4cCI6MjEwNTI0Njc2M30.SFHiaTTL7G3xd6wpj5s6sS0kUFQJHnnNcie89fE_Wzg";


let clienteSupabase = null;
let listaViajes = [];
let viajeEnEdicion = null; // Guarda el viaje seleccionado en memoria

// =============================================================================
// 2. MATRIZ DE TARIFAS ($400 Y $600 POR KILO EXTRA)
// =============================================================================
const TARIFARIO = {
  // Urbanos y Locales
  "URBANO": { base: 30000, extraPorKilo: 0, limiteKg: 1000 },
  "RURAL": { base: 50000, extraPorKilo: 0, limiteKg: 1000 },

  // Norte y Valle ($400/kg extra)
  "ANDALUCIA": { base: 50000, extraPorKilo: 400, limiteKg: 1000 },
  "BUGALAGRANDE": { base: 50000, extraPorKilo: 400, limiteKg: 1000 },
  "CAMP. LA LUISA": { base: 50000, extraPorKilo: 400, limiteKg: 1000 },
  "NESTLE": { base: 60000, extraPorKilo: 400, limiteKg: 1000 },
  "RIO FRIO": { base: 60000, extraPorKilo: 400, limiteKg: 1000 },
  "LA MARINA": { base: 70000, extraPorKilo: 400, limiteKg: 1000 },
  "EL OVERO": { base: 80000, extraPorKilo: 400, limiteKg: 1000 },
  "BOLIVAR": { base: 140000, extraPorKilo: 400, limiteKg: 1000 },
  "ING. RIO PAILA": { base: 140000, extraPorKilo: 400, limiteKg: 1000 },
  "LA PAILA": { base: 140000, extraPorKilo: 400, limiteKg: 1000 },
  "ZARZAL": { base: 150000, extraPorKilo: 400, limiteKg: 1000 },
  "ROLDANILLO": { base: 160000, extraPorKilo: 400, limiteKg: 1000 },
  "LA UNION": { base: 200000, extraPorKilo: 400, limiteKg: 1000 },
  "LA VICTORIA": { base: 200000, extraPorKilo: 400, limiteKg: 1000 },
  "SEVILLA": { base: 200000, extraPorKilo: 400, limiteKg: 1000 },
  "CARTAGO": { base: 240000, extraPorKilo: 400, limiteKg: 1000 },
  "CAICEDONIA": { base: 260000, extraPorKilo: 400, limiteKg: 1000 },

  // Occidente ($400/kg extra)
  "TRUJILLO": { base: 120000, extraPorKilo: 400, limiteKg: 1000 },
  "SALONICA": { base: 120000, extraPorKilo: 400, limiteKg: 1000 },
  "MEDIA CANOA": { base: 120000, extraPorKilo: 400, limiteKg: 1000 },
  "FENICIA": { base: 170000, extraPorKilo: 400, limiteKg: 1000 },
  "ING. CARMELITA": { base: 80000, extraPorKilo: 400, limiteKg: 1000 },
  "POR.PIEDRAS": { base: 80000, extraPorKilo: 400, limiteKg: 1000 },
  "YOTOCO": { base: 160000, extraPorKilo: 400, limiteKg: 1000 },
  "CALIMA": { base: 180000, extraPorKilo: 400, limiteKg: 1000 },
  "RESTREPO": { base: 180000, extraPorKilo: 400, limiteKg: 1000 },

  // Sur ($400/kg extra)
  "ING. SAN CARLOS": { base: 70000, extraPorKilo: 400, limiteKg: 1000 },
  "SAN PEDRO": { base: 60000, extraPorKilo: 400, limiteKg: 1000 },
  "SAN JOSE": { base: 60000, extraPorKilo: 400, limiteKg: 1000 },
  "PRESIDENTE": { base: 70000, extraPorKilo: 400, limiteKg: 1000 },
  "TODOS LOS SANTOS": { base: 120000, extraPorKilo: 400, limiteKg: 1000 },
  "BUGA": { base: 140000, extraPorKilo: 400, limiteKg: 1000 },
  "LA HABANA": { base: 190000, extraPorKilo: 400, limiteKg: 1000 },
  "OBANDO": { base: 160000, extraPorKilo: 400, limiteKg: 1000 },
  "ING. PICHICHI": { base: 190000, extraPorKilo: 400, limiteKg: 1000 },
  "GINEBRA": { base: 190000, extraPorKilo: 400, limiteKg: 1000 },
  "PALMIRA": { base: 250000, extraPorKilo: 400, limiteKg: 1000 },
  "YUMBO": { base: 350000, extraPorKilo: 400, limiteKg: 1000 },
  "CALI NORTE": { base: 350000, extraPorKilo: 400, limiteKg: 1000 },
  "CALI SUR": { base: 450000, extraPorKilo: 400, limiteKg: 1000 },
  "JAMUNDI": { base: 450000, extraPorKilo: 400, limiteKg: 1000 },
  "ING. CASTILLA": { base: 350000, extraPorKilo: 400, limiteKg: 1000 },
  "CANDELARIA": { base: 350000, extraPorKilo: 400, limiteKg: 1000 },
  "FLORIDA": { base: 350000, extraPorKilo: 400, limiteKg: 1000 },
  "ING. MAYAGUEZ": { base: 350000, extraPorKilo: 400, limiteKg: 1000 },

  // Nacionales / Eje Cafetero ($600/kg extra)
  "ARMENIA": { base: 400000, extraPorKilo: 600, limiteKg: 1000 },
  "PUEBLO TAPADO": { base: 350000, extraPorKilo: 600, limiteKg: 1000 },
  "MONTENEGRO": { base: 350000, extraPorKilo: 600, limiteKg: 1000 },
  "QUIMBAYA": { base: 350000, extraPorKilo: 600, limiteKg: 1000 },
  "FILANDIA": { base: 420000, extraPorKilo: 600, limiteKg: 1000 },
  "SALENTO": { base: 420000, extraPorKilo: 600, limiteKg: 1000 },
  "PEREIRA": { base: 400000, extraPorKilo: 600, limiteKg: 1000 },
  "DOSQUEBRADAS": { base: 450000, extraPorKilo: 600, limiteKg: 1000 },
  "SANTA ROSA": { base: 500000, extraPorKilo: 600, limiteKg: 1000 },
  "CHINCHINA": { base: 500000, extraPorKilo: 600, limiteKg: 1000 },
  "VILLAMARIA": { base: 600000, extraPorKilo: 600, limiteKg: 1000 },
  "MANIZALES": { base: 700000, extraPorKilo: 600, limiteKg: 1000 },
  "POPAYAN": { base: 800000, extraPorKilo: 600, limiteKg: 1000 }
};

const formatoCOP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0
});

// =============================================================================
// 3. FÓRMULAS DE CÁLCULO
// =============================================================================
function calcularValoresFlete(ciudad, peso, descargue, desvio) {
  if (!ciudad || !TARIFARIO[ciudad]) {
    return { tarifaBase: 0, kilosExtra: 0, costoExtra: 0, total: 0 };
  }

  const config = TARIFARIO[ciudad];
  const tarifaBase = config.base;
  const limiteKg = config.limiteKg;

  const kilosExtra = Math.max(0, peso - limiteKg);
  const costoExtra = kilosExtra * config.extraPorKilo;
  const total = tarifaBase + costoExtra + descargue + desvio;

  return { tarifaBase, kilosExtra, costoExtra, total };
}

function actualizarPrevisualizacion() {
  const ciudad = document.getElementById("ciudad").value;
  const peso = parseFloat(document.getElementById("peso").value) || 0;
  const descargue = parseFloat(document.getElementById("descargue").value) || 0;
  const desvio = parseFloat(document.getElementById("desvio").value) || 0;

  const { tarifaBase, kilosExtra, costoExtra, total } = calcularValoresFlete(ciudad, peso, descargue, desvio);

  document.getElementById("lblTarifaBase").textContent = formatoCOP.format(tarifaBase);
  document.getElementById("lblKilosExtra").textContent = `${kilosExtra.toLocaleString("es-CO")} kg`;
  document.getElementById("lblCostoExtra").textContent = formatoCOP.format(costoExtra);
  document.getElementById("lblTotalViaje").textContent = formatoCOP.format(total);
}

function actualizarCalculoModalNovedades() {
  if (!viajeEnEdicion) return;

  const fleteInicial = Number(viajeEnEdicion.tarifa_base || 0) + Number(viajeEnEdicion.costo_kilos_extra || 0);
  const nuevoDesvio = parseFloat(document.getElementById("editDesvio").value) || 0;
  const nuevoDescargue = parseFloat(document.getElementById("editDescargue").value) || 0;

  const totalExtras = nuevoDesvio + nuevoDescargue;
  const totalFinal = fleteInicial + totalExtras;

  document.getElementById("lblEditSubtotalInicial").textContent = formatoCOP.format(fleteInicial);
  document.getElementById("lblEditTotalExtras").textContent = formatoCOP.format(totalExtras);
  document.getElementById("lblEditTotalFinal").textContent = formatoCOP.format(totalFinal);
}

// =============================================================================
// 4. CONEXIÓN A SUPABASE
// =============================================================================
async function conectarSupabase() {
  const alertBox = document.getElementById("statusAlert");
  if (!alertBox) return;

  const urlLimpia = (SUPABASE_URL || "").trim();
  const keyLimpia = (SUPABASE_ANON_KEY || "").trim();

  if (
    !urlLimpia ||
    !keyLimpia ||
    urlLimpia.includes("TU_PROYECTO") ||
    keyLimpia.includes("TU_SUPABASE_ANON_KEY")
  ) {
    alertBox.className = "status-banner warning";
    alertBox.innerHTML = `⚠️ <strong>Modo Local:</strong> Agrega tus credenciales en <code>app.js</code> para sincronizar con la nube.`;
    renderizarTodo();
    return;
  }

  try {
    clienteDB = window.supabase.createClient(urlLimpia, keyLimpia, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { error } = await clienteDB.from("viajes_despacho").select("id").limit(1);
    if (error) throw error;

    alertBox.className = "status-banner success";
    alertBox.innerHTML = `✅ <strong>Conectado:</strong> Base de datos Supabase vinculada con éxito.`;
    await cargarHistorial();
  } catch (err) {
    console.error("Error al conectar Supabase:", err);
    alertBox.className = "status-banner danger";
    alertBox.innerHTML = `❌ <strong>Error de conexión:</strong> ${err.message}.`;
    renderizarTodo();
  }
}

// =============================================================================
// 5. REGISTRAR SALIDA DEL CAMIÓN
// =============================================================================
async function guardarDespacho(evento) {
  evento.preventDefault();

  const sucursal = document.getElementById("sucursal").value;
  const ciudad = document.getElementById("ciudad").value;

  if (!sucursal) {
    alert("Por favor selecciona una sucursal.");
    return;
  }
  if (!ciudad) {
    alert("Por favor selecciona una ciudad de destino.");
    return;
  }

  const peso = parseFloat(document.getElementById("peso").value) || 0;
  const descargue = parseFloat(document.getElementById("descargue").value) || 0;
  const desvio = parseFloat(document.getElementById("desvio").value) || 0;
  const { tarifaBase, kilosExtra, costoExtra, total } = calcularValoresFlete(ciudad, peso, descargue, desvio);

  const nuevoRegistro = {
    fecha: document.getElementById("fecha").value,
    numero_factura: document.getElementById("factura").value.trim() || "S/F",
    sucursal: sucursal,
    ciudad_destino: ciudad,
    estado_entrega: "ENTREGADO",
    peso_kg: peso,
    tarifa_base: tarifaBase,
    kilos_extra: kilosExtra,
    costo_kilos_extra: costoExtra,
    costo_descargue: descargue,
    costo_desvio: desvio,
    total_viaje: total,
    observaciones: document.getElementById("observaciones").value.trim()
  };

  const btn = document.getElementById("btnGuardar");

  if (clienteDB) {
    btn.disabled = true;
    btn.textContent = "Guardando salida...";

    try {
      const { error } = await clienteDB.from("viajes_despacho").insert([nuevoRegistro]);
      if (error) throw error;

      alert("¡Salida de despacho registrada exitosamente!");
      limpiarFormulario();
      await cargarHistorial();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al guardar en Supabase: " + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "Registrar Salida";
    }
  } else {
    nuevoRegistro.id = "local-" + Date.now();
    listaViajes.unshift(nuevoRegistro);
    alert("¡Salida registrada localmente!");
    limpiarFormulario();
    renderizarTodo();
  }
}

function limpiarFormulario() {
  document.getElementById("formDespacho").reset();
  const inputFecha = document.getElementById("fecha");
  if (inputFecha) {
    inputFecha.value = new Date().toISOString().split("T")[0];
  }
  actualizarPrevisualizacion();
}

// =============================================================================
// 6. MODAL DE NOVEDADES AL RETORNO (DESVÍOS, DESCARGUE Y ESTADO)
// =============================================================================
function abrirModalNovedades(id) {
  viajeEnEdicion = listaViajes.find(v => String(v.id) === String(id));
  if (!viajeEnEdicion) {
    alert("No se encontró el viaje para registrar novedad.");
    return;
  }

  document.getElementById("editId").value = viajeEnEdicion.id;
  document.getElementById("infoFactura").textContent = viajeEnEdicion.numero_factura || viajeEnEdicion.numero_guia || "-";
  document.getElementById("infoSucursal").textContent = viajeEnEdicion.sucursal || "D0604";
  document.getElementById("infoDestino").textContent = viajeEnEdicion.ciudad_destino;
  document.getElementById("infoPeso").textContent = `${Number(viajeEnEdicion.peso_kg).toLocaleString("es-CO")} kg`;
  
  const fleteInicial = Number(viajeEnEdicion.tarifa_base || 0) + Number(viajeEnEdicion.costo_kilos_extra || 0);
  document.getElementById("infoFleteInicial").textContent = formatoCOP.format(fleteInicial);

  document.getElementById("editEstado").value = viajeEnEdicion.estado_entrega || "ENTREGADO";
  document.getElementById("editDesvio").value = viajeEnEdicion.costo_desvio || 0;
  document.getElementById("editDescargue").value = viajeEnEdicion.costo_descargue || 0;
  document.getElementById("editObservaciones").value = viajeEnEdicion.observaciones || "";

  actualizarCalculoModalNovedades();
  document.getElementById("modalEdicion").classList.add("active");
}

function cerrarModalNovedades() {
  viajeEnEdicion = null;
  document.getElementById("modalEdicion").classList.remove("active");
}

async function guardarNovedadesRetorno(evento) {
  evento.preventDefault();
  if (!viajeEnEdicion) return;

  const id = document.getElementById("editId").value;
  const nuevoEstado = document.getElementById("editEstado").value;
  const nuevoDesvio = parseFloat(document.getElementById("editDesvio").value) || 0;
  const nuevoDescargue = parseFloat(document.getElementById("editDescargue").value) || 0;
  const nuevasObservaciones = document.getElementById("editObservaciones").value.trim();

  const fleteInicial = Number(viajeEnEdicion.tarifa_base || 0) + Number(viajeEnEdicion.costo_kilos_extra || 0);
  const nuevoTotal = fleteInicial + nuevoDesvio + nuevoDescargue;

  const datosActualizados = {
    estado_entrega: nuevoEstado,
    costo_desvio: nuevoDesvio,
    costo_descargue: nuevoDescargue,
    total_viaje: nuevoTotal,
    observaciones: nuevasObservaciones
  };

  const btn = document.getElementById("btnGuardarEdicion");

  if (clienteDB && !String(id).startsWith("local-")) {
    btn.disabled = true;
    btn.textContent = "Guardando novedades...";

    try {
      const { data, error } = await clienteDB
        .from("viajes_despacho")
        .update(datosActualizados)
        .eq("id", id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Supabase bloqueó la actualización. Asegúrate de tener activa la política UPDATE.");
      }

      const index = listaViajes.findIndex(v => String(v.id) === String(id));
      if (index !== -1) {
        listaViajes[index] = { ...listaViajes[index], ...datosActualizados };
      }

      alert("¡Novedades guardadas con éxito!");
      cerrarModalNovedades();
      await cargarHistorial();
      renderizarTodo();
    } catch (err) {
      console.error("Error al actualizar novedades:", err);
      alert("Error al actualizar: " + err.message);
    } finally {
      btn.disabled = false;
      btn.textContent = "Guardar Cierre de Novedades";
    }
  } else {
    const index = listaViajes.findIndex(v => String(v.id) === String(id));
    if (index !== -1) {
      listaViajes[index] = { ...listaViajes[index], ...datosActualizados };
      alert("¡Novedades actualizadas localmente!");
      cerrarModalNovedades();
      renderizarTodo();
    }
  }
}

// =============================================================================
// 7. HISTORIAL Y TABLAS (NO SUMA MONTOS CUANDO ES 'NO ENTREGADO')
// =============================================================================
async function cargarHistorial() {
  if (!clienteDB) return;

  try {
    const { data, error } = await clienteDB
      .from("viajes_despacho")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) throw error;

    listaViajes = data || [];
    renderizarTodo();
  } catch (err) {
    console.error("Error al consultar historial:", err);
  }
}

function renderizarTodo() {
  renderizarTablaGeneral();
  renderizarCierreDiario();
}

function obtenerViajesFiltradosGeneral() {
  const selectFiltro = document.getElementById("filtroCiudad");
  const filtro = selectFiltro ? selectFiltro.value : "TODOS";
  return listaViajes.filter(item => {
    if (filtro === "TODOS") return true;
    return item.ciudad_destino === filtro;
  });
}

function renderizarTablaGeneral() {
  const tbody = document.getElementById("cuerpoTabla");
  if (!tbody) return;
  tbody.innerHTML = "";

  const filtrados = obtenerViajesFiltradosGeneral();
  let acumuladoTotal = 0;

  if (filtrados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="12" class="td-empty">No hay despachos registrados para este filtro.</td></tr>`;
  } else {
    filtrados.forEach(v => {
      const adicionales = Number(v.costo_descargue || 0) + Number(v.costo_desvio || 0);
      const esEntregado = (v.estado_entrega || "ENTREGADO") === "ENTREGADO";
      const claseBadge = esEntregado ? "badge-entregado" : "badge-no-entregado";
      const textoBadge = esEntregado ? "ENTREGADO" : "NO ENTREGADO";

      // REGLA: Si NO fue entregado, NO suma al acumulado monetario
      if (esEntregado) {
        acumuladoTotal += Number(v.total_viaje || 0);
      }

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${v.fecha}</td>
        <td><strong>${v.numero_factura || v.numero_guia || "-"}</strong></td>
        <td><span style="font-weight: 600; color: var(--primary);">${v.sucursal || "D0604"}</span></td>
        <td>${v.ciudad_destino}</td>
        <td style="text-align: center;"><span class="badge-estado ${claseBadge}">${textoBadge}</span></td>
        <td class="col-num">${Number(v.peso_kg).toLocaleString("es-CO")} kg</td>
        <td class="col-num">${formatoCOP.format(v.tarifa_base)}</td>
        <td class="col-num">${Number(v.kilos_extra).toLocaleString("es-CO")} kg (${formatoCOP.format(v.costo_kilos_extra)})</td>
        <td class="col-num">${formatoCOP.format(adicionales)}</td>
        <td class="col-num" style="font-weight: 700; color: ${esEntregado ? 'var(--primary)' : 'var(--text-muted)'};">${formatoCOP.format(v.total_viaje)}</td>
        <td>${v.observaciones || "-"}</td>
        <td style="text-align: center;">
          <button type="button" class="btn-novedad" onclick="abrirModalNovedades('${v.id}')">Cerrar / Novedad</button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  }

  const metricViajes = document.getElementById("metricViajes");
  const metricTotal = document.getElementById("metricTotal");

  if (metricViajes) metricViajes.textContent = `Total Viajes: ${filtrados.length}`;
  if (metricTotal) metricTotal.textContent = `Total Acumulado: ${formatoCOP.format(acumuladoTotal)}`;
}

function obtenerViajesDelDia() {
  const inputFecha = document.getElementById("filtroFechaDia");
  const fechaSeleccionada = inputFecha ? inputFecha.value : "";
  if (!fechaSeleccionada) return [];
  return listaViajes.filter(v => v.fecha === fechaSeleccionada);
}

function renderizarCierreDiario() {
  const inputFecha = document.getElementById("filtroFechaDia");
  const fechaSeleccionada = inputFecha ? inputFecha.value : "";
  const tbodyDia = document.getElementById("cuerpoTablaDia");
  const kpiViajes = document.getElementById("kpiDiaViajes");
  const kpiTotal = document.getElementById("kpiDiaTotal");

  if (!tbodyDia) return;
  tbodyDia.innerHTML = "";

  const viajesDelDia = obtenerViajesDelDia();
  let totalDineroDia = 0;

  if (viajesDelDia.length === 0) {
    tbodyDia.innerHTML = `<tr><td colspan="12" class="td-empty">No se registraron viajes en la fecha: ${fechaSeleccionada || "No seleccionada"}</td></tr>`;
  } else {
    viajesDelDia.forEach(v => {
      const adicionales = Number(v.costo_descargue || 0) + Number(v.costo_desvio || 0);
      const esEntregado = (v.estado_entrega || "ENTREGADO") === "ENTREGADO";
      const claseBadge = esEntregado ? "badge-entregado" : "badge-no-entregado";
      const textoBadge = esEntregado ? "ENTREGADO" : "NO ENTREGADO";

      // REGLA: Si NO fue entregado, NO suma al total del día
      if (esEntregado) {
        totalDineroDia += Number(v.total_viaje || 0);
      }

      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${v.fecha}</td>
        <td><strong>${v.numero_factura || v.numero_guia || "-"}</strong></td>
        <td><span style="font-weight: 600; color: var(--primary);">${v.sucursal || "D0604"}</span></td>
        <td>${v.ciudad_destino}</td>
        <td style="text-align: center;"><span class="badge-estado ${claseBadge}">${textoBadge}</span></td>
        <td class="col-num">${Number(v.peso_kg).toLocaleString("es-CO")} kg</td>
        <td class="col-num">${formatoCOP.format(v.tarifa_base)}</td>
        <td class="col-num">${Number(v.kilos_extra).toLocaleString("es-CO")} kg (${formatoCOP.format(v.costo_kilos_extra)})</td>
        <td class="col-num">${formatoCOP.format(adicionales)}</td>
        <td class="col-num" style="font-weight: 700; color: ${esEntregado ? 'var(--accent-green)' : 'var(--text-muted)'};">${formatoCOP.format(v.total_viaje)}</td>
        <td>${v.observaciones || "-"}</td>
        <td style="text-align: center;">
          <button type="button" class="btn-novedad" onclick="abrirModalNovedades('${v.id}')">Cerrar / Novedad</button>
        </td>
      `;
      tbodyDia.appendChild(fila);
    });
  }

  // El conteo de viajes se mantiene (se realizaron físicamente), pero el dinero solo suma los entregados
  if (kpiViajes) kpiViajes.textContent = viajesDelDia.length;
  if (kpiTotal) kpiTotal.textContent = formatoCOP.format(totalDineroDia);
}

// =============================================================================
// 8. EXPORTACIONES (EXCEL Y PDF)
// =============================================================================
function exportarAExcel(lista, nombreArchivo) {
  if (!lista || lista.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const datosExcel = lista.map(item => ({
    "Fecha": item.fecha,
    "N° Factura": item.numero_factura || item.numero_guia || "S/F",
    "Sucursal": item.sucursal || "D0604",
    "Destino": item.ciudad_destino,
    "Estado Entrega": item.estado_entrega || "ENTREGADO",
    "Peso (Kg)": Number(item.peso_kg),
    "Tarifa Base (COP)": Number(item.tarifa_base),
    "Kilos Extra": Number(item.kilos_extra),
    "Costo Extra (COP)": Number(item.costo_kilos_extra),
    "Descargue (COP)": Number(item.costo_descargue),
    "Desvío (COP)": Number(item.costo_desvio),
    "Total Liquidado (COP)": Number(item.total_viaje),
    "Observaciones": item.observaciones || ""
  }));

  const worksheet = XLSX.utils.json_to_sheet(datosExcel);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Despachos");
  XLSX.writeFile(workbook, `${nombreArchivo}.xlsx`);
}

function exportarAPDF(lista, titulo, nombreArchivo) {
  if (!lista || lista.length === 0) {
    alert("No hay datos para exportar a PDF.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });

  doc.setFontSize(16);
  doc.setTextColor(30, 58, 138);
  doc.text(titulo, 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`Fecha de exportación: ${new Date().toLocaleDateString("es-CO")}`, 40, 56);

  let sumaTotalEntregados = 0;
  const filas = lista.map(item => {
    const esEntregado = (item.estado_entrega || "ENTREGADO") === "ENTREGADO";
    if (esEntregado) {
      sumaTotalEntregados += Number(item.total_viaje || 0);
    }

    const extras = Number(item.costo_descargue || 0) + Number(item.costo_desvio || 0);
    return [
      item.fecha,
      item.numero_factura || item.numero_guia || "-",
      item.sucursal || "D0604",
      item.ciudad_destino,
      item.estado_entrega || "ENTREGADO",
      `${Number(item.peso_kg).toLocaleString("es-CO")} kg`,
      formatoCOP.format(item.tarifa_base),
      `${Number(item.kilos_extra).toLocaleString("es-CO")} kg`,
      formatoCOP.format(extras),
      formatoCOP.format(item.total_viaje),
      item.observaciones || "-"
    ];
  });

  doc.autoTable({
    head: [["Fecha", "N° Factura", "Sucursal", "Destino", "Estado", "Peso", "Base", "Extra", "Extras", "Total", "Observaciones"]],
    body: filas,
    startY: 70,
    theme: "striped",
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 3 },
    foot: [["", "", "", "", "", "", "", "", "TOTAL ENTREGADOS:", formatoCOP.format(sumaTotalEntregados), ""]],
    footStyles: { fillColor: [241, 245, 249], textColor: [21, 128, 61], fontStyle: "bold" }
  });

  doc.save(`${nombreArchivo}.pdf`);
}

// =============================================================================
// 9. GESTIÓN DE PESTAÑAS (TABS)
// =============================================================================
function configurarPestanas() {
  const botonesTabs = document.querySelectorAll(".tab-btn");
  const contenidosTabs = document.querySelectorAll(".tab-content");

  botonesTabs.forEach(btn => {
    btn.addEventListener("click", () => {
      botonesTabs.forEach(b => b.classList.remove("active"));
      contenidosTabs.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      const tabTarget = document.getElementById(btn.dataset.tab);
      if (tabTarget) {
        tabTarget.classList.add("active");
      }
    });
  });
}

// =============================================================================
// 10. INICIALIZACIÓN
// =============================================================================
function iniciar() {
  const hoy = new Date().toISOString().split("T")[0];

  const inputFecha = document.getElementById("fecha");
  if (inputFecha) inputFecha.value = hoy;

  const inputFechaDia = document.getElementById("filtroFechaDia");
  if (inputFechaDia) {
    inputFechaDia.value = hoy;
    inputFechaDia.addEventListener("change", renderizarCierreDiario);
  }

  const btnHoy = document.getElementById("btnHoy");
  if (btnHoy && inputFechaDia) {
    btnHoy.addEventListener("click", () => {
      inputFechaDia.value = new Date().toISOString().split("T")[0];
      renderizarCierreDiario();
    });
  }

  // Eventos formulario de salida
  ["ciudad", "peso", "descargue", "desvio"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", actualizarPrevisualizacion);
      el.addEventListener("change", actualizarPrevisualizacion);
    }
  });

  // Eventos modal novedades
  ["editDesvio", "editDescargue"].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", actualizarCalculoModalNovedades);
    }
  });

  const btnCerrar = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelarModal");
  if (btnCerrar) btnCerrar.addEventListener("click", cerrarModalNovedades);
  if (btnCancelar) btnCancelar.addEventListener("click", cerrarModalNovedades);

  const formEdit = document.getElementById("formEdicion");
  if (formEdit) formEdit.addEventListener("submit", guardarNovedadesRetorno);

  const selectFiltro = document.getElementById("filtroCiudad");
  if (selectFiltro) {
    selectFiltro.addEventListener("change", renderizarTablaGeneral);
  }

  const form = document.getElementById("formDespacho");
  if (form) {
    form.addEventListener("submit", guardarDespacho);
  }

  // Exportaciones
  const btnExpExcelGen = document.getElementById("btnExportarExcelGeneral");
  if (btnExpExcelGen) {
    btnExpExcelGen.addEventListener("click", () => {
      exportarAExcel(obtenerViajesFiltradosGeneral(), "Reporte_General_Despachos");
    });
  }

  const btnExpPDFGen = document.getElementById("btnExportarPDFGeneral");
  if (btnExpPDFGen) {
    btnExpPDFGen.addEventListener("click", () => {
      exportarAPDF(obtenerViajesFiltradosGeneral(), "Reporte General de Despachos", "Reporte_General_Despachos");
    });
  }

  const btnExpExcelDia = document.getElementById("btnExportarExcelDia");
  if (btnExpExcelDia) {
    btnExpExcelDia.addEventListener("click", () => {
      const fecha = document.getElementById("filtroFechaDia").value || "Hoy";
      exportarAExcel(obtenerViajesDelDia(), `Cierre_Diario_${fecha}`);
    });
  }

  const btnExpPDFDia = document.getElementById("btnExportarPDFDia");
  if (btnExpPDFDia) {
    btnExpPDFDia.addEventListener("click", () => {
      const fecha = document.getElementById("filtroFechaDia").value || "Hoy";
      exportarAPDF(obtenerViajesDelDia(), `Cierre Diario de Despachos - ${fecha}`, `Cierre_Diario_${fecha}`);
    });
  }

  configurarPestanas();
  actualizarPrevisualizacion();
  conectarSupabase();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}