import {Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query,} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {Task} from "./task.entity";
import {CreateTaskDto} from "./dto/create-task.dto";
import {UpdateTaskStatusDto} from "./dto/update-task-status.dto";
import {GetTasksFilterDto} from "./dto/get-tasks-filter.dto";

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) {
    }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
        return this.tasksService.getTasks(filterDto);
    }

    @Get('/:id')
    async getTaskById(@Param('id') id: string): Promise<Task> {
        const found = await this.tasksService.getTaskById(id);

        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }

        return found;
    }


    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksService.createTask(createTaskDto);
    }


    @Delete('/:id')
    deleteTask(@Param('id') id: string): Promise<void> {
        return this.tasksService.deleteTask(id);
    }


    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, updateTaskStatusDto);
    }
}
