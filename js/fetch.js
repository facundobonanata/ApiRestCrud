//variables de tipo DOM
const d = document,
$table = d.querySelector(".crud-table"),
$form = d.querySelector(".crud-form"),
$title = d.querySelector(".crud-title"),
$template = d.getElementById("crud-template").content
$fragment = d.createDocumentFragment();





//ejecutar funcion getAllPokemon asincrona
const getAllPokemon = async()=>{
    
    //viene toda la peticion, la respuesta y la interaccion con el DOM
    try{
        let res = await fetch("http://localhost:5000/pokemon")
        json = await res.json();

        if(!res.ok) throw {status: res.status, statusText:res.statusText}
        
        json.forEach(el =>{
            $template.querySelector(".name").textContent = el.nombre;
             $template.querySelector(".tipo").textContent = el.tipo;
             $template.querySelector(".edit").dataset.id = el.id
             $template.querySelector(".edit").dataset.name = el.nombre
             $template.querySelector(".edit").dataset.tipo = el.tipo
             $template.querySelector(".delete").dataset.id = el.id

            /*Hay que crear una variable clone para que importe un nodo,
            el de la etiqueta template con el segundo valor en true para que copie
            contenido, sino seria nodo vacio.
            Variable fragment, para no estar pegandole en cada inserccion al DOM, mejor al fragment
            */
            let $clone = d.importNode($template,true);
            $fragment.appendChild($clone);
        })
        /* dentro de la etiqueta table busca el tbody y agrega el fragmento*/
        $table.querySelector("tbody").appendChild($fragment);

        //captura el error y lo muestra
    }catch(err){
        let message = err.statusText || "Ocurrió un error";
        //insertar error debajo de la tabla
        $table.insertAdjacentHTML("afterend", `<p><b>Error${err.status}:${message}</b></p>`)

    }

}


//la funcion de arriba se ejecuta al cargar el domuneto
d.addEventListener("DOMContentLoaded", getAllPokemon);

d.addEventListener("submit",async e=>{
    if(e.target ===$form){
        e.preventDefault()//controlar el envio del from

        if(!e.target.id.value){
            //CrearPOST
            try {
              let options={
                method:"POST",
                headers:{
                    "Content-type":"application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    nombre:e.target.nombre.value,
                tipo:e.target.tipo.value,
                })
              },


              res = await fetch("http://localhost:5000/pokemon", options)
              json = await res.json();
              location.reload();
                
              if(!res.ok) throw {status:res.status, statusText:res.statusText};
            } catch (err) {
                let message = err.statusText || "Ocurrió un error";
                $form.insertAdjacentHTML("afterend", `<p><b>Error${err.status}:${message}</b></p>`)
                
            }
        }else{
            //Actualizar PUT
            try {
                let options={
                  method:"PUT",
                  headers:{
                      "Content-type":"application/json; charset=utf-8"
                  },
                  body: JSON.stringify({
                      nombre:e.target.nombre.value,
                      tipo:e.target.tipo.value
                  })
                }, 
                res = await fetch(`http://localhost:5000/pokemon/${e.target.id.value}`, options)
                json = await res.json();                 
                if(!res.ok) throw {status:res.status, statusText:res.statusText};
                location.reload();

            } catch (err) {
                  let message = err.statusText || "Ocurrió un error";
                  $form.insertAdjacentHTML("afterend", `<p><b>Error${err.status}:${message}</b></p>`)
                  
              }
        }

    }
})
let profileImage = document.getElementById('profileImage');

function openFile(event){
let file = event.target.files[0];

let reader = new FileReader();

reader.onloadend = function () {
    let dataURL = reader.result;
    profileImage.src = dataURL;
};
reader.readAsDataURL(file);
}

  

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
        //ELIMINAR - DELETE - e.target boton, acceder a sulista data atribute asu id de atributo
        try {
            let options={
              method:"DELETE",
              headers:{
                  "Content-type":"application/json; charset=utf-8"
              },
            }, 
            res = await fetch(`http://localhost:5000/pokemon/${e.target.dataset.id}`, options)
            json = await res.json();                 
            if(!res.ok) throw {status:res.status, statusText:res.statusText};
            location.reload();

        } catch (err) {
              let message = err.statusText || "Ocurrió un error";
              alert(`Error${err.status}:${message}`)           
         }            
    }
}
})


