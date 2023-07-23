import fs from 'fs';

interface formattedLogData {
  timestamp: string;
  endPoint: string;
  statusCode: string;
}

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

async function getFormattedLogData(filesData: string[]): Promise<formattedLogData[]> {
    var lineWiseData: string[] = [];
    // add line wise data from log files into array
    for(let i=0; i<filesData.length; i++){
        lineWiseData = [...lineWiseData, ...filesData[i].split("\n")];
    }
    // read each line from aggregated log data and fetch timestamp, endpoint, status into formattedLogEntries
    var formattedLogEntries: formattedLogData[] = [];
    for(let i =0; i<lineWiseData.length; i++) {
        if(lineWiseData[i].includes('HTTP')) {
            let logLineArray: string[] = [];
            logLineArray = lineWiseData[i].split(" ");
            //example row with API call data
            // 2023-06-08 15:48 +10:00: ::ffff:172.105.184.153 - - [08/Jun/2023:05:48:10 +0000] "GET /start.html HTTP/1.1" 404 149 "-" "curl/7.54.0"
            // here the 6 the element spliited on space " " respresents timestamp, 8, 9 represent endpoint and 11th represents ststus code
            const row_timestamp = logLineArray[6].substring(1,);
            const row_endpoint = logLineArray[8] + " " + logLineArray[9];
            const row_statusCode = logLineArray[11];
            formattedLogEntries.push({timestamp: row_timestamp, endPoint: row_endpoint , statusCode: row_statusCode});
        }
    }
    return formattedLogEntries
}

async function getTimeStampCountByMinutes(formattedLogEntries: formattedLogData[]) :Promise<Map<string, number>> {
  const timeCount: Map<string, number> = new Map();
  for(let i=0;i<formattedLogEntries.length; i++){
      var timeValue = formattedLogEntries[i].timestamp;
      // removing seconds from timestamp will allow us to aggregate endpoint count by minutes 
      // 08/Jun/2023:05:48:10, here it is in format dd/m/yyyy:hh:mm:ss
      var timeInMinutes = timeValue.substring(0, timeValue.length-3);
      timeCount.set(timeInMinutes, ((timeCount.get(timeInMinutes) || 0) +1)) ;
  }
  return timeCount;
}

async function getEndPointCount(formattedLogEntries: formattedLogData[]) :Promise<Map<string, number>> {
  const endPointCount: Map<string, number> = new Map();
  for(let i=0;i<formattedLogEntries.length; i++) {
      var endPointValue = formattedLogEntries[i].endPoint;
      endPointCount.set(endPointValue, ((endPointCount.get(endPointValue) || 0) +1)) ;
  }
  return endPointCount;
}

async function getStatusCodeCount(formattedLogEntries: formattedLogData[]) :Promise<Map<string, number>> {
  const statusCodeCount: Map<string, number> = new Map();
  for(let i=0;i<formattedLogEntries.length; i++) {
      var statusCode = formattedLogEntries[i].statusCode;
      statusCodeCount.set(statusCode, ((statusCodeCount.get(statusCode) || 0) +1)) ;
  }
  return statusCodeCount;
}

async function main() {
  try {
    const dataArray = await readLogs();
    // put data from files into formatted log type
    const formattedLogEntries = await getFormattedLogData(dataArray);
    // count timestamp aggregates, endpoint and statuscodes
    const timeCount = await getTimeStampCountByMinutes(formattedLogEntries);
    const endPointCount = await getEndPointCount(formattedLogEntries);
    const statusCount = await getStatusCodeCount(formattedLogEntries);
    
    console.log("TimeStamp by minute count");
    console.table(Array.from(timeCount.entries()));

    console.log("End Point count");
    console.table(Array.from(endPointCount.entries()));  

    console.log("Status Code Count");
    console.table(Array.from(statusCount.entries()));
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
  }
}

main();