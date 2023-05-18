//--------------------------------------------------------------------------
//VARIABLES
let bars = []; // Array to store the height values of the bars
let barElements = []; // Array to store the bar elements
let noOfComparisons = 0; // Variable to store the number of comparisons performed
let noOfSwaps = 0; // Variable to store the number of swaps performed
let ms = 10; // Variable to store the delay
let len = 100; // Variable to store the length of the bars array
let SwapCountList = new Array(len).fill(0);
ButtonsToDisable = document.querySelectorAll('.disable-when-sorting'); // Buttons to disable when sorting


//--------------------------------------------------------------------------
    //UTILITY FUNCTIONS
    // Create a specified number of bars and append them to a div element with an id of "bars"
    function Shuffle(){
        for (let i = len - 1; i > 0; i--) {
            const k = Math.floor(Math.random() * ( i + 1));
            swapBars(i, k);
        }
    }
    
    function createBars() {

        for (let i = 0; i < len; i++){
        bars.push(150/len*i);
        }
       
        
        // Get a reference to the bars div element in the HTML document
        let barsDiv = document.getElementById("bars");
    
        // Create a div element for each bar and append it to the bars div element
        for (let i = 0; i < len; i++) {
        // Create a new div element with a class name of "bar"
        let bar = document.createElement("div");
        bar.className = "bar";
    
        // Set the height of the bar based on the corresponding value in the bars array
        bar.style.height = bars[i] + "px";
        bar.style.width = 80 / len + "%";
        bar.style.marginRight = 20/len + "%";
        // Append the bar element to the bars div element and add it to the barElements array
        barsDiv.appendChild(bar);
        barElements.push(bar);
        }
        Shuffle();
    }
    // Sleep for specified amount of time
    function sleep() {
        if(ms ==0){return;}
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // Swap the bars at indices i and j
    async function swapBars(i, j) {
        noOfSwaps++;
        SwapCountList[i]++;SwapCountList[j]++;
        let temp = bars[i];
        bars[i] = bars[j];
        bars[j] = temp;
        let tempHeight = barElements[i].style.height;
        
        barElements[i].style.height = barElements[j].style.height;
        barElements[j].style.height = tempHeight;
    }
    // add/remove Highlight the bars at indices i and j
    function highlight(condition,i,j){

        if(condition=='add'){
            barElements[i].classList.add("currentSelectedBar");
            barElements[j].classList.add("currentSelectedBar");
        }
        else if(condition=='remove'){
            barElements[i].classList.remove("currentSelectedBar");
            barElements[j].classList.remove("currentSelectedBar");
        }
    }
    // add/remove Highlight the bars from index i ato j
    function highlightRange(condition,i,j){
        if(condition=='add'){
            for(let k=i;k<=j;k++){
                barElements[k].classList.add("currentSelectedBar");
            }
        }
        else if(condition=='remove'){
            for(let k=i;k<=j;k++){
                barElements[k].classList.remove("currentSelectedBar");
            }
        }
    }
    // add/remove Highlight the bars at index i
    function highlightPivot(condition,i){
        if(condition=='add'){
            barElements[i].classList.add("pivotBar");
        }
        else if(condition=='remove'){
            barElements[i].classList.remove("pivotBar");
        }
    }

// --------------------------------------------------------------------------
// EVENT LISTENERS
function randomize(){
    bars = [];
    barElements = [];
    noOfComparisons = 0;
    noOfSwaps = 0;
    const barsID = document.getElementById("bars");
    barsID.innerHTML = ""; // removes all child elements

    len = document.getElementById("myNumberInput").value;
    createBars(len);

}
function Sort(){
    ButtonsToDisable.forEach(button => {button.disabled = true;});
    const sortType = document.getElementById("sortType").value;
    ms = document.getElementById("delay").value;
    eval(sortType+"()");
}
// --------------------------------------------------------------------------
// SORTING ALGORITHMS

// Bubble Sort
async function bubbleSort() {
    for (let i = 0; i < len - 1; i++) {
      for (let j = 0; j < len - i - 1; j++) {
        noOfComparisons++;
        if (bars[j] > bars[j + 1]) {
          // Swap the bars and their corresponding heights
        highlight('add',j,j+1)
        await sleep();
        swapBars(j,j+1);
        highlight('remove',j,j+1)
      }
    }
  }
  ButtonsToDisable.forEach(button => {button.disabled = false;});
}
//Cocktail Sort   ----> Bubble Sort Variation
async function cocktailSort(){
    let swapped = true;
    start=0;
    end = len;
    while(swapped){
        swapped = false;
        for (let i = start; i < end-1; i++){
            if(bars[i]>bars[i+1]){
                highlight('add',i,i+1)
                await sleep();
                swapBars(i,i+1)
                highlight('remove',i,i+1)
                swapped = true;
            }
        }
        end--;
        for (let i = end-1; i >= start; i--){
            if(bars[i]>bars[i+1]){
                highlight('add',i,i+1)
                await sleep();
                swapBars(i,i+1)
                highlight('remove',i,i+1)
                swapped = true;
            }
        }
        start++;
    }
    ButtonsToDisable.forEach(button => {button.disabled = false;});
}
//Odd-Even Sort aka BrickSort   ----> Bubble Sort Variation
async function oddEvenSort(){
    let count = 0;
    let swapped = true;    
    do{
        swapped = false;
        for (let i = 1; i < len-1; i=i+2){
            if(bars[i]>bars[i+1]){
                highlight('add',i,i+1)
                await sleep();
                swapBars(i,i+1)
                highlight('remove',i,i+1)
                swapped = true;
            }
        }
        for (let i = 0; i <= len-1; i=i+2){
            if(bars[i]>bars[i+1]){
                highlight('add',i,i+1)
                await sleep();
                swapBars(i,i+1)
                highlight('remove',i,i+1)
                swapped = true;
            }
        }
    }while(swapped == true)
    ButtonsToDisable.forEach(button => {button.disabled = false;});
}

//Insertion Sort
async function insertionSort() {
    for (let i = 1; i < len; i++) {
        let key = bars[i];
        let j = i - 1;
        
        while (j >= 0 && bars[j] > key) {
            noOfComparisons++;
            highlight('add',j,j+1)
            await sleep();
            swapBars(j,j+1);
            highlight('remove',j,j+1)
            j = j - 1;
        }
        bars[j + 1] = key;
        }
    ButtonsToDisable.forEach(button => {button.disabled = false;});
}
//Gnome Sort ----> Insertion Sort Variation
async function gnomeSort(){
    pos = 0;
    while(pos < len){
        if(pos ==0 || bars[pos]>=bars[pos-1]){
            pos++;
        }
        else{
            highlight('add',pos,pos-1)
            await sleep();
            swapBars(pos,pos-1);
            highlight('remove',pos,pos-1)
            pos--;
        }
    }
}
//Selection Sort
async function selectionSort(){
    let min = 0
    for (let i = 0; i < len; i++) {
        min = i;
        for(let j = i+1; j < len; j++){
            noOfComparisons++;
            if(bars[min] > bars[j]){
                min = j   
            } 
        }
        highlight('add',i,min)
        await sleep();
        swapBars(i,min);
        highlight('remove',i,min)
    }
    ButtonsToDisable.forEach(button => {button.disabled = false;});
}
//Shell Sort
async function shellSort(){
    let gap = Math.floor(len/2);
    while(gap > 0){
        
        for(let i = gap; i < len; i++){
            let temp = bars[i];
            let j = i;
            while(j >= gap && bars[j-gap] > temp){
                highlight('add',j,j-gap)
                await sleep();
                swapBars(j,j-gap);
                highlight('remove',j,j-gap)
                j -= gap;
            }
        }
        gap = Math.floor(gap/2);
    }
    ButtonsToDisable.forEach(button => {button.disabled = false;});
}

async function quickSort(left = 0, right = len - 1){
    if(left >= right){return;}
    highlightRange('add',left,right)
    await sleep(10);
    highlightRange('remove',left,right)
    if(left < right){
        const pivot = partition(left,right);
        quickSort(left,pivot-1);
        highlightPivot('add',pivot)
        await sleep();
        highlightPivot('remove',pivot)
        quickSort(pivot+1,right);
    }
    ButtonsToDisable.forEach(button => {button.disabled = false;});
}
function partition(left,right){
    const pivotIndex = right;
    let i= left;
    let j = right;
    while(1){
        if(i >= j){ return j}
        while ( bars[i] < bars[pivotIndex]) {i++;}
        while (bars[j] > bars[pivotIndex]) {j--;}
        if(i >= j){ return j}
        swapBars(i,j);
    }
}

//Stalin Sort
async function stalinSort(){
    min = 0;
    for(let i = 0; i < len; i++){
        highlightPivot('add',i)
        await sleep();
        highlightPivot('remove',i)
        if(bars[i] >= bars[min]){min = i;}
        else{bars[i] = 0; barElements[i].style.height = 0;}
            
    }
    ButtonsToDisable.forEach(button => {button.disabled = false;});
}
//MergeSort
async function mergeSort(left,right){
    if(left < right){return;}
    mid = Math.floor((left+right)/2);
    mergeSort(left,mid);
    mergeSort(mid+1,right);
    merge(left,mid,right);
}
function merge(left,mid,right){
    const L = bars.slice(left, mid)
    const R = bars.slice(mid + 1, right)  
      
    var i = 1;
    var j = 1;
    var k = left;

    while(i < (right - left + 1) && j < (right - mid)){
        if (L[i] <=R[j]){
            bars[k] = L[i];
            i++;
        }else{
            bars[k] = R[j];
            j++;
        }
        k++;
    }
}

createBars();
