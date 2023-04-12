//////////////////////////////////
//         DECLARACION          //
//////////////////////////////////

// Clase para los Items Disponibles y el Carrito de Compras
class Item{
    constructor(codigo, descrip, precioUn, cantidad){
        this.codigo   = codigo;
        this.descrip  = descrip;
        this.precioUn = precioUn;
        this.cantidad = cantidad;
        this.monto    = 0;
        if (cantidad!==0){
            this.monto    = this.precioUn * cantidad;
        }
    }

    sumarCantidad(cantidad){
        this.cantidad = this.cantidad + cantidad;
        this.monto    = this.precioUn * this.cantidad;
    }

    modificarCantidad(cantidad){
        this.cantidad = cantidad;
        this.monto    = this.precioUn * cantidad;
    }
}

const items   = []; // Array con los articulos existentes
const carrito = []; // Array con los articulos seleccionados para comprar

const compra ={
    beneficioPorcentaje: 10,
    beneficioMonto: 15000,
    subtotal: 0,
    descuento: 0,
    total: 0,

    calcularMontos(){
        this.subtotal = 0;
        carrito.forEach((item)=>{
            // Calcula los valores finales:
            this.subtotal = this.subtotal + item.monto;
        });
        
        // Calcula descuentos:
        this.calcularDescuento();
    },

    sumarMonto(monto){
        this.subtotal = this.subtotal + monto;
        this.calcularDescuento();
    },

    calcularDescuento(){
        if(parseFloat(this.subtotal) >= this.beneficioMonto){
            this.descuento = parseFloat(( this.beneficioPorcentaje * this.subtotal ) /100).toFixed(2);
            this.total = this.subtotal - this.descuento;
        }else{
            this.descuento = 0;
            this.total     = this.subtotal;
        }
        this.imprimirTotales();
    },

    recuperarTotales(){
        let totales = "\nTotales";
        totales = totales + "\nSubtotal: $" + this.subtotal.toFixed(2);
        totales = totales + "\nDescuento: $" + parseFloat(this.descuento).toFixed(2);
        totales = totales + "\nTotal: $" + this.total.toFixed(2);
        return totales;
    },

    imprimirTotales(){
        console.log(this.recuperarTotales());
    }
}

//////////////////////////////////
//         FUNCIONES            //
//////////////////////////////////

// Función para cargar los items existentes al inicializar el programa
const cargarItem =(codigo, descrip, precioUn)=>{
    items.push(new Item(parseInt(codigo), descrip, parseFloat(precioUn), 0));
}

// Carga los artciulos disponibles para seleccionar
const cargaInicial =()=>{
    cargarItem(1, "Articulo A", "223.50");
    cargarItem(2, "Articulo B", "431.99");
    cargarItem(3, "Articulo C", "157.20");
    cargarItem(4, "Articulo D", "510.50");
    cargarItem(5, "Articulo E", "619.99");

    console.log("Carga inicial realizada correctamente");
}

// Busca el código del Item en el Array Indicado (devuelve Index):
const buscarCodigo=(codigo, lista)=>{
    const index = lista.findIndex(item => item.codigo == parseInt(codigo));
    return index;
}

const getArticulo =(modificar)=> {
    //Solicita un código de Artículo
    let codigo = "0";

    do{
        if(modificar===true){
            codigo = parseInt(prompt("Seleccione el código de artículo a modificar.\n (Ingrese 0 para Cancelar y volver al menú anterior)"));
        }else{
            codigo = parseInt(prompt("Seleccione el código de artículo solicitado.\n (Ingrese 0 para Cancelar y volver al menú anterior)"));
        }
        if (codigo==0){return}

        let index = buscarCodigo(codigo, items);
        if(index == -1 ){
        
            // Fuerza el valor NaN para que se solicite un artículo nuevamente
            console.log("Código no válido.");
            codigo = NaN;
        }
    }while(isNaN(codigo))
    return codigo;
}

const agregarParrafo=(texto, nuevoTexto)=>{
    if(texto==""){
        return nuevoTexto;
    }else{
        return texto + "\n" + nuevoTexto;
    }
}

