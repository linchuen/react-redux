export async function fetchUrl(url) {
  return await fetch(url).then(res => res.json())
  //return await fetch(url).then(res=>{console.log(res.json());return res.json()})
}

export async function postUrl(url) {
  return await fetch(url,{method: "POST"}).then(res => res.json())
  //return await fetch(url).then(res=>{console.log(res.json());return res.json()})
}
