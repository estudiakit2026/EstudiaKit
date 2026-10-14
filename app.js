
"use strict";

/* =========================================
   ESTUDIAKIT — APP.JS COMPLETO
   1. Herramientas PDF
   2. Resumidor de texto
   3. Generador de preguntas
   4. Calculadora de notas
   5. Organizador de tareas
   6. Creador de horarios
   ========================================= */

/* =========================================
   1. FUNCIONES GENERALES
   ========================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const escaparHTML = (valor = "") =>
  String(valor).replace(/[&<>"']/g, caracter => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caracter]);

function normalizarTexto(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obtenerArea() {
  return (
    $("#area-herramienta") ||
    $("#areaHerramienta") ||
    $("#contenido-herramienta") ||
    $("#contenidoHerramienta")
  );
}

function mostrarAviso(mensaje, tipo = "info") {
  let aviso = $("#estudiakit-aviso");

  if (!aviso) {
    aviso = document.createElement("div");
    aviso.id = "estudiakit-aviso";

    aviso.style.cssText = `
      position:fixed;
      bottom:20px;
      right:20px;
      z-index:99999;
      max-width:90%;
      padding:14px 18px;
      border-radius:10px;
      color:#ffffff;
      background:#6d28d9;
      box-shadow:0 5px 20px #0003;
      font:500 14px Arial,sans-serif;
    `;

    document.body.appendChild(aviso);
  }

  aviso.style.background =
    tipo === "error" ? "#dc2626" :
    tipo === "exito" ? "#15803d" :
    "#6d28d9";

  aviso.textContent = mensaje;
  aviso.style.display = "block";

  clearTimeout(aviso._temporizador);

  aviso._temporizador = setTimeout(() => {
    aviso.style.display = "none";
  }, 3500);
}

function descargarArchivo(
  contenido,
  nombre,
  tipo = "text/plain;charset=utf-8"
) {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombre;

  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(String(texto))
      .then(() =>
        mostrarAviso("Texto copiado correctamente.", "exito")
      )
      .catch(() => copiarAlternativo(texto));
  } else {
    copiarAlternativo(texto);
  }
}

function copiarAlternativo(texto) {
  const campo = document.createElement("textarea");

  campo.value = String(texto);
  campo.style.position = "fixed";
  campo.style.opacity = "0";

  document.body.appendChild(campo);
  campo.select();

  try {
    const correcto = document.execCommand("copy");

    if (correcto) {
      mostrarAviso("Texto copiado correctamente.", "exito");
    } else {
      mostrarAviso("No se pudo copiar el texto.", "error");
    }
  } catch (error) {
    mostrarAviso("No se pudo copiar el texto.", "error");
  }

  campo.remove();
}

function crearCampo(id, etiqueta, placeholder = "", tipo = "text") {
  return `
    <label for="${id}" class="ek-label">
      ${escaparHTML(etiqueta)}
    </label>

    <input
      id="${id}"
      type="${tipo}"
      placeholder="${escaparHTML(placeholder)}"
      class="ek-input"
    >
  `;
}

function crearAreaTexto(id, etiqueta, placeholder = "") {
  return `
    <label for="${id}" class="ek-label">
      ${escaparHTML(etiqueta)}
    </label>

    <textarea
      id="${id}"
      rows="7"
      placeholder="${escaparHTML(placeholder)}"
      class="ek-input ek-textarea"
    ></textarea>
  `;
}

function crearBoton(texto, accion) {
  return `
    <button
      type="button"
      onclick="${accion}"
      class="ek-boton"
    >
      ${escaparHTML(texto)}
    </button>
  `;
}

/* =========================================
   2. TEMA MORADO
   ========================================= */

