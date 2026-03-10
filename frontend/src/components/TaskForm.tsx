import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { createTask, updateTask } from '../features/tasksSlice';
import type { ITask } from '../types';
import { showSuccess, showError } from '../utils/swal';

interface TaskFormProps {
    initialData?: ITask | null;
    onSuccess: () => void;
    onCancel: () => void;
}

// Form values interface for strong typing
interface TaskFormValues {
    title: string;
    description: string;
    status: 'pending' | 'ongoing' | 'completed';
}

const TaskForm = ({ initialData, onSuccess, onCancel }: TaskFormProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const formik = useFormik<TaskFormValues>({
        initialValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            status: initialData?.status || 'pending',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required').max(255, 'Must be 255 characters or less'),
            description: Yup.string(),
            status: Yup.string().oneOf(['pending', 'ongoing', 'completed']),
        }),
        onSubmit: async (values) => {
            try {
                if (initialData?.id) {
                    await dispatch(updateTask({ id: initialData.id, task: values })).unwrap();
                    showSuccess('Task Updated', 'Your task has been successfully updated.');
                } else {
                    await dispatch(createTask(values)).unwrap();
                    showSuccess('Task Created', 'Your new task has been successfully created.');
                }
                onSuccess();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : undefined;
                showError('Oops...', message);
            }
        },
    });

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {initialData ? 'Edit Task' : 'Create New Task'}
                </h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 ${formik.touched.title && formik.errors.title ? 'border-red-500' : ''}`}
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <p className="text-red-500 text-xs italic mt-1">{formik.errors.title}</p>
                        ) : null}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={3}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.status}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="pending">Pending</option>
                            <option value="ongoing">Ongoing</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 disabled:opacity-50"
                        >
                            {formik.isSubmitting ? 'Saving...' : 'Save Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
