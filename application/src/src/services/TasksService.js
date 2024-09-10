class TasksService {    
    getTasks(){
        return fetch(process.env.REACT_APP_TASKS_API_URL,{ 
            method: 'get',
            mode: 'cors',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*'
            }
        })
        .then(res => res.json());
    }
}
export default new TasksService();