function aplicarTemaMorado() {
  if ($("#estudiakit-estilos")) return;

  const estilo = document.createElement("style");
  estilo.id = "estudiakit-estilos";

  estilo.textContent = `
    #area-herramienta,
    #areaHerramienta,
    #contenido-herramienta,
    #contenidoHerramienta {
      color: #ffffff;
    }

    #area-herramienta *,
    #areaHerramienta *,
    #contenido-herramienta *,
    #contenidoHerramienta * {
      box-sizing: border-box;
    }

    .ek-panel {
      max-width: 950px;
      margin: 0 auto;
      padding: 20px;
      color: #ffffff !important;
    }

    .ek-panel h2 {
      color: #e9d5ff !important;
      font-size: 26px;
      margin: 0 0 10px;
    }

    .ek-panel h3 {
      color: #e9d5ff !important;
      margin-top: 0;
    }

    .ek-descripcion {
      color: #e9d5ff !important;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    .ek-cuadro {
      padding: 20px;
      margin-top: 16px;
      border: 1px solid #7c3aed !important;
      border-radius: 12px;
      background: #2e1065 !important;
      color: #ffffff !important;
      box-shadow: 0 4px 14px #0002;
    }

    .ek-cuadro * {
      color: #ffffff;
    }

    .ek-cuadro h3,
    .ek-cuadro h4 {
      color: #e9d5ff !important;
    }

    .ek-label {
      display: block;
      margin: 14px 0 7px;
      color: #f3e8ff !important;
      font-weight: 600;
    }

    .ek-input {
      display: block;
      width: 100%;
      padding: 12px;
      border: 1px solid #8b5cf6 !important;
      border-radius: 8px;
      background: #3b1b70 !important;
      color: #ffffff !important;
      font: inherit;
      outline: none;
    }

    .ek-input:focus {
      border-color: #c4b5fd !important;
      box-shadow: 0 0 0 2px #8b5cf655;
    }

    .ek-input::placeholder {
      color: #d8b4fe !important;
      opacity: 1;
    }

    .ek-input option {
      background: #2e1065;
      color: #ffffff;
    }

    .ek-textarea {
      min-height: 140px;
      resize: vertical;
      line-height: 1.6;
    }

    .ek-boton {
      display: inline-block;
      margin: 8px 6px 0 0;
      padding: 12px 18px;
      border: 1px solid #a78bfa;
      border-radius: 8px;
      background: #7c3aed;
      color: #ffffff !important;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      transition: background .2s, transform .2s;
    }

    .ek-boton:hover {
      background: #6d28d9;
      transform: translateY(-1px);
    }

    .ek-boton-secundario {
      background: #4c1d95;
    }

    .ek-boton-peligro {
      background: #991b1b;
      border-color: #f87171;
    }

    .ek-boton-peligro:hover {
      background: #b91c1c;
    }

    .ek-resultado {
      padding: 20px;
      margin-top: 20px;
      border: 1px solid #7c3aed !important;
      border-radius: 12px;
      background: #2e1065 !important;
      color: #ffffff !important;
      line-height: 1.8;
      overflow-wrap: anywhere;
    }

    .ek-resultado h3 {
      color: #e9d5ff !important;
    }

    .ek-resultado p,
    .ek-resultado li,
    .ek-resultado strong,
    .ek-resultado label {
      color: #ffffff !important;
    }

    .ek-resultado small {
      color: #ddd6fe !important;
    }

    .ek-fila {
      padding: 12px;
      margin: 10px 0;
      border: 1px solid #7c3aed;
      border-radius: 10px;
      background: #3b1b70;
      color: #ffffff;
    }

    .ek-fila input[type="checkbox"] {
      accent-color: #a78bfa;
      width: 17px;
      height: 17px;
      flex-shrink: 0;
      cursor: pointer;
    }

    .ek-mensaje {
      padding: 14px;
      margin-top: 12px;
      border: 1px solid #8b5cf6;
      border-radius: 10px;
      background: #3b1b70;
      color: #ffffff;
    }

    .ek-separador {
      border: 0;
      border-top: 1px solid #7c3aed;
      margin: 28px 0;
    }

    .ek-tareas-estadisticas {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin: 20px 0;
    }

    .ek-tarea-estadistica {
      padding: 14px 8px;
      text-align: center;
      border: 1px solid #7c3aed;
      border-radius: 10px;
      background: #3b1b70;
    }

    .ek-tarea-estadistica strong {
      display: block;
      font-size: 25px;
      color: #ffffff;
    }

    .ek-tarea-estadistica span {
      display: block;
      margin-top: 4px;
      color: #ddd6fe;
      font-size: 12px;
    }

    .ek-filtros-tareas {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 16px 0;
    }

    .ek-filtro-tarea {
      padding: 9px 13px;
      border: 1px solid #8b5cf6;
      border-radius: 20px;
      background: #3b1b70;
      color: #ffffff;
      cursor: pointer;
    }

    .ek-filtro-tarea.activo {
      background: #7c3aed;
      border-color: #c4b5fd;
    }

    .ek-tarea-contenido {
      flex: 1;
      min-width: 0;
      overflow-wrap: anywhere;
    }

    .ek-tarea-completada {
      opacity: .75;
    }

    .ek-tarea-completada .ek-tarea-nombre {
      text-decoration: line-through;
      color: #c4b5fd !important;
    }

    .ek-tarea-descripcion {
      margin-top: 6px;
      color: #ddd6fe !important;
      font-size: 13px;
      white-space: pre-wrap;
    }

    .ek-tarea-fecha {
      display: inline-block;
      margin-top: 7px;
      color: #e9d5ff !important;
      font-size: 12px;
    }

    .ek-tarea-acciones {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px;
    }

    .ek-tarea-acciones .ek-boton {
      margin: 0;
      padding: 8px 11px;
    }

    @media (max-width: 600px) {
      .ek-panel {
        padding: 12px;
      }

      .ek-cuadro,
      .ek-resultado {
        padding: 14px;
      }

      .ek-boton {
        max-width: 100%;
      }

      .ek-tareas-estadisticas {
        gap: 6px;
      }

      .ek-tarea-estadistica {
        padding: 12px 5px;
      }

      .ek-tarea-estadistica strong {
        font-size: 21px;
      }

      .ek-fila-tarea {
        flex-wrap: wrap;
      }

      .ek-tarea-acciones {
        width: 100%;
        margin-left: 28px;
      }
    }
  `;

  document.head.appendChild(estilo);
}

/* =========================================
   3. ABRIR HERRAMIENTAS
   ========================================= */

function prepararPanel(titulo, descripcion = "") {
  const area = obtenerArea();

  if (!area) {
    mostrarAviso(
      "No encuentro el área de las herramientas. Revisa el identificador del HTML.",
      "error"
    );
    return null;
  }

  aplicarTemaMorado();

  area.innerHTML = `
    <section class="ek-panel">
      <h2>${escaparHTML(titulo)}</h2>

      ${descripcion ? `
        <p class="ek-descripcion">${escaparHTML(descripcion)}</p>
      ` : ""}

      <div id="resultado-herramienta"></div>
    </section>
  `;

  return area;
}

function mostrarHerramienta(nombre) {
  const clave = normalizarTexto(nombre).replace(/[\s_-]+/g, "");

  const herramientas = {
    pdf: mostrarPanelPDF,
    unirpdf: mostrarPanelPDF,
    herramientaspdf: mostrarPanelPDF,

    resumen: mostrarPanelResumen,
    resumidor: mostrarPanelResumen,
    resumendetexto: mostrarPanelResumen,

    preguntas: mostrarPanelPreguntas,
    generadorpreguntas: mostrarPanelPreguntas,
    cuestionario: mostrarPanelPreguntas,

    notas: mostrarPanelNotas,
    calculadoranotas: mostrarPanelNotas,
    calculadoradecalificaciones: mostrarPanelNotas,
    calificaciones: mostrarPanelNotas,

    // Se reconocen todos estos nombres para evitar
    // que el botón del organizador deje de funcionar.
    tareas: mostrarPanelTareas,
    organizador: mostrarPanelTareas,
    organizadordetareas: mostrarPanelTareas,
    organizadortareas: mostrarPanelTareas,

    horario: mostrarPanelHorario,
    creadordehorarios: mostrarPanelHorario
  };

  if (herramientas[clave]) {
    herramientas[clave]();
  } else {
    mostrarAviso("No encontré la herramienta: " + nombre, "error");
  }
}

/* =========================================
   4. HERRAMIENTAS PDF
   ========================================= */

