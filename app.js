// Достаем элементы
const container = document.querySelector('.container');
const input = container.querySelector('.container__input')
const containerResultsOfSearch = container.querySelector('.container__resultofsearch')
const containerAllresults = container.querySelector('.container__allresults')
// Создаем элементы

input.addEventListener('click', function(e){
  input.value = null
});

const fetCh = function(inputValue){
  let responce = fetch(`https://api.github.com/search/repositories?q={${inputValue}}&per_page=5`)
    .then((responce) => responce.json())
    .then(responseJson => responseJson.items)
    .then( arrayOfItems => {
      if(containerResultsOfSearch.querySelectorAll('.container__searched').length != 0){
        containerResultsOfSearch.querySelectorAll('.container__searched').forEach(item => item.remove())
      }
      for ( let value of arrayOfItems){
          let div = document.createElement('div')
          div.classList.add('container__searched')
          let p = document.createElement('p')
          p.classList.add('container__text')
          p.textContent = `${value.name}`
          div.appendChild(p)

          let p1 = document.createElement('p')
          p1.classList.add('container__ownerhidden')
          p1.textContent = `${value.owner.login}`
          div.appendChild(p1)

          let p2 = document.createElement('p')
          p2.classList.add('container__starshidden')
          p2.textContent = `${value.watchers}`
          div.appendChild(p2)


        console.log(arrayOfItems)
        containerResultsOfSearch.appendChild(div) 
         
        }
        
    }).catch( error => console.log(error))
    

    
    

}


// Пишем функцию дебаунс для задержки поиска при печати
const debounce = (fn, debounceTime) => {
    let timerID
  
  
    function debounceInside(){
        
        const fns = () => {fn.apply(this, arguments)}
        
        clearTimeout(timerID)  
  
        timerID = setTimeout(fns, debounceTime)
   
    }
  
    return debounceInside
    
};

const debouncedFn = debounce(function(event){
  fetCh(input.value)  
}, 400);

// Вставляем слушатель события на инпут
  const eventList = input.addEventListener('input', debouncedFn);


// Вставляем слушатель события на добавление элемента из поиска
containerResultsOfSearch.addEventListener('click', function(event){

  let div = event.target.closest('.container__searched')
  let pName = div.querySelector('.container__text')
  let pOwner = div.querySelector('.container__ownerhidden')
  let pStars = div.querySelector('.container__starshidden')
 
  
  let divContRes = document.createElement('div')
  divContRes.classList.add('container__result')
  let cross = document.createElement('div')
  cross.classList.add('container__cross')
  divContRes.appendChild(cross)

  let name = document.createElement('p')
  name.classList.add('container__name')
  name.textContent = `Name: ${pName.textContent}`
  divContRes.appendChild(name)


  let owner = document.createElement('p')
  owner.classList.add('container__owner')
  owner.textContent = `Owner: ${pOwner.textContent}`
  divContRes.appendChild(owner)


  let stars = document.createElement('p')
  stars.classList.add('container__stars')
  stars.textContent = `Stars: ${pStars.textContent}`
  divContRes.appendChild(stars)


  if(containerAllresults.querySelectorAll('.container__result').length == 3){
  containerAllresults.querySelector('.container__result').remove()
  }
  
  containerAllresults.appendChild(divContRes)
  
  input.value = null

  while (containerResultsOfSearch.firstChild) {
    //Список является ссылкой, то есть он будет переиндексирован перед каждым вызовом
    containerResultsOfSearch.removeChild(containerResultsOfSearch.firstChild)
  }



  if(containerAllresults.querySelectorAll('.container__result').length > 0){

    containerAllresults.addEventListener('click', function(even){
      if(even.target.classList.value == 'container__cross'){
        even.target.closest('.container__result').remove()
      }
      
    })
  }
 
})

