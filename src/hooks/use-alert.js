// import React from 'react';
// import ReactModal from 'react-modal';
// import Card from '../components/card';


// function useAlert() {
//   const [message, setMessage] = React.useState();
//   const [value, setValue] = React.useState(false);
//   const [isOpen, setIsOpen] = React.useState(false);

//   const overlayStyles = {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 100,
//   };

//   const contentStyles = {
//     position: 'relative',
//     backgroundColor: 'transparent',
//     border: 0,
//     borderRadius: '5px',
//     padding: 0,
//   };

//   async function show(msg) {
//     setMessage(msg);
//     setIsOpen(true);
//   }

//   const Alert = (
//     <ReactModal
//       isOpen={isOpen}
//       style={{ overlay: overlayStyles, content: contentStyles }}
//       // className="login-modal fade-in"
//       // onRequestClose={() => onRequestClose()}
//     >
//       <Card>
//         <div className="p-4">

//           <div>
//             {message}
//           </div>

//           <form onSubmit={}>
//             <input type="text" value={value} style={{ margin: '1rem 0' }} />
//           </form>
//         </div>
//       </Card>
//     </ReactModal>
//   );

//   return { Alert, show };
// }


// export default useAlert;
