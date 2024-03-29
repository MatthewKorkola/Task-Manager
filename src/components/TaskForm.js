import React, { useState } from 'react';
import '../CSS/TaskForm.css';
import PropTypes from 'prop-types';
import { Popup } from 'reactjs-popup';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';


const TaskForm = ({ addTask, createProject, selectProject, deleteProject, currentProject, projectCompletionPercentage, projects }) => {
    const [title, setTitle] = useState('');
    const [deadline, setDeadline] = useState('');
    const [expectedTime, setExpectedTime] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState('');

    const handleProjectSelect = (projectName) => {
        setSelectedProject(projectName);
        selectProject(projectName);
    };

    const handleProjectDelete = (projectName) => {
        deleteProject(projectName);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim() || !deadline.trim() || !expectedTime.trim()) return;
        if (!currentProject) {
            alert('Please select a project first.');
            return;
        }
        // Modify expectedTime before adding the task
        let modifiedExpectedTime = expectedTime;
        if (modifiedExpectedTime.endsWith('.')) {
            // Add '0' to the end of a trailing decimal point
            modifiedExpectedTime += '0';
        } else if (!modifiedExpectedTime.includes('.')){
            modifiedExpectedTime += '.0'
        }

        addTask({ taskname: title, deadline, completed: false, expectedTime: modifiedExpectedTime });
        setTitle('');
        setDeadline('');
        setExpectedTime('');
        setIsPopupOpen(false)
    }

    const handleCreateProjectSubmit = (e) => {
        e.preventDefault();
        if (!projectName.trim()) {
          setError('Please enter a project name.');
          return;
        }
        createProject(projectName);
        setProjectName('');
      };

    const handleCreateTaskClick = () => {
        setIsPopupOpen(true);
    }

    const handleExpectedTimeInputChange = (e) => {
        let inputValue = e.target.value;

        // Remove non-numeric characters except decimal points
        inputValue = inputValue.replace(/[^0-9.]/g, '');

        // Ensure the input doesn't start with a decimal point
        inputValue = inputValue.replace(/^\./, '');

        // Ensure there's at most one decimal point
        inputValue = inputValue.replace(/(\.\d*)\./, '$1');

        setExpectedTime(inputValue);
    };

    return (
        <div className="task-form">
        <div className="project-task-manager"> Project and Task Manager </div>
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <button >Create Project</button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="DialogOverlay" />
                <Dialog.Content className="DialogContent">
                  <Dialog.Title className="DialogTitle">Create New Project</Dialog.Title>
                  <Dialog.Description className="DialogDescription">
                    Enter the name for your new project.
                  </Dialog.Description>
                  <form onSubmit={handleCreateProjectSubmit}>
                    <fieldset className="Fieldset">
                      <label className="Label" htmlFor="projectName">
                        Project Name
                      </label>
                      <input
                        className="Input"
                        id="projectName"
                        type="text"
                        placeholder="16 characters maximum"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        maxLength={16}
                        required
                      />
                      {error && <p className="Error">{error}</p>}
                    </fieldset>
                    <div style={{ display: 'flex', marginTop: 25, justifyContent: 'flex-end' }}>
                      <button type="submit" className="Button green">Create</button>
                    </div>
                  </form>
                  <Dialog.Close asChild>
                    <button className="IconButton" aria-label="Close">
                      <Cross2Icon />
                    </button>
                  </Dialog.Close>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>

            <div className="project-actions">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button>
                            Select Project
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="DropdownMenuContent">
                            {projects.length === 0 ? (
                                <DropdownMenu.Item className="DropdownMenuItem">no projects</DropdownMenu.Item>
                            ) : (
                                <>
                                    {projects.map(project => (
                                        <DropdownMenu.Item key={project.name} onSelect={() => handleProjectSelect(project.name)} className="DropdownMenuItem">
                                            {project.name}
                                        </DropdownMenu.Item>
                                    ))}
                                    <DropdownMenu.Separator className="DropdownMenuSeparator"/>
                                    <DropdownMenu.Arrow className="DropdownMenuArrow"/>
                                </>
                            )}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>

                <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                        <button>
                            Delete Project
                        </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                        <DropdownMenu.Content className="DropdownMenuContent">
                            {projects.length === 0 ? (
                                <DropdownMenu.Item className="DropdownMenuItem">no projects</DropdownMenu.Item>
                            ) : (
                                <>
                                    {projects.map(project => (
                                        <DropdownMenu.Item key={project.name} onSelect={() => handleProjectDelete(project.name)} className="DropdownMenuItem">
                                            {project.name}
                                        </DropdownMenu.Item>
                                    ))}
                                    <DropdownMenu.Separator className="DropdownMenuSeparator"/>
                                    <DropdownMenu.Arrow className="DropdownMenuArrow"/>
                                </>
                            )}
                        </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                </DropdownMenu.Root>
            </div>
            <div className="create-task">
                <div className="create-task-text">
                    <button onClick={handleCreateTaskClick}>Create Task</button>
                </div>
                <Popup open={isPopupOpen} closeOnDocumentClick onClose={() => setIsPopupOpen(false)}>
                    <div className="taskform-popup-content">
                        <form onSubmit={handleSubmit} className="taskform-popup-form">
                            <div className="taskform-popup-header">Create Task</div>
                            <div>
                                <label>
                                    Task Name
                                </label>
                                <input type="text" placeholder="16 characters maximum" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={16}/>
                            </div>
                            <div>
                                <label>
                                    Deadline
                                </label>
                                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                            </div>
                            <div>
                                <label>
                                    Expected Completion Time (hours)
                                </label>
                                <input type="text" placeholder="5 characters maximum; numeric input only, including decimals" value={expectedTime} onChange={(handleExpectedTimeInputChange)} maxLength={5} />
                            </div>
                            <div className="taskform-popup-footer">
                                <button type="submit" className="taskform-popup-button">Add Task</button>
                            </div>
                        </form>
                        <button className="taskform-popup-button" onClick={() => setIsPopupOpen(false)}>Exit</button>
                    </div>
                </Popup>
            </div>
            <div className="project-completion-text"> Project Completion:  </div>
            <div className={`${projectCompletionPercentage() === '100%' ? 'gold' : 'project-completion'}`}>
                {projectCompletionPercentage()}
            </div>
        </div>
    );
}

TaskForm.propTypes = {
    addTask: PropTypes.func.isRequired,
    createProject: PropTypes.func.isRequired,
    selectProject: PropTypes.func.isRequired,
    deleteProject: PropTypes.func.isRequired,
    currentProject: PropTypes.object, // Current project object
    projectCompletionPercentage: PropTypes.func.isRequired, // Project completion percentage text
    projects: PropTypes.array.isRequired
};

export default TaskForm;