function mostrarPanelPDF() {
  const area = prepararPanel(
    "Herramientas PDF",
    "Selecciona dos o más archivos PDF para unirlos en un solo documento."
  );

  if (!area) return;

  $("#resultado-herramienta").innerHTML = `
    <div class="ek-cuadro">
      <label for="archivos-pdf" class="ek-label">
        Selecciona los archivos PDF
      </label>

      <input
        id="archivos-pdf"
        type="file"
        accept=".pdf,application/pdf"
        multiple
        class="ek-input"
      >

      <p id="cantidad-pdf"></p>

      ${crearBoton("Unir archivos PDF", "unirArchivosPDF()")}

      <p style="font-size:13px;color:#ddd6fe !important;">
        Puedes seleccionar varios documentos. El resultado se descargará en tu dispositivo.
      </p>
    </div>
  `;

  $("#archivos-pdf").addEventListener("change", evento => {
    const cantidad = evento.target.files.length;
    $("#cantidad-pdf").textContent = `Archivos seleccionados: ${cantidad}`;
  });
}

async function unirArchivosPDF() {
  const archivos = Array.from($("#archivos-pdf")?.files || []);

  if (archivos.length < 2) {
    mostrarAviso("Selecciona al menos dos archivos PDF.", "error");
    return;
  }

  if (!window.PDFLib) {
    mostrarAviso(
      "No se cargó la biblioteca PDF. Revisa la conexión a internet y el HTML.",
      "error"
    );
    return;
  }

  try {
    mostrarAviso("Procesando los archivos PDF...");

    const documentoFinal = await PDFLib.PDFDocument.create();

    for (const archivo of archivos) {
      const bytes = await archivo.arrayBuffer();
      const documento = await PDFLib.PDFDocument.load(bytes);

      const paginas = await documentoFinal.copyPages(
        documento,
        documento.getPageIndices()
      );

      paginas.forEach(pagina => documentoFinal.addPage(pagina));
    }

    const resultado = await documentoFinal.save();

    descargarArchivo(
      resultado,
      "EstudiaKit-PDF-unido.pdf",
      "application/pdf"
    );

    mostrarAviso("PDF creado correctamente.", "exito");
  } catch (error) {
    console.error("Error al unir PDF:", error);

    mostrarAviso(
      "No se pudieron unir los archivos. Comprueba que sean PDF válidos y no estén protegidos.",
      "error"
    );
  }
}

/* =========================================
   5. RESUMIDOR DE TEXTO
   ========================================= */

function mostrarPanelResumen() {
  const area = prepararPanel(
    "Resumidor de texto",
    "Pega tus apuntes y crea un resumen para estudiar."
  );

  if (!area) return;

  $("#resultado-herramienta").innerHTML = `
    <div class="ek-cuadro">
      ${crearAreaTexto(
        "texto-resumen",
        "Texto original",
        "Pega aquí el texto que quieres resumir..."
      )}

      <label for="nivel-resumen" class="ek-label">
        Longitud del resumen
      </label>

      <select id="nivel-resumen" class="ek-input">
        <option value="0.2">Muy corto</option>
        <option value="0.35" selected>Medio</option>
        <option value="0.5">Detallado</option>
      </select>

      ${crearBoton("Generar resumen", "generarResumen()")}
    </div>
  `;
}

function generarResumen() {
  const texto = $("#texto-resumen")?.value.trim();

  if (!texto || texto.length < 30) {
    mostrarAviso("Escribe un texto más completo para resumirlo.", "error");
    return;
  }

  const proporcion = Number($("#nivel-resumen").value);

  const oraciones = texto
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [texto];

  let resumen;

  if (oraciones.length <= 2) {
    resumen = texto;
  } else {
    const palabrasImportantes = [
      "importante", "principal", "porque", "resultado",
      "objetivo", "significa", "caracteristica",
      "proceso", "causa", "consecuencia", "funcion",
      "permite", "consiste", "fundamental"
    ];

    const puntuadas = oraciones.map((oracion, indice) => {
      const palabras = normalizarTexto(oracion).match(/[a-z0-9]+/g) || [];

      const puntuacion = palabras.reduce((total, palabra) =>
        total + (palabrasImportantes.includes(palabra) ? 2 : 0), 0
      );

      return {
        oracion: oracion.trim(),
        indice,
        puntuacion
      };
    });

    const cantidad = Math.max(1, Math.ceil(oraciones.length * proporcion));

    resumen = puntuadas
      .sort((a, b) => b.puntuacion - a.puntuacion || a.indice - b.indice)
      .slice(0, cantidad)
      .sort((a, b) => a.indice - b.indice)
      .map(item => item.oracion)
      .join(" ");
  }

  const resultado = $("#resultado-herramienta");
  const anterior = $("#texto-resumen-resultado");

  if (anterior) anterior.closest(".ek-resultado")?.remove();

  resultado.insertAdjacentHTML("beforeend", `
    <div class="ek-resultado">
      <h3>Resumen generado</h3>

      <p id="texto-resumen-resultado"
        style="white-space:pre-wrap;line-height:1.8;color:#ffffff !important;">${escaparHTML(resumen)}</p>

      <p style="font-size:13px;color:#ddd6fe !important;">
        Revisa el resumen antes de estudiar para asegurarte de que conserve las ideas importantes.
      </p>

      ${crearBoton("Copiar resumen", "copiarTexto(document.querySelector('#texto-resumen-resultado').innerText)")}

      <button type="button" class="ek-boton"
        onclick="descargarArchivo(document.querySelector('#texto-resumen-resultado').innerText,'resumen-estudiakit.txt')">
        Descargar resumen
      </button>
    </div>
  `);
}

/* =========================================
   6. GENERADOR DE PREGUNTAS
   ========================================= */

