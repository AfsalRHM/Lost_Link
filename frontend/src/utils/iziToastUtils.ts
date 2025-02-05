import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Success Toast
export const showSuccessToast2 = (message: string) => {
  iziToast.success({
    message,
    position: "topCenter",
    timeout: 2000,
    close: true,
    progressBar: true,
    pauseOnHover: true,
    transitionIn: "fadeInDown",
    transitionOut: "fadeOutUp",
  });
};

// Error Toast
export const showErrorToast2 = (message: string) => {
  iziToast.error({
    message,
    position: "topCenter",
    timeout: 2000,
    close: true,
    progressBar: true,
    pauseOnHover: true,
    transitionIn: "fadeInDown",
    transitionOut: "fadeOutUp",
  });
};

// Confirmation Toast
export const showConfirmToast = (message: string, onConfirm: () => void) => {
  iziToast.show({
    message: message,
    position: "topCenter",
    timeout: false,
    close: false,
    progressBar: false,
    buttons: [
      [
        "<button>Confirm</button>",
        (instance, toast) => {
          onConfirm(); 
          instance.hide({ transitionOut: "fadeOutUp" }, toast); 
        },
        true, 
      ],
      [
        "<button>Cancel</button>",
        (instance, toast) => {
          instance.hide({ transitionOut: "fadeOutUp" }, toast);
        },
        true,
      ],
    ],
    transitionIn: "fadeInDown",
    transitionOut: "fadeOutUp",
  });
};
