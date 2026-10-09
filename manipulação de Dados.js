
const pedidos = [
    { cliente: "Bia", valor: 120, status: "pago" },
    { cliente: "Carlos", valor: 80, status: "pendente" },
    { cliente: "Ana", valor: 200, status: "pago" },
    { cliente: "", valor: 50, status: "pago" },
    { cliente: "Pedro", valor: -30, status: "pago" },
    { cliente: "Lucas", valor: 0, status: "pago" }
];

const pedidosValidos = pedidos.filter(pedido => {
    return pedido.cliente.trim() !== "" &&
           typeof pedido.valor === "number" &&
           Number.isFinite(pedido.valor) &&
           pedido.valor > 0;
});

console.log("Pedidos válidos:");
console.log(pedidosValidos);


const pedidosPagos = pedidosValidos.filter(pedido => {
    return pedido.status === "pago";
});

console.log("Pedidos pagos:");
console.log(pedidosPagos);


const totalFaturado = pedidosPagos.reduce((total, pedido) => {
    return total + pedido.valor;
}, 0);

console.log("Total faturado: R$", totalFaturado.toFixed(2));

const textos = pedidosPagos.map(pedido => {
    return `${pedido.cliente} — R$ ${pedido.valor.toFixed(2)}`;
});

console.log("Relatório dos pedidos:");
textos.forEach(texto => console.log(texto));
