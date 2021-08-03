// import React from 'react';
// //Shows Threads
// //Tabs with Resolved and Active
// //Create new Thread
// const HomePage = () => {
//   return (
//     <div style={{width: '416px'}}>
//       <div
//         className="container-0-2-9 container-d0-0-2-10"
//         data-modal-container="true"
//       >
//         <div className="topBar-0-2-12">
//           <div
//             className="channelName-0-2-13"
//             title="Cord | Collaborate everywhere chat"
//           >
//             Cord | Collaborate everywhere chat
//           </div>
//           <div className="participants-0-2-14">
//             <div className="container-0-2-15">
//               <div style={{position: 'relative', zIndex: 2}}>
//                 <div className="box-0-2-21 box-d0-0-2-22">
//                   <div className="">
//                     <img
//                       alt="Shailesh Srivastava"
//                       className="profilePicture-0-2-23 profilePicture-d0-0-2-24"
//                       src="https://avatars.slack-edge.com/2021-04-12/1957716497588_df1193220f902e85febb_original.jpg"
//                       width="28"
//                       height="28"
//                       style={{backgroundColor: 'rgb(113, 188, 143)'}}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div
//                 style={{marginLeft: '-6px', position: 'relative', zIndex: 1}}
//               >
//                 <div className="box-0-2-21 box-d1-0-2-25">
//                   <div className="">
//                     <img
//                       alt="DJ"
//                       className="profilePicture-0-2-23 profilePicture-d1-0-2-26"
//                       src="https://avatars.slack-edge.com/2021-04-11/1942999686694_8bffe209444004c7ed85_original.jpg"
//                       width="28"
//                       height="28"
//                       style={{backgroundColor: 'rgb(113, 188, 143)'}}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="threadPane-0-2-27">
//           <div className="container-0-2-111">
//             <div className="header-0-2-112">
//               <img
//                 src="https://app.cord.com/static/provider-icons/cord.png"
//                 className="profilePicture-0-2-113"
//               />
//               <p className="text-0-2-5 text-d1-0-2-116 author-0-2-115">Cord</p>
//               <svg
//                 className="MuiSvgIcon-root closeButton-0-2-117 closeButton-d0-0-2-118"
//                 focusable="false"
//                 viewBox="0 0 24 24"
//                 role="img"
//                 style={{padding: '8px', fontSize: '16px'}}
//               >
//                 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
//                 <title>Dismiss</title>
//               </svg>
//             </div>
//             <div className="body-0-2-114">
//               <p className="text-0-2-5 text-d2-0-2-119">
//                 Get on the same page as your team
//               </p>
//               <p className="text-0-2-5 text-d3-0-2-120">
//                 Join your teammates and chat live, or view when they've seen
//                 your messages by selecting the three dots beside anything you
//                 send
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="container-0-2-35">
//           <input
//             type="file"
//             accept="image/jpeg,image/png,application/pdf"
//             multiple=""
//             style={{display: 'none'}}
//           />
//           <div>
//             <div
//               className="box-0-2-21 box-d2-0-2-45 composer-0-2-37 withBorderTop-0-2-38"
//               style={{cursor: 'unset'}}
//             >
//               <div>
//                 <div className="box-0-2-21 box-d3-0-2-46">
//                   <div className="box-0-2-21 box-d4-0-2-47 editorScrollContainer-0-2-39">
//                     <div className="textareaWrap-0-2-48">
//                       <div style={{position: 'relative'}}>
//                         <div
//                           data-gramm="false"
//                           role="textbox"
//                           className="editor-0-2-49"
//                           data-slate-editor="true"
//                           data-slate-node="value"
//                           contentEditable="true"
//                           style={{
//                             outline: 'none',
//                             whiteSpace: 'pre-wrap',
//                             overflowWrap: 'break-word',
//                           }}
//                         >
//                           <p
//                             data-slate-node="element"
//                             style={{marginBottom: '8px'}}
//                           >
//                             <span data-slate-node="text">
//                               <span data-slate-leaf="true">
//                                 <span
//                                   data-slate-zero-width="n"
//                                   data-slate-length="0"
//                                 >
//                                   &#xFEFF;
//                                   <br />
//                                 </span>
//                               </span>
//                             </span>
//                           </p>
//                         </div>
//                         <span className="placeholder-0-2-50">
//                           Reply to thread
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="verticalSpacer-0-2-40"></div>
//                 </div>
//               </div>
//               <div className="composerMenuWrapper-0-2-41 autoHeight-0-2-43">
//                 <div className="box-0-2-21 box-d5-0-2-53 row-0-2-52">
//                   <div className="box-0-2-21 box-d6-0-2-56 button-0-2-54 button-d0-0-2-55">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-69 svg-d0-0-2-70 svg-0-2-57 svg-d0-0-2-63"
//                     >
//                       <path
//                         d="M21 10.205c0 4.532-1.969 5.256-9 11.795-7.031-6.667-9-7.263-9-11.795C3 5.674 7.03 2 12 2s9 3.674 9 8.205z"
//                         className="strokePrimary-0-2-61 strokePrimary-d4-0-2-67"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M12 12a2 2 0 100-4 2 2 0 000 4z"
//                         className="strokePrimary-0-2-61 strokePrimary-d4-0-2-67"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="box-0-2-21 box-d7-0-2-72 button-0-2-54 button-d1-0-2-71">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-69 svg-d1-0-2-79 svg-0-2-57 svg-d6-0-2-73"
//                     >
//                       <path
//                         d="M15 3.75h3.75a.75.75 0 01.75.75v15.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75H9"
//                         className="strokePrimary-0-2-61 strokePrimary-d10-0-2-77"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M15 11.796l-3.833 3.659-1.917-1.83"
//                         className="strokePrimary-0-2-61 strokePrimary-d10-0-2-77"
//                         stroke-linecap="square"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M8.25 6.75V6a3.75 3.75 0 017.5 0v.75h-7.5z"
//                         className="strokePrimary-0-2-61 strokePrimary-d10-0-2-77"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="box-0-2-21 box-d8-0-2-81 button-0-2-54 button-d2-0-2-80">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-69 svg-d2-0-2-88 svg-0-2-57 svg-d12-0-2-82"
//                     >
//                       <path
//                         d="M11 19h9.5M11 6.714h9.5"
//                         className="strokePrimary-0-2-61 strokePrimary-d16-0-2-86"
//                         stroke-width="0.881"
//                         stroke-linecap="square"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M8 3.796L4.167 7.455 2.25 5.625"
//                         className="strokePrimary-0-2-61 strokePrimary-d16-0-2-86"
//                         stroke-linecap="square"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M11 12.714h9.5"
//                         className="strokePrimary-0-2-61 strokePrimary-d16-0-2-86"
//                         stroke-width="0.881"
//                         stroke-linecap="square"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M8 9.796l-3.833 3.659-1.917-1.83M8 16.796l-3.833 3.659-1.917-1.83"
//                         className="strokePrimary-0-2-61 strokePrimary-d16-0-2-86"
//                         stroke-linecap="square"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="box-0-2-21 box-d9-0-2-90 button-0-2-54 button-d3-0-2-89">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-69 svg-d3-0-2-97 svg-0-2-57 svg-d18-0-2-91"
//                     >
//                       <path
//                         d="M15 7.5l-7.81 7.94a1.5 1.5 0 102.12 2.121l9.31-9.44a3.002 3.002 0 00-.973-4.893 3 3 0 00-3.269.65l-9.31 9.44a4.5 4.5 0 106.364 6.364L19.125 12"
//                         className="strokePrimary-0-2-61 strokePrimary-d22-0-2-95"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container-0-2-98">
//         <div className="expandSection-0-2-100">
//           <div className="navLink-0-2-99">
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-label="Contract sidebar"
//               role="button"
//               style={{
//                 transition: 'transform 200ms ease 0s',
//                 transform: 'rotate(0deg)',
//               }}
//             >
//               <path
//                 d="M3.75 12H20.25"
//                 stroke="white"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//               ></path>
//               <path
//                 d="M13.5 5.25L20.25 12L13.5 18.75"
//                 stroke="white"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//               ></path>
//             </svg>
//           </div>
//         </div>
//         <div className="navigation-0-2-101">
//           <div className="top-0-2-102"></div>
//           <div className="bottom-0-2-103">
//             <div className="box-0-2-21 box-d10-0-2-108">
//               <a
//                 className="navLink-0-2-104 navLinkActive-0-2-105"
//                 href="/conversation"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   aria-label="Current conversation"
//                   role="button"
//                 >
//                   <path
//                     d="M7.59762 13.8127L3.88672 16.8127V4.81274C3.88672 4.61383 3.96574 4.42307 4.10639 4.28241C4.24704 4.14176 4.43781 4.06274 4.63672 4.06274H16.6367C16.8356 4.06274 17.0264 4.14176 17.167 4.28241C17.3077 4.42307 17.3867 4.61383 17.3867 4.81274V13.0627C17.3867 13.2617 17.3077 13.4524 17.167 13.5931C17.0264 13.7337 16.8356 13.8127 16.6367 13.8127H7.59762Z"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M8.38672 13.8127V17.5627C8.38672 17.7617 8.46574 17.9524 8.60639 18.0931C8.74704 18.2337 8.93781 18.3127 9.13672 18.3127H18.1758L21.8867 21.3127V9.31274C21.8867 9.11383 21.8077 8.92307 21.667 8.78241C21.5264 8.64176 21.3356 8.56274 21.1367 8.56274H17.3867"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                 </svg>
//               </a>
//             </div>
//             <div className="box-0-2-21 box-d11-0-2-109">
//               <a className="navLink-0-2-104" href="/user_activity">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   aria-label="Your activity"
//                   role="button"
//                 >
//                   <path
//                     d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M3.75 15H7.18934C7.28783 15 7.38536 15.0194 7.47635 15.0571C7.56735 15.0948 7.65003 15.15 7.71967 15.2197L9.53033 17.0303C9.59997 17.1 9.68265 17.1552 9.77365 17.1929C9.86464 17.2306 9.96217 17.25 10.0607 17.25H13.9393C14.0378 17.25 14.1354 17.2306 14.2264 17.1929C14.3173 17.1552 14.4 17.1 14.4697 17.0303L16.2803 15.2197C16.35 15.15 16.4327 15.0948 16.5236 15.0571C16.6146 15.0194 16.7122 15 16.8107 15H20.25"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                 </svg>
//               </a>
//             </div>
//             <div className="box-0-2-21 box-d12-0-2-110">
//               <a className="navLink-0-2-104" href="/team">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   aria-label="Team activity"
//                   role="button"
//                 >
//                   <path
//                     d="M8.75003 15.5C11.4424 15.5 13.625 13.3174 13.625 10.625C13.625 7.93261 11.4424 5.75 8.75003 5.75C6.05764 5.75 3.87503 7.93261 3.87503 10.625C3.87503 13.3174 6.05764 15.5 8.75003 15.5Z"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M15.0699 5.93161C15.7404 5.74269 16.4437 5.69966 17.1322 5.8054C17.8208 5.91114 18.4787 6.16321 19.0616 6.54462C19.6445 6.92604 20.1389 7.42795 20.5116 8.01654C20.8842 8.60513 21.1264 9.26673 21.2218 9.95679C21.3171 10.6469 21.2636 11.3493 21.0646 12.017C20.8656 12.6846 20.5259 13.3018 20.0683 13.827C19.6107 14.3523 19.0459 14.7734 18.4119 15.062C17.7778 15.3506 17.0893 15.4999 16.3927 15.5"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M1.99963 19.0059C2.76101 17.9229 3.77178 17.039 4.94662 16.4288C6.12145 15.8186 7.42586 15.5001 8.74971 15.5C10.0736 15.4999 11.378 15.8184 12.5529 16.4285C13.7278 17.0386 14.7386 17.9225 15.5001 19.0054"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M16.3927 15.5C17.7167 15.499 19.0214 15.8171 20.1964 16.4273C21.3713 17.0375 22.382 17.9218 23.1427 19.0054"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div className="popup-0-2-2 opacityZero-0-2-4">
//           <p className="text-0-2-5 text-d0-0-2-6"></p>
//           <div role="button" className="closeButtonContainer-0-2-1">
//             <svg
//               className="MuiSvgIcon-root icon-0-2-7 icon-d0-0-2-8"
//               focusable="false"
//               viewBox="0 0 24 24"
//               aria-hidden="true"
//               style={{width: '16px', height: '16px'}}
//             >
//               <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// const NewPage = () => {
//   return (
//     <div style={{width: '416px'}}>
//       <div
//         className="container-0-2-9 container-d0-0-2-10"
//         data-modal-container="true"
//       >
//         <div className="topBar-0-2-12">
//           <div
//             className="channelName-0-2-13"
//             title="Cord | Collaborate everywhere chat"
//           >
//             Cord | Collaborate everywhere chat
//           </div>
//           <div className="participants-0-2-14"></div>
//         </div>
//         <div className="threadPane-0-2-18">
//           <div className="container-0-2-104">
//             <div className="header-0-2-105">
//               <img
//                 src="https://app.cord.com/static/provider-icons/cord.png"
//                 className="profilePicture-0-2-106"
//               />
//               <p className="text-0-2-5 text-d1-0-2-109 author-0-2-108">Cord</p>
//               <svg
//                 className="MuiSvgIcon-root closeButton-0-2-110 closeButton-d0-0-2-111"
//                 focusable="false"
//                 viewBox="0 0 24 24"
//                 role="img"
//                 style={{padding: '8px', fontSize: '16px'}}
//               >
//                 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
//                 <title>Dismiss</title>
//               </svg>
//             </div>
//             <div className="body-0-2-107">
//               <p className="text-0-2-5 text-d2-0-2-112">
//                 Get on the same page as your team
//               </p>
//               <p className="text-0-2-5 text-d3-0-2-113">
//                 Join your teammates and chat live, or view when they've seen
//                 your messages by selecting the three dots beside anything you
//                 send
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="container-0-2-26">
//           <input
//             type="file"
//             accept="image/jpeg,image/png,application/pdf"
//             multiple=""
//             style={{display: 'none'}}
//           />
//           <div>
//             <div
//               className="box-0-2-36 box-d0-0-2-37 composer-0-2-28 withBorderTop-0-2-29"
//               style={{cursor: 'unset'}}
//             >
//               <div>
//                 <div className="box-0-2-36 box-d1-0-2-39">
//                   <div className="box-0-2-36 box-d2-0-2-40 editorScrollContainer-0-2-30">
//                     <div className="textareaWrap-0-2-41">
//                       <div style={{position: 'relative'}}>
//                         <div
//                           data-gramm="false"
//                           role="textbox"
//                           className="editor-0-2-42"
//                           data-slate-editor="true"
//                           data-slate-node="value"
//                           contentEditable="true"
//                           style={{
//                             outline: 'none',
//                             whiteSpace: 'pre-wrap',
//                             overflowWrap: 'break-word',
//                           }}
//                         >
//                           <p
//                             data-slate-node="element"
//                             style={{marginBottom: '8px'}}
//                           >
//                             <span data-slate-node="text">
//                               <span data-slate-leaf="true">
//                                 <span
//                                   data-slate-zero-width="n"
//                                   data-slate-length="0"
//                                 >
//                                   &#xFEFF;
//                                   <br />
//                                 </span>
//                               </span>
//                             </span>
//                           </p>
//                         </div>
//                         <span className="placeholder-0-2-43">
//                           Reply to thread
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="verticalSpacer-0-2-31"></div>
//                 </div>
//               </div>
//               <div className="composerMenuWrapper-0-2-32 autoHeight-0-2-34">
//                 <div className="box-0-2-36 box-d3-0-2-46 row-0-2-45">
//                   <div className="box-0-2-36 box-d4-0-2-49 button-0-2-47 button-d0-0-2-48">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-62 svg-d0-0-2-63 svg-0-2-50 svg-d0-0-2-56"
//                     >
//                       <path
//                         d="M21 10.205c0 4.532-1.969 5.256-9 11.795-7.031-6.667-9-7.263-9-11.795C3 5.674 7.03 2 12 2s9 3.674 9 8.205z"
//                         className="strokePrimary-0-2-54 strokePrimary-d4-0-2-60"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M12 12a2 2 0 100-4 2 2 0 000 4z"
//                         className="strokePrimary-0-2-54 strokePrimary-d4-0-2-60"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="box-0-2-36 box-d5-0-2-65 button-0-2-47 button-d1-0-2-64">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-62 svg-d1-0-2-72 svg-0-2-50 svg-d6-0-2-66"
//                     >
//                       <path
//                         d="M15 3.75h3.75a.75.75 0 01.75.75v15.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V4.5a.75.75 0 01.75-.75H9"
//                         className="strokePrimary-0-2-54 strokePrimary-d10-0-2-70"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M15 11.796l-3.833 3.659-1.917-1.83"
//                         className="strokePrimary-0-2-54 strokePrimary-d10-0-2-70"
//                         stroke-linecap="square"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M8.25 6.75V6a3.75 3.75 0 017.5 0v.75h-7.5z"
//                         className="strokePrimary-0-2-54 strokePrimary-d10-0-2-70"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="box-0-2-36 box-d6-0-2-74 button-0-2-47 button-d2-0-2-73">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-62 svg-d2-0-2-81 svg-0-2-50 svg-d12-0-2-75"
//                     >
//                       <path
//                         d="M11 19h9.5M11 6.714h9.5"
//                         className="strokePrimary-0-2-54 strokePrimary-d16-0-2-79"
//                         stroke-width="0.881"
//                         stroke-linecap="square"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M8 3.796L4.167 7.455 2.25 5.625"
//                         className="strokePrimary-0-2-54 strokePrimary-d16-0-2-79"
//                         stroke-linecap="square"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M11 12.714h9.5"
//                         className="strokePrimary-0-2-54 strokePrimary-d16-0-2-79"
//                         stroke-width="0.881"
//                         stroke-linecap="square"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                       <path
//                         d="M8 9.796l-3.833 3.659-1.917-1.83M8 16.796l-3.833 3.659-1.917-1.83"
//                         className="strokePrimary-0-2-54 strokePrimary-d16-0-2-79"
//                         stroke-linecap="square"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                   <div className="box-0-2-36 box-d7-0-2-83 button-0-2-47 button-d3-0-2-82">
//                     <svg
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="svg-0-2-62 svg-d3-0-2-90 svg-0-2-50 svg-d18-0-2-84"
//                     >
//                       <path
//                         d="M15 7.5l-7.81 7.94a1.5 1.5 0 102.12 2.121l9.31-9.44a3.002 3.002 0 00-.973-4.893 3 3 0 00-3.269.65l-9.31 9.44a4.5 4.5 0 106.364 6.364L19.125 12"
//                         className="strokePrimary-0-2-54 strokePrimary-d22-0-2-88"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                         vector-effect="non-scaling-stroke"
//                       ></path>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="container-0-2-91">
//         <div className="expandSection-0-2-93">
//           <div className="navLink-0-2-92">
//             <svg
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               xmlns="http://www.w3.org/2000/svg"
//               aria-label="Contract sidebar"
//               role="button"
//               style={{
//                 transition: 'transform 200ms ease 0s',
//                 transform: 'rotate(0deg)',
//               }}
//             >
//               <path
//                 d="M3.75 12H20.25"
//                 stroke="white"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//               ></path>
//               <path
//                 d="M13.5 5.25L20.25 12L13.5 18.75"
//                 stroke="white"
//                 stroke-width="1.5"
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//               ></path>
//             </svg>
//           </div>
//         </div>
//         <div className="navigation-0-2-94">
//           <div className="top-0-2-95"></div>
//           <div className="bottom-0-2-96">
//             <div className="box-0-2-36 box-d8-0-2-101">
//               <a
//                 className="navLink-0-2-97 navLinkActive-0-2-98"
//                 href="/conversation"
//               >
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   aria-label="Current conversation"
//                   role="button"
//                 >
//                   <path
//                     d="M7.59762 13.8127L3.88672 16.8127V4.81274C3.88672 4.61383 3.96574 4.42307 4.10639 4.28241C4.24704 4.14176 4.43781 4.06274 4.63672 4.06274H16.6367C16.8356 4.06274 17.0264 4.14176 17.167 4.28241C17.3077 4.42307 17.3867 4.61383 17.3867 4.81274V13.0627C17.3867 13.2617 17.3077 13.4524 17.167 13.5931C17.0264 13.7337 16.8356 13.8127 16.6367 13.8127H7.59762Z"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M8.38672 13.8127V17.5627C8.38672 17.7617 8.46574 17.9524 8.60639 18.0931C8.74704 18.2337 8.93781 18.3127 9.13672 18.3127H18.1758L21.8867 21.3127V9.31274C21.8867 9.11383 21.8077 8.92307 21.667 8.78241C21.5264 8.64176 21.3356 8.56274 21.1367 8.56274H17.3867"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                 </svg>
//               </a>
//             </div>
//             <div className="box-0-2-36 box-d9-0-2-102">
//               <a className="navLink-0-2-97" href="/user_activity">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   aria-label="Your activity"
//                   role="button"
//                 >
//                   <path
//                     d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M3.75 15H7.18934C7.28783 15 7.38536 15.0194 7.47635 15.0571C7.56735 15.0948 7.65003 15.15 7.71967 15.2197L9.53033 17.0303C9.59997 17.1 9.68265 17.1552 9.77365 17.1929C9.86464 17.2306 9.96217 17.25 10.0607 17.25H13.9393C14.0378 17.25 14.1354 17.2306 14.2264 17.1929C14.3173 17.1552 14.4 17.1 14.4697 17.0303L16.2803 15.2197C16.35 15.15 16.4327 15.0948 16.5236 15.0571C16.6146 15.0194 16.7122 15 16.8107 15H20.25"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                 </svg>
//               </a>
//             </div>
//             <div className="box-0-2-36 box-d10-0-2-103">
//               <a className="navLink-0-2-97" href="/team">
//                 <svg
//                   width="24"
//                   height="24"
//                   viewBox="0 0 24 24"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                   aria-label="Team activity"
//                   role="button"
//                 >
//                   <path
//                     d="M8.75003 15.5C11.4424 15.5 13.625 13.3174 13.625 10.625C13.625 7.93261 11.4424 5.75 8.75003 5.75C6.05764 5.75 3.87503 7.93261 3.87503 10.625C3.87503 13.3174 6.05764 15.5 8.75003 15.5Z"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M15.0699 5.93161C15.7404 5.74269 16.4437 5.69966 17.1322 5.8054C17.8208 5.91114 18.4787 6.16321 19.0616 6.54462C19.6445 6.92604 20.1389 7.42795 20.5116 8.01654C20.8842 8.60513 21.1264 9.26673 21.2218 9.95679C21.3171 10.6469 21.2636 11.3493 21.0646 12.017C20.8656 12.6846 20.5259 13.3018 20.0683 13.827C19.6107 14.3523 19.0459 14.7734 18.4119 15.062C17.7778 15.3506 17.0893 15.4999 16.3927 15.5"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M1.99963 19.0059C2.76101 17.9229 3.77178 17.039 4.94662 16.4288C6.12145 15.8186 7.42586 15.5001 8.74971 15.5C10.0736 15.4999 11.378 15.8184 12.5529 16.4285C13.7278 17.0386 14.7386 17.9225 15.5001 19.0054"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                   <path
//                     d="M16.3927 15.5C17.7167 15.499 19.0214 15.8171 20.1964 16.4273C21.3713 17.0375 22.382 17.9218 23.1427 19.0054"
//                     stroke="currentColor"
//                     stroke-width="1.5"
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                   ></path>
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div>
//         <div className="popup-0-2-2 opacityZero-0-2-4">
//           <p className="text-0-2-5 text-d0-0-2-6"></p>
//           <div role="button" className="closeButtonContainer-0-2-1">
//             <svg
//               className="MuiSvgIcon-root icon-0-2-7 icon-d0-0-2-8"
//               focusable="false"
//               viewBox="0 0 24 24"
//               aria-hidden="true"
//               style={{width: 16, height: 16}}
//             >
//               <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
//             </svg>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
//
// export default NewPage;

import React from 'react';
import Chat, {Bubble, useMessages} from '@chatui/core';
import '@chatui/core/dist/index.css';

const ConversationPage = () => {
  const {messages, appendMsg, setTyping} = useMessages([]);

  function handleSend(type: any, val: any) {
    if (type === 'text' && val.trim()) {
      appendMsg({
        type: 'text',
        content: {text: val},
        position: 'right',
      });

      setTyping(true);

      setTimeout(() => {
        appendMsg({
          type: 'text',
          content: {text: 'Bala bala'},
        });
      }, 1000);
    }
  }

  function renderMessageContent(msg: any) {
    const {content} = msg;
    return <Bubble content={content.text} />;
  }

  return (
    <Chat
      navbar={{title: 'You Chat! I Chat'}}
      messages={messages}
      renderMessageContent={renderMessageContent}
      onSend={handleSend}
    />
  );
};

export default ConversationPage;
