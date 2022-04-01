export async function fetchUrl(url) {
    return await fetch(url).then(res=>res.json())
  }
  