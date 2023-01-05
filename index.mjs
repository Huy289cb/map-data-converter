import fs from "fs";
import { VNM_1_1 } from "./mapData/district/VNM.1_1.js";

console.log("🚀 ~ VNM_1_1", VNM_1_1);

// fs.readFile("./mapData/district/VNM.1_1.js", function(err, buf) {
//   const str = buf.toString();

// });
var data = JSON.stringify(VNM_1_1);

fs.writeFile("./mapData/district/VNM.1_1.json", data, (err) => {
  if (err) console.log(err);
  console.log("Successfully Written to File.");
});
