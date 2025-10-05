import Swal from 'sweetalert2';

export const showSuccess = (title: string, text: string) => {
    return Swal.fire(title, text, "success");
};

export const showError = (title: string, text: string) => {
    return Swal.fire(title, text, "error");
};

export const showConfirmation = async (
    title: string,
    text: string,
    confirmText: string,
    cancelText: string,
    confirmColor: string = '#d33'
): Promise<boolean> => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#3085d6',
        confirmButtonText: confirmText,
        cancelButtonText: cancelText
    });

    return result.isConfirmed;
};