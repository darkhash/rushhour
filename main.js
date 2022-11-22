
class Car {
    constructor(length, color, startPos, orientation) {
      this.length = length;
      this.color = color;
      this.startPos = startPos;
      this.orientation = orientation;
      this.segments = [startPos];
      this.setUpBody();
    }
  
  
    directionTranslate(dir) {
      let code;
      if (dir) {
        code = dir;
      } else {
        code = this.orientation;
      }
      let pos;
      switch (code) {
        case "down":
          pos = [1, 0];
          break;
        case "right":
          pos = [0, 1];
          break;
        case "up":
          pos = [-1, 0];
          break;
        case "left":
          pos = [0, -1];
      }
      return pos;
    }
  
    setUpBody() {
      let oppositeOrientation = [this.directionTranslate()[0] * -1, this.directionTranslate()[1] * -1];
      for (let i = 0; i < this.length - 1 ; i++) {
        let bodyPart = [this.segments[i][0] + oppositeOrientation[0], this.segments[i][1] + oppositeOrientation[1]];
        this.segments.push(bodyPart);
      }
  
    }
  
    move(direction) {
      let dir = this.directionTranslate(direction);
      let oldHead, newHead;
  
      if (direction === this.orientation) {
        oldHead = this.segments[0];
        newHead = [oldHead[0] + dir[0], oldHead[1] + dir[1]];
        if (this.color !== "red" && (newHead[0] > 5 || newHead[1] > 5)) {
          return;
        }
        if(!document.querySelectorAll("li")[newHead[0] * 6 + newHead[1]].classList.contains("car")){
       
          this.segments.unshift(newHead);
          this.segments.pop();
          moveCount += 1;
        }
  
      } else if (dir[0] === this.directionTranslate()[0] * -1 && dir[1] === this.directionTranslate()[1] * -1) {
        oldHead = this.segments[this.length - 1];
        newHead = [oldHead[0] + dir[0], oldHead[1] + dir[1]];
        if (newHead[0] < 0 || newHead[1] < 0 ) {
          return;
        }
        if (!document.querySelectorAll("li")[newHead[0] * 6 + newHead[1]].classList.contains("car")) {
          this.segments.push(newHead);
          this.segments.shift();
          moveCount += 1;
        }
  
      }
  
    }
  
    onEdge() {
      if (this.directionTranslate()[0] === 1) {
        return (this.segments[0][0] === 5 || this.segments[this.length - 1][0] === 0 );
      } else if (this.directionTranslate()[1] === 1) {
        return (this.segments[0][1] === 5 || this.segments[this.length - 1][1] === 0 );
      }
    }
}


let moveCount = 0;
let selectedCar = null

grid = new Array(6).fill(new Array(6));
const getCars = () => ([new Car(2, "red", [2, 1], "right"), new Car(3, "yellow", [2, 3], "down"),
  new Car(2, "green", [5, 1], "down"), new Car(2, "orange", [5, 3], "right"), new Car(2, "blue", [5, 5], "right")]);
let cars = getCars()
function setUpBoard() {
    container = document.getElementById('board')
    for (let i = 0; i < 6; i++) {
      let row = document.createElement('ul');  
      for (let j = 0; j < 6; j++) {
        let square = document.createElement('li');  
        square.setAttribute('data', '"pos:'+ [i, j] +'"');
        row.append(square);
      }
      row.setAttribute('data', '"row:'+ i +'"');
  
      document.getElementById('board').append(row);
    }
    
    document.getElementById('move-counter').innerText = 'Moves:'+ moveCount;
  }

  function setUpCars(cars) {
    console.log(cars);
    Array.from(cars).forEach(car => {
      car.segments.forEach(square => {
        let square_ =  document.getElementsByTagName("li")[square[0] * 6 + square[1]]
        console.log(square_)
        square_.classList.add(car.color);
        square_.classList.add("car");
        square_.addEventListener('click',() => {
        selectedElements = document.getElementsByClassName('selected')
          

        for(var i = 0; i < selectedElements.length; i++){
            selectedElements[i].classList.remove("selected");
        }
            
           
        newSelected = document.getElementsByClassName(car.color)
        for(var i = 0; i < newSelected.length; i++){
            newSelected[i].classList.add("selected");
        }
          selectedCar = car;
        });
      });
    });
  }


  function isWon() {
    if (cars[0].segments[0][1] === 5) {
      return true;
    }
    return false;
  }

  function render() {
    container.innerHTML  = '';
    setUpBoard();
    setUpCars(cars);
    if (selectedCar) {
        newSelected = document.getElementsByClassName(selectedCar.color)
        for(var i = 0; i < newSelected.length; i++){
            newSelected[i].classList.add("selected");
        }
      
    }
  }

  setUpBoard();
  setUpCars(cars);
  window.addEventListener('keypress', (event) => {
    event = event || window.event;
    console.log(event.keyCode)
    console.log(event.key)
    if (selectedCar) {
        if (event.keyCode === 119) { //w
          console.log('up');
          event.preventDefault();
          selectedCar.move("up");
          render();
        } else if (event.keyCode === 115) { //s
          console.log('down'); 
          event.preventDefault();
          selectedCar.move("down");
          render();
        } else if (event.keyCode === 97) { //a
          console.log('left');
          event.preventDefault();
          selectedCar.move("left");
          render();
        } else if (event.keyCode === 100) { //d
          console.log('right');
          event.preventDefault();
          selectedCar.move("right");
          render();
          if (selectedCar.color === "red" && isWon()) {
            alert('You won!')
          }
        }
      }
  });