function mostrarPanelPreguntas() {
  const area = prepararPanel(
    "Generador de preguntas",
    "Convierte tus apuntes en preguntas de repaso más claras y útiles."
  );

  if (!area) return;

  $("#resultado-herramienta").innerHTML = `
    <div class="ek-cuadro">
      ${crearAreaTexto(
        "texto-preguntas",
        "Tema o apuntes",
        "Pega aquí el contenido que estás estudiando..."
      )}

      <label for="tipo-preguntas" class="ek-label">
        Tipo de preguntas
      </label>

      <select id="tipo-preguntas" class="ek-input">
        <option value="abiertas">Preguntas de comprensión</option>
        <option value="repaso">Preguntas de repaso</option>
      </select>

      ${crearBoton("Generar preguntas", "generarPreguntas()")}
    </div>
  `;
}

function generarPreguntas() {
  const texto = $("#texto-preguntas")?.value.trim();

  if (!texto || texto.length < 20) {
    mostrarAviso("Pega un texto más completo para generar preguntas.", "error");
    return;
  }

  const textoNormalizado = normalizarTexto(texto);
  const tipo = $("#tipo-preguntas")?.value || "abiertas";

  const conceptos = [
    {
      palabras: ["programacion informatica", "programacion"],
      pregunta: "¿Qué es la programación informática y para qué sirve?"
    },
    {
      palabras: ["lenguajes de programacion", "lenguaje de programacion"],
      pregunta: "¿Qué función cumplen los lenguajes de programación?"
    },
    {
      palabras: ["variable", "variables"],
      pregunta: "¿Qué es una variable y cómo se utiliza para almacenar datos?"
    },
    {
      palabras: ["tipo de datos", "tipos de datos"],
      pregunta: "¿Qué son los tipos de datos y por qué son importantes?"
    },
    {
      palabras: ["estructura condicional", "estructuras condicionales"],
      pregunta: "¿Para qué sirven las estructuras condicionales en un programa?"
    },
    {
      palabras: ["ciclo", "ciclos"],
      pregunta: "¿Qué son los ciclos y cómo permiten repetir instrucciones?"
    },
    {
      palabras: ["funcion", "funciones"],
      pregunta: "¿Qué son las funciones y cómo ayudan a organizar el código?"
    },
    {
      palabras: ["mantenimiento"],
      pregunta: "¿Cómo facilita la organización del código el mantenimiento de un programa?"
    },
    {
      palabras: ["algoritmo", "algoritmos"],
      pregunta: "¿Qué es un algoritmo y por qué es útil antes de programar?"
    },
    {
      palabras: ["programas eficientes", "eficiencia"],
      pregunta: "¿Qué características ayudan a desarrollar programas eficientes?"
    }
  ];

  const preguntas = [];

  conceptos.forEach(concepto => {
    const encontrado = concepto.palabras.some(palabra =>
      textoNormalizado.includes(normalizarTexto(palabra))
    );

    if (encontrado && preguntas.length < 10) {
      preguntas.push(concepto.pregunta);
    }
  });

  const oraciones = texto
    .replace(/\s+/g, " ")
    .match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [texto];

  const ideas = oraciones
    .map(oracion => oracion.trim().replace(/[.!?]+$/, ""))
    .filter(oracion => oracion.split(/\s+/).length >= 7);

  ideas.forEach(idea => {
    if (preguntas.length >= 10) return;

    const pregunta = tipo === "repaso"
      ? `Explica con tus propias palabras esta idea: ${idea}.`
      : `¿Cómo explicarías la siguiente idea y qué importancia tiene?: ${idea}.`;

    if (!preguntas.includes(pregunta)) preguntas.push(pregunta);
  });

  if (!preguntas.length) {
    preguntas.push(
      "¿Cuál es la idea principal del texto?",
      "¿Qué conceptos importantes aparecen en el contenido?",
      "¿Cómo explicarías el tema con tus propias palabras?"
    );
  }

  $("#resultado-herramienta").insertAdjacentHTML("beforeend", `
    <div class="ek-resultado">
      <h3>Preguntas para estudiar</h3>

      <ol id="lista-preguntas" style="padding-left:24px;line-height:1.8;">
        ${preguntas.map(pregunta => `
          <li style="color:#ffffff !important;margin-bottom:12px;">
            ${escaparHTML(pregunta)}
          </li>
        `).join("")}
      </ol>

      <p style="font-size:13px;color:#ddd6fe !important;">
        Utiliza estas preguntas para repasar y comprobar tu comprensión del tema.
      </p>

      ${crearBoton("Copiar preguntas", "copiarTexto(document.querySelector('#lista-preguntas').innerText)")}
    </div>
  `);
}

/* =========================================
   7. CALCULADORA DE NOTAS
   ========================================= */

function mostrarPanelNotas() {
  const area = prepararPanel(
    "Calculadora de notas",
    "Calcula tu promedio ponderado o descubre qué nota necesitas para alcanzar tu meta."
  );

  if (!area) return;

  $("#resultado-herramienta").innerHTML = `
    <div class="ek-cuadro">
      <h3>Promedio ponderado</h3>

      <p>Introduce las notas y el porcentaje que vale cada evaluación. Los porcentajes deben sumar 100%.</p>

      <div id="filas-notas">
        ${crearFilaNota(1)}
        ${crearFilaNota(2)}
        ${crearFilaNota(3)}
      </div>

      <button type="button" class="ek-boton"
        onclick="agregarFilaNota()">
        + Añadir evaluación
      </button>

      ${crearBoton("Calcular promedio", "calcularPromedio()")}

      <div id="resultado-notas"></div>

      <hr class="ek-separador">

      <h3>Nota necesaria para alcanzar mi meta</h3>

      ${crearCampo("nota-actual", "Promedio actual", "Ej. 75", "number")}
      ${crearCampo("peso-actual", "Porcentaje ya evaluado", "Ej. 60", "number")}
      ${crearCampo("nota-meta", "Nota final deseada", "Ej. 80", "number")}

      ${crearBoton("Calcular nota necesaria", "calcularNotaNecesaria()")}

      <div id="resultado-necesaria"></div>
    </div>
  `;

  window.contadorFilasNotas = 3;
}

function crearFilaNota(numero) {
  return `
    <div class="ek-fila">
      <label class="ek-label">Evaluación ${numero}</label>

      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;">
        <div>
          <label class="ek-label">Nota (0–100)</label>
          <input class="nota-valor ek-input" type="number"
            min="0" max="100" step="any" placeholder="Ej. 85">
        </div>

        <div>
          <label class="ek-label">Peso (%)</label>
          <input class="nota-peso ek-input" type="number"
            min="0" max="100" step="any" placeholder="Ej. 30">
        </div>
      </div>
    </div>
  `;
}

