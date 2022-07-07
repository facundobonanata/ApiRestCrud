//variables de tipo DOM
const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content
$fragment = d.createDocumentFragment();

//crear funcion que encapsule todo y pida los elementos

//options objetos, encapsulamos en la funcion ajax
const ajax = (options) =>{
    let {url, method, success, error, data} = options;
    //instancia del objeto
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange",e =>{
        if(xhr.readyState!==4)return;
        //en caso de exito cualquier numero entre 200, convertir a objeto js la respuesta en formato json
        //en caso de ser, ejecuta el codigo success, sino error
        if(xhr.status>=200 && xhr.status <300){
            let json = JSON.parse(xhr.responseText);
            success(json);
        }else{
            //si no viene nada en statusText error con el status del server
            let message = xhr.statusText || "Ocurrio un error"
            error(`Error${xhr.status}:${message}`);
        }
    });

    //metodo open, con variable method, si el parametro metodo viene vacio el usuario quiere get
    //luego abrimos lo que venga en url
    xhr.open(method || "GET", url);
    //por cada cabecera se difine el nombre del atributo y el valor
    xhr.setRequestHeader("Content-type","application/json;charset=utf-8")
    //le estamos enviando un objeto javascript, lo vamos a convertir a cadena de texto
    xhr.send(JSON.stringify(data));

}
const getAllPokemon =()=>{
    ajax({
        method:"GET",
        url:"http://localhost:5000/pokemon",
        success:(res) => {
            res.forEach(el => {              
             $template.querySelector(".name").textContent = el.nombre;
             $template.querySelector(".tipo").textContent = el.tipo;
             $template.querySelector(".edit").dataset.id = el.id
             $template.querySelector(".edit").dataset.name = el.nombre
             $template.querySelector(".edit").dataset.tipo = el.tipo
             $template.querySelector(".delete").dataset.id = el.id




                //el template hay que clonarlo para que quede en memoria
                let $clone = d.importNode($template, true);
                $fragment.appendChild($clone);
            });
            $table.querySelector("tbody").appendChild($fragment);

        },
        error:(err)=>{
            $table.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`)
        }
    })
}
d.addEventListener("DOMContentLoaded", getAllPokemon);

//evento submit, si el objeto que origina ese evento es el formulario ejecutamos
d.addEventListener("submit", e=>{
    if(e.target===$form){
        e.preventDefault();
        //e.target es el formulario
        //si el valor viene vacio, voy a agregar, peticion POST
        if(!e.target.id.value){
            //Crear-POST
        ajax({
            url:"http://localhost:5000/pokemon",
            method:"POST",
            success:(res)=> location.reload(),
            error:() => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
            data: {
                //accedo al valor que el usiario escribio
                nombre:e.target.nombre.value,
                tipo:e.target.tipo.value,
            }
        })
        }else{
            //actualizar-PUT
            ajax({
                url:`http://localhost:5000/pokemon/${e.target.id.value}`,
                method:"PUT",
                //si tiene exito que recargue para que se vea la actualziacion
                success:(res)=> location.reload(),
                error:() => $form.insertAdjacentHTML("afterend", `<p><b>${err}</b></p>`),
                data: {
                    //accedo al valor que el usiario escribio
                    nombre:e.target.nombre.value,
                    tipo:e.target.tipo.value,
                }
            })      
        }
    }
})

d.addEventListener("click", e => {
    if(e.target.matches(".edit")){
        $title.textContent = "Editar Pokemon";
        $form.nombre.value = e.target.dataset.name;
        $form.tipo.value = e.target.dataset.tipo;
        $form.id.value = e.target.dataset.id;

    }
    if(e.target.matches(".delete")){
        let isDelete = confirm(`¿Estás seguro que deseas eliminar${e.target.dataset.id}?`)
    if(isDelete){
        //ELIMINAR - DELETE - e.target boton, acceder a sulista data atribute asu id de atributo
        ajax({
            url:`http://localhost:5000/pokemon/${e.target.dataset.id}`,
            method:"DELETE",
            //si tiene exito que recargue para que se vea la actualziacion
            success:(res)=> location.reload(),
            error:() => alert(err),           
        })      
    }
}
})