// Retorna los valores del elemento indicado en el Index:
const buscarItem=(index, lista)=>{
    return lista[index];
}

// Muestra los items existentes en la lista enviada por parámetro:
const visualizarArticulos=(lista, esCarrito)=>{
    let articulos = "";
    let detalle   = "";
    
    // Titulo de la lista a visualizar:
    if (esCarrito===true){
        articulos = "Carrito";
        articulos = agregarParrafo(articulos, "<Código> ; <Descripción> ; <Precio Unitario> ; <Cantidad> ; <SubTotal> ");
    }else{
        articulos = "Lista de Productos";
        articulos = agregarParrafo(articulos, "<Código> ; <Descripción> ; <Precio Unitario>");
    }
    articulos = agregarParrafo(articulos, "========================");

    lista.forEach((item)=>{
        // Muestra los detalles comunes:
        detalle = item.codigo + " ; " + item.descrip  + " ; $" + parseFloat(item.precioUn).toFixed(2);

        // Si es Carrito, agrega Cantidad y SubTotal:
        if (esCarrito===true){
            detalle = detalle + " ; " + item.cantidad + " ; $" + parseFloat(item.monto).toFixed(2);
        }
        articulos = agregarParrafo(articulos, detalle);

    });

    if(esCarrito===true){
        articulos = agregarParrafo(articulos, compra.recuperarTotales());
    }

    alert(articulos);
}

// Agrega artículos al Carrito
const agregarItems=()=>{
    let codigo = 0;
    let index  = 0;
    let item;

    // Selecciona Item a agregar
    do{
        codigo = getArticulo();
        if(codigo > 0){
            index = buscarCodigo(codigo, items);
            item = buscarItem( index ,items);
            ingresarCantidad(item);
        }else{
            return
        }
    }while(confirm("Desea agregar más artículos?"))
}

// Indica la cantidad necesaria para el Item seleccionado:
const ingresarCantidad=(item)=>{
    let cantidad = 0;
    cantidad = parseInt(prompt("Ingresa la cantidad para:\n" + item.descrip + "; $" + parseFloat(item.precioUn).toFixed(2) + "\n(Ingrese 0 para cancelar)"));
    if(cantidad <= 0 || isNaN(cantidad)){
        alert("Operación cancelada.");
    }else{
        item.cantidad = cantidad;
        cargarItemCarrito(item);
    }
}

const cargarItemCarrito=(item)=>{
    // Verifica si es un item ya existente en el carrito:
    let index  = 0;
    index = buscarCodigo(item.codigo, carrito);

    if(index <0 ){ // Nuevo item en el carrito
        carrito.push(new Item(item.codigo, item.descrip, item.precioUn, item.cantidad));
        console.log("Operación realizada de forma exitosa!");
        compra.sumarMonto(parseFloat(item.precioUn * item.cantidad));

    }else{          // Item existente en el carrito. Sumar cantidad
        carrito[index].sumarCantidad(item.cantidad);
        console.log("Operación realizada de forma exitosa!");
        compra.sumarMonto(parseFloat(item.precioUn * item.cantidad));
    }
}

// Modifica artículos (cantidad) del Carrito
const modificarItemsCarrito=()=>{
    let codigo = 0;
    let index  = 0;
    let item;
    let continuar = true;

    // Selecciona Item a agregar (TRUE indica que se trata de una modificación)
    while(continuar){
        codigo = getArticulo(true);
        if(codigo > 0){
            index = buscarCodigo(codigo, carrito);
            if (index < 0){
                alert("Articulo no existente en el Carrito.")
            }else{
                continuar = false;
                item = buscarItem( index ,carrito);
                modificarCantidad(item, index);
            }
        }else{
            continuar = false;
        }
    }
}

// Elimina un Item del Carrito:
const eliminarCarritoIndice=(index)=>{
    if (confirm("Eliminar item seleccionado del Carrito?")){
        carrito.splice(index, 1);
        alert("Operación realizada de forma exitosa!");
    }else{
        alert("No se han producido modificaciones.");
    }
}