function agregarFilaNota() {
  const contenedor = $("#filas-notas");
  if (!contenedor) return;

  window.contadorFilasNotas = (window.contadorFilasNotas || 3) + 1;

  contenedor.insertAdjacentHTML(
    "beforeend",
    crearFilaNota(window.contadorFilasNotas)
  );
}

function calcularPromedio() {
  const notas = Array.from(document.querySelectorAll(".nota-valor"));
  const pesos = Array.from(document.querySelectorAll(".nota-peso"));

  let sumaPonderada = 0;
  let sumaPesos = 0;

  for (let i = 0; i < notas.length; i++) {
    const notaTexto = notas[i].value.trim();
    const pesoTexto = pesos[i].value.trim();

    if (!notaTexto && !pesoTexto) continue;

    const nota = Number(notaTexto);
    const peso = Number(pesoTexto);

    if (
      !notaTexto || !pesoTexto ||
      !Number.isFinite(nota) ||
      !Number.isFinite(peso) ||
      nota < 0 || nota > 100 ||
      peso < 0 || peso > 100
    ) {
      mostrarAviso("Revisa las notas y los porcentajes. Deben estar entre 0 y 100.", "error");
      return;
    }

    sumaPonderada += nota * peso;
    sumaPesos += peso;
  }

  if (sumaPesos === 0) {
    mostrarAviso("Introduce al menos una nota y su porcentaje.", "error");
    return;
  }

  if (Math.abs(sumaPesos - 100) > 0.01) {
    mostrarAviso(`Los porcentajes suman ${sumaPesos}%. Deben sumar 100%.`, "error");
    return;
  }

  const promedio = sumaPonderada / 100;

  $("#resultado-notas").innerHTML = `
    <div class="ek-resultado">
      <h3>Tu promedio</h3>
      <strong style="font-size:32px;color:#ffffff !important;">
        ${promedio.toFixed(2)} / 100
      </strong>
    </div>
  `;
}

function calcularNotaNecesaria() {
  const actualTexto = $("#nota-actual")?.value.trim();
  const pesoTexto = $("#peso-actual")?.value.trim();
  const metaTexto = $("#nota-meta")?.value.trim();

  if (!actualTexto || !pesoTexto || !metaTexto) {
    mostrarAviso("Completa los tres campos.", "error");
    return;
  }

  const actual = Number(actualTexto);
  const peso = Number(pesoTexto);
  const meta = Number(metaTexto);

  if (
    !Number.isFinite(actual) ||
    !Number.isFinite(peso) ||
    !Number.isFinite(meta) ||
    actual < 0 || actual > 100 ||
    peso < 0 || peso >= 100 ||
    meta < 0 || meta > 100
  ) {
    mostrarAviso(
      "Revisa los valores. El porcentaje evaluado debe ser mayor o igual a 0 y menor que 100.",
      "error"
    );
    return;
  }

  const necesario =
    (meta - actual * peso / 100) / (1 - peso / 100);

  const salida = $("#resultado-necesaria");

  if (necesario > 100) {
    salida.innerHTML = `
      <div class="ek-resultado">
        No es posible alcanzar esa meta con una nota máxima de 100.
        Necesitarías ${necesario.toFixed(2)} puntos en lo que falta.
      </div>
    `;
  } else if (necesario <= 0) {
    salida.innerHTML = `
      <div class="ek-resultado">
        Ya alcanzaste la meta, suponiendo que tu promedio no baje.
      </div>
    `;
  } else {
    salida.innerHTML = `
      <div class="ek-resultado">
        <h3>Nota necesaria</h3>
        Necesitas aproximadamente
        <strong>${necesario.toFixed(2)} / 100</strong>
        en el porcentaje restante para alcanzar tu meta.
      </div>
    `;
  }
}

/* =========================================
   8. ORGANIZADOR DE TAREAS
   ========================================= */

const CLAVE_TAREAS = "estudiakit_tareas_v1";

function cargarTareasGuardadas() {
  try {
    const guardadas = localStorage.getItem(CLAVE_TAREAS);

    if (!guardadas) return [];

    const tareas = JSON.parse(guardadas);

    if (!Array.isArray(tareas)) return [];

    return tareas
      .filter(tarea => tarea && typeof tarea === "object")
      .map(tarea => ({
        id: String(tarea.id || (
          Date.now() + Math.random().toString(16).slice(2)
        )),
        nombre: String(tarea.nombre || "Tarea sin nombre"),
        descripcion: String(tarea.descripcion || ""),
        fecha: String(tarea.fecha || ""),
        completada: Boolean(tarea.completada),
        creada: Number(tarea.creada || Date.now())
      }));
  } catch (error) {
    console.error("No se pudieron cargar las tareas:", error);
    return [];
  }
}

function guardarTareas() {
  try {
    localStorage.setItem(
      CLAVE_TAREAS,
      JSON.stringify(window.estudiakitTareas || [])
    );
    return true;
  } catch (error) {
    console.error("No se pudieron guardar las tareas:", error);
    mostrarAviso(
      "No se pudieron guardar los cambios en este navegador.",
      "error"
    );
    return false;
  }
}

window.estudiakitTareas = cargarTareasGuardadas();
window.filtroTareasEstudiakit = "todas";

