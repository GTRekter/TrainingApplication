import React, { Component } from 'react';
import TasksService from '../services/TasksService';
import './projectDetails.css';
import ProjectsService from '../services/ProjectsService';

export default class ProjectDetails extends Component {
    state = {
        name: '',
        description: '',
        status: '',
        tasks: []
    };

    constructor(props) {
        super(props);
        this.onClickOpenTask = this.onClickOpenTask.bind(this);
        this.onClickCompleteTask = this.onClickCompleteTask.bind(this);
    }

    componentDidMount() {
        const { projectId } = this.props.match.params;
        console.log("Fetching project details for project ID:", projectId);
        ProjectsService.getProjectById(projectId)
            .then(project => this.setState({ name: project.name, description: project.description, status: project.status }))
            .catch(error => console.error('Error fetching project:', error));
        console.log("Fetching tasks for project ID:", projectId);
        console.log("API URL:", process.env.REACT_APP_TASKS_API_URL);
        TasksService.getTasksByProjectId(projectId)
            .then(tasks => this.setState({ tasks }))
            .catch(error => console.error('Error fetching tasks:', error));
    }

    onClickEditTask(taskId) {
        console.log("Edit task", taskId);
    }

    onClickDeleteTask(taskId) {
        console.log("Delete task", taskId);
    }

    onClickOpenTask(taskId) {
        TasksService.updateTaskStatus(taskId, { status: "open" })
            .then(() => {
                const tasks = this.state.tasks.map(task => {
                    if (task.id === taskId) {
                        task.status = "open";
                    }
                    return task;
                });
                this.setState({ tasks });
                const { projectId } = this.props.match.params;
                ProjectsService.getProjectById(projectId)
                    .then(project => this.setState({ status: project.status }))
                    .catch(error => console.error('Error fetching project:', error));
            })
            .catch(error => console.error('Error completing task:', error));
    }

    onClickCompleteTask(taskId) {
        TasksService.updateTaskStatus(taskId, { status: "completed" })
            .then(() => {
                const tasks = this.state.tasks.map(task => {
                    if (task.id === taskId) {
                        task.status = "completed";
                    }
                    return task;
                });
                this.setState({ tasks });
                const { projectId } = this.props.match.params;
                ProjectsService.getProjectById(projectId)
                    .then(project => this.setState({ status: project.status }))
                    .catch(error => console.error('Error fetching project:', error));
            })
            .catch(error => console.error('Error completing task:', error));
    }

    render() {
        return (
            <div className="full-height-container">
                <div className="text-center text-white py-5">   
                    <h1>{this.state.name}</h1>
                    <p>{this.state.description}</p>
                    <p>Status: {this.state.status}</p>
                </div>
                <div className="text-center text-white py-5">  
                    <h2>Tasks</h2>
                    <p>These are all the tasks listed in the database</p>
                    <div className="container">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.tasks.map(task => 
                                    <tr key={task.id}>
                                        <td>{task.id}</td>
                                        <td>{task.name}</td>
                                        <td>{task.description}</td>
                                        <td>{task.status}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => this.onClickCompleteTask(task.id)}>Complete</button>
                                            <button className="btn btn-danger" onClick={() => this.onClickOpenTask(task.id)}>Open</button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
