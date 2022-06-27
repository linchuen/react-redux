export async function fetchUrl(url) {
  return await fetch(url).then(res => res.json())
  //return await fetch(url).then(res=>{console.log(res.json());return res.json()})
}

export async function postUrl(url) {
  return await fetch(url, { method: "POST" }).then(res => res.json())
  //return await fetch(url).then(res=>{console.log(res.json());return res.json()})
}

export function transferIndustryType(data) {
  let map = new Map([
    ['食品工業','食品'],
    ['營建','建材營造'],
    ['汽車工業','汽車'],
    ['電機','電機機械'],
    ['航運','交通航運']
  ]);
  if (map.has(data)) {
    return map.get(data)
  } else {
    return data
  }
}