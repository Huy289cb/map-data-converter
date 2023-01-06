import fs from "fs";
import axios from "axios";

// import provinces from "./districts.js";
import { vi_all as listProvinces } from "./mapData/gadm36_VNM_1.js";
// import { VNM_all as listDistricts } from "./mapData/gadm36_VNM_2.js";


const path = "./mapDataJSON/";

const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlUktVWG10TFhKMHBBNkxBS29aWko1ZlU0VDhCdmxKdERCb3pXanFFdnhjIn0.eyJleHAiOjE2NzMwMDY4NTAsImlhdCI6MTY3Mjk3MDkyNSwiYXV0aF90aW1lIjoxNjcyOTcwOTI0LCJqdGkiOiIzZGM3M2JiNS0xNmJiLTQwMmMtYTYwNy0xYTBiNmE4NjEzODkiLCJpc3MiOiJodHRwczovL3Nzby5nbG9iaXRzLm5ldC9hdXRoL3JlYWxtcy9nbG9iaXRzIiwic3ViIjoiMDQzNTA1MzEtNWJmZC00YjQ4LWJjMmEtODliNThlYzEwM2M5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic3NvQ2xpZW50LTEiLCJub25jZSI6ImE0MTBiMjQ1LTQ0N2MtNGZiMy1iNTBhLTNlOGNmZDdlODllYSIsInNlc3Npb25fc3RhdGUiOiIzMmU1Y2M5MC0yM2IwLTQ1OWQtYjUyOS04MGNlNGNhOTU4M2YiLCJhY3IiOiIxIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIn0.ECAdC13hexXYOJhiTDpX_Vf4kqnzBRcMihErsBOs9NJxmHsJ0XW5-kwr3v8upUkFTgcWoht8UtDRdt6S-1btixVat672ADcg2DA-_YXgpRtlCXSf9-QYZTupkErsnp__8FCqHyDVNnLBrj2UWv7GL560yvToGGGDAJLCBSVNvgS8NFih-WKsIL-6Lq6Jiey_KCuM-GGgLQmcrAHUsfgAoPv6QzRcCsDn6Xn6zB7h6wMajWt9U_uQnm5AcNF7N2rdHPsuy_hq7XajikNh30431ZCZZQtJ6ZH_6fRHJE9UnekDkNS8J3dmsERTiHIhmopUnLR3g7qilAmQRcDJQdNgYg";
axios.defaults.headers.common["Authorization"] = "Bearer " + token;

const API_PATH = "http://localhost:8071/api/administrative-unit";

const pagingAdministratives = (searchObject) => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};

// const parseWards = async _ => {
//   for (const provinceName in provinces) {
//     const province = provinces[provinceName]
//     if (province) {
//       const wards = province.features
//       if (wards && wards.length > 0 && wards[0].properties && wards[0].properties.NAME_1) {
//         const resProvince = await pagingAdministratives({
//           level: 3,
//           keyword: wards[0].properties.NAME_1,
//           pageIndex: 1,
//           pageSize: 10,
//         })
        
//         if (resProvince.data && resProvince.data.content && resProvince.data.content.length > 0 && resProvince.data.content[0].id) {
//           const provinceVitimes = resProvince.data.content[0];
//           if (provinceVitimes && provinceVitimes.id) {
//             pagingAdministratives({
//               level: 5,
//               provinceId: provinceVitimes.id,
//               pageIndex: 1,
//               pageSize: 9999,
//             }).then((res) => {
//               if (res && res.data && res.data.content && res.data.content.length > 0) {
//                 const listWardsVitimes = res.data.content;
//                 const covertedWards = wards.map((ward) => {
//                   const findVitimesWard = listWardsVitimes.find(f => {
//                     if (ward.properties && ward.properties.NAME_2 && ward.properties.NAME_3 && f.name && f.parentName) {
//                       if (f.name.includes(ward.properties.NAME_3) && f.parentName.includes(ward.properties.NAME_2)) {
//                         return true
//                       }
//                     }
//                     return false;
//                   })
//                   if (findVitimesWard) {
//                     return {
//                       ...ward,
//                       properties: {
//                        ...ward.properties,
//                        code1: provinceVitimes.code,
//                        code2: findVitimesWard.parentCode,
//                        code3: findVitimesWard.code
//                       },
//                     }
//                   }
//                   return ward
//                 })
//                 const data = JSON.stringify({...province, features: covertedWards});
//                 fs.writeFile(path + "district/" + provinceName + ".json", data, (err) => {
//                   if (err) console.log(err + provinceName);
//                   console.log("Successfully Written to File." + provinceName);
//                 });
//               }
//             })
//           }
//         }
//       }
//     }
//   }
// }
// parseWards();

// const parseDistricts = async _ => {
//   pagingAdministratives({
//     level: 4,
//     pageIndex: 1,
//     pageSize: 9999,
//   }).then((res) => {
//     if (res && res.data && res.data.content && res.data.content.length > 0) {
//       const districts = listDistricts.features
//       const listDistrictsVitimes = res.data.content;
//       const covertedDistricts = districts.map((dt) => {
//         const findVitimesDt = listDistrictsVitimes.find(f => {
//           if (dt.properties && dt.properties.NAME_1 && dt.properties.NAME_2 && f.name && f.parentName) {
//             if (f.name.includes(dt.properties.NAME_2) && f.parentName.includes(dt.properties.NAME_1)) {
//               return true
//             }
//           }
//           return false;
//         })
//         if (findVitimesDt) {
//           return {
//             ...dt,
//             properties: {
//              ...dt.properties,
//              code1: findVitimesDt.parentCode,
//              code2: findVitimesDt.code
//             },
//           }
//         }
//         return dt
//       })
//       const data = JSON.stringify({...listDistricts, features: covertedDistricts});
//       fs.writeFile(path + "gadm36_VNM_2.json", data, (err) => {
//         if (err) console.log(err + "gadm36_VNM_2");
//         console.log("Successfully Written to File." + "gadm36_VNM_2");
//       });
//     }
//   }).catch(err => {
//     console.log(err);
//   })

// }
// parseDistricts();

const parseProvinces = async _ => {
  pagingAdministratives({
    level: 3,
    pageIndex: 1,
    pageSize: 9999,
  }).then((res) => {
    if (res && res.data && res.data.content && res.data.content.length > 0) {
      const provinces = listProvinces.features
      const listProvincesVitimes = res.data.content;
      const covertedProvinces = provinces.map((p) => {
        const findVitimesDt = listProvincesVitimes.find(f => {
          if (p.properties && p.properties.NAME_1 && f.name) {
            if (f.name.includes(p.properties.NAME_1)) {
              return true
            }
          }
          return false;
        })
        if (findVitimesDt) {
          return {
            ...p,
            properties: {
             ...p.properties,
             code1: findVitimesDt.code
            },
          }
        }
        return p
      })
      const data = JSON.stringify({...listProvinces, features: covertedProvinces});
      fs.writeFile(path + "gadm36_VNM_1.json", data, (err) => {
        if (err) console.log(err + "gadm36_VNM_1");
        console.log("Successfully Written to File." + "gadm36_VNM_1");
      });
    }
  }).catch(err => {
    console.log(err);
  })

}
parseProvinces();
