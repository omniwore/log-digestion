import fs from 'fs';

async function readLogs(): Promise<string[]> {
  const dataArray: string[] = [];
  const path = "./data/"
  const fileNames = fs.promises.readdir(path);

  for (let fileName of await fileNames) {
    try {
      fileName = "./data/" + fileName;
      const data = await fs.promises.readFile(fileName, 'utf-8');
      dataArray.push(data);
    } catch (error: any) { // Use 'any' type to handle unknown error
      console.error(`Error reading ${fileName}: ${(error as Error).message}`);
    }
  }

  return dataArray;
}

async function main() {
  try {
    const dataArray = await readLogs();
    // Do whatever you want with the dataArray here
    var splitArray: string[] = [];
    for(let i=0; i<dataArray.length; i++){
        splitArray = [...splitArray, ...dataArray[i].split("\n")];
    }
    var twoDimensionalArray: string[][] = [];
    for(let i =0; i<splitArray.length; i++){
        if(splitArray[i].includes('HTTP')) {
            var spaceArray: string[] = [];
            spaceArray = splitArray[i].split(" ");
            if(spaceArray.length >= 11){
            twoDimensionalArray.push([spaceArray[6].substring(1,), spaceArray[8] + " " + spaceArray[9], spaceArray[11]]);
            }
        }
    }
    var timeCount: Map<string, number> = new Map();
    for(let i=0;i<twoDimensionalArray.length; i++){
        var value = twoDimensionalArray[i][0];
        var minute = value.substring(0,value.length-3);
        timeCount.set(minute, ((timeCount.get(minute) || 0) +1)) ;
    }
    // console.log(timeCount);
    // console.table(Array.from(timeCount.entries()));

    var endptcount: Map<string, number> = new Map();
    for(let i=0;i<twoDimensionalArray.length; i++){
        var value = twoDimensionalArray[i][1];
        endptcount.set(value, ((endptcount.get(value) || 0) +1)) ;
    }
    // console.log(statusCount);
    // console.table(Array.from(timeCount.entries()))

    var statusCount: Map<string, number> = new Map();
    for(let i=0;i<twoDimensionalArray.length; i++){
        var value = twoDimensionalArray[i][2];
        statusCount.set(value, ((statusCount.get(value) || 0) +1)) ;
    }
    // console.log(statusCount);
    console.table(Array.from(statusCount.entries()))

  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main();