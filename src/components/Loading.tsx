import React from 'react';

// todo: add CSS using tailwind
// .loading {
//     border: 5px solid #f3f3f3;
//     border-top: 5px solid #3498db;
//     border-radius: 50%;
//     width: 40px;
//     height: 40px;
//     animation: spin 1s linear infinite;
//   }
  
//   @keyframes spin {
//     0% {
//       transform: rotate(0deg);
//     }
//     100% {
//       transform: rotate(360deg);
//     }
//   } 

export function Loading () {
    return (
        <div className="h-40 w-40 radius-full"></div>
    );
}
