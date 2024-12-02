const entradaPesos = document.querySelector("input");
const seleccionMoneda = document.getElementById("selector");
const boton = document.querySelector("button");
const resultadoTexto = document.querySelector(".resultado");
const urlBase = "https://mindicador.cl/api";
let grafico = null;

boton.addEventListener("click", async () => {
  const valorMoneda = await obtenerMoneda(seleccionMoneda.value);
  const valorFinal = (entradaPesos.value / valorMoneda).toFixed(2);
  resultadoTexto.innerHTML = `Resultado: $${valorFinal}`;
});

const obtenerMoneda = async (moneda) => {
  try {
    const respuesta = await fetch(`${urlBase}/${moneda}`);
    const datos = await respuesta.json();
    const serie = datos.serie;

    const datosGrafico = crearDatosGrafico(serie.slice(0, 10).reverse());
    if (grafico) {
      grafico.destroy();
    }

    renderizarGrafico(datosGrafico);
    return serie[0].valor;
  } catch (error) {
    console.log(error);
  }
};

const crearDatosGrafico = (datos) => {
  const etiquetas = datos.map((dato) => formatearFecha(dato.fecha));
  const valores = datos.map((dato) => dato.valor);

  const conjuntoDatos = [
    {
      label: "Historial 10 días",
      borderColor: "rgb(255, 99, 132)",
      data: valores,
    },
  ];
  return { labels: etiquetas, datasets: conjuntoDatos };
};

const renderizarGrafico = (datos) => {
  const configuracion = {
    type: "line",
    data: datos,
  };
  if (grafico) {
    grafico.destroy();
  }

  const lienzo = document.getElementById("myChart");
  grafico = new Chart(lienzo, configuracion);
};

const formatearFecha = (fecha) => {
  fecha = new Date(fecha);
  const año = fecha.getFullYear();
  const mes = fecha.getMonth() + 1;
  const dia = fecha.getDate();
  return `${dia}/${mes}/${año}`;
};
