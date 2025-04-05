// document.addEventListener('DOMContentLoaded', () => {
//     const dateElements = document.querySelectorAll('.date');
//     dateElements.forEach(dateElement => {
//         if (!dateElement) return;
//         const attribute = dateElement.getAttribute('data-date');
//         if (!attribute) return;
//         const date = new Date(attribute);
//         if (!date) return;
//         dateElement.textContent = "📅 " + date.toLocaleDateString(undefined, {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//         });
//     });
// });