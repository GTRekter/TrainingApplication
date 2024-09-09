class ProjectsService {    
    getProjects(){
        return fetch(process.env.REACT_APP_PROJECTS_API_URL,{ 
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
export default new ProjectsService();