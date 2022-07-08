//variables de tipo DOM
const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content
$fragment = d.createDocumentFragment();


const getAllPokemon = async()=>{
    try{
        let res = await axios.get("http://localhost:5000/pokemon"),
        json = await res.data;
        console.log(json)
        /*por cada elemento que tenga esa variable json esta accediendo a ese template
        y pone los nombres segun los id y classes del html + los botones de editar (pasar datos al formulario)
        y eliminar(el id)*/
        json.forEach(el =>{
            $template.querySelector(".name").textContent = el.nombre;
             $template.querySelector(".tipo").textContent = el.tipo;
             $template.querySelector(".edit").dataset.id = el.id
             $template.querySelector(".edit").dataset.name = el.nombre
             $template.querySelector(".edit").dataset.tipo = el.tipo
             $template.querySelector(".delete").dataset.id = el.id;

            /*Hay que crear una variable clone para que importe un nodo,
            el de la etiqueta template con el segundo valor en true para que copie
            contenido, sino seria nodo vacio.
            Variable fragment, para no estar pegandole en cada inserccion al DOM, mejor al fragment
            */
            let $clone = d.importNode($template,true);
            $fragment.appendChild($clone);
        })
        $table.querySelector("tbody").appendChild($fragment)
    }catch(error){
        let message = err.statusText || "Ocurrió un error";
        $table.insertAdjacentHTML("afterend", `<p><b>${err.status}${message}</b></p>`)

    }
}


d.addEventListener("DOMContentLoaded", getAllPokemon)

/*el submit dle documento se va aejecutar cuando el target que 
origina el evento sea el formulario guardado en la variable form*/
d.addEventListener("submit", async e =>{
    if(e.target===$form){
        e.preventDefault()//cancela el comportamiento del formulario para que no se procece el formulario por si solo que espere a que hagamos con js

 //si el valor del id viene vacio, se hace la peticion por POST
    if(!e.target.id.value){
        try {
            let options={
                method:"POST",
                headers:{
                    "Content-type":"application/json; charset=utf-8"
                },
                data: JSON.stringify({
                 nombre:e.target.nombre.value,
                 tipo:e.target.tipo.value,
                })
              },
              res = await axios("http://localhost:5000/pokemon", options)
              json = await res.data;
              
              location.reload();

            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error${err.status}:${message}</b></p>`)
        }
    }else{
        //Update PUT
        try {
            let options={
                method:"PUT",
                headers:{
                    "Content-type":"application/json; charset=utf-8"
                },
                data: JSON.stringify({
                 nombre:e.target.nombre.value,
                 tipo:e.target.tipo.value,
                })
              },
              res = await axios(`http://localhost:5000/pokemon/${e.target.id.value}`, options)
              json = await res.data;
              
              location.reload();

            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error${err.status}:${message}</b></p>`)
        }
    }
}
})
//capturar que cuando el objeto click coincida con la clase edit ejecuta
d.addEventListener("click", async e=>{
    if(e.target.matches(".edit")){
        $title.textContent = "Editar Pokemon";
        $form.nombre.value = e.target.dataset.name;
        $form.tipo.value = e.target.dataset.tipo;
        $form.id.value = e.target.dataset.id;

    }
    if(e.target.matches(".delete")){
        let isDelete = confirm(`¿Estás seguro que deseas eliminar${e.target.dataset.id}?`)

        if(isDelete){
            //DELETE-Eliminar
            try {
                let options={
                    method:"DELETE",
                    headers:{
                        "Content-type":"application/json; charset=utf-8"
                    },
                  },
                  res = await axios(`http://localhost:5000/pokemon/${e.target.dataset.id}`, options)
                  json = await res.data;
                  
                  location.reload();
    
                } catch (err) {
                    let message = err.statusText || "Ocurrió un error";
                    alert(`Error${err.status}:${message}</b></p>`)
            }

        }

    }
})

