((d, w, c) => {
   const $selectOptions = [...d.querySelectorAll('.modal-form__options')],
     $selectDptos = d.querySelector('#modal-form__dept .modal-form__list'),
     $selectProvinces = d.querySelector('#modal-form__prov .modal-form__list'),
     $selectDistricts = d.querySelector('#modal-form__dist .modal-form__list'),
     $btnSave = d.querySelector('.modal-location__save'),
     selector = d.querySelectorAll('.modal-form__select'),
     $selectProv = d.querySelector('#modal-form__prov .modal-form__select'),
     $selectDist = d.querySelector('#modal-form__dist .modal-form__select'),
     provincias = [],
     distritos = []
 

 
   d.addEventListener('DOMContentLoaded', () => {
 
     function getData(type) {
       return fetch(`json/${type}.json`)
         .then(res => {
           return res.ok ? res.json() : Promise.reject(res)
         })
         .catch(err => {
           let message = err.statusText || 'Ocurrió un error'
           console.error(message)
         })
     }
 
     getData('departamentos').then(res => {
       loadDptos(res)
     })
 
     getData('provincias').then(res => {
       provincias.push(res[0].departamentos)
     })
 
     getData('distritos').then(res => {
       distritos.push(res)
     })
 
     setTimeout(() => {
       const itemsDept = d.getElementById("departament").querySelectorAll('li')
       for (var i = 0; i < itemsDept.length; i++) {
         itemsDept[i].addEventListener('click', function (e) {
           let province = provincias[0].filter(elem => elem.name === e.target.textContent)
           loadProv(province[0].provincias)
           openOptions(e)
           
           let value = e.currentTarget.closest('.modal-form__box').querySelector('.modal-form__content')
           
           if(!value.classList.contains('modal-form__item')){
             $btnSave.setAttribute('disabled','')
           }else $btnSave.removeAttribute('disabled')
 
           const itemsProv = d.getElementById("province").querySelectorAll('li')
           for (var i = 0; i < itemsProv.length; i++) {
             itemsProv[i].addEventListener('click', function (e) {
               let province = distritos[0].filter(elem => elem.province_id === e.target.dataset.id)
               loadDist(province)
               openOptions(e)
               
               if(!value.classList.contains('modal-form__item')){
                 $btnSave.setAttribute('disabled','')
               }else $btnSave.removeAttribute('disabled')
 
               const itemsDist = d.getElementById("district").querySelectorAll('li')
               for (var i = 0; i < itemsDist.length; i++) {
                 itemsDist[i].addEventListener('click', function (e) {
                   $btnSave.removeAttribute('disabled')
                   openOptions(e)
                 });
               }
             });
           }
         });
       }
     }, 1000);
 
     // al hacer clic identifica el selector seleccionado
     for (let index = 0; index < selector.length; index++) {
       
       selector[index].addEventListener('click', function(e){
         $selectOptions.forEach(contentOptions => {
           if(e.currentTarget.dataset.select == contentOptions.dataset.content){
             openOptions(e)
           }else if(e.currentTarget.dataset.select != contentOptions.dataset.content){
             contentOptions.classList.remove('modal-form__options--active')
           }
         })
       })
       
     }
 
     // clickoutside - al hacer clic afuera del selector este se cierra
     d.addEventListener('click', (e) => {
       if (!e.target.closest('.modal-form__box')) {
         for (let index = 0; index < selector.length; index++) {
           let arrows = selector[index].querySelector('.arrow-down')
           $selectOptions.forEach(item => {
             item.classList.remove('modal-form__options--active')
             arrows.classList.remove('up')
           })
         }
       }
     })
   })
 
   function templateList(options) {
     $selectProv.children[0].innerHTML = '<span class="modal-form__placeholder">Seleccionar provincia</span>'
     $selectDist.children[0].innerHTML = '<span class="modal-form__placeholder">Seleccionar distrito</span>'
 
     const listItems = options.map((element) => {
       let li = d.createElement('li')
       li.classList.add('modal-form__item')
       li.dataset.id = element.id
       li.textContent = element.name
       return li
     })
     return listItems
   }
 
   function loadDptos(options) {
     let $list = templateList(options)
 
     $selectDptos.innerHTML = ''
     $selectDptos.append(...$list)
   }
 
   function loadProv(options) {
     let $list = templateList(options)
 
     $selectProvinces.innerHTML = ''
     $selectProvinces.append(...$list)
   }
 
   function loadDist(options) {
     let $list = templateList(options)
 
     $selectDistricts.innerHTML = ''
     $selectDistricts.append(...$list)
   }
 
   // funciones reutilizables
   function openOptions(e) {
     activeSelector(e)
     ascentOption(e)
   }
 
   function activeSelector (e) {
     const mainOption = e.target.closest('.modal-form__box').querySelector('.modal-form__options')
     const arrow = e.target.closest('.modal-form__box').querySelector('.arrow-down')
     arrow.classList.toggle('up')
     mainOption.classList.toggle('modal-form__options--active')
   }
 
   function ascentOption(e) {
     const selectContent = e.currentTarget.closest('.modal-form__box').querySelector('.modal-form__content')
     if (e.currentTarget.classList.contains('modal-form__item')) {
       selectContent.innerHTML = e.currentTarget.outerHTML
       closeOptions(e)
       disabledSelect(e)
     }
   }
 
   function closeOptions(e) {
     if (e.target.closest('.modal-form__options')) {
       const arrow = e.target.parentElement.closest('.modal-form__box').querySelector('.arrow-down')
       $selectOptions.forEach(item => {
         item.classList.remove('modal-form__options--active')
         arrow.classList.remove('up')
       })
     }
   }
 
   function disabledSelect(e) {
       const childTwo = e.currentTarget.closest('.modal-form').children[1]
       const childThree = e.currentTarget.closest('.modal-form').children[2]
       let brotherSelect = e.currentTarget.closest('.modal-form__box').nextElementSibling
       let disabled, arrowBlue;
 
       if (childTwo.querySelector('.disabled')) {
         brotherSelect = e.currentTarget.closest('.modal-form__box').nextElementSibling
         arrowBlue = brotherSelect.querySelector('.arrow-down')
         disabled = brotherSelect.querySelector('.disabled')
         arrowBlue.classList.add('blue')
         disabled.classList.remove('disabled')
       } else if (childThree.querySelector('.disabled')) {
         brotherSelect = e.currentTarget.closest('.modal-form__box').nextElementSibling
         arrowBlue = brotherSelect.querySelector('.arrow-down')
         arrowBlue.classList.add('blue')
         disabled = brotherSelect.querySelector('.disabled')
         if(!disabled) return
         disabled.classList.remove('disabled')
       } 
   }
 
 })(document, window, console) 