// Indica la cantidad modificada para el Item seleccionado:
const modificarCantidad=(item, index)=>{
    let cantidad = 0;
    let opcion   = "";
    opcion = prompt("Ingresa la nueva cantidad para:\n" + item.descrip + "; $" + parseFloat(item.precioUn).toFixed(2) + " x" + item.cantidad + "UN" + "\n(Ingrese 0 para cancelar)\n(Ingrese X para eliminar del carrito)");
    
    // Opción "X" para eliminar
    if (opcion.toUpperCase() == "X" ){
        eliminarCarritoIndice(index);
        return;
    }

    // Continúa con la modificación de la cantidad
    cantidad = parseInt(opcion);
    if(cantidad <= 0 || isNaN(cantidad)){
        alert("Operación cancelada.");
    }else{
        item.cantidad = cantidad;
        modificarItemCarrito(item, index);
    }
}

const modificarItemCarrito=(item, index)=>{
    
    //Item existente en el carrito. Actualizar cantidad
    carrito[index].modificarCantidad(item.cantidad);
    alert("Operación realizada de forma exitosa!");

}

// Genera y Visualiza el Menú disponible:
const menu =()=>{
    let textoMenu = "";
    let opcion = 0;

    textoMenu = agregarParrafo(textoMenu, "Seleccione una opción:");
    textoMenu = agregarParrafo(textoMenu, "1 - Agregar articulos al Carrito");
    textoMenu = agregarParrafo(textoMenu, "2 - Ver Carrito");
    textoMenu = agregarParrafo(textoMenu, "3 - Modificar Carrito");
    textoMenu = agregarParrafo(textoMenu, "4 - Ver lista de articulos disponibles");
    textoMenu = agregarParrafo(textoMenu, "0 - Finalizar compra");

    // Verifica selección:
    do{
        opcion = parseInt(prompt(textoMenu));
        if(opcion < 0 || opcion > 4){
            // Fuerza el valor NaN para que se solicite el ingreso nuevamente
            alert("Opción no válida.");
            opcion = NaN;
        }
    }while(isNaN(opcion))
    return opcion;
}

// Compra Finalizada:
const finalizarCompra=(nombre)=>{
    if(carrito.length > 0){
        alert(nombre + ", muchas gracias por comprar en nuestro sitio!\nSe muestra detalles a continuación.");
        visualizarArticulos(carrito, true);
    }else{
        alert(nombre + ", gracias por visitarnos!");
    };
}

// Si no está vacío, permite visualizar los items en el Carrito
const visualizarCarrito=()=>{
    if (carrito.length>0){
        visualizarArticulos(carrito, true);
    }else{
        alert("Carrito vacío.")
    }
}

// Si no está vacío, permite modificar las cantidades del Carrito
const modificarCarrito=()=>{
    if (carrito.length>0){
        visualizarArticulos(carrito, true);
        modificarItemsCarrito();
        compra.calcularMontos();
    }else{
        alert("Carrito vacío.")
    }
}

/*************************/
//   Función Principal
/*************************/
// La idea es que ejecute esta función luego de mostrar el contenido HTML.
// Por algún motivo, a veces muestra primero el HTML y luego corre el SCRIPT, pero otras veces, no.
// Otras personas que tuvieron ese problema lo solucionaron usando WINDOW.ONLOAD
window.onload = function(){

    //Declaración de Variables
    let nombre;
    let opcion = 0;
    let continuar = true;

    nombre = prompt("Ingrese nombre y apellido (Presiones ESC para cancelar el proceso)");

    // Verifica que el nombre no sea NULO
    if(nombre !== null){

        // Si el nombre no es NULO, comienza el proceso:
        cargaInicial();
        console.log("Bienvenido usuario: " + nombre);

        while(continuar){
            opcion = menu();
            switch(opcion){
                case 1:
                    // Agregar articulos al Carrito
                    agregarItems();
                    break;
                case 2:
                    // Visualizar Carrito
                    visualizarCarrito();
                    break;
                case 3:
                    // Modificar cantidades del Carrito
                    modificarCarrito();
                    break;
                case 4:
                    // Visualizar artículos disponibles
                    visualizarArticulos(items, false);
                    break;
                case 0:
                    // Finalizar Compra
                    finalizarCompra(nombre);
                    continuar = false;
                    break;
            }
        }
    }
}
