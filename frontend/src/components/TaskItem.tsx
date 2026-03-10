import type { ITask } from '../types';
import { format } from 'date-fns';
import { Edit2, Trash2 } from 'lucide-react';

interface TaskItemProps {
    task: ITask;
    onEdit: (task: ITask) => void;
    onDelete: (id: string) => void;
    onToggleStatus: (task: ITask) => void;
}

const TaskItem = ({ task, onEdit, onDelete, onToggleStatus }: TaskItemProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'ongoing': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <tr className="border-t border-gray-100">
            <td className="px-4 py-4 align-top">
                <div>
                    <p className={`font-semibold ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {task.title}
                    </p>
                    {task.description && (
                        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                        {format(new Date(task.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                </div>
            </td>

            <td className="px-4 py-4 align-top">
                <button
                    onClick={() => onToggleStatus(task)}
                    className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getStatusColor(task.status)} hover:opacity-80 transition-opacity`}
                    title="Toggle Status"
                >
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </button>
            </td>

            <td className="px-4 py-4 align-top">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Task"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default TaskItem;
