import Swal from 'sweetalert2';

const sweetAlert = () =>
  Swal.fire({
    icon: 'error',
    title: 'Input fields missing...',
    text: 'Make sure to fill up both the fields',
  });

export default sweetAlert;
