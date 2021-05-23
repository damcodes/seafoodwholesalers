class Adapter {
  static fetch(method, endpoint, body) {
    const getAll = (method, endpoint) => {
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

    let res;
    switch(method) {
      case "GET":
        res = getAll(method, endpoint)
        break;
      case "POST":
        res = post(method, endpoint, body)
        break;
      case "PATCH":
        res = patch(method, endpoint, body)
        break;
      case "DELETE":
        res = del(method, endpoint)
        break;
      default:
        break;
    }
    return res;
  }
}

export default Adapter;