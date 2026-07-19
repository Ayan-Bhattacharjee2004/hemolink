// const nodemailer = require("nodemailer");
// const path = require("path");

// const sendEmail = async (to, name) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: `"HemoLink 🩸" <${process.env.EMAIL_USER}>`,
//     to,
//     subject: "Welcome to HemoLink 🩸",

//     attachments: [
//       {
//         filename: "logo.png",
//         path: path.join(__dirname, "../public/logo.png"),
//         cid: "hemolinklogo",
//       },
//     ],

//     html: `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8" />
//     </head>

//     <body style="
//       margin:0;
//       padding:0;
//       background:#f4f7fb;
//       font-family:Arial,sans-serif;
//     ">

//       <div style="
//         max-width:650px;
//         margin:40px auto;
//         background:#ffffff;
//         border-radius:20px;
//         overflow:hidden;
//         box-shadow:0 10px 30px rgba(0,0,0,0.08);
//       ">

//         <!-- Header -->
//         <div style="
//           background:linear-gradient(135deg,#ef4444,#9333ea);
//           padding:40px 20px;
//           text-align:center;
//         ">

//           <img
//             src="cid:hemolinklogo"
//             alt="HemoLink"
//             style="
//               width:220px;
//               height:auto;
//             "
//           />

//           <h1 style="
//             color:white;
//             margin-top:20px;
//             margin-bottom:0;
//           ">
//             Welcome to HemoLink 🩸
//           </h1>

//         </div>

//         <!-- Content -->
//         <div style="padding:40px">

//           <h2 style="margin-top:0;">
//             Hello ${name} 👋
//           </h2>

//           <p style="
//             color:#555;
//             line-height:1.8;
//             font-size:15px;
//           ">
//             Your account has been successfully created.
//           </p>

//           <p style="
//             color:#555;
//             line-height:1.8;
//             font-size:15px;
//           ">
//             Thank you for joining the HemoLink community.
//             Together we can connect donors and recipients
//             and help save lives.
//           </p>

//           <div style="
//             background:#fff5f5;
//             border-left:4px solid #ef4444;
//             padding:15px;
//             margin:25px 0;
//             border-radius:8px;
//           ">
//             ❤️ Every blood donation can save up to three lives.
//           </div>

//           <h3>What you can do now:</h3>

//           <ul style="
//             color:#555;
//             line-height:2;
//           ">
//             <li>Complete your profile</li>
//             <li>Find nearby donors</li>
//             <li>Create blood requests</li>
//             <li>Respond to emergency requests</li>
//           </ul>

//           <div style="
//             text-align:center;
//             margin-top:35px;
//           ">
//             <a
//               href="http://localhost:5173/login"
//               style="
//                 background:#ef4444;
//                 color:white;
//                 text-decoration:none;
//                 padding:14px 30px;
//                 border-radius:10px;
//                 display:inline-block;
//                 font-weight:bold;
//               "
//             >
//               Login to HemoLink
//             </a>
//           </div>

//         </div>

//         <!-- Footer -->
//         <div style="
//           background:#f8fafc;
//           padding:20px;
//           text-align:center;
//           color:#777;
//           font-size:13px;
//         ">
//           <p style="margin:0;">
//             HemoLink • Connecting Donors & Saving Lives ❤️
//           </p>
//         </div>

//       </div>

//     </body>
//     </html>
//     `,
//   });
// };

// module.exports = sendEmail;