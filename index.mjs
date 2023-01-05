import fs from "fs";
import provinces from "./districts.js";
import axios from "axios";
const path = "./mapDataJSON/district/";

const token = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJlUktVWG10TFhKMHBBNkxBS29aWko1ZlU0VDhCdmxKdERCb3pXanFFdnhjIn0.eyJleHAiOjE2NzI5NjEwNzgsImlhdCI6MTY3MjkyNTA3OCwiYXV0aF90aW1lIjoxNjcyOTI1MDc4LCJqdGkiOiIxYmY3ZWI2Mi1mYTNhLTQ4NmEtYWRjMC0wMWQ3ODRlYjAwM2MiLCJpc3MiOiJodHRwczovL3Nzby5nbG9iaXRzLm5ldC9hdXRoL3JlYWxtcy9nbG9iaXRzIiwic3ViIjoiMDQzNTA1MzEtNWJmZC00YjQ4LWJjMmEtODliNThlYzEwM2M5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic3NvQ2xpZW50LTEiLCJub25jZSI6IjgyZjEyYjdhLTI1ZDYtNGI4YS04MzM4LTE2ZmYyNjFiYTRjOSIsInNlc3Npb25fc3RhdGUiOiI1MzEzNDQ5NS1hMzhkLTQwMDktOGRhNi0xMDJiNDFiYzUxYmMiLCJhY3IiOiIxIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluIn0.r2OnuZrEae4wqRQ4PihvQxvOleDjqIxpyEhbq3Sz6miebOaZWD7jX5_w4c97qqtxj84UaywY-Ttl1Buf4ZfEvM9iqJ9QIbYQtxmceg-S13-egyiJI9zvsW8tSDWLhIXnF3honB2DJ7zgxaTYuQztO8lJNLBQNCuyu00pj15KIYTMEjfUB3AylP1yc7Xu06_mWwxqP8S06yY9uqSWj7d_ZA4Wy0l6TMLtJZzC0z8QZb5-xtR22u1z1R8fyDqrmA_MxwDMmP0fWEker6cu11MZPe_9DUdvN8qrqWqiSo-t585Gv5dT0NVqVSNHvC0BageAIbbGLRx_AhO9j36_5sGkyA";
axios.defaults.headers.common["Authorization"] = "Bearer " + token;

const API_PATH = "http://localhost:8071/api/administrative-unit";

const pagingAdministratives = (searchObject) => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};

// const newProvinces = {...provinces}
const forLoop = async _ => {
  for (const provinceName in provinces) {
    const province = provinces[provinceName]
    if (province) {
      const wards = province.features
      if (wards && wards.length > 0 && wards[0].properties && wards[0].properties.NAME_1) {
        const resProvince = await pagingAdministratives({
          level: 3,
          keyword: wards[0].properties.NAME_1,
          pageIndex: 1,
          pageSize: 10,
        })
        
        if (resProvince.data && resProvince.data.content && resProvince.data.content.length > 0 && resProvince.data.content[0].id) {
          const provinceVitimes = resProvince.data.content[0];
          if (provinceVitimes && provinceVitimes.id) {
            pagingAdministratives({
              level: 5,
              provinceId: provinceVitimes.id,
              pageIndex: 1,
              pageSize: 9999,
            }).then((res) => {
              if (res && res.data && res.data.content && res.data.content.length > 0) {
                const listWardsVitimes = res.data.content;
                const covertedWards = wards.map((ward) => {
                  const findVitimesWard = listWardsVitimes.find(f => {
                    if (ward.properties && ward.properties.NAME_2 && ward.properties.NAME_3 && f.name && f.parentName) {
                      if (f.name.includes(ward.properties.NAME_3) && f.parentName.includes(ward.properties.NAME_2)) {
                        return true
                      }
                    }
                    return false;
                  })
                  if (findVitimesWard) {
                    return {
                      ...ward,
                      properties: {
                       ...ward.properties,
                       code1: provinceVitimes.code,
                       code2: findVitimesWard.parentCode,
                       code3: findVitimesWard.code
                      },
                    }
                  }
                  return ward
                })
                const data = JSON.stringify({...province, features: covertedWards});
                fs.writeFile(path + provinceName + ".json", data, (err) => {
                  if (err) console.log(err + provinceName);
                  console.log("Successfully Written to File." + provinceName);
                });
              }
            })
          }
        }
      }
    }
  }
  // var data = JSON.stringify(newProvinces);
}
forLoop();


