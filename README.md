# log-digestion

## Description
Reads all the log files in /data directory and gets the aggregated data for HTTP api calls. The rows which contain the keyword 'HTTP' are used as filtering criteria.


## To run:

### Clone the repository:
`git clone https://github.com/omniwore/log-digestion.git`

## Change directory:
`cd log-digestion`

### Run the code:
`ts-node ./src/index.ts`