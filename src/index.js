// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  // extract payload(arguments) from data
  const payload = data["payload"];

  //Convert the passed hex to string
  try {
    const payloadStr = ethers.toUtf8String(payload);
    console.log(`succesfully converted hex to string, string is: "${payloadStr}", number is: "${parseInt(payloadStr)}"`);
  } catch (e) {
    console.log(`Adding report with binary value, failure: "${payload}"`);
  }
  
    // Generate arrays as per user input
    const resultArrays = [];
    const jsonObject = {};
    const payloadNum = parseInt(ethers.toUtf8String(payload));
    // generate an array of meteors
    for (let i = 0; i < payloadNum; i++) {
      resultArrays.push(generateRandomArray());
    }

    // create an array of json objects and give them an appropriate key.
    resultArrays.forEach((element, index) => {
      jsonObject[`meteor ${index + 1}`] = element;
    });

    const levelString = JSON.stringify(jsonObject);
    console.log("New level stage created succesfully, meteor challange: " + levelString);


    const advance_req = await fetch(rollup_server + "/notice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "payload": stringToHex(levelString)}),
    });
    const json = await advance_req.json();
    console.log(
      "Received notice status " +
        advance_req.status +
        " with body " +
        JSON.stringify(json)
    );


  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  return "accept";
}

// convert hex input to number
function hexToNumber(hex) {
  return parseInt(hex, 16);
}

// convert string to hex
function stringToHex(str) {
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i).toString(16);
    hex += charCode.padStart(2, '0'); // Ensure each byte is represented by two characters
  }
  return hex;
}

// Function to generate a random array of 4 numbers
function generateRandomArray() {
  const randomArray = [];
  const jsonObject = {};
  for (let i = 0; i < 4; i++) {
    randomArray.push(Math.floor(Math.random() * 100)); // You can adjust the range as needed
  }
  
  jsonObject["meteor speed"] = randomArray[0];
  jsonObject["meteor size"] = randomArray[1];
  jsonObject["impact latitude"] = randomArray[2];
  jsonObject["impact longitude"] = randomArray[3];

  const jsonString = JSON.stringify(jsonObject);

  return jsonString;
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();