function mostrarPanelTareas() {
  const area = prepararPanel(
    "Organizador de tareas",
    "Organiza tus pendientes, añade fechas de entrega y marca lo que vayas terminando."
  );

  if (!area) return;

  $("#resultado-herramienta").innerHTML = `
    <div class="ek-cuadro">
      <h3>Agregar una tarea</h3>

      ${crearCampo(
        "tarea-nombre",
        "Nombre de la tarea",
        "Ej. Terminar el proyecto"
      )}

      <label for="tarea-descripcion" class="ek-label">
        Descripción (opcional)
      </label>

      <textarea
        id="tarea-descripcion"
        class="ek-input ek-textarea"
        rows="3"
        placeholder="Escribe detalles, materiales o instrucciones..."
        style="min-height:85px;"
      ></textarea>

      ${crearCampo("tarea-fecha", "Fecha de entrega", "", "date")}

      ${crearBoton("Agregar tarea", "agregarTarea()")}

      <hr class="ek-separador">

      <h3>Mis tareas</h3>

      <div id="estadisticas-tareas" class="ek-tareas-estadisticas"></div>

      <div class="ek-filtros-tareas" aria-label="Filtrar tareas">
        <button type="button"
          class="ek-filtro-tarea activo"
          data-filtro-tarea="todas"
          onclick="filtrarTareas('todas')">
          Todas
        </button>

        <button type="button"
          class="ek-filtro-tarea"
          data-filtro-tarea="pendientes"
          onclick="filtrarTareas('pendientes')">
          Pendientes
        </button>

        <button type="button"
          class="ek-filtro-tarea"
          data-filtro-tarea="completadas"
          onclick="filtrarTareas('completadas')">
          Completadas
        </button>
      </div>

      <div id="lista-tareas" style="margin-top:16px;"></div>

      <div style="margin-top:20px;">
        <button type="button"
          class="ek-boton ek-boton-secundario"
          onclick="descargarTareas()">
          Descargar mis tareas
        </button>

        <button type="button"
          class="ek-boton ek-boton-peligro"
          onclick="eliminarTareasCompletadas()">
          Borrar completadas
        </button>
      </div>

      <p style="font-size:12px;color:#ddd6fe !important;margin-top:16px;">
        Tus tareas se guardan en este navegador. Si borras los datos del navegador o cambias de dispositivo, podrían perderse.
      </p>
    </div>
  `;

  if (!Array.isArray(window.estudiakitTareas)) {
    window.estudiakitTareas = cargarTareasGuardadas();
  }

  window.filtroTareasEstudiakit = "todas";

  renderizarTareas();
}

function agregarTarea() {
  const campoNombre = $("#tarea-nombre");
  const campoDescripcion = $("#tarea-descripcion");
  const campoFecha = $("#tarea-fecha");

  const nombre = campoNombre?.value.trim();
  const descripcion = campoDescripcion?.value.trim() || "";
  const fecha = campoFecha?.value || "";

  if (!nombre) {
    mostrarAviso("Escribe el nombre de la tarea.", "error");
    campoNombre?.focus();
    return;
  }

  if (fecha) {
    const fechaSeleccionada = new Date(`${fecha}T00:00:00`);
    const fechaMaxima = new Date("9999-12-31T00:00:00");

    if (
      Number.isNaN(fechaSeleccionada.getTime()) ||
      fechaSeleccionada > fechaMaxima
    ) {
      mostrarAviso("La fecha de entrega no es válida.", "error");
      return;
    }
  }

  window.estudiakitTareas = window.estudiakitTareas || [];

  window.estudiakitTareas.push({
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    nombre,
    descripcion,
    fecha,
    completada: false,
    creada: Date.now()
  });

  guardarTareas();

  if (campoNombre) campoNombre.value = "";
  if (campoDescripcion) campoDescripcion.value = "";
  if (campoFecha) campoFecha.value = "";

  window.filtroTareasEstudiakit = "todas";

  renderizarTareas();
  mostrarAviso("Tarea agregada correctamente.", "exito");
  campoNombre?.focus();
}

function renderizarTareas() {
  const lista = $("#lista-tareas");
  if (!lista) return;

  const tareas = window.estudiakitTareas || [];
  const filtro = window.filtroTareasEstudiakit || "todas";

  const pendientes = tareas.filter(tarea => !tarea.completada).length;
  const completadas = tareas.filter(tarea => tarea.completada).length;

  const estadisticas = $("#estadisticas-tareas");

  if (estadisticas) {
    estadisticas.innerHTML = `
      <div class="ek-tarea-estadistica">
        <strong>${tareas.length}</strong>
        <span>Total</span>
      </div>

      <div class="ek-tarea-estadistica">
        <strong>${pendientes}</strong>
        <span>Pendientes</span>
      </div>

      <div class="ek-tarea-estadistica">
        <strong>${completadas}</strong>
        <span>Completadas</span>
      </div>
    `;
  }

  document.querySelectorAll("[data-filtro-tarea]").forEach(boton => {
    const activo = boton.dataset.filtroTarea === filtro;

    boton.classList.toggle("activo", activo);
    boton.setAttribute("aria-pressed", String(activo));
  });

  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === "pendientes") return !tarea.completada;
    if (filtro === "completadas") return tarea.completada;
    return true;
  });

  if (!tareasFiltradas.length) {
    const mensajes = {
      todas: "Todavía no tienes tareas. Agrega la primera arriba.",
      pendientes: "¡Excelente! No tienes tareas pendientes.",
      completadas: "Todavía no has completado ninguna tarea."
    };

    lista.innerHTML = `
      <div class="ek-mensaje">
        ${mensajes[filtro] || mensajes.todas}
      </div>
    `;

    return;
  }

  const ordenadas = [...tareasFiltradas].sort((a, b) => {
    if (a.completada !== b.completada) {
      return Number(a.completada) - Number(b.completada);
    }

    if (a.fecha && b.fecha) {
      return a.fecha.localeCompare(b.fecha);
    }

    if (a.fecha) return -1;
    if (b.fecha) return 1;

    return (a.creada || 0) - (b.creada || 0);
  });

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  lista.innerHTML = ordenadas.map(tarea => {
    const fechaTexto = tarea.fecha
      ? (() => {
          const fecha = new Date(`${tarea.fecha}T00:00:00`);
          const formateada = fecha.toLocaleDateString("es", {
            day: "2-digit",
            month: "short",
            year: "numeric"
          });

          const vencida =
            !tarea.completada && fecha < hoy;

          return `
            <span class="ek-tarea-fecha"
              style="${vencida ? "color:#fca5a5 !important;" : ""}">
              ${vencida ? "⚠ Vencida · " : "📅 Entrega · "}
              ${escaparHTML(formateada)}
            </span>
          `;
        })()
      : `
          <span class="ek-tarea-fecha">
            Sin fecha de entrega
          </span>
        `;

    return `
      <div class="ek-fila ek-fila-tarea ${tarea.completada ? "ek-tarea-completada" : ""}"
        style="display:flex;align-items:flex-start;gap:12px;">

        <input
          type="checkbox"
          ${tarea.completada ? "checked" : ""}
          aria-label="Marcar ${escaparHTML(tarea.nombre)} como completada"
          onchange="marcarTarea('${escaparHTML(tarea.id)}',this.checked)"
          style="margin-top:4px;"
        >

        <div class="ek-tarea-contenido">
          <div class="ek-tarea-nombre"
            style="font-weight:700;color:#ffffff;">
            ${escaparHTML(tarea.nombre)}
          </div>

          ${tarea.descripcion ? `
            <div class="ek-tarea-descripcion">
              ${escaparHTML(tarea.descripcion)}
            </div>
          ` : ""}

          ${fechaTexto}

          <div style="margin-top:5px;font-size:12px;color:#c4b5fd;">
            ${tarea.completada ? "✓ Completada" : "○ Pendiente"}
          </div>
        </div>

        <div class="ek-tarea-acciones">
          <button type="button"
            class="ek-boton ek-boton-peligro"
            onclick="eliminarTarea('${escaparHTML(tarea.id)}')">
            Eliminar
          </button>
        </div>
      </div>
    `;
  }).join("");
}

function filtrarTareas(filtro) {
  if (!["todas", "pendientes", "completadas"].includes(filtro)) {
    filtro = "todas";
  }

  window.filtroTareasEstudiakit = filtro;
  renderizarTareas();
}

function marcarTarea(id, completada) {
  const tarea = (window.estudiakitTareas || [])
    .find(item => item.id === id);

  if (!tarea) {
    mostrarAviso("No encontré esa tarea.", "error");
    return;
  }

  tarea.completada = Boolean(completada);

  guardarTareas();
  renderizarTareas();

  mostrarAviso(
    tarea.completada
      ? "¡Tarea completada!"
      : "La tarea volvió a pendientes.",
    "exito"
  );
}

function eliminarTarea(id) {
  const tareas = window.estudiakitTareas || [];
  const existe = tareas.some(tarea => tarea.id === id);

  if (!existe) {
    mostrarAviso("No encontré esa tarea.", "error");
    return;
  }

  window.estudiakitTareas = tareas.filter(tarea => tarea.id !== id);

  guardarTareas();
  renderizarTareas();

  mostrarAviso("Tarea eliminada.", "exito");
}

function eliminarTareasCompletadas() {
  const tareas = window.estudiakitTareas || [];
  const completadas = tareas.filter(tarea => tarea.completada).length;

  if (!completadas) {
    mostrarAviso("No tienes tareas completadas para borrar.", "error");
    return;
  }

  const confirmar = window.confirm(
    `¿Quieres eliminar las ${completadas} tareas completadas? Esta acción no se puede deshacer.`
  );

  if (!confirmar) return;

  window.estudiakitTareas = tareas.filter(tarea => !tarea.completada);

  guardarTareas();
  renderizarTareas();

  mostrarAviso("Tareas completadas eliminadas.", "exito");
}

function descargarTareas() {
  const tareas = window.estudiakitTareas || [];

  if (!tareas.length) {
    mostrarAviso("No tienes tareas para descargar.", "error");
    return;
  }

  const contenido = [
    "ESTUDIAKIT — MIS TAREAS",
    "========================",
    "",
    ...tareas.map((tarea, indice) => {
      const estado = tarea.completada ? "COMPLETADA" : "PENDIENTE";

      return [
        `${indice + 1}. ${tarea.nombre}`,
        `Estado: ${estado}`,
        `Fecha de entrega: ${tarea.fecha || "Sin fecha"}`,
        `Descripción: ${tarea.descripcion || "Sin descripción"}`,
        ""
      ].join("\n");
    })
  ].join("\n");

  descargarArchivo(
    contenido,
    "mis-tareas-estudiakit.txt",
    "text/plain;charset=utf-8"
  );

  mostrarAviso("Lista de tareas descargada.", "exito");
}

/* =========================================
   9. CREADOR DE HORARIOS
   ========================================= */

function mostrarPanelHorario() {
  const area = prepararPanel(
    "Creador de horarios",
    "Organiza tus clases, actividades y horas de estudio."
  );

  if (!area) return;

  $("#resultado-herramienta").innerHTML = `
    <div class="ek-cuadro">
      ${crearCampo(
        "horario-actividad",
        "Actividad o clase",
        "Ej. Matemáticas"
      )}

      <label for="horario-dia" class="ek-label">Día</label>

      <select id="horario-dia" class="ek-input">
        <option value="Lunes">Lunes</option>
        <option value="Martes">Martes</option>
        <option value="Miércoles">Miércoles</option>
        <option value="Jueves">Jueves</option>
        <option value="Viernes">Viernes</option>
        <option value="Sábado">Sábado</option>
        <option value="Domingo">Domingo</option>
      </select>

      ${crearCampo("horario-inicio", "Hora de inicio", "", "time")}
      ${crearCampo("horario-fin", "Hora de finalización", "", "time")}

      ${crearBoton("Agregar al horario", "agregarHorario()")}

      <div id="lista-horario" style="margin-top:20px;"></div>

      <button type="button" class="ek-boton"
        onclick="descargarHorario()">
        Descargar horario
      </button>
    </div>
  `;

  window.estudiakitHorario = window.estudiakitHorario || [];

  renderizarHorario();
}

function agregarHorario() {
  const actividad = $("#horario-actividad")?.value.trim();
  const dia = $("#horario-dia")?.value;
  const inicio = $("#horario-inicio")?.value;
  const fin = $("#horario-fin")?.value;

  if (!actividad || !dia || !inicio || !fin) {
    mostrarAviso(
      "Completa la actividad, el día y las dos horas.",
      "error"
    );
    return;
  }

  if (fin <= inicio) {
    mostrarAviso(
      "La hora de finalización debe ser posterior a la de inicio.",
      "error"
    );
    return;
  }

  window.estudiakitHorario = window.estudiakitHorario || [];

  window.estudiakitHorario.push({
    id: String(Date.now()) + Math.random().toString(16).slice(2),
    actividad,
    dia,
    inicio,
    fin
  });

  $("#horario-actividad").value = "";
  $("#horario-inicio").value = "";
  $("#horario-fin").value = "";

  renderizarHorario();
  mostrarAviso("Actividad agregada al horario.", "exito");
}

function renderizarHorario() {
  const lista = $("#lista-horario");
  if (!lista) return;

  const actividades = window.estudiakitHorario || [];

  const dias = [
    "Lunes", "Martes", "Miércoles", "Jueves",
    "Viernes", "Sábado", "Domingo"
  ];

  if (!actividades.length) {
    lista.innerHTML = `
      <div class="ek-mensaje">
        Tu horario está vacío. Agrega una actividad.
      </div>
    `;
    return;
  }

  const ordenadas = [...actividades].sort((a, b) => {
    const diferenciaDia = dias.indexOf(a.dia) - dias.indexOf(b.dia);
    return diferenciaDia || a.inicio.localeCompare(b.inicio);
  });

  lista.innerHTML = `
    <h3>Mi horario</h3>

    ${ordenadas.map(actividad => `
      <div class="ek-fila">
        <strong>${escaparHTML(actividad.dia)}</strong>

        <div>
          ${escaparHTML(actividad.inicio)}
          –
          ${escaparHTML(actividad.fin)}
        </div>

        <div>${escaparHTML(actividad.actividad)}</div>

        <button type="button" class="ek-boton"
          onclick="eliminarActividadHorario('${escaparHTML(actividad.id)}')">
          Eliminar
        </button>
      </div>
    `).join("")}
  `;
}

function eliminarActividadHorario(id) {
  window.estudiakitHorario = (window.estudiakitHorario || [])
    .filter(actividad => actividad.id !== id);

  renderizarHorario();
  mostrarAviso("Actividad eliminada.", "exito");
}

function descargarHorario() {
  const actividades = window.estudiakitHorario || [];

  if (!actividades.length) {
    mostrarAviso(
      "Agrega actividades antes de descargar el horario.",
      "error"
    );
    return;
  }

  const dias = [
    "Lunes", "Martes", "Miércoles", "Jueves",
    "Viernes", "Sábado", "Domingo"
  ];

  const contenido = [...actividades]
    .sort((a, b) => {
      const diferenciaDia = dias.indexOf(a.dia) - dias.indexOf(b.dia);
      return diferenciaDia || a.inicio.localeCompare(b.inicio);
    })
    .map(actividad =>
      `${actividad.dia} | ${actividad.inicio} - ${actividad.fin} | ${actividad.actividad}`
    )
    .join("\n");

  descargarArchivo(
    contenido,
    "mi-horario-estudiakit.txt",
    "text/plain;charset=utf-8"
  );

  mostrarAviso("Horario descargado.", "exito");
}

/* =========================================
   10. REGISTRO GLOBAL DE FUNCIONES
   ========================================= */

Object.assign(window, {
  mostrarHerramienta,

  mostrarPanelPDF,
  unirArchivosPDF,

  mostrarPanelResumen,
  generarResumen,

  mostrarPanelPreguntas,
  generarPreguntas,

  mostrarPanelNotas,
  crearFilaNota,
  agregarFilaNota,
  calcularPromedio,
  calcularNotaNecesaria,

  mostrarPanelTareas,
  agregarTarea,
  renderizarTareas,
  marcarTarea,
  eliminarTarea,
  filtrarTareas,
  eliminarTareasCompletadas,
  descargarTareas,

  mostrarPanelHorario,
  agregarHorario,
  renderizarHorario,
  eliminarActividadHorario,
  descargarHorario,

  copiarTexto,
  copiarAlternativo,
  descargarArchivo,
  mostrarAviso
});

/* =========================================
   11. INICIALIZACIÓN
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
  aplicarTemaMorado();

  // Recuperar las tareas guardadas en este navegador.
  window.estudiakitTareas = cargarTareasGuardadas();

  console.log("EstudiaKit: app.js cargado correctamente.");

  const area = obtenerArea();

  if (area && !area.innerHTML.trim()) {
    area.innerHTML = `
      <div class="ek-panel" style="text-align:center;">
        <h2>¿Qué quieres estudiar hoy?</h2>
        <p class="ek-descripcion">
          Selecciona una herramienta para comenzar.
        </p>
      </div>
    `;
  }
});

/* =========================================
   12. ESTILOS DE LA BARRA BUSCADORA
   ========================================= */

(function corregirBarraBuscadora() {
  const estiloBusqueda = document.createElement("style");

  estiloBusqueda.id = "estudiakit-estilo-buscador";

  estiloBusqueda.textContent = `
    input[type="search"],
    input[type="text"],
    input[type="search"]:focus,
    input[type="text"]:focus,
    #buscador,
    #busqueda,
    #buscar,
    #barra-busqueda,
    #barraBusqueda,
    .buscador,
    .barra-busqueda,
    .barraBusqueda,
    .search-bar,
    .search-input,
    .search-box input,
    .buscador input,
    .barra-busqueda input,
    .barraBusqueda input {
      color: #ffffff !important;
      caret-color: #ffffff !important;
    }

    input[type="search"]::placeholder,
    input[type="text"]::placeholder,
    #buscador::placeholder,
    #busqueda::placeholder,
    #buscar::placeholder,
    #barra-busqueda::placeholder,
    #barraBusqueda::placeholder,
    .buscador::placeholder,
    .barra-busqueda::placeholder,
    .barraBusqueda::placeholder,
    .search-bar::placeholder,
    .search-input::placeholder,
    .search-box input::placeholder,
    .buscador input::placeholder,
    .barra-busqueda input::placeholder,
    .barraBusqueda input::placeholder {
      color: #e9d5ff !important;
      opacity: 1 !important;
    }
  `;

  const anterior = document.querySelector("#estudiakit-estilo-buscador");

  if (anterior) anterior.remove();

  document.head.appendChild(estiloBusqueda);
})();
