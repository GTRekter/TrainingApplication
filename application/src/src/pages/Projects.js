import React, { Component } from 'react';
import ProjectsService from '../services/ProjectsService';
import './projects.css';

export default class Projects extends Component {
    state = {
        projects: [],
    };

    constructor(props) {
        super(props);
        this.onClickEditProject = this.onClickEditProject.bind(this);
        this.onClickDeleteProject = this.onClickDeleteProject.bind(this);
    }

    componentDidMount() {
        console.log("Fetching projects from the API");
        console.log("API URL:", process.env.REACT_APP_PROJECTS_API_URL);
        ProjectsService.getProjects()
            .then(projects => this.setState({ projects }))
            .catch(error => console.error('Error fetching projects:', error));
    }

    onClickEditProject(projectId) {
        console.log("Edit project", projectId);
    }

    onClickDeleteProject(projectId) {
        console.log("Delete project", projectId);
    }

    render() {
        return (
            <div className="full-height-container">
                <div className="text-center text-white py-5">
                    <h1>Projects</h1>
                    <p>These are all the project listed in the database</p>
                    <div className="container">
                        <table className="table table-dark table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.projects.map(project => 
                                    <tr key={project.id}>
                                        <td>{project.id}</td>
                                        <td>{project.name}</td>
                                        <td>{project.description}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => this.onClickEditUser(project.id)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => this.onClickDeleteUser(project.id)}>Delete</button>
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
