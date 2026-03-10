import Swal from 'sweetalert2';

/**
 * Show a success popup with auto-dismiss after 2 seconds.
 */
export const showSuccess = (title: string, text?: string) => {
    Swal.fire({
        icon: 'success',
        title,
        text,
        timer: 2000,
        showConfirmButton: false,
    });
};

/**
 * Show an error popup.
 */
export const showError = (title: string, text?: string) => {
    Swal.fire({
        icon: 'error',
        title,
        text: text || 'Something went wrong!',
    });
};

/**
 * Show a confirmation dialog and return the user's decision.
 * Resolves to `true` if confirmed, `false` if cancelled.
 */
export const showConfirm = async (
    title: string,
    text: string,
    confirmButtonText = 'Yes, delete it!'
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#6b7280',
        confirmButtonText,
    });
    return result.isConfirmed;
};
