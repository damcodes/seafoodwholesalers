class Adapter {
  static fetch = async (method, endpoint, body) => {
    const get = (method, endpoint) => {
      return fetch(`http://localhost:3001/${endpoint}`, {
        method: method,
        headers: {
          "Content-type":"application/json",
          "Authorization": localStorage.getItem("auth_key")
        }
      })
    }
    
    const post = (method, endpoint, body) => {
      console.log(body)
      return fetch(`http://localhost:3001/${endpoint}`, {
        method: method,
        headers: {
        "Content-type":"application/json",
        "Authorization": localStorage.getItem("auth_key")
        },
        body: JSON.stringify(body)
      })
    }
    
    const patch = (method, endpoint, body) => {
      return fetch(`http://localhost:3001/${endpoint}`, {
        method: method, 
        headers: {
          "Content-type":"application/json",
          "Authorization": localStorage.getItem("auth_key")
        },
        body: JSON.stringify(body)
      })
    }
    
    const del = (method, endpoint) => {
      return fetch(`http://localhost:3001/${endpoint}`, {
        method: method,
        headers: {
          "Content-type":"application/json",
          "Authorization": localStorage.getItem("auth_key")
        }
      })
    }

    const handleResponse = async res => {
        let json = await res.json();
        if (!res.ok) {
            const err = Object.assign({}, json, {
                status: res.status,
                statusText: res.statusText
            });
            return Promise.reject(err);
        };
        return json;
    }

    let res;
    switch(method) {
      case "GET":
        res = await get(method, endpoint);
        break;
      case "POST":
        res = await post(method, endpoint, body);
        break;
      case "PATCH":
        res = await patch(method, endpoint, body);
        break;
      case "DELETE":
        res = await del(method, endpoint);
        break;
      default:
        break;
    }
    return await handleResponse(res);
  };
}

export default Adapter;