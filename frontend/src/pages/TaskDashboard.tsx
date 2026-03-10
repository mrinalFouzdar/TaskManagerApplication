import { Suspense, lazy, useEffect, useState, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store/store';
import { fetchTasks, deleteTask } from '../features/tasksSlice';
import TaskItem from '../components/TaskItem';
import type { ITask } from '../types';
import { showSuccess, showError, showConfirm } from '../utils/swal';
import { Plus, Search, Loader2 } from 'lucide-react';
import { debounce } from 'lodash';

const TaskForm = lazy(() => import('../components/TaskForm'));

const TaskDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { tasks, total, loading } = useSelector((state: RootState) => state.tasks);

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<ITask | null>(null);
    const limit = 5;

    // Stable debounced fetch — useMemo gives a stable fn without stale-closure issues
    const debouncedFetch = useMemo(
        () => debounce((searchTerm: string, p: number) => {
            dispatch(fetchTasks({ page: p, limit, search: searchTerm }));
        }, 500),
        [dispatch]
    );

    // Cancel on unmount
    useEffect(() => () => { debouncedFetch.cancel(); }, [debouncedFetch]);

    // Re-fetch whenever search or page changes
    useEffect(() => {
        debouncedFetch(search, page);
    }, [search, page, debouncedFetch]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleDelete = (id: string) => {
        showConfirm('Are you sure?', "You won't be able to revert this!").then((confirmed) => {
            if (confirmed) {
                dispatch(deleteTask(id))
                    .unwrap()
                    .then(() => {
                        showSuccess('Deleted!', 'Your task has been deleted.');
                    })
                    .catch((err: unknown) => {
                        const message = err instanceof Error ? err.message : undefined;
                        showError('Error', message);
                    });
            }
        });
    };

    const handleToggleStatus = (task: ITask) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleEdit = (task: ITask) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tasks</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your daily tasks and priorities.</p>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    New Task
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm transition-shadow"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Task Table */}
            <div className="min-h-[400px] bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">Title</th>
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">Status</th>
                            <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wide px-4 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && tasks.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-10">
                                    <div className="flex justify-center items-center text-blue-500">
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        <span className="ml-3 font-medium">Loading tasks...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : tasks.length > 0 ? (
                            tasks.map((task) => (
                                <TaskItem
                                    key={task.id}
                                    task={task}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleStatus={handleToggleStatus}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="px-4 py-12 text-center">
                                    <h3 className="text-sm font-medium text-gray-900">No tasks found</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {search ? 'Try adjusting your search query.' : 'Get started by creating a new task.'}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6 rounded-lg shadow-sm">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">Next</button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{page}</span> of <span className="font-medium">{totalPages}</span>
                        </p>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" /></svg>
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Form Modal */}
            {isFormOpen && (
                <Suspense fallback={<div className="fixed inset-0 grid place-items-center bg-black/30 text-white">Loading form...</div>}>
                    <TaskForm
                        initialData={editingTask}
                        onSuccess={() => {
                            handleCloseForm();
                            dispatch(fetchTasks({ page, limit, search }));
                        }}
                        onCancel={handleCloseForm}
                    />
                </Suspense>
            )}
        </div>
    );
};

export default TaskDashboard;
