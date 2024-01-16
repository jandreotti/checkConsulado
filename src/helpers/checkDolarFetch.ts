import axios from "axios";

export const checkearDolarFetch = async () => {
  const resp = await fetch("https://www.infodolar.com/cotizacion-dolar-provincia-cordoba.aspx");
  const html = await resp.text();
  // Obtengo compra y venta
  let compraS = html.split("BluePromedio")[1].split("colCompraVenta")[1].split("data-order=\"$ ")[1].split("\"")[0];
  let ventaS = html.split("BluePromedio")[1].split("colCompraVenta")[2].split("data-order=\"$ ")[1].split("\"")[0];
  // Reemplazo de caracteres
  compraS = compraS.replace(".", "").replace(",", ".");
  ventaS = ventaS.replace(".", "").replace(",", ".");
  // Redondeo a 2 caracteres
  const compra = roundNum(parseFloat(compraS), 2);
  const venta = roundNum(parseFloat(ventaS), 2);
  console.log({ compra, venta });
  return { compra, venta };
};

export const checkearDolarAxios = async () => {
  const resp = await axios("https://www.infodolar.com/cotizacion-dolar-provincia-cordoba.aspx");
  const html = resp.data;
  // Obtengo compra y venta
  let compraS = html.split("BluePromedio")[1].split("colCompraVenta")[1].split("data-order=\"$ ")[1].split("\"")[0];
  let ventaS = html.split("BluePromedio")[1].split("colCompraVenta")[2].split("data-order=\"$ ")[1].split("\"")[0];
  // Reemplazo de caracteres
  compraS = compraS.replace(".", "").replace(",", ".");
  ventaS = ventaS.replace(".", "").replace(",", ".");
  // Redondeo a 2 caracteres
  const compra = roundNum(parseFloat(compraS), 2);
  const venta = roundNum(parseFloat(ventaS), 2);
  console.log({ compra, venta });
  return { compra, venta };
};




const roundNum = (num: number, length: number) => {
  var number = Math.round(num * Math.pow(10, length)) / Math.pow(10, length);
  return number;
};