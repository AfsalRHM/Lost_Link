import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Success Toast
export const showSuccessToast2 = (message: string) => {
  iziToast.success({
    message,
    position: 'topCenter',
    timeout: 2000,
    close: true,
    progressBar: true,
    pauseOnHover: true,
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutUp',
  });
};

// Error Toast
export const showErrorToast2 = (message: string) => {
  iziToast.error({
    message,
    position: 'topCenter',
    timeout: 2000,
    close: true,
    progressBar: true,
    pauseOnHover: true,
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutUp',
  });
};
