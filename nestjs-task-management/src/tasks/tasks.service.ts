import {Injectable, NotFoundException} from '@nestjs/common';
import {TasksRepository} from "./tasks.repository";
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskStatusDto} from "./dto/update-task-status.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksRepository)
        private tasksRepository: TasksRepository
    ) {
    }

    getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {

        const found = await this.tasksRepository.getTaskById(id)

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found `);
        }

        return found;
    }


    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }


    async updateTaskStatus(id: string, {status}: UpdateTaskStatusDto): Promise<Task> {
        const task = await this.getTaskById(id);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }

    async deleteTask(id: string): Promise<void> {
        const result = await this.tasksRepository.delete({id});

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found `);
        }
    }
}
