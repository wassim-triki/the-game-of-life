const start=document.querySelector("#start");
const GRID=document.querySelector(".grid");

const randInt = (max, min) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const randColor=(col1,col2)=>{
  if(col1 && col2){
    return [col1,col2][randInt(0,2)];
  }
  return`rgb(${randInt(0,256)},${randInt(0,256)},${randInt(0,256)})`;
}




const cellSize=Number(prompt("cell size: "));
const gridW=GRID.offsetWidth;
const gridH=GRID.offsetHeight;
const cols=Math.floor(gridW/cellSize);
const rows=Math.floor(gridH/cellSize);


class Cell{
  constructor(size){
    this.size=size;
    this.isAlive=false;
    this.html;
    this.liveNeighbours=[];
  }

  die(){
    this.isAlive=false;
    this.html.style.background="#fff";
  }
  live(){
    this.isAlive=true;
    this.html.style.background="#000";
  }

  getLiveNeighbours(){
    return this.liveNeighbours.length;
  }
  makeCell(){
    const cell=document.createElement("div");
    cell.style.display="inline-block";
    cell.style.outline="1px solid black";
    cell.style.width=`${this.size}px`;
    cell.style.height=`${this.size}px`;
    cell.style.background=this.isAlive?"#000":"#fff";
    return cell;
  }


  highlight(){
    this.html.style.background="red";
  }

  highlightliveNeighbours(){
    const col=randColor();
    for(let neighbour of this.liveNeighbours){
      if(neighbour){
        neighbour.html.style.background=col;
      }
    }
  }

  clearHighlight(){
    for(let neighbour of this.liveNeighbours){
      if(neighbour){
        neighbour.html.style.background=randColor("#000","#fff");
      }
    }
  }
}

const initGridCells=()=>{
  const grid=[];
  for(let i=0;i<rows;i++){
    const row=[];
    for(let j=0;j<cols;j++){
      const cell=new Cell(cellSize);
      cell.isAlive=Boolean(randInt(0,2));
      row.push(cell);
    }
    grid.push(row);
  }
  return grid;
}


const drawGrid=(grid)=>{
  GRID.innerHTML="";
  for(let i=0;i<rows;i++){
    const rowDiv=document.createElement("div");
    rowDiv.style.display="flex";
    for(let j=0; j<cols;j++){
      const cell=grid[i][j];
      const cellDiv=cell.makeCell();
      cell.html=cellDiv;
      rowDiv.appendChild(cellDiv);
    }
    GRID.appendChild(rowDiv);
  }
}

const getemptyCells=()=>{
  const grid=[];
  for(let i=0;i<rows;i++){
    const row=[];
    for(let j=0;j<cols;j++){
      row.push(null);
    }
    grid.push(row);
  }
  return grid
}

const getAliveNeighboursArray=(arr,i,j)=>{
  const liveNeighbours=[];
  for(let k=-1;k<2;k++){
    if(arr[i+k]){
      for(let l=-1;l<2;l++){
        if(arr[i+k][j+l] && arr[i+k][j+l].isAlive && arr[i+k][j+l]!=arr[i][j]){
          liveNeighbours.push( arr[i+k][j+l]);
        }
      }
    }
  }
  return liveNeighbours;
}

const setAliveNeighbours=(arr)=>{
  for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
      const cell=arr[i][j];
      cell.liveNeighbours=getAliveNeighboursArray(arr,i,j);
    }
  }
}


let cells1=initGridCells();
setAliveNeighbours(cells1);
drawGrid(cells1);





const getNextGenrationArray=(oldArr)=>{
  const newArr=[];
  for(let i=0;i<rows;i++){
    const row=[];
    for(let j=0; j<cols;j++){
      const oldCell=oldArr[i][j];
      let newCell=new Cell(cellSize);
      const neighbours=oldCell.getLiveNeighbours();
      if(oldCell.isAlive){
        if(neighbours<2 || neighbours>3){
          //dies
          newCell.isAlive=false;
        }
        if(neighbours==2 || neighbours==3){
          //lives
          newCell.isAlive=true;
        }
      }else{
        if(neighbours==3){
          //becomes Alive
          newCell.isAlive=true;
        }
      }
      row.push(newCell);
    }
    newArr.push(row);
  }
  return newArr;
}



const equal=(grid1,grid2)=>{
  for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
      if(grid1[i][j]!=grid2[i][j]){
        return false;
      }
    }
  }
  return true;
}


const gameOfLife=()=>{
  let nextGen=getNextGenrationArray(cells1);
  setAliveNeighbours(nextGen);
  drawGrid(nextGen);
  cells1=nextGen;
}



let interval=setInterval(gameOfLife, 50);

document.addEventListener("click",()=>{
  clearInterval(interval);
})






