class Adapter {

    static fetch = async (method, endpoint, body) => {
        const auth = localStorage.getItem("auth_key");
        const apiUrl = 'http://localhost:3001/';
        const headers = {
            "Content-type": "application/json",
            "Authorization": auth
        };
        const get = (method, endpoint) => {
            return fetch(`${apiUrl}${endpoint}`, {
                method: method,
                headers: headers
            })
        }

        const post = (method, endpoint, body) => {
            return fetch(`${apiUrl}${endpoint}`, {
                method: method,
                headers: headers,
                body: JSON.stringify(body)
            })
        }

        const patch = (method, endpoint, body) => {
            return fetch(`${apiUrl}${endpoint}`, {
                method: method,
                headers: headers,
                body: JSON.stringify(body)
            })
        }

        const del = (method, endpoint) => {
            return fetch(`${apiUrl}${endpoint}`, {
                method: method,
                headers: headers
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
        switch (method) {